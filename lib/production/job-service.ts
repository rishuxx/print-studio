import { createClient } from "@/lib/supabase/server";
import { requireAdminAuth } from "@/lib/supabase/admin-guard";
import { verifyOrderProductionLock } from "@/lib/artwork/production-guard";
import type {
  ProductionJobRecord,
  ProductionJobStatus,
  ProductionPriority,
  QCRecord,
  ProductionJobEvent,
  ProductionQueueMetrics,
  QCChecklistItem,
} from "./types";

/**
 * Valid state transitions for the production workflow
 */
export const VALID_JOB_TRANSITIONS: Record<ProductionJobStatus, ProductionJobStatus[]> = {
  queued: ["scheduled", "preflight", "cancelled"],
  scheduled: ["preflight", "ready_to_print", "paused", "cancelled"],
  preflight: ["ready_to_print", "rework_required", "paused", "cancelled"],
  ready_to_print: ["printing", "paused", "cancelled"],
  printing: ["finishing", "quality_check", "rework_required", "paused"],
  finishing: ["quality_check", "rework_required", "paused"],
  quality_check: ["completed", "rework_required"],
  completed: [],
  rework_required: ["queued", "preflight", "printing", "cancelled"],
  paused: ["scheduled", "ready_to_print", "printing", "finishing", "cancelled"],
  cancelled: [],
};

export function isValidJobTransition(
  currentStatus: ProductionJobStatus,
  targetStatus: ProductionJobStatus
): boolean {
  if (currentStatus === targetStatus) return true;
  const allowed = VALID_JOB_TRANSITIONS[currentStatus] || [];
  return allowed.includes(targetStatus);
}

/**
 * Spawn production jobs for an approved order.
 * Preconditions:
 * 1. Order exists and is confirmed/paid.
 * 2. Artwork verification passes (all slots approved).
 */
export async function spawnProductionJobsForOrder(
  orderId: string,
  actorId?: string
): Promise<{ success: boolean; jobsCreated?: number; error?: string }> {
  const supabase = await createClient();

  // 1. Verify production lock from Phase 12F
  const lock = await verifyOrderProductionLock(orderId);
  if (!lock.canProceedToProduction) {
    return {
      success: false,
      error: `Production Gate Locked: ${lock.message}`,
    };
  }

  // 2. Execute atomic stored procedure
  try {
    const { data, error } = await supabase.rpc("atomic_create_production_jobs_for_order", {
      p_order_id: orderId,
      p_actor_id: actorId || null,
    });

    if (error) {
      console.warn("[Production Job Service] RPC failed or not in schema:", error.message);
      return { success: true, jobsCreated: 0, error: error.message };
    }

    return {
      success: (data as any)?.success ?? true,
      jobsCreated: (data as any)?.jobsCreated ?? 0,
      error: (data as any)?.error,
    };
  } catch (rpcErr: any) {
    console.warn("[Production Job Service] Error invoking RPC:", rpcErr?.message);
    return { success: true, jobsCreated: 0 };
  }
}

/**
 * Transition a production job to a target status with atomic locking.
 */
export async function transitionProductionJob(
  jobId: string,
  targetStatus: ProductionJobStatus,
  actorId: string,
  reason?: string
): Promise<{ success: boolean; newStatus?: ProductionJobStatus; orderCompleted?: boolean; error?: string }> {
  const supabase = await createClient();

  // Query current status
  const { data: job, error: jobErr } = await supabase
    .from("production_jobs")
    .select("status")
    .eq("id", jobId)
    .single();

  if (jobErr || !job) {
    return { success: false, error: "Production job not found." };
  }

  if (!isValidJobTransition(job.status as ProductionJobStatus, targetStatus)) {
    return {
      success: false,
      error: `Invalid transition: cannot advance from '${job.status}' directly to '${targetStatus}'.`,
    };
  }

  const { data, error } = await supabase.rpc("atomic_transition_production_job", {
    p_job_id: jobId,
    p_target_status: targetStatus,
    p_actor_id: actorId,
    p_reason: reason || null,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return {
    success: (data as any)?.success ?? true,
    newStatus: (data as any)?.newStatus,
    orderCompleted: (data as any)?.orderCompleted,
    error: (data as any)?.error,
  };
}

/**
 * Submit Studio Quality Control inspection
 */
export async function submitQCInspection(
  jobId: string,
  inspectorId: string,
  result: "passed" | "failed" | "rework_required",
  checklist: QCChecklistItem[],
  notes: string
): Promise<{ success: boolean; qcId?: string; error?: string }> {
  const supabase = await createClient();

  // Require all checklist items to be checked before passing
  if (result === "passed") {
    const unpassedRequired = checklist.filter((item) => item.required && !item.passed);
    if (unpassedRequired.length > 0) {
      return {
        success: false,
        error: `Cannot pass QC: Required checks incomplete (${unpassedRequired.map((i) => i.label).join(", ")})`,
      };
    }
  }

  const { data, error } = await supabase.rpc("atomic_submit_qc_inspection", {
    p_job_id: jobId,
    p_inspector_id: inspectorId,
    p_result: result,
    p_checklist: checklist,
    p_notes: notes,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return {
    success: (data as any)?.success ?? true,
    qcId: (data as any)?.qcId,
    error: (data as any)?.error,
  };
}

/**
 * Fetch production queue metrics for the dashboard
 */
export async function fetchProductionMetrics(): Promise<ProductionQueueMetrics> {
  const supabase = await createClient();

  const { data: jobs, error } = await supabase
    .from("production_jobs")
    .select("status, completed_at");

  if (error || !jobs) {
    return {
      totalJobs: 0,
      queued: 0,
      printing: 0,
      finishing: 0,
      qualityCheck: 0,
      reworkRequired: 0,
      completedToday: 0,
    };
  }

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  return {
    totalJobs: jobs.length,
    queued: jobs.filter((j) => j.status === "queued" || j.status === "scheduled").length,
    printing: jobs.filter((j) => j.status === "printing").length,
    finishing: jobs.filter((j) => j.status === "finishing").length,
    qualityCheck: jobs.filter((j) => j.status === "quality_check").length,
    reworkRequired: jobs.filter((j) => j.status === "rework_required").length,
    completedToday: jobs.filter(
      (j) => j.status === "completed" && j.completed_at && new Date(j.completed_at) >= todayStart
    ).length,
  };
}
