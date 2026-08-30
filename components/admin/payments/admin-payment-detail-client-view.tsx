"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  X,
  Package,
  DollarSign,
  Activity,
  Clock,
} from "lucide-react";
import { processPaymentRefund } from "@/lib/payments/refunds";
import { reconcilePayment } from "@/lib/payments/reconciliation";
import { toast } from "sonner";

interface AdminPaymentDetailClientViewProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dbPayment: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  refunds: any[];
}

export function AdminPaymentDetailClientView({
  dbPayment,
  refunds,
}: AdminPaymentDetailClientViewProps) {
  const router = useRouter();
  const [isReconciling, setIsReconciling] = React.useState(false);
  const [showRefundModal, setShowRefundModal] = React.useState(false);
  const [refundType, setRefundType] = React.useState<"full" | "partial">("full");
  const [partialAmountRupees, setPartialAmountRupees] = React.useState("");
  const [refundReason, setRefundReason] = React.useState("");
  const [isSubmittingRefund, setIsSubmittingRefund] = React.useState(false);

  const amountMinor = Number(dbPayment.amount_minor || dbPayment.amount || 0);
  const amountRefundedMinor = Number(dbPayment.amount_refunded_minor || 0);
  const remainingRefundableMinor = Math.max(0, amountMinor - amountRefundedMinor);

  const order = dbPayment.orders;
  const customer = (order?.customer_snapshot as { fullName?: string; email?: string; phone?: string }) || {};
  const isCaptured = dbPayment.status === "captured" || dbPayment.status === "partially_refunded";
  const canRefund = isCaptured && remainingRefundableMinor > 0;

  const handleReconcileNow = async () => {
    setIsReconciling(true);
    try {
      const res = await reconcilePayment(dbPayment.id);
      if (res.success && res.result) {
        if (res.result.isAmountMatched) {
          toast.success("Reconciliation verified! Payment is clean.");
        } else {
          toast.warning("Discrepancy detected during gateway check.", {
            description: res.result.notes,
          });
        }
        router.refresh();
      } else {
        toast.error("Reconciliation failed", { description: res.error });
      }
    } catch {
      toast.error("Error communicating with gateway.");
    } finally {
      setIsReconciling(false);
    }
  };

  const handleExecuteRefund = async () => {
    let refundAmountMinor = remainingRefundableMinor;
    if (refundType === "partial") {
      const parsed = parseFloat(partialAmountRupees);
      if (isNaN(parsed) || parsed <= 0) {
        toast.error("Please enter a valid partial refund amount in rupees.");
        return;
      }
      refundAmountMinor = Math.round(parsed * 100);
    }

    if (refundAmountMinor <= 0 || refundAmountMinor > remainingRefundableMinor) {
      toast.error(`Refund amount must be between ₹1.00 and ₹${(remainingRefundableMinor / 100).toFixed(2)}.`);
      return;
    }

    if (!refundReason.trim()) {
      toast.error("Please provide an administrative reason for the refund.");
      return;
    }

    setIsSubmittingRefund(true);
    try {
      const res = await processPaymentRefund({
        paymentId: dbPayment.id,
        amountMinor: refundAmountMinor,
        reason: refundReason.trim(),
      });

      if (res.success) {
        toast.success(`Refund of ₹${(refundAmountMinor / 100).toFixed(2)} issued successfully via Razorpay.`);
        setShowRefundModal(false);
        setPartialAmountRupees("");
        setRefundReason("");
        router.refresh();
      } else {
        toast.error("Refund rejected by gateway", { description: res.error });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Refund execution error.";
      toast.error(msg);
    } finally {
      setIsSubmittingRefund(false);
    }
  };

  return (
    <div className="space-y-8 text-xs">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link
              href="/admin/payments"
              className="inline-flex items-center gap-1 font-bold text-muted-foreground hover:text-ink transition-colors"
            >
              <ArrowLeft className="size-3.5" />
              <span>Back to Payments</span>
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="font-mono font-bold text-violet">{dbPayment.id}</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-ink">
              Transaction ₹{(amountMinor / 100).toFixed(2)}
            </h1>
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold font-mono uppercase ${
                dbPayment.status === "captured"
                  ? "bg-emerald-100 text-emerald-800"
                  : dbPayment.status === "failed"
                  ? "bg-red-100 text-red-700"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {dbPayment.status.replace(/_/g, " ")}
            </span>
          </div>
          <p className="text-muted-foreground">
            Provider Reference: <strong className="font-mono text-ink">{dbPayment.provider_payment_id || "None (Awaiting Gateway)"}</strong>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleReconcileNow}
            disabled={isReconciling}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-white px-3.5 py-2 font-bold text-ink hover:bg-paper transition-all disabled:opacity-50"
          >
            <RotateCcw className={`size-3.5 text-muted-foreground ${isReconciling ? "animate-spin" : ""}`} />
            <span>{isReconciling ? "Checking Gateway..." : "Reconcile Gateway"}</span>
          </button>

          {canRefund && (
            <button
              type="button"
              onClick={() => setShowRefundModal(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-violet px-4 py-2 font-bold text-white shadow-lift hover:bg-violet-lift transition-all"
            >
              <DollarSign className="size-3.5" />
              <span>Issue Gateway Refund</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Details */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column (8 Cols): Gateway Information & Refund History */}
        <div className="lg:col-span-8 space-y-6">
          {/* Reconciliation Audit Card */}
          <div className="rounded-2xl border border-border bg-white p-6 shadow-xs space-y-4">
            <h2 className="font-bold text-sm text-ink uppercase font-mono tracking-wider flex items-center gap-2 border-b border-border pb-3">
              <Activity className="size-4 text-violet" />
              <span>Automated Gateway Audit</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-paper rounded-xl border border-border space-y-1">
                <span className="text-[0.6875rem] font-bold text-muted-foreground uppercase font-mono block">
                  Reconciliation Status
                </span>
                <div className="font-bold text-ink flex items-center gap-1.5">
                  {dbPayment.reconciliation_state === "reconciled" ? (
                    <CheckCircle2 className="size-4 text-emerald-600" />
                  ) : (
                    <AlertTriangle className="size-4 text-red-600" />
                  )}
                  <span>{dbPayment.reconciliation_state.replace(/_/g, " ")}</span>
                </div>
              </div>

              <div className="p-3 bg-paper rounded-xl border border-border space-y-1">
                <span className="text-[0.6875rem] font-bold text-muted-foreground uppercase font-mono block">
                  Signature Verification
                </span>
                <div className="font-bold text-ink flex items-center gap-1.5">
                  {dbPayment.signature_verified ? (
                    <CheckCircle2 className="size-4 text-emerald-600" />
                  ) : (
                    <Clock className="size-4 text-muted-foreground" />
                  )}
                  <span>{dbPayment.signature_verified ? "HMAC-SHA256 Passed" : "Pending Signature"}</span>
                </div>
              </div>

              <div className="p-3 bg-paper rounded-xl border border-border space-y-1">
                <span className="text-[0.6875rem] font-bold text-muted-foreground uppercase font-mono block">
                  Webhook Confirmation
                </span>
                <div className="font-bold text-ink flex items-center gap-1.5">
                  {dbPayment.webhook_confirmed ? (
                    <CheckCircle2 className="size-4 text-emerald-600" />
                  ) : (
                    <Clock className="size-4 text-muted-foreground" />
                  )}
                  <span>{dbPayment.webhook_confirmed ? "Authoritative Verified" : "Direct Callback Verified"}</span>
                </div>
              </div>
            </div>

            {dbPayment.reconciliation_notes && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 leading-relaxed">
                <strong>Reconciliation Diagnostic:</strong> {dbPayment.reconciliation_notes}
              </div>
            )}
          </div>

          {/* Payment Identification Details */}
          <div className="rounded-2xl border border-border bg-white p-6 shadow-xs space-y-4">
            <h2 className="font-bold text-sm text-ink uppercase font-mono tracking-wider flex items-center gap-2 border-b border-border pb-3">
              <CreditCard className="size-4 text-violet" />
              <span>Razorpay Provider Metadata</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-muted-foreground">
              <div>
                <span className="text-[0.6875rem] font-bold text-ink uppercase font-mono block">Razorpay Order ID</span>
                <span className="font-mono text-ink text-sm">{dbPayment.provider_order_id}</span>
              </div>

              <div>
                <span className="text-[0.6875rem] font-bold text-ink uppercase font-mono block">Razorpay Payment ID</span>
                <span className="font-mono text-ink text-sm">{dbPayment.provider_payment_id || "None"}</span>
              </div>

              <div>
                <span className="text-[0.6875rem] font-bold text-ink uppercase font-mono block">Gateway Status</span>
                <span className="font-mono text-ink capitalize">{dbPayment.status}</span>
              </div>

              <div>
                <span className="text-[0.6875rem] font-bold text-ink uppercase font-mono block">Payment Method</span>
                <span className="font-mono text-ink capitalize">{dbPayment.method || "Online"}</span>
              </div>
            </div>
          </div>

          {/* Refund Audit History */}
          <div className="rounded-2xl border border-border bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="font-bold text-sm text-ink uppercase font-mono tracking-wider flex items-center gap-2">
                <DollarSign className="size-4 text-violet" />
                <span>Refund Audit Log ({refunds.length})</span>
              </h2>
              <span className="font-mono font-bold text-ink">
                Total Refunded: ₹{(amountRefundedMinor / 100).toFixed(2)}
              </span>
            </div>

            {refunds.length === 0 ? (
              <div className="text-muted-foreground text-center py-6">
                No refunds have been issued for this transaction.
              </div>
            ) : (
              <div className="divide-y divide-border/60">
                {refunds.map((ref) => (
                  <div key={ref.id} className="py-3.5 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-ink">
                        ₹{(Number(ref.amount_minor) / 100).toFixed(2)}
                      </span>
                      <span className="rounded bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[0.625rem] font-mono font-bold uppercase">
                        {ref.status}
                      </span>
                    </div>
                    <div className="text-muted-foreground text-[0.6875rem]">
                      Provider Refund ID: <strong className="font-mono text-ink">{ref.provider_refund_id || "Pending"}</strong> · Reason: {ref.reason || "Administrative"}
                    </div>
                    <div className="text-muted-foreground font-mono text-[0.625rem]">
                      {new Date(ref.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (4 Cols): Linked Order Snapshot & Customer */}
        <div className="lg:col-span-4 space-y-6">
          {/* Associated Order Card */}
          <div className="rounded-2xl border border-border bg-white p-6 shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-ink uppercase font-mono tracking-wider border-b border-border pb-2 flex items-center gap-1.5">
              <Package className="size-4 text-violet" />
              <span>Associated Order</span>
            </h3>

            {order ? (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Link
                    href={`/admin/orders/${encodeURIComponent(order.order_number)}`}
                    className="font-bold text-violet hover:underline text-sm font-mono"
                  >
                    {order.order_number}
                  </Link>
                  <span className="rounded-full bg-violet/10 text-violet px-2 py-0.5 font-mono text-[0.625rem] font-bold uppercase">
                    {order.status}
                  </span>
                </div>
                <div className="text-muted-foreground">
                  Order Total: <strong className="font-mono text-ink font-bold">₹{order.total}</strong>
                </div>
                <div className="pt-2 border-t border-border/60">
                  <Link
                    href={`/admin/orders/${encodeURIComponent(order.order_number)}`}
                    className="inline-flex items-center gap-1 text-violet font-bold hover:underline"
                  >
                    <span>Open Order Console</span>
                    <ArrowLeft className="size-3 rotate-180" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-muted-foreground">Order record unlinked or deleted.</div>
            )}
          </div>

          {/* Customer Snapshot */}
          <div className="rounded-2xl border border-border bg-white p-6 shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-ink uppercase font-mono tracking-wider border-b border-border pb-2">
              Customer Information
            </h3>
            <div className="space-y-1 text-muted-foreground">
              <div className="font-bold text-ink text-sm">{customer.fullName || "Customer"}</div>
              <div className="font-mono text-ink">{customer.email || "—"}</div>
              <div className="font-mono">{customer.phone || "—"}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Gateway Refund Modal */}
      {showRefundModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 space-y-4 shadow-2xl border border-amber-200">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2 text-ink font-bold text-sm">
                <DollarSign className="size-5 text-violet" />
                <span>Issue Gateway Refund</span>
              </div>
              <button
                type="button"
                onClick={() => setShowRefundModal(false)}
                className="text-muted-foreground hover:text-ink"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-3 text-muted-foreground">
              <div className="rounded-xl bg-paper p-3 border border-border space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>Gross Captured:</span>
                  <span className="font-mono font-bold text-ink">₹{(amountMinor / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Already Refunded:</span>
                  <span className="font-mono font-bold text-amber-700">₹{(amountRefundedMinor / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-border/60 pt-1 font-bold text-ink">
                  <span>Maximum Refundable:</span>
                  <span className="font-mono text-emerald-700">₹{(remainingRefundableMinor / 100).toFixed(2)}</span>
                </div>
              </div>

              {/* Refund Type Selection */}
              <div className="space-y-1.5">
                <label className="font-bold text-ink uppercase font-mono text-[0.6875rem]">
                  Refund Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRefundType("full")}
                    className={`rounded-xl border p-2.5 font-bold transition-all text-xs ${
                      refundType === "full"
                        ? "border-violet bg-violet/5 text-violet"
                        : "border-border text-muted-foreground hover:bg-paper"
                    }`}
                  >
                    Full Refund (₹{(remainingRefundableMinor / 100).toFixed(2)})
                  </button>

                  <button
                    type="button"
                    onClick={() => setRefundType("partial")}
                    className={`rounded-xl border p-2.5 font-bold transition-all text-xs ${
                      refundType === "partial"
                        ? "border-violet bg-violet/5 text-violet"
                        : "border-border text-muted-foreground hover:bg-paper"
                    }`}
                  >
                    Partial Refund
                  </button>
                </div>
              </div>

              {refundType === "partial" && (
                <div className="space-y-1">
                  <label className="font-bold text-ink uppercase font-mono text-[0.6875rem]">
                    Partial Amount (₹ INR)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    max={(remainingRefundableMinor / 100).toString()}
                    value={partialAmountRupees}
                    onChange={(e) => setPartialAmountRupees(e.target.value)}
                    placeholder={`e.g. 500.00 (Max: ${(remainingRefundableMinor / 100).toFixed(2)})`}
                    className="w-full rounded-xl border border-border px-3 py-2 text-xs font-mono text-ink focus:border-violet focus:outline-none"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="font-bold text-ink uppercase font-mono text-[0.6875rem]">
                  Reason for Refund (Recorded on Razorpay) *
                </label>
                <input
                  type="text"
                  required
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  placeholder="e.g. Customer cancelled pre-press run"
                  className="w-full rounded-xl border border-border px-3 py-2 text-xs text-ink focus:border-violet focus:outline-none"
                />
              </div>

              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-[0.6875rem]">
                <strong>Warning:</strong> Executing this refund sends a real financial refund transaction to the Razorpay API gateway.
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setShowRefundModal(false)}
                className="rounded-xl border border-border px-4 py-2 font-semibold text-muted-foreground hover:bg-paper"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmittingRefund}
                onClick={handleExecuteRefund}
                className="rounded-xl bg-violet px-5 py-2 font-bold text-white shadow-lift hover:bg-violet-lift transition-all disabled:opacity-50"
              >
                {isSubmittingRefund ? "Executing Gateway Refund..." : "Authorize Refund"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
