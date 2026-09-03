"use client";

import * as React from "react";
import type { ArtworkAssetRecord, ArtworkProofRecord } from "@/lib/artwork/types";
import { approveArtworkProofAction, requestArtworkRevisionAction } from "@/lib/artwork/actions";
import {
  X,
  ZoomIn,
  ZoomOut,
  Maximize2,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ShieldCheck,
  FileCheck,
  Eye,
  Loader2,
  Info,
} from "lucide-react";
import { toast } from "sonner";

interface ProofViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: ArtworkAssetRecord;
  previewUrl: string;
  onSuccess?: () => void;
}

export function ProofViewerModal({
  isOpen,
  onClose,
  asset,
  previewUrl,
  onSuccess,
}: ProofViewerModalProps) {
  const [zoomLevel, setZoomLevel] = React.useState(100);
  const [showGuides, setShowGuides] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [hasConsented, setHasConsented] = React.useState(false);

  const [mode, setMode] = React.useState<"view" | "revision">("view");
  const [revisionCategory, setRevisionCategory] = React.useState<
    "text" | "image" | "color" | "alignment" | "sizing" | "other"
  >("text");
  const [revisionComments, setRevisionComments] = React.useState("");

  if (!isOpen) return null;

  const version = asset.currentVersion;
  const proof = asset.currentProof;

  const handleApprove = async () => {
    if (!proof?.id) {
      toast.error("Proof record not ready for approval.");
      return;
    }
    if (!hasConsented) {
      toast.error("Please acknowledge and check the proof review confirmation.");
      return;
    }

    setIsSubmitting(true);
    const consentText =
      "I have reviewed this pre-press digital proof (spelling, layout, trim, and margins) and approve it for final production press run.";

    const res = await approveArtworkProofAction({
      proofId: proof.id,
      consentText,
    });

    setIsSubmitting(false);

    if (res.success) {
      toast.success("Proof approved! Order unlocked for production.");
      onSuccess?.();
      onClose();
    } else {
      toast.error(res.error || "Failed to approve proof.");
    }
  };

  const handleRequestRevision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proof?.id) return;
    if (!revisionComments.trim()) {
      toast.error("Please explain the changes you would like our pre-press team to make.");
      return;
    }

    setIsSubmitting(true);
    const res = await requestArtworkRevisionAction({
      proofId: proof.id,
      category: revisionCategory,
      comments: revisionComments.trim(),
    });

    setIsSubmitting(false);

    if (res.success) {
      toast.info("Changes requested. You may now upload a replacement artwork revision.");
      onSuccess?.();
      onClose();
    } else {
      toast.error(res.error || "Failed to submit revision request.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto">
      <div className="relative flex flex-col w-full max-w-5xl max-h-[92vh] rounded-2xl bg-white shadow-2xl border border-border overflow-hidden">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-paper/50">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-base font-bold text-ink">
                Digital Pre-Press Proof Review
              </h2>
              <span className="rounded-full bg-violet-wash px-2 py-0.5 font-mono text-[10px] font-bold text-violet uppercase">
                Slot: {asset.slot} · v{version?.versionNumber || 1}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              File: {version?.originalFilename || "Artwork Master"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center rounded-lg border border-border bg-white p-1 text-xs font-mono">
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(50, z - 25))}
                className="p-1 text-ink hover:text-violet"
                title="Zoom out"
              >
                <ZoomOut className="size-4" />
              </button>
              <span className="px-2 font-bold">{zoomLevel}%</span>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(300, z + 25))}
                className="p-1 text-ink hover:text-violet"
                title="Zoom in"
              >
                <ZoomIn className="size-4" />
              </button>
            </div>

            {/* Guides Toggle */}
            <button
              type="button"
              onClick={() => setShowGuides(!showGuides)}
              className={`rounded-lg border px-2.5 py-1 text-xs font-semibold transition-all ${
                showGuides
                  ? "border-violet bg-violet-wash text-violet"
                  : "border-border bg-white text-muted-foreground"
              }`}
            >
              Trim Guides {showGuides ? "ON" : "OFF"}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-paper hover:text-ink"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="grid grid-cols-1 lg:grid-cols-3 flex-1 overflow-hidden">
          {/* Left / Center Viewport (Interactive Zoom Canvas) */}
          <div className="lg:col-span-2 relative flex items-center justify-center p-6 bg-neutral-900 overflow-auto min-h-[360px] max-h-[580px]">
            <div
              className="relative transition-transform duration-150 ease-out"
              style={{ transform: `scale(${zoomLevel / 100})` }}
            >
              {/* Image Preview */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="Digital Proof Preview"
                className="max-h-[460px] w-auto rounded shadow-2xl object-contain select-none"
              />

              {/* Watermark Overlay */}
              {proof?.status !== "approved" && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-35">
                  <span className="rotate-[-25deg] font-display text-2xl sm:text-4xl font-black text-red-600 uppercase border-4 border-dashed border-red-600 px-6 py-2 tracking-widest">
                    PRE-PRESS PROOF
                  </span>
                </div>
              )}

              {/* Pre-Press Trim & Bleed Guides Overlay */}
              {showGuides && (
                <div className="absolute inset-0 pointer-events-none">
                  {/* Outer Bleed Margin */}
                  <div className="absolute inset-0 border border-dashed border-red-500/80" />
                  {/* Trim Line */}
                  <div className="absolute inset-[8px] border border-solid border-cyan-400/80" />
                  {/* Safe Zone */}
                  <div className="absolute inset-[16px] border border-dotted border-emerald-400/80" />
                </div>
              )}
            </div>

            {/* Guide Legend */}
            {showGuides && (
              <div className="absolute bottom-3 left-3 rounded-lg bg-black/80 px-3 py-1.5 text-[10px] font-mono text-white flex items-center gap-3 backdrop-blur-xs">
                <span className="flex items-center gap-1">
                  <span className="size-2 rounded-full bg-red-500" /> Bleed (Cut Margin)
                </span>
                <span className="flex items-center gap-1">
                  <span className="size-2 rounded-full bg-cyan-400" /> Trim Line
                </span>
                <span className="flex items-center gap-1">
                  <span className="size-2 rounded-full bg-emerald-400" /> Safe Text Zone
                </span>
              </div>
            )}
          </div>

          {/* Right Panel: Preflight Diagnostics & Customer Action Form */}
          <div className="p-6 border-t lg:border-t-0 lg:border-l border-border space-y-5 overflow-y-auto bg-white text-xs">
            {/* Preflight Summary */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-ink uppercase font-mono tracking-wider text-[11px]">
                  Preflight Inspection
                </h3>
                <span
                  className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                    version?.preflightStatus === "passed"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : version?.preflightStatus === "warning"
                      ? "bg-amber-50 text-amber-800 border border-amber-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  {version?.preflightStatus || "Passed"}
                </span>
              </div>

              <div className="space-y-2">
                {version?.preflightResults && version.preflightResults.length > 0 ? (
                  version.preflightResults.map((diag, i) => (
                    <div
                      key={i}
                      className={`p-2.5 rounded-xl border flex items-start gap-2 ${
                        diag.severity === "error" || diag.severity === "critical"
                          ? "bg-red-50/70 border-red-200 text-red-800"
                          : diag.severity === "warning"
                          ? "bg-amber-50/70 border-amber-200 text-amber-900"
                          : "bg-paper border-border text-ink"
                      }`}
                    >
                      {diag.severity === "warning" ? (
                        <AlertTriangle className="size-4 text-amber-600 shrink-0 mt-0.5" />
                      ) : diag.severity === "error" ? (
                        <AlertTriangle className="size-4 text-red-600 shrink-0 mt-0.5" />
                      ) : (
                        <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div className="font-semibold text-[11px]">{diag.message}</div>
                        {diag.measured && (
                          <div className="font-mono text-[10px] text-muted-foreground mt-0.5">
                            Measured: {diag.measured} · Required: {diag.expected}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-emerald-600" />
                    <span>No preflight warnings detected. Ready for press.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Decision Controls: Approve vs Request Revision */}
            {proof?.status === "approved" ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 space-y-2 text-emerald-900">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <ShieldCheck className="size-5 text-emerald-600" />
                  <span>Proof Formally Approved</span>
                </div>
                <p className="text-[11px] text-emerald-700">
                  Approved on {proof.approvalRecord?.approvedAt ? new Date(proof.approvalRecord.approvedAt).toLocaleString() : "record"}.
                  Plate imaging is scheduled.
                </p>
              </div>
            ) : mode === "view" ? (
              <div className="space-y-4 pt-2 border-t border-border">
                <div className="rounded-xl border border-border bg-paper/60 p-3 space-y-2">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasConsented}
                      onChange={(e) => setHasConsented(e.target.checked)}
                      className="mt-0.5 rounded border-border text-violet focus:ring-violet"
                    />
                    <span className="text-[11px] text-ink leading-relaxed font-medium">
                      I have thoroughly inspected spelling, text placement, color gamut, and trim margins. I approve this proof for production.
                    </span>
                  </label>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={handleApprove}
                    disabled={isSubmitting || !hasConsented}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white shadow-lift hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="size-4" />
                    )}
                    <span>Approve Proof for Production</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMode("revision")}
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 rounded-xl border border-border bg-white py-2.5 text-xs font-semibold text-ink hover:bg-paper transition-all"
                  >
                    <RotateCcw className="size-3.5 text-muted-foreground" />
                    <span>Request Changes / Revisions</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Revision Request Form */
              <form onSubmit={handleRequestRevision} className="space-y-3 pt-2 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-ink">Revision Details</span>
                  <button
                    type="button"
                    onClick={() => setMode("view")}
                    className="text-[11px] text-violet hover:underline"
                  >
                    &larr; Back to Proof
                  </button>
                </div>

                <div>
                  <label className="text-[11px] text-muted-foreground block mb-1">
                    Issue Category
                  </label>
                  <select
                    value={revisionCategory}
                    onChange={(e) => setRevisionCategory(e.target.value as any)}
                    className="w-full rounded-xl border border-border bg-white p-2 text-xs font-medium text-ink focus:border-violet focus:outline-none"
                  >
                    <option value="text">Spelling / Typography Correction</option>
                    <option value="image">Image Replacement / Cropping</option>
                    <option value="color">Color Gamut / Shift Concern</option>
                    <option value="alignment">Margins / Bleed Alignment</option>
                    <option value="sizing">Product Sizing / Dimensions</option>
                    <option value="other">Other Specification Change</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-muted-foreground block mb-1">
                    Explain Required Changes
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe what needs to be changed in the next revision..."
                    value={revisionComments}
                    onChange={(e) => setRevisionComments(e.target.value)}
                    className="w-full rounded-xl border border-border bg-white p-2.5 text-xs text-ink focus:border-violet focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-violet py-2.5 text-xs font-bold text-white shadow-lift hover:bg-violet-lift transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <span>Submit Revision Request</span>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
