import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { OrdersClientView } from "@/components/orders/orders-client-view";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/orders");
  }

  // Query ONLY authenticated customer's orders joined with line items from PostgreSQL with strict RLS
  const { data: dbOrders } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="shell py-8 space-y-8 max-w-5xl mx-auto">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "My Orders" },
        ]}
      />

      <OrdersClientView dbOrders={dbOrders || []} />
    </div>
  );
}
