import { calculatePercentageDiscount, PRICING_ENGINE_VERSION } from "./money";
import type {
  AuthoritativePriceCalculation,
  DatabaseProductPrice,
  DatabasePromotion,
  MoneyMinor,
  PricingRuleDecision,
} from "./types";

interface CalculatePriceParams {
  product: {
    id: string;
    title: string;
    handle: string;
    categoryIds?: string[];
    basePriceMinor?: number;
    salePriceMinor?: number | null;
    saleStartsAt?: string | null;
    saleEndsAt?: string | null;
    customizationConfig?: {
      dimensionPricing?: {
        enabled: boolean;
        unit: "ft" | "inch" | "cm";
        ratePerSqUnitMinor: number;
      };
    };
  };
  variant?: {
    id?: string;
    sku?: string;
    priceMinor?: number | null;
    salePriceMinor?: number | null;
    priceFactor?: number;
  } | null;
  priceRecord?: DatabaseProductPrice | null;
  quantity: number;
  selectedDimensions?: { width: number; height: number; unit?: string } | null;
  customizationAddonsMinor?: number;
  promotions?: DatabasePromotion[];
  couponCode?: string | null;
  currentTimestamp?: string;
}

/**
 * Single Authoritative Dynamic Pricing Engine
 * Evaluates: Base/Variant Price -> Dimensions -> Customizations -> Quantity Tiers -> Scheduled Sales -> Promotions -> Margin Floors
 */
export function calculateAuthoritativePrice({
  product,
  variant,
  priceRecord,
  quantity,
  selectedDimensions,
  customizationAddonsMinor = 0,
  promotions = [],
  couponCode,
  currentTimestamp = new Date().toISOString(),
}: CalculatePriceParams): AuthoritativePriceCalculation {
  const now = new Date(currentTimestamp).getTime();

  // 1. Determine Effective Unit Base Price (variant override or base product price)
  let baseUnitPriceMinor: MoneyMinor =
    variant?.priceMinor ??
    priceRecord?.base_price_minor ??
    product.basePriceMinor ??
    19900; // default ₹199

  if (variant?.priceFactor && variant.priceFactor > 0 && !variant.priceMinor) {
    baseUnitPriceMinor = Math.round(baseUnitPriceMinor * variant.priceFactor);
  }

  // 2. Dimension-Based Area Multiplier (Banners, Flex, Sunboard, Frames, Acrylic Signs)
  if (selectedDimensions && selectedDimensions.width > 0 && selectedDimensions.height > 0) {
    const w = selectedDimensions.width;
    const h = selectedDimensions.height;
    const unit = (selectedDimensions.unit || "cm").toLowerCase();

    let sqUnits = 1;
    if (unit === "ft") {
      sqUnits = w * h;
    } else if (unit === "inch") {
      sqUnits = (w * h) / 144; // sq ft
    } else {
      // cm
      sqUnits = (w * h) / 929.03; // sq ft
    }

    sqUnits = Math.max(0.5, sqUnits);

    if (product.customizationConfig?.dimensionPricing?.enabled) {
      const rate = product.customizationConfig.dimensionPricing.ratePerSqUnitMinor;
      baseUnitPriceMinor = Math.round(sqUnits * rate);
    } else {
      // Standard scalable surface adjustment (proportional to 3x2 ft standard template)
      baseUnitPriceMinor = Math.max(10000, Math.round(baseUnitPriceMinor * (sqUnits / 6)));
    }
  }

  // Add Customization Options Surcharge (e.g. +₹50 gift box, +₹75 special print area)
  if (customizationAddonsMinor > 0) {
    baseUnitPriceMinor += customizationAddonsMinor;
  }

  const rawSubtotalMinor: MoneyMinor = baseUnitPriceMinor * quantity;

  // 3. Evaluate Quantity Tiers
  let tierDiscountPerUnitMinor = 0;
  let matchingTierUnitPriceMinor: number | null = null;

  const tiersList = priceRecord?.quantity_tiers || priceRecord?.product_quantity_tiers;

  if (tiersList && tiersList.length > 0) {
    const sortedTiers = [...tiersList].sort((a, b) => a.min_quantity - b.min_quantity);
    for (const tier of sortedTiers) {
      if (quantity >= tier.min_quantity && (tier.max_quantity === null || quantity <= tier.max_quantity)) {
        // tier.tier_price_minor is the TOTAL price for exactly tier.min_quantity items.
        // We calculate the precise float unit price for accurate scaling.
        const tierUnitPrice = tier.tier_price_minor / Math.max(1, tier.min_quantity);
        matchingTierUnitPriceMinor = tierUnitPrice;
        
        if (tier.discount_percent && tier.discount_percent > 0) {
          tierDiscountPerUnitMinor = calculatePercentageDiscount(baseUnitPriceMinor, tier.discount_percent);
        } else if (tierUnitPrice < baseUnitPriceMinor) {
          tierDiscountPerUnitMinor = baseUnitPriceMinor - tierUnitPrice;
        }
        break;
      }
    }
  }

  const quantityTierDiscountMinor: number = tierDiscountPerUnitMinor * quantity;
  const effectiveTierUnitPriceMinor: number = matchingTierUnitPriceMinor !== null
    ? matchingTierUnitPriceMinor
    : baseUnitPriceMinor - tierDiscountPerUnitMinor;

  // 4. Evaluate Scheduled Product Sale Price
  let activeSaleApplied = false;
  let productSaleDiscountMinor = 0;

  const salePrice = variant?.salePriceMinor ?? product.salePriceMinor;
  const saleStart = product.saleStartsAt ? new Date(product.saleStartsAt).getTime() : 0;
  const saleEnd = product.saleEndsAt ? new Date(product.saleEndsAt).getTime() : Infinity;

  if (salePrice && salePrice > 0 && salePrice < effectiveTierUnitPriceMinor) {
    if (now >= saleStart && now <= saleEnd) {
      activeSaleApplied = true;
      const unitSaleDiscount = effectiveTierUnitPriceMinor - salePrice;
      productSaleDiscountMinor = unitSaleDiscount * quantity;
    }
  }

  // 5. Evaluate Active Promotions & Campaigns
  const appliedRules: PricingRuleDecision[] = [];
  const rejectedRules: PricingRuleDecision[] = [];
  let promoDiscountMinor: MoneyMinor = 0;

  const sortedPromos = [...promotions].sort((a, b) => b.priority - a.priority);

  for (const promo of sortedPromos) {
    if (promo.status !== "active") {
      rejectedRules.push({
        ruleId: promo.id,
        ruleName: promo.name,
        type: promo.type,
        applied: false,
        discountMinor: 0,
        reason: `Promotion status is ${promo.status}`,
      });
      continue;
    }

    const start = promo.starts_at ? new Date(promo.starts_at).getTime() : 0;
    const end = promo.ends_at ? new Date(promo.ends_at).getTime() : Infinity;
    if (now < start || now > end) {
      rejectedRules.push({
        ruleId: promo.id,
        ruleName: promo.name,
        type: promo.type,
        applied: false,
        discountMinor: 0,
        reason: "Promotion is outside its valid active time window.",
      });
      continue;
    }

    if (promo.code) {
      if (!couponCode || couponCode.trim().toUpperCase() !== promo.code.trim().toUpperCase()) {
        rejectedRules.push({
          ruleId: promo.id,
          ruleName: promo.name,
          type: promo.type,
          applied: false,
          discountMinor: 0,
          reason: "Coupon code does not match.",
        });
        continue;
      }
    }

    if (promo.min_order_value_minor && rawSubtotalMinor < promo.min_order_value_minor) {
      rejectedRules.push({
        ruleId: promo.id,
        ruleName: promo.name,
        type: promo.type,
        applied: false,
        discountMinor: 0,
        reason: `Minimum subtotal of ₹${(promo.min_order_value_minor / 100).toFixed(2)} not met.`,
      });
      continue;
    }

    let calculatedDiscount: MoneyMinor = 0;
    const currentBase = rawSubtotalMinor - quantityTierDiscountMinor - productSaleDiscountMinor;

    if (promo.type === "percentage_discount") {
      calculatedDiscount = calculatePercentageDiscount(currentBase, promo.discount_value);
    } else if (promo.type === "fixed_discount") {
      calculatedDiscount = Math.round(promo.discount_value * 100);
    }

    if (promo.max_discount_amount_minor && calculatedDiscount > promo.max_discount_amount_minor) {
      calculatedDiscount = promo.max_discount_amount_minor;
    }

    calculatedDiscount = Math.min(calculatedDiscount, currentBase);

    if (calculatedDiscount > 0) {
      promoDiscountMinor += calculatedDiscount;
      appliedRules.push({
        ruleId: promo.id,
        ruleName: promo.name,
        type: promo.type,
        applied: true,
        discountMinor: calculatedDiscount,
        reason: `Applied ${promo.type} (${promo.discount_value}${promo.type === "percentage_discount" ? "%" : "₹"})`,
      });

      if (!promo.stackable) break;
    }
  }

  // 6. Total Discounts & Margin Floor Safety Check
  const totalDiscountMinor: MoneyMinor =
    quantityTierDiscountMinor + productSaleDiscountMinor + promoDiscountMinor;
  let finalSubtotalMinor: MoneyMinor = Math.max(0, rawSubtotalMinor - totalDiscountMinor);

  // Strict Margin Floor Protection
  const marginFloorMinor = priceRecord?.minimum_price_floor_minor
    ? priceRecord.minimum_price_floor_minor * quantity
    : Math.round(rawSubtotalMinor * 0.4);

  let marginFloorProtected = false;
  if (finalSubtotalMinor < marginFloorMinor && rawSubtotalMinor >= marginFloorMinor) {
    finalSubtotalMinor = marginFloorMinor;
    marginFloorProtected = true;
  }

  const finalUnitPriceMinor: MoneyMinor = Math.round(finalSubtotalMinor / quantity);

  return {
    productId: product.id,
    productTitle: product.title,
    variantId: variant?.id || null,
    quantity,
    currency: "INR",
    baseUnitPriceMinor,
    rawSubtotalMinor,
    quantityTierDiscountMinor,
    effectiveTierUnitPriceMinor: finalUnitPriceMinor,
    salePriceMinor: product.salePriceMinor ?? undefined,
    promotionsDiscountMinor: productSaleDiscountMinor + promoDiscountMinor,
    appliedRules,
    rejectedRules,
    finalLinePriceMinor: finalSubtotalMinor,
    finalUnitPriceMinor,
    effectiveUnitPriceMinor: finalUnitPriceMinor,
    finalSubtotalMinor,
    totalDiscountMinor,
    marginFloorProtected,
    engineVersion: PRICING_ENGINE_VERSION,
    calculatedAt: new Date().toISOString(),
  };
}
