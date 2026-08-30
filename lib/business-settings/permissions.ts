import { requireAdminAuth } from "@/lib/supabase/admin-guard";

/**
 * ═════════════════════════════════════════════════════════════════════════════
 * PHASE 10H: AUTHORIZATION & PERMISSION ENFORCEMENT
 * ═════════════════════════════════════════════════════════════════════════════
 */

export interface AuthenticatedAdminContext {
  userId: string;
  email: string;
  role: string;
}

/**
 * Enforces admin authentication on the server for all settings mutations.
 * Throws an error or returns authorized admin context.
 */
export async function assertAdminPrivilege(): Promise<AuthenticatedAdminContext> {
  const { user, profile } = await requireAdminAuth("/admin/settings");
  return {
    userId: profile.id || user.id,
    email: profile.email || user.email || "admin@example.com",
    role: profile.role,
  };
}
