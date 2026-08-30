import { requireAdminAuth } from "@/lib/supabase/admin-guard";
import { fetchAdminShipments } from "@/lib/shipping/queries";
import { AdminShippingClientView } from "@/components/admin/shipping/admin-shipping-client-view";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shipment Tracking & Logistics Command · Admin Console",
};

interface AdminShippingPageProps {
  searchParams: Promise<{ status?: string; carrier?: string; search?: string }>;
}

export default async function AdminShippingPage({ searchParams }: AdminShippingPageProps) {
  await requireAdminAuth("/admin/shipping");
  const params = await searchParams;

  const { shipments, carriers, availableOrders, kpi } = await fetchAdminShipments(params);

  return (
    <AdminShippingClientView
      initialShipments={shipments}
      carriers={carriers}
      availableOrders={availableOrders}
      kpi={kpi}
    />
  );
}
