import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";
import type { AdminOrdersFilterParams, OrderSortOption } from "./types";
import { parseDateRange } from "@/lib/admin/dashboard/date-range";

export type DbOrderWithItems = Database["public"]["Tables"]["orders"]["Row"] & {
  order_items?: Database["public"]["Tables"]["order_items"]["Row"][];
};

export interface FetchAdminOrdersResult {
  orders: DbOrderWithItems[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  error?: string;
}

const ALLOWED_SORTS: Record<OrderSortOption, { column: string; ascending: boolean }> = {
  newest: { column: "created_at", ascending: false },
  oldest: { column: "created_at", ascending: true },
  highest_value: { column: "total", ascending: false },
  lowest_value: { column: "total", ascending: true },
  recently_updated: { column: "updated_at", ascending: false },
};

export async function fetchAdminOrders(
  params: AdminOrdersFilterParams
): Promise<FetchAdminOrdersResult> {
  const supabase = await createClient();

  const currentPage = Math.max(1, params.page || 1);
  const pageSize = Math.min(100, Math.max(10, params.pageSize || 50));
  const offset = (currentPage - 1) * pageSize;

  let query = supabase
    .from("orders")
    .select("*, order_items(*)", { count: "exact" });

  // 1. Filter: Order Status (Supports 'active' pipeline and individual statuses)
  if (params.status === "active") {
    query = query.in("status", [
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
    ]);
  } else if (params.status && params.status !== "ALL") {
    query = query.eq("status", params.status);
  }

  // 2. Filter: Payment Status
  if (params.paymentStatus === "pending" || params.paymentStatus === "unpaid") {
    query = query.in("payment_status", ["pending", "unpaid", "failed"]);
  } else if (params.paymentStatus && params.paymentStatus !== "ALL") {
    query = query.eq("payment_status", params.paymentStatus);
  }

  // 3. Filter: Date Range (Timezone-safe Asia/Kolkata date parsing)
  if (params.dateRange && params.dateRange !== "ALL") {
    try {
      // Map order preset to dashboard preset
      let mappedPreset = params.dateRange;
      if (params.dateRange === "last_7_days") mappedPreset = "7d" as unknown as typeof params.dateRange;
      if (params.dateRange === "last_30_days") mappedPreset = "30d" as unknown as typeof params.dateRange;

      const parsed = parseDateRange(mappedPreset, params.from, params.to);
      if (parsed.startIso && parsed.endIso) {
        query = query.gte("created_at", parsed.startIso).lte("created_at", parsed.endIso);
      }
    } catch {
      // Ignore invalid date range and proceed
    }
  }

  // 4. Search Filter (Server-side parameterized ILIKE against order_number, invoice_number, and JSON snapshots)
  if (params.q && params.q.trim().length > 0) {
    const rawTerm = params.q.trim();
    // Sanitize search term to prevent malformed regex/filter characters
    const sanitized = rawTerm.replace(/[,%()]/g, " ").trim();
    if (sanitized.length > 0) {
      query = query.or(
        `order_number.ilike.%${sanitized}%,invoice_number.ilike.%${sanitized}%,customer_snapshot->>email.ilike.%${sanitized}%,customer_snapshot->>fullName.ilike.%${sanitized}%,customer_snapshot->>phone.ilike.%${sanitized}%,payment_reference.ilike.%${sanitized}%`
      );
    }
  }

  // 5. Server-side Sorting
  const sortConfig = ALLOWED_SORTS[params.sort || "newest"] || ALLOWED_SORTS.newest;
  query = query.order(sortConfig.column, { ascending: sortConfig.ascending });

  // 6. Server-side Bounded Pagination
  query = query.range(offset, offset + pageSize - 1);

  const { data: orders, count, error } = await query;

  if (error) {
    console.error("fetchAdminOrders error:", error);
    return {
      orders: [],
      totalCount: 0,
      currentPage,
      pageSize,
      error: error.message,
    };
  }

  return {
    orders: (orders as DbOrderWithItems[]) || [],
    totalCount: count || 0,
    currentPage,
    pageSize,
  };
}
