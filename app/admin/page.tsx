import { requireAdminAuth } from "@/lib/supabase/admin-guard";
import { parseDateRange } from "@/lib/admin/dashboard/date-range";
import { getDashboardOverviewData } from "@/lib/admin/dashboard/queries";
import { AdminDashboardClientView } from "@/components/admin/admin-dashboard-client-view";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard Overview · Admin Command Center",
};

interface AdminDashboardPageProps {
  searchParams: Promise<{
    range?: string;
    from?: string;
    to?: string;
  }>;
}

export default async function AdminDashboardPage({ searchParams }: AdminDashboardPageProps) {
  // 1. Strict Server-side Guard Authorization
  const { user, profile } = await requireAdminAuth("/admin");

  // 2. Validate URL search parameters safely
  const { range, from, to } = await searchParams;
  const parsedRange = parseDateRange(range, from, to);

  // 3. Query Real Business Intelligence Data from PostgreSQL
  const dashboardData = await getDashboardOverviewData(parsedRange);

  return (
    <AdminDashboardClientView
      data={dashboardData}
      adminName={profile.full_name || "Admin"}
      adminEmail={user.email || profile.email}
      adminRole={profile.role}
    />
  );
}
