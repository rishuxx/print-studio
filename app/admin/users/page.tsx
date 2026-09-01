import { requirePermission } from "@/lib/auth/server-permissions";
import { createClient } from "@/lib/supabase/server";
import { UsersClientView } from "@/components/admin/users/users-client-view";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Staff & Permissions · Admin Command Center",
};

import { getRolesPermissions } from "@/lib/admin/role-actions";

async function fetchStaffUsers() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, status, version, created_at, updated_at")
    .in("role", ["owner", "admin", "staff"])
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export default async function AdminUsersPage() {
  const { profile } = await requirePermission("users.view", "/admin/users");
  const staff = await fetchStaffUsers();
  
  // Safe to call directly if same server action logic doesn't break on server components, 
  // but it's better to just do DB fetch since we are in a server component.
  // We'll use the server action directly as a helper since we already authorized.
  const permissionsData = await getRolesPermissions();

  return (
    <UsersClientView staff={staff} currentProfile={profile} permissionsData={permissionsData} />
  );
}
