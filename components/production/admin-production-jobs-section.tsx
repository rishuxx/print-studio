import * as React from "react";
import Link from "next/link";
import {
  Printer,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import type { ProductionJobRecord } from "@/lib/production/types";
import { spawnProductionJobsAction } from "@/lib/production/actions";
import { ProductionStatusBadge } from "@/components/production/production-status-badge";
import { toast } from "sonner";

interface AdminProductionJobsSectionProps {
  orderId: string;
  orderNumber: string;
  orderStatus: string;
  jobs: ProductionJobRecord[];
  onRefresh?: () => void;
}

export function AdminProductionJobsSection({
  orderId,
  orderNumber,
  orderStatus,
  jobs,
  onRefresh,
}: AdminProductionJobsSectionProps) {
  const [isSpawning, setIsSpawning] = React.useState(false);

  const handleSpawnJobs = async () => {
    setIsSpawning(true);
    const toastId = toast.loading("Spawning manufacturing production jobs...");
    try {
      const res = await spawnProductionJobsAction(orderId);
      toast.dismiss(toastId);
      if (res.success) {
        toast.success(`Successfully initialized ${res.jobsCreated} production job(s)!`);
        onRefresh?.();
      } else {
        toast.error(res.error || "Failed to initialize production jobs.");
      }
    } catch (err: unknown) {
      toast.dismiss(toastId);
      toast.error(err instanceof Error ? err.message : "Error spawning jobs.");
    } finally {
      setIsSpawning(false);
    }
  };

  const hasJobs = jobs && jobs.length > 0;
  const allCompleted = hasJobs && jobs.every((j) => j.status === "completed");

  return (
    <div className="rounded-2xl border border-border bg-white p-6 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <Printer className="size-4 text-violet" />
          <h2 className="font-bold text-sm text-ink uppercase font-mono tracking-wider">
            Manufacturing Jobs & Production Queue
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {hasJobs ? (
            <span className="rounded-full bg-paper border border-border px-2.5 py-1 text-xs font-mono text-muted-foreground">
              {jobs.filter((j) => j.status === "completed").length}/{jobs.length} Jobs Completed
            </span>
          ) : (
            <span className="rounded-full bg-amber-50 border border-amber-200 px-2.5 py-1 text-xs font-mono text-amber-800">
              Not Yet Spawned
            </span>
          )}
        </div>
      </div>

      {!hasJobs ? (
        <div className="rounded-xl border border-dashed border-border bg-paper/50 p-6 text-center space-y-3">
          <Layers className="size-8 text-muted-foreground mx-auto" />
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-ink">No Production Jobs Initialized</h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Production jobs decompose each validated order item into discrete manufacturing work tickets
              with frozen specs and proof locks.
            </p>
          </div>
          <button
            onClick={handleSpawnJobs}
            disabled={isSpawning}
            className="inline-flex items-center gap-2 rounded-xl bg-violet px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-violet/90 transition-colors disabled:opacity-50"
          >
            <Printer className="size-3.5" />
            {isSpawning ? "Spawning Jobs..." : "Spawn Production Jobs Now"}
          </button>
        </div>
      ) : (
        <div className="divide-y divide-border/60">
          {jobs.map((job) => {
            const spec = job.productionSpecSnapshot;
            const dims = spec?.productionSpecification?.dimensions;

            return (
              <div
                key={job.id}
                className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-bold text-sm text-ink">{job.jobNumber}</span>
                    <ProductionStatusBadge status={job.status} />
                    <span className="rounded bg-paper border border-border px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground uppercase">
                      Priority: {job.priority}
                    </span>
                    {job.reworkCount > 0 && (
                      <span className="rounded bg-amber-100 border border-amber-200 px-1.5 py-0.5 text-[10px] font-mono text-amber-900">
                        Rework #{job.reworkCount}
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-muted-foreground">
                    <span className="font-medium text-ink">{spec.productTitle}</span>
                    {" • "}
                    <span>Qty: {spec.quantity}</span>
                    {dims && <span> • Dimensions: {dims.formatted || `${dims.width}×${dims.height} ${dims.unit}`}</span>}
                    {job.assignedOperatorName && (
                      <span> • Assigned: <strong className="text-ink">{job.assignedOperatorName}</strong></span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/admin/production/${job.id}`}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-white px-3 py-1.5 text-xs font-bold text-ink hover:bg-paper hover:border-violet/40 transition-colors shadow-xs"
                  >
                    Open Work Center
                    <ArrowRight className="size-3 text-violet" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
