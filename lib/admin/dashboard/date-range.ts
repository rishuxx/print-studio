import { DateRangePreset, ParsedDateRange } from "./types";

/**
 * Timezone-safe calculations for India Standard Time (Asia/Kolkata: UTC+05:30).
 * Offset in minutes: 330.
 */
const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

function getIstDateParts(nowUtc: Date = new Date()) {
  const istTime = new Date(nowUtc.getTime() + IST_OFFSET_MS);
  return {
    year: istTime.getUTCFullYear(),
    month: istTime.getUTCMonth(), // 0-indexed
    date: istTime.getUTCDate(),
    day: istTime.getUTCDay(),
  };
}

/**
 * Creates UTC Date instance corresponding to start of day in IST (00:00:00.000 IST).
 */
function createIstMidnightUtc(year: number, month: number, date: number): Date {
  return new Date(Date.UTC(year, month, date, 0, 0, 0, 0) - IST_OFFSET_MS);
}

/**
 * Creates UTC Date instance corresponding to end of day in IST (23:59:59.999 IST).
 */
function createIstEndOfDayUtc(year: number, month: number, date: number): Date {
  return new Date(Date.UTC(year, month, date, 23, 59, 59, 999) - IST_OFFSET_MS);
}

/**
 * Formats YYYY-MM-DD from year, month, date
 */
function formatYmd(year: number, month: number, date: number): string {
  const m = String(month + 1).padStart(2, "0");
  const d = String(date).padStart(2, "0");
  return `${year}-${m}-${d}`;
}

export function parseDateRange(
  rawRange?: string | null,
  rawFrom?: string | null,
  rawTo?: string | null,
  now: Date = new Date()
): ParsedDateRange {
  const { year, month, date } = getIstDateParts(now);

  // Validate custom date inputs (YYYY-MM-DD)
  const isValidYmd = (s?: string | null) => !!s && /^\d{4}-\d{2}-\d{2}$/.test(s);

  if (rawRange === "custom" || (isValidYmd(rawFrom) && isValidYmd(rawTo))) {
    if (isValidYmd(rawFrom) && isValidYmd(rawTo)) {
      const [fromY, fromM, fromD] = rawFrom!.split("-").map(Number);
      const [toY, toM, toD] = rawTo!.split("-").map(Number);

      const start = createIstMidnightUtc(fromY, fromM - 1, fromD);
      const end = createIstEndOfDayUtc(toY, toM - 1, toD);

      if (start.getTime() <= end.getTime()) {
        const durationMs = end.getTime() - start.getTime();
        const prevEnd = new Date(start.getTime() - 1);
        const prevStart = new Date(prevEnd.getTime() - durationMs);

        return {
          preset: "custom",
          startIso: start.toISOString(),
          endIso: end.toISOString(),
          prevStartIso: prevStart.toISOString(),
          prevEndIso: prevEnd.toISOString(),
          label: `${rawFrom} to ${rawTo}`,
          comparisonLabel: "vs previous custom period",
          fromParam: rawFrom!,
          toParam: rawTo!,
        };
      }
    }
  }

  // Handle Preset Ranges
  const preset = (rawRange as DateRangePreset) || "30d";

  switch (preset) {
    case "today": {
      const start = createIstMidnightUtc(year, month, date);
      const end = createIstEndOfDayUtc(year, month, date);
      const prevStart = createIstMidnightUtc(year, month, date - 1);
      const prevEnd = createIstEndOfDayUtc(year, month, date - 1);

      return {
        preset: "today",
        startIso: start.toISOString(),
        endIso: end.toISOString(),
        prevStartIso: prevStart.toISOString(),
        prevEndIso: prevEnd.toISOString(),
        label: "Today",
        comparisonLabel: "vs yesterday",
        fromParam: formatYmd(year, month, date),
        toParam: formatYmd(year, month, date),
      };
    }

    case "yesterday": {
      const start = createIstMidnightUtc(year, month, date - 1);
      const end = createIstEndOfDayUtc(year, month, date - 1);
      const prevStart = createIstMidnightUtc(year, month, date - 2);
      const prevEnd = createIstEndOfDayUtc(year, month, date - 2);

      return {
        preset: "yesterday",
        startIso: start.toISOString(),
        endIso: end.toISOString(),
        prevStartIso: prevStart.toISOString(),
        prevEndIso: prevEnd.toISOString(),
        label: "Yesterday",
        comparisonLabel: "vs day before yesterday",
        fromParam: formatYmd(year, month, date - 1),
        toParam: formatYmd(year, month, date - 1),
      };
    }

    case "7d": {
      const start = createIstMidnightUtc(year, month, date - 6);
      const end = createIstEndOfDayUtc(year, month, date);
      const prevStart = createIstMidnightUtc(year, month, date - 13);
      const prevEnd = createIstEndOfDayUtc(year, month, date - 7);

      return {
        preset: "7d",
        startIso: start.toISOString(),
        endIso: end.toISOString(),
        prevStartIso: prevStart.toISOString(),
        prevEndIso: prevEnd.toISOString(),
        label: "Last 7 Days",
        comparisonLabel: "vs previous 7 days",
        fromParam: formatYmd(year, month, date - 6),
        toParam: formatYmd(year, month, date),
      };
    }

    case "this_month": {
      const start = createIstMidnightUtc(year, month, 1);
      const end = createIstEndOfDayUtc(year, month, date);
      const prevStart = createIstMidnightUtc(year, month - 1, 1);
      const prevEnd = createIstEndOfDayUtc(year, month - 1, date);

      return {
        preset: "this_month",
        startIso: start.toISOString(),
        endIso: end.toISOString(),
        prevStartIso: prevStart.toISOString(),
        prevEndIso: prevEnd.toISOString(),
        label: "This Month",
        comparisonLabel: "vs same period last month",
        fromParam: formatYmd(year, month, 1),
        toParam: formatYmd(year, month, date),
      };
    }

    case "last_month": {
      // Last day of previous month
      const prevMonthLastDate = new Date(Date.UTC(year, month, 0)).getUTCDate();
      const start = createIstMidnightUtc(year, month - 1, 1);
      const end = createIstEndOfDayUtc(year, month - 1, prevMonthLastDate);
      const prevStart = createIstMidnightUtc(year, month - 2, 1);
      const prevMonth2LastDate = new Date(Date.UTC(year, month - 1, 0)).getUTCDate();
      const prevEnd = createIstEndOfDayUtc(year, month - 2, prevMonth2LastDate);

      return {
        preset: "last_month",
        startIso: start.toISOString(),
        endIso: end.toISOString(),
        prevStartIso: prevStart.toISOString(),
        prevEndIso: prevEnd.toISOString(),
        label: "Last Month",
        comparisonLabel: "vs 2 months ago",
        fromParam: formatYmd(year, month - 1, 1),
        toParam: formatYmd(year, month - 1, prevMonthLastDate),
      };
    }

    case "this_year": {
      const start = createIstMidnightUtc(year, 0, 1);
      const end = createIstEndOfDayUtc(year, month, date);
      const prevStart = createIstMidnightUtc(year - 1, 0, 1);
      const prevEnd = createIstEndOfDayUtc(year - 1, month, date);

      return {
        preset: "this_year",
        startIso: start.toISOString(),
        endIso: end.toISOString(),
        prevStartIso: prevStart.toISOString(),
        prevEndIso: prevEnd.toISOString(),
        label: "This Year",
        comparisonLabel: "vs same period last year",
        fromParam: formatYmd(year, 0, 1),
        toParam: formatYmd(year, month, date),
      };
    }

    case "all_time": {
      return {
        preset: "all_time",
        startIso: null,
        endIso: null,
        prevStartIso: null,
        prevEndIso: null,
        label: "All Time",
        comparisonLabel: "no previous period",
      };
    }

    case "30d":
    default: {
      const start = createIstMidnightUtc(year, month, date - 29);
      const end = createIstEndOfDayUtc(year, month, date);
      const prevStart = createIstMidnightUtc(year, month, date - 59);
      const prevEnd = createIstEndOfDayUtc(year, month, date - 30);

      return {
        preset: "30d",
        startIso: start.toISOString(),
        endIso: end.toISOString(),
        prevStartIso: prevStart.toISOString(),
        prevEndIso: prevEnd.toISOString(),
        label: "Last 30 Days",
        comparisonLabel: "vs previous 30 days",
        fromParam: formatYmd(year, month, date - 29),
        toParam: formatYmd(year, month, date),
      };
    }
  }
}
