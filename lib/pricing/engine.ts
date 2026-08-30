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
  };
  priceRecord?: DatabaseProductPrice | null;
  quantity: number;
  promotions?: DatabasePromotion[];
  couponCode?: string | null;
  currentTimestamp?: string;
}

/**
 * Single Authoritative Pricing Engine
 * Evaluates Base Price -> Quantity Tiers -> Scheduled Sales -> Automatic Promotions -> Stacking -> Margin Floors
 */
export function calculateAuthoritativePrice({
  product,
  priceRecord,
  quantity,
  promotions = [],
  couponCode,
  currentTimestamp = new Date().toISOString(),
}: CalculatePriceParams): AuthoritativePriceCalculation {
  const now = new Date(currentTimestamp).getTime();

  // 1. Determine Unit Base Price
  const baseUnitPriceMinor: MoneyMinor =
    priceRecord?.base_price_minor ?? 19900; // default ₹199
  const rawSubtotalMinor: MoneyMinor = baseUnitPriceMinor * quantity;

  // 2. Evaluate Quantity Tiers
  let tierDiscountPerUnitMinor = 0;
  let matchingTierPriceMinor: MoneyMinor | null = null;

  const tiersList = priceRecord?.quantity_tiers || priceRecord?.product_quantity_tiers;

  if (tiersList && tiersList.length > 0) {
    const sortedTiers = [...tiersList].sort((a, b) => a.min_quantity - b.min_quantity);
    for (const tier of sortedTiers) {
      if (quantity >= tier.min_quantity && (tier.max_quantity === null || quantity <= tier.max_quantity)) {
        matchingTierPriceMinor = tier.tier_price_minor;
        if (tier.discount_percent && tier.discount_percent > 0) {
          tierDiscountPerUnitMinor = calculatePercentageDiscount(baseUnitPriceMinor, tier.discount_percent);
        } else if (tier.tier_price_minor < baseUnitPriceMinor) {
          tierDiscountPerUnitMinor = baseUnitPriceMinor - tier.tier_price_minor;
        }
        break;
      }
    }
  }

  const quantityTierDiscountMinor: MoneyMinor = tierDiscountPerUnitMinor * quantity;
  const effectiveTierUnitPriceMinor: MoneyMinor = matchingTierPriceMinor
    ? matchingTierPriceMinor
    : baseUnitPriceMinor - tierDiscountPerUnitMinor;

  // 3. Evaluate Active Promotions & Sales
  const appliedRules: PricingRuleDecision[] = [];
  const rejectedRules: PricingRuleDecision[] = [];

  let activeSaleApplied = false;
  let totalPromoDiscountMinor: MoneyMinor = 0;

  // Sort promotions by priority descending
  const sortedPromos = [...promotions].sort((a, b) => b.priority - a.priority);

  for (const promo of sortedPromos) {
    // Check status
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

    // Check time window
    const start = promo.starts_at ? new Date(promo.starts_at).getTime() : 0;
    const end = promo.ends_at ? new Date(promo.ends_at).getTime() : Infinity;
    if (now < start || now > end) {
      rejectedRules.push({
        ruleId: promo.id,
        ruleName: promo.name,
        type: promo.type,
        applied: false,
        discountMinor: 0,
        reason: "Promotion is outside active schedule window",
      });
      continue;
    }

    // Check coupon code matching if required
    if (promo.code) {
      if (!couponCode || couponCode.toUpperCase() !== promo.code.toUpperCase()) {
        rejectedRules.push({
          ruleId: promo.id,
          ruleName: promo.name,
          type: promo.type,
          applied: false,
          discountMinor: 0,
          reason: "Coupon code does not match",
        });
        continue;
      }
    }

    // Check target applicability
    let isTargeted = false;
    if (promo.target_type === "all") {
      isTargeted = true;
    } else if (promo.target_type === "product" && promo.target_ids.includes(product.id)) {
      isTargeted = true;
    } else if (
      promo.target_type === "category" &&
      product.categoryIds &&
      promo.target_ids.some((id) => product.categoryIds?.includes(id))
    ) {
      isTargeted = true;
    }

    if (!isTargeted) {
      rejectedRules.push({
        ruleId: promo.id,
        ruleName: promo.name,
        type: promo.type,
        applied: false,
        discountMinor: 0,
        reason: "Product not eligible for this promotion target",
      });
      continue;
    }

    // Check Stacking Rules: If an exclusive rule is already applied, reject further promos
    if (!promo.stackable && (activeSaleApplied || totalPromoDiscountMinor > 0)) {
      rejectedRules.push({
        ruleId: promo.id,
        ruleName: promo.name,
        type: promo.type,
        applied: false,
        discountMinor: 0,
        reason: "Non-stackable promotion cannot be combined with existing discounts",
      });
      continue;
    }

    // Calculate Discount
    let ruleDiscountMinor = 0;
    const currentSubtotal = effectiveTierUnitPriceMinor * quantity - totalPromoDiscountMinor;

    if (promo.type === "percentage_discount") {
      ruleDiscountMinor = calculatePercentageDiscount(currentSubtotal, promo.discount_value);
    } else if (promo.type === "fixed_discount") {
      ruleDiscountMinor = Math.min(currentSubtotal, Math.round(promo.discount_value * 100));
    } else if (promo.type === "sale_price") {
      const saleUnitPrice = Math.round(promo.discount_value * 100);
      if (saleUnitPrice < effectiveTierUnitPriceMinor) {
        ruleDiscountMinor = (effectiveTierUnitPriceMinor - saleUnitPrice) * quantity;
        activeSaleApplied = true;
      }
    }

    // Cap at max discount if configured
    if (promo.max_discount_amount_minor && ruleDiscountMinor > promo.max_discount_amount_minor) {
      ruleDiscountMinor = promo.max_discount_amount_minor;
    }

    if (ruleDiscountMinor > 0) {
      totalPromoDiscountMinor += ruleDiscountMinor;
      appliedRules.push({
        ruleId: promo.id,
        ruleName: promo.name,
        type: promo.type,
        applied: true,
        discountMinor: ruleDiscountMinor,
      });

      if (!promo.stackable) {
        // Stop evaluating further non-stackable promotions
        break;
      }
    }
  }

  // 4. Compute Final Price & Enforce Margin Floor Protection
  let finalLinePriceMinor: MoneyMinor = Math.max(
    0,
    effectiveTierUnitPriceMinor * quantity - totalPromoDiscountMinor
  );

  if (priceRecord?.minimum_price_floor_minor) {
    const minAllowedLineTotal = priceRecord.minimum_price_floor_minor * quantity;
    if (finalLinePriceMinor < minAllowedLineTotal) {
      finalLinePriceMinor = minAllowedLineTotal;
    }
  }

  const finalUnitPriceMinor: MoneyMinor = Math.round(finalLinePriceMinor / quantity);

  return {
    productId: product.id,
    productTitle: product.title,
    quantity,
    currency: priceRecord?.currency || "INR",
    baseUnitPriceMinor,
    rawSubtotalMinor,
    quantityTierDiscountMinor,
    effectiveTierUnitPriceMinor,
    promotionsDiscountMinor: totalPromoDiscountMinor,
    appliedRules,
    rejectedRules,
    finalLinePriceMinor,
    finalUnitPriceMinor,
    engineVersion: PRICING_ENGINE_VERSION,
    calculatedAt: currentTimestamp,
  };
}
