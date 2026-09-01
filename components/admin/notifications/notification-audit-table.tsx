"use client";

import * as React from "react";
import {
  Bell,
  Mail,
  MessageSquare,
  Smartphone,
  CheckCircle2,
  Clock,
  AlertCircle,
  RefreshCw,
  Search,
  Filter,
} from "lucide-react";
import { NotificationRecord } from "@/lib/notifications/types";

interface NotificationAuditTableProps {
  initialNotifications: NotificationRecord[];
}

export function NotificationAuditTable({ initialNotifications }: NotificationAuditTableProps) {
  const [notifications, setNotifications] = React.useState<NotificationRecord[]>(initialNotifications);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [channelFilter, setChannelFilter] = React.useState<string>("ALL");
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL");

  const filtered = React.useMemo(() => {
    return notifications.filter((n) => {
      const matchesSearch =
        searchQuery === "" ||
        n.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.event_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (n.order_id && n.order_id.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesChannel = channelFilter === "ALL" || n.channel === channelFilter;
      const matchesStatus = statusFilter === "ALL" || n.status === statusFilter;

      return matchesSearch && matchesChannel && matchesStatus;
    });
  }, [notifications, searchQuery, channelFilter, statusFilter]);

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case "EMAIL":
        return <Mail className="size-3.5 text-blue-500" />;
      case "WHATSAPP":
        return <MessageSquare className="size-3.5 text-emerald-500" />;
      case "PUSH":
        return <Smartphone className="size-3.5 text-purple-500" />;
      default:
        return <Bell className="size-3.5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SENT":
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[0.6875rem] font-bold text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="size-3" />
            <span>SENT</span>
          </span>
        );
      case "NOT_CONFIGURED":
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[0.6875rem] font-bold text-amber-700 border border-amber-200">
            <AlertCircle className="size-3" />
            <span>NOT_CONFIGURED</span>
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-[0.6875rem] font-bold text-blue-700 border border-blue-200">
            <Clock className="size-3" />
            <span>PENDING</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-red-50 px-2 py-0.5 text-[0.6875rem] font-bold text-red-700 border border-red-200">
            <AlertCircle className="size-3" />
            <span>{status}</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-paper p-4 rounded-xl border border-border">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search recipient, order, or event..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-border bg-white pl-9 pr-3 py-1.5 text-xs text-ink placeholder:text-muted-foreground focus:border-violet focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value)}
            className="rounded-lg border border-border bg-white px-2.5 py-1.5 text-xs text-ink focus:border-violet focus:outline-none"
          >
            <option value="ALL">All Channels</option>
            <option value="EMAIL">Email</option>
            <option value="WHATSAPP">WhatsApp</option>
            <option value="PUSH">Push</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-border bg-white px-2.5 py-1.5 text-xs text-ink focus:border-violet focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="SENT">Sent</option>
            <option value="NOT_CONFIGURED">Not Configured</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED_PERMANENT">Failed</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-paper overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 border-b border-border text-[0.6875rem] font-bold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Event</th>
                <th className="px-4 py-3">Channel</th>
                <th className="px-4 py-3">Recipient</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Provider</th>
                <th className="px-4 py-3">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    No notification history found matching your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-white/60 transition-colors">
                    <td className="px-4 py-3 font-mono font-semibold text-ink">
                      {item.event_type}
                    </td>
                    <td className="px-4 py-3">
                      <div className="inline-flex items-center gap-1.5 font-medium">
                        {getChannelIcon(item.channel)}
                        <span>{item.channel}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-muted-foreground">
                      {item.recipient}
                    </td>
                    <td className="px-4 py-3">{getStatusBadge(item.status)}</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                      {item.provider}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(item.created_at).toLocaleString("en-IN", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
