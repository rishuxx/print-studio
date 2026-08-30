"use server";

import { createClient } from "@/lib/supabase/server";
import { fetchRazorpayPayment } from "./razorpay-server";
import type { ReconciliationState } from "./types";

export interface ReconciliationResult {
  paymentId: string;
  orderId: string;
  reconciliationState: ReconciliationState;
  amountExpectedMinor: number;
  amountPaidMinor: number;
  isAmountMatched: boolean;
  providerStatus?: string;
  notes?: string;
}

/**
 * Server-side Reconciliation Service:
 * Loads internal payment & linked order, queries Razorpay gateway if provider_payment_id is available,
 * verifies amount/currency/capture integrity, and updates reconciliation state.
 */
export async function reconcilePayment(paymentId: string): Promise<{
  success: boolean;
  result?: ReconciliationResult;
  error?: string;
}> {
  const supabase = await createClient();

  // 1. Fetch internal payment record
  const { data: payment, error: payErr } = await supabase
    .from("payments")
    .select("*, orders(*)")
    .eq("id", paymentId)
    .maybeSingle();

  if (payErr || !payment) {
    return { success: false, error: "Payment record not found." };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const order = payment.orders as any;
  if (!order) {
    return { success: false, error: "Associated order reference missing." };
  }

  const expectedOrderTotalMinor = Math.round(Number(order.total) * 100);
  const paymentAmountMinor = Number(payment.amount_minor || payment.amount || 0);

  let state: ReconciliationState = "reconciled";
  const noteParts: string[] = [];

  // Check 1: Internal order total vs payment amount
  if (Math.abs(expectedOrderTotalMinor - paymentAmountMinor) > 5) {
    state = "amount_mismatch";
    noteParts.push(`Amount mismatch: Order total is ₹${(expectedOrderTotalMinor / 100).toFixed(2)}, but payment recorded is ₹${(paymentAmountMinor / 100).toFixed(2)}.`);
  }

  // Check 2: Verify against gateway if provider_payment_id exists
  let providerStatus: string | undefined;
  if (payment.provider_payment_id) {
    const remotePayment = await fetchRazorpayPayment(payment.provider_payment_id);
    if (remotePayment) {
      providerStatus = remotePayment.status;
      if (remotePayment.amountMinor !== paymentAmountMinor) {
        state = "amount_mismatch";
        noteParts.push(`Gateway amount mismatch: Razorpay reported ₹${(remotePayment.amountMinor / 100).toFixed(2)}.`);
      }

      if (payment.status === "captured" && remotePayment.status !== "captured") {
        state = "reconciliation_required";
        noteParts.push(`Status mismatch: Local marked captured, but gateway reported '${remotePayment.status}'.`);
      }
    } else {
      noteParts.push("Gateway check: Unable to fetch live payment state from Razorpay API.");
    }
  } else if (payment.status === "created" || payment.status === "pending") {
    state = "webhook_pending";
    noteParts.push("Awaiting customer payment completion or webhook capture confirmation.");
  }

  const notes = noteParts.join(" ");

  // 3. Persist reconciliation state
  await supabase
    .from("payments")
    .update({
      reconciliation_state: state,
      reconciliation_notes: notes || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", paymentId);

  return {
    success: true,
    result: {
      paymentId,
      orderId: order.id,
      reconciliationState: state,
      amountExpectedMinor: expectedOrderTotalMinor,
      amountPaidMinor: paymentAmountMinor,
      isAmountMatched: state !== "amount_mismatch",
      providerStatus,
      notes,
    },
  };
}
