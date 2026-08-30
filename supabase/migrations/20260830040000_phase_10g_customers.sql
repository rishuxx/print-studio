-- ==============================================================================
-- PHASE 10G: COMPLETE PRODUCTION CUSTOMER MANAGEMENT, CRM & IDENTITY SCHEMA
-- Project: print-studio-production (vsbexmohwbhlyfinobnv)
-- Purpose: Normalised Customers, Identities, Addresses, B2B Profiles, Segments,
--          Tags, Internal Notes, Activity Events, Account Controls, Privacy Requests,
--          Consents, Duplicate Detection & Atomic Merge with Full RLS
-- ==============================================================================

-- 0. EXTENSIONS & UTILITIES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Customer number sequence
CREATE SEQUENCE IF NOT EXISTS public.customer_number_seq START WITH 1001;

-- Function to generate human-readable customer number: CUS-001001
CREATE OR REPLACE FUNCTION public.generate_customer_number()
RETURNS TEXT AS $$
BEGIN
  RETURN 'CUS-' || LPAD(nextval('public.customer_number_seq')::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- 1. CANONICAL CUSTOMERS TABLE
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_number TEXT UNIQUE NOT NULL DEFAULT public.generate_customer_number(),
  customer_type VARCHAR(32) NOT NULL DEFAULT 'individual' CHECK (
    customer_type IN ('individual', 'business', 'guest', 'registered', 'wholesale', 'corporate')
  ),
  account_status VARCHAR(32) NOT NULL DEFAULT 'active' CHECK (
    account_status IN ('guest', 'pending', 'active', 'restricted', 'suspended', 'deactivated', 'anonymization_pending', 'anonymized')
  ),
  first_name TEXT,
  last_name TEXT,
  display_name TEXT NOT NULL,
  email TEXT NOT NULL,
  normalized_email TEXT NOT NULL,
  phone TEXT,
  normalized_phone TEXT,
  company_name TEXT,
  gstin TEXT,
  tax_profile JSONB DEFAULT '{"taxExempt": false, "stateCode": null}'::jsonb,
  email_verified_at TIMESTAMPTZ,
  phone_verified_at TIMESTAMPTZ,
  last_login_at TIMESTAMPTZ,
  first_order_at TIMESTAMPTZ,
  last_order_at TIMESTAMPTZ,
  order_count INTEGER NOT NULL DEFAULT 0 CHECK (order_count >= 0),
  completed_order_count INTEGER NOT NULL DEFAULT 0 CHECK (completed_order_count >= 0),
  cancelled_order_count INTEGER NOT NULL DEFAULT 0 CHECK (cancelled_order_count >= 0),
  lifetime_value_minor BIGINT NOT NULL DEFAULT 0 CHECK (lifetime_value_minor >= 0),
  paid_value_minor BIGINT NOT NULL DEFAULT 0 CHECK (paid_value_minor >= 0),
  refunded_value_minor BIGINT NOT NULL DEFAULT 0 CHECK (refunded_value_minor >= 0),
  average_order_value_minor BIGINT NOT NULL DEFAULT 0 CHECK (average_order_value_minor >= 0),
  currency VARCHAR(8) NOT NULL DEFAULT 'INR',
  marketing_status VARCHAR(32) NOT NULL DEFAULT 'subscribed' CHECK (
    marketing_status IN ('subscribed', 'unsubscribed', 'pending_opt_in', 'restricted')
  ),
  risk_status VARCHAR(32) NOT NULL DEFAULT 'normal' CHECK (
    risk_status IN ('normal', 'review', 'elevated', 'blocked')
  ),
  customer_score INTEGER NOT NULL DEFAULT 100 CHECK (customer_score >= 0 AND customer_score <= 1000),
  notes_count INTEGER NOT NULL DEFAULT 0 CHECK (notes_count >= 0),
  version INTEGER NOT NULL DEFAULT 1,
  anonymized_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexes for customers
CREATE INDEX IF NOT EXISTS idx_customers_auth_user_id ON public.customers(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_customers_customer_number ON public.customers(customer_number);
CREATE INDEX IF NOT EXISTS idx_customers_normalized_email ON public.customers(normalized_email);
CREATE INDEX IF NOT EXISTS idx_customers_normalized_phone ON public.customers(normalized_phone);
CREATE INDEX IF NOT EXISTS idx_customers_account_status ON public.customers(account_status);
CREATE INDEX IF NOT EXISTS idx_customers_customer_type ON public.customers(customer_type);
CREATE INDEX IF NOT EXISTS idx_customers_risk_status ON public.customers(risk_status);
CREATE INDEX IF NOT EXISTS idx_customers_lifetime_value ON public.customers(lifetime_value_minor DESC);
CREATE INDEX IF NOT EXISTS idx_customers_created_at ON public.customers(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_customers_last_order_at ON public.customers(last_order_at DESC);

-- Trigram search indexes for fuzzy matching
CREATE INDEX IF NOT EXISTS idx_customers_display_name_trgm ON public.customers USING gin (display_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_customers_company_name_trgm ON public.customers USING gin (company_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_customers_normalized_email_trgm ON public.customers USING gin (normalized_email gin_trgm_ops);

-- Updated_at trigger
DROP TRIGGER IF EXISTS set_customers_updated_at ON public.customers;
CREATE TRIGGER set_customers_updated_at
BEFORE UPDATE ON public.customers
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 2. CUSTOMER IDENTITIES TABLE
CREATE TABLE IF NOT EXISTS public.customer_identities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  identity_type VARCHAR(32) NOT NULL CHECK (
    identity_type IN ('email', 'phone', 'external_auth', 'guest_checkout', 'business_tax_id')
  ),
  identity_value_normalized TEXT NOT NULL,
  identity_value_hash TEXT,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  verified_at TIMESTAMPTZ,
  source VARCHAR(64) DEFAULT 'web_storefront',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT uk_customer_identity UNIQUE (customer_id, identity_type, identity_value_normalized)
);

CREATE INDEX IF NOT EXISTS idx_customer_identities_customer ON public.customer_identities(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_identities_lookup ON public.customer_identities(identity_type, identity_value_normalized);

-- 3. CUSTOMER ADDRESSES TABLE
CREATE TABLE IF NOT EXISTS public.customer_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  address_type VARCHAR(32) NOT NULL DEFAULT 'both' CHECK (
    address_type IN ('shipping', 'billing', 'both')
  ),
  recipient_name TEXT NOT NULL,
  company_name TEXT,
  address_line_1 TEXT NOT NULL,
  address_line_2 TEXT,
  landmark TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country_code VARCHAR(8) NOT NULL DEFAULT 'IN',
  phone TEXT NOT NULL,
  is_default_shipping BOOLEAN NOT NULL DEFAULT false,
  is_default_billing BOOLEAN NOT NULL DEFAULT false,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  verification_source VARCHAR(64),
  version INTEGER NOT NULL DEFAULT 1,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_customer_addresses_customer ON public.customer_addresses(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_addresses_defaults ON public.customer_addresses(customer_id, is_default_shipping, is_default_billing);

-- 4. B2B / BUSINESS PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.customer_business_profiles (
  customer_id UUID PRIMARY KEY REFERENCES public.customers(id) ON DELETE CASCADE,
  legal_name TEXT NOT NULL,
  trade_name TEXT,
  gstin TEXT,
  pan_last4 VARCHAR(4),
  business_type VARCHAR(64) NOT NULL DEFAULT 'Private Limited' CHECK (
    business_type IN ('Proprietorship', 'Partnership', 'Private Limited', 'Public Limited', 'LLP', 'Freelancer / Studio', 'NGO / Trust')
  ),
  industry VARCHAR(64),
  website TEXT,
  billing_email TEXT NOT NULL,
  billing_phone TEXT,
  credit_terms VARCHAR(32) NOT NULL DEFAULT 'prepaid' CHECK (
    credit_terms IN ('prepaid', 'net_7', 'net_15', 'net_30', 'net_45', 'custom')
  ),
  credit_limit_minor BIGINT NOT NULL DEFAULT 0 CHECK (credit_limit_minor >= 0),
  outstanding_balance_minor BIGINT NOT NULL DEFAULT 0 CHECK (outstanding_balance_minor >= 0),
  payment_terms TEXT,
  purchase_order_required BOOLEAN NOT NULL DEFAULT false,
  account_manager_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  approval_status VARCHAR(32) NOT NULL DEFAULT 'approved' CHECK (
    approval_status IN ('pending_verification', 'approved', 'rejected', 'under_review')
  ),
  version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. SEGMENTS & SEGMENT MEMBERSHIPS
CREATE TABLE IF NOT EXISTS public.customer_segments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  code VARCHAR(64) NOT NULL UNIQUE,
  description TEXT,
  segment_type VARCHAR(32) NOT NULL DEFAULT 'rule_based' CHECK (
    segment_type IN ('rule_based', 'manual', 'rfm_tier')
  ),
  rule_definition JSONB DEFAULT '{}'::jsonb,
  status VARCHAR(32) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived', 'draft')),
  priority INTEGER NOT NULL DEFAULT 100,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.customer_segment_memberships (
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  segment_id UUID NOT NULL REFERENCES public.customer_segments(id) ON DELETE CASCADE,
  membership_source VARCHAR(32) NOT NULL DEFAULT 'automated_rule' CHECK (
    membership_source IN ('automated_rule', 'manual_assignment', 'order_trigger')
  ),
  entered_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  exited_at TIMESTAMPTZ,
  last_evaluated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  PRIMARY KEY (customer_id, segment_id)
);

CREATE INDEX IF NOT EXISTS idx_segment_memberships_segment ON public.customer_segment_memberships(segment_id);

-- 6. CUSTOMER TAGS & TAG LINKS
CREATE TABLE IF NOT EXISTS public.customer_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug VARCHAR(64) NOT NULL UNIQUE,
  description TEXT,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.customer_tag_links (
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.customer_tags(id) ON DELETE CASCADE,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  PRIMARY KEY (customer_id, tag_id)
);

CREATE INDEX IF NOT EXISTS idx_customer_tag_links_tag ON public.customer_tag_links(tag_id);

-- 7. INTERNAL CUSTOMER NOTES TABLE
CREATE TABLE IF NOT EXISTS public.customer_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL DEFAULT 'Staff',
  note_type VARCHAR(32) NOT NULL DEFAULT 'general' CHECK (
    note_type IN ('general', 'follow_up', 'billing', 'artwork', 'complaint', 'vip_instruction')
  ),
  content TEXT NOT NULL,
  visibility VARCHAR(32) NOT NULL DEFAULT 'internal' CHECK (visibility IN ('internal', 'restricted')),
  version INTEGER NOT NULL DEFAULT 1,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_customer_notes_customer ON public.customer_notes(customer_id, created_at DESC);

-- 8. CUSTOMER ACTIVITY TIMELINE EVENTS
CREATE TABLE IF NOT EXISTS public.customer_activity_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  event_type VARCHAR(64) NOT NULL,
  event_source VARCHAR(64) NOT NULL DEFAULT 'system',
  actor_type VARCHAR(32) NOT NULL DEFAULT 'system' CHECK (
    actor_type IN ('customer', 'admin', 'system', 'gateway_webhook')
  ),
  actor_id UUID,
  entity_type VARCHAR(64),
  entity_id TEXT,
  summary TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_customer_activity_customer ON public.customer_activity_events(customer_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_customer_activity_type ON public.customer_activity_events(event_type);

-- 9. CUSTOMER ACCOUNT CONTROLS TABLE
CREATE TABLE IF NOT EXISTS public.customer_account_controls (
  customer_id UUID PRIMARY KEY REFERENCES public.customers(id) ON DELETE CASCADE,
  login_enabled BOOLEAN NOT NULL DEFAULT true,
  checkout_enabled BOOLEAN NOT NULL DEFAULT true,
  ordering_enabled BOOLEAN NOT NULL DEFAULT true,
  marketing_enabled BOOLEAN NOT NULL DEFAULT true,
  reason_code VARCHAR(64),
  reason TEXT,
  expires_at TIMESTAMPTZ,
  set_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 10. PRIVACY REQUESTS & DPDP CONSENT TABLES
CREATE TABLE IF NOT EXISTS public.customer_privacy_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  request_type VARCHAR(32) NOT NULL CHECK (
    request_type IN ('access', 'correction', 'withdrawal', 'deletion', 'anonymization', 'restriction')
  ),
  status VARCHAR(32) NOT NULL DEFAULT 'submitted' CHECK (
    status IN ('submitted', 'identity_verification_required', 'verified', 'in_review', 'approved', 'rejected', 'processing', 'completed', 'cancelled')
  ),
  requested_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  due_at TIMESTAMPTZ NOT NULL DEFAULT (timezone('utc'::text, now()) + INTERVAL '30 days'),
  completed_at TIMESTAMPTZ,
  completed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reason TEXT,
  resolution_notes TEXT,
  verification_method VARCHAR(64) DEFAULT 'otp_verification',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_customer_privacy_requests ON public.customer_privacy_requests(customer_id, status);

CREATE TABLE IF NOT EXISTS public.customer_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  consent_type VARCHAR(64) NOT NULL,
  purpose TEXT NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'granted' CHECK (status IN ('granted', 'withdrawn', 'expired')),
  policy_version VARCHAR(32) NOT NULL DEFAULT 'v1.0-2026',
  source VARCHAR(64) NOT NULL DEFAULT 'web_consent_banner',
  ip_hash TEXT,
  granted_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  withdrawn_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_customer_consents_customer ON public.customer_consents(customer_id);

-- 11. DUPLICATE DETECTION & MERGE AUDIT TABLES
CREATE TABLE IF NOT EXISTS public.customer_duplicate_candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_a_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  customer_b_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  match_score INTEGER NOT NULL CHECK (match_score >= 0 AND match_score <= 100),
  match_reasons JSONB NOT NULL DEFAULT '[]'::jsonb,
  status VARCHAR(32) NOT NULL DEFAULT 'pending' CHECK (
    status IN ('pending', 'confirmed_duplicate', 'not_duplicate', 'merged', 'ignored')
  ),
  reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  resolution TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT uk_duplicate_pair UNIQUE (customer_a_id, customer_b_id),
  CONSTRAINT chk_no_self_duplicate CHECK (customer_a_id <> customer_b_id)
);

CREATE TABLE IF NOT EXISTS public.customer_merge_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_customer_id UUID NOT NULL,
  target_customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
  performed_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  reason TEXT NOT NULL,
  snapshot JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 12. SEED DEFAULT SYSTEM SEGMENTS & TAGS
INSERT INTO public.customer_segments (name, code, description, segment_type, rule_definition, priority)
VALUES 
  ('All Customers', 'all_customers', 'Universal baseline segment containing all active and guest customers', 'rule_based', '{"type": "universal"}'::jsonb, 10),
  ('High-Value VIPs', 'high_value_vip', 'Customers with lifetime value exceeding ₹10,000 across multiple orders', 'rule_based', '{"min_ltv_minor": 1000000, "min_orders": 2}'::jsonb, 20),
  ('Repeat Buyers', 'repeat_buyers', 'Customers with 2 or more confirmed and delivered orders', 'rule_based', '{"min_orders": 2}'::jsonb, 30),
  ('B2B Corporate Accounts', 'b2b_corporate', 'Verified commercial businesses with GSTIN tax profiles', 'rule_based', '{"customer_type": "business"}'::jsonb, 40),
  ('At-Risk Inactive', 'at_risk_inactive', 'Previous customers with no order in the last 90 days', 'rule_based', '{"inactivity_days": 90}'::jsonb, 50)
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.customer_tags (name, slug, description)
VALUES 
  ('VIP Client', 'vip-client', 'High priority account requiring dedicated press supervisor review'),
  ('Corporate Bulk', 'corporate-bulk', 'Orders eligible for bulk corporate packing and split shipping'),
  ('Pre-Press Review', 'pre-press-review', 'Customer requires proof PDF approvals before press run'),
  ('Payment Verified', 'payment-verified', 'Cleared multiple high-volume transactions with zero chargebacks')
ON CONFLICT (slug) DO NOTHING;

-- 13. ENABLE ROW LEVEL SECURITY (RLS) ON ALL 12 CUSTOMER TABLES
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_identities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_business_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_segment_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_tag_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_activity_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_account_controls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_privacy_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_duplicate_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_merge_events ENABLE ROW LEVEL SECURITY;

-- 14. RLS POLICIES FOR ADMINS & CUSTOMERS

-- Admins full access to all customer tables
CREATE POLICY "Admins have full access to customers" ON public.customers
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admins have full access to customer identities" ON public.customer_identities
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admins have full access to customer addresses" ON public.customer_addresses
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admins have full access to customer business profiles" ON public.customer_business_profiles
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admins have full access to segments" ON public.customer_segments
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admins have full access to segment memberships" ON public.customer_segment_memberships
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admins have full access to customer tags" ON public.customer_tags
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admins have full access to tag links" ON public.customer_tag_links
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admins have full access to customer notes" ON public.customer_notes
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admins have full access to customer activity" ON public.customer_activity_events
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admins have full access to account controls" ON public.customer_account_controls
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admins have full access to privacy requests" ON public.customer_privacy_requests
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admins have full access to customer consents" ON public.customer_consents
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admins have full access to duplicates" ON public.customer_duplicate_candidates
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admins have full access to merge events" ON public.customer_merge_events
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Customers self-access policies
CREATE POLICY "Customers can view own customer record" ON public.customers
  FOR SELECT TO authenticated USING (auth_user_id = auth.uid());

CREATE POLICY "Customers can update own customer record" ON public.customers
  FOR UPDATE TO authenticated USING (auth_user_id = auth.uid()) WITH CHECK (auth_user_id = auth.uid());

CREATE POLICY "Customers can view own addresses" ON public.customer_addresses
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.customers c WHERE c.id = customer_addresses.customer_id AND c.auth_user_id = auth.uid())
  );

CREATE POLICY "Customers can manage own addresses" ON public.customer_addresses
  FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.customers c WHERE c.id = customer_addresses.customer_id AND c.auth_user_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM public.customers c WHERE c.id = customer_addresses.customer_id AND c.auth_user_id = auth.uid())
  );

CREATE POLICY "Customers can view own consents" ON public.customer_consents
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.customers c WHERE c.id = customer_consents.customer_id AND c.auth_user_id = auth.uid())
  );

CREATE POLICY "Customers can view own business profile" ON public.customer_business_profiles
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.customers c WHERE c.id = customer_business_profiles.customer_id AND c.auth_user_id = auth.uid())
  );
