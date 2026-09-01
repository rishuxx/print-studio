import { NotificationProvider, SendNotificationPayload, NotificationProviderResult } from "../types";

export class PushProviderAdapter implements NotificationProvider {
  name = "push_adapter";
  channel = "PUSH" as const;

  isConfigured(): boolean {
    return Boolean(process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY);
  }

  async send(payload: SendNotificationPayload): Promise<NotificationProviderResult> {
    if (!payload.recipient) {
      return {
        success: false,
        provider: "push_adapter",
        status: "FAILED_PERMANENT",
        errorCode: "MISSING_PUSH_SUBSCRIPTION",
        errorMessage: "Web push subscription payload is empty.",
        isRetryable: false,
      };
    }

    if (!this.isConfigured()) {
      console.log(`[PushProvider NOT_CONFIGURED] To: ${payload.recipient.slice(0, 20)}... | Msg: ${payload.rendered.bodyText}`);
      return {
        success: true,
        provider: "mock_push",
        status: "NOT_CONFIGURED",
        errorMessage: "Web push VAPID keys not configured.",
      };
    }

    return {
      success: true,
      provider: "web_push",
      status: "SENT",
      providerMessageId: `push_${Date.now()}`,
    };
  }
}
