"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Printer,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Layers,
  Clock,
  User,
  ShieldCheck,
  FileDown,
  Play,
  ArrowRight,
  Pause,
} from "lucide-react";
import { toast } from "sonner";
import type {
  ProductionJobRecord,
  QCRecord,
  ProductionJobEvent,
  ProductionJobStatus,
  ProductionPriority,
  QCChecklistItem,
} from "@/lib/production/types";
import { ProductionStatusBadge } from "./production-status-badge";
import {
  transitionProductionJobAction,
  assignJobOperatorAction,
  updateJobPriorityAction,
  submitQCInspectionAction,
} from "@/lib/production/actions";
import { createArtworkSignedUrl } from "@/lib/supabase/actions";

interface JobManufacturingCardProps {
  job: ProductionJobRecord;
  orderNumber: string;
  qcRecords: QCRecord[];
  events: ProductionJobEvent[];
  staffProfiles: Array<{ id: string; full_name: string | null; role: string }>;
}

const DEFAULT_QC_CHECKLIST: QCChecklistItem[] = [
  { id: "dimensions", label: "Physical trim dimensions verified against spec", passed: false, required: true },
  { id: "quantity", label: "Finished sheet / unit count verified", passed: false, required: true },
  { id: "color", label: "Color gamut & press registration acceptable", passed: false, required: true },
  { id: "finishing", label: "Lamination, coating, or cutting defect-free", passed: false, required: true },
  { id: "packaging", label: "Packed in moisture-proof protective wrapping", passed: false, required: true },
];

export function JobManufacturingCard({
  job,
  orderNumber,
  qcRecords,
  events,
  staffProfiles,
}: JobManufacturingCardProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [qcChecklist, setQcChecklist] = React.useState<QCChecklistItem[]>(DEFAULT_QC_CHECKLIST);
  const [qcNotes, setQcNotes] = React.useState("");
  const [isDownloading, setIsDownloading] = React.useState(false);

  const spec = job.productionSpecSnapshot;
  const dims = spec?.productionSpecification?.dimensions;
  const manifest = job.artworkManifest;

  // Handle advancing status
  const handleTransition = async (targetStatus: ProductionJobStatus, reason?: string) => {
    setIsUpdating(true);
    const toastId = toast.loading(`Transitioning job to ${targetStatus}...`);
    try {
      const res = await transitionProductionJobAction(job.id, targetStatus, reason);
      toast.dismiss(toastId);
      if (res.success) {
        toast.success(`Job advanced to ${targetStatus}!`);
        router.refresh();
      } else {
        toast.error(res.error || "Failed to update job status.");
      }
    } catch (err: unknown) {
      toast.dismiss(toastId);
      toast.error(err instanceof Error ? err.message : "Transition failed.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle Operator Assignment
  const handleAssignOperator = async (operatorId: string) => {
    const toastId = toast.loading("Updating operator assignment...");
    try {
      const res = await assignJobOperatorAction(job.id, operatorId === "none" ? null : operatorId);
      toast.dismiss(toastId);
      if (res.success) {
        toast.success("Operator assignment updated.");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to assign operator.");
      }
    } catch (err: unknown) {
      toast.dismiss(toastId);
      toast.error(err instanceof Error ? err.message : "Assignment failed.");
    }
  };

  // Handle Priority Change
  const handlePriorityChange = async (priority: ProductionPriority) => {
    const toastId = toast.loading("Updating job priority...");
    try {
      const res = await updateJobPriorityAction(job.id, priority, "Admin Work Center override");
      toast.dismiss(toastId);
      if (res.success) {
        toast.success(`Priority updated to ${priority.toUpperCase()}`);
        router.refresh();
      } else {
        toast.error(res.error || "Failed to update priority.");
      }
    } catch (err: unknown) {
      toast.dismiss(toastId);
      toast.error(err instanceof Error ? err.message : "Priority update failed.");
    }
  };

  // Download Master Asset
  const handleDownloadMaster = async () => {
    if (!manifest.storagePath) {
      toast.error("No master artwork file path available on manifest.");
      return;
    }

    setIsDownloading(true);
    try {
      const res = await createArtworkSignedUrl(job.orderId, manifest.storagePath);
      if (res.success && res.signedUrl) {
        window.open(res.signedUrl, "_blank");
      } else {
        toast.error(res.error || "Failed to generate download URL.");
      }
    } catch (err) {
      toast.error("Error initiating asset download.");
    } finally {
      setIsDownloading(false);
    }
  };

  // Submit QC
  const handleSubmitQC = async (result: "passed" | "failed") => {
    setIsUpdating(true);
    const toastId = toast.loading(result === "passed" ? "Passing QC & completing job..." : "Failing QC & flagging rework...");
    try {
      const res = await submitQCInspectionAction(job.id, result, qcChecklist, qcNotes);
      toast.dismiss(toastId);
      if (res.success) {
        toast.success(result === "passed" ? "Studio QC Passed! Job marked completed." : "QC Failure recorded. Job marked for rework.");
        router.refresh();
      } else {
        toast.error(res.error || "QC submission failed.");
      }
    } catch (err: unknown) {
      toast.dismiss(toastId);
      toast.error(err instanceof Error ? err.message : "QC failed.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Job Header Ticket */}
      <div className="rounded-2xl border border-border bg-white p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="font-display text-xl sm:text-2xl font-black text-ink">
                {job.jobNumber}
              </h1>
              <ProductionStatusBadge status={job.status} />
              {job.reworkCount > 0 && (
                <span className="rounded bg-red-100 border border-red-200 px-2 py-0.5 text-xs font-mono font-bold text-red-900">
                  Rework Count: {job.reworkCount}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground font-mono">
              Order: <strong className="text-ink">#{orderNumber}</strong> • Registered:{" "}
              {new Date(job.createdAt).toLocaleString("en-IN")}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Priority Selector */}
            <select
              value={job.priority}
              onChange={(e) => handlePriorityChange(e.target.value as ProductionPriority)}
              className="rounded-xl border border-border bg-paper/50 px-3 py-1.5 text-xs font-mono font-bold text-ink focus:border-violet focus:outline-none"
            >
              <option value="low">Priority: Low</option>
              <option value="normal">Priority: Normal</option>
              <option value="high">Priority: High</option>
              <option value="urgent">Priority: Urgent</option>
            </select>

            {/* Operator Assignment */}
            <select
              value={job.assignedOperatorId || "none"}
              onChange={(e) => handleAssignOperator(e.target.value)}
              className="rounded-xl border border-border bg-paper/50 px-3 py-1.5 text-xs font-mono text-ink focus:border-violet focus:outline-none"
            >
              <option value="none">Operator: Unassigned</option>
              {staffProfiles.map((p) => (
                <option key={p.id} value={p.id}>
                  Operator: {p.full_name || p.id}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Manufacturing Spec Snapshot */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-1 text-xs">
          <div className="rounded-xl border border-border/80 bg-paper/40 p-4 space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase text-muted-foreground">
              Product & Volume
            </span>
            <div className="font-bold text-ink text-sm">{spec.productTitle}</div>
            <div className="text-muted-foreground font-mono">
              Quantity: <strong className="text-ink">{spec.quantity.toLocaleString("en-IN")}</strong>
            </div>
          </div>

          <div className="rounded-xl border border-border/80 bg-paper/40 p-4 space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase text-muted-foreground">
              Substrate & Sizing
            </span>
            <div className="font-bold text-ink">
              {spec.productionSpecification?.substrate || "Standard Paper Stock"}
            </div>
            <div className="text-muted-foreground font-mono">
              Dimensions: {dims?.formatted || (dims ? `${dims.width}×${dims.height} ${dims.unit}` : "Standard")}
            </div>
          </div>

          <div className="rounded-xl border border-border/80 bg-paper/40 p-4 space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase text-muted-foreground">
              Finishing & Sides
            </span>
            <div className="font-bold text-ink">
              {spec.productionSpecification?.finish || "Standard Matte"}
            </div>
            <div className="text-muted-foreground font-mono">
              Sides: {spec.productionSpecification?.sides || "Single-sided"}
            </div>
          </div>

          <div className="rounded-xl border border-border/80 bg-paper/40 p-4 space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase text-muted-foreground">
              Artwork Manifest
            </span>
            <div className="font-mono text-[11px] truncate text-ink font-bold">
              {manifest.originalFilename || manifest.summary || "Print Asset"}
            </div>
            {manifest.storagePath && (
              <button
                onClick={handleDownloadMaster}
                disabled={isDownloading}
                className="inline-flex items-center gap-1.5 rounded-lg border border-violet/30 bg-violet/5 px-2.5 py-1 text-[11px] font-bold text-violet hover:bg-violet/10 transition-colors"
              >
                <FileDown className="size-3" />
                {isDownloading ? "Generating Link..." : "Download Master Print Asset"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Operational Stage Flow Navigator */}
      <div className="rounded-2xl border border-border bg-white p-6 shadow-sm space-y-4">
        <h2 className="font-bold text-sm text-ink uppercase font-mono tracking-wider flex items-center gap-2">
          <Printer className="size-4 text-violet" />
          <span>Manufacturing Process Execution</span>
        </h2>

        {/* Progress tracker stepper */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center text-xs font-mono">
          {[
            { id: "queued", label: "1. Queued" },
            { id: "scheduled", label: "2. Scheduled" },
            { id: "ready_to_print", label: "3. Plate/Prepress" },
            { id: "printing", label: "4. Printing" },
            { id: "finishing", label: "5. Finishing" },
            { id: "quality_check", label: "6. Quality Check" },
            { id: "completed", label: "7. Completed" },
          ].map((step, idx) => {
            const isCurrent = job.status === step.id;
            return (
              <div
                key={step.id}
                className={`rounded-xl border p-2.5 transition-all ${
                  isCurrent
                    ? "border-violet bg-violet text-white font-bold shadow-xs"
                    : "border-border bg-paper/30 text-muted-foreground"
                }`}
              >
                <div>{step.label}</div>
              </div>
            );
          })}
        </div>

        {/* Action Dispatcher based on active stage */}
        <div className="rounded-xl border border-border/80 bg-paper/30 p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-ink">Current Stage Action:</span>
              <p className="text-xs text-muted-foreground">
                Advance the job ticket through press operations as physical work proceeds.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {job.status === "queued" && (
                <button
                  onClick={() => handleTransition("scheduled")}
                  disabled={isUpdating}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-violet px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-violet/90 transition-colors disabled:opacity-50"
                >
                  <Clock className="size-3.5" /> Schedule on Press
                </button>
              )}

              {job.status === "scheduled" && (
                <button
                  onClick={() => handleTransition("ready_to_print")}
                  disabled={isUpdating}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-cyan-700 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-cyan-800 transition-colors disabled:opacity-50"
                >
                  <Layers className="size-3.5" /> Mark Ready for Printing
                </button>
              )}

              {job.status === "ready_to_print" && (
                <button
                  onClick={() => handleTransition("printing")}
                  disabled={isUpdating}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  <Play className="size-3.5" /> Start Printing Run
                </button>
              )}

              {job.status === "printing" && (
                <button
                  onClick={() => handleTransition("finishing")}
                  disabled={isUpdating}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-amber-700 transition-colors disabled:opacity-50"
                >
                  <Sparkles className="size-3.5" /> Press Run Complete → Start Finishing
                </button>
              )}

              {job.status === "finishing" && (
                <button
                  onClick={() => handleTransition("quality_check")}
                  disabled={isUpdating}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-violet px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-violet/90 transition-colors disabled:opacity-50"
                >
                  <CheckCircle2 className="size-3.5" /> Finishing Complete → Send to Quality Control
                </button>
              )}

              {job.status === "rework_required" && (
                <button
                  onClick={() => handleTransition("printing", "Rework run initiated")}
                  disabled={isUpdating}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  <RotateCcw className="size-3.5" /> Restart Rework Printing
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quality Control (QC) Panel */}
      <div className="rounded-2xl border border-border bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-emerald-600" />
            <h2 className="font-bold text-sm text-ink uppercase font-mono tracking-wider">
              Studio Quality Control & Sign-Off
            </h2>
          </div>
          <span className="text-xs text-muted-foreground font-mono">
            QC Status: <strong className="text-ink uppercase">{job.status === "completed" ? "Passed" : job.status === "rework_required" ? "Rework Needed" : "Pending Inspection"}</strong>
          </span>
        </div>

        {/* Interactive QC Checklist */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-ink">Physical Quality Checklist:</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {qcChecklist.map((item, idx) => (
              <label
                key={item.id}
                className="flex items-start gap-2.5 rounded-xl border border-border bg-paper/40 p-3 text-xs cursor-pointer hover:border-violet/40 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={item.passed}
                  disabled={job.status === "completed"}
                  onChange={(e) => {
                    const updated = [...qcChecklist];
                    updated[idx].passed = e.target.checked;
                    setQcChecklist(updated);
                  }}
                  className="mt-0.5 rounded border-border text-violet focus:ring-violet"
                />
                <span className="text-ink leading-tight">
                  {item.label}
                  {item.required && <span className="text-red-500 font-bold ml-1">*</span>}
                </span>
              </label>
            ))}
          </div>

          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-bold text-ink">Quality Inspector Notes:</label>
            <textarea
              rows={2}
              value={qcNotes}
              disabled={job.status === "completed"}
              onChange={(e) => setQcNotes(e.target.value)}
              placeholder="Record any registration deviations, paper lot codes, or rework rationales..."
              className="w-full rounded-xl border border-border bg-paper/40 p-3 text-xs text-ink placeholder:text-muted-foreground focus:border-violet focus:outline-none"
            />
          </div>

          {job.status !== "completed" && (
            <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
              <button
                onClick={() => handleSubmitQC("failed")}
                disabled={isUpdating}
                className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-xs font-bold text-red-700 hover:bg-red-100 transition-colors disabled:opacity-50"
              >
                <RotateCcw className="size-3.5" /> Fail QC → Trigger Rework
              </button>

              <button
                onClick={() => handleSubmitQC("passed")}
                disabled={isUpdating}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                <CheckCircle2 className="size-3.5" /> Pass QC & Mark Completed
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Production Audit Trail */}
      <div className="rounded-2xl border border-border bg-white p-6 shadow-sm space-y-4">
        <h2 className="font-bold text-sm text-ink uppercase font-mono tracking-wider flex items-center gap-2">
          <Clock className="size-4 text-violet" />
          <span>Production Event Timeline ({events.length})</span>
        </h2>

        <div className="space-y-3">
          {events.length === 0 ? (
            <p className="text-xs text-muted-foreground">No production events recorded yet.</p>
          ) : (
            events.map((evt) => (
              <div
                key={evt.id}
                className="rounded-xl border border-border/80 bg-paper/30 p-3 flex items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-ink">{evt.eventType}</span>
                    <span className="rounded bg-paper border border-border px-1.5 py-0.2 text-[10px] font-mono text-muted-foreground uppercase">
                      {evt.actorType}
                    </span>
                  </div>
                  <p className="text-muted-foreground">{evt.summary}</p>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground shrink-0">
                  {new Date(evt.createdAt).toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
