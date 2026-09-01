import { requireAdminAuth } from "@/lib/supabase/admin-guard";
import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/admin-shell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Console",
  description: "Operations, catalogue, orders, and system management console",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Authoritative Server-side Guard
  // Any request inside /admin/* MUST pass this check or be redirected immediately
  const { user, profile } = await requireAdminAuth("/admin");

  const supabase = await createClient();
  const { data: roleData } = await supabase
    .from("role_permissions")
    .select("permissions")
    .eq("role", profile.role)
    .single();

  const allowedPermissions = roleData?.permissions || [];

  return (
    <AdminShell
      adminEmail={user.email || profile.email}
      adminName={profile.full_name || "Admin"}
      adminRole={profile.role}
      allowedPermissions={allowedPermissions}
    >
      {children}
    </AdminShell>
  );
}
