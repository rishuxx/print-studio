import { createClient } from "@/lib/supabase/server";
import { siteConfig } from "@/lib/site-config";
import {
  DispatchEventParams,
  CreateAdminNotificationParams,
  NotificationChannel,
  NotificationRecord,
  NotificationStatus,
} from "./types";
import { renderNotificationTemplate } from "./templates";
import { EmailProviderAdapter } from "./providers/email-provider";
import { WhatsAppProviderAdapter } from "./providers/whatsapp-provider";
import { PushProviderAdapter } from "./providers/push-provider";
import { InAppProviderAdapter } from "./providers/in-app-provider";
import { getSiteUrl } from "@/lib/site-url";

export class NotificationService {
  private static emailProvider = new EmailProviderAdapter();
  private static whatsAppProvider = new WhatsAppProviderAdapter();
  private static pushProvider = new PushProviderAdapter();
  private static inAppProvider = new InAppProviderAdapter();

  /**
   * Authoritative server-side entry point to trigger notification events.
   * Completely isolated: Errors in notification never bubble up or fail core transactions.
   */
  static async dispatchEvent(params: DispatchEventParams): Promise<{
    success: boolean;
    dispatchedCount: number;
    skippedCount: number;
    notifications: Array<{ channel: NotificationChannel; status: NotificationStatus; id?: string }>;
  }> {
    const results: Array<{ channel: NotificationChannel; status: NotificationStatus; id?: string }> = [];

    try {
      const supabase = await createClient();

      // 1. Resolve order details if orderId is provided but details are missing
      let order = null;
      if (params.orderId) {
        const { data: ord } = await supabase
          .from("orders")
          .select("id, order_number, user_id, total, status, delivery_snapshot, customer_snapshot")
          .eq("id", params.orderId)
          .maybeSingle();
        order = ord;
      }

      const effectiveUserId = params.userId || order?.user_id || null;
      const cSnap = (order?.customer_snapshot as Record<string, unknown>) || {};
      const dSnap = (order?.delivery_snapshot as Record<string, unknown>) || {};

      const recipientEmail =
        params.recipientEmail ||
        (cSnap.email as string) ||
        (dSnap.email as string) ||
        null;

      const recipientPhone =
        params.recipientPhone ||
        (cSnap.phone as string) ||
        (dSnap.phone as string) ||
        null;

      const recipientName =
        params.recipientName ||
        (cSnap.name as string) ||
        (dSnap.recipient_name as string) ||
        "Valued Customer";

      const orderNumber = params.orderNumber || order?.order_number || (order ? `PRT-${order.id.slice(0, 8)}` : undefined);
      const amountMinor = params.amountMinor ?? (order?.total ? Math.round(Number(order.total) * 100) : undefined);

      // 2. Load Customer Notification Preferences (if registered user)
      let preferences = {
        email: true,
        whatsapp: true,
        push: false,
        inAppOrder: true,
        inAppPromo: true,
        inAppProduct: true,
        inAppSystem: true,
      };

      if (effectiveUserId) {
        const { data: pref } = await supabase
          .from("customer_notification_preferences")
          .select("*")
          .eq("user_id", effectiveUserId)
          .maybeSingle();

        if (pref) {
          preferences = {
            email: pref.email_order_updates ?? true,
            whatsapp: pref.whatsapp_order_updates ?? true,
            push: pref.push_order_updates ?? false,
            inAppOrder: pref.in_app_order_updates ?? true,
            inAppPromo: pref.in_app_promotional_updates ?? true,
            inAppProduct: pref.in_app_product_updates ?? true,
            inAppSystem: pref.in_app_system_updates ?? true,
          };
        }
      }

      // Check whether this event type is blocked by marketing preference
      const isPromo = params.eventType.startsWith("SALE_") ||
        params.eventType.startsWith("FESTIVAL_") ||
        params.eventType.startsWith("LIMITED_") ||
        params.eventType.startsWith("PROMOTIONAL_") ||
        params.category === "marketing";

      const isProductUpdate = params.eventType.startsWith("PRODUCT_") ||
        params.eventType.startsWith("NEW_PRODUCT_") ||
        params.category === "product";

      if (isPromo && !preferences.inAppPromo) {
        return { success: true, dispatchedCount: 0, skippedCount: 1, notifications: [] };
      }
      if (isProductUpdate && !preferences.inAppProduct) {
        return { success: true, dispatchedCount: 0, skippedCount: 1, notifications: [] };
      }

      const templateContext = {
        customerName: recipientName,
        orderNumber,
        orderId: params.orderId || order?.id,
        amountMinor,
        currency: params.currency || "INR",
        trackingNumber: params.trackingNumber || undefined,
        trackingUrl: params.trackingUrl || undefined,
        carrierName: params.carrierName || undefined,
        artworkRejectionReason: params.artworkRejectionReason || undefined,
        cancellationReason: params.cancellationReason || undefined,
        businessName: siteConfig.businessName,
        supportEmail: siteConfig.contact.email,
        supportPhone: siteConfig.contact.phone,
        siteUrl: getSiteUrl(),
      };

      // 3. Dispatch Channel: EMAIL
      if (recipientEmail && preferences.email) {
        const emailRes = await this.sendChannelNotification({
          channel: "EMAIL",
          recipient: recipientEmail,
          eventType: params.eventType,
          orderId: params.orderId || order?.id || null,
          userId: effectiveUserId,
          context: templateContext,
          customIdempotencyKey: params.idempotencyKey,
        });
        results.push(emailRes);
      }

      // 4. Dispatch Channel: WHATSAPP
      if (recipientPhone && preferences.whatsapp) {
        const waRes = await this.sendChannelNotification({
          channel: "WHATSAPP",
          recipient: recipientPhone,
          eventType: params.eventType,
          orderId: params.orderId || order?.id || null,
          userId: effectiveUserId,
          context: templateContext,
          customIdempotencyKey: params.idempotencyKey,
        });
        results.push(waRes);
      }

      // 5. Dispatch Channel: IN_APP (Always if we have a userId)
      if (effectiveUserId) {
        const inAppRes = await this.sendChannelNotification({
          channel: "IN_APP",
          recipient: effectiveUserId,
          eventType: params.eventType,
          orderId: params.orderId || order?.id || null,
          userId: effectiveUserId,
          context: templateContext,
          customIdempotencyKey: params.idempotencyKey,
          actionUrl: params.actionUrl || (params.orderId ? `/orders/${params.orderId}` : undefined),
          actionLabel: params.actionLabel || (params.orderId ? "Track Order" : undefined),
          imageUrl: params.imageUrl,
          icon: params.icon,
          priority: params.priority || "normal",
          severity: params.severity || "info",
          category: params.category || "order",
        });
        results.push(inAppRes);
      }

      const dispatchedCount = results.filter((r) => r.status === "SENT" || r.status === "NOT_CONFIGURED" || r.status === "DELIVERED").length;
      return {
        success: true,
        dispatchedCount,
        skippedCount: results.length - dispatchedCount,
        notifications: results,
      };
    } catch (err: unknown) {
      console.error("[NotificationService.dispatchEvent top-level error (isolated)]:", err);
      return {
        success: false,
        dispatchedCount: 0,
        skippedCount: 0,
        notifications: results,
      };
    }
  }

  /**
   * Internal worker: Validates idempotency, renders template, creates notification
   * and synchronizes user_notifications records.
   */
  private static async sendChannelNotification(params: {
    channel: NotificationChannel;
    recipient: string;
    eventType: DispatchEventParams["eventType"];
    orderId: string | null;
    userId: string | null;
    context: Parameters<typeof renderNotificationTemplate>[2];
    customIdempotencyKey?: string;
    actionUrl?: string;
    actionLabel?: string;
    imageUrl?: string | null;
    icon?: string | null;
    priority?: string;
    severity?: string;
    category?: string;
  }): Promise<{ channel: NotificationChannel; status: NotificationStatus; id?: string }> {
    const supabase = await createClient();
    const templateKey = `${params.eventType}_${params.channel}`;
    const orderKey = params.orderId || "gen";
    const idempotencyKey =
      params.customIdempotencyKey
        ? `${params.customIdempotencyKey}_${params.channel}`
        : `${orderKey}_${params.eventType}_${params.channel}`;

    // 1. Idempotency Check in Database
    const { data: existing } = await supabase
      .from("notifications")
      .select("id, status")
      .eq("idempotency_key", idempotencyKey)
      .maybeSingle();

    if (existing) {
      // Duplicate event safely acknowledged
      return {
        channel: params.channel,
        status: existing.status as NotificationStatus,
        id: existing.id,
      };
    }

    const rendered = renderNotificationTemplate(params.eventType, params.channel, params.context);

    // 2. Insert initial record
    const { data: notificationRecord, error: insertErr } = await supabase
      .from("notifications")
      .insert({
        user_id: params.userId,
        order_id: params.orderId,
        event_type: params.eventType,
        channel: params.channel,
        recipient: params.recipient,
        template_key: templateKey,
        status: "PENDING",
        provider: "unassigned",
        idempotency_key: idempotencyKey,
        attempt_count: 0,
        max_attempts: 3,
        metadata: {
          subject: rendered.subject || null,
          context_summary: params.context.orderNumber || null,
        },
        title: rendered.subject || "Notification Update",
        body: rendered.bodyText,
        category: params.category || "order",
        priority: params.priority || "normal",
        severity: params.severity || "info",
        resource_type: params.orderId ? "order" : null,
        resource_id: params.orderId || null,
        action_url: params.actionUrl || rendered.ctaUrl || null,
        action_label: params.actionLabel || rendered.ctaLabel || null,
        image_url: params.imageUrl || null,
        icon: params.icon || (params.orderId ? "package" : "bell"),
        published_at: new Date().toISOString(),
      })
      .select("id")
      .maybeSingle();

    if (insertErr || !notificationRecord) {
      console.warn("[Notification insert race/error]:", insertErr?.message);
      return { channel: params.channel, status: "PENDING" };
    }

    const notificationId = notificationRecord.id;

    // 3. Insert normalized user_notifications record for IN_APP channel
    if (params.channel === "IN_APP" && params.userId) {
      try {
        await supabase.from("user_notifications").upsert(
          {
            notification_id: notificationId,
            user_id: params.userId,
            delivered_at: new Date().toISOString(),
          },
          { onConflict: "notification_id,user_id" }
        );
      } catch (unErr) {
        console.warn("[user_notifications upsert error]:", unErr);
      }
    }

    // 4. Provider Resolution & Bounded Retry (Max 3 attempts)
    const provider =
      params.channel === "EMAIL"
        ? this.emailProvider
        : params.channel === "WHATSAPP"
        ? this.whatsAppProvider
        : params.channel === "IN_APP"
        ? this.inAppProvider
        : this.pushProvider;

    let attempt = 0;
    let finalResult = null;

    while (attempt < 3) {
      attempt++;
      try {
        finalResult = await provider.send({
          recipient: params.recipient,
          templateKey,
          rendered,
          metadata: {
            ...params.context,
            orderId: params.orderId || undefined,
            orderNumber: params.context.orderNumber || undefined,
            customerName: params.context.customerName || undefined,
            orderTotal: params.context.amountMinor
              ? (params.context.amountMinor / 100).toLocaleString("en-IN", { minimumFractionDigits: 2 })
              : undefined,
            trackingNumber: params.context.trackingNumber || undefined,
            carrierName: params.context.carrierName || undefined,
            artworkReviewUrl: `${params.context.siteUrl || "https://preetyprints.com"}/orders/${params.orderId || ""}#proof`,
            orderTrackingUrl: `${params.context.siteUrl || "https://preetyprints.com"}/orders/${params.orderId || ""}`,
          },
        });

        if (finalResult.success || !finalResult.isRetryable) {
          break;
        }
      } catch (err: unknown) {
        finalResult = {
          success: false,
          provider: provider.name,
          status: "FAILED_RETRYABLE" as const,
          errorCode: "EXCEPTION",
          errorMessage: err instanceof Error ? err.message : "Provider failure",
          isRetryable: true,
        };
      }
    }

    const finalStatus: NotificationStatus =
      finalResult?.status || (finalResult?.success ? "SENT" : "FAILED_PERMANENT");

    // 5. Update Database Record with Delivery State
    await supabase
      .from("notifications")
      .update({
        status: finalStatus,
        provider: finalResult?.provider || provider.name,
        provider_message_id: finalResult?.providerMessageId || null,
        attempt_count: attempt,
        error_code: finalResult?.errorCode || null,
        error_message: finalResult?.errorMessage || null,
        sent_at: finalStatus === "SENT" ? new Date().toISOString() : null,
        failed_at: finalStatus.startsWith("FAILED") ? new Date().toISOString() : null,
      })
      .eq("id", notificationId);

    return {
      channel: params.channel,
      status: finalStatus,
      id: notificationId,
    };
  }

  /**
   * Admin-facing broadcast & targeted notification creation service.
   * Handles individual, multiple, all users, or user segments.
   */
  static async createAdminBroadcast(
    adminUserId: string,
    params: CreateAdminNotificationParams
  ): Promise<{ success: boolean; notificationId?: string; targetedCount: number; error?: string }> {
    try {
      const supabase = await createClient();
      const isScheduled = !!params.scheduledAt && new Date(params.scheduledAt) > new Date();
      const initialStatus: NotificationStatus = isScheduled ? "SCHEDULED" : "PUBLISHED";
      const idempotencyKey = `admin_broadcast_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

      // 1. Create primary notifications record
      const { data: notif, error: notifErr } = await supabase
        .from("notifications")
        .insert({
          event_type: params.eventType || "SYSTEM_ANNOUNCEMENT",
          channel: "IN_APP",
          recipient: params.targetType === "ALL" ? "BROADCAST" : "TARGETED",
          template_key: `ADMIN_ANNOUNCEMENT_IN_APP`,
          status: initialStatus,
          provider: "IN_APP_DB",
          idempotency_key: idempotencyKey,
          title: params.title,
          body: params.body,
          category: params.category,
          priority: params.priority,
          severity: params.severity || "info",
          icon: params.icon || "megaphone",
          action_url: params.actionUrl || null,
          action_label: params.actionLabel || null,
          image_url: params.imageUrl || null,
          target_type: params.targetType,
          target_segment: params.targetSegment || null,
          scheduled_at: params.scheduledAt || null,
          published_at: isScheduled ? null : new Date().toISOString(),
          expires_at: params.expiresAt || null,
          created_by: adminUserId,
        })
        .select("id")
        .single();

      if (notifErr || !notif) {
        return { success: false, targetedCount: 0, error: notifErr?.message || "Failed to create notification" };
      }

      // 2. Resolve Target User IDs
      let targetUserIds: string[] = [];

      if (params.targetType === "INDIVIDUAL" && params.targetUserIds?.length) {
        targetUserIds = [params.targetUserIds[0]];
      } else if (params.targetType === "MULTIPLE" && params.targetUserIds?.length) {
        targetUserIds = params.targetUserIds;
      } else if (params.targetType === "ALL") {
        const { data: allUsers } = await supabase
          .from("profiles")
          .select("id")
          .eq("status", "active")
          .limit(10000);
        targetUserIds = (allUsers || []).map((u) => u.id);
      } else if (params.targetType === "SEGMENT") {
        // Simple segmentation
        if (params.targetSegment === "customers_with_orders") {
          const { data: ordUsers } = await supabase.from("orders").select("user_id").not("user_id", "is", null);
          const distinct = Array.from(new Set((ordUsers || []).map((o) => o.user_id).filter(Boolean))) as string[];
          targetUserIds = distinct;
        } else {
          const { data: allUsers } = await supabase.from("profiles").select("id").limit(5000);
          targetUserIds = (allUsers || []).map((u) => u.id);
        }
      }

      // 3. If published immediately, batch-insert user_notifications
      if (!isScheduled && targetUserIds.length > 0) {
        const batchSize = 500;
        for (let i = 0; i < targetUserIds.length; i += batchSize) {
          const chunk = targetUserIds.slice(i, i + batchSize).map((uId) => ({
            notification_id: notif.id,
            user_id: uId,
            delivered_at: new Date().toISOString(),
          }));
          await supabase.from("user_notifications").insert(chunk);
        }
      }

      // 4. Log Administrative Action to admin_audit_logs
      await supabase.from("admin_audit_logs").insert({
        actor_id: adminUserId,
        target_id: notif.id,
        action: isScheduled ? "SCHEDULED_NOTIFICATION" : "PUBLISHED_NOTIFICATION",
        details: {
          title: params.title,
          category: params.category,
          targetType: params.targetType,
          targetedCount: targetUserIds.length,
          scheduledAt: params.scheduledAt || null,
        },
      });

      return {
        success: true,
        notificationId: notif.id,
        targetedCount: targetUserIds.length,
      };
    } catch (err: unknown) {
      console.error("[NotificationService.createAdminBroadcast error]:", err);
      return {
        success: false,
        targetedCount: 0,
        error: err instanceof Error ? err.message : "Broadcast failed",
      };
    }
  }
}
