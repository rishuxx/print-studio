/**
 * Production WhatsApp Business Platform Type Definitions
 * Meta Cloud API Models, Outbox, Template & Trigger Interfaces
 */

export type WhatsAppCategory = "TRANSACTIONAL" | "MARKETING";

export type WhatsAppTemplateStatus =
  | "DRAFT"
  | "ACTIVE"
  | "DISABLED"
  | "PENDING"
  | "APPROVED"
  | "REJECTED";

export type WhatsAppConnectionStatus =
  | "CONNECTED"
  | "NOT_CONFIGURED"
  | "INVALID_CREDENTIALS"
  | "DISABLED"
  | "ERROR";

export type WhatsAppOutboxStatus =
  | "QUEUED"
  | "PROCESSING"
  | "SENT"
  | "DELIVERED"
  | "READ"
  | "FAILED"
  | "SKIPPED";

export interface WhatsAppConfigRecord {
  id: string;
  is_enabled: boolean;
  phone_number_id: string | null;
  business_account_id: string | null;
  api_version: string;
  token_masked: string | null;
  default_country_code: string;
  webhook_verify_token: string | null;
  last_connection_status: WhatsAppConnectionStatus;
  last_tested_at: string | null;
  last_error_safe: string | null;
  version: number;
  updated_by?: string | null;
  created_at: string;
  updated_at: string;
}

export interface WhatsAppTemplateVariableMapping {
  pos: number;
  var: string; // e.g. "CUSTOMER_NAME", "ORDER_NUMBER"
}

export interface WhatsAppTemplateRecord {
  id: string;
  key: string; // e.g. "ORDER_CONFIRMED"
  name: string;
  meta_template_name: string;
  language_code: string;
  category: WhatsAppCategory;
  description: string | null;
  status: WhatsAppTemplateStatus;
  is_enabled: boolean;
  header_type: "NONE" | "TEXT" | "IMAGE" | "DOCUMENT" | "VIDEO";
  header_text: string | null;
  body_text: string;
  footer_text: string | null;
  buttons_json: Array<{
    type: "QUICK_REPLY" | "URL" | "PHONE_NUMBER";
    text: string;
    url?: string;
    phone_number?: string;
  }>;
  variable_schema: WhatsAppTemplateVariableMapping[];
  created_at: string;
  updated_at: string;
}

export interface WhatsAppTriggerRecord {
  id: string;
  event_type: string;
  template_id: string | null;
  is_enabled: boolean;
  category: WhatsAppCategory;
  description: string | null;
  priority: number;
  max_retries: number;
  template?: WhatsAppTemplateRecord | null;
  created_at: string;
  updated_at: string;
}

export interface WhatsAppOutboxRecord {
  id: string;
  event_type: string;
  customer_id?: string | null;
  order_id?: string | null;
  template_id?: string | null;
  recipient_phone: string;
  recipient_name?: string | null;
  payload: Record<string, unknown>;
  status: WhatsAppOutboxStatus;
  attempts: number;
  max_attempts: number;
  next_attempt_at?: string | null;
  provider_message_id?: string | null;
  provider_response_safe?: Record<string, unknown> | null;
  error_code?: string | null;
  error_message_safe?: string | null;
  idempotency_key: string;
  is_test: boolean;
  created_at: string;
  sent_at?: string | null;
  delivered_at?: string | null;
  failed_at?: string | null;
  last_attempt_at?: string | null;
}

export interface MetaSendTemplateParams {
  to: string; // E.164 phone without + sign e.g. "916388693472"
  templateName: string;
  languageCode: string;
  bodyParameters: string[];
  headerParameters?: Array<{ type: "text" | "image" | "document"; text?: string; link?: string }>;
  buttonParameters?: Array<{ type: "url" | "quick_reply"; index: string; text?: string; payload?: string }>;
}

export interface MetaApiResponse {
  messaging_product?: string;
  contacts?: Array<{ input: string; wa_id: string }>;
  messages?: Array<{ id: string; message_status?: string }>;
  error?: {
    message: string;
    type: string;
    code: number;
    error_subcode?: number;
    error_data?: { details: string };
    fbtrace_id?: string;
  };
}

export interface WhatsAppClientResult {
  success: boolean;
  providerMessageId?: string;
  errorCode?: string;
  errorMessage?: string;
  isRetryable: boolean;
  rawSafeResponse?: Record<string, unknown>;
}

export interface WhatsAppMetricsSummary {
  totalSent: number;
  totalFailed: number;
  totalQueued: number;
  totalSkipped: number;
  messagesToday: number;
  messagesThisWeek: number;
  successRatePercent: number;
}
