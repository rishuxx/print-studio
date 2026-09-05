"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { requestCancelDatabaseOrder } from "@/lib/supabase/actions";
import { canCancelOrderStatus, ORDER_STATUS_METADATA } from "@/lib/orders/lifecycle";
import {
  FileText,
  Printer,
  CheckCircle2,
  ShieldCheck,
  Download,
  AlertCircle,
  XCircle,
  ArrowLeft,
  Clock,
} from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { toast } from "sonner";
import type { Database, OrderStatus } from "@/lib/supabase/database.types";

import { CustomerShipmentCard } from "@/lib/../components/shipping/customer-shipment-card";
import type { ShippingShipment } from "@/lib/shipping/types";

type DbOrder = Database["public"]["Tables"]["orders"]["Row"] & {
  order_items?: Database["public"]["Tables"]["order_items"]["Row"][];
  order_events?: Database["public"]["Tables"]["order_events"]["Row"][];
};

import type { ArtworkAssetRecord } from "@/lib/artwork/types";
import type { ResolutionRequestRecord } from "@/lib/resolutions/types";
import { OrderArtworkCard } from "./order-artwork-card";
import { OrderResolutionCard } from "@/components/resolutions/order-resolution-card";

interface OrderDetailClientViewProps {
  orderId: string;
  initialTab: "tracking" | "invoice";
  dbOrder: DbOrder | null;
  shipments?: ShippingShipment[];
  cancellation?: Record<string, unknown> | null;
  refunds?: Array<Record<string, unknown>>;
  artworkAssets?: ArtworkAssetRecord[];
  resolution?: ResolutionRequestRecord | null;
}

export function OrderDetailClientView({
  orderId,
  initialTab,
  dbOrder,
  shipments = [],
  cancellation,
  refunds = [],
  artworkAssets = [],
  resolution = null,
}: OrderDetailClientViewProps) {
  const router = useRouter();
  const isHydrated = useSyncExternalStoreHydration();

  const [activeTab, setActiveTab] = React.useState<"tracking" | "invoice">(initialTab);
  const [isCancelling, setIsCancelling] = React.useState(false);

  if (!isHydrated) {
    return <div className="shell py-12 text-center text-xs text-muted-foreground">Loading order details...</div>;
  }

  // Strictly authoritative database order
  if (!dbOrder) {
    return (
      <div className="shell py-12 max-w-xl mx-auto text-center space-y-4">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-paper text-muted-foreground">
          <AlertCircle className="size-6 text-violet" />
        </div>
        <h1 className="font-display text-2xl font-bold text-ink">Order Reference Not Found</h1>
        <p className="text-xs text-muted-foreground">
          No order matching &ldquo;{orderId}&rdquo; was found.
        </p>
        <Link
          href="/orders"
          className="inline-flex items-center gap-2 rounded-xl bg-violet px-6 py-2.5 text-xs font-bold text-white shadow-lift hover:bg-violet-lift transition-all"
        >
          <ArrowLeft className="size-4" />
          <span>Return to My Orders</span>
        </Link>
      </div>
    );
  }

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
  const events = dbOrder.order_events || [];
  const isCancelled = dbOrder.status === "cancelled";

  const hasRefund =
    (refunds && refunds.length > 0) ||
    dbOrder.payment_status === "refunded" ||
    dbOrder.payment_status === "partially_refunded" ||
    cancellation?.refund_eligibility === "FULL_REFUND" ||
    cancellation?.refund_eligibility === "PARTIAL_REFUND";

  const primaryRefund = (refunds && refunds.length > 0 ? refunds[0] : null) || (
    hasRefund
      ? {
          amount_minor: Math.round(Number((cancellation as { refund_amount_minor?: number })?.refund_amount_minor || (Number(dbOrder.total || 0) * 100))),
          provider_status: "PROCESSED",
          provider_refund_id: `rfnd_${dbOrder.order_number.replace(/\D/g, "")}`,
          acquirer_reference: dbOrder.payment_reference || "Razorpay Gateway",
        }
      : null
  );

  const orderFormattedDate = new Date(dbOrder.created_at).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const handlePrintInvoice = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6 no-print">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-ink">
              Order #{dbOrder.order_number}
            </h1>
            <span
              className={`rounded-full px-2.5 py-0.5 text-[0.625rem] font-bold font-mono uppercase ${
                ORDER_STATUS_METADATA[dbOrder.status as OrderStatus]?.badgeClass || "bg-violet/10 text-violet"
              }`}
            >
              {ORDER_STATUS_METADATA[dbOrder.status as OrderStatus]?.label || dbOrder.status.replace(/_/g, " ")}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Placed on {orderFormattedDate} · Payment via {dbOrder.payment_method || "Online"} ({dbOrder.payment_reference || "VERIFIED"})
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("tracking")}
            className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === "tracking"
                ? "bg-ink text-white shadow-sm"
                : "bg-paper border border-border text-muted-foreground hover:text-ink"
            }`}
          >
            <Printer className="size-3.5" />
            <span>Production Status</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("invoice")}
            className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === "invoice"
                ? "bg-ink text-white shadow-sm"
                : "bg-paper border border-border text-muted-foreground hover:text-ink"
            }`}
          >
            <FileText className="size-3.5" />
            <span>Tax Invoice</span>
          </button>
        </div>
      </div>

      {/* Customer Cancellation & Financial Refund Banner */}
      {isCancelled && (
        <div className="rounded-2xl border border-red-200 bg-red-50/40 p-5 sm:p-6 space-y-4 no-print">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-red-200/60 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-red-600 text-white font-bold">
                <XCircle className="size-5" />
              </div>
              <div>
                <h2 className="font-display text-base font-bold text-red-950">
                  Order Cancelled
                </h2>
                <p className="text-xs text-red-800">
                  {((cancellation as { customer_message?: string })?.customer_message) || "This order was cancelled prior to press run."}
                </p>
              </div>
            </div>
            {primaryRefund && (
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                  REFUND {((primaryRefund.provider_status as string) || "PROCESSED").toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Refund Breakdown Details */}
          {primaryRefund ? (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                <div className="p-3.5 rounded-xl bg-white border border-red-200 space-y-1 shadow-xs">
                  <div className="text-[0.625rem] uppercase font-mono text-muted-foreground">Refunded Amount</div>
                  <div className="font-display text-lg font-extrabold text-emerald-600 font-mono">
                    ₹{(Number(primaryRefund.amount_minor || 0) / 100).toFixed(2)}
                  </div>
                  <div className="text-[0.625rem] text-muted-foreground">Full Source Reversal</div>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-red-200 space-y-1 shadow-xs">
                  <div className="text-[0.625rem] uppercase font-mono text-muted-foreground">Destination Account</div>
                  <div className="font-bold text-ink text-xs">Original Payment Source</div>
                  <div className="text-[0.6875rem] text-muted-foreground font-mono">
                    {dbOrder.payment_method?.toUpperCase() || "UPI / CARD / NETBANKING"}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-red-200 space-y-1 shadow-xs">
                  <div className="text-[0.625rem] uppercase font-mono text-muted-foreground">Gateway Ref / RRN</div>
                  <div className="font-mono font-bold text-violet text-xs truncate">
                    {(primaryRefund.provider_refund_id as string) || (primaryRefund.acquirer_reference as string) || "Razorpay Direct"}
                  </div>
                  <div className="text-[0.625rem] text-muted-foreground">Authoritative Payment Gateway Ref</div>
                </div>
              </div>

              {/* 3–7 Business Days Turnaround Time Notice */}
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/90 p-3.5 flex items-start gap-3 text-emerald-950 text-xs shadow-xs">
                <Clock className="size-4 shrink-0 text-emerald-700 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                    <span>Source Refund Initiated — Processing Cycle Notice</span>
                  </div>
                  <p className="text-[0.6875rem] text-emerald-800 leading-relaxed">
                    The refund has been dispatched directly back to your original payment method. Depending on your bank or UPI service provider&apos;s settlement schedule, the reversed funds typically reflect in your bank account / statement within <strong>3 to 7 business days</strong>. No manual action is required.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-xs text-red-800">
              No financial refund was required as payment was not captured for this order.
            </div>
          )}
        </div>
      )}

      {/* TAB 1: TRACKING */}
      {activeTab === "tracking" && (
        <div className="space-y-6 no-print">
          {/* Artwork & Digital Proof Review Section */}
          <OrderArtworkCard
            orderId={dbOrder.id}
            orderNumber={dbOrder.order_number}
            assets={artworkAssets}
            items={items}
            onRefresh={() => router.refresh()}
          />

          {/* Live Carrier Shipments & Waybills */}
          {shipments && shipments.length > 0 && (
            <CustomerShipmentCard shipments={shipments} />
          )}

          {/* Returns, Replacements & Post-Delivery Resolutions Section */}
          <OrderResolutionCard
            orderId={dbOrder.id}
            orderNumber={dbOrder.order_number}
            orderStatus={dbOrder.status}
            items={items}
            existingResolution={resolution}
            onRefresh={() => router.refresh()}
          />

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7 space-y-6">
              <div className="rounded-2xl border border-border bg-white p-6 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <h2 className="font-bold text-sm text-ink uppercase font-mono tracking-wider">
                    Production & Dispatch Timeline
                  </h2>
                  <span className="text-xs text-muted-foreground">
                    Estimated Dispatch: 2–3 Working Days
                  </span>
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
                    <div className="relative space-y-1">
                      <div className="absolute -left-6 top-0.5 size-4 rounded-full border-2 bg-violet border-violet text-white flex items-center justify-center animate-pulse">
                        <CheckCircle2 className="size-3 text-white" />
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-violet">Pre-Press & Artwork Audit</span>
                        <span className="font-mono text-[0.6875rem] text-muted-foreground">Active</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Our technicians are auditing print files for 300 DPI resolution, 3mm bleed margin, and CMYK color profiles.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-paper p-6 space-y-3 text-xs">
                <h3 className="font-bold text-ink flex items-center gap-2">
                  <ShieldCheck className="size-4 text-violet" />
                  <span>Studio Pre-Press & Quality Assurance Note</span>
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {dbOrder.notes || "Order registered in automated pre-press queue. Digital proof generation in progress."}
                </p>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-6">
              <div className="rounded-2xl border border-border bg-white p-6 shadow-sm space-y-3 text-xs">
                <h3 className="font-bold text-sm text-ink uppercase font-mono tracking-wider border-b border-border pb-2">
                  Shipping Destination
                </h3>
                <div className="space-y-1 text-muted-foreground">
                  <div className="font-bold text-ink">{customer.fullName || "Customer"}</div>
                  {customer.companyName && <div>{customer.companyName}</div>}
                  <div>{delivery.addressLine1 || "Standard Destination"}</div>
                  <div>{delivery.city || ""}{delivery.state ? `, ${delivery.state}` : ""} — {delivery.pincode || ""}</div>
                  {customer.phone && <div className="pt-1 font-mono text-ink">Phone: {customer.phone}</div>}
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-white p-6 shadow-sm space-y-4 text-xs">
                <h3 className="font-bold text-sm text-ink uppercase font-mono tracking-wider border-b border-border pb-2">
                  Item Specifications ({items.length})
                </h3>

                <div className="divide-y divide-border/60">
                  {items.map((line) => {
                    const opts = (line.selected_options as Array<{ name: string; value: string }>) || [];
                    const artwork = (line.artwork_summary as {
                      summary?: string;
                      storagePath?: string;
                      originalFileName?: string;
                      fileSizeBytes?: number;
                    }) || null;

                    return (
                      <div key={line.id} className="py-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-ink">{line.product_title}</span>
                          <span className="font-mono font-semibold text-ink">₹{line.line_price}</span>
                        </div>
                        {(() => {
                          const rawOpts = line.selected_options as any;
                          const tierQty = rawOpts?.tierQty || rawOpts?.configurationSnapshot?.tierQty || null;
                          const priceUnit = rawOpts?.priceUnit || "cards";
                          const totalUnits = tierQty ? line.quantity * tierQty : line.quantity;

                          return (
                            <div className="text-[0.6875rem] text-muted-foreground font-mono">
                              Quantity: <strong className="text-ink font-bold">{tierQty ? `${totalUnits} ${priceUnit} (${line.quantity} batch × ${tierQty})` : line.quantity}</strong>
                            </div>
                          );
                        })()}
                        {opts.length > 0 && (
                          <div className="space-y-1 pt-1">
                            {opts.map((opt, oIdx) => (
                              <div key={oIdx} className="flex justify-between text-muted-foreground text-[0.6875rem]">
                                <span>{opt.name}:</span>
                                <span className="font-medium text-ink">{opt.value}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {artwork && (
                          <div className="mt-2 rounded-xl bg-violet/5 border border-violet/20 p-2.5 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 truncate">
                              <FileText className="size-3.5 text-violet shrink-0" />
                              <div className="truncate">
                                <span className="font-bold text-ink block truncate">
                                  {artwork.originalFileName || artwork.summary || "Artwork File Attached"}
                                </span>
                                {artwork.fileSizeBytes && (
                                  <span className="text-[0.625rem] text-muted-foreground font-mono">
                                    {(artwork.fileSizeBytes / (1024 * 1024)).toFixed(2)} MB
                                  </span>
                                )}
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
                                      toast.error("Unable to access artwork", { description: res.error });
                                    }
                                  } catch {
                                    toast.error("Download error occurred.");
                                  }
                                }}
                                className="shrink-0 inline-flex items-center gap-1 rounded-lg bg-white border border-border px-2.5 py-1 text-[0.6875rem] font-bold text-ink hover:bg-paper shadow-sm transition-all"
                              >
                                <Download className="size-3 text-violet" />
                                <span>Download</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {canCancelOrderStatus(dbOrder.status) && (
                  <div className="pt-2 border-t border-border flex justify-between items-center">
                    <span className="text-[0.6875rem] text-muted-foreground">Prior to plate imaging & press run</span>
                    <button
                      type="button"
                      disabled={isCancelling}
                      onClick={async () => {
                        if (confirm("Are you sure you want to cancel this order prior to press scheduling?")) {
                          setIsCancelling(true);
                          try {
                            const res = await requestCancelDatabaseOrder(dbOrder.id);
                            if (res.success) {
                              toast.success("Order cancelled successfully.");
                              router.refresh();
                            } else {
                              toast.error("Cancellation failed", { description: res.error });
                            }
                          } catch {
                            toast.error("An unexpected network error occurred.");
                          } finally {
                            setIsCancelling(false);
                          }
                        }
                      }}
                      className="inline-flex items-center gap-1 text-[0.6875rem] font-semibold text-red-600 hover:underline disabled:opacity-50"
                    >
                      <XCircle className="size-3" />
                      <span>{isCancelling ? "Cancelling..." : "Cancel Order"}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

        {/* TAB 2: INVOICE */}
        {activeTab === "invoice" && (
          <div className="space-y-6">
            <div className="flex justify-end gap-3 no-print">
              <button
                type="button"
                onClick={handlePrintInvoice}
                className="inline-flex items-center gap-2 rounded-xl bg-violet px-5 py-2.5 text-xs font-bold text-white shadow-lift hover:bg-violet-lift transition-all"
              >
                <Download className="size-3.5" />
                <span>Print / Download Invoice PDF</span>
              </button>
            </div>

            <div className="rounded-2xl border border-border bg-white p-8 sm:p-12 shadow-sm space-y-8 text-xs leading-relaxed max-w-4xl mx-auto print:border-none print:shadow-none print:p-0">
              <div className="flex flex-col sm:flex-row justify-between gap-6 border-b border-border pb-6">
                <div className="space-y-1">
                  <div className="font-display text-2xl font-extrabold text-ink">
                    {siteConfig.businessName}
                  </div>
                  <div className="text-muted-foreground">{siteConfig.address.line1}, {siteConfig.address.line2}</div>
                  <div className="text-muted-foreground">{siteConfig.address.city}, {siteConfig.address.state} — {siteConfig.address.pincode}</div>
                  <div className="text-muted-foreground font-mono">GSTIN: {siteConfig.operations.gstin}</div>
                  <div className="text-muted-foreground">Support: {siteConfig.contact.email}</div>
                </div>

                <div className="text-left sm:text-right space-y-1">
                  <div className="font-display text-xl font-bold text-ink uppercase tracking-wider">
                    Tax Invoice
                  </div>
                  <div className="font-mono font-bold text-sm text-violet">{dbOrder.invoice_number}</div>
                  <div className="text-muted-foreground">Date: {orderFormattedDate}</div>
                  <div className="text-muted-foreground">Order Ref: {dbOrder.order_number}</div>
                  <div className="font-mono text-emerald-600 font-bold">STATUS: PAID ({dbOrder.payment_method})</div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-b border-border pb-6">
                <div className="space-y-1">
                  <div className="font-bold text-ink uppercase font-mono tracking-wider text-[0.6875rem]">Billed To:</div>
                  <div className="font-bold text-ink">{customer.fullName || "Customer"}</div>
                  {customer.companyName && <div>{customer.companyName}</div>}
                  <div className="text-muted-foreground">{customer.email}</div>
                  {customer.phone && <div className="text-muted-foreground font-mono">{customer.phone}</div>}
                </div>

                <div className="space-y-1">
                  <div className="font-bold text-ink uppercase font-mono tracking-wider text-[0.6875rem]">Shipped To:</div>
                  <div className="font-bold text-ink">{customer.fullName || "Customer"}</div>
                  <div className="text-muted-foreground">{delivery.addressLine1}</div>
                  <div className="text-muted-foreground">{delivery.city}{delivery.state ? `, ${delivery.state}` : ""} — {delivery.pincode}</div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border text-[0.6875rem] uppercase font-mono text-muted-foreground">
                      <th className="py-2.5 pr-4">Description & Specs</th>
                      <th className="py-2.5 px-3">HSN/SAC</th>
                      <th className="py-2.5 px-3 text-center">Batch / Qty</th>
                      <th className="py-2.5 px-3 text-right">Rate</th>
                      <th className="py-2.5 pl-4 text-right">Taxable Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {items.map((line) => {
                      const rawOpts = line.selected_options as any;
                      const tierQty = rawOpts?.tierQty || rawOpts?.configurationSnapshot?.tierQty || null;
                      const totalUnits = tierQty ? line.quantity * tierQty : line.quantity;
                      return (
                        <tr key={line.id}>
                          <td className="py-3 pr-4">
                            <div className="font-bold text-ink">{line.product_title}</div>
                          </td>
                          <td className="py-3 px-3 font-mono text-muted-foreground">4911</td>
                          <td className="py-3 px-3 text-center font-mono font-bold">
                            {tierQty ? `${totalUnits} pcs (${line.quantity} batch)` : line.quantity}
                          </td>
                          <td className="py-3 px-3 text-right font-mono">₹{line.unit_price}</td>
                          <td className="py-3 pl-4 text-right font-mono font-semibold text-ink">₹{line.line_price}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end pt-4 border-t border-border">
                <div className="w-full sm:w-72 space-y-2">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Taxable Subtotal:</span>
                    <span className="font-mono font-semibold text-ink">₹{dbOrder.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>CGST (9%):</span>
                    <span className="font-mono font-semibold text-ink">₹{(dbOrder.tax / 2).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>SGST (9%):</span>
                    <span className="font-mono font-semibold text-ink">₹{(dbOrder.tax / 2).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping Charges:</span>
                    <span className="font-mono font-semibold text-emerald-600">
                      {dbOrder.shipping === 0 ? "FREE" : `₹${dbOrder.shipping}`}
                    </span>
                  </div>
                  <div className="border-t border-border pt-2 flex justify-between items-baseline font-bold text-sm text-ink">
                    <span>Total Amount Paid:</span>
                    <span className="font-display text-xl font-extrabold text-ink">₹{dbOrder.total}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-border pt-6 text-center text-[0.6875rem] text-muted-foreground space-y-1">
                <p>This is a computer-generated GST tax invoice. No signature is required.</p>
                <p>Thank you for choosing {siteConfig.businessName} for your custom printing requirements.</p>
              </div>
            </div>
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
