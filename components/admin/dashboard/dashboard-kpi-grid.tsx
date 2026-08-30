import * as React from "react";
import Link from "next/link";
import {
  Package,
  IndianRupee,
  Activity,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowUpRight,
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
      <Link
        href="/admin/orders"
        className="group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-white p-5 shadow-xs transition-all hover:border-violet/60 hover:shadow-md hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground group-hover:text-ink transition-colors">
            Total Orders
          </span>
          <div className="flex size-8 items-center justify-center rounded-lg bg-violet/10 text-violet group-hover:bg-violet group-hover:text-white transition-all">
            <Package className="size-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="font-display text-2xl font-black text-ink group-hover:text-violet transition-colors">
            {formatIndianNumber(kpis.totalOrders)}
          </div>
          <div className="mt-2 flex items-center justify-between">
            <ComparisonBadge comp={comparison.orders} />
            <ArrowUpRight className="size-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-violet" />
          </div>
        </div>
      </Link>

      {/* KPI 2: Verified Revenue */}
      <Link
        href="/admin/payments"
        className="group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-white p-5 shadow-xs transition-all hover:border-emerald-500/60 hover:shadow-md hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground group-hover:text-ink transition-colors">
            Paid Revenue
          </span>
          <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
            <IndianRupee className="size-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="font-display text-2xl font-black text-ink group-hover:text-emerald-700 transition-colors">
            {formatPaiseToInr(kpis.totalRevenuePaise)}
          </div>
          <div className="mt-2 flex items-center justify-between">
            <ComparisonBadge comp={comparison.revenue} />
            <ArrowUpRight className="size-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-emerald-600" />
          </div>
        </div>
      </Link>

      {/* KPI 3: Active Orders */}
      <Link
        href="/admin/orders?status=active"
        className="group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-white p-5 shadow-xs transition-all hover:border-blue-500/60 hover:shadow-md hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground group-hover:text-ink transition-colors">
            Active Orders
          </span>
          <div className="flex size-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
            <Activity className="size-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="font-display text-2xl font-black text-ink group-hover:text-blue-700 transition-colors">
            {formatIndianNumber(kpis.activeOrders)}
          </div>
          <div className="mt-2 flex items-center justify-between">
            <ComparisonBadge comp={comparison.activeOrders} />
            <ArrowUpRight className="size-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-blue-600" />
          </div>
        </div>
      </Link>

      {/* KPI 4: Completed Orders */}
      <Link
        href="/admin/orders?status=delivered"
        className="group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-white p-5 shadow-xs transition-all hover:border-teal-500/60 hover:shadow-md hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground group-hover:text-ink transition-colors">
            Delivered
          </span>
          <div className="flex size-8 items-center justify-center rounded-lg bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-all">
            <CheckCircle2 className="size-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="font-display text-2xl font-black text-ink group-hover:text-teal-700 transition-colors">
            {formatIndianNumber(kpis.completedOrders)}
          </div>
          <div className="mt-2 flex items-center justify-between">
            <ComparisonBadge comp={comparison.completedOrders} />
            <ArrowUpRight className="size-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-teal-600" />
          </div>
        </div>
      </Link>

      {/* KPI 5: Payment Follow-ups */}
      <Link
        href="/admin/orders?paymentStatus=pending"
        className="group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-white p-5 shadow-xs transition-all hover:border-amber-500/60 hover:shadow-md hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground group-hover:text-ink transition-colors">
            Payment Follow-up
          </span>
          <div className="flex size-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-all">
            <AlertTriangle className="size-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="font-display text-2xl font-black text-ink group-hover:text-amber-700 transition-colors">
            {formatIndianNumber(kpis.paymentIssues)}
          </div>
          <div className="mt-2 flex items-center justify-between">
            <ComparisonBadge comp={comparison.paymentIssues} />
            <ArrowUpRight className="size-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-amber-600" />
          </div>
        </div>
      </Link>
    </div>
  );
}
