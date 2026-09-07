import { createClient } from "@/lib/supabase/server";
import { NotificationRecord, CustomerNotificationPreferences } from "./types";

/**
 * Retrieves the live unread in-app notification count for the authenticated customer.
 * Queries user_notifications and falls back to notifications table for backwards-compatibility.
 */
export async function getUnreadNotificationCount(): Promise<number> {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData?.user) {
    return 0;
  }

  const nowIso = new Date().toISOString();

  // Try user_notifications first
  const { count: userNotifCount, error: userNotifErr } = await supabase
    .from("user_notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userData.user.id)
    .is("read_at", null)
    .is("dismissed_at", null);

  if (!userNotifErr && typeof userNotifCount === "number" && userNotifCount > 0) {
    return userNotifCount;
  }

  // Fallback to legacy notifications table direct count
  const { count, error } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userData.user.id)
    .eq("channel", "IN_APP")
    .is("read_at", null)
    .eq("is_archived", false)
    .or(`expires_at.is.null,expires_at.gt.${nowIso}`);

  if (error) {
    console.error("[getUnreadNotificationCount] error:", error);
    return 0;
  }

  return count || 0;
}

/**
 * Retrieves paginated notifications for the customer feed.
 * Joins user_notifications with notifications to retrieve full rich payload.
 */
export async function getNotifications(params: {
  limit?: number;
  offset?: number;
  category?: string;
  unreadOnly?: boolean;
}): Promise<{ notifications: NotificationRecord[]; totalCount: number }> {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData?.user) {
    return { notifications: [], totalCount: 0 };
  }

  const limit = params.limit || 20;
  const offset = params.offset || 0;
  const nowIso = new Date().toISOString();

  // 1. Check user_notifications table first
  let userQuery = supabase
    .from("user_notifications")
    .select("id, notification_id, user_id, read_at, delivered_at, dismissed_at, created_at, notifications!notification_id (*)", { count: "exact" })
    .eq("user_id", userData.user.id)
    .is("dismissed_at", null)
    .order("created_at", { ascending: false });

  if (params.unreadOnly) {
    userQuery = userQuery.is("read_at", null);
  }

  const { data: joinedData, count: joinedCount, error: joinErr } = await userQuery.range(offset, offset + limit - 1);

  if (!joinErr && joinedData && joinedData.length > 0) {
    const list: NotificationRecord[] = joinedData.map((row: any) => {
      const n = row.notifications || {};
      return {
        ...n,
        id: row.notification_id || n.id,
        user_notif_id: row.id,
        read_at: row.read_at,
        delivered_at: row.delivered_at,
        created_at: row.created_at || n.created_at,
      };
    }).filter((n) => {
      // Exclude expired
      if (n.expires_at && new Date(n.expires_at) <= new Date()) return false;
      // Filter category if specified
      if (params.category && params.category !== "all" && params.category !== "unread") {
        return n.category === params.category;
      }
      return true;
    });

    return { notifications: list, totalCount: joinedCount || list.length };
  }

  // 2. Legacy fallback to direct notifications table query
  let legacyQuery = supabase
    .from("notifications")
    .select("*", { count: "exact" })
    .or(`user_id.eq.${userData.user.id},target_type.eq.ALL`)
    .eq("channel", "IN_APP")
    .eq("is_archived", false)
    .or(`expires_at.is.null,expires_at.gt.${nowIso}`)
    .order("created_at", { ascending: false });

  if (params.category && params.category !== "all" && params.category !== "unread") {
    legacyQuery = legacyQuery.eq("category", params.category);
  }

  if (params.unreadOnly) {
    legacyQuery = legacyQuery.is("read_at", null);
  }

  const { data, count, error } = await legacyQuery.range(offset, offset + limit - 1);

  if (error) {
    console.error("[getNotifications] error:", error);
    return { notifications: [], totalCount: 0 };
  }

  return { notifications: (data as NotificationRecord[]) || [], totalCount: count || 0 };
}

/**
 * Retrieves the current customer's notification preferences.
 */
export async function getCustomerNotificationPreferences(): Promise<CustomerNotificationPreferences | null> {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData?.user) {
    return null;
  }

  const { data, error } = await supabase
    .from("customer_notification_preferences")
    .select("*")
    .eq("user_id", userData.user.id)
    .maybeSingle();

  if (error || !data) {
    return {
      user_id: userData.user.id,
      email_order_updates: true,
      whatsapp_order_updates: true,
      push_order_updates: false,
      in_app_order_updates: true,
      in_app_promotional_updates: true,
      in_app_product_updates: true,
      in_app_system_updates: true,
      in_app_account_updates: true,
      updated_at: new Date().toISOString(),
    };
  }

  return data as CustomerNotificationPreferences;
}
