import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/lib/supabase/database.types";

export interface ResolvedUserAuth {
  authenticated: boolean;
  userId: string | null;
  email: string | null;
  role: UserRole | null;
  fullName: string | null;
}

/**
 * Server-side helper to resolve the authenticated user and their authoritative role
 * directly from Supabase Auth and the PostgreSQL `profiles` table.
 * 
 * Never trusts client headers, cookies, or browser-supplied role parameters.
 */
export async function resolveUserRole(): Promise<ResolvedUserAuth> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        authenticated: false,
        userId: null,
        email: null,
        role: null,
        fullName: null,
      };
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role, full_name, email")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError || !profile) {
      // Safe fallback: Authenticated without database profile defaults to non-admin customer
      return {
        authenticated: true,
        userId: user.id,
        email: user.email || null,
        role: "customer",
        fullName: (user.user_metadata?.full_name as string) || null,
      };
    }

    return {
      authenticated: true,
      userId: user.id,
      email: profile.email || user.email || null,
      role: profile.role,
      fullName: profile.full_name,
    };
  } catch (err) {
    console.error("resolveUserRole error:", err);
    return {
      authenticated: false,
      userId: null,
      email: null,
      role: null,
      fullName: null,
    };
  }
}
