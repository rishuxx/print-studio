"use server";

import { createClient } from "@/lib/supabase/server";
import { ProductService } from "@/lib/catalogue/product-service";
import { PricingService } from "@/lib/pricing/pricing-service";

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

    const { data: dbProduct } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .maybeSingle();

    if (!dbProduct) return { success: false, error: "Product not found" };

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

    // We return the full subtotal as the 'unit price' for the cart line item
    // because the cart treats the entire configuration (e.g., 500 pcs) as a single cart line quantity of 1.
    return { 
      success: true, 
      pricePaise: calc.subtotal.amount,
      compareAtPaise: calc.compareAtPrice?.amount ? (calc.compareAtPrice.amount * quantity) : undefined
    };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to validate price." };
  }
}
