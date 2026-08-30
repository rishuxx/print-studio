import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  businessSettingsSchema,
  businessAddressSchema,
  taxSettingsSchema,
  orderSettingsSchema,
  productionSettingsSchema,
  shippingSettingsSchema,
} from "../lib/business-settings/schemas";
import {
  DEFAULT_FULL_CONFIGURATION,
  DEFAULT_PUBLIC_STORE_CONFIG,
} from "../lib/business-settings/defaults";

describe("Phase 10H: Business Settings Validation & Business Rules", () => {
  describe("Store Identity Schema", () => {
    it("validates correct store identity payload", () => {
      const valid = {
        store_name: "Print Studio",
        legal_business_name: "Print Studio Pvt Ltd",
        display_name: "Print Studio",
        tagline: "Custom printing",
        description: "High quality printing",
        logo_url: "https://example.com/logo.png",
        favicon_url: "",
        support_email: "support@example.com",
        support_phone: "+91 99999 99999",
        website_url: "https://example.com",
        currency_code: "INR",
        currency_symbol: "₹",
        timezone: "Asia/Kolkata",
        locale: "en-IN",
        is_store_open: true,
        maintenance_mode: false,
        version: 1,
      };

      const result = businessSettingsSchema.safeParse(valid);
      assert.equal(result.success, true);
    });

    it("rejects store name shorter than 2 characters", () => {
      const invalid = {
        store_name: "P",
        version: 1,
      };
      const result = businessSettingsSchema.safeParse(invalid);
      assert.equal(result.success, false);
    });
  });

  describe("Business Address & Multi-Channel Contacts", () => {
    it("accepts valid 6-digit Indian PIN code and custom support contact endpoints", () => {
      const valid = {
        label: "Headquarters",
        address_line_1: "Balaji Complex, Prem Nagar",
        city: "Dehradun",
        state: "Uttarakhand",
        postal_code: "248007",
        country_code: "IN",
        is_primary: true,
        support_phone: "+91 6388693472",
        support_email: "ayushiaggrawal13@gmail.com",
        whatsapp_number: "916388693472",
        support_hours: "Mon–Sat: 10:00 AM – 7:00 PM",
        version: 1,
      };
      const result = businessAddressSchema.safeParse(valid);
      assert.equal(result.success, true);
    });

    it("rejects invalid 5-digit PIN code", () => {
      const invalid = {
        label: "Headquarters",
        address_line_1: "Chakrata Road",
        city: "Dehradun",
        state: "Uttarakhand",
        postal_code: "24800",
        version: 1,
      };
      const result = businessAddressSchema.safeParse(invalid);
      assert.equal(result.success, false);
    });
  });

  describe("Tax & GST Settings (Cross-Field Rules)", () => {
    it("accepts valid 15-digit GSTIN with 1800 basis points (18%)", () => {
      const valid = {
        tax_enabled: true,
        tax_name: "GST",
        gst_enabled: true,
        gst_rate_basis_points: 1800,
        gstin: "05AAACH7409R1ZZ",
        invoice_tax_mode: "inclusive" as const,
        place_of_supply_mode: "DESTINATION_STATE" as const,
        version: 1,
      };
      const result = taxSettingsSchema.safeParse(valid);
      assert.equal(result.success, true);
    });

    it("rejects invalid GSTIN format", () => {
      const invalid = {
        tax_enabled: true,
        gst_enabled: true,
        gst_rate_basis_points: 1800,
        gstin: "INVALID_GSTIN_123",
        version: 1,
      };
      const result = taxSettingsSchema.safeParse(invalid);
      assert.equal(result.success, false);
    });

    it("rejects GST rate over 40% (4000 basis points)", () => {
      const invalid = {
        gst_rate_basis_points: 5000,
        version: 1,
      };
      const result = taxSettingsSchema.safeParse(invalid);
      assert.equal(result.success, false);
    });
  });

  describe("Order Rules (Cross-Field Constraints)", () => {
    it("accepts valid min and max order boundaries", () => {
      const valid = {
        allow_guest_checkout: true,
        customer_cancellation_window_minutes: 60,
        minimum_order_value_minor: 10000, // ₹100
        maximum_order_value_minor: 50000000, // ₹5,00,000
        version: 1,
      };
      const result = orderSettingsSchema.safeParse(valid);
      assert.equal(result.success, true);
    });

    it("rejects minimum order value exceeding maximum order value", () => {
      const invalid = {
        minimum_order_value_minor: 500000, // ₹5,000
        maximum_order_value_minor: 100000, // ₹1,000
        version: 1,
      };
      const result = orderSettingsSchema.safeParse(invalid);
      assert.equal(result.success, false);
    });
  });

  describe("Production SLA (Cross-Field Constraints)", () => {
    it("accepts valid min <= max production days", () => {
      const valid = {
        default_production_days_min: 2,
        default_production_days_max: 4,
        production_cutoff_time: "14:00",
        same_day_cutoff_time: "11:00",
        version: 1,
      };
      const result = productionSettingsSchema.safeParse(valid);
      assert.equal(result.success, true);
    });

    it("rejects min production days greater than max production days", () => {
      const invalid = {
        default_production_days_min: 5,
        default_production_days_max: 2,
        version: 1,
      };
      const result = productionSettingsSchema.safeParse(invalid);
      assert.equal(result.success, false);
    });
  });

  describe("Shipping Defaults (Cross-Field Constraints)", () => {
    it("accepts free shipping with valid positive threshold", () => {
      const valid = {
        shipping_enabled: true,
        default_shipping_fee_minor: 9900,
        free_shipping_enabled: true,
        free_shipping_threshold_minor: 150000,
        default_dispatch_postal_code: "248007",
        estimated_delivery_min_days: 3,
        estimated_delivery_max_days: 5,
        version: 1,
      };
      const result = shippingSettingsSchema.safeParse(valid);
      assert.equal(result.success, true);
    });

    it("rejects free shipping enabled with 0 threshold", () => {
      const invalid = {
        shipping_enabled: true,
        free_shipping_enabled: true,
        free_shipping_threshold_minor: 0,
        version: 1,
      };
      const result = shippingSettingsSchema.safeParse(invalid);
      assert.equal(result.success, false);
    });
  });

  describe("Deterministic Fallback Defaults", () => {
    it("provides complete default business configuration", () => {
      assert.equal(DEFAULT_FULL_CONFIGURATION.business.store_name, "Print Studio");
      assert.equal(DEFAULT_FULL_CONFIGURATION.tax.gst_rate_basis_points, 1800);
      assert.equal(DEFAULT_FULL_CONFIGURATION.shipping.default_shipping_fee_minor, 9900);
      assert.equal(DEFAULT_FULL_CONFIGURATION.hours.length, 7);
    });

    it("provides safe public projection without internal sequences", () => {
      assert.equal(DEFAULT_PUBLIC_STORE_CONFIG.storeName, "Print Studio");
      assert.equal(DEFAULT_PUBLIC_STORE_CONFIG.currency.code, "INR");
      assert.equal(DEFAULT_PUBLIC_STORE_CONFIG.tax.gstRatePercent, 18);
    });
  });
});
