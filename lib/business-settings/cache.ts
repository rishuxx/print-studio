import { revalidatePath } from "next/cache";

/**
 * ═════════════════════════════════════════════════════════════════════════════
 * PHASE 10H: CACHE INVALIDATION UTILITIES
 * ═════════════════════════════════════════════════════════════════════════════
 */

/**
 * Revalidates all settings routes and layout cache after a successful mutation.
 */
export function invalidateSettingsCache() {
  try {
    revalidatePath("/admin/settings", "page");
    revalidatePath("/", "layout");
  } catch (err) {
    console.warn("[Cache] Revalidation warning (may occur during SSG/build):", err);
  }
}
