-- ==============================================================================
-- PHASE 12I: RETURNS, REFUNDS, REPLACEMENTS & POST-DELIVERY RESOLUTION SCHEMA
-- Project: print-studio-production (vsbexmohwbhlyfinobnv)
-- Purpose: resolution_requests, resolution_request_items, resolution_evidence,
--          credit_ledger, atomic procedures, RLS, and indexes.
-- ==============================================================================

-- 1. Sequence for Resolution Request Numbers: RES-2026-000101
CREATE SEQUENCE IF NOT EXISTS public.resolution_request_seq START WITH 101;

CREATE OR REPLACE FUNCTION public.generate_resolution_request_number()
RETURNS TEXT AS $$
BEGIN
  RETURN 'RES-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-' || LPAD(NEXTVAL('public.resolution_request_seq')::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- 2. RESOLUTION REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.resolution_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_number TEXT UNIQUE NOT NULL DEFAULT public.generate_resolution_request_number(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES public.profiles(id),
  type TEXT NOT NULL CHECK (
    type IN ('refund', 'replacement', 'return_and_refund', 'store_credit', 'partial_refund')
  ),
  status TEXT NOT NULL DEFAULT 'submitted' CHECK (
    status IN (
      'submitted',
      'under_review',
      'evidence_required',
      'approved',
      'rejected',
      'return_required',
      'return_received',
      'replacement_in_progress',
      'refund_pending',
      'resolved',
      'closed',
      'cancelled'
    )
  ),
  reason_code TEXT NOT NULL CHECK (
    reason_code IN (
      'damaged',
      'defective',
      'printing_error',
      'color_quality_issue',
      'wrong_product',
      'wrong_quantity',
      'missing_item',
      'shipping_damage',
      'customer_changed_mind',
      'late_delivery',
      'other'
    )
  ),
  customer_description TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'normal' CHECK (
    priority IN ('normal', 'high', 'urgent')
  ),
  admin_notes TEXT,
  customer_decision_notes TEXT,
  decision_action TEXT,
  refund_amount_paise BIGINT DEFAULT 0,
  replacement_job_id UUID,
  requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES public.profiles(id),
  resolved_by UUID REFERENCES public.profiles(id),
  version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_resolution_requests_order_id ON public.resolution_requests(order_id);
CREATE INDEX IF NOT EXISTS idx_resolution_requests_customer_id ON public.resolution_requests(customer_id);
CREATE INDEX IF NOT EXISTS idx_resolution_requests_status ON public.resolution_requests(status);
CREATE INDEX IF NOT EXISTS idx_resolution_requests_reason_code ON public.resolution_requests(reason_code);
CREATE INDEX IF NOT EXISTS idx_resolution_requests_created_at ON public.resolution_requests(created_at DESC);

-- 3. RESOLUTION REQUEST ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.resolution_request_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resolution_request_id UUID NOT NULL REFERENCES public.resolution_requests(id) ON DELETE CASCADE,
  order_item_id UUID NOT NULL REFERENCES public.order_items(id) ON DELETE CASCADE,
  requested_quantity INTEGER NOT NULL CHECK (requested_quantity > 0),
  approved_quantity INTEGER NOT NULL DEFAULT 0 CHECK (approved_quantity >= 0),
  reason_code TEXT NOT NULL,
  decision TEXT DEFAULT 'pending' CHECK (
    decision IN ('pending', 'approved', 'rejected', 'partial')
  ),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_res_items_req_id ON public.resolution_request_items(resolution_request_id);
CREATE INDEX IF NOT EXISTS idx_res_items_order_item_id ON public.resolution_request_items(order_item_id);

-- 4. RESOLUTION EVIDENCE TABLE
CREATE TABLE IF NOT EXISTS public.resolution_evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resolution_request_id UUID NOT NULL REFERENCES public.resolution_requests(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  file_size_bytes BIGINT NOT NULL,
  checksum_sha256 TEXT,
  uploaded_by UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_res_evidence_req_id ON public.resolution_evidence(resolution_request_id);

-- 5. CREDIT LEDGER TABLE (Store Credit Balance & Audit)
CREATE TABLE IF NOT EXISTS public.credit_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (
    type IN ('credit_issued', 'credit_redeemed', 'credit_expired', 'credit_adjusted')
  ),
  amount_paise BIGINT NOT NULL,
  reference_type TEXT NOT NULL,
  reference_id TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES public.profiles(id)
);

CREATE INDEX IF NOT EXISTS idx_credit_ledger_customer_id ON public.credit_ledger(customer_id);
CREATE INDEX IF NOT EXISTS idx_credit_ledger_created_at ON public.credit_ledger(created_at DESC);

-- 6. ATOMIC STORED PROCEDURE: CREATE RESOLUTION REQUEST
CREATE OR REPLACE FUNCTION public.atomic_create_resolution_request(
  p_order_id UUID,
  p_customer_id UUID,
  p_type TEXT,
  p_reason_code TEXT,
  p_customer_description TEXT,
  p_items JSONB -- Array of { orderItemId: UUID, requestedQuantity: number, reasonCode: string }
)
RETURNS JSONB AS $$
DECLARE
  v_order RECORD;
  v_req_id UUID;
  v_req_number TEXT;
  v_item JSONB;
  v_order_item RECORD;
  v_now TIMESTAMPTZ := NOW();
BEGIN
  -- 1. Lock and verify order
  SELECT * INTO v_order FROM public.orders WHERE id = p_order_id FOR UPDATE;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Order not found.');
  END IF;

  -- 2. Verify caller ownership
  IF v_order.user_id != p_customer_id AND NOT public.is_admin() THEN
    RETURN jsonb_build_object('success', false, 'error', 'Access denied to target order.');
  END IF;

  -- 3. Check for active unclosed resolution request on this order
  IF EXISTS (
    SELECT 1 FROM public.resolution_requests
    WHERE order_id = p_order_id
      AND status NOT IN ('resolved', 'closed', 'cancelled', 'rejected')
  ) THEN
    RETURN jsonb_build_object('success', false, 'error', 'An active resolution request is already open for this order.');
  END IF;

  -- 4. Create resolution request
  v_req_number := public.generate_resolution_request_number();
  INSERT INTO public.resolution_requests (
    request_number,
    order_id,
    customer_id,
    type,
    status,
    reason_code,
    customer_description,
    priority,
    requested_at,
    created_at,
    updated_at
  ) VALUES (
    v_req_number,
    p_order_id,
    p_customer_id,
    p_type,
    'submitted',
    p_reason_code,
    p_customer_description,
    'normal',
    v_now,
    v_now,
    v_now
  ) RETURNING id INTO v_req_id;

  -- 5. Insert affected items
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items) LOOP
    SELECT * INTO v_order_item FROM public.order_items WHERE id = (v_item->>'orderItemId')::UUID;
    IF FOUND THEN
      INSERT INTO public.resolution_request_items (
        resolution_request_id,
        order_item_id,
        requested_quantity,
        approved_quantity,
        reason_code,
        decision
      ) VALUES (
        v_req_id,
        v_order_item.id,
        LEAST((v_item->>'requestedQuantity')::INTEGER, v_order_item.quantity),
        0,
        COALESCE(v_item->>'reasonCode', p_reason_code),
        'pending'
      );
    END IF;
  END LOOP;

  -- 6. Insert timeline audit event into order_events
  INSERT INTO public.order_events (
    order_id,
    status,
    title,
    description,
    created_at,
    created_by
  ) VALUES (
    p_order_id,
    v_order.status,
    'Post-Delivery Resolution Requested (' || v_req_number || ')',
    'Customer reported issue: ' || p_reason_code || ' (' || p_type || '). Under studio team review.',
    v_now,
    p_customer_id
  );

  RETURN jsonb_build_object(
    'success', true,
    'resolutionId', v_req_id,
    'requestNumber', v_req_number
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 7. ATOMIC STORED PROCEDURE: DECIDE RESOLUTION REQUEST
CREATE OR REPLACE FUNCTION public.atomic_decide_resolution(
  p_resolution_id UUID,
  p_reviewer_id UUID,
  p_target_status TEXT,
  p_decision_action TEXT,
  p_admin_notes TEXT,
  p_customer_notes TEXT,
  p_refund_amount_paise BIGINT DEFAULT 0,
  p_expected_version INTEGER DEFAULT 1
)
RETURNS JSONB AS $$
DECLARE
  v_req RECORD;
  v_now TIMESTAMPTZ := NOW();
BEGIN
  -- 1. Lock resolution request with optimistic concurrency check
  SELECT * INTO v_req FROM public.resolution_requests WHERE id = p_resolution_id FOR UPDATE;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Resolution request not found.');
  END IF;

  IF v_req.version != p_expected_version THEN
    RETURN jsonb_build_object('success', false, 'error', 'Stale resolution record. Another administrator has updated this ticket. Please refresh.');
  END IF;

  -- 2. Update resolution request
  UPDATE public.resolution_requests
  SET status = p_target_status,
      decision_action = p_decision_action,
      admin_notes = p_admin_notes,
      customer_decision_notes = p_customer_notes,
      refund_amount_paise = p_refund_amount_paise,
      reviewed_at = COALESCE(reviewed_at, v_now),
      reviewed_by = COALESCE(reviewed_by, p_reviewer_id),
      resolved_at = CASE WHEN p_target_status IN ('resolved', 'closed', 'rejected') THEN v_now ELSE resolved_at END,
      resolved_by = CASE WHEN p_target_status IN ('resolved', 'closed', 'rejected') THEN p_reviewer_id ELSE resolved_by END,
      version = version + 1,
      updated_at = v_now
  WHERE id = p_resolution_id;

  -- 3. Update all pending resolution items to match decision
  IF p_target_status = 'approved' OR p_decision_action = 'replacement' OR p_decision_action = 'refund' THEN
    UPDATE public.resolution_request_items
    SET decision = 'approved',
        approved_quantity = requested_quantity
    WHERE resolution_request_id = p_resolution_id;
  ELSIF p_target_status = 'rejected' THEN
    UPDATE public.resolution_request_items
    SET decision = 'rejected',
        approved_quantity = 0
    WHERE resolution_request_id = p_resolution_id;
  END IF;

  RETURN jsonb_build_object('success', true, 'resolutionId', p_resolution_id, 'newStatus', p_target_status);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 8. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.resolution_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resolution_request_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resolution_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_ledger ENABLE ROW LEVEL SECURITY;

-- Customers: View own resolution requests
DROP POLICY IF EXISTS "Customers view own resolution requests" ON public.resolution_requests;
CREATE POLICY "Customers view own resolution requests"
ON public.resolution_requests FOR SELECT
TO authenticated
USING (customer_id = auth.uid() OR public.is_admin());

-- Customers: Insert own resolution requests
DROP POLICY IF EXISTS "Customers create own resolution requests" ON public.resolution_requests;
CREATE POLICY "Customers create own resolution requests"
ON public.resolution_requests FOR INSERT
TO authenticated
WITH CHECK (customer_id = auth.uid() OR public.is_admin());

-- Items RLS
DROP POLICY IF EXISTS "Customers view own resolution items" ON public.resolution_request_items;
CREATE POLICY "Customers view own resolution items"
ON public.resolution_request_items FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.resolution_requests rr
    WHERE rr.id = resolution_request_items.resolution_request_id
      AND (rr.customer_id = auth.uid() OR public.is_admin())
  )
);

-- Evidence RLS
DROP POLICY IF EXISTS "Customers view own evidence" ON public.resolution_evidence;
CREATE POLICY "Customers view own evidence"
ON public.resolution_evidence FOR SELECT
TO authenticated
USING (
  uploaded_by = auth.uid() OR public.is_admin()
);

DROP POLICY IF EXISTS "Customers upload own evidence" ON public.resolution_evidence;
CREATE POLICY "Customers upload own evidence"
ON public.resolution_evidence FOR INSERT
TO authenticated
WITH CHECK (uploaded_by = auth.uid() OR public.is_admin());

-- Credit Ledger RLS
DROP POLICY IF EXISTS "Customers view own credit ledger" ON public.credit_ledger;
CREATE POLICY "Customers view own credit ledger"
ON public.credit_ledger FOR SELECT
TO authenticated
USING (customer_id = auth.uid() OR public.is_admin());

-- Staff: Full Management
DROP POLICY IF EXISTS "Staff manage all resolution requests" ON public.resolution_requests;
CREATE POLICY "Staff manage all resolution requests"
ON public.resolution_requests FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Staff manage all resolution items" ON public.resolution_request_items;
CREATE POLICY "Staff manage all resolution items"
ON public.resolution_request_items FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Staff manage all resolution evidence" ON public.resolution_evidence;
CREATE POLICY "Staff manage all resolution evidence"
ON public.resolution_evidence FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Staff manage all credit ledger" ON public.credit_ledger;
CREATE POLICY "Staff manage all credit ledger"
ON public.credit_ledger FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());
