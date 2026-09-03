-- ==============================================================================
-- PHASE 12F: PRODUCTION ARTWORK UPLOAD, PREFLIGHT & PROOFING WORKFLOW SCHEMA
-- Project: print-studio-production (vsbexmohwbhlyfinobnv)
-- Purpose: artwork_assets, artwork_versions, artwork_proofs, artwork_upload_sessions,
--          artwork_events, atomic RPC transitions, RLS policies, and indexes.
-- ==============================================================================

-- 1. ARTWORK ASSETS TABLE (Logical slot associated with an order item)
CREATE TABLE IF NOT EXISTS public.artwork_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  order_item_id UUID NOT NULL REFERENCES public.order_items(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  slot TEXT NOT NULL DEFAULT 'front', -- 'front', 'back', 'inside', 'cover', etc.
  status TEXT NOT NULL DEFAULT 'awaiting_upload' CHECK (
    status IN (
      'awaiting_upload',
      'processing',
      'preflight_failed',
      'preflight_warning',
      'proof_pending',
      'changes_requested',
      'approved',
      'rejected',
      'archived'
    )
  ),
  current_version_id UUID, -- Forward reference updated when versions are created
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (order_item_id, slot)
);

CREATE INDEX IF NOT EXISTS idx_artwork_assets_order_id ON public.artwork_assets(order_id);
CREATE INDEX IF NOT EXISTS idx_artwork_assets_order_item_id ON public.artwork_assets(order_item_id);
CREATE INDEX IF NOT EXISTS idx_artwork_assets_customer_id ON public.artwork_assets(customer_id);
CREATE INDEX IF NOT EXISTS idx_artwork_assets_status ON public.artwork_assets(status);

-- 2. ARTWORK VERSIONS TABLE (Immutable revision history)
CREATE TABLE IF NOT EXISTS public.artwork_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID NOT NULL REFERENCES public.artwork_assets(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL DEFAULT 1,
  storage_path TEXT NOT NULL,
  bucket TEXT NOT NULL DEFAULT 'artwork',
  original_filename TEXT NOT NULL,
  file_size_bytes BIGINT NOT NULL CHECK (file_size_bytes > 0),
  mime_type TEXT NOT NULL,
  file_extension TEXT NOT NULL,
  checksum_sha256 TEXT NOT NULL,
  dimensions JSONB DEFAULT '{"width": 0, "height": 0, "unit": "inch"}'::jsonb,
  pixel_width INTEGER,
  pixel_height INTEGER,
  effective_dpi NUMERIC(8, 2),
  color_space TEXT DEFAULT 'RGB',
  page_count INTEGER DEFAULT 1,
  has_transparency BOOLEAN DEFAULT false,
  has_bleed BOOLEAN DEFAULT false,
  preflight_status TEXT NOT NULL DEFAULT 'passed' CHECK (
    preflight_status IN ('passed', 'warning', 'failed')
  ),
  preflight_results JSONB NOT NULL DEFAULT '[]'::jsonb,
  uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (asset_id, version_number)
);

CREATE INDEX IF NOT EXISTS idx_artwork_versions_asset_id ON public.artwork_versions(asset_id);
CREATE INDEX IF NOT EXISTS idx_artwork_versions_checksum ON public.artwork_versions(checksum_sha256);

-- Now add foreign key from artwork_assets to current_version_id
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_artwork_assets_current_version'
  ) THEN
    ALTER TABLE public.artwork_assets
      ADD CONSTRAINT fk_artwork_assets_current_version
      FOREIGN KEY (current_version_id) REFERENCES public.artwork_versions(id)
      ON DELETE SET NULL;
  END IF;
END $$;

-- 3. ARTWORK PROOFS TABLE (Pre-press visual proof & approval record)
CREATE TABLE IF NOT EXISTS public.artwork_proofs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  version_id UUID NOT NULL REFERENCES public.artwork_versions(id) ON DELETE CASCADE,
  proof_number INTEGER NOT NULL DEFAULT 1,
  preview_storage_path TEXT NOT NULL,
  watermark_applied BOOLEAN NOT NULL DEFAULT true,
  status TEXT NOT NULL DEFAULT 'ready' CHECK (
    status IN ('draft', 'ready', 'approved', 'changes_requested', 'superseded')
  ),
  customer_notes TEXT,
  approval_record JSONB, -- { approvedBy, approvedAt, consentText, ipAddress, userAgent }
  revision_request JSONB, -- { requestedBy, requestedAt, reason, comments, category }
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (version_id, proof_number)
);

CREATE INDEX IF NOT EXISTS idx_artwork_proofs_version_id ON public.artwork_proofs(version_id);
CREATE INDEX IF NOT EXISTS idx_artwork_proofs_status ON public.artwork_proofs(status);

-- 4. ARTWORK UPLOAD SESSIONS TABLE (Controlled, expiring upload sessions)
CREATE TABLE IF NOT EXISTS public.artwork_upload_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  order_item_id UUID REFERENCES public.order_items(id) ON DELETE CASCADE,
  slot TEXT NOT NULL DEFAULT 'front',
  expected_filename TEXT NOT NULL,
  expected_mime TEXT NOT NULL,
  expected_size_bytes BIGINT NOT NULL,
  storage_path TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'initialized' CHECK (
    status IN ('initialized', 'uploading', 'uploaded', 'verified', 'expired', 'failed')
  ),
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_upload_sessions_user ON public.artwork_upload_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_upload_sessions_order ON public.artwork_upload_sessions(order_id);
CREATE INDEX IF NOT EXISTS idx_upload_sessions_status ON public.artwork_upload_sessions(status);

-- 5. ARTWORK EVENTS TABLE (Immutable Audit Trail)
CREATE TABLE IF NOT EXISTS public.artwork_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID REFERENCES public.artwork_assets(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  actor_type TEXT NOT NULL CHECK (actor_type IN ('customer', 'admin', 'system')),
  actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  summary TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_artwork_events_asset_id ON public.artwork_events(asset_id);
CREATE INDEX IF NOT EXISTS idx_artwork_events_order_id ON public.artwork_events(order_id);
CREATE INDEX IF NOT EXISTS idx_artwork_events_created_at ON public.artwork_events(created_at DESC);

-- 6. ATOMIC STORED PROCEDURE: APPROVE ARTWORK PROOF
CREATE OR REPLACE FUNCTION public.atomic_approve_artwork_proof(
  p_proof_id UUID,
  p_customer_id UUID,
  p_consent_text TEXT,
  p_ip_address TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_proof RECORD;
  v_version RECORD;
  v_asset RECORD;
  v_order RECORD;
  v_unapproved_count INTEGER;
  v_now TIMESTAMPTZ := NOW();
  v_approval_data JSONB;
BEGIN
  -- 1. Fetch and lock proof row
  SELECT * INTO v_proof FROM public.artwork_proofs
  WHERE id = p_proof_id FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Proof not found');
  END IF;

  IF v_proof.status = 'approved' THEN
    RETURN jsonb_build_object('success', true, 'message', 'Proof already approved');
  END IF;

  IF v_proof.status != 'ready' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Proof is not in a reviewable state');
  END IF;

  -- 2. Fetch version and asset
  SELECT * INTO v_version FROM public.artwork_versions WHERE id = v_proof.version_id;
  SELECT * INTO v_asset FROM public.artwork_assets WHERE id = v_version.asset_id;
  SELECT * INTO v_order FROM public.orders WHERE id = v_asset.order_id FOR UPDATE;

  -- 3. Verify customer authorization
  IF v_order.user_id != p_customer_id AND NOT public.is_admin() THEN
    RETURN jsonb_build_object('success', false, 'error', 'Unauthorized to approve this proof');
  END IF;

  -- 4. Verify order lifecycle state allows approval
  IF v_order.status IN ('cancelled', 'delivered', 'shipped') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Order state does not permit proof approval');
  END IF;

  -- 5. Mark proof as approved
  v_approval_data := jsonb_build_object(
    'approvedBy', p_customer_id,
    'approvedAt', v_now,
    'consentText', p_consent_text,
    'ipAddress', p_ip_address,
    'userAgent', p_user_agent
  );

  UPDATE public.artwork_proofs
  SET status = 'approved',
      approval_record = v_approval_data,
      updated_at = v_now
  WHERE id = p_proof_id;

  -- 6. Mark asset as approved
  UPDATE public.artwork_assets
  SET status = 'approved',
      updated_at = v_now
  WHERE id = v_asset.id;

  -- 7. Log artwork event
  INSERT INTO public.artwork_events (
    asset_id, order_id, event_type, actor_type, actor_id, summary, metadata
  ) VALUES (
    v_asset.id,
    v_order.id,
    'PROOF_APPROVED',
    'customer',
    p_customer_id,
    'Digital proof approved by customer for production press run',
    v_approval_data
  );

  -- 8. Check if all artwork assets for this order are now approved
  SELECT COUNT(*) INTO v_unapproved_count
  FROM public.artwork_assets
  WHERE order_id = v_order.id
    AND status != 'approved';

  -- If all artwork assets are approved and order is currently in review/pending proof, transition order
  IF v_unapproved_count = 0 AND v_order.status IN ('confirmed', 'artwork_review', 'proof_pending') THEN
    UPDATE public.orders
    SET status = 'proof_approved',
        updated_at = v_now
    WHERE id = v_order.id;

    -- Add order event
    INSERT INTO public.order_events (
      order_id, status, title, description, created_at
    ) VALUES (
      v_order.id,
      'proof_approved',
      'All Proofs Approved',
      'Customer has approved all digital proofs. Order unlocked for production scheduling.',
      v_now
    );
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'proofId', p_proof_id,
    'assetId', v_asset.id,
    'orderStatus', CASE WHEN v_unapproved_count = 0 THEN 'proof_approved' ELSE v_order.status END,
    'allApproved', (v_unapproved_count = 0)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 7. ATOMIC STORED PROCEDURE: REQUEST ARTWORK CHANGES / REVISION
CREATE OR REPLACE FUNCTION public.atomic_request_artwork_changes(
  p_proof_id UUID,
  p_customer_id UUID,
  p_category TEXT,
  p_comments TEXT
)
RETURNS JSONB AS $$
DECLARE
  v_proof RECORD;
  v_version RECORD;
  v_asset RECORD;
  v_order RECORD;
  v_now TIMESTAMPTZ := NOW();
  v_revision_data JSONB;
BEGIN
  SELECT * INTO v_proof FROM public.artwork_proofs
  WHERE id = p_proof_id FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Proof not found');
  END IF;

  SELECT * INTO v_version FROM public.artwork_versions WHERE id = v_proof.version_id;
  SELECT * INTO v_asset FROM public.artwork_assets WHERE id = v_version.asset_id;
  SELECT * INTO v_order FROM public.orders WHERE id = v_asset.order_id FOR UPDATE;

  IF v_order.user_id != p_customer_id AND NOT public.is_admin() THEN
    RETURN jsonb_build_object('success', false, 'error', 'Unauthorized');
  END IF;

  v_revision_data := jsonb_build_object(
    'requestedBy', p_customer_id,
    'requestedAt', v_now,
    'category', p_category,
    'comments', p_comments
  );

  -- Mark proof and asset
  UPDATE public.artwork_proofs
  SET status = 'changes_requested',
      revision_request = v_revision_data,
      updated_at = v_now
  WHERE id = p_proof_id;

  UPDATE public.artwork_assets
  SET status = 'changes_requested',
      updated_at = v_now
  WHERE id = v_asset.id;

  -- Revert order status to artwork_review if it was in proof_pending
  IF v_order.status = 'proof_pending' THEN
    UPDATE public.orders
    SET status = 'artwork_review',
        updated_at = v_now
    WHERE id = v_order.id;

    INSERT INTO public.order_events (
      order_id, status, title, description, created_at
    ) VALUES (
      v_order.id,
      'artwork_review',
      'Proof Changes Requested',
      'Customer requested artwork revisions: ' || p_category,
      v_now
    );
  END IF;

  -- Log artwork event
  INSERT INTO public.artwork_events (
    asset_id, order_id, event_type, actor_type, actor_id, summary, metadata
  ) VALUES (
    v_asset.id,
    v_order.id,
    'CHANGES_REQUESTED',
    'customer',
    p_customer_id,
    'Customer requested revision on proof: ' || p_comments,
    v_revision_data
  );

  RETURN jsonb_build_object('success', true, 'proofId', p_proof_id, 'assetId', v_asset.id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 8. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.artwork_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artwork_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artwork_proofs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artwork_upload_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artwork_events ENABLE ROW LEVEL SECURITY;

-- Customers can view their own artwork assets
DROP POLICY IF EXISTS "Customers view own artwork assets" ON public.artwork_assets;
CREATE POLICY "Customers view own artwork assets"
ON public.artwork_assets FOR SELECT
TO authenticated
USING (
  customer_id = auth.uid()
  OR EXISTS (SELECT 1 FROM public.orders o WHERE o.id = artwork_assets.order_id AND o.user_id = auth.uid())
  OR public.is_admin()
);

-- Customers can view versions of their own assets
DROP POLICY IF EXISTS "Customers view own artwork versions" ON public.artwork_versions;
CREATE POLICY "Customers view own artwork versions"
ON public.artwork_versions FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.artwork_assets a
    JOIN public.orders o ON o.id = a.order_id
    WHERE a.id = artwork_versions.asset_id
      AND (a.customer_id = auth.uid() OR o.user_id = auth.uid() OR public.is_admin())
  )
);

-- Customers can view proofs for their own assets
DROP POLICY IF EXISTS "Customers view own artwork proofs" ON public.artwork_proofs;
CREATE POLICY "Customers view own artwork proofs"
ON public.artwork_proofs FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.artwork_versions v
    JOIN public.artwork_assets a ON a.id = v.asset_id
    JOIN public.orders o ON o.id = a.order_id
    WHERE v.id = artwork_proofs.version_id
      AND (a.customer_id = auth.uid() OR o.user_id = auth.uid() OR public.is_admin())
  )
);

-- Customers can view artwork events for their orders
DROP POLICY IF EXISTS "Customers view own artwork events" ON public.artwork_events;
CREATE POLICY "Customers view own artwork events"
ON public.artwork_events FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.id = artwork_events.order_id
      AND (o.user_id = auth.uid() OR public.is_admin())
  )
);

-- Admin Full Management
DROP POLICY IF EXISTS "Admins full manage artwork assets" ON public.artwork_assets;
CREATE POLICY "Admins full manage artwork assets"
ON public.artwork_assets FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins full manage artwork versions" ON public.artwork_versions;
CREATE POLICY "Admins full manage artwork versions"
ON public.artwork_versions FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins full manage artwork proofs" ON public.artwork_proofs;
CREATE POLICY "Admins full manage artwork proofs"
ON public.artwork_proofs FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins full manage artwork upload sessions" ON public.artwork_upload_sessions;
CREATE POLICY "Admins full manage artwork upload sessions"
ON public.artwork_upload_sessions FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());
