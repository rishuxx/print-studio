-- ==============================================================================
-- PHASE 09: RAZORPAY PAYMENT TRANSACTIONS & IDEMPOTENT WEBHOOK STATE
-- Project: print-studio-production (vsbexmohwbhlyfinobnv)
-- Purpose: Dedicated 'payments' table, unique provider references, webhook idempotency
-- ==============================================================================

-- 1. Create Payments Table
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  provider VARCHAR(32) NOT NULL DEFAULT 'razorpay',
  provider_order_id VARCHAR(128) NOT NULL,
  provider_payment_id VARCHAR(128),
  status VARCHAR(32) NOT NULL DEFAULT 'created', -- 'created', 'pending', 'authorized', 'captured', 'failed', 'refunded', 'partially_refunded', 'cancelled'
  amount INTEGER NOT NULL, -- Stored in paise or INR depending on system standard; here paise (₹1 = 100)
  currency VARCHAR(8) NOT NULL DEFAULT 'INR',
  method VARCHAR(32),
  failure_code VARCHAR(64),
  failure_description TEXT,
  metadata JSONB,
  captured_at TIMESTAMPTZ,
  failed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT uk_payments_provider_order UNIQUE (provider, provider_order_id)
);

-- Index for fast order lookups
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON public.payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_provider_order_id ON public.payments(provider_order_id);
CREATE INDEX IF NOT EXISTS idx_payments_provider_payment_id ON public.payments(provider_payment_id);

-- 2. Webhook Events Idempotency Table
CREATE TABLE IF NOT EXISTS public.webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider VARCHAR(32) NOT NULL DEFAULT 'razorpay',
  event_id VARCHAR(128) NOT NULL,
  event_type VARCHAR(64) NOT NULL,
  payload JSONB NOT NULL,
  processed BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT uk_webhook_events_provider_event UNIQUE (provider, event_id)
);

CREATE INDEX IF NOT EXISTS idx_webhook_events_lookup ON public.webhook_events(provider, event_id);

-- 3. Row Level Security for Payments
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;

-- Customers can view payment records for their own orders
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

-- Guest or authenticated customer order creation path allows insert
DROP POLICY IF EXISTS "Allow system or customer insert payments" ON public.payments;
CREATE POLICY "Allow system or customer insert payments"
ON public.payments FOR INSERT
TO authenticated, anon
WITH CHECK (true);

-- Allow server update on payments
DROP POLICY IF EXISTS "Allow server update payments" ON public.payments;
CREATE POLICY "Allow server update payments"
ON public.payments FOR UPDATE
TO authenticated, anon
USING (true)
WITH CHECK (true);

-- Webhook events table is strictly internal / admin
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
