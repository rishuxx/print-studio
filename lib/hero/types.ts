export type HeroContentMode = "image_only" | "image_overlay";
export type HeroPageType = "home" | "category";

export interface HeroBannerRecord {
  id: string;
  page_type: HeroPageType;
  category_handle: string | null;
  title: string;
  subtitle: string | null;
  eyebrow: string | null;
  description: string | null;
  desktop_image_url: string;
  mobile_image_url: string | null;
  alt_text: string | null;
  content_mode: HeroContentMode;
  primary_cta_text: string | null;
  primary_cta_url: string | null;
  primary_cta_bg_color: string | null;
  primary_cta_text_color: string | null;
  secondary_cta_text: string | null;
  secondary_cta_url: string | null;
  secondary_cta_bg_color: string | null;
  secondary_cta_text_color: string | null;
  text_color: string | null;
  overlay_enabled: boolean;
  overlay_opacity: number;
  display_order: number;
  is_active: boolean;
  start_date: string | null;
  end_date: string | null;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface SaveHeroBannerInput {
  id?: string;
  page_type: HeroPageType;
  category_handle?: string | null;
  title: string;
  subtitle?: string | null;
  eyebrow?: string | null;
  description?: string | null;
  desktop_image_url: string;
  mobile_image_url?: string | null;
  alt_text?: string | null;
  content_mode: HeroContentMode;
  primary_cta_text?: string | null;
  primary_cta_url?: string | null;
  primary_cta_bg_color?: string | null;
  primary_cta_text_color?: string | null;
  secondary_cta_text?: string | null;
  secondary_cta_url?: string | null;
  secondary_cta_bg_color?: string | null;
  secondary_cta_text_color?: string | null;
  text_color?: string | null;
  overlay_enabled: boolean;
  overlay_opacity: number;
  display_order: number;
  is_active: boolean;
  start_date?: string | null;
  end_date?: string | null;
}

/** Fallback banner if database table has no rows or is still connecting */
export const DEFAULT_HERO_BANNERS: HeroBannerRecord[] = [
  {
    id: "default-banner-1",
    page_type: "home",
    category_handle: null,
    title: "Print Anything. Make It Yours.",
    subtitle: "India's Premier Custom Printing & Merchandise Platform",
    eyebrow: "CUSTOM PRINTING & PERSONALISED PRODUCTS",
    description:
      "Custom printing for businesses, celebrations, and everyday needs. Luxury visiting cards, apparel, packaging, and corporate gifting with express delivery across India.",
    desktop_image_url: "",
    mobile_image_url: "",
    alt_text: "PreetyPrints Custom Online Printing & Personalised Products",
    content_mode: "image_overlay",
    primary_cta_text: "Explore Products",
    primary_cta_url: "/products",
    primary_cta_bg_color: "#e53935",
    primary_cta_text_color: "#ffffff",
    secondary_cta_text: "Get a Quote",
    secondary_cta_url: "/bulk-quote",
    secondary_cta_bg_color: "#ffffff",
    secondary_cta_text_color: "#222225",
    text_color: "#222225",
    overlay_enabled: false,
    overlay_opacity: 30,
    display_order: 1,
    is_active: true,
    start_date: null,
    end_date: null,
    version: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];
