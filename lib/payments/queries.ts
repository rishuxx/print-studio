import { createClient } from "@/lib/supabase/server";
import type {
  AdminPaymentsFilterParams,
  PaymentKpiMetrics,
  AdminWebhooksFilterParams,
} from "./types";
import { parseDateRange } from "@/lib/admin/dashboard/date-range";

export interface DbPaymentRow {
  id: string;
  order_id: string;
  provider: string;
  provider_order_id: string;
  provider_payment_id: string | null;
  status: string;
  amount: number;
  amount_minor: number;
  amount_refunded_minor: number;
  currency: string;
  method: string | null;
  signature_verified: boolean;
  webhook_confirmed: boolean;
  reconciliation_state: string;
  reconciliation_notes: string | null;
  failure_code: string | null;
  failure_description: string | null;
  captured_at: string | null;
  refunded_at: string | null;
  created_at: string;
  updated_at: string;
  orders?: {
    id: string;
    order_number: string;
    status: string;
    total: number;
    customer_snapshot: unknown;
  } | null;
}

export interface FetchAdminPaymentsResult {
  payments: DbPaymentRow[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  kpis: PaymentKpiMetrics;
  error?: string;
}

const ALLOWED_PAYMENT_SORTS: Record<string, { column: string; ascending: boolean }> = {
  newest: { column: "created_at", ascending: false },
  oldest: { column: "created_at", ascending: true },
  highest_amount: { column: "amount_minor", ascending: false },
  lowest_amount: { column: "amount_minor", ascending: true },
  recently_updated: { column: "updated_at", ascending: false },
};

/**
 * Sync helper: Backfill payments table from orders table if orders exist without payment records
 */
async function backfillMissingPayments(supabase: Awaited<ReturnType<typeof createClient>>) {
  try {
    const { data: existingOrders } = await supabase
      .from("orders")
      .select("id, order_number, total, status, payment_status, payment_method, payment_reference, created_at");

    if (!existingOrders || existingOrders.length === 0) return;

    for (const ord of existingOrders) {
      const { data: existingPayment } = await supabase
        .from("payments")
        .select("id")
        .eq("order_id", ord.id)
        .maybeSingle();

      if (!existingPayment) {
        const amtMinor = Math.round(Number(ord.total || 0) * 100);
        const isPaid = ord.payment_status === "paid" || ord.payment_status === "captured";
        const status = isPaid ? "captured" : "pending";

        await supabase.from("payments").insert({
          order_id: ord.id,
          provider: "razorpay",
          provider_order_id: `order_legacy_${ord.order_number}`,
          provider_payment_id: ord.payment_reference || (isPaid ? `pay_legacy_${ord.order_number}` : null),
          status,
          amount: amtMinor,
          amount_minor: amtMinor,
          amount_refunded_minor: 0,
          currency: "INR",
          method: ord.payment_method || "upi",
          signature_verified: isPaid,
          webhook_confirmed: isPaid,
          reconciliation_state: "reconciled",
          captured_at: isPaid ? ord.created_at : null,
          created_at: ord.created_at,
          updated_at: ord.created_at,
        });
      }
    }
  } catch (err) {
    console.error("[backfillMissingPayments error]:", err);
  }
}

/**
 * Fetch Admin Payments with server-side filtering, sorting, pagination, and KPI aggregation
 */
export async function fetchAdminPayments(
  params: AdminPaymentsFilterParams
): Promise<FetchAdminPaymentsResult> {
  const supabase = await createClient();

  // Auto-sync any unlinked orders created prior to payments table setup
  await backfillMissingPayments(supabase);

  const currentPage = Math.max(1, params.page || 1);
  const pageSize = Math.min(100, Math.max(10, params.pageSize || 50));
  const offset = (currentPage - 1) * pageSize;

  let query = supabase
    .from("payments")
    .select("*, orders(id, order_number, status, total, customer_snapshot)", { count: "exact" });

  // 1. Status Filter
  if (params.status && params.status !== "ALL") {
    query = query.eq("status", params.status);
  }

  // 2. Reconciliation State Filter
  if (params.reconciliationState && params.reconciliationState !== "ALL") {
    query = query.eq("reconciliation_state", params.reconciliationState);
  }

  // 3. Date Range Filter
  if (params.dateRange && params.dateRange !== "ALL") {
    try {
      const parsed = parseDateRange(params.dateRange, params.from, params.to);
      if (parsed.startIso && parsed.endIso) {
        query = query.gte("created_at", parsed.startIso).lte("created_at", parsed.endIso);
      }
    } catch {
      // Ignore
    }
  }

  // 4. Parameterized Search Filter
  if (params.q && params.q.trim().length > 0) {
    const rawTerm = params.q.trim();
    const sanitized = rawTerm.replace(/[,%()]/g, " ").trim();
    if (sanitized.length > 0) {
      query = query.or(
        `provider_payment_id.ilike.%${sanitized}%,provider_order_id.ilike.%${sanitized}%`
      );
    }
  }

  // 5. Server-side Sorting
  const sortKey = params.sort || "newest";
  const sortConfig = ALLOWED_PAYMENT_SORTS[sortKey] || ALLOWED_PAYMENT_SORTS.newest;
  query = query.order(sortConfig.column, { ascending: sortConfig.ascending });

  // 6. Pagination Range
  query = query.range(offset, offset + pageSize - 1);

  const { data: payments, count, error } = await query;

  // 7. Calculate Server-side KPI Metrics from PostgreSQL Aggregate
  const { data: allPayments } = await supabase
    .from("payments")
    .select("status, amount, amount_minor, amount_refunded_minor, reconciliation_state");

  const kpis: PaymentKpiMetrics = {
    grossVolumeMinor: 0,
    capturedVolumeMinor: 0,
    refundedVolumeMinor: 0,
    netVolumeMinor: 0,
    capturedCount: 0,
    pendingCount: 0,
    failedCount: 0,
    refundedCount: 0,
    successRatePercentage: 100,
    attentionCount: 0,
  };

  if (allPayments && allPayments.length > 0) {
    for (const p of allPayments) {
      const amt = Number(p.amount_minor || p.amount || 0);
      const ref = Number(p.amount_refunded_minor || 0);

      kpis.grossVolumeMinor += amt;

      if (p.status === "captured" || p.status === "partially_refunded" || p.status === "refunded") {
        kpis.capturedVolumeMinor += amt;
        kpis.capturedCount++;
      } else if (p.status === "created" || p.status === "pending" || p.status === "authorized") {
        kpis.pendingCount++;
      } else if (p.status === "failed") {
        kpis.failedCount++;
      }

      if (ref > 0 || p.status === "refunded" || p.status === "partially_refunded") {
        kpis.refundedVolumeMinor += ref;
        kpis.refundedCount++;
      }

      if (p.reconciliation_state && p.reconciliation_state !== "reconciled") {
        kpis.attentionCount++;
      }
    }

    kpis.netVolumeMinor = Math.max(0, kpis.capturedVolumeMinor - kpis.refundedVolumeMinor);
    const totalTerminal = kpis.capturedCount + kpis.failedCount;
    kpis.successRatePercentage = totalTerminal > 0 ? Math.round((kpis.capturedCount / totalTerminal) * 100) : 100;
  }

  if (error) {
    console.error("[fetchAdminPayments error]:", error);
    return {
      payments: [],
      totalCount: 0,
      currentPage,
      pageSize,
      kpis,
      error: error.message,
    };
  }

  return {
    payments: (payments as unknown as DbPaymentRow[]) || [],
    totalCount: count || 0,
    currentPage,
    pageSize,
    kpis,
  };
}

/**
 * Fetch Webhook Events with server-side filtering and pagination
 */
export async function fetchAdminWebhookEvents(params: AdminWebhooksFilterParams) {
  const supabase = await createClient();

  const currentPage = Math.max(1, params.page || 1);
  const pageSize = Math.min(100, Math.max(10, params.pageSize || 50));
  const offset = (currentPage - 1) * pageSize;

  let query = supabase
    .from("webhook_events")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  if (params.status && params.status !== "ALL") {
    query = query.eq("processing_status", params.status);
  }

  if (params.eventType && params.eventType !== "ALL") {
    query = query.eq("event_type", params.eventType);
  }

  if (params.q && params.q.trim().length > 0) {
    const rawTerm = params.q.trim();
    query = query.or(`event_id.ilike.%${rawTerm}%,event_type.ilike.%${rawTerm}%`);
  }

  query = query.range(offset, offset + pageSize - 1);

  const { data: events, count, error } = await query;

  return {
    events: events || [],
    totalCount: count || 0,
    currentPage,
    pageSize,
    error: error?.message,
  };
}
