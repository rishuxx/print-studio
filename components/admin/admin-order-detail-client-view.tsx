"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { updateOrderStatus } from "@/lib/supabase/actions";
import {
  ORDER_STATUS_METADATA,
  ALLOWED_STATUS_TRANSITIONS,
} from "@/lib/orders/lifecycle";
import type { Database, OrderStatus } from "@/lib/supabase/database.types";
import {
  ArrowLeft,
  Printer,
  CheckCircle2,
  Layers,
  Truck,
  CreditCard,
  FileText,
  Clock,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";

import { DirectDispatchCard } from "@/components/admin/shipping/direct-dispatch-card";
import { AdminCancelOrderModal } from "@/components/admin/admin-cancel-order-modal";

import type { ShippingShipment } from "@/lib/shipping/types";

type DbOrderFull = Database["public"]["Tables"]["orders"]["Row"] & {
  order_items?: Database["public"]["Tables"]["order_items"]["Row"][];
  order_events?: Database["public"]["Tables"]["order_events"]["Row"][];
};

interface AdminOrderDetailClientViewProps {
  dbOrder: DbOrderFull;
  existingShipments?: ShippingShipment[];
}

export function AdminOrderDetailClientView({
  dbOrder,
  existingShipments = [],
}: AdminOrderDetailClientViewProps) {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = React.useState(false);
  const [selectedNextStatus, setSelectedNextStatus] = React.useState<OrderStatus | "">("");
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [showCancelModal, setShowCancelModal] = React.useState(false);

  const currentStatus = dbOrder.status as OrderStatus;
  const currentMeta = ORDER_STATUS_METADATA[currentStatus];
  const allowedNextStatuses = ALLOWED_STATUS_TRANSITIONS[currentStatus] || [];
  const canCancel =
    currentStatus === "pending" ||
    currentStatus === "confirmed" ||
    currentStatus === "artwork_review" ||
    currentStatus === "proof_pending";

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
    notes?: string;
  }) || {};

  const items = dbOrder.order_items || [];
  const events = dbOrder.order_events || [];

  const formattedDate = new Date(dbOrder.created_at).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleRefreshDetail = () => {
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => setIsRefreshing(false), 500);
    toast.success("Order refreshed from PostgreSQL.");
  };

  const handleExecuteTransition = async () => {
    if (!selectedNextStatus) {
      toast.error("Please select a target status to advance.");
      return;
    }

    if (selectedNextStatus === "cancelled") {
      setShowCancelModal(true);
      return;
    }

    const nextMeta = ORDER_STATUS_METADATA[selectedNextStatus];
    if (
      !confirm(
        `Are you sure you want to transition Order #${dbOrder.order_number} to "${nextMeta?.label || selectedNextStatus}"?`
      )
    ) {
      return;
    }

    setIsTransitioning(true);
    try {
      const res = await updateOrderStatus(dbOrder.id, selectedNextStatus, currentStatus);
      if (res.success) {
        toast.success("Order status updated successfully!", {
          description: `Transitioned from ${currentMeta?.label} → ${nextMeta?.label}`,
        });
        setSelectedNextStatus("");
        router.refresh();
      } else {
        toast.error("Status transition rejected", {
          description: res.error || "Please verify the order state and retry.",
        });
      }
    } catch {
      toast.error("Network communication error", {
        description: "Could not reach database server.",
      });
    } finally {
      setIsTransitioning(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Bar Navigation & Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-1 text-xs font-bold text-muted-foreground hover:text-ink transition-colors"
            >
              <ArrowLeft className="size-3.5" />
              <span>Back to Console</span>
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="font-mono text-xs font-bold text-violet">
              {dbOrder.order_number}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-ink">
              Order #{dbOrder.order_number}
            </h1>
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold font-mono uppercase ${
                currentMeta?.badgeClass || "bg-violet/10 text-violet"
              }`}
            >
              {currentMeta?.label || currentStatus.replace(/_/g, " ")}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Received {formattedDate} · Invoice: {dbOrder.invoice_number || "Pending"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleRefreshDetail}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-white px-3.5 py-2 text-xs font-bold text-ink hover:bg-paper transition-all disabled:opacity-50"
          >
            <RotateCcw className={`size-3.5 text-muted-foreground ${isRefreshing ? "animate-spin" : ""}`} />
            <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
          </button>

          <Link
            href={`/orders/${encodeURIComponent(dbOrder.order_number)}?tab=invoice`}
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-white px-3.5 py-2 text-xs font-bold text-ink hover:bg-paper transition-all"
          >
            <FileText className="size-3.5 text-violet" />
            <span>View GST Invoice</span>
          </Link>

          {canCancel && (
            <button
              type="button"
              onClick={() => setShowCancelModal(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2 text-xs font-bold text-red-700 hover:bg-red-100 transition-all"
            >
              <span>Cancel Order</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Status Control & Details */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column (8 Cols): Status Machine, Timeline, Items */}
        <div className="lg:col-span-8 space-y-6">
          {/* Direct Logistics Partner Pincode Serviceability & Assignment */}
          <DirectDispatchCard
            orderId={dbOrder.id}
            orderNumber={dbOrder.order_number}
            pincode={delivery.pincode || "248007"}
            city={delivery.city || "Dehradun"}
            state={delivery.state || "Uttarakhand"}
            existingAwb={existingShipments[0]?.awb_number}
            carrierName={existingShipments[0]?.carrier?.name}
          />

          {/* Status Machine Action Card */}
          <div className="rounded-2xl border-2 border-violet/30 bg-violet/5 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-violet/20 pb-3">
              <h2 className="font-bold text-sm text-ink uppercase font-mono tracking-wider flex items-center gap-2">
                <Sparkles className="size-4 text-violet" />
                <span>Operational Status Dispatcher</span>
              </h2>
              <span className="text-[0.6875rem] font-mono text-muted-foreground">
                Current: <strong>{currentMeta?.label}</strong>
              </span>
            </div>

            {allowedNextStatuses.length === 0 ? (
              <div className="text-xs text-muted-foreground py-2">
                This order has reached terminal state (<strong>{currentMeta?.label}</strong>) and cannot be transitioned further.
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex-1">
                    <label className="block text-[0.6875rem] font-bold text-ink uppercase font-mono mb-1">
                      Select Next Permitted Transition
                    </label>
                    <select
                      value={selectedNextStatus}
                      onChange={(e) => {
                        const val = e.target.value as OrderStatus;
                        setSelectedNextStatus(val);
                        if (val === "cancelled") {
                          setShowCancelModal(true);
                        }
                      }}
                      disabled={isTransitioning}
                      className="w-full rounded-xl border border-border bg-white px-3 py-2 text-xs font-semibold text-ink focus:border-violet focus:outline-none focus:ring-1 focus:ring-violet shadow-sm"
                    >
                      <option value="">-- Choose Target Milestone --</option>
                      {allowedNextStatuses.map((st) => (
                        <option key={st} value={st}>
                          → {ORDER_STATUS_METADATA[st]?.label || st}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="button"
                    disabled={!selectedNextStatus || isTransitioning}
                    onClick={handleExecuteTransition}
                    className="mt-4 sm:mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-violet px-6 py-2.5 text-xs font-bold text-white shadow-lift hover:bg-violet-lift disabled:opacity-50 transition-all"
                  >
                    <Printer className="size-3.5" />
                    <span>{isTransitioning ? "Advancing State..." : "Execute Transition"}</span>
                  </button>
                </div>

                {selectedNextStatus && (
                  <div className="rounded-xl border border-violet/20 bg-white p-3 text-xs text-muted-foreground space-y-1">
                    <div className="font-bold text-ink">
                      Target Milestone: {ORDER_STATUS_METADATA[selectedNextStatus]?.eventTitle}
                    </div>
                    <p className="text-[0.6875rem] leading-relaxed">
                      {ORDER_STATUS_METADATA[selectedNextStatus]?.eventDescription}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Database Timeline History */}
          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="font-bold text-sm text-ink uppercase font-mono tracking-wider flex items-center gap-2">
                <Clock className="size-4 text-violet" />
                <span>PostgreSQL Lifecycle Audit ({events.length} events)</span>
              </h2>
              <span className="text-xs font-mono text-muted-foreground">Authoritative Feed</span>
            </div>

            <div className="space-y-6 relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
              {events.length > 0 ? (
                events.map((evt, idx) => (
                  <div key={evt.id || idx} className="relative space-y-1">
                    <div className="absolute -left-6 top-0.5 size-4 rounded-full border-2 bg-emerald-500 border-emerald-500 text-white flex items-center justify-center">
                      <CheckCircle2 className="size-3 text-white" />
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-ink">{evt.title}</span>
                      <span className="font-mono text-[0.6875rem] text-muted-foreground">
                        {new Date(evt.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {evt.description}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-xs text-muted-foreground py-2">No lifecycle events recorded.</div>
              )}
            </div>
          </div>

          {/* Ordered Line Items */}
          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="font-bold text-sm text-ink uppercase font-mono tracking-wider flex items-center gap-2">
                <Layers className="size-4 text-violet" />
                <span>Configured Print Items ({items.length})</span>
              </h2>
              <span className="font-mono font-bold text-sm text-ink">Total: ₹{dbOrder.total}</span>
            </div>

            <div className="divide-y divide-border/60">
              {items.map((line) => {
                const opts = (line.selected_options as Array<{ name: string; value: string }>) || [];
                const artwork = (line.artwork_summary as {
                  summary?: string;
                  storagePath?: string;
                  originalFileName?: string;
                  fileSizeBytes?: number;
                  mimeType?: string;
                }) || null;

                return (
                  <div key={line.id} className="py-4 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-ink text-sm">{line.product_title}</div>
                      <div className="font-mono font-bold text-ink">₹{line.line_price}</div>
                    </div>

                    <div className="text-[0.6875rem] text-muted-foreground font-mono">
                      Quantity: <strong>{line.quantity}</strong> · Unit Rate: <strong>₹{line.unit_price}</strong>
                      {line.sku && ` · SKU: ${line.sku}`}
                    </div>

                    {opts.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {opts.map((opt, oIdx) => (
                          <span key={oIdx} className="rounded bg-paper border border-border px-2 py-0.5 text-[0.6875rem] text-ink">
                            {opt.name}: <strong>{opt.value}</strong>
                          </span>
                        ))}
                      </div>
                    )}

                    {artwork && (
                      <div className="mt-2 rounded-xl bg-violet/5 border border-violet/20 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 truncate">
                          <FileText className="size-4 text-violet shrink-0" />
                          <div className="truncate">
                            <span className="font-bold text-ink block truncate">
                              {artwork.originalFileName || artwork.summary || "Attached Print Asset"}
                            </span>
                            <span className="text-[0.6875rem] text-muted-foreground font-mono">
                              {artwork.fileSizeBytes ? `${(artwork.fileSizeBytes / (1024 * 1024)).toFixed(2)} MB · ` : ""}
                              {artwork.storagePath ? `Path: ${artwork.storagePath}` : (artwork.summary || "")}
                            </span>
                          </div>
                        </div>

                        {artwork.storagePath && (
                          <button
                            type="button"
                            onClick={async () => {
                              try {
                                const { createArtworkSignedUrl } = await import("@/lib/supabase/actions");
                                const res = await createArtworkSignedUrl(dbOrder.id, artwork.storagePath!);
                                if (res.success && res.signedUrl) {
                                  window.open(res.signedUrl, "_blank");
                                } else {
                                  toast.error("Download failed", { description: res.error });
                                }
                              } catch {
                                toast.error("Download error occurred.");
                              }
                            }}
                            className="shrink-0 inline-flex items-center gap-1.5 rounded-lg bg-violet px-3 py-1.5 text-xs font-bold text-white shadow-lift hover:bg-violet-lift transition-all"
                          >
                            <FileText className="size-3 text-white" />
                            <span>Download Pre-Press Master</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (4 Cols): Customer, Shipping, Financial Summary */}
        <div className="lg:col-span-4 space-y-6">
          {/* Customer Snapshot */}
          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm space-y-3 text-xs">
            <h3 className="font-bold text-sm text-ink uppercase font-mono tracking-wider border-b border-border pb-2">
              Customer Information
            </h3>
            <div className="space-y-1.5 text-muted-foreground">
              <div>
                <span className="text-[0.6875rem] uppercase font-mono font-bold block text-ink">Full Name</span>
                <div className="font-bold text-ink text-sm">{customer.fullName || "—"}</div>
              </div>
              {customer.companyName && (
                <div>
                  <span className="text-[0.6875rem] uppercase font-mono font-bold block text-ink">Company</span>
                  <div>{customer.companyName}</div>
                </div>
              )}
              <div>
                <span className="text-[0.6875rem] uppercase font-mono font-bold block text-ink">Email Address</span>
                <div className="text-ink font-mono">{customer.email || "—"}</div>
              </div>
              <div>
                <span className="text-[0.6875rem] uppercase font-mono font-bold block text-ink">Phone Contact</span>
                <div className="text-ink font-mono">{customer.phone || "—"}</div>
              </div>
            </div>
          </div>

          {/* Delivery Snapshot */}
          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm space-y-3 text-xs">
            <h3 className="font-bold text-sm text-ink uppercase font-mono tracking-wider border-b border-border pb-2 flex items-center gap-1.5">
              <Truck className="size-4 text-violet" />
              <span>Shipping Destination</span>
            </h3>
            <div className="space-y-1 text-muted-foreground">
              <div className="font-bold text-ink">{customer.fullName || "Customer"}</div>
              <div>{delivery.addressLine1 || "Standard Delivery"}</div>
              <div>
                {delivery.city || "City"}{delivery.state ? `, ${delivery.state}` : ""} — {delivery.pincode || "—"}
              </div>
              {delivery.notes && (
                <div className="pt-2 text-[0.6875rem] italic text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200/60">
                  <strong>Delivery Landmark / Notes:</strong> {delivery.notes}
                </div>
              )}
            </div>
          </div>

          {/* Payment & Invoice Breakdown */}
          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm space-y-3 text-xs">
            <h3 className="font-bold text-sm text-ink uppercase font-mono tracking-wider border-b border-border pb-2 flex items-center gap-1.5">
              <CreditCard className="size-4 text-violet" />
              <span>Financial Audit</span>
            </h3>

            <div className="space-y-2 text-muted-foreground pt-1">
              <div className="flex justify-between">
                <span>Payment Status:</span>
                <span className="font-mono font-bold text-emerald-700 uppercase">{dbOrder.payment_status}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Method:</span>
                <span className="font-mono text-ink">{dbOrder.payment_method || "Online"}</span>
              </div>
              {dbOrder.payment_reference && (
                <div className="flex justify-between">
                  <span>Transaction Ref:</span>
                  <span className="font-mono text-ink">{dbOrder.payment_reference}</span>
                </div>
              )}

              <div className="border-t border-border pt-2 space-y-1">
                <div className="flex justify-between">
                  <span>Taxable Subtotal:</span>
                  <span className="font-mono font-semibold text-ink">₹{dbOrder.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (18%):</span>
                  <span className="font-mono font-semibold text-ink">₹{dbOrder.tax}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Fee:</span>
                  <span className="font-mono font-semibold text-emerald-600">
                    {dbOrder.shipping === 0 ? "FREE" : `₹${dbOrder.shipping}`}
                  </span>
                </div>
                {dbOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount:</span>
                    <span className="font-mono">-₹{dbOrder.discount}</span>
                  </div>
                )}
                <div className="border-t border-border pt-2 flex justify-between items-baseline font-bold text-sm text-ink">
                  <span>Total Amount:</span>
                  <span className="font-display text-lg font-extrabold text-ink">₹{dbOrder.total}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Production-Grade Order Cancellation & Refund Orchestration Modal */}
      <AdminCancelOrderModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        orderId={dbOrder.id}
        orderNumber={dbOrder.order_number}
        customerName={customer.fullName}
        customerEmail={customer.email}
        currentStatus={currentStatus}
        paymentStatus={dbOrder.payment_status || "unpaid"}
        grossTotal={Number(dbOrder.total || 0)}
        paymentReference={dbOrder.payment_reference || undefined}
      />
    </div>
  );
}
