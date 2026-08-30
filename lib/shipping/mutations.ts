"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdminAuth } from "@/lib/supabase/admin-guard";
import { getCarrierAdapter } from "./carriers/registry";
import type { CreateShipmentInput, CanonicalShipmentStatus } from "./types";
import crypto from "crypto";

export interface ShipmentActionResult {
  success: boolean;
  shipmentId?: string;
  awbNumber?: string;
  error?: string;
}

/**
 * Creates a shipment for an order, invokes carrier adapter to allocate AWB,
 * persists the initial tracking event, and updates order status.
 */
export async function createOrderShipmentAction(
  input: CreateShipmentInput
): Promise<ShipmentActionResult> {
  try {
    await requireAdminAuth("/admin/shipping");
    const supabase = await createClient();

    // 1. Fetch target order (accepts either Order Number like 'PRT-2026-2945' or UUID)
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(input.order_id.trim());

    let orderQuery = supabase.from("orders").select("*");
    if (isUuid) {
      orderQuery = orderQuery.eq("id", input.order_id.trim());
    } else {
      orderQuery = orderQuery.eq("order_number", input.order_id.trim());
    }

    const { data: order, error: orderErr } = await orderQuery.maybeSingle();

    if (orderErr || !order) {
      return { success: false, error: `Order '${input.order_id}' was not found in the database.` };
    }

    // 2. Fetch carrier record (with automatic self-healing fallback)
    const { data: existingCarrier } = await supabase
      .from("shipping_carriers")
      .select("*")
      .eq("code", input.carrier_code)
      .maybeSingle();

    let carrier = existingCarrier;

    if (!carrier) {
      const { data: newCarrier } = await supabase
        .from("shipping_carriers")
        .insert({
          code: input.carrier_code,
          name:
            input.carrier_code === "shiprocket"
              ? "Shiprocket Fulfillment"
              : input.carrier_code === "delhivery"
              ? "Delhivery Express"
              : input.carrier_code === "bluedart"
              ? "Blue Dart Express"
              : "Development Sandbox Carrier",
          provider_type: input.carrier_code === "fake" ? "sandbox" : "aggregator",
          enabled: true,
          environment: input.carrier_code === "fake" ? "sandbox" : "production",
        })
        .select()
        .single();

      carrier = newCarrier;
    }

    if (!carrier) {
      return { success: false, error: `Carrier '${input.carrier_code}' is not ready in database.` };
    }

    // 3. Resolve shipping address
    const shippingAddr = (order.shipping_address as Record<string, unknown>) || {};
    const recipientName = String(shippingAddr.recipient_name || shippingAddr.full_name || "Valued Customer");
    const recipientPhone = String(shippingAddr.phone || "9999999999");
    const addressLine1 = String(shippingAddr.address_line_1 || shippingAddr.line1 || "Customer Address");
    const addressLine2 = String(shippingAddr.address_line_2 || shippingAddr.line2 || "");
    const city = String(shippingAddr.city || "Dehradun");
    const state = String(shippingAddr.state || "Uttarakhand");
    const pincode = String(shippingAddr.postal_code || shippingAddr.pincode || "248007");

    // 4. Invoke carrier adapter
    const adapter = getCarrierAdapter(input.carrier_code);
    const carrierRes = await adapter.createShipment({
      orderNumber: order.order_number,
      recipientName,
      recipientPhone,
      addressLine1,
      addressLine2,
      city,
      state,
      pincode,
      weightGrams: input.weight_grams || 500,
      dimensions: {
        lengthMm: input.length_mm || 200,
        widthMm: input.width_mm || 150,
        heightMm: input.height_mm || 50,
      },
      itemCount: 1,
    });

    if (!carrierRes.success || !carrierRes.awbNumber) {
      return { success: false, error: carrierRes.error || "Carrier failed to generate AWB." };
    }

    // 5. Insert authoritative shipment record
    const { data: shipment, error: shipErr } = await supabase
      .from("shipping_shipments")
      .insert({
        order_id: order.id,
        customer_id: order.user_id || null,
        carrier_id: carrier.id,
        awb_number: carrierRes.awbNumber,
        provider_shipment_id: carrierRes.providerShipmentId || null,
        provider_order_id: carrierRes.providerOrderId || null,
        label_url: carrierRes.labelUrl || null,
        tracking_url: carrierRes.trackingUrl || null,
        shipment_status: "manifested" as CanonicalShipmentStatus,
        estimated_delivery_at: carrierRes.estimatedDeliveryAt || null,
        package_count: input.package_count || 1,
        weight_grams: input.weight_grams || 500,
        length_mm: input.length_mm || 200,
        width_mm: input.width_mm || 150,
        height_mm: input.height_mm || 50,
        origin_snapshot: {
          name: "Print Studio Production Facility",
          city: "Dehradun",
          state: "Uttarakhand",
          pincode: "248007",
        },
        destination_snapshot: {
          recipient_name: recipientName,
          phone_masked: recipientPhone.slice(0, 3) + "•••••" + recipientPhone.slice(-2),
          address_line_1: addressLine1,
          address_line_2: addressLine2,
          city,
          state,
          postal_code: pincode,
        },
      })
      .select("id")
      .single();

    if (shipErr || !shipment) {
      return { success: false, error: shipErr?.message || "Failed to persist shipment record." };
    }

    // 6. Insert initial tracking event
    const hash = crypto.createHash("sha256").update(`${shipment.id}:manifested:${Date.now()}`).digest("hex");
    await supabase.from("shipping_tracking_events").insert({
      shipment_id: shipment.id,
      carrier_id: carrier.id,
      provider_status: "MANIFEST_GENERATED",
      canonical_status: "manifested",
      event_description: "Waybill generated and consignment manifested with courier partner.",
      event_timestamp: new Date().toISOString(),
      location_city: "Dehradun Hub",
      location_state: "Uttarakhand",
      location_pincode: "248007",
      source: "system",
      raw_payload_hash: hash,
      is_customer_visible: true,
    });

    // 7. Update parent order status to in_production/shipped
    await supabase
      .from("orders")
      .update({ status: "in_production", updated_at: new Date().toISOString() })
      .eq("id", order.id);

    // 8. Revalidate routes
    revalidatePath("/admin/shipping");
    revalidatePath(`/admin/orders/${order.id}`);
    revalidatePath(`/orders/${order.id}`);
    revalidatePath("/orders");

    return {
      success: true,
      shipmentId: shipment.id,
      awbNumber: carrierRes.awbNumber,
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to create shipment",
    };
  }
}

/**
 * Manually refreshes tracking state by polling the active carrier API.
 */
export async function refreshShipmentTrackingAction(
  shipmentId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    const { data: shipment, error } = await supabase
      .from("shipping_shipments")
      .select("*, carrier:shipping_carriers(code)")
      .eq("id", shipmentId)
      .single();

    if (error || !shipment) {
      return { success: false, error: "Shipment not found" };
    }

    const carrierCode = shipment.carrier?.code || "fake";
    const adapter = getCarrierAdapter(carrierCode);
    const trackingRes = await adapter.trackShipment(shipment.awb_number);

    // Append new scans idempotently
    for (const scan of trackingRes.scans) {
      const hash = crypto
        .createHash("sha256")
        .update(`${shipment.id}:${scan.providerStatus}:${scan.timestamp}:${scan.locationCity || ""}`)
        .digest("hex");

      await supabase
        .from("shipping_tracking_events")
        .insert({
          shipment_id: shipment.id,
          carrier_id: shipment.carrier_id,
          provider_status: scan.providerStatus,
          canonical_status: scan.canonicalStatus,
          event_description: scan.description,
          event_timestamp: scan.timestamp,
          location_city: scan.locationCity || null,
          location_state: scan.locationState || null,
          location_pincode: scan.locationPincode || null,
          source: "poll",
          raw_payload_hash: hash,
          is_customer_visible: true,
        })
        .select()
        .single();
    }

    // Update shipment canonical status
    await supabase
      .from("shipping_shipments")
      .update({
        shipment_status: trackingRes.canonicalStatus,
        last_polled_at: new Date().toISOString(),
        poll_attempt_count: (shipment.poll_attempt_count || 0) + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("id", shipment.id);

    revalidatePath("/admin/shipping");
    revalidatePath(`/admin/shipping/${shipmentId}`);
    revalidatePath(`/orders/${shipment.order_id}`);

    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to refresh tracking",
    };
  }
}
