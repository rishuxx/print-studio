import { requireAdminAuth } from "@/lib/supabase/admin-guard";
import { createClient } from "@/lib/supabase/server";
import { getAuthoritativeBusinessSettings } from "@/lib/settings/queries";
import { AdminShell } from "@/components/admin/admin-shell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Console",
  description: "Operations, catalogue, orders, and system management console",
  robots: { index: false, follow: false },
  icons: {
    icon: "/api/favicon",
    shortcut: "/api/favicon",
    apple: "/api/favicon",
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Authoritative Server-side Guard
  // Any request inside /admin/* MUST pass this check or be redirected immediately
  const { user, profile } = await requireAdminAuth("/admin");

  const supabase = await createClient();
  const [roleRes, settings] = await Promise.all([
    supabase
      .from("role_permissions")
      .select("permissions")
      .eq("role", profile.role)
      .single(),
    getAuthoritativeBusinessSettings(),
  ]);

  const allowedPermissions = roleRes.data?.permissions || [];
  const faviconUrl = settings?.favicon_url || "/favicon.png";

  return (
    <>
      <head>
        <link rel="icon" href={faviconUrl} type="image/png" sizes="any" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="shortcut icon" href={faviconUrl} />
        <link rel="apple-touch-icon" href={faviconUrl} />
      </head>
      <AdminShell
        adminEmail={user.email || profile.email}
        adminName={profile.full_name || "Admin"}
        adminRole={profile.role}
        allowedPermissions={allowedPermissions}
      >
        {children}
      </AdminShell>
    </>
  );
}
