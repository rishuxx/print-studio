import * as React from "react";
import {
  Package,
  IndianRupee,
  Activity,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import {
  DashboardOverviewKPIs,
  DashboardComparisonMetrics,
  MetricComparison,
} from "@/lib/admin/dashboard/types";
import { formatPaiseToInr, formatIndianNumber } from "@/lib/admin/dashboard/formatters";
import { cn } from "@/lib/utils";

interface DashboardKpiGridProps {
  kpis: DashboardOverviewKPIs;
  comparison: DashboardComparisonMetrics;
}

function ComparisonBadge({ comp }: { comp: MetricComparison }) {
  if (comp.displayState === "no_previous_data") {
    return (
      <span className="inline-flex items-center gap-1 text-[0.6875rem] text-muted-foreground font-mono">
        <Minus className="size-3" /> No prev data
      </span>
    );
  }

  if (comp.displayState === "new_activity") {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-1.5 py-0.5 text-[0.6875rem] font-bold text-emerald-700 font-mono">
        <TrendingUp className="size-3" /> New Activity
      </span>
    );
  }

  const isUp = comp.trend === "up";
  const isDown = comp.trend === "down";

  return (
    <div className="flex items-center gap-1">
      <span
        className={cn(
          "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[0.6875rem] font-bold font-mono",
          isUp && "bg-emerald-50 text-emerald-700",
          isDown && "bg-rose-50 text-rose-700",
          !isUp && !isDown && "bg-paper text-muted-foreground"
        )}
      >
        {isUp && <TrendingUp className="size-3" />}
        {isDown && <TrendingDown className="size-3" />}
        {!isUp && !isDown && <Minus className="size-3" />}
        <span>{comp.changePercent}%</span>
      </span>
      <span className="text-[0.625rem] text-muted-foreground font-mono">vs prev</span>
    </div>
  );
}

export function DashboardKpiGrid({ kpis, comparison }: DashboardKpiGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* KPI 1: Total Orders */}
      <div className="flex flex-col justify-between rounded-2xl border border-border/80 bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground">Total Orders</span>
          <div className="flex size-8 items-center justify-center rounded-lg bg-violet/10 text-violet">
            <Package className="size-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="font-display text-2xl font-black text-ink">
            {formatIndianNumber(kpis.totalOrders)}
          </div>
          <div className="mt-2 flex items-center justify-between">
            <ComparisonBadge comp={comparison.orders} />
          </div>
        </div>
      </div>

      {/* KPI 2: Verified Revenue */}
      <div className="flex flex-col justify-between rounded-2xl border border-border/80 bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground">Paid Revenue</span>
          <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <IndianRupee className="size-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="font-display text-2xl font-black text-ink">
            {formatPaiseToInr(kpis.totalRevenuePaise)}
          </div>
          <div className="mt-2 flex items-center justify-between">
            <ComparisonBadge comp={comparison.revenue} />
          </div>
        </div>
      </div>

      {/* KPI 3: Active Orders */}
      <div className="flex flex-col justify-between rounded-2xl border border-border/80 bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground">Active Orders</span>
          <div className="flex size-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <Activity className="size-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="font-display text-2xl font-black text-ink">
            {formatIndianNumber(kpis.activeOrders)}
          </div>
          <div className="mt-2 flex items-center justify-between">
            <ComparisonBadge comp={comparison.activeOrders} />
          </div>
        </div>
      </div>

      {/* KPI 4: Completed Orders */}
      <div className="flex flex-col justify-between rounded-2xl border border-border/80 bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground">Delivered</span>
          <div className="flex size-8 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
            <CheckCircle2 className="size-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="font-display text-2xl font-black text-ink">
            {formatIndianNumber(kpis.completedOrders)}
          </div>
          <div className="mt-2 flex items-center justify-between">
            <ComparisonBadge comp={comparison.completedOrders} />
          </div>
        </div>
      </div>

      {/* KPI 5: Payment Follow-ups */}
      <div className="flex flex-col justify-between rounded-2xl border border-border/80 bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground">Payment Follow-up</span>
          <div className="flex size-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
            <AlertTriangle className="size-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="font-display text-2xl font-black text-ink">
            {formatIndianNumber(kpis.paymentIssues)}
          </div>
          <div className="mt-2 flex items-center justify-between">
            <ComparisonBadge comp={comparison.paymentIssues} />
          </div>
        </div>
      </div>
    </div>
  );
}
