import { notFound } from "next/navigation";
import { requireAdminAuth } from "@/lib/supabase/admin-guard";
import { fetchCustomerById } from "@/lib/customers/queries";
import { AdminCustomerDetailClientView } from "@/components/admin/customers/admin-customer-detail-client-view";

interface AdminCustomerDetailPageProps {
  params: Promise<{ customerId: string }>;
}

export default async function AdminCustomerDetailPage({ params }: AdminCustomerDetailPageProps) {
  await requireAdminAuth("/admin/customers");
  const { customerId } = await params;

  const customer = await fetchCustomerById(customerId);
  if (!customer) {
    notFound();
  }

  return <AdminCustomerDetailClientView customer={customer} />;
}
