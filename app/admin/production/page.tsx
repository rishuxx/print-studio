import { createClient } from "@/lib/supabase/server";
import { requireAdminAuth } from "@/lib/supabase/admin-guard";
import { ProductionQueueTable } from "@/components/production/production-queue-table";
import { fetchProductionMetrics } from "@/lib/production/job-service";
import type { ProductionJobRecord } from "@/lib/production/types";
import {
  Printer,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Sparkles,
  RotateCcw,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminProductionPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; priority?: string; q?: string }>;
}) {
  await requireAdminAuth("/admin/production");
  const params = await searchParams;
  const supabase = await createClient();

  // 1. Fetch live metrics
  const metrics = await fetchProductionMetrics();

  // 2. Query production jobs with filters
  let query = supabase
    .from("production_jobs")
    .select(`
      *,
      order:orders(order_number),
      assigned_operator:profiles!assigned_operator_id(full_name)
    `)
    .order("created_at", { ascending: false });

  if (params.status && params.status !== "all") {
    query = query.eq("status", params.status);
  }

  if (params.priority && params.priority !== "all") {
    query = query.eq("priority", params.priority);
  }

  const { data: rawJobs, error } = await query.limit(100);

  const jobs: ProductionJobRecord[] = (rawJobs || []).map((j: any) => ({
    id: j.id,
    orderId: j.order_id,
    orderItemId: j.order_item_id,
    jobNumber: j.job_number,
    status: j.status,
    priority: j.priority,
    assignedOperatorId: j.assigned_operator_id,
    assignedOperatorName: j.assigned_operator?.full_name || null,
    productionSpecSnapshot: j.production_spec_snapshot,
    artworkManifest: j.artwork_manifest,
    scheduledAt: j.scheduled_at,
    startedAt: j.started_at,
    printingCompletedAt: j.printing_completed_at,
    finishingCompletedAt: j.finishing_completed_at,
    qcCompletedAt: j.qc_completed_at,
    completedAt: j.completed_at,
    pausedAt: j.paused_at,
    pauseReason: j.pause_reason,
    reworkCount: j.rework_count,
    createdAt: j.created_at,
    updatedAt: j.updated_at,
  }));

  // Fetch staff profiles for operator assignment dropdowns
  const { data: staffProfiles } = await supabase
    .from("profiles")
    .select("id, full_name, role")
    .in("role", ["owner", "admin", "staff"])
    .order("full_name");

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink">
            Production & Press Queue
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Real-time manufacturing dispatch, press scheduling, finishing, and quality control.
          </p>
        </div>
      </div>

      {/* Real-time Production Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="rounded-xl border border-border bg-white p-4 shadow-xs">
          <div className="flex items-center gap-1.5 text-slate-600 text-xs font-mono font-bold uppercase">
            <Clock className="size-3.5" /> Queued
          </div>
          <p className="font-display font-black text-2xl text-ink mt-2">{metrics.queued}</p>
        </div>

        <div className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-4 shadow-xs">
          <div className="flex items-center gap-1.5 text-indigo-700 text-xs font-mono font-bold uppercase">
            <Printer className="size-3.5" /> Printing
          </div>
          <p className="font-display font-black text-2xl text-indigo-900 mt-2">{metrics.printing}</p>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 shadow-xs">
          <div className="flex items-center gap-1.5 text-amber-700 text-xs font-mono font-bold uppercase">
            <Sparkles className="size-3.5" /> Finishing
          </div>
          <p className="font-display font-black text-2xl text-amber-900 mt-2">{metrics.finishing}</p>
        </div>

        <div className="rounded-xl border border-violet/20 bg-violet/5 p-4 shadow-xs">
          <div className="flex items-center gap-1.5 text-violet text-xs font-mono font-bold uppercase">
            <Layers className="size-3.5" /> Quality Check
          </div>
          <p className="font-display font-black text-2xl text-violet mt-2">{metrics.qualityCheck}</p>
        </div>

        <div className="rounded-xl border border-red-200 bg-red-50/50 p-4 shadow-xs">
          <div className="flex items-center gap-1.5 text-red-700 text-xs font-mono font-bold uppercase">
            <RotateCcw className="size-3.5" /> Rework
          </div>
          <p className="font-display font-black text-2xl text-red-900 mt-2">{metrics.reworkRequired}</p>
        </div>

        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-xs">
          <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-mono font-bold uppercase">
            <CheckCircle2 className="size-3.5" /> Completed Today
          </div>
          <p className="font-display font-black text-2xl text-emerald-900 mt-2">{metrics.completedToday}</p>
        </div>
      </div>

      {/* Filterable Table */}
      <ProductionQueueTable
        jobs={jobs}
        staffProfiles={staffProfiles || []}
        activeStatus={params.status || "all"}
        activePriority={params.priority || "all"}
      />
    </div>
  );
}
