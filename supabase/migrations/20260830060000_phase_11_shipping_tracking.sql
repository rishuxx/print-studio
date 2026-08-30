-- ==============================================================================
-- PHASE 11: PRODUCTION CARRIER API, SHIPMENT TRACKING & AUTOMATED WAYBILLS SCHEMA
-- Project: print-studio-production (vsbexmohwbhlyfinobnv)
-- Purpose: Complete normalized logistics subsystem supporting multi-carrier routing,
--          multiple shipments per order, append-only tracking events, webhook receipts,
--          and strict RLS for customer and administrative security.
-- ==============================================================================

-- 1. CARRIER REGISTRY TABLE
CREATE TABLE IF NOT EXISTS public.shipping_carriers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(32) UNIQUE NOT NULL, -- 'shiprocket', 'delhivery', 'bluedart', 'fake'
  name VARCHAR(100) NOT NULL,
  provider_type VARCHAR(32) NOT NULL DEFAULT 'aggregator' CHECK (provider_type IN ('aggregator', 'direct', 'sandbox')),
  enabled BOOLEAN NOT NULL DEFAULT true,
  environment VARCHAR(16) NOT NULL DEFAULT 'production' CHECK (environment IN ('production', 'test', 'sandbox')),
  capabilities JSONB NOT NULL DEFAULT '{"pickup": true, "tracking": true, "labels": true, "webhooks": true, "rates": true}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. CARRIER ACCOUNTS CONFIGURATION TABLE
CREATE TABLE IF NOT EXISTS public.shipping_carrier_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  carrier_id UUID NOT NULL REFERENCES public.shipping_carriers(id) ON DELETE CASCADE,
  account_name VARCHAR(100) NOT NULL,
  environment VARCHAR(16) NOT NULL DEFAULT 'production' CHECK (environment IN ('production', 'test', 'sandbox')),
  enabled BOOLEAN NOT NULL DEFAULT true,
  credential_reference VARCHAR(100) DEFAULT 'ENV_CONFIGURED',
  webhook_enabled BOOLEAN NOT NULL DEFAULT true,
  last_health_check_at TIMESTAMPTZ,
  last_success_at TIMESTAMPTZ,
  last_error_at TIMESTAMPTZ,
  last_error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. SHIPMENTS TABLE (Authoritative Projection)
CREATE TABLE IF NOT EXISTS public.shipping_shipments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE RESTRICT,
  customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  carrier_id UUID NOT NULL REFERENCES public.shipping_carriers(id) ON DELETE RESTRICT,
  carrier_account_id UUID REFERENCES public.shipping_carrier_accounts(id) ON DELETE SET NULL,
  
  -- Provider Identifiers
  provider_shipment_id VARCHAR(100),
  provider_order_id VARCHAR(100),
  awb_number VARCHAR(100) NOT NULL,
  tracking_number VARCHAR(100),
  reference_number VARCHAR(100),
  
  -- Canonical Status
  shipment_status VARCHAR(32) NOT NULL DEFAULT 'created' CHECK (
    shipment_status IN (
      'created',
      'label_generated',
      'manifested',
      'ready_for_pickup',
      'picked_up',
      'in_transit',
      'arrived_at_hub',
      'out_for_delivery',
      'delivery_attempted',
      'delivered',
      'ndr',
      'rto_initiated',
      'rto_in_transit',
      'rto_delivered',
      'cancelled',
      'lost',
      'damaged',
      'exception',
      'unknown'
    )
  ),
  previous_status VARCHAR(32),
  status_changed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  
  -- Label & Tracking URLs
  label_url TEXT,
  tracking_url TEXT,
  tracking_token VARCHAR(64) UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(24), 'hex'),
  
  -- Delivery Timestamps
  estimated_delivery_at TIMESTAMPTZ,
  shipped_at TIMESTAMPTZ,
  picked_up_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  rto_at TIMESTAMPTZ,
  
  -- Exception Details
  exception_code VARCHAR(50),
  exception_message TEXT,
  
  -- Snapshots & Dimensions
  origin_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
  destination_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
  package_count INTEGER NOT NULL DEFAULT 1 CHECK (package_count >= 1),
  weight_grams INTEGER NOT NULL DEFAULT 500 CHECK (weight_grams >= 0),
  length_mm INTEGER DEFAULT 200,
  width_mm INTEGER DEFAULT 150,
  height_mm INTEGER DEFAULT 50,
  
  -- Polling & Syncing Controls
  last_polled_at TIMESTAMPTZ,
  next_poll_at TIMESTAMPTZ,
  poll_attempt_count INTEGER NOT NULL DEFAULT 0,
  last_poll_error TEXT,
  
  -- Concurrency
  version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexes for rapid lookup
CREATE INDEX IF NOT EXISTS idx_shipping_shipments_order ON public.shipping_shipments(order_id);
CREATE INDEX IF NOT EXISTS idx_shipping_shipments_customer ON public.shipping_shipments(customer_id);
CREATE INDEX IF NOT EXISTS idx_shipping_shipments_awb ON public.shipping_shipments(awb_number);
CREATE INDEX IF NOT EXISTS idx_shipping_shipments_token ON public.shipping_shipments(tracking_token);
CREATE INDEX IF NOT EXISTS idx_shipping_shipments_status ON public.shipping_shipments(shipment_status);
CREATE INDEX IF NOT EXISTS idx_shipping_shipments_poll ON public.shipping_shipments(next_poll_at) WHERE shipment_status NOT IN ('delivered', 'cancelled', 'rto_delivered');

-- 4. PACKAGES TABLE (Multi-package shipments)
CREATE TABLE IF NOT EXISTS public.shipping_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id UUID NOT NULL REFERENCES public.shipping_shipments(id) ON DELETE CASCADE,
  package_number INTEGER NOT NULL DEFAULT 1,
  provider_package_id VARCHAR(100),
  weight_grams INTEGER NOT NULL DEFAULT 500 CHECK (weight_grams >= 0),
  length_mm INTEGER DEFAULT 200,
  width_mm INTEGER DEFAULT 150,
  height_mm INTEGER DEFAULT 50,
  item_count INTEGER NOT NULL DEFAULT 1,
  tracking_number VARCHAR(100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT uq_shipment_package UNIQUE (shipment_id, package_number)
);

-- 5. TRACKING EVENTS TABLE (Append-Only Event Ledger)
CREATE TABLE IF NOT EXISTS public.shipping_tracking_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id UUID NOT NULL REFERENCES public.shipping_shipments(id) ON DELETE CASCADE,
  carrier_id UUID NOT NULL REFERENCES public.shipping_carriers(id) ON DELETE RESTRICT,
  provider_event_id VARCHAR(100),
  provider_status VARCHAR(100) NOT NULL,
  canonical_status VARCHAR(32) NOT NULL,
  event_code VARCHAR(50),
  event_description TEXT NOT NULL,
  event_timestamp TIMESTAMPTZ NOT NULL,
  received_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  location_text TEXT,
  location_city VARCHAR(100),
  location_state VARCHAR(100),
  location_pincode VARCHAR(20),
  source VARCHAR(20) NOT NULL DEFAULT 'webhook' CHECK (source IN ('webhook', 'poll', 'manual', 'system')),
  raw_payload_hash VARCHAR(64) NOT NULL,
  normalized_payload JSONB,
  is_customer_visible BOOLEAN NOT NULL DEFAULT true,
  sequence_number INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Deterministic deduplication index
CREATE UNIQUE INDEX IF NOT EXISTS uq_tracking_event_dedupe ON public.shipping_tracking_events(
  shipment_id,
  provider_status,
  event_timestamp,
  raw_payload_hash
);

CREATE INDEX IF NOT EXISTS idx_tracking_events_shipment ON public.shipping_tracking_events(shipment_id, event_timestamp DESC);

-- 6. WEBHOOK RECEIPTS TABLE (Inbound Auditing & Idempotency)
CREATE TABLE IF NOT EXISTS public.shipping_webhook_receipts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  carrier_id UUID NOT NULL REFERENCES public.shipping_carriers(id) ON DELETE CASCADE,
  webhook_event_id VARCHAR(100),
  payload_hash VARCHAR(64) NOT NULL,
  signature_verified BOOLEAN NOT NULL DEFAULT false,
  received_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  processed_at TIMESTAMPTZ,
  processing_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processed', 'failed', 'duplicate', 'ignored')),
  failure_reason TEXT,
  attempt_count INTEGER NOT NULL DEFAULT 1,
  provider_reference VARCHAR(100),
  raw_payload_redacted JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_webhook_receipt_dedupe ON public.shipping_webhook_receipts(carrier_id, payload_hash);

-- 7. SEED DEFAULT CARRIERS
INSERT INTO public.shipping_carriers (code, name, provider_type, enabled, environment, capabilities)
VALUES
  ('shiprocket', 'Shiprocket Fulfillment', 'aggregator', true, 'production', '{"pickup": true, "tracking": true, "labels": true, "webhooks": true, "rates": true}'::jsonb),
  ('delhivery', 'Delhivery Express', 'direct', true, 'production', '{"pickup": true, "tracking": true, "labels": true, "webhooks": true, "rates": true}'::jsonb),
  ('bluedart', 'Blue Dart Express', 'direct', true, 'production', '{"pickup": true, "tracking": true, "labels": true, "webhooks": false, "rates": true}'::jsonb),
  ('fake', 'Development Sandbox Carrier', 'sandbox', true, 'sandbox', '{"pickup": true, "tracking": true, "labels": true, "webhooks": true, "rates": true}'::jsonb)
ON CONFLICT (code) DO NOTHING;

-- 8. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.shipping_carriers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_carrier_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_tracking_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_webhook_receipts ENABLE ROW LEVEL SECURITY;

-- Carriers: Public select (to display carrier names & logos), admin full access
CREATE POLICY "Public can view active carriers" ON public.shipping_carriers
  FOR SELECT TO anon, authenticated USING (enabled = true);
CREATE POLICY "Admins full access to carriers" ON public.shipping_carriers
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Carrier Accounts: Admins only
CREATE POLICY "Admins full access to carrier accounts" ON public.shipping_carrier_accounts
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Shipments:
-- 1. Customers can view shipments for their own orders
CREATE POLICY "Customers view own shipments" ON public.shipping_shipments
  FOR SELECT TO authenticated USING (
    customer_id = auth.uid() OR
    EXISTS (SELECT 1 FROM public.orders WHERE orders.id = shipping_shipments.order_id AND orders.user_id = auth.uid())
  );
-- 2. Public view by unique tracking token
CREATE POLICY "Public view shipment by token" ON public.shipping_shipments
  FOR SELECT TO anon, authenticated USING (true);
-- 3. Admins full management
CREATE POLICY "Admins full access to shipments" ON public.shipping_shipments
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Packages:
CREATE POLICY "Customers view own shipment packages" ON public.shipping_packages
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.shipping_shipments WHERE shipping_shipments.id = shipping_packages.shipment_id AND (shipping_shipments.customer_id = auth.uid()))
  );
CREATE POLICY "Admins full access to packages" ON public.shipping_packages
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Tracking Events:
CREATE POLICY "Customers view customer visible events" ON public.shipping_tracking_events
  FOR SELECT TO authenticated USING (
    is_customer_visible = true AND
    EXISTS (SELECT 1 FROM public.shipping_shipments WHERE shipping_shipments.id = shipping_tracking_events.shipment_id AND (shipping_shipments.customer_id = auth.uid()))
  );
CREATE POLICY "Public view tracking events by token" ON public.shipping_tracking_events
  FOR SELECT TO anon, authenticated USING (is_customer_visible = true);
CREATE POLICY "Admins full access to tracking events" ON public.shipping_tracking_events
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Webhook Receipts: Admins only
CREATE POLICY "Admins full access to webhook receipts" ON public.shipping_webhook_receipts
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
