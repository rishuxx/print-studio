import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getRazorpayClient } from "@/lib/payments/razorpay-server";
import { recalculateAuthoritativeCartTotal } from "@/lib/payments/server-calculator";
import { getAuthoritativeBusinessSettings } from "@/lib/settings/queries";
import type { Database } from "@/lib/supabase/database.types";

export async function POST(request: NextRequest) {
  try {
    // Check authoritative store operational & maintenance status
    const settings = await getAuthoritativeBusinessSettings();
    if (settings.store_status === "PAUSED" || !settings.checkout_enabled || !settings.accept_new_orders) {
      return NextResponse.json(
        {
          success: false,
          error: settings.store_pause_message || "The storefront is currently undergoing scheduled maintenance and not accepting new orders.",
        },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { draftCheckout, lines, discount, clientTotalPaise } = body;

    if (!draftCheckout || !lines || !Array.isArray(lines) || lines.length === 0) {
      return NextResponse.json(
        { success: false, error: "Invalid checkout payload or empty cart." },
        { status: 400 }
      );
    }

    // 1. Authoritative server-side price recalculation with applied promotion/discount
    const recalc = await recalculateAuthoritativeCartTotal(lines, discount);
    if (!recalc.valid) {
      return NextResponse.json(
        { success: false, error: recalc.error || "Unable to recalculate cart pricing." },
        { status: 400 }
      );
    }

    // 2. Anti-tampering check: verify that client claimed total matches server total
    if (clientTotalPaise && Math.abs(clientTotalPaise - recalc.totalPaise) > 10) {
      return NextResponse.json(
        {
          success: false,
          error: "Cart total mismatch detected. Please refresh your checkout summary.",
        },
        { status: 400 }
      );
    }

    const minOrderPaise = settings.minimum_order_value_minor ?? 10000;
    const maxOrderPaise = settings.maximum_order_value_minor ?? 50000000;

    if (recalc.totalPaise < minOrderPaise) {
      return NextResponse.json(
        {
          success: false,
          code: "ORDER_BELOW_MINIMUM",
          error: `Minimum order value is ₹${(minOrderPaise / 100).toFixed(2)}. Please add more items to your cart.`,
        },
        { status: 400 }
      );
    }

    if (recalc.totalPaise > maxOrderPaise) {
      return NextResponse.json(
        {
          success: false,
          code: "ORDER_ABOVE_MAXIMUM",
          error: `Order total exceeds maximum allowable limit of ₹${(maxOrderPaise / 100).toFixed(2)}.`,
        },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Mandatory Authentication Check: Guest Checkout is DISABLED
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          code: "AUTHENTICATION_REQUIRED",
          error: "Authentication required. Please sign in or create an account to proceed with checkout.",
        },
        { status: 401 }
      );
    }

    // 3. Generate unique business identifiers
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `PRT-${new Date().getFullYear()}-${randomSuffix}`;
    const invoiceNumber = `INV-${new Date().getFullYear()}-${randomSuffix}`;

    // 4. Create business order in PostgreSQL with status 'pending' and payment_status 'pending'
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        invoice_number: invoiceNumber,
        user_id: user?.id || null,
        status: "pending",
        payment_status: "pending",
        payment_method: "razorpay",
        payment_reference: null,
        subtotal: recalc.subtotalPaise / 100,
        tax: recalc.taxPaise / 100,
        shipping: recalc.shippingPaise / 100,
        discount: recalc.discountPaise / 100,
        total: recalc.totalPaise / 100,
        customer_snapshot: draftCheckout.customer,
        delivery_snapshot: draftCheckout.delivery,
        notes: draftCheckout.delivery.notes || null,
      })
      .select("id")
      .single();

    if (orderError || !orderData) {
      return NextResponse.json(
        { success: false, error: orderError?.message || "Failed to initialize order." },
        { status: 500 }
      );
    }

    const internalOrderId = orderData.id;

    // 5. Insert order items
    const itemRows = lines.map((l: {
      productId: string;
      productTitle: string;
      variantId?: string;
      quantity: number;
      unitPrice: { amount: number };
      linePrice: { amount: number };
      selectedOptions?: unknown;
      design?: { state?: string; summary?: string };
    }) => {
      let artworkSummaryObj: Record<string, unknown> | null = null;
      if (l.design?.state) {
        try {
          const parsed = JSON.parse(l.design.state);
          if (parsed.storagePath) {
            artworkSummaryObj = {
              summary: l.design?.summary || `Artwork: ${parsed.originalFileName}`,
              storagePath: parsed.storagePath,
              originalFileName: parsed.originalFileName,
              mimeType: parsed.mimeType,
              fileSizeBytes: parsed.fileSizeBytes,
              uploadedAt: parsed.uploadedAt,
              requiresProof: true,
            };
          } else if (parsed.artworkMetadata) {
            artworkSummaryObj = {
              summary: l.design.summary,
              ...parsed.artworkMetadata,
            };
          }
        } catch {
          // Ignore
        }
      }
      if (!artworkSummaryObj && l.design?.summary) {
        artworkSummaryObj = { summary: l.design.summary };
      }

      return {
        order_id: internalOrderId,
        product_id: l.productId,
        product_title: l.productTitle,
        sku: l.variantId || null,
        quantity: l.quantity,
        unit_price: l.unitPrice.amount / 100,
        line_price: l.linePrice.amount / 100,
        selected_options: (l.selectedOptions as Database["public"]["Tables"]["order_items"]["Insert"]["selected_options"]) ?? [],
        artwork_summary: (artworkSummaryObj as Database["public"]["Tables"]["order_items"]["Insert"]["artwork_summary"]) ?? null,
      };
    });

    await supabase.from("order_items").insert(itemRows);

    // 6. Create Razorpay Order via SDK
    const razorpay = getRazorpayClient();
    const razorpayOrder = await razorpay.orders.create({
      amount: recalc.totalPaise,
      currency: "INR",
      receipt: orderNumber,
      notes: {
        internalOrderId,
        orderNumber,
        customerEmail: draftCheckout.customer.email || "",
      },
    });

    if (!razorpayOrder || !razorpayOrder.id) {
      throw new Error("Razorpay gateway order creation failed.");
    }

    // 7. Store payment transaction record in PostgreSQL
    await supabase.from("payments").insert({
      order_id: internalOrderId,
      provider: "razorpay",
      provider_order_id: razorpayOrder.id,
      provider_payment_id: null,
      status: "created",
      amount: recalc.totalPaise,
      currency: "INR",
      method: null,
      metadata: {
        razorpay_order_id: razorpayOrder.id,
        receipt: orderNumber,
      },
    });

    // 8. Record initial timeline event
    await supabase.from("order_events").insert({
      order_id: internalOrderId,
      status: "order_placed",
      title: "Order Placed & Checkout Initiated",
      description: `Order registered in system. Razorpay payment order ${razorpayOrder.id} initialized for ₹${(recalc.totalPaise / 100).toFixed(2)}.`,
    });

    // 9. Return safe client response (Public Key ID only, NO SECRET)
    return NextResponse.json({
      success: true,
      razorpayKeyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID,
      razorpayOrderId: razorpayOrder.id,
      amount: recalc.totalPaise,
      currency: "INR",
      orderNumber,
      internalOrderId,
      isTestMode: process.env.RAZORPAY_KEY_ID?.startsWith("rzp_test_"),
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Payment initialization failed.";
    console.error("[Razorpay create-order error]:", err);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
