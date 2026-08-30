import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { verifyRazorpayPaymentSignature } from "@/lib/payments/razorpay-server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      internalOrderId,
      orderNumber,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = body;

    if (
      !internalOrderId ||
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required payment signature fields." },
        { status: 400 }
      );
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return NextResponse.json(
        { success: false, error: "Server configuration error." },
        { status: 500 }
      );
    }

    // 1. Verify HMAC-SHA256 signature server-side
    const isValid = verifyRazorpayPaymentSignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      secret
    );

    if (!isValid) {
      console.warn(`[Payment verification failed for order ${orderNumber}]`);
      return NextResponse.json(
        { success: false, error: "Invalid payment signature." },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // 2. Fetch order and existing payment record
    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .select("id, status, payment_status, total")
      .eq("id", internalOrderId)
      .single();

    if (orderErr || !order) {
      return NextResponse.json(
        { success: false, error: "Order not found." },
        { status: 404 }
      );
    }

    // 3. Update payment record to 'captured'
    await supabase
      .from("payments")
      .update({
        provider_payment_id: razorpay_payment_id,
        status: "captured",
        amount_minor: Math.round(Number(order.total) * 100),
        signature_verified: true,
        reconciliation_state: "reconciled",
        captured_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        metadata: {
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
          verified: true,
        },
      })
      .eq("order_id", internalOrderId)
      .eq("provider_order_id", razorpay_order_id);

    // 4. Update order payment status and advance order status to 'artwork_review'
    await supabase
      .from("orders")
      .update({
        status: "artwork_review",
        payment_status: "paid",
        payment_reference: razorpay_payment_id,
      })
      .eq("id", internalOrderId);

    // 5. Append confirmed payment event
    await supabase.from("order_events").insert({
      order_id: internalOrderId,
      status: "payment_confirmed",
      title: "Payment Confirmed (Razorpay)",
      description: `Payment of ₹${order.total} successfully captured via Razorpay. Reference: ${razorpay_payment_id}.`,
    });

    return NextResponse.json({
      success: true,
      verified: true,
      status: "captured",
      orderNumber,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Verification failed.";
    console.error("[Razorpay verify error]:", err);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
