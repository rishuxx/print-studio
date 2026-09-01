"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdminAuth } from "@/lib/supabase/admin-guard";
import { requirePermission } from "@/lib/auth/server-permissions";
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
 * Save Product Action (Create or Update with Optimistic Concurrency & Audit Logging)
 */
export async function saveProductAction(rawInput: SaveProductInput): Promise<{
  success: boolean;
  productId?: string;
  version?: number;
  error?: string;
}> {
  try {
    // 1. Authoritative Admin Verification
    const { user } = await requirePermission("products.manage", "/admin/products");

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
    let oldProductState: Record<string, unknown> | null = null;

    if (productId) {
      // 3A. UPDATE with Optimistic Concurrency Check
      const { data: existing, error: fetchErr } = await supabase
        .from("products")
        .select("*")
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

      oldProductState = existing;

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
          brand: data.brand || "Doon Print Studio",
          tags: data.tags || [],
          badges: data.badges || [],
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
          base_price_minor: data.base_price_minor,
          compare_at_price_minor: data.compare_at_price_minor || null,
          cost_price_minor: data.cost_price_minor || null,
          sale_price_minor: data.sale_price_minor || null,
          sale_starts_at: data.sale_starts_at || null,
          sale_ends_at: data.sale_ends_at || null,
          publish_at: data.publish_at || null,
          unpublish_at: data.unpublish_at || null,
          customization_config: data.customization_config || {},
          shipping_config: data.shipping_config || {},
          merchandising_config: data.merchandising_config || {},
          seo_title: data.seo_title || null,
          seo_description: data.seo_description || null,
          canonical_url: data.canonical_url || null,
          og_title: data.og_title || null,
          og_description: data.og_description || null,
          og_image: data.og_image || null,
          no_index: data.no_index || false,
          version: newVersion,
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
          brand: data.brand || "Doon Print Studio",
          tags: data.tags || [],
          badges: data.badges || [],
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
          base_price_minor: data.base_price_minor,
          compare_at_price_minor: data.compare_at_price_minor || null,
          cost_price_minor: data.cost_price_minor || null,
          sale_price_minor: data.sale_price_minor || null,
          sale_starts_at: data.sale_starts_at || null,
          sale_ends_at: data.sale_ends_at || null,
          publish_at: data.publish_at || null,
          unpublish_at: data.unpublish_at || null,
          customization_config: data.customization_config || {},
          shipping_config: data.shipping_config || {},
          merchandising_config: data.merchandising_config || {},
          seo_title: data.seo_title || null,
          seo_description: data.seo_description || null,
          canonical_url: data.canonical_url || null,
          og_title: data.og_title || null,
          og_description: data.og_description || null,
          og_image: data.og_image || null,
          no_index: data.no_index || false,
          version: 1,
          created_by: user.id,
          updated_by: user.id,
          published_at: data.status === "active" ? new Date().toISOString() : null,
        })
        .select("id, version")
        .single();

      if (insertErr || !inserted) {
        if (insertErr?.code === "23505") {
          return { success: false, error: "A product with this SKU or URL slug already exists." };
        }
        return { success: false, error: insertErr?.message || "Failed to create product" };
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
          name: opt.name.trim(),
          values: opt.values.map((v) => v.trim()).filter(Boolean),
          sort_order: i * 10,
        }));
        await supabase.from("product_options").insert(optionRows);
      }
    }

    // 6. Synchronize Variants Matrix
    if (productId && data.variants) {
      // Remove obsolete variants not in the new list if updating
      const newVariantSkus = data.variants.map((v) => normalizeSKU(v.sku));
      if (newVariantSkus.length > 0) {
        await supabase
          .from("product_variants")
          .delete()
          .eq("product_id", productId)
          .not("sku", "in", `(${newVariantSkus.map((s) => `"${s}"`).join(",")})`);
      }

      for (let i = 0; i < data.variants.length; i++) {
        const v = data.variants[i];
        const vSku = normalizeSKU(v.sku);

        await supabase.from("product_variants").upsert(
          {
            product_id: productId,
            sku: vSku,
            title: v.title,
            barcode: v.barcode || null,
            available_for_sale: v.available_for_sale ?? true,
            selected_options: v.selected_options || [],
            price_factor: v.price_factor ?? 1.0,
            price_minor: v.price_minor ?? data.base_price_minor,
            sale_price_minor: v.sale_price_minor ?? null,
            cost_price_minor: v.cost_price_minor ?? Math.round(data.base_price_minor * 0.6),
            inventory_quantity: v.inventory_quantity ?? 100,
            track_inventory: v.track_inventory ?? false,
            allow_backorder: v.allow_backorder ?? true,
            status: v.status || "active",
            sort_order: i * 10,
          },
          { onConflict: "sku" }
        );
      }
    }

    // 7. Synchronize Dynamic Attribute Values
    if (productId && data.attribute_values) {
      await supabase.from("product_attribute_values").delete().eq("product_id", productId);
      if (data.attribute_values.length > 0) {
        const attrRows = data.attribute_values.map((av) => ({
          product_id: productId,
          attribute_id: av.attribute_id,
          value: av.value,
        }));
        await supabase.from("product_attribute_values").insert(attrRows);
      }
    }

    // 8. Synchronize Default Retail Price Book & Quantity Tiers
    // Ensure the default price book exists
    let { data: defaultPriceBook } = await supabase
      .from("price_books")
      .select("id")
      .eq("code", "DEFAULT_RETAIL")
      .maybeSingle();

    if (!defaultPriceBook) {
      const { data: newPriceBook } = await supabase
        .from("price_books")
        .insert({ code: "DEFAULT_RETAIL", name: "Default Retail Price Book", currency: "INR", status: "active" })
        .select("id")
        .maybeSingle();
      defaultPriceBook = newPriceBook;
    }

    if (productId && defaultPriceBook) {
      let { data: priceRecord } = await supabase
        .from("product_prices")
        .select("id")
        .eq("product_id", productId)
        .is("variant_id", null)
        .eq("price_book_id", defaultPriceBook.id)
        .maybeSingle();

      const pricePayload = {
        product_id: productId,
        variant_id: null,
        price_book_id: defaultPriceBook.id,
        base_price_minor: data.base_price_minor,
        compare_at_price_minor: data.compare_at_price_minor || null,
        cost_price_minor: data.cost_price_minor || Math.round(data.base_price_minor * 0.6),
        minimum_price_floor_minor: Math.round(data.base_price_minor * 0.4),
        currency: "INR",
        status: "active",
        version: newVersion,
      };

      if (priceRecord) {
        await supabase.from("product_prices").update(pricePayload).eq("id", priceRecord.id);
      } else {
        const { data: newPrice } = await supabase.from("product_prices").insert(pricePayload).select("id").maybeSingle();
        priceRecord = newPrice;
      }

      if (priceRecord && data.quantity_tiers && data.quantity_tiers.length > 0) {
        await supabase.from("product_quantity_tiers").delete().eq("product_price_id", priceRecord.id);
        const tierRows = data.quantity_tiers.map((t, idx) => ({
          product_price_id: priceRecord.id,
          min_quantity: t.min_quantity,
          max_quantity: t.max_quantity || null,
          tier_price_minor: t.tier_price_minor,
          discount_percent:
            t.discount_percent ??
            (data.base_price_minor > 0 && t.tier_price_minor < data.base_price_minor
              ? Number((((data.base_price_minor - t.tier_price_minor) / data.base_price_minor) * 100).toFixed(2))
              : 0),
          sort_order: idx * 10,
        }));
        await supabase.from("product_quantity_tiers").insert(tierRows);
      }
    }

    // 9. Record Immutable Audit Log
    await supabase.from("catalog_audit_logs").insert({
      entity_type: "product",
      entity_id: productId,
      action: oldProductState ? "UPDATE" : "CREATE",
      old_state: oldProductState,
      new_state: data,
      reason: oldProductState ? "Product updated via Admin Editor" : "New product created",
      admin_id: user.id,
      admin_email: user.email,
    });

    // 10. Invalidate Caches
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
 * Duplicate Product Action (Clones metadata, options, variants, pricing, attributes safely)
 */
export async function duplicateProductAction(
  productId: string
): Promise<{ success: boolean; newProductId?: string; error?: string }> {
  try {
    const { user } = await requirePermission("products.manage", "/admin/products");
    const supabase = await createClient();

    // 1. Fetch original product with options, variants, categories
    const { data: original, error: fetchErr } = await supabase
      .from("products")
      .select(
        `
        *,
        categories:product_category_links(category_id),
        options:product_options(*),
        variants:product_variants(*),
        media:product_media(*)
      `
      )
      .eq("id", productId)
      .single();

    if (fetchErr || !original) {
      return { success: false, error: "Original product not found." };
    }

    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const newTitle = `${original.title} (Copy)`;
    const newHandle = normalizeHandle(`${original.handle}-copy-${randomSuffix}`);
    const newSku = normalizeSKU(`${original.sku}-CPY-${randomSuffix}`);

    // 2. Insert Cloned Product
    const { data: cloned, error: insertErr } = await supabase
      .from("products")
      .insert({
        title: newTitle,
        handle: newHandle,
        sku: newSku,
        subtitle: original.subtitle,
        description: original.description,
        status: "draft",
        visibility: "hidden",
        product_type: original.product_type,
        brand: original.brand,
        tags: original.tags,
        badges: original.badges,
        unit: original.unit,
        min_order_qty: original.min_order_qty,
        qty_increment: original.qty_increment,
        turnaround_days: original.turnaround_days,
        is_featured: false,
        same_day_eligible: original.same_day_eligible,
        bulk_eligible: original.bulk_eligible,
        requires_artwork: original.requires_artwork,
        requires_proof: original.requires_proof,
        customizable: original.customizable,
        upload_only: original.upload_only,
        sort_order: (original.sort_order || 0) + 1,
        base_price_minor: original.base_price_minor,
        compare_at_price_minor: original.compare_at_price_minor,
        cost_price_minor: original.cost_price_minor,
        sale_price_minor: original.sale_price_minor,
        customization_config: original.customization_config,
        shipping_config: original.shipping_config,
        merchandising_config: original.merchandising_config,
        seo_title: `${newTitle} | Custom Printing`,
        seo_description: original.seo_description,
        version: 1,
        created_by: user.id,
        updated_by: user.id,
      })
      .select("id")
      .single();

    if (insertErr || !cloned) {
      return { success: false, error: insertErr?.message || "Failed to clone product" };
    }

    const newId = cloned.id;

    // 3. Clone Category Links
    if (original.categories && original.categories.length > 0) {
      const catRows = original.categories.map((c: { category_id: string }) => ({
        product_id: newId,
        category_id: c.category_id,
      }));
      await supabase.from("product_category_links").insert(catRows);
    }

    // 4. Clone Options
    if (original.options && original.options.length > 0) {
      const optRows = original.options.map((o: { name: string; values: string[]; sort_order: number }) => ({
        product_id: newId,
        name: o.name,
        values: o.values,
        sort_order: o.sort_order,
      }));
      await supabase.from("product_options").insert(optRows);
    }

    // 5. Clone Variants with New Unique SKUs
    if (original.variants && original.variants.length > 0) {
      const varRows = original.variants.map((v: {
        title: string;
        sku: string;
        available_for_sale: boolean;
        selected_options: unknown;
        price_factor: number;
        price_minor?: number;
        inventory_quantity: number;
        status: string;
        sort_order: number;
      }, i: number) => ({
        product_id: newId,
        title: v.title,
        sku: normalizeSKU(`${newSku}-V${i + 1}`),
        available_for_sale: v.available_for_sale,
        selected_options: v.selected_options,
        price_factor: v.price_factor,
        price_minor: v.price_minor || original.base_price_minor,
        inventory_quantity: v.inventory_quantity || 100,
        status: v.status || "active",
        sort_order: v.sort_order || i * 10,
      }));
      await supabase.from("product_variants").insert(varRows);
    }

    // 6. Clone Media References
    if (original.media && original.media.length > 0) {
      const mediaRows = original.media.map((m: {
        url: string;
        alt_text: string;
        width: number;
        height: number;
        is_primary: boolean;
        sort_order: number;
      }) => ({
        product_id: newId,
        url: m.url,
        alt_text: m.alt_text,
        width: m.width,
        height: m.height,
        is_primary: m.is_primary,
        sort_order: m.sort_order,
      }));
      await supabase.from("product_media").insert(mediaRows);
    }

    // 7. Record Audit Log
    await supabase.from("catalog_audit_logs").insert({
      entity_type: "product",
      entity_id: newId,
      action: "DUPLICATE",
      reason: `Duplicated from product ${original.title} (${original.sku})`,
      admin_id: user.id,
      admin_email: user.email,
    });

    revalidatePath("/admin/products");
    return { success: true, newProductId: newId };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to duplicate product",
    };
  }
}

/**
 * Delete Product Safely (Archives if historical orders exist, otherwise removes)
 */
export async function deleteProductSafelyAction(
  productId: string
): Promise<{ success: boolean; actionTaken: "archived" | "deleted"; error?: string }> {
  try {
    const { user } = await requirePermission("products.manage", "/admin/products");
    const supabase = await createClient();

    // Check if product is referenced in order_items
    const { count: orderCount } = await supabase
      .from("order_items")
      .select("id", { count: "exact", head: true })
      .eq("product_id", productId);

    if (orderCount && orderCount > 0) {
      // Historical references exist: Archive to preserve immutability
      await supabase
        .from("products")
        .update({
          status: "archived",
          visibility: "hidden",
          archived_at: new Date().toISOString(),
          updated_by: user.id,
        })
        .eq("id", productId);

      await supabase.from("catalog_audit_logs").insert({
        entity_type: "product",
        entity_id: productId,
        action: "ARCHIVE",
        reason: `Product archived instead of deleted because ${orderCount} historical order items exist.`,
        admin_id: user.id,
        admin_email: user.email,
      });

      revalidatePath("/admin/products");
      return { success: true, actionTaken: "archived" };
    }

    // Safe hard delete if no historical order references exist
    const { error: delErr } = await supabase.from("products").delete().eq("id", productId);
    if (delErr) return { success: false, actionTaken: "deleted", error: delErr.message };

    await supabase.from("catalog_audit_logs").insert({
      entity_type: "product",
      entity_id: productId,
      action: "DELETE",
      reason: "Product deleted safely (zero historical order references)",
      admin_id: user.id,
      admin_email: user.email,
    });

    revalidatePath("/admin/products");
    return { success: true, actionTaken: "deleted" };
  } catch (err: unknown) {
    return {
      success: false,
      actionTaken: "deleted",
      error: err instanceof Error ? err.message : "Failed to delete product",
    };
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
    const { user } = await requirePermission("products.manage", "/admin/products");
    const supabase = await createClient();

    const { data: prod, error: fetchErr } = await supabase
      .from("products")
      .select("id, handle, title, sku, status, version")
      .eq("id", productId)
      .single();

    if (fetchErr || !prod) {
      return { success: false, error: "Product not found" };
    }

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
      updates.visibility = "public";
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

    await supabase.from("catalog_audit_logs").insert({
      entity_type: "product",
      entity_id: productId,
      action: newStatus === "active" ? "PUBLISH" : newStatus === "paused" ? "PAUSE" : "ARCHIVE",
      old_state: { status: prod.status },
      new_state: { status: newStatus },
      reason: `Product status changed to ${newStatus}`,
      admin_id: user.id,
      admin_email: user.email,
    });

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
 * Bulk Product Actions
 */
export async function bulkProductOperationsAction(
  productIds: string[],
  operation: "publish" | "pause" | "archive" | "delete"
): Promise<{ success: boolean; count: number; error?: string }> {
  try {
    const { user } = await requirePermission("products.manage", "/admin/products");
    if (!productIds || productIds.length === 0) {
      return { success: false, count: 0, error: "No products selected" };
    }

    const supabase = await createClient();

    if (operation === "delete") {
      // Safe bulk delete or archive
      let count = 0;
      for (const id of productIds) {
        await deleteProductSafelyAction(id);
        count++;
      }
      return { success: true, count };
    }

    const targetStatus: ProductStatus =
      operation === "publish" ? "active" : operation === "pause" ? "paused" : "archived";

    const updates: Record<string, unknown> = {
      status: targetStatus,
      updated_by: user.id,
    };

    if (targetStatus === "active") {
      updates.published_at = new Date().toISOString();
      updates.archived_at = null;
      updates.visibility = "public";
    } else if (targetStatus === "archived") {
      updates.archived_at = new Date().toISOString();
      updates.visibility = "hidden";
    }

    const { error } = await supabase.from("products").update(updates).in("id", productIds);

    if (error) return { success: false, count: 0, error: error.message };

    await supabase.from("catalog_audit_logs").insert({
      entity_type: "product",
      entity_id: productIds.join(","),
      action: "BULK_UPDATE",
      reason: `Bulk updated ${productIds.length} products to ${targetStatus}`,
      admin_id: user.id,
      admin_email: user.email,
    });

    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath("/");

    return { success: true, count: productIds.length };
  } catch (err: unknown) {
    return {
      success: false,
      count: 0,
      error: err instanceof Error ? err.message : "Bulk operation failed",
    };
  }
}

/**
 * Save Category Action (Create or Update with Subcategories & Attribute Templates)
 */
export async function saveCategoryAction(rawInput: SaveCategoryInput): Promise<{
  success: boolean;
  categoryId?: string;
  error?: string;
}> {
  try {
    const { user } = await requirePermission("products.manage", "/admin/categories");
    const parsed = SaveCategorySchema.safeParse({
      ...rawInput,
      handle: normalizeHandle(rawInput.handle || rawInput.title),
    });

    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    const data = parsed.data;
    const supabase = await createClient();

    let categoryId = data.id;

    const payload = {
      handle: data.handle,
      title: data.title,
      blurb: data.blurb || null,
      icon: data.icon || "Folder",
      status: data.status,
      sort_order: data.sort_order,
      is_featured: data.is_featured,
      parent_id: data.parent_id || null,
      image_url: data.image_url || null,
      banner_url: data.banner_url || null,
      is_nav: data.is_nav ?? true,
      seo_title: data.seo_title || null,
      seo_description: data.seo_description || null,
    };

    if (categoryId) {
      const { error } = await supabase
        .from("categories")
        .update(payload)
        .eq("id", categoryId);

      if (error) {
        if (error.code === "23505") return { success: false, error: "A category with this handle already exists." };
        return { success: false, error: error.message };
      }
    } else {
      const { data: inserted, error } = await supabase
        .from("categories")
        .insert(payload)
        .select("id")
        .single();

      if (error || !inserted) {
        if (error?.code === "23505") return { success: false, error: "A category with this handle already exists." };
        return { success: false, error: error?.message || "Failed to create category" };
      }
      categoryId = inserted.id;
    }

    // Sync Category Attribute Templates
    if (categoryId && data.attribute_ids) {
      await supabase.from("category_attribute_templates").delete().eq("category_id", categoryId);
      if (data.attribute_ids.length > 0) {
        const rows = data.attribute_ids.map((attrId, idx) => ({
          category_id: categoryId,
          attribute_id: attrId,
          sort_order: idx * 10,
        }));
        await supabase.from("category_attribute_templates").insert(rows);
      }
    }

    await supabase.from("catalog_audit_logs").insert({
      entity_type: "category",
      entity_id: categoryId,
      action: data.id ? "UPDATE" : "CREATE",
      new_state: data,
      reason: `Category ${data.title} saved`,
      admin_id: user.id,
      admin_email: user.email,
    });

    revalidatePath("/admin/categories");
    revalidatePath("/");

    return { success: true, categoryId };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to save category" };
  }
}

/**
 * Archive Category (Safe transition, does not delete products)
 */
export async function updateCategoryStatusAction(
  categoryId: string,
  newStatus: CategoryStatus
): Promise<{ success: boolean; error?: string }> {
  try {
    const { user } = await requirePermission("products.manage", "/admin/categories");
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
