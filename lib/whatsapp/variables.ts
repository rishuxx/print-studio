/**
 * Safe Template Variable Resolver
 * Resolves standard template placeholder tokens against structured business context.
 * Strictly whitelisted; prevents code execution and unauthorized data leaks.
 */

export interface WhatsAppVariableContext {
  customerName?: string | null;
  customerFirstName?: string | null;
  orderId?: string | null;
  orderNumber?: string | null;
  orderTotal?: string | number | null;
  orderStatus?: string | null;
  paymentStatus?: string | null;
  paymentAmount?: string | number | null;
  productName?: string | null;
  productCount?: number | null;
  artworkStatus?: string | null;
  artworkReviewUrl?: string | null;
  orderTrackingUrl?: string | null;
  trackingNumber?: string | null;
  awbNumber?: string | null;
  carrierName?: string | null;
  expectedDeliveryDate?: string | null;
  shippingAddress?: string | null;
  city?: string | null;
  pincode?: string | null;
  refundAmount?: string | number | null;
  refundId?: string | null;
  invoiceNumber?: string | null;
  storeName?: string | null;
  supportPhone?: string | null;
  supportEmail?: string | null;
  [key: string]: unknown;
}

export const SUPPORTED_TEMPLATE_VARIABLES: Array<{ key: string; label: string; description: string; sample: string }> = [
  { key: "CUSTOMER_NAME", label: "Customer Full Name", description: "Recipient's full name", sample: "Rohan Sharma" },
  { key: "CUSTOMER_FIRST_NAME", label: "Customer First Name", description: "First name only", sample: "Rohan" },
  { key: "ORDER_NUMBER", label: "Order Number", description: "Unique order reference code", sample: "PRT-2026-8841" },
  { key: "ORDER_ID", label: "Order UUID", description: "Database identifier for order", sample: "00000000-0000-0000-0000-000000000123" },
  { key: "ORDER_TOTAL", label: "Order Total", description: "Total payable/paid amount in rupees", sample: "1,499.00" },
  { key: "ORDER_STATUS", label: "Order Status", description: "Canonical order state", sample: "Confirmed" },
  { key: "PAYMENT_AMOUNT", label: "Payment Amount", description: "Transaction amount in rupees", sample: "1,499.00" },
  { key: "PAYMENT_STATUS", label: "Payment Status", description: "Gateway status", sample: "Success" },
  { key: "PRODUCT_NAME", label: "Product Name", description: "Main item title", sample: "Premium Business Cards (Matte 350 GSM)" },
  { key: "PRODUCT_COUNT", label: "Total Items Count", description: "Total line items count", sample: "2" },
  { key: "ARTWORK_STATUS", label: "Artwork Proof State", description: "Pre-press review status", sample: "Pending Customer Review" },
  { key: "ARTWORK_REVIEW_URL", label: "Artwork Review URL", description: "Secure customer proof approval link", sample: "https://preetyprints.com/orders/PRT-2026-8841#proof" },
  { key: "ORDER_TRACKING_URL", label: "Live Tracking URL", description: "Direct courier or storefront tracking link", sample: "https://preetyprints.com/orders/PRT-2026-8841" },
  { key: "AWB_NUMBER", label: "AWB / Waybill Number", description: "Logistics tracking number", sample: "DLH9928172645" },
  { key: "TRACKING_NUMBER", label: "Carrier Tracking Number", description: "Alternative alias for AWB", sample: "DLH9928172645" },
  { key: "CARRIER_NAME", label: "Logistics Partner Name", description: "Assigned courier company", sample: "Delhivery Express" },
  { key: "EXPECTED_DELIVERY_DATE", label: "Estimated Delivery Date", description: "Projected arrival date", sample: "05 Sep 2026" },
  { key: "SHIPPING_ADDRESS", label: "Delivery Address Line", description: "Destination address snippet", sample: "14 Rajpur Road, Dehradun" },
  { key: "CITY", label: "Destination City", description: "Recipient city", sample: "Dehradun" },
  { key: "PINCODE", label: "Destination PIN Code", description: "Postal code", sample: "248001" },
  { key: "REFUND_AMOUNT", label: "Refund Amount", description: "Refunded amount in rupees", sample: "1,499.00" },
  { key: "REFUND_ID", label: "Refund Reference ID", description: "Gateway refund transaction ID", sample: "rfnd_test_992817" },
  { key: "INVOICE_NUMBER", label: "Tax Invoice Number", description: "GST invoice code", sample: "INV-2026-8841" },
  { key: "STORE_NAME", label: "Store Name", description: "Brand name", sample: "PreetyPrints" },
];

/**
 * Resolves a single variable token to a string value
 */
export function resolveVariableToken(token: string, ctx: WhatsAppVariableContext): string {
  const normalizedKey = token.trim().toUpperCase();

  switch (normalizedKey) {
    case "CUSTOMER_NAME":
      return String(ctx.customerName || "Valued Customer");
    case "CUSTOMER_FIRST_NAME":
      return String(ctx.customerFirstName || ctx.customerName?.split(" ")[0] || "Valued Customer");
    case "ORDER_NUMBER":
      return String(ctx.orderNumber || ctx.orderId?.slice(0, 8) || "Order");
    case "ORDER_ID":
      return String(ctx.orderId || "");
    case "ORDER_TOTAL":
      if (typeof ctx.orderTotal === "number") {
        return (ctx.orderTotal).toLocaleString("en-IN", { minimumFractionDigits: 2 });
      }
      return String(ctx.orderTotal || "0.00");
    case "ORDER_STATUS":
      return String(ctx.orderStatus || "Processing");
    case "PAYMENT_AMOUNT":
      if (typeof ctx.paymentAmount === "number") {
        return (ctx.paymentAmount).toLocaleString("en-IN", { minimumFractionDigits: 2 });
      }
      return String(ctx.paymentAmount || ctx.orderTotal || "0.00");
    case "PAYMENT_STATUS":
      return String(ctx.paymentStatus || "Confirmed");
    case "PRODUCT_NAME":
      return String(ctx.productName || "Custom Print Order");
    case "PRODUCT_COUNT":
      return String(ctx.productCount ?? 1);
    case "ARTWORK_STATUS":
      return String(ctx.artworkStatus || "Under Review");
    case "ARTWORK_REVIEW_URL":
      return String(ctx.artworkReviewUrl || (ctx.orderId ? `https://preetyprints.com/orders/${ctx.orderId}` : "https://preetyprints.com/orders"));
    case "ORDER_TRACKING_URL":
      return String(ctx.orderTrackingUrl || (ctx.orderId ? `https://preetyprints.com/orders/${ctx.orderId}` : "https://preetyprints.com/orders"));
    case "AWB_NUMBER":
    case "TRACKING_NUMBER":
      return String(ctx.awbNumber || ctx.trackingNumber || "Assigned Soon");
    case "CARRIER_NAME":
      return String(ctx.carrierName || "Courier Partner");
    case "EXPECTED_DELIVERY_DATE":
      return String(ctx.expectedDeliveryDate || "3-5 Business Days");
    case "SHIPPING_ADDRESS":
      return String(ctx.shippingAddress || "Registered Delivery Address");
    case "CITY":
      return String(ctx.city || "Dehradun");
    case "PINCODE":
      return String(ctx.pincode || "248001");
    case "REFUND_AMOUNT":
      if (typeof ctx.refundAmount === "number") {
        return (ctx.refundAmount).toLocaleString("en-IN", { minimumFractionDigits: 2 });
      }
      return String(ctx.refundAmount || "0.00");
    case "REFUND_ID":
      return String(ctx.refundId || "Pending Gateway Assignment");
    case "INVOICE_NUMBER":
      return String(ctx.invoiceNumber || (ctx.orderNumber ? `INV-${ctx.orderNumber}` : "Pending"));
    case "STORE_NAME":
      return String(ctx.storeName || "PreetyPrints");
    default:
      return String(ctx[token] ?? ctx[normalizedKey] ?? "");
  }
}

/**
 * Resolves template parameter schema `[{"pos": 1, "var": "CUSTOMER_NAME"}, ...]` into an ordered list of string values for Meta Cloud API.
 */
export function resolveMetaParameters(
  schema: Array<{ pos: number; var: string }>,
  ctx: WhatsAppVariableContext
): string[] {
  if (!Array.isArray(schema) || schema.length === 0) {
    return [];
  }

  // Sort by position 1, 2, 3...
  const sorted = [...schema].sort((a, b) => a.pos - b.pos);
  return sorted.map((item) => resolveVariableToken(item.var, ctx));
}

/**
 * Locally renders a preview of a template body string with sample or context variables.
 * Replaces {{1}}, {{2}} with resolved values.
 */
export function renderTemplatePreview(
  bodyText: string,
  schema: Array<{ pos: number; var: string }>,
  ctx?: WhatsAppVariableContext
): string {
  if (!bodyText) return "";

  // Build map of sample values
  const sampleMap = new Map<number, string>();
  for (const item of schema || []) {
    if (ctx) {
      sampleMap.set(item.pos, resolveVariableToken(item.var, ctx));
    } else {
      const match = SUPPORTED_TEMPLATE_VARIABLES.find((v) => v.key === item.var.toUpperCase());
      sampleMap.set(item.pos, match?.sample || `[${item.var}]`);
    }
  }

  return bodyText.replace(/\{\{(\d+)\}\}/g, (_, posStr) => {
    const pos = parseInt(posStr, 10);
    return sampleMap.get(pos) ?? `{{${pos}}}`;
  });
}
