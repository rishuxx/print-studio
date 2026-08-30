-- ==============================================================================
-- PHASE 10F: PRODUCTION PRICING ENGINE, PROMOTIONS & QUANTITY TIERS SCHEMA
-- Authoritative, normalized pricing schema with strict constraints, RLS & audit
-- ==============================================================================

-- 1. PRICE BOOKS (Contexts e.g. Retail, B2B Wholesale, Festive)
CREATE TABLE IF NOT EXISTS public.price_books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  description TEXT,
  currency TEXT NOT NULL DEFAULT 'INR',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  priority INTEGER NOT NULL DEFAULT 0,
  is_default BOOLEAN NOT NULL DEFAULT false,
  version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_price_books_code_lower ON public.price_books(LOWER(code));
CREATE INDEX IF NOT EXISTS idx_price_books_status ON public.price_books(status);

-- 2. PRODUCT PRICES (Normalized base, compare-at, cost, and floor prices in integer paise)
CREATE TABLE IF NOT EXISTS public.product_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES public.product_variants(id) ON DELETE CASCADE,
  price_book_id UUID NOT NULL REFERENCES public.price_books(id) ON DELETE CASCADE,
  base_price_minor INTEGER NOT NULL CHECK (base_price_minor >= 0),
  compare_at_price_minor INTEGER CHECK (compare_at_price_minor IS NULL OR compare_at_price_minor >= base_price_minor),
  cost_price_minor INTEGER CHECK (cost_price_minor IS NULL OR cost_price_minor >= 0),
  minimum_price_floor_minor INTEGER CHECK (minimum_price_floor_minor IS NULL OR minimum_price_floor_minor >= 0),
  currency TEXT NOT NULL DEFAULT 'INR',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  version INTEGER NOT NULL DEFAULT 1,
  effective_from TIMESTAMPTZ,
  effective_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  CONSTRAINT chk_price_dates CHECK (effective_until IS NULL OR effective_from IS NULL OR effective_until >= effective_from)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_product_prices_unique_scope 
  ON public.product_prices(product_id, COALESCE(variant_id, '00000000-0000-0000-0000-000000000000'::uuid), price_book_id)
  WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_product_prices_product ON public.product_prices(product_id);
CREATE INDEX IF NOT EXISTS idx_product_prices_variant ON public.product_prices(variant_id);
CREATE INDEX IF NOT EXISTS idx_product_prices_book ON public.product_prices(price_book_id);

-- 3. QUANTITY TIERS (Bulk wholesale / volume breaks)
CREATE TABLE IF NOT EXISTS public.product_quantity_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_price_id UUID NOT NULL REFERENCES public.product_prices(id) ON DELETE CASCADE,
  min_quantity INTEGER NOT NULL CHECK (min_quantity >= 1),
  max_quantity INTEGER CHECK (max_quantity IS NULL OR max_quantity >= min_quantity),
  tier_price_minor INTEGER NOT NULL CHECK (tier_price_minor >= 0),
  discount_percent NUMERIC(5,2) CHECK (discount_percent IS NULL OR (discount_percent >= 0 AND discount_percent <= 100)),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_quantity_tiers_price_id ON public.product_quantity_tiers(product_price_id);

-- 4. PROMOTIONS & SALES (Scheduled campaigns, discount rules, coupons)
CREATE TABLE IF NOT EXISTS public.promotions_and_sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT, -- Nullable coupon code (e.g. DIWALI20)
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('sale_price', 'percentage_discount', 'fixed_discount', 'bulk_tier_discount')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'active', 'paused', 'expired', 'cancelled')),
  stackable BOOLEAN NOT NULL DEFAULT false,
  priority INTEGER NOT NULL DEFAULT 10,
  discount_value NUMERIC(10,2) NOT NULL CHECK (discount_value >= 0),
  min_order_value_minor INTEGER CHECK (min_order_value_minor IS NULL OR min_order_value_minor >= 0),
  max_discount_amount_minor INTEGER CHECK (max_discount_amount_minor IS NULL OR max_discount_amount_minor >= 0),
  target_type TEXT NOT NULL DEFAULT 'all' CHECK (target_type IN ('all', 'category', 'product', 'variant')),
  target_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  timezone TEXT NOT NULL DEFAULT 'Asia/Kolkata',
  usage_count INTEGER NOT NULL DEFAULT 0,
  max_usage_limit INTEGER,
  version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  CONSTRAINT chk_promo_dates CHECK (ends_at IS NULL OR starts_at IS NULL OR ends_at >= starts_at)
);

CREATE INDEX IF NOT EXISTS idx_promotions_status ON public.promotions_and_sales(status);
CREATE INDEX IF NOT EXISTS idx_promotions_code ON public.promotions_and_sales(code) WHERE code IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_promotions_schedule ON public.promotions_and_sales(starts_at, ends_at);

-- 5. IMMUTABLE PRICING AUDIT HISTORY
CREATE TABLE IF NOT EXISTS public.pricing_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
  price_book_id UUID REFERENCES public.price_books(id) ON DELETE SET NULL,
  old_price_minor INTEGER,
  new_price_minor INTEGER NOT NULL,
  change_type TEXT NOT NULL, -- 'base_price_update', 'sale_applied', 'bulk_discount', 'rollback'
  reason TEXT,
  admin_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_pricing_history_product ON public.pricing_history(product_id);
CREATE INDEX IF NOT EXISTS idx_pricing_history_created_at ON public.pricing_history(created_at DESC);

-- ==============================================================================
-- RLS POLICIES
-- ==============================================================================

ALTER TABLE public.price_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_quantity_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotions_and_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_history ENABLE ROW LEVEL SECURITY;

-- 1. Price Books RLS
CREATE POLICY "Public can view active price books"
  ON public.price_books FOR SELECT
  USING (status = 'active');

CREATE POLICY "Admins full access on price_books"
  ON public.price_books FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 2. Product Prices RLS (Cost price and margin floors protected from public views)
CREATE POLICY "Public can view active product prices"
  ON public.product_prices FOR SELECT
  USING (
    status = 'active' AND
    (effective_from IS NULL OR effective_from <= now()) AND
    (effective_until IS NULL OR effective_until >= now())
  );

CREATE POLICY "Admins full access on product_prices"
  ON public.product_prices FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 3. Quantity Tiers RLS
CREATE POLICY "Public can view quantity tiers"
  ON public.product_quantity_tiers FOR SELECT
  USING (true);

CREATE POLICY "Admins full access on product_quantity_tiers"
  ON public.product_quantity_tiers FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 4. Promotions RLS
CREATE POLICY "Public can view active promotions"
  ON public.promotions_and_sales FOR SELECT
  USING (
    status = 'active' AND
    (starts_at IS NULL OR starts_at <= now()) AND
    (ends_at IS NULL OR ends_at >= now())
  );

CREATE POLICY "Admins full access on promotions_and_sales"
  ON public.promotions_and_sales FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 5. Audit History RLS (Strictly Admins only)
CREATE POLICY "Admins can view pricing history"
  ON public.pricing_history FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins can insert pricing history"
  ON public.pricing_history FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());
