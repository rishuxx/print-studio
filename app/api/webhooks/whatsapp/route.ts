import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAuthoritativeWhatsAppConfig } from "@/lib/whatsapp/queries";

/**
 * Official Meta WhatsApp Cloud API Webhook Receiver
 * - GET: Webhook verification challenge
 * - POST: Delivery status updates (sent, delivered, read, failed)
 * Explicitly strictly rejects inbound user messaging / chatbots to adhere to Scope Section 109.
 */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get("hub.mode");
    const token = searchParams.get("hub.verify_token");
    const challenge = searchParams.get("hub.challenge");

    const { config } = await getAuthoritativeWhatsAppConfig();
    const expectedToken =
      config.webhook_verify_token ||
      process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN ||
      "preetyprints_meta_webhook_verify_token_2026";

    if (mode === "subscribe" && token === expectedToken) {
      return new NextResponse(challenge || "", { status: 200 });
    }

    return NextResponse.json({ error: "Verification token mismatch." }, { status: 403 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Webhook verification error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      entry?: Array<{
        changes?: Array<{
          value?: {
            statuses?: Array<{
              id: string; // provider message id
              status: "sent" | "delivered" | "read" | "failed";
              timestamp: string;
              recipient_id: string;
              errors?: Array<{ code: number; title: string; message: string }>;
            }>;
            messages?: Array<{ id: string }>; // strictly discarded
          };
        }>;
      }>;
    };

    const supabase = await createClient();

    const changes = body.entry?.[0]?.changes?.[0]?.value;
    const statuses = changes?.statuses || [];

    for (const st of statuses) {
      const providerMsgId = st.id;
      const statusUpper = st.status.toUpperCase(); // 'SENT' | 'DELIVERED' | 'READ' | 'FAILED'
      const timestampIso = new Date(parseInt(st.timestamp, 10) * 1000).toISOString();

      const updateData: Record<string, unknown> = {
        status: statusUpper,
      };

      if (statusUpper === "DELIVERED") {
        updateData.delivered_at = timestampIso;
      } else if (statusUpper === "FAILED") {
        updateData.failed_at = timestampIso;
        updateData.error_code = `META_WEBHOOK_${st.errors?.[0]?.code || "FAIL"}`;
        updateData.error_message_safe = st.errors?.[0]?.message || st.errors?.[0]?.title || "Meta webhook delivery failure";
      }

      // Update whatsapp_outbox table
      await supabase
        .from("whatsapp_outbox")
        .update(updateData)
        .eq("provider_message_id", providerMsgId);

      // Mirror into public.notifications table if matched
      if (statusUpper === "DELIVERED" || statusUpper === "FAILED") {
        await supabase
          .from("notifications")
          .update({
            delivered_at: statusUpper === "DELIVERED" ? timestampIso : null,
            status: statusUpper === "DELIVERED" ? "SENT" : "FAILED_PERMANENT",
          })
          .eq("provider_message_id", providerMsgId);
      }
    }

    return NextResponse.json({ success: true, processedCount: statuses.length });
  } catch (err) {
    console.error("[WhatsApp Webhook error]:", err);
    return NextResponse.json({ success: false, error: "Internal processing error" }, { status: 500 });
  }
}
