import { requireAdminAuth } from "@/lib/supabase/admin-guard";
import { getFullBusinessConfiguration } from "@/lib/business-settings/queries";
import { AdminSettingsContainer } from "@/components/admin/settings/admin-settings-container";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Business Settings & System Configuration · Admin Console",
  description: "Configure store identity, GST policies, tax invoice templates, shipping defaults, and notifications.",
};

export default async function AdminSettingsPage() {
  await requireAdminAuth("/admin/settings");
  const config = await getFullBusinessConfiguration();

  return <AdminSettingsContainer initialConfig={config} />;
}
