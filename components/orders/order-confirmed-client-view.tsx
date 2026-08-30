"use client";

import * as React from "react";
import Link from "next/link";
import { ProductMockup } from "@/components/shared/product-mockup";
import {
  CheckCircle2,
  FileCheck,
  Download,
  ArrowRight,
  Truck,
  Layers,
  Printer,
  ChevronRight,
} from "lucide-react";
import type { Database } from "@/lib/supabase/database.types";

type DbOrder = Database["public"]["Tables"]["orders"]["Row"] & {
  order_items?: Database["public"]["Tables"]["order_items"]["Row"][];
  order_events?: Database["public"]["Tables"]["order_events"]["Row"][];
};

interface OrderConfirmedClientViewProps {
  orderId: string;
  dbOrder: DbOrder | null;
}

export function OrderConfirmedClientView({
  orderId,
  dbOrder,
}: OrderConfirmedClientViewProps) {
  const isHydrated = useSyncExternalStoreHydration();

  if (!isHydrated) {
    return <div className="shell py-12 text-center text-xs text-muted-foreground">Loading confirmation details...</div>;
  }

  if (!dbOrder) {
    return (
      <div className="shell py-12 max-w-xl mx-auto text-center space-y-4">
        <h1 className="font-display text-2xl font-bold text-ink">Order Not Found</h1>
        <p className="text-xs text-muted-foreground">
          We couldn&apos;t find an order matching reference {orderId} or you do not have permission to view it.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 rounded-xl bg-violet px-6 py-3 text-xs font-bold text-white shadow-lift hover:bg-violet-lift transition-all"
        >
          <span>Return to Catalogue</span>
          <ArrowRight className="size-4" />
        </Link>
      </div>
    );
  }

  // ───────────────────────────────────────────────────────────────────────────
  // POSTGRESQL AUTHORITATIVE CONFIRMATION
  // ───────────────────────────────────────────────────────────────────────────
  const customer = (dbOrder.customer_snapshot as {
    fullName?: string;
    companyName?: string;
    email?: string;
    phone?: string;
  }) || {};

  const delivery = (dbOrder.delivery_snapshot as {
    addressLine1?: string;
    city?: string;
    state?: string;
    pincode?: string;
  }) || {};

  const items = dbOrder.order_items || [];

  return (
    <div className="space-y-10">
      {/* ── Success Header ─────────────────────────────────────────── */}
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-50/50 p-6 sm:p-10 text-center space-y-4 shadow-sm">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md">
          <CheckCircle2 className="size-8" />
        </div>

        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 font-mono text-xs font-bold text-emerald-800">
            <span>Payment Verified ({dbOrder.payment_method})</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-ink">
            Your Print Order is Confirmed!
          </h1>
          <p className="text-xs text-muted-foreground sm:text-sm max-w-lg mx-auto leading-relaxed">
            Thank you, <strong>{customer.fullName || "Customer"}</strong>. Your custom print job has entered our pre-press queue under reference <strong>{dbOrder.order_number}</strong>.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Link
            href={`/orders/${encodeURIComponent(dbOrder.order_number)}`}
            className="inline-flex items-center gap-2 rounded-xl bg-violet px-5 py-2.5 text-xs font-bold text-white shadow-lift hover:bg-violet-lift transition-all"
          >
            <Printer className="size-3.5" />
            <span>Track Order & Production</span>
            <ChevronRight className="size-3.5" />
          </Link>

          <Link
            href={`/orders/${encodeURIComponent(dbOrder.order_number)}?tab=invoice`}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-5 py-2.5 text-xs font-semibold text-ink hover:bg-paper transition-all"
          >
            <Download className="size-3.5 text-violet" />
            <span>Download GST Invoice</span>
          </Link>
        </div>
      </div>

      {/* ── 3-Step Immediate Pre-Press Next Steps ───────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border bg-white p-5 space-y-2 shadow-sm">
          <div className="flex items-center gap-2 text-violet font-bold text-xs">
            <FileCheck className="size-4" />
            <span>1. Automated Pre-Press Audit</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Our automated studio preflight checks resolution (300 DPI), bleed margins (3mm), and CMYK profile.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-white p-5 space-y-2 shadow-sm">
          <div className="flex items-center gap-2 text-violet font-bold text-xs">
            <Layers className="size-4" />
            <span>2. Digital Proof Generation</span>
          </div>
          <p className="text-xs text-muted-foreground">
            A high-resolution digital proof is prepared and queued for press operator calibration.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-white p-5 space-y-2 shadow-sm">
          <div className="flex items-center gap-2 text-violet font-bold text-xs">
            <Truck className="size-4" />
            <span>3. Fast Courier Dispatch</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Once printed, precision cut, and quality inspected, your job is dispatched to {delivery.city || "your city"}.
          </p>
        </div>
      </div>

      {/* ── Order Snapshot Breakdown ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6 text-xs">
          {/* Dispatch Destination */}
          <div className="rounded-2xl border border-border bg-white p-5 shadow-sm space-y-3">
            <h2 className="font-bold text-ink uppercase font-mono tracking-wider text-[0.6875rem] border-b border-border pb-2">
              Dispatch Destination
            </h2>
            <div className="space-y-1 text-muted-foreground">
              <div className="font-bold text-ink">{customer.fullName || "Customer"}</div>
              {customer.companyName && <div>{customer.companyName}</div>}
              <div>{delivery.addressLine1}</div>
              <div>{delivery.city}{delivery.state ? `, ${delivery.state}` : ""} — {delivery.pincode}</div>
              <div className="font-mono pt-1 text-ink">{customer.phone}</div>
            </div>
          </div>

          {/* Payment Snapshot */}
          <div className="rounded-2xl border border-border bg-white p-5 shadow-sm space-y-3">
            <h2 className="font-bold text-ink uppercase font-mono tracking-wider text-[0.6875rem] border-b border-border pb-2">
              Billing Breakdown
            </h2>
            <div className="space-y-2 text-muted-foreground">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono text-ink">₹{dbOrder.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (18%)</span>
                <span className="font-mono text-ink">₹{dbOrder.tax}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-mono text-emerald-600">
                  {dbOrder.shipping === 0 ? "FREE" : `₹${dbOrder.shipping}`}
                </span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between font-bold text-ink">
                <span>Total Paid</span>
                <span className="font-display text-base font-extrabold text-ink">₹{dbOrder.total}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ordered Lines */}
        <div className="lg:col-span-2 rounded-2xl border border-border bg-white p-6 shadow-sm space-y-4 text-xs">
          <h2 className="font-bold text-ink uppercase font-mono tracking-wider text-[0.6875rem] border-b border-border pb-3">
            Custom Job Specifications ({items.length} items)
          </h2>

          <div className="divide-y divide-border/60">
            {items.map((line) => {
              const options = (line.selected_options as Array<{ name: string; value: string }>) || [];
              const artwork = (line.artwork_summary as { summary?: string }) || {};

              return (
                <div key={line.id} className="py-4 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="size-12 rounded-lg border border-border bg-paper p-1 shrink-0 flex items-center justify-center">
                      <ProductMockup kind="card" tone="transparent" className="h-full w-full" />
                    </div>
                    <div className="space-y-1">
                      <div className="font-bold text-ink text-sm">{line.product_title}</div>
                      <div className="text-[0.6875rem] text-muted-foreground font-mono">
                        Quantity: {line.quantity}
                      </div>
                      {options.length > 0 && (
                        <div className="text-[0.6875rem] text-muted-foreground flex flex-wrap gap-1.5 pt-0.5">
                          {options.map((opt) => (
                            <span key={opt.name} className="rounded bg-paper border border-border px-1.5 py-0.5">
                              {opt.name}: <strong>{opt.value}</strong>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-mono font-bold text-sm text-ink">₹{line.line_price}</span>
                    {artwork?.summary && (
                      <div className="text-[0.6875rem] text-emerald-600 font-semibold">{artwork.summary}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
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
