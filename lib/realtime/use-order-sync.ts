"use client";

import * as React from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

/**
 * High-Speed Real-Time PostgreSQL Live Stream Hook
 * Uses Supabase WebSocket Realtime protocol to instantly listen for database INSERT,
 * UPDATE, and DELETE events across orders, payments, and shipments without polling or reloading.
 */
export function useRealtimeOrderSync(options?: { onOrderUpdate?: (payload: Record<string, unknown>) => void }) {
  const router = useRouter();

  React.useEffect(() => {
    const supabase = createClient();

    // Establish WebSocket Realtime Channel for Print Studio Live Operations
    const channel = supabase
      .channel("realtime_admin_operations")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const newOrder = payload.new as { order_number?: string };
            toast.info(`New Order Received! #${newOrder.order_number || "Live"}`, {
              description: "Dashboard and orders list updated in real-time.",
            });
          }
          if (options?.onOrderUpdate) {
            options.onOrderUpdate(payload.new as Record<string, unknown>);
          }
          router.refresh();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "shipping_shipments",
        },
        () => {
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router, options]);
}
