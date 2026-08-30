import { createClient } from "@/lib/supabase/server";
import { OrderConfirmedClientView } from "@/components/orders/order-confirmed-client-view";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";

export const dynamic = "force-dynamic";

interface OrderConfirmedPageProps {
  searchParams: Promise<{ orderId?: string }>;
}

export default async function OrderConfirmedPage({ searchParams }: OrderConfirmedPageProps) {
  const { orderId: rawOrderId } = await searchParams;
  const orderId = rawOrderId ? decodeURIComponent(rawOrderId) : "";

  let dbOrder = null;

  if (orderId) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orderId);

    let query = supabase
      .from("orders")
      .select("*, order_items(*), order_events(*)");

    if (isUuid) {
      query = query.or(`id.eq.${orderId},order_number.eq.${orderId}`);
    } else {
      query = query.eq("order_number", orderId);
    }

    // If a user is logged in, ensure they can only query their own order (or admin)
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      if (profile?.role !== "admin") {
        query = query.eq("user_id", user.id);
      }
    }

    const { data } = await query.maybeSingle();
    dbOrder = data;
  }

  return (
    <div className="shell py-8 space-y-10 max-w-5xl mx-auto">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Orders", href: "/orders" },
          { label: `Confirmed #${orderId || ""}` },
        ]}
      />

      <OrderConfirmedClientView orderId={orderId} dbOrder={dbOrder} />
    </div>
  );
}
