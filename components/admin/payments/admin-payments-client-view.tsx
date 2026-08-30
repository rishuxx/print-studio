"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  CreditCard,
  Search,
  RefreshCw,
  ChevronRight,
  ChevronLeft,
  SlidersHorizontal,
  X,
  AlertCircle,
  Activity,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Radio,
} from "lucide-react";
import type { DbPaymentRow } from "@/lib/payments/queries";
import type { PaymentKpiMetrics, PaymentStatus, ReconciliationState } from "@/lib/payments/types";
import { toast } from "sonner";

interface AdminPaymentsClientViewProps {
  activeTab: string;
  payments: DbPaymentRow[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  kpis: PaymentKpiMetrics;
  isTestMode: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  webhookEvents: any[];
  webhookTotalCount: number;
  queryTerm: string;
  statusFilter: string;
  reconciliationFilter: string;
  dateRangeFilter: string;
  fromParam?: string;
  toParam?: string;
  sortFilter: string;
  dbError?: string;
}

const PAYMENT_STATUS_OPTIONS: Array<{ value: PaymentStatus | "ALL"; label: string }> = [
  { value: "ALL", label: "All Payment States" },
  { value: "captured", label: "Captured / Paid" },
  { value: "pending", label: "Pending" },
  { value: "authorized", label: "Authorized" },
  { value: "failed", label: "Failed" },
  { value: "partially_refunded", label: "Partially Refunded" },
  { value: "refunded", label: "Fully Refunded" },
];

const RECON_STATE_OPTIONS: Array<{ value: ReconciliationState | "ALL"; label: string }> = [
  { value: "ALL", label: "All Reconciliation" },
  { value: "reconciled", label: "Reconciled" },
  { value: "reconciliation_required", label: "Attention Required" },
  { value: "amount_mismatch", label: "Amount Mismatch" },
  { value: "signature_failed", label: "Signature Failed" },
  { value: "webhook_pending", label: "Webhook Pending" },
];

const DATE_PRESET_OPTIONS = [
  { value: "ALL", label: "All Time" },
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "7d", label: "Last 7 Days" },
  { value: "30d", label: "Last 30 Days" },
  { value: "this_month", label: "This Month" },
  { value: "last_month", label: "Last Month" },
  { value: "this_year", label: "This Year" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "highest_amount", label: "Highest Amount" },
  { value: "lowest_amount", label: "Lowest Amount" },
  { value: "recently_updated", label: "Recently Updated" },
];

export function AdminPaymentsClientView({
  activeTab,
  payments,
  totalCount,
  currentPage,
  pageSize,
  kpis,
  isTestMode,
  webhookEvents,
  webhookTotalCount,
  queryTerm,
  statusFilter,
  reconciliationFilter,
  dateRangeFilter,
  sortFilter,
  dbError,
}: AdminPaymentsClientViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = React.useState(queryTerm);
  const [prevQueryTerm, setPrevQueryTerm] = React.useState(queryTerm);
  const [isSearching, setIsSearching] = React.useState(false);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = React.useState(false);

  // Sync state if queryTerm prop changes without using useEffect
  if (queryTerm !== prevQueryTerm) {
    setPrevQueryTerm(queryTerm);
    setSearchTerm(queryTerm);
  }

  const updateFilters = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, val]) => {
      if (val === null || val === "" || val === "ALL") {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    });

    if (!newParams.page) {
      params.delete("page");
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    updateFilters({ q: searchTerm.trim() });
    setIsSearching(false);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => setIsRefreshing(false), 500);
    toast.success("Financial feed refreshed from PostgreSQL.");
  };

  const hasActiveFilters = Boolean(
    queryTerm ||
    statusFilter !== "ALL" ||
    reconciliationFilter !== "ALL" ||
    dateRangeFilter !== "ALL" ||
    sortFilter !== "newest"
  );

  const clearAllFilters = () => {
    setSearchTerm("");
    const params = new URLSearchParams();
    if (activeTab !== "transactions") params.set("tab", activeTab);
    router.push(`${pathname}?${params.toString()}`);
  };

  const totalPages = Math.ceil(
    (activeTab === "webhooks" ? webhookTotalCount : totalCount) / pageSize
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-violet/10 px-2.5 py-0.5 text-[0.625rem] font-bold font-mono text-violet uppercase">
              Financial Operations
            </span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-[0.625rem] font-bold font-mono uppercase ${
                isTestMode
                  ? "bg-amber-100 text-amber-800 border border-amber-300"
                  : "bg-emerald-100 text-emerald-800"
              }`}
            >
              {isTestMode ? "Razorpay Test Mode" : "Live Production"}
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-ink">
            Payments & Gateway Reconciliation
          </h1>
          <p className="text-xs text-muted-foreground sm:text-sm">
            Live Razorpay gateway settlements, webhook idempotency audit, and payment refund operations.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-white px-3.5 py-2 text-xs font-bold text-ink hover:bg-paper transition-all disabled:opacity-50"
          >
            <RefreshCw className={`size-3.5 text-muted-foreground ${isRefreshing ? "animate-spin" : ""}`} />
            <span>{isRefreshing ? "Refreshing..." : "Refresh Feed"}</span>
          </button>
        </div>
      </div>

      {dbError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="size-4 shrink-0" />
          <span>Financial query error: {dbError}</span>
        </div>
      )}

      {/* Financial KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Gross Captured Volume */}
        <div className="rounded-2xl border border-border bg-white p-4 sm:p-5 shadow-xs space-y-1.5">
          <span className="text-[0.6875rem] font-bold uppercase font-mono text-muted-foreground block">
            Gross Captured Volume
          </span>
          <div className="font-display text-xl sm:text-2xl font-extrabold text-ink">
            ₹{(kpis.capturedVolumeMinor / 100).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[0.6875rem] font-mono text-muted-foreground">
            {kpis.capturedCount} captured transaction{kpis.capturedCount === 1 ? "" : "s"}
          </span>
        </div>

        {/* Net Collected Volume */}
        <div className="rounded-2xl border border-border bg-white p-4 sm:p-5 shadow-xs space-y-1.5">
          <span className="text-[0.6875rem] font-bold uppercase font-mono text-muted-foreground block">
            Net Collected (Post-Refunds)
          </span>
          <div className="font-display text-xl sm:text-2xl font-extrabold text-emerald-700">
            ₹{(kpis.netVolumeMinor / 100).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[0.6875rem] font-mono text-muted-foreground">
            {kpis.successRatePercentage}% gateway success rate
          </span>
        </div>

        {/* Refunded Amount */}
        <div className="rounded-2xl border border-border bg-white p-4 sm:p-5 shadow-xs space-y-1.5">
          <span className="text-[0.6875rem] font-bold uppercase font-mono text-muted-foreground block">
            Total Refunded
          </span>
          <div className="font-display text-xl sm:text-2xl font-extrabold text-amber-700">
            ₹{(kpis.refundedVolumeMinor / 100).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[0.6875rem] font-mono text-muted-foreground">
            {kpis.refundedCount} refund action{kpis.refundedCount === 1 ? "" : "s"}
          </span>
        </div>

        {/* Requiring Attention */}
        <div className="rounded-2xl border border-border bg-white p-4 sm:p-5 shadow-xs space-y-1.5">
          <span className="text-[0.6875rem] font-bold uppercase font-mono text-muted-foreground block">
            Reconciliation Attention
          </span>
          <div className={`font-display text-xl sm:text-2xl font-extrabold ${kpis.attentionCount > 0 ? "text-red-600" : "text-ink"}`}>
            {kpis.attentionCount} issue{kpis.attentionCount === 1 ? "" : "s"}
          </div>
          <span className="text-[0.6875rem] font-mono text-muted-foreground">
            {kpis.pendingCount} pending / {kpis.failedCount} failed
          </span>
        </div>
      </div>

      {/* Tabs: Transactions vs Webhook Audit vs Reconciliation Center */}
      <div className="flex items-center gap-2 border-b border-border pb-2 text-xs">
        <button
          type="button"
          onClick={() => updateFilters({ tab: "transactions" })}
          className={`inline-flex items-center gap-1.5 px-4 py-2 font-bold rounded-xl transition-all ${
            activeTab === "transactions"
              ? "bg-violet text-white shadow-xs"
              : "bg-paper text-muted-foreground hover:text-ink"
          }`}
        >
          <CreditCard className="size-3.5" />
          <span>Transactions Feed ({totalCount})</span>
        </button>

        <button
          type="button"
          onClick={() => updateFilters({ tab: "reconciliation" })}
          className={`inline-flex items-center gap-1.5 px-4 py-2 font-bold rounded-xl transition-all ${
            activeTab === "reconciliation"
              ? "bg-violet text-white shadow-xs"
              : "bg-paper text-muted-foreground hover:text-ink"
          }`}
        >
          <Activity className="size-3.5" />
          <span>Reconciliation Center</span>
          {kpis.attentionCount > 0 && (
            <span className="size-2 rounded-full bg-red-500 animate-pulse ml-1" />
          )}
        </button>

        <button
          type="button"
          onClick={() => updateFilters({ tab: "webhooks" })}
          className={`inline-flex items-center gap-1.5 px-4 py-2 font-bold rounded-xl transition-all ${
            activeTab === "webhooks"
              ? "bg-violet text-white shadow-xs"
              : "bg-paper text-muted-foreground hover:text-ink"
          }`}
        >
          <Radio className="size-3.5" />
          <span>Webhook Audit ({webhookTotalCount || 0})</span>
        </button>
      </div>

      {/* TAB 1: TRANSACTIONS FEED */}
      {activeTab === "transactions" && (
        <div className="space-y-4">
          {/* Primary Toolbar: Search + Quick Dropdowns */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-border shadow-xs">
            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-lg">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search pay_xxx, order_xxx, or receipt"
                className="w-full rounded-xl border border-border bg-paper/60 pl-10 pr-20 py-2 text-xs text-ink placeholder:text-muted-foreground focus:bg-white focus:border-violet focus:outline-none focus:ring-1 focus:ring-violet"
              />
              <button
                type="submit"
                disabled={isSearching}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg bg-ink px-3 py-1 text-[0.6875rem] font-bold text-white hover:bg-ink/90 transition-all disabled:opacity-50"
              >
                Search
              </button>
            </form>

            {/* Desktop Filters */}
            <div className="hidden lg:flex items-center gap-2 text-xs">
              <select
                value={statusFilter}
                onChange={(e) => updateFilters({ status: e.target.value })}
                className="rounded-xl border border-border bg-white px-3 py-2 text-xs font-semibold text-ink focus:border-violet focus:outline-none"
              >
                {PAYMENT_STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>

              <select
                value={reconciliationFilter}
                onChange={(e) => updateFilters({ reconciliationState: e.target.value })}
                className="rounded-xl border border-border bg-white px-3 py-2 text-xs font-semibold text-ink focus:border-violet focus:outline-none"
              >
                {RECON_STATE_OPTIONS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>

              <select
                value={dateRangeFilter}
                onChange={(e) => updateFilters({ dateRange: e.target.value })}
                className="rounded-xl border border-border bg-white px-3 py-2 text-xs font-semibold text-ink focus:border-violet focus:outline-none"
              >
                {DATE_PRESET_OPTIONS.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>

              <select
                value={sortFilter}
                onChange={(e) => updateFilters({ sort: e.target.value })}
                className="rounded-xl border border-border bg-white px-3 py-2 text-xs font-semibold text-ink focus:border-violet focus:outline-none"
              >
                {SORT_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="inline-flex items-center gap-1 rounded-xl border border-border bg-paper px-3 py-2 text-xs font-bold text-muted-foreground hover:text-red-600 transition-colors"
                >
                  <X className="size-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* Mobile Filter Sheet Toggle */}
            <div className="flex lg:hidden items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setMobileFilterOpen(true)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-paper py-2 px-3 text-xs font-bold text-ink hover:bg-border/60 transition-colors"
              >
                <SlidersHorizontal className="size-3.5 text-violet" />
                <span>Filters & Sorting</span>
                {hasActiveFilters && (
                  <span className="size-2 rounded-full bg-violet animate-pulse ml-1" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Filter Modal */}
          {mobileFilterOpen && (
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
              <div className="w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl p-6 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="font-bold text-sm text-ink flex items-center gap-2">
                    <SlidersHorizontal className="size-4 text-violet" />
                    <span>Filter & Sort Payments</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMobileFilterOpen(false)}
                    className="text-muted-foreground hover:text-ink"
                  >
                    <X className="size-4" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-ink uppercase font-mono text-[0.6875rem]">Payment State</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => updateFilters({ status: e.target.value })}
                      className="w-full rounded-xl border border-border bg-white px-3 py-2 text-xs font-semibold text-ink"
                    >
                      {PAYMENT_STATUS_OPTIONS.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-ink uppercase font-mono text-[0.6875rem]">Reconciliation State</label>
                    <select
                      value={reconciliationFilter}
                      onChange={(e) => updateFilters({ reconciliationState: e.target.value })}
                      className="w-full rounded-xl border border-border bg-white px-3 py-2 text-xs font-semibold text-ink"
                    >
                      {RECON_STATE_OPTIONS.map((r) => (
                        <option key={r.value} value={r.value}>{r.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-ink uppercase font-mono text-[0.6875rem]">Timeframe</label>
                    <select
                      value={dateRangeFilter}
                      onChange={(e) => updateFilters({ dateRange: e.target.value })}
                      className="w-full rounded-xl border border-border bg-white px-3 py-2 text-xs font-semibold text-ink"
                    >
                      {DATE_PRESET_OPTIONS.map((d) => (
                        <option key={d.value} value={d.value}>{d.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-ink uppercase font-mono text-[0.6875rem]">Sort By</label>
                    <select
                      value={sortFilter}
                      onChange={(e) => updateFilters({ sort: e.target.value })}
                      className="w-full rounded-xl border border-border bg-white px-3 py-2 text-xs font-semibold text-ink"
                    >
                      {SORT_OPTIONS.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                  <button
                    type="button"
                    onClick={() => {
                      clearAllFilters();
                      setMobileFilterOpen(false);
                    }}
                    className="rounded-xl border border-border px-3.5 py-2 font-bold text-muted-foreground hover:bg-paper text-xs"
                  >
                    Reset All
                  </button>
                  <button
                    type="button"
                    onClick={() => setMobileFilterOpen(false)}
                    className="rounded-xl bg-violet px-5 py-2 font-bold text-white shadow-lift hover:bg-violet-lift text-xs"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Payments Table */}
          {payments.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-white p-12 text-center space-y-3">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-paper text-muted-foreground">
                <Layers className="size-6 text-violet" />
              </div>
              <div className="font-display text-base font-bold text-ink">No payment records found</div>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                {hasActiveFilters
                  ? "Try adjusting your search criteria or payment filters."
                  : "No payment transactions have been recorded in PostgreSQL yet."}
              </p>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="inline-flex items-center gap-1 text-xs font-bold text-violet hover:underline pt-2"
                >
                  Clear all active filters
                </button>
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-white shadow-sm overflow-hidden text-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-paper/60 font-mono uppercase text-muted-foreground text-[0.6875rem]">
                      <th className="py-3.5 px-4 font-bold">Transaction / Provider ID</th>
                      <th className="py-3.5 px-4 font-bold">Order Reference</th>
                      <th className="py-3.5 px-4 font-bold">Amount & Currency</th>
                      <th className="py-3.5 px-4 font-bold">Gateway Status</th>
                      <th className="py-3.5 px-4 font-bold">Reconciliation</th>
                      <th className="py-3.5 px-4 font-bold">Timestamp</th>
                      <th className="py-3.5 px-4 text-right font-bold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {payments.map((p) => {
                      const amountFormatted = (Number(p.amount_minor || p.amount || 0) / 100).toFixed(2);
                      const refundedFormatted = p.amount_refunded_minor > 0 ? (Number(p.amount_refunded_minor) / 100).toFixed(2) : null;
                      const orderRef = p.orders?.order_number || "—";
                      const customer = (p.orders?.customer_snapshot as { fullName?: string }) || {};

                      return (
                        <tr key={p.id} className="hover:bg-paper/40 transition-colors">
                          {/* Transaction ID */}
                          <td className="py-3.5 px-4">
                            <Link
                              href={`/admin/payments/${p.id}`}
                              className="font-bold text-ink hover:text-violet transition-colors font-mono"
                            >
                              {p.provider_payment_id || "Awaiting Gateway"}
                            </Link>
                            <div className="text-[0.6875rem] text-muted-foreground font-mono truncate max-w-40">
                              Order: {p.provider_order_id}
                            </div>
                          </td>

                          {/* Order Reference */}
                          <td className="py-3.5 px-4">
                            {p.orders ? (
                              <Link
                                href={`/admin/orders/${encodeURIComponent(orderRef)}`}
                                className="font-bold text-ink hover:text-violet transition-colors"
                              >
                                {orderRef}
                              </Link>
                            ) : (
                              <span className="text-muted-foreground">Orphaned / Test</span>
                            )}
                            <div className="text-[0.6875rem] text-muted-foreground truncate max-w-36">
                              {customer.fullName || "Customer"}
                            </div>
                          </td>

                          {/* Amount */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="font-display font-bold text-ink">₹{amountFormatted}</div>
                            {refundedFormatted && (
                              <span className="text-[0.625rem] text-amber-700 font-mono font-bold block">
                                Refunded: ₹{refundedFormatted}
                              </span>
                            )}
                          </td>

                          {/* Gateway Status */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span
                              className={`inline-block rounded-full px-2.5 py-0.5 text-[0.625rem] font-bold font-mono uppercase ${
                                p.status === "captured"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : p.status === "failed"
                                  ? "bg-red-100 text-red-700"
                                  : p.status === "refunded"
                                  ? "bg-amber-100 text-amber-800"
                                  : p.status === "partially_refunded"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {p.status.replace(/_/g, " ")}
                            </span>
                          </td>

                          {/* Reconciliation State */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            {p.reconciliation_state === "reconciled" ? (
                              <span className="inline-flex items-center gap-1 text-[0.6875rem] text-emerald-700 font-bold">
                                <CheckCircle2 className="size-3" />
                                <span>Reconciled</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[0.6875rem] text-red-600 font-bold">
                                <AlertTriangle className="size-3" />
                                <span>{p.reconciliation_state.replace(/_/g, " ")}</span>
                              </span>
                            )}
                          </td>

                          {/* Timestamp */}
                          <td className="py-3.5 px-4 font-mono text-muted-foreground text-[0.6875rem] whitespace-nowrap">
                            {new Date(p.created_at).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </td>

                          {/* Action */}
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <Link
                              href={`/admin/payments/${p.id}`}
                              className="inline-flex items-center gap-1 rounded-xl bg-violet px-3 py-1.5 text-xs font-bold text-white shadow-lift hover:bg-violet-lift transition-all"
                            >
                              <span>Inspect</span>
                              <ChevronRight className="size-3" />
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-paper/30 text-xs">
                  <div className="text-muted-foreground">
                    Showing page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> ({totalCount} total records)
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={currentPage <= 1}
                      onClick={() => updateFilters({ page: (currentPage - 1).toString() })}
                      className="inline-flex items-center gap-1 rounded-lg border border-border bg-white px-3 py-1.5 font-bold text-ink hover:bg-paper disabled:opacity-40 transition-all"
                    >
                      <ChevronLeft className="size-3.5" />
                      <span>Previous</span>
                    </button>
                    <button
                      type="button"
                      disabled={currentPage >= totalPages}
                      onClick={() => updateFilters({ page: (currentPage + 1).toString() })}
                      className="inline-flex items-center gap-1 rounded-lg border border-border bg-white px-3 py-1.5 font-bold text-ink hover:bg-paper disabled:opacity-40 transition-all"
                    >
                      <span>Next</span>
                      <ChevronRight className="size-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: RECONCILIATION CENTER */}
      {activeTab === "reconciliation" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-violet/20 bg-violet/5 p-4 sm:p-5 text-xs text-muted-foreground space-y-1">
            <h3 className="font-bold text-sm text-ink flex items-center gap-2">
              <Activity className="size-4 text-violet" />
              <span>Automated Gateway Audit & Discrepancy Detector</span>
            </h3>
            <p>
              This console cross-verifies internal order totals, Razorpay gateway settlement amounts, and webhook capture timestamps to guarantee zero financial leakage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="rounded-2xl border border-border bg-white p-5 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-ink">Amount Mismatches</span>
                <span className="rounded bg-red-100 text-red-700 px-2 py-0.5 font-mono font-bold text-[0.6875rem]">
                  {payments.filter((p) => p.reconciliation_state === "amount_mismatch").length}
                </span>
              </div>
              <p className="text-muted-foreground text-[0.6875rem]">
                Transactions where internal order totals differed from gateway settled amounts.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-white p-5 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-ink">Missing Webhook Confirmations</span>
                <span className="rounded bg-amber-100 text-amber-800 px-2 py-0.5 font-mono font-bold text-[0.6875rem]">
                  {payments.filter((p) => !p.webhook_confirmed && p.status === "captured").length}
                </span>
              </div>
              <p className="text-muted-foreground text-[0.6875rem]">
                Payments verified via browser callback but pending asynchronous webhook persistence.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-white p-5 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-ink">Reconciliation Clean</span>
                <span className="rounded bg-emerald-100 text-emerald-800 px-2 py-0.5 font-mono font-bold text-[0.6875rem]">
                  {payments.filter((p) => p.reconciliation_state === "reconciled").length}
                </span>
              </div>
              <p className="text-muted-foreground text-[0.6875rem]">
                Verified 100% matched transactions across internal database and Razorpay servers.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: WEBHOOK AUDIT */}
      {activeTab === "webhooks" && (
        <div className="space-y-4 text-xs">
          <div className="rounded-2xl border border-border bg-white p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-sm text-ink flex items-center gap-2">
                <Radio className="size-4 text-violet" />
                <span>Idempotent Webhook Receiver Stream</span>
              </h3>
              <p className="text-muted-foreground text-xs mt-0.5">
                Every event delivered by Razorpay webhooks is verified via HMAC-SHA256 and persisted for audit.
              </p>
            </div>

            <span className="rounded-xl border border-border bg-paper px-3 py-1.5 font-mono font-bold text-[0.6875rem] text-muted-foreground">
              /api/webhooks/razorpay
            </span>
          </div>

          {webhookEvents.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-white p-12 text-center space-y-2">
              <div className="font-bold text-sm text-ink">No webhook events logged yet</div>
              <p className="text-muted-foreground text-xs">
                As checkout payments complete on Razorpay, webhook event deliveries will appear in this real-time stream.
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-white shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-paper/60 font-mono uppercase text-muted-foreground text-[0.6875rem]">
                      <th className="py-3.5 px-4 font-bold">Event ID</th>
                      <th className="py-3.5 px-4 font-bold">Event Type</th>
                      <th className="py-3.5 px-4 font-bold">Provider</th>
                      <th className="py-3.5 px-4 font-bold">Processing Status</th>
                      <th className="py-3.5 px-4 font-bold">Received At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {webhookEvents.map((evt) => (
                      <tr key={evt.id} className="hover:bg-paper/40 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-ink">{evt.event_id}</td>
                        <td className="py-3.5 px-4 font-mono text-violet font-semibold">{evt.event_type}</td>
                        <td className="py-3.5 px-4 uppercase font-mono text-muted-foreground">{evt.provider}</td>
                        <td className="py-3.5 px-4">
                          <span className="rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-[0.625rem] font-bold font-mono uppercase">
                            {evt.processing_status || "Processed"}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-muted-foreground text-[0.6875rem]">
                          {new Date(evt.created_at).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
