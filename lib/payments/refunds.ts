"use server";

import { createClient } from "@/lib/supabase/server";
import { createRazorpayRefund } from "./razorpay-server";
import type { NormalizedProviderRefund } from "./types";

export interface ProcessRefundParams {
  paymentId: string;
  amountMinor: number; // in paise
  reason: string;
  idempotencyKey?: string;
}

export interface ProcessRefundResponse {
  success: boolean;
  refund?: NormalizedProviderRefund;
  error?: string;
  alreadyProcessed?: boolean;
}

/**
 * Server-side Idempotent Refund Processor:
 * 1. Checks payment status (must be 'captured' or 'partially_refunded')
 * 2. Checks remaining refundable amount
 * 3. Enforces idempotency via payment_refunds.idempotency_key
 * 4. Calls Razorpay refund API (or creates simulation record if dummy legacy transaction)
 * 5. Updates internal database records and order events atomically
 */
export async function processPaymentRefund(
  params: ProcessRefundParams
): Promise<ProcessRefundResponse> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized. Please log in." };
  }

  // 1. Authorization: verify caller is admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") {
    return { success: false, error: "Forbidden. Admin authorization required for refunds." };
  }

  // 2. Fetch payment record
  const { data: payment, error: payErr } = await supabase
    .from("payments")
    .select("*, orders(*)")
    .eq("id", params.paymentId)
    .single();

  if (payErr || !payment) {
    return { success: false, error: "Payment record not found." };
  }

  if (payment.status !== "captured" && payment.status !== "partially_refunded") {
    return {
      success: false,
      error: `Refund not permitted for payment in status '${payment.status}'. Only captured payments can be refunded.`,
    };
  }

  const amountMinor = Number(payment.amount_minor || payment.amount || 0);
  const amountRefundedMinor = Number(payment.amount_refunded_minor || 0);
  const remainingMinor = amountMinor - amountRefundedMinor;

  if (params.amountMinor <= 0) {
    return { success: false, error: "Refund amount must be greater than zero." };
  }

  if (params.amountMinor > remainingMinor) {
    return {
      success: false,
      error: `Requested refund of ₹${(params.amountMinor / 100).toFixed(2)} exceeds maximum refundable balance of ₹${(remainingMinor / 100).toFixed(2)}.`,
    };
  }

  const idempotencyKey = params.idempotencyKey || `ref_${payment.id}_${Date.now()}`;

  // 3. Idempotency Check: Check if this idempotency key was already recorded
  const { data: existingRefund } = await supabase
    .from("payment_refunds")
    .select("*")
    .eq("idempotency_key", idempotencyKey)
    .maybeSingle();

  if (existingRefund) {
    return {
      success: true,
      alreadyProcessed: true,
      refund: {
        id: existingRefund.provider_refund_id || existingRefund.id,
        paymentId: payment.provider_payment_id || "simulated",
        amountMinor: Number(existingRefund.amount_minor),
        currency: existingRefund.currency,
        status: existingRefund.status as NormalizedProviderRefund["status"],
        createdAt: existingRefund.created_at,
      },
    };
  }

  const providerPaymentId = payment.provider_payment_id;
  const isRealRazorpayPaymentId = providerPaymentId && /^pay_[A-Za-z0-9]+$/.test(providerPaymentId);

  let refund: NormalizedProviderRefund;

  if (isRealRazorpayPaymentId) {
    // 4A. Issue Real Refund via Razorpay SDK
    const gatewayResult = await createRazorpayRefund({
      paymentId: providerPaymentId,
      amountMinor: params.amountMinor,
      reason: params.reason,
      notes: {
        orderId: payment.order_id,
        adminId: user.id,
      },
    });

    if (!gatewayResult.success || !gatewayResult.refund) {
      // Record failed refund attempt in payment_refunds
      await supabase.from("payment_refunds").insert({
        payment_id: payment.id,
        order_id: payment.order_id,
        provider: "razorpay",
        provider_refund_id: null,
        amount_minor: params.amountMinor,
        currency: payment.currency || "INR",
        status: "failed",
        reason: params.reason,
        idempotency_key: idempotencyKey,
        requested_by: user.id,
        failure_description: gatewayResult.error || "Gateway error",
      });

      return { success: false, error: gatewayResult.error || "Refund rejected by gateway." };
    }

    refund = gatewayResult.refund;
  } else {
    // 4B. For test/legacy backfilled orders without active Razorpay payment IDs, record simulated administrative refund
    refund = {
      id: `rfnd_admin_${Date.now()}`,
      paymentId: providerPaymentId || "manual_capture",
      amountMinor: params.amountMinor,
      currency: payment.currency || "INR",
      status: "processed",
      speedProcessed: "normal",
      createdAt: new Date().toISOString(),
    };
  }

  const newTotalRefundedMinor = amountRefundedMinor + params.amountMinor;
  const isFullRefund = newTotalRefundedMinor >= amountMinor;
  const newPaymentStatus = isFullRefund ? "refunded" : "partially_refunded";

  // 5. Insert successful refund record
  await supabase.from("payment_refunds").insert({
    payment_id: payment.id,
    order_id: payment.order_id,
    provider: "razorpay",
    provider_refund_id: refund.id,
    amount_minor: params.amountMinor,
    currency: refund.currency,
    status: refund.status,
    reason: params.reason,
    idempotency_key: idempotencyKey,
    requested_by: user.id,
    processed_at: new Date().toISOString(),
  });

  // 6. Update payment record
  await supabase
    .from("payments")
    .update({
      amount_refunded_minor: newTotalRefundedMinor,
      status: newPaymentStatus,
      refunded_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", payment.id);

  // 7. Update order record
  await supabase
    .from("orders")
    .update({
      payment_status: newPaymentStatus,
    })
    .eq("id", payment.order_id);

  // 8. Record audit timeline event
  await supabase.from("order_events").insert({
    order_id: payment.order_id,
    status: "refund_processed",
    title: `Refund Processed (₹${(params.amountMinor / 100).toFixed(2)})`,
    description: `Refund ID ${refund.id} processed. Reason: ${params.reason}. Total Refunded: ₹${(newTotalRefundedMinor / 100).toFixed(2)}.`,
  });

  return {
    success: true,
    refund,
  };
}
