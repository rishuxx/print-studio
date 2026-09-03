"use server";

import { createClient } from "@/lib/supabase/server";
import { ProductService } from "@/lib/catalogue/product-service";
import { PricingService } from "@/lib/pricing/pricing-service";
import { AvailabilityService } from "@/lib/availability/engine";
import { products } from "@/lib/data/products";
import { tierPrice, tierCompareAtPrice, findVariant } from "@/lib/pricing";
import {
  validateProductConfiguration,
  type CustomerConfigurationSubmission,
} from "@/lib/catalogue/configuration-validator";
import type { ConfigurationSnapshot } from "@/lib/commerce/types";

export interface LiveProductPriceResult {
  success: boolean;
  pricePaise?: number;
  unitPricePaise?: number;
  compareAtPaise?: number;
  canonicalSnapshot?: ConfigurationSnapshot;
  matchedVariantId?: string;
  matchedVariantTitle?: string;
  error?: string;
  errors?: string[];
}

/**
 * SERVER ACTION: Authoritatively validate complete product configuration,
 * evaluate cross-option compatibility, and calculate live pricing.
 * Prevents client-side tampering or stale option submission.
 */
export async function getLiveProductPriceAction(
  productId: string,
  quantity: number,
  variantId?: string | null,
  isPersonalized?: boolean,
  needsDesignAssistance?: boolean,
  submission?: {
    selectedOptions?: Array<{ name: string; value: string }>;
    dimensions?: { width: number; height: number; unit: "inch" | "ft" | "cm" | "mm" } | null;
    specialInstructions?: string;
    tierQty?: number | null;
  }
): Promise<LiveProductPriceResult> {
  try {
    const supabase = await createClient();

    // 1. Fetch trusted Product definition from PostgreSQL
    const { data: dbProduct } = await supabase
      .from("products")
      .select(
        "*, options:product_options(*), variants:product_variants(*), prices:product_prices(id, base_price_minor, compare_at_price_minor, tiers:product_quantity_tiers(*))"
      )
      .eq("id", productId)
      .maybeSingle();

    if (dbProduct) {
      const visibility = ProductService.getProductVisibility(dbProduct);
      if (!visibility.isPurchasable) {
        return { success: false, error: "Product is no longer available for purchase." };
      }

      // Check minimum order quantity
      const effectiveOrderQty = quantity * (submission?.tierQty || 1);
      if (dbProduct.min_order_qty && effectiveOrderQty < dbProduct.min_order_qty) {
        return {
          success: false,
          error: `Minimum order quantity is ${dbProduct.min_order_qty} ${dbProduct.unit || "pieces"}.`,
        };
      }

      // Validate configuration options & cross-option rules if options are supplied
      const fullSubmission: CustomerConfigurationSubmission = {
        productId: dbProduct.id,
        quantity,
        tierQty: submission?.tierQty ?? null,
        selectedOptions: submission?.selectedOptions || [],
        dimensions: submission?.dimensions ?? null,
        isPersonalized,
        needsDesignAssistance,
        specialInstructions: submission?.specialInstructions,
      };

      const valResult = validateProductConfiguration(
        dbProduct,
        fullSubmission,
        dbProduct.variants || []
      );

      if (!valResult.valid) {
        return {
          success: false,
          error: valResult.errors[0] || "Invalid product configuration.",
          errors: valResult.errors,
        };
      }

      // Check variant status & inventory
      let resolvedVariant = valResult.matchedVariant;
      if (!resolvedVariant && variantId) {
        resolvedVariant =
          (dbProduct.variants || []).find((v: any) => v.id === variantId) || null;
      }

      if (resolvedVariant) {
        if (resolvedVariant.status !== "active" || !resolvedVariant.available_for_sale) {
          return { success: false, error: "Selected product variant is currently unavailable." };
        }

        const availability = await AvailabilityService.evaluateVariantAvailability(
          resolvedVariant.id,
          quantity,
          dbProduct.status,
          resolvedVariant.status,
          false
        );

        if (!availability.available) {
          return {
            success: false,
            error: `Product unavailable: ${availability.reason}`,
          };
        }
      }

      // Compute authoritative price via pricing engine
      const calc = PricingService.calculateProductPrice({
        product: dbProduct,
        variant: resolvedVariant,
        quantity,
        selectedOptions: submission?.selectedOptions,
        isPersonalized,
        needsDesignAssistance,
      });

      // Account for dimension pricing if custom dimensions are present
      let subtotalPaise = calc.subtotal.amount;
      let unitPricePaise = calc.finalUnitPrice.amount;

      if (submission?.dimensions && submission.dimensions.width > 0 && submission.dimensions.height > 0) {
        const { width, height, unit } = submission.dimensions;
        let sqFt = 1;
        if (unit === "ft") sqFt = width * height;
        else if (unit === "inch") sqFt = (width * height) / 144;
        else sqFt = (width * height) / 929.03;

        sqFt = Math.max(0.5, sqFt);
        const areaMultiplier = sqFt / 1.5;
        const adjustedTotal = Math.max(10000, Math.round(subtotalPaise * areaMultiplier));
        subtotalPaise = adjustedTotal;
        unitPricePaise = Math.round(adjustedTotal / Math.max(1, quantity));
      }

      return {
        success: true,
        pricePaise: subtotalPaise,
        unitPricePaise,
        compareAtPaise: calc.compareAtPrice?.amount
          ? calc.compareAtPrice.amount * quantity
          : undefined,
        canonicalSnapshot: valResult.canonicalSnapshot,
        matchedVariantId: resolvedVariant?.id,
        matchedVariantTitle: resolvedVariant?.title,
      };
    }

    // 2. Fallback to static catalog definition
    const staticProd = products.find((p) => p.id === productId || p.handle === productId);
    if (!staticProd) {
      return { success: false, error: "Product not found." };
    }

    const fullSubmission: CustomerConfigurationSubmission = {
      productId: staticProd.id,
      quantity,
      tierQty: submission?.tierQty ?? null,
      selectedOptions: submission?.selectedOptions || [],
      dimensions: submission?.dimensions ?? null,
      isPersonalized,
      needsDesignAssistance,
      specialInstructions: submission?.specialInstructions,
    };

    const valResult = validateProductConfiguration(staticProd, fullSubmission, []);
    if (!valResult.valid) {
      return {
        success: false,
        error: valResult.errors[0] || "Invalid product configuration.",
        errors: valResult.errors,
      };
    }

    const matchedVariant =
      staticProd.variants.find((v) => v.id === variantId) ||
      findVariant(
        staticProd,
        Object.fromEntries((submission?.selectedOptions || []).map((o) => [o.name, o.value]))
      ) ||
      staticProd.variants[0];

    let rawUnitPaise = 0;
    const applicableTier =
      [...staticProd.quantityTiers]
        .sort((a, b) => b.qty - a.qty)
        .find((t) => quantity >= t.qty) || staticProd.quantityTiers[0];

    if (applicableTier) {
      rawUnitPaise = Math.round(applicableTier.price.amount / applicableTier.qty);
    } else {
      rawUnitPaise = staticProd.priceFrom.amount;
    }

    if (staticProd.personalizationConfig?.enabled && isPersonalized) {
      rawUnitPaise += staticProd.personalizationConfig.personalizationFeeMinor || 0;
    }

    let lineTotalPaise = rawUnitPaise * (quantity || 1);

    if (staticProd.personalizationConfig?.enabled && needsDesignAssistance) {
      lineTotalPaise += staticProd.personalizationConfig.designFeeMinor || 0;
    }

    if (submission?.dimensions && submission.dimensions.width > 0 && submission.dimensions.height > 0) {
      const { width, height, unit } = submission.dimensions;
      let sqFt = 1;
      if (unit === "ft") sqFt = width * height;
      else if (unit === "inch") sqFt = (width * height) / 144;
      else sqFt = (width * height) / 929.03;
      sqFt = Math.max(0.5, sqFt);
      const areaMultiplier = sqFt / 1.5;
      lineTotalPaise = Math.max(10000, Math.round(lineTotalPaise * areaMultiplier));
      rawUnitPaise = Math.round(lineTotalPaise / Math.max(1, quantity));
    }

    const compareAtUnitPaise = applicableTier
      ? tierCompareAtPrice(applicableTier, matchedVariant)?.amount
        ? Math.round(tierCompareAtPrice(applicableTier, matchedVariant)!.amount / applicableTier.qty)
        : null
      : staticProd.compareAtFrom?.amount || null;

    return {
      success: true,
      pricePaise: lineTotalPaise,
      unitPricePaise: rawUnitPaise,
      compareAtPaise: compareAtUnitPaise ? compareAtUnitPaise * quantity : undefined,
      canonicalSnapshot: valResult.canonicalSnapshot,
      matchedVariantId: matchedVariant?.id,
      matchedVariantTitle: matchedVariant?.title,
    };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to validate price." };
  }
}
