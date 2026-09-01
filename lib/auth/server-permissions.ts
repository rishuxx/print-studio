import { requireAdminAuth } from "@/lib/supabase/admin-guard";
import { type Permission } from "./permissions";
import { createClient } from "@/lib/supabase/server";

export async function requirePermission(permission: Permission, redirectPath: string = "/") {
  const { user, profile } = await requireAdminAuth(redirectPath);
  
  if (profile.status === "suspended") {
    throw new Error("Your account has been suspended.");
  }

  // Fetch permissions for this role from the database
  const supabase = await createClient();
  const { data: roleData, error } = await supabase
    .from("role_permissions")
    .select("permissions")
    .eq("role", profile.role)
    .single();

  if (error || !roleData) {
    console.error("Failed to fetch role permissions:", error);
    throw new Error("Could not determine role permissions.");
  }

  const userPermissions = roleData.permissions as string[];
  
  if (!userPermissions.includes(permission)) {
    throw new Error(`Unauthorized: Missing required permission '${permission}'.`);
  }

  return { user, profile };
}
