"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdminAuth } from "@/lib/supabase/admin-guard";
import { SaveHeroBannerInput, HeroBannerRecord } from "./types";
import { PRODUCT_MEDIA_BUCKET } from "@/lib/storage/product-media-utils";

/**
 * Upload banner image asset to Supabase Storage
 */
export async function uploadBannerImageAction(formData: FormData): Promise<{
  success: boolean;
  url?: string;
  error?: string;
}> {
  try {
    // Authenticate admin user
    await requireAdminAuth("/admin/hero");

    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "hero";

    if (!file) {
      return { success: false, error: "No image file provided." };
    }

    if (file.size > 25 * 1024 * 1024) {
      return { success: false, error: "File exceeds maximum size of 25MB." };
    }

    const rawExt = file.name.split(".").pop() || "jpg";
    const cleanExt = rawExt.toLowerCase().replace(/[^a-z0-9]/g, "");
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${cleanExt}`;

    const supabase = await createClient();

    // Convert file to ArrayBuffer / Buffer for robust server-side Supabase Storage upload
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    const { error: uploadErr } = await supabase.storage
      .from(PRODUCT_MEDIA_BUCKET)
      .upload(fileName, fileBuffer, {
        contentType: file.type || "image/jpeg",
        upsert: true,
      });

    if (uploadErr) {
      return { success: false, error: uploadErr.message };
    }

    const { data } = supabase.storage
      .from(PRODUCT_MEDIA_BUCKET)
      .getPublicUrl(fileName);

    return { success: true, url: data.publicUrl };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to upload banner image.",
    };
  }
}

/**
 * Save or Update Hero Banner
 */
export async function saveHeroBannerAction(
  input: SaveHeroBannerInput
): Promise<{ success: boolean; data?: HeroBannerRecord; error?: string }> {
  try {
    const { user } = await requireAdminAuth("/admin/hero");
    const supabase = await createClient();

    const payload = {
      title: input.title.trim(),
      subtitle: input.subtitle ? input.subtitle.trim() : null,
      eyebrow: input.eyebrow ? input.eyebrow.trim() : null,
      description: input.description ? input.description.trim() : null,
      desktop_image_url: input.desktop_image_url,
      mobile_image_url: input.mobile_image_url || null,
      alt_text: input.alt_text ? input.alt_text.trim() : null,
      content_mode: input.content_mode,
      primary_cta_text: input.primary_cta_text ? input.primary_cta_text.trim() : null,
      primary_cta_url: input.primary_cta_url ? input.primary_cta_url.trim() : null,
      primary_cta_bg_color: input.primary_cta_bg_color || "#e53935",
      primary_cta_text_color: input.primary_cta_text_color || "#ffffff",
      secondary_cta_text: input.secondary_cta_text ? input.secondary_cta_text.trim() : null,
      secondary_cta_url: input.secondary_cta_url ? input.secondary_cta_url.trim() : null,
      secondary_cta_bg_color: input.secondary_cta_bg_color || "#ffffff",
      secondary_cta_text_color: input.secondary_cta_text_color || "#222225",
      text_color: input.text_color || "#222225",
      overlay_enabled: input.overlay_enabled,
      overlay_opacity: input.overlay_opacity,
      display_order: Number(input.display_order) || 0,
      is_active: input.is_active,
      start_date: input.start_date || null,
      end_date: input.end_date || null,
      updated_by: user.id,
    };

    let result;

    if (input.id) {
      // Update existing
      result = await supabase
        .from("homepage_hero_banners")
        .update(payload)
        .eq("id", input.id)
        .select()
        .single();
    } else {
      // Insert new
      result = await supabase
        .from("homepage_hero_banners")
        .insert({
          ...payload,
          created_by: user.id,
        })
        .select()
        .single();
    }

    if (result.error) {
      return { success: false, error: result.error.message };
    }

    revalidatePath("/", "layout");
    revalidatePath("/admin/hero");

    return { success: true, data: result.data as HeroBannerRecord };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to save hero banner.",
    };
  }
}

/**
 * Toggle Active Status
 */
export async function toggleHeroBannerStatusAction(
  id: string,
  isActive: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdminAuth("/admin/hero");
    const supabase = await createClient();

    const { error } = await supabase
      .from("homepage_hero_banners")
      .update({ is_active: isActive })
      .eq("id", id);

    if (error) return { success: false, error: error.message };

    revalidatePath("/", "layout");
    revalidatePath("/admin/hero");
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to toggle status.",
    };
  }
}

/**
 * Delete Hero Banner
 */
export async function deleteHeroBannerAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdminAuth("/admin/hero");
    const supabase = await createClient();

    const { error } = await supabase
      .from("homepage_hero_banners")
      .delete()
      .eq("id", id);

    if (error) return { success: false, error: error.message };

    revalidatePath("/", "layout");
    revalidatePath("/admin/hero");
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to delete hero banner.",
    };
  }
}

/**
 * Reorder Hero Banners
 */
export async function reorderHeroBannersAction(
  orderedIds: string[]
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdminAuth("/admin/hero");
    const supabase = await createClient();

    const updates = orderedIds.map((id, index) =>
      supabase
        .from("homepage_hero_banners")
        .update({ display_order: index + 1 })
        .eq("id", id)
    );

    await Promise.all(updates);

    revalidatePath("/", "layout");
    revalidatePath("/admin/hero");
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to reorder hero banners.",
    };
  }
}

/**
 * Save Branding Settings (Logo Mode, Logo Images, Colors)
 */
export async function saveBrandingSettingsAction(payload: {
  logo_mode: "text" | "image";
  logo_url: string | null;
  logo_mobile_url?: string | null;
  logo_alt_text?: string | null;
  logo_height_desktop?: number;
  logo_height_mobile?: number;
  business_name: string;
  primary_brand_color?: string;
  secondary_brand_color?: string;
  accent_brand_color?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const { user } = await requireAdminAuth("/admin/branding");
    const supabase = await createClient();

    const { data: existing } = await supabase
      .from("business_settings")
      .select("id")
      .limit(1)
      .single();

    if (existing) {
      const { error } = await supabase
        .from("business_settings")
        .update({
          ...payload,
          updated_by: user.id,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id);

      if (error) return { success: false, error: error.message };
    }

    revalidatePath("/", "layout");
    revalidatePath("/admin/branding");
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to save branding settings.",
    };
  }
}
