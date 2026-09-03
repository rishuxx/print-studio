"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchUnreadCountAction, fetchNotificationsAction } from "@/lib/notifications/actions";
import { markAllNotificationsAsReadAction } from "@/lib/notifications/mutations";
import { NotificationRecord } from "@/lib/notifications/types";
import { NotificationItem } from "./notification-item";

export function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [countRes, listRes] = await Promise.all([
        fetchUnreadCountAction(),
        fetchNotificationsAction({ limit: 5 }),
      ]);
      setUnreadCount(countRes);
      setNotifications(listRes.notifications);
    } catch (err) {
      console.error("Failed to load notifications", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    // In a real production app with Realtime enabled, you would subscribe to Supabase Realtime here
    // to increment the unread count and prepend to the list when a new notification arrives.
  }, [loadData]);

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
    setNotifications((prev) => prev.map((n) => ({ ...n, read_at: n.read_at || new Date().toISOString() })));
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
    if (!isOpen) loadData(); // refresh when opening
  };

  return (
    <div className="relative" ref={popoverRef}>
      <button
        onClick={toggleOpen}
        className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-border text-ink hover:bg-muted transition-colors"
        aria-label={`Notifications, ${unreadCount} unread`}
      >
        <Bell className="size-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-violet text-[0.625rem] font-bold text-white shadow-sm ring-2 ring-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl border border-border bg-white shadow-pop z-50 animate-slide-down origin-top-right overflow-hidden flex flex-col">
          <div className="flex items-center justify-between border-b border-border p-4 bg-paper/50">
            <h3 className="font-bold text-ink">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs font-semibold text-violet hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-[60vh] overflow-y-auto p-2 flex flex-col gap-1 custom-scrollbar">
            {isLoading && notifications.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground animate-pulse">
                Loading notifications...
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
              <div className="py-12 text-center flex flex-col items-center justify-center text-muted-foreground">
                <Bell className="size-8 text-muted-foreground/30 mb-3" />
                <p className="text-sm font-medium text-ink">You're all caught up</p>
                <p className="text-xs mt-1">No notifications yet.</p>
              </div>
            )}
          </div>

          <div className="border-t border-border p-2 bg-paper/50">
            <Link
              href="/account/notifications"
              onClick={() => setIsOpen(false)}
              className="block w-full rounded-lg py-2 text-center text-xs font-bold text-ink hover:bg-white hover:text-violet transition-colors"
            >
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
