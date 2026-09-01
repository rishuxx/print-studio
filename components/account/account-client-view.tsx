"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import { useOrderStore } from "@/lib/order-store";
import {
  logoutCustomer,
  updateCustomerProfile,
  addCustomerAddress,
  deleteCustomerAddress,
  setDefaultAddress,
} from "@/lib/supabase/actions";
import {
  User as UserIcon,
  MapPin,
  Package,
  LogOut,
  ArrowRight,
  Plus,
  Trash2,
  CheckCircle2,
  Star,
  LayoutDashboard,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
type AddressRow = Database["public"]["Tables"]["addresses"]["Row"];
type OrderRow = Database["public"]["Tables"]["orders"]["Row"];

interface AccountClientViewProps {
  user: User;
  initialProfile: ProfileRow;
  initialAddresses: AddressRow[];
  initialOrders: OrderRow[];
}

export function AccountClientView({
  user,
  initialProfile,
  initialAddresses,
  initialOrders,
}: AccountClientViewProps) {
  const router = useRouter();
  const isAdmin = initialProfile.role === "admin";
  const [activeTab, setActiveTab] = React.useState<"profile" | "addresses" | "orders">("profile");

  // Profile Edit State
  const [fullName, setFullName] = React.useState(initialProfile.full_name || "");
  const [companyName, setCompanyName] = React.useState(initialProfile.company_name || "");
  const [phone, setPhone] = React.useState(initialProfile.phone || "");
  const [isSavingProfile, setIsSavingProfile] = React.useState(false);

  // Address Modal State
  const [isAddingAddress, setIsAddingAddress] = React.useState(false);
  const [addrLabel, setAddrLabel] = React.useState("Studio");
  const [addrName, setAddrName] = React.useState(initialProfile.full_name || "");
  const [addrPhone, setAddrPhone] = React.useState(initialProfile.phone || "");
  const [addrLine1, setAddrLine1] = React.useState("");
  const [addrLine2, setAddrLine2] = React.useState("");
  const [addrCity, setAddrCity] = React.useState("");
  const [addrState, setAddrState] = React.useState("");
  const [addrPincode, setAddrPincode] = React.useState("");
  const [addrIsDefault, setAddrIsDefault] = React.useState(initialAddresses.length === 0);
  const [isSavingAddress, setIsSavingAddress] = React.useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.error("Full name is required.");
      return;
    }

    setIsSavingProfile(true);
    try {
      const res = await updateCustomerProfile({
        fullName,
        companyName,
        phone,
      });

      if (!res.success) {
        toast.error("Update failed", { description: res.error });
      } else {
        toast.success("Profile details updated successfully!");
        router.refresh();
      }
    } catch {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrName.trim() || !addrPhone.trim() || !addrLine1.trim() || !addrCity.trim() || !addrState.trim() || !addrPincode.trim()) {
      toast.error("Please fill in all required address fields.");
      return;
    }

    if (!/^\d{6}$/.test(addrPincode.trim())) {
      toast.error("Please enter a valid 6-digit PIN code.");
      return;
    }

    setIsSavingAddress(true);
    try {
      const res = await addCustomerAddress({
        label: addrLabel,
        fullName: addrName,
        phone: addrPhone,
        line1: addrLine1,
        line2: addrLine2 || undefined,
        city: addrCity,
        state: addrState,
        pincode: addrPincode,
        isDefault: addrIsDefault,
      });

      if (!res.success) {
        toast.error("Failed to add address", { description: res.error });
      } else {
        toast.success("Address added to your account!");
        setIsAddingAddress(false);
        setAddrLine1("");
        setAddrLine2("");
        setAddrCity("");
        setAddrState("");
        setAddrPincode("");
        router.refresh();
      }
    } catch {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsSavingAddress(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm("Are you sure you want to remove this delivery address?")) return;
    try {
      const res = await deleteCustomerAddress(id);
      if (!res.success) {
        toast.error("Failed to delete", { description: res.error });
      } else {
        toast.success("Address removed.");
        router.refresh();
      }
    } catch {
      toast.error("Error deleting address.");
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      const res = await setDefaultAddress(id);
      if (!res.success) {
        toast.error("Failed to update default address", { description: res.error });
      } else {
        toast.success("Default address updated.");
        router.refresh();
      }
    } catch {
      toast.error("Error updating default address.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Admin Quick Jump Banner if profile.role === 'admin' */}
      {isAdmin && (
        <div className="rounded-2xl border border-violet/30 bg-violet-wash p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-violet text-white">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-sm text-ink">
                  Administrator Session Active
                </span>
                <span className="rounded bg-violet text-white font-mono text-[0.625rem] font-black px-1.5 py-0.5 uppercase tracking-wider">
                  Admin
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                You have full access to operations, orders, and business metrics in the dedicated command center.
              </p>
            </div>
          </div>

          <Link
            href="/admin"
            className="inline-flex items-center gap-2 rounded-xl bg-violet px-4 py-2.5 text-xs font-bold text-white shadow-lift hover:bg-violet-lift transition-all shrink-0"
          >
            <LayoutDashboard className="size-4" />
            <span>Go to Admin Dashboard</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      )}

      {/* Account Top Summary Banner */}
      <div className="rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="size-14 rounded-full bg-violet/10 flex items-center justify-center text-violet font-display font-extrabold text-xl">
            {initialProfile.full_name ? initialProfile.full_name[0].toUpperCase() : "U"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-2xl font-extrabold text-ink">
                {initialProfile.full_name}
              </h1>
              <span className="rounded-full bg-paper border border-border px-2 py-0.5 text-[0.625rem] font-bold font-mono uppercase text-muted-foreground">
                {initialProfile.role}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {user.email} {initialProfile.company_name && `· ${initialProfile.company_name}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isAdmin && (
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 rounded-xl border border-violet/40 bg-violet/10 px-3.5 py-2 text-xs font-bold text-violet hover:bg-violet hover:text-white transition-all"
            >
              <LayoutDashboard className="size-3.5" />
              <span>Admin Console</span>
            </Link>
          )}

          <button
            type="button"
            onClick={() => {
              useOrderStore.getState().clearAllLocalState();
              logoutCustomer();
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-paper hover:text-red-600 transition-colors"
          >
            <LogOut className="size-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-border pb-2 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab("profile")}
          className={`inline-flex items-center gap-2 px-4 py-2 font-bold rounded-xl transition-all ${
            activeTab === "profile"
              ? "bg-violet text-white shadow-sm"
              : "bg-paper text-muted-foreground hover:text-ink"
          }`}
        >
          <UserIcon className="size-3.5" />
          <span>My Profile</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("addresses")}
          className={`inline-flex items-center gap-2 px-4 py-2 font-bold rounded-xl transition-all ${
            activeTab === "addresses"
              ? "bg-violet text-white shadow-sm"
              : "bg-paper text-muted-foreground hover:text-ink"
          }`}
        >
          <MapPin className="size-3.5" />
          <span>Saved Addresses ({initialAddresses.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("orders")}
          className={`inline-flex items-center gap-2 px-4 py-2 font-bold rounded-xl transition-all ${
            activeTab === "orders"
              ? "bg-violet text-white shadow-sm"
              : "bg-paper text-muted-foreground hover:text-ink"
          }`}
        >
          <Package className="size-3.5" />
          <span>Order History ({initialOrders.length})</span>
        </button>
      </div>

      {/* TAB 1: PROFILE MANAGEMENT */}
      {activeTab === "profile" && (
        <div className="rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-sm max-w-2xl space-y-6 text-xs">
          <div className="space-y-1 border-b border-border pb-3">
            <h2 className="font-bold text-sm text-ink uppercase font-mono tracking-wider">
              Profile & Contact Information
            </h2>
            <p className="text-muted-foreground">
              These details prefill your invoice and delivery labels.
            </p>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="space-y-1.5">
              <label className="font-bold text-ink">Full Name *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-xl border border-border px-3.5 py-2.5 text-xs text-ink focus:border-violet focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-ink">Company / Studio</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Acme Media Pvt Ltd"
                className="w-full rounded-xl border border-border px-3.5 py-2.5 text-xs text-ink focus:border-violet focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="font-bold text-ink">Email Address (Read-only)</label>
                <input
                  type="email"
                  disabled
                  value={user.email || ""}
                  className="w-full rounded-xl border border-border bg-paper px-3.5 py-2.5 text-xs text-muted-foreground font-mono cursor-not-allowed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-ink">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="98XXXXXXXX"
                  className="w-full rounded-xl border border-border px-3.5 py-2.5 text-xs font-mono text-ink focus:border-violet focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isSavingProfile}
                className="inline-flex items-center gap-2 rounded-xl bg-violet px-5 py-2.5 text-xs font-bold text-white shadow-lift hover:bg-violet-lift transition-all disabled:opacity-50"
              >
                <span>{isSavingProfile ? "Saving Details..." : "Save Profile Changes"}</span>
              </button>
            </div>
          </form>

          {/* Customer Notification Preferences */}
          <div className="pt-6 border-t border-border space-y-3">
            <div className="space-y-0.5">
              <h3 className="font-bold text-ink text-xs uppercase font-mono tracking-wider">
                Notification & Communication Preferences
              </h3>
              <p className="text-muted-foreground text-[0.6875rem]">
                Choose how you receive order confirmations, proof updates, and courier dispatch tracking.
              </p>
            </div>

            <div className="space-y-2.5 pt-1">
              <label className="flex items-center justify-between rounded-xl border border-border p-3 hover:bg-paper/60 transition-colors cursor-pointer">
                <div>
                  <div className="font-bold text-ink text-xs">Email Notifications</div>
                  <div className="text-[0.6875rem] text-muted-foreground">Receive invoices, proofs, and shipping updates via email.</div>
                </div>
                <input type="checkbox" defaultChecked className="size-4 accent-violet rounded" />
              </label>

              <label className="flex items-center justify-between rounded-xl border border-border p-3 hover:bg-paper/60 transition-colors cursor-pointer">
                <div>
                  <div className="font-bold text-ink text-xs">WhatsApp Order Alerts</div>
                  <div className="text-[0.6875rem] text-muted-foreground">Receive urgent proof alerts and courier tracking dockets on WhatsApp.</div>
                </div>
                <input type="checkbox" defaultChecked className="size-4 accent-violet rounded" />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ADDRESSES */}
      {activeTab === "addresses" && (
        <div className="space-y-6 text-xs">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-sm text-ink uppercase font-mono tracking-wider">
              Saved Delivery Destinations
            </h2>
            {!isAddingAddress && (
              <button
                type="button"
                onClick={() => setIsAddingAddress(true)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-violet px-4 py-2 text-xs font-bold text-white shadow-lift hover:bg-violet-lift transition-all"
              >
                <Plus className="size-3.5" />
                <span>Add New Address</span>
              </button>
            )}
          </div>

          {/* Add Address Form Modal/Card */}
          {isAddingAddress && (
            <div className="rounded-2xl border border-border bg-white p-6 shadow-sm space-y-4 max-w-2xl animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="font-bold text-sm text-ink">Add Delivery Address</h3>
                <button
                  type="button"
                  onClick={() => setIsAddingAddress(false)}
                  className="text-xs text-muted-foreground hover:text-ink"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleAddAddress} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-bold text-ink">Address Label</label>
                    <select
                      value={addrLabel}
                      onChange={(e) => setAddrLabel(e.target.value)}
                      className="w-full rounded-xl border border-border px-3.5 py-2.5 text-xs text-ink focus:border-violet focus:outline-none bg-white"
                    >
                      <option value="Studio">Studio</option>
                      <option value="Headquarters">Headquarters</option>
                      <option value="Office">Office</option>
                      <option value="Home">Home</option>
                      <option value="Warehouse">Warehouse</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="font-bold text-ink">Recipient Name *</label>
                    <input
                      type="text"
                      required
                      value={addrName}
                      onChange={(e) => setAddrName(e.target.value)}
                      placeholder="Contact Person / Department"
                      className="w-full rounded-xl border border-border px-3.5 py-2.5 text-xs text-ink focus:border-violet focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-ink">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={addrPhone}
                    onChange={(e) => setAddrPhone(e.target.value)}
                    placeholder="10-digit mobile number for dispatch alerts"
                    className="w-full rounded-xl border border-border px-3.5 py-2.5 text-xs font-mono text-ink focus:border-violet focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-ink">Street Address Line 1 *</label>
                  <input
                    type="text"
                    required
                    value={addrLine1}
                    onChange={(e) => setAddrLine1(e.target.value)}
                    placeholder="Flat / Floor / Building Name / Street"
                    className="w-full rounded-xl border border-border px-3.5 py-2.5 text-xs text-ink focus:border-violet focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-ink">Address Line 2 (Optional)</label>
                  <input
                    type="text"
                    value={addrLine2}
                    onChange={(e) => setAddrLine2(e.target.value)}
                    placeholder="Area / Landmark"
                    className="w-full rounded-xl border border-border px-3.5 py-2.5 text-xs text-ink focus:border-violet focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-bold text-ink">City *</label>
                    <input
                      type="text"
                      required
                      value={addrCity}
                      onChange={(e) => setAddrCity(e.target.value)}
                      placeholder="City"
                      className="w-full rounded-xl border border-border px-3.5 py-2.5 text-xs text-ink focus:border-violet focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-ink">State *</label>
                    <input
                      type="text"
                      required
                      value={addrState}
                      onChange={(e) => setAddrState(e.target.value)}
                      placeholder="State"
                      className="w-full rounded-xl border border-border px-3.5 py-2.5 text-xs text-ink focus:border-violet focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-ink">PIN Code (6 digits) *</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={addrPincode}
                      onChange={(e) => setAddrPincode(e.target.value)}
                      placeholder="560001"
                      className="w-full rounded-xl border border-border px-3.5 py-2.5 text-xs font-mono text-ink focus:border-violet focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="addr-default"
                    checked={addrIsDefault}
                    onChange={(e) => setAddrIsDefault(e.target.checked)}
                    className="rounded border-border text-violet focus:ring-violet"
                  />
                  <label htmlFor="addr-default" className="text-xs text-ink font-semibold cursor-pointer">
                    Set as default delivery address
                  </label>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingAddress(false)}
                    className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-paper"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingAddress}
                    className="rounded-xl bg-violet px-5 py-2 text-xs font-bold text-white shadow-lift hover:bg-violet-lift transition-all disabled:opacity-50"
                  >
                    {isSavingAddress ? "Saving..." : "Save Address"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {initialAddresses.length === 0 && !isAddingAddress ? (
            <div className="rounded-2xl border border-dashed border-border bg-white p-8 text-center space-y-3">
              <MapPin className="size-8 text-muted-foreground mx-auto" />
              <div className="font-bold text-sm text-ink">No saved delivery addresses</div>
              <p className="text-muted-foreground max-w-sm mx-auto">
                Save delivery locations for quick 1-click selection during future print orders.
              </p>
              <button
                type="button"
                onClick={() => setIsAddingAddress(true)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-violet px-4 py-2 text-xs font-bold text-white shadow-lift hover:bg-violet-lift transition-all"
              >
                <Plus className="size-3.5" />
                <span>Add First Address</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {initialAddresses.map((addr) => (
                <div key={addr.id} className="rounded-2xl border border-border bg-white p-5 space-y-3 shadow-sm flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-ink text-sm flex items-center gap-1.5">
                        <MapPin className="size-3.5 text-violet" />
                        <span>{addr.label || "Delivery Location"}</span>
                      </span>
                      {addr.is_default && (
                        <span className="rounded bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[0.625rem] font-bold">
                          Default Address
                        </span>
                      )}
                    </div>
                    <div className="text-muted-foreground space-y-0.5 text-xs">
                      <div className="font-bold text-ink">{addr.full_name}</div>
                      <div>{addr.line1} {addr.line2}</div>
                      <div>{addr.city}, {addr.state} — {addr.pincode}</div>
                      <div className="font-mono text-ink pt-1">Phone: {addr.phone}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border/60">
                    {!addr.is_default ? (
                      <button
                        type="button"
                        onClick={() => handleSetDefault(addr.id)}
                        className="inline-flex items-center gap-1 text-[0.6875rem] font-semibold text-violet hover:underline"
                      >
                        <Star className="size-3" />
                        <span>Set Default</span>
                      </button>
                    ) : (
                      <span className="text-[0.6875rem] text-emerald-600 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="size-3" />
                        <span>Primary Dispatch</span>
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="inline-flex items-center gap-1 text-[0.6875rem] font-semibold text-red-600 hover:underline"
                    >
                      <Trash2 className="size-3" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: ORDERS */}
      {activeTab === "orders" && (
        <div className="space-y-4 text-xs">
          {initialOrders.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-white p-10 text-center space-y-3">
              <Package className="size-8 text-muted-foreground mx-auto" />
              <div className="font-bold text-sm text-ink">No database orders registered yet</div>
              <p className="text-muted-foreground max-w-sm mx-auto">
                When you place orders, real-time pre-press status, press runs, and GST invoices will be recorded directly under your profile.
              </p>
              <div className="pt-2">
                <Link
                  href="/orders"
                  className="inline-flex items-center gap-1.5 font-bold text-violet hover:underline text-xs"
                >
                  <span>View All Print Orders</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {initialOrders.map((ord) => (
                <div key={ord.id} className="rounded-2xl border border-border bg-white p-5 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-ink">{ord.order_number}</div>
                    <div className="text-muted-foreground font-mono text-[0.6875rem]">
                      Status: {ord.status} · Total: ₹{ord.total}
                    </div>
                  </div>
                  <Link
                    href={`/orders/${ord.order_number}`}
                    className="text-violet font-bold hover:underline"
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
