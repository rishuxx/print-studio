"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  RotateCcw,
  CheckCircle2,
  XCircle,
  CreditCard,
  Sparkles,
  Layers,
  Clock,
  User,
  ShieldCheck,
  ExternalLink,
  Eye,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import type { ResolutionRequestRecord, ResolutionStatus } from "@/lib/resolutions/types";
import { decideResolutionAction } from "@/lib/resolutions/actions";

interface AdminResolutionDetailCardProps {
  request: ResolutionRequestRecord;
  orderTotal: number;
  orderPaymentStatus: string;
}

export function AdminResolutionDetailCard({
  request,
  orderTotal,
  orderPaymentStatus,
}: AdminResolutionDetailCardProps) {
  const router = useRouter();
  const [isDeciding, setIsDeciding] = React.useState(false);
  const [adminNotes, setAdminNotes] = React.useState(request.adminNotes || "");
  const [customerNotes, setCustomerNotes] = React.useState(request.customerDecisionNotes || "");
  const [refundAmountPaise, setRefundAmountPaise] = React.useState<number>(
    request.refundAmountPaise || Math.round(orderTotal * 100)
  );

  const handleDecision = async (
    targetStatus: ResolutionStatus,
    action: "refund" | "replacement" | "return_required" | "rejected" | "evidence_required"
  ) => {
    if (action === "rejected" && !customerNotes.trim()) {
      toast.error("Please provide a decision explanation for the customer.");
      return;
    }

    setIsDeciding(true);
    const toastId = toast.loading(`Executing ${action.toUpperCase()} resolution...`);

    try {
      const res = await decideResolutionAction({
        resolutionId: request.id,
        targetStatus,
        decisionAction: action,
        adminNotes: adminNotes.trim(),
        customerNotes: customerNotes.trim(),
        refundAmountPaise: action === "refund" ? refundAmountPaise : 0,
        expectedVersion: request.version,
      });

      toast.dismiss(toastId);
      if (res.success) {
        toast.success(`Resolution decision recorded: ${action.toUpperCase()}`);
        router.refresh();
      } else {
        toast.error(res.error || "Decision failed.");
      }
    } catch (err: unknown) {
      toast.dismiss(toastId);
      toast.error(err instanceof Error ? err.message : "Error executing decision.");
    } finally {
      setIsDeciding(false);
    }
  };

  const isResolved = ["resolved", "closed", "rejected"].includes(request.status);

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="rounded-2xl border border-border bg-white p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h1 className="font-display text-xl sm:text-2xl font-black text-ink">
                Ticket #{request.requestNumber}
              </h1>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-mono font-bold uppercase ${
                  request.status === "resolved" || request.status === "closed"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : request.status === "rejected"
                    ? "bg-red-50 text-red-800 border border-red-200"
                    : "bg-amber-50 text-amber-800 border border-amber-200"
                }`}
              >
                {request.status.replace(/_/g, " ")}
              </span>
            </div>
            <p className="text-xs text-muted-foreground font-mono">
              Order:{" "}
              <Link href={`/admin/orders/${request.orderId}`} className="text-violet font-bold hover:underline">
                #{request.orderNumber}
              </Link>{" "}
              • Customer: <strong className="text-ink">{request.customerName || "Customer"}</strong> (
              {request.customerEmail})
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
            <span>Submitted: {new Date(request.requestedAt).toLocaleString("en-IN")}</span>
          </div>
        </div>

        {/* Customer Issue Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="rounded-xl border border-border/80 bg-paper/40 p-4 space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase text-muted-foreground">
              Requested Type & Reason
            </span>
            <div className="font-bold text-ink text-sm capitalize">{request.type.replace(/_/g, " ")}</div>
            <div className="text-muted-foreground capitalize font-mono">
              Reason: {request.reasonCode.replace(/_/g, " ")}
            </div>
          </div>

          <div className="md:col-span-2 rounded-xl border border-border/80 bg-paper/40 p-4 space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase text-muted-foreground">
              Customer Description of Issue
            </span>
            <p className="text-ink leading-relaxed">{request.customerDescription}</p>
          </div>
        </div>

        {/* Affected Order Items */}
        {request.items && request.items.length > 0 && (
          <div className="border border-border/80 rounded-xl p-4 bg-paper/20 space-y-2 text-xs">
            <span className="font-mono font-bold uppercase text-[11px] text-muted-foreground">
              Claimed Items & Quantities
            </span>
            <div className="divide-y divide-border/60">
              {request.items.map((i) => (
                <div key={i.id} className="py-2 flex items-center justify-between">
                  <span className="font-medium text-ink">{i.productTitle}</span>
                  <span className="font-mono text-muted-foreground">
                    Units Claimed: <strong className="text-ink">{i.requestedQuantity}</strong> (Approved: {i.approvedQuantity})
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Evidence Photos / Documents Gallery */}
        <div className="space-y-2 text-xs">
          <span className="font-mono font-bold uppercase text-[11px] text-muted-foreground flex items-center gap-1.5">
            <Eye className="size-3.5 text-violet" />
            <span>Customer Evidence Documents ({request.evidence?.length || 0})</span>
          </span>

          {!request.evidence || request.evidence.length === 0 ? (
            <p className="text-muted-foreground italic">No evidence attachments uploaded by customer.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {request.evidence.map((ev) => (
                <div
                  key={ev.id}
                  className="rounded-xl border border-border/80 bg-paper/40 p-3 space-y-2 flex flex-col justify-between"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="font-bold text-ink truncate text-[11px]">{ev.originalFilename}</div>
                    <div className="text-[10px] font-mono text-muted-foreground">
                      {(ev.fileSizeBytes / 1024).toFixed(1)} KB • {ev.mimeType}
                    </div>
                  </div>

                  {ev.signedUrl ? (
                    <a
                      href={ev.signedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1 rounded-lg border border-violet/30 bg-violet/5 py-1.5 text-[11px] font-bold text-violet hover:bg-violet/10 transition-colors"
                    >
                      <ExternalLink className="size-3" /> View Evidence Attachment
                    </a>
                  ) : (
                    <span className="text-[10px] text-muted-foreground italic">Expiring URL unavailable</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Admin Decision Work Center */}
      {!isResolved && (
        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm space-y-5 text-xs">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <ShieldCheck className="size-5 text-violet" />
            <h2 className="font-bold text-sm text-ink uppercase font-mono tracking-wider">
              Studio Resolution Decision Panel
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-ink">Explanation to Customer (Visible in Account):</label>
              <textarea
                rows={3}
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                placeholder="Explain the studio decision (e.g. We confirmed the color registration shift and have authorized an urgent free replacement print run)..."
                className="w-full rounded-xl border border-border bg-paper/40 p-3 text-xs text-ink placeholder:text-muted-foreground focus:border-violet focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-ink">Internal Pre-Press / QA Notes (Staff Only):</label>
              <textarea
                rows={3}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Internal root-cause notes (e.g. Plate #3 misalignment on Heidelberg offset press)..."
                className="w-full rounded-xl border border-border bg-paper/40 p-3 text-xs text-ink placeholder:text-muted-foreground focus:border-violet focus:outline-none"
              />
            </div>
          </div>

          {/* Refund Amount Input (If processing refund) */}
          <div className="rounded-xl border border-border/80 bg-paper/30 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="font-bold text-ink">Refund Allocation Amount (in Paise / Minor Units):</span>
              <p className="text-[11px] text-muted-foreground">
                Original Order Total: ₹{orderTotal} (Gateway Status: {orderPaymentStatus.toUpperCase()})
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-ink">₹</span>
              <input
                type="number"
                step="0.01"
                value={(refundAmountPaise / 100).toFixed(2)}
                onChange={(e) => setRefundAmountPaise(Math.round(parseFloat(e.target.value || "0") * 100))}
                className="w-28 rounded-lg border border-border bg-white px-2 py-1 font-mono text-xs font-bold text-ink focus:border-violet focus:outline-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
            <button
              onClick={() => handleDecision("rejected", "rejected")}
              disabled={isDeciding}
              className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-4 py-2 font-bold text-red-700 hover:bg-red-100 transition-colors disabled:opacity-50"
            >
              <XCircle className="size-4" /> Reject Request
            </button>

            <button
              onClick={() => handleDecision("refund_pending", "refund")}
              disabled={isDeciding}
              className="inline-flex items-center gap-1.5 rounded-xl bg-violet px-4 py-2 font-bold text-white shadow-sm hover:bg-violet/90 transition-colors disabled:opacity-50"
            >
              <CreditCard className="size-4" /> Approve & Issue Gateway Refund
            </button>

            <button
              onClick={() => handleDecision("replacement_in_progress", "replacement")}
              disabled={isDeciding}
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 font-bold text-white shadow-sm hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              <Sparkles className="size-4" /> Approve & Spawn Priority Replacement Job
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
