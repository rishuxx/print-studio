import { createClient } from "@/lib/supabase/server";
import { requireAdminAuth } from "@/lib/supabase/admin-guard";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, RotateCcw } from "lucide-react";
import type { ResolutionRequestRecord } from "@/lib/resolutions/types";
import { AdminResolutionDetailCard } from "@/components/resolutions/admin-resolution-detail-card";

export const dynamic = "force-dynamic";

export default async function AdminResolutionDetailPage({
  params,
}: {
  params: Promise<{ resolutionId: string }>;
}) {
  await requireAdminAuth("/admin/resolutions");
  const { resolutionId } = await params;
  const supabase = await createClient();

  // Fetch full resolution ticket
  const { data: rawReq, error } = await supabase
    .from("resolution_requests")
    .select(`
      *,
      order:orders(id, order_number, user_id, status, payment_status, total, created_at),
      customer:profiles!customer_id(id, full_name, email),
      items:resolution_request_items(*, order_item:order_items(product_title, unit_price, line_price, quantity)),
      evidence:resolution_evidence(*)
    `)
    .eq("id", resolutionId)
    .maybeSingle();

  if (error || !rawReq) {
    notFound();
  }

  // Fetch signed URLs for evidence
  const evidenceWithUrls = await Promise.all(
    (rawReq.evidence || []).map(async (ev: any) => {
      const { createArtworkSignedUrl } = await import("@/lib/supabase/actions");
      const signedRes = await createArtworkSignedUrl(rawReq.order_id, ev.storage_path);
      return {
        id: ev.id,
        resolutionRequestId: ev.resolution_request_id,
        storagePath: ev.storage_path,
        originalFilename: ev.original_filename,
        mimeType: ev.mime_type,
        fileSizeBytes: Number(ev.file_size_bytes),
        checksumSha256: ev.checksum_sha256,
        uploadedBy: ev.uploaded_by,
        createdAt: ev.created_at,
        signedUrl: signedRes.success ? signedRes.signedUrl : undefined,
      };
    })
  );

  const request: ResolutionRequestRecord = {
    id: rawReq.id,
    requestNumber: rawReq.request_number,
    orderId: rawReq.order_id,
    orderNumber: (rawReq.order as any)?.order_number || rawReq.order_id,
    customerId: rawReq.customer_id,
    customerName: (rawReq.customer as any)?.full_name || null,
    customerEmail: (rawReq.customer as any)?.email || null,
    type: rawReq.type,
    status: rawReq.status,
    reasonCode: rawReq.reason_code,
    customerDescription: rawReq.customer_description,
    priority: rawReq.priority,
    adminNotes: rawReq.admin_notes,
    customerDecisionNotes: rawReq.customer_decision_notes,
    decisionAction: rawReq.decision_action,
    refundAmountPaise: rawReq.refund_amount_paise,
    replacementJobId: rawReq.replacement_job_id,
    requestedAt: rawReq.requested_at,
    reviewedAt: rawReq.reviewed_at,
    resolvedAt: rawReq.resolved_at,
    closedAt: rawReq.closed_at,
    reviewedBy: rawReq.reviewed_by,
    resolvedBy: rawReq.resolved_by,
    version: rawReq.version,
    createdAt: rawReq.created_at,
    updatedAt: rawReq.updated_at,
    items: (rawReq.items || []).map((i: any) => ({
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
    evidence: evidenceWithUrls,
  };

  return (
    <div className="space-y-6">
      {/* Back breadcrumb */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin/resolutions"
          className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-white px-3 py-1.5 text-xs font-bold text-ink hover:bg-paper transition-colors shadow-2xs"
        >
          <ArrowLeft className="size-3.5" /> Back to Resolutions Queue
        </Link>
        <span className="text-xs text-muted-foreground font-mono">
          Ticket: #{request.requestNumber}
        </span>
      </div>

      {/* Detail Card & Decision Panel */}
      <AdminResolutionDetailCard
        request={request}
        orderTotal={(rawReq.order as any)?.total || 0}
        orderPaymentStatus={(rawReq.order as any)?.payment_status || "unknown"}
      />
    </div>
  );
}
