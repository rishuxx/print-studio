import { NotificationProvider, SendNotificationPayload, NotificationProviderResult, NotificationChannel } from "../types";

export class InAppProviderAdapter implements NotificationProvider {
  name = "IN_APP_DB";
  channel: NotificationChannel = "IN_APP";

  isConfigured(): boolean {
    return true;
  }

  async send(payload: SendNotificationPayload): Promise<NotificationProviderResult> {
    try {
      // In-App notifications are fully managed by the database insertion in NotificationService.
      // We don't actually dispatch to an external HTTP API like SendGrid or Twilio.
      // Therefore, if the NotificationService calls this provider, it merely confirms success.
      // The actual DB record insertion with 'IN_APP' channel was done before calling this.
      return {
        success: true,
        provider: this.name,
        providerMessageId: `in_app_${Date.now()}`,
        status: "SENT",
      };
    } catch (err: unknown) {
      console.error("[InAppProviderAdapter] Error:", err);
      return {
        success: false,
        provider: this.name,
        status: "FAILED_RETRYABLE",
        errorCode: "IN_APP_SYSTEM_ERROR",
        errorMessage: err instanceof Error ? err.message : "Failed to acknowledge in-app notification",
        isRetryable: true,
      };
    }
  }
}
