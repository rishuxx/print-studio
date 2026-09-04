-- ==============================================================================
-- PHASE 13: HOMEPAGE HERO BANNERS & BRANDING SYSTEM
-- Project: print-studio-production (vsbexmohwbhlyfinobnv)
-- Purpose: Dynamic Admin-controlled Hero Carousel Banners & Branding Configuration
-- ==============================================================================

-- 1. Create homepage_hero_banners Table
CREATE TABLE IF NOT EXISTS public.homepage_hero_banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  eyebrow TEXT,
  description TEXT,
  desktop_image_url TEXT NOT NULL,
  mobile_image_url TEXT,
  alt_text TEXT DEFAULT 'PreetyPrints Custom Printing Banner',
  content_mode TEXT NOT NULL DEFAULT 'image_overlay' CHECK (content_mode IN ('image_only', 'image_overlay')),
  primary_cta_text TEXT DEFAULT 'Explore Products',
  primary_cta_url TEXT DEFAULT '/products',
  primary_cta_bg_color TEXT DEFAULT '#e53935',
  primary_cta_text_color TEXT DEFAULT '#ffffff',
  secondary_cta_text TEXT DEFAULT 'Get a Quote',
  secondary_cta_url TEXT DEFAULT '/bulk-quote',
  secondary_cta_bg_color TEXT DEFAULT '#ffffff',
  secondary_cta_text_color TEXT DEFAULT '#222225',
  text_color TEXT DEFAULT '#222225',
  overlay_enabled BOOLEAN NOT NULL DEFAULT false,
  overlay_opacity INTEGER NOT NULL DEFAULT 30 CHECK (overlay_opacity >= 0 AND overlay_opacity <= 100),
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  version INTEGER NOT NULL DEFAULT 1,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for lightning fast storefront query and reordering
CREATE INDEX IF NOT EXISTS idx_hero_banners_active_order ON public.homepage_hero_banners(is_active, display_order ASC);
CREATE INDEX IF NOT EXISTS idx_hero_banners_dates ON public.homepage_hero_banners(start_date, end_date);

-- Trigger for auto updated_at
DROP TRIGGER IF EXISTS set_homepage_hero_banners_updated_at ON public.homepage_hero_banners;
CREATE TRIGGER set_homepage_hero_banners_updated_at
BEFORE UPDATE ON public.homepage_hero_banners
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- 2. Extend business_settings with branding controls
ALTER TABLE public.business_settings
ADD COLUMN IF NOT EXISTS logo_mode TEXT DEFAULT 'text' CHECK (logo_mode IN ('text', 'image')),
ADD COLUMN IF NOT EXISTS logo_mobile_url TEXT,
ADD COLUMN IF NOT EXISTS logo_alt_text TEXT DEFAULT 'PreetyPrints Logo',
ADD COLUMN IF NOT EXISTS logo_height_desktop INTEGER DEFAULT 48,
ADD COLUMN IF NOT EXISTS logo_height_mobile INTEGER DEFAULT 36,
ADD COLUMN IF NOT EXISTS primary_brand_color TEXT DEFAULT '#e53935',
ADD COLUMN IF NOT EXISTS secondary_brand_color TEXT DEFAULT '#fef2f2',
ADD COLUMN IF NOT EXISTS accent_brand_color TEXT DEFAULT '#f97316';

-- 3. Enable RLS on homepage_hero_banners
ALTER TABLE public.homepage_hero_banners ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active hero banners" ON public.homepage_hero_banners;
CREATE POLICY "Public can view active hero banners"
ON public.homepage_hero_banners FOR SELECT
TO public
USING (is_active = true);

DROP POLICY IF EXISTS "Admins have full access to hero banners" ON public.homepage_hero_banners;
CREATE POLICY "Admins have full access to hero banners"
ON public.homepage_hero_banners FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 4. Seed default premier starter banner if table is empty
INSERT INTO public.homepage_hero_banners (
  title,
  subtitle,
  eyebrow,
  description,
  desktop_image_url,
  mobile_image_url,
  alt_text,
  content_mode,
  primary_cta_text,
  primary_cta_url,
  secondary_cta_text,
  secondary_cta_url,
  display_order,
  is_active
)
SELECT
  'Print Anything. Make It Yours.',
  'India''s Premier Custom Printing & Merchandise Platform',
  'CUSTOM PRINTING & PERSONALISED PRODUCTS',
  'From luxury visiting cards to custom corporate merchandising, packaging and promotional gifts. Precision print craftsmanship delivered across India.',
  '/banners/hero-desktop-1.webp',
  '/banners/hero-mobile-1.webp',
  'PreetyPrints Custom Online Printing & Personalized Products',
  'image_overlay',
  'Explore Products',
  '/products',
  'Get Bulk Quote',
  '/bulk-quote',
  1,
  true
WHERE NOT EXISTS (SELECT 1 FROM public.homepage_hero_banners);
