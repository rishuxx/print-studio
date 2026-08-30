import type { OrderStatus, PaymentStatus } from "@/lib/supabase/database.types";

export type DateRangePreset =
  | "today"
  | "yesterday"
  | "7d"
  | "30d"
  | "this_month"
  | "last_month"
  | "this_year"
  | "all_time"
  | "custom";

export interface ParsedDateRange {
  preset: DateRangePreset;
  startIso: string | null; // ISO string in UTC or null for unbounded all_time
  endIso: string | null;   // ISO string in UTC or null for unbounded all_time
  prevStartIso: string | null;
  prevEndIso: string | null;
  label: string;
  comparisonLabel: string;
  fromParam?: string; // YYYY-MM-DD
  toParam?: string;   // YYYY-MM-DD
}

export interface MetricComparison {
  current: number;
  previous: number;
  changePercent: number | null; // null if previous === 0
  trend: "up" | "down" | "neutral";
  displayState: "calculated" | "new_activity" | "no_previous_data" | "none";
}

export interface DashboardOverviewKPIs {
  totalOrders: number;
  totalRevenuePaise: number;
  activeOrders: number;
  completedOrders: number;
  paymentIssues: number;
  averageOrderValuePaise: number;
}

export interface DashboardComparisonMetrics {
  orders: MetricComparison;
  revenue: MetricComparison;
  activeOrders: MetricComparison;
  completedOrders: MetricComparison;
  paymentIssues: MetricComparison;
}

export interface RevenueTrendPoint {
  dateKey: string; // ISO date string or formatted label
  label: string;   // e.g. "24 Aug" or "14:00"
  revenuePaise: number;
  orderCount: number;
}

export interface OrderTrendPoint {
  dateKey: string;
  label: string;
  orderCount: number;
  paidOrderCount: number;
}

export interface StatusDistributionItem {
  status: OrderStatus;
  label: string;
  count: number;
  percentage: number;
  badgeClass: string;
}

export interface AttentionMetric {
  id: string;
  title: string;
  description: string;
  count: number;
  severity: "urgent" | "warning" | "info";
  href: string;
  actionLabel: string;
}

export interface RecentOrderSummary {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  totalPaise: number;
  createdAt: string;
  itemsCount: number;
}

export interface DashboardDataDTO {
  dateRange: ParsedDateRange;
  kpis: DashboardOverviewKPIs;
  comparison: DashboardComparisonMetrics;
  revenueTrend: RevenueTrendPoint[];
  orderTrend: OrderTrendPoint[];
  statusDistribution: StatusDistributionItem[];
  attentionItems: AttentionMetric[];
  recentOrders: RecentOrderSummary[];
  generatedAt: string;
}
