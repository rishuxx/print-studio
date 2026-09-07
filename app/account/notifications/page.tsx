"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Bell, Filter, Sliders, CheckCheck, Sparkles, RefreshCw } from "lucide-react";
import { fetchNotificationsAction } from "@/lib/notifications/actions";
import { markAllNotificationsAsReadAction } from "@/lib/notifications/mutations";
import { NotificationRecord } from "@/lib/notifications/types";
import { NotificationItem } from "@/components/notifications/notification-item";
import { NotificationPreferencesView } from "@/components/account/notification-preferences-view";
import { cn } from "@/lib/utils";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";

const CATEGORIES = [
  { id: "all", label: "All Updates" },
  { id: "unread", label: "Unread" },
  { id: "order", label: "Orders & Proofs" },
  { id: "shipping", label: "Shipments" },
  { id: "payment", label: "Payments & Refunds" },
  { id: "marketing", label: "Offers & Deals" },
  { id: "system", label: "System Notices" },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"feed" | "preferences">("feed");
  const [isLoading, setIsLoading] = useState(true);
  const [isMarkingAll, setIsMarkingAll] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const LIMIT = 20;

  const loadNotifications = useCallback(
    async (reset = false, customCategory = activeCategory) => {
      setIsLoading(true);
      const currentPage = reset ? 0 : page;
      try {
        const isUnreadFilter = customCategory === "unread";
        const actualCategory =
          isUnreadFilter || customCategory === "all" ? undefined : customCategory;

        const res = await fetchNotificationsAction({
          limit: LIMIT,
          offset: currentPage * LIMIT,
          category: actualCategory,
          unreadOnly: isUnreadFilter,
        });

        if (reset) {
          setNotifications(res.notifications);
        } else {
          setNotifications((prev) => [...prev, ...res.notifications]);
        }

        setHasMore(res.notifications.length === LIMIT);
        if (reset) setPage(1);
        else setPage(currentPage + 1);
      } catch (err) {
        console.error("Failed to load notifications", err);
      } finally {
        setIsLoading(false);
      }
    },
    [page, activeCategory]
  );

  useEffect(() => {
    loadNotifications(true);
  }, []);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    loadNotifications(true, cat);
  };

  const handleMarkAllRead = async () => {
    setIsMarkingAll(true);
    try {
      await markAllNotificationsAsReadAction();
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read_at: n.read_at || new Date().toISOString() }))
      );
    } catch (err) {
      console.error("Failed to mark all as read", err);
    } finally {
      setIsMarkingAll(false);
    }
  };

  const handleNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n))
    );
  };

  const handleNotificationDismiss = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const unreadTotal = notifications.filter((n) => !n.read_at).length;

  return (
    <div className="shell py-8 space-y-6 max-w-5xl mx-auto">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "My Account", href: "/account" },
          { label: "Notifications" },
        ]}
      />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold font-display text-zinc-900 flex items-center gap-2">
              <Bell className="size-6 text-primary" />
              <span>Notification Center</span>
            </h1>
            {unreadTotal > 0 && (
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                {unreadTotal} unread
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Track proof approvals, print progress, consignment dispatches, and campaign announcements.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setViewMode(viewMode === "feed" ? "preferences" : "feed")}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold border transition-colors shadow-2xs",
              viewMode === "preferences"
                ? "bg-zinc-900 text-white border-zinc-900"
                : "bg-white text-zinc-700 border-zinc-200 hover:border-primary hover:text-primary"
            )}
          >
            <Sliders className="size-3.5" />
            <span>{viewMode === "preferences" ? "Back to Feed" : "Preferences"}</span>
          </button>

          {viewMode === "feed" && (
            <button
              onClick={handleMarkAllRead}
              disabled={isMarkingAll || unreadTotal === 0}
              className="inline-flex items-center gap-1.5 rounded-full bg-white border border-zinc-200 px-4 py-2 text-xs font-bold text-zinc-700 hover:border-primary hover:text-primary transition-colors shadow-2xs disabled:opacity-40 cursor-pointer"
            >
              <CheckCheck className="size-3.5" />
              <span>{isMarkingAll ? "Marking..." : "Mark all read"}</span>
            </button>
          )}
        </div>
      </div>

      {viewMode === "preferences" ? (
        <NotificationPreferencesView />
      ) : (
        <div className="space-y-4">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shadow-2xs border",
                  activeCategory === cat.id
                    ? "bg-zinc-900 text-white border-zinc-900 font-bold"
                    : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300 hover:text-zinc-900"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Notifications Feed */}
          <div className="flex flex-col gap-2.5">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <NotificationItem
                  key={notif.id}
                  notification={notif}
                  onReadAction={handleNotificationRead}
                  onDismissAction={handleNotificationDismiss}
                />
              ))
            ) : !isLoading ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/50 py-16 text-center">
                <div className="flex size-14 items-center justify-center rounded-full bg-white border border-zinc-200 mb-3 shadow-2xs">
                  <Bell className="size-7 text-zinc-400 stroke-[1.5]" />
                </div>
                <h3 className="text-sm font-bold text-zinc-800">You're completely up to date</h3>
                <p className="text-xs text-zinc-400 mt-1 max-w-sm">
                  {activeCategory === "unread"
                    ? "You have zero unread notifications in this category."
                    : "No notification history found for the selected filter."}
                </p>
              </div>
            ) : null}

            {isLoading && (
              <div className="py-12 text-center flex items-center justify-center gap-2 text-xs text-zinc-400">
                <RefreshCw className="size-4 animate-spin text-primary" />
                <span>Loading notifications...</span>
              </div>
            )}

            {hasMore && !isLoading && notifications.length > 0 && (
              <div className="pt-4 text-center">
                <button
                  onClick={() => loadNotifications(false)}
                  className="rounded-full bg-white border border-zinc-200 px-6 py-2 text-xs font-bold text-zinc-700 hover:border-primary hover:text-primary transition-colors shadow-2xs"
                >
                  Load older updates
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
