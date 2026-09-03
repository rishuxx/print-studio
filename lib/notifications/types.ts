/**
 * Notification Types & Provider Abstraction Models
 * Project: PreetyPrints (Phase 11F)
 */

export type NotificationChannel = "EMAIL" | "WHATSAPP" | "PUSH" | "IN_APP";

export type NotificationStatus =
  | "PENDING"
  | "SENT"
  | "FAILED_RETRYABLE"
  | "NOT_CONFIGURED"
  | "FAILED_PERMANENT"
  | "DELIVERED"
  | "READ";

export type NotificationEventType =
  | "ORDER_PLACED"
  | "ORDER_CONFIRMED"
  | "PAYMENT_SUCCESS"
  | "PAYMENT_FAILED"
  | "PAYMENT_PENDING"
  | "ARTWORK_SUBMITTED"
  | "ARTWORK_REVIEW_REQUIRED"
  | "ARTWORK_APPROVED"
  | "ARTWORK_REJECTED"
  | "ARTWORK_REVISION_REQUIRED"
  | "ORDER_IN_PRODUCTION"
  | "PRODUCTION_STARTED"
  | "PRODUCTION_COMPLETED"
  | "ORDER_PACKED"
  | "ORDER_READY"
  | "AWB_ASSIGNED"
  | "ORDER_DISPATCHED"
  | "ORDER_SHIPPED"
  | "SHIPMENT_PICKED_UP"
  | "SHIPMENT_IN_TRANSIT"
  | "SHIPMENT_OUT_FOR_DELIVERY"
  | "OUT_FOR_DELIVERY"
  | "SHIPMENT_DELIVERED"
  | "ORDER_DELIVERED"
  | "SHIPMENT_FAILED"
  | "DELIVERY_ATTEMPT_FAILED"
  | "SHIPMENT_RTO"
  | "ORDER_CANCELLED"
  | "REFUND_INITIATED"
  | "REFUND_PROCESSED"
  | "REFUND_COMPLETED"
  | "REFUND_FAILED";

export interface NotificationRecord {
  id: string;
  user_id?: string | null;
  order_id?: string | null;
  event_type: NotificationEventType;
  channel: NotificationChannel;
  recipient: string;
  template_key: string;
  status: NotificationStatus;
  provider: string;
  provider_message_id?: string | null;
  idempotency_key: string;
  attempt_count: number;
  max_attempts: number;
  error_code?: string | null;
  error_message?: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  sent_at: string | null;
  delivered_at: string | null;
  failed_at: string | null;
  read_at?: string | null;
  title?: string | null;
  body?: string | null;
  category?: string | null;
  priority?: "low" | "normal" | "high" | "urgent" | null;
  resource_type?: string | null;
  resource_id?: string | null;
  is_archived?: boolean;
}

export interface CustomerNotificationPreferences {
  user_id: string;
  email_order_updates: boolean;
  whatsapp_order_updates: boolean;
  push_order_updates: boolean;
  updated_at: string;
}

export interface RenderedTemplate {
  subject?: string;
  bodyText: string;
  bodyHtml?: string;
  ctaUrl?: string;
  ctaLabel?: string;
}

export interface NotificationProviderResult {
  success: boolean;
  provider: string;
  providerMessageId?: string;
  status: NotificationStatus;
  errorCode?: string;
  errorMessage?: string;
  isRetryable?: boolean;
}

export interface SendNotificationPayload {
  recipient: string;
  templateKey: string;
  rendered: RenderedTemplate;
  metadata?: Record<string, unknown>;
}

export interface NotificationProvider {
  name: string;
  channel: NotificationChannel;
  isConfigured(): boolean;
  send(payload: SendNotificationPayload): Promise<NotificationProviderResult>;
}

export interface DispatchEventParams {
  eventType: NotificationEventType;
  orderId?: string | null;
  userId?: string | null;
  recipientEmail?: string | null;
  recipientPhone?: string | null;
  recipientName?: string | null;
  orderNumber?: string | null;
  amountMinor?: number | null;
  currency?: string;
  trackingNumber?: string | null;
  trackingUrl?: string | null;
  carrierName?: string | null;
  artworkRejectionReason?: string | null;
  cancellationReason?: string | null;
  metadata?: Record<string, unknown>;
  idempotencyKey?: string;
}
