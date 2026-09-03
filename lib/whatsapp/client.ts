/**
 * Official Meta WhatsApp Cloud API Client
 * Server-only execution. Handles token authentication, endpoint construction,
 * parameter assembly, strict timeout enforcement, and safe error normalization.
 */

import {
  MetaSendTemplateParams,
  MetaApiResponse,
  WhatsAppClientResult,
} from "./types";

export interface MetaCredentials {
  accessToken: string;
  phoneNumberId: string;
  businessAccountId?: string | null;
  apiVersion?: string;
}

export class MetaWhatsAppClient {
  private accessToken: string;
  private phoneNumberId: string;
  private apiVersion: string;
  private baseUrl: string;

  constructor(creds: MetaCredentials) {
    this.accessToken = creds.accessToken.trim();
    this.phoneNumberId = creds.phoneNumberId.trim();
    this.apiVersion = creds.apiVersion?.trim() || "v20.0";
    this.baseUrl = `https://graph.facebook.com/${this.apiVersion}`;
  }

  /**
   * Authoritative Live Connection Test:
   * Calls Meta's Phone Number Node endpoint (GET /v20.0/{phone_number_id})
   * to verify Access Token validity and WABA association without sending a message.
   */
  async testConnection(): Promise<{
    success: boolean;
    displayPhoneNumber?: string;
    verifiedName?: string;
    qualityRating?: string;
    errorCode?: string;
    errorMessageSafe?: string;
  }> {
    if (!this.accessToken || !this.phoneNumberId) {
      return {
        success: false,
        errorCode: "MISSING_CREDENTIALS",
        errorMessageSafe: "WhatsApp Access Token or Phone Number ID is missing.",
      };
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      const url = `${this.baseUrl}/${this.phoneNumberId}?fields=display_phone_number,verified_name,quality_rating,code_verification_status`;
      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = (await res.json()) as {
        display_phone_number?: string;
        verified_name?: string;
        quality_rating?: string;
        error?: { message: string; type: string; code: number; error_subcode?: number };
      };

      if (!res.ok || data.error) {
        const errorMsg = data.error?.message || `Meta API rejected connection (HTTP ${res.status})`;
        const isAuth = res.status === 401 || data.error?.code === 190;
        return {
          success: false,
          errorCode: isAuth ? "INVALID_ACCESS_TOKEN" : `HTTP_${res.status}`,
          errorMessageSafe: errorMsg,
        };
      }

      return {
        success: true,
        displayPhoneNumber: data.display_phone_number,
        verifiedName: data.verified_name,
        qualityRating: data.quality_rating,
      };
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      const isAbort = err instanceof Error && err.name === "AbortError";
      return {
        success: false,
        errorCode: isAbort ? "TIMEOUT" : "NETWORK_ERROR",
        errorMessageSafe: isAbort
          ? "Meta API connection timed out (8s limit)."
          : err instanceof Error
          ? err.message
          : "Network connection failed",
      };
    }
  }

  /**
   * Dispatches a structured WhatsApp template message via Meta Cloud API.
   */
  async sendTemplateMessage(params: MetaSendTemplateParams): Promise<WhatsAppClientResult> {
    if (!this.accessToken || !this.phoneNumberId) {
      return {
        success: false,
        errorCode: "NOT_CONFIGURED",
        errorMessage: "WhatsApp Access Token or Phone Number ID is not configured.",
        isRetryable: false,
      };
    }

    // Build components
    const components: Array<Record<string, unknown>> = [];

    const isHelloWorld = params.templateName.trim().toLowerCase() === "hello_world";

    // 1. Header component (if present and not hello_world)
    if (!isHelloWorld && params.headerParameters && params.headerParameters.length > 0) {
      components.push({
        type: "header",
        parameters: params.headerParameters.map((p) => {
          if (p.type === "text") return { type: "text", text: p.text || "" };
          if (p.type === "image") return { type: "image", image: { link: p.link || "" } };
          if (p.type === "document") return { type: "document", document: { link: p.link || "" } };
          return { type: "text", text: p.text || "" };
        }),
      });
    }

    // 2. Body component (variable parameters, if not hello_world)
    if (!isHelloWorld && params.bodyParameters && params.bodyParameters.length > 0) {
      components.push({
        type: "body",
        parameters: params.bodyParameters.map((paramVal) => ({
          type: "text",
          text: String(paramVal || ""),
        })),
      });
    }

    // 3. Button component (if present and not hello_world)
    if (!isHelloWorld && params.buttonParameters && params.buttonParameters.length > 0) {
      for (const btn of params.buttonParameters) {
        components.push({
          type: "button",
          sub_type: btn.type,
          index: btn.index,
          parameters: [
            btn.type === "url"
              ? { type: "text", text: btn.text || "" }
              : { type: "payload", payload: btn.payload || "" },
          ],
        });
      }
    }

    const payload = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: params.to,
      type: "template",
      template: {
        name: isHelloWorld ? "hello_world" : params.templateName,
        language: {
          code: isHelloWorld ? "en_US" : (params.languageCode || "en"),
        },
        components: components.length > 0 ? components : undefined,
      },
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      const url = `${this.baseUrl}/${this.phoneNumberId}/messages`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = (await res.json()) as MetaApiResponse;

      if (!res.ok || data.error) {
        const errorObj = data.error;
        const code = errorObj?.code || res.status;
        const msg = errorObj?.message || `Meta API request failed with HTTP ${res.status}`;

        // Retryable: Rate limits (429, 80007), Internal errors (500, 503, 131000)
        const isRetryable =
          res.status === 429 ||
          res.status >= 500 ||
          code === 80007 ||
          code === 131000 ||
          code === 130429;

        return {
          success: false,
          errorCode: `META_${code}`,
          errorMessage: msg,
          isRetryable,
          rawSafeResponse: {
            code,
            type: errorObj?.type,
            details: errorObj?.error_data?.details || msg,
            fbtrace_id: errorObj?.fbtrace_id,
          },
        };
      }

      const msgId = data.messages?.[0]?.id || `wa_${Date.now()}`;
      return {
        success: true,
        providerMessageId: msgId,
        isRetryable: false,
        rawSafeResponse: {
          message_id: msgId,
          status: data.messages?.[0]?.message_status || "accepted",
        },
      };
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      const isAbort = err instanceof Error && err.name === "AbortError";
      return {
        success: false,
        errorCode: isAbort ? "TIMEOUT" : "NETWORK_ERROR",
        errorMessage: isAbort
          ? "Meta WhatsApp Cloud API timeout (8s limit)."
          : err instanceof Error
          ? err.message
          : "Network request failed",
        isRetryable: true,
      };
    }
  }
}
