import { createClient } from "@/lib/supabase/server";
import { siteConfig } from "@/lib/site-config";
import {
  DispatchEventParams,
  NotificationChannel,
  NotificationRecord,
  NotificationStatus,
} from "./types";
import { renderNotificationTemplate } from "./templates";
import { EmailProviderAdapter } from "./providers/email-provider";
import { WhatsAppProviderAdapter } from "./providers/whatsapp-provider";
import { PushProviderAdapter } from "./providers/push-provider";

export class NotificationService {
  private static emailProvider = new EmailProviderAdapter();
  private static whatsAppProvider = new WhatsAppProviderAdapter();
  private static pushProvider = new PushProviderAdapter();

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
      // removed shipAddr

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
      let preferences = { email: true, whatsapp: true, push: false };
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
          };
        }
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
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://preetyprints.com",
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

      const dispatchedCount = results.filter((r) => r.status === "SENT" || r.status === "NOT_CONFIGURED").length;
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
   * Internal worker: Validates idempotency, renders template, invokes provider with bounded retries.
   */
  private static async sendChannelNotification(params: {
    channel: NotificationChannel;
    recipient: string;
    eventType: DispatchEventParams["eventType"];
    orderId: string | null;
    userId: string | null;
    context: Parameters<typeof renderNotificationTemplate>[2];
    customIdempotencyKey?: string;
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

    // 2. Insert initial PENDING record
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
      })
      .select("id")
      .maybeSingle();

    if (insertErr || !notificationRecord) {
      console.warn("[Notification insert race/error]:", insertErr?.message);
      return { channel: params.channel, status: "PENDING" };
    }

    const notificationId = notificationRecord.id;

    // 3. Provider Resolution & Bounded Retry (Max 3 attempts)
    const provider =
      params.channel === "EMAIL"
        ? this.emailProvider
        : params.channel === "WHATSAPP"
        ? this.whatsAppProvider
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

    // 4. Update Database Record with Delivery State
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
}
