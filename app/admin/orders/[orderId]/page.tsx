import { requireAdminAuth } from "@/lib/supabase/admin-guard";
import { createClient } from "@/lib/supabase/server";
import { AdminOrderDetailClientView } from "@/components/admin/admin-order-detail-client-view";
import Link from "next/link";
import { ArrowLeft, AlertCircle } from "lucide-react";

export const dynamic = "force-dynamic";

interface AdminOrderDetailPageProps {
  params: Promise<{ orderId: string }>;
}

export default async function AdminOrderDetailPage({ params }: AdminOrderDetailPageProps) {
  const { orderId: rawOrderId } = await params;
  const orderId = rawOrderId ? decodeURIComponent(rawOrderId) : "";

  // 1. Enforce strict server-side Admin Guard
  await requireAdminAuth(`/admin/orders/${orderId}`);

  const supabase = await createClient();

  // 2. Fetch full order joined with order_items and order_events from PostgreSQL
  // Check whether orderId is a UUID or an order_number string
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orderId);

  let query = supabase
    .from("orders")
    .select("*, order_items(*), order_events(*)");

  if (isUuid) {
    query = query.or(`id.eq.${orderId},order_number.eq.${orderId}`);
  } else {
    query = query.eq("order_number", orderId);
  }

  const { data: dbOrder, error } = await query.maybeSingle();

  if (error || !dbOrder) {
    return (
      <div className="shell py-12 max-w-xl mx-auto text-center space-y-4">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-paper text-muted-foreground">
          <AlertCircle className="size-6 text-violet" />
        </div>
        <h1 className="font-display text-2xl font-bold text-ink">Admin Order Reference Not Found</h1>
        <p className="text-xs text-muted-foreground">No order was found matching identifier &ldquo;{orderId}&rdquo; in PostgreSQL.</p>
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-2 rounded-xl bg-violet px-6 py-2.5 text-xs font-bold text-white shadow-lift hover:bg-violet-lift transition-all"
        >
          <ArrowLeft className="size-4" />
          <span>Return to Order Console</span>
        </Link>
      </div>
    );
  }

  // Fetch assigned shipments for this order
  const { fetchOrderShipments } = await import("@/lib/shipping/queries");
  const shipments = await fetchOrderShipments(dbOrder.id);

  return (
    <div className="space-y-6">
      <AdminOrderDetailClientView dbOrder={dbOrder} existingShipments={shipments} />
    </div>
  );
}
