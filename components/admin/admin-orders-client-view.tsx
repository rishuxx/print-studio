"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Search,
  Filter,
  ChevronRight,
  AlertCircle,
  RefreshCw,
  SlidersHorizontal,
  X,
  Calendar,
  CreditCard,
  ArrowUpDown,
  CheckSquare,
  Square,
  Layers,
  ChevronLeft,
  ChevronDown,
} from "lucide-react";
import type { Database, OrderStatus } from "@/lib/supabase/database.types";
import { ORDER_STATUS_METADATA } from "@/lib/orders/lifecycle";
import type {
  OrderSortOption,
  PaymentStatusFilter,
  DateRangePreset,
  BulkOperationResponse,
} from "@/lib/admin/orders/types";
import { bulkUpdateOrdersStatus } from "@/lib/supabase/actions";
import { toast } from "sonner";

type DbOrderWithItems = Database["public"]["Tables"]["orders"]["Row"] & {
  order_items?: Database["public"]["Tables"]["order_items"]["Row"][];
};

interface AdminOrdersClientViewProps {
  initialOrders: DbOrderWithItems[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  queryTerm: string;
  statusFilter: string;
  paymentStatusFilter: PaymentStatusFilter;
  dateRangeFilter: DateRangePreset;
  fromParam?: string;
  toParam?: string;
  sortFilter: OrderSortOption;
  dbError?: string;
}

const ALL_STATUSES: Array<"ALL" | OrderStatus> = [
  "ALL",
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

const PAYMENT_STATUSES: Array<{ value: PaymentStatusFilter; label: string }> = [
  { value: "ALL", label: "All Payments" },
  { value: "paid", label: "Paid / Captured" },
  { value: "pending", label: "Payment Pending" },
  { value: "failed", label: "Failed" },
  { value: "refunded", label: "Refunded" },
];

const DATE_PRESETS: Array<{ value: DateRangePreset; label: string }> = [
  { value: "ALL", label: "All Time" },
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "last_7_days", label: "Last 7 Days" },
  { value: "last_30_days", label: "Last 30 Days" },
  { value: "this_month", label: "This Month" },
  { value: "last_month", label: "Last Month" },
  { value: "this_year", label: "This Year" },
];

const SORT_OPTIONS: Array<{ value: OrderSortOption; label: string }> = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "highest_value", label: "Highest Amount" },
  { value: "lowest_value", label: "Lowest Amount" },
  { value: "recently_updated", label: "Recently Updated" },
];

export function AdminOrdersClientView({
  initialOrders,
  totalCount,
  currentPage,
  pageSize,
  queryTerm,
  statusFilter,
  paymentStatusFilter,
  dateRangeFilter,
  sortFilter,
  dbError,
}: AdminOrdersClientViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = React.useState(queryTerm);
  const [prevQueryTerm, setPrevQueryTerm] = React.useState(queryTerm);
  const [isSearching, setIsSearching] = React.useState(false);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = React.useState(false);

  // Bulk Selection State
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [bulkTargetStatus, setBulkTargetStatus] = React.useState<OrderStatus | "">("");
  const [isBulkExecuting, setIsBulkExecuting] = React.useState(false);
  const [bulkResultModal, setBulkResultModal] = React.useState<BulkOperationResponse | null>(null);

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

    // Reset pagination to page 1 unless page was explicitly set
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
    toast.success("Feed refreshed from PostgreSQL.");
  };

  const hasActiveFilters = Boolean(
    queryTerm ||
    statusFilter !== "ALL" ||
    paymentStatusFilter !== "ALL" ||
    dateRangeFilter !== "ALL" ||
    sortFilter !== "newest"
  );

  const clearAllFilters = () => {
    setSearchTerm("");
    router.push(pathname);
  };

  // Selection handlers
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllOnPage = () => {
    if (selectedIds.length === initialOrders.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(initialOrders.map((o) => o.id));
    }
  };

  const handleExecuteBulkAction = async () => {
    if (selectedIds.length === 0 || !bulkTargetStatus) {
      toast.error("Please select orders and a target milestone.");
      return;
    }

    const targetMeta = ORDER_STATUS_METADATA[bulkTargetStatus];
    if (
      !confirm(
        `Are you sure you want to transition ${selectedIds.length} selected orders to "${targetMeta?.label || bulkTargetStatus}"?\n\nEach order will be validated against lifecycle rules.`
      )
    ) {
      return;
    }

    setIsBulkExecuting(true);
    try {
      const res = await bulkUpdateOrdersStatus(selectedIds, bulkTargetStatus);
      setBulkResultModal(res);
      setSelectedIds([]);
      setBulkTargetStatus("");
      router.refresh();

      if (res.failedCount === 0) {
        toast.success(`Successfully updated all ${res.successCount} orders!`);
      } else if (res.successCount > 0) {
        toast.warning(`Updated ${res.successCount} orders, ${res.failedCount} skipped or rejected.`);
      } else {
        toast.error(`All ${res.failedCount} orders failed validation for this status transition.`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Bulk update failed.";
      toast.error(msg);
    } finally {
      setIsBulkExecuting(false);
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-violet/10 px-2.5 py-0.5 text-[0.625rem] font-bold font-mono text-violet uppercase">
              Production Order Management
            </span>
            <span className="text-[0.6875rem] text-muted-foreground font-mono">
              PostgreSQL Direct
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-ink">
            Orders Console ({totalCount})
          </h1>
          <p className="text-xs text-muted-foreground sm:text-sm">
            Live press queue, digital proof approvals, pre-press routing, and fulfillment milestone dispatcher.
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
          <span>Database query error: {dbError}</span>
        </div>
      )}

      {/* Primary Toolbar: Search + Quick Dropdowns + Mobile Filter Toggle */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-border shadow-xs">
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-lg">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search PRT-..., INV-..., customer name, email, or phone"
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

        {/* Desktop Filter Dropdowns */}
        <div className="hidden lg:flex items-center gap-2 text-xs">
          {/* Payment Status Dropdown */}
          <div className="relative">
            <select
              value={paymentStatusFilter}
              onChange={(e) => updateFilters({ paymentStatus: e.target.value })}
              className="appearance-none rounded-xl border border-border bg-white pl-3 pr-8 py-2 text-xs font-semibold text-ink hover:bg-paper focus:border-violet focus:outline-none"
            >
              {PAYMENT_STATUSES.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
          </div>

          {/* Date Range Dropdown */}
          <div className="relative">
            <select
              value={dateRangeFilter}
              onChange={(e) => updateFilters({ dateRange: e.target.value })}
              className="appearance-none rounded-xl border border-border bg-white pl-3 pr-8 py-2 text-xs font-semibold text-ink hover:bg-paper focus:border-violet focus:outline-none"
            >
              {DATE_PRESETS.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortFilter}
              onChange={(e) => updateFilters({ sort: e.target.value })}
              className="appearance-none rounded-xl border border-border bg-white pl-3 pr-8 py-2 text-xs font-semibold text-ink hover:bg-paper focus:border-violet focus:outline-none"
            >
              {SORT_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
          </div>

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

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="rounded-xl border border-border bg-paper p-2 text-xs font-bold text-muted-foreground hover:text-red-600 transition-colors"
              title="Reset Filters"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </div>

      {/* Horizontal Status Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        <div className="flex items-center gap-1 text-muted-foreground shrink-0 pr-1">
          <Filter className="size-3 text-violet" />
          <span className="font-mono text-[0.6875rem] font-bold uppercase">Milestone:</span>
        </div>
        {ALL_STATUSES.map((st) => {
          const isSelected = statusFilter === st;
          const label = st === "ALL" ? "All Orders" : ORDER_STATUS_METADATA[st]?.label || st;
          return (
            <button
              key={st}
              type="button"
              onClick={() => updateFilters({ status: st })}
              className={`rounded-lg px-2.5 py-1.5 font-bold whitespace-nowrap transition-all text-xs ${
                isSelected
                  ? "bg-violet text-white shadow-xs"
                  : "bg-white border border-border text-muted-foreground hover:text-ink hover:bg-paper"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Bulk Action Bar (Visible when orders are selected) */}
      {selectedIds.length > 0 && (
        <div className="rounded-2xl border-2 border-violet/40 bg-violet/5 p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in zoom-in-95 duration-150 text-xs">
          <div className="flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-full bg-violet text-white font-bold text-[0.6875rem]">
              {selectedIds.length}
            </span>
            <span className="font-bold text-ink">
              {selectedIds.length === 1 ? "1 order selected" : `${selectedIds.length} orders selected`}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <select
              value={bulkTargetStatus}
              onChange={(e) => setBulkTargetStatus(e.target.value as OrderStatus)}
              disabled={isBulkExecuting}
              className="rounded-xl border border-border bg-white px-3 py-1.5 text-xs font-semibold text-ink focus:border-violet focus:outline-none flex-1 sm:flex-none"
            >
              <option value="">-- Apply Milestone Transition --</option>
              {ALL_STATUSES.filter((s) => s !== "ALL").map((st) => (
                <option key={st} value={st}>
                  → {ORDER_STATUS_METADATA[st as OrderStatus]?.label || st}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={handleExecuteBulkAction}
              disabled={!bulkTargetStatus || isBulkExecuting}
              className="rounded-xl bg-violet px-4 py-1.5 font-bold text-white shadow-lift hover:bg-violet-lift transition-all disabled:opacity-50"
            >
              {isBulkExecuting ? "Validating & Advancing..." : "Apply Bulk Milestone"}
            </button>

            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="rounded-xl border border-border bg-white px-3 py-1.5 font-semibold text-muted-foreground hover:text-ink transition-colors"
            >
              Deselect
            </button>
          </div>
        </div>
      )}

      {/* Orders Table (Desktop) / Cards (Mobile) */}
      {initialOrders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-white p-12 text-center space-y-3">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-paper text-muted-foreground">
            <Layers className="size-6 text-violet" />
          </div>
          <div className="font-display text-base font-bold text-ink">No matching orders found</div>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            {hasActiveFilters
              ? "Try adjusting your search criteria, milestone, date range, or payment filters."
              : "No orders have been placed in PostgreSQL yet."}
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
        <div className="space-y-4">
          {/* Mobile Order Cards (< 768px) */}
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {initialOrders.map((ord) => {
              const customer = (ord.customer_snapshot as { fullName?: string; email?: string }) || {};
              const delivery = (ord.delivery_snapshot as { city?: string; state?: string }) || {};
              const statusMeta = ORDER_STATUS_METADATA[ord.status as OrderStatus];
              const isSelected = selectedIds.includes(ord.id);

              return (
                <div
                  key={ord.id}
                  className={`rounded-2xl border bg-white p-4 shadow-sm space-y-3 transition-colors ${
                    isSelected ? "border-violet bg-violet/5" : "border-border"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleSelect(ord.id)}
                        className="text-muted-foreground hover:text-violet"
                      >
                        {isSelected ? (
                          <CheckSquare className="size-4 text-violet" />
                        ) : (
                          <Square className="size-4" />
                        )}
                      </button>
                      <div>
                        <div className="font-bold text-ink text-sm">{ord.order_number}</div>
                        <div className="text-[0.6875rem] text-muted-foreground font-mono">
                          {new Date(ord.created_at).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>

                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-[0.625rem] font-bold font-mono uppercase ${
                        statusMeta?.badgeClass || "bg-violet/10 text-violet"
                      }`}
                    >
                      {statusMeta?.label || ord.status.replace(/_/g, " ")}
                    </span>
                  </div>

                  <div className="text-xs space-y-0.5 text-muted-foreground border-t border-b border-border/60 py-2">
                    <div className="font-semibold text-ink">{customer.fullName || "Customer"}</div>
                    <div className="truncate">{customer.email}</div>
                    <div className="font-medium text-ink">
                      {delivery.city || "—"}{delivery.state ? `, ${delivery.state}` : ""}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <div className="font-display font-bold text-base text-ink">₹{ord.total}</div>
                      <span className="font-mono text-[0.625rem] uppercase font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                        {ord.payment_status}
                      </span>
                    </div>

                    <Link
                      href={`/admin/orders/${encodeURIComponent(ord.order_number)}`}
                      className="inline-flex items-center gap-1 rounded-xl bg-violet px-3.5 py-2 text-xs font-bold text-white shadow-lift hover:bg-violet-lift transition-all"
                    >
                      <span>Manage Order</span>
                      <ChevronRight className="size-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop Table (>= 768px) */}
          <div className="hidden md:block rounded-2xl border border-border bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border bg-paper/60 font-mono uppercase text-muted-foreground text-[0.6875rem]">
                    <th className="py-3.5 px-3 text-center w-10">
                      <button
                        type="button"
                        onClick={handleSelectAllOnPage}
                        className="text-muted-foreground hover:text-violet"
                        title="Select All On Page"
                      >
                        {selectedIds.length === initialOrders.length && initialOrders.length > 0 ? (
                          <CheckSquare className="size-4 text-violet" />
                        ) : (
                          <Square className="size-4" />
                        )}
                      </button>
                    </th>
                    <th className="py-3.5 px-4 font-bold">Order / Invoice</th>
                    <th className="py-3.5 px-4 font-bold">Customer & Shipping</th>
                    <th className="py-3.5 px-4 font-bold">Date Placed</th>
                    <th className="py-3.5 px-4 font-bold">Total / Payment</th>
                    <th className="py-3.5 px-4 font-bold">Press Status</th>
                    <th className="py-3.5 px-4 text-right font-bold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {initialOrders.map((ord) => {
                    const customer = (ord.customer_snapshot as {
                      fullName?: string;
                      email?: string;
                      phone?: string;
                    }) || {};
                    const delivery = (ord.delivery_snapshot as { city?: string; state?: string }) || {};
                    const itemsCount = ord.order_items?.length || 0;
                    const statusMeta = ORDER_STATUS_METADATA[ord.status as OrderStatus];
                    const isSelected = selectedIds.includes(ord.id);
                    const formattedDate = new Date(ord.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    });

                    return (
                      <tr
                        key={ord.id}
                        className={`transition-colors ${
                          isSelected ? "bg-violet/5 hover:bg-violet/10" : "hover:bg-paper/40"
                        }`}
                      >
                        {/* Select Checkbox */}
                        <td className="py-3.5 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleSelect(ord.id)}
                            className="text-muted-foreground hover:text-violet"
                          >
                            {isSelected ? (
                              <CheckSquare className="size-4 text-violet" />
                            ) : (
                              <Square className="size-4" />
                            )}
                          </button>
                        </td>

                        {/* Order / Invoice */}
                        <td className="py-3.5 px-4">
                          <Link
                            href={`/admin/orders/${encodeURIComponent(ord.order_number)}`}
                            className="font-bold text-ink hover:text-violet transition-colors text-sm"
                          >
                            {ord.order_number}
                          </Link>
                          <div className="font-mono text-[0.6875rem] text-muted-foreground">
                            {ord.invoice_number || "—"}
                          </div>
                          <div className="text-[0.6875rem] text-muted-foreground mt-0.5 font-mono">
                            {itemsCount} {itemsCount === 1 ? "line item" : "line items"}
                          </div>
                        </td>

                        {/* Customer & Shipping */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-ink">{customer.fullName || "Customer"}</div>
                          <div className="text-muted-foreground text-[0.6875rem] truncate max-w-48">
                            {customer.email}
                          </div>
                          <div className="text-muted-foreground text-[0.6875rem] font-medium mt-0.5">
                            {delivery.city || "—"}{delivery.state ? `, ${delivery.state}` : ""}
                          </div>
                        </td>

                        {/* Date */}
                        <td className="py-3.5 px-4 font-mono text-muted-foreground text-[0.6875rem] whitespace-nowrap">
                          {formattedDate}
                        </td>

                        {/* Total / Payment */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="font-display font-bold text-sm text-ink">₹{ord.total}</div>
                          <div className="inline-flex items-center gap-1 mt-0.5 font-mono text-[0.625rem] uppercase font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                            <span>{ord.payment_status}</span>
                            {ord.payment_method && <span>({ord.payment_method})</span>}
                          </div>
                        </td>

                        {/* Press Status */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span
                            className={`inline-block rounded-full px-2.5 py-0.5 text-[0.625rem] font-bold font-mono uppercase ${
                              statusMeta?.badgeClass || "bg-violet/10 text-violet"
                            }`}
                          >
                            {statusMeta?.label || ord.status.replace(/_/g, " ")}
                          </span>
                        </td>

                        {/* Action */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <Link
                            href={`/admin/orders/${encodeURIComponent(ord.order_number)}`}
                            className="inline-flex items-center gap-1 rounded-xl bg-violet px-3 py-1.5 text-xs font-bold text-white shadow-lift hover:bg-violet-lift transition-all"
                          >
                            <span>Manage</span>
                            <ChevronRight className="size-3" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Bar */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-paper/30 text-xs">
                <div className="text-muted-foreground">
                  Showing page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> ({totalCount} total orders)
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
        </div>
      )}

      {/* Mobile Filters Drawer / Sheet */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs lg:hidden animate-in fade-in duration-150">
          <div className="w-full max-w-xs bg-white h-full p-6 space-y-6 overflow-y-auto shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="font-bold text-sm text-ink flex items-center gap-2">
                  <SlidersHorizontal className="size-4 text-violet" />
                  <span>Filter Orders</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="rounded-lg p-1.5 text-muted-foreground hover:text-ink hover:bg-paper"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Payment Filter */}
              <div className="space-y-1.5">
                <label className="text-[0.6875rem] font-bold text-ink uppercase font-mono flex items-center gap-1.5">
                  <CreditCard className="size-3.5 text-violet" />
                  <span>Payment Status</span>
                </label>
                <select
                  value={paymentStatusFilter}
                  onChange={(e) => updateFilters({ paymentStatus: e.target.value })}
                  className="w-full rounded-xl border border-border bg-white px-3 py-2 text-xs font-semibold text-ink focus:border-violet focus:outline-none"
                >
                  {PAYMENT_STATUSES.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Filter */}
              <div className="space-y-1.5">
                <label className="text-[0.6875rem] font-bold text-ink uppercase font-mono flex items-center gap-1.5">
                  <Calendar className="size-3.5 text-violet" />
                  <span>Date Range</span>
                </label>
                <select
                  value={dateRangeFilter}
                  onChange={(e) => updateFilters({ dateRange: e.target.value })}
                  className="w-full rounded-xl border border-border bg-white px-3 py-2 text-xs font-semibold text-ink focus:border-violet focus:outline-none"
                >
                  {DATE_PRESETS.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Filter */}
              <div className="space-y-1.5">
                <label className="text-[0.6875rem] font-bold text-ink uppercase font-mono flex items-center gap-1.5">
                  <ArrowUpDown className="size-3.5 text-violet" />
                  <span>Order Sorting</span>
                </label>
                <select
                  value={sortFilter}
                  onChange={(e) => updateFilters({ sort: e.target.value })}
                  className="w-full rounded-xl border border-border bg-white px-3 py-2 text-xs font-semibold text-ink focus:border-violet focus:outline-none"
                >
                  {SORT_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-border space-y-2">
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="w-full rounded-xl bg-violet py-2.5 font-bold text-xs text-white shadow-lift hover:bg-violet-lift transition-all"
              >
                Apply Filters
              </button>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={() => {
                    clearAllFilters();
                    setMobileFilterOpen(false);
                  }}
                  className="w-full rounded-xl border border-border bg-paper py-2 font-semibold text-xs text-muted-foreground hover:text-red-600 transition-colors"
                >
                  Reset All Filters
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bulk Operation Result Summary Modal */}
      {bulkResultModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150 text-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl p-6 space-y-4 shadow-2xl border border-border">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-bold text-sm text-ink">Bulk Milestone Transition Report</h3>
              <button
                type="button"
                onClick={() => setBulkResultModal(null)}
                className="text-muted-foreground hover:text-ink"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl bg-paper p-3 border border-border">
                <span className="text-[0.6875rem] text-muted-foreground font-mono uppercase block">Total</span>
                <span className="font-bold text-base text-ink">{bulkResultModal.totalRequested}</span>
              </div>
              <div className="rounded-xl bg-emerald-50 p-3 border border-emerald-200">
                <span className="text-[0.6875rem] text-emerald-700 font-mono uppercase block">Success</span>
                <span className="font-bold text-base text-emerald-700">{bulkResultModal.successCount}</span>
              </div>
              <div className="rounded-xl bg-red-50 p-3 border border-red-200">
                <span className="text-[0.6875rem] text-red-700 font-mono uppercase block">Rejected / Skipped</span>
                <span className="font-bold text-base text-red-700">{bulkResultModal.failedCount}</span>
              </div>
            </div>

            <div className="max-h-60 overflow-y-auto divide-y divide-border/60 border border-border rounded-xl">
              {bulkResultModal.results.map((res, idx) => (
                <div key={idx} className="p-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono font-bold text-ink">{res.orderNumber}</span>
                    {res.error && (
                      <span className="text-[0.6875rem] text-red-600 block">{res.error}</span>
                    )}
                  </div>
                  <span
                    className={`rounded px-2 py-0.5 text-[0.625rem] font-bold font-mono uppercase ${
                      res.success
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {res.success ? "Transitioned" : "Rejected"}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setBulkResultModal(null)}
                className="rounded-xl bg-violet px-5 py-2 font-bold text-xs text-white shadow-lift hover:bg-violet-lift transition-all"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
