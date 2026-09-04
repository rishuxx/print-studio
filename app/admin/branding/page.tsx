import { requireAdminAuth } from "@/lib/supabase/admin-guard";
import { getAuthoritativeBusinessSettings } from "@/lib/settings/queries";
import { AdminBrandingManager } from "@/components/admin/branding/admin-branding-manager";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Branding & Logo Settings · Admin Console",
  description: "Configure store logo, logo mode (image vs text), and primary brand color themes.",
};

export default async function AdminBrandingPage() {
  await requireAdminAuth("/admin/branding");
  const settings = await getAuthoritativeBusinessSettings();

  return <AdminBrandingManager initialSettings={settings} />;
}
