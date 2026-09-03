"use client";

import * as React from "react";
import {
  X,
  AlertTriangle,
  Upload,
  CheckCircle2,
  FileText,
  RotateCcw,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import type { ResolutionReasonCode, ResolutionType } from "@/lib/resolutions/types";
import { submitResolutionRequestAction, uploadResolutionEvidenceAction } from "@/lib/resolutions/actions";
import { getPolicyNoticeText } from "@/lib/resolutions/policy";

interface ResolutionRequestModalProps {
  orderId: string;
  orderNumber: string;
  items: Array<{ id: string; product_title: string; quantity: number }>;
  isCustomProduct: boolean;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const REASON_OPTIONS: Array<{ code: ResolutionReasonCode; label: string; defect: boolean }> = [
  { code: "damaged", label: "Damaged Package / Physical Damage", defect: true },
  { code: "defective", label: "Manufacturing Flaw / Defective Item", defect: true },
  { code: "printing_error", label: "Printing Error (Ink Smear, Misalignment)", defect: true },
  { code: "color_quality_issue", label: "Color Gamut Shift / Heavy Discrepancy", defect: true },
  { code: "wrong_product", label: "Wrong Item / Variant Delivered", defect: true },
  { code: "wrong_quantity", label: "Short Quantity / Units Missing", defect: true },
  { code: "shipping_damage", label: "Transit Damage by Courier", defect: true },
  { code: "customer_changed_mind", label: "Changed Mind / No Longer Needed", defect: false },
  { code: "other", label: "Other Operational Issue", defect: true },
];

export function ResolutionRequestModal({
  orderId,
  orderNumber,
  items,
  isCustomProduct,
  isOpen,
  onClose,
  onSuccess,
}: ResolutionRequestModalProps) {
  const [selectedType, setSelectedType] = React.useState<ResolutionType>("replacement");
  const [selectedReason, setSelectedReason] = React.useState<ResolutionReasonCode>("defective");
  const [description, setDescription] = React.useState("");
  const [selectedItems, setSelectedItems] = React.useState<Record<string, number>>(
    items.reduce((acc, item) => ({ ...acc, [item.id]: item.quantity }), {})
  );
  const [evidenceFiles, setEvidenceFiles] = React.useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (files.length + evidenceFiles.length > 5) {
        toast.error("You can upload a maximum of 5 evidence files.");
        return;
      }
      setEvidenceFiles((prev) => [...prev, ...files]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setEvidenceFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!description.trim() || description.trim().length < 10) {
      toast.error("Please provide a detailed description (minimum 10 characters).");
      return;
    }

    const payloadItems = Object.entries(selectedItems)
      .filter(([_, qty]) => qty > 0)
      .map(([orderItemId, requestedQuantity]) => ({
        orderItemId,
        requestedQuantity,
      }));

    if (payloadItems.length === 0) {
      toast.error("Please select at least one affected item.");
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Submitting post-delivery resolution request...");

    try {
      // 1. Submit Request
      const res = await submitResolutionRequestAction({
        orderId,
        type: selectedType,
        reasonCode: selectedReason,
        customerDescription: description.trim(),
        items: payloadItems,
      });

      if (!res.success || !res.resolutionId) {
        throw new Error(res.error || "Failed to submit request.");
      }

      // 2. Upload any attached evidence files
      if (evidenceFiles.length > 0) {
        toast.loading(`Uploading ${evidenceFiles.length} evidence file(s)...`, { id: toastId });
        for (const file of evidenceFiles) {
          const formData = new FormData();
          formData.append("file", file);
          await uploadResolutionEvidenceAction(res.resolutionId, formData);
        }
      }

      toast.dismiss(toastId);
      toast.success(`Resolution Request #${res.requestNumber} submitted! Studio pre-press team notified.`);
      onSuccess?.();
      onClose();
    } catch (err: unknown) {
      toast.dismiss(toastId);
      toast.error(err instanceof Error ? err.message : "Error submitting resolution request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl border border-border bg-white shadow-2xl p-6 sm:p-8 space-y-5 my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="space-y-0.5">
            <h2 className="font-display text-lg font-bold text-ink flex items-center gap-2">
              <RotateCcw className="size-5 text-violet" />
              <span>Report Issue or Request Resolution</span>
            </h2>
            <p className="text-xs text-muted-foreground font-mono">
              Order: <strong className="text-ink">#{orderNumber}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-paper hover:text-ink transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Policy Disclaimer Alert */}
        <div className="rounded-xl border border-violet/20 bg-violet/5 p-4 flex items-start gap-3 text-xs leading-relaxed">
          <ShieldCheck className="size-5 text-violet shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-violet">PreetyPrints Studio Resolution Policy:</span>
            <p className="text-muted-foreground">{getPolicyNoticeText(isCustomProduct)}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Reason Code Dropdown */}
          <div className="space-y-1.5">
            <label className="font-bold text-ink">What is the primary issue?</label>
            <select
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value as ResolutionReasonCode)}
              className="w-full rounded-xl border border-border bg-paper/40 px-3.5 py-2 text-xs font-mono text-ink focus:border-violet focus:outline-none"
            >
              {REASON_OPTIONS.map((opt) => (
                <option key={opt.code} value={opt.code}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Requested Resolution Type */}
          <div className="space-y-1.5">
            <label className="font-bold text-ink">Preferred Resolution:</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: "replacement", label: "Priority Replacement" },
                { id: "partial_refund", label: "Partial Refund" },
                { id: "refund", label: "Full Refund" },
                { id: "store_credit", label: "Store Credit" },
              ].map((res) => (
                <button
                  type="button"
                  key={res.id}
                  onClick={() => setSelectedType(res.id as ResolutionType)}
                  className={`rounded-xl border p-2.5 text-center font-bold transition-all ${
                    selectedType === res.id
                      ? "border-violet bg-violet text-white shadow-xs"
                      : "border-border bg-paper/40 text-ink hover:border-violet/40"
                  }`}
                >
                  {res.label}
                </button>
              ))}
            </div>
          </div>

          {/* Affected Items Selection */}
          <div className="space-y-2">
            <label className="font-bold text-ink">Select Affected Items & Quantities:</label>
            <div className="divide-y divide-border/60 border border-border/80 rounded-xl p-3 bg-paper/20 max-h-40 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="py-2 flex items-center justify-between gap-4">
                  <span className="font-medium text-ink truncate">{item.product_title}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-muted-foreground text-[11px]">Units:</span>
                    <input
                      type="number"
                      min={0}
                      max={item.quantity}
                      value={selectedItems[item.id] || 0}
                      onChange={(e) =>
                        setSelectedItems({
                          ...selectedItems,
                          [item.id]: Math.min(item.quantity, Math.max(0, parseInt(e.target.value) || 0)),
                        })
                      }
                      className="w-16 rounded-lg border border-border bg-white px-2 py-1 text-center font-mono text-xs focus:border-violet focus:outline-none"
                    />
                    <span className="text-muted-foreground text-[11px]">/ {item.quantity}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="font-bold text-ink">Detailed Description of Defect / Damage:</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue clearly (e.g. cut trim was offset by 5mm, severe yellow ink smudging on front sides, shipping carton arrived punctured)..."
              className="w-full rounded-xl border border-border bg-paper/40 p-3 text-xs text-ink placeholder:text-muted-foreground focus:border-violet focus:outline-none"
            />
          </div>

          {/* File Evidence Upload */}
          <div className="space-y-2">
            <label className="font-bold text-ink flex items-center gap-1.5">
              <Upload className="size-3.5 text-violet" />
              <span>Attach Photographs / Scans of Defect (Max 5 files):</span>
            </label>
            <input
              type="file"
              multiple
              accept="image/png,image/jpeg,image/webp,application/pdf"
              onChange={handleFileChange}
              className="w-full rounded-xl border border-border bg-paper/40 p-2 text-xs font-mono text-muted-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-violet file:px-3 file:py-1 file:text-xs file:font-bold file:text-white"
            />
            {evidenceFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {evidenceFiles.map((f, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 rounded-lg bg-paper border border-border px-2 py-1 text-[11px] text-ink"
                  >
                    <span className="max-w-[120px] truncate">{f.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(i)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-border px-4 py-2 text-xs font-bold text-muted-foreground hover:bg-paper hover:text-ink transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-xl bg-violet px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-violet/90 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <span>Submit Resolution Request</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
