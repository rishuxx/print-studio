"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdminAuth } from "@/lib/supabase/admin-guard";
import { evaluateResolutionEligibility } from "./eligibility";
import { spawnReplacementProductionJob } from "./replacement-orchestrator";
import { processPaymentRefund } from "@/lib/payments/refunds";
import { inspectArtworkBuffer } from "@/lib/artwork/file-inspector";
import { ARTWORK_BUCKET } from "@/lib/storage/artwork";
import type {
  ResolutionRequestRecord,
  ResolutionType,
  ResolutionStatus,
  ResolutionReasonCode,
  EligibilityResult,
} from "./types";

/**
 * Server Action: Customer submits resolution request
 */
export async function submitResolutionRequestAction(params: {
  orderId: string;
  type: ResolutionType;
  reasonCode: ResolutionReasonCode;
  customerDescription: string;
  items: Array<{ orderItemId: string; requestedQuantity: number }>;
}): Promise<{ success: boolean; resolutionId?: string; requestNumber?: string; error?: string }> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Authentication required to report issues." };
    }

    // 1. Authoritative Eligibility Check
    const eligibility = await evaluateResolutionEligibility({
      orderId: params.orderId,
      reasonCode: params.reasonCode,
    });

    if (!eligibility.isEligible && !eligibility.requiresReview) {
      return { success: false, error: eligibility.message };
    }

    // 2. Call Atomic RPC procedure
    const { data, error } = await supabase.rpc("atomic_create_resolution_request", {
      p_order_id: params.orderId,
      p_customer_id: user.id,
      p_type: params.type,
      p_reason_code: params.reasonCode,
      p_customer_description: params.customerDescription.trim(),
      p_items: params.items,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath(`/orders/${params.orderId}`);
    revalidatePath(`/admin/resolutions`);

    return {
      success: (data as any)?.success ?? true,
      resolutionId: (data as any)?.resolutionId,
      requestNumber: (data as any)?.requestNumber,
      error: (data as any)?.error,
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to submit resolution request.",
    };
  }
}

/**
 * Server Action: Upload evidence file for resolution request
 */
export async function uploadResolutionEvidenceAction(
  resolutionId: string,
  formData: FormData
): Promise<{ success: boolean; evidenceId?: string; error?: string }> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized." };
    }

    const file = formData.get("file") as File;
    if (!file || file.size === 0) {
      return { success: false, error: "No valid file uploaded." };
    }

    if (file.size > 15 * 1024 * 1024) {
      return { success: false, error: "File exceeds 15 MB maximum size limit." };
    }

    // 1. Binary Magic Bytes & MIME verification
    const arrayBuf = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuf);
    const inspection = inspectArtworkBuffer(buffer, file.name);

    if (!inspection.valid) {
      return { success: false, error: `Invalid file: ${inspection.error}` };
    }

    // 2. Upload to private storage
    const uniqueId = crypto.randomUUID();
    const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    const storagePath = `resolutions/${resolutionId}/${uniqueId}${ext}`;

    const { error: upErr } = await supabase.storage
      .from(ARTWORK_BUCKET)
      .upload(storagePath, buffer, {
        contentType: inspection.detectedMime,
        upsert: false,
      });

    if (upErr) {
      return { success: false, error: `Storage upload failed: ${upErr.message}` };
    }

    // 3. Insert into resolution_evidence
    const { data: ev, error: evErr } = await supabase
      .from("resolution_evidence")
      .insert({
        resolution_request_id: resolutionId,
        storage_path: storagePath,
        original_filename: file.name,
        mime_type: inspection.detectedMime,
        file_size_bytes: file.size,
        checksum_sha256: inspection.checksumSha256,
        uploaded_by: user.id,
      })
      .select("id")
      .single();

    if (evErr) {
      return { success: false, error: evErr.message };
    }

    revalidatePath(`/orders`);
    revalidatePath(`/admin/resolutions/${resolutionId}`);

    return { success: true, evidenceId: ev.id };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Evidence upload failed.",
    };
  }
}

/**
 * Server Action: Admin decision (Approve, Reject, Request Evidence, Refund, Replace)
 */
export async function decideResolutionAction(params: {
  resolutionId: string;
  targetStatus: ResolutionStatus;
  decisionAction: "refund" | "replacement" | "return_required" | "rejected" | "evidence_required";
  adminNotes: string;
  customerNotes: string;
  refundAmountPaise?: number;
  expectedVersion: number;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const { user } = await requireAdminAuth("/admin/resolutions");
    const supabase = await createClient();

    // 1. Fetch resolution request
    const { data: req, error: reqErr } = await supabase
      .from("resolution_requests")
      .select("*, order:orders(id, order_number, payment_status, total), items:resolution_request_items(*)")
      .eq("id", params.resolutionId)
      .single();

    if (reqErr || !req) {
      return { success: false, error: "Resolution request not found." };
    }

    // 2. If decision is REFUND, invoke the authoritative refund engine
    if (params.decisionAction === "refund" && params.refundAmountPaise && params.refundAmountPaise > 0) {
      // Find captured payment for this order
      const { data: payment } = await supabase
        .from("payments")
        .select("id, status, amount")
        .eq("order_id", req.order_id)
        .in("status", ["captured", "partially_refunded"])
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!payment) {
        return {
          success: false,
          error: "Cannot process refund: No captured payment record found for this order.",
        };
      }

      const idempotencyKey = `res_refund_${params.resolutionId}_v${params.expectedVersion}`;
      const refundRes = await processPaymentRefund({
        paymentId: payment.id,
        amountMinor: params.refundAmountPaise,
        reason: `Resolution #${req.request_number}: ${params.customerNotes || "Post-delivery resolution"}`,
        idempotencyKey,
      });

      if (!refundRes.success && !refundRes.alreadyProcessed) {
        return {
          success: false,
          error: `Razorpay refund failed: ${refundRes.error}`,
        };
      }
    }

    // 3. If decision is REPLACEMENT, spawn urgent manufacturing jobs
    if (params.decisionAction === "replacement") {
      for (const item of (req.items || [])) {
        await spawnReplacementProductionJob({
          orderId: req.order_id,
          resolutionRequestId: req.id,
          orderItemId: item.order_item_id,
          replacementQuantity: item.requested_quantity,
          actorId: user.id,
        });
      }
    }

    // 4. Update resolution record via atomic stored procedure
    const { data, error } = await supabase.rpc("atomic_decide_resolution", {
      p_resolution_id: params.resolutionId,
      p_reviewer_id: user.id,
      p_target_status: params.targetStatus,
      p_decision_action: params.decisionAction,
      p_admin_notes: params.adminNotes,
      p_customer_notes: params.customerNotes,
      p_refund_amount_paise: params.refundAmountPaise || 0,
      p_expected_version: params.expectedVersion,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath(`/admin/resolutions`);
    revalidatePath(`/admin/resolutions/${params.resolutionId}`);
    revalidatePath(`/orders/${req.order_id}`);

    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to record resolution decision.",
    };
  }
}

/**
 * Server Action: Fetch resolution request for an order
 */
export async function fetchOrderResolutionAction(orderId: string): Promise<{
  success: boolean;
  resolution?: ResolutionRequestRecord | null;
  error?: string;
}> {
  try {
    const supabase = await createClient();

    const { data: req, error } = await supabase
      .from("resolution_requests")
      .select(`
        *,
        items:resolution_request_items(*, order_item:order_items(product_title)),
        evidence:resolution_evidence(*)
      `)
      .eq("order_id", orderId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      return { success: false, error: error.message };
    }

    if (!req) {
      return { success: true, resolution: null };
    }

    const mapped: ResolutionRequestRecord = {
      id: req.id,
      requestNumber: req.request_number,
      orderId: req.order_id,
      customerId: req.customer_id,
      type: req.type,
      status: req.status,
      reasonCode: req.reason_code,
      customerDescription: req.customer_description,
      priority: req.priority,
      adminNotes: req.admin_notes,
      customerDecisionNotes: req.customer_decision_notes,
      decisionAction: req.decision_action,
      refundAmountPaise: req.refund_amount_paise,
      replacementJobId: req.replacement_job_id,
      requestedAt: req.requested_at,
      reviewedAt: req.reviewed_at,
      resolvedAt: req.resolved_at,
      closedAt: req.closed_at,
      reviewedBy: req.reviewed_by,
      resolvedBy: req.resolved_by,
      version: req.version,
      createdAt: req.created_at,
      updatedAt: req.updated_at,
      items: (req.items || []).map((i: any) => ({
        id: i.id,
        resolutionRequestId: i.resolution_request_id,
        orderItemId: i.order_item_id,
        productTitle: i.order_item?.product_title || "Print Item",
        requestedQuantity: i.requested_quantity,
        approvedQuantity: i.approved_quantity,
        reasonCode: i.reason_code,
        decision: i.decision,
        createdAt: i.created_at,
      })),
      evidence: (req.evidence || []).map((e: any) => ({
        id: e.id,
        resolutionRequestId: e.resolution_request_id,
        storagePath: e.storage_path,
        originalFilename: e.original_filename,
        mimeType: e.mime_type,
        fileSizeBytes: Number(e.file_size_bytes),
        checksumSha256: e.checksum_sha256,
        uploadedBy: e.uploaded_by,
        createdAt: e.created_at,
      })),
    };

    return { success: true, resolution: mapped };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to load order resolution.",
    };
  }
}
