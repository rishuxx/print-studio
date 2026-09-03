"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdminAuth } from "@/lib/supabase/admin-guard";
import {
  spawnProductionJobsForOrder,
  transitionProductionJob,
  submitQCInspection,
} from "./job-service";
import type {
  ProductionJobRecord,
  ProductionJobStatus,
  ProductionPriority,
  QCRecord,
  ProductionJobEvent,
  QCChecklistItem,
} from "./types";

/**
 * Server Action: Spawn production jobs for an order
 */
export async function spawnProductionJobsAction(orderId: string): Promise<{
  success: boolean;
  jobsCreated?: number;
  error?: string;
}> {
  try {
    const { user } = await requireAdminAuth("/admin/orders");
    const res = await spawnProductionJobsForOrder(orderId, user.id);
    if (res.success) {
      revalidatePath(`/admin/orders/${orderId}`);
      revalidatePath(`/admin/production`);
    }
    return res;
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to spawn production jobs.",
    };
  }
}

/**
 * Server Action: Advance production job status
 */
export async function transitionProductionJobAction(
  jobId: string,
  targetStatus: ProductionJobStatus,
  reason?: string
): Promise<{ success: boolean; newStatus?: ProductionJobStatus; error?: string }> {
  try {
    const { user } = await requireAdminAuth("/admin/production");
    const res = await transitionProductionJob(jobId, targetStatus, user.id, reason);
    if (res.success) {
      revalidatePath(`/admin/production`);
      revalidatePath(`/admin/production/${jobId}`);
    }
    return res;
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to transition production job.",
    };
  }
}

/**
 * Server Action: Assign an operator to a production job
 */
export async function assignJobOperatorAction(
  jobId: string,
  operatorId: string | null
): Promise<{ success: boolean; error?: string }> {
  try {
    const { user } = await requireAdminAuth("/admin/production");
    const supabase = await createClient();

    const { error } = await supabase
      .from("production_jobs")
      .update({ assigned_operator_id: operatorId, updated_at: new Date().toISOString() })
      .eq("id", jobId);

    if (error) {
      return { success: false, error: error.message };
    }

    // Insert audit event
    await supabase.from("production_job_events").insert({
      production_job_id: jobId,
      order_id: (await supabase.from("production_jobs").select("order_id").eq("id", jobId).single()).data?.order_id,
      event_type: "OPERATOR_ASSIGNED",
      actor_id: user.id,
      actor_type: "admin",
      summary: operatorId ? "Operator assigned to production job" : "Operator unassigned from job",
      metadata: { operatorId },
    });

    revalidatePath(`/admin/production`);
    revalidatePath(`/admin/production/${jobId}`);
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to assign operator.",
    };
  }
}

/**
 * Server Action: Update job priority
 */
export async function updateJobPriorityAction(
  jobId: string,
  priority: ProductionPriority,
  reason: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { user } = await requireAdminAuth("/admin/production");
    const supabase = await createClient();

    const { error } = await supabase
      .from("production_jobs")
      .update({ priority, updated_at: new Date().toISOString() })
      .eq("id", jobId);

    if (error) {
      return { success: false, error: error.message };
    }

    // Insert audit event
    await supabase.from("production_job_events").insert({
      production_job_id: jobId,
      order_id: (await supabase.from("production_jobs").select("order_id").eq("id", jobId).single()).data?.order_id,
      event_type: "PRIORITY_UPDATED",
      actor_id: user.id,
      actor_type: "admin",
      summary: `Job priority updated to ${priority.toUpperCase()}`,
      metadata: { priority, reason },
    });

    revalidatePath(`/admin/production`);
    revalidatePath(`/admin/production/${jobId}`);
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update priority.",
    };
  }
}

/**
 * Server Action: Submit Quality Control inspection
 */
export async function submitQCInspectionAction(
  jobId: string,
  result: "passed" | "failed" | "rework_required",
  checklist: QCChecklistItem[],
  notes: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { user } = await requireAdminAuth("/admin/production");
    const res = await submitQCInspection(jobId, user.id, result, checklist, notes);
    if (res.success) {
      revalidatePath(`/admin/production`);
      revalidatePath(`/admin/production/${jobId}`);
    }
    return res;
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "QC submission failed.",
    };
  }
}

/**
 * Server Action: Fetch production jobs for an order (used by admin order view)
 */
export async function fetchOrderProductionJobsAction(orderId: string): Promise<{
  success: boolean;
  jobs?: ProductionJobRecord[];
  error?: string;
}> {
  try {
    const supabase = await createClient();

    const { data: jobs, error } = await supabase
      .from("production_jobs")
      .select(`
        *,
        assigned_operator:profiles!assigned_operator_id(full_name)
      `)
      .eq("order_id", orderId)
      .order("created_at", { ascending: true });

    if (error) {
      return { success: false, error: error.message };
    }

    const mapped: ProductionJobRecord[] = (jobs || []).map((j: any) => ({
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

    return { success: true, jobs: mapped };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to load production jobs.",
    };
  }
}
