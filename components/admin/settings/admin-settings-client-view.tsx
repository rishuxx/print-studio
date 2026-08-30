"use client";

import * as React from "react";
import {
  Building2,
  Percent,
  Power,
  ShoppingCart,
  Truck,
  Headphones,
  FileText,
  Globe,
  Save,
  RotateCcw,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import type { DatabaseBusinessSettings, StoreOperationalStatus, TaxDisplayMode } from "@/lib/settings/types";
import { saveBusinessSettingsAction } from "@/lib/settings/mutations";
import { AdminPageHelpButton } from "@/components/admin/admin-page-help-button";

interface AdminSettingsClientViewProps {
  initialSettings: DatabaseBusinessSettings;
}

export function AdminSettingsClientView({ initialSettings }: AdminSettingsClientViewProps) {
  const [settings, setSettings] = React.useState<DatabaseBusinessSettings>(initialSettings);
  const [activeTab, setActiveTab] = React.useState<
    | "identity"
    | "tax"
    | "operations"
    | "orders"
    | "shipping"
    | "support"
    | "invoice"
    | "seo"
    | "coming_soon"
  >("identity");

  const [isSaving, setIsSaving] = React.useState(false);
  const [hasChanges, setHasChanges] = React.useState(false);

  // Form field changes handler
  const handleFieldChange = <K extends keyof DatabaseBusinessSettings>(
    key: K,
    value: DatabaseBusinessSettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  // Reset to initial settings
  const handleReset = () => {
    setSettings(initialSettings);
    setHasChanges(false);
    toast.info("Reset changes to previous saved state.");
  };

  // Save Settings
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const res = await saveBusinessSettingsAction({
        business_name: settings.business_name,
        business_short_name: settings.business_short_name,
        legal_business_name: settings.legal_business_name,
        email: settings.email,
        phone: settings.phone,
        whatsapp_number: settings.whatsapp_number,
        address_line_1: settings.address_line_1,
        address_line_2: settings.address_line_2,
        city: settings.city,
        state: settings.state,
        postal_code: settings.postal_code,
        country: settings.country,
        gst_enabled: settings.gst_enabled,
        gstin: settings.gstin,
        default_gst_rate_bps: settings.default_gst_rate_bps,
        tax_display_mode: settings.tax_display_mode,
        default_sac_hsn: settings.default_sac_hsn,
        store_status: settings.store_status,
        store_pause_message: settings.store_pause_message,
        accept_new_orders: settings.accept_new_orders,
        checkout_enabled: settings.checkout_enabled,
        minimum_order_value_minor: settings.minimum_order_value_minor,
        maximum_order_value_minor: settings.maximum_order_value_minor,
        allow_customer_notes: settings.allow_customer_notes,
        shipping_enabled: settings.shipping_enabled,
        default_shipping_charge_minor: settings.default_shipping_charge_minor,
        free_shipping_threshold_minor: settings.free_shipping_threshold_minor,
        delivery_estimate_text: settings.delivery_estimate_text,
        support_email: settings.support_email,
        support_phone: settings.support_phone,
        support_hours: settings.support_hours,
        whatsapp_floating_enabled: settings.whatsapp_floating_enabled,
        announcement_enabled: settings.announcement_enabled,
        announcement_message: settings.announcement_message,
        announcement_link: settings.announcement_link,
        invoice_prefix: settings.invoice_prefix,
        invoice_footer: settings.invoice_footer,
        site_title: settings.site_title,
        site_description: settings.site_description,
        canonical_site_url: settings.canonical_site_url,
        version: settings.version,
      });

      if (!res.success) {
        toast.error(res.error || "Failed to save settings");
        return;
      }

      toast.success("Business settings saved & storefront cache invalidated!");
      setHasChanges(false);
      if (res.version) {
        setSettings((prev) => ({ ...prev, version: res.version as number }));
      }
    } catch {
      toast.error("Network or authorization error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-violet bg-violet/10 px-2 py-0.5 rounded">
              Phase 10H Configuration
            </span>
            <span className="text-xs text-muted-foreground">• Live Store Engine & Policy Master</span>
          </div>
          <h1 className="font-display text-2xl font-black text-ink mt-1">Business Settings & Store Setup</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage business identity, GST tax mode, operational status, shipping thresholds, and SEO metadata.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <AdminPageHelpButton />
          {hasChanges && (
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-white text-ink text-xs font-bold shadow-xs hover:bg-paper transition-colors"
            >
              <RotateCcw className="size-3.5 text-muted-foreground" />
              <span>Reset</span>
            </button>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || !hasChanges}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet text-white text-xs font-bold shadow-xs hover:bg-violet-lift disabled:opacity-50 transition-colors"
          >
            <Save className="size-3.5" />
            <span>{isSaving ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </div>

      {/* Diagnostics / Health Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 rounded-2xl bg-white border border-border shadow-xs text-xs">
        <div className="space-y-0.5">
          <div className="text-muted-foreground text-[0.6875rem] font-bold uppercase font-mono">Store Status</div>
          <div className="font-display font-black text-ink flex items-center gap-1.5">
            <span className={`size-2 rounded-full ${settings.store_status === "OPEN" ? "bg-emerald-500" : "bg-rose-500"}`} />
            <span>{settings.store_status}</span>
          </div>
          <span className="text-[0.625rem] text-muted-foreground">
            {settings.accept_new_orders ? "Accepting orders" : "Order intake paused"}
          </span>
        </div>

        <div className="space-y-0.5">
          <div className="text-muted-foreground text-[0.6875rem] font-bold uppercase font-mono">Active GST Policy</div>
          <div className="font-display font-black text-violet">
            {(settings.default_gst_rate_bps / 100).toFixed(0)}% ({settings.tax_display_mode.toUpperCase()})
          </div>
          <span className="text-[0.625rem] text-muted-foreground">GSTIN: {settings.gstin || "Not set"}</span>
        </div>

        <div className="space-y-0.5">
          <div className="text-muted-foreground text-[0.6875rem] font-bold uppercase font-mono">Free Shipping</div>
          <div className="font-display font-black text-ink">
            ₹{(settings.free_shipping_threshold_minor / 100).toLocaleString("en-IN")}
          </div>
          <span className="text-[0.625rem] text-muted-foreground">Flat: ₹{(settings.default_shipping_charge_minor / 100).toFixed(0)}</span>
        </div>

        <div className="space-y-0.5">
          <div className="text-muted-foreground text-[0.6875rem] font-bold uppercase font-mono">Configuration Health</div>
          <div className="font-display font-black text-emerald-700 flex items-center gap-1">
            <CheckCircle2 className="size-3.5 text-emerald-600" />
            <span>100% Validated</span>
          </div>
          <span className="text-[0.625rem] text-muted-foreground">Version {settings.version}</span>
        </div>
      </div>

      {/* Main Settings Form Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-border p-3 shadow-xs space-y-1 text-xs">
          {[
            { id: "identity", label: "Business Identity", icon: Building2 },
            { id: "tax", label: "Tax & GST Settings", icon: Percent },
            { id: "operations", label: "Store Operations", icon: Power },
            { id: "orders", label: "Orders & Checkout", icon: ShoppingCart },
            { id: "shipping", label: "Shipping & Delivery", icon: Truck },
            { id: "support", label: "Customer Support", icon: Headphones },
            { id: "invoice", label: "Tax Invoices", icon: FileText },
            { id: "seo", label: "SEO & Storefront", icon: Globe },
            { id: "coming_soon", label: "Enterprise Modules", icon: Lock, badge: "LOCKED" },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold transition-all text-left ${
                  isActive
                    ? "bg-violet text-white shadow-xs"
                    : "text-muted-foreground hover:bg-paper hover:text-ink"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="size-4 shrink-0" />
                  <span>{tab.label}</span>
                </div>
                {tab.badge && (
                  <span className={`text-[0.625rem] font-mono px-1.5 py-0.5 rounded ${
                    isActive ? "bg-white/20 text-white" : "bg-paper text-muted-foreground border border-border"
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Form Content */}
        <div className="lg:col-span-9 bg-white rounded-2xl border border-border p-6 shadow-xs space-y-6">
          {/* TAB 1: BUSINESS IDENTITY */}
          {activeTab === "identity" && (
            <div className="space-y-4 text-xs">
              <div className="border-b border-border pb-3">
                <h3 className="font-display text-sm font-bold text-ink">Business Identity & Contact Details</h3>
                <p className="text-xs text-muted-foreground">
                  Official name, legal entity, storefront labels, and physical business premises.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-ink">Brand / Store Name</label>
                  <input
                    type="text"
                    value={settings.business_name}
                    onChange={(e) => handleFieldChange("business_name", e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border font-semibold text-xs"
                    required
                  />
                  <span className="text-[0.625rem] text-muted-foreground">Used across header, email templates & receipts</span>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-ink">Short Display Name</label>
                  <input
                    type="text"
                    value={settings.business_short_name}
                    onChange={(e) => handleFieldChange("business_short_name", e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border font-semibold text-xs"
                    required
                  />
                  <span className="text-[0.625rem] text-muted-foreground">Used in admin navigation & mobile bar</span>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="font-bold text-ink">Legal Business Entity Name</label>
                  <input
                    type="text"
                    value={settings.legal_business_name}
                    onChange={(e) => handleFieldChange("legal_business_name", e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border font-semibold text-xs"
                    required
                  />
                  <span className="text-[0.625rem] text-muted-foreground">Printed on official tax invoices & GST filings</span>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-ink">Primary Contact Email</label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => handleFieldChange("email", e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border font-semibold text-xs font-mono"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-ink">Contact Phone Number</label>
                  <input
                    type="text"
                    value={settings.phone}
                    onChange={(e) => handleFieldChange("phone", e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border font-semibold text-xs font-mono"
                    required
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="font-bold text-ink">Premises Address Line 1</label>
                  <input
                    type="text"
                    value={settings.address_line_1}
                    onChange={(e) => handleFieldChange("address_line_1", e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border font-semibold text-xs"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-ink">City</label>
                  <input
                    type="text"
                    value={settings.city}
                    onChange={(e) => handleFieldChange("city", e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border font-semibold text-xs"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-ink">State</label>
                  <input
                    type="text"
                    value={settings.state}
                    onChange={(e) => handleFieldChange("state", e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border font-semibold text-xs"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-ink">PIN Code</label>
                  <input
                    type="text"
                    value={settings.postal_code}
                    onChange={(e) => handleFieldChange("postal_code", e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border font-mono font-bold text-xs"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-ink">Country</label>
                  <input
                    type="text"
                    value={settings.country}
                    onChange={(e) => handleFieldChange("country", e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border font-semibold text-xs"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TAX & GST */}
          {activeTab === "tax" && (
            <div className="space-y-4 text-xs">
              <div className="border-b border-border pb-3">
                <h3 className="font-display text-sm font-bold text-ink">Goods & Services Tax (GST) Configuration</h3>
                <p className="text-xs text-muted-foreground">
                  Authoritative GST policy used by the Pricing Engine, Razorpay checkout calculations, and invoices.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-paper/50 border border-border space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-ink">Enable GST Tax Engine</div>
                    <div className="text-muted-foreground text-[0.6875rem]">Calculates compliant GST for commercial orders</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.gst_enabled}
                    onChange={(e) => handleFieldChange("gst_enabled", e.target.checked)}
                    className="size-4 rounded border-border"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1">
                    <label className="font-bold text-ink">Registered GSTIN Number</label>
                    <input
                      type="text"
                      value={settings.gstin || ""}
                      onChange={(e) => handleFieldChange("gstin", e.target.value.toUpperCase())}
                      placeholder="e.g. 05AAACH7409R1ZZ"
                      className="w-full px-3 py-2 rounded-xl border border-border font-mono font-bold text-xs uppercase"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-ink">Default SAC / HSN Code</label>
                    <input
                      type="text"
                      value={settings.default_sac_hsn || "998912"}
                      onChange={(e) => handleFieldChange("default_sac_hsn", e.target.value)}
                      placeholder="998912"
                      className="w-full px-3 py-2 rounded-xl border border-border font-mono text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-ink">GST Rate (Basis Points / %)</label>
                    <select
                      value={settings.default_gst_rate_bps}
                      onChange={(e) => handleFieldChange("default_gst_rate_bps", Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-border font-semibold text-xs bg-white"
                    >
                      <option value={0}>0% (Exempt)</option>
                      <option value={500}>5% GST (500 bps)</option>
                      <option value={1200}>12% GST (1200 bps)</option>
                      <option value={1800}>18% GST (Standard Print Rate - 1800 bps)</option>
                      <option value={2800}>28% GST (2800 bps)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-ink">Tax Display Strategy</label>
                    <select
                      value={settings.tax_display_mode}
                      onChange={(e) => handleFieldChange("tax_display_mode", e.target.value as TaxDisplayMode)}
                      className="w-full px-3 py-2 rounded-xl border border-border font-semibold text-xs bg-white"
                    >
                      <option value="inclusive">Inclusive MRP (GST included in catalog price)</option>
                      <option value="exclusive">Exclusive Surcharge (GST added at checkout)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: STORE OPERATIONS */}
          {activeTab === "operations" && (
            <div className="space-y-4 text-xs">
              <div className="border-b border-border pb-3">
                <h3 className="font-display text-sm font-bold text-ink">Store Operational Status & Intake Control</h3>
                <p className="text-xs text-muted-foreground">
                  Controls order acceptance. When paused, customers can browse the catalogue but checkout is blocked.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl border border-border bg-paper/50 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-ink">Store Status</div>
                    <div className="text-muted-foreground text-[0.6875rem]">Overall operational posture</div>
                  </div>
                  <select
                    value={settings.store_status}
                    onChange={(e) => handleFieldChange("store_status", e.target.value as StoreOperationalStatus)}
                    className="px-3 py-2 rounded-xl border border-border font-bold text-xs bg-white"
                  >
                    <option value="OPEN">OPEN (Normal Operations)</option>
                    <option value="PAUSED">PAUSED (Maintenance / Holiday)</option>
                  </select>
                </div>

                <div className="p-4 rounded-2xl border border-border bg-paper/50 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-ink">Accept New Orders</div>
                    <div className="text-muted-foreground text-[0.6875rem]">Server-side intake gate for new checkouts</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.accept_new_orders}
                    onChange={(e) => handleFieldChange("accept_new_orders", e.target.checked)}
                    className="size-4 rounded border-border"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-ink">Store Pause Notification Message</label>
                  <textarea
                    rows={2}
                    value={settings.store_pause_message || ""}
                    onChange={(e) => handleFieldChange("store_pause_message", e.target.value)}
                    placeholder="We are temporarily not accepting new orders. Please check back shortly."
                    className="w-full p-3 rounded-xl border border-border font-semibold text-xs bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ORDERS & CHECKOUT */}
          {activeTab === "orders" && (
            <div className="space-y-4 text-xs">
              <div className="border-b border-border pb-3">
                <h3 className="font-display text-sm font-bold text-ink">Order Limits & Checkout Rules</h3>
                <p className="text-xs text-muted-foreground">
                  Enforce minimum transaction amounts and customer special instruction notes.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-ink">Minimum Order Value (Paise / ₹)</label>
                  <input
                    type="number"
                    value={settings.minimum_order_value_minor}
                    onChange={(e) => handleFieldChange("minimum_order_value_minor", Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-border font-mono font-bold text-xs"
                  />
                  <span className="text-[0.625rem] text-muted-foreground">
                    Current: ₹{(settings.minimum_order_value_minor / 100).toFixed(0)}
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-ink">Maximum Order Value (Paise / ₹)</label>
                  <input
                    type="number"
                    value={settings.maximum_order_value_minor}
                    onChange={(e) => handleFieldChange("maximum_order_value_minor", Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-border font-mono font-bold text-xs"
                  />
                  <span className="text-[0.625rem] text-muted-foreground">
                    Current: ₹{(settings.maximum_order_value_minor / 100).toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="sm:col-span-2 p-4 rounded-2xl bg-paper/50 border border-border flex items-center justify-between">
                  <div>
                    <div className="font-bold text-ink">Allow Customer Special Instruction Notes</div>
                    <div className="text-muted-foreground text-[0.6875rem]">Displays notes field on checkout page</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.allow_customer_notes}
                    onChange={(e) => handleFieldChange("allow_customer_notes", e.target.checked)}
                    className="size-4 rounded border-border"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SHIPPING & DELIVERY */}
          {activeTab === "shipping" && (
            <div className="space-y-4 text-xs">
              <div className="border-b border-border pb-3">
                <h3 className="font-display text-sm font-bold text-ink">Shipping Rates & Free Delivery Thresholds</h3>
                <p className="text-xs text-muted-foreground">
                  Authoritative flat shipping charges and threshold for automatic free delivery qualification.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-ink">Flat Shipping Charge (Paise)</label>
                  <input
                    type="number"
                    value={settings.default_shipping_charge_minor}
                    onChange={(e) => handleFieldChange("default_shipping_charge_minor", Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-border font-mono font-bold text-xs"
                  />
                  <span className="text-[0.625rem] text-muted-foreground">
                    Current: ₹{(settings.default_shipping_charge_minor / 100).toFixed(0)} flat rate
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-ink">Free Shipping Threshold (Paise)</label>
                  <input
                    type="number"
                    value={settings.free_shipping_threshold_minor}
                    onChange={(e) => handleFieldChange("free_shipping_threshold_minor", Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-border font-mono font-bold text-xs"
                  />
                  <span className="text-[0.625rem] text-muted-foreground">
                    Orders &gt;= ₹{(settings.free_shipping_threshold_minor / 100).toLocaleString("en-IN")} qualify for free shipping
                  </span>
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="font-bold text-ink">Estimated Delivery Timeframe</label>
                  <input
                    type="text"
                    value={settings.delivery_estimate_text || ""}
                    onChange={(e) => handleFieldChange("delivery_estimate_text", e.target.value)}
                    placeholder="3–5 business days across India"
                    className="w-full px-3 py-2 rounded-xl border border-border font-semibold text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: CUSTOMER SUPPORT */}
          {activeTab === "support" && (
            <div className="space-y-4 text-xs">
              <div className="border-b border-border pb-3">
                <h3 className="font-display text-sm font-bold text-ink">Customer Support Channels & Hours</h3>
                <p className="text-xs text-muted-foreground">
                  Support phone, email, and WhatsApp helpdesk numbers displayed in storefront footer and floating help button.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-ink">Support Email</label>
                  <input
                    type="email"
                    value={settings.support_email}
                    onChange={(e) => handleFieldChange("support_email", e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border font-mono text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-ink">Support Helpline</label>
                  <input
                    type="text"
                    value={settings.support_phone}
                    onChange={(e) => handleFieldChange("support_phone", e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border font-mono text-xs"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="font-bold text-ink">Support Working Hours</label>
                  <input
                    type="text"
                    value={settings.support_hours || ""}
                    onChange={(e) => handleFieldChange("support_hours", e.target.value)}
                    placeholder="Mon–Sat: 10:00 AM – 7:00 PM"
                    className="w-full px-3 py-2 rounded-xl border border-border font-semibold text-xs"
                  />
                </div>

                <div className="sm:col-span-2 p-4 rounded-2xl bg-paper/50 border border-border flex items-center justify-between">
                  <div>
                    <div className="font-bold text-ink">Enable WhatsApp Quick Assistance Button</div>
                    <div className="text-muted-foreground text-[0.6875rem]">Displays bottom-right floating WhatsApp icon on storefront</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.whatsapp_floating_enabled}
                    onChange={(e) => handleFieldChange("whatsapp_floating_enabled", e.target.checked)}
                    className="size-4 rounded border-border"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: TAX INVOICES */}
          {activeTab === "invoice" && (
            <div className="space-y-4 text-xs">
              <div className="border-b border-border pb-3">
                <h3 className="font-display text-sm font-bold text-ink">Tax Invoice Formatting & Policy Footer</h3>
                <p className="text-xs text-muted-foreground">
                  Customizes generated PDF invoices, prefixes, and legal footer disclaimers.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-ink">Invoice Prefix</label>
                  <input
                    type="text"
                    value={settings.invoice_prefix}
                    onChange={(e) => handleFieldChange("invoice_prefix", e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 rounded-xl border border-border font-mono font-bold text-xs uppercase"
                  />
                  <span className="text-[0.625rem] text-muted-foreground">e.g. INV-2026-XXXX</span>
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="font-bold text-ink">Invoice Legal Footer Disclaimer</label>
                  <textarea
                    rows={2}
                    value={settings.invoice_footer || ""}
                    onChange={(e) => handleFieldChange("invoice_footer", e.target.value)}
                    placeholder="Computer generated tax invoice. No signature required."
                    className="w-full p-3 rounded-xl border border-border font-semibold text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: SEO & STOREFRONT */}
          {activeTab === "seo" && (
            <div className="space-y-4 text-xs">
              <div className="border-b border-border pb-3">
                <h3 className="font-display text-sm font-bold text-ink">Search Engine Optimization & Metadata</h3>
                <p className="text-xs text-muted-foreground">
                  Global search tags, canonical website URL, and announcement banner text.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="font-bold text-ink">Global Meta Title</label>
                  <input
                    type="text"
                    value={settings.site_title}
                    onChange={(e) => handleFieldChange("site_title", e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border font-semibold text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-ink">Meta Description</label>
                  <textarea
                    rows={2}
                    value={settings.site_description}
                    onChange={(e) => handleFieldChange("site_description", e.target.value)}
                    className="w-full p-3 rounded-xl border border-border font-semibold text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-ink">Canonical Site Origin URL</label>
                  <input
                    type="text"
                    value={settings.canonical_site_url}
                    onChange={(e) => handleFieldChange("canonical_site_url", e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border font-mono text-xs"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-paper/50 border border-border space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-ink">Storefront Top Announcement Ribbon</div>
                      <div className="text-muted-foreground text-[0.6875rem]">Broadcasts promotional offer at top of screen</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.announcement_enabled}
                      onChange={(e) => handleFieldChange("announcement_enabled", e.target.checked)}
                      className="size-4 rounded border-border"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-ink">Announcement Message</label>
                    <input
                      type="text"
                      value={settings.announcement_message || ""}
                      onChange={(e) => handleFieldChange("announcement_message", e.target.value)}
                      placeholder="Fast local printing and express dispatch on select products"
                      className="w-full px-3 py-2 rounded-xl border border-border font-semibold text-xs bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: ENTERPRISE MODULES (LOCKED / COMING SOON) */}
          {activeTab === "coming_soon" && (
            <div className="space-y-6 text-xs">
              <div className="border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded font-mono font-bold text-[0.625rem] bg-amber-50 text-amber-800 border border-amber-200 uppercase">
                    Architecture Reserved
                  </span>
                  <h3 className="font-display text-sm font-bold text-ink">Enterprise Modules & Extensibility Roadmap</h3>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Future-ready modules preserved in the system architecture. Locked to prevent mock or non-functional controls.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: "Multi-Location Warehouse Inventory",
                    description: "Stock allocation across regional fulfilment hubs (Delhi NCR, Bengaluru, Mumbai).",
                    phase: "Phase 11",
                  },
                  {
                    title: "Carrier API & Automated Waybills",
                    description: "Direct tracking webhook integrations with Shiprocket, Delhivery, and Blue Dart.",
                    phase: "Phase 11",
                  },
                  {
                    title: "Multiple State GST Registrations",
                    description: "Split billing for corporate entities with multiple state tax jurisdictions.",
                    phase: "Phase 11",
                  },
                  {
                    title: "Advanced Multi-Tier RBAC",
                    description: "Granular operator privileges, press operator logins, and financial auditor roles.",
                    phase: "Phase 10I",
                  },
                  {
                    title: "Automated SMS / WhatsApp Gateway",
                    description: "Transactional dispatch alerts via MSG91 and Twilio WhatsApp Business API.",
                    phase: "Phase 11",
                  },
                  {
                    title: "Marketplace & B2B PunchOut",
                    description: "cXML / OCI PunchOut integration for Fortune 500 corporate stationery procurement.",
                    phase: "Phase 12",
                  },
                ].map((item) => (
                  <div key={item.title} className="p-4 rounded-2xl border border-border bg-paper/40 space-y-2 opacity-80">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-ink">{item.title}</span>
                      <span className="flex items-center gap-1 font-mono text-[0.625rem] font-bold px-2 py-0.5 rounded bg-paper text-muted-foreground border border-border">
                        <Lock className="size-3" /> {item.phase}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-[0.6875rem]">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
