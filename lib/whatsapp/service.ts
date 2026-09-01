/**
 * Central WhatsApp Orchestration Service
 * Connects business lifecycle events to trigger checks, phone normalization,
 * template resolution, idempotency checks, outbox creation, and immediate delivery.
 */

import { createClient } from "@/lib/supabase/server";
import { normalizeWhatsAppPhone } from "./phone";
import { WhatsAppVariableContext } from "./variables";
import { dispatchOutboxRecord } from "./dispatcher";
import { getAuthoritativeWhatsAppConfig } from "./queries";

export interface CreateWhatsAppEventParams {
  eventType: string;
  orderId?: string | null;
  customerId?: string | null;
  recipientPhone: string;
  recipientName?: string | null;
  context: WhatsAppVariableContext;
  customIdempotencyKey?: string;
  isTest?: boolean;
}

export class WhatsAppService {
  /**
   * Main entry point to enqueue and dispatch a WhatsApp transactional notification.
   * Completely isolated: Errors never throw or interrupt core checkout/payment flows.
   */
  static async emitEvent(params: CreateWhatsAppEventParams): Promise<{
    success: boolean;
    outboxId?: string;
    status: string;
    skippedReason?: string;
  }> {
    try {
      const supabase = await createClient();

      // 1. Phone number normalization (E.164)
      const normalizedPhone = normalizeWhatsAppPhone(params.recipientPhone);
      if (!normalizedPhone.isValid) {
        console.warn(`[WhatsAppService] Invalid phone number rejection: '${params.recipientPhone}' -> ${normalizedPhone.error}`);
        return {
          success: false,
          status: "FAILED_INVALID_PHONE",
          skippedReason: normalizedPhone.error || "Invalid phone number format",
        };
      }

      // 2. Customer communication preferences check (if registered customer)
      if (params.customerId && !params.isTest) {
        const { data: pref } = await supabase
          .from("customer_notification_preferences")
          .select("whatsapp_order_updates")
          .eq("user_id", params.customerId)
          .maybeSingle();

        if (pref && pref.whatsapp_order_updates === false) {
          return {
            success: false,
            status: "SKIPPED_PREFERENCE_DISABLED",
            skippedReason: "Customer opted out of WhatsApp transactional notifications.",
          };
        }
      }

      // 3. Trigger / Automation Configuration Check
      const { data: trigger } = await supabase
        .from("whatsapp_triggers")
        .select("*, template:whatsapp_templates(*)")
        .eq("event_type", params.eventType)
        .maybeSingle();

      if (!trigger) {
        return {
          success: false,
          status: "SKIPPED_NO_TRIGGER",
          skippedReason: `No WhatsApp trigger configured for event '${params.eventType}'.`,
        };
      }

      if (!trigger.is_enabled) {
        return {
          success: false,
          status: "SKIPPED_TRIGGER_DISABLED",
          skippedReason: `Trigger for '${params.eventType}' is disabled in Admin Panel.`,
        };
      }

      if (!trigger.template || !trigger.template.is_enabled) {
        return {
          success: false,
          status: "SKIPPED_TEMPLATE_DISABLED",
          skippedReason: `Template assigned to '${params.eventType}' is disabled or unassigned.`,
        };
      }

      // 4. Deterministic Idempotency Key
      const orderKey = params.orderId || "gen";
      const idempotencyKey =
        params.customIdempotencyKey ||
        `wa:${orderKey}:evt:${params.eventType}:tpl:${trigger.template.id}`;

      // Check existing in outbox
      const { data: existing } = await supabase
        .from("whatsapp_outbox")
        .select("id, status")
        .eq("idempotency_key", idempotencyKey)
        .maybeSingle();

      if (existing) {
        return {
          success: existing.status === "SENT" || existing.status === "DELIVERED" || existing.status === "READ",
          outboxId: existing.id,
          status: existing.status,
          skippedReason: "Idempotent duplicate event already recorded.",
        };
      }

      // 5. Insert Outbox Record
      const { data: outboxRecord, error: insertErr } = await supabase
        .from("whatsapp_outbox")
        .insert({
          event_type: params.eventType,
          customer_id: params.customerId || null,
          order_id: params.orderId || null,
          template_id: trigger.template.id,
          recipient_phone: normalizedPhone.e164,
          recipient_name: params.recipientName || params.context.customerName || "Customer",
          payload: params.context as Record<string, unknown>,
          status: "QUEUED",
          attempts: 0,
          max_attempts: trigger.max_retries || 3,
          idempotency_key: idempotencyKey,
          is_test: params.isTest ?? false,
        })
        .select("id")
        .single();

      if (insertErr || !outboxRecord) {
        console.error("[WhatsAppService outbox insert error]:", insertErr);
        return {
          success: false,
          status: "FAILED_INSERT",
          skippedReason: insertErr?.message || "Outbox record creation failed",
        };
      }

      // 6. Check global enabled flag & credentials before calling API
      const { config, decryptedToken } = await getAuthoritativeWhatsAppConfig();

      if (!config.is_enabled && !params.isTest) {
        await supabase
          .from("whatsapp_outbox")
          .update({
            status: "SKIPPED",
            error_code: "INTEGRATION_DISABLED",
            error_message_safe: "WhatsApp integration is currently disabled in Admin settings.",
          })
          .eq("id", outboxRecord.id);

        return {
          success: false,
          outboxId: outboxRecord.id,
          status: "SKIPPED",
          skippedReason: "WhatsApp integration is disabled in Admin settings. Turn it ON in Overview & Credentials.",
        };
      }

      if (!decryptedToken || !config.phone_number_id) {
        await supabase
          .from("whatsapp_outbox")
          .update({
            status: "FAILED",
            error_code: "MISSING_CREDENTIALS",
            error_message_safe: "WhatsApp Access Token or Phone Number ID is missing. Configure Meta credentials in Overview & Credentials.",
          })
          .eq("id", outboxRecord.id);

        return {
          success: false,
          outboxId: outboxRecord.id,
          status: "FAILED",
          skippedReason: "WhatsApp API credentials are not configured yet. Please enter Access Token & Phone Number ID in Overview & Credentials.",
        };
      }

      // 7. Immediate Outbox Dispatch (Server-side)
      const dispatchRes = await dispatchOutboxRecord(outboxRecord.id);

      return {
        success: dispatchRes.success,
        outboxId: outboxRecord.id,
        status: dispatchRes.status,
        skippedReason: dispatchRes.error,
      };
    } catch (err) {
      console.error("[WhatsAppService.emitEvent isolated error]:", err);
      return {
        success: false,
        status: "EXCEPTION",
        skippedReason: err instanceof Error ? err.message : "Internal service exception",
      };
    }
  }
}
