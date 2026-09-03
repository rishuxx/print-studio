import { createClient } from "@/lib/supabase/server";

export interface InventoryMovement {
  id: string;
  productId: string;
  variantId: string;
  quantity: number;
  movementType: 'PURCHASE' | 'RESERVATION' | 'RELEASE' | 'SALE' | 'RESTOCK' | 'ADJUSTMENT' | 'RETURN' | 'CANCELLATION';
  referenceId?: string;
  reason?: string;
  actorId?: string;
  createdAt: string;
}

export interface InventoryReservationResult {
  success: boolean;
  reserved: boolean;
  variantId: string;
  requestedQuantity: number;
  message?: string;
}

export class InventoryService {
  /**
   * Reserves inventory atomically via PostgreSQL function.
   */
  static async reserveInventory(
    variantId: string, 
    quantity: number, 
    referenceId: string, 
    actorId?: string
  ): Promise<InventoryReservationResult> {
    const supabase = await createClient();

    try {
      const { data, error } = await supabase.rpc('reserve_inventory', {
        p_variant_id: variantId,
        p_quantity: quantity,
        p_reference_id: referenceId,
        p_actor_id: actorId || null
      });

      if (error) {
        console.error("Inventory reservation RPC error:", error);
        return {
          success: false,
          reserved: false,
          variantId,
          requestedQuantity: quantity,
          message: error.message
        };
      }

      const isReserved = data === true;
      return {
        success: true,
        reserved: isReserved,
        variantId,
        requestedQuantity: quantity,
        message: isReserved ? 'Successfully reserved' : 'Insufficient stock'
      };
    } catch (e: any) {
      return {
        success: false,
        reserved: false,
        variantId,
        requestedQuantity: quantity,
        message: e.message || 'Unknown error occurred during reservation'
      };
    }
  }

  /**
   * Confirms a sale, deducting physical stock and releasing the reservation.
   */
  static async confirmSale(
    variantId: string, 
    quantity: number, 
    referenceId: string, 
    actorId?: string
  ): Promise<boolean> {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc('confirm_sale_inventory', {
      p_variant_id: variantId,
      p_quantity: quantity,
      p_reference_id: referenceId,
      p_actor_id: actorId || null
    });

    if (error) {
      console.error("Confirm sale RPC error:", error);
      return false;
    }
    return data === true;
  }

  /**
   * Releases a reservation (e.g. cart abandoned, payment failed)
   */
  static async releaseInventory(
    variantId: string, 
    quantity: number, 
    referenceId: string, 
    actorId?: string
  ): Promise<boolean> {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc('release_inventory', {
      p_variant_id: variantId,
      p_quantity: quantity,
      p_reference_id: referenceId,
      p_actor_id: actorId || null
    });

    if (error) {
      console.error("Release inventory RPC error:", error);
      return false;
    }
    return data === true;
  }

  /**
   * Fetches physical stock data for a variant without reserving it.
   */
  static async checkAvailability(variantId: string): Promise<{ available: number, trackInventory: boolean, allowBackorder: boolean } | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('product_variants')
      .select('inventory_quantity, reserved_quantity, track_inventory, allow_backorder')
      .eq('id', variantId)
      .single();

    if (error || !data) return null;

    return {
      available: Math.max(0, data.inventory_quantity - data.reserved_quantity),
      trackInventory: data.track_inventory,
      allowBackorder: data.allow_backorder
    };
  }
}
