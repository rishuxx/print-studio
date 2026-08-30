import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { OrderDetailClientView } from "@/components/orders/order-detail-client-view";

export const dynamic = "force-dynamic";

interface OrderPageProps {
  params: Promise<{ orderId: string }>;
  searchParams: Promise<{ tab?: string }>;
}

export default async function OrderDetailsPage({ params, searchParams }: OrderPageProps) {
  const { orderId: rawOrderId } = await params;
  const { tab } = await searchParams;
  const orderId = rawOrderId ? decodeURIComponent(rawOrderId) : "";

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?redirect=/orders/${encodeURIComponent(orderId)}`);
  }

  // Check if current user is an authorized admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const isAdmin = profile?.role === "admin";

  // Load from PostgreSQL with strict user isolation (unless admin)
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orderId);

  let query = supabase
    .from("orders")
    .select("*, order_items(*), order_events(*)");

  if (isUuid) {
    query = query.or(`id.eq.${orderId},order_number.eq.${orderId}`);
  } else {
    query = query.eq("order_number", orderId);
  }

  // If not admin, strictly enforce user_id match
  if (!isAdmin) {
    query = query.eq("user_id", user.id);
  }

  const { data: dbOrder } = await query.maybeSingle();

  // Load real shipments for this order if present
  let shipments: import("@/lib/shipping/types").ShippingShipment[] = [];
  if (dbOrder?.id) {
    const { fetchOrderShipments } = await import("@/lib/shipping/queries");
    shipments = await fetchOrderShipments(dbOrder.id);
  }

  return (
    <div className="shell py-8 space-y-8 max-w-6xl mx-auto">
      <div className="no-print">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "My Orders", href: "/orders" },
            { label: `Order #${orderId}` },
          ]}
        />
      </div>

      <OrderDetailClientView
        orderId={orderId}
        initialTab={tab === "invoice" ? "invoice" : "tracking"}
        dbOrder={dbOrder}
        shipments={shipments}
      />
    </div>
  );
}
