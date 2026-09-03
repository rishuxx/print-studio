import { createClient } from "@/lib/supabase/server";
import { NotificationRecord } from "./types";

export async function getUnreadNotificationCount(): Promise<number> {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData?.user) {
    return 0;
  }

  const { count, error } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userData.user.id)
    .eq("channel", "IN_APP")
    .is("read_at", null)
    .eq("is_archived", false);

  if (error) {
    console.error("[getUnreadNotificationCount] error:", error);
    return 0;
  }

  return count || 0;
}

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

  let query = supabase
    .from("notifications")
    .select("*", { count: "exact" })
    .eq("user_id", userData.user.id)
    .eq("channel", "IN_APP")
    .eq("is_archived", false)
    .order("created_at", { ascending: false });

  if (params.category) {
    query = query.eq("category", params.category);
  }

  if (params.unreadOnly) {
    query = query.is("read_at", null);
  }

  const { data, count, error } = await query.range(offset, offset + limit - 1);

  if (error) {
    console.error("[getNotifications] error:", error);
    return { notifications: [], totalCount: 0 };
  }

  return { notifications: (data as NotificationRecord[]) || [], totalCount: count || 0 };
}
