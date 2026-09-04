-- ==============================================================================
-- PHASE 14: CATEGORY HERO BANNERS & PROMOTIONAL OFFERS
-- Project: print-studio-production (vsbexmohwbhlyfinobnv)
-- Purpose: Support dynamic banners and offer management for individual category pages
-- ==============================================================================

-- 1. Add page_type and category_handle to homepage_hero_banners
ALTER TABLE public.homepage_hero_banners
ADD COLUMN IF NOT EXISTS page_type TEXT NOT NULL DEFAULT 'home' CHECK (page_type IN ('home', 'category')),
ADD COLUMN IF NOT EXISTS category_handle TEXT;

-- 2. Indexes for instant category hero banner lookups
CREATE INDEX IF NOT EXISTS idx_hero_banners_category_order 
ON public.homepage_hero_banners(page_type, category_handle, is_active, display_order ASC);
