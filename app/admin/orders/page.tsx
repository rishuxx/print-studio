import { requireAdminAuth } from "@/lib/supabase/admin-guard";
import { fetchAdminOrders } from "@/lib/admin/orders/queries";
import { AdminOrdersClientView } from "@/components/admin/admin-orders-client-view";
import type { OrderStatus } from "@/lib/supabase/database.types";
import type { OrderSortOption, PaymentStatusFilter, DateRangePreset } from "@/lib/admin/orders/types";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Print Orders Console · Operations Management",
};

interface AdminOrdersPageProps {
  searchParams: Promise<{
    q?: string;
    status?: string;
    paymentStatus?: string;
    dateRange?: string;
    from?: string;
    to?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
  // 1. Enforce strict server-side Admin Guard
  await requireAdminAuth("/admin/orders");

  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page || "1", 10));
  const pageSize = 50;

  // 2. Query Authoritative PostgreSQL Orders with Safe Parameter Allowlisting
  const { orders, totalCount, error } = await fetchAdminOrders({
    q: params.q,
    status: (params.status || "ALL") as OrderStatus | "ALL",
    paymentStatus: (params.paymentStatus || "ALL") as PaymentStatusFilter,
    dateRange: (params.dateRange || "ALL") as DateRangePreset,
    from: params.from,
    to: params.to,
    sort: (params.sort || "newest") as OrderSortOption,
    page: currentPage,
    pageSize,
  });

  return (
    <div className="space-y-6">
      <AdminOrdersClientView
        initialOrders={orders}
        totalCount={totalCount}
        currentPage={currentPage}
        pageSize={pageSize}
        queryTerm={params.q || ""}
        statusFilter={params.status || "ALL"}
        paymentStatusFilter={(params.paymentStatus || "ALL") as PaymentStatusFilter}
        dateRangeFilter={(params.dateRange || "ALL") as DateRangePreset}
        fromParam={params.from}
        toParam={params.to}
        sortFilter={(params.sort || "newest") as OrderSortOption}
        dbError={error}
      />
    </div>
  );
}
