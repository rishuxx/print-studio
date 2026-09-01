import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { cache } from "react";
import type { Database } from "@/lib/supabase/database.types";

export type AdminUser = {
  id: string;
  email?: string;
  role: "owner" | "admin" | "staff";
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
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !profile) {
    redirect("/");
  }

  if (!["owner", "admin", "staff"].includes(profile.role)) {
    redirect("/");
  }

  if (profile.status === "suspended") {
    redirect("/suspended");
  }

  return { user, profile: profile as Database["public"]["Tables"]["profiles"]["Row"] };
});

