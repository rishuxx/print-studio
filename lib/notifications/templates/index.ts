import { NotificationEventType, NotificationChannel, RenderedTemplate } from "../types";

export interface TemplateContext {
  customerName?: string;
  orderNumber?: string;
  orderId?: string;
  amountMinor?: number;
  currency?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  carrierName?: string;
  artworkRejectionReason?: string;
  cancellationReason?: string;
  businessName?: string;
  supportEmail?: string;
  supportPhone?: string;
  siteUrl?: string;
}

export function renderNotificationTemplate(
  eventType: NotificationEventType,
  channel: NotificationChannel,
  context: TemplateContext
): RenderedTemplate {
  const brand = context.businessName || "PreetyPrints";
  const name = context.customerName || "Valued Customer";
  const orderRef = context.orderNumber || context.orderId || "your order";
  const formattedAmount = context.amountMinor
    ? `₹${(context.amountMinor / 100).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`
    : "";
  const siteUrl = context.siteUrl || "https://preetyprints.com";
  const orderUrl = `${siteUrl}/orders/${context.orderId || ""}`;

  switch (eventType) {
    case "ORDER_CONFIRMED":
      if (channel === "EMAIL") {
        return {
          subject: `Order Confirmed: #${orderRef} — ${brand}`,
          bodyText: `Hello ${name},\n\nThank you for ordering with ${brand}! We have received order #${orderRef}${formattedAmount ? ` for ${formattedAmount}` : ""}.\n\nOur pre-press studio team is reviewing your print specifications and artwork files. You can review your order status anytime at: ${orderUrl}\n\nWarm regards,\n${brand} Team`,
          bodyHtml: `<div style="font-family: sans-serif; line-height: 1.5; color: #1b0b2e;">
            <h2 style="color: #4a1e9e;">Order Confirmed: #${orderRef}</h2>
            <p>Hello <strong>${name}</strong>,</p>
            <p>Thank you for choosing ${brand}. We have received order <strong>#${orderRef}</strong>${formattedAmount ? ` (Total: <strong>${formattedAmount}</strong>)` : ""}.</p>
            <p>Our studio team has scheduled your file for pre-press verification and bleed inspection.</p>
            <p style="margin-top: 24px;"><a href="${orderUrl}" style="background: #4a1e9e; color: #fff; padding: 10px 18px; text-decoration: none; border-radius: 6px; font-weight: bold;">View Order Details</a></p>
          </div>`,
          ctaUrl: orderUrl,
          ctaLabel: "View Order",
        };
      } else if (channel === "WHATSAPP") {
        return {
          bodyText: `Hi ${name}, your order #${orderRef} at ${brand} is confirmed!${formattedAmount ? ` Total: ${formattedAmount}.` : ""} Our studio team is reviewing your print files. Track here: ${orderUrl}`,
          ctaUrl: orderUrl,
        };
      }
      return {
        bodyText: `Order #${orderRef} confirmed at ${brand}. We are preparing your print files.`,
        ctaUrl: orderUrl,
      };

    case "PAYMENT_SUCCESS":
      if (channel === "EMAIL") {
        return {
          subject: `Payment Successful: #${orderRef} — ${brand}`,
          bodyText: `Hello ${name},\n\nYour payment${formattedAmount ? ` of ${formattedAmount}` : ""} for order #${orderRef} was successfully captured.\n\nYour order has entered our production workflow.\n\nWarm regards,\n${brand}`,
          ctaUrl: orderUrl,
          ctaLabel: "Order Status",
        };
      } else if (channel === "WHATSAPP") {
        return {
          bodyText: `Hi ${name}, payment${formattedAmount ? ` of ${formattedAmount}` : ""} for order #${orderRef} received successfully! We have queued your items for printing.`,
          ctaUrl: orderUrl,
        };
      }
      return { bodyText: `Payment successful for #${orderRef}. Printing queued.`, ctaUrl: orderUrl };

    case "PAYMENT_FAILED":
      return {
        subject: `Action Required: Payment Failed for #${orderRef} — ${brand}`,
        bodyText: `Hello ${name},\n\nWe were unable to verify payment for order #${orderRef}. Please retry your payment to prevent order cancellation: ${orderUrl}`,
        ctaUrl: orderUrl,
        ctaLabel: "Retry Payment",
      };

    case "ARTWORK_APPROVED":
      return {
        subject: `Artwork Approved: #${orderRef} — ${brand}`,
        bodyText: `Hello ${name},\n\nGreat news! Your pre-press digital proof for order #${orderRef} has been approved. Plate imaging and press run are underway.\n\nTrack progress: ${orderUrl}`,
        ctaUrl: orderUrl,
        ctaLabel: "View Production Status",
      };

    case "ARTWORK_REJECTED":
      const reason = context.artworkRejectionReason || "Low resolution or bleed margin adjustment required.";
      return {
        subject: `Artwork Attention Required: #${orderRef} — ${brand}`,
        bodyText: `Hello ${name},\n\nOur pre-press technician noticed an issue with the artwork for order #${orderRef}:\n"${reason}"\n\nPlease upload a revised file or contact our design studio: ${orderUrl}`,
        ctaUrl: orderUrl,
        ctaLabel: "Review Artwork",
      };

    case "ORDER_IN_PRODUCTION":
      return {
        subject: `Printing In Progress: #${orderRef} — ${brand}`,
        bodyText: `Hello ${name},\n\nYour job #${orderRef} is currently on press in our production facility. Finishing, laminating, and trim inspection will follow shortly.`,
        ctaUrl: orderUrl,
        ctaLabel: "Track Order",
      };

    case "ORDER_DISPATCHED":
      const courier = context.carrierName || "our courier partner";
      const awb = context.trackingNumber ? ` (AWB #${context.trackingNumber})` : "";
      return {
        subject: `Order Dispatched: #${orderRef} ${awb} — ${brand}`,
        bodyText: `Hello ${name},\n\nYour print order #${orderRef} has been dispatched via ${courier}${awb}.\n\nTrack your shipment in real-time: ${context.trackingUrl || orderUrl}`,
        ctaUrl: context.trackingUrl || orderUrl,
        ctaLabel: "Track Consignment",
      };

    case "SHIPMENT_OUT_FOR_DELIVERY":
      return {
        subject: `Out for Delivery: #${orderRef} — ${brand}`,
        bodyText: `Hello ${name},\n\nYour package for order #${orderRef} is out for doorstep delivery today with the courier executive.`,
        ctaUrl: context.trackingUrl || orderUrl,
        ctaLabel: "Live Tracking",
      };

    case "SHIPMENT_DELIVERED":
      return {
        subject: `Delivered: #${orderRef} — Thank You for Choosing ${brand}!`,
        bodyText: `Hello ${name},\n\nYour consignment for order #${orderRef} has been successfully delivered. We hope you love the print quality! For any assistance, reach out to ${context.supportEmail || "our support desk"}.`,
        ctaUrl: orderUrl,
        ctaLabel: "View Invoices",
      };

    case "ORDER_CANCELLED":
      return {
        subject: `Order Cancelled: #${orderRef} — ${brand}`,
        bodyText: `Hello ${name},\n\nOrder #${orderRef} has been cancelled.\nReason: ${context.cancellationReason || "Customer request / Pre-press cancellation"}.\n\nIf you were charged, a refund has been initiated to your original payment method.`,
        ctaUrl: orderUrl,
        ctaLabel: "Order Details",
      };

    case "REFUND_COMPLETED":
      return {
        subject: `Refund Processed: #${orderRef} — ${brand}`,
        bodyText: `Hello ${name},\n\nYour refund${formattedAmount ? ` of ${formattedAmount}` : ""} for order #${orderRef} has been processed via Razorpay. It should reflect in your source account in 3-5 business days.`,
        ctaUrl: orderUrl,
        ctaLabel: "View Refund Status",
      };

    default:
      return {
        subject: `Notification regarding #${orderRef} — ${brand}`,
        bodyText: `Hello ${name},\n\nHere is an update regarding order #${orderRef} at ${brand}. Please visit ${orderUrl} to view details.`,
        ctaUrl: orderUrl,
      };
  }
}
