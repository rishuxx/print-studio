"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requirePermission } from "@/lib/auth/server-permissions";
import { UserRole } from "@/lib/supabase/database.types";
import { z } from "zod";

const UpdateRoleSchema = z.object({
  userId: z.string().uuid(),
  newRole: z.enum(["owner", "admin", "staff", "customer"]),
  version: z.number().int().positive()
});

const UpdateStatusSchema = z.object({
  userId: z.string().uuid(),
  newStatus: z.enum(["active", "suspended"]),
  version: z.number().int().positive()
});

export async function changeStaffRoleAction(rawInput: unknown): Promise<{ success: boolean; error?: string }> {
  try {
    const { profile: actor } = await requirePermission("users.manage", "/admin/users");
    const parsed = UpdateRoleSchema.safeParse(rawInput);

    if (!parsed.success) {
      return { success: false, error: "Invalid input" };
    }
    const { userId, newRole, version } = parsed.data;

    const supabase = await createClient();

    // The database trigger protect_profile_role enforces:
    // 1. Only owner can change roles
    // 2. Prevent self-escalation
    // 3. Prevent demoting last owner
    // 4. Concurrency via version check

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ role: newRole, version: version + 1 })
      .eq("id", userId)
      .eq("version", version);

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    // Attempt to log audit
    // (using service role or same client, trigger handles it or we log directly if policy allows)
    // Actually we'll log it directly.
    await supabase.from("admin_audit_logs").insert({
      actor_id: actor.id,
      target_id: userId,
      action: "role_changed",
      details: { newRole }
    });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (err: any) {
    console.error("changeStaffRoleAction error:", err);
    return { success: false, error: err.message || "Failed to change role" };
  }
}

export async function updateStaffStatusAction(rawInput: unknown): Promise<{ success: boolean; error?: string }> {
  try {
    const { profile: actor } = await requirePermission("users.manage", "/admin/users");
    const parsed = UpdateStatusSchema.safeParse(rawInput);

    if (!parsed.success) {
      return { success: false, error: "Invalid input" };
    }
    const { userId, newStatus, version } = parsed.data;

    const supabase = await createClient();

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ status: newStatus, version: version + 1 })
      .eq("id", userId)
      .eq("version", version);

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    await supabase.from("admin_audit_logs").insert({
      actor_id: actor.id,
      target_id: userId,
      action: newStatus === "suspended" ? "account_suspended" : "account_restored",
      details: { newStatus }
    });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (err: any) {
    console.error("updateStaffStatusAction error:", err);
    return { success: false, error: err.message || "Failed to update status" };
  }
}

export async function addStaffByEmailAction(email: string, role: "admin" | "staff"): Promise<{ success: boolean; error?: string; user?: any }> {
  try {
    const { profile: actor } = await requirePermission("users.manage", "/admin/users");

    if (!email || !email.includes("@")) {
      return { success: false, error: "Please provide a valid email address." };
    }

    const cleanEmail = email.trim().toLowerCase();
    const supabase = await createClient();

    // Look up profile by email
    const { data: userProfile, error: fetchErr } = await supabase
      .from("profiles")
      .select("id, full_name, email, role, status, version")
      .eq("email", cleanEmail)
      .maybeSingle();

    if (fetchErr) {
      return { success: false, error: "Database error while looking up user." };
    }

    if (!userProfile) {
      return {
        success: false,
        error: `No registered account found with email "${cleanEmail}". Ask them to sign up first at /register, then add them here.`
      };
    }

    if (userProfile.role === "owner") {
      return { success: false, error: "Cannot modify Owner accounts." };
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        role,
        status: "active",
        version: (userProfile.version || 1) + 1
      })
      .eq("id", userProfile.id);

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    await supabase.from("admin_audit_logs").insert({
      actor_id: actor.id,
      target_id: userProfile.id,
      action: "staff_added",
      details: { email: cleanEmail, assignedRole: role }
    });

    revalidatePath("/admin/users");
    return { success: true, user: userProfile };
  } catch (err: any) {
    console.error("addStaffByEmailAction error:", err);
    return { success: false, error: err.message || "Failed to add staff member." };
  }
}

