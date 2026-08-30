import { z } from "zod";

export const SaveBusinessSettingsSchema = z.object({
  // Identity
  business_name: z.string().min(1, "Business name is required").max(100),
  business_short_name: z.string().min(1, "Short name is required").max(50),
  legal_business_name: z.string().min(1, "Legal company name is required").max(150),
  email: z.string().email("Valid business email required"),
  phone: z.string().min(5, "Valid phone number required").max(20),
  whatsapp_number: z.string().max(20).optional().nullable(),
  address_line_1: z.string().min(3, "Address is required").max(150),
  address_line_2: z.string().max(150).optional().nullable(),
  city: z.string().min(2, "City is required").max(60),
  state: z.string().min(2, "State is required").max(60),
  postal_code: z.string().regex(/^[1-9][0-9]{5}$/, "Valid 6-digit PIN code required"),
  country: z.string().default("India"),

  // Tax & GST
  gst_enabled: z.boolean().default(true),
  gstin: z
    .string()
    .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Invalid GSTIN format")
    .optional()
    .nullable()
    .or(z.literal("")),
  default_gst_rate_bps: z.number().int().min(0).max(4000), // 0% to 40%
  tax_display_mode: z.enum(["inclusive", "exclusive"]),
  default_sac_hsn: z.string().max(20).optional().nullable(),

  // Operations
  store_status: z.enum(["OPEN", "PAUSED"]),
  store_pause_message: z.string().max(300).optional().nullable(),
  accept_new_orders: z.boolean().default(true),
  checkout_enabled: z.boolean().default(true),

  // Orders
  minimum_order_value_minor: z.number().int().min(0),
  maximum_order_value_minor: z.number().int().min(0),
  allow_customer_notes: z.boolean().default(true),

  // Shipping
  shipping_enabled: z.boolean().default(true),
  default_shipping_charge_minor: z.number().int().min(0),
  free_shipping_threshold_minor: z.number().int().min(0),
  delivery_estimate_text: z.string().max(100).optional().nullable(),

  // Customer Support
  support_email: z.string().email("Valid support email required"),
  support_phone: z.string().min(5, "Valid support phone required").max(20),
  support_hours: z.string().max(100).optional().nullable(),
  whatsapp_floating_enabled: z.boolean().default(true),

  // Storefront & Announcements
  announcement_enabled: z.boolean().default(true),
  announcement_message: z.string().max(200).optional().nullable(),
  announcement_link: z.string().max(100).optional().nullable(),

  // Invoice
  invoice_prefix: z.string().min(1, "Invoice prefix required").max(10),
  invoice_footer: z.string().max(300).optional().nullable(),

  // SEO & Metadata
  site_title: z.string().min(3, "Site title required").max(100),
  site_description: z.string().min(10, "Meta description required").max(300),
  canonical_site_url: z.string().url("Valid URL required (e.g. http://localhost:3000)"),

  // Concurrency
  version: z.number().int().min(1),
});

export type SaveBusinessSettingsInput = z.infer<typeof SaveBusinessSettingsSchema>;
