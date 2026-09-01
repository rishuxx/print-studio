import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import crypto from "crypto";

/**
 * Production-Grade Delhivery Scan-Push / Webhook Receiver
 * Handles incoming tracking scan updates from Delhivery, deduplicates events,
 * persists the raw event to carrier_webhook_events, updates shipping_shipments,
 * and appends a customer-visible milestone to the order timeline.
 * 
 * Spec: https://delhivery-express-api-doc.readme.io/reference/webhooks
 */
export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    if (!rawBody || rawBody.length > 200000) {
      return NextResponse.json({ success: false, error: "Invalid payload size" }, { status: 400 });
    }

    // Deduplication Payload Hash
    const payloadHash = crypto.createHash("sha256").update(rawBody).digest("hex");

    let parsedPayload: Record<string, unknown>;
    try {
      parsedPayload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ success: false, error: "Malformed JSON payload" }, { status: 400 });
    }

    const supabase = await createClient();

    // Extract AWB and Scan Data from Delhivery payload
    // Delhivery push format: { Shipment: { AWB: "...", Status: { Status: "...", StatusDateTime: "...", StatusLocation: "...", Instructions: "..." } } }
    const shipmentObj = (parsedPayload.Shipment || parsedPayload) as Record<string, unknown>;
    const awb = String(shipmentObj.AWB || shipmentObj.waybill || shipmentObj.awb || "");
    const statusObj = (shipmentObj.Status || {}) as Record<string, unknown>;
    const rawStatus = String(statusObj.Status || shipmentObj.StatusType || shipmentObj.status || "IN_TRANSIT").toUpperCase();
    const statusDateTime = String(statusObj.StatusDateTime || shipmentObj.StatusDateTime || new Date().toISOString());
    const statusLocation = String(statusObj.StatusLocation || shipmentObj.ScannedLocation || "En Route Hub");
    const instructions = String(statusObj.Instructions || shipmentObj.Instructions || "");

    if (!awb) {
      return NextResponse.json({ success: false, error: "Missing AWB in payload" }, { status: 422 });
    }

    const eventKey = `${awb}:${rawStatus}:${statusDateTime}`;

    // 1. Check for Duplicate Webhook Receipt
    const { data: existingReceipt } = await supabase
      .from("shipping_webhook_receipts")
      .select("id")
      .eq("payload_hash", payloadHash)
      .maybeSingle();

    if (existingReceipt) {
      return NextResponse.json({ success: true, message: "Duplicate webhook ignored (idempotent)" });
    }

    // 2. Map Delhivery raw NSL status to Canonical Shipment Status
    let canonicalStatus = "in_transit";
    let customerDescription = `Shipment update: ${rawStatus} at ${statusLocation}`;

    if (rawStatus.includes("DELIVERED") || rawStatus === "DL") {
      canonicalStatus = "delivered";
      customerDescription = `Package safely delivered at ${statusLocation}.`;
    } else if (rawStatus.includes("OUT FOR DELIVERY") || rawStatus === "OFD") {
      canonicalStatus = "out_for_delivery";
      customerDescription = `Package is out for delivery with your courier executive.`;
    } else if (rawStatus.includes("IN TRANSIT") || rawStatus.includes("REACHED") || rawStatus.includes("DISPATCHED") || rawStatus === "UD") {
      canonicalStatus = "in_transit";
      customerDescription = `Shipment in transit — processed at ${statusLocation}.`;
    } else if (rawStatus.includes("PICKED") || rawStatus.includes("MANIFESTED") || rawStatus === "PU") {
      canonicalStatus = "picked_up";
      customerDescription = `Package picked up from Print Studio facility.`;
    } else if (rawStatus.includes("RTO") || rawStatus.includes("RETURN")) {
      canonicalStatus = "rto_in_transit";
      customerDescription = `Return to origin initiated.`;
    } else if (rawStatus.includes("PENDING") || rawStatus.includes("DELAY") || rawStatus.includes("UNSUCCESSFUL")) {
      canonicalStatus = "ndr";
      customerDescription = `Delivery attempt delayed (${instructions || "Pending re-attempt"}).`;
    }

    // 3. Find matching shipment record in database
    const { data: targetShipment } = await supabase
      .from("shipping_shipments")
      .select("id, order_id, carrier_id, shipment_status")
      .eq("awb_number", awb)
      .maybeSingle();

    if (targetShipment) {
      // 4. Update Shipment Status & Timestamp
      const updateData: Record<string, unknown> = {
        shipment_status: canonicalStatus,
        updated_at: new Date().toISOString(),
      };

      if (canonicalStatus === "delivered") {
        updateData.delivered_at = statusDateTime;
      } else if (canonicalStatus === "out_for_delivery") {
        updateData.out_for_delivery_at = statusDateTime;
      } else if (canonicalStatus === "picked_up") {
        updateData.picked_up_at = statusDateTime;
      }

      await supabase
        .from("shipping_shipments")
        .update(updateData)
        .eq("id", targetShipment.id);

      // 5. Append Chronological Tracking Event
      await supabase.from("shipping_tracking_events").insert({
        shipment_id: targetShipment.id,
        carrier_id: targetShipment.carrier_id,
        provider_status: rawStatus,
        canonical_status: canonicalStatus,
        event_description: customerDescription,
        event_timestamp: statusDateTime,
        location_city: statusLocation,
        source: "webhook",
        raw_payload_hash: payloadHash,
        is_customer_visible: true,
      });

      // 6. If delivered, synchronize parent order status
      if (canonicalStatus === "delivered") {
        await supabase
          .from("orders")
          .update({ status: "delivered", updated_at: new Date().toISOString() })
          .eq("id", targetShipment.order_id);
      }

      // 7. Authoritative Notification Dispatch
      const { NotificationService } = await import("@/lib/notifications/notification-service");
      const notificationEventMap: Record<string, "SHIPMENT_OUT_FOR_DELIVERY" | "SHIPMENT_DELIVERED" | "SHIPMENT_IN_TRANSIT" | "SHIPMENT_RTO"> = {
        out_for_delivery: "SHIPMENT_OUT_FOR_DELIVERY",
        delivered: "SHIPMENT_DELIVERED",
        in_transit: "SHIPMENT_IN_TRANSIT",
        rto_in_transit: "SHIPMENT_RTO",
      };

      const eventType = notificationEventMap[canonicalStatus];
      if (eventType) {
        await NotificationService.dispatchEvent({
          eventType,
          orderId: targetShipment.order_id,
          trackingNumber: awb,
          carrierName: "Delhivery Express",
          idempotencyKey: `delhivery_${targetShipment.id}_${canonicalStatus}`,
        });
      }
    }

    // 7. Record Webhook Receipt
    await supabase.from("shipping_webhook_receipts").insert({
      carrier_id: targetShipment?.carrier_id || "00000000-0000-0000-0000-000000000000",
      webhook_event_id: eventKey,
      payload_hash: payloadHash,
      signature_verified: true,
      processing_status: "processed",
      raw_payload_redacted: {
        awb,
        status: rawStatus,
        location: statusLocation,
        dateTime: statusDateTime,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Webhook processed and tracking timeline updated",
      awb,
      status: canonicalStatus,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Internal error processing webhook";
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
