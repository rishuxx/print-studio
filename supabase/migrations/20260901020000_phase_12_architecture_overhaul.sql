-- ==============================================================================
-- PHASE 12: ARCHITECTURE OVERHAUL (REVIEWS, COMPETITOR PRICING & PERSONALIZATION)
-- Project: print-studio-production
-- Purpose: Adds product reviews, competitor price references, and personalization config
-- ==============================================================================

-- 1. COMPETITOR PRICES TABLE (For importing Excel reference data safely)
CREATE TABLE IF NOT EXISTS public.competitor_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  competitor_name TEXT NOT NULL, -- e.g., 'Vistaprint', 'Printo'
  listed_price_minor INTEGER,
  quantity INTEGER,
  normalized_unit_price_minor INTEGER,
  captured_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  source_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_competitor_prices_product_id ON public.competitor_prices(product_id);
CREATE INDEX IF NOT EXISTS idx_competitor_prices_competitor ON public.competitor_prices(competitor_name);

-- 2. PRODUCT REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.product_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  order_id UUID, -- References orders(id) but kept loose if cross-schema
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  images JSONB NOT NULL DEFAULT '[]'::jsonb,
  verified_purchase BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'hidden')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON public.product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_status ON public.product_reviews(status);
CREATE INDEX IF NOT EXISTS idx_product_reviews_rating ON public.product_reviews(rating);

-- Trigger to update product_reviews updated_at
DROP TRIGGER IF EXISTS set_product_reviews_updated_at ON public.product_reviews;
CREATE TRIGGER set_product_reviews_updated_at
BEFORE UPDATE ON public.product_reviews
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- 3. ENHANCE PRODUCTS TABLE
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS rating NUMERIC(3, 2) NOT NULL DEFAULT 0.00,
  ADD COLUMN IF NOT EXISTS review_count INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS personalization_config JSONB NOT NULL DEFAULT '{
    "enabled": false,
    "types": [],
    "designFeeMinor": 0,
    "personalizationFeeMinor": 0,
    "maximumUploads": 1,
    "allowedFileTypes": ["image/png", "image/jpeg", "application/pdf"],
    "maxFileSizeMb": 15,
    "proofRequired": false
  }'::jsonb;

-- 4. ROW LEVEL SECURITY (RLS)

ALTER TABLE public.competitor_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

-- Competitor Prices RLS (Admins only)
DROP POLICY IF EXISTS "Admins can view competitor prices" ON public.competitor_prices;
CREATE POLICY "Admins can view competitor prices"
ON public.competitor_prices FOR SELECT
TO authenticated
USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can manage competitor prices" ON public.competitor_prices;
CREATE POLICY "Admins can manage competitor prices"
ON public.competitor_prices FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Product Reviews RLS
DROP POLICY IF EXISTS "Public can view approved reviews" ON public.product_reviews;
CREATE POLICY "Public can view approved reviews"
ON public.product_reviews FOR SELECT
TO public
USING (status = 'approved');

DROP POLICY IF EXISTS "Authenticated users can create reviews" ON public.product_reviews;
CREATE POLICY "Authenticated users can create reviews"
ON public.product_reviews FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own reviews" ON public.product_reviews;
CREATE POLICY "Users can view their own reviews"
ON public.product_reviews FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own pending reviews" ON public.product_reviews;
CREATE POLICY "Users can update their own pending reviews"
ON public.product_reviews FOR UPDATE
TO authenticated
USING (auth.uid() = user_id AND status = 'pending')
WITH CHECK (auth.uid() = user_id AND status = 'pending');

DROP POLICY IF EXISTS "Admins can manage product reviews" ON public.product_reviews;
CREATE POLICY "Admins can manage product reviews"
ON public.product_reviews FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 5. AGGREGATE REVIEWS TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION public.update_product_review_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    IF NEW.status = 'approved' THEN
      UPDATE public.products
      SET 
        rating = (
          SELECT COALESCE(ROUND(AVG(rating)::numeric, 2), 0)
          FROM public.product_reviews
          WHERE product_id = NEW.product_id AND status = 'approved'
        ),
        review_count = (
          SELECT COUNT(*)
          FROM public.product_reviews
          WHERE product_id = NEW.product_id AND status = 'approved'
        )
      WHERE id = NEW.product_id;
    END IF;
  END IF;

  IF TG_OP = 'DELETE' OR (TG_OP = 'UPDATE' AND OLD.status = 'approved' AND NEW.status != 'approved') THEN
    UPDATE public.products
    SET 
      rating = (
        SELECT COALESCE(ROUND(AVG(rating)::numeric, 2), 0)
        FROM public.product_reviews
        WHERE product_id = OLD.product_id AND status = 'approved'
      ),
      review_count = (
        SELECT COUNT(*)
        FROM public.product_reviews
        WHERE product_id = OLD.product_id AND status = 'approved'
      )
    WHERE id = OLD.product_id;
  END IF;

  RETURN NULL; -- For AFTER trigger
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_product_review_change ON public.product_reviews;
CREATE TRIGGER on_product_review_change
AFTER INSERT OR UPDATE OR DELETE ON public.product_reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_product_review_stats();
