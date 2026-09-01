/**
 * Server-Side WhatsApp Outbox Worker & Dispatcher
 * Manages idempotent queue insertion, immediate dispatch, and exponential backoff retries.
 */

import { createClient } from "@/lib/supabase/server";
import { WhatsAppOutboxRecord, WhatsAppOutboxStatus } from "./types";
import { getAuthoritativeWhatsAppConfig } from "./queries";
import { MetaWhatsAppClient } from "./client";
import { resolveMetaParameters } from "./variables";

/**
 * Exponential backoff schedule (in minutes):
 * Attempt 1: +1 min
 * Attempt 2: +5 min
 * Attempt 3: +15 min
 * Attempt 4: +30 min
 * Attempt 5: +60 min
 */
const RETRY_DELAYS_MINUTES = [1, 5, 15, 30, 60];

/**
 * Dispatches a single outbox entry by contacting Meta Cloud API.
 * Updates outbox state and mirrors into notifications table.
 */
export async function dispatchOutboxRecord(outboxId: string): Promise<{
  success: boolean;
  status: WhatsAppOutboxStatus;
  providerMessageId?: string;
  error?: string;
}> {
  const supabase = await createClient();

  // 1. Fetch outbox record with joined template
  const { data: record, error: fetchErr } = await supabase
    .from("whatsapp_outbox")
    .select("*, template:whatsapp_templates(*)")
    .eq("id", outboxId)
    .single();

  if (fetchErr || !record) {
    return { success: false, status: "FAILED", error: "Outbox record not found." };
  }

  const outbox = record as unknown as WhatsAppOutboxRecord & {
    template: {
      meta_template_name: string;
      language_code: string;
      variable_schema: Array<{ pos: number; var: string }>;
      is_enabled: boolean;
    } | null;
  };

  // 2. Load Configuration & Meta Client
  const { config, decryptedToken } = await getAuthoritativeWhatsAppConfig();

  // For production non-test messages, skip if integration is disabled
  if (!config.is_enabled && !outbox.is_test) {
    await supabase
      .from("whatsapp_outbox")
      .update({
        status: "SKIPPED",
        error_code: "INTEGRATION_DISABLED",
        error_message_safe: "WhatsApp integration is currently disabled in settings.",
      })
      .eq("id", outbox.id);

    return { success: false, status: "SKIPPED", error: "WhatsApp integration is disabled in settings." };
  }

  if (!decryptedToken || !config.phone_number_id) {
    await supabase
      .from("whatsapp_outbox")
      .update({
        status: "FAILED",
        error_code: "MISSING_CREDENTIALS",
        error_message_safe: "WhatsApp Access Token or Phone Number ID is not configured. Go to Overview & Credentials tab to enter your Meta credentials.",
      })
      .eq("id", outbox.id);

    return {
      success: false,
      status: "FAILED",
      error: "WhatsApp API credentials are not configured yet. Please enter Access Token & Phone Number ID in Overview & Credentials.",
    };
  }

  if (!outbox.template || !outbox.template.is_enabled) {
    await supabase
      .from("whatsapp_outbox")
      .update({
        status: "SKIPPED",
        error_code: "TEMPLATE_DISABLED",
        error_message_safe: "Assigned WhatsApp template is disabled or not found.",
      })
      .eq("id", outbox.id);

    return { success: false, status: "SKIPPED", error: "Assigned template is disabled or missing." };
  }

  // 3. Mark outbox record as PROCESSING
  const nextAttemptCount = (outbox.attempts || 0) + 1;
  await supabase
    .from("whatsapp_outbox")
    .update({
      status: "PROCESSING",
      attempts: nextAttemptCount,
      last_attempt_at: new Date().toISOString(),
    })
    .eq("id", outbox.id);

  // 4. Resolve Parameters for Meta API
  const bodyParams = resolveMetaParameters(
    outbox.template.variable_schema,
    outbox.payload as Record<string, unknown>
  );

  const client = new MetaWhatsAppClient({
    accessToken: decryptedToken,
    phoneNumberId: config.phone_number_id,
    businessAccountId: config.business_account_id,
    apiVersion: config.api_version,
  });

  // 5. Send via Meta Client
  const result = await client.sendTemplateMessage({
    to: outbox.recipient_phone.replace(/\D/g, ""),
    templateName: outbox.template.meta_template_name,
    languageCode: outbox.template.language_code || "en",
    bodyParameters: bodyParams,
  });

  const nowIso = new Date().toISOString();

  if (result.success) {
    // 6A. Success: Mark SENT
    await supabase
      .from("whatsapp_outbox")
      .update({
        status: "SENT",
        provider_message_id: result.providerMessageId || null,
        provider_response_safe: result.rawSafeResponse || null,
        sent_at: nowIso,
        error_code: null,
        error_message_safe: null,
      })
      .eq("id", outbox.id);

    // Update singleton last tested / connection status
    await supabase
      .from("whatsapp_config")
      .update({
        last_connection_status: "CONNECTED",
        last_tested_at: nowIso,
        last_error_safe: null,
      })
      .eq("id", config.id);

    return {
      success: true,
      status: "SENT",
      providerMessageId: result.providerMessageId,
    };
  } else {
    // 6B. Failure: Check if retryable
    const isRetryable = result.isRetryable && nextAttemptCount < (outbox.max_attempts || 5);
    const delayMinutes = RETRY_DELAYS_MINUTES[Math.min(nextAttemptCount - 1, RETRY_DELAYS_MINUTES.length - 1)];
    const nextAttemptAt = isRetryable
      ? new Date(Date.now() + delayMinutes * 60 * 1000).toISOString()
      : null;

    const finalStatus: WhatsAppOutboxStatus = isRetryable ? "QUEUED" : "FAILED";

    await supabase
      .from("whatsapp_outbox")
      .update({
        status: finalStatus,
        next_attempt_at: nextAttemptAt,
        error_code: result.errorCode || "META_API_ERROR",
        error_message_safe: result.errorMessage || "Dispatch failed",
        provider_response_safe: result.rawSafeResponse || null,
        failed_at: isRetryable ? null : nowIso,
      })
      .eq("id", outbox.id);

    return {
      success: false,
      status: finalStatus,
      error: result.errorMessage || "Meta API rejected message.",
    };
  }
}

/**
 * Worker runner: Processes all queued outbox records whose next_attempt_at <= now()
 */
export async function processPendingWhatsAppOutbox(limit = 20): Promise<{
  processedCount: number;
  successCount: number;
  failedCount: number;
}> {
  const supabase = await createClient();
  const nowIso = new Date().toISOString();

  const { data: pending } = await supabase
    .from("whatsapp_outbox")
    .select("id")
    .in("status", ["QUEUED"])
    .or(`next_attempt_at.is.null,next_attempt_at.lte.${nowIso}`)
    .order("created_at", { ascending: true })
    .limit(limit);

  if (!pending || pending.length === 0) {
    return { processedCount: 0, successCount: 0, failedCount: 0 };
  }

  let successCount = 0;
  let failedCount = 0;

  for (const item of pending) {
    const res = await dispatchOutboxRecord(item.id);
    if (res.success) {
      successCount++;
    } else {
      failedCount++;
    }
  }

  return {
    processedCount: pending.length,
    successCount,
    failedCount,
  };
}
