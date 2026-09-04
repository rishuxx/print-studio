import { createClient } from "@/lib/supabase/server";
import { HeroBannerRecord, DEFAULT_HERO_BANNERS } from "./types";

/**
 * Public storefront query: returns all active homepage hero banners sorted by display order
 * Automatically falls back to DEFAULT_HERO_BANNERS if table is unmigrated or empty.
 */
export async function getActiveHeroBanners(): Promise<HeroBannerRecord[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("homepage_hero_banners")
      .select("*")
      .eq("is_active", true)
      .or("page_type.eq.home,page_type.is.null")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return DEFAULT_HERO_BANNERS;
    }

    return data as HeroBannerRecord[];
  } catch {
    return DEFAULT_HERO_BANNERS;
  }
}

/**
 * Storefront query: returns all active hero banners configured for a specific category
 */
export async function getCategoryHeroBanners(categoryHandle: string): Promise<HeroBannerRecord[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("homepage_hero_banners")
      .select("*")
      .eq("is_active", true)
      .eq("page_type", "category")
      .eq("category_handle", categoryHandle)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error || !data) {
      return [];
    }

    return data as HeroBannerRecord[];
  } catch {
    return [];
  }
}

/**
 * Admin query: returns all hero banners (active and inactive) for management
 */
export async function getAllHeroBannersAdmin(): Promise<HeroBannerRecord[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("homepage_hero_banners")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error || !data) {
      return [];
    }

    return data as HeroBannerRecord[];
  } catch {
    return [];
  }
}
