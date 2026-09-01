import { createClient } from "@/lib/supabase/server";

export type AuthorizationResult = {
  authorized: boolean;
  user: any | null;
  customer: any | null;
  error?: string;
  redirectTo?: string;
};

/**
 * Ensures the request is from an authenticated and verified user.
 * Looks up the authoritative customer state.
 */
export async function requireVerifiedCustomer(): Promise<AuthorizationResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { authorized: false, user: null, customer: null, redirectTo: "/login", error: "Not authenticated" };
  }

  if (!user.email_confirmed_at) {
    return { authorized: false, user, customer: null, redirectTo: "/login?error=unverified", error: "Email not verified" };
  }

  // Look up authoritative customer record
  const { data: customer, error } = await supabase
    .from("customers")
    .select("*")
    .eq("auth_user_id", user.id)
    .single();

  if (error || !customer) {
    return { authorized: false, user, customer: null, redirectTo: "/login?error=no_profile", error: "Customer profile not found" };
  }

  if (customer.account_status === "suspended" || customer.account_status === "deactivated" || customer.account_status === "deleted") {
    return { authorized: false, user, customer, redirectTo: `/login?error=account_${customer.account_status}`, error: "Account restricted" };
  }

  return { authorized: true, user, customer };
}
