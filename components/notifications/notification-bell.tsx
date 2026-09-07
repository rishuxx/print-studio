"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { Bell, CheckCheck, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchNotificationsAction } from "@/lib/notifications/actions";
import { markAllNotificationsAsReadAction } from "@/lib/notifications/mutations";
import { NotificationRecord } from "@/lib/notifications/types";
import { NotificationItem } from "./notification-item";
import { useRealtimeNotifications } from "@/lib/notifications/use-realtime-notifications";

export function NotificationBell() {
  const { unreadCount, setUnreadCount, lastNotificationAt } = useRealtimeNotifications();
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "unread" | "order" | "marketing">("all");
  const popoverRef = useRef<HTMLDivElement>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const listRes = await fetchNotificationsAction({
        limit: 8,
        unreadOnly: activeTab === "unread",
        category: activeTab === "order" || activeTab === "marketing" ? activeTab : undefined,
      });
      setNotifications(listRes.notifications);
    } catch (err) {
      console.error("Failed to load notifications", err);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen, loadData]);

  // When a realtime notification arrives while open, reload
  useEffect(() => {
    if (lastNotificationAt && isOpen) {
      loadData();
    }
  }, [lastNotificationAt, isOpen, loadData]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleMarkAllAsRead = async () => {
    setUnreadCount(0);
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read_at: n.read_at || new Date().toISOString() }))
    );
    await markAllNotificationsAsReadAction();
  };

  const handleNotificationRead = (id: string) => {
    setUnreadCount((prev) => Math.max(0, prev - 1));
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n))
    );
  };

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative" ref={popoverRef}>
      <button
        onClick={toggleOpen}
        type="button"
        className="relative flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 text-zinc-600 hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-colors shadow-2xs focus:outline-none focus:ring-2 focus:ring-primary/20"
        aria-label={`Notifications, ${unreadCount} unread`}
        aria-expanded={isOpen}
      >
        <Bell className="size-4 stroke-[1.75]" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex min-w-4.5 h-4.5 px-1 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white shadow-xs ring-2 ring-white animate-in zoom-in-50 duration-200">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-label="Notification Center"
          className="absolute right-0 top-full mt-2 w-84 sm:w-96 max-w-[calc(100vw-2rem)] rounded-2xl border border-zinc-200 bg-white shadow-xl z-50 animate-in fade-in-95 zoom-in-95 origin-top-right overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3.5 bg-zinc-50/70">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-zinc-900">Notifications</h3>
              {unreadCount > 0 && (
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                <CheckCheck className="size-3.5" />
                <span>Mark all as read</span>
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 border-b border-zinc-100 px-3 py-2 bg-white text-xs">
            {(
              [
                { id: "all", label: "All" },
                { id: "unread", label: "Unread" },
                { id: "order", label: "Orders" },
                { id: "marketing", label: "Offers" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "rounded-full px-3 py-1 font-medium transition-colors text-[11px]",
                  activeTab === tab.id
                    ? "bg-zinc-900 text-white font-semibold"
                    : "text-zinc-600 hover:bg-zinc-100"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* List Feed */}
          <div className="max-h-[65vh] overflow-y-auto p-2.5 flex flex-col gap-1.5 custom-scrollbar divide-y divide-zinc-50">
            {isLoading && notifications.length === 0 ? (
              <div className="py-12 text-center flex flex-col items-center justify-center gap-2 text-zinc-400">
                <RefreshCw className="size-5 animate-spin text-primary" />
                <span className="text-xs">Updating notifications...</span>
              </div>
            ) : notifications.length > 0 ? (
              notifications.map((notif) => (
                <NotificationItem
                  key={notif.id}
                  notification={notif}
                  onReadAction={handleNotificationRead}
                  isPopover
                />
              ))
            ) : (
              <div className="py-12 text-center flex flex-col items-center justify-center text-zinc-400">
                <div className="flex size-12 items-center justify-center rounded-full bg-zinc-100 mb-2.5">
                  <Bell className="size-6 text-zinc-400/80 stroke-[1.5]" />
                </div>
                <p className="text-xs font-bold text-zinc-700">All caught up</p>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  {activeTab === "unread"
                    ? "No unread updates right now."
                    : "No notifications to display."}
                </p>
              </div>
            )}
          </div>

          {/* Footer View All Link */}
          <div className="border-t border-zinc-100 p-2 bg-zinc-50/50">
            <Link
              href="/account/notifications"
              onClick={() => setIsOpen(false)}
              className="block w-full rounded-xl py-2 text-center text-xs font-bold text-zinc-800 hover:bg-white hover:text-primary transition-all shadow-2xs border border-transparent hover:border-zinc-200"
            >
              View All Notifications & Preferences &rarr;
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
