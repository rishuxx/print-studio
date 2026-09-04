import { createClient } from "@/lib/supabase/server";
import { HeroBannerRecord, DEFAULT_HERO_BANNERS } from "./types";

/**
 * Public storefront query: returns all active hero banners sorted by display order
 * Automatically falls back to DEFAULT_HERO_BANNERS if table is unmigrated or empty.
 */
export async function getActiveHeroBanners(): Promise<HeroBannerRecord[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("homepage_hero_banners")
      .select("*")
      .eq("is_active", true)
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
