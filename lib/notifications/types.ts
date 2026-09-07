/**
 * Notification Types & Provider Abstraction Models
 * Project: PreetyPrints (Phase 14 Production Upgrade)
 */

export type NotificationChannel = "EMAIL" | "WHATSAPP" | "PUSH" | "IN_APP";

export type NotificationStatus =
  | "PENDING"
  | "SENT"
  | "FAILED_RETRYABLE"
  | "NOT_CONFIGURED"
  | "FAILED_PERMANENT"
  | "DELIVERED"
  | "READ"
  | "DRAFT"
  | "SCHEDULED"
  | "PUBLISHED"
  | "CANCELLED"
  | "EXPIRED";

export type NotificationPriority = "low" | "normal" | "high" | "critical";
export type NotificationSeverity = "info" | "success" | "warning" | "error";
export type NotificationTargetType = "INDIVIDUAL" | "MULTIPLE" | "ALL" | "SEGMENT";
export type NotificationCategory = "order" | "shipping" | "payment" | "product" | "marketing" | "system" | "account" | "admin";

export type NotificationEventType =
  // User Lifecycle
  | "USER_WELCOME"
  | "ACCOUNT_CREATED"
  | "PROFILE_COMPLETED"
  | "FIRST_ORDER_OFFER"
  | "SECURITY_ALERT"
  // Order Lifecycle
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
  | "REFUND_FAILED"
  // Product Updates
  | "NEW_PRODUCT_LAUNCH"
  | "PRODUCT_BACK_IN_STOCK"
  | "PRODUCT_PRICE_DROP"
  | "PRODUCT_UPDATE"
  // Marketing & Campaigns
  | "SALE_ANNOUNCEMENT"
  | "FESTIVAL_CAMPAIGN"
  | "LIMITED_TIME_OFFER"
  | "PROMOTIONAL_COUPON"
  | "BULK_ORDER_PROMOTION"
  // System Updates
  | "SYSTEM_ANNOUNCEMENT"
  | "MAINTENANCE_NOTICE"
  | "POLICY_UPDATE"
  // Admin Operations
  | "ADMIN_NEW_ORDER"
  | "ADMIN_PAYMENT_ALERT"
  | "ADMIN_LOW_INVENTORY"
  | "ADMIN_QUOTE_REQUEST"
  | "ADMIN_SYSTEM_WARNING";

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
  category?: NotificationCategory | string | null;
  priority?: NotificationPriority | null;
  severity?: NotificationSeverity | null;
  resource_type?: string | null;
  resource_id?: string | null;
  action_url?: string | null;
  action_label?: string | null;
  image_url?: string | null;
  icon?: string | null;
  target_type?: NotificationTargetType | null;
  target_segment?: string | null;
  scheduled_at?: string | null;
  published_at?: string | null;
  expires_at?: string | null;
  created_by?: string | null;
  is_dismissible?: boolean;
  is_archived?: boolean;
}

export interface UserNotificationRecord {
  id: string;
  notification_id: string;
  user_id: string;
  read_at: string | null;
  delivered_at: string | null;
  dismissed_at: string | null;
  created_at: string;
  notification?: NotificationRecord;
}

export interface CustomerNotificationPreferences {
  user_id: string;
  email_order_updates: boolean;
  whatsapp_order_updates: boolean;
  push_order_updates: boolean;
  in_app_order_updates: boolean;
  in_app_promotional_updates: boolean;
  in_app_product_updates: boolean;
  in_app_system_updates: boolean;
  in_app_account_updates: boolean;
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
  actionUrl?: string | null;
  actionLabel?: string | null;
  imageUrl?: string | null;
  icon?: string | null;
  priority?: NotificationPriority;
  severity?: NotificationSeverity;
  category?: NotificationCategory;
}

export interface CreateAdminNotificationParams {
  title: string;
  body: string;
  eventType?: NotificationEventType;
  category: NotificationCategory;
  priority: NotificationPriority;
  severity?: NotificationSeverity;
  icon?: string;
  actionUrl?: string;
  actionLabel?: string;
  imageUrl?: string;
  targetType: NotificationTargetType;
  targetUserIds?: string[];
  targetSegment?: string;
  scheduledAt?: string | null;
  expiresAt?: string | null;
}
