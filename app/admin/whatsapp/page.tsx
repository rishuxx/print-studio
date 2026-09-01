import { requirePermission } from "@/lib/auth/server-permissions";
import {
  getAuthoritativeWhatsAppConfig,
  getWhatsAppTemplates,
  getWhatsAppTriggers,
  getWhatsAppOutboxLogs,
  getWhatsAppMetrics,
} from "@/lib/whatsapp/queries";
import { WhatsAppDashboardContainer } from "@/components/admin/whatsapp/whatsapp-dashboard-container";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "WhatsApp Business Integration · Admin Console",
  description: "Official Meta WhatsApp Cloud API credentials, templates, event automations, logs, and live testing.",
};

export default async function AdminWhatsAppPage() {
  await requirePermission("settings.view", "/admin/whatsapp");

  // Load authoritative server state concurrently
  const [
    { config },
    templates,
    triggers,
    { logs: initialLogs, totalCount: initialLogsCount },
    metrics,
  ] = await Promise.all([
    getAuthoritativeWhatsAppConfig(),
    getWhatsAppTemplates(),
    getWhatsAppTriggers(),
    getWhatsAppOutboxLogs({ limit: 50, offset: 0 }),
    getWhatsAppMetrics(),
  ]);

  return (
    <WhatsAppDashboardContainer
      initialConfig={config}
      initialTemplates={templates}
      initialTriggers={triggers}
      initialLogs={initialLogs}
      initialLogsCount={initialLogsCount}
      initialMetrics={metrics}
    />
  );
}
