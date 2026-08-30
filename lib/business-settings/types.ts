/**
 * ═════════════════════════════════════════════════════════════════════════════
 * PHASE 10H: BUSINESS SETTINGS & CENTRAL CONFIGURATION DOMAIN TYPES
 * ═════════════════════════════════════════════════════════════════════════════
 */

export interface BusinessSettingsRecord {
  id: string;
  store_name: string;
  legal_business_name: string | null;
  display_name: string | null;
  tagline: string | null;
  description: string | null;
  logo_url: string | null;
  favicon_url: string | null;
  support_email: string | null;
  support_phone: string | null;
  website_url: string | null;
  currency_code: string;
  currency_symbol: string;
  timezone: string;
  locale: string;
  is_store_open: boolean;
  maintenance_mode: boolean;
  version: number;
  updated_by?: string | null;
  created_at: string;
  updated_at: string;
}

export interface BusinessAddressRecord {
  id: string;
  label: string;
  address_line_1: string;
  address_line_2: string | null;
  landmark: string | null;
  city: string;
  state: string;
  postal_code: string;
  country_code: string;
  is_primary: boolean;
  support_phone?: string | null;
  support_email?: string | null;
  whatsapp_number?: string | null;
  support_hours?: string | null;
  version: number;
  updated_by?: string | null;
  created_at: string;
  updated_at: string;
}

export interface BusinessContactPointRecord {
  id: string;
  type: "EMAIL" | "PHONE" | "WHATSAPP" | "OTHER";
  value: string;
  label: string;
  is_primary: boolean;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface TaxSettingsRecord {
  id: string;
  tax_enabled: boolean;
  tax_name: string;
  gst_enabled: boolean;
  gst_rate_basis_points: number; // 1800 = 18.00%
  gstin: string | null;
  legal_name: string | null;
  registered_address_id: string | null;
  invoice_tax_mode: "inclusive" | "exclusive";
  place_of_supply_mode: "DESTINATION_STATE" | "ORIGIN_STATE";
  version: number;
  updated_by?: string | null;
  created_at: string;
  updated_at: string;
}

export interface InvoiceSettingsRecord {
  id: string;
  invoice_prefix: string;
  invoice_number_strategy: "YEAR_ORDER_NUMBER" | "SEQUENTIAL_NUMBER" | "DATE_SEQUENTIAL";
  next_invoice_sequence: number;
  display_business_name: boolean;
  display_gstin: boolean;
  display_address: boolean;
  display_email: boolean;
  display_phone: boolean;
  show_tax_breakdown: boolean;
  show_payment_reference: boolean;
  show_shipping: boolean;
  show_discount: boolean;
  footer_text: string | null;
  terms_text: string | null;
  version: number;
  updated_by?: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderSettingsRecord {
  id: string;
  allow_guest_checkout: boolean;
  require_customer_phone: boolean;
  require_customer_email: boolean;
  allow_order_cancellation: boolean;
  customer_cancellation_window_minutes: number;
  admin_cancellation_enabled: boolean;
  require_cancellation_reason: boolean;
  require_admin_cancellation_note: boolean;
  allow_reorder: boolean;
  allow_customer_order_edit: boolean;
  minimum_order_value_minor: number;
  maximum_order_value_minor: number;
  version: number;
  updated_by?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProductionSettingsRecord {
  id: string;
  default_production_days_min: number;
  default_production_days_max: number;
  working_days_only: boolean;
  production_cutoff_enabled: boolean;
  production_cutoff_time: string;
  same_day_available: boolean;
  same_day_cutoff_time: string;
  prepress_required: boolean;
  quality_check_required: boolean;
  default_dispatch_delay_days: number;
  version: number;
  updated_by?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ShippingSettingsRecord {
  id: string;
  shipping_enabled: boolean;
  default_shipping_fee_minor: number;
  free_shipping_enabled: boolean;
  free_shipping_threshold_minor: number;
  default_shipping_zone: string;
  default_dispatch_postal_code: string;
  estimated_delivery_min_days: number;
  estimated_delivery_max_days: number;
  shipping_calculation_mode: "FLAT_RATE" | "DYNAMIC_CARRIER" | "TIERED_WEIGHT";
  version: number;
  updated_by?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CustomerSettingsRecord {
  id: string;
  allow_customer_accounts: boolean;
  allow_guest_checkout: boolean;
  require_email_verification: boolean;
  require_phone_verification: boolean;
  allow_marketing_opt_in: boolean;
  allow_customer_address_book: boolean;
  max_saved_addresses: number;
  version: number;
  updated_by?: string | null;
  created_at: string;
  updated_at: string;
}

export interface NotificationSettingsRecord {
  id: string;
  order_confirmation_enabled: boolean;
  payment_confirmation_enabled: boolean;
  production_update_enabled: boolean;
  quality_update_enabled: boolean;
  dispatch_update_enabled: boolean;
  delivery_update_enabled: boolean;
  cancellation_update_enabled: boolean;
  refund_update_enabled: boolean;
  support_contact_enabled: boolean;
  version: number;
  updated_by?: string | null;
  created_at: string;
  updated_at: string;
}

export interface StorefrontSettingsRecord {
  id: string;
  storefront_enabled: boolean;
  maintenance_mode: boolean;
  maintenance_message: string | null;
  announcement_enabled: boolean;
  announcement_text: string | null;
  support_message: string | null;
  show_delivery_estimate: boolean;
  show_contact_information: boolean;
  show_business_hours: boolean;
  version: number;
  updated_by?: string | null;
  created_at: string;
  updated_at: string;
}

export interface BusinessHourRecord {
  id: string;
  day_of_week: number; // 0-6
  is_open: boolean;
  open_time: string | null;
  close_time: string | null;
  break_start: string | null;
  break_end: string | null;
}

export interface AuditLogRecord {
  id: string;
  admin_id: string | null;
  admin_email: string | null;
  entity_type: string;
  entity_id: string;
  action: string;
  old_state: Record<string, unknown> | null;
  new_state: Record<string, unknown> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

/**
 * Aggregated Authoritative Configuration Snapshot (for Admin Console)
 */
export interface FullBusinessConfiguration {
  business: BusinessSettingsRecord;
  address: BusinessAddressRecord;
  contacts: BusinessContactPointRecord[];
  tax: TaxSettingsRecord;
  invoice: InvoiceSettingsRecord;
  orders: OrderSettingsRecord;
  production: ProductionSettingsRecord;
  shipping: ShippingSettingsRecord;
  customers: CustomerSettingsRecord;
  notifications: NotificationSettingsRecord;
  storefront: StorefrontSettingsRecord;
  hours: BusinessHourRecord[];
}

/**
 * Safe Public Storefront Projection (Free of internal notes, sequences, or secrets)
 */
export interface PublicStorefrontConfig {
  storeName: string;
  legalName: string | null;
  tagline: string | null;
  description: string | null;
  logoUrl: string | null;
  faviconUrl: string | null;
  currency: {
    code: string;
    symbol: string;
  };
  timezone: string;
  locale: string;
  isStoreOpen: boolean;
  maintenanceMode: boolean;
  maintenanceMessage: string | null;
  announcement: {
    enabled: boolean;
    text: string | null;
  };
  contact: {
    email: string | null;
    phone: string | null;
    whatsapp: string | null;
    supportHours: string | null;
  };
  address: {
    line1: string;
    line2: string | null;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  tax: {
    gstEnabled: boolean;
    gstin: string | null;
    gstRatePercent: number; // e.g. 18
    taxMode: "inclusive" | "exclusive";
  };
  shipping: {
    enabled: boolean;
    defaultFeeMinor: number;
    freeShippingThresholdMinor: number;
    estimatedDaysMin: number;
    estimatedDaysMax: number;
    deliveryEstimateText: string;
  };
  production: {
    minDays: number;
    maxDays: number;
    sameDayAvailable: boolean;
    sameDayCutoffTime: string;
  };
  hours: BusinessHourRecord[];
}

export type SettingsUpdateResult<T> =
  | { success: true; data: T; version: number }
  | { success: false; error: string; code: SettingsErrorCode };

export type SettingsErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "VALIDATION_FAILED"
  | "CONCURRENT_MODIFICATION"
  | "RECORD_NOT_FOUND"
  | "DATABASE_ERROR";
