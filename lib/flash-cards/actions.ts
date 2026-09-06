"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAdminAuth } from "@/lib/supabase/admin-guard";
import { revalidatePath } from "next/cache";
import { CategoryFlashCard, SaveCategoryFlashCardInput } from "./types";

/**
 * Saves or updates a Category Flash Ad Card in Supabase.
 */
export async function saveCategoryFlashCardAction(
  input: SaveCategoryFlashCardInput
): Promise<{ success: boolean; data?: CategoryFlashCard; error?: string }> {
  try {
    await requireAdminAuth("/admin/categories");
    const supabase = await createClient();

    if (!input.title || input.title.trim().length === 0) {
      return { success: false, error: "Flash card title is required." };
    }

    if (!input.category_handle) {
      return { success: false, error: "Category handle is required." };
    }

    const payload = {
      category_handle: input.category_handle,
      eyebrow: input.eyebrow ? input.eyebrow.trim() : null,
      title: input.title.trim(),
      body: input.body ? input.body.trim() : null,
      cta_text: input.cta_text.trim() || "Explore Collection",
      cta_url: input.cta_url.trim() || `/category/${input.category_handle}`,
      tone: input.tone || "ink",
      badge_text: input.badge_text ? input.badge_text.trim() : null,
      discount_tag: input.discount_tag ? input.discount_tag.trim() : null,
      image_url: input.image_url ? input.image_url.trim() : null,
      is_active: input.is_active !== undefined ? input.is_active : true,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("category_flash_cards")
      .upsert(payload, { onConflict: "category_handle" })
      .select()
      .single();

    if (error) {
      console.error("Failed to upsert category_flash_cards:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath(`/category/${input.category_handle}`);
    revalidatePath("/admin/categories");
    revalidatePath("/admin/flash-cards");

    return { success: true, data: data as CategoryFlashCard };
  } catch (err: any) {
    console.error("Save flash card exception:", err);
    return { success: false, error: err?.message || "Failed to save flash card." };
  }
}

/**
 * Toggles a Category Flash Ad Card active/inactive state.
 */
export async function toggleFlashCardStatusAction(
  categoryHandle: string,
  isActive: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdminAuth("/admin/categories");
    const supabase = await createClient();

    const { error } = await supabase
      .from("category_flash_cards")
      .update({ is_active: isActive, updated_at: new Date().toISOString() })
      .eq("category_handle", categoryHandle);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath(`/category/${categoryHandle}`);
    revalidatePath("/admin/categories");
    revalidatePath("/admin/flash-cards");

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to toggle card status." };
  }
}
