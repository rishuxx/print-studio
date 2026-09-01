import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { verifyRazorpayWebhookSignature } from "@/lib/payments/razorpay-server";

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json(
        { success: false, error: "Missing webhook signature." },
        { status: 400 }
      );
    }

    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET;
    if (!webhookSecret) {
      return NextResponse.json(
        { success: false, error: "Webhook secret not configured." },
        { status: 500 }
      );
    }

    // 1. Verify Webhook Signature
    const isValid = verifyRazorpayWebhookSignature(rawBody, signature, webhookSecret);
    if (!isValid) {
      console.warn("[Razorpay webhook invalid signature rejection]");
      return NextResponse.json(
        { success: false, error: "Invalid signature." },
        { status: 400 }
      );
    }

    const event = JSON.parse(rawBody);
    const eventId = event.id || event.event_id || `evt_${Date.now()}`;
    const eventType = event.event;
    const paymentEntity = event.payload?.payment?.entity;
    const rzpOrderId = paymentEntity?.order_id;
    const rzpPaymentId = paymentEntity?.id;

    const supabase = await createClient();

    // 2. Idempotency Check: Prevent duplicate webhook processing
    const { data: existingEvent } = await supabase
      .from("webhook_events")
      .select("id")
      .eq("provider", "razorpay")
      .eq("event_id", eventId)
      .maybeSingle();

    if (existingEvent) {
      // Duplicate event safely acknowledged
      return NextResponse.json({ success: true, duplicate: true });
    }

    // Record webhook event for persistent audit
    await supabase.from("webhook_events").insert({
      provider: "razorpay",
      event_id: eventId,
      event_type: eventType,
      payload: event,
      processed: true,
    });

    if (!rzpOrderId) {
      return NextResponse.json({ success: true, note: "No associated order_id in entity." });
    }

    // 3. Find payment record by provider_order_id
    const { data: paymentRecord } = await supabase
      .from("payments")
      .select("id, order_id, status, amount")
      .eq("provider", "razorpay")
      .eq("provider_order_id", rzpOrderId)
      .maybeSingle();

    if (!paymentRecord) {
      return NextResponse.json({ success: true, note: "Order not tracked in local system." });
    }

    // 4. Handle supported Razorpay events
    switch (eventType) {
      case "payment.captured": {
        const capturedAmountMinor = Number(paymentEntity?.amount || paymentRecord.amount || 0);

        await supabase
          .from("payments")
          .update({
            provider_payment_id: rzpPaymentId,
            status: "captured",
            amount_minor: capturedAmountMinor,
            signature_verified: true,
            webhook_confirmed: true,
            reconciliation_state: "reconciled",
            captured_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", paymentRecord.id);

        await supabase
          .from("orders")
          .update({
            status: "artwork_review",
            payment_status: "paid",
            payment_reference: rzpPaymentId,
          })
          .eq("id", paymentRecord.order_id);

        await supabase.from("order_events").insert({
          order_id: paymentRecord.order_id,
          status: "payment_confirmed",
          title: "Payment Confirmed via Razorpay Webhook",
          description: `Authoritative capture verified by Razorpay webhook (${rzpPaymentId}). Captured: ₹${(capturedAmountMinor / 100).toFixed(2)}.`,
        });

        // Authoritative Notification Dispatch
        const { NotificationService } = await import("@/lib/notifications/notification-service");
        await NotificationService.dispatchEvent({
          eventType: "PAYMENT_SUCCESS",
          orderId: paymentRecord.order_id,
          amountMinor: capturedAmountMinor,
          idempotencyKey: `rzp_pay_${paymentRecord.order_id}_${rzpPaymentId}`,
        });
        break;
      }

      case "payment.failed": {
        const errorDesc = paymentEntity?.error_description || "Payment failed or declined.";
        await supabase
          .from("payments")
          .update({
            provider_payment_id: rzpPaymentId,
            status: "failed",
            failed_at: new Date().toISOString(),
            failure_code: paymentEntity?.error_code || "PAYMENT_FAILED",
            failure_description: errorDesc,
            updated_at: new Date().toISOString(),
          })
          .eq("id", paymentRecord.id);

        await supabase
          .from("orders")
          .update({
            payment_status: "failed",
          })
          .eq("id", paymentRecord.order_id);

        await supabase.from("order_events").insert({
          order_id: paymentRecord.order_id,
          status: "payment_failed",
          title: "Payment Failed",
          description: `Razorpay payment failed: ${errorDesc}`,
        });

        // Authoritative Notification Dispatch
        const { NotificationService } = await import("@/lib/notifications/notification-service");
        await NotificationService.dispatchEvent({
          eventType: "PAYMENT_FAILED",
          orderId: paymentRecord.order_id,
          idempotencyKey: `rzp_fail_${paymentRecord.order_id}_${rzpPaymentId}`,
        });
        break;
      }

      case "refund.created":
      case "refund.processed": {
        const refundEntity = event.payload?.refund?.entity;
        const refundAmount = Number(refundEntity?.amount || paymentEntity?.amount_refunded || 0);
        const originalAmount = Number(paymentRecord.amount || 0);
        const isFullRefund = originalAmount > 0 ? refundAmount >= originalAmount : true;
        const status = isFullRefund ? "refunded" : "partially_refunded";

        await supabase
          .from("payments")
          .update({
            status,
            amount_refunded_minor: refundAmount,
            refunded_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", paymentRecord.id);

        await supabase
          .from("orders")
          .update({
            payment_status: status,
          })
          .eq("id", paymentRecord.order_id);

        await supabase.from("order_events").insert({
          order_id: paymentRecord.order_id,
          status: "refund_processed",
          title: `Refund Processed (${status})`,
          description: `Refund of ₹${(refundAmount / 100).toFixed(2)} recorded from gateway webhook.`,
        });

        // Authoritative Notification Dispatch
        const { NotificationService } = await import("@/lib/notifications/notification-service");
        await NotificationService.dispatchEvent({
          eventType: "REFUND_COMPLETED",
          orderId: paymentRecord.order_id,
          amountMinor: refundAmount,
          idempotencyKey: `rzp_ref_${paymentRecord.order_id}_${refundEntity?.id || eventId}`,
        });
        break;
      }

      default:
        // Ignore unhandled event types
        break;
    }

    return NextResponse.json({ success: true, processed: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Webhook handler failed.";
    console.error("[Razorpay webhook processing error]:", err);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
