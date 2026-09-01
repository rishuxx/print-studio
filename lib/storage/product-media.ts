"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAdminAuth } from "@/lib/supabase/admin-guard";
import type { DatabaseProductMedia } from "@/lib/catalogue/types";
import {
  PRODUCT_MEDIA_BUCKET,
  validateProductMediaFile,
  generateProductMediaStoragePath,
} from "./product-media-utils";

/**
 * Server Action: Upload product image to Supabase Storage and create product_media record
 */
export async function uploadProductMediaAction(formData: FormData): Promise<{
  success: boolean;
  media?: DatabaseProductMedia;
  error?: string;
}> {
  try {
    await requireAdminAuth("/admin/products");

    const file = formData.get("file") as File | null;
    const productId = formData.get("productId") as string | null;
    const variantId = (formData.get("variantId") as string | null) || null;
    const altText = (formData.get("altText") as string | null) || null;
    const caption = (formData.get("caption") as string | null) || null;
    const isPrimary = formData.get("isPrimary") === "true";
    const isGallery = formData.get("isGallery") !== "false";
    const sortOrder = Number(formData.get("sortOrder") || 0);

    if (!file || !productId) {
      return { success: false, error: "File and Product ID are required." };
    }

    const validation = validateProductMediaFile(file.name, file.type, file.size);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    const storageKey = generateProductMediaStoragePath(productId, validation.extension!);
    const supabase = await createClient();

    // 1. Upload bytes to storage bucket
    const { error: uploadError } = await supabase.storage
      .from(PRODUCT_MEDIA_BUCKET)
      .upload(storageKey, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      return { success: false, error: `Storage upload failed: ${uploadError.message}` };
    }

    // 2. Get Public URL
    const { data: publicUrlData } = supabase.storage
      .from(PRODUCT_MEDIA_BUCKET)
      .getPublicUrl(storageKey);

    const publicUrl = publicUrlData.publicUrl;

    // 3. If setting primary, reset existing primary images for this product
    if (isPrimary) {
      await supabase
        .from("product_media")
        .update({ is_primary: false })
        .eq("product_id", productId);
    }

    // 4. Insert row into public.product_media
    const { data: insertedMedia, error: insertError } = await supabase
      .from("product_media")
      .insert({
        product_id: productId,
        variant_id: variantId,
        url: publicUrl,
        storage_key: storageKey,
        alt_text: altText || validation.sanitizedName || "Product Media",
        caption: caption,
        width: 1200,
        height: 1200,
        mime_type: file.type,
        file_size: file.size,
        is_primary: isPrimary,
        is_gallery: isGallery,
        is_thumbnail: isPrimary,
        sort_order: sortOrder,
      })
      .select()
      .single();

    if (insertError || !insertedMedia) {
      // Clean up orphaned storage object on database error
      await supabase.storage.from(PRODUCT_MEDIA_BUCKET).remove([storageKey]);
      return { success: false, error: `Database insert failed: ${insertError?.message}` };
    }

    return {
      success: true,
      media: insertedMedia as DatabaseProductMedia,
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to upload media.",
    };
  }
}

/**
 * Server Action: Safe delete media (removes from storage and database)
 */
export async function deleteProductMediaAction(mediaId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    await requireAdminAuth("/admin/products");
    const supabase = await createClient();

    // 1. Fetch media record to obtain storage_key
    const { data: media, error: fetchError } = await supabase
      .from("product_media")
      .select("id, storage_key, product_id, is_primary")
      .eq("id", mediaId)
      .single();

    if (fetchError || !media) {
      return { success: false, error: "Media record not found." };
    }

    // 2. Remove from Supabase Storage if storage_key exists
    if (media.storage_key) {
      await supabase.storage.from(PRODUCT_MEDIA_BUCKET).remove([media.storage_key]);
    }

    // 3. Delete database record
    const { error: deleteError } = await supabase
      .from("product_media")
      .delete()
      .eq("id", mediaId);

    if (deleteError) {
      return { success: false, error: deleteError.message };
    }

    // 4. If primary was deleted, promote another image if available
    if (media.is_primary) {
      const { data: remaining } = await supabase
        .from("product_media")
        .select("id")
        .eq("product_id", media.product_id)
        .order("sort_order", { ascending: true })
        .limit(1);

      if (remaining && remaining.length > 0) {
        await supabase
          .from("product_media")
          .update({ is_primary: true })
          .eq("id", remaining[0].id);
      }
    }

    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to delete media.",
    };
  }
}
