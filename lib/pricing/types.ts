/**
 * Phase 10F — Pricing Engine Core Types
 * Integer Paise Minor Units, Promotions, Tiers, Price Books, and Explanations
 */

export type MoneyMinor = number; // Integer paise e.g. ₹299.50 = 29950

export type PriceBookStatus = "active" | "archived";
export type ProductPriceStatus = "active" | "archived";
export type PromotionType =
  | "sale_price"
  | "percentage_discount"
  | "fixed_discount"
  | "bulk_tier_discount";

export type PromotionStatus =
  | "draft"
  | "scheduled"
  | "active"
  | "paused"
  | "expired"
  | "cancelled";

export type PromotionTargetType = "all" | "category" | "product" | "variant";

export interface DatabasePriceBook {
  id: string;
  name: string;
  code: string;
  description: string | null;
  currency: string;
  status: PriceBookStatus;
  priority: number;
  is_default: boolean;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface DatabaseQuantityTier {
  id: string;
  product_price_id: string;
  min_quantity: number;
  max_quantity: number | null;
  tier_price_minor: MoneyMinor;
  discount_percent: number | null;
  sort_order: number;
}

export interface DatabaseProductPrice {
  id: string;
  product_id: string;
  variant_id: string | null;
  price_book_id: string;
  base_price_minor: MoneyMinor;
  compare_at_price_minor: MoneyMinor | null;
  cost_price_minor: MoneyMinor | null;
  minimum_price_floor_minor: MoneyMinor | null;
  currency: string;
  status: ProductPriceStatus;
  version: number;
  effective_from: string | null;
  effective_until: string | null;
  created_at: string;
  updated_at: string;
  quantity_tiers?: DatabaseQuantityTier[];
  product_quantity_tiers?: DatabaseQuantityTier[];
  price_book?: DatabasePriceBook;
  product?: {
    id: string;
    title: string;
    handle: string;
    sku: string;
  };
}

export interface DatabasePromotion {
  id: string;
  name: string;
  code: string | null;
  description: string | null;
  type: PromotionType;
  status: PromotionStatus;
  stackable: boolean;
  priority: number;
  discount_value: number;
  min_order_value_minor: MoneyMinor | null;
  max_discount_amount_minor: MoneyMinor | null;
  target_type: PromotionTargetType;
  target_ids: string[];
  starts_at: string | null;
  ends_at: string | null;
  timezone: string;
  usage_count: number;
  max_usage_limit: number | null;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface PricingRuleDecision {
  ruleId: string;
  ruleName: string;
  type: PromotionType;
  applied: boolean;
  discountMinor: MoneyMinor;
  reason?: string;
}

export interface AuthoritativePriceCalculation {
  productId: string;
  productTitle: string;
  variantId?: string | null;
  quantity: number;
  currency: string;
  baseUnitPriceMinor: MoneyMinor;
  rawSubtotalMinor: MoneyMinor;
  quantityTierDiscountMinor: MoneyMinor;
  effectiveTierUnitPriceMinor: MoneyMinor;
  salePriceMinor?: MoneyMinor;
  promotionsDiscountMinor: MoneyMinor;
  appliedRules: PricingRuleDecision[];
  rejectedRules: PricingRuleDecision[];
  personalizationFeeMinor: MoneyMinor;
  designFeeMinor: MoneyMinor;
  finalLinePriceMinor: MoneyMinor;
  finalUnitPriceMinor: MoneyMinor;
  effectiveUnitPriceMinor: MoneyMinor;
  finalSubtotalMinor: MoneyMinor;
  totalDiscountMinor: MoneyMinor;
  marginFloorProtected?: boolean;
  taxableValueMinor: MoneyMinor;
  gstAmountMinor: MoneyMinor;
  gstRatePercent: number;
  cgstAmountMinor: MoneyMinor;
  sgstAmountMinor: MoneyMinor;
  igstAmountMinor: MoneyMinor;
  isGstInclusive: boolean;
  engineVersion: string;
  calculatedAt: string;
}

export interface PricingHealthIssue {
  id: string;
  severity: "critical" | "high" | "medium" | "low";
  type:
    | "missing_base_price"
    | "compare_at_too_low"
    | "overlapping_quantity_tiers"
    | "margin_violation"
    | "conflicting_promotions"
    | "expired_active_sale";
  entityType: "product" | "price_book" | "promotion";
  entityId: string;
  entityName: string;
  explanation: string;
  recommendedAction: string;
}
