import { requireAdminAuth } from "@/lib/supabase/admin-guard";
import { createClient } from "@/lib/supabase/server";
import { AdminPaymentDetailClientView } from "@/components/admin/payments/admin-payment-detail-client-view";
import Link from "next/link";
import { ArrowLeft, AlertCircle } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Payment Transaction Audit · Admin Console",
};

interface AdminPaymentDetailPageProps {
  params: Promise<{ paymentId: string }>;
}

export default async function AdminPaymentDetailPage({ params }: AdminPaymentDetailPageProps) {
  const { paymentId: rawPaymentId } = await params;
  const paymentId = rawPaymentId ? decodeURIComponent(rawPaymentId) : "";

  // 1. Strict Server-side Guard Authorization
  await requireAdminAuth(`/admin/payments/${paymentId}`);

  const supabase = await createClient();

  // 2. Fetch full payment record with joined order, order items, and refunds
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(paymentId);

  let query = supabase
    .from("payments")
    .select("*, orders(*, order_items(*), order_events(*))");

  if (isUuid) {
    query = query.or(`id.eq.${paymentId},provider_payment_id.eq.${paymentId}`);
  } else {
    query = query.or(`provider_payment_id.eq.${paymentId},provider_order_id.eq.${paymentId}`);
  }

  const { data: dbPayment, error } = await query.maybeSingle();

  if (error || !dbPayment) {
    return (
      <div className="shell py-12 max-w-xl mx-auto text-center space-y-4">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-paper text-muted-foreground">
          <AlertCircle className="size-6 text-violet" />
        </div>
        <h1 className="font-display text-2xl font-bold text-ink">Payment Record Not Found</h1>
        <p className="text-xs text-muted-foreground">No transaction was found matching identifier &ldquo;{paymentId}&rdquo; in PostgreSQL.</p>
        <Link
          href="/admin/payments"
          className="inline-flex items-center gap-2 rounded-xl bg-violet px-6 py-2.5 text-xs font-bold text-white shadow-lift hover:bg-violet-lift transition-all"
        >
          <ArrowLeft className="size-4" />
          <span>Return to Payments Console</span>
        </Link>
      </div>
    );
  }

  // 3. Fetch any registered refunds for this payment
  const { data: refunds } = await supabase
    .from("payment_refunds")
    .select("*")
    .eq("payment_id", dbPayment.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <AdminPaymentDetailClientView
        dbPayment={dbPayment}
        refunds={refunds || []}
      />
    </div>
  );
}
