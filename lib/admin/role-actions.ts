"use server";

import { requirePermission } from "@/lib/auth/server-permissions";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { UserRole } from "@/lib/supabase/database.types";

export async function getRolesPermissions() {
  await requirePermission("users.view", "/admin");
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("role_permissions")
    .select("*")
    .order("role");

  if (error) {
    throw new Error("Failed to load role permissions");
  }

  return data;
}

export async function updateRolePermissions(role: UserRole, permissions: string[]) {
  // Only owners and full users.manage permission holders can update roles
  await requirePermission("users.manage", "/admin");

  // Prevent modifying the owner role to prevent accidental lockouts
  if (role === "owner") {
    throw new Error("Cannot modify owner permissions through the UI for safety reasons.");
  }

  if (role === "customer") {
    throw new Error("Cannot modify customer permissions.");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("role_permissions")
    .update({ permissions })
    .eq("role", role);

  if (error) {
    throw new Error("Failed to update role permissions");
  }

  // Revalidate to ensure UI and layout components catch the new permissions
  revalidatePath("/admin", "layout");
  
  return { success: true };
}
