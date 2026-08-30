"use server";

import { createClient } from "@/lib/supabase/server";
import { getProduct } from "@/lib/data/products";

export interface AvailableCoupon {
  code: string;
  name: string;
  description: string | null;
  type: string;
  discountValue: number;
  minOrderValueMinor: number | null;
  targetType: string;
  targetIds: string[];
}

export interface CartLineSummary {
  productId: string;
  productHandle?: string;
  quantity: number;
  lineTotalPaise: number;
}

/**
 * Fetch all currently active, public coupon codes for checkout drawer/selector
 */
export async function fetchAvailableCheckoutCoupons(): Promise<AvailableCoupon[]> {
  try {
    const supabase = await createClient();
    const now = new Date().toISOString();

    const { data } = await supabase
      .from("promotions_and_sales")
      .select("code, name, description, type, discount_value, min_order_value_minor, target_type, target_ids")
      .eq("status", "active")
      .not("code", "is", null)
      .or(`starts_at.is.null,starts_at.lte.${now}`)
      .or(`ends_at.is.null,ends_at.gte.${now}`)
      .order("priority", { ascending: false });

    if (!data) return [];

    return data.map((p) => ({
      code: p.code as string,
      name: p.name,
      description: p.description,
      type: p.type,
      discountValue: Number(p.discount_value),
      minOrderValueMinor: p.min_order_value_minor,
      targetType: p.target_type || "all",
      targetIds: (p.target_ids || []) as string[],
    }));
  } catch (err) {
    console.error("[fetchAvailableCheckoutCoupons error]:", err);
    return [];
  }
}

/**
 * Authoritatively validate and calculate coupon discount for an active cart
 * Supports: Site-wide, Specific Categories, Specific Products, Flash Sales, Min Subtotal & Max Cap
 */
export async function validateAndApplyCouponAction(
  code: string,
  subtotalMinor: number,
  lines?: CartLineSummary[]
): Promise<{
  valid: boolean;
  code?: string;
  discountMinor?: number;
  discountPercent?: number;
  message?: string;
}> {
  try {
    if (!code || code.trim().length === 0) {
      return { valid: false, message: "Please enter a coupon code." };
    }

    const cleanCode = code.trim().toUpperCase();
    const supabase = await createClient();

    const { data: promo, error } = await supabase
      .from("promotions_and_sales")
      .select("*")
      .eq("code", cleanCode)
      .maybeSingle();

    if (error || !promo) {
      return { valid: false, message: `Coupon code '${cleanCode}' is invalid.` };
    }

    // Check status
    if (promo.status !== "active") {
      if (promo.status === "scheduled") {
        const startIST = promo.starts_at ? new Date(promo.starts_at).toLocaleString("en-IN") : "soon";
        return { valid: false, message: `This sale is scheduled to start on ${startIST}.` };
      }
      return { valid: false, message: `Coupon code '${cleanCode}' is currently ${promo.status}.` };
    }

    // Check time bounds
    if (promo.starts_at && new Date(promo.starts_at).getTime() > Date.now()) {
      const startIST = new Date(promo.starts_at).toLocaleString("en-IN");
      return { valid: false, message: `This promotional sale will become active on ${startIST}.` };
    }

    if (promo.ends_at && new Date(promo.ends_at).getTime() < Date.now()) {
      return { valid: false, message: `This promotion/flash sale has expired.` };
    }

    // Check minimum order subtotal requirement
    if (promo.min_order_value_minor && subtotalMinor < promo.min_order_value_minor) {
      const minRupees = Math.round(promo.min_order_value_minor / 100);
      return {
        valid: false,
        message: `This coupon requires a minimum cart subtotal of ₹${minRupees}.`,
      };
    }

    // Determine eligible subtotal based on targetType (all, category, product)
    let eligibleSubtotal = subtotalMinor;
    const targetType = promo.target_type || "all";
    const targetIds = (promo.target_ids || []) as string[];

    if (lines && lines.length > 0 && targetType !== "all" && targetIds.length > 0) {
      eligibleSubtotal = 0;

      for (const line of lines) {
        const product = getProduct(line.productId) || getProduct(line.productHandle || "");
        let isEligible = false;

        if (targetType === "product") {
          isEligible = targetIds.includes(line.productId) || targetIds.includes(line.productHandle || "");
        } else if (targetType === "category") {
          if (product?.categoryHandles && Array.isArray(product.categoryHandles)) {
            isEligible = product.categoryHandles.some((handle) => targetIds.includes(handle));
          }
        }

        if (isEligible) {
          eligibleSubtotal += line.lineTotalPaise;
        }
      }

      if (eligibleSubtotal <= 0) {
        const targetLabel = targetType === "category" ? "selected categories" : "selected products";
        return {
          valid: false,
          message: `Coupon '${cleanCode}' is only valid on ${targetLabel}.`,
        };
      }
    }

    let discountMinor = 0;
    let discountPercent = 0;

    if (promo.type === "percentage_discount") {
      discountPercent = Number(promo.discount_value);
      discountMinor = Math.round((eligibleSubtotal * discountPercent) / 100);
    } else if (promo.type === "fixed_discount" || promo.type === "sale_price") {
      discountMinor = Math.min(eligibleSubtotal, Math.round(Number(promo.discount_value) * 100));
      discountPercent = subtotalMinor > 0 ? Math.round((discountMinor / subtotalMinor) * 100) : 0;
    }

    // Cap at max discount if configured
    if (promo.max_discount_amount_minor && discountMinor > promo.max_discount_amount_minor) {
      discountMinor = promo.max_discount_amount_minor;
    }

    return {
      valid: true,
      code: promo.code as string,
      discountMinor,
      discountPercent,
      message: `Coupon '${cleanCode}' applied successfully!`,
    };
  } catch (err) {
    return {
      valid: false,
      message: err instanceof Error ? err.message : "Failed to apply coupon.",
    };
  }
}
