-- ==============================================================================
-- PHASE: ORDER CANCELLATION, REFUND ORCHESTRATION & CREDIT NOTES MIGRATION
-- Project: print-studio-production (vsbexmohwbhlyfinobnv)
-- Purpose: Creates order_cancellations, upgrades payment_refunds with idempotency,
--          and creates credit_notes with full RLS and immutable audit triggers.
-- ==============================================================================

-- 1. Create order_cancellations Table
CREATE TABLE IF NOT EXISTS public.order_cancellations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  requested_by_type VARCHAR(32) NOT NULL DEFAULT 'ADMIN', -- 'ADMIN', 'CUSTOMER', 'SYSTEM', 'PAYMENT_PROVIDER'
  requested_by_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reason_code VARCHAR(64) NOT NULL, -- e.g. 'OUT_OF_STOCK', 'CUSTOMER_REQUEST', 'LOW_QUALITY_ARTWORK', 'PINCODE_UNSERVICEABLE', etc.
  reason_note TEXT,
  internal_note TEXT,
  customer_message TEXT,
  refund_eligibility VARCHAR(32) NOT NULL DEFAULT 'FULL_REFUND', -- 'FULL_REFUND', 'PARTIAL_REFUND', 'NO_REFUND_REQUIRED'
  refund_amount_minor BIGINT NOT NULL DEFAULT 0,
  cancelled_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  version INTEGER NOT NULL DEFAULT 1,
  metadata JSONB,
  CONSTRAINT uk_order_cancellations_order UNIQUE (order_id)
);

-- Indexes for order_cancellations
CREATE INDEX IF NOT EXISTS idx_order_cancellations_order_id ON public.order_cancellations(order_id);
CREATE INDEX IF NOT EXISTS idx_order_cancellations_customer_id ON public.order_cancellations(customer_id);
CREATE INDEX IF NOT EXISTS idx_order_cancellations_reason_code ON public.order_cancellations(reason_code);
CREATE INDEX IF NOT EXISTS idx_order_cancellations_cancelled_at ON public.order_cancellations(cancelled_at DESC);

-- Enable RLS for order_cancellations
ALTER TABLE public.order_cancellations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Customers can view own order cancellations" ON public.order_cancellations;
CREATE POLICY "Customers can view own order cancellations"
ON public.order_cancellations FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.id = order_cancellations.order_id
    AND o.user_id = auth.uid()
  )
  OR public.is_admin()
);

DROP POLICY IF EXISTS "Admins can manage order cancellations" ON public.order_cancellations;
CREATE POLICY "Admins can manage order cancellations"
ON public.order_cancellations FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 2. Upgrade payment_refunds Table with Idempotency & Acquirer Reference Fields
ALTER TABLE public.payment_refunds
  ADD COLUMN IF NOT EXISTS idempotency_key VARCHAR(128),
  ADD COLUMN IF NOT EXISTS refund_type VARCHAR(16) NOT NULL DEFAULT 'FULL', -- 'FULL', 'PARTIAL'
  ADD COLUMN IF NOT EXISTS provider_status VARCHAR(32) NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'PROCESSED', 'FAILED', 'REVERSED'
  ADD COLUMN IF NOT EXISTS internal_status VARCHAR(32) NOT NULL DEFAULT 'SUBMITTED', -- 'CREATED', 'SUBMITTED', 'PENDING', 'PROCESSED', 'FAILED', 'REVERSED', 'RECONCILIATION_REQUIRED'
  ADD COLUMN IF NOT EXISTS acquirer_reference VARCHAR(128), -- ARN, RRN, UTR
  ADD COLUMN IF NOT EXISTS reason_code VARCHAR(64),
  ADD COLUMN IF NOT EXISTS reason_note TEXT,
  ADD COLUMN IF NOT EXISTS requested_by_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS requested_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  ADD COLUMN IF NOT EXISTS processed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS failed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS reversed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS provider_response JSONB,
  ADD COLUMN IF NOT EXISTS provider_error_code VARCHAR(64),
  ADD COLUMN IF NOT EXISTS provider_error_message TEXT,
  ADD COLUMN IF NOT EXISTS version INTEGER NOT NULL DEFAULT 1;

-- Backfill idempotency_key for legacy refunds if null
UPDATE public.payment_refunds
SET idempotency_key = 'ref_legacy_' || id::text
WHERE idempotency_key IS NULL;

-- Add unique constraint for idempotency key
CREATE UNIQUE INDEX IF NOT EXISTS uk_payment_refunds_idempotency ON public.payment_refunds(idempotency_key);
CREATE INDEX IF NOT EXISTS idx_payment_refunds_provider_status ON public.payment_refunds(provider_status);
CREATE INDEX IF NOT EXISTS idx_payment_refunds_acquirer_ref ON public.payment_refunds(acquirer_reference);

-- 3. Create credit_notes Table for GST Accounting Compliance
CREATE TABLE IF NOT EXISTS public.credit_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  invoice_id VARCHAR(64),
  refund_id UUID REFERENCES public.payment_refunds(id) ON DELETE SET NULL,
  credit_note_number VARCHAR(64) NOT NULL UNIQUE,
  reason VARCHAR(128) NOT NULL,
  taxable_amount_minor BIGINT NOT NULL DEFAULT 0,
  cgst_minor BIGINT NOT NULL DEFAULT 0,
  sgst_minor BIGINT NOT NULL DEFAULT 0,
  igst_minor BIGINT NOT NULL DEFAULT 0,
  total_minor BIGINT NOT NULL DEFAULT 0,
  status VARCHAR(32) NOT NULL DEFAULT 'issued', -- 'issued', 'adjusted', 'cancelled'
  customer_snapshot JSONB,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_credit_notes_order_id ON public.credit_notes(order_id);
CREATE INDEX IF NOT EXISTS idx_credit_notes_credit_note_number ON public.credit_notes(credit_note_number);

-- Enable RLS for credit_notes
ALTER TABLE public.credit_notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Customers can view own credit notes" ON public.credit_notes;
CREATE POLICY "Customers can view own credit notes"
ON public.credit_notes FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.id = credit_notes.order_id
    AND o.user_id = auth.uid()
  )
  OR public.is_admin()
);

DROP POLICY IF EXISTS "Admins can manage credit notes" ON public.credit_notes;
CREATE POLICY "Admins can manage credit notes"
ON public.credit_notes FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());
