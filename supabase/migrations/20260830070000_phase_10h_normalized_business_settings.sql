-- ==============================================================================
-- PHASE 10H: NORMALIZED BUSINESS SETTINGS & CENTRAL CONFIGURATION SCHEMA
-- Project: print-studio-production (vsbexmohwbhlyfinobnv)
-- Purpose: Normalized relational tables for business identity, addresses,
--          contact points, tax policy, invoices, orders, production, shipping,
--          customers, notifications, storefront, business hours, and audit logs.
-- ==============================================================================

-- 1. Core Business Settings Table
CREATE TABLE IF NOT EXISTS public.business_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_name TEXT NOT NULL DEFAULT 'Print Studio',
  legal_business_name TEXT DEFAULT 'Your Print Business Private Limited',
  display_name TEXT DEFAULT 'Print Studio',
  tagline TEXT DEFAULT 'Custom printing for individuals and businesses',
  description TEXT DEFAULT 'High-quality custom printing, stationery, apparel, packaging, and business branding solutions with fast local turnaround.',
  logo_url TEXT,
  favicon_url TEXT,
  support_email TEXT DEFAULT 'hello@example.com',
  support_phone TEXT DEFAULT '+91 XXXXX XXXXX',
  website_url TEXT DEFAULT 'http://localhost:3000',
  currency_code VARCHAR(8) NOT NULL DEFAULT 'INR' CHECK (char_length(currency_code) >= 2),
  currency_symbol VARCHAR(8) NOT NULL DEFAULT '₹',
  timezone TEXT NOT NULL DEFAULT 'Asia/Kolkata' CHECK (char_length(timezone) > 0),
  locale TEXT NOT NULL DEFAULT 'en-IN',
  is_store_open BOOLEAN NOT NULL DEFAULT true,
  maintenance_mode BOOLEAN NOT NULL DEFAULT false,
  version INTEGER NOT NULL DEFAULT 1,
  updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_business_settings_updated ON public.business_settings(updated_at DESC);

-- 2. Business Addresses Table (Enforces single primary address via partial unique index)
CREATE TABLE IF NOT EXISTS public.business_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL DEFAULT 'Headquarters / Production Facility',
  address_line_1 TEXT NOT NULL,
  address_line_2 TEXT,
  landmark TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code VARCHAR(16) NOT NULL,
  country_code VARCHAR(8) NOT NULL DEFAULT 'IN',
  is_primary BOOLEAN NOT NULL DEFAULT true,
  version INTEGER NOT NULL DEFAULT 1,
  updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_business_addresses_primary ON public.business_addresses (is_primary) WHERE is_primary = true;

-- 3. Business Contact Points Table
CREATE TABLE IF NOT EXISTS public.business_contact_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(32) NOT NULL CHECK (type IN ('EMAIL', 'PHONE', 'WHATSAPP', 'OTHER')),
  value TEXT NOT NULL,
  label TEXT NOT NULL,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  is_public BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_contact_points_type ON public.business_contact_points(type);

-- 4. Tax Settings Table (Integer basis points: 1800 = 18.00%)
CREATE TABLE IF NOT EXISTS public.tax_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tax_enabled BOOLEAN NOT NULL DEFAULT true,
  tax_name TEXT NOT NULL DEFAULT 'GST (Goods and Services Tax)',
  gst_enabled BOOLEAN NOT NULL DEFAULT true,
  gst_rate_basis_points INTEGER NOT NULL DEFAULT 1800 CHECK (gst_rate_basis_points >= 0 AND gst_rate_basis_points <= 4000),
  gstin VARCHAR(32) DEFAULT '05AAACH7409R1ZZ',
  legal_name TEXT DEFAULT 'Your Print Business Private Limited',
  registered_address_id UUID REFERENCES public.business_addresses(id) ON DELETE SET NULL,
  invoice_tax_mode VARCHAR(16) NOT NULL DEFAULT 'inclusive' CHECK (invoice_tax_mode IN ('inclusive', 'exclusive')),
  place_of_supply_mode VARCHAR(32) NOT NULL DEFAULT 'DESTINATION_STATE' CHECK (place_of_supply_mode IN ('DESTINATION_STATE', 'ORIGIN_STATE')),
  version INTEGER NOT NULL DEFAULT 1,
  updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. Invoice Settings Table (Concurrency-safe sequence and branding snapshot rules)
CREATE TABLE IF NOT EXISTS public.invoice_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_prefix VARCHAR(16) NOT NULL DEFAULT 'INV',
  invoice_number_strategy VARCHAR(32) NOT NULL DEFAULT 'YEAR_ORDER_NUMBER' CHECK (invoice_number_strategy IN ('YEAR_ORDER_NUMBER', 'SEQUENTIAL_NUMBER', 'DATE_SEQUENTIAL')),
  next_invoice_sequence BIGINT NOT NULL DEFAULT 1001,
  display_business_name BOOLEAN NOT NULL DEFAULT true,
  display_gstin BOOLEAN NOT NULL DEFAULT true,
  display_address BOOLEAN NOT NULL DEFAULT true,
  display_email BOOLEAN NOT NULL DEFAULT true,
  display_phone BOOLEAN NOT NULL DEFAULT true,
  show_tax_breakdown BOOLEAN NOT NULL DEFAULT true,
  show_payment_reference BOOLEAN NOT NULL DEFAULT true,
  show_shipping BOOLEAN NOT NULL DEFAULT true,
  show_discount BOOLEAN NOT NULL DEFAULT true,
  footer_text TEXT DEFAULT 'This is a computer-generated GST tax invoice. No signature is required.',
  terms_text TEXT DEFAULT 'Payment due upon receipt. Goods once printed with approved artwork are non-returnable except for manufacturing defects.',
  version INTEGER NOT NULL DEFAULT 1,
  updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. Order Settings Table
CREATE TABLE IF NOT EXISTS public.order_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  allow_guest_checkout BOOLEAN NOT NULL DEFAULT true,
  require_customer_phone BOOLEAN NOT NULL DEFAULT true,
  require_customer_email BOOLEAN NOT NULL DEFAULT true,
  allow_order_cancellation BOOLEAN NOT NULL DEFAULT true,
  customer_cancellation_window_minutes INTEGER NOT NULL DEFAULT 60 CHECK (customer_cancellation_window_minutes >= 0),
  admin_cancellation_enabled BOOLEAN NOT NULL DEFAULT true,
  require_cancellation_reason BOOLEAN NOT NULL DEFAULT true,
  require_admin_cancellation_note BOOLEAN NOT NULL DEFAULT false,
  allow_reorder BOOLEAN NOT NULL DEFAULT true,
  allow_customer_order_edit BOOLEAN NOT NULL DEFAULT false,
  minimum_order_value_minor INTEGER NOT NULL DEFAULT 10000 CHECK (minimum_order_value_minor >= 0),
  maximum_order_value_minor INTEGER NOT NULL DEFAULT 50000000 CHECK (maximum_order_value_minor >= minimum_order_value_minor),
  version INTEGER NOT NULL DEFAULT 1,
  updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. Production Settings Table (Bounds: min <= max)
CREATE TABLE IF NOT EXISTS public.production_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  default_production_days_min INTEGER NOT NULL DEFAULT 2 CHECK (default_production_days_min >= 0 AND default_production_days_min <= 60),
  default_production_days_max INTEGER NOT NULL DEFAULT 3 CHECK (default_production_days_max >= default_production_days_min AND default_production_days_max <= 60),
  working_days_only BOOLEAN NOT NULL DEFAULT true,
  production_cutoff_enabled BOOLEAN NOT NULL DEFAULT true,
  production_cutoff_time VARCHAR(8) NOT NULL DEFAULT '14:00',
  same_day_available BOOLEAN NOT NULL DEFAULT true,
  same_day_cutoff_time VARCHAR(8) NOT NULL DEFAULT '11:00',
  prepress_required BOOLEAN NOT NULL DEFAULT true,
  quality_check_required BOOLEAN NOT NULL DEFAULT true,
  default_dispatch_delay_days INTEGER NOT NULL DEFAULT 0 CHECK (default_dispatch_delay_days >= 0),
  version INTEGER NOT NULL DEFAULT 1,
  updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. Shipping Settings Table (Money in integer paise: ₹99 = 9900 paise)
CREATE TABLE IF NOT EXISTS public.shipping_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipping_enabled BOOLEAN NOT NULL DEFAULT true,
  default_shipping_fee_minor INTEGER NOT NULL DEFAULT 9900 CHECK (default_shipping_fee_minor >= 0),
  free_shipping_enabled BOOLEAN NOT NULL DEFAULT true,
  free_shipping_threshold_minor INTEGER NOT NULL DEFAULT 150000 CHECK (free_shipping_threshold_minor >= 0),
  default_shipping_zone VARCHAR(32) NOT NULL DEFAULT 'DOMESTIC_IN',
  default_dispatch_postal_code VARCHAR(16) NOT NULL DEFAULT '248007',
  estimated_delivery_min_days INTEGER NOT NULL DEFAULT 3 CHECK (estimated_delivery_min_days >= 1),
  estimated_delivery_max_days INTEGER NOT NULL DEFAULT 5 CHECK (estimated_delivery_max_days >= estimated_delivery_min_days),
  shipping_calculation_mode VARCHAR(32) NOT NULL DEFAULT 'DYNAMIC_CARRIER' CHECK (shipping_calculation_mode IN ('FLAT_RATE', 'DYNAMIC_CARRIER', 'TIERED_WEIGHT')),
  version INTEGER NOT NULL DEFAULT 1,
  updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 9. Customer Settings Table
CREATE TABLE IF NOT EXISTS public.customer_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  allow_customer_accounts BOOLEAN NOT NULL DEFAULT true,
  allow_guest_checkout BOOLEAN NOT NULL DEFAULT true,
  require_email_verification BOOLEAN NOT NULL DEFAULT false,
  require_phone_verification BOOLEAN NOT NULL DEFAULT false,
  allow_marketing_opt_in BOOLEAN NOT NULL DEFAULT true,
  allow_customer_address_book BOOLEAN NOT NULL DEFAULT true,
  max_saved_addresses INTEGER NOT NULL DEFAULT 10 CHECK (max_saved_addresses >= 1 AND max_saved_addresses <= 50),
  version INTEGER NOT NULL DEFAULT 1,
  updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 10. Notification Settings Table
CREATE TABLE IF NOT EXISTS public.notification_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_confirmation_enabled BOOLEAN NOT NULL DEFAULT true,
  payment_confirmation_enabled BOOLEAN NOT NULL DEFAULT true,
  production_update_enabled BOOLEAN NOT NULL DEFAULT true,
  quality_update_enabled BOOLEAN NOT NULL DEFAULT true,
  dispatch_update_enabled BOOLEAN NOT NULL DEFAULT true,
  delivery_update_enabled BOOLEAN NOT NULL DEFAULT true,
  cancellation_update_enabled BOOLEAN NOT NULL DEFAULT true,
  refund_update_enabled BOOLEAN NOT NULL DEFAULT true,
  support_contact_enabled BOOLEAN NOT NULL DEFAULT true,
  version INTEGER NOT NULL DEFAULT 1,
  updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 11. Storefront Settings Table
CREATE TABLE IF NOT EXISTS public.storefront_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  storefront_enabled BOOLEAN NOT NULL DEFAULT true,
  maintenance_mode BOOLEAN NOT NULL DEFAULT false,
  maintenance_message TEXT DEFAULT 'We are currently performing scheduled maintenance. Please check back shortly.',
  announcement_enabled BOOLEAN NOT NULL DEFAULT true,
  announcement_text TEXT DEFAULT 'Fast local printing and express dispatch available on select custom products.',
  support_message TEXT DEFAULT 'Need custom bulk quotation? Our production studio team is available Mon–Sat.',
  show_delivery_estimate BOOLEAN NOT NULL DEFAULT true,
  show_contact_information BOOLEAN NOT NULL DEFAULT true,
  show_business_hours BOOLEAN NOT NULL DEFAULT true,
  version INTEGER NOT NULL DEFAULT 1,
  updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 12. Business Hours Table (Day of Week: 0=Sunday, 1=Monday ... 6=Saturday)
CREATE TABLE IF NOT EXISTS public.business_hours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  is_open BOOLEAN NOT NULL DEFAULT true,
  open_time VARCHAR(8) DEFAULT '10:00',
  close_time VARCHAR(8) DEFAULT '19:00',
  break_start VARCHAR(8),
  break_end VARCHAR(8),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT uk_business_hours_day UNIQUE (day_of_week)
);

CREATE INDEX IF NOT EXISTS idx_business_hours_day ON public.business_hours(day_of_week);

-- 13. System Audit Logs Table (Tracks administrative configuration and state changes)
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  admin_email TEXT,
  entity_type VARCHAR(64) NOT NULL, -- 'BUSINESS_SETTINGS', 'TAX_SETTINGS', 'SHIPPING_SETTINGS', 'ORDER_STATUS', etc.
  entity_id TEXT NOT NULL,
  action VARCHAR(64) NOT NULL, -- 'UPDATE', 'CREATE', 'CANCEL', 'REFUND', 'MAINTENANCE_TOGGLE'
  old_state JSONB,
  new_state JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON public.audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

-- ==============================================================================
-- 14. Seed Safe Canonical Defaults (Only if tables are empty)
-- ==============================================================================

-- 14.1 Business Settings
INSERT INTO public.business_settings (
  store_name,
  legal_business_name,
  display_name,
  tagline,
  description,
  support_email,
  support_phone,
  website_url,
  currency_code,
  currency_symbol,
  timezone,
  locale,
  is_store_open,
  maintenance_mode
)
SELECT
  'Print Studio',
  'Your Print Business Private Limited',
  'Print Studio',
  'Custom printing for individuals and businesses',
  'High-quality custom printing, stationery, apparel, packaging, and business branding solutions with fast local turnaround.',
  'hello@example.com',
  '+91 XXXXX XXXXX',
  'http://localhost:3000',
  'INR',
  '₹',
  'Asia/Kolkata',
  'en-IN',
  true,
  false
WHERE NOT EXISTS (SELECT 1 FROM public.business_settings);

-- 14.2 Business Address
INSERT INTO public.business_addresses (
  label,
  address_line_1,
  address_line_2,
  landmark,
  city,
  state,
  postal_code,
  country_code,
  is_primary
)
SELECT
  'Headquarters & Main Print Facility',
  'Balaji Complex, Prem Nagar',
  'Chakrata Road',
  'Near Subhash Chowk',
  'Dehradun',
  'Uttarakhand',
  '248007',
  'IN',
  true
WHERE NOT EXISTS (SELECT 1 FROM public.business_addresses);

-- 14.3 Contact Points
INSERT INTO public.business_contact_points (type, value, label, is_primary, is_public)
SELECT 'PHONE', '+91 XXXXX XXXXX', 'Customer Support Desk', true, true
WHERE NOT EXISTS (SELECT 1 FROM public.business_contact_points WHERE type = 'PHONE');

INSERT INTO public.business_contact_points (type, value, label, is_primary, is_public)
SELECT 'EMAIL', 'hello@example.com', 'General Inquiries & Orders', true, true
WHERE NOT EXISTS (SELECT 1 FROM public.business_contact_points WHERE type = 'EMAIL');

INSERT INTO public.business_contact_points (type, value, label, is_primary, is_public)
SELECT 'WHATSAPP', '910000000000', 'Live Proofing & Pre-Press WhatsApp', true, true
WHERE NOT EXISTS (SELECT 1 FROM public.business_contact_points WHERE type = 'WHATSAPP');

-- 14.4 Tax Settings
INSERT INTO public.tax_settings (
  tax_enabled,
  tax_name,
  gst_enabled,
  gst_rate_basis_points,
  gstin,
  legal_name,
  invoice_tax_mode,
  place_of_supply_mode
)
SELECT
  true,
  'GST (Goods and Services Tax)',
  true,
  1800,
  '05AAACH7409R1ZZ',
  'Your Print Business Private Limited',
  'inclusive',
  'DESTINATION_STATE'
WHERE NOT EXISTS (SELECT 1 FROM public.tax_settings);

-- 14.5 Invoice Settings
INSERT INTO public.invoice_settings (
  invoice_prefix,
  invoice_number_strategy,
  next_invoice_sequence,
  display_business_name,
  display_gstin,
  display_address,
  display_email,
  display_phone,
  show_tax_breakdown,
  show_payment_reference,
  show_shipping,
  show_discount,
  footer_text,
  terms_text
)
SELECT
  'INV',
  'YEAR_ORDER_NUMBER',
  1001,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  'This is a computer-generated GST tax invoice. No signature is required.',
  'Payment due upon receipt. Goods once printed with approved artwork are non-returnable except for manufacturing defects.'
WHERE NOT EXISTS (SELECT 1 FROM public.invoice_settings);

-- 14.6 Order Settings
INSERT INTO public.order_settings (
  allow_guest_checkout,
  require_customer_phone,
  require_customer_email,
  allow_order_cancellation,
  customer_cancellation_window_minutes,
  admin_cancellation_enabled,
  require_cancellation_reason,
  require_admin_cancellation_note,
  allow_reorder,
  allow_customer_order_edit,
  minimum_order_value_minor,
  maximum_order_value_minor
)
SELECT
  true,
  true,
  true,
  true,
  60,
  true,
  true,
  false,
  true,
  false,
  10000,
  50000000
WHERE NOT EXISTS (SELECT 1 FROM public.order_settings);

-- 14.7 Production Settings
INSERT INTO public.production_settings (
  default_production_days_min,
  default_production_days_max,
  working_days_only,
  production_cutoff_enabled,
  production_cutoff_time,
  same_day_available,
  same_day_cutoff_time,
  prepress_required,
  quality_check_required,
  default_dispatch_delay_days
)
SELECT
  2,
  3,
  true,
  true,
  '14:00',
  true,
  '11:00',
  true,
  true,
  0
WHERE NOT EXISTS (SELECT 1 FROM public.production_settings);

-- 14.8 Shipping Settings
INSERT INTO public.shipping_settings (
  shipping_enabled,
  default_shipping_fee_minor,
  free_shipping_enabled,
  free_shipping_threshold_minor,
  default_shipping_zone,
  default_dispatch_postal_code,
  estimated_delivery_min_days,
  estimated_delivery_max_days,
  shipping_calculation_mode
)
SELECT
  true,
  9900,
  true,
  150000,
  'DOMESTIC_IN',
  '248007',
  3,
  5,
  'DYNAMIC_CARRIER'
WHERE NOT EXISTS (SELECT 1 FROM public.shipping_settings);

-- 14.9 Customer Settings
INSERT INTO public.customer_settings (
  allow_customer_accounts,
  allow_guest_checkout,
  require_email_verification,
  require_phone_verification,
  allow_marketing_opt_in,
  allow_customer_address_book,
  max_saved_addresses
)
SELECT
  true,
  true,
  false,
  false,
  true,
  true,
  10
WHERE NOT EXISTS (SELECT 1 FROM public.customer_settings);

-- 14.10 Notification Settings
INSERT INTO public.notification_settings (
  order_confirmation_enabled,
  payment_confirmation_enabled,
  production_update_enabled,
  quality_update_enabled,
  dispatch_update_enabled,
  delivery_update_enabled,
  cancellation_update_enabled,
  refund_update_enabled,
  support_contact_enabled
)
SELECT
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true
WHERE NOT EXISTS (SELECT 1 FROM public.notification_settings);

-- 14.11 Storefront Settings
INSERT INTO public.storefront_settings (
  storefront_enabled,
  maintenance_mode,
  maintenance_message,
  announcement_enabled,
  announcement_text,
  support_message,
  show_delivery_estimate,
  show_contact_information,
  show_business_hours
)
SELECT
  true,
  false,
  'We are currently performing scheduled maintenance. Please check back shortly.',
  true,
  'Fast local printing and express dispatch available on select custom products.',
  'Need custom bulk quotation? Our production studio team is available Mon–Sat.',
  true,
  true,
  true
WHERE NOT EXISTS (SELECT 1 FROM public.storefront_settings);

-- 14.12 Business Hours (Monday to Saturday Open, Sunday Closed)
INSERT INTO public.business_hours (day_of_week, is_open, open_time, close_time)
VALUES
  (0, false, '10:00', '19:00'), -- Sunday
  (1, true, '10:00', '19:00'),  -- Monday
  (2, true, '10:00', '19:00'),  -- Tuesday
  (3, true, '10:00', '19:00'),  -- Wednesday
  (4, true, '10:00', '19:00'),  -- Thursday
  (5, true, '10:00', '19:00'),  -- Friday
  (6, true, '10:00', '18:00')   -- Saturday
ON CONFLICT (day_of_week) DO NOTHING;

-- ==============================================================================
-- 15. Row Level Security (RLS) & Security Grants
-- ==============================================================================

-- Enable RLS across all settings tables
ALTER TABLE public.business_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_contact_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tax_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.production_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.storefront_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 1. Admins Full Access Policies
DROP POLICY IF EXISTS "Admins have full access to business_settings" ON public.business_settings;
CREATE POLICY "Admins have full access to business_settings" ON public.business_settings
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins have full access to business_addresses" ON public.business_addresses;
CREATE POLICY "Admins have full access to business_addresses" ON public.business_addresses
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins have full access to business_contact_points" ON public.business_contact_points;
CREATE POLICY "Admins have full access to business_contact_points" ON public.business_contact_points
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins have full access to tax_settings" ON public.tax_settings;
CREATE POLICY "Admins have full access to tax_settings" ON public.tax_settings
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins have full access to invoice_settings" ON public.invoice_settings;
CREATE POLICY "Admins have full access to invoice_settings" ON public.invoice_settings
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins have full access to order_settings" ON public.order_settings;
CREATE POLICY "Admins have full access to order_settings" ON public.order_settings
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins have full access to production_settings" ON public.production_settings;
CREATE POLICY "Admins have full access to production_settings" ON public.production_settings
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins have full access to shipping_settings" ON public.shipping_settings;
CREATE POLICY "Admins have full access to shipping_settings" ON public.shipping_settings
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins have full access to customer_settings" ON public.customer_settings;
CREATE POLICY "Admins have full access to customer_settings" ON public.customer_settings
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins have full access to notification_settings" ON public.notification_settings;
CREATE POLICY "Admins have full access to notification_settings" ON public.notification_settings
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins have full access to storefront_settings" ON public.storefront_settings;
CREATE POLICY "Admins have full access to storefront_settings" ON public.storefront_settings
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins have full access to business_hours" ON public.business_hours;
CREATE POLICY "Admins have full access to business_hours" ON public.business_hours
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins have full access to audit_logs" ON public.audit_logs;
CREATE POLICY "Admins have full access to audit_logs" ON public.audit_logs
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 2. Public Read Policies for Storefront-consumed Tables
DROP POLICY IF EXISTS "Public can read business_settings" ON public.business_settings;
CREATE POLICY "Public can read business_settings" ON public.business_settings
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public can read business_addresses" ON public.business_addresses;
CREATE POLICY "Public can read business_addresses" ON public.business_addresses
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public can read public contact points" ON public.business_contact_points;
CREATE POLICY "Public can read public contact points" ON public.business_contact_points
  FOR SELECT TO anon, authenticated USING (is_public = true);

DROP POLICY IF EXISTS "Public can read tax_settings" ON public.tax_settings;
CREATE POLICY "Public can read tax_settings" ON public.tax_settings
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public can read shipping_settings" ON public.shipping_settings;
CREATE POLICY "Public can read shipping_settings" ON public.shipping_settings
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public can read storefront_settings" ON public.storefront_settings;
CREATE POLICY "Public can read storefront_settings" ON public.storefront_settings
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public can read business_hours" ON public.business_hours;
CREATE POLICY "Public can read business_hours" ON public.business_hours
  FOR SELECT TO anon, authenticated USING (true);
