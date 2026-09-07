"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/auth/server-permissions";
import { NotificationService } from "./notification-service";
import type { CreateAdminNotificationParams } from "./types";

/**
 * Marks a single notification as read for the authenticated user.
 * Updates both user_notifications and notifications tables.
 */
export async function markNotificationAsReadAction(notificationId: string) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData?.user) {
    return { success: false, error: "Unauthorized" };
  }

  const nowIso = new Date().toISOString();

  // 1. Update user_notifications if row exists
  await supabase
    .from("user_notifications")
    .update({ read_at: nowIso })
    .eq("notification_id", notificationId)
    .eq("user_id", userData.user.id)
    .is("read_at", null);

  // 2. Also update notifications legacy row
  await supabase
    .from("notifications")
    .update({ read_at: nowIso, status: "READ" })
    .eq("id", notificationId)
    .eq("user_id", userData.user.id)
    .is("read_at", null);

  revalidatePath("/", "layout");
  return { success: true };
}

/**
 * Marks all notifications as read for the authenticated user.
 */
export async function markAllNotificationsAsReadAction() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData?.user) {
    return { success: false, error: "Unauthorized" };
  }

  const nowIso = new Date().toISOString();

  // Update all unread user_notifications
  await supabase
    .from("user_notifications")
    .update({ read_at: nowIso })
    .eq("user_id", userData.user.id)
    .is("read_at", null);

  // Update legacy notifications
  await supabase
    .from("notifications")
    .update({ read_at: nowIso, status: "READ" })
    .eq("user_id", userData.user.id)
    .eq("channel", "IN_APP")
    .is("read_at", null);

  revalidatePath("/", "layout");
  return { success: true };
}

/**
 * Dismisses a notification from the user's feed without deleting it.
 */
export async function dismissNotificationAction(notificationId: string) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData?.user) {
    return { success: false, error: "Unauthorized" };
  }

  const nowIso = new Date().toISOString();

  await supabase
    .from("user_notifications")
    .update({ dismissed_at: nowIso })
    .eq("notification_id", notificationId)
    .eq("user_id", userData.user.id);

  // Also soft-archive on notifications
  await supabase
    .from("notifications")
    .update({ is_archived: true })
    .eq("id", notificationId)
    .eq("user_id", userData.user.id);

  return { success: true };
}

/**
 * Updates customer notification preferences.
 * Enforces that transactional order updates cannot be turned off.
 */
export async function updateCustomerNotificationPreferencesAction(preferences: {
  inAppPromo: boolean;
  inAppProduct: boolean;
  inAppSystem: boolean;
  emailOrder: boolean;
  whatsappOrder: boolean;
}) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData?.user) {
    return { success: false, error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("customer_notification_preferences")
    .upsert(
      {
        user_id: userData.user.id,
        // Transactional always true
        in_app_order_updates: true,
        in_app_promotional_updates: preferences.inAppPromo,
        in_app_product_updates: preferences.inAppProduct,
        in_app_system_updates: preferences.inAppSystem,
        email_order_updates: preferences.emailOrder,
        whatsapp_order_updates: preferences.whatsappOrder,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );

  if (error) {
    console.error("[updateCustomerNotificationPreferencesAction] error:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Privileged Admin Action: Creates and publishes/schedules a notification.
 */
export async function createAdminBroadcastAction(params: CreateAdminNotificationParams): Promise<{
  success: boolean;
  notificationId?: string;
  targetedCount: number;
  error?: string;
}> {
  const { user } = await requirePermission("settings.view", "/admin/notifications");

  // Validate parameters
  if (!params.title?.trim() || !params.body?.trim()) {
    return { success: false, targetedCount: 0, error: "Title and message body are required." };
  }

  return await NotificationService.createAdminBroadcast(user.id, params);
}

/**
 * Privileged Admin Action: Completely deletes a notification and purges its delivered user feeds.
 */
export async function deleteAdminNotificationAction(notificationId: string): Promise<{ success: boolean; error?: string }> {
  const { user } = await requirePermission("settings.view", "/admin/notifications");
  const supabase = await createClient();

  // 1. Delete associated user_notifications first
  await supabase
    .from("user_notifications")
    .delete()
    .eq("notification_id", notificationId);

  // 2. Delete the primary notification record
  const { error } = await supabase
    .from("notifications")
    .delete()
    .eq("id", notificationId);

  if (error) {
    console.error("[deleteAdminNotificationAction] error:", error);
    return { success: false, error: error.message };
  }

  // 3. Record audit trail log
  await supabase.from("admin_audit_logs").insert({
    actor_id: user.id,
    target_id: notificationId,
    action: "DELETED_NOTIFICATION",
    details: { notificationId },
  });

  revalidatePath("/admin/notifications");
  revalidatePath("/", "layout");
  return { success: true };
}

/**
 * Privileged Admin Action: Stops/cancels an ongoing broadcast or scheduled notification,
 * setting its status to CANCELLED and removing it from active recipient user feeds.
 */
export async function stopAdminBroadcastAction(notificationId: string): Promise<{ success: boolean; error?: string }> {
  const { user } = await requirePermission("settings.view", "/admin/notifications");
  const supabase = await createClient();

  const nowIso = new Date().toISOString();

  // 1. Update notification record status to CANCELLED
  const { error } = await supabase
    .from("notifications")
    .update({
      status: "CANCELLED",
      expires_at: nowIso,
    })
    .eq("id", notificationId);

  if (error) {
    console.error("[stopAdminBroadcastAction] error:", error);
    return { success: false, error: error.message };
  }

  // 2. Dismiss/purge from recipient user feeds immediately so users don't see the cancelled broadcast
  await supabase
    .from("user_notifications")
    .update({ dismissed_at: nowIso })
    .eq("notification_id", notificationId);

  // 3. Record audit trail
  await supabase.from("admin_audit_logs").insert({
    actor_id: user.id,
    target_id: notificationId,
    action: "CANCELLED_BROADCAST",
    details: { notificationId, stoppedAt: nowIso },
  });

  revalidatePath("/admin/notifications");
  revalidatePath("/", "layout");
  return { success: true };
}

/**
 * Privileged Admin Action: Cancels a scheduled notification before it fires.
 */
export async function cancelScheduledNotificationAction(notificationId: string): Promise<{ success: boolean; error?: string }> {
  return stopAdminBroadcastAction(notificationId);
}

