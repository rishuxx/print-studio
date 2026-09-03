import * as React from "react";
import { cn } from "@/lib/utils";
import type { ProductionJobStatus } from "@/lib/production/types";
import {
  Clock,
  Printer,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Pause,
  XCircle,
  Layers,
} from "lucide-react";

interface ProductionStatusBadgeProps {
  status: ProductionJobStatus;
  className?: string;
}

export function ProductionStatusBadge({ status, className }: ProductionStatusBadgeProps) {
  switch (status) {
    case "queued":
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-[11px] font-bold text-slate-700 font-mono uppercase tracking-wider",
            className
          )}
        >
          <Clock className="size-3" /> Queued
        </span>
      );
    case "scheduled":
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-[11px] font-bold text-blue-700 font-mono uppercase tracking-wider",
            className
          )}
        >
          <Clock className="size-3" /> Scheduled
        </span>
      );
    case "preflight":
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full bg-purple-50 border border-purple-200 px-2.5 py-0.5 text-[11px] font-bold text-purple-700 font-mono uppercase tracking-wider",
            className
          )}
        >
          <Layers className="size-3" /> Preflight
        </span>
      );
    case "ready_to_print":
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full bg-cyan-50 border border-cyan-200 px-2.5 py-0.5 text-[11px] font-bold text-cyan-800 font-mono uppercase tracking-wider",
            className
          )}
        >
          <Printer className="size-3" /> Ready To Print
        </span>
      );
    case "printing":
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 text-[11px] font-bold text-indigo-700 font-mono uppercase tracking-wider animate-pulse",
            className
          )}
        >
          <Printer className="size-3" /> Printing
        </span>
      );
    case "finishing":
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-[11px] font-bold text-amber-800 font-mono uppercase tracking-wider",
            className
          )}
        >
          <Sparkles className="size-3" /> Finishing
        </span>
      );
    case "quality_check":
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full bg-violet/10 border border-violet/20 px-2.5 py-0.5 text-[11px] font-bold text-violet font-mono uppercase tracking-wider",
            className
          )}
        >
          <Layers className="size-3" /> Quality Check
        </span>
      );
    case "completed":
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 font-mono uppercase tracking-wider",
            className
          )}
        >
          <CheckCircle2 className="size-3" /> Completed
        </span>
      );
    case "rework_required":
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full bg-red-50 border border-red-200 px-2.5 py-0.5 text-[11px] font-bold text-red-800 font-mono uppercase tracking-wider",
            className
          )}
        >
          <RotateCcw className="size-3" /> Rework Required
        </span>
      );
    case "paused":
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full bg-amber-100 border border-amber-300 px-2.5 py-0.5 text-[11px] font-bold text-amber-900 font-mono uppercase tracking-wider",
            className
          )}
        >
          <Pause className="size-3" /> Paused
        </span>
      );
    case "cancelled":
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full bg-zinc-100 border border-zinc-300 px-2.5 py-0.5 text-[11px] font-bold text-zinc-600 font-mono uppercase tracking-wider",
            className
          )}
        >
          <XCircle className="size-3" /> Cancelled
        </span>
      );
    default:
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full bg-paper border border-border px-2.5 py-0.5 text-[11px] font-bold text-muted-foreground font-mono uppercase tracking-wider",
            className
          )}
        >
          {status}
        </span>
      );
  }
}
