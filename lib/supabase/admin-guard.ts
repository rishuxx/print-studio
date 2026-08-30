import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { cache } from "react";
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
 * Wrapped in React cache() so layout.tsx and page.tsx share the exact same
 * auth verification in 1 single fast round-trip instead of duplicate sequential queries.
 */
export const requireAdminAuth = cache(async (redirectPath: string = "/"): Promise<{
  user: { id: string; email?: string };
  profile: Database["public"]["Tables"]["profiles"]["Row"];
}> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?redirect=${encodeURIComponent(redirectPath)}`);
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, created_at, updated_at")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !profile || profile.role !== "admin") {
    redirect("/");
  }

  return { user, profile: profile as Database["public"]["Tables"]["profiles"]["Row"] };
});

