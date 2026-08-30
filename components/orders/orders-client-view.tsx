"use client";

import * as React from "react";
import Link from "next/link";
import { ProductMockup } from "@/components/shared/product-mockup";
import {
  Package,
  ChevronRight,
  Printer,
  FileText,
  ArrowRight,
} from "lucide-react";
import type { Database, OrderStatus } from "@/lib/supabase/database.types";
import { ORDER_STATUS_METADATA } from "@/lib/orders/lifecycle";

type DbOrder = Database["public"]["Tables"]["orders"]["Row"] & {
  order_items?: Database["public"]["Tables"]["order_items"]["Row"][];
};

interface OrdersClientViewProps {
  dbOrders: DbOrder[];
}

export function OrdersClientView({ dbOrders }: OrdersClientViewProps) {
  const isHydrated = useSyncExternalStoreHydration();
  const [filter, setFilter] = React.useState<"ALL" | "PROCESSING" | "DISPATCHED" | "CANCELLED">("ALL");

  if (!isHydrated) {
    return <div className="shell py-12 text-center text-xs text-muted-foreground">Loading your orders...</div>;
  }

  // Strictly authoritative PostgreSQL customer orders (zero localStorage fallback)
  const rawList = dbOrders;

  const filteredOrders = rawList.filter((order) => {
    if (filter === "ALL") return true;
    const status = (order.status || "").toLowerCase();
    if (filter === "PROCESSING") return status !== "delivered" && status !== "cancelled";
    if (filter === "DISPATCHED") return status === "dispatched" || status === "shipped" || status === "out_for_delivery" || status === "delivered";
    if (filter === "CANCELLED") return status === "cancelled";
    return true;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-display text-3xl font-extrabold text-ink">
            My Print Orders ({rawList.length})
          </h1>
          <p className="text-xs text-muted-foreground sm:text-sm">
            Track proofing approval, press run progress, and download tax invoices.
          </p>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 bg-paper border border-border p-1 rounded-xl text-xs">
          {(["ALL", "PROCESSING", "DISPATCHED", "CANCELLED"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`rounded-lg px-3 py-1.5 font-bold transition-all text-xs ${
                filter === tab
                  ? "bg-white text-ink shadow-sm"
                  : "text-muted-foreground hover:text-ink"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-white p-12 text-center space-y-4">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-paper text-muted-foreground">
            <Package className="size-6 text-violet" />
          </div>
          <div className="space-y-1">
            <h2 className="font-display text-lg font-bold text-ink">No orders found</h2>
            <p className="text-xs text-muted-foreground">
              {rawList.length === 0 ? "You haven't placed any print orders yet." : "No orders matching this filter."}
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-xl bg-violet px-6 py-2.5 text-xs font-bold text-white shadow-lift hover:bg-violet-lift transition-all"
          >
            <span>Explore Products</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((dbOrd) => {
            const delivery = (dbOrd.delivery_snapshot as { city?: string; state?: string }) || {};
            const items = dbOrd.order_items || [];
            const status = dbOrd.status;
            const createdAt = new Date(dbOrd.created_at).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            });

            return (
              <div
                key={dbOrd.id}
                className="rounded-2xl border border-border bg-white p-6 shadow-sm space-y-4 text-xs hover:border-violet/40 transition-all"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-bold text-sm text-ink">{dbOrd.order_number}</span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[0.625rem] font-bold font-mono uppercase ${
                        ORDER_STATUS_METADATA[status as OrderStatus]?.badgeClass || "bg-violet/10 text-violet"
                      }`}
                    >
                      {ORDER_STATUS_METADATA[status as OrderStatus]?.label || status.replace(/_/g, " ")}
                    </span>
                    <span className="text-muted-foreground font-mono">Date: {createdAt}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-display text-base font-extrabold text-ink">
                      ₹{dbOrd.total}
                    </span>
                  </div>
                </div>

                {/* Items */}
                {items.length > 0 ? (
                  <div className="divide-y divide-border/60">
                    {items.map((line) => (
                      <div key={line.id} className="py-2.5 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-lg border border-border bg-paper p-1 shrink-0 flex items-center justify-center">
                            <ProductMockup kind="card" tone="transparent" className="h-full w-full" />
                          </div>
                          <div>
                            <div className="font-bold text-ink">{line.product_title}</div>
                            <div className="text-[0.6875rem] text-muted-foreground font-mono">
                              Quantity: {line.quantity}
                            </div>
                          </div>
                        </div>
                        <div className="font-mono font-semibold text-ink">₹{line.line_price}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-muted-foreground py-1">
                    Custom Print Order Registered.
                  </div>
                )}

                {/* Actions Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <div className="text-[0.6875rem] text-muted-foreground">
                    Dispatch To: <strong>{delivery.city || "Standard Destination"}{delivery.state ? `, ${delivery.state}` : ""}</strong>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/orders/${encodeURIComponent(dbOrd.order_number)}?tab=invoice`}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3.5 py-1.5 font-semibold text-ink hover:bg-paper transition-all"
                    >
                      <FileText className="size-3" />
                      <span>Invoice</span>
                    </Link>

                    <Link
                      href={`/orders/${encodeURIComponent(dbOrd.order_number)}`}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-violet px-4 py-1.5 font-bold text-white shadow-lift hover:bg-violet-lift transition-all"
                    >
                      <Printer className="size-3" />
                      <span>Track Production</span>
                      <ChevronRight className="size-3" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function useSyncExternalStoreHydration() {
  return React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}
