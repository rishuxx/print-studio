import Razorpay from "razorpay";
import crypto from "crypto";
import type { NormalizedProviderPayment, NormalizedProviderRefund } from "./types";

/**
 * Server-only Razorpay instance initializer.
 * Throws early if server credentials are missing.
 */
export function getRazorpayClient(): Razorpay {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    throw new Error("Missing server-side Razorpay credentials (RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET).");
  }

  return new Razorpay({
    key_id,
    key_secret,
  });
}

/**
 * Validates Razorpay Webhook signature using HMAC-SHA256
 */
export function verifyRazorpayWebhookSignature(
  rawBody: string,
  signature: string,
  secret: string
): boolean {
  if (!rawBody || !signature || !secret) return false;

  try {
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");

    if (expectedSignature.length !== signature.length) return false;

    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature, "utf8"),
      Buffer.from(signature, "utf8")
    );
  } catch {
    return false;
  }
}

/**
 * Validates Razorpay Payment Signature using HMAC-SHA256
 */
export function verifyRazorpayPaymentSignature(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string,
  secret: string
): boolean {
  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature || !secret) {
    return false;
  }

  try {
    const payload = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");

    if (expectedSignature.length !== razorpaySignature.length) return false;

    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature, "utf8"),
      Buffer.from(razorpaySignature, "utf8")
    );
  } catch {
    return false;
  }
}

/**
 * Server-side Provider API: Fetch and normalize Razorpay Payment
 */
export async function fetchRazorpayPayment(paymentId: string): Promise<NormalizedProviderPayment | null> {
  try {
    const razorpay = getRazorpayClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const p: any = await razorpay.payments.fetch(paymentId);

    if (!p || !p.id) return null;

    return {
      id: p.id,
      orderId: p.order_id,
      amountMinor: Number(p.amount),
      amountRefundedMinor: Number(p.amount_refunded || 0),
      currency: p.currency || "INR",
      status: p.status,
      method: p.method || null,
      email: p.email || null,
      contact: p.contact || null,
      feeMinor: p.fee ? Number(p.fee) : null,
      taxMinor: p.tax ? Number(p.tax) : null,
      errorCode: p.error_code || null,
      errorDescription: p.error_description || null,
      createdAt: new Date(p.created_at * 1000).toISOString(),
      capturedAt: p.captured ? new Date(p.created_at * 1000).toISOString() : null,
    };
  } catch (err) {
    console.error(`[fetchRazorpayPayment error for ${paymentId}]:`, err);
    return null;
  }
}

/**
 * Server-side Provider API: Issue full or partial refund via Razorpay
 */
export async function createRazorpayRefund(params: {
  paymentId: string;
  amountMinor: number; // in paise
  reason?: string;
  notes?: Record<string, string>;
}): Promise<{ success: boolean; refund?: NormalizedProviderRefund; error?: string }> {
  try {
    const razorpay = getRazorpayClient();
    // In Razorpay Node SDK, payments.refund takes (paymentId, { amount, notes })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ref: any = await razorpay.payments.refund(params.paymentId, {
      amount: Math.round(params.amountMinor),
      notes: {
        reason: params.reason || "Administrative Refund",
        ...params.notes,
      },
    });

    if (!ref || !ref.id) {
      return { success: false, error: "Gateway did not return refund confirmation ID." };
    }

    const normalized: NormalizedProviderRefund = {
      id: ref.id,
      paymentId: ref.payment_id || params.paymentId,
      amountMinor: Number(ref.amount),
      currency: ref.currency || "INR",
      status: ref.status === "processed" ? "processed" : "pending",
      speedProcessed: ref.speed_processed,
      receipt: ref.receipt || null,
      createdAt: new Date((ref.created_at || Math.floor(Date.now() / 1000)) * 1000).toISOString(),
    };

    return { success: true, refund: normalized };
  } catch (err: unknown) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const errObj = err as any;
    const msg =
      errObj?.error?.description ||
      errObj?.description ||
      (err instanceof Error ? err.message : "Razorpay refund execution failed.");
    console.error(`[createRazorpayRefund error for ${params.paymentId}]:`, errObj);
    return { success: false, error: msg };
  }
}
