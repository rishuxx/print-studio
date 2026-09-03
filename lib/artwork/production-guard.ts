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
    return {
      canProceedToProduction: false,
      unapprovedSlots: [],
      message: `Database error checking production lock: ${error.message}`,
    };
  }

  // If no artwork assets exist (e.g. standard off-the-shelf catalog item with no print required)
  if (!assets || assets.length === 0) {
    return {
      canProceedToProduction: true,
      unapprovedSlots: [],
      message: "No custom print artwork assets required for this order.",
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
