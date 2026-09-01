import { calculateAuthoritativePrice } from "./engine";
import type { DatabaseProduct, DatabaseProductVariant } from "@/lib/catalogue/types";
import { money, type Money } from "@/lib/commerce/types";

export interface PricingServiceResult {
  basePrice: Money;
  compareAtPrice: Money | null;
  salePrice: Money | null;
  finalUnitPrice: Money;
  subtotal: Money;
  discount: Money;
  tax: Money;
  total: Money;
  quantityTiers: Array<{ minQty: number; price: Money; note?: string }>;
}

export const PricingService = {
  /**
   * Main entry point to calculate product pricing dynamically.
   * Consolidates Base Price, Sale Time Windows, Quantity Tiers, and Taxes.
   */
  calculateProductPrice(params: {
    product: DatabaseProduct;
    variant?: DatabaseProductVariant | null;
    quantity: number;
    selectedOptions?: Array<{ name: string; value: string }>;
    currentTime?: string;
    isPersonalized?: boolean;
    needsDesignAssistance?: boolean;
  }): PricingServiceResult {
    // We pass the raw product to the engine
    const engineInput = {
      product: {
        id: params.product.id,
        title: params.product.title,
        handle: params.product.handle,
        basePriceMinor: params.product.base_price_minor,
        salePriceMinor: params.product.sale_price_minor,
        saleStartsAt: params.product.sale_starts_at,
        saleEndsAt: params.product.sale_ends_at,
        customizationConfig: params.product.customization_config as any,
        personalization_config: params.product.personalization_config as any,
      },
      variant: params.variant
        ? {
            id: params.variant.id,
            sku: params.variant.sku,
            priceMinor: params.variant.price_minor,
            salePriceMinor: params.variant.sale_price_minor,
            priceFactor: params.variant.price_factor,
          }
        : null,
      // For now, we mock priceRecord if it's not nested. 
      // A robust implementation would fetch the exact price record.
      quantity: params.quantity,
      currentTimestamp: params.currentTime || new Date().toISOString(),
      isPersonalized: params.isPersonalized,
      needsDesignAssistance: params.needsDesignAssistance,
    };

    const calculation = calculateAuthoritativePrice(engineInput);

    // GST/Tax Calculation (Assume 18% standard for print unless configured otherwise)
    // Real implementation should read StoreSettings
    const taxRate = 0.18;
    const taxMinor = Math.round(calculation.finalSubtotalMinor * taxRate);
    const totalMinor = calculation.finalSubtotalMinor + taxMinor;

    return {
      basePrice: money(calculation.baseUnitPriceMinor),
      compareAtPrice: params.product.compare_at_price_minor ? money(params.product.compare_at_price_minor) : null,
      salePrice: calculation.salePriceMinor ? money(calculation.salePriceMinor) : null,
      finalUnitPrice: money(calculation.effectiveUnitPriceMinor),
      subtotal: money(calculation.finalSubtotalMinor),
      discount: money(calculation.totalDiscountMinor),
      tax: money(taxMinor),
      total: money(totalMinor),
      quantityTiers: [], // Would map tiers here
    };
  },
};
