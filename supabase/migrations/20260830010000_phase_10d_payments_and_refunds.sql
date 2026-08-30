-- ==============================================================================
-- PHASE 10D: COMPLETE PAYMENTS, REFUNDS & RECONCILIATION DATA MODEL (SELF-CONTAINED)
-- Project: print-studio-production (vsbexmohwbhlyfinobnv)
-- Purpose: Ensures payments table exists, creates payment_refunds, and webhook_events
-- ==============================================================================

-- 1. Create Payments Table if not already created
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  provider VARCHAR(32) NOT NULL DEFAULT 'razorpay',
  provider_order_id VARCHAR(128) NOT NULL,
  provider_payment_id VARCHAR(128),
  status VARCHAR(32) NOT NULL DEFAULT 'created', -- 'created', 'pending', 'authorized', 'captured', 'failed', 'refunded', 'partially_refunded', 'cancelled'
  amount INTEGER NOT NULL, -- Stored in paise (₹1 = 100)
  amount_minor BIGINT,
  amount_refunded_minor BIGINT NOT NULL DEFAULT 0,
  currency VARCHAR(8) NOT NULL DEFAULT 'INR',
  method VARCHAR(32),
  failure_code VARCHAR(64),
  failure_description TEXT,
  signature_verified BOOLEAN NOT NULL DEFAULT FALSE,
  webhook_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
  reconciliation_state VARCHAR(32) NOT NULL DEFAULT 'reconciled', -- 'reconciled', 'reconciliation_required', 'amount_mismatch', 'signature_failed', 'webhook_pending'
  reconciliation_notes TEXT,
  metadata JSONB,
  captured_at TIMESTAMPTZ,
  refunded_at TIMESTAMPTZ,
  failed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT uk_payments_provider_order UNIQUE (provider, provider_order_id)
);

-- Upgrade existing columns if the table already existed earlier
ALTER TABLE public.payments
  ADD COLUMN IF NOT EXISTS amount_minor BIGINT,
  ADD COLUMN IF NOT EXISTS amount_refunded_minor BIGINT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS signature_verified BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS webhook_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS reconciliation_state VARCHAR(32) NOT NULL DEFAULT 'reconciled',
  ADD COLUMN IF NOT EXISTS reconciliation_notes TEXT,
  ADD COLUMN IF NOT EXISTS refunded_at TIMESTAMPTZ;

-- Backfill amount_minor from amount
UPDATE public.payments
SET amount_minor = amount
WHERE amount_minor IS NULL;

-- Set default and constraints
ALTER TABLE public.payments
  ALTER COLUMN amount_minor SET DEFAULT 0;

-- Indexes for payments table
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON public.payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_provider_order_id ON public.payments(provider_order_id);
CREATE INDEX IF NOT EXISTS idx_payments_provider_payment_id ON public.payments(provider_payment_id);
CREATE INDEX IF NOT EXISTS idx_payments_status_created ON public.payments(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payments_reconciliation_state ON public.payments(reconciliation_state);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON public.payments(created_at DESC);

-- Enable RLS for payments
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Customers can view own payments" ON public.payments;
CREATE POLICY "Customers can view own payments"
ON public.payments FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.id = payments.order_id
    AND o.user_id = auth.uid()
  )
  OR public.is_admin()
);

DROP POLICY IF EXISTS "Allow system or customer insert payments" ON public.payments;
CREATE POLICY "Allow system or customer insert payments"
ON public.payments FOR INSERT
TO authenticated, anon
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow server update payments" ON public.payments;
CREATE POLICY "Allow server update payments"
ON public.payments FOR UPDATE
TO authenticated, anon
USING (true)
WITH CHECK (true);

-- 2. Create Payment Refunds Table for idempotent refund tracking
CREATE TABLE IF NOT EXISTS public.payment_refunds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id UUID NOT NULL REFERENCES public.payments(id) ON DELETE CASCADE,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  provider VARCHAR(32) NOT NULL DEFAULT 'razorpay',
  provider_refund_id VARCHAR(128),
  amount_minor BIGINT NOT NULL CHECK (amount_minor > 0),
  currency VARCHAR(8) NOT NULL DEFAULT 'INR',
  status VARCHAR(32) NOT NULL DEFAULT 'requested', -- 'requested', 'processing', 'processed', 'failed'
  reason TEXT,
  idempotency_key VARCHAR(128) NOT NULL UNIQUE,
  requested_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  failure_code VARCHAR(64),
  failure_description TEXT,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexes for payment_refunds
CREATE INDEX IF NOT EXISTS idx_payment_refunds_payment_id ON public.payment_refunds(payment_id);
CREATE INDEX IF NOT EXISTS idx_payment_refunds_order_id ON public.payment_refunds(order_id);
CREATE INDEX IF NOT EXISTS idx_payment_refunds_provider_refund_id ON public.payment_refunds(provider_refund_id);
CREATE INDEX IF NOT EXISTS idx_payment_refunds_status ON public.payment_refunds(status);

-- Enable RLS for payment_refunds
ALTER TABLE public.payment_refunds ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Customers can view own refunds" ON public.payment_refunds;
CREATE POLICY "Customers can view own refunds"
ON public.payment_refunds FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.id = payment_refunds.order_id
    AND o.user_id = auth.uid()
  )
  OR public.is_admin()
);

DROP POLICY IF EXISTS "Admins can manage payment refunds" ON public.payment_refunds;
CREATE POLICY "Admins can manage payment refunds"
ON public.payment_refunds FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 3. Create / Upgrade Webhook Events Table
CREATE TABLE IF NOT EXISTS public.webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider VARCHAR(32) NOT NULL DEFAULT 'razorpay',
  event_id VARCHAR(128) NOT NULL,
  event_type VARCHAR(64) NOT NULL,
  payload JSONB NOT NULL,
  processed BOOLEAN NOT NULL DEFAULT true,
  processing_status VARCHAR(32) NOT NULL DEFAULT 'processed', -- 'processed', 'failed', 'pending', 'duplicate'
  processing_attempts INTEGER NOT NULL DEFAULT 1,
  signature_valid BOOLEAN NOT NULL DEFAULT TRUE,
  last_error TEXT,
  processed_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT uk_webhook_events_provider_event UNIQUE (provider, event_id)
);

ALTER TABLE public.webhook_events
  ADD COLUMN IF NOT EXISTS processing_status VARCHAR(32) NOT NULL DEFAULT 'processed',
  ADD COLUMN IF NOT EXISTS processing_attempts INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS signature_valid BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS last_error TEXT,
  ADD COLUMN IF NOT EXISTS processed_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now());

CREATE INDEX IF NOT EXISTS idx_webhook_events_lookup ON public.webhook_events(provider, event_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_status ON public.webhook_events(processing_status, created_at DESC);

-- Enable RLS for webhook_events
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view webhook events" ON public.webhook_events;
CREATE POLICY "Admins can view webhook events"
ON public.webhook_events FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Allow anon insert webhook events" ON public.webhook_events;
CREATE POLICY "Allow anon insert webhook events"
ON public.webhook_events FOR INSERT
TO anon, authenticated
WITH CHECK (true);
