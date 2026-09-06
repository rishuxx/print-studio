-- ==============================================================================
-- PHASE 15: CATEGORY MEGA-MENU AD FLASH CARDS SYSTEM
-- Purpose: Admin-controlled dynamic & modern promotional flash ad cards for mega-menu dropdowns
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.category_flash_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_handle TEXT NOT NULL UNIQUE,
  eyebrow TEXT,
  title TEXT NOT NULL,
  body TEXT,
  cta_text TEXT NOT NULL DEFAULT 'Explore Collection',
  cta_url TEXT NOT NULL DEFAULT '/products',
  tone TEXT NOT NULL DEFAULT 'ink' CHECK (tone IN ('violet', 'marigold', 'ink', 'emerald', 'rose', 'indigo', 'amber')),
  badge_text TEXT,
  discount_tag TEXT,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for lightning fast lookups
CREATE INDEX IF NOT EXISTS idx_flash_cards_handle_active ON public.category_flash_cards(category_handle, is_active);

-- Auto-update updated_at trigger
DROP TRIGGER IF EXISTS set_category_flash_cards_updated_at ON public.category_flash_cards;
CREATE TRIGGER set_category_flash_cards_updated_at
BEFORE UPDATE ON public.category_flash_cards
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Enable RLS
ALTER TABLE public.category_flash_cards ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Public can view active category flash cards" ON public.category_flash_cards;
CREATE POLICY "Public can view active category flash cards"
ON public.category_flash_cards FOR SELECT
TO public
USING (is_active = true);

DROP POLICY IF EXISTS "Admins have full access to category flash cards" ON public.category_flash_cards;
CREATE POLICY "Admins have full access to category flash cards"
ON public.category_flash_cards FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Seed initial premier flash ad cards with verified 100% working URLs
INSERT INTO public.category_flash_cards (category_handle, eyebrow, title, body, cta_text, cta_url, tone, badge_text, discount_tag, display_order)
VALUES
  (
    'same-day',
    'EXPRESS PRODUCTION',
    'Need It Today? Dispatched in 4 Hours',
    'Order before 11 AM and collect from our hub or get express local courier. Visiting cards, flyers & mug printing.',
    'Browse Same-Day Ready',
    '/same-day',
    'marigold',
    '⚡ 4-Hour Turnaround',
    'Same-Day Ready',
    1
  ),
  (
    'visiting-cards',
    'TACTILE PRINT SAMPLE',
    'Experience 12 Luxury Paper Stocks',
    'Hold, bend, and feel 350+ GSM imported matte, velvet touch, and raised spot UV finishes. ₹99 kit refunded on first run.',
    'Get Sample Kit · ₹99',
    '/sample-kit',
    'violet',
    'Bestseller Kit',
    '100% Refundable',
    2
  ),
  (
    'apparel',
    'ZERO MINIMUM ORDER',
    'Custom T-Shirts & Polos for Teams',
    'Screen, DTF & high-density embroidery in-house. Single-piece bespoke prints or 500+ team apparel runs.',
    'Shop Apparel Collection',
    '/category/apparel',
    'indigo',
    'Corporate Apparel',
    'Bulk Saver up to 35%',
    3
  ),
  (
    'personalised-gifts',
    'FREE DESIGN POLISH',
    'Send Us Photos — We Proof & Print',
    'WhatsApp your pictures and our studio team crops, color-calibrates and sends a 3D proof before printing.',
    'Get Design Help',
    '/design-help',
    'rose',
    'Design Included',
    '1-on-1 Artist Support',
    4
  ),
  (
    'stationery-stamps',
    'TWO-TAP REORDERS',
    'Office Paperwork That Builds Trust',
    'Every letterhead, bill book and self-inking stamp spec is archived. Reorder anytime with zero rework.',
    'View Stationery Catalog',
    '/category/stationery-stamps',
    'violet',
    'Essential Stationery',
    'GST Invoice Included',
    5
  ),
  (
    'labels-packaging',
    'END-TO-END UNBOXING',
    'Custom Mailer Boxes, Stickers & Tape',
    'Coordinate your branded mailer boxes, custom tissue paper, sticker seals, and hang tags so colors perfectly match.',
    'Shop Packaging Suite',
    '/category/labels-packaging',
    'emerald',
    'Unboxing Suite',
    'Save 25% on Bundles',
    6
  ),
  (
    'signage',
    'MEASURE & INSTALL',
    'Storefront Standees, Acrylic & Vinyl',
    'Send a photo of your facade or booth. We site-measure, print high-density UV graphics and precision install.',
    'Book Site Consultation',
    '/contact',
    'amber',
    'Full-Service Turnkey',
    'Local Installation',
    7
  ),
  (
    'decor-drinkware',
    'LASER-ETCHED DRINKWARE',
    'Radiate Double-Wall Steel Tumblers',
    '1200 ml thermal insulation with permanent dishwasher-proof laser etching. Keep drinks cold for 24 hours.',
    'Explore Tumblers',
    '/category/decor-drinkware',
    'marigold',
    'New Trending',
    'Lifetime Engraving',
    8
  ),
  (
    'bulk',
    'DEDICATED ACCOUNT MANAGER',
    '500+ Pieces? Custom Commercial Quote',
    'Skip unit pricing. Get trade pricing, custom die-lines, and flexible credit terms with 4-hour quote turnaround.',
    'Request Trade Quote',
    '/bulk-quote',
    'ink',
    'Enterprise Printing',
    'Up to 45% Volume Rebate',
    9
  ),
  (
    'festive',
    'FESTIVE CORPORATE SPECIALS',
    'Curated Diwali & Holiday Hampers',
    'Pre-order custom diwali hampers, gold foil sweet boxes, and executive desk diaries with custom branding.',
    'Explore Festive Collection',
    '/category/festive',
    'marigold',
    'Limited Holiday Run',
    'Early-Bird Slots',
    10
  )
ON CONFLICT (category_handle) DO UPDATE SET
  eyebrow = EXCLUDED.eyebrow,
  title = EXCLUDED.title,
  body = EXCLUDED.body,
  cta_text = EXCLUDED.cta_text,
  cta_url = EXCLUDED.cta_url,
  tone = EXCLUDED.tone,
  badge_text = EXCLUDED.badge_text,
  discount_tag = EXCLUDED.discount_tag;
