"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { fetchUnreadCountAction } from "./actions";

/**
 * Production Realtime Subscription Hook for In-App Notifications.
 * Listens on user-scoped channels:
 * - user_notifications: user_id=eq.${userId}
 * - notifications: user_id=eq.${userId}
 * Re-synchronizes unread state on browser tab focus, network online, and reconnection.
 */
export function useRealtimeNotifications(initialCount: number = 0) {
  const [unreadCount, setUnreadCount] = useState<number>(initialCount);
  const [lastNotificationAt, setLastNotificationAt] = useState<string | null>(null);
  const isSubscribedRef = useRef(false);

  const syncUnreadCount = useCallback(async () => {
    try {
      const count = await fetchUnreadCountAction();
      setUnreadCount(count);
    } catch {
      // Gracefully ignore network errors on sync
    }
  }, []);

  useEffect(() => {
    let channel: any = null;
    let authSub: any = null;

    async function initSubscription() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          setUnreadCount(0);
          return;
        }

        // Initial sync
        syncUnreadCount();

        // Establish user-scoped Realtime channel
        channel = supabase
          .channel(`user-notifications:${user.id}`)
          .on(
            "postgres_changes",
            {
              event: "INSERT",
              schema: "public",
              table: "user_notifications",
              filter: `user_id=eq.${user.id}`,
            },
            () => {
              setUnreadCount((prev) => prev + 1);
              setLastNotificationAt(new Date().toISOString());
            }
          )
          .on(
            "postgres_changes",
            {
              event: "UPDATE",
              schema: "public",
              table: "user_notifications",
              filter: `user_id=eq.${user.id}`,
            },
            () => {
              syncUnreadCount();
            }
          )
          .on(
            "postgres_changes",
            {
              event: "INSERT",
              schema: "public",
              table: "notifications",
              filter: `user_id=eq.${user.id}`,
            },
            () => {
              setUnreadCount((prev) => prev + 1);
              setLastNotificationAt(new Date().toISOString());
            }
          )
          .subscribe((status) => {
            if (status === "SUBSCRIBED") {
              isSubscribedRef.current = true;
            } else if (status === "CLOSED" || status === "TIMED_OUT") {
              isSubscribedRef.current = false;
            }
          });

        // Listen for session logout/change
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          if (!session?.user) {
            setUnreadCount(0);
            if (channel) {
              supabase.removeChannel(channel);
              channel = null;
            }
          } else {
            syncUnreadCount();
          }
        });
        authSub = subscription;

      } catch (err) {
        console.warn("[useRealtimeNotifications init failed]:", err);
      }
    }

    initSubscription();

    // Reconnection & Focus Resilience
    const handleOnline = () => syncUnreadCount();
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        syncUnreadCount();
      }
    };

    window.addEventListener("online", handleOnline);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("online", handleOnline);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (authSub) authSub.unsubscribe();
      if (channel) {
        const supabase = createClient();
        supabase.removeChannel(channel);
      }
    };
  }, [syncUnreadCount]);

  return {
    unreadCount,
    setUnreadCount,
    lastNotificationAt,
    refreshUnread: syncUnreadCount,
  };
}
