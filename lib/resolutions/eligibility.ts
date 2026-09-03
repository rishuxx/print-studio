import { createClient } from "@/lib/supabase/server";
import { STUDIO_RESOLUTION_POLICY, isDefectOrCarrierDamage } from "./policy";
import type { EligibilityResult, ResolutionReasonCode, ResolutionType } from "./types";

export interface EvaluateEligibilityParams {
  orderId: string;
  orderItemId?: string;
  reasonCode?: ResolutionReasonCode;
}

/**
 * Server-Side Authoritative Eligibility Engine:
 * Evaluates delivered timestamp, custom product flags, active requests, and policy windows.
 * The browser client is NEVER trusted for eligibility.
 */
export async function evaluateResolutionEligibility(
  params: EvaluateEligibilityParams
): Promise<EligibilityResult> {
  const supabase = await createClient();

  // 1. Fetch Order and Items
  const { data: order, error } = await supabase
    .from("orders")
    .select(`
      id,
      order_number,
      status,
      payment_status,
      created_at,
      order_items(id, product_title, artwork_summary, selected_options)
    `)
    .eq("id", params.orderId)
    .single();

  if (error || !order) {
    return {
      isEligible: false,
      requiresReview: false,
      reasonCode: "ORDER_NOT_FOUND",
      message: "Target order reference was not found in the database.",
      allowedResolutionTypes: [],
      isCustomProduct: true,
      daysSinceDelivery: 0,
    };
  }

  // 2. Check Order Status
  // Eligible statuses: 'delivered', or 'shipped'/'out_for_delivery' if carrier damage / missing package reported
  const isDelivered = order.status === "delivered";
  const isInTransit = order.status === "shipped" || order.status === "out_for_delivery";

  if (!isDelivered && !isInTransit) {
    return {
      isEligible: false,
      requiresReview: false,
      reasonCode: "NOT_DELIVERED",
      message: `Post-delivery resolutions apply only to delivered orders (current status: ${order.status.replace(/_/g, " ").toUpperCase()}). For pending or unprinted orders, please use order cancellation or pre-press proof revisions.`,
      allowedResolutionTypes: [],
      isCustomProduct: true,
      daysSinceDelivery: 0,
    };
  }

  // 3. Resolve Delivery Timestamp from Carrier Shipment Events
  const { data: shipments } = await supabase
    .from("shipping_shipments")
    .select("created_at, updated_at, shipment_status, shipping_events(status, created_at)")
    .eq("order_id", params.orderId)
    .order("created_at", { ascending: false });

  let deliveryDate: Date = new Date(order.created_at);
  if (shipments && shipments.length > 0) {
    const deliveredShipment = shipments.find((s) => s.shipment_status === "delivered");
    if (deliveredShipment) {
      deliveryDate = new Date(deliveredShipment.updated_at || deliveredShipment.created_at);
    }
  }

  const msDiff = Date.now() - deliveryDate.getTime();
  const daysSinceDelivery = Math.max(0, Math.floor(msDiff / (1000 * 60 * 60 * 24)));

  // 4. Determine if order contains custom-printed products
  const isCustomProduct = order.order_items.some((item: any) => {
    const opts = item.selected_options as any;
    return Boolean(
      item.artwork_summary?.storagePath ||
      opts?.configurationSnapshot?.productionSpecification?.artworkRequired
    );
  });

  // 5. Check if active resolution request already exists
  const { data: existingActive } = await supabase
    .from("resolution_requests")
    .select("id, request_number, status")
    .eq("order_id", params.orderId)
    .not("status", "in", '("resolved","closed","cancelled","rejected")')
    .maybeSingle();

  if (existingActive) {
    return {
      isEligible: false,
      requiresReview: false,
      reasonCode: "ACTIVE_REQUEST_EXISTS",
      message: `An active resolution request (#${existingActive.request_number} — ${existingActive.status.toUpperCase()}) is already open for this order. Our team is actively reviewing your case.`,
      allowedResolutionTypes: [],
      isCustomProduct,
      daysSinceDelivery,
      deliveryDate: deliveryDate.toISOString(),
    };
  }

  // 6. Policy Evaluation
  const reason = params.reasonCode || "defective";
  const isDefect = isDefectOrCarrierDamage(reason);

  // Custom products: Remorse is completely barred
  if (isCustomProduct && !isDefect) {
    return {
      isEligible: false,
      requiresReview: false,
      reasonCode: "CUSTOM_PRODUCT_NON_RETURNABLE",
      message: "Custom-manufactured products printed to client-approved specifications cannot be returned for change of mind or personal preference.",
      allowedResolutionTypes: [],
      isCustomProduct,
      daysSinceDelivery,
      deliveryDate: deliveryDate.toISOString(),
    };
  }

  // Window Check: 7 days from delivery
  const windowDays = isDefect ? STUDIO_RESOLUTION_POLICY.defectWindowDays : STUDIO_RESOLUTION_POLICY.remorseWindowDays;
  if (daysSinceDelivery > windowDays) {
    return {
      isEligible: false,
      requiresReview: true,
      reasonCode: "RETURN_WINDOW_EXPIRED",
      message: `The standard ${windowDays}-day post-delivery resolution window has expired (${daysSinceDelivery} days elapsed). You may submit for supervisor discretionary review.`,
      allowedResolutionTypes: ["replacement", "partial_refund"],
      isCustomProduct,
      daysSinceDelivery,
      deliveryDate: deliveryDate.toISOString(),
    };
  }

  // Eligible!
  const allowedTypes: ResolutionType[] = isCustomProduct
    ? ["replacement", "partial_refund", "refund", "store_credit"]
    : ["return_and_refund", "replacement", "refund", "store_credit"];

  return {
    isEligible: true,
    requiresReview: true,
    reasonCode: "ELIGIBLE_FOR_REVIEW",
    message: "Order is within the valid resolution window. Please provide defect photographs and description.",
    allowedResolutionTypes: allowedTypes,
    isCustomProduct,
    daysSinceDelivery,
    deliveryDate: deliveryDate.toISOString(),
  };
}
