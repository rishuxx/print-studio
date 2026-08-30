import * as React from "react";
import Link from "next/link";
import { AttentionMetric } from "@/lib/admin/dashboard/types";
import { ArrowRight, CheckCircle2, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardAttentionProps {
  items: AttentionMetric[];
}

export function DashboardAttention({ items }: DashboardAttentionProps) {
  if (!items || items.length === 0) {
    return (
      <div className="rounded-2xl border border-border/80 bg-white p-6 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-emerald-700">
          <CheckCircle2 className="size-5" />
          <h3 className="font-display text-base font-bold">Operational Pipeline Clear</h3>
        </div>
        <p className="text-xs text-muted-foreground">
          There are currently no delayed orders, blocking artwork reviews, or critical payment exceptions requiring immediate intervention.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border/80 bg-white p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-amber-100 text-amber-800">
            <ShieldAlert className="size-4" />
          </div>
          <div>
            <h3 className="font-display text-base font-bold text-ink">Requires Operational Attention</h3>
            <p className="text-xs text-muted-foreground">Blocking bottlenecks across pre-press, proofs & verification</p>
          </div>
        </div>
        <span className="rounded-md bg-amber-50 px-2 py-0.5 font-mono text-[0.6875rem] font-bold text-amber-700 border border-amber-200">
          {items.length} Action{items.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => {
          const isUrgent = item.severity === "urgent";
          const isWarning = item.severity === "warning";

          return (
            <div
              key={item.id}
              className={cn(
                "flex flex-col justify-between rounded-xl border p-4 transition-all",
                isUrgent && "border-rose-200 bg-rose-50/40 hover:border-rose-300",
                isWarning && "border-amber-200 bg-amber-50/40 hover:border-amber-300",
                !isUrgent && !isWarning && "border-border/80 bg-paper/60 hover:border-border"
              )}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "font-mono text-xs font-bold uppercase tracking-wider",
                      isUrgent && "text-rose-700",
                      isWarning && "text-amber-800",
                      !isUrgent && !isWarning && "text-ink"
                    )}
                  >
                    {item.title}
                  </span>
                  <span
                    className={cn(
                      "flex size-6 items-center justify-center rounded-full font-mono text-xs font-black",
                      isUrgent && "bg-rose-600 text-white",
                      isWarning && "bg-amber-600 text-white",
                      !isUrgent && !isWarning && "bg-violet text-white"
                    )}
                  >
                    {item.count}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-end">
                <Link
                  href={item.href}
                  className={cn(
                    "inline-flex items-center gap-1 text-xs font-bold transition-all hover:underline",
                    isUrgent && "text-rose-700",
                    isWarning && "text-amber-800",
                    !isUrgent && !isWarning && "text-violet"
                  )}
                >
                  <span>{item.actionLabel}</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
