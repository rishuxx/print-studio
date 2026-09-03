"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Printer,
  Search,
  SlidersHorizontal,
  ArrowRight,
  Clock,
  Layers,
  Sparkles,
  User,
  ShieldCheck,
} from "lucide-react";
import type { ProductionJobRecord } from "@/lib/production/types";
import { ProductionStatusBadge } from "./production-status-badge";

interface ProductionQueueTableProps {
  jobs: ProductionJobRecord[];
  staffProfiles: Array<{ id: string; full_name: string | null; role: string }>;
  activeStatus: string;
  activePriority: string;
}

export function ProductionQueueTable({
  jobs,
  staffProfiles,
  activeStatus,
  activePriority,
}: ProductionQueueTableProps) {
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
    router.push(`/admin/production?${params.toString()}`);
  };

  const filteredJobs = jobs.filter((job) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      job.jobNumber.toLowerCase().includes(q) ||
      job.productionSpecSnapshot.productTitle.toLowerCase().includes(q) ||
      (job.assignedOperatorName && job.assignedOperatorName.toLowerCase().includes(q))
    );
  });

  return (
    <div className="rounded-2xl border border-border bg-white shadow-sm overflow-hidden space-y-4 p-6">
      {/* Controls: Search & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search job #, product, or operator..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-border bg-paper/50 pl-9 pr-4 py-2 text-xs text-ink placeholder:text-muted-foreground focus:border-violet focus:outline-none focus:ring-1 focus:ring-violet"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            value={activeStatus}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="rounded-xl border border-border bg-paper/50 px-3 py-2 text-xs font-mono text-ink focus:border-violet focus:outline-none"
          >
            <option value="all">All Stages</option>
            <option value="queued">Queued</option>
            <option value="scheduled">Scheduled</option>
            <option value="ready_to_print">Ready to Print</option>
            <option value="printing">Printing</option>
            <option value="finishing">Finishing</option>
            <option value="quality_check">Quality Check</option>
            <option value="rework_required">Rework Required</option>
            <option value="completed">Completed</option>
          </select>

          {/* Priority Filter */}
          <select
            value={activePriority}
            onChange={(e) => handleFilterChange("priority", e.target.value)}
            className="rounded-xl border border-border bg-paper/50 px-3 py-2 text-xs font-mono text-ink focus:border-violet focus:outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="normal">Normal</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Table List */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-border/80 text-muted-foreground font-mono uppercase text-[10px] tracking-wider">
              <th className="py-3 px-3">Job Ticket</th>
              <th className="py-3 px-3">Product & Specs</th>
              <th className="py-3 px-3">Qty</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3">Priority</th>
              <th className="py-3 px-3">Assigned Operator</th>
              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {filteredJobs.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-muted-foreground">
                  No production jobs found matching active criteria.
                </td>
              </tr>
            ) : (
              filteredJobs.map((job) => {
                const spec = job.productionSpecSnapshot;
                const dims = spec?.productionSpecification?.dimensions;

                return (
                  <tr key={job.id} className="hover:bg-paper/40 transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="font-mono font-bold text-ink">{job.jobNumber}</div>
                      <div className="text-[10px] font-mono text-muted-foreground">
                        {new Date(job.createdAt).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </td>

                    <td className="py-3.5 px-3 max-w-xs">
                      <div className="font-bold text-ink truncate">{spec.productTitle}</div>
                      <div className="text-[11px] text-muted-foreground truncate">
                        {dims?.formatted || (dims ? `${dims.width}×${dims.height} ${dims.unit}` : "Custom format")}
                        {spec.productionSpecification?.substrate && ` • ${spec.productionSpecification.substrate}`}
                      </div>
                    </td>

                    <td className="py-3.5 px-3 font-mono font-bold text-ink">
                      {spec.quantity.toLocaleString("en-IN")}
                    </td>

                    <td className="py-3.5 px-3">
                      <ProductionStatusBadge status={job.status} />
                    </td>

                    <td className="py-3.5 px-3">
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-mono font-bold uppercase ${
                          job.priority === "urgent"
                            ? "bg-red-100 text-red-900 border border-red-200"
                            : job.priority === "high"
                            ? "bg-amber-100 text-amber-900 border border-amber-200"
                            : "bg-paper text-muted-foreground border border-border"
                        }`}
                      >
                        {job.priority}
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      {job.assignedOperatorName ? (
                        <div className="flex items-center gap-1 font-medium text-ink">
                          <User className="size-3 text-muted-foreground" />
                          <span>{job.assignedOperatorName}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground italic text-[11px]">Unassigned</span>
                      )}
                    </td>

                    <td className="py-3.5 px-3 text-right">
                      <Link
                        href={`/admin/production/${job.id}`}
                        className="inline-flex items-center gap-1 rounded-lg border border-border bg-white px-2.5 py-1 text-xs font-bold text-ink hover:bg-paper hover:border-violet/40 transition-colors shadow-2xs"
                      >
                        Open Work Center
                        <ArrowRight className="size-3 text-violet" />
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
