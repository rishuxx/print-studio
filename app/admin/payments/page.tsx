import { requireAdminAuth } from "@/lib/supabase/admin-guard";
import { fetchAdminPayments, fetchAdminWebhookEvents } from "@/lib/payments/queries";
import { AdminPaymentsClientView } from "@/components/admin/payments/admin-payments-client-view";
import type { PaymentStatus, ReconciliationState, WebhookProcessingStatus } from "@/lib/payments/types";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Payments & Financial Operations · Admin Command Center",
};

interface AdminPaymentsPageProps {
  searchParams: Promise<{
    tab?: string;
    q?: string;
    status?: string;
    reconciliationState?: string;
    dateRange?: string;
    from?: string;
    to?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function AdminPaymentsPage({ searchParams }: AdminPaymentsPageProps) {
  // 1. Strict Server-side Admin Guard
  await requireAdminAuth("/admin/payments");

  const params = await searchParams;
  const activeTab = params.tab || "transactions";
  const currentPage = Math.max(1, parseInt(params.page || "1", 10));
  const pageSize = 50;

  // 2. Fetch Payments Feed & KPIs from PostgreSQL
  const { payments, totalCount, kpis, error } = await fetchAdminPayments({
    q: params.q,
    status: (params.status || "ALL") as PaymentStatus | "ALL",
    reconciliationState: (params.reconciliationState || "ALL") as ReconciliationState | "ALL",
    dateRange: params.dateRange || "ALL",
    from: params.from,
    to: params.to,
    sort: (params.sort || "newest") as "newest" | "oldest" | "highest_amount" | "lowest_amount" | "recently_updated",
    page: currentPage,
    pageSize,
  });

  // 3. Fetch Webhook Events if viewing webhooks tab
  let webhookData = { events: [], totalCount: 0, error: undefined as string | undefined };
  if (activeTab === "webhooks") {
    const res = await fetchAdminWebhookEvents({
      q: params.q,
      status: (params.status || "ALL") as WebhookProcessingStatus | "ALL",
      page: currentPage,
      pageSize,
    });
    webhookData = {
      events: res.events as unknown as typeof webhookData.events,
      totalCount: res.totalCount,
      error: res.error,
    };
  }

  const isTestMode = process.env.RAZORPAY_KEY_ID?.startsWith("rzp_test_") ?? true;

  return (
    <div className="space-y-6">
      <AdminPaymentsClientView
        activeTab={activeTab}
        payments={payments}
        totalCount={totalCount}
        currentPage={currentPage}
        pageSize={pageSize}
        kpis={kpis}
        isTestMode={isTestMode}
        webhookEvents={webhookData.events}
        webhookTotalCount={webhookData.totalCount}
        queryTerm={params.q || ""}
        statusFilter={params.status || "ALL"}
        reconciliationFilter={params.reconciliationState || "ALL"}
        dateRangeFilter={params.dateRange || "ALL"}
        fromParam={params.from}
        toParam={params.to}
        sortFilter={(params.sort || "newest") as "newest" | "oldest" | "highest_amount" | "lowest_amount" | "recently_updated"}
        dbError={error || webhookData.error}
      />
    </div>
  );
}
