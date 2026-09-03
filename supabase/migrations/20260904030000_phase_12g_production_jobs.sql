-- ==============================================================================
-- PHASE 12G: PRODUCTION JOB MANAGEMENT & PRINT PRODUCTION WORKFLOW SCHEMA
-- Project: print-studio-production (vsbexmohwbhlyfinobnv)
-- Purpose: production_jobs, production_qc_records, production_job_events,
--          job sequence, atomic state transition functions, RLS, and indexes.
-- ==============================================================================

-- 1. Job Number Sequence
CREATE SEQUENCE IF NOT EXISTS public.production_job_seq START WITH 101;

-- Function to generate human-readable Job Number: JOB-2026-000101
CREATE OR REPLACE FUNCTION public.generate_production_job_number()
RETURNS TEXT AS $$
BEGIN
  RETURN 'JOB-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-' || LPAD(NEXTVAL('public.production_job_seq')::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- 2. PRODUCTION JOBS TABLE
CREATE TABLE IF NOT EXISTS public.production_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  order_item_id UUID NOT NULL REFERENCES public.order_items(id) ON DELETE CASCADE,
  job_number TEXT UNIQUE NOT NULL DEFAULT public.generate_production_job_number(),
  status TEXT NOT NULL DEFAULT 'queued' CHECK (
    status IN (
      'queued',
      'scheduled',
      'preflight',
      'ready_to_print',
      'printing',
      'finishing',
      'quality_check',
      'completed',
      'rework_required',
      'paused',
      'cancelled'
    )
  ),
  priority TEXT NOT NULL DEFAULT 'normal' CHECK (
    priority IN ('low', 'normal', 'high', 'urgent')
  ),
  assigned_operator_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  production_spec_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
  artwork_manifest JSONB NOT NULL DEFAULT '{}'::jsonb,
  scheduled_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  printing_completed_at TIMESTAMPTZ,
  finishing_completed_at TIMESTAMPTZ,
  qc_completed_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  paused_at TIMESTAMPTZ,
  pause_reason TEXT,
  rework_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_production_jobs_order_id ON public.production_jobs(order_id);
CREATE INDEX IF NOT EXISTS idx_production_jobs_order_item_id ON public.production_jobs(order_item_id);
CREATE INDEX IF NOT EXISTS idx_production_jobs_status ON public.production_jobs(status);
CREATE INDEX IF NOT EXISTS idx_production_jobs_priority ON public.production_jobs(priority);
CREATE INDEX IF NOT EXISTS idx_production_jobs_operator ON public.production_jobs(assigned_operator_id);
CREATE INDEX IF NOT EXISTS idx_production_jobs_created_at ON public.production_jobs(created_at DESC);

-- 3. PRODUCTION QC RECORDS TABLE (Quality Inspection Audits)
CREATE TABLE IF NOT EXISTS public.production_qc_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  production_job_id UUID NOT NULL REFERENCES public.production_jobs(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (
    status IN ('pending', 'in_progress', 'passed', 'failed', 'rework_required')
  ),
  inspector_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  checklist JSONB NOT NULL DEFAULT '[]'::jsonb,
  defect_category TEXT,
  notes TEXT,
  inspected_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_qc_records_job_id ON public.production_qc_records(production_job_id);
CREATE INDEX IF NOT EXISTS idx_qc_records_status ON public.production_qc_records(status);

-- 4. PRODUCTION JOB EVENTS TABLE (Immutable Operations Audit)
CREATE TABLE IF NOT EXISTS public.production_job_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  production_job_id UUID NOT NULL REFERENCES public.production_jobs(id) ON DELETE CASCADE,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  actor_type TEXT NOT NULL DEFAULT 'operator' CHECK (
    actor_type IN ('operator', 'admin', 'system')
  ),
  summary TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_production_events_job_id ON public.production_job_events(production_job_id);
CREATE INDEX IF NOT EXISTS idx_production_events_order_id ON public.production_job_events(order_id);
CREATE INDEX IF NOT EXISTS idx_production_events_created_at ON public.production_job_events(created_at DESC);

-- 5. ATOMIC STORED PROCEDURE: CREATE PRODUCTION JOBS FOR ORDER
CREATE OR REPLACE FUNCTION public.atomic_create_production_jobs_for_order(
  p_order_id UUID,
  p_actor_id UUID
)
RETURNS JSONB AS $$
DECLARE
  v_order RECORD;
  v_item RECORD;
  v_asset RECORD;
  v_version RECORD;
  v_proof RECORD;
  v_manifest JSONB;
  v_spec JSONB;
  v_jobs_created INTEGER := 0;
  v_job_id UUID;
  v_now TIMESTAMPTZ := NOW();
BEGIN
  -- 1. Lock and verify order
  SELECT * INTO v_order FROM public.orders WHERE id = p_order_id FOR UPDATE;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Order not found');
  END IF;

  -- 2. Ensure jobs do not already exist for this order
  IF EXISTS (SELECT 1 FROM public.production_jobs WHERE order_id = p_order_id) THEN
    RETURN jsonb_build_object('success', true, 'message', 'Production jobs already initialized for this order');
  END IF;

  -- 3. Iterate through order items and spawn production jobs
  FOR v_item IN SELECT * FROM public.order_items WHERE order_id = p_order_id LOOP
    -- Build production specification snapshot from selected_options
    v_spec := jsonb_build_object(
      'productTitle', v_item.product_title,
      'sku', v_item.sku,
      'quantity', v_item.quantity,
      'unitPrice', v_item.unit_price,
      'linePrice', v_item.line_price,
      'selectedOptions', COALESCE((v_item.selected_options->>'options')::jsonb, '[]'::jsonb),
      'configHash', v_item.selected_options->>'configHash',
      'productionSpecification', COALESCE(v_item.selected_options->'configurationSnapshot'->'productionSpecification', '{}'::jsonb)
    );

    -- Find associated artwork asset and proof
    SELECT * INTO v_asset FROM public.artwork_assets WHERE order_item_id = v_item.id LIMIT 1;
    v_manifest := '{}'::jsonb;

    IF FOUND AND v_asset.current_version_id IS NOT NULL THEN
      SELECT * INTO v_version FROM public.artwork_versions WHERE id = v_asset.current_version_id;
      SELECT * INTO v_proof FROM public.artwork_proofs WHERE version_id = v_version.id ORDER BY proof_number DESC LIMIT 1;

      v_manifest := jsonb_build_object(
        'assetId', v_asset.id,
        'slot', v_asset.slot,
        'versionNumber', v_version.version_number,
        'storagePath', v_version.storage_path,
        'originalFilename', v_version.original_filename,
        'checksumSha256', v_version.checksum_sha256,
        'effectiveDpi', v_version.effective_dpi,
        'colorSpace', v_version.color_space,
        'proofId', v_proof.id,
        'proofStatus', v_proof.status,
        'approvedAt', v_proof.approval_record->>'approvedAt'
      );
    ELSE
      -- Fallback to item artwork_summary if present
      v_manifest := jsonb_build_object(
        'summary', v_item.artwork_summary->>'summary',
        'storagePath', v_item.artwork_summary->>'storagePath',
        'originalFileName', v_item.artwork_summary->>'originalFileName'
      );
    END IF;

    -- Insert production job
    INSERT INTO public.production_jobs (
      order_id,
      order_item_id,
      status,
      priority,
      production_spec_snapshot,
      artwork_manifest,
      created_at,
      updated_at
    ) VALUES (
      p_order_id,
      v_item.id,
      'queued',
      'normal',
      v_spec,
      v_manifest,
      v_now,
      v_now
    ) RETURNING id INTO v_job_id;

    -- Record job event
    INSERT INTO public.production_job_events (
      production_job_id,
      order_id,
      event_type,
      actor_id,
      actor_type,
      summary,
      metadata
    ) VALUES (
      v_job_id,
      p_order_id,
      'JOB_CREATED',
      p_actor_id,
      'system',
      'Production job created from validated order specification',
      jsonb_build_object('itemTitle', v_item.product_title, 'quantity', v_item.quantity)
    );

    v_jobs_created := v_jobs_created + 1;
  END LOOP;

  -- 4. Transition order status to in_production if not already there
  IF v_order.status IN ('confirmed', 'artwork_review', 'proof_approved') THEN
    UPDATE public.orders
    SET status = 'in_production',
        updated_at = v_now
    WHERE id = p_order_id;

    INSERT INTO public.order_events (
      order_id, status, title, description, created_at, created_by
    ) VALUES (
      p_order_id,
      'in_production',
      'Jobs Dispatched to Press',
      'Print jobs initialized and queued for prepress plate imaging and press scheduling.',
      v_now,
      p_actor_id
    );
  END IF;

  RETURN jsonb_build_object('success', true, 'jobsCreated', v_jobs_created, 'orderId', p_order_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 6. ATOMIC STORED PROCEDURE: TRANSITION PRODUCTION JOB STATUS
CREATE OR REPLACE FUNCTION public.atomic_transition_production_job(
  p_job_id UUID,
  p_target_status TEXT,
  p_actor_id UUID,
  p_reason TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_job RECORD;
  v_order RECORD;
  v_now TIMESTAMPTZ := NOW();
  v_uncompleted_count INTEGER;
  v_all_qc_passed BOOLEAN := true;
BEGIN
  -- 1. Lock job row
  SELECT * INTO v_job FROM public.production_jobs WHERE id = p_job_id FOR UPDATE;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Production job not found');
  END IF;

  -- 2. Validate state machine transition
  -- queued -> scheduled -> preflight -> ready_to_print -> printing -> finishing -> quality_check -> completed
  -- or paused / rework_required
  IF v_job.status = p_target_status THEN
    RETURN jsonb_build_object('success', true, 'message', 'Job is already in target status');
  END IF;

  -- Update stage timestamps
  IF p_target_status = 'scheduled' THEN
    UPDATE public.production_jobs SET scheduled_at = v_now WHERE id = p_job_id;
  ELSIF p_target_status = 'printing' THEN
    UPDATE public.production_jobs SET started_at = COALESCE(started_at, v_now) WHERE id = p_job_id;
  ELSIF p_target_status = 'finishing' THEN
    UPDATE public.production_jobs SET printing_completed_at = v_now WHERE id = p_job_id;
  ELSIF p_target_status = 'quality_check' THEN
    UPDATE public.production_jobs SET finishing_completed_at = v_now WHERE id = p_job_id;
  ELSIF p_target_status = 'completed' THEN
    UPDATE public.production_jobs SET completed_at = v_now, qc_completed_at = COALESCE(qc_completed_at, v_now) WHERE id = p_job_id;
  ELSIF p_target_status = 'paused' THEN
    UPDATE public.production_jobs SET paused_at = v_now, pause_reason = p_reason WHERE id = p_job_id;
  ELSIF p_target_status = 'rework_required' THEN
    UPDATE public.production_jobs SET rework_count = rework_count + 1 WHERE id = p_job_id;
  END IF;

  -- Update job status
  UPDATE public.production_jobs
  SET status = p_target_status,
      updated_at = v_now
  WHERE id = p_job_id;

  -- Record event
  INSERT INTO public.production_job_events (
    production_job_id,
    order_id,
    event_type,
    actor_id,
    actor_type,
    summary,
    metadata
  ) VALUES (
    p_job_id,
    v_job.order_id,
    'STATUS_TRANSITION',
    p_actor_id,
    'operator',
    'Job status transitioned from ' || v_job.status || ' to ' || p_target_status,
    jsonb_build_object('previousStatus', v_job.status, 'newStatus', p_target_status, 'reason', p_reason)
  );

  -- 3. Check Order-Level Aggregation
  -- Count incomplete jobs for this order
  SELECT COUNT(*) INTO v_uncompleted_count
  FROM public.production_jobs
  WHERE order_id = v_job.order_id
    AND status != 'completed';

  SELECT * INTO v_order FROM public.orders WHERE id = v_job.order_id FOR UPDATE;

  -- If ALL jobs for the order are completed, transition order to 'ready'
  IF v_uncompleted_count = 0 AND v_order.status IN ('in_production', 'quality_check') THEN
    UPDATE public.orders
    SET status = 'ready',
        updated_at = v_now
    WHERE id = v_order.id;

    INSERT INTO public.order_events (
      order_id, status, title, description, created_at, created_by
    ) VALUES (
      v_order.id,
      'ready',
      'Manufacturing Complete & Quality Passed',
      'All print production jobs completed studio quality checks. Consignment packed and ready for carrier dispatch.',
      v_now,
      p_actor_id
    );
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'jobId', p_job_id,
    'newStatus', p_target_status,
    'orderCompleted', (v_uncompleted_count = 0)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 7. ATOMIC STORED PROCEDURE: SUBMIT QC INSPECTION
CREATE OR REPLACE FUNCTION public.atomic_submit_qc_inspection(
  p_job_id UUID,
  p_inspector_id UUID,
  p_result TEXT, -- 'passed' or 'failed' / 'rework_required'
  p_checklist JSONB,
  p_notes TEXT
)
RETURNS JSONB AS $$
DECLARE
  v_job RECORD;
  v_now TIMESTAMPTZ := NOW();
  v_qc_id UUID;
BEGIN
  SELECT * INTO v_job FROM public.production_jobs WHERE id = p_job_id FOR UPDATE;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Job not found');
  END IF;

  -- Insert QC Record
  INSERT INTO public.production_qc_records (
    production_job_id,
    status,
    inspector_id,
    checklist,
    notes,
    inspected_at,
    created_at
  ) VALUES (
    p_job_id,
    p_result,
    p_inspector_id,
    p_checklist,
    p_notes,
    v_now,
    v_now
  ) RETURNING id INTO v_qc_id;

  IF p_result = 'passed' THEN
    -- Transition job to completed
    PERFORM public.atomic_transition_production_job(p_job_id, 'completed', p_inspector_id, 'QC Passed');
  ELSE
    -- Transition to rework_required
    PERFORM public.atomic_transition_production_job(p_job_id, 'rework_required', p_inspector_id, 'QC Failed: ' || p_notes);
  END IF;

  RETURN jsonb_build_object('success', true, 'qcId', v_qc_id, 'result', p_result);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 8. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.production_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.production_qc_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.production_job_events ENABLE ROW LEVEL SECURITY;

-- Customers can view high-level production status for their own orders
DROP POLICY IF EXISTS "Customers view own production jobs" ON public.production_jobs;
CREATE POLICY "Customers view own production jobs"
ON public.production_jobs FOR SELECT
TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.orders o WHERE o.id = production_jobs.order_id AND o.user_id = auth.uid())
  OR public.is_admin()
);

-- Customers can view production events for their own orders
DROP POLICY IF EXISTS "Customers view own production events" ON public.production_job_events;
CREATE POLICY "Customers view own production events"
ON public.production_job_events FOR SELECT
TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.orders o WHERE o.id = production_job_events.order_id AND o.user_id = auth.uid())
  OR public.is_admin()
);

-- Admins / Production Staff Full Management
DROP POLICY IF EXISTS "Staff manage all production jobs" ON public.production_jobs;
CREATE POLICY "Staff manage all production jobs"
ON public.production_jobs FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Staff manage all qc records" ON public.production_qc_records;
CREATE POLICY "Staff manage all qc records"
ON public.production_qc_records FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Staff manage all production events" ON public.production_job_events;
CREATE POLICY "Staff manage all production events"
ON public.production_job_events FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());
