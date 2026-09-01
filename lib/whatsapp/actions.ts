"use server";

import { createClient } from "@/lib/supabase/server";
import { requirePermission } from "@/lib/auth/server-permissions";
import { revalidatePath } from "next/cache";
import { encryptSecret, maskToken } from "./encryption";
import { MetaWhatsAppClient } from "./client";
import { getAuthoritativeWhatsAppConfig } from "./queries";
import { normalizeWhatsAppPhone } from "./phone";
import { dispatchOutboxRecord } from "./dispatcher";
import { WhatsAppService } from "./service";

/**
 * Updates WhatsApp credentials & global settings.
 * Securely encrypts access token if provided.
 */
export async function saveWhatsAppConfigAction(input: {
  isEnabled: boolean;
  phoneNumberId?: string | null;
  businessAccountId?: string | null;
  apiVersion?: string;
  newAccessToken?: string | null; // Plaintext token entered by admin
  defaultCountryCode?: string;
  webhookVerifyToken?: string | null;
}): Promise<{ success: boolean; error?: string; tokenMasked?: string }> {
  try {
    const { user } = await requirePermission("settings.view", "/admin/whatsapp");
    const supabase = await createClient();

    const { config, decryptedToken } = await getAuthoritativeWhatsAppConfig();

    const updatePayload: Record<string, unknown> = {
      is_enabled: input.isEnabled,
      phone_number_id: input.phoneNumberId?.trim() || null,
      business_account_id: input.businessAccountId?.trim() || null,
      api_version: input.apiVersion?.trim() || "v20.0",
      default_country_code: input.defaultCountryCode?.trim() || "91",
      webhook_verify_token: input.webhookVerifyToken?.trim() || null,
      version: (config.version || 1) + 1,
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    };

    let effectiveToken = decryptedToken;

    if (input.newAccessToken && input.newAccessToken.trim().length > 0) {
      const cleanToken = input.newAccessToken.trim();
      const encrypted = encryptSecret(cleanToken);
      updatePayload.encrypted_access_token = encrypted;
      updatePayload.token_masked = maskToken(cleanToken);
      effectiveToken = cleanToken;
    }

    if (config.id && config.id !== "singleton") {
      await supabase
        .from("whatsapp_config")
        .update(updatePayload)
        .eq("id", config.id);
    } else {
      await supabase.from("whatsapp_config").insert(updatePayload);
    }

    // Audit Log Entry
    await supabase.from("admin_audit_logs").insert({
      actor_id: user.id,
      action: "WHATSAPP_CONFIG_UPDATED",
      details: {
        is_enabled: input.isEnabled,
        phone_number_id: input.phoneNumberId,
        token_updated: Boolean(input.newAccessToken && input.newAccessToken.trim().length > 0),
      },
    });

    revalidatePath("/admin/whatsapp");

    return {
      success: true,
      tokenMasked: maskToken(effectiveToken),
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to save WhatsApp configuration",
    };
  }
}

/**
 * Tests live connectivity against Meta's Graph API using configured credentials.
 */
export async function testWhatsAppConnectionAction(): Promise<{
  success: boolean;
  status: string;
  displayPhoneNumber?: string;
  verifiedName?: string;
  qualityRating?: string;
  error?: string;
}> {
  try {
    await requirePermission("settings.view", "/admin/whatsapp");
    const supabase = await createClient();

    const { config, decryptedToken } = await getAuthoritativeWhatsAppConfig();

    if (!decryptedToken || !config.phone_number_id) {
      return {
        success: false,
        status: "NOT_CONFIGURED",
        error: "WhatsApp Access Token or Phone Number ID is missing. Please save valid credentials first.",
      };
    }

    const client = new MetaWhatsAppClient({
      accessToken: decryptedToken,
      phoneNumberId: config.phone_number_id,
      businessAccountId: config.business_account_id,
      apiVersion: config.api_version,
    });

    const result = await client.testConnection();

    const nowIso = new Date().toISOString();
    const finalStatus = result.success ? "CONNECTED" : "INVALID_CREDENTIALS";

    // Persist tested health state
    await supabase
      .from("whatsapp_config")
      .update({
        last_connection_status: finalStatus,
        last_tested_at: nowIso,
        last_error_safe: result.errorMessageSafe || null,
      })
      .eq("id", config.id);

    revalidatePath("/admin/whatsapp");

    return {
      success: result.success,
      status: finalStatus,
      displayPhoneNumber: result.displayPhoneNumber,
      verifiedName: result.verifiedName,
      qualityRating: result.qualityRating,
      error: result.errorMessageSafe,
    };
  } catch (err: unknown) {
    return {
      success: false,
      status: "ERROR",
      error: err instanceof Error ? err.message : "Connection test failed",
    };
  }
}

/**
 * Sends a real Meta template message to a designated test recipient.
 * Logged with is_test = true.
 */
export async function sendWhatsAppTestAction(input: {
  templateKey: string;
  recipientPhone: string;
  testVariables?: Record<string, string>;
}): Promise<{
  success: boolean;
  outboxId?: string;
  providerMessageId?: string;
  error?: string;
}> {
  try {
    const { user } = await requirePermission("settings.view", "/admin/whatsapp");
    const supabase = await createClient();

    const normalized = normalizeWhatsAppPhone(input.recipientPhone);
    if (!normalized.isValid) {
      return { success: false, error: normalized.error || "Invalid phone number." };
    }

    const { data: template } = await supabase
      .from("whatsapp_templates")
      .select("*")
      .eq("key", input.templateKey)
      .single();

    if (!template) {
      return { success: false, error: `Template '${input.templateKey}' not found.` };
    }

    // Default test context
    const testContext = {
      customerName: input.testVariables?.CUSTOMER_NAME || "Test Admin",
      orderNumber: input.testVariables?.ORDER_NUMBER || "TEST-8841",
      orderTotal: input.testVariables?.ORDER_TOTAL || "1,499.00",
      paymentAmount: input.testVariables?.PAYMENT_AMOUNT || "1,499.00",
      trackingNumber: input.testVariables?.AWB_NUMBER || "DLH9928172645",
      carrierName: input.testVariables?.CARRIER_NAME || "Delhivery Express",
      artworkReviewUrl: input.testVariables?.ARTWORK_REVIEW_URL || "https://preetyprints.com/orders/test",
      orderTrackingUrl: input.testVariables?.ORDER_TRACKING_URL || "https://preetyprints.com/orders/test",
      refundAmount: input.testVariables?.REFUND_AMOUNT || "1,499.00",
      refundId: input.testVariables?.REFUND_ID || "rfnd_test_99281",
      ...input.testVariables,
    };

    const res = await WhatsAppService.emitEvent({
      eventType: template.key,
      recipientPhone: normalized.e164,
      recipientName: "Test Admin",
      context: testContext,
      customIdempotencyKey: `test_msg_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      isTest: true,
    });

    // Record in admin audit logs
    await supabase.from("admin_audit_logs").insert({
      actor_id: user.id,
      action: "WHATSAPP_TEST_MESSAGE_SENT",
      details: {
        template_key: input.templateKey,
        recipient_masked: normalized.e164.slice(0, 5) + "••••" + normalized.e164.slice(-3),
        result_status: res.status,
      },
    });

    revalidatePath("/admin/whatsapp");

    return {
      success: res.success,
      outboxId: res.outboxId,
      error: res.skippedReason,
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to dispatch test message",
    };
  }
}

/**
 * Updates a template definition (Meta template name, language, active state, variable mappings)
 */
export async function updateWhatsAppTemplateAction(input: {
  id: string;
  metaTemplateName: string;
  languageCode: string;
  status: "DRAFT" | "ACTIVE" | "DISABLED" | "PENDING" | "APPROVED" | "REJECTED";
  isEnabled: boolean;
  bodyText: string;
  variableSchema: Array<{ pos: number; var: string }>;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const { user } = await requirePermission("settings.view", "/admin/whatsapp");
    const supabase = await createClient();

    const { error } = await supabase
      .from("whatsapp_templates")
      .update({
        meta_template_name: input.metaTemplateName.trim(),
        language_code: input.languageCode.trim(),
        status: input.status,
        is_enabled: input.isEnabled,
        body_text: input.bodyText,
        variable_schema: input.variableSchema,
        updated_at: new Date().toISOString(),
      })
      .eq("id", input.id);

    if (error) {
      return { success: false, error: error.message };
    }

    await supabase.from("admin_audit_logs").insert({
      actor_id: user.id,
      action: "WHATSAPP_TEMPLATE_UPDATED",
      details: { template_id: input.id, meta_template_name: input.metaTemplateName },
    });

    revalidatePath("/admin/whatsapp");
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update template",
    };
  }
}

/**
 * Updates a trigger/automation mapping (toggle enabled, assigned template, max retries)
 */
export async function updateWhatsAppTriggerAction(input: {
  id: string;
  isEnabled: boolean;
  templateId?: string | null;
  maxRetries?: number;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const { user } = await requirePermission("settings.view", "/admin/whatsapp");
    const supabase = await createClient();

    const { error } = await supabase
      .from("whatsapp_triggers")
      .update({
        is_enabled: input.isEnabled,
        template_id: input.templateId || null,
        max_retries: input.maxRetries || 3,
        updated_at: new Date().toISOString(),
      })
      .eq("id", input.id);

    if (error) {
      return { success: false, error: error.message };
    }

    await supabase.from("admin_audit_logs").insert({
      actor_id: user.id,
      action: "WHATSAPP_TRIGGER_UPDATED",
      details: { trigger_id: input.id, is_enabled: input.isEnabled },
    });

    revalidatePath("/admin/whatsapp");
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update trigger",
    };
  }
}

/**
 * Manually retries a failed outbox message.
 */
export async function retryWhatsAppOutboxMessageAction(outboxId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const { user } = await requirePermission("settings.view", "/admin/whatsapp");
    const supabase = await createClient();

    // Reset attempt count and invoke dispatcher
    const res = await dispatchOutboxRecord(outboxId);

    await supabase.from("admin_audit_logs").insert({
      actor_id: user.id,
      action: "WHATSAPP_OUTBOX_MANUAL_RETRY",
      details: { outbox_id: outboxId, result_status: res.status },
    });

    revalidatePath("/admin/whatsapp");
    return { success: res.success, error: res.error };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to retry message",
    };
  }
}

/**
 * Forces a manual resend of a notification (creates new outbox entry with explicit RESEND tag).
 */
export async function resendWhatsAppOutboxMessageAction(outboxId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const { user } = await requirePermission("settings.view", "/admin/whatsapp");
    const supabase = await createClient();

    const { data: orig } = await supabase
      .from("whatsapp_outbox")
      .select("*")
      .eq("id", outboxId)
      .single();

    if (!orig) {
      return { success: false, error: "Original notification record not found." };
    }

    const newIdempotencyKey = `${orig.idempotencyKey}:resend:${Date.now()}`;

    const res = await WhatsAppService.emitEvent({
      eventType: orig.event_type,
      orderId: orig.order_id,
      customerId: orig.customer_id,
      recipientPhone: orig.recipient_phone,
      recipientName: orig.recipient_name,
      context: orig.payload as Record<string, unknown>,
      customIdempotencyKey: newIdempotencyKey,
      isTest: orig.is_test,
    });

    await supabase.from("admin_audit_logs").insert({
      actor_id: user.id,
      action: "WHATSAPP_MANUAL_RESEND",
      details: { original_outbox_id: outboxId, new_outbox_id: res.outboxId },
    });

    revalidatePath("/admin/whatsapp");
    return { success: res.success, error: res.skippedReason };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to resend notification",
    };
  }
}
