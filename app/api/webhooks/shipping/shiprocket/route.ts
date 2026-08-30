import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import crypto from "crypto";
import type { CanonicalShipmentStatus } from "@/lib/shipping/types";

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const payload = JSON.parse(rawBody || "{}");

    // 1. Compute deterministic payload hash
    const payloadHash = crypto.createHash("sha256").update(rawBody).digest("hex");

    const supabase = await createClient();

    // 2. Fetch Shiprocket carrier ID
    const { data: carrier } = await supabase
      .from("shipping_carriers")
      .select("id")
      .eq("code", "shiprocket")
      .single();

    if (!carrier) {
      return NextResponse.json({ error: "Shiprocket carrier not found" }, { status: 404 });
    }

    // 3. Record webhook receipt idempotently
    const { data: receipt, error: receiptErr } = await supabase
      .from("shipping_webhook_receipts")
      .insert({
        carrier_id: carrier.id,
        webhook_event_id: String(payload.shipment_id || payload.awb || payloadHash.slice(0, 16)),
        payload_hash: payloadHash,
        signature_verified: true,
        processing_status: "processed",
        provider_reference: String(payload.awb || ""),
        raw_payload_redacted: payload,
      })
      .select()
      .single();

    if (receiptErr) {
      // Duplicate delivery acknowledged safely with 200 OK
      return NextResponse.json({ success: true, message: "Duplicate webhook acknowledged." });
    }

    // 4. Update corresponding shipment if present
    const awb = payload.awb || payload.awb_code;
    if (awb) {
      const { data: shipment } = await supabase
        .from("shipping_shipments")
        .select("id, shipment_status")
        .eq("awb_number", awb)
        .single();

      if (shipment) {
        const rawStatus = String(payload.current_status || payload.status || "IN_TRANSIT").toUpperCase();
        let canonical: CanonicalShipmentStatus = "in_transit";
        if (rawStatus.includes("DELIVERED") || rawStatus === "7") canonical = "delivered";
        if (rawStatus.includes("OUT FOR DELIVERY") || rawStatus === "17") canonical = "out_for_delivery";
        if (rawStatus.includes("PICKED") || rawStatus === "19") canonical = "picked_up";
        if (rawStatus.includes("UNDELIVERED") || rawStatus === "13") canonical = "ndr";

        // Append tracking scan
        await supabase.from("shipping_tracking_events").insert({
          shipment_id: shipment.id,
          carrier_id: carrier.id,
          provider_status: rawStatus,
          canonical_status: canonical,
          event_description: payload.activity || `Status update: ${rawStatus}`,
          event_timestamp: payload.date ? new Date(payload.date).toISOString() : new Date().toISOString(),
          locationCity: payload.location || null,
          source: "webhook",
          raw_payload_hash: payloadHash,
          is_customer_visible: true,
        });

        // Update shipment projection (prevent regression if already delivered)
        if (shipment.shipment_status !== "delivered") {
          await supabase
            .from("shipping_shipments")
            .update({
              shipment_status: canonical,
              updated_at: new Date().toISOString(),
            })
            .eq("id", shipment.id);
        }
      }
    }

    return NextResponse.json({ success: true, receiptId: receipt?.id });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Webhook processing error" },
      { status: 400 }
    );
  }
}
