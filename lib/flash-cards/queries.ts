import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { CategoryFlashCard, DEFAULT_FLASH_CARDS } from "./types";

function getPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;
  return createSupabaseClient(url, key);
}

/**
 * Storefront Query: Fetches all active category flash ad cards mapped by category_handle.
 * Merges with DEFAULT_FLASH_CARDS so that every category always has a verified, functional ad card.
 */
export async function getStorefrontFlashCards(): Promise<Record<string, CategoryFlashCard>> {
  const merged: Record<string, CategoryFlashCard> = { ...DEFAULT_FLASH_CARDS };

  try {
    const supabase = getPublicClient();
    if (!supabase) return merged;

    const { data, error } = await supabase
      .from("category_flash_cards")
      .select("*")
      .eq("is_active", true);

    if (error || !data) {
      return merged;
    }

    for (const card of data) {
      if (card.category_handle) {
        merged[card.category_handle] = card as CategoryFlashCard;
      }
    }
  } catch (err) {
    console.error("Failed to query category_flash_cards:", err);
  }

  return merged;
}

/**
 * Admin Query: Fetches all category flash ad cards (active and inactive) for management.
 */
export async function getAllFlashCardsAdmin(): Promise<CategoryFlashCard[]> {
  const defaultList = Object.values(DEFAULT_FLASH_CARDS);

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("category_flash_cards")
      .select("*")
      .order("display_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return defaultList;
    }

    // Merge to ensure all handles exist
    const dbMap = new Map<string, CategoryFlashCard>(data.map((d: any) => [d.category_handle, d]));
    return defaultList.map((def) => {
      const existing = dbMap.get(def.category_handle);
      return existing || def;
    });
  } catch (err) {
    console.error("Failed to fetch admin flash cards:", err);
    return defaultList;
  }
}
