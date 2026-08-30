import * as React from "react";
import Link from "next/link";
import { StatusDistributionItem } from "@/lib/admin/dashboard/types";
import { ArrowRight, Layers } from "lucide-react";

interface DashboardStatusOverviewProps {
  distribution: StatusDistributionItem[];
  totalOrders: number;
}

export function DashboardStatusOverview({
  distribution,
  totalOrders,
}: DashboardStatusOverviewProps) {
  if (!distribution || distribution.length === 0) {
    return (
      <div className="rounded-2xl border border-border/80 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-base font-bold text-ink">Order Lifecycle Pipeline</h3>
            <p className="text-xs text-muted-foreground">Distribution across production stages</p>
          </div>
        </div>
        <div className="py-8 text-center text-xs text-muted-foreground">
          No order records in this timeframe.
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border/80 bg-white p-6 shadow-xs space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-base font-bold text-ink">Order Lifecycle Pipeline</h3>
          <p className="text-xs text-muted-foreground">
            {totalOrders} total jobs across manufacturing & fulfilment stages
          </p>
        </div>
        <div className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
          <Layers className="size-3.5 text-violet" />
          <span>{distribution.length} Active Stages</span>
        </div>
      </div>

      {/* Distribution Progress Slices */}
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-paper gap-0.5">
        {distribution.map((item) => (
          <div
            key={item.status}
            style={{ width: `${Math.max(item.percentage, 2)}%` }}
            className={`h-full transition-all ${
              item.status === "in_production"
                ? "bg-indigo-600"
                : item.status === "artwork_review"
                ? "bg-violet"
                : item.status === "proof_pending"
                ? "bg-purple-600"
                : item.status === "delivered"
                ? "bg-emerald-600"
                : item.status === "cancelled"
                ? "bg-slate-400"
                : "bg-amber-500"
            }`}
            title={`${item.label}: ${item.count} (${item.percentage}%)`}
          />
        ))}
      </div>

      {/* Status Item Badges Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 pt-2">
        {distribution.map((item) => (
          <Link
            key={item.status}
            href={`/admin/orders?status=${item.status}`}
            className="group flex items-center justify-between rounded-xl border border-border/70 p-3 hover:border-violet/60 hover:bg-violet-wash/40 transition-all"
          >
            <div className="space-y-0.5 min-w-0 pr-2">
              <span
                className={`inline-block rounded-md px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wider ${item.badgeClass}`}
              >
                {item.label}
              </span>
              <div className="text-[0.6875rem] font-mono text-muted-foreground">
                {item.percentage}% of total
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="font-display font-black text-sm text-ink group-hover:text-violet">
                {item.count}
              </span>
              <ArrowRight className="size-3 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
