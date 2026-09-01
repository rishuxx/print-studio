"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdminAuth } from "@/lib/supabase/admin-guard";
import { requirePermission } from "@/lib/auth/server-permissions";
import {
  SaveProductPriceSchema,
  SavePromotionSchema,
  BulkPriceAdjustmentSchema,
  type SaveProductPriceInput,
  type SavePromotionInput,
  type BulkPriceAdjustmentInput,
} from "./validation";
import type { PromotionStatus } from "./types";

/**
 * Save / Update Product Price Record with Optimistic Concurrency
 */
export async function saveProductPriceAction(rawInput: SaveProductPriceInput): Promise<{
  success: boolean;
  priceId?: string;
  error?: string;
}> {
  try {
    const { user } = await requirePermission("pricing.manage", "/admin/pricing");
    const parsed = SaveProductPriceSchema.safeParse(rawInput);

    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    const data = parsed.data;
    const supabase = await createClient();

    if (data.id) {
      // Update with version increment
      const { error: updateErr } = await supabase
        .from("product_prices")
        .update({
          base_price_minor: data.basePriceMinor,
          compare_at_price_minor: data.compareAtPriceMinor,
          cost_price_minor: data.costPriceMinor,
          minimum_price_floor_minor: data.minimumPriceFloorMinor,
          status: data.status,
          version: data.version + 1,
          updated_by: user.id,
          updated_at: new Date().toISOString(),
        })
        .eq("id", data.id)
        .eq("version", data.version);

      if (updateErr) {
        return { success: false, error: updateErr.message };
      }

      // If quantity tiers provided, replace existing tiers
      if (data.quantityTiers !== undefined) {
        await supabase
          .from("product_quantity_tiers")
          .delete()
          .eq("product_price_id", data.id);

        if (data.quantityTiers.length > 0) {
          const tiersToInsert = data.quantityTiers.map((t, idx) => ({
            product_price_id: data.id as string,
            min_quantity: t.minQuantity,
            max_quantity: t.maxQuantity || null,
            tier_price_minor: t.tierPriceMinor,
            discount_percent: t.discountPercent || 0,
            sort_order: idx * 10,
          }));
          await supabase.from("product_quantity_tiers").insert(tiersToInsert);
        }
      }

      // Record Audit History
      await supabase.from("pricing_history").insert({
        product_id: data.productId,
        variant_id: data.variantId || null,
        price_book_id: data.priceBookId,
        new_price_minor: data.basePriceMinor,
        change_type: "base_price_update",
        reason: "Administrative price modification",
        admin_id: user.id,
      });

      revalidatePath("/admin/pricing");
      revalidatePath("/products");
      return { success: true, priceId: data.id };
    } else {
      // Insert new price
      const { data: inserted, error: insertErr } = await supabase
        .from("product_prices")
        .insert({
          product_id: data.productId,
          variant_id: data.variantId || null,
          price_book_id: data.priceBookId,
          base_price_minor: data.basePriceMinor,
          compare_at_price_minor: data.compareAtPriceMinor,
          cost_price_minor: data.costPriceMinor,
          minimum_price_floor_minor: data.minimumPriceFloorMinor,
          status: data.status,
          version: 1,
          created_by: user.id,
          updated_by: user.id,
        })
        .select("id")
        .single();

      if (insertErr) {
        return { success: false, error: insertErr.message };
      }

      if (data.quantityTiers && data.quantityTiers.length > 0) {
        const tiersToInsert = data.quantityTiers.map((t, idx) => ({
          product_price_id: inserted.id,
          min_quantity: t.minQuantity,
          max_quantity: t.maxQuantity || null,
          tier_price_minor: t.tierPriceMinor,
          discount_percent: t.discountPercent || 0,
          sort_order: idx * 10,
        }));
        await supabase.from("product_quantity_tiers").insert(tiersToInsert);
      }

      revalidatePath("/admin/pricing");
      return { success: true, priceId: inserted.id };
    }
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to save price" };
  }
}

/**
 * Save Promotion Campaign (Start / Stop / Schedule)
 */
export async function savePromotionAction(rawInput: SavePromotionInput): Promise<{
  success: boolean;
  promotionId?: string;
  error?: string;
}> {
  try {
    const { user } = await requirePermission("pricing.manage", "/admin/pricing");
    const parsed = SavePromotionSchema.safeParse(rawInput);

    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    const data = parsed.data;
    const supabase = await createClient();

    if (data.id) {
      const { error } = await supabase
        .from("promotions_and_sales")
        .update({
          name: data.name,
          code: data.code,
          description: data.description,
          type: data.type,
          status: data.status,
          stackable: data.stackable,
          priority: data.priority,
          discount_value: data.discountValue,
          min_order_value_minor: data.minOrderValueMinor,
          max_discount_amount_minor: data.maxDiscountAmountMinor,
          target_type: data.targetType,
          target_ids: data.targetIds,
          starts_at: data.startsAt,
          ends_at: data.endsAt,
          timezone: data.timezone,
          version: data.version + 1,
          updated_by: user.id,
          updated_at: new Date().toISOString(),
        })
        .eq("id", data.id)
        .eq("version", data.version);

      if (error) return { success: false, error: error.message };

      revalidatePath("/admin/pricing");
      revalidatePath("/");
      return { success: true, promotionId: data.id };
    } else {
      const { data: inserted, error } = await supabase
        .from("promotions_and_sales")
        .insert({
          name: data.name,
          code: data.code,
          description: data.description,
          type: data.type,
          status: data.status,
          stackable: data.stackable,
          priority: data.priority,
          discount_value: data.discountValue,
          min_order_value_minor: data.minOrderValueMinor,
          max_discount_amount_minor: data.maxDiscountAmountMinor,
          target_type: data.targetType,
          target_ids: data.targetIds,
          starts_at: data.startsAt,
          ends_at: data.endsAt,
          timezone: data.timezone,
          version: 1,
          created_by: user.id,
          updated_by: user.id,
        })
        .select("id")
        .single();

      if (error) return { success: false, error: error.message };

      revalidatePath("/admin/pricing");
      return { success: true, promotionId: inserted.id };
    }
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to save promotion" };
  }
}

/**
 * Quick Transition Promotion Status (Start Now, Pause, Stop, Cancel)
 */
export async function updatePromotionStatusAction(
  promotionId: string,
  newStatus: PromotionStatus
): Promise<{ success: boolean; error?: string }> {
  try {
    const { user } = await requirePermission("pricing.manage", "/admin/pricing");
    const supabase = await createClient();

    const updates: Record<string, unknown> = {
      status: newStatus,
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    };

    if (newStatus === "active") {
      updates.starts_at = new Date().toISOString();
    } else if (newStatus === "expired" || newStatus === "cancelled") {
      updates.ends_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from("promotions_and_sales")
      .update(updates)
      .eq("id", promotionId);

    if (error) return { success: false, error: error.message };

    revalidatePath("/admin/pricing");
    revalidatePath("/");
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Status update failed" };
  }
}

/**
 * Delete a promotion/campaign rule safely
 */
export async function deletePromotionAction(promotionId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { user } = await requirePermission("pricing.manage", "/admin/pricing");
    const supabase = await createClient();

    const { error } = await supabase
      .from("promotions_and_sales")
      .delete()
      .eq("id", promotionId);

    if (error) return { success: false, error: error.message };

    revalidatePath("/admin/pricing");
    revalidatePath("/");
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Delete failed" };
  }
}

/**
 * Execute Batch Price Adjustment with Margin Floor Guardrails
 */
export async function executeBulkPriceAdjustmentAction(
  rawInput: BulkPriceAdjustmentInput
): Promise<{ success: boolean; updatedCount: number; blockedCount: number; error?: string }> {
  try {
    const { user } = await requirePermission("pricing.manage", "/admin/pricing");
    const parsed = BulkPriceAdjustmentSchema.safeParse(rawInput);

    if (!parsed.success) {
      return { success: false, updatedCount: 0, blockedCount: 0, error: parsed.error.issues[0].message };
    }

    const data = parsed.data;
    const supabase = await createClient();

    const { data: prices, error: fetchErr } = await supabase
      .from("product_prices")
      .select("*")
      .in("product_id", data.productIds)
      .eq("price_book_id", data.priceBookId);

    if (fetchErr || !prices) {
      return { success: false, updatedCount: 0, blockedCount: 0, error: "Failed to fetch price records" };
    }

    let updatedCount = 0;
    let blockedCount = 0;

    for (const p of prices) {
      let newPriceMinor = p.base_price_minor;

      if (data.adjustmentType === "percentage_increase") {
        newPriceMinor = Math.round(p.base_price_minor * (1 + data.adjustmentValue / 100));
      } else if (data.adjustmentType === "percentage_decrease") {
        newPriceMinor = Math.round(p.base_price_minor * (1 - data.adjustmentValue / 100));
      } else if (data.adjustmentType === "fixed_increase") {
        newPriceMinor = p.base_price_minor + Math.round(data.adjustmentValue * 100);
      } else if (data.adjustmentType === "fixed_decrease") {
        newPriceMinor = Math.max(0, p.base_price_minor - Math.round(data.adjustmentValue * 100));
      } else if (data.adjustmentType === "set_fixed_price") {
        newPriceMinor = Math.round(data.adjustmentValue * 100);
      }

      // Check Margin Floor
      if (data.enforceMarginProtection && p.minimum_price_floor_minor && newPriceMinor < p.minimum_price_floor_minor) {
        blockedCount++;
        continue;
      }

      await supabase
        .from("product_prices")
        .update({
          base_price_minor: newPriceMinor,
          version: p.version + 1,
          updated_by: user.id,
          updated_at: new Date().toISOString(),
        })
        .eq("id", p.id);

      await supabase.from("pricing_history").insert({
        product_id: p.product_id,
        variant_id: p.variant_id,
        price_book_id: p.price_book_id,
        old_price_minor: p.base_price_minor,
        new_price_minor: newPriceMinor,
        change_type: "bulk_discount",
        reason: data.reason,
        admin_id: user.id,
      });

      updatedCount++;
    }

    revalidatePath("/admin/pricing");
    return { success: true, updatedCount, blockedCount };
  } catch (err: unknown) {
    return {
      success: false,
      updatedCount: 0,
      blockedCount: 0,
      error: err instanceof Error ? err.message : "Bulk update failed",
    };
  }
}

/**
 * Save / Update Price Book
 */
export async function savePriceBookAction(rawInput: import("./validation").SavePriceBookInput): Promise<{
  success: boolean;
  priceBookId?: string;
  error?: string;
}> {
  try {
    const { user } = await requirePermission("pricing.manage", "/admin/pricing");
    const { SavePriceBookSchema } = await import("./validation");
    const parsed = SavePriceBookSchema.safeParse(rawInput);

    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    const data = parsed.data;
    const supabase = await createClient();

    // If this price book is being set as default, we must unset others
    if (data.isDefault) {
      await supabase
        .from("price_books")
        .update({ is_default: false })
        .eq("is_default", true);
    }

    if (data.id) {
      // Update existing
      const { error: updateErr } = await supabase
        .from("price_books")
        .update({
          name: data.name,
          code: data.code,
          description: data.description,
          currency: data.currency,
          status: data.status,
          priority: data.priority,
          is_default: data.isDefault,
          updated_by: user.id,
          updated_at: new Date().toISOString(),
        })
        .eq("id", data.id);

      if (updateErr) return { success: false, error: updateErr.message };
      
      revalidatePath("/admin/pricing");
      return { success: true, priceBookId: data.id };
    } else {
      // Insert new
      const { data: inserted, error: insertErr } = await supabase
        .from("price_books")
        .insert({
          name: data.name,
          code: data.code,
          description: data.description,
          currency: data.currency,
          status: data.status,
          priority: data.priority,
          is_default: data.isDefault,
          created_by: user.id,
          updated_by: user.id,
        })
        .select("id")
        .single();

      if (insertErr || !inserted) {
        return { success: false, error: insertErr?.message || "Failed to create price book" };
      }
      
      revalidatePath("/admin/pricing");
      return { success: true, priceBookId: inserted.id };
    }
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Save failed" };
  }
}

/**
 * Delete / Archive Price Book
 * We use archiving by default to prevent orphaned product_prices
 */
export async function deletePriceBookAction(priceBookId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { user } = await requirePermission("pricing.manage", "/admin/pricing");
    const supabase = await createClient();

    // First check if it's the default book
    const { data: book } = await supabase
      .from("price_books")
      .select("is_default")
      .eq("id", priceBookId)
      .single();

    if (book?.is_default) {
      return { success: false, error: "Cannot delete the default price book. Set another book as default first." };
    }

    // Instead of hard delete, we archive it
    const { error } = await supabase
      .from("price_books")
      .update({
        status: "archived",
        updated_by: user.id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", priceBookId);

    if (error) return { success: false, error: error.message };

    revalidatePath("/admin/pricing");
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Delete failed" };
  }
}

