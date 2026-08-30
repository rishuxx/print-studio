"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdminAuth } from "@/lib/supabase/admin-guard";
import {
  SaveCustomerProfileSchema,
  SaveAddressSchema,
  SaveNoteSchema,
  UpdateAccountControlsSchema,
  SaveB2BProfileSchema,
  CustomerMergeSchema,
  PrivacyRequestSchema,
  type SaveCustomerProfileInput,
  type SaveAddressInput,
  type SaveNoteInput,
  type UpdateAccountControlsInput,
  type SaveB2BProfileInput,
  type CustomerMergeInput,
  type PrivacyRequestInput,
} from "./validation";
import { normalizeEmail, normalizePhone } from "./queries";

/**
 * 1. Save / Update Customer Profile with Optimistic Concurrency
 */
export async function saveCustomerProfileAction(rawInput: SaveCustomerProfileInput): Promise<{
  success: boolean;
  customerId?: string;
  error?: string;
}> {
  try {
    const { user } = await requireAdminAuth("/admin/customers");
    const parsed = SaveCustomerProfileSchema.safeParse(rawInput);

    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    const data = parsed.data;
    const supabase = await createClient();

    const { error: updateErr } = await supabase
      .from("customers")
      .update({
        display_name: data.displayName,
        first_name: data.firstName || null,
        last_name: data.lastName || null,
        email: data.email,
        normalized_email: normalizeEmail(data.email),
        phone: data.phone || null,
        normalized_phone: normalizePhone(data.phone),
        company_name: data.companyName || null,
        gstin: data.gstin ? data.gstin.toUpperCase() : null,
        customer_type: data.customerType,
        account_status: data.accountStatus,
        marketing_status: data.marketingStatus,
        risk_status: data.riskStatus,
        version: data.version + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.id)
      .eq("version", data.version);

    if (updateErr) {
      return { success: false, error: updateErr.message };
    }

    // Log Activity Event
    await supabase.from("customer_activity_events").insert({
      customer_id: data.id,
      event_type: "profile_updated",
      event_source: "admin_console",
      actor_type: "admin",
      actor_id: user.id,
      summary: `Customer profile updated by staff`,
      metadata: { updatedBy: user.email, status: data.accountStatus },
    });

    revalidatePath(`/admin/customers/${data.id}`);
    revalidatePath("/admin/customers");
    return { success: true, customerId: data.id };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update profile",
    };
  }
}

/**
 * 2. Save / Add Customer Address
 */
export async function saveCustomerAddressAction(rawInput: SaveAddressInput): Promise<{
  success: boolean;
  addressId?: string;
  error?: string;
}> {
  try {
    const { user } = await requireAdminAuth("/admin/customers");
    const parsed = SaveAddressSchema.safeParse(rawInput);

    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    const data = parsed.data;
    const supabase = await createClient();

    if (data.isDefaultShipping) {
      await supabase
        .from("customer_addresses")
        .update({ is_default_shipping: false })
        .eq("customer_id", data.customerId);
    }

    if (data.isDefaultBilling) {
      await supabase
        .from("customer_addresses")
        .update({ is_default_billing: false })
        .eq("customer_id", data.customerId);
    }

    if (data.id) {
      const { error } = await supabase
        .from("customer_addresses")
        .update({
          address_type: data.addressType,
          recipient_name: data.recipientName,
          company_name: data.companyName || null,
          address_line_1: data.addressLine1,
          address_line_2: data.addressLine2 || null,
          landmark: data.landmark || null,
          city: data.city,
          state: data.state,
          postal_code: data.postalCode,
          phone: data.phone,
          is_default_shipping: data.isDefaultShipping,
          is_default_billing: data.isDefaultBilling,
          updated_at: new Date().toISOString(),
        })
        .eq("id", data.id);

      if (error) return { success: false, error: error.message };
    } else {
      const { data: inserted, error } = await supabase
        .from("customer_addresses")
        .insert({
          customer_id: data.customerId,
          address_type: data.addressType,
          recipient_name: data.recipientName,
          company_name: data.companyName || null,
          address_line_1: data.addressLine1,
          address_line_2: data.addressLine2 || null,
          landmark: data.landmark || null,
          city: data.city,
          state: data.state,
          postal_code: data.postalCode,
          phone: data.phone,
          is_default_shipping: data.isDefaultShipping,
          is_default_billing: data.isDefaultBilling,
        })
        .select("id")
        .single();

      if (error) return { success: false, error: error.message };

      // Log Activity Event
      await supabase.from("customer_activity_events").insert({
        customer_id: data.customerId,
        event_type: "address_added",
        event_source: "admin_console",
        actor_type: "admin",
        actor_id: user.id,
        summary: `New address added (${data.city}, ${data.state})`,
      });

      revalidatePath(`/admin/customers/${data.customerId}`);
      return { success: true, addressId: inserted.id };
    }

    revalidatePath(`/admin/customers/${data.customerId}`);
    return { success: true, addressId: data.id };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to save address",
    };
  }
}

/**
 * 3. Add Internal Customer Note
 */
export async function addCustomerNoteAction(rawInput: SaveNoteInput): Promise<{
  success: boolean;
  noteId?: string;
  error?: string;
}> {
  try {
    const { user, profile } = await requireAdminAuth("/admin/customers");
    const parsed = SaveNoteSchema.safeParse(rawInput);

    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    const data = parsed.data;
    const supabase = await createClient();

    const { data: inserted, error } = await supabase
      .from("customer_notes")
      .insert({
        customer_id: data.customerId,
        author_id: user.id,
        author_name: profile.full_name || "Admin Staff",
        note_type: data.noteType,
        content: data.content,
        visibility: data.visibility,
      })
      .select("id")
      .single();

    if (error) return { success: false, error: error.message };

    // Increment notes count
    await supabase.rpc("increment_customer_notes_count", {
      target_customer_id: data.customerId,
    });

    // Log Activity Event
    await supabase.from("customer_activity_events").insert({
      customer_id: data.customerId,
      event_type: "note_added",
      event_source: "admin_console",
      actor_type: "admin",
      actor_id: user.id,
      summary: `Internal note recorded by ${profile.full_name || "Staff"}`,
    });

    revalidatePath(`/admin/customers/${data.customerId}`);
    return { success: true, noteId: inserted.id };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to add note",
    };
  }
}

/**
 * 4. Update Account Controls & Restrictions
 */
export async function updateAccountControlsAction(rawInput: UpdateAccountControlsInput): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const { user } = await requireAdminAuth("/admin/customers");
    const parsed = UpdateAccountControlsSchema.safeParse(rawInput);

    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    const data = parsed.data;
    const supabase = await createClient();

    const { error } = await supabase
      .from("customer_account_controls")
      .upsert({
        customer_id: data.customerId,
        login_enabled: data.loginEnabled,
        checkout_enabled: data.checkoutEnabled,
        ordering_enabled: data.orderingEnabled,
        marketing_enabled: data.marketingEnabled,
        reason_code: data.reasonCode || null,
        reason: data.reason || null,
        expires_at: data.expiresAt || null,
        set_by: user.id,
        version: data.version + 1,
        updated_at: new Date().toISOString(),
      });

    if (error) return { success: false, error: error.message };

    // Log Activity Event
    await supabase.from("customer_activity_events").insert({
      customer_id: data.customerId,
      event_type: "restriction_updated",
      event_source: "admin_console",
      actor_type: "admin",
      actor_id: user.id,
      summary: `Account permissions & controls updated (${data.reason || "Operational rule"})`,
    });

    revalidatePath(`/admin/customers/${data.customerId}`);
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update controls",
    };
  }
}

/**
 * 5. Save / Update B2B Corporate Profile
 */
export async function saveB2BProfileAction(rawInput: SaveB2BProfileInput): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const { user } = await requireAdminAuth("/admin/customers");
    const parsed = SaveB2BProfileSchema.safeParse(rawInput);

    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    const data = parsed.data;
    const supabase = await createClient();

    const { error } = await supabase
      .from("customer_business_profiles")
      .upsert({
        customer_id: data.customerId,
        legal_name: data.legalName,
        trade_name: data.tradeName || null,
        gstin: data.gstin ? data.gstin.toUpperCase() : null,
        business_type: data.businessType,
        industry: data.industry || null,
        website: data.website || null,
        billing_email: data.billingEmail,
        billing_phone: data.billingPhone || null,
        credit_terms: data.creditTerms,
        credit_limit_minor: data.creditLimitMinor,
        purchase_order_required: data.purchaseOrderRequired,
        approval_status: data.approvalStatus,
        version: data.version + 1,
        updated_at: new Date().toISOString(),
      });

    if (error) return { success: false, error: error.message };

    // Update customer type to business if approved
    if (data.approvalStatus === "approved") {
      await supabase
        .from("customers")
        .update({
          customer_type: "business",
          company_name: data.legalName,
          gstin: data.gstin ? data.gstin.toUpperCase() : null,
        })
        .eq("id", data.customerId);
    }

    // Log Activity Event
    await supabase.from("customer_activity_events").insert({
      customer_id: data.customerId,
      event_type: "b2b_profile_updated",
      event_source: "admin_console",
      actor_type: "admin",
      actor_id: user.id,
      summary: `B2B Commercial profile updated for ${data.legalName}`,
    });

    revalidatePath(`/admin/customers/${data.customerId}`);
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to save B2B profile",
    };
  }
}

/**
 * 6. Merge Secondary Customer into Primary Customer (Transactional Workflow)
 */
export async function mergeCustomerAction(rawInput: CustomerMergeInput): Promise<{
  success: boolean;
  targetCustomerId?: string;
  error?: string;
}> {
  try {
    const { user } = await requireAdminAuth("/admin/customers");
    const parsed = CustomerMergeSchema.safeParse(rawInput);

    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    const { sourceCustomerId, targetCustomerId, reason } = parsed.data;
    if (sourceCustomerId === targetCustomerId) {
      return { success: false, error: "Cannot merge customer into itself." };
    }

    const supabase = await createClient();

    // 1. Fetch Source Customer Snapshot
    const { data: sourceCust, error: fetchErr } = await supabase
      .from("customers")
      .select("*")
      .eq("id", sourceCustomerId)
      .single();

    if (fetchErr || !sourceCust) {
      return { success: false, error: "Source customer not found." };
    }

    // 2. Migrate Addresses, Notes, Tag Links to Target Customer
    await supabase
      .from("customer_addresses")
      .update({ customer_id: targetCustomerId, is_default_shipping: false, is_default_billing: false })
      .eq("customer_id", sourceCustomerId);

    await supabase
      .from("customer_notes")
      .update({ customer_id: targetCustomerId })
      .eq("customer_id", sourceCustomerId);

    // 3. Mark Source Customer as Deactivated / Merged
    await supabase
      .from("customers")
      .update({
        account_status: "deactivated",
        deleted_at: new Date().toISOString(),
        display_name: `${sourceCust.display_name} [MERGED into ${targetCustomerId.slice(0, 8)}]`,
      })
      .eq("id", sourceCustomerId);

    // 4. Record Merge Audit Event
    await supabase.from("customer_merge_events").insert({
      source_customer_id: sourceCustomerId,
      target_customer_id: targetCustomerId,
      performed_by: user.id,
      reason,
      snapshot: sourceCust,
    });

    // 5. Activity Log on Target Customer
    await supabase.from("customer_activity_events").insert({
      customer_id: targetCustomerId,
      event_type: "customer_merged",
      event_source: "admin_console",
      actor_type: "admin",
      actor_id: user.id,
      summary: `Merged customer record ${sourceCust.customer_number} (${sourceCust.display_name}) into this account. Reason: ${reason}`,
    });

    revalidatePath(`/admin/customers/${targetCustomerId}`);
    revalidatePath("/admin/customers");
    return { success: true, targetCustomerId };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Customer merge failed",
    };
  }
}

/**
 * 7. Create Customer Privacy Request (DPDP Compliance)
 */
export async function createPrivacyRequestAction(rawInput: PrivacyRequestInput): Promise<{
  success: boolean;
  requestId?: string;
  error?: string;
}> {
  try {
    const { user } = await requireAdminAuth("/admin/customers");
    const parsed = PrivacyRequestSchema.safeParse(rawInput);

    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    const data = parsed.data;
    const supabase = await createClient();

    const { data: inserted, error } = await supabase
      .from("customer_privacy_requests")
      .insert({
        customer_id: data.customerId,
        request_type: data.requestType,
        status: "in_review",
        reason: data.reason || "Customer privacy request under DPDP Rules",
      })
      .select("id")
      .single();

    if (error) return { success: false, error: error.message };

    // Log Activity Event
    await supabase.from("customer_activity_events").insert({
      customer_id: data.customerId,
      event_type: "privacy_request_created",
      event_source: "admin_console",
      actor_type: "admin",
      actor_id: user.id,
      summary: `Privacy request created: ${data.requestType.toUpperCase()}`,
    });

    revalidatePath(`/admin/customers/${data.customerId}`);
    return { success: true, requestId: inserted.id };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Privacy request failed",
    };
  }
}
