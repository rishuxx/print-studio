"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function markNotificationAsReadAction(notificationId: string) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData?.user) {
    return { success: false, error: "Unauthorized" };
  }

  // RLS will enforce that the user can only update their own notification
  const { error } = await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString(), status: "READ" })
    .eq("id", notificationId)
    .eq("user_id", userData.user.id)
    .is("read_at", null); // Idempotency check

  if (error) {
    console.error("[markNotificationAsReadAction] error:", error);
    return { success: false, error: error.message };
  }

  // Usually the notification is fetched in layout or client component using swr/react-query,
  // but if server-rendered anywhere, we can revalidate.
  revalidatePath("/", "layout");
  return { success: true };
}

export async function markAllNotificationsAsReadAction() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData?.user) {
    return { success: false, error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString(), status: "READ" })
    .eq("user_id", userData.user.id)
    .eq("channel", "IN_APP")
    .is("read_at", null);

  if (error) {
    console.error("[markAllNotificationsAsReadAction] error:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/", "layout");
  return { success: true };
}
