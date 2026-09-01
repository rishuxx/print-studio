/**
 * Central WhatsApp Subsystem Queries & Loaders
 * Server-only execution. Respects RBAC and masks sensitive tokens.
 */

import { createClient } from "@/lib/supabase/server";
import {
  WhatsAppConfigRecord,
  WhatsAppTemplateRecord,
  WhatsAppTriggerRecord,
  WhatsAppOutboxRecord,
  WhatsAppMetricsSummary,
} from "./types";
import { decryptSecret, maskToken } from "./encryption";
import { MetaWhatsAppClient } from "./client";

/**
 * Loads singleton WhatsApp config with decrypted secrets for internal server execution.
 */
export async function getAuthoritativeWhatsAppConfig(): Promise<{
  config: WhatsAppConfigRecord;
  decryptedToken: string | null;
}> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("whatsapp_config")
    .select("*")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (!data) {
    const fallback: WhatsAppConfigRecord = {
      id: "singleton",
      is_enabled: false,
      phone_number_id: null,
      business_account_id: null,
      api_version: "v20.0",
      token_masked: null,
      default_country_code: "91",
      webhook_verify_token: null,
      last_connection_status: "NOT_CONFIGURED",
      last_tested_at: null,
      last_error_safe: null,
      version: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    return { config: fallback, decryptedToken: null };
  }

  // Decrypt token if present
  let decryptedToken: string | null = null;
  if (data.encrypted_access_token) {
    decryptedToken = decryptSecret(data.encrypted_access_token);
  }

  // Fallback to environment variables if not configured in database
  if (!decryptedToken && process.env.WHATSAPP_ACCESS_TOKEN) {
    decryptedToken = process.env.WHATSAPP_ACCESS_TOKEN;
  }

  const effectivePhoneId = data.phone_number_id || process.env.WHATSAPP_PHONE_NUMBER_ID || null;
  const effectiveWabaId = data.business_account_id || process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || null;

  const safeRecord: WhatsAppConfigRecord = {
    id: data.id,
    is_enabled: data.is_enabled ?? (process.env.WHATSAPP_ENABLED === "true"),
    phone_number_id: effectivePhoneId,
    business_account_id: effectiveWabaId,
    api_version: data.api_version || process.env.WHATSAPP_API_VERSION || "v20.0",
    token_masked: maskToken(decryptedToken),
    default_country_code: data.default_country_code || "91",
    webhook_verify_token: data.webhook_verify_token || null,
    last_connection_status: data.last_connection_status || "NOT_CONFIGURED",
    last_tested_at: data.last_tested_at || null,
    last_error_safe: data.last_error_safe || null,
    version: data.version || 1,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };

  return { config: safeRecord, decryptedToken };
}

/**
 * Returns instantiated Meta client if credentials are configured
 */
export async function getWhatsAppClient(): Promise<MetaWhatsAppClient | null> {
  const { config, decryptedToken } = await getAuthoritativeWhatsAppConfig();

  if (!config.is_enabled || !decryptedToken || !config.phone_number_id) {
    return null;
  }

  return new MetaWhatsAppClient({
    accessToken: decryptedToken,
    phoneNumberId: config.phone_number_id,
    businessAccountId: config.business_account_id,
    apiVersion: config.api_version,
  });
}

/**
 * Fetches all templates configured in database
 */
export async function getWhatsAppTemplates(): Promise<WhatsAppTemplateRecord[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("whatsapp_templates")
    .select("*")
    .order("name", { ascending: true });

  return (data || []) as WhatsAppTemplateRecord[];
}

/**
 * Fetches all triggers with joined template info
 */
export async function getWhatsAppTriggers(): Promise<WhatsAppTriggerRecord[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("whatsapp_triggers")
    .select("*, template:whatsapp_templates(*)")
    .order("priority", { ascending: true });

  return (data || []) as WhatsAppTriggerRecord[];
}

/**
 * Fetches paginated, filterable WhatsApp outbox logs
 */
export async function getWhatsAppOutboxLogs(params?: {
  status?: string;
  eventType?: string;
  searchQuery?: string;
  isTest?: boolean;
  limit?: number;
  offset?: number;
}): Promise<{ logs: WhatsAppOutboxRecord[]; totalCount: number }> {
  const supabase = await createClient();
  const limit = params?.limit || 50;
  const offset = params?.offset || 0;

  let query = supabase.from("whatsapp_outbox").select("*", { count: "exact" });

  if (params?.status && params.status !== "ALL") {
    query = query.eq("status", params.status);
  }

  if (params?.eventType && params.eventType !== "ALL") {
    query = query.eq("event_type", params.eventType);
  }

  if (typeof params?.isTest === "boolean") {
    query = query.eq("is_test", params.isTest);
  }

  if (params?.searchQuery && params.searchQuery.trim()) {
    const q = params.searchQuery.trim();
    query = query.or(`recipient_phone.ilike.%${q}%,provider_message_id.ilike.%${q}%,idempotency_key.ilike.%${q}%`);
  }

  const { data, count } = await query
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  return {
    logs: (data || []) as WhatsAppOutboxRecord[],
    totalCount: count || 0,
  };
}

/**
 * Computes live operational metrics from outbox table
 */
export async function getWhatsAppMetrics(): Promise<WhatsAppMetricsSummary> {
  const supabase = await createClient();

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

  // Queries for status counts
  const { data: allStats } = await supabase
    .from("whatsapp_outbox")
    .select("status, created_at");

  if (!allStats || allStats.length === 0) {
    return {
      totalSent: 0,
      totalFailed: 0,
      totalQueued: 0,
      totalSkipped: 0,
      messagesToday: 0,
      messagesThisWeek: 0,
      successRatePercent: 100,
    };
  }

  let totalSent = 0;
  let totalFailed = 0;
  let totalQueued = 0;
  let totalSkipped = 0;
  let messagesToday = 0;
  let messagesThisWeek = 0;

  for (const item of allStats) {
    if (item.status === "SENT" || item.status === "DELIVERED" || item.status === "READ") {
      totalSent++;
    } else if (item.status === "FAILED") {
      totalFailed++;
    } else if (item.status === "QUEUED" || item.status === "PROCESSING") {
      totalQueued++;
    } else if (item.status === "SKIPPED") {
      totalSkipped++;
    }

    if (item.created_at >= startOfDay) {
      messagesToday++;
    }
    if (item.created_at >= sevenDaysAgo) {
      messagesThisWeek++;
    }
  }

  const totalAttempted = totalSent + totalFailed;
  const successRatePercent = totalAttempted > 0 ? Math.round((totalSent / totalAttempted) * 100) : 100;

  return {
    totalSent,
    totalFailed,
    totalQueued,
    totalSkipped,
    messagesToday,
    messagesThisWeek,
    successRatePercent,
  };
}
