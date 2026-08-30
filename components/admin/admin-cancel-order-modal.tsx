"use client";

import * as React from "react";
import {
  X,
  AlertTriangle,
  CreditCard,
  RotateCcw,
  ShieldAlert,
  Info,
} from "lucide-react";
import {
  CANCELLATION_REASONS,
  getCustomerSafeReasonMessage,
} from "@/lib/cancellations/reasons";
import {
  CancellationReasonCode,
  CancellationRefundMode,
} from "@/lib/cancellations/types";
import { executeOrderCancellationAndRefund } from "@/lib/cancellations/orchestration";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface AdminCancelOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  orderNumber: string;
  customerName?: string;
  customerEmail?: string;
  currentStatus: string;
  paymentStatus: string;
  grossTotal: number;
  paymentReference?: string;
}

export function AdminCancelOrderModal({
  isOpen,
  onClose,
  orderId,
  orderNumber,
  customerName,
  customerEmail,
  currentStatus,
  paymentStatus,
  grossTotal,
  paymentReference,
}: AdminCancelOrderModalProps) {
  const router = useRouter();
  const [selectedReason, setSelectedReason] =
    React.useState<CancellationReasonCode>("OUT_OF_STOCK");
  const [reasonNote, setReasonNote] = React.useState("");
  const [internalNote, setInternalNote] = React.useState("");
  const [customCustomerMessage, setCustomCustomerMessage] = React.useState("");
  const [refundMode, setRefundMode] =
    React.useState<CancellationRefundMode>("FULL");
  const [partialAmount, setPartialAmount] = React.useState<number>(grossTotal);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  if (!isOpen) return null;

  const isPaid = paymentStatus === "paid" || paymentStatus === "partially_refunded";
  const calculatedRefundMinor =
    !isPaid || refundMode === "NONE"
      ? 0
      : refundMode === "FULL"
      ? Math.round(grossTotal * 100)
      : Math.round(Number(partialAmount || 0) * 100);

  const previewCustomerMessage = getCustomerSafeReasonMessage(
    selectedReason,
    customCustomerMessage
  );

  const handleConfirmCancellation = async () => {
    if (selectedReason === "OTHER" && reasonNote.trim().length < 10) {
      toast.error("Please provide an explanatory reason note (minimum 10 characters).");
      return;
    }

    if (refundMode === "PARTIAL" && (partialAmount <= 0 || partialAmount > grossTotal)) {
      toast.error(`Partial refund amount must be between ₹1 and ₹${grossTotal}.`);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await executeOrderCancellationAndRefund({
        orderId: orderNumber || orderId,
        reasonCode: selectedReason,
        reasonNote: reasonNote.trim() || undefined,
        internalNote: internalNote.trim() || undefined,
        customerMessage: customCustomerMessage.trim() || undefined,
        refundMode: isPaid ? refundMode : "NONE",
        refundAmountMinor: calculatedRefundMinor,
      });

      if (res.success) {
        toast.success(`Order #${orderNumber} Cancelled`, {
          description:
            calculatedRefundMinor > 0
              ? `Refund of ₹${(calculatedRefundMinor / 100).toFixed(
                  2
                )} initiated via Razorpay.`
              : "Order cancelled successfully.",
        });
        onClose();
        router.refresh();
      } else {
        toast.error(res.error || "Failed to execute order cancellation");
      }
    } catch {
      toast.error("Network communication error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150 overflow-y-auto">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-border p-6 space-y-5 text-xs my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-red-100 text-red-700 font-bold">
              <AlertTriangle className="size-5" />
            </div>
            <div>
              <h2 className="font-display text-base font-bold text-ink">
                Cancel Order #{orderNumber}
              </h2>
              <p className="text-[0.6875rem] text-muted-foreground">
                Customer: <strong>{customerName || "Guest Customer"}</strong> ({customerEmail || "No Email"})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1 rounded-lg text-muted-foreground hover:bg-paper hover:text-ink"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Financial Context Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-paper/60 border border-border/80">
          <div>
            <div className="text-[0.625rem] uppercase font-mono text-muted-foreground">Order Status</div>
            <div className="font-bold text-ink capitalize">{currentStatus.replace(/_/g, " ")}</div>
          </div>
          <div>
            <div className="text-[0.625rem] uppercase font-mono text-muted-foreground">Payment State</div>
            <div className="font-bold text-ink capitalize">{paymentStatus.replace(/_/g, " ")}</div>
          </div>
          <div>
            <div className="text-[0.625rem] uppercase font-mono text-muted-foreground">Captured Total</div>
            <div className="font-bold text-ink font-mono">₹{grossTotal}</div>
          </div>
          <div>
            <div className="text-[0.625rem] uppercase font-mono text-muted-foreground">Gateway Ref</div>
            <div className="font-bold text-violet font-mono truncate">{paymentReference || "Direct"}</div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          {/* Reason Code Dropdown */}
          <div className="space-y-1.5">
            <label className="font-bold text-ink uppercase font-mono text-[0.6875rem]">
              Cancellation Reason Code <span className="text-red-600">*</span>
            </label>
            <select
              value={selectedReason}
              onChange={(e) =>
                setSelectedReason(e.target.value as CancellationReasonCode)
              }
              className="w-full rounded-xl border border-border bg-white px-3 py-2 text-xs font-medium text-ink focus:border-violet focus:outline-none"
            >
              {Object.values(CANCELLATION_REASONS).map((r) => (
                <option key={r.code} value={r.code}>
                  [{r.category}] {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* If OTHER is chosen, require reason note */}
          {selectedReason === "OTHER" && (
            <div className="space-y-1.5 animate-in fade-in">
              <label className="font-bold text-ink uppercase font-mono text-[0.6875rem]">
                Detailed Reason Note (Min 10 chars) <span className="text-red-600">*</span>
              </label>
              <textarea
                rows={2}
                value={reasonNote}
                onChange={(e) => setReasonNote(e.target.value)}
                placeholder="Explain the operational rationale for cancellation..."
                className="w-full rounded-xl border border-border p-2.5 text-xs text-ink focus:border-violet focus:outline-none"
              />
            </div>
          )}

          {/* Refund Mode Selection (If Paid) */}
          {isPaid ? (
            <div className="space-y-2 rounded-xl border border-violet/20 bg-violet/5 p-3.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-ink uppercase font-mono text-[0.6875rem] flex items-center gap-1.5">
                  <CreditCard className="size-3.5 text-violet" />
                  <span>Razorpay Refund Orchestration</span>
                </span>
                <span className="text-[0.6875rem] text-violet font-semibold">
                  Source Refund (Original Payment Method)
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setRefundMode("FULL")}
                  className={`p-2 rounded-xl border text-center font-bold transition-all ${
                    refundMode === "FULL"
                      ? "border-violet bg-white text-violet shadow-xs ring-2 ring-violet/20"
                      : "border-border/80 bg-white/50 text-muted-foreground hover:bg-white"
                  }`}
                >
                  Full Refund (₹{grossTotal})
                </button>
                <button
                  type="button"
                  onClick={() => setRefundMode("PARTIAL")}
                  className={`p-2 rounded-xl border text-center font-bold transition-all ${
                    refundMode === "PARTIAL"
                      ? "border-violet bg-white text-violet shadow-xs ring-2 ring-violet/20"
                      : "border-border/80 bg-white/50 text-muted-foreground hover:bg-white"
                  }`}
                >
                  Partial Refund
                </button>
                <button
                  type="button"
                  onClick={() => setRefundMode("NONE")}
                  className={`p-2 rounded-xl border text-center font-bold transition-all ${
                    refundMode === "NONE"
                      ? "border-red-500 bg-white text-red-700 shadow-xs ring-2 ring-red-500/20"
                      : "border-border/80 bg-white/50 text-muted-foreground hover:bg-white"
                  }`}
                >
                  No Refund
                </button>
              </div>

              {refundMode === "PARTIAL" && (
                <div className="pt-2 flex items-center gap-2">
                  <span className="text-xs font-bold text-ink">Amount (₹):</span>
                  <input
                    type="number"
                    min={1}
                    max={grossTotal}
                    value={partialAmount}
                    onChange={(e) => setPartialAmount(Number(e.target.value))}
                    className="w-32 rounded-lg border border-border bg-white px-2 py-1 font-mono font-bold text-ink"
                  />
                  <span className="text-[0.6875rem] text-muted-foreground">
                    Max refundable: ₹{grossTotal}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-amber-900 flex items-center gap-2">
              <Info className="size-4 shrink-0 text-amber-700" />
              <span>
                Payment was not captured for this order. No financial refund will be issued.
              </span>
            </div>
          )}

          {/* Customer Explanation Preview & Custom Override */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-bold text-ink uppercase font-mono text-[0.6875rem]">
                Customer-Facing Explanation (Editable)
              </label>
              <span className="text-[0.625rem] text-muted-foreground">Visible on customer timeline</span>
            </div>
            <textarea
              rows={2}
              value={customCustomerMessage}
              onChange={(e) => setCustomCustomerMessage(e.target.value)}
              placeholder={previewCustomerMessage}
              className="w-full rounded-xl border border-border p-2.5 text-xs text-ink focus:border-violet focus:outline-none leading-relaxed"
            />
          </div>

          {/* Internal Staff Notes (Strictly Hidden from Customer) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-bold text-muted-foreground uppercase font-mono text-[0.6875rem] flex items-center gap-1">
                <ShieldAlert className="size-3 text-violet" />
                <span>Internal Staff Note (Confidential)</span>
              </label>
              <span className="text-[0.625rem] text-muted-foreground">Never shown to customer</span>
            </div>
            <input
              type="text"
              value={internalNote}
              onChange={(e) => setInternalNote(e.target.value)}
              placeholder="e.g. Pre-press plate 4 defect / Customer requested via WhatsApp"
              className="w-full rounded-xl border border-border px-3 py-2 text-xs text-ink focus:border-violet focus:outline-none"
            />
          </div>
        </div>

        {/* Actions Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-border">
          <div className="text-[0.6875rem] text-muted-foreground">
            {calculatedRefundMinor > 0 ? (
              <span className="text-violet font-bold font-mono">
                Initiates ₹{(calculatedRefundMinor / 100).toFixed(2)} source refund.
              </span>
            ) : (
              <span>Terminates order without payment refund.</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl border border-border px-4 py-2 font-semibold text-muted-foreground hover:bg-paper"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleConfirmCancellation}
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 font-bold text-white shadow-lift hover:bg-red-700 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <RotateCcw className="size-3.5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : calculatedRefundMinor > 0 ? (
                <span>Cancel Order & Refund ₹{(calculatedRefundMinor / 100).toFixed(2)}</span>
              ) : (
                <span>Confirm Order Cancellation</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
