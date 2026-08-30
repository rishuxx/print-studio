import { createClient } from "@/lib/supabase/server";
import { CheckoutClientView } from "@/components/checkout/checkout-client-view";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import type { Database } from "@/lib/supabase/database.types";

type AddressRow = Database["public"]["Tables"]["addresses"]["Row"];

import { fetchAvailableCheckoutCoupons } from "@/lib/pricing/coupon-actions";

export default async function CheckoutPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let initialProfile = null;
  let savedAddresses: AddressRow[] = [];

  const [availableCoupons] = await Promise.all([
    fetchAvailableCheckoutCoupons(),
  ]);

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    const { data: addresses } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", user.id)
      .order("is_default", { ascending: false });

    initialProfile = profile;
    savedAddresses = addresses || [];
  }

  return (
    <div className="shell py-8 space-y-8 max-w-6xl mx-auto">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Cart", href: "/cart" },
          { label: "Checkout & Delivery" },
        ]}
      />

      <div className="space-y-2 text-center sm:text-left">
        <h1 className="font-display text-3xl font-extrabold text-ink sm:text-4xl">
          Order Checkout & Delivery Details
        </h1>
        <p className="text-xs text-muted-foreground sm:text-sm">
          Enter your delivery destination and contact details for digital proof review and invoice dispatch.
        </p>
      </div>

      <CheckoutClientView
        user={user}
        initialProfile={initialProfile}
        savedAddresses={savedAddresses}
        availableCoupons={availableCoupons}
      />
    </div>
  );
}
