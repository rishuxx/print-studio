"use server";

import { createClient } from "@/lib/supabase/server";
import { ProductService } from "@/lib/catalogue/product-service";
import { PricingService } from "@/lib/pricing/pricing-service";
import { products } from "@/lib/data/products";
import { tierPrice, tierCompareAtPrice, findVariant } from "@/lib/pricing";

/**
 * SERVER ACTION: Securely fetch live pricing right before adding to cart to prevent thread/race conditions.
 */
export async function getLiveProductPriceAction(
  productId: string,
  quantity: number,
  variantId?: string | null,
  isPersonalized?: boolean,
  needsDesignAssistance?: boolean
): Promise<{ success: boolean; pricePaise?: number; compareAtPaise?: number; error?: string }> {
  try {
    const supabase = await createClient();

    // 1. Check Database first
    const { data: dbProduct } = await supabase
      .from("products")
      .select("*, prices:product_prices(id, base_price_minor, compare_at_price_minor, tiers:product_quantity_tiers(*))")
      .eq("id", productId)
      .maybeSingle();

    if (dbProduct) {
      const visibility = ProductService.getProductVisibility(dbProduct);
      if (!visibility.isPurchasable) {
        return { success: false, error: "Product is no longer available for purchase." };
      }

      let dbVariant = null;
      if (variantId) {
        const { data: vData } = await supabase
          .from("product_variants")
          .select("*")
          .eq("id", variantId)
          .maybeSingle();
        
        if (vData) {
          dbVariant = vData;
          if (vData.status !== "active" || !vData.available_for_sale) {
            return { success: false, error: "Variant is out of stock or unavailable." };
          }
        }
      }

      const calc = PricingService.calculateProductPrice({
        product: dbProduct,
        variant: dbVariant,
        quantity,
        isPersonalized,
        needsDesignAssistance,
      });

      return { 
        success: true, 
        pricePaise: calc.subtotal.amount,
        compareAtPaise: calc.compareAtPrice?.amount ? (calc.compareAtPrice.amount * quantity) : undefined
      };
    }

    // 2. Fallback to static catalog definition
    const staticProd = products.find((p) => p.id === productId || p.handle === productId);
    if (!staticProd) {
      return { success: false, error: "Product not found." };
    }

    const matchedVariant = staticProd.variants.find((v) => v.id === variantId) || staticProd.variants[0];

    let rawUnitPaise = 0;
    const applicableTier = [...staticProd.quantityTiers]
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

    const compareAtUnitPaise = applicableTier
      ? tierCompareAtPrice(applicableTier, matchedVariant)?.amount 
        ? Math.round(tierCompareAtPrice(applicableTier, matchedVariant)!.amount / applicableTier.qty)
        : null
      : staticProd.compareAtFrom?.amount || null;

    return {
      success: true,
      pricePaise: lineTotalPaise,
      compareAtPaise: compareAtUnitPaise ? compareAtUnitPaise * quantity : undefined,
    };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to validate price." };
  }
}

