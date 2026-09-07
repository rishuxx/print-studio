"use client";

import React, { useMemo } from "react";
import {
  Bell,
  Send,
  Calendar,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Users,
  Eye,
} from "lucide-react";
import { NotificationRecord } from "@/lib/notifications/types";

interface NotificationAnalyticsProps {
  notifications: NotificationRecord[];
}

export function NotificationAnalytics({ notifications }: NotificationAnalyticsProps) {
  const stats = useMemo(() => {
    const total = notifications.length;
    const sent = notifications.filter(
      (n) => n.status === "SENT" || n.status === "PUBLISHED" || n.status === "DELIVERED"
    ).length;
    const scheduled = notifications.filter((n) => n.status === "SCHEDULED").length;
    const failed = notifications.filter(
      (n) => n.status === "FAILED_PERMANENT" || n.status === "FAILED_RETRYABLE"
    ).length;
    const broadcastCount = notifications.filter(
      (n) => n.target_type === "ALL" || n.target_type === "SEGMENT"
    ).length;

    return { total, sent, scheduled, failed, broadcastCount };
  }, [notifications]);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-500">Total Dispatches</span>
          <div className="flex size-8 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700">
            <Bell className="size-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold font-display text-zinc-900">{stats.total}</span>
          <span className="text-[11px] text-zinc-400">All channels</span>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-500">Delivered & Sent</span>
          <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
            <CheckCircle2 className="size-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold font-display text-emerald-700">{stats.sent}</span>
          <span className="text-[11px] text-emerald-600 font-medium">
            {stats.total > 0 ? `${Math.round((stats.sent / stats.total) * 100)}%` : "100%"} rate
          </span>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-500">Scheduled Queue</span>
          <div className="flex size-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
            <Calendar className="size-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold font-display text-blue-700">{stats.scheduled}</span>
          <span className="text-[11px] text-zinc-400">Pending send</span>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-500">Audited Broadcasts</span>
          <div className="flex size-8 items-center justify-center rounded-lg bg-violet-50 text-primary border border-violet-100">
            <Users className="size-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold font-display text-primary">{stats.broadcastCount}</span>
          <span className="text-[11px] text-zinc-400">Mass/Segment</span>
        </div>
      </div>
    </div>
  );
}
