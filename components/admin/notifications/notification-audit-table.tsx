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
  Trash2,
  Square,
  Check,
  Eye,
  X,
} from "lucide-react";
import { NotificationRecord } from "@/lib/notifications/types";
import { deleteAdminNotificationAction, stopAdminBroadcastAction } from "@/lib/notifications/mutations";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface NotificationAuditTableProps {
  initialNotifications: NotificationRecord[];
}

export function NotificationAuditTable({ initialNotifications }: NotificationAuditTableProps) {
  const router = useRouter();
  const [notifications, setNotifications] = React.useState<NotificationRecord[]>(initialNotifications);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [channelFilter, setChannelFilter] = React.useState<string>("ALL");
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL");
  const [actionLoadingId, setActionLoadingId] = React.useState<string | null>(null);
  const [inspectItem, setInspectItem] = React.useState<NotificationRecord | null>(null);

  React.useEffect(() => {
    setNotifications(initialNotifications);
  }, [initialNotifications]);

  const filtered = React.useMemo(() => {
    return notifications.filter((n) => {
      const matchesSearch =
        searchQuery === "" ||
        n.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.event_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (n.title && n.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (n.body && n.body.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (n.order_id && n.order_id.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesChannel = channelFilter === "ALL" || n.channel === channelFilter;
      const matchesStatus = statusFilter === "ALL" || n.status === statusFilter;

      return matchesSearch && matchesChannel && matchesStatus;
    });
  }, [notifications, searchQuery, channelFilter, statusFilter]);

  const handleDelete = async (item: NotificationRecord) => {
    const isBroadcast = item.recipient === "BROADCAST" || item.target_type === "ALL";
    const promptMsg = isBroadcast
      ? `Are you sure you want to PERMANENTLY DELETE this broadcast? It will be immediately purged from all customer notification feeds.`
      : `Delete notification #${item.id.slice(0, 8)}?`;

    if (!window.confirm(promptMsg)) return;

    setActionLoadingId(item.id);
    try {
      const res = await deleteAdminNotificationAction(item.id);
      if (res.success) {
        toast.success("Notification deleted and purged from all feeds");
        setNotifications((prev) => prev.filter((n) => n.id !== item.id));
        if (inspectItem?.id === item.id) setInspectItem(null);
        router.refresh();
      } else {
        toast.error(res.error || "Failed to delete notification");
      }
    } catch {
      toast.error("Network communication error");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleStopBroadcast = async (item: NotificationRecord) => {
    if (!window.confirm(`Stop and cancel broadcast "${item.title || item.event_type}" immediately? It will be removed from user feeds and marked CANCELLED.`)) {
      return;
    }

    setActionLoadingId(item.id);
    try {
      const res = await stopAdminBroadcastAction(item.id);
      if (res.success) {
        toast.success("Broadcast stopped and retracted successfully");
        setNotifications((prev) =>
          prev.map((n) => (n.id === item.id ? { ...n, status: "CANCELLED" as const } : n))
        );
        router.refresh();
      } else {
        toast.error(res.error || "Failed to stop broadcast");
      }
    } catch {
      toast.error("Network communication error");
    } finally {
      setActionLoadingId(null);
    }
  };

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
      case "PUBLISHED":
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[0.6875rem] font-bold text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="size-3" />
            <span>{status}</span>
          </span>
        );
      case "SCHEDULED":
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-purple-50 px-2 py-0.5 text-[0.6875rem] font-bold text-purple-700 border border-purple-200">
            <Clock className="size-3" />
            <span>SCHEDULED</span>
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-0.5 text-[0.6875rem] font-bold text-zinc-700 border border-zinc-300">
            <Square className="size-3" />
            <span>CANCELLED</span>
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
            placeholder="Search title, recipient, event..."
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
            <option value="IN_APP">In-App</option>
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
            <option value="PUBLISHED">Published</option>
            <option value="SENT">Sent</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="CANCELLED">Cancelled</option>
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
                <th className="px-4 py-3">Event / Message</th>
                <th className="px-4 py-3">Channel</th>
                <th className="px-4 py-3">Recipient</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Provider</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3 text-right">Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    No notification history found matching your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const isLoading = actionLoadingId === item.id;
                  const canStop = item.status === "PUBLISHED" || item.status === "SCHEDULED";

                  return (
                    <tr key={item.id} className="hover:bg-white/60 transition-colors">
                      <td className="px-4 py-3 max-w-[240px]">
                        <div className="font-mono font-semibold text-ink text-[11px] truncate">
                          {item.event_type}
                        </div>
                        {item.title && (
                          <div className="text-xs font-medium text-ink/80 truncate mt-0.5">
                            {item.title}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="inline-flex items-center gap-1.5 font-medium">
                          {getChannelIcon(item.channel)}
                          <span>{item.channel}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-muted-foreground">
                        {item.recipient === "BROADCAST" ? (
                          <span className="font-bold text-violet bg-violet/10 px-1.5 py-0.5 rounded text-[10px]">
                            BROADCAST (ALL)
                          </span>
                        ) : (
                          <span className="truncate block max-w-[140px]">{item.recipient}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">{getStatusBadge(item.status)}</td>
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                        {item.provider}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                        {new Date(item.created_at).toLocaleString("en-IN", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          {/* Inspect Modal Trigger */}
                          <button
                            type="button"
                            onClick={() => setInspectItem(item)}
                            title="Inspect Details"
                            className="p-1.5 rounded-lg border border-border bg-white text-muted-foreground hover:text-ink hover:bg-paper transition-colors"
                          >
                            <Eye className="size-3.5" />
                          </button>

                          {/* Stop Broadcast / Cancel Scheduled Button */}
                          {canStop && (
                            <button
                              type="button"
                              disabled={isLoading}
                              onClick={() => handleStopBroadcast(item)}
                              title={item.status === "SCHEDULED" ? "Cancel Scheduled Notification" : "Stop / Retract Broadcast"}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-amber-300 bg-amber-50 text-amber-800 text-[11px] font-bold hover:bg-amber-100 disabled:opacity-50 transition-colors"
                            >
                              <Square className="size-3 text-amber-700" />
                              <span>{item.status === "SCHEDULED" ? "Cancel" : "Stop"}</span>
                            </button>
                          )}

                          {/* Immediate Delete Button */}
                          <button
                            type="button"
                            disabled={isLoading}
                            onClick={() => handleDelete(item)}
                            title="Immediately Delete & Purge from Feeds"
                            className="p-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 disabled:opacity-50 transition-colors"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Detail Modal */}
      {inspectItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl p-6 border border-border shadow-xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="font-display text-sm font-bold text-ink">Notification Details</h3>
                <span className="font-mono text-[10px] text-muted-foreground">ID: {inspectItem.id}</span>
              </div>
              <button
                type="button"
                onClick={() => setInspectItem(null)}
                className="p-1 rounded-lg hover:bg-paper text-muted-foreground hover:text-ink"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-[10px] font-bold uppercase font-mono text-muted-foreground block">Event Type</span>
                <span className="font-mono font-bold text-ink">{inspectItem.event_type}</span>
              </div>

              {inspectItem.title && (
                <div>
                  <span className="text-[10px] font-bold uppercase font-mono text-muted-foreground block">Title</span>
                  <span className="font-semibold text-ink text-sm">{inspectItem.title}</span>
                </div>
              )}

              {inspectItem.body && (
                <div>
                  <span className="text-[10px] font-bold uppercase font-mono text-muted-foreground block">Message Body</span>
                  <div className="p-3 rounded-xl bg-paper/60 border border-border/80 text-ink leading-relaxed whitespace-pre-wrap">
                    {inspectItem.body}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <span className="text-[10px] font-bold uppercase font-mono text-muted-foreground block">Channel</span>
                  <span className="font-bold text-ink">{inspectItem.channel}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase font-mono text-muted-foreground block">Status</span>
                  <div>{getStatusBadge(inspectItem.status)}</div>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase font-mono text-muted-foreground block">Recipient</span>
                  <span className="font-mono text-muted-foreground">{inspectItem.recipient}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase font-mono text-muted-foreground block">Target Type</span>
                  <span className="font-mono text-ink">{inspectItem.target_type || "N/A"}</span>
                </div>
              </div>

              {inspectItem.action_url && (
                <div>
                  <span className="text-[10px] font-bold uppercase font-mono text-muted-foreground block">Action Link</span>
                  <span className="font-mono text-violet break-all">{inspectItem.action_url}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <button
                type="button"
                onClick={() => handleDelete(inspectItem)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-xs font-bold hover:bg-rose-100"
              >
                <Trash2 className="size-3.5" />
                <span>Delete Notification</span>
              </button>

              <button
                type="button"
                onClick={() => setInspectItem(null)}
                className="px-4 py-1.5 rounded-xl border border-border bg-white text-ink text-xs font-bold hover:bg-paper"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

