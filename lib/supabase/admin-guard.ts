import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Database } from "@/lib/supabase/database.types";

export type AdminUser = {
  id: string;
  email?: string;
  role: "admin";
  fullName?: string;
};

/**
 * Server-side guard that checks if the current request is authenticated
 * and has profile.role === 'admin'.
 * 
 * If authorized, returns { user, profile }.
 * If unauthenticated or role !== 'admin', redirects safely.
 */
export async function requireAdminAuth(redirectPath: string = "/"): Promise<{
  user: { id: string; email?: string };
  profile: Database["public"]["Tables"]["profiles"]["Row"];
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?redirect=${encodeURIComponent(redirectPath)}`);
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error || !profile || profile.role !== "admin") {
    redirect("/");
  }

  return { user, profile };
}
