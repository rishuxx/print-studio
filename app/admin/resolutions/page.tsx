import { createClient } from "@/lib/supabase/server";
import { requireAdminAuth } from "@/lib/supabase/admin-guard";
import { AdminResolutionTable } from "@/components/resolutions/admin-resolution-table";
import type { ResolutionRequestRecord } from "@/lib/resolutions/types";
import {
  RotateCcw,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Sparkles,
  CreditCard,
  ShieldCheck,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminResolutionsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; type?: string; priority?: string; q?: string }>;
}) {
  await requireAdminAuth("/admin/resolutions");
  const params = await searchParams;
  const supabase = await createClient();

  // 1. Build Query
  let query = supabase
    .from("resolution_requests")
    .select(`
      *,
      order:orders(order_number),
      customer:profiles!customer_id(full_name, email),
      items:resolution_request_items(*),
      evidence:resolution_evidence(*)
    `)
    .order("created_at", { ascending: false });

  if (params.status && params.status !== "all") {
    query = query.eq("status", params.status);
  }

  if (params.type && params.type !== "all") {
    query = query.eq("type", params.type);
  }

  if (params.priority && params.priority !== "all") {
    query = query.eq("priority", params.priority);
  }

  const { data: rawRequests, error } = await query.limit(100);

  const requests: ResolutionRequestRecord[] = (rawRequests || []).map((r: any) => ({
    id: r.id,
    requestNumber: r.request_number,
    orderId: r.order_id,
    orderNumber: r.order?.order_number || r.order_id,
    customerId: r.customer_id,
    customerName: r.customer?.full_name || null,
    customerEmail: r.customer?.email || null,
    type: r.type,
    status: r.status,
    reasonCode: r.reason_code,
    customerDescription: r.customer_description,
    priority: r.priority,
    adminNotes: r.admin_notes,
    customerDecisionNotes: r.customer_decision_notes,
    decisionAction: r.decision_action,
    refundAmountPaise: r.refund_amount_paise,
    replacementJobId: r.replacement_job_id,
    requestedAt: r.requested_at,
    reviewedAt: r.reviewed_at,
    resolvedAt: r.resolved_at,
    closedAt: r.closed_at,
    reviewedBy: r.reviewed_by,
    resolvedBy: r.resolved_by,
    version: r.version,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    items: r.items || [],
    evidence: r.evidence || [],
  }));

  // Calculate Metrics
  const total = requests.length;
  const pendingReview = requests.filter((r) => r.status === "submitted" || r.status === "under_review").length;
  const replacements = requests.filter((r) => r.status === "replacement_in_progress").length;
  const refundsPending = requests.filter((r) => r.status === "refund_pending").length;
  const resolved = requests.filter((r) => r.status === "resolved" || r.status === "closed").length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink flex items-center gap-2.5">
          <RotateCcw className="size-7 text-violet" />
          <span>Returns, Replacements & Post-Delivery Resolutions</span>
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Review reported manufacturing defects, shipping damages, approve replacements, and process source refunds.
        </p>
      </div>

      {/* Real-time Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-border bg-white p-4 shadow-xs">
          <div className="flex items-center gap-1.5 text-amber-700 text-xs font-mono font-bold uppercase">
            <Clock className="size-3.5" /> Pending Review
          </div>
          <p className="font-display font-black text-2xl text-ink mt-2">{pendingReview}</p>
        </div>

        <div className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-4 shadow-xs">
          <div className="flex items-center gap-1.5 text-indigo-700 text-xs font-mono font-bold uppercase">
            <Sparkles className="size-3.5" /> Replacements
          </div>
          <p className="font-display font-black text-2xl text-indigo-900 mt-2">{replacements}</p>
        </div>

        <div className="rounded-xl border border-violet/20 bg-violet/5 p-4 shadow-xs">
          <div className="flex items-center gap-1.5 text-violet text-xs font-mono font-bold uppercase">
            <CreditCard className="size-3.5" /> Refunds Pending
          </div>
          <p className="font-display font-black text-2xl text-violet mt-2">{refundsPending}</p>
        </div>

        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-xs">
          <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-mono font-bold uppercase">
            <CheckCircle2 className="size-3.5" /> Resolved Cases
          </div>
          <p className="font-display font-black text-2xl text-emerald-900 mt-2">{resolved}</p>
        </div>
      </div>

      {/* Table */}
      <AdminResolutionTable
        requests={requests}
        activeStatus={params.status || "all"}
        activeType={params.type || "all"}
        activePriority={params.priority || "all"}
      />
    </div>
  );
}
