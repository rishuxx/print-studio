"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import type { Database } from "@/lib/supabase/database.types";

export type AuthActionResult = {
  success: boolean;
  error?: string;
  message?: string;
  role?: "customer" | "admin";
  redirectTo?: string;
};

/**
 * Register a new customer via Supabase Auth.
 * The PostgreSQL handle_new_user trigger automatically creates the profiles record.
 */
export async function registerCustomer(formData: {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  companyName?: string;
}): Promise<AuthActionResult> {
  const supabase = await createClient();
  const origin = (await headers()).get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const { data, error } = await supabase.auth.signUp({
    email: formData.email.trim(),
    password: formData.password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        full_name: formData.fullName.trim(),
        phone: formData.phone?.trim() || null,
        company_name: formData.companyName?.trim() || null,
      },
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  // If email confirmation is disabled in Supabase, user is immediately logged in
  if (data.session) {
    return { success: true, message: "Account created and logged in successfully!" };
  }

  return {
    success: true,
    message: "Registration successful! Please check your email inbox to verify your account.",
  };
}

/**
 * Log in an existing customer or admin via Supabase Auth.
 * Authoritatively resolves role from PostgreSQL `profiles` table to direct admin to /admin.
 */
export async function loginCustomer(
  formData: {
    email: string;
    password: string;
  },
  requestedRedirect?: string | null
): Promise<AuthActionResult> {
  const supabase = await createClient();

  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email: formData.email.trim(),
    password: formData.password,
  });

  if (error || !authData.user) {
    return { success: false, error: error?.message || "Invalid email or password." };
  }

  // Authoritatively query profiles.role server-side
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", authData.user.id)
    .maybeSingle();

  const role = profile?.role === "admin" ? "admin" : "customer";

  // Validate internal redirect URL to prevent open redirect vulnerabilities
  const isValidInternalRedirect = (url?: string | null) =>
    !!url && url.startsWith("/") && !url.startsWith("//");

  let destination = "/account";

  if (role === "admin") {
    // If admin requested a specific /admin route, honor it; otherwise send to /admin dashboard
    if (isValidInternalRedirect(requestedRedirect) && requestedRedirect?.startsWith("/admin")) {
      destination = requestedRedirect;
    } else {
      destination = "/admin";
    }
  } else {
    // Customer
    if (isValidInternalRedirect(requestedRedirect) && !requestedRedirect?.startsWith("/admin")) {
      destination = requestedRedirect!;
    } else {
      destination = "/account";
    }
  }

  return {
    success: true,
    role,
    redirectTo: destination,
  };
}

/**
 * Log out current customer.
 */
export async function logoutCustomer() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

/**
 * Request password recovery email.
 */
export async function forgotPassword(email: string): Promise<AuthActionResult> {
  const supabase = await createClient();
  const origin = (await headers()).get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
    redirectTo: `${origin}/reset-password`,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return {
    success: true,
    message: "If an account with that email exists, we have sent a secure password reset link.",
  };
}

/**
 * Update user password after recovery.
 */
export async function resetPassword(newPassword: string): Promise<AuthActionResult> {
  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, message: "Password updated successfully!" };
}

/**
 * Update customer profile fields (full_name, company_name, phone).
 */
export async function updateCustomerProfile(profileData: {
  fullName: string;
  companyName?: string;
  phone?: string;
}): Promise<AuthActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized. Please log in." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: profileData.fullName.trim(),
      company_name: profileData.companyName?.trim() || null,
      phone: profileData.phone?.trim() || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/account");
  return { success: true, message: "Profile updated successfully." };
}

/**
 * Add a new delivery address for the authenticated customer.
 */
export async function addCustomerAddress(addressData: {
  label?: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}): Promise<AuthActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized. Please log in." };
  }

  // If new address is default, reset other addresses
  if (addressData.isDefault) {
    await supabase
      .from("addresses")
      .update({ is_default: false })
      .eq("user_id", user.id);
  }

  const { error } = await supabase.from("addresses").insert({
    user_id: user.id,
    label: addressData.label?.trim() || null,
    full_name: addressData.fullName.trim(),
    phone: addressData.phone.trim(),
    line1: addressData.line1.trim(),
    line2: addressData.line2?.trim() || null,
    landmark: addressData.landmark?.trim() || null,
    city: addressData.city.trim(),
    state: addressData.state.trim(),
    pincode: addressData.pincode.trim(),
    is_default: addressData.isDefault || false,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/account");
  return { success: true, message: "Address added successfully." };
}

/**
 * Delete a customer address.
 */
export async function deleteCustomerAddress(addressId: string): Promise<AuthActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized. Please log in." };
  }

  const { error } = await supabase
    .from("addresses")
    .delete()
    .eq("id", addressId)
    .eq("user_id", user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/account");
  return { success: true, message: "Address deleted successfully." };
}

/**
 * Set an address as the default delivery address.
 */
export async function setDefaultAddress(addressId: string): Promise<AuthActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized. Please log in." };
  }

  // Set all to false first
  await supabase
    .from("addresses")
    .update({ is_default: false })
    .eq("user_id", user.id);

  // Set target address to true
  const { error } = await supabase
    .from("addresses")
    .update({ is_default: true })
    .eq("id", addressId)
    .eq("user_id", user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/account");
  return { success: true, message: "Default address updated." };
}

/**
 * Persist an order to PostgreSQL (orders, order_items, order_events)
 */
export async function createDatabaseOrder(payload: {
  orderNumber: string;
  invoiceNumber: string;
  subtotal: number;
  tax: number;
  shipping: number;
  discount?: number;
  total: number;
  paymentMethod: string;
  paymentReference: string;
  customer: {
    fullName: string;
    companyName?: string;
    email: string;
    phone: string;
  };
  delivery: {
    addressLine1: string;
    city: string;
    state: string;
    pincode: string;
    notes?: string;
  };
  lines: Array<{
    productId: string;
    productTitle: string;
    sku?: string;
    quantity: number;
    unitPrice: number;
    linePrice: number;
    selectedOptions: unknown;
    artworkSummary?: unknown;
  }>;
}): Promise<{ success: boolean; orderId?: string; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 1. Insert parent order
  const { data: orderData, error: orderError } = await supabase
    .from("orders")
    .insert({
      order_number: payload.orderNumber,
      invoice_number: payload.invoiceNumber,
      user_id: user?.id || null,
      status: "artwork_review",
      payment_status: "paid",
      payment_method: payload.paymentMethod,
      payment_reference: payload.paymentReference,
      subtotal: payload.subtotal,
      tax: payload.tax,
      shipping: payload.shipping,
      discount: payload.discount || 0,
      total: payload.total,
      customer_snapshot: payload.customer,
      delivery_snapshot: payload.delivery,
      notes: payload.delivery.notes || null,
    })
    .select("id")
    .single();

  if (orderError || !orderData) {
    return { success: false, error: orderError?.message || "Failed to create order." };
  }

  const orderId = orderData.id;

  // 2. Insert order items
  if (payload.lines.length > 0) {
    const itemRows = payload.lines.map((l) => ({
      order_id: orderId,
      product_id: l.productId,
      product_title: l.productTitle,
      sku: l.sku || null,
      quantity: l.quantity,
      unit_price: l.unitPrice,
      line_price: l.linePrice,
      selected_options: (l.selectedOptions as Database["public"]["Tables"]["order_items"]["Insert"]["selected_options"]) ?? [],
      artwork_summary: (l.artworkSummary as Database["public"]["Tables"]["order_items"]["Insert"]["artwork_summary"]) ?? null,
    }));

    await supabase.from("order_items").insert(itemRows);
  }

  // 3. Insert initial order events
  await supabase.from("order_events").insert([
    {
      order_id: orderId,
      status: "order_placed",
      title: "Order Placed & Specifications Received",
      description: "Your custom print job and configurations have been registered in our press queue.",
    },
    {
      order_id: orderId,
      status: "payment_confirmed",
      title: "Payment Confirmed",
      description: `Transaction verified via ${payload.paymentMethod}.`,
    },
    {
      order_id: orderId,
      status: "artwork_review",
      title: "Pre-Press & Artwork Review",
      description: "Our studio team is inspecting your resolution (300 DPI), bleed (3mm), and color profile (CMYK).",
    },
  ]);

  revalidatePath("/orders");
  revalidatePath("/account");

  return { success: true, orderId };
}

/**
 * Server-side Order Status Transition Action
 * Invokes PostgreSQL atomic RPC transition_order_status
 */
export async function updateOrderStatus(
  orderId: string,
  targetStatus: Database["public"]["Tables"]["orders"]["Row"]["status"],
  expectedCurrentStatus?: Database["public"]["Tables"]["orders"]["Row"]["status"]
): Promise<{ success: boolean; error?: string; newStatus?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized. Please log in." };
  }

  // 1. Resolve UUID if given order_number string
  let targetUuid = orderId;
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orderId);
  if (!isUuid) {
    const { data: found } = await supabase
      .from("orders")
      .select("id")
      .eq("order_number", orderId)
      .maybeSingle();

    if (!found) {
      return { success: false, error: "Order reference not found." };
    }
    targetUuid = found.id;
  }

  // 2. Invoke atomic PostgreSQL transition RPC
  const { data: rpcResult, error: rpcError } = await supabase.rpc("transition_order_status", {
    p_order_id: targetUuid,
    p_target_status: targetStatus,
    p_expected_current_status: expectedCurrentStatus || null,
  });

  if (rpcError) {
    return { success: false, error: rpcError.message || "Failed to update order status." };
  }

  const result = rpcResult as { success: boolean; error?: string; new_status?: string };
  if (!result.success) {
    return { success: false, error: result.error || "Status transition rejected." };
  }

  revalidatePath("/orders");
  revalidatePath(`/orders/${orderId}`);
  revalidatePath("/account");

  return { success: true, newStatus: result.new_status };
}

/**
 * Customer / Admin Order Cancellation Server Action
 */
export async function requestCancelDatabaseOrder(orderId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized. Please log in." };
  }

  return updateOrderStatus(orderId, "cancelled");
}

/**
 * Generate a short-lived (15 minutes) signed URL for private artwork downloads.
 * Verifies that the caller owns the order or is an administrator.
 */
export async function createArtworkSignedUrl(
  orderId: string,
  storagePath: string
): Promise<{ success: boolean; signedUrl?: string; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized. Please log in." };
  }

  // 1. Verify caller authorization: Fetch order and profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const isAdmin = profile?.role === "admin";

  const cleanId = orderId ? orderId.trim() : "";
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanId);

  let query = supabase
    .from("orders")
    .select("id, user_id, order_number");

  if (isUuid) {
    query = query.or(`id.eq.${cleanId},order_number.eq.${cleanId}`);
  } else {
    query = query.eq("order_number", cleanId);
  }

  const { data: order } = await query.maybeSingle();

  if (!order) {
    return { success: false, error: "Order record not found." };
  }

  if (!isAdmin && order.user_id !== user.id) {
    return { success: false, error: "Access denied to requested print assets." };
  }

  // 2. Create signed download URL valid for 15 minutes (900 seconds)
  const { data: signed, error: signError } = await supabase.storage
    .from("artwork")
    .createSignedUrl(storagePath, 900);

  if (signError || !signed?.signedUrl) {
    return { success: false, error: signError?.message || "Failed to generate signed download link." };
  }

  return { success: true, signedUrl: signed.signedUrl };
}

/**
 * Server-side Bulk Order Status Transition Action
 * Iterates through requested orders and independently executes transition_order_status
 * to guarantee atomic validation and event tracking per order.
 */
export async function bulkUpdateOrdersStatus(
  orderIds: string[],
  targetStatus: Database["public"]["Tables"]["orders"]["Row"]["status"]
): Promise<{
  totalRequested: number;
  successCount: number;
  failedCount: number;
  results: Array<{
    orderId: string;
    orderNumber: string;
    success: boolean;
    error?: string;
    newStatus?: string;
  }>;
}> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized. Please log in.");
  }

  // Verify caller is an administrator
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") {
    throw new Error("Forbidden. Admin authorization required.");
  }

  const results: Array<{
    orderId: string;
    orderNumber: string;
    success: boolean;
    error?: string;
    newStatus?: string;
  }> = [];

  let successCount = 0;
  let failedCount = 0;

  for (const rawId of orderIds) {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(rawId);
    let orderUuid = rawId;
    let orderNumber = rawId;

    if (!isUuid) {
      const { data: found } = await supabase
        .from("orders")
        .select("id, order_number")
        .eq("order_number", rawId)
        .maybeSingle();

      if (!found) {
        failedCount++;
        results.push({
          orderId: rawId,
          orderNumber: rawId,
          success: false,
          error: "Order record not found.",
        });
        continue;
      }
      orderUuid = found.id;
      orderNumber = found.order_number;
    } else {
      const { data: found } = await supabase
        .from("orders")
        .select("order_number")
        .eq("id", rawId)
        .maybeSingle();
      if (found) {
        orderNumber = found.order_number;
      }
    }

    // Execute atomic transition RPC
    const { data: rpcResult, error: rpcError } = await supabase.rpc("transition_order_status", {
      p_order_id: orderUuid,
      p_target_status: targetStatus,
    });

    if (rpcError) {
      failedCount++;
      results.push({
        orderId: rawId,
        orderNumber,
        success: false,
        error: rpcError.message || "Transition rejected by database rules.",
      });
    } else {
      const parsed = rpcResult as { success: boolean; error?: string; new_status?: string };
      if (parsed.success) {
        successCount++;
        results.push({
          orderId: rawId,
          orderNumber,
          success: true,
          newStatus: parsed.new_status,
        });
      } else {
        failedCount++;
        results.push({
          orderId: rawId,
          orderNumber,
          success: false,
          error: parsed.error || "Incompatible current order status.",
        });
      }
    }
  }

  revalidatePath("/admin/orders");
  revalidatePath("/orders");

  return {
    totalRequested: orderIds.length,
    successCount,
    failedCount,
    results,
  };
}
