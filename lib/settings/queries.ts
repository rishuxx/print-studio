import { createClient } from "@/lib/supabase/server";
import { DEFAULT_BUSINESS_SETTINGS } from "./constants";
import type { DatabaseBusinessSettings } from "./types";

export { DEFAULT_BUSINESS_SETTINGS };

/**
 * Fetches authoritative business settings from Supabase.
 * Returns single canonical database record or initialized defaults.
 */
export async function getAuthoritativeBusinessSettings(): Promise<DatabaseBusinessSettings> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("business_settings")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      return DEFAULT_BUSINESS_SETTINGS;
    }

    return data as DatabaseBusinessSettings;
  } catch {
    return DEFAULT_BUSINESS_SETTINGS;
  }
}
