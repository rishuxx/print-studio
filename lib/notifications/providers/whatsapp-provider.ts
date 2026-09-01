import { NotificationProvider, SendNotificationPayload, NotificationProviderResult } from "../types";
import { WhatsAppService } from "@/lib/whatsapp/service";

export class WhatsAppProviderAdapter implements NotificationProvider {
  name = "meta_whatsapp_business";
  channel = "WHATSAPP" as const;

  isConfigured(): boolean {
    return Boolean(
      (process.env.WHATSAPP_ACCESS_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID) ||
      (process.env.WHATSAPP_API_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID)
    );
  }

  async send(payload: SendNotificationPayload): Promise<NotificationProviderResult> {
    const cleanPhone = payload.recipient.replace(/[^0-9]/g, "");
    if (!cleanPhone || cleanPhone.length < 10) {
      return {
        success: false,
        provider: this.name,
        status: "FAILED_PERMANENT",
        errorCode: "INVALID_PHONE_NUMBER",
        errorMessage: "Recipient phone number is invalid.",
        isRetryable: false,
      };
    }

    try {
      // Dispatch through the official WhatsApp subsystem
      const eventKey = payload.templateKey.replace(/_WHATSAPP$/, "");
      const res = await WhatsAppService.emitEvent({
        eventType: eventKey,
        recipientPhone: payload.recipient,
        context: {
          customerName: (payload.metadata?.customerName as string) || "Valued Customer",
          orderNumber: (payload.metadata?.orderNumber as string) || undefined,
          orderId: (payload.metadata?.orderId as string) || undefined,
          orderTotal: (payload.metadata?.orderTotal as string) || undefined,
          trackingNumber: (payload.metadata?.trackingNumber as string) || undefined,
          carrierName: (payload.metadata?.carrierName as string) || undefined,
          artworkReviewUrl: (payload.metadata?.artworkReviewUrl as string) || undefined,
          orderTrackingUrl: (payload.metadata?.orderTrackingUrl as string) || undefined,
          refundAmount: (payload.metadata?.refundAmount as string) || undefined,
        },
      });

      if (res.status === "SKIPPED" || res.status.startsWith("SKIPPED_")) {
        return {
          success: true,
          provider: this.name,
          status: "NOT_CONFIGURED",
          errorMessage: res.skippedReason || "WhatsApp integration not configured or trigger disabled.",
        };
      }

      if (res.success || res.status === "SENT") {
        return {
          success: true,
          provider: this.name,
          providerMessageId: res.outboxId,
          status: "SENT",
        };
      }

      return {
        success: false,
        provider: this.name,
        status: "FAILED_PERMANENT",
        errorCode: res.status,
        errorMessage: res.skippedReason || "WhatsApp delivery failed",
        isRetryable: false,
      };
    } catch (err: unknown) {
      return {
        success: false,
        provider: this.name,
        status: "FAILED_RETRYABLE",
        errorCode: "WHATSAPP_DISPATCH_EXCEPTION",
        errorMessage: err instanceof Error ? err.message : "WhatsApp dispatch exception",
        isRetryable: true,
      };
    }
  }
}
