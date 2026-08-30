import { CancellationReasonCode, CancellationReasonConfig } from "./types";

export const CANCELLATION_REASONS: Record<CancellationReasonCode, CancellationReasonConfig> = {
  CUSTOMER_REQUEST: {
    code: "CUSTOMER_REQUEST",
    label: "Customer Requested Cancellation",
    category: "CUSTOMER",
    customerSafeMessage: "Your order was cancelled upon your request.",
  },
  OUT_OF_STOCK: {
    code: "OUT_OF_STOCK",
    label: "Material / Substrate Out of Stock",
    category: "OPERATIONS",
    customerSafeMessage: "We are sorry, but we were unable to fulfill this order because the required raw materials were unavailable.",
  },
  LOW_QUALITY_ARTWORK: {
    code: "LOW_QUALITY_ARTWORK",
    label: "Low Quality Artwork / Resolution",
    category: "QUALITY",
    customerSafeMessage: "Your submitted artwork could not be processed at the required 300 DPI print quality.",
  },
  ARTWORK_NOT_USABLE: {
    code: "ARTWORK_NOT_USABLE",
    label: "Artwork Cannot Be Printed (Missing Fonts/Bleed)",
    category: "QUALITY",
    customerSafeMessage: "The provided design file could not be pre-flighted for printing due to missing assets or bleed errors.",
  },
  PRODUCTION_CAPACITY: {
    code: "PRODUCTION_CAPACITY",
    label: "Production Capacity Exceeded",
    category: "OPERATIONS",
    customerSafeMessage: "We are currently experiencing high volume and could not accommodate this production run within the timeline.",
  },
  PRODUCTION_DELAY: {
    code: "PRODUCTION_DELAY",
    label: "Unforeseen Press / Machine Downtime",
    category: "OPERATIONS",
    customerSafeMessage: "Due to unforeseen equipment maintenance, we are unable to fulfill your order on schedule.",
  },
  PINCODE_UNSERVICEABLE: {
    code: "PINCODE_UNSERVICEABLE",
    label: "Pincode Unserviceable by Logistics Partners",
    category: "LOGISTICS",
    customerSafeMessage: "Our logistics courier partners cannot deliver to the specified destination pincode.",
  },
  SHIPPING_UNAVAILABLE: {
    code: "SHIPPING_UNAVAILABLE",
    label: "Carrier Routing Unavailable",
    category: "LOGISTICS",
    customerSafeMessage: "Delivery is temporarily suspended to this region by all courier networks.",
  },
  CUSTOMER_ADDRESS_ISSUE: {
    code: "CUSTOMER_ADDRESS_ISSUE",
    label: "Incomplete / Invalid Delivery Address",
    category: "LOGISTICS",
    customerSafeMessage: "The delivery address provided was incomplete or could not be verified by the carrier.",
  },
  CUSTOMER_UNREACHABLE: {
    code: "CUSTOMER_UNREACHABLE",
    label: "Customer Unreachable for Proof Confirmation",
    category: "CUSTOMER",
    customerSafeMessage: "Order cancelled as digital proof approval was not received within the required window.",
  },
  PAYMENT_ISSUE: {
    code: "PAYMENT_ISSUE",
    label: "Payment Verification / Charge Issue",
    category: "PAYMENT",
    customerSafeMessage: "The transaction encountered a verification irregularity with the payment gateway.",
  },
  PAYMENT_VERIFICATION_FAILED: {
    code: "PAYMENT_VERIFICATION_FAILED",
    label: "Gateway Anti-Fraud / Verification Failed",
    category: "PAYMENT",
    customerSafeMessage: "Payment authentication could not be completed with your issuing bank.",
  },
  FRAUD_RISK: {
    code: "FRAUD_RISK",
    label: "High Risk / Fraud Assessment",
    category: "PAYMENT",
    customerSafeMessage: "This order was cancelled following automated security and verification checks.",
  },
  DUPLICATE_ORDER: {
    code: "DUPLICATE_ORDER",
    label: "Duplicate Order Detected",
    category: "OPERATIONS",
    customerSafeMessage: "A duplicate submission was detected and cancelled to avoid double billing.",
  },
  PRICE_CONFIGURATION_ERROR: {
    code: "PRICE_CONFIGURATION_ERROR",
    label: "Pricing Engine Configuration Error",
    category: "OPERATIONS",
    customerSafeMessage: "There was a system calculation error during checkout. You have been fully refunded.",
  },
  ORDER_CONFIGURATION_ERROR: {
    code: "ORDER_CONFIGURATION_ERROR",
    label: "Order Specification Error",
    category: "OPERATIONS",
    customerSafeMessage: "The selected custom options for this print job conflict with manufacturing specifications.",
  },
  BUSINESS_DECISION: {
    code: "BUSINESS_DECISION",
    label: "Administrative / Business Decision",
    category: "OPERATIONS",
    customerSafeMessage: "This order was cancelled by studio management. Full refund has been initiated.",
  },
  OTHER: {
    code: "OTHER",
    label: "Other Custom Reason (Requires Note)",
    category: "OPERATIONS",
    customerSafeMessage: "This order was cancelled by studio operations.",
  },
};

export function getCustomerSafeReasonMessage(code: CancellationReasonCode, customMessage?: string): string {
  if (customMessage && customMessage.trim().length > 0) {
    return customMessage.trim();
  }
  return CANCELLATION_REASONS[code]?.customerSafeMessage || "This order was cancelled by studio operations.";
}
