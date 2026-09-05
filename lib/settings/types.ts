/**
 * Phase 10H: Business Settings Domain & State Types
 */

export type StoreOperationalStatus = "OPEN" | "PAUSED";
export type TaxDisplayMode = "inclusive" | "exclusive";

export interface DatabaseBusinessSettings {
  id: string;

  // Identity
  business_name: string;
  business_short_name: string;
  legal_business_name: string;
  logo_url: string | null;
  favicon_url?: string | null;
  tagline: string | null;
  description: string | null;
  email: string;
  phone: string;
  whatsapp_number: string | null;
  address_line_1: string;
  address_line_2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;

  // Tax & GST
  gst_enabled: boolean;
  gstin: string | null;
  default_gst_rate_bps: number; // e.g. 1800 = 18.00%
  tax_display_mode: TaxDisplayMode;
  default_sac_hsn: string | null;

  // Operations
  store_status: StoreOperationalStatus;
  store_pause_message: string | null;
  accept_new_orders: boolean;
  checkout_enabled: boolean;

  // Orders
  minimum_order_value_minor: number;
  maximum_order_value_minor: number;
  allow_customer_notes: boolean;

  // Shipping
  shipping_enabled: boolean;
  default_shipping_charge_minor: number;
  free_shipping_threshold_minor: number;
  delivery_estimate_text: string | null;

  // Support
  support_email: string;
  support_phone: string;
  support_hours: string | null;
  whatsapp_floating_enabled: boolean;

  // Storefront & Announcements
  announcement_enabled: boolean;
  announcement_message: string | null;
  announcement_link: string | null;

  // Invoice
  invoice_prefix: string;
  invoice_footer: string | null;

  // SEO & Metadata
  site_title: string;
  site_description: string;
  og_image_url: string | null;
  canonical_site_url: string;

  // Concurrency & Metadata
  version: number;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
}

export type UpdateBusinessSettingsInput = Partial<
  Omit<DatabaseBusinessSettings, "id" | "version" | "created_at" | "updated_at" | "updated_by">
> & {
  version: number;
};
