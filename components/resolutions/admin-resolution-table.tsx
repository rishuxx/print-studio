"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  ArrowRight,
  RotateCcw,
  Clock,
  Sparkles,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import type { ResolutionRequestRecord, ResolutionStatus } from "@/lib/resolutions/types";

interface AdminResolutionTableProps {
  requests: ResolutionRequestRecord[];
  activeStatus: string;
  activeType: string;
  activePriority: string;
}

export function AdminResolutionTable({
  requests,
  activeStatus,
  activeType,
  activePriority,
}: AdminResolutionTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/admin/resolutions?${params.toString()}`);
  };

  const filtered = requests.filter((r) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.requestNumber.toLowerCase().includes(q) ||
      (r.orderNumber && r.orderNumber.toLowerCase().includes(q)) ||
      (r.customerName && r.customerName.toLowerCase().includes(q)) ||
      r.customerDescription.toLowerCase().includes(q)
    );
  });

  return (
    <div className="rounded-2xl border border-border bg-white shadow-sm overflow-hidden space-y-4 p-6">
      {/* Controls: Search & Filter bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search ticket #, order #, or customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-border bg-paper/50 pl-9 pr-4 py-2 text-xs text-ink placeholder:text-muted-foreground focus:border-violet focus:outline-none focus:ring-1 focus:ring-violet"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status filter */}
          <select
            value={activeStatus}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="rounded-xl border border-border bg-paper/50 px-3 py-2 text-xs font-mono text-ink focus:border-violet focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="submitted">Submitted</option>
            <option value="under_review">Under Review</option>
            <option value="evidence_required">Evidence Required</option>
            <option value="approved">Approved</option>
            <option value="replacement_in_progress">Replacement In Progress</option>
            <option value="refund_pending">Refund Pending</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
            <option value="closed">Closed</option>
          </select>

          {/* Type filter */}
          <select
            value={activeType}
            onChange={(e) => handleFilterChange("type", e.target.value)}
            className="rounded-xl border border-border bg-paper/50 px-3 py-2 text-xs font-mono text-ink focus:border-violet focus:outline-none"
          >
            <option value="all">All Types</option>
            <option value="replacement">Replacement</option>
            <option value="refund">Refund</option>
            <option value="partial_refund">Partial Refund</option>
            <option value="return_and_refund">Return & Refund</option>
            <option value="store_credit">Store Credit</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-border/80 text-muted-foreground font-mono uppercase text-[10px] tracking-wider">
              <th className="py-3 px-3">Ticket #</th>
              <th className="py-3 px-3">Order Ref</th>
              <th className="py-3 px-3">Customer</th>
              <th className="py-3 px-3">Type & Reason</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3">Date</th>
              <th className="py-3 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-muted-foreground">
                  No resolution tickets found matching criteria.
                </td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr key={r.id} className="hover:bg-paper/40 transition-colors">
                  <td className="py-3.5 px-3">
                    <div className="font-mono font-bold text-ink">{r.requestNumber}</div>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      v{r.version}
                    </span>
                  </td>

                  <td className="py-3.5 px-3">
                    <Link
                      href={`/admin/orders/${r.orderId}`}
                      className="font-mono font-bold text-violet hover:underline"
                    >
                      #{r.orderNumber}
                    </Link>
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="font-medium text-ink">{r.customerName || "Customer"}</div>
                    <div className="text-[10px] text-muted-foreground truncate max-w-[120px]">
                      {r.customerEmail}
                    </div>
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="font-bold text-ink capitalize">{r.type.replace(/_/g, " ")}</div>
                    <div className="text-[10px] text-muted-foreground capitalize">
                      Reason: {r.reasonCode.replace(/_/g, " ")}
                    </div>
                  </td>

                  <td className="py-3.5 px-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase ${
                        r.status === "resolved" || r.status === "closed"
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : r.status === "rejected"
                          ? "bg-red-50 text-red-800 border border-red-200"
                          : r.status === "replacement_in_progress"
                          ? "bg-indigo-50 text-indigo-800 border border-indigo-200"
                          : "bg-amber-50 text-amber-800 border border-amber-200"
                      }`}
                    >
                      {r.status.replace(/_/g, " ")}
                    </span>
                  </td>

                  <td className="py-3.5 px-3 font-mono text-muted-foreground">
                    {new Date(r.requestedAt).toLocaleDateString("en-IN", {
                      month: "short",
                      day: "numeric",
                    })}
                  </td>

                  <td className="py-3.5 px-3 text-right">
                    <Link
                      href={`/admin/resolutions/${r.id}`}
                      className="inline-flex items-center gap-1 rounded-lg border border-border bg-white px-2.5 py-1 text-xs font-bold text-ink hover:bg-paper hover:border-violet/40 transition-colors shadow-2xs"
                    >
                      Review Ticket
                      <ArrowRight className="size-3 text-violet" />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
