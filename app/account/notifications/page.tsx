"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Bell, Filter, Box, Truck, CreditCard, AlertTriangle, Info } from "lucide-react";
import { fetchNotificationsAction } from "@/lib/notifications/actions";
import { markAllNotificationsAsReadAction } from "@/lib/notifications/mutations";
import { NotificationRecord } from "@/lib/notifications/types";
import { NotificationItem } from "@/components/notifications/notification-item";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
  { id: "order", label: "Orders" },
  { id: "shipping", label: "Shipping" },
  { id: "payment", label: "Payments" },
  { id: "security", label: "Security" },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isMarkingAll, setIsMarkingAll] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  
  const LIMIT = 20;

  const loadNotifications = useCallback(async (reset = false, customCategory = activeCategory) => {
    setIsLoading(true);
    const currentPage = reset ? 0 : page;
    try {
      const isUnreadFilter = customCategory === "unread";
      const actualCategory = isUnreadFilter || customCategory === "all" ? undefined : customCategory;

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
  }, [page, activeCategory]);

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

  return (
    <div className="mx-auto max-w-4xl py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-ink sm:text-3xl">Notifications</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Stay updated on your orders, shipments, and account security.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={handleMarkAllRead}
          disabled={isMarkingAll || notifications.length === 0}
        >
          {isMarkingAll ? "Marking..." : "Mark all as read"}
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-2 border-b border-border pb-4">
        <Filter className="mr-2 size-4 text-muted-foreground" />
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryChange(cat.id)}
            className={cn(
              "rounded-full px-4 py-1.5 text-xs font-semibold transition-colors",
              activeCategory === cat.id
                ? "bg-ink text-white"
                : "bg-paper text-muted-foreground hover:bg-muted hover:text-ink"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Feed */}
      <div className="flex flex-col gap-3">
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <NotificationItem
              key={notif.id}
              notification={notif}
              onReadAction={handleNotificationRead}
            />
          ))
        ) : !isLoading ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-paper mb-4">
              <Bell className="size-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-lg font-bold text-ink">You're all caught up!</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              We'll notify you when there are important updates.
            </p>
          </div>
        ) : null}

        {isLoading && (
          <div className="py-8 text-center animate-pulse text-sm text-muted-foreground">
            Loading notifications...
          </div>
        )}

        {hasMore && !isLoading && notifications.length > 0 && (
          <div className="pt-6 text-center">
            <Button variant="secondary" onClick={() => loadNotifications(false)}>
              Load more
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
