"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAdminAuth } from "@/lib/supabase/admin-guard";
import { revalidatePath } from "next/cache";
import { CategoryFlashCard, SaveCategoryFlashCardInput } from "./types";

/**
 * Saves or updates a Category Flash Ad Card in Supabase.
 * Uses primary `category_flash_cards` table if present, with seamless fallback
 * to `business_settings.mega_menu_flash_ads_json` if the custom table is not yet migrated in Supabase SQL editor.
 */
export async function saveCategoryFlashCardAction(
  input: SaveCategoryFlashCardInput
): Promise<{ success: boolean; data?: CategoryFlashCard; error?: string }> {
  try {
    const { user } = await requireAdminAuth("/admin/flash-cards");
    const supabase = await createClient();

    if (!input.title || input.title.trim().length === 0) {
      return { success: false, error: "Flash card title is required." };
    }

    if (!input.category_handle) {
      return { success: false, error: "Category handle is required." };
    }

    // Validate if input.id is a valid UUID; if not (e.g. "card-same-day" or "default-same-day"), omit it
    const isUuid = input.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(input.id);

    const dbPayload: any = {
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
      display_order: 0,
      updated_at: new Date().toISOString(),
    };

    if (input.banner_style) dbPayload.banner_style = input.banner_style;
    if (input.cta_style) dbPayload.cta_style = input.cta_style;
    if (input.card_size) dbPayload.card_size = input.card_size;
    if (input.aspect_ratio) dbPayload.aspect_ratio = input.aspect_ratio;
    if (input.show_cta !== undefined) dbPayload.show_cta = input.show_cta;

    if (isUuid) {
      dbPayload.id = input.id;
    }

    const payload: CategoryFlashCard = {
      ...dbPayload,
      id: dbPayload.id || `card-${input.category_handle}`,
      banner_style: input.banner_style || "full_overlay",
      cta_style: input.cta_style || "primary_red",
      card_size: input.card_size || "wide",
      aspect_ratio: input.aspect_ratio || "cover",
      show_cta: input.show_cta !== undefined ? input.show_cta : true,
    };

    // 1. Try upserting to category_flash_cards table
    // If the database table does not have banner_style / cta_style columns yet, catch and retry without them
    let data: any = null;
    let error: any = null;

    const upsertRes = await supabase
      .from("category_flash_cards")
      .upsert(dbPayload, { onConflict: "category_handle" })
      .select()
      .single();

    if (upsertRes.error && (upsertRes.error.message?.includes("column") || upsertRes.error.code === "42703")) {
      // Retry without the new optional columns if user's Postgres table hasn't migrated them yet
      const basePayload = {
        category_handle: dbPayload.category_handle,
        eyebrow: dbPayload.eyebrow,
        title: dbPayload.title,
        body: dbPayload.body,
        cta_text: dbPayload.cta_text,
        cta_url: dbPayload.cta_url,
        tone: dbPayload.tone,
        badge_text: dbPayload.badge_text,
        discount_tag: dbPayload.discount_tag,
        image_url: dbPayload.image_url,
        is_active: dbPayload.is_active,
        display_order: dbPayload.display_order,
        updated_at: dbPayload.updated_at,
      };
      if (isUuid) (basePayload as any).id = dbPayload.id;

      const retryRes = await supabase
        .from("category_flash_cards")
        .upsert(basePayload, { onConflict: "category_handle" })
        .select()
        .single();
      data = retryRes.data;
      error = retryRes.error;
    } else {
      data = upsertRes.data;
      error = upsertRes.error;
    }

    if (!error && data) {
      revalidatePath("/", "layout");
      revalidatePath(`/category/${input.category_handle}`);
      revalidatePath("/admin/flash-cards");
      return { success: true, data: data as CategoryFlashCard };
    }

    // 2. Fallback: If table is missing in schema cache, store in business_settings.mega_menu_flash_ads_json
    console.warn("Fallback to storing flash ads in business_settings:", error?.message);

    const { data: bsRecord } = await supabase
      .from("business_settings")
      .select("id, mega_menu_flash_ads_json")
      .limit(1)
      .maybeSingle();

    if (bsRecord) {
      const currentJson = (bsRecord.mega_menu_flash_ads_json as Record<string, any>) || {};
      const updatedJson = {
        ...currentJson,
        [input.category_handle]: payload,
      };

      const { error: bsUpdateErr } = await supabase
        .from("business_settings")
        .update({
          mega_menu_flash_ads_json: updatedJson,
          updated_by: user.id,
          updated_at: new Date().toISOString(),
        })
        .eq("id", bsRecord.id);

      if (!bsUpdateErr) {
        revalidatePath("/", "layout");
        revalidatePath(`/category/${input.category_handle}`);
        revalidatePath("/admin/flash-cards");
        return { success: true, data: payload };
      }
    }

    return {
      success: false,
      error: error?.message || "Failed to save flash ad card. Please verify database permissions.",
    };
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
    const { user } = await requireAdminAuth("/admin/flash-cards");
    const supabase = await createClient();

    // 1. Try table update
    const { error } = await supabase
      .from("category_flash_cards")
      .update({ is_active: isActive, updated_at: new Date().toISOString() })
      .eq("category_handle", categoryHandle);

    if (!error) {
      revalidatePath("/", "layout");
      revalidatePath(`/category/${categoryHandle}`);
      revalidatePath("/admin/flash-cards");
      return { success: true };
    }

    // 2. Fallback: update in business_settings JSON
    const { data: bsRecord } = await supabase
      .from("business_settings")
      .select("id, mega_menu_flash_ads_json")
      .limit(1)
      .maybeSingle();

    if (bsRecord) {
      const currentJson = (bsRecord.mega_menu_flash_ads_json as Record<string, any>) || {};
      if (currentJson[categoryHandle]) {
        currentJson[categoryHandle].is_active = isActive;
        currentJson[categoryHandle].updated_at = new Date().toISOString();
      }

      await supabase
        .from("business_settings")
        .update({
          mega_menu_flash_ads_json: currentJson,
          updated_by: user.id,
          updated_at: new Date().toISOString(),
        })
        .eq("id", bsRecord.id);

      revalidatePath("/", "layout");
      revalidatePath(`/category/${categoryHandle}`);
      revalidatePath("/admin/flash-cards");
      return { success: true };
    }

    return { success: false, error: error.message };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to toggle card status." };
  }
}
