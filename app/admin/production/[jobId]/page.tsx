import { createClient } from "@/lib/supabase/server";
import { requireAdminAuth } from "@/lib/supabase/admin-guard";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Printer, AlertCircle } from "lucide-react";
import type { ProductionJobRecord, QCRecord, ProductionJobEvent } from "@/lib/production/types";
import { JobManufacturingCard } from "@/components/production/job-manufacturing-card";

export const dynamic = "force-dynamic";

export default async function AdminJobDetailPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  await requireAdminAuth("/admin/production");
  const { jobId } = await params;
  const supabase = await createClient();

  // Fetch full production job
  const { data: rawJob, error: jobErr } = await supabase
    .from("production_jobs")
    .select(`
      *,
      order:orders(id, order_number, user_id, status, created_at),
      assigned_operator:profiles!assigned_operator_id(full_name)
    `)
    .eq("id", jobId)
    .maybeSingle();

  if (jobErr || !rawJob) {
    notFound();
  }

  const job: ProductionJobRecord = {
    id: rawJob.id,
    orderId: rawJob.order_id,
    orderItemId: rawJob.order_item_id,
    jobNumber: rawJob.job_number,
    status: rawJob.status,
    priority: rawJob.priority,
    assignedOperatorId: rawJob.assigned_operator_id,
    assignedOperatorName: rawJob.assigned_operator?.full_name || null,
    productionSpecSnapshot: rawJob.production_spec_snapshot,
    artworkManifest: rawJob.artwork_manifest,
    scheduledAt: rawJob.scheduled_at,
    startedAt: rawJob.started_at,
    printingCompletedAt: rawJob.printing_completed_at,
    finishingCompletedAt: rawJob.finishing_completed_at,
    qcCompletedAt: rawJob.qc_completed_at,
    completedAt: rawJob.completed_at,
    pausedAt: rawJob.paused_at,
    pauseReason: rawJob.pause_reason,
    reworkCount: rawJob.rework_count,
    createdAt: rawJob.created_at,
    updatedAt: rawJob.updated_at,
  };

  // Fetch QC Records for this job
  const { data: rawQc } = await supabase
    .from("production_qc_records")
    .select("*")
    .eq("production_job_id", jobId)
    .order("created_at", { ascending: false });

  const qcRecords: QCRecord[] = (rawQc || []).map((q: any) => ({
    id: q.id,
    productionJobId: q.production_job_id,
    status: q.status,
    inspectorId: q.inspector_id,
    checklist: q.checklist || [],
    defectCategory: q.defect_category,
    notes: q.notes,
    inspectedAt: q.inspected_at,
    createdAt: q.created_at,
  }));

  // Fetch events for this job
  const { data: rawEvents } = await supabase
    .from("production_job_events")
    .select("*")
    .eq("production_job_id", jobId)
    .order("created_at", { ascending: false });

  const events: ProductionJobEvent[] = (rawEvents || []).map((e: any) => ({
    id: e.id,
    productionJobId: e.production_job_id,
    orderId: e.order_id,
    eventType: e.event_type,
    actorId: e.actor_id,
    actorType: e.actor_type,
    summary: e.summary,
    metadata: e.metadata || {},
    createdAt: e.created_at,
  }));

  // Fetch available staff for assignment
  const { data: staffProfiles } = await supabase
    .from("profiles")
    .select("id, full_name, role")
    .in("role", ["owner", "admin", "staff"])
    .order("full_name");

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin/production"
          className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-white px-3 py-1.5 text-xs font-bold text-ink hover:bg-paper transition-colors shadow-2xs"
        >
          <ArrowLeft className="size-3.5" /> Back to Production Queue
        </Link>
        <span className="text-xs text-muted-foreground font-mono">
          Order #{(rawJob.order as any)?.order_number || rawJob.order_id}
        </span>
      </div>

      {/* Main Work Center Component */}
      <JobManufacturingCard
        job={job}
        orderNumber={(rawJob.order as any)?.order_number || rawJob.order_id}
        qcRecords={qcRecords}
        events={events}
        staffProfiles={staffProfiles || []}
      />
    </div>
  );
}
