import { createClient } from "@/lib/supabase/server";
import { requirePermission } from "@/lib/auth/server-permissions";
import { NotificationAuditTable } from "@/components/admin/notifications/notification-audit-table";
import { NotificationComposer } from "@/components/admin/notifications/notification-composer";
import { NotificationAnalytics } from "@/components/admin/notifications/notification-analytics";
import { NotificationRecord } from "@/lib/notifications/types";
import { Bell, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Notification Management & Audit | Admin Console",
};

export default async function AdminNotificationsPage() {
  await requirePermission("settings.view", "/admin/notifications");
  const supabase = await createClient();

  const { data: notifications } = await supabase
    .from("notifications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  const list = (notifications || []) as unknown as NotificationRecord[];

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-200 pb-5">
        <div>
          <h1 className="text-xl font-bold font-display text-zinc-900 flex items-center gap-2">
            <Bell className="size-5 text-primary" />
            <span>Customer Notifications & Communications Studio</span>
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Authoritative hub for customer broadcasts, targeted segment campaigns, scheduling, and multi-channel audit logs.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 rounded-lg bg-zinc-50 border border-zinc-200 px-3 py-1.5 text-xs text-zinc-600">
          <ShieldCheck className="size-4 text-emerald-500" />
          <span>Server-Side Isolated & Idempotent</span>
        </div>
      </div>

      {/* Analytics Metric Cards */}
      <NotificationAnalytics notifications={list} />

      {/* Notification Composer */}
      <NotificationComposer />

      {/* Authoritative Audit Trail Table */}
      <div className="space-y-3 pt-2">
        <div className="border-b border-zinc-200 pb-2">
          <h2 className="text-sm font-bold text-zinc-900">Multi-Channel Delivery Audit Trail</h2>
          <p className="text-[11px] text-zinc-500">
            Real-time chronological log of in-app, email, WhatsApp, and push deliveries.
          </p>
        </div>
        <NotificationAuditTable initialNotifications={list} />
      </div>
    </div>
  );
}
