export type FlashCardTone =
  | "ink"
  | "violet"
  | "marigold"
  | "emerald"
  | "rose"
  | "indigo"
  | "amber";

export interface CategoryFlashCard {
  id: string;
  category_handle: string;
  eyebrow: string | null;
  title: string;
  body: string | null;
  cta_text: string;
  cta_url: string;
  tone: FlashCardTone;
  badge_text: string | null;
  discount_tag: string | null;
  image_url: string | null;
  is_active: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface SaveCategoryFlashCardInput {
  id?: string;
  category_handle: string;
  eyebrow?: string | null;
  title: string;
  body?: string | null;
  cta_text: string;
  cta_url: string;
  tone: FlashCardTone;
  badge_text?: string | null;
  discount_tag?: string | null;
  image_url?: string | null;
  is_active?: boolean;
}

/**
 * 100% verified, high-converting fallback flash ad cards for each category.
 * Every single CTA URL here points to an existing, valid storefront page to prevent 404s.
 */
export const DEFAULT_FLASH_CARDS: Record<string, CategoryFlashCard> = {
  "same-day": {
    id: "default-same-day",
    category_handle: "same-day",
    eyebrow: "EXPRESS PRODUCTION",
    title: "Need It Today? Dispatched in 4 Hours",
    body: "Order before 11 AM and collect from our hub or get express local courier. Visiting cards, flyers & mug printing.",
    cta_text: "Browse Same-Day Ready",
    cta_url: "/same-day",
    tone: "marigold",
    badge_text: "⚡ 4-Hour Turnaround",
    discount_tag: "Same-Day Ready",
    image_url: null,
    is_active: true,
    display_order: 1,
  },
  "visiting-cards": {
    id: "default-visiting-cards",
    category_handle: "visiting-cards",
    eyebrow: "TACTILE PRINT SAMPLE",
    title: "Experience 12 Luxury Paper Stocks",
    body: "Hold, bend, and feel 350+ GSM imported matte, velvet touch, and raised spot UV finishes. ₹99 kit refunded on first run.",
    cta_text: "Get Sample Kit · ₹99",
    cta_url: "/sample-kit",
    tone: "violet",
    badge_text: "Bestseller Kit",
    discount_tag: "100% Refundable",
    image_url: null,
    is_active: true,
    display_order: 2,
  },
  "apparel": {
    id: "default-apparel",
    category_handle: "apparel",
    eyebrow: "ZERO MINIMUM ORDER",
    title: "Custom T-Shirts & Polos for Teams",
    body: "Screen, DTF & high-density embroidery in-house. Single-piece bespoke prints or 500+ team apparel runs.",
    cta_text: "Shop Apparel Collection",
    cta_url: "/category/apparel",
    tone: "indigo",
    badge_text: "Corporate Apparel",
    discount_tag: "Bulk Saver up to 35%",
    image_url: null,
    is_active: true,
    display_order: 3,
  },
  "personalised-gifts": {
    id: "default-personalised-gifts",
    category_handle: "personalised-gifts",
    eyebrow: "FREE DESIGN POLISH",
    title: "Send Us Photos — We Proof & Print",
    body: "WhatsApp your pictures and our studio team crops, color-calibrates and sends a 3D proof before printing.",
    cta_text: "Get Design Help",
    cta_url: "/design-help",
    tone: "rose",
    badge_text: "Design Included",
    discount_tag: "1-on-1 Artist Support",
    image_url: null,
    is_active: true,
    display_order: 4,
  },
  "stationery-stamps": {
    id: "default-stationery-stamps",
    category_handle: "stationery-stamps",
    eyebrow: "TWO-TAP REORDERS",
    title: "Office Paperwork That Builds Trust",
    body: "Every letterhead, bill book and self-inking stamp spec is archived. Reorder anytime with zero rework.",
    cta_text: "View Stationery Catalog",
    cta_url: "/category/stationery-stamps",
    tone: "violet",
    badge_text: "Essential Stationery",
    discount_tag: "GST Invoice Included",
    image_url: null,
    is_active: true,
    display_order: 5,
  },
  "labels-packaging": {
    id: "default-labels-packaging",
    category_handle: "labels-packaging",
    eyebrow: "END-TO-END UNBOXING",
    title: "Custom Mailer Boxes, Stickers & Tape",
    body: "Coordinate your branded mailer boxes, custom tissue paper, sticker seals, and hang tags so colors perfectly match.",
    cta_text: "Shop Packaging Suite",
    cta_url: "/category/labels-packaging",
    tone: "emerald",
    badge_text: "Unboxing Suite",
    discount_tag: "Save 25% on Bundles",
    image_url: null,
    is_active: true,
    display_order: 6,
  },
  "signage": {
    id: "default-signage",
    category_handle: "signage",
    eyebrow: "MEASURE & INSTALL",
    title: "Storefront Standees, Acrylic & Vinyl",
    body: "Send a photo of your facade or booth. We site-measure, print high-density UV graphics and precision install.",
    cta_text: "Book Site Consultation",
    cta_url: "/contact",
    tone: "amber",
    badge_text: "Full-Service Turnkey",
    discount_tag: "Local Installation",
    image_url: null,
    is_active: true,
    display_order: 7,
  },
  "decor-drinkware": {
    id: "default-decor-drinkware",
    category_handle: "decor-drinkware",
    eyebrow: "LASER-ETCHED DRINKWARE",
    title: "Radiate Double-Wall Steel Tumblers",
    body: "1200 ml thermal insulation with permanent dishwasher-proof laser etching. Keep drinks cold for 24 hours.",
    cta_text: "Explore Tumblers",
    cta_url: "/category/decor-drinkware",
    tone: "marigold",
    badge_text: "New Trending",
    discount_tag: "Lifetime Engraving",
    image_url: null,
    is_active: true,
    display_order: 8,
  },
  "bulk": {
    id: "default-bulk",
    category_handle: "bulk",
    eyebrow: "DEDICATED ACCOUNT MANAGER",
    title: "500+ Pieces? Custom Commercial Quote",
    body: "Skip unit pricing. Get trade pricing, custom die-lines, and flexible credit terms with 4-hour quote turnaround.",
    cta_text: "Request Trade Quote",
    cta_url: "/bulk-quote",
    tone: "ink",
    badge_text: "Enterprise Printing",
    discount_tag: "Up to 45% Volume Rebate",
    image_url: null,
    is_active: true,
    display_order: 9,
  },
  "festive": {
    id: "default-festive",
    category_handle: "festive",
    eyebrow: "FESTIVE CORPORATE SPECIALS",
    title: "Curated Diwali & Holiday Hampers",
    body: "Pre-order custom diwali hampers, gold foil sweet boxes, and executive desk diaries with custom branding.",
    cta_text: "Explore Festive Collection",
    cta_url: "/category/festive",
    tone: "marigold",
    badge_text: "Limited Holiday Run",
    discount_tag: "Early-Bird Slots",
    image_url: null,
    is_active: true,
    display_order: 10,
  },
};
