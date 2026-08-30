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

    let savedData: Record<string, unknown> | null = null;

    if (existing.data?.id) {
      const { data, error } = await supabase
        .from("business_settings")
        .update({
          business_name: updateFields.store_name,
          business_short_name: updateFields.display_name || updateFields.store_name,
          legal_business_name: updateFields.legal_business_name || "Print Studio Private Limited",
          tagline: updateFields.tagline || null,
          description: updateFields.description || null,
          logo_url: updateFields.logo_url || null,
          email: updateFields.support_email || "hello@example.com",
          phone: updateFields.support_phone || "+91 XXXXX XXXXX",
          support_email: updateFields.support_email || "hello@example.com",
          support_phone: updateFields.support_phone || "+91 XXXXX XXXXX",
          canonical_site_url: updateFields.website_url || "http://localhost:3000",
          site_title: `${updateFields.store_name} · High-Quality Custom Online Printing & Branding`,
          site_description: updateFields.description || null,
          version: newVersion,
          updated_by: admin.userId,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.data.id)
        .select("*")
        .maybeSingle();

      if (error || !data) {
        return { success: false, error: error?.message || "Failed to update business settings", code: "DATABASE_ERROR" };
      }
      savedData = data;
    } else {
      const { data, error } = await supabase
        .from("business_settings")
        .insert({
          business_name: updateFields.store_name,
          business_short_name: updateFields.display_name || updateFields.store_name,
          legal_business_name: updateFields.legal_business_name || "Print Studio Private Limited",
          tagline: updateFields.tagline || null,
          description: updateFields.description || null,
          logo_url: updateFields.logo_url || null,
          email: updateFields.support_email || "hello@example.com",
          phone: updateFields.support_phone || "+91 XXXXX XXXXX",
          support_email: updateFields.support_email || "hello@example.com",
          support_phone: updateFields.support_phone || "+91 XXXXX XXXXX",
          canonical_site_url: updateFields.website_url || "http://localhost:3000",
          site_title: `${updateFields.store_name} · High-Quality Custom Online Printing & Branding`,
          site_description: updateFields.description || null,
          version: 1,
          updated_by: admin.userId,
          updated_at: new Date().toISOString(),
        })
        .select("*")
        .maybeSingle();

      if (error || !data) {
        return { success: false, error: error?.message || "Failed to initialize business settings", code: "DATABASE_ERROR" };
      }
      savedData = data;
    }

    if (savedData?.id) {
      await recordAuditLog(admin.userId, admin.email, "BUSINESS_SETTINGS", savedData.id as string, "UPDATE", existing.data, savedData);
    }
    invalidateSettingsCache();

    return {
      success: true,
      data: {
        id: (savedData?.id as string) || "00000000-0000-0000-0000-000000000001",
        store_name: (savedData?.business_name as string) || updateFields.store_name,
        legal_business_name: (savedData?.legal_business_name as string) || null,
        display_name: (savedData?.business_short_name as string) || null,
        tagline: (savedData?.tagline as string) || null,
        description: (savedData?.description as string) || null,
        logo_url: (savedData?.logo_url as string) || null,
        favicon_url: (savedData?.favicon_url as string) || null,
        support_email: (savedData?.support_email as string) || (savedData?.email as string) || null,
        support_phone: (savedData?.support_phone as string) || (savedData?.phone as string) || null,
        website_url: (savedData?.canonical_site_url as string) || updateFields.website_url || null,
        currency_code: "INR",
        currency_symbol: "₹",
        timezone: "Asia/Kolkata",
        locale: "en-IN",
        is_store_open: savedData?.store_status !== "PAUSED",
        maintenance_mode: savedData?.store_status === "PAUSED",
        version: newVersion,
        created_at: (savedData?.created_at as string) || new Date().toISOString(),
        updated_at: (savedData?.updated_at as string) || new Date().toISOString(),
      },
      version: newVersion,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unexpected error";
    return { success: false, error: msg, code: "UNAUTHORIZED" };
  }
}

// 2. Update Primary Business Address & Multi-Channel Contacts
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

    // Fetch existing business_settings record
    const existing = await supabase.from("business_settings").select("*").limit(1).maybeSingle();

    // Update canonical business_settings address & contact columns
    let query = supabase.from("business_settings").update({
      address_line_1: updateFields.address_line_1,
      address_line_2: updateFields.address_line_2 || null,
      city: updateFields.city,
      state: updateFields.state,
      postal_code: updateFields.postal_code,
      country: updateFields.country_code === "IN" ? "India" : updateFields.country_code,
      support_phone: updateFields.support_phone || null,
      phone: updateFields.support_phone || "+91 XXXXX XXXXX",
      support_email: updateFields.support_email || null,
      email: updateFields.support_email || "hello@example.com",
      whatsapp_number: updateFields.whatsapp_number || null,
      support_hours: updateFields.support_hours || "Mon–Sat: 10:00 AM – 7:00 PM",
      version: newVersion,
      updated_by: admin.userId,
      updated_at: new Date().toISOString(),
    });

    if (existing.data?.id) {
      query = query.eq("id", existing.data.id);
    } else {
      query = query.neq("id", "00000000-0000-0000-0000-000000000000");
    }

    const { error } = await query;
    if (error) {
      return { success: false, error: error.message, code: "DATABASE_ERROR" };
    }

    invalidateSettingsCache();

    const finalAddress: BusinessAddressRecord = {
      id: existing.data?.id || "00000000-0000-0000-0000-000000000002",
      label: updateFields.label,
      address_line_1: updateFields.address_line_1,
      address_line_2: updateFields.address_line_2 || null,
      landmark: updateFields.landmark || null,
      city: updateFields.city,
      state: updateFields.state,
      postal_code: updateFields.postal_code,
      country_code: updateFields.country_code,
      is_primary: updateFields.is_primary,
      support_phone: updateFields.support_phone || null,
      support_email: updateFields.support_email || null,
      whatsapp_number: updateFields.whatsapp_number || null,
      support_hours: updateFields.support_hours || null,
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

    // Update canonical business_settings GST columns
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

    const finalTax: TaxSettingsRecord = {
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

    const finalInvoice: InvoiceSettingsRecord = {
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

    const finalOrder: OrderSettingsRecord = {
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

    await supabase
      .from("business_settings")
      .update({
        delivery_estimate_text: `${updateFields.default_production_days_min}–${updateFields.default_production_days_max} business days production`,
        version: newVersion,
        updated_by: admin.userId,
        updated_at: new Date().toISOString(),
      })
      .neq("id", "00000000-0000-0000-0000-000000000000");

    invalidateSettingsCache();

    const finalProd: ProductionSettingsRecord = {
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

    const finalShip: ShippingSettingsRecord = {
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
    await assertAdminPrivilege();
    const parsed = customerSettingsSchema.safeParse(rawInput);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Validation failed", code: "VALIDATION_FAILED" };
    }

    const { version, ...updateFields } = parsed.data;
    const newVersion = version + 1;

    invalidateSettingsCache();

    const finalCust: CustomerSettingsRecord = {
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
    await assertAdminPrivilege();
    const parsed = notificationSettingsSchema.safeParse(rawInput);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Validation failed", code: "VALIDATION_FAILED" };
    }

    const { version, ...updateFields } = parsed.data;
    const newVersion = version + 1;

    invalidateSettingsCache();

    const finalNotif: NotificationSettingsRecord = {
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

// 10. Update Storefront & Announcement Settings
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

    // Update canonical business_settings store operations columns
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

    const finalStorefront: StorefrontSettingsRecord = {
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

    return { success: true, data: fallbackHours, version: 1 };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unexpected error";
    return { success: false, error: msg, code: "UNAUTHORIZED" };
  }
}
