/**
 * Centralized, strongly typed payment domain types for Phase 10D
 */

export type PaymentStatus =
  | "created"
  | "pending"
  | "authorized"
  | "captured"
  | "failed"
  | "refunded"
  | "partially_refunded"
  | "cancelled";

export type ReconciliationState =
  | "reconciled"
  | "reconciliation_required"
  | "amount_mismatch"
  | "signature_failed"
  | "webhook_pending";

export type RefundStatus = "requested" | "processing" | "processed" | "failed";

export type WebhookProcessingStatus = "processed" | "pending" | "failed" | "duplicate" | "invalid_signature";

export interface NormalizedProviderPayment {
  id: string; // rzp payment id (pay_xxx)
  orderId: string; // rzp order id (order_xxx)
  amountMinor: number; // in paise
  amountRefundedMinor: number; // in paise
  currency: string;
  status: "created" | "authorized" | "captured" | "refunded" | "failed";
  method: string | null;
  email?: string | null;
  contact?: string | null;
  feeMinor?: number | null;
  taxMinor?: number | null;
  errorCode?: string | null;
  errorDescription?: string | null;
  createdAt: string;
  capturedAt?: string | null;
}

export interface NormalizedProviderRefund {
  id: string; // rzp refund id (rfnd_xxx)
  paymentId: string; // rzp payment id
  amountMinor: number; // in paise
  currency: string;
  status: "pending" | "processed" | "failed";
  speedProcessed?: string;
  receipt?: string | null;
  createdAt: string;
}

export interface PaymentKpiMetrics {
  grossVolumeMinor: number;
  capturedVolumeMinor: number;
  refundedVolumeMinor: number;
  netVolumeMinor: number;
  capturedCount: number;
  pendingCount: number;
  failedCount: number;
  refundedCount: number;
  successRatePercentage: number;
  attentionCount: number;
}

export interface AdminPaymentsFilterParams {
  q?: string;
  status?: PaymentStatus | "ALL";
  reconciliationState?: ReconciliationState | "ALL";
  dateRange?: string;
  from?: string; // YYYY-MM-DD
  to?: string;   // YYYY-MM-DD
  sort?: "newest" | "oldest" | "highest_amount" | "lowest_amount" | "recently_updated";
  page?: number;
  pageSize?: number;
}

export interface AdminWebhooksFilterParams {
  q?: string;
  eventType?: string;
  status?: WebhookProcessingStatus | "ALL";
  page?: number;
  pageSize?: number;
}
