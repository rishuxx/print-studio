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
    console.error("[AuditLog] Failed to record audit log:", err);
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
    const existing = await supabase.from("business_settings").select("*").limit(1).single();
    if (existing.data && existing.data.version !== version) {
      return {
        success: false,
        error: "These settings were modified by another administrator. Please refresh before saving.",
        code: "CONCURRENT_MODIFICATION",
      };
    }

    const newVersion = version + 1;
    const { data, error } = await supabase
      .from("business_settings")
      .update({
        ...updateFields,
        version: newVersion,
        updated_by: admin.userId,
        updated_at: new Date().toISOString(),
      })
      .eq("version", version)
      .select("*")
      .single();

    if (error || !data) {
      return { success: false, error: error?.message || "Failed to update business settings", code: "DATABASE_ERROR" };
    }

    await recordAuditLog(admin.userId, admin.email, "BUSINESS_SETTINGS", data.id, "UPDATE", existing.data, data);
    invalidateSettingsCache();

    return { success: true, data: data as BusinessSettingsRecord, version: newVersion };
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

    const existing = await supabase.from("business_addresses").select("*").eq("is_primary", true).limit(1).single();
    if (existing.data && existing.data.version !== version) {
      return {
        success: false,
        error: "Business address was updated concurrently. Please refresh before saving.",
        code: "CONCURRENT_MODIFICATION",
      };
    }

    const newVersion = version + 1;
    const { data, error } = await supabase
      .from("business_addresses")
      .update({
        ...updateFields,
        version: newVersion,
        updated_by: admin.userId,
        updated_at: new Date().toISOString(),
      })
      .eq("is_primary", true)
      .eq("version", version)
      .select("*")
      .single();

    if (error || !data) {
      return { success: false, error: error?.message || "Failed to update address", code: "DATABASE_ERROR" };
    }

    await recordAuditLog(admin.userId, admin.email, "BUSINESS_ADDRESS", data.id, "UPDATE", existing.data, data);
    invalidateSettingsCache();

    return { success: true, data: data as BusinessAddressRecord, version: newVersion };
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

    const existing = await supabase.from("tax_settings").select("*").limit(1).single();
    if (existing.data && existing.data.version !== version) {
      return {
        success: false,
        error: "Tax settings were modified by another administrator. Please refresh.",
        code: "CONCURRENT_MODIFICATION",
      };
    }

    const newVersion = version + 1;
    const { data, error } = await supabase
      .from("tax_settings")
      .update({
        ...updateFields,
        version: newVersion,
        updated_by: admin.userId,
        updated_at: new Date().toISOString(),
      })
      .eq("version", version)
      .select("*")
      .single();

    if (error || !data) {
      return { success: false, error: error?.message || "Failed to update tax configuration", code: "DATABASE_ERROR" };
    }

    await recordAuditLog(admin.userId, admin.email, "TAX_SETTINGS", data.id, "UPDATE", existing.data, data);
    invalidateSettingsCache();

    return { success: true, data: data as TaxSettingsRecord, version: newVersion };
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

    const existing = await supabase.from("invoice_settings").select("*").limit(1).single();
    if (existing.data && existing.data.version !== version) {
      return {
        success: false,
        error: "Invoice settings were modified concurrently. Please refresh.",
        code: "CONCURRENT_MODIFICATION",
      };
    }

    const newVersion = version + 1;
    const { data, error } = await supabase
      .from("invoice_settings")
      .update({
        ...updateFields,
        version: newVersion,
        updated_by: admin.userId,
        updated_at: new Date().toISOString(),
      })
      .eq("version", version)
      .select("*")
      .single();

    if (error || !data) {
      return { success: false, error: error?.message || "Failed to update invoice settings", code: "DATABASE_ERROR" };
    }

    await recordAuditLog(admin.userId, admin.email, "INVOICE_SETTINGS", data.id, "UPDATE", existing.data, data);
    invalidateSettingsCache();

    return { success: true, data: data as InvoiceSettingsRecord, version: newVersion };
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

    const existing = await supabase.from("order_settings").select("*").limit(1).single();
    if (existing.data && existing.data.version !== version) {
      return {
        success: false,
        error: "Order settings were modified concurrently. Please refresh.",
        code: "CONCURRENT_MODIFICATION",
      };
    }

    const newVersion = version + 1;
    const { data, error } = await supabase
      .from("order_settings")
      .update({
        ...updateFields,
        version: newVersion,
        updated_by: admin.userId,
        updated_at: new Date().toISOString(),
      })
      .eq("version", version)
      .select("*")
      .single();

    if (error || !data) {
      return { success: false, error: error?.message || "Failed to update order rules", code: "DATABASE_ERROR" };
    }

    await recordAuditLog(admin.userId, admin.email, "ORDER_SETTINGS", data.id, "UPDATE", existing.data, data);
    invalidateSettingsCache();

    return { success: true, data: data as OrderSettingsRecord, version: newVersion };
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

    const existing = await supabase.from("production_settings").select("*").limit(1).single();
    if (existing.data && existing.data.version !== version) {
      return {
        success: false,
        error: "Production settings were modified concurrently. Please refresh.",
        code: "CONCURRENT_MODIFICATION",
      };
    }

    const newVersion = version + 1;
    const { data, error } = await supabase
      .from("production_settings")
      .update({
        ...updateFields,
        version: newVersion,
        updated_by: admin.userId,
        updated_at: new Date().toISOString(),
      })
      .eq("version", version)
      .select("*")
      .single();

    if (error || !data) {
      return { success: false, error: error?.message || "Failed to update production SLA", code: "DATABASE_ERROR" };
    }

    await recordAuditLog(admin.userId, admin.email, "PRODUCTION_SETTINGS", data.id, "UPDATE", existing.data, data);
    invalidateSettingsCache();

    return { success: true, data: data as ProductionSettingsRecord, version: newVersion };
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

    const existing = await supabase.from("shipping_settings").select("*").limit(1).single();
    if (existing.data && existing.data.version !== version) {
      return {
        success: false,
        error: "Shipping settings were modified concurrently. Please refresh.",
        code: "CONCURRENT_MODIFICATION",
      };
    }

    const newVersion = version + 1;
    const { data, error } = await supabase
      .from("shipping_settings")
      .update({
        ...updateFields,
        version: newVersion,
        updated_by: admin.userId,
        updated_at: new Date().toISOString(),
      })
      .eq("version", version)
      .select("*")
      .single();

    if (error || !data) {
      return { success: false, error: error?.message || "Failed to update shipping rules", code: "DATABASE_ERROR" };
    }

    await recordAuditLog(admin.userId, admin.email, "SHIPPING_SETTINGS", data.id, "UPDATE", existing.data, data);
    invalidateSettingsCache();

    return { success: true, data: data as ShippingSettingsRecord, version: newVersion };
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

    const existing = await supabase.from("customer_settings").select("*").limit(1).single();
    if (existing.data && existing.data.version !== version) {
      return {
        success: false,
        error: "Customer settings were modified concurrently. Please refresh.",
        code: "CONCURRENT_MODIFICATION",
      };
    }

    const newVersion = version + 1;
    const { data, error } = await supabase
      .from("customer_settings")
      .update({
        ...updateFields,
        version: newVersion,
        updated_by: admin.userId,
        updated_at: new Date().toISOString(),
      })
      .eq("version", version)
      .select("*")
      .single();

    if (error || !data) {
      return { success: false, error: error?.message || "Failed to update customer settings", code: "DATABASE_ERROR" };
    }

    await recordAuditLog(admin.userId, admin.email, "CUSTOMER_SETTINGS", data.id, "UPDATE", existing.data, data);
    invalidateSettingsCache();

    return { success: true, data: data as CustomerSettingsRecord, version: newVersion };
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

    const existing = await supabase.from("notification_settings").select("*").limit(1).single();
    if (existing.data && existing.data.version !== version) {
      return {
        success: false,
        error: "Notification settings were modified concurrently. Please refresh.",
        code: "CONCURRENT_MODIFICATION",
      };
    }

    const newVersion = version + 1;
    const { data, error } = await supabase
      .from("notification_settings")
      .update({
        ...updateFields,
        version: newVersion,
        updated_by: admin.userId,
        updated_at: new Date().toISOString(),
      })
      .eq("version", version)
      .select("*")
      .single();

    if (error || !data) {
      return { success: false, error: error?.message || "Failed to update notifications", code: "DATABASE_ERROR" };
    }

    await recordAuditLog(admin.userId, admin.email, "NOTIFICATION_SETTINGS", data.id, "UPDATE", existing.data, data);
    invalidateSettingsCache();

    return { success: true, data: data as NotificationSettingsRecord, version: newVersion };
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

    const existing = await supabase.from("storefront_settings").select("*").limit(1).single();
    if (existing.data && existing.data.version !== version) {
      return {
        success: false,
        error: "Storefront settings were modified concurrently. Please refresh.",
        code: "CONCURRENT_MODIFICATION",
      };
    }

    const newVersion = version + 1;
    const { data, error } = await supabase
      .from("storefront_settings")
      .update({
        ...updateFields,
        version: newVersion,
        updated_by: admin.userId,
        updated_at: new Date().toISOString(),
      })
      .eq("version", version)
      .select("*")
      .single();

    if (error || !data) {
      return { success: false, error: error?.message || "Failed to update storefront configuration", code: "DATABASE_ERROR" };
    }

    await recordAuditLog(admin.userId, admin.email, "STOREFRONT_SETTINGS", data.id, "UPDATE", existing.data, data);
    invalidateSettingsCache();

    return { success: true, data: data as StorefrontSettingsRecord, version: newVersion };
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
    const admin = await assertAdminPrivilege();
    const parsed = businessHoursListSchema.safeParse(rawInput);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Validation failed", code: "VALIDATION_FAILED" };
    }

    const supabase = await createClient();

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

    const { data: updatedHours } = await supabase.from("business_hours").select("*").order("day_of_week", { ascending: true });

    await recordAuditLog(admin.userId, admin.email, "BUSINESS_HOURS", "all", "UPDATE", null, { hours: updatedHours });
    invalidateSettingsCache();

    return { success: true, data: (updatedHours as BusinessHourRecord[]) || [], version: 1 };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unexpected error";
    return { success: false, error: msg, code: "UNAUTHORIZED" };
  }
}
