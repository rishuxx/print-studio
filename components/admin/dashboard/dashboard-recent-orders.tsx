import * as React from "react";
import Link from "next/link";
import { RecentOrderSummary } from "@/lib/admin/dashboard/types";
import { formatPaiseToInr, formatIndianDateTime } from "@/lib/admin/dashboard/formatters";
import { getOrderStatusBadge } from "@/lib/admin/dashboard/metrics";
import { ArrowRight, User } from "lucide-react";

interface DashboardRecentOrdersProps {
  orders: RecentOrderSummary[];
}

export function DashboardRecentOrders({ orders }: DashboardRecentOrdersProps) {
  if (!orders || orders.length === 0) {
    return (
      <div className="rounded-2xl border border-border/80 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-base font-bold text-ink">Recent Orders</h3>
        </div>
        <div className="py-8 text-center text-xs text-muted-foreground">
          No recent orders recorded in PostgreSQL database.
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border/80 bg-white p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-base font-bold text-ink">Recent Orders</h3>
          <p className="text-xs text-muted-foreground">Latest print orders placed in system</p>
        </div>
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-1 text-xs font-bold text-violet hover:underline"
        >
          <span>View All Orders</span>
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      {/* Desktop & Tablet Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-border text-muted-foreground font-mono uppercase tracking-wider text-[0.6875rem]">
              <th className="py-2.5 px-3 font-semibold">Order</th>
              <th className="py-2.5 px-3 font-semibold">Customer</th>
              <th className="py-2.5 px-3 font-semibold">Timestamp</th>
              <th className="py-2.5 px-3 font-semibold text-right">Amount</th>
              <th className="py-2.5 px-3 font-semibold">Payment</th>
              <th className="py-2.5 px-3 font-semibold">Status</th>
              <th className="py-2.5 px-3 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {orders.map((o) => {
              const statusMeta = getOrderStatusBadge(o.status);
              const isPaid = o.paymentStatus === "paid" || o.paymentStatus === "authorized";

              return (
                <tr key={o.id} className="hover:bg-paper/80 transition-colors">
                  <td className="py-3 px-3">
                    <span className="font-mono font-bold text-ink">#{o.orderNumber}</span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-medium text-ink truncate max-w-40">{o.customerName}</div>
                    <div className="text-[0.625rem] text-muted-foreground font-mono truncate max-w-40">
                      {o.customerEmail}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-muted-foreground whitespace-nowrap">
                    {formatIndianDateTime(o.createdAt)}
                  </td>
                  <td className="py-3 px-3 text-right font-display font-bold text-ink whitespace-nowrap">
                    {formatPaiseToInr(o.totalPaise)}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span
                      className={`inline-block rounded-md px-1.5 py-0.5 text-[0.625rem] font-mono font-bold uppercase ${
                        isPaid
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {o.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span
                      className={`inline-block rounded-md px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wider ${statusMeta.badgeClass}`}
                    >
                      {statusMeta.label}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    <Link
                      href={`/admin/orders/${o.id}`}
                      className="inline-flex items-center gap-1 rounded-lg bg-paper px-2.5 py-1 font-bold text-violet hover:bg-violet hover:text-white transition-colors"
                    >
                      <span>Manage</span>
                      <ArrowRight className="size-3" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List (< 768px) */}
      <div className="divide-y divide-border/60 md:hidden">
        {orders.map((o) => {
          const statusMeta = getOrderStatusBadge(o.status);
          const isPaid = o.paymentStatus === "paid" || o.paymentStatus === "authorized";

          return (
            <div key={o.id} className="py-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-ink text-sm">#{o.orderNumber}</span>
                <span className="font-display font-black text-sm text-ink">
                  {formatPaiseToInr(o.totalPaise)}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1 truncate max-w-44">
                  <User className="size-3 text-muted-foreground" />
                  <span className="truncate">{o.customerName}</span>
                </div>
                <span>{formatIndianDateTime(o.createdAt)}</span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`inline-block rounded-md px-1.5 py-0.5 text-[0.5625rem] font-mono font-bold uppercase ${
                      isPaid
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    {o.paymentStatus}
                  </span>
                  <span
                    className={`inline-block rounded-md px-2 py-0.5 text-[0.625rem] font-bold uppercase ${statusMeta.badgeClass}`}
                  >
                    {statusMeta.label}
                  </span>
                </div>

                <Link
                  href={`/admin/orders/${o.id}`}
                  className="inline-flex items-center gap-1 rounded-lg bg-paper px-2.5 py-1 text-xs font-bold text-violet hover:bg-violet hover:text-white transition-colors"
                >
                  <span>Manage</span>
                  <ArrowRight className="size-3" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
