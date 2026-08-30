"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdminAuth } from "@/lib/supabase/admin-guard";
import {
  SaveProductSchema,
  SaveCategorySchema,
  normalizeHandle,
  normalizeSKU,
  type SaveProductInput,
  type SaveCategoryInput,
} from "./validation";
import type { ProductStatus, CategoryStatus } from "./types";

/**
 * Save Product Action (Create or Update with Optimistic Concurrency Protection)
 */
export async function saveProductAction(rawInput: SaveProductInput): Promise<{
  success: boolean;
  productId?: string;
  version?: number;
  error?: string;
}> {
  try {
    // 1. Authoritative Admin Verification
    const { user } = await requireAdminAuth("/admin/products");

    // 2. Server-side Schema Validation
    const parsed = SaveProductSchema.safeParse({
      ...rawInput,
      handle: normalizeHandle(rawInput.handle || rawInput.title),
      sku: normalizeSKU(rawInput.sku),
    });

    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      return {
        success: false,
        error: `${firstIssue.path.join(".")}: ${firstIssue.message}`,
      };
    }

    const data = parsed.data;
    const supabase = await createClient();

    let productId = data.id;
    let newVersion = (data.version || 1) + 1;

    if (productId) {
      // 3A. UPDATE with Optimistic Concurrency Check
      const { data: existing, error: fetchErr } = await supabase
        .from("products")
        .select("id, version, status")
        .eq("id", productId)
        .single();

      if (fetchErr || !existing) {
        return { success: false, error: "Product not found or has been deleted." };
      }

      if (existing.version !== data.version) {
        return {
          success: false,
          error:
            "This product was modified by another administrator in the background. Please refresh before saving.",
        };
      }

      const { error: updateErr } = await supabase
        .from("products")
        .update({
          handle: data.handle,
          title: data.title,
          subtitle: data.subtitle,
          description: data.description,
          sku: data.sku,
          status: data.status,
          visibility: data.visibility,
          product_type: data.product_type,
          unit: data.unit,
          min_order_qty: data.min_order_qty,
          qty_increment: data.qty_increment,
          turnaround_days: data.turnaround_days,
          is_featured: data.is_featured,
          same_day_eligible: data.same_day_eligible,
          bulk_eligible: data.bulk_eligible,
          requires_artwork: data.requires_artwork,
          requires_proof: data.requires_proof,
          customizable: data.customizable,
          upload_only: data.upload_only,
          sort_order: data.sort_order,
          version: newVersion,
          seo_title: data.seo_title,
          seo_description: data.seo_description,
          canonical_url: data.canonical_url || null,
          updated_by: user.id,
          published_at: data.status === "active" ? new Date().toISOString() : undefined,
        })
        .eq("id", productId)
        .eq("version", data.version);

      if (updateErr) {
        if (updateErr.code === "23505") {
          return { success: false, error: "A product with this SKU or URL slug already exists." };
        }
        return { success: false, error: updateErr.message };
      }
    } else {
      // 3B. INSERT new product
      const { data: inserted, error: insertErr } = await supabase
        .from("products")
        .insert({
          handle: data.handle,
          title: data.title,
          subtitle: data.subtitle,
          description: data.description,
          sku: data.sku,
          status: data.status,
          visibility: data.visibility,
          product_type: data.product_type,
          unit: data.unit,
          min_order_qty: data.min_order_qty,
          qty_increment: data.qty_increment,
          turnaround_days: data.turnaround_days,
          is_featured: data.is_featured,
          same_day_eligible: data.same_day_eligible,
          bulk_eligible: data.bulk_eligible,
          requires_artwork: data.requires_artwork,
          requires_proof: data.requires_proof,
          customizable: data.customizable,
          upload_only: data.upload_only,
          sort_order: data.sort_order,
          version: 1,
          seo_title: data.seo_title,
          seo_description: data.seo_description,
          canonical_url: data.canonical_url || null,
          created_by: user.id,
          updated_by: user.id,
          published_at: data.status === "active" ? new Date().toISOString() : null,
        })
        .select("id, version")
        .single();

      if (insertErr) {
        if (insertErr.code === "23505") {
          return { success: false, error: "A product with this SKU or URL slug already exists." };
        }
        return { success: false, error: insertErr.message };
      }

      productId = inserted.id;
      newVersion = inserted.version;
    }

    // 4. Synchronize Category Links
    if (productId && data.category_ids) {
      await supabase.from("product_category_links").delete().eq("product_id", productId);
      if (data.category_ids.length > 0) {
        const linkRows = data.category_ids.map((catId) => ({
          product_id: productId,
          category_id: catId,
        }));
        await supabase.from("product_category_links").insert(linkRows);
      }
    }

    // 5. Synchronize Options & Values
    if (productId && data.options) {
      await supabase.from("product_options").delete().eq("product_id", productId);
      if (data.options.length > 0) {
        const optionRows = data.options.map((opt, i) => ({
          product_id: productId,
          name: opt.name,
          values: opt.values,
          sort_order: i * 10,
        }));
        await supabase.from("product_options").insert(optionRows);
      }
    }

    // 6. Invalidate Caches
    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${productId}`);
    revalidatePath(`/product/${data.handle}`);
    revalidatePath("/products");
    revalidatePath("/");

    return { success: true, productId, version: newVersion };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to save product.";
    return { success: false, error: msg };
  }
}

/**
 * Transition Product State (Draft -> Active -> Paused -> Archived -> Restored)
 */
export async function updateProductStatusAction(
  productId: string,
  newStatus: ProductStatus
): Promise<{ success: boolean; error?: string }> {
  try {
    const { user } = await requireAdminAuth("/admin/products");
    const supabase = await createClient();

    // 1. Fetch current product
    const { data: prod, error: fetchErr } = await supabase
      .from("products")
      .select("id, handle, title, sku, status, version")
      .eq("id", productId)
      .single();

    if (fetchErr || !prod) {
      return { success: false, error: "Product not found" };
    }

    // 2. Validate Publishing Requirements if Activating
    if (newStatus === "active") {
      if (!prod.title || prod.title.trim().length < 2) {
        return { success: false, error: "Cannot publish product without a valid title." };
      }
      if (!prod.sku || prod.sku.trim().length < 2) {
        return { success: false, error: "Cannot publish product without a valid SKU." };
      }
    }

    const updates: Record<string, unknown> = {
      status: newStatus,
      updated_by: user.id,
      version: prod.version + 1,
    };

    if (newStatus === "active") {
      updates.published_at = new Date().toISOString();
      updates.archived_at = null;
    } else if (newStatus === "archived") {
      updates.archived_at = new Date().toISOString();
      updates.visibility = "hidden";
    }

    const { error: updateErr } = await supabase
      .from("products")
      .update(updates)
      .eq("id", productId);

    if (updateErr) {
      return { success: false, error: updateErr.message };
    }

    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${productId}`);
    revalidatePath(`/product/${prod.handle}`);
    revalidatePath("/products");
    revalidatePath("/");

    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Status update failed" };
  }
}

/**
 * Bulk Product Status Update (Bulk Publish, Pause, Archive)
 */
export async function bulkUpdateProductStatusAction(
  productIds: string[],
  newStatus: ProductStatus
): Promise<{ success: boolean; updatedCount: number; error?: string }> {
  try {
    const { user } = await requireAdminAuth("/admin/products");
    if (!productIds || productIds.length === 0) {
      return { success: false, updatedCount: 0, error: "No products selected" };
    }

    const supabase = await createClient();
    const updates: Record<string, unknown> = {
      status: newStatus,
      updated_by: user.id,
    };

    if (newStatus === "active") {
      updates.published_at = new Date().toISOString();
      updates.archived_at = null;
    } else if (newStatus === "archived") {
      updates.archived_at = new Date().toISOString();
      updates.visibility = "hidden";
    }

    const { error } = await supabase.from("products").update(updates).in("id", productIds);

    if (error) {
      return { success: false, updatedCount: 0, error: error.message };
    }

    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath("/");

    return { success: true, updatedCount: productIds.length };
  } catch (err: unknown) {
    return {
      success: false,
      updatedCount: 0,
      error: err instanceof Error ? err.message : "Bulk update failed",
    };
  }
}

/**
 * Save Category Action (Create or Update)
 */
export async function saveCategoryAction(rawInput: SaveCategoryInput): Promise<{
  success: boolean;
  categoryId?: string;
  error?: string;
}> {
  try {
    await requireAdminAuth("/admin/categories");
    const parsed = SaveCategorySchema.safeParse({
      ...rawInput,
      handle: normalizeHandle(rawInput.handle || rawInput.title),
    });

    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    const data = parsed.data;
    const supabase = await createClient();

    if (data.id) {
      const { error } = await supabase
        .from("categories")
        .update({
          handle: data.handle,
          title: data.title,
          blurb: data.blurb,
          icon: data.icon,
          status: data.status,
          sort_order: data.sort_order,
          is_featured: data.is_featured,
          seo_title: data.seo_title,
          seo_description: data.seo_description,
        })
        .eq("id", data.id);

      if (error) {
        if (error.code === "23505") return { success: false, error: "A category with this URL handle already exists." };
        return { success: false, error: error.message };
      }
      return { success: true, categoryId: data.id };
    } else {
      const { data: inserted, error } = await supabase
        .from("categories")
        .insert({
          handle: data.handle,
          title: data.title,
          blurb: data.blurb,
          icon: data.icon,
          status: data.status,
          sort_order: data.sort_order,
          is_featured: data.is_featured,
          seo_title: data.seo_title,
          seo_description: data.seo_description,
        })
        .select("id")
        .single();

      if (error) {
        if (error.code === "23505") return { success: false, error: "A category with this URL handle already exists." };
        return { success: false, error: error.message };
      }
      return { success: true, categoryId: inserted.id };
    }
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to save category" };
  }
}

/**
 * Archive Category (Safe status transition, does NOT delete products)
 */
export async function updateCategoryStatusAction(
  categoryId: string,
  newStatus: CategoryStatus
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdminAuth("/admin/categories");
    const supabase = await createClient();

    const { error } = await supabase
      .from("categories")
      .update({ status: newStatus })
      .eq("id", categoryId);

    if (error) return { success: false, error: error.message };

    revalidatePath("/admin/categories");
    revalidatePath("/");
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Status update failed" };
  }
}
