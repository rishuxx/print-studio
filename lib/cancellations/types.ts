/**
 * Order Cancellation & Refund Domain Types
 */

export type CancellationReasonCode =
  | "CUSTOMER_REQUEST"
  | "PAYMENT_ISSUE"
  | "DUPLICATE_ORDER"
  | "OUT_OF_STOCK"
  | "ARTWORK_NOT_USABLE"
  | "LOW_QUALITY_ARTWORK"
  | "PRODUCTION_CAPACITY"
  | "PRODUCTION_DELAY"
  | "CUSTOMER_ADDRESS_ISSUE"
  | "CUSTOMER_UNREACHABLE"
  | "SHIPPING_UNAVAILABLE"
  | "PINCODE_UNSERVICEABLE"
  | "PRICE_CONFIGURATION_ERROR"
  | "FRAUD_RISK"
  | "PAYMENT_VERIFICATION_FAILED"
  | "ORDER_CONFIGURATION_ERROR"
  | "BUSINESS_DECISION"
  | "OTHER";

export type CancellationRefundMode = "FULL" | "PARTIAL" | "NONE";

export interface CancellationReasonConfig {
  code: CancellationReasonCode;
  label: string;
  category: "CUSTOMER" | "OPERATIONS" | "QUALITY" | "PAYMENT" | "LOGISTICS";
  customerSafeMessage: string;
}

export interface OrderCancellationDTO {
  id: string;
  orderId: string;
  customerId?: string | null;
  requestedByType: "ADMIN" | "CUSTOMER" | "SYSTEM" | "PAYMENT_PROVIDER";
  requestedByUserId?: string | null;
  reasonCode: CancellationReasonCode;
  reasonNote?: string | null;
  internalNote?: string | null;
  customerMessage?: string | null;
  refundEligibility: "FULL_REFUND" | "PARTIAL_REFUND" | "NO_REFUND_REQUIRED";
  refundAmountMinor: number;
  cancelledAt: string;
  createdAt: string;
}

export interface OrderRefundDTO {
  id: string;
  paymentId: string;
  orderId: string;
  provider: string;
  providerRefundId?: string | null;
  amountMinor: number;
  currency: string;
  refundType: "FULL" | "PARTIAL";
  providerStatus: "PENDING" | "PROCESSED" | "FAILED" | "REVERSED";
  internalStatus: "CREATED" | "SUBMITTED" | "PENDING" | "PROCESSED" | "FAILED" | "REVERSED" | "RECONCILIATION_REQUIRED";
  acquirerReference?: string | null;
  reasonCode?: string | null;
  reasonNote?: string | null;
  idempotencyKey: string;
  requestedAt?: string | null;
  processedAt?: string | null;
  failedAt?: string | null;
  providerErrorCode?: string | null;
  providerErrorMessage?: string | null;
}

export interface CancelOrderParams {
  orderId: string;
  reasonCode: CancellationReasonCode;
  reasonNote?: string;
  internalNote?: string;
  customerMessage?: string;
  refundMode: CancellationRefundMode;
  refundAmountMinor?: number; // In paise, required if refundMode === 'PARTIAL'
  idempotencyKey?: string;
}

export interface CancelOrderResult {
  success: boolean;
  orderId: string;
  cancellationId?: string;
  refundId?: string;
  providerRefundId?: string;
  refundStatus?: string;
  amountRefundedMinor?: number;
  error?: string;
}
