import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { AccountClientView } from "@/components/account/account-client-view";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/account");
  }

  // Fetch customer profile from PostgreSQL
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Fetch addresses
  const { data: addresses } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", user.id)
    .order("is_default", { ascending: false });

  // Fetch orders (if any created in Supabase)
  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="shell py-8 space-y-8 max-w-5xl mx-auto">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "My Account" },
        ]}
      />

      <AccountClientView
        user={user}
        initialProfile={profile || {
          id: user.id,
          full_name: (user.user_metadata?.full_name as string) || "Customer",
          company_name: (user.user_metadata?.company_name as string) || null,
          email: user.email || "",
          phone: (user.user_metadata?.phone as string) || null,
          role: "customer",
          created_at: user.created_at,
          updated_at: user.created_at,
        }}
        initialAddresses={addresses || []}
        initialOrders={orders || []}
      />
    </div>
  );
}
