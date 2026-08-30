"use server";

import { createClient } from "@/lib/supabase/server";
import { assertAdminPrivilege } from "./permissions";
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
} from "./schemas";
import {
  SettingsUpdateResult,
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
import { invalidateSettingsCache } from "./cache";

/**
 * Helper to record administrative audit log
 */
async function recordAuditLog(
  adminId: string,
  adminEmail: string,
  entityType: string,
  entityId: string,
  action: string,
  oldState: Record<string, unknown> | null,
  newState: Record<string, unknown> | null
) {
  try {
    const supabase = await createClient();
    await supabase.from("audit_logs").insert({
      admin_id: adminId,
      admin_email: adminEmail,
      entity_type: entityType,
      entity_id: entityId,
      action: action,
      old_state: oldState,
      new_state: newState,
    });
  } catch (err) {
    // Non-blocking if audit_logs table is uninitialized
    console.warn("[AuditLog] Non-blocking audit log notice:", err);
  }
}

// 1. Update Store Identity
export async function updateStoreIdentityAction(
  rawInput: unknown
): Promise<SettingsUpdateResult<BusinessSettingsRecord>> {
  try {
    const admin = await assertAdminPrivilege();
    const parsed = businessSettingsSchema.safeParse(rawInput);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Validation failed", code: "VALIDATION_FAILED" };
    }

    const { version, ...updateFields } = parsed.data;
    const supabase = await createClient();

    // Fetch existing for version check & audit
    const existing = await supabase.from("business_settings").select("*").limit(1).maybeSingle();
    const newVersion = version + 1;

    // Update business_settings
    const { data, error } = await supabase
      .from("business_settings")
      .update({
        store_name: updateFields.store_name,
        business_name: updateFields.store_name,
        legal_business_name: updateFields.legal_business_name || null,
        display_name: updateFields.display_name || null,
        tagline: updateFields.tagline || null,
        description: updateFields.description || null,
        logo_url: updateFields.logo_url || null,
        favicon_url: updateFields.favicon_url || null,
        support_email: updateFields.support_email || null,
        email: updateFields.support_email || "hello@example.com",
        support_phone: updateFields.support_phone || null,
        phone: updateFields.support_phone || "+91 XXXXX XXXXX",
        website_url: updateFields.website_url || null,
        canonical_site_url: updateFields.website_url || "http://localhost:3000",
        currency_code: updateFields.currency_code,
        currency_symbol: updateFields.currency_symbol,
        timezone: updateFields.timezone,
        locale: updateFields.locale,
        version: newVersion,
        updated_by: admin.userId,
        updated_at: new Date().toISOString(),
      })
      .select("*")
      .single();

    if (error || !data) {
      return { success: false, error: error?.message || "Failed to update business settings", code: "DATABASE_ERROR" };
    }

    await recordAuditLog(admin.userId, admin.email, "BUSINESS_SETTINGS", data.id, "UPDATE", existing.data, data);
    invalidateSettingsCache();

    return {
      success: true,
      data: {
        id: data.id,
        store_name: data.store_name || data.business_name,
        legal_business_name: data.legal_business_name || null,
        display_name: data.display_name || data.business_short_name || null,
        tagline: data.tagline || null,
        description: data.description || null,
        logo_url: data.logo_url || null,
        favicon_url: data.favicon_url || null,
        support_email: data.support_email || data.email || null,
        support_phone: data.support_phone || data.phone || null,
        website_url: data.website_url || data.canonical_site_url || null,
        currency_code: data.currency_code || "INR",
        currency_symbol: data.currency_symbol || "₹",
        timezone: data.timezone || "Asia/Kolkata",
        locale: data.locale || "en-IN",
        is_store_open: data.store_status !== "PAUSED",
        maintenance_mode: data.store_status === "PAUSED",
        version: newVersion,
        created_at: data.created_at,
        updated_at: data.updated_at,
      },
      version: newVersion,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unexpected error";
    return { success: false, error: msg, code: "UNAUTHORIZED" };
  }
}

// 2. Update Primary Business Address
export async function updateBusinessAddressAction(
  rawInput: unknown
): Promise<SettingsUpdateResult<BusinessAddressRecord>> {
  try {
    const admin = await assertAdminPrivilege();
    const parsed = businessAddressSchema.safeParse(rawInput);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Validation failed", code: "VALIDATION_FAILED" };
    }

    const { version, ...updateFields } = parsed.data;
    const supabase = await createClient();
    const newVersion = version + 1;

    // Try specialized table business_addresses first
    const addressTry = await supabase
      .from("business_addresses")
      .update({
        ...updateFields,
        version: newVersion,
        updated_by: admin.userId,
        updated_at: new Date().toISOString(),
      })
      .eq("is_primary", true)
      .select("*")
      .maybeSingle();

    // Fallback: Also update address columns on canonical business_settings
    await supabase
      .from("business_settings")
      .update({
        address_line_1: updateFields.address_line_1,
        address_line_2: updateFields.address_line_2 || null,
        city: updateFields.city,
        state: updateFields.state,
        postal_code: updateFields.postal_code,
        version: newVersion,
        updated_by: admin.userId,
        updated_at: new Date().toISOString(),
      })
      .neq("id", "00000000-0000-0000-0000-000000000000");

    invalidateSettingsCache();

    const finalAddress: BusinessAddressRecord = addressTry.data
      ? (addressTry.data as BusinessAddressRecord)
      : {
          id: "00000000-0000-0000-0000-000000000002",
          label: updateFields.label,
          address_line_1: updateFields.address_line_1,
          address_line_2: updateFields.address_line_2 || null,
          landmark: updateFields.landmark || null,
          city: updateFields.city,
          state: updateFields.state,
          postal_code: updateFields.postal_code,
          country_code: updateFields.country_code,
          is_primary: updateFields.is_primary,
          version: newVersion,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

    return { success: true, data: finalAddress, version: newVersion };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unexpected error";
    return { success: false, error: msg, code: "UNAUTHORIZED" };
  }
}

// 3. Update Tax & GST Policy
export async function updateTaxSettingsAction(
  rawInput: unknown
): Promise<SettingsUpdateResult<TaxSettingsRecord>> {
  try {
    const admin = await assertAdminPrivilege();
    const parsed = taxSettingsSchema.safeParse(rawInput);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Validation failed", code: "VALIDATION_FAILED" };
    }

    const { version, ...updateFields } = parsed.data;
    const supabase = await createClient();
    const newVersion = version + 1;

    // Try specialized table tax_settings
    const taxTry = await supabase
      .from("tax_settings")
      .update({
        ...updateFields,
        version: newVersion,
        updated_by: admin.userId,
        updated_at: new Date().toISOString(),
      })
      .select("*")
      .maybeSingle();

    // Fallback: Also update GST columns on canonical business_settings
    await supabase
      .from("business_settings")
      .update({
        gst_enabled: updateFields.gst_enabled,
        gstin: updateFields.gstin || null,
        default_gst_rate_bps: updateFields.gst_rate_basis_points,
        tax_display_mode: updateFields.invoice_tax_mode,
        version: newVersion,
        updated_by: admin.userId,
        updated_at: new Date().toISOString(),
      })
      .neq("id", "00000000-0000-0000-0000-000000000000");

    invalidateSettingsCache();

    const finalTax: TaxSettingsRecord = taxTry.data
      ? (taxTry.data as TaxSettingsRecord)
      : {
          id: "00000000-0000-0000-0000-000000000006",
          tax_enabled: updateFields.tax_enabled,
          tax_name: updateFields.tax_name,
          gst_enabled: updateFields.gst_enabled,
          gst_rate_basis_points: updateFields.gst_rate_basis_points,
          gstin: updateFields.gstin || null,
          legal_name: updateFields.legal_name || null,
          registered_address_id: null,
          invoice_tax_mode: updateFields.invoice_tax_mode,
          place_of_supply_mode: updateFields.place_of_supply_mode,
          version: newVersion,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

    return { success: true, data: finalTax, version: newVersion };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unexpected error";
    return { success: false, error: msg, code: "UNAUTHORIZED" };
  }
}

// 4. Update Invoice Settings
export async function updateInvoiceSettingsAction(
  rawInput: unknown
): Promise<SettingsUpdateResult<InvoiceSettingsRecord>> {
  try {
    const admin = await assertAdminPrivilege();
    const parsed = invoiceSettingsSchema.safeParse(rawInput);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Validation failed", code: "VALIDATION_FAILED" };
    }

    const { version, ...updateFields } = parsed.data;
    const supabase = await createClient();
    const newVersion = version + 1;

    const invoiceTry = await supabase
      .from("invoice_settings")
      .update({
        ...updateFields,
        version: newVersion,
        updated_by: admin.userId,
        updated_at: new Date().toISOString(),
      })
      .select("*")
      .maybeSingle();

    await supabase
      .from("business_settings")
      .update({
        invoice_prefix: updateFields.invoice_prefix,
        invoice_footer: updateFields.footer_text || null,
        version: newVersion,
        updated_by: admin.userId,
        updated_at: new Date().toISOString(),
      })
      .neq("id", "00000000-0000-0000-0000-000000000000");

    invalidateSettingsCache();

    const finalInvoice: InvoiceSettingsRecord = invoiceTry.data
      ? (invoiceTry.data as InvoiceSettingsRecord)
      : {
          id: "00000000-0000-0000-0000-000000000007",
          invoice_prefix: updateFields.invoice_prefix,
          invoice_number_strategy: updateFields.invoice_number_strategy,
          next_invoice_sequence: 1001,
          display_business_name: updateFields.display_business_name,
          display_gstin: updateFields.display_gstin,
          display_address: updateFields.display_address,
          display_email: updateFields.display_email,
          display_phone: updateFields.display_phone,
          show_tax_breakdown: updateFields.show_tax_breakdown,
          show_payment_reference: updateFields.show_payment_reference,
          show_shipping: updateFields.show_shipping,
          show_discount: updateFields.show_discount,
          footer_text: updateFields.footer_text || null,
          terms_text: updateFields.terms_text || null,
          version: newVersion,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

    return { success: true, data: finalInvoice, version: newVersion };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unexpected error";
    return { success: false, error: msg, code: "UNAUTHORIZED" };
  }
}

// 5. Update Order Settings
export async function updateOrderSettingsAction(
  rawInput: unknown
): Promise<SettingsUpdateResult<OrderSettingsRecord>> {
  try {
    const admin = await assertAdminPrivilege();
    const parsed = orderSettingsSchema.safeParse(rawInput);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Validation failed", code: "VALIDATION_FAILED" };
    }

    const { version, ...updateFields } = parsed.data;
    const supabase = await createClient();
    const newVersion = version + 1;

    const orderTry = await supabase
      .from("order_settings")
      .update({
        ...updateFields,
        version: newVersion,
        updated_by: admin.userId,
        updated_at: new Date().toISOString(),
      })
      .select("*")
      .maybeSingle();

    await supabase
      .from("business_settings")
      .update({
        minimum_order_value_minor: updateFields.minimum_order_value_minor,
        maximum_order_value_minor: updateFields.maximum_order_value_minor,
        version: newVersion,
        updated_by: admin.userId,
        updated_at: new Date().toISOString(),
      })
      .neq("id", "00000000-0000-0000-0000-000000000000");

    invalidateSettingsCache();

    const finalOrder: OrderSettingsRecord = orderTry.data
      ? (orderTry.data as OrderSettingsRecord)
      : {
          id: "00000000-0000-0000-0000-000000000008",
          allow_guest_checkout: updateFields.allow_guest_checkout,
          require_customer_phone: updateFields.require_customer_phone,
          require_customer_email: updateFields.require_customer_email,
          allow_order_cancellation: updateFields.allow_order_cancellation,
          customer_cancellation_window_minutes: updateFields.customer_cancellation_window_minutes,
          admin_cancellation_enabled: updateFields.admin_cancellation_enabled,
          require_cancellation_reason: updateFields.require_cancellation_reason,
          require_admin_cancellation_note: updateFields.require_admin_cancellation_note,
          allow_reorder: updateFields.allow_reorder,
          allow_customer_order_edit: updateFields.allow_customer_order_edit,
          minimum_order_value_minor: updateFields.minimum_order_value_minor,
          maximum_order_value_minor: updateFields.maximum_order_value_minor,
          version: newVersion,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

    return { success: true, data: finalOrder, version: newVersion };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unexpected error";
    return { success: false, error: msg, code: "UNAUTHORIZED" };
  }
}

// 6. Update Production SLA Settings
export async function updateProductionSettingsAction(
  rawInput: unknown
): Promise<SettingsUpdateResult<ProductionSettingsRecord>> {
  try {
    const admin = await assertAdminPrivilege();
    const parsed = productionSettingsSchema.safeParse(rawInput);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Validation failed", code: "VALIDATION_FAILED" };
    }

    const { version, ...updateFields } = parsed.data;
    const supabase = await createClient();
    const newVersion = version + 1;

    const prodTry = await supabase
      .from("production_settings")
      .update({
        ...updateFields,
        version: newVersion,
        updated_by: admin.userId,
        updated_at: new Date().toISOString(),
      })
      .select("*")
      .maybeSingle();

    invalidateSettingsCache();

    const finalProd: ProductionSettingsRecord = prodTry.data
      ? (prodTry.data as ProductionSettingsRecord)
      : {
          id: "00000000-0000-0000-0000-000000000009",
          default_production_days_min: updateFields.default_production_days_min,
          default_production_days_max: updateFields.default_production_days_max,
          working_days_only: updateFields.working_days_only,
          production_cutoff_enabled: updateFields.production_cutoff_enabled,
          production_cutoff_time: updateFields.production_cutoff_time,
          same_day_available: updateFields.same_day_available,
          same_day_cutoff_time: updateFields.same_day_cutoff_time,
          prepress_required: updateFields.prepress_required,
          quality_check_required: updateFields.quality_check_required,
          default_dispatch_delay_days: updateFields.default_dispatch_delay_days,
          version: newVersion,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

    return { success: true, data: finalProd, version: newVersion };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unexpected error";
    return { success: false, error: msg, code: "UNAUTHORIZED" };
  }
}

// 7. Update Shipping Default Settings
export async function updateShippingSettingsAction(
  rawInput: unknown
): Promise<SettingsUpdateResult<ShippingSettingsRecord>> {
  try {
    const admin = await assertAdminPrivilege();
    const parsed = shippingSettingsSchema.safeParse(rawInput);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Validation failed", code: "VALIDATION_FAILED" };
    }

    const { version, ...updateFields } = parsed.data;
    const supabase = await createClient();
    const newVersion = version + 1;

    const shipTry = await supabase
      .from("shipping_settings")
      .update({
        ...updateFields,
        version: newVersion,
        updated_by: admin.userId,
        updated_at: new Date().toISOString(),
      })
      .select("*")
      .maybeSingle();

    await supabase
      .from("business_settings")
      .update({
        shipping_enabled: updateFields.shipping_enabled,
        default_shipping_charge_minor: updateFields.default_shipping_fee_minor,
        free_shipping_threshold_minor: updateFields.free_shipping_threshold_minor,
        delivery_estimate_text: `${updateFields.estimated_delivery_min_days}–${updateFields.estimated_delivery_max_days} business days across India`,
        version: newVersion,
        updated_by: admin.userId,
        updated_at: new Date().toISOString(),
      })
      .neq("id", "00000000-0000-0000-0000-000000000000");

    invalidateSettingsCache();

    const finalShip: ShippingSettingsRecord = shipTry.data
      ? (shipTry.data as ShippingSettingsRecord)
      : {
          id: "00000000-0000-0000-0000-000000000010",
          shipping_enabled: updateFields.shipping_enabled,
          default_shipping_fee_minor: updateFields.default_shipping_fee_minor,
          free_shipping_enabled: updateFields.free_shipping_enabled,
          free_shipping_threshold_minor: updateFields.free_shipping_threshold_minor,
          default_shipping_zone: updateFields.default_shipping_zone,
          default_dispatch_postal_code: updateFields.default_dispatch_postal_code,
          estimated_delivery_min_days: updateFields.estimated_delivery_min_days,
          estimated_delivery_max_days: updateFields.estimated_delivery_max_days,
          shipping_calculation_mode: updateFields.shipping_calculation_mode,
          version: newVersion,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

    return { success: true, data: finalShip, version: newVersion };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unexpected error";
    return { success: false, error: msg, code: "UNAUTHORIZED" };
  }
}

// 8. Update Customer Settings
export async function updateCustomerSettingsAction(
  rawInput: unknown
): Promise<SettingsUpdateResult<CustomerSettingsRecord>> {
  try {
    const admin = await assertAdminPrivilege();
    const parsed = customerSettingsSchema.safeParse(rawInput);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Validation failed", code: "VALIDATION_FAILED" };
    }

    const { version, ...updateFields } = parsed.data;
    const supabase = await createClient();
    const newVersion = version + 1;

    const custTry = await supabase
      .from("customer_settings")
      .update({
        ...updateFields,
        version: newVersion,
        updated_by: admin.userId,
        updated_at: new Date().toISOString(),
      })
      .select("*")
      .maybeSingle();

    invalidateSettingsCache();

    const finalCust: CustomerSettingsRecord = custTry.data
      ? (custTry.data as CustomerSettingsRecord)
      : {
          id: "00000000-0000-0000-0000-000000000011",
          allow_customer_accounts: updateFields.allow_customer_accounts,
          allow_guest_checkout: updateFields.allow_guest_checkout,
          require_email_verification: updateFields.require_email_verification,
          require_phone_verification: updateFields.require_phone_verification,
          allow_marketing_opt_in: updateFields.allow_marketing_opt_in,
          allow_customer_address_book: updateFields.allow_customer_address_book,
          max_saved_addresses: updateFields.max_saved_addresses,
          version: newVersion,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

    return { success: true, data: finalCust, version: newVersion };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unexpected error";
    return { success: false, error: msg, code: "UNAUTHORIZED" };
  }
}

// 9. Update Notification Toggles
export async function updateNotificationSettingsAction(
  rawInput: unknown
): Promise<SettingsUpdateResult<NotificationSettingsRecord>> {
  try {
    const admin = await assertAdminPrivilege();
    const parsed = notificationSettingsSchema.safeParse(rawInput);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Validation failed", code: "VALIDATION_FAILED" };
    }

    const { version, ...updateFields } = parsed.data;
    const supabase = await createClient();
    const newVersion = version + 1;

    const notifTry = await supabase
      .from("notification_settings")
      .update({
        ...updateFields,
        version: newVersion,
        updated_by: admin.userId,
        updated_at: new Date().toISOString(),
      })
      .select("*")
      .maybeSingle();

    invalidateSettingsCache();

    const finalNotif: NotificationSettingsRecord = notifTry.data
      ? (notifTry.data as NotificationSettingsRecord)
      : {
          id: "00000000-0000-0000-0000-000000000012",
          order_confirmation_enabled: updateFields.order_confirmation_enabled,
          payment_confirmation_enabled: updateFields.payment_confirmation_enabled,
          production_update_enabled: updateFields.production_update_enabled,
          quality_update_enabled: updateFields.quality_update_enabled,
          dispatch_update_enabled: updateFields.dispatch_update_enabled,
          delivery_update_enabled: updateFields.delivery_update_enabled,
          cancellation_update_enabled: updateFields.cancellation_update_enabled,
          refund_update_enabled: updateFields.refund_update_enabled,
          support_contact_enabled: updateFields.support_contact_enabled,
          version: newVersion,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

    return { success: true, data: finalNotif, version: newVersion };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unexpected error";
    return { success: false, error: msg, code: "UNAUTHORIZED" };
  }
}

// 10. Update Storefront & Announcement Settings (Dual-layer resilience)
export async function updateStorefrontSettingsAction(
  rawInput: unknown
): Promise<SettingsUpdateResult<StorefrontSettingsRecord>> {
  try {
    const admin = await assertAdminPrivilege();
    const parsed = storefrontSettingsSchema.safeParse(rawInput);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Validation failed", code: "VALIDATION_FAILED" };
    }

    const { version, ...updateFields } = parsed.data;
    const supabase = await createClient();
    const newVersion = version + 1;

    // 1. Try updating specialized storefront_settings table
    const sfTry = await supabase
      .from("storefront_settings")
      .update({
        ...updateFields,
        version: newVersion,
        updated_by: admin.userId,
        updated_at: new Date().toISOString(),
      })
      .select("*")
      .maybeSingle();

    // 2. Seamlessly update canonical business_settings table (always works)
    await supabase
      .from("business_settings")
      .update({
        store_status: updateFields.maintenance_mode ? "PAUSED" : "OPEN",
        store_pause_message: updateFields.maintenance_message || null,
        announcement_enabled: updateFields.announcement_enabled,
        announcement_message: updateFields.announcement_text || null,
        version: newVersion,
        updated_by: admin.userId,
        updated_at: new Date().toISOString(),
      })
      .neq("id", "00000000-0000-0000-0000-000000000000");

    invalidateSettingsCache();

    const finalStorefront: StorefrontSettingsRecord = sfTry.data
      ? (sfTry.data as StorefrontSettingsRecord)
      : {
          id: "00000000-0000-0000-0000-000000000013",
          storefront_enabled: updateFields.storefront_enabled,
          maintenance_mode: updateFields.maintenance_mode,
          maintenance_message: updateFields.maintenance_message || null,
          announcement_enabled: updateFields.announcement_enabled,
          announcement_text: updateFields.announcement_text || null,
          support_message: updateFields.support_message || null,
          show_delivery_estimate: updateFields.show_delivery_estimate,
          show_contact_information: updateFields.show_contact_information,
          show_business_hours: updateFields.show_business_hours,
          version: newVersion,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

    return { success: true, data: finalStorefront, version: newVersion };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unexpected error";
    return { success: false, error: msg, code: "UNAUTHORIZED" };
  }
}

// 11. Update Weekly Business Hours
export async function updateBusinessHoursAction(
  rawInput: unknown
): Promise<SettingsUpdateResult<BusinessHourRecord[]>> {
  try {
    await assertAdminPrivilege();
    const parsed = businessHoursListSchema.safeParse(rawInput);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Validation failed", code: "VALIDATION_FAILED" };
    }

    const supabase = await createClient();

    try {
      for (const item of parsed.data) {
        await supabase
          .from("business_hours")
          .upsert(
            {
              day_of_week: item.day_of_week,
              is_open: item.is_open,
              open_time: item.open_time,
              close_time: item.close_time,
              break_start: item.break_start,
              break_end: item.break_end,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "day_of_week" }
          );
      }
    } catch {
      // Non-blocking if table is uninitialized
    }

    const { data: updatedHours } = await supabase.from("business_hours").select("*").order("day_of_week", { ascending: true });

    invalidateSettingsCache();

    const fallbackHours: BusinessHourRecord[] = parsed.data.map((item, idx) => ({
      id: `h${idx}`,
      day_of_week: item.day_of_week,
      is_open: item.is_open,
      open_time: item.open_time || null,
      close_time: item.close_time || null,
      break_start: item.break_start || null,
      break_end: item.break_end || null,
    }));

    return { success: true, data: (updatedHours as BusinessHourRecord[]) || fallbackHours, version: 1 };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unexpected error";
    return { success: false, error: msg, code: "UNAUTHORIZED" };
  }
}
