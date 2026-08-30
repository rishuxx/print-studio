import * as React from "react";
import {
  Store,
  MapPin,
  FileText,
  Percent,
  Sliders,
  Clock,
  Truck,
  Users,
  Bell,
  Globe,
  ShieldAlert,
  Lock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { FullBusinessConfiguration } from "@/lib/business-settings/types";
import { cn } from "@/lib/utils";

export type SettingsTabId =
  | "identity"
  | "address"
  | "tax"
  | "invoice"
  | "orders"
  | "shipping"
  | "customers"
  | "notifications"
  | "storefront"
  | "hours"
  | "danger"
  | "locked";

interface SettingsSidebarProps {
  activeTab: SettingsTabId;
  onSelectTab: (tab: SettingsTabId) => void;
  config: FullBusinessConfiguration;
  unsavedTabs: Set<SettingsTabId>;
}

export function SettingsSidebar({
  activeTab,
  onSelectTab,
  config,
  unsavedTabs,
}: SettingsSidebarProps) {
  // Configuration Health Calculation
  const healthChecks = [
    { label: "Store Identity", ok: Boolean(config.business.store_name) },
    { label: "Support Contact", ok: Boolean(config.business.support_email && config.business.support_phone) },
    { label: "Business Address", ok: Boolean(config.address.address_line_1 && config.address.postal_code) },
    { label: "GST Policy", ok: Boolean(config.tax.gst_enabled ? config.tax.gstin : true) },
    { label: "Invoice Defaults", ok: Boolean(config.invoice.invoice_prefix) },
    { label: "Shipping Rules", ok: Boolean(config.shipping.default_shipping_fee_minor >= 0) },
    { label: "Production SLA", ok: Boolean(config.production.default_production_days_min > 0) },
  ];

  const passedCount = healthChecks.filter((c) => c.ok).length;
  const healthPercent = Math.round((passedCount / healthChecks.length) * 100);

  const navItems: Array<{
    id: SettingsTabId;
    label: string;
    description: string;
    icon: React.ElementType;
    badge?: string;
  }> = [
    { id: "identity", label: "Store Identity", description: "Name, logo & branding", icon: Store },
    { id: "address", label: "Address & Contact", description: "HQ location & channels", icon: MapPin },
    { id: "tax", label: "Tax & GST", description: "Rates & GSTIN compliance", icon: Percent },
    { id: "invoice", label: "Invoice Template", description: "Prefixes & GST layouts", icon: FileText },
    { id: "orders", label: "Order & Production", description: "SLA, limits & cancellation", icon: Sliders },
    { id: "shipping", label: "Shipping Defaults", description: "Fees & free thresholds", icon: Truck },
    { id: "customers", label: "Customer Accounts", description: "Guest & address limits", icon: Users },
    { id: "notifications", label: "Notifications", description: "Lifecycle triggers", icon: Bell },
    { id: "storefront", label: "Storefront Policy", description: "Notices & maintenance", icon: Globe },
    { id: "hours", label: "Business Hours", description: "Weekly operating hours", icon: Clock },
    { id: "danger", label: "Store Control", description: "Pause & maintenance", icon: ShieldAlert, badge: "Critical" },
    { id: "locked", label: "Enterprise Modules", description: "Multi-store & B2B", icon: Lock, badge: "Locked" },
  ];

  return (
    <aside className="w-full lg:w-72 shrink-0 space-y-6">
      {/* Configuration Health Card */}
      <div className="rounded-2xl border border-border/80 bg-white p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {healthPercent === 100 ? (
              <CheckCircle2 className="size-4.5 text-emerald-600" />
            ) : (
              <AlertCircle className="size-4.5 text-amber-600" />
            )}
            <span className="font-display text-xs font-bold text-ink">System Config Health</span>
          </div>
          <span className="font-mono text-xs font-black text-ink">{healthPercent}%</span>
        </div>

        <div className="h-1.5 w-full overflow-hidden rounded-full bg-paper">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              healthPercent === 100 ? "bg-emerald-500" : "bg-amber-500"
            )}
            style={{ width: `${healthPercent}%` }}
          />
        </div>

        <p className="text-[0.6875rem] text-muted-foreground leading-relaxed">
          {healthPercent === 100
            ? "All core business policies, GST rules, and shipping defaults are synchronized."
            : `${passedCount} of ${healthChecks.length} configuration modules initialized.`}
        </p>
      </div>

      {/* Navigation List */}
      <nav className="rounded-2xl border border-border/80 bg-white p-2 shadow-xs space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const hasUnsaved = unsavedTabs.has(item.id);

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={cn(
                "group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs font-semibold transition-all",
                isActive
                  ? "bg-violet text-white shadow-xs"
                  : "text-ink hover:bg-paper hover:text-violet"
              )}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon
                  className={cn(
                    "size-4 shrink-0 transition-colors",
                    isActive ? "text-white" : "text-muted-foreground group-hover:text-violet"
                  )}
                />
                <div className="truncate">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate">{item.label}</span>
                    {hasUnsaved && (
                      <span className="size-1.5 rounded-full bg-amber-400 animate-pulse" />
                    )}
                  </div>
                  <div
                    className={cn(
                      "text-[0.625rem] truncate font-normal",
                      isActive ? "text-white/80" : "text-muted-foreground"
                    )}
                  >
                    {item.description}
                  </div>
                </div>
              </div>

              {item.badge && (
                <span
                  className={cn(
                    "ml-2 rounded px-1.5 py-0.5 text-[0.5625rem] font-bold uppercase font-mono tracking-wider",
                    isActive
                      ? "bg-white/20 text-white"
                      : item.badge === "Critical"
                      ? "bg-rose-50 text-rose-700 border border-rose-200"
                      : "bg-paper text-muted-foreground"
                  )}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
