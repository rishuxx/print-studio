import { getFullBusinessConfiguration, getPublicStoreConfig } from "./queries";
import * as mutations from "./mutations";

/**
 * ═════════════════════════════════════════════════════════════════════════════
 * PHASE 10H: CENTRAL BUSINESS CONFIGURATION SERVICE
 * ═════════════════════════════════════════════════════════════════════════════
 */

export const BusinessSettingsService = {
  // Query operations
  getFullConfiguration: getFullBusinessConfiguration,
  getPublicConfig: getPublicStoreConfig,

  // Server Action mutations
  updateStoreIdentity: mutations.updateStoreIdentityAction,
  updateBusinessAddress: mutations.updateBusinessAddressAction,
  updateTaxSettings: mutations.updateTaxSettingsAction,
  updateInvoiceSettings: mutations.updateInvoiceSettingsAction,
  updateOrderSettings: mutations.updateOrderSettingsAction,
  updateProductionSettings: mutations.updateProductionSettingsAction,
  updateShippingSettings: mutations.updateShippingSettingsAction,
  updateCustomerSettings: mutations.updateCustomerSettingsAction,
  updateNotificationSettings: mutations.updateNotificationSettingsAction,
  updateStorefrontSettings: mutations.updateStorefrontSettingsAction,
  updateBusinessHours: mutations.updateBusinessHoursAction,
};

export * from "./types";
export * from "./schemas";
export * from "./defaults";
export * from "./constants";
export * from "./queries";
export * from "./mutations";
export * from "./cache";
export * from "./permissions";
