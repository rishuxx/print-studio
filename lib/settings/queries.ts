import { createClient } from "@/lib/supabase/server";
import { siteConfig } from "@/lib/site-config";
import type { DatabaseBusinessSettings } from "./types";

/**
 * Fallback baseline settings derived cleanly from site-config.ts
 */
export const DEFAULT_BUSINESS_SETTINGS: DatabaseBusinessSettings = {
  id: "00000000-0000-0000-0000-000000000001",
  business_name: siteConfig.businessName || "Your Print Business",
  business_short_name: siteConfig.businessShortName || "Print Studio",
  legal_business_name: "Your Print Business Private Limited",
  logo_url: null,
  tagline: siteConfig.tagline,
  description: siteConfig.description,
  email: siteConfig.contact.email,
  phone: siteConfig.contact.phone,
  whatsapp_number: siteConfig.contact.whatsapp,
  address_line_1: siteConfig.address.line1,
  address_line_2: siteConfig.address.line2,
  city: siteConfig.address.city,
  state: siteConfig.address.state,
  postal_code: siteConfig.address.pincode,
  country: siteConfig.address.country,

  gst_enabled: true,
  gstin: siteConfig.operations.gstin || "05AAACH7409R1ZZ",
  default_gst_rate_bps: Math.round((siteConfig.pricingPolicy.gstRate || 0.18) * 10000),
  tax_display_mode: siteConfig.pricingPolicy.gstMode || "inclusive",
  default_sac_hsn: "998912",

  store_status: "OPEN",
  store_pause_message: "We are temporarily not accepting new orders. Please check back shortly.",
  accept_new_orders: true,
  checkout_enabled: true,

  minimum_order_value_minor: 10000, // ₹100.00
  maximum_order_value_minor: 50000000, // ₹5,00,000.00
  allow_customer_notes: true,

  shipping_enabled: true,
  default_shipping_charge_minor: siteConfig.pricingPolicy.flatShippingPaise || 9900,
  free_shipping_threshold_minor: siteConfig.pricingPolicy.freeShippingThresholdPaise || 150000,
  delivery_estimate_text: "3–5 business days across India",

  support_email: siteConfig.contact.email,
  support_phone: siteConfig.contact.phone,
  support_hours: siteConfig.contact.supportHours,
  whatsapp_floating_enabled: true,

  announcement_enabled: true,
  announcement_message: siteConfig.announcements?.[0]?.text || "Fast local printing and express dispatch on select products",
  announcement_link: siteConfig.announcements?.[0]?.href || "/same-day",

  invoice_prefix: "INV",
  invoice_footer: "Computer generated tax invoice. No physical signature required.",

  site_title: "Print Studio · High-Quality Custom Online Printing & Branding",
  site_description: siteConfig.description,
  og_image_url: null,
  canonical_site_url: "http://localhost:3000",

  version: 1,
  updated_by: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

/**
 * Fetches authoritative business settings from Supabase.
 * Returns single canonical database record or initialized defaults.
 */
export async function getAuthoritativeBusinessSettings(): Promise<DatabaseBusinessSettings> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("business_settings")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      return DEFAULT_BUSINESS_SETTINGS;
    }

    return data as DatabaseBusinessSettings;
  } catch {
    return DEFAULT_BUSINESS_SETTINGS;
  }
}
