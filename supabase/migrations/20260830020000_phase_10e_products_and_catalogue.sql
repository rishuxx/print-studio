-- ==============================================================================
-- PHASE 10E: PRODUCTION PRODUCTS & CATALOGUE MANAGEMENT SCHEMA
-- Project: print-studio-production (vsbexmohwbhlyfinobnv)
-- Purpose: Normalized categories, products, variants, options, media, and links with RLS
-- ==============================================================================

-- 1. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  handle TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  blurb TEXT,
  icon TEXT DEFAULT 'Folder',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_categories_status ON public.categories(status);
CREATE INDEX IF NOT EXISTS idx_categories_sort_order ON public.categories(sort_order);
CREATE UNIQUE INDEX IF NOT EXISTS idx_categories_handle_lower ON public.categories(LOWER(handle));

-- updated_at trigger for categories
DROP TRIGGER IF EXISTS set_categories_updated_at ON public.categories;
CREATE TRIGGER set_categories_updated_at
BEFORE UPDATE ON public.categories
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  handle TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  sku TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'archived')),
  visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'hidden')),
  product_type TEXT NOT NULL DEFAULT 'Print',
  unit TEXT NOT NULL DEFAULT 'pieces',
  min_order_qty INTEGER NOT NULL DEFAULT 1 CHECK (min_order_qty > 0),
  qty_increment INTEGER NOT NULL DEFAULT 1 CHECK (qty_increment > 0),
  turnaround_days INTEGER NOT NULL DEFAULT 3 CHECK (turnaround_days >= 1),
  is_featured BOOLEAN NOT NULL DEFAULT false,
  same_day_eligible BOOLEAN NOT NULL DEFAULT false,
  bulk_eligible BOOLEAN NOT NULL DEFAULT true,
  requires_artwork BOOLEAN NOT NULL DEFAULT true,
  requires_proof BOOLEAN NOT NULL DEFAULT true,
  customizable BOOLEAN NOT NULL DEFAULT true,
  upload_only BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  version INTEGER NOT NULL DEFAULT 1, -- Optimistic concurrency counter
  seo_title TEXT,
  seo_description TEXT,
  canonical_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  published_at TIMESTAMPTZ,
  archived_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_visibility ON public.products(visibility);
CREATE INDEX IF NOT EXISTS idx_products_product_type ON public.products(product_type);
CREATE INDEX IF NOT EXISTS idx_products_sort_order ON public.products(sort_order);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS idx_products_sku_lower ON public.products(LOWER(sku));
CREATE UNIQUE INDEX IF NOT EXISTS idx_products_handle_lower ON public.products(LOWER(handle));

-- updated_at trigger for products
DROP TRIGGER IF EXISTS set_products_updated_at ON public.products;
CREATE TRIGGER set_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- 3. PRODUCT CATEGORY LINKS (Normalized many-to-many relationship)
CREATE TABLE IF NOT EXISTS public.product_category_links (
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (product_id, category_id)
);

CREATE INDEX IF NOT EXISTS idx_pcl_product_id ON public.product_category_links(product_id);
CREATE INDEX IF NOT EXISTS idx_pcl_category_id ON public.product_category_links(category_id);

-- 4. PRODUCT MEDIA TABLE
CREATE TABLE IF NOT EXISTS public.product_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text TEXT NOT NULL DEFAULT '',
  width INTEGER NOT NULL DEFAULT 800,
  height INTEGER NOT NULL DEFAULT 800,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_media_product_id ON public.product_media(product_id);
CREATE INDEX IF NOT EXISTS idx_product_media_sort_order ON public.product_media(sort_order);

-- 5. PRODUCT OPTIONS & VARIANTS
CREATE TABLE IF NOT EXISTS public.product_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  values JSONB NOT NULL DEFAULT '[]'::jsonb,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_options_product_id ON public.product_options(product_id);

CREATE TABLE IF NOT EXISTS public.product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  sku TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  available_for_sale BOOLEAN NOT NULL DEFAULT true,
  selected_options JSONB NOT NULL DEFAULT '[]'::jsonb,
  price_factor NUMERIC(6, 4) NOT NULL DEFAULT 1.0000,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON public.product_variants(product_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_product_variants_sku_lower ON public.product_variants(LOWER(sku));

-- 6. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_category_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

-- 6.1 Categories RLS
DROP POLICY IF EXISTS "Public can view active categories" ON public.categories;
CREATE POLICY "Public can view active categories"
ON public.categories FOR SELECT
TO public
USING (status = 'active' OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage categories" ON public.categories;
CREATE POLICY "Admins can manage categories"
ON public.categories FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 6.2 Products RLS
DROP POLICY IF EXISTS "Public can view active public products" ON public.products;
CREATE POLICY "Public can view active public products"
ON public.products FOR SELECT
TO public
USING ((status = 'active' AND visibility = 'public') OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
CREATE POLICY "Admins can manage products"
ON public.products FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 6.3 Links & Media RLS
DROP POLICY IF EXISTS "Public can view product links" ON public.product_category_links;
CREATE POLICY "Public can view product links"
ON public.product_category_links FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "Admins can manage product links" ON public.product_category_links;
CREATE POLICY "Admins can manage product links"
ON public.product_category_links FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Public can view product media" ON public.product_media;
CREATE POLICY "Public can view product media"
ON public.product_media FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "Admins can manage product media" ON public.product_media;
CREATE POLICY "Admins can manage product media"
ON public.product_media FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 6.4 Options & Variants RLS
DROP POLICY IF EXISTS "Public can view product options" ON public.product_options;
CREATE POLICY "Public can view product options"
ON public.product_options FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "Admins can manage product options" ON public.product_options;
CREATE POLICY "Admins can manage product options"
ON public.product_options FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Public can view product variants" ON public.product_variants;
CREATE POLICY "Public can view product variants"
ON public.product_variants FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "Admins can manage product variants" ON public.product_variants;
CREATE POLICY "Admins can manage product variants"
ON public.product_variants FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());
