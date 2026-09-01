"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdminAuth } from "@/lib/supabase/admin-guard";
import { requirePermission } from "@/lib/auth/server-permissions";
import { SaveBusinessSettingsSchema, type SaveBusinessSettingsInput } from "./validation";

export interface SaveSettingsResult {
  success: boolean;
  version?: number;
  error?: string;
}

/**
 * Saves authoritative business settings with optimistic concurrency version control.
 * Automatically invalidates relevant storefront, cart, checkout, and admin routes.
 */
export async function saveBusinessSettingsAction(
  rawInput: SaveBusinessSettingsInput
): Promise<SaveSettingsResult> {
  try {
    // 1. Authorize: Admin role verified on server
    const { user, profile } = await requirePermission("settings.view", "/admin/settings");

    // 2. Validate with Zod
    const parsed = SaveBusinessSettingsSchema.safeParse(rawInput);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    const data = parsed.data;
    const supabase = await createClient();

    // 3. Update existing record with version checking
    const { data: existing, error: fetchErr } = await supabase
      .from("business_settings")
      .select("id, version")
      .order("updated_at", { ascending: false })
      .limit(1)
      .single();

    if (fetchErr || !existing) {
      // First insert if empty
      const { data: inserted, error: insertErr } = await supabase
        .from("business_settings")
        .insert({
          ...data,
          updated_by: user.id,
          version: 1,
        })
        .select("version")
        .single();

      if (insertErr) {
        return { success: false, error: insertErr.message };
      }

      revalidatePath("/", "layout");
      revalidatePath("/admin/settings");
      return { success: true, version: inserted.version };
    }

    // 4. Optimistic concurrency guard
    if (existing.version !== data.version) {
      return {
        success: false,
        error: "Settings were updated by another administrator. Please refresh the page before saving.",
      };
    }

    const newVersion = existing.version + 1;

    const { error: updateErr } = await supabase
      .from("business_settings")
      .update({
        business_name: data.business_name.trim(),
        business_short_name: data.business_short_name.trim(),
        legal_business_name: data.legal_business_name.trim(),
        email: data.email.trim().toLowerCase(),
        phone: data.phone.trim(),
        whatsapp_number: data.whatsapp_number ? data.whatsapp_number.trim() : null,
        address_line_1: data.address_line_1.trim(),
        address_line_2: data.address_line_2 ? data.address_line_2.trim() : null,
        city: data.city.trim(),
        state: data.state.trim(),
        postal_code: data.postal_code.trim(),
        country: data.country.trim(),
        gst_enabled: data.gst_enabled,
        gstin: data.gstin ? data.gstin.trim().toUpperCase() : null,
        default_gst_rate_bps: data.default_gst_rate_bps,
        tax_display_mode: data.tax_display_mode,
        default_sac_hsn: data.default_sac_hsn ? data.default_sac_hsn.trim() : null,
        store_status: data.store_status,
        store_pause_message: data.store_pause_message ? data.store_pause_message.trim() : null,
        accept_new_orders: data.accept_new_orders,
        checkout_enabled: data.checkout_enabled,
        minimum_order_value_minor: data.minimum_order_value_minor,
        maximum_order_value_minor: data.maximum_order_value_minor,
        allow_customer_notes: data.allow_customer_notes,
        shipping_enabled: data.shipping_enabled,
        default_shipping_charge_minor: data.default_shipping_charge_minor,
        free_shipping_threshold_minor: data.free_shipping_threshold_minor,
        delivery_estimate_text: data.delivery_estimate_text ? data.delivery_estimate_text.trim() : null,
        support_email: data.support_email.trim().toLowerCase(),
        support_phone: data.support_phone.trim(),
        support_hours: data.support_hours ? data.support_hours.trim() : null,
        whatsapp_floating_enabled: data.whatsapp_floating_enabled,
        announcement_enabled: data.announcement_enabled,
        announcement_message: data.announcement_message ? data.announcement_message.trim() : null,
        announcement_link: data.announcement_link ? data.announcement_link.trim() : null,
        invoice_prefix: data.invoice_prefix.trim().toUpperCase(),
        invoice_footer: data.invoice_footer ? data.invoice_footer.trim() : null,
        site_title: data.site_title.trim(),
        site_description: data.site_description.trim(),
        canonical_site_url: data.canonical_site_url.trim(),
        version: newVersion,
        updated_by: user.id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id)
      .eq("version", existing.version);

    if (updateErr) {
      return { success: false, error: updateErr.message };
    }

    // 5. Invalidate site-wide layout and critical consumer paths
    revalidatePath("/", "layout");
    revalidatePath("/cart");
    revalidatePath("/checkout");
    revalidatePath("/payment");
    revalidatePath("/admin/settings");

    return { success: true, version: newVersion };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update business settings",
    };
  }
}
