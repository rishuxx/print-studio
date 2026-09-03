import type {
  AppliedDiscount,
  Cart,
  CartCost,
  CartLine,
  Money,
  Product,
  ProductVariant,
  QuantityTier,
} from "@/lib/commerce/types";
import { money } from "@/lib/commerce/types";
import {
  FLAT_SHIPPING,
  FREE_SHIPPING_THRESHOLD,
  GST_RATE,
  GST_MODE,
} from "@/lib/site-config";

/**
 * ══════════════════════════════════════════════════════════════════
 * PRICING ENGINE
 *
 * Print pricing is per-batch, not per-unit: a visiting card job is
 * "100 cards for ₹399", and the unit rate drops as the batch grows.
 * A variant (paper, finish, shape) applies a multiplier on top.
 *
 * All maths is in integer paise. Rounding happens once, at the end of
 * each computation, so totals never drift from the sum of their lines.
 * ══════════════════════════════════════════════════════════════════
 */

export function formatMoney(m: Money): string {
  const rupees = m.amount / 100;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: m.currencyCode,
    maximumFractionDigits: 0,
  }).format(rupees);
}

/** Price of one batch at the given tier and variant. */
export function tierPrice(
  tier: QuantityTier,
  variant?: ProductVariant | null,
): Money {
  const factor = variant?.priceFactor ?? 1;
  return money(Math.round(tier.price.amount * factor));
}

export function tierCompareAtPrice(
  tier: QuantityTier,
  variant?: ProductVariant | null,
): Money | null {
  if (!tier.compareAtPrice) return null;
  const factor = variant?.priceFactor ?? 1;
  return money(Math.round(tier.compareAtPrice.amount * factor));
}

/** Per-piece rate — the number print buyers actually compare on. */
export function unitRate(
  tier: QuantityTier,
  variant?: ProductVariant | null,
): number {
  return tierPrice(tier, variant).amount / tier.qty;
}

/** "₹3.99 / card" style rate, formatted. */
export function formatUnitRate(
  tier: QuantityTier,
  variant: ProductVariant | null,
  noun: string,
): string {
  const paise = unitRate(tier, variant);
  const rupees = paise / 100;
  const shown = rupees < 10 ? rupees.toFixed(2) : Math.round(rupees).toString();
  return `₹${shown} / ${noun}`;
}

/** How much cheaper this tier is per piece vs the smallest tier. */
export function tierSavingPct(
  product: Product,
  tier: QuantityTier,
  variant?: ProductVariant | null,
): number {
  const base = product.quantityTiers[0];
  if (!base || base.qty === tier.qty) return 0;
  const baseRate = unitRate(base, variant);
  const thisRate = unitRate(tier, variant);
  if (thisRate >= baseRate) return 0;
  return Math.round(((baseRate - thisRate) / baseRate) * 100);
}

/** The tier a shopper most likely wants — best rate that isn't the largest jump. */
export function recommendedTier(product: Product): QuantityTier | null {
  const tiers = product.quantityTiers;
  if (tiers.length < 3) return tiers[0] ?? null;
  return tiers[1] ?? null;
}

export function findTier(
  product: Product,
  qty: number | null,
): QuantityTier | null {
  if (qty == null) return product.quantityTiers[0] ?? null;
  return product.quantityTiers.find((t) => t.qty === qty) ?? null;
}

/** Matches a variant from a set of chosen option values. */
export function findVariant(
  product: Product,
  chosen: Record<string, string>,
): ProductVariant | null {
  const names = product.options.map((o) => o.name);
  if (names.length === 0) return product.variants[0] ?? null;
  return (
    product.variants.find((v) =>
      names.every(
        (name) =>
          v.selectedOptions.find((s) => s.name === name)?.value === chosen[name],
      ),
    ) ?? null
  );
}

/** Default selection: first value of every option. */
export function defaultOptions(product: Product): Record<string, string> {
  return Object.fromEntries(
    product.options.map((o) => [o.name, o.values[0]]),
  ) as Record<string, string>;
}

/* ─────────────────────────────────────────────────────────────────────
   LINE + CART TOTALS
   ───────────────────────────────────────────────────────────────────── */

export function lineTotal(line: CartLine): number {
  const addOns = line.addOns.reduce((sum, a) => sum + a.price.amount, 0);
  return (line.unitPrice.amount + addOns) * line.quantity;
}

export function lineCompareAtTotal(line: CartLine): number | null {
  if (!line.compareAtUnitPrice) return null;
  return line.compareAtUnitPrice.amount * line.quantity;
}

/** Pieces represented by a line — 3 batches of 100 cards = 300 pieces. */
export function linePieces(line: CartLine): number {
  return (line.tierQty ?? 1) * line.quantity;
}

export interface CostInput {
  lines: CartLine[];
  discount: AppliedDiscount | null;
  fulfilment: "ship" | "pickup";
  /** Overrides the standard shipping calculation, e.g. from a pincode quote. */
  shippingOverride?: number | null;
  gstMode?: "inclusive" | "exclusive";
  gstRate?: number;
}

export function computeCost({
  lines,
  discount,
  fulfilment,
  shippingOverride,
  gstMode = GST_MODE,
  gstRate = GST_RATE,
}: CostInput): CartCost {
  const subtotal = lines.reduce((sum, l) => sum + lineTotal(l), 0);

  const discountAmount = discount
    ? Math.round((subtotal * discount.percent) / 100)
    : 0;

  const afterDiscount = Math.max(0, subtotal - discountAmount);

  let shipping = 0;
  if (fulfilment === "ship" && afterDiscount > 0) {
    shipping =
      shippingOverride ??
      (afterDiscount >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING);
  }

  // Smart Pricing: In "inclusive" mode, the product prices already include GST (MRP).
  // The tax component is back-calculated for compliance and invoices without charging extra at checkout.
  let tax = 0;
  let total = 0;

  if (gstMode === "inclusive") {
    // Back-calculate included GST from after-discount amount: Tax = Amount - (Amount / (1 + gstRate))
    tax = gstRate > 0 ? Math.round(afterDiscount - afterDiscount / (1 + gstRate)) : 0;
    total = afterDiscount + shipping;
  } else {
    // Traditional exclusive surcharge
    tax = Math.round(afterDiscount * gstRate);
    total = afterDiscount + shipping + tax;
  }

  const freeShippingGap =
    fulfilment === "pickup" || afterDiscount >= FREE_SHIPPING_THRESHOLD
      ? 0
      : FREE_SHIPPING_THRESHOLD - afterDiscount;

  return {
    subtotal: money(subtotal),
    discount: money(discountAmount),
    shipping: money(shipping),
    tax: money(tax),
    total: money(total),
    freeShippingGap,
  };
}

export function emptyCost(): CartCost {
  return {
    subtotal: money(0),
    discount: money(0),
    shipping: money(0),
    tax: money(0),
    total: money(0),
    freeShippingGap: FREE_SHIPPING_THRESHOLD,
  };
}

/* ─────────────────────────────────────────────────────────────────────
   DISCOUNT CODES
   Swapped for Shopify discount codes at integration time.
   ───────────────────────────────────────────────────────────────────── */

export const discountCodes: Record<string, AppliedDiscount> = {
  FESTIVE20: { code: "FESTIVE20", percent: 20, label: "Festive season offer" },
  FIRST10: { code: "FIRST10", percent: 10, label: "First order" },
  LOCAL15: { code: "LOCAL15", percent: 15, label: "Local customer offer" },
  BULK25: { code: "BULK25", percent: 25, label: "Bulk order (500+ pieces)" },
};

export interface DiscountResult {
  ok: boolean;
  discount: AppliedDiscount | null;
  message: string;
}

export function validateDiscount(
  rawCode: string,
  lines: CartLine[],
): DiscountResult {
  const code = rawCode.trim().toUpperCase();
  if (!code) {
    return { ok: false, discount: null, message: "Enter a code to apply." };
  }
  const found = discountCodes[code];
  if (!found) {
    return {
      ok: false,
      discount: null,
      message: `${code} isn't a valid code. Check the spelling and try again.`,
    };
  }
  if (code === "BULK25") {
    const pieces = lines.reduce((sum, l) => sum + linePieces(l), 0);
    if (pieces < 500) {
      return {
        ok: false,
        discount: null,
        message: `BULK25 needs 500 pieces. Your cart has ${pieces}.`,
      };
    }
  }
  return {
    ok: true,
    discount: found,
    message: `${found.percent}% off applied — ${found.label}.`,
  };
}

/* ─────────────────────────────────────────────────────────────────────
   ADD-ONS
   ───────────────────────────────────────────────────────────────────── */

export const addOnCatalog = [
  {
    id: "design-assist",
    title: "Design assistance",
    description:
      "No artwork? A designer builds it from your brief and shares a proof before printing.",
    price: money(49900),
    icon: "Palette",
  },
  {
    id: "hard-proof",
    title: "Printed proof",
    description:
      "One physical sample couriered before the full run. Adds 2 working days.",
    price: money(29900),
    icon: "FileCheck",
  },
  {
    id: "rush",
    title: "Rush production",
    description: "Moves your job to the front of the queue. Halves turnaround.",
    price: money(39900),
    icon: "Zap",
  },
] as const;

export type AddOnId = (typeof addOnCatalog)[number]["id"];

/* ─────────────────────────────────────────────────────────────────────
   TURNAROUND
   ───────────────────────────────────────────────────────────────────── */

/** Slowest line sets the dispatch date; rush add-on halves it. */
export function cartTurnaround(lines: CartLine[]): number {
  if (lines.length === 0) return 0;
  return Math.max(
    ...lines.map((l) => {
      const rushed = l.addOns.some((a) => a.id === "rush");
      return rushed ? Math.max(1, Math.ceil(l.turnaroundDays / 2)) : l.turnaroundDays;
    }),
  );
}

export function cartIsSameDayEligible(lines: CartLine[]): boolean {
  return lines.length > 0 && lines.every((l) => l.sameDayEligible);
}

/** Stable line id: identical product + variant + tier + configuration + design collapses. */
export function makeLineId(input: {
  productId: string;
  variantId: string;
  tierQty: number | null;
  designHash?: string | null;
  addOnIds: string[];
  configHash?: string | null;
}): string {
  return [
    input.productId,
    input.variantId,
    input.tierQty ?? "u",
    input.configHash ?? "nc",
    input.designHash ?? "nd",
    input.addOnIds.slice().sort().join("+") || "na",
  ].join("::");
}

export function cartFromLines(
  lines: CartLine[],
  opts: {
    discount?: AppliedDiscount | null;
    fulfilment?: "ship" | "pickup";
    pincode?: string | null;
    shippingOverride?: number | null;
    gstMode?: "inclusive" | "exclusive";
    gstRate?: number;
  } = {},
): Cart {
  const fulfilment = opts.fulfilment ?? "ship";
  const discount = opts.discount ?? null;
  return {
    id: "local-cart",
    lines,
    cost: computeCost({
      lines,
      discount,
      fulfilment,
      shippingOverride: opts.shippingOverride,
      gstMode: opts.gstMode,
      gstRate: opts.gstRate,
    }),
    discount,
    fulfilment,
    pincode: opts.pincode ?? null,
    checkoutUrl: null,
    totalQuantity: lines.reduce((sum, l) => sum + l.quantity, 0),
  };
}
