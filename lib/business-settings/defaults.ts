import {
  BusinessSettingsRecord,
  BusinessAddressRecord,
  BusinessContactPointRecord,
  TaxSettingsRecord,
  InvoiceSettingsRecord,
  OrderSettingsRecord,
  ProductionSettingsRecord,
  ShippingSettingsRecord,
  CustomerSettingsRecord,
  NotificationSettingsRecord,
  StorefrontSettingsRecord,
  BusinessHourRecord,
  FullBusinessConfiguration,
  PublicStorefrontConfig,
} from "./types";

/**
 * ═════════════════════════════════════════════════════════════════════════════
 * PHASE 10H: DETERMINISTIC FALLBACK DEFAULTS & SAFETY BLUEPRINTS
 * ═════════════════════════════════════════════════════════════════════════════
 */

export const DEFAULT_BUSINESS_SETTINGS: BusinessSettingsRecord = {
  id: "00000000-0000-0000-0000-000000000001",
  store_name: "Print Studio",
  legal_business_name: "Your Print Business Private Limited",
  display_name: "Print Studio",
  tagline: "Custom printing for individuals and businesses",
  description:
    "High-quality custom printing, stationery, apparel, packaging, and business branding solutions with fast local turnaround.",
  logo_url: null,
  favicon_url: null,
  support_email: "hello@example.com",
  support_phone: "+91 XXXXX XXXXX",
  website_url: "http://localhost:3000",
  currency_code: "INR",
  currency_symbol: "₹",
  timezone: "Asia/Kolkata",
  locale: "en-IN",
  is_store_open: true,
  maintenance_mode: false,
  version: 1,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const DEFAULT_BUSINESS_ADDRESS: BusinessAddressRecord = {
  id: "00000000-0000-0000-0000-000000000002",
  label: "Headquarters & Main Production Facility",
  address_line_1: "Balaji Complex, Prem Nagar",
  address_line_2: "Chakrata Road",
  landmark: "Near Subhash Chowk",
  city: "Dehradun",
  state: "Uttarakhand",
  postal_code: "248007",
  country_code: "IN",
  is_primary: true,
  version: 1,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const DEFAULT_CONTACT_POINTS: BusinessContactPointRecord[] = [
  {
    id: "00000000-0000-0000-0000-000000000003",
    type: "PHONE",
    value: "+91 XXXXX XXXXX",
    label: "Customer Support Desk",
    is_primary: true,
    is_public: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "00000000-0000-0000-0000-000000000004",
    type: "EMAIL",
    value: "hello@example.com",
    label: "General Inquiries & Orders",
    is_primary: true,
    is_public: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "00000000-0000-0000-0000-000000000005",
    type: "WHATSAPP",
    value: "910000000000",
    label: "Live Proofing & Pre-Press WhatsApp",
    is_primary: true,
    is_public: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const DEFAULT_TAX_SETTINGS: TaxSettingsRecord = {
  id: "00000000-0000-0000-0000-000000000006",
  tax_enabled: true,
  tax_name: "GST (Goods and Services Tax)",
  gst_enabled: true,
  gst_rate_basis_points: 1800, // 18.00%
  gstin: "05AAACH7409R1ZZ",
  legal_name: "Your Print Business Private Limited",
  registered_address_id: DEFAULT_BUSINESS_ADDRESS.id,
  invoice_tax_mode: "inclusive",
  place_of_supply_mode: "DESTINATION_STATE",
  version: 1,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const DEFAULT_INVOICE_SETTINGS: InvoiceSettingsRecord = {
  id: "00000000-0000-0000-0000-000000000007",
  invoice_prefix: "INV",
  invoice_number_strategy: "YEAR_ORDER_NUMBER",
  next_invoice_sequence: 1001,
  display_business_name: true,
  display_gstin: true,
  display_address: true,
  display_email: true,
  display_phone: true,
  show_tax_breakdown: true,
  show_payment_reference: true,
  show_shipping: true,
  show_discount: true,
  footer_text: "This is a computer-generated GST tax invoice. No signature is required.",
  terms_text:
    "Payment due upon receipt. Goods once printed with approved artwork are non-returnable except for manufacturing defects.",
  version: 1,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const DEFAULT_ORDER_SETTINGS: OrderSettingsRecord = {
  id: "00000000-0000-0000-0000-000000000008",
  allow_guest_checkout: true,
  require_customer_phone: true,
  require_customer_email: true,
  allow_order_cancellation: true,
  customer_cancellation_window_minutes: 60,
  admin_cancellation_enabled: true,
  require_cancellation_reason: true,
  require_admin_cancellation_note: false,
  allow_reorder: true,
  allow_customer_order_edit: false,
  minimum_order_value_minor: 10000, // ₹100.00
  maximum_order_value_minor: 50000000, // ₹5,00,000.00
  version: 1,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const DEFAULT_PRODUCTION_SETTINGS: ProductionSettingsRecord = {
  id: "00000000-0000-0000-0000-000000000009",
  default_production_days_min: 2,
  default_production_days_max: 3,
  working_days_only: true,
  production_cutoff_enabled: true,
  production_cutoff_time: "14:00",
  same_day_available: true,
  same_day_cutoff_time: "11:00",
  prepress_required: true,
  quality_check_required: true,
  default_dispatch_delay_days: 0,
  version: 1,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const DEFAULT_SHIPPING_SETTINGS: ShippingSettingsRecord = {
  id: "00000000-0000-0000-0000-000000000010",
  shipping_enabled: true,
  default_shipping_fee_minor: 9900, // ₹99.00
  free_shipping_enabled: true,
  free_shipping_threshold_minor: 150000, // ₹1,500.00
  default_shipping_zone: "DOMESTIC_IN",
  default_dispatch_postal_code: "248007",
  estimated_delivery_min_days: 3,
  estimated_delivery_max_days: 5,
  shipping_calculation_mode: "DYNAMIC_CARRIER",
  version: 1,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const DEFAULT_CUSTOMER_SETTINGS: CustomerSettingsRecord = {
  id: "00000000-0000-0000-0000-000000000011",
  allow_customer_accounts: true,
  allow_guest_checkout: true,
  require_email_verification: false,
  require_phone_verification: false,
  allow_marketing_opt_in: true,
  allow_customer_address_book: true,
  max_saved_addresses: 10,
  version: 1,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettingsRecord = {
  id: "00000000-0000-0000-0000-000000000012",
  order_confirmation_enabled: true,
  payment_confirmation_enabled: true,
  production_update_enabled: true,
  quality_update_enabled: true,
  dispatch_update_enabled: true,
  delivery_update_enabled: true,
  cancellation_update_enabled: true,
  refund_update_enabled: true,
  support_contact_enabled: true,
  version: 1,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const DEFAULT_STOREFRONT_SETTINGS: StorefrontSettingsRecord = {
  id: "00000000-0000-0000-0000-000000000013",
  storefront_enabled: true,
  maintenance_mode: false,
  maintenance_message:
    "We are currently performing scheduled maintenance. Please check back shortly.",
  announcement_enabled: true,
  announcement_text:
    "Fast local printing and express dispatch available on select custom products.",
  support_message:
    "Need custom bulk quotation? Our production studio team is available Mon–Sat.",
  show_delivery_estimate: true,
  show_contact_information: true,
  show_business_hours: true,
  version: 1,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const DEFAULT_BUSINESS_HOURS: BusinessHourRecord[] = [
  { id: "h0", day_of_week: 0, is_open: false, open_time: "10:00", close_time: "19:00", break_start: null, break_end: null },
  { id: "h1", day_of_week: 1, is_open: true, open_time: "10:00", close_time: "19:00", break_start: null, break_end: null },
  { id: "h2", day_of_week: 2, is_open: true, open_time: "10:00", close_time: "19:00", break_start: null, break_end: null },
  { id: "h3", day_of_week: 3, is_open: true, open_time: "10:00", close_time: "19:00", break_start: null, break_end: null },
  { id: "h4", day_of_week: 4, is_open: true, open_time: "10:00", close_time: "19:00", break_start: null, break_end: null },
  { id: "h5", day_of_week: 5, is_open: true, open_time: "10:00", close_time: "19:00", break_start: null, break_end: null },
  { id: "h6", day_of_week: 6, is_open: true, open_time: "10:00", close_time: "18:00", break_start: null, break_end: null },
];

export const DEFAULT_FULL_CONFIGURATION: FullBusinessConfiguration = {
  business: DEFAULT_BUSINESS_SETTINGS,
  address: DEFAULT_BUSINESS_ADDRESS,
  contacts: DEFAULT_CONTACT_POINTS,
  tax: DEFAULT_TAX_SETTINGS,
  invoice: DEFAULT_INVOICE_SETTINGS,
  orders: DEFAULT_ORDER_SETTINGS,
  production: DEFAULT_PRODUCTION_SETTINGS,
  shipping: DEFAULT_SHIPPING_SETTINGS,
  customers: DEFAULT_CUSTOMER_SETTINGS,
  notifications: DEFAULT_NOTIFICATION_SETTINGS,
  storefront: DEFAULT_STOREFRONT_SETTINGS,
  hours: DEFAULT_BUSINESS_HOURS,
};

export const DEFAULT_PUBLIC_STORE_CONFIG: PublicStorefrontConfig = {
  storeName: "Print Studio",
  legalName: "Your Print Business Private Limited",
  tagline: "Custom printing for individuals and businesses",
  description: "High-quality custom printing with fast local turnaround.",
  logoUrl: null,
  faviconUrl: null,
  currency: {
    code: "INR",
    symbol: "₹",
  },
  timezone: "Asia/Kolkata",
  locale: "en-IN",
  isStoreOpen: true,
  maintenanceMode: false,
  maintenanceMessage: null,
  announcement: {
    enabled: true,
    text: "Fast local printing and express dispatch available on select custom products.",
  },
  contact: {
    email: "hello@example.com",
    phone: "+91 XXXXX XXXXX",
    whatsapp: "910000000000",
    supportHours: "Mon–Sat: 10:00 AM – 7:00 PM",
  },
  address: {
    line1: "Balaji Complex, Prem Nagar",
    line2: "Chakrata Road",
    city: "Dehradun",
    state: "Uttarakhand",
    pincode: "248007",
    country: "India",
  },
  tax: {
    gstEnabled: true,
    gstin: "05AAACH7409R1ZZ",
    gstRatePercent: 18,
    taxMode: "inclusive",
  },
  shipping: {
    enabled: true,
    defaultFeeMinor: 9900,
    freeShippingThresholdMinor: 150000,
    estimatedDaysMin: 3,
    estimatedDaysMax: 5,
    deliveryEstimateText: "3–5 business days across India",
  },
  production: {
    minDays: 2,
    maxDays: 3,
    sameDayAvailable: true,
    sameDayCutoffTime: "11:00",
  },
  hours: DEFAULT_BUSINESS_HOURS,
};
