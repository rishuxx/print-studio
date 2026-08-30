import { z } from "zod";

/**
 * ═════════════════════════════════════════════════════════════════════════════
 * PHASE 10H: ZOD VALIDATION SCHEMAS & CROSS-FIELD BUSINESS RULES
 * ═════════════════════════════════════════════════════════════════════════════
 */

// 1. Store Identity Schema
export const businessSettingsSchema = z.object({
  store_name: z.string().trim().min(2, "Store name must be at least 2 characters").max(100),
  legal_business_name: z.string().trim().max(150).nullable().optional(),
  display_name: z.string().trim().max(100).nullable().optional(),
  tagline: z.string().trim().max(200).nullable().optional(),
  description: z.string().trim().max(1000).nullable().optional(),
  logo_url: z.string().trim().url("Logo URL must be valid").nullable().optional().or(z.literal("")),
  favicon_url: z.string().trim().url("Favicon URL must be valid").nullable().optional().or(z.literal("")),
  support_email: z.string().trim().email("Invalid support email address").nullable().optional().or(z.literal("")),
  support_phone: z.string().trim().min(6, "Phone must be at least 6 digits").max(30).nullable().optional().or(z.literal("")),
  website_url: z.string().trim().url("Website URL must be valid").nullable().optional().or(z.literal("")),
  currency_code: z.string().trim().min(2).max(8).default("INR"),
  currency_symbol: z.string().trim().min(1).max(8).default("₹"),
  timezone: z.string().trim().min(2).default("Asia/Kolkata"),
  locale: z.string().trim().min(2).default("en-IN"),
  is_store_open: z.boolean().default(true),
  maintenance_mode: z.boolean().default(false),
  version: z.number().int().positive(),
});

// 2. Business Address Schema
export const businessAddressSchema = z.object({
  label: z.string().trim().min(2).max(100).default("Headquarters"),
  address_line_1: z.string().trim().min(3, "Address line 1 is required").max(200),
  address_line_2: z.string().trim().max(200).nullable().optional(),
  landmark: z.string().trim().max(100).nullable().optional(),
  city: z.string().trim().min(2, "City is required").max(100),
  state: z.string().trim().min(2, "State is required").max(100),
  postal_code: z.string().trim().regex(/^\d{6}$/, "Must be a valid 6-digit Indian PIN code"),
  country_code: z.string().trim().min(2).max(8).default("IN"),
  is_primary: z.boolean().default(true),
  version: z.number().int().positive(),
});

// 3. Tax & GST Settings Schema (Cross-field: GSTIN required if GST is enabled)
export const taxSettingsSchema = z
  .object({
    tax_enabled: z.boolean().default(true),
    tax_name: z.string().trim().min(2).max(100).default("GST"),
    gst_enabled: z.boolean().default(true),
    gst_rate_basis_points: z
      .number()
      .int()
      .min(0, "GST rate cannot be negative")
      .max(4000, "GST rate cannot exceed 40% (4000 bps)")
      .default(1800),
    gstin: z
      .string()
      .trim()
      .regex(
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
        "Invalid 15-digit Indian GSTIN format"
      )
      .nullable()
      .optional()
      .or(z.literal("")),
    legal_name: z.string().trim().max(150).nullable().optional(),
    invoice_tax_mode: z.enum(["inclusive", "exclusive"]).default("inclusive"),
    place_of_supply_mode: z
      .enum(["DESTINATION_STATE", "ORIGIN_STATE"])
      .default("DESTINATION_STATE"),
    version: z.number().int().positive(),
  })
  .refine(
    (data) => {
      if (data.gst_enabled && data.gstin && data.gstin.length > 0) {
        return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(data.gstin);
      }
      return true;
    },
    {
      message: "A valid 15-digit GSTIN is required when GST is enabled",
      path: ["gstin"],
    }
  );

// 4. Invoice Settings Schema
export const invoiceSettingsSchema = z.object({
  invoice_prefix: z.string().trim().min(1, "Prefix required").max(16).default("INV"),
  invoice_number_strategy: z
    .enum(["YEAR_ORDER_NUMBER", "SEQUENTIAL_NUMBER", "DATE_SEQUENTIAL"])
    .default("YEAR_ORDER_NUMBER"),
  display_business_name: z.boolean().default(true),
  display_gstin: z.boolean().default(true),
  display_address: z.boolean().default(true),
  display_email: z.boolean().default(true),
  display_phone: z.boolean().default(true),
  show_tax_breakdown: z.boolean().default(true),
  show_payment_reference: z.boolean().default(true),
  show_shipping: z.boolean().default(true),
  show_discount: z.boolean().default(true),
  footer_text: z.string().trim().max(500).nullable().optional(),
  terms_text: z.string().trim().max(1000).nullable().optional(),
  version: z.number().int().positive(),
});

// 5. Order Settings Schema (Cross-field: Min <= Max order values)
export const orderSettingsSchema = z
  .object({
    allow_guest_checkout: z.boolean().default(true),
    require_customer_phone: z.boolean().default(true),
    require_customer_email: z.boolean().default(true),
    allow_order_cancellation: z.boolean().default(true),
    customer_cancellation_window_minutes: z
      .number()
      .int()
      .min(0, "Cancellation window cannot be negative")
      .max(1440, "Cancellation window cannot exceed 24 hours (1440 min)")
      .default(60),
    admin_cancellation_enabled: z.boolean().default(true),
    require_cancellation_reason: z.boolean().default(true),
    require_admin_cancellation_note: z.boolean().default(false),
    allow_reorder: z.boolean().default(true),
    allow_customer_order_edit: z.boolean().default(false),
    minimum_order_value_minor: z.number().int().min(0).default(10000), // ₹100.00
    maximum_order_value_minor: z.number().int().min(10000).default(50000000), // ₹5,00,000.00
    version: z.number().int().positive(),
  })
  .refine((data) => data.minimum_order_value_minor <= data.maximum_order_value_minor, {
    message: "Minimum order value cannot exceed maximum order value",
    path: ["maximum_order_value_minor"],
  });

// 6. Production Settings Schema (Cross-field: Min days <= Max days)
export const productionSettingsSchema = z
  .object({
    default_production_days_min: z.number().int().min(0).max(60).default(2),
    default_production_days_max: z.number().int().min(0).max(60).default(3),
    working_days_only: z.boolean().default(true),
    production_cutoff_enabled: z.boolean().default(true),
    production_cutoff_time: z
      .string()
      .trim()
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Time must be HH:MM in 24hr format")
      .default("14:00"),
    same_day_available: z.boolean().default(true),
    same_day_cutoff_time: z
      .string()
      .trim()
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Time must be HH:MM in 24hr format")
      .default("11:00"),
    prepress_required: z.boolean().default(true),
    quality_check_required: z.boolean().default(true),
    default_dispatch_delay_days: z.number().int().min(0).max(30).default(0),
    version: z.number().int().positive(),
  })
  .refine((data) => data.default_production_days_min <= data.default_production_days_max, {
    message: "Minimum production days cannot exceed maximum production days",
    path: ["default_production_days_max"],
  });

// 7. Shipping Settings Schema (Cross-field: Free shipping requires threshold > 0)
export const shippingSettingsSchema = z
  .object({
    shipping_enabled: z.boolean().default(true),
    default_shipping_fee_minor: z.number().int().min(0, "Shipping fee cannot be negative").default(9900),
    free_shipping_enabled: z.boolean().default(true),
    free_shipping_threshold_minor: z
      .number()
      .int()
      .min(0, "Free shipping threshold cannot be negative")
      .default(150000),
    default_shipping_zone: z.string().trim().default("DOMESTIC_IN"),
    default_dispatch_postal_code: z
      .string()
      .trim()
      .regex(/^\d{6}$/, "Must be a valid 6-digit Indian PIN code")
      .default("248007"),
    estimated_delivery_min_days: z.number().int().min(1).default(3),
    estimated_delivery_max_days: z.number().int().min(1).default(5),
    shipping_calculation_mode: z
      .enum(["FLAT_RATE", "DYNAMIC_CARRIER", "TIERED_WEIGHT"])
      .default("DYNAMIC_CARRIER"),
    version: z.number().int().positive(),
  })
  .refine(
    (data) => {
      if (data.free_shipping_enabled && data.free_shipping_threshold_minor <= 0) {
        return false;
      }
      return true;
    },
    {
      message: "Free shipping threshold must be greater than ₹0 when free shipping is enabled",
      path: ["free_shipping_threshold_minor"],
    }
  )
  .refine((data) => data.estimated_delivery_min_days <= data.estimated_delivery_max_days, {
    message: "Minimum delivery days cannot exceed maximum delivery days",
    path: ["estimated_delivery_max_days"],
  });

// 8. Customer Settings Schema
export const customerSettingsSchema = z.object({
  allow_customer_accounts: z.boolean().default(true),
  allow_guest_checkout: z.boolean().default(true),
  require_email_verification: z.boolean().default(false),
  require_phone_verification: z.boolean().default(false),
  allow_marketing_opt_in: z.boolean().default(true),
  allow_customer_address_book: z.boolean().default(true),
  max_saved_addresses: z.number().int().min(1).max(50).default(10),
  version: z.number().int().positive(),
});

// 9. Notification Settings Schema
export const notificationSettingsSchema = z.object({
  order_confirmation_enabled: z.boolean().default(true),
  payment_confirmation_enabled: z.boolean().default(true),
  production_update_enabled: z.boolean().default(true),
  quality_update_enabled: z.boolean().default(true),
  dispatch_update_enabled: z.boolean().default(true),
  delivery_update_enabled: z.boolean().default(true),
  cancellation_update_enabled: z.boolean().default(true),
  refund_update_enabled: z.boolean().default(true),
  support_contact_enabled: z.boolean().default(true),
  version: z.number().int().positive(),
});

// 10. Storefront Settings Schema
export const storefrontSettingsSchema = z.object({
  storefront_enabled: z.boolean().default(true),
  maintenance_mode: z.boolean().default(false),
  maintenance_message: z.string().trim().max(500).nullable().optional(),
  announcement_enabled: z.boolean().default(true),
  announcement_text: z.string().trim().max(250).nullable().optional(),
  support_message: z.string().trim().max(300).nullable().optional(),
  show_delivery_estimate: z.boolean().default(true),
  show_contact_information: z.boolean().default(true),
  show_business_hours: z.boolean().default(true),
  version: z.number().int().positive(),
});

// 11. Business Hour Item Schema
export const businessHourItemSchema = z.object({
  day_of_week: z.number().int().min(0).max(6),
  is_open: z.boolean(),
  open_time: z
    .string()
    .trim()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid HH:MM time")
    .nullable()
    .optional(),
  close_time: z
    .string()
    .trim()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid HH:MM time")
    .nullable()
    .optional(),
  break_start: z.string().trim().nullable().optional(),
  break_end: z.string().trim().nullable().optional(),
});

export const businessHoursListSchema = z.array(businessHourItemSchema).length(7);
