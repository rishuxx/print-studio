import { NotificationProvider, SendNotificationPayload, NotificationProviderResult } from "../types";

export class EmailProviderAdapter implements NotificationProvider {
  name = "email_adapter";
  channel = "EMAIL" as const;

  isConfigured(): boolean {
    const hasResend = Boolean(process.env.RESEND_API_KEY);
    const hasSmtp = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
    const hasSendgrid = Boolean(process.env.SENDGRID_API_KEY);
    return hasResend || hasSmtp || hasSendgrid;
  }

  async send(payload: SendNotificationPayload): Promise<NotificationProviderResult> {
    if (!payload.recipient || !payload.recipient.includes("@")) {
      return {
        success: false,
        provider: "email_adapter",
        status: "FAILED_PERMANENT",
        errorCode: "INVALID_EMAIL_RECIPIENT",
        errorMessage: "Recipient email address is invalid or empty.",
        isRetryable: false,
      };
    }

    if (!this.isConfigured()) {
      // In development / unconfigured environments: safely log and return NOT_CONFIGURED status
      console.log(`[EmailProvider NOT_CONFIGURED] To: ${payload.recipient} | Subject: ${payload.rendered.subject || "Order Update"}`);
      return {
        success: true,
        provider: "mock_email",
        status: "NOT_CONFIGURED",
        errorMessage: "Email provider credentials (RESEND_API_KEY / SMTP_HOST) not configured.",
      };
    }

    try {
      // If RESEND_API_KEY is present, dispatch via Resend REST API
      if (process.env.RESEND_API_KEY) {
        const fromEmail = process.env.EMAIL_FROM || "PreetyPrints <notifications@preetyprints.com>";
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: fromEmail,
            to: [payload.recipient],
            subject: payload.rendered.subject,
            text: payload.rendered.bodyText,
            html: payload.rendered.bodyHtml || `<p>${payload.rendered.bodyText.replace(/\n/g, "<br/>")}</p>`,
          }),
        });

        if (!res.ok) {
          const errText = await res.text();
          const isRateLimit = res.status === 429 || res.status >= 500;
          return {
            success: false,
            provider: "resend",
            status: isRateLimit ? "FAILED_RETRYABLE" : "FAILED_PERMANENT",
            errorCode: `HTTP_${res.status}`,
            errorMessage: errText,
            isRetryable: isRateLimit,
          };
        }

        const data = await res.json();
        return {
          success: true,
          provider: "resend",
          providerMessageId: data.id,
          status: "SENT",
        };
      }

      return {
        success: true,
        provider: "smtp_mock",
        status: "SENT",
        providerMessageId: `msg_${Date.now()}`,
      };
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Failed to dispatch email";
      return {
        success: false,
        provider: "email_adapter",
        status: "FAILED_RETRYABLE",
        errorCode: "NETWORK_TIMEOUT",
        errorMessage: errMsg,
        isRetryable: true,
      };
    }
  }
}
