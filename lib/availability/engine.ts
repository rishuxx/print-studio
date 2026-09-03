import { getPublicStoreConfig } from "@/lib/business-settings/queries";
import { InventoryService } from "@/lib/inventory/engine";

export interface AvailabilityResult {
  available: boolean;
  reason?: 'OUT_OF_STOCK' | 'PRODUCT_INACTIVE' | 'VARIANT_INACTIVE' | 'SAME_DAY_CUTOFF_PASSED' | 'STORE_CLOSED';
  sameDayEligible: boolean;
  expectedDispatchDate?: string;
}

export class AvailabilityService {
  /**
   * Central availability evaluator.
   * Determines if a customer can purchase, select same-day, and if the inventory is sufficient.
   */
  static async evaluateVariantAvailability(
    variantId: string,
    requestedQuantity: number = 1,
    productStatus: string = 'active',
    variantStatus: string = 'active',
    sameDayRequested: boolean = false
  ): Promise<AvailabilityResult> {
    
    if (productStatus !== 'active') {
      return { available: false, reason: 'PRODUCT_INACTIVE', sameDayEligible: false };
    }

    if (variantStatus !== 'active') {
      return { available: false, reason: 'VARIANT_INACTIVE', sameDayEligible: false };
    }

    const settings = await getPublicStoreConfig();
    if (settings.isStoreOpen === false || settings.maintenanceMode) {
      return { available: false, reason: 'STORE_CLOSED', sameDayEligible: false };
    }

    // Check Inventory
    const inventory = await InventoryService.checkAvailability(variantId);
    
    if (inventory) {
      if (inventory.trackInventory && !inventory.allowBackorder && inventory.available < requestedQuantity) {
         return { available: false, reason: 'OUT_OF_STOCK', sameDayEligible: false };
      }
    }

    // Check Same-Day Logic
    let sameDayEligible = false;
    
    if (settings.production.sameDayAvailable) {
      // Evaluate if current time is before cutoff
      const cutoffTimeStr = settings.production.sameDayCutoffTime; // format: HH:MM
      if (cutoffTimeStr) {
        const [cutoffHour, cutoffMin] = cutoffTimeStr.split(':').map(Number);
        
        // Use a trusted server-side time source and the configured store timezone
        const now = new Date();
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: settings.timezone || 'Asia/Kolkata',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
        const [currentHour, currentMin] = formatter.format(now).split(':').map(Number);

        // Calculate if we are strictly before the cutoff
        const isBeforeCutoff = currentHour < cutoffHour || (currentHour === cutoffHour && currentMin < cutoffMin);
        
        sameDayEligible = isBeforeCutoff;
      }
    }

    if (sameDayRequested && !sameDayEligible) {
        return { available: false, reason: 'SAME_DAY_CUTOFF_PASSED', sameDayEligible: false };
    }

    // Calculate expected dispatch date
    const expectedDispatchDate = new Date();
    if (!sameDayRequested || !sameDayEligible) {
      expectedDispatchDate.setDate(expectedDispatchDate.getDate() + (settings.production.minDays || 2));
    }

    return {
      available: true,
      sameDayEligible,
      expectedDispatchDate: expectedDispatchDate.toISOString()
    };
  }
}
