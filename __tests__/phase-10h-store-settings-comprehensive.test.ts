import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  businessSettingsSchema,
  businessAddressSchema,
  taxSettingsSchema,
  invoiceSettingsSchema,
  orderSettingsSchema,
  productionSettingsSchema,
  shippingSettingsSchema,
  customerSettingsSchema,
  notificationSettingsSchema,
  storefrontSettingsSchema,
  businessHoursListSchema,
} from "@/lib/business-settings/schemas";
import {
  DEFAULT_FULL_CONFIGURATION,
  getSafePublicBusinessConfig,
} from "@/lib/business-settings/defaults";

describe("Phase 10H: Authoritative Store Settings & Business Engine Validation", () => {
  // 1. Store Identity
  describe("1. Store Identity & Regional Formatting", () => {
    it("accepts valid store identity payload with INR and Asia/Kolkata defaults", () => {
      const valid = {
        store_name: "PreetyPrints",
        legal_business_name: "Print Studio Private Limited",
        display_name: "PreetyPrints",
        tagline: "Custom printing for individuals and enterprises",
        description: "High-quality custom printing with fast local turnaround.",
        logo_url: null,
        favicon_url: null,
        support_email: "ayushiaggrawal13@gmail.com",
        support_phone: "+91 6388693472",
        website_url: "http://localhost:3000",
        currency_code: "INR",
        currency_symbol: "₹",
        timezone: "Asia/Kolkata",
        locale: "en-IN",
        is_store_open: true,
        maintenance_mode: false,
        version: 1,
      };
      const res = businessSettingsSchema.safeParse(valid);
      assert.equal(res.success, true);
    });

    it("rejects store name shorter than 2 characters", () => {
      const invalid = { store_name: "P", version: 1 };
      const res = businessSettingsSchema.safeParse(invalid);
      assert.equal(res.success, false);
    });
  });

  // 2. Address & Multi-Channel Contact Endpoints
  describe("2. Operational Address & Multi-Channel Endpoints", () => {
    it("validates 6-digit Indian PIN code and custom support contact endpoints", () => {
      const valid = {
        label: "Headquarters & Main Production Facility",
        address_line_1: "Balaji Complex, Prem Nagar",
        address_line_2: "Commercial Complex",
        landmark: "Near Graphic Era Hospital",
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
      const res = businessAddressSchema.safeParse(valid);
      assert.equal(res.success, true);
    });

    it("rejects invalid 5-digit PIN code", () => {
      const invalid = {
        label: "HQ",
        address_line_1: "Prem Nagar",
        city: "Dehradun",
        state: "Uttarakhand",
        postal_code: "24800",
        version: 1,
      };
      const res = businessAddressSchema.safeParse(invalid);
      assert.equal(res.success, false);
    });
  });

  // 3. Tax & GST Policy
  describe("3. Tax & GST Policy Engine", () => {
    it("accepts valid 15-character GSTIN with 18% (1800 bps) GST inclusive", () => {
      const valid = {
        tax_enabled: true,
        tax_name: "GST",
        gst_enabled: true,
        gst_rate_basis_points: 1800,
        gstin: "05ABCDE1234F1Z5",
        legal_name: "Print Studio Private Limited",
        invoice_tax_mode: "inclusive",
        place_of_supply_mode: "DESTINATION_STATE",
        version: 1,
      };
      const res = taxSettingsSchema.safeParse(valid);
      assert.equal(res.success, true);
    });

    it("calculates correct inclusive GST breakdown for gross amount ₹118", () => {
      const grossPaise = 11800; // ₹118.00
      const gstRateBps = 1800; // 18%
      const taxablePaise = Math.round(grossPaise / (1 + gstRateBps / 10000));
      const taxPaise = grossPaise - taxablePaise;

      assert.equal(taxablePaise, 10000); // ₹100.00
      assert.equal(taxPaise, 1800); // ₹18.00
    });

    it("rejects invalid GSTIN format", () => {
      const invalid = {
        gst_enabled: true,
        gstin: "INVALID_GST",
        gst_rate_basis_points: 1800,
        version: 1,
      };
      const res = taxSettingsSchema.safeParse(invalid);
      assert.equal(res.success, false);
    });
  });

  // 4. Invoice Template
  describe("4. Invoice Template & Numbering Rules", () => {
    it("validates invoice prefix and footer template configuration", () => {
      const valid = {
        invoice_prefix: "PRT-INV",
        invoice_number_strategy: "YEAR_ORDER_NUMBER",
        display_business_name: true,
        display_gstin: true,
        display_address: true,
        display_email: true,
        display_phone: true,
        show_tax_breakdown: true,
        show_payment_reference: true,
        show_shipping: true,
        show_discount: true,
        footer_text: "Thank you for choosing PreetyPrints for your custom printing!",
        terms_text: "Goods once printed to custom artwork cannot be returned.",
        version: 1,
      };
      const res = invoiceSettingsSchema.safeParse(valid);
      assert.equal(res.success, true);
    });
  });

  // 5. Order & Production SLA Limits
  describe("5. Order Limits & Production SLA", () => {
    it("accepts valid order minimum ₹100 and maximum ₹5,00,000 bounds", () => {
      const valid = {
        allow_guest_checkout: false,
        require_customer_phone: true,
        require_customer_email: true,
        allow_order_cancellation: true,
        customer_cancellation_window_minutes: 60,
        admin_cancellation_enabled: true,
        require_cancellation_reason: true,
        require_admin_cancellation_note: false,
        allow_reorder: true,
        allow_customer_order_edit: false,
        minimum_order_value_minor: 10000, // ₹100
        maximum_order_value_minor: 50000000, // ₹500,000
        version: 1,
      };
      const res = orderSettingsSchema.safeParse(valid);
      assert.equal(res.success, true);
    });

    it("rejects minimum order value exceeding maximum order value", () => {
      const invalid = {
        allow_guest_checkout: false,
        require_customer_phone: true,
        require_customer_email: true,
        allow_order_cancellation: true,
        customer_cancellation_window_minutes: 60,
        admin_cancellation_enabled: true,
        require_cancellation_reason: true,
        require_admin_cancellation_note: false,
        allow_reorder: true,
        allow_customer_order_edit: false,
        minimum_order_value_minor: 60000000,
        maximum_order_value_minor: 50000000,
        version: 1,
      };
      const res = orderSettingsSchema.safeParse(invalid);
      assert.equal(res.success, false);
    });

    it("accepts valid production SLA 2–3 business days with 14:00 cutoff", () => {
      const valid = {
        default_production_days_min: 2,
        default_production_days_max: 3,
        daily_production_cutoff_time: "14:00",
        same_day_cutoff_time: "11:00",
        prepress_required: true,
        quality_check_required: true,
        default_dispatch_delay_days: 0,
        version: 1,
      };
      const res = productionSettingsSchema.safeParse(valid);
      assert.equal(res.success, true);
    });
  });

  // 6. Shipping Defaults & Threshold
  describe("6. Shipping Defaults & Free Shipping Threshold", () => {
    it("accepts standard ₹99 shipping with ₹1500 free shipping threshold", () => {
      const valid = {
        shipping_enabled: true,
        default_shipping_fee_minor: 9900,
        free_shipping_enabled: true,
        free_shipping_threshold_minor: 150000,
        default_shipping_zone: "DOMESTIC_INDIA",
        default_dispatch_postal_code: "248007",
        estimated_delivery_min_days: 3,
        estimated_delivery_max_days: 5,
        shipping_calculation_mode: "FLAT_RATE",
        version: 1,
      };
      const res = shippingSettingsSchema.safeParse(valid);
      assert.equal(res.success, true);
    });

    it("calculates ₹0 shipping when subtotal >= ₹1500 free threshold", () => {
      const subtotalPaise = 200000; // ₹2000
      const thresholdPaise = 150000; // ₹1500
      const standardFeePaise = 9900; // ₹99

      const shippingFee = subtotalPaise >= thresholdPaise ? 0 : standardFeePaise;
      assert.equal(shippingFee, 0);
    });

    it("calculates ₹99 standard shipping when subtotal < ₹1500 free threshold", () => {
      const subtotalPaise = 120000; // ₹1200
      const thresholdPaise = 150000; // ₹1500
      const standardFeePaise = 9900; // ₹99

      const shippingFee = subtotalPaise >= thresholdPaise ? 0 : standardFeePaise;
      assert.equal(shippingFee, 9900);
    });
  });

  // 7. Customer Accounts Policy (Mandatory Auth)
  describe("7. Customer Accounts Policy & Mandatory Authentication", () => {
    it("enforces customer registration enabled and guest checkout disabled", () => {
      const valid = {
        allow_customer_accounts: true,
        allow_guest_checkout: false,
        require_email_verification: true,
        require_phone_verification: true,
        allow_marketing_opt_in: true,
        allow_customer_address_book: true,
        max_saved_addresses: 10,
        version: 1,
      };
      const res = customerSettingsSchema.safeParse(valid);
      assert.equal(res.success, true);
      assert.equal(res.data.allow_guest_checkout, false);
      assert.equal(res.data.allow_customer_accounts, true);
    });
  });

  // 8. Notifications
  describe("8. Lifecycle Notification Safety", () => {
    it("validates lifecycle notification toggles", () => {
      const valid = {
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
      };
      const res = notificationSettingsSchema.safeParse(valid);
      assert.equal(res.success, true);
    });
  });

  // 9. Store Control & Maintenance Mode
  describe("9. Storefront Policy & Maintenance Control", () => {
    it("validates storefront announcement and store pause messaging", () => {
      const valid = {
        storefront_enabled: true,
        maintenance_mode: false,
        maintenance_message: "Scheduled Maintenance in Progress",
        announcement_enabled: true,
        announcement_text: "Festive season orders open! Enjoy 10% off on all business cards.",
        support_message: "Need custom bulk quotation? Our production studio team is available Mon–Sat.",
        show_delivery_estimate: true,
        show_contact_information: true,
        show_business_hours: true,
        version: 1,
      };
      const res = storefrontSettingsSchema.safeParse(valid);
      assert.equal(res.success, true);
    });
  });

  // 10. Business Hours
  describe("10. Weekly Operating Hours", () => {
    it("validates complete 7-day operational schedule", () => {
      const valid = [
        { day_of_week: 1, is_open: true, open_time: "09:00", close_time: "19:00", break_start: null, break_end: null },
        { day_of_week: 2, is_open: true, open_time: "09:00", close_time: "19:00", break_start: null, break_end: null },
        { day_of_week: 3, is_open: true, open_time: "09:00", close_time: "19:00", break_start: null, break_end: null },
        { day_of_week: 4, is_open: true, open_time: "09:00", close_time: "19:00", break_start: null, break_end: null },
        { day_of_week: 5, is_open: true, open_time: "09:00", close_time: "19:00", break_start: null, break_end: null },
        { day_of_week: 6, is_open: true, open_time: "10:00", close_time: "18:00", break_start: null, break_end: null },
        { day_of_week: 0, is_open: false, open_time: null, close_time: null, break_start: null, break_end: null },
      ];
      const res = businessHoursListSchema.safeParse(valid);
      assert.equal(res.success, true);
    });
  });

  // 11. Security & Optimistic Concurrency
  describe("11. Security Projections & Concurrency Protection", () => {
    it("strips internal sequences from safe public projection", () => {
      const safePublic = getSafePublicBusinessConfig(DEFAULT_FULL_CONFIGURATION);
      assert.equal(safePublic.store_name, "Print Studio");
      assert.equal(safePublic.currency_code, "INR");
      assert.equal(safePublic.currency_symbol, "₹");
      assert.equal("next_invoice_sequence" in safePublic, false);
      assert.equal("updated_by" in safePublic, false);
    });
  });
});
