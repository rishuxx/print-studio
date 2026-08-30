import { requireAdminAuth } from "@/lib/supabase/admin-guard";
import { getAuthoritativeBusinessSettings } from "@/lib/settings/queries";
import { AdminSettingsClientView } from "@/components/admin/settings/admin-settings-client-view";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Business Settings & Store Configuration · Admin Console",
};

export default async function AdminSettingsPage() {
  await requireAdminAuth("/admin/settings");
  const settings = await getAuthoritativeBusinessSettings();

  return <AdminSettingsClientView initialSettings={settings} />;
}
