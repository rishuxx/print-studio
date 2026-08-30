"use client";

import * as React from "react";
import { DashboardDataDTO } from "@/lib/admin/dashboard/types";
import { DashboardFilters } from "@/components/admin/dashboard/dashboard-filters";
import { DashboardKpiGrid } from "@/components/admin/dashboard/dashboard-kpi-grid";
import { DashboardRevenueChart } from "@/components/admin/dashboard/dashboard-revenue-chart";
import { DashboardOrdersChart } from "@/components/admin/dashboard/dashboard-orders-chart";
import { DashboardStatusOverview } from "@/components/admin/dashboard/dashboard-status-overview";
import { DashboardAttention } from "@/components/admin/dashboard/dashboard-attention";
import { DashboardRecentOrders } from "@/components/admin/dashboard/dashboard-recent-orders";
import Link from "next/link";
import {
  Package,
  Layers,
  CreditCard,
  Users,
  Printer,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";

interface AdminDashboardClientViewProps {
  data: DashboardDataDTO;
  adminName: string;
  adminEmail: string;
  adminRole: string;
}

export function AdminDashboardClientView({
  data,
  adminName,
  adminEmail,
  adminRole,
}: AdminDashboardClientViewProps) {
  const quickActions = [
    {
      title: "Order Console",
      description: "Search orders, inspect customer items & advance order lifecycles.",
      href: "/admin/orders",
      icon: Package,
      statusText: `${data.kpis.totalOrders} total jobs`,
      badge: "Active",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    {
      title: "Artwork & Pre-Press",
      description: "Pre-flight audit for resolution, trim margins & CMYK color profiling.",
      href: "/admin/orders?status=artwork_review",
      icon: Printer,
      statusText: "Operational Pre-Press",
      badge: "Active",
      badgeColor: "bg-violet-50 text-violet-700 border-violet-200",
    },
    {
      title: "Catalogue Management",
      description: "Manage product specs, print substrates, finishes, and quantity tiers.",
      href: "/admin/products",
      icon: Layers,
      statusText: "Phase 10D Module",
      badge: "Upcoming",
      badgeColor: "bg-paper text-muted-foreground border-border",
    },
    {
      title: "Payment Reconciliation",
      description: "Verify Razorpay transactions, capture references, and audit refunds.",
      href: "/admin/payments",
      icon: CreditCard,
      statusText: "Phase 10F Module",
      badge: "Upcoming",
      badgeColor: "bg-paper text-muted-foreground border-border",
    },
    {
      title: "Customer Directory",
      description: "Inspect customer accounts, enterprise clients, and address books.",
      href: "/admin/customers",
      icon: Users,
      statusText: "Phase 10G Module",
      badge: "Upcoming",
      badgeColor: "bg-paper text-muted-foreground border-border",
    },
    {
      title: "System Audit Log",
      description: "Immutable trail of administrative transitions, status changes, and auth events.",
      href: "/admin/audit-log",
      icon: ShieldAlert,
      statusText: "Phase 10K Module",
      badge: "Upcoming",
      badgeColor: "bg-paper text-muted-foreground border-border",
    },
  ];

  return (
    <div className="space-y-8">
      {/* ── Welcome & Operational Identity Header ─────────────────── */}
      <div className="rounded-2xl border border-border/80 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-violet">
                Command Center · Business Intelligence
              </span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
              Welcome back, {adminName}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Real-time business performance derived directly from PostgreSQL. Active administrator session:{" "}
              <code className="font-mono text-ink font-semibold">{adminEmail}</code> ({adminRole}).
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-2 rounded-xl bg-violet px-4 py-2.5 text-xs font-bold text-white shadow-lift hover:bg-violet-lift transition-all"
            >
              <Package className="size-4" />
              <span>Go to Order Console</span>
              <ArrowRight className="size-3.5 ml-0.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Dashboard Date Range Controls & Refresh ─────────────────── */}
      <DashboardFilters currentRange={data.dateRange} />

      {/* ── KPI Metrics Grid ────────────────────────────────────────── */}
      <DashboardKpiGrid kpis={data.kpis} comparison={data.comparison} />

      {/* ── Operational Attention Section ───────────────────────────── */}
      <DashboardAttention items={data.attentionItems} />

      {/* ── Visual Analytics (Revenue & Order Volume Trends) ─────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardRevenueChart data={data.revenueTrend} />
        <DashboardOrdersChart data={data.orderTrend} />
      </div>

      {/* ── Order Lifecycle Pipeline Distribution ───────────────────── */}
      <DashboardStatusOverview
        distribution={data.statusDistribution}
        totalOrders={data.kpis.totalOrders}
      />

      {/* ── Recent Orders Console ───────────────────────────────────── */}
      <DashboardRecentOrders orders={data.recentOrders} />

      {/* ── Operational Modules Directory ───────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-ink tracking-tight">
            Administrative Modules & Systems
          </h3>
          <span className="font-mono text-xs text-muted-foreground">
            Phase 10 Operations Directory
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((card) => {
            const Icon = card.icon;
            const isLive = card.badge === "Active";

            return (
              <div
                key={card.title}
                className="group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-white p-5 transition-all hover:border-violet/40 hover:shadow-xs"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex size-9 items-center justify-center rounded-xl bg-paper text-violet group-hover:bg-violet-wash transition-colors">
                      <Icon className="size-4.5" />
                    </div>
                    <span
                      className={`rounded-md border px-2 py-0.5 font-mono text-[0.625rem] font-bold uppercase tracking-wider ${card.badgeColor}`}
                    >
                      {card.badge}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-display text-sm font-bold text-ink group-hover:text-violet transition-colors">
                      {card.title}
                    </h4>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs">
                  <span className="font-mono text-[0.6875rem] text-muted-foreground">
                    {card.statusText}
                  </span>
                  {isLive ? (
                    <Link
                      href={card.href}
                      className="font-bold text-violet inline-flex items-center gap-1 hover:underline"
                    >
                      <span>Open</span>
                      <ArrowRight className="size-3" />
                    </Link>
                  ) : (
                    <span className="font-mono text-[0.625rem] text-muted-foreground/80">
                      Coming Soon
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
