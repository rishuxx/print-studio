import type { MoneyMinor } from "./types";

/**
 * Deterministic Integer Paise Arithmetic Utilities
 */

export const PRICING_ENGINE_VERSION = "2026.10F.1";
export const DEFAULT_BUSINESS_TIMEZONE = "Asia/Kolkata";

/**
 * Format integer paise into Indian Rupee display (₹)
 */
export function formatPaise(paise: MoneyMinor, showDecimals = false): string {
  const rupees = paise / 100;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(rupees);
}

/**
 * Calculate percentage discount with deterministic integer rounding
 */
export function calculatePercentageDiscount(
  amountMinor: MoneyMinor,
  percent: number
): MoneyMinor {
  if (percent <= 0 || amountMinor <= 0) return 0;
  const clampedPercent = Math.min(100, percent);
  return Math.round((amountMinor * clampedPercent) / 100);
}

/**
 * Convert Rupees to Integer Paise safely
 */
export function rupeesToPaise(rupees: number): MoneyMinor {
  if (!Number.isFinite(rupees) || rupees < 0) return 0;
  return Math.round(rupees * 100);
}

/**
 * Convert Integer Paise to Rupees safely
 */
export function paiseToRupees(paise: MoneyMinor): number {
  return paise / 100;
}
