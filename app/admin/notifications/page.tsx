import { createClient } from "@/lib/supabase/server";
import { requirePermission } from "@/lib/auth/server-permissions";
import { NotificationAuditTable } from "@/components/admin/notifications/notification-audit-table";
import { NotificationRecord } from "@/lib/notifications/types";
import { Bell, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Notification Audit & History | Admin Console",
};

export default async function AdminNotificationsPage() {
  await requirePermission("settings.view", "/admin/notifications");
  const supabase = await createClient();

  const { data: notifications } = await supabase
    .from("notifications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-xl font-bold font-display text-ink flex items-center gap-2">
            <Bell className="size-5 text-violet" />
            <span>Customer Notifications & Communications</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Authoritative audit trail of transactional emails, WhatsApp dispatch alerts, and browser push notices.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 rounded-lg bg-paper border border-border px-3 py-1.5 text-xs text-muted-foreground">
          <ShieldCheck className="size-4 text-emerald-500" />
          <span>Server-Side Isolated & Idempotent</span>
        </div>
      </div>

      <NotificationAuditTable
        initialNotifications={(notifications || []) as unknown as NotificationRecord[]}
      />
    </div>
  );
}
