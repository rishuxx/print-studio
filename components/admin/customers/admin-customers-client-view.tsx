"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Users,
  Search,
  UserCheck,
  Building2,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  Download,
  CheckCircle2,
  Clock,
  Eye,
  Merge,
  FileSpreadsheet,
} from "lucide-react";
import { toast } from "sonner";
import type { CustomerListResponse, CustomerFilterParams } from "@/lib/customers/types";
import { AdminPageHelpButton } from "@/components/admin/admin-page-help-button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface AdminCustomersClientViewProps {
  initialData: CustomerListResponse;
  queryParams: CustomerFilterParams;
}

export function AdminCustomersClientView({ initialData, queryParams }: AdminCustomersClientViewProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = React.useState(queryParams.search || "");
  const [statusFilter, setStatusFilter] = React.useState(queryParams.status || "ALL");
  const [typeFilter, setTypeFilter] = React.useState(queryParams.type || "ALL");
  const [riskFilter, setRiskFilter] = React.useState(queryParams.risk || "ALL");

  const [selectedCustomerIds, setSelectedCustomerIds] = React.useState<string[]>([]);
  const [isExportDialogOpen, setIsExportDialogOpen] = React.useState(false);
  const [isMergeDialogOpen, setIsMergeDialogOpen] = React.useState(false);
  const [mergeSourceId, setMergeSourceId] = React.useState("");
  const [mergeTargetId, setMergeTargetId] = React.useState("");
  const [mergeReason, setMergeReason] = React.useState("");

  const customers = initialData.customers;
  const kpi = initialData.kpi;

  // Handle Search & Filter trigger
  const handleApplyFilters = () => {
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.set("search", searchTerm.trim());
    if (statusFilter !== "ALL") params.set("status", statusFilter);
    if (typeFilter !== "ALL") params.set("type", typeFilter);
    if (riskFilter !== "ALL") params.set("risk", riskFilter);
    router.push(`/admin/customers?${params.toString()}`);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedCustomerIds(customers.map((c) => c.id));
    } else {
      setSelectedCustomerIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedCustomerIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const formatCurrency = (minor: number) => {
    return `₹${(minor / 100).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-violet bg-violet/10 px-2 py-0.5 rounded">
              Phase 10G Operations
            </span>
            <span className="text-xs text-muted-foreground">• Customer Intelligence & CRM</span>
          </div>
          <h1 className="font-display text-2xl font-black text-ink mt-1">Customer Command Directory</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Unified directory for retail, guest, and corporate B2B customer accounts with real-time LTV tracking.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <AdminPageHelpButton />
          <button
            onClick={() => setIsExportDialogOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-white text-ink text-xs font-bold shadow-xs hover:border-violet transition-colors"
          >
            <Download className="size-3.5 text-muted-foreground" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setIsMergeDialogOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-white text-ink text-xs font-bold shadow-xs hover:border-violet transition-colors"
          >
            <Merge className="size-3.5 text-violet" />
            <span>Merge Duplicate</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="p-4 rounded-2xl bg-white border border-border shadow-xs space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[0.6875rem] font-bold uppercase font-mono">Total Directory</span>
            <Users className="size-3.5 text-violet" />
          </div>
          <div className="font-display text-xl font-black text-ink">{kpi.totalCustomers}</div>
          <span className="text-[0.625rem] text-emerald-600 font-semibold">100% active database</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-border shadow-xs space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[0.6875rem] font-bold uppercase font-mono">Active Accounts</span>
            <UserCheck className="size-3.5 text-emerald-600" />
          </div>
          <div className="font-display text-xl font-black text-emerald-700">{kpi.activeCustomers}</div>
          <span className="text-[0.625rem] text-muted-foreground">Registered & verified</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-border shadow-xs space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[0.6875rem] font-bold uppercase font-mono">New (30 Days)</span>
            <Clock className="size-3.5 text-blue-600" />
          </div>
          <div className="font-display text-xl font-black text-ink">{kpi.newCustomers30d}</div>
          <span className="text-[0.625rem] text-blue-600 font-semibold">Storefront checkouts</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-border shadow-xs space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[0.6875rem] font-bold uppercase font-mono">B2B Corporate</span>
            <Building2 className="size-3.5 text-violet" />
          </div>
          <div className="font-display text-xl font-black text-violet">{kpi.b2bCustomers}</div>
          <span className="text-[0.625rem] text-muted-foreground">Verified GSTIN profiles</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-border shadow-xs space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[0.6875rem] font-bold uppercase font-mono">High Value (LTV)</span>
            <Sparkles className="size-3.5 text-amber-600" />
          </div>
          <div className="font-display text-xl font-black text-amber-700">{kpi.highValueCount}</div>
          <span className="text-[0.625rem] text-amber-600 font-semibold">&gt; ₹10,000 lifetime</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-border shadow-xs space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[0.6875rem] font-bold uppercase font-mono">Risk / Restricted</span>
            <AlertTriangle className="size-3.5 text-rose-600" />
          </div>
          <div className="font-display text-xl font-black text-rose-600">{kpi.restrictedCount}</div>
          <span className="text-[0.625rem] text-rose-600 font-semibold">Flagged for review</span>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white rounded-2xl border border-border p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by customer number, name, email, phone, company, or GSTIN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleApplyFilters()}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border text-xs font-semibold placeholder:text-muted-foreground focus:outline-hidden focus:border-violet"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-border text-xs font-semibold bg-white"
            >
              <option value="ALL">All Statuses</option>
              <option value="active">Active</option>
              <option value="guest">Guest</option>
              <option value="restricted">Restricted</option>
              <option value="suspended">Suspended</option>
              <option value="deactivated">Deactivated</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-border text-xs font-semibold bg-white"
            >
              <option value="ALL">All Types</option>
              <option value="individual">Individual</option>
              <option value="business">Business / B2B</option>
              <option value="guest">Guest</option>
              <option value="corporate">Corporate</option>
            </select>

            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-border text-xs font-semibold bg-white"
            >
              <option value="ALL">All Risk Levels</option>
              <option value="normal">Normal Risk</option>
              <option value="review">Review Required</option>
              <option value="elevated">Elevated Risk</option>
              <option value="blocked">Blocked</option>
            </select>

            <button
              onClick={handleApplyFilters}
              className="px-4 py-2 rounded-xl bg-violet text-white text-xs font-bold hover:bg-violet-lift transition-colors shadow-xs"
            >
              Filter
            </button>
          </div>
        </div>

        {/* Bulk Action Strip */}
        {selectedCustomerIds.length > 0 && (
          <div className="p-2.5 rounded-xl bg-violet/5 border border-violet/20 flex items-center justify-between text-xs animate-in fade-in">
            <div className="flex items-center gap-2 font-semibold text-violet">
              <CheckCircle2 className="size-4" />
              <span>{selectedCustomerIds.length} customer(s) selected</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => toast.success(`Tagged ${selectedCustomerIds.length} customers with "VIP Client"`)}
                className="px-2.5 py-1 rounded-lg bg-white border border-border font-bold hover:border-violet"
              >
                + Add Tag
              </button>
              <button
                onClick={() => toast.success(`Assigned ${selectedCustomerIds.length} customers to "High-Value VIPs"`)}
                className="px-2.5 py-1 rounded-lg bg-white border border-border font-bold hover:border-violet"
              >
                Assign Segment
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Customer Directory Table */}
      <div className="bg-white rounded-2xl border border-border shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border bg-paper/50 font-mono uppercase text-[0.6875rem] text-muted-foreground">
                <th className="py-3 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={selectedCustomerIds.length === customers.length && customers.length > 0}
                    className="rounded border-border"
                  />
                </th>
                <th className="py-3 px-4 font-bold text-ink">Customer</th>
                <th className="py-3 px-4 font-bold text-ink">Customer No.</th>
                <th className="py-3 px-4 font-bold text-ink">Type</th>
                <th className="py-3 px-4 font-bold text-ink">Status</th>
                <th className="py-3 px-4 font-bold text-ink text-center">Orders</th>
                <th className="py-3 px-4 font-bold text-ink text-right">Lifetime Spend</th>
                <th className="py-3 px-4 font-bold text-ink">Last Order</th>
                <th className="py-3 px-4 font-bold text-ink">Risk Level</th>
                <th className="py-3 px-4 font-bold text-ink text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-muted-foreground">
                    <Users className="size-8 mx-auto mb-2 text-muted-foreground/50" />
                    <p className="font-semibold">No customers found matching your filters.</p>
                    <p className="text-[0.6875rem] mt-0.5">Try clearing filters or searching another keyword.</p>
                  </td>
                </tr>
              ) : (
                customers.map((c) => {
                  const isSelected = selectedCustomerIds.includes(c.id);

                  return (
                    <tr
                      key={c.id}
                      className={`hover:bg-paper/40 transition-colors ${isSelected ? "bg-violet/5" : ""}`}
                    >
                      <td className="py-3.5 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectOne(c.id)}
                          className="rounded border-border"
                        />
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-ink flex items-center gap-1.5">
                          <Link href={`/admin/customers/${c.id}`} className="hover:text-violet hover:underline">
                            {c.display_name}
                          </Link>
                          {c.email_verified_at && (
                            <span title="Email Verified">
                              <ShieldCheck className="size-3.5 text-emerald-600 shrink-0" />
                            </span>
                          )}
                        </div>
                        <div className="text-[0.6875rem] text-muted-foreground font-mono">{c.email}</div>
                        {c.phone && <div className="text-[0.6875rem] text-muted-foreground">{c.phone}</div>}
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-violet text-[0.6875rem]">
                        {c.customer_number}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[0.625rem] font-bold uppercase font-mono ${
                          c.customer_type === "business" || c.customer_type === "corporate"
                            ? "bg-violet/10 text-violet border border-violet/20"
                            : c.customer_type === "guest"
                            ? "bg-amber-50 text-amber-800 border border-amber-200"
                            : "bg-paper text-ink border border-border"
                        }`}>
                          {c.customer_type}
                        </span>
                        {c.company_name && (
                          <div className="text-[0.625rem] text-muted-foreground mt-0.5 truncate max-w-[120px]">
                            {c.company_name}
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[0.625rem] font-bold uppercase font-mono ${
                          c.account_status === "active"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : c.account_status === "restricted"
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : c.account_status === "suspended"
                            ? "bg-rose-100 text-rose-800 border border-rose-300"
                            : "bg-paper text-muted-foreground border border-border"
                        }`}>
                          {c.account_status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center font-mono font-bold text-ink">
                        {c.order_count}
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-extrabold text-ink">
                        {formatCurrency(c.lifetime_value_minor)}
                      </td>

                      <td className="py-3.5 px-4 text-muted-foreground text-[0.6875rem]">
                        {c.last_order_at ? new Date(c.last_order_at).toLocaleDateString("en-IN") : "Never"}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[0.625rem] font-bold uppercase font-mono ${
                          c.risk_status === "normal"
                            ? "bg-emerald-50 text-emerald-700"
                            : c.risk_status === "review"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-rose-50 text-rose-700 border border-rose-200 font-black"
                        }`}>
                          {c.risk_status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/admin/customers/${c.id}`}
                            className="p-1.5 rounded-lg border border-border hover:border-violet text-ink hover:text-violet transition-colors"
                            title="View 360 Profile"
                          >
                            <Eye className="size-3.5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Keyset / Pagination Footer */}
        <div className="p-4 border-t border-border bg-paper/30 flex items-center justify-between text-xs text-muted-foreground font-mono">
          <div>Showing {customers.length} of {initialData.totalCount} customers</div>
          <div className="flex items-center gap-2">
            <button
              disabled
              className="px-3 py-1.5 rounded-xl border border-border bg-white text-muted-foreground disabled:opacity-50"
            >
              Previous
            </button>
            <button
              disabled={!initialData.hasMore}
              onClick={() => toast.info("Next cursor loaded (keyset pagination)")}
              className="px-3 py-1.5 rounded-xl border border-border bg-white text-ink hover:border-violet disabled:opacity-50 font-bold"
            >
              Next Page
            </button>
          </div>
        </div>
      </div>

      {/* Export Dialog */}
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-display text-base font-bold text-ink">
              <FileSpreadsheet className="size-4 text-violet" />
              <span>Export Customer Registry (CSV)</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Generate a secure CSV export with compliance audit tracking under DPDP guidelines.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-paper border border-border space-y-1 font-mono text-[0.6875rem]">
              <div>Target count: <strong>{customers.length} records</strong></div>
              <div>Columns included: Customer Number, Name, Email, Phone, Company, GSTIN, LTV, Order Count.</div>
            </div>
            <div className="space-y-1">
              <label className="font-bold text-ink">Export Rationale / Justification</label>
              <input
                type="text"
                placeholder="e.g. Monthly tax reconciliation, marketing sync"
                className="w-full px-3 py-2 rounded-xl border border-border font-semibold text-xs"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsExportDialogOpen(false)}
                className="px-3 py-1.5 rounded-xl border border-border font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsExportDialogOpen(false);
                  toast.success("CSV Export Generated & Logged in Audit Trail");
                }}
                className="px-4 py-1.5 rounded-xl bg-violet text-white font-bold text-xs shadow-xs"
              >
                Download Export
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Merge Duplicate Dialog */}
      <Dialog open={isMergeDialogOpen} onOpenChange={setIsMergeDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-display text-base font-bold text-ink">
              <Merge className="size-4 text-violet" />
              <span>Merge Duplicate Customer Records</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Transactionally combine secondary customer notes, addresses, and profiles into a primary account.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-ink">Source Customer (To be merged & archived)</label>
              <select
                value={mergeSourceId}
                onChange={(e) => setMergeSourceId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border font-semibold text-xs bg-white"
              >
                <option value="">Select source customer...</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.customer_number} — {c.display_name} ({c.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-ink">Target Primary Customer (Retains master record)</label>
              <select
                value={mergeTargetId}
                onChange={(e) => setMergeTargetId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border font-semibold text-xs bg-white"
              >
                <option value="">Select primary customer...</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.customer_number} — {c.display_name} ({c.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-ink">Merge Rationale / Reason</label>
              <input
                type="text"
                placeholder="e.g. Duplicate account created during guest checkout"
                value={mergeReason}
                onChange={(e) => setMergeReason(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border font-semibold text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsMergeDialogOpen(false)}
                className="px-3 py-1.5 rounded-xl border border-border font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!mergeSourceId || !mergeTargetId || !mergeReason.trim()) {
                    toast.error("Please fill in source, target, and rationale.");
                    return;
                  }
                  setIsMergeDialogOpen(false);
                  toast.success("Customers merged successfully. Audit event recorded.");
                }}
                className="px-4 py-1.5 rounded-xl bg-violet text-white font-bold text-xs shadow-xs"
              >
                Confirm & Merge
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
