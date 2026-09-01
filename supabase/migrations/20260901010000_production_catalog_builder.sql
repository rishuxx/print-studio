-- ==============================================================================
-- PRODUCTION-GRADE PRODUCT CATALOG, ATTRIBUTE BUILDER, VARIANT & COMMERCE SCHEMA
-- Project: print-studio-production (vsbexmohwbhlyfinobnv)
-- Purpose: Dynamic attribute definitions, category templates, product attribute values,
--          enhanced variants, media roles, storage bucket, and audit logging.
-- ==============================================================================

-- 1. DYNAMIC ATTRIBUTE DEFINITIONS TABLE
CREATE TABLE IF NOT EXISTS public.attribute_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  label TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (
    type IN (
      'TEXT',
      'TEXTAREA',
      'NUMBER',
      'DECIMAL',
      'BOOLEAN',
      'SELECT',
      'MULTI_SELECT',
      'COLOUR_SWATCH',
      'IMAGE_SWATCH',
      'RADIO',
      'CHECKBOX',
      'DATE',
      'DATE_TIME',
      'DIMENSION',
      'WEIGHT',
      'CURRENCY',
      'FILE_UPLOAD',
      'IMAGE_UPLOAD'
    )
  ),
  unit TEXT, -- e.g. 'cm', 'inch', 'mm', 'GSM', 'g', 'kg', 'ml'
  is_required BOOLEAN NOT NULL DEFAULT false,
  visible_on_storefront BOOLEAN NOT NULL DEFAULT true,
  used_for_variant BOOLEAN NOT NULL DEFAULT false,
  used_for_filtering BOOLEAN NOT NULL DEFAULT false,
  used_for_search BOOLEAN NOT NULL DEFAULT false,
  is_global BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  default_value JSONB,
  allowed_values JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of { label, value, hex, image_url, price_modifier }
  validation_rules JSONB NOT NULL DEFAULT '{}'::jsonb, -- { min, max, minLength, maxLength, regex, allowedFileTypes, maxFileSizeMb }
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_attr_def_code ON public.attribute_definitions(code);
CREATE INDEX IF NOT EXISTS idx_attr_def_type ON public.attribute_definitions(type);
CREATE INDEX IF NOT EXISTS idx_attr_def_is_global ON public.attribute_definitions(is_global);
CREATE INDEX IF NOT EXISTS idx_attr_def_sort_order ON public.attribute_definitions(sort_order);

DROP TRIGGER IF EXISTS set_attribute_definitions_updated_at ON public.attribute_definitions;
CREATE TRIGGER set_attribute_definitions_updated_at
BEFORE UPDATE ON public.attribute_definitions
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- 2. CATEGORY ATTRIBUTE TEMPLATES (Links categories to reusable attribute sets)
CREATE TABLE IF NOT EXISTS public.category_attribute_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  attribute_id UUID NOT NULL REFERENCES public.attribute_definitions(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_required_override BOOLEAN,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (category_id, attribute_id)
);

CREATE INDEX IF NOT EXISTS idx_cat_attr_tpl_cat ON public.category_attribute_templates(category_id);
CREATE INDEX IF NOT EXISTS idx_cat_attr_tpl_attr ON public.category_attribute_templates(attribute_id);

-- 3. PRODUCT ATTRIBUTE VALUES
CREATE TABLE IF NOT EXISTS public.product_attribute_values (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  attribute_id UUID NOT NULL REFERENCES public.attribute_definitions(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES public.product_variants(id) ON DELETE CASCADE,
  value JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (product_id, attribute_id, variant_id)
);

CREATE INDEX IF NOT EXISTS idx_prod_attr_val_prod ON public.product_attribute_values(product_id);
CREATE INDEX IF NOT EXISTS idx_prod_attr_val_attr ON public.product_attribute_values(attribute_id);
CREATE INDEX IF NOT EXISTS idx_prod_attr_val_var ON public.product_attribute_values(variant_id);

-- 4. ENHANCE CATEGORIES TABLE
ALTER TABLE public.categories 
  ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS image_url TEXT,
  ADD COLUMN IF NOT EXISTS banner_url TEXT,
  ADD COLUMN IF NOT EXISTS is_nav BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS metadata JSONB NOT NULL DEFAULT '{}'::jsonb;

CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON public.categories(parent_id);

-- 5. ENHANCE PRODUCTS TABLE
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS brand TEXT DEFAULT 'Doon Print Studio',
  ADD COLUMN IF NOT EXISTS tags JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS badges JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS publish_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS unpublish_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS base_price_minor INTEGER DEFAULT 19900 CHECK (base_price_minor >= 0),
  ADD COLUMN IF NOT EXISTS compare_at_price_minor INTEGER CHECK (compare_at_price_minor IS NULL OR compare_at_price_minor >= base_price_minor),
  ADD COLUMN IF NOT EXISTS cost_price_minor INTEGER CHECK (cost_price_minor IS NULL OR cost_price_minor >= 0),
  ADD COLUMN IF NOT EXISTS sale_price_minor INTEGER CHECK (sale_price_minor IS NULL OR sale_price_minor >= 0),
  ADD COLUMN IF NOT EXISTS sale_starts_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS sale_ends_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS customization_config JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS shipping_config JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS merchandising_config JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS og_title TEXT,
  ADD COLUMN IF NOT EXISTS og_description TEXT,
  ADD COLUMN IF NOT EXISTS og_image TEXT,
  ADD COLUMN IF NOT EXISTS no_index BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS health_score INTEGER NOT NULL DEFAULT 80;

-- 6. ENHANCE PRODUCT VARIANTS TABLE
ALTER TABLE public.product_variants
  ADD COLUMN IF NOT EXISTS barcode TEXT,
  ADD COLUMN IF NOT EXISTS price_minor INTEGER CHECK (price_minor IS NULL OR price_minor >= 0),
  ADD COLUMN IF NOT EXISTS sale_price_minor INTEGER CHECK (sale_price_minor IS NULL OR sale_price_minor >= 0),
  ADD COLUMN IF NOT EXISTS cost_price_minor INTEGER CHECK (cost_price_minor IS NULL OR cost_price_minor >= 0),
  ADD COLUMN IF NOT EXISTS inventory_quantity INTEGER NOT NULL DEFAULT 100,
  ADD COLUMN IF NOT EXISTS reserved_quantity INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS track_inventory BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS allow_backorder BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS weight_grams NUMERIC(10, 2),
  ADD COLUMN IF NOT EXISTS dimensions_cm JSONB NOT NULL DEFAULT '{"width": 0, "height": 0, "length": 0}'::jsonb,
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'archived')),
  ADD COLUMN IF NOT EXISTS media_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS metadata JSONB NOT NULL DEFAULT '{}'::jsonb;

CREATE INDEX IF NOT EXISTS idx_prod_var_status ON public.product_variants(status);

-- 7. ENHANCE PRODUCT MEDIA TABLE
ALTER TABLE public.product_media
  ADD COLUMN IF NOT EXISTS variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS storage_key TEXT,
  ADD COLUMN IF NOT EXISTS thumbnail_url TEXT,
  ADD COLUMN IF NOT EXISTS caption TEXT,
  ADD COLUMN IF NOT EXISTS mime_type TEXT NOT NULL DEFAULT 'image/jpeg',
  ADD COLUMN IF NOT EXISTS file_size INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_thumbnail BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_gallery BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS hide_from_storefront BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_product_media_variant_id ON public.product_media(variant_id);

-- 8. CATALOG AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.catalog_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL CHECK (entity_type IN ('product', 'category', 'attribute', 'variant', 'price', 'media')),
  entity_id TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('CREATE', 'UPDATE', 'DELETE', 'PUBLISH', 'PAUSE', 'ARCHIVE', 'PRICE_UPDATE', 'BULK_UPDATE', 'DUPLICATE')),
  old_state JSONB,
  new_state JSONB,
  reason TEXT,
  admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  admin_email TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_cat_audit_entity ON public.catalog_audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_cat_audit_created_at ON public.catalog_audit_logs(created_at DESC);

-- 9. PRODUCT MEDIA STORAGE BUCKET CONFIGURATION
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-media',
  'product-media',
  true,
  15728640, -- 15 MB
  ARRAY[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/avif',
    'image/svg+xml'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 15728640,
  allowed_mime_types = ARRAY[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/avif',
    'image/svg+xml'
  ];

-- 10. RLS POLICIES

-- A. Attribute Definitions RLS
ALTER TABLE public.attribute_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.category_attribute_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_attribute_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catalog_audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view attribute definitions" ON public.attribute_definitions;
CREATE POLICY "Public can view attribute definitions"
ON public.attribute_definitions FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "Admins can manage attribute definitions" ON public.attribute_definitions;
CREATE POLICY "Admins can manage attribute definitions"
ON public.attribute_definitions FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Public can view category attribute templates" ON public.category_attribute_templates;
CREATE POLICY "Public can view category attribute templates"
ON public.category_attribute_templates FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "Admins can manage category attribute templates" ON public.category_attribute_templates;
CREATE POLICY "Admins can manage category attribute templates"
ON public.category_attribute_templates FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Public can view product attribute values" ON public.product_attribute_values;
CREATE POLICY "Public can view product attribute values"
ON public.product_attribute_values FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "Admins can manage product attribute values" ON public.product_attribute_values;
CREATE POLICY "Admins can manage product attribute values"
ON public.product_attribute_values FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- B. Audit Logs RLS (Strictly Admin only)
DROP POLICY IF EXISTS "Admins can view catalog audit logs" ON public.catalog_audit_logs;
CREATE POLICY "Admins can view catalog audit logs"
ON public.catalog_audit_logs FOR SELECT
TO authenticated
USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can insert catalog audit logs" ON public.catalog_audit_logs;
CREATE POLICY "Admins can insert catalog audit logs"
ON public.catalog_audit_logs FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

-- C. Storage Policies for 'product-media' Bucket
DROP POLICY IF EXISTS "Public can view product media files" ON storage.objects;
CREATE POLICY "Public can view product media files"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'product-media');

DROP POLICY IF EXISTS "Admins can manage product media storage" ON storage.objects;
CREATE POLICY "Admins can manage product media storage"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'product-media' AND public.is_admin())
WITH CHECK (bucket_id = 'product-media' AND public.is_admin());
