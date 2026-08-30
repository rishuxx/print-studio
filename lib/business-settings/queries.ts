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
 * PHASE 10H: FAULT-TOLERANT AUTHORITATIVE CONFIGURATION QUERIES
 * 
 * Works seamlessly with both normalized relational tables AND legacy single
 * canonical `business_settings` table without throwing schema cache errors.
 * ═════════════════════════════════════════════════════════════════════════════
 */

export async function getFullBusinessConfiguration(): Promise<FullBusinessConfiguration> {
  try {
    const supabase = await createClient();

    // 1. Fetch canonical business_settings (always exists)
    const businessQuery = await supabase.from("business_settings").select("*").limit(1).maybeSingle();
    const rawBs = businessQuery.data as Record<string, unknown> | null;

    // 2. Fetch specialized tables with safe individual fallbacks
    const [
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

    // 3. Construct unified config mapping from sub-tables OR legacy business_settings columns
    const business: BusinessSettingsRecord = {
      id: (rawBs?.id as string) || DEFAULT_BUSINESS_SETTINGS.id,
      store_name: (rawBs?.store_name as string) || (rawBs?.business_name as string) || DEFAULT_BUSINESS_SETTINGS.store_name,
      legal_business_name: (rawBs?.legal_business_name as string) || DEFAULT_BUSINESS_SETTINGS.legal_business_name,
      display_name: (rawBs?.display_name as string) || (rawBs?.business_short_name as string) || DEFAULT_BUSINESS_SETTINGS.display_name,
      tagline: (rawBs?.tagline as string) || DEFAULT_BUSINESS_SETTINGS.tagline,
      description: (rawBs?.description as string) || DEFAULT_BUSINESS_SETTINGS.description,
      logo_url: (rawBs?.logo_url as string) || null,
      favicon_url: (rawBs?.favicon_url as string) || null,
      support_email: (rawBs?.support_email as string) || (rawBs?.email as string) || DEFAULT_BUSINESS_SETTINGS.support_email,
      support_phone: (rawBs?.support_phone as string) || (rawBs?.phone as string) || DEFAULT_BUSINESS_SETTINGS.support_phone,
      website_url: (rawBs?.website_url as string) || (rawBs?.canonical_site_url as string) || DEFAULT_BUSINESS_SETTINGS.website_url,
      currency_code: (rawBs?.currency_code as string) || DEFAULT_BUSINESS_SETTINGS.currency_code,
      currency_symbol: (rawBs?.currency_symbol as string) || DEFAULT_BUSINESS_SETTINGS.currency_symbol,
      timezone: (rawBs?.timezone as string) || DEFAULT_BUSINESS_SETTINGS.timezone,
      locale: (rawBs?.locale as string) || DEFAULT_BUSINESS_SETTINGS.locale,
      is_store_open: rawBs?.store_status === "OPEN" || rawBs?.is_store_open === true || DEFAULT_BUSINESS_SETTINGS.is_store_open,
      maintenance_mode: rawBs?.store_status === "PAUSED" || rawBs?.maintenance_mode === true || false,
      version: typeof rawBs?.version === "number" ? rawBs.version : 1,
      created_at: (rawBs?.created_at as string) || new Date().toISOString(),
      updated_at: (rawBs?.updated_at as string) || new Date().toISOString(),
    };

    const address: BusinessAddressRecord = addressRes.data
      ? (addressRes.data as BusinessAddressRecord)
      : {
          ...DEFAULT_BUSINESS_ADDRESS,
          address_line_1: (rawBs?.address_line_1 as string) || DEFAULT_BUSINESS_ADDRESS.address_line_1,
          address_line_2: (rawBs?.address_line_2 as string) || DEFAULT_BUSINESS_ADDRESS.address_line_2,
          city: (rawBs?.city as string) || DEFAULT_BUSINESS_ADDRESS.city,
          state: (rawBs?.state as string) || DEFAULT_BUSINESS_ADDRESS.state,
          postal_code: (rawBs?.postal_code as string) || DEFAULT_BUSINESS_ADDRESS.postal_code,
          country_code: (rawBs?.country as string) === "India" ? "IN" : (rawBs?.country_code as string) || "IN",
          version: typeof rawBs?.version === "number" ? rawBs.version : 1,
        };

    const tax: TaxSettingsRecord = taxRes.data
      ? (taxRes.data as TaxSettingsRecord)
      : {
          ...DEFAULT_TAX_SETTINGS,
          gst_enabled: typeof rawBs?.gst_enabled === "boolean" ? rawBs.gst_enabled : DEFAULT_TAX_SETTINGS.gst_enabled,
          gstin: (rawBs?.gstin as string) || DEFAULT_TAX_SETTINGS.gstin,
          gst_rate_basis_points:
            typeof rawBs?.default_gst_rate_bps === "number"
              ? rawBs.default_gst_rate_bps
              : DEFAULT_TAX_SETTINGS.gst_rate_basis_points,
          invoice_tax_mode:
            rawBs?.tax_display_mode === "exclusive" ? "exclusive" : DEFAULT_TAX_SETTINGS.invoice_tax_mode,
          version: typeof rawBs?.version === "number" ? rawBs.version : 1,
        };

    const invoice: InvoiceSettingsRecord = invoiceRes.data
      ? (invoiceRes.data as InvoiceSettingsRecord)
      : {
          ...DEFAULT_INVOICE_SETTINGS,
          invoice_prefix: (rawBs?.invoice_prefix as string) || DEFAULT_INVOICE_SETTINGS.invoice_prefix,
          footer_text: (rawBs?.invoice_footer as string) || DEFAULT_INVOICE_SETTINGS.footer_text,
          version: typeof rawBs?.version === "number" ? rawBs.version : 1,
        };

    const orders: OrderSettingsRecord = orderRes.data
      ? (orderRes.data as OrderSettingsRecord)
      : {
          ...DEFAULT_ORDER_SETTINGS,
          minimum_order_value_minor:
            typeof rawBs?.minimum_order_value_minor === "number"
              ? rawBs.minimum_order_value_minor
              : DEFAULT_ORDER_SETTINGS.minimum_order_value_minor,
          maximum_order_value_minor:
            typeof rawBs?.maximum_order_value_minor === "number"
              ? rawBs.maximum_order_value_minor
              : DEFAULT_ORDER_SETTINGS.maximum_order_value_minor,
          version: typeof rawBs?.version === "number" ? rawBs.version : 1,
        };

    const shipping: ShippingSettingsRecord = shipRes.data
      ? (shipRes.data as ShippingSettingsRecord)
      : {
          ...DEFAULT_SHIPPING_SETTINGS,
          shipping_enabled:
            typeof rawBs?.shipping_enabled === "boolean"
              ? rawBs.shipping_enabled
              : DEFAULT_SHIPPING_SETTINGS.shipping_enabled,
          default_shipping_fee_minor:
            typeof rawBs?.default_shipping_charge_minor === "number"
              ? rawBs.default_shipping_charge_minor
              : DEFAULT_SHIPPING_SETTINGS.default_shipping_fee_minor,
          free_shipping_threshold_minor:
            typeof rawBs?.free_shipping_threshold_minor === "number"
              ? rawBs.free_shipping_threshold_minor
              : DEFAULT_SHIPPING_SETTINGS.free_shipping_threshold_minor,
          version: typeof rawBs?.version === "number" ? rawBs.version : 1,
        };

    const storefront: StorefrontSettingsRecord = storefrontRes.data
      ? (storefrontRes.data as StorefrontSettingsRecord)
      : {
          ...DEFAULT_STOREFRONT_SETTINGS,
          storefront_enabled: rawBs?.store_status !== "PAUSED",
          maintenance_mode: rawBs?.store_status === "PAUSED" || rawBs?.maintenance_mode === true,
          maintenance_message:
            (rawBs?.store_pause_message as string) || DEFAULT_STOREFRONT_SETTINGS.maintenance_message,
          announcement_enabled:
            typeof rawBs?.announcement_enabled === "boolean"
              ? rawBs.announcement_enabled
              : DEFAULT_STOREFRONT_SETTINGS.announcement_enabled,
          announcement_text:
            (rawBs?.announcement_message as string) || DEFAULT_STOREFRONT_SETTINGS.announcement_text,
          version: typeof rawBs?.version === "number" ? rawBs.version : 1,
        };

    return {
      business,
      address,
      contacts: contactsRes.data?.length ? contactsRes.data : DEFAULT_CONTACT_POINTS,
      tax,
      invoice,
      orders,
      production: prodRes.data ? (prodRes.data as ProductionSettingsRecord) : DEFAULT_PRODUCTION_SETTINGS,
      shipping,
      customers: custRes.data ? (custRes.data as CustomerSettingsRecord) : DEFAULT_CUSTOMER_SETTINGS,
      notifications: notifRes.data ? (notifRes.data as NotificationSettingsRecord) : DEFAULT_NOTIFICATION_SETTINGS,
      storefront,
      hours: hoursRes.data?.length ? (hoursRes.data as BusinessHourRecord[]) : DEFAULT_BUSINESS_HOURS,
    };
  } catch (err) {
    console.error("[BusinessSettings] Failed to fetch full configuration, using defaults:", err);
    return DEFAULT_FULL_CONFIGURATION;
  }
}

export async function getPublicStoreConfig(): Promise<PublicStorefrontConfig> {
  try {
    const full = await getFullBusinessConfiguration();
    const { business, address, contacts, tax, shipping, production, storefront, hours } = full;

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
      isStoreOpen: business.is_store_open && !storefront.maintenance_mode,
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
        minDays: production.default_production_days_min,
        maxDays: production.default_production_days_max,
        sameDayAvailable: production.same_day_available,
        sameDayCutoffTime: production.same_day_cutoff_time,
      },
      hours,
    };
  } catch (err) {
    console.error("[BusinessSettings] Failed to fetch public config, using defaults:", err);
    return DEFAULT_PUBLIC_STORE_CONFIG;
  }
}
