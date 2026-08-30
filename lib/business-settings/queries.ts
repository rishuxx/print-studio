import { createClient } from "@/lib/supabase/server";
import {
  FullBusinessConfiguration,
  PublicStorefrontConfig,
  BusinessSettingsRecord,
  BusinessAddressRecord,
  TaxSettingsRecord,
  InvoiceSettingsRecord,
  OrderSettingsRecord,
  ProductionSettingsRecord,
  ShippingSettingsRecord,
  CustomerSettingsRecord,
  NotificationSettingsRecord,
  StorefrontSettingsRecord,
  BusinessHourRecord,
} from "./types";
import {
  DEFAULT_FULL_CONFIGURATION,
  DEFAULT_PUBLIC_STORE_CONFIG,
  DEFAULT_BUSINESS_SETTINGS,
  DEFAULT_BUSINESS_ADDRESS,
  DEFAULT_TAX_SETTINGS,
  DEFAULT_INVOICE_SETTINGS,
  DEFAULT_ORDER_SETTINGS,
  DEFAULT_PRODUCTION_SETTINGS,
  DEFAULT_SHIPPING_SETTINGS,
  DEFAULT_CUSTOMER_SETTINGS,
  DEFAULT_NOTIFICATION_SETTINGS,
  DEFAULT_STOREFRONT_SETTINGS,
  DEFAULT_BUSINESS_HOURS,
  DEFAULT_CONTACT_POINTS,
} from "./defaults";

/**
 * ═════════════════════════════════════════════════════════════════════════════
 * PHASE 10H: AUTHORITATIVE CONFIGURATION QUERIES
 * ═════════════════════════════════════════════════════════════════════════════
 */

/**
 * Loads the complete normalized business configuration for the Admin Console.
 * Gracefully falls back to deterministic defaults if any table is uninitialized.
 */
export async function getFullBusinessConfiguration(): Promise<FullBusinessConfiguration> {
  try {
    const supabase = await createClient();

    const [
      businessRes,
      addressRes,
      contactsRes,
      taxRes,
      invoiceRes,
      orderRes,
      prodRes,
      shipRes,
      custRes,
      notifRes,
      storefrontRes,
      hoursRes,
    ] = await Promise.all([
      supabase.from("business_settings").select("*").limit(1).maybeSingle(),
      supabase.from("business_addresses").select("*").eq("is_primary", true).limit(1).maybeSingle(),
      supabase.from("business_contact_points").select("*"),
      supabase.from("tax_settings").select("*").limit(1).maybeSingle(),
      supabase.from("invoice_settings").select("*").limit(1).maybeSingle(),
      supabase.from("order_settings").select("*").limit(1).maybeSingle(),
      supabase.from("production_settings").select("*").limit(1).maybeSingle(),
      supabase.from("shipping_settings").select("*").limit(1).maybeSingle(),
      supabase.from("customer_settings").select("*").limit(1).maybeSingle(),
      supabase.from("notification_settings").select("*").limit(1).maybeSingle(),
      supabase.from("storefront_settings").select("*").limit(1).maybeSingle(),
      supabase.from("business_hours").select("*").order("day_of_week", { ascending: true }),
    ]);

    return {
      business: (businessRes.data as BusinessSettingsRecord) || DEFAULT_BUSINESS_SETTINGS,
      address: (addressRes.data as BusinessAddressRecord) || DEFAULT_BUSINESS_ADDRESS,
      contacts: (contactsRes.data?.length ? contactsRes.data : DEFAULT_CONTACT_POINTS),
      tax: (taxRes.data as TaxSettingsRecord) || DEFAULT_TAX_SETTINGS,
      invoice: (invoiceRes.data as InvoiceSettingsRecord) || DEFAULT_INVOICE_SETTINGS,
      orders: (orderRes.data as OrderSettingsRecord) || DEFAULT_ORDER_SETTINGS,
      production: (prodRes.data as ProductionSettingsRecord) || DEFAULT_PRODUCTION_SETTINGS,
      shipping: (shipRes.data as ShippingSettingsRecord) || DEFAULT_SHIPPING_SETTINGS,
      customers: (custRes.data as CustomerSettingsRecord) || DEFAULT_CUSTOMER_SETTINGS,
      notifications: (notifRes.data as NotificationSettingsRecord) || DEFAULT_NOTIFICATION_SETTINGS,
      storefront: (storefrontRes.data as StorefrontSettingsRecord) || DEFAULT_STOREFRONT_SETTINGS,
      hours: (hoursRes.data?.length ? (hoursRes.data as BusinessHourRecord[]) : DEFAULT_BUSINESS_HOURS),
    };
  } catch (err) {
    console.error("[BusinessSettings] Failed to fetch full configuration, using defaults:", err);
    return DEFAULT_FULL_CONFIGURATION;
  }
}

/**
 * Loads the safe public projection consumed by customer storefront headers, footers, and product pages.
 */
export async function getPublicStoreConfig(): Promise<PublicStorefrontConfig> {
  try {
    const supabase = await createClient();

    const [businessRes, addressRes, contactsRes, taxRes, shipRes, prodRes, storefrontRes, hoursRes] =
      await Promise.all([
        supabase.from("business_settings").select("*").limit(1).maybeSingle(),
        supabase.from("business_addresses").select("*").eq("is_primary", true).limit(1).maybeSingle(),
        supabase.from("business_contact_points").select("*").eq("is_public", true),
        supabase.from("tax_settings").select("*").limit(1).maybeSingle(),
        supabase.from("shipping_settings").select("*").limit(1).maybeSingle(),
        supabase.from("production_settings").select("*").limit(1).maybeSingle(),
        supabase.from("storefront_settings").select("*").limit(1).maybeSingle(),
        supabase.from("business_hours").select("*").order("day_of_week", { ascending: true }),
      ]);

    const business = (businessRes.data as BusinessSettingsRecord) || DEFAULT_BUSINESS_SETTINGS;
    const address = (addressRes.data as BusinessAddressRecord) || DEFAULT_BUSINESS_ADDRESS;
    const contacts = contactsRes.data || DEFAULT_CONTACT_POINTS;
    const tax = (taxRes.data as TaxSettingsRecord) || DEFAULT_TAX_SETTINGS;
    const shipping = (shipRes.data as ShippingSettingsRecord) || DEFAULT_SHIPPING_SETTINGS;
    const prod = (prodRes.data as ProductionSettingsRecord) || DEFAULT_PRODUCTION_SETTINGS;
    const storefront = (storefrontRes.data as StorefrontSettingsRecord) || DEFAULT_STOREFRONT_SETTINGS;
    const hours = (hoursRes.data as BusinessHourRecord[]) || DEFAULT_BUSINESS_HOURS;

    const phoneContact = contacts.find((c) => c.type === "PHONE")?.value || business.support_phone;
    const emailContact = contacts.find((c) => c.type === "EMAIL")?.value || business.support_email;
    const whatsappContact = contacts.find((c) => c.type === "WHATSAPP")?.value || "910000000000";

    return {
      storeName: business.store_name,
      legalName: business.legal_business_name,
      tagline: business.tagline,
      description: business.description,
      logoUrl: business.logo_url,
      faviconUrl: business.favicon_url,
      currency: {
        code: business.currency_code,
        symbol: business.currency_symbol,
      },
      timezone: business.timezone,
      locale: business.locale,
      isStoreOpen: business.is_store_open && storefront.storefront_enabled,
      maintenanceMode: business.maintenance_mode || storefront.maintenance_mode,
      maintenanceMessage: storefront.maintenance_message,
      announcement: {
        enabled: storefront.announcement_enabled,
        text: storefront.announcement_text,
      },
      contact: {
        email: emailContact,
        phone: phoneContact,
        whatsapp: whatsappContact,
        supportHours: "Mon–Sat: 10:00 AM – 7:00 PM",
      },
      address: {
        line1: address.address_line_1,
        line2: address.address_line_2,
        city: address.city,
        state: address.state,
        pincode: address.postal_code,
        country: address.country_code === "IN" ? "India" : address.country_code,
      },
      tax: {
        gstEnabled: tax.gst_enabled,
        gstin: tax.gstin,
        gstRatePercent: tax.gst_rate_basis_points / 100,
        taxMode: tax.invoice_tax_mode,
      },
      shipping: {
        enabled: shipping.shipping_enabled,
        defaultFeeMinor: shipping.default_shipping_fee_minor,
        freeShippingThresholdMinor: shipping.free_shipping_threshold_minor,
        estimatedDaysMin: shipping.estimated_delivery_min_days,
        estimatedDaysMax: shipping.estimated_delivery_max_days,
        deliveryEstimateText: `${shipping.estimated_delivery_min_days}–${shipping.estimated_delivery_max_days} business days across India`,
      },
      production: {
        minDays: prod.default_production_days_min,
        maxDays: prod.default_production_days_max,
        sameDayAvailable: prod.same_day_available,
        sameDayCutoffTime: prod.same_day_cutoff_time,
      },
      hours,
    };
  } catch (err) {
    console.error("[BusinessSettings] Failed to fetch public config, using defaults:", err);
    return DEFAULT_PUBLIC_STORE_CONFIG;
  }
}
