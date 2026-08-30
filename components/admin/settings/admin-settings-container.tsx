"use client";

import * as React from "react";
import { FullBusinessConfiguration } from "@/lib/business-settings/types";
import { SettingsSidebar, SettingsTabId } from "./settings-sidebar";
import { StoreIdentityTab } from "./store-identity-tab";
import { ContactAddressTab } from "./contact-address-tab";
import { TaxGstTab } from "./tax-gst-tab";
import { InvoiceTab } from "./invoice-tab";
import { OrderProductionTab } from "./order-production-tab";
import { ShippingTab } from "./shipping-tab";
import { CustomerAccountsTab } from "./customer-accounts-tab";
import { NotificationsTab } from "./notifications-tab";
import { StorefrontHoursTab } from "./storefront-hours-tab";
import { DangerZoneTab } from "./danger-zone-tab";
import { LockedFeaturesTab } from "./locked-features-tab";

interface AdminSettingsContainerProps {
  initialConfig: FullBusinessConfiguration;
}

export function AdminSettingsContainer({ initialConfig }: AdminSettingsContainerProps) {
  const [config, setConfig] = React.useState<FullBusinessConfiguration>(initialConfig);
  const [activeTab, setActiveTab] = React.useState<SettingsTabId>("identity");
  const [unsavedTabs] = React.useState<Set<SettingsTabId>>(new Set());

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl border border-border/80 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex size-2 rounded-full bg-violet animate-pulse" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-violet">
                Centralized Configuration Engine · Phase 10H
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-black text-ink tracking-tight">
              Business & System Settings
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Authoritative PostgreSQL configurations governing branding, GST tax policies, invoices, manufacturing SLA, shipping defaults, and customer notifications.
            </p>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="flex flex-col lg:flex-row items-start gap-6">
        {/* Left Settings Sidebar */}
        <SettingsSidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          config={config}
          unsavedTabs={unsavedTabs}
        />

        {/* Right Active Tab Content */}
        <main className="flex-1 w-full min-w-0">
          {activeTab === "identity" && (
            <StoreIdentityTab
              initialData={config.business}
              onSaved={(updated) => setConfig((prev) => ({ ...prev, business: updated }))}
            />
          )}

          {activeTab === "address" && (
            <ContactAddressTab
              initialAddress={config.address}
              initialContacts={config.contacts}
              onSaved={(updated) => setConfig((prev) => ({ ...prev, address: updated }))}
            />
          )}

          {activeTab === "tax" && (
            <TaxGstTab
              initialTax={config.tax}
              onSaved={(updated) => setConfig((prev) => ({ ...prev, tax: updated }))}
            />
          )}

          {activeTab === "invoice" && (
            <InvoiceTab
              initialInvoice={config.invoice}
              onSaved={(updated) => setConfig((prev) => ({ ...prev, invoice: updated }))}
            />
          )}

          {activeTab === "orders" && (
            <OrderProductionTab
              initialOrder={config.orders}
              initialProduction={config.production}
              onOrderSaved={(updated) => setConfig((prev) => ({ ...prev, orders: updated }))}
              onProductionSaved={(updated) => setConfig((prev) => ({ ...prev, production: updated }))}
            />
          )}

          {activeTab === "shipping" && (
            <ShippingTab
              initialShipping={config.shipping}
              onSaved={(updated) => setConfig((prev) => ({ ...prev, shipping: updated }))}
            />
          )}

          {activeTab === "customers" && (
            <CustomerAccountsTab
              initialCustomers={config.customers}
              onSaved={(updated) => setConfig((prev) => ({ ...prev, customers: updated }))}
            />
          )}

          {activeTab === "notifications" && (
            <NotificationsTab
              initialNotifications={config.notifications}
              onSaved={(updated) => setConfig((prev) => ({ ...prev, notifications: updated }))}
            />
          )}

          {activeTab === "storefront" && (
            <StorefrontHoursTab
              initialStorefront={config.storefront}
              initialHours={config.hours}
              onStorefrontSaved={(updated) => setConfig((prev) => ({ ...prev, storefront: updated }))}
              onHoursSaved={(updated) => setConfig((prev) => ({ ...prev, hours: updated }))}
            />
          )}

          {activeTab === "hours" && (
            <StorefrontHoursTab
              initialStorefront={config.storefront}
              initialHours={config.hours}
              onStorefrontSaved={(updated) => setConfig((prev) => ({ ...prev, storefront: updated }))}
              onHoursSaved={(updated) => setConfig((prev) => ({ ...prev, hours: updated }))}
            />
          )}

          {activeTab === "danger" && (
            <DangerZoneTab
              initialStorefront={config.storefront}
              initialBusiness={config.business}
              onSaved={(updated) => setConfig((prev) => ({ ...prev, storefront: updated }))}
            />
          )}

          {activeTab === "locked" && <LockedFeaturesTab />}
        </main>
      </div>
    </div>
  );
}
