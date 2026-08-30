-- ==============================================================================
-- PHASE 10H: PRODUCTION BUSINESS SETTINGS & STORE CONFIGURATION SCHEMA
-- Project: print-studio-production (vsbexmohwbhlyfinobnv)
-- Purpose: Canonical business settings record with strict types, constraints,
--          optimistic concurrency versioning, RLS, and secure admin grants.
-- ==============================================================================

-- 1. Create Business Settings Table
CREATE TABLE IF NOT EXISTS public.business_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- SECTION A: Business Identity
  business_name TEXT NOT NULL DEFAULT 'Your Print Business',
  business_short_name TEXT NOT NULL DEFAULT 'Print Studio',
  legal_business_name TEXT NOT NULL DEFAULT 'Your Print Business Private Limited',
  logo_url TEXT,
  tagline TEXT DEFAULT 'Custom printing for individuals and businesses',
  description TEXT DEFAULT 'High-quality custom printing, stationery, apparel, packaging, and business branding solutions with fast local turnaround.',
  email TEXT NOT NULL DEFAULT 'hello@example.com',
  phone TEXT NOT NULL DEFAULT '+91 XXXXX XXXXX',
  whatsapp_number TEXT DEFAULT '910000000000',
  address_line_1 TEXT NOT NULL DEFAULT 'Your Business Address',
  address_line_2 TEXT DEFAULT 'Commercial Complex',
  city TEXT NOT NULL DEFAULT 'Your City',
  state TEXT NOT NULL DEFAULT 'Your State',
  postal_code TEXT NOT NULL DEFAULT '248007',
  country TEXT NOT NULL DEFAULT 'India',
  
  -- SECTION B: Tax & GST Settings
  gst_enabled BOOLEAN NOT NULL DEFAULT true,
  gstin TEXT DEFAULT '05AAACH7409R1ZZ',
  default_gst_rate_bps INTEGER NOT NULL DEFAULT 1800 CHECK (default_gst_rate_bps >= 0 AND default_gst_rate_bps <= 4000), -- 1800 = 18.00%
  tax_display_mode VARCHAR(16) NOT NULL DEFAULT 'inclusive' CHECK (tax_display_mode IN ('inclusive', 'exclusive')),
  default_sac_hsn TEXT DEFAULT '998912',
  
  -- SECTION C: Store Operations & Status
  store_status VARCHAR(16) NOT NULL DEFAULT 'OPEN' CHECK (store_status IN ('OPEN', 'PAUSED')),
  store_pause_message TEXT DEFAULT 'We are temporarily not accepting new orders. Please check back shortly.',
  accept_new_orders BOOLEAN NOT NULL DEFAULT true,
  checkout_enabled BOOLEAN NOT NULL DEFAULT true,
  
  -- SECTION D: Order Limits (in integer paise)
  minimum_order_value_minor INTEGER NOT NULL DEFAULT 10000 CHECK (minimum_order_value_minor >= 0), -- ₹100.00
  maximum_order_value_minor INTEGER NOT NULL DEFAULT 50000000 CHECK (maximum_order_value_minor >= minimum_order_value_minor), -- ₹5,00,000.00
  allow_customer_notes BOOLEAN NOT NULL DEFAULT true,
  
  -- SECTION E: Shipping & Delivery (in integer paise)
  shipping_enabled BOOLEAN NOT NULL DEFAULT true,
  default_shipping_charge_minor INTEGER NOT NULL DEFAULT 9900 CHECK (default_shipping_charge_minor >= 0), -- ₹99.00
  free_shipping_threshold_minor INTEGER NOT NULL DEFAULT 150000 CHECK (free_shipping_threshold_minor >= 0), -- ₹1,500.00
  delivery_estimate_text TEXT DEFAULT '3–5 business days across India',
  
  -- SECTION F: Customer Support & Communication
  support_email TEXT NOT NULL DEFAULT 'hello@example.com',
  support_phone TEXT NOT NULL DEFAULT '+91 XXXXX XXXXX',
  support_hours TEXT DEFAULT 'Mon–Sat: 10:00 AM – 7:00 PM',
  whatsapp_floating_enabled BOOLEAN NOT NULL DEFAULT true,
  
  -- SECTION G: Storefront Announcement
  announcement_enabled BOOLEAN NOT NULL DEFAULT true,
  announcement_message TEXT DEFAULT 'Fast local printing and express dispatch available on select products',
  announcement_link TEXT DEFAULT '/same-day',
  
  -- SECTION H: Invoice & Financial Policy
  invoice_prefix VARCHAR(16) NOT NULL DEFAULT 'INV',
  invoice_footer TEXT DEFAULT 'Thank you for printing with us. For inquiries or reorders, contact support.',
  
  -- SECTION I: SEO & Store Metadata
  site_title TEXT NOT NULL DEFAULT 'Print Studio · High-Quality Custom Online Printing & Branding',
  site_description TEXT NOT NULL DEFAULT 'High-quality custom printing for visiting cards, apparel, packaging, brochures, stickers, banners, and personalized corporate gifts.',
  og_image_url TEXT,
  canonical_site_url TEXT NOT NULL DEFAULT 'http://localhost:3000',
  
  -- SECTION J: Concurrency & Auditability
  version INTEGER NOT NULL DEFAULT 1,
  updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index for instant single-row lookup
CREATE INDEX IF NOT EXISTS idx_business_settings_updated ON public.business_settings(updated_at DESC);

-- Updated_at trigger
DROP TRIGGER IF EXISTS set_business_settings_updated_at ON public.business_settings;
CREATE TRIGGER set_business_settings_updated_at
BEFORE UPDATE ON public.business_settings
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 2. Seed Default Canonical Business Settings Record (if table is empty)
INSERT INTO public.business_settings (
  business_name,
  business_short_name,
  legal_business_name,
  email,
  phone,
  whatsapp_number,
  address_line_1,
  city,
  state,
  postal_code,
  country,
  gst_enabled,
  gstin,
  default_gst_rate_bps,
  tax_display_mode,
  default_sac_hsn,
  store_status,
  accept_new_orders,
  checkout_enabled,
  minimum_order_value_minor,
  maximum_order_value_minor,
  shipping_enabled,
  default_shipping_charge_minor,
  free_shipping_threshold_minor,
  delivery_estimate_text,
  support_email,
  support_phone,
  support_hours,
  announcement_enabled,
  announcement_message,
  invoice_prefix,
  invoice_footer,
  site_title,
  site_description,
  canonical_site_url
)
SELECT
  'Your Print Business',
  'Print Studio',
  'Your Print Business Private Limited',
  'hello@example.com',
  '+91 XXXXX XXXXX',
  '910000000000',
  'Balaji Complex, Prem Nagar',
  'Dehradun',
  'Uttarakhand',
  '248007',
  'India',
  true,
  '05AAACH7409R1ZZ',
  1800,
  'inclusive',
  '998912',
  'OPEN',
  true,
  true,
  10000,
  50000000,
  true,
  9900,
  150000,
  '3–5 business days across India',
  'hello@example.com',
  '+91 XXXXX XXXXX',
  'Mon–Sat: 10:00 AM – 7:00 PM',
  true,
  'Fast local printing and express dispatch on select products',
  'INV',
  'Computer generated invoice. No signature required.',
  'Print Studio · High-Quality Custom Online Printing & Branding',
  'High-quality custom printing for visiting cards, apparel, packaging, brochures, and gifts.',
  'http://localhost:3000'
WHERE NOT EXISTS (SELECT 1 FROM public.business_settings);

-- 3. Row Level Security (RLS)
ALTER TABLE public.business_settings ENABLE ROW LEVEL SECURITY;

-- Admins full access (SELECT, INSERT, UPDATE)
CREATE POLICY "Admins have full access to business settings" ON public.business_settings
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Customers and unauthenticated public storefront can read safe settings
CREATE POLICY "Public storefront can read settings" ON public.business_settings
  FOR SELECT TO anon, authenticated USING (true);
