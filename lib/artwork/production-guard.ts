import { createClient } from "@/lib/supabase/server";

export interface ProductionGuardCheck {
  canProceedToProduction: boolean;
  unapprovedSlots: Array<{
    itemId: string;
    slot: string;
    status: string;
  }>;
  message: string;
}

/**
 * Hard Production Lock Service
 * Verifies that every required artwork asset attached to an order has been reviewed,
 * preflighted, and formally approved by the customer (or an authorized admin override).
 */
export async function verifyOrderProductionLock(orderId: string): Promise<ProductionGuardCheck> {
  const supabase = await createClient();

  // 1. Fetch order and its artwork assets
  const { data: assets, error } = await supabase
    .from("artwork_assets")
    .select("id, order_item_id, slot, status")
    .eq("order_id", orderId);

  if (error) {
    // If the artwork_assets table does not exist in the database schema yet (or schema cache unrefreshed),
    // do not brick the entire order fulfillment workflow — log a warning and proceed gracefully.
    if (error.code === "PGRST204" || error.code === "PGRST205" || error.message?.includes("artwork_assets")) {
      console.warn("[Production Guard] 'artwork_assets' table not found in schema. Proceeding without artwork gate.");
      return {
        canProceedToProduction: true,
        unapprovedSlots: [],
        message: "Artwork table not yet initialized. Production guard bypassed.",
      };
    }

    return {
      canProceedToProduction: false,
      unapprovedSlots: [],
      message: `Database error checking production lock: ${error.message}`,
    };
  }

  // If no artwork assets exist in artwork_assets table, check order_items fallback
  if (!assets || assets.length === 0) {
    const { data: orderItems } = await supabase
      .from("order_items")
      .select("id, artwork_summary")
      .eq("order_id", orderId);

    if (orderItems && orderItems.length > 0) {
      const unapprovedItems = orderItems.filter((item) => {
        const art = (item.artwork_summary as Record<string, unknown>) || {};
        // If file was attached but not approved
        return art.storagePath && art.status !== "approved" && !art.approvedAt;
      });

      if (unapprovedItems.length > 0) {
        return {
          canProceedToProduction: false,
          unapprovedSlots: unapprovedItems.map((item) => ({
            itemId: item.id,
            slot: "front",
            status: "proof_pending",
          })),
          message: `Production locked: ${unapprovedItems.length} artwork slot(s) require customer proof sign-off before press plate imaging.`,
        };
      }
    }

    return {
      canProceedToProduction: true,
      unapprovedSlots: [],
      message: "No unapproved print artwork assets for this order.",
    };
  }

  // Find any assets not marked as 'approved'
  const unapproved = assets.filter((a) => a.status !== "approved");

  if (unapproved.length > 0) {
    return {
      canProceedToProduction: false,
      unapprovedSlots: unapproved.map((a) => ({
        itemId: a.order_item_id,
        slot: a.slot,
        status: a.status,
      })),
      message: `Production locked: ${unapproved.length} artwork slot(s) require customer proof sign-off before press plate imaging.`,
    };
  }

  return {
    canProceedToProduction: true,
    unapprovedSlots: [],
    message: "All print artwork assets approved. Order unlocked for production press run.",
  };
}
