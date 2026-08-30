import { MetricComparison } from "./types";

/**
 * Calculates mathematically sound percentage change between two numbers.
 * Safely handles 0 values and negative deltas.
 */
export function calculateMetricComparison(current: number, previous: number): MetricComparison {
  if (previous === 0) {
    if (current === 0) {
      return {
        current,
        previous,
        changePercent: 0,
        trend: "neutral",
        displayState: "no_previous_data",
      };
    }
    return {
      current,
      previous,
      changePercent: null,
      trend: "up",
      displayState: "new_activity",
    };
  }

  const rawChange = ((current - previous) / previous) * 100;
  const changePercent = Math.round(rawChange * 10) / 10; // 1 decimal place

  let trend: "up" | "down" | "neutral" = "neutral";
  if (changePercent > 0) trend = "up";
  else if (changePercent < 0) trend = "down";

  return {
    current,
    previous,
    changePercent: Math.abs(changePercent),
    trend,
    displayState: "calculated",
  };
}

/**
 * Format Indian Rupee from integer paise.
 */
export function formatPaiseToInr(paise: number, includeDecimals: boolean = false): string {
  const rupees = paise / 100;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: includeDecimals ? 2 : 0,
    maximumFractionDigits: includeDecimals ? 2 : 0,
  }).format(rupees);
}

/**
 * Format Indian large numbers (e.g. 1,25,000)
 */
export function formatIndianNumber(val: number): string {
  return new Intl.NumberFormat("en-IN").format(val);
}

/**
 * Format Date into Indian business format: "29 Aug 2026"
 */
export function formatIndianDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "Asia/Kolkata",
    }).format(d);
  } catch {
    return isoString;
  }
}

/**
 * Format DateTime into: "29 Aug, 10:42 PM"
 */
export function formatIndianDateTime(isoString: string): string {
  try {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    }).format(d);
  } catch {
    return isoString;
  }
}
