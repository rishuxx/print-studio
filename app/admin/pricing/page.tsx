import { requireAdminAuth } from "@/lib/supabase/admin-guard";
import { fetchPricingDashboardData } from "@/lib/pricing/queries";
import { AdminPricingClientView } from "@/components/admin/pricing/admin-pricing-client-view";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pricing Engine & Promotions · Admin Command Center",
};

export default async function AdminPricingPage() {
  await requireAdminAuth("/admin/pricing");
  const data = await fetchPricingDashboardData();

  return (
    <AdminPricingClientView
      priceBooks={data.priceBooks}
      activeSalesCount={data.activeSalesCount}
      scheduledSalesCount={data.scheduledSalesCount}
      promotions={data.promotions}
      healthIssues={data.healthIssues}
      productPrices={data.productPrices}
    />
  );
}
