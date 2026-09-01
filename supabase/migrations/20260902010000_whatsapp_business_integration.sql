-- ==============================================================================
-- PHASE 12: PRODUCTION WHATSAPP BUSINESS PLATFORM INTEGRATION
-- Project: PreetyPrints
-- Purpose: Complete Meta WhatsApp Cloud API outbox, templates, triggers,
--          credentials management with encryption, delivery logs, and RLS.
-- ==============================================================================

-- 1. WHATSAPP CONFIGURATION TABLE (Singleton Configuration Model)
CREATE TABLE IF NOT EXISTS public.whatsapp_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  is_enabled BOOLEAN NOT NULL DEFAULT false,
  phone_number_id TEXT,
  business_account_id TEXT,
  api_version TEXT NOT NULL DEFAULT 'v20.0',
  encrypted_access_token TEXT,
  token_masked TEXT,
  default_country_code TEXT NOT NULL DEFAULT '91',
  webhook_verify_token TEXT,
  last_connection_status TEXT NOT NULL DEFAULT 'NOT_CONFIGURED' CHECK (
    last_connection_status IN ('CONNECTED', 'NOT_CONFIGURED', 'INVALID_CREDENTIALS', 'DISABLED', 'ERROR')
  ),
  last_tested_at TIMESTAMPTZ,
  last_error_safe TEXT,
  version INTEGER NOT NULL DEFAULT 1,
  updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Seed initial singleton record if empty
INSERT INTO public.whatsapp_config (
  is_enabled,
  api_version,
  default_country_code,
  last_connection_status
)
SELECT false, 'v20.0', '91', 'NOT_CONFIGURED'
WHERE NOT EXISTS (SELECT 1 FROM public.whatsapp_config);


-- 2. WHATSAPP TEMPLATES TABLE
CREATE TABLE IF NOT EXISTS public.whatsapp_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL, -- e.g. 'ORDER_CONFIRMED', 'ORDER_SHIPPED'
  name TEXT NOT NULL,
  meta_template_name TEXT NOT NULL,
  language_code TEXT NOT NULL DEFAULT 'en',
  category TEXT NOT NULL DEFAULT 'TRANSACTIONAL' CHECK (category IN ('TRANSACTIONAL', 'MARKETING')),
  description TEXT,
  status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (
    status IN ('DRAFT', 'ACTIVE', 'DISABLED', 'PENDING', 'APPROVED', 'REJECTED')
  ),
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  header_type TEXT NOT NULL DEFAULT 'NONE' CHECK (header_type IN ('NONE', 'TEXT', 'IMAGE', 'DOCUMENT', 'VIDEO')),
  header_text TEXT,
  body_text TEXT NOT NULL,
  footer_text TEXT,
  buttons_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  variable_schema JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);


-- 3. WHATSAPP TRIGGERS / AUTOMATIONS TABLE
CREATE TABLE IF NOT EXISTS public.whatsapp_triggers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT UNIQUE NOT NULL,
  template_id UUID REFERENCES public.whatsapp_templates(id) ON DELETE SET NULL,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  category TEXT NOT NULL DEFAULT 'TRANSACTIONAL' CHECK (category IN ('TRANSACTIONAL', 'MARKETING')),
  description TEXT,
  priority INTEGER NOT NULL DEFAULT 1,
  max_retries INTEGER NOT NULL DEFAULT 3,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);


-- 4. WHATSAPP OUTBOX TABLE (High-Reliability Delivery Queue & Audit)
CREATE TABLE IF NOT EXISTS public.whatsapp_outbox (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  template_id UUID REFERENCES public.whatsapp_templates(id) ON DELETE SET NULL,
  recipient_phone TEXT NOT NULL,
  recipient_name TEXT,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'QUEUED' CHECK (
    status IN ('QUEUED', 'PROCESSING', 'SENT', 'DELIVERED', 'READ', 'FAILED', 'SKIPPED')
  ),
  attempts INTEGER NOT NULL DEFAULT 0,
  max_attempts INTEGER NOT NULL DEFAULT 5,
  next_attempt_at TIMESTAMPTZ,
  provider_message_id TEXT,
  provider_response_safe JSONB,
  error_code TEXT,
  error_message_safe TEXT,
  idempotency_key TEXT UNIQUE NOT NULL,
  is_test BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  failed_at TIMESTAMPTZ,
  last_attempt_at TIMESTAMPTZ
);


-- 5. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_whatsapp_outbox_status_next
  ON public.whatsapp_outbox (status, next_attempt_at ASC);

CREATE INDEX IF NOT EXISTS idx_whatsapp_outbox_order_created
  ON public.whatsapp_outbox (order_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_whatsapp_outbox_customer_created
  ON public.whatsapp_outbox (customer_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_whatsapp_outbox_event_type
  ON public.whatsapp_outbox (event_type);

CREATE INDEX IF NOT EXISTS idx_whatsapp_outbox_provider_msg
  ON public.whatsapp_outbox (provider_message_id)
  WHERE provider_message_id IS NOT NULL;


-- 6. ENABLE ROW LEVEL SECURITY
ALTER TABLE public.whatsapp_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_triggers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_outbox ENABLE ROW LEVEL SECURITY;


-- 7. RLS POLICIES FOR ADMIN ONLY ACCESS
-- Customers MUST NEVER be able to read or modify WhatsApp credentials, templates, or outbox
DROP POLICY IF EXISTS "Admin full access to whatsapp_config" ON public.whatsapp_config;
CREATE POLICY "Admin full access to whatsapp_config"
  ON public.whatsapp_config
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('owner', 'admin')
    )
  );

DROP POLICY IF EXISTS "Admin full access to whatsapp_templates" ON public.whatsapp_templates;
CREATE POLICY "Admin full access to whatsapp_templates"
  ON public.whatsapp_templates
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('owner', 'admin')
    )
  );

DROP POLICY IF EXISTS "Admin full access to whatsapp_triggers" ON public.whatsapp_triggers;
CREATE POLICY "Admin full access to whatsapp_triggers"
  ON public.whatsapp_triggers
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('owner', 'admin')
    )
  );

DROP POLICY IF EXISTS "Admin full access to whatsapp_outbox" ON public.whatsapp_outbox;
CREATE POLICY "Admin full access to whatsapp_outbox"
  ON public.whatsapp_outbox
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('owner', 'admin', 'staff')
    )
  );


-- 8. DEFAULT CORE TEMPLATES SEED
INSERT INTO public.whatsapp_templates (key, name, meta_template_name, language_code, category, status, is_enabled, body_text, variable_schema)
VALUES
  (
    'ORDER_PLACED',
    'Order Placed',
    'preetyprints_order_placed',
    'en',
    'TRANSACTIONAL',
    'ACTIVE',
    true,
    'Hello {{1}}, your PreetyPrints order {{2}} has been placed successfully. Order total: ₹{{3}}. We will notify you once payment & artwork are verified.',
    '[{"pos": 1, "var": "CUSTOMER_NAME"}, {"pos": 2, "var": "ORDER_NUMBER"}, {"pos": 3, "var": "ORDER_TOTAL"}]'::jsonb
  ),
  (
    'ORDER_CONFIRMED',
    'Order Confirmed',
    'preetyprints_order_confirmed',
    'en',
    'TRANSACTIONAL',
    'ACTIVE',
    true,
    'Hello {{1}}, your PreetyPrints order {{2}} has been confirmed. Amount: ₹{{3}}. Our studio team is preparing your files for print.',
    '[{"pos": 1, "var": "CUSTOMER_NAME"}, {"pos": 2, "var": "ORDER_NUMBER"}, {"pos": 3, "var": "ORDER_TOTAL"}]'::jsonb
  ),
  (
    'PAYMENT_SUCCESS',
    'Payment Successful',
    'preetyprints_payment_success',
    'en',
    'TRANSACTIONAL',
    'ACTIVE',
    true,
    'Hello {{1}}, payment of ₹{{2}} for order {{3}} was successful. Your order is confirmed and scheduled for production.',
    '[{"pos": 1, "var": "CUSTOMER_NAME"}, {"pos": 2, "var": "PAYMENT_AMOUNT"}, {"pos": 3, "var": "ORDER_NUMBER"}]'::jsonb
  ),
  (
    'PAYMENT_FAILED',
    'Payment Failed',
    'preetyprints_payment_failed',
    'en',
    'TRANSACTIONAL',
    'ACTIVE',
    true,
    'Hello {{1}}, payment verification for order {{2}} failed. Please retry your payment to keep your print queue position.',
    '[{"pos": 1, "var": "CUSTOMER_NAME"}, {"pos": 2, "var": "ORDER_NUMBER"}]'::jsonb
  ),
  (
    'ARTWORK_REVIEW_REQUIRED',
    'Artwork Review Required',
    'preetyprints_artwork_review',
    'en',
    'TRANSACTIONAL',
    'ACTIVE',
    true,
    'Hello {{1}}, your digital print proof for order {{2}} is ready for approval. Please review your artwork here: {{3}}',
    '[{"pos": 1, "var": "CUSTOMER_NAME"}, {"pos": 2, "var": "ORDER_NUMBER"}, {"pos": 3, "var": "ARTWORK_REVIEW_URL"}]'::jsonb
  ),
  (
    'ARTWORK_APPROVED',
    'Artwork Approved',
    'preetyprints_artwork_approved',
    'en',
    'TRANSACTIONAL',
    'ACTIVE',
    true,
    'Hello {{1}}, your artwork for order {{2}} has been approved. Plate imaging and press run are now starting.',
    '[{"pos": 1, "var": "CUSTOMER_NAME"}, {"pos": 2, "var": "ORDER_NUMBER"}]'::jsonb
  ),
  (
    'ARTWORK_REJECTED',
    'Artwork Revision Required',
    'preetyprints_artwork_rejected',
    'en',
    'TRANSACTIONAL',
    'ACTIVE',
    true,
    'Hello {{1}}, our pre-press team requested changes for order {{2}} artwork. Please review notes and upload revised files: {{3}}',
    '[{"pos": 1, "var": "CUSTOMER_NAME"}, {"pos": 2, "var": "ORDER_NUMBER"}, {"pos": 3, "var": "ARTWORK_REVIEW_URL"}]'::jsonb
  ),
  (
    'PRODUCTION_STARTED',
    'Production Started',
    'preetyprints_production_started',
    'en',
    'TRANSACTIONAL',
    'ACTIVE',
    true,
    'Hello {{1}}, production has started for your PreetyPrints order {{2}}. We will notify you when it is packed and dispatched.',
    '[{"pos": 1, "var": "CUSTOMER_NAME"}, {"pos": 2, "var": "ORDER_NUMBER"}]'::jsonb
  ),
  (
    'AWB_ASSIGNED',
    'AWB Assigned / Manifested',
    'preetyprints_awb_assigned',
    'en',
    'TRANSACTIONAL',
    'ACTIVE',
    true,
    'Hello {{1}}, your order {{2}} is packed and AWB {{3}} assigned with {{4}}. Track progress: {{5}}',
    '[{"pos": 1, "var": "CUSTOMER_NAME"}, {"pos": 2, "var": "ORDER_NUMBER"}, {"pos": 3, "var": "AWB_NUMBER"}, {"pos": 4, "var": "CARRIER_NAME"}, {"pos": 5, "var": "ORDER_TRACKING_URL"}]'::jsonb
  ),
  (
    'ORDER_SHIPPED',
    'Order Shipped / Dispatched',
    'preetyprints_order_shipped',
    'en',
    'TRANSACTIONAL',
    'ACTIVE',
    true,
    'Hello {{1}}, your PreetyPrints order {{2}} has been shipped via {{3}}. Tracking AWB: {{4}}. Track here: {{5}}',
    '[{"pos": 1, "var": "CUSTOMER_NAME"}, {"pos": 2, "var": "ORDER_NUMBER"}, {"pos": 3, "var": "CARRIER_NAME"}, {"pos": 4, "var": "AWB_NUMBER"}, {"pos": 5, "var": "ORDER_TRACKING_URL"}]'::jsonb
  ),
  (
    'SHIPMENT_IN_TRANSIT',
    'Shipment In Transit',
    'preetyprints_in_transit',
    'en',
    'TRANSACTIONAL',
    'ACTIVE',
    true,
    'Hello {{1}}, your consignment for order {{2}} is in transit and on schedule. Track updates: {{3}}',
    '[{"pos": 1, "var": "CUSTOMER_NAME"}, {"pos": 2, "var": "ORDER_NUMBER"}, {"pos": 3, "var": "ORDER_TRACKING_URL"}]'::jsonb
  ),
  (
    'OUT_FOR_DELIVERY',
    'Out For Delivery',
    'preetyprints_out_for_delivery',
    'en',
    'TRANSACTIONAL',
    'ACTIVE',
    true,
    'Hello {{1}}, your PreetyPrints order {{2}} is out for delivery today. Please keep your phone reachable for the courier partner.',
    '[{"pos": 1, "var": "CUSTOMER_NAME"}, {"pos": 2, "var": "ORDER_NUMBER"}]'::jsonb
  ),
  (
    'ORDER_DELIVERED',
    'Order Delivered',
    'preetyprints_order_delivered',
    'en',
    'TRANSACTIONAL',
    'ACTIVE',
    true,
    'Hello {{1}}, your PreetyPrints order {{2}} has been delivered successfully. Thank you for choosing PreetyPrints!',
    '[{"pos": 1, "var": "CUSTOMER_NAME"}, {"pos": 2, "var": "ORDER_NUMBER"}]'::jsonb
  ),
  (
    'ORDER_CANCELLED',
    'Order Cancelled',
    'preetyprints_order_cancelled',
    'en',
    'TRANSACTIONAL',
    'ACTIVE',
    true,
    'Hello {{1}}, your PreetyPrints order {{2}} has been cancelled. Any eligible refund will be credited to your source payment method.',
    '[{"pos": 1, "var": "CUSTOMER_NAME"}, {"pos": 2, "var": "ORDER_NUMBER"}]'::jsonb
  ),
  (
    'REFUND_PROCESSED',
    'Refund Processed',
    'preetyprints_refund_processed',
    'en',
    'TRANSACTIONAL',
    'ACTIVE',
    true,
    'Hello {{1}}, your refund of ₹{{2}} for order {{3}} has been processed. Reference ID: {{4}}.',
    '[{"pos": 1, "var": "CUSTOMER_NAME"}, {"pos": 2, "var": "REFUND_AMOUNT"}, {"pos": 3, "var": "ORDER_NUMBER"}, {"pos": 4, "var": "REFUND_ID"}]'::jsonb
  )
ON CONFLICT (key) DO UPDATE SET
  name = EXCLUDED.name,
  meta_template_name = EXCLUDED.meta_template_name,
  body_text = EXCLUDED.body_text,
  variable_schema = EXCLUDED.variable_schema;


-- 9. DEFAULT CORE TRIGGERS SEED
INSERT INTO public.whatsapp_triggers (event_type, template_id, is_enabled, category, description, priority, max_retries)
SELECT
  t.key,
  t.id,
  true,
  t.category,
  'Automated WhatsApp notification for ' || t.name,
  1,
  3
FROM public.whatsapp_templates t
ON CONFLICT (event_type) DO UPDATE SET
  template_id = EXCLUDED.template_id,
  is_enabled = EXCLUDED.is_enabled;
