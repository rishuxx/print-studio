import { requireAdminAuth } from "@/lib/supabase/admin-guard";
import { fetchAdminCustomers } from "@/lib/customers/queries";
import { AdminCustomersClientView } from "@/components/admin/customers/admin-customers-client-view";

interface AdminCustomersPageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
    type?: string;
    risk?: string;
    pageSize?: string;
  }>;
}

export default async function AdminCustomersPage({ searchParams }: AdminCustomersPageProps) {
  await requireAdminAuth("/admin/customers");
  const resolvedParams = await searchParams;

  const initialData = await fetchAdminCustomers({
    search: resolvedParams.search,
    status: resolvedParams.status,
    type: resolvedParams.type,
    risk: resolvedParams.risk,
    pageSize: resolvedParams.pageSize ? Number(resolvedParams.pageSize) : 25,
  });

  return (
    <AdminCustomersClientView
      initialData={initialData}
      queryParams={{
        search: resolvedParams.search,
        status: resolvedParams.status,
        type: resolvedParams.type,
        risk: resolvedParams.risk,
        pageSize: resolvedParams.pageSize ? Number(resolvedParams.pageSize) : 25,
      }}
    />
  );
}
