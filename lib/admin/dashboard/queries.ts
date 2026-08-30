import { createClient } from "@/lib/supabase/server";
import { OrderStatus, PaymentStatus } from "@/lib/supabase/database.types";
import {
  DashboardDataDTO,
  ParsedDateRange,
  RevenueTrendPoint,
  OrderTrendPoint,
  StatusDistributionItem,
  AttentionMetric,
  RecentOrderSummary,
} from "./types";
import { calculateMetricComparison } from "./formatters";
import {
  ACTIVE_ORDER_STATUSES,
  COMPLETED_ORDER_STATUSES,
  isOrderRevenueEligible,
  getOrderStatusBadge,
} from "./metrics";

interface CustomerSnapshotParsed {
  full_name?: string;
  name?: string;
  email?: string;
}

/**
 * Server-side Query Engine for Dashboard Overview.
 * Enforces bounded, aggregated and sanitized queries.
 */
export async function getDashboardOverviewData(
  dateRange: ParsedDateRange
): Promise<DashboardDataDTO> {
  const supabase = await createClient();

  // 1. Fetch orders in CURRENT date range
  let currentQuery = supabase
    .from("orders")
    .select("id, order_number, status, payment_status, total, created_at, customer_snapshot");

  if (dateRange.startIso && dateRange.endIso) {
    currentQuery = currentQuery
      .gte("created_at", dateRange.startIso)
      .lte("created_at", dateRange.endIso);
  }

  const { data: currentOrders, error: currentError } = await currentQuery;

  if (currentError) {
    throw new Error(`Failed to query current dashboard metrics: ${currentError.message}`);
  }

  // 2. Fetch orders in PREVIOUS date range for comparison (if applicable)
  let prevOrders: Array<{ status: string; payment_status: string; total: number }> = [];
  if (dateRange.prevStartIso && dateRange.prevEndIso) {
    const { data: prevData, error: prevError } = await supabase
      .from("orders")
      .select("status, payment_status, total")
      .gte("created_at", dateRange.prevStartIso)
      .lte("created_at", dateRange.prevEndIso);

    if (!prevError && prevData) {
      prevOrders = prevData;
    }
  }

  // 3. Compute Current Period Metrics (Using exact integer paise)
  const safeCurrent = currentOrders || [];

  let currentRevenuePaise = 0;
  let currentActiveOrders = 0;
  let currentCompletedOrders = 0;
  let currentPaymentIssues = 0;

  safeCurrent.forEach((o) => {
    const totalPaise = Math.round(Number(o.total || 0) * 100);
    const isPaid = isOrderRevenueEligible({
      payment_status: o.payment_status as PaymentStatus,
      status: o.status as OrderStatus,
    });

    if (isPaid) {
      currentRevenuePaise += totalPaise;
    }

    if (ACTIVE_ORDER_STATUSES.includes(o.status as OrderStatus)) {
      currentActiveOrders += 1;
    }

    if (COMPLETED_ORDER_STATUSES.includes(o.status as OrderStatus)) {
      currentCompletedOrders += 1;
    }

    if (
      o.status !== "cancelled" &&
      (o.payment_status === "failed" || o.payment_status === "pending")
    ) {
      currentPaymentIssues += 1;
    }
  });

  const totalCurrentOrders = safeCurrent.length;
  const averageOrderValuePaise =
    totalCurrentOrders > 0 ? Math.round(currentRevenuePaise / totalCurrentOrders) : 0;

  // 4. Compute Previous Period Metrics
  let prevRevenuePaise = 0;
  let prevActiveOrders = 0;
  let prevCompletedOrders = 0;
  let prevPaymentIssues = 0;

  prevOrders.forEach((o) => {
    const totalPaise = Math.round(Number(o.total || 0) * 100);
    const isPaid = isOrderRevenueEligible({
      payment_status: o.payment_status as PaymentStatus,
      status: o.status as OrderStatus,
    });

    if (isPaid) {
      prevRevenuePaise += totalPaise;
    }

    if (ACTIVE_ORDER_STATUSES.includes(o.status as OrderStatus)) {
      prevActiveOrders += 1;
    }

    if (COMPLETED_ORDER_STATUSES.includes(o.status as OrderStatus)) {
      prevCompletedOrders += 1;
    }

    if (
      o.status !== "cancelled" &&
      (o.payment_status === "failed" || o.payment_status === "pending")
    ) {
      prevPaymentIssues += 1;
    }
  });

  const totalPrevOrders = prevOrders.length;

  // 5. Generate Metric Comparisons
  const comparison = {
    orders: calculateMetricComparison(totalCurrentOrders, totalPrevOrders),
    revenue: calculateMetricComparison(currentRevenuePaise, prevRevenuePaise),
    activeOrders: calculateMetricComparison(currentActiveOrders, prevActiveOrders),
    completedOrders: calculateMetricComparison(currentCompletedOrders, prevCompletedOrders),
    paymentIssues: calculateMetricComparison(currentPaymentIssues, prevPaymentIssues),
  };

  // 6. Aggregate Trends by Day/Bucket in India Standard Time
  const trendMap = new Map<
    string,
    { label: string; revenuePaise: number; orderCount: number; paidOrderCount: number }
  >();

  // Determine grouping: If range is <= 2 days, show by hour; else show by day
  const isHourly = dateRange.preset === "today" || dateRange.preset === "yesterday";

  safeCurrent.forEach((o) => {
    const d = new Date(o.created_at);
    // Convert to IST
    const istTime = new Date(d.getTime() + 5.5 * 60 * 60 * 1000);
    const y = istTime.getUTCFullYear();
    const m = String(istTime.getUTCMonth() + 1).padStart(2, "0");
    const day = String(istTime.getUTCDate()).padStart(2, "0");
    const hour = String(istTime.getUTCHours()).padStart(2, "0");

    const key = isHourly ? `${y}-${m}-${day} ${hour}:00` : `${y}-${m}-${day}`;
    const label = isHourly
      ? `${hour}:00`
      : new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", timeZone: "UTC" }).format(
          istTime
        );

    const totalPaise = Math.round(Number(o.total || 0) * 100);
    const isPaid = isOrderRevenueEligible({
      payment_status: o.payment_status as PaymentStatus,
      status: o.status as OrderStatus,
    });

    const existing = trendMap.get(key) || {
      label,
      revenuePaise: 0,
      orderCount: 0,
      paidOrderCount: 0,
    };

    existing.orderCount += 1;
    if (isPaid) {
      existing.revenuePaise += totalPaise;
      existing.paidOrderCount += 1;
    }

    trendMap.set(key, existing);
  });

  // Sort trend points chronologically
  const sortedKeys = Array.from(trendMap.keys()).sort();
  const revenueTrend: RevenueTrendPoint[] = sortedKeys.map((k) => {
    const item = trendMap.get(k)!;
    return {
      dateKey: k,
      label: item.label,
      revenuePaise: item.revenuePaise,
      orderCount: item.orderCount,
    };
  });

  const orderTrend: OrderTrendPoint[] = sortedKeys.map((k) => {
    const item = trendMap.get(k)!;
    return {
      dateKey: k,
      label: item.label,
      orderCount: item.orderCount,
      paidOrderCount: item.paidOrderCount,
    };
  });

  // 7. Status Distribution
  const statusCounts: Record<string, number> = {};
  safeCurrent.forEach((o) => {
    statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
  });

  const allStatuses: OrderStatus[] = [
    "pending",
    "confirmed",
    "artwork_review",
    "proof_pending",
    "proof_approved",
    "in_production",
    "quality_check",
    "ready",
    "shipped",
    "out_for_delivery",
    "delivered",
    "cancelled",
  ];

  const statusDistribution: StatusDistributionItem[] = allStatuses
    .map((st) => {
      const count = statusCounts[st] || 0;
      const meta = getOrderStatusBadge(st);
      const percentage =
        totalCurrentOrders > 0 ? Math.round((count / totalCurrentOrders) * 1000) / 10 : 0;
      return {
        status: st,
        label: meta.label,
        count,
        percentage,
        badgeClass: meta.badgeClass,
      };
    })
    .filter((s) => s.count > 0); // Include active items

  // 8. Operational Attention Items
  const artworkReviewCount = statusCounts["artwork_review"] || 0;
  const proofPendingCount = statusCounts["proof_pending"] || 0;
  const inProductionCount = statusCounts["in_production"] || 0;
  const pendingOrdersCount = statusCounts["pending"] || 0;

  const attentionItems: AttentionMetric[] = [];

  if (artworkReviewCount > 0) {
    attentionItems.push({
      id: "artwork_review",
      title: "Artwork Verification",
      description: "Jobs requiring pre-press resolution, bleed margins & CMYK verification",
      count: artworkReviewCount,
      severity: "urgent",
      href: "/admin/orders?status=artwork_review",
      actionLabel: "Review Artwork",
    });
  }

  if (proofPendingCount > 0) {
    attentionItems.push({
      id: "proof_pending",
      title: "Proof Approvals Pending",
      description: "Dispatched digital proofs awaiting customer approval",
      count: proofPendingCount,
      severity: "warning",
      href: "/admin/orders?status=proof_pending",
      actionLabel: "Inspect Proofs",
    });
  }

  if (currentPaymentIssues > 0) {
    attentionItems.push({
      id: "payment_issues",
      title: "Unpaid / Pending Payments",
      description: "Orders requiring payment follow-up or verification",
      count: currentPaymentIssues,
      severity: "warning",
      href: "/admin/orders?status=pending",
      actionLabel: "Inspect Orders",
    });
  }

  if (pendingOrdersCount > 0) {
    attentionItems.push({
      id: "pending_orders",
      title: "New Unconfirmed Orders",
      description: "Freshly placed customer orders waiting for initial confirmation",
      count: pendingOrdersCount,
      severity: "info",
      href: "/admin/orders?status=pending",
      actionLabel: "Confirm Orders",
    });
  }

  if (inProductionCount > 0) {
    attentionItems.push({
      id: "in_production",
      title: "Active Press Runs",
      description: "Print batches currently on press or in post-print finishing",
      count: inProductionCount,
      severity: "info",
      href: "/admin/orders?status=in_production",
      actionLabel: "View Production",
    });
  }

  // 9. Fetch Bounded Recent Orders (Top 8 newest)
  const { data: recentDbOrders } = await supabase
    .from("orders")
    .select("id, order_number, status, payment_status, total, created_at, customer_snapshot, order_items(count)")
    .order("created_at", { ascending: false })
    .limit(8);

  const recentOrders: RecentOrderSummary[] = (recentDbOrders || []).map((ro) => {
    const rawSnap = ro.customer_snapshot as CustomerSnapshotParsed | null;
    const name = rawSnap?.full_name || rawSnap?.name || "Customer";
    const email = rawSnap?.email || "";
    const totalPaise = Math.round(Number(ro.total || 0) * 100);

    return {
      id: ro.id,
      orderNumber: ro.order_number,
      customerName: name,
      customerEmail: email,
      status: ro.status as OrderStatus,
      paymentStatus: ro.payment_status as PaymentStatus,
      totalPaise,
      createdAt: ro.created_at,
      itemsCount: Array.isArray(ro.order_items) ? ro.order_items.length : 1,
    };
  });

  return {
    dateRange,
    kpis: {
      totalOrders: totalCurrentOrders,
      totalRevenuePaise: currentRevenuePaise,
      activeOrders: currentActiveOrders,
      completedOrders: currentCompletedOrders,
      paymentIssues: currentPaymentIssues,
      averageOrderValuePaise,
    },
    comparison,
    revenueTrend,
    orderTrend,
    statusDistribution,
    attentionItems,
    recentOrders,
    generatedAt: new Date().toISOString(),
  };
}
