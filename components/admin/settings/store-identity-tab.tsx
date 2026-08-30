import * as React from "react";
import { BusinessSettingsRecord } from "@/lib/business-settings/types";
import { updateStoreIdentityAction } from "@/lib/business-settings/mutations";
import { toast } from "sonner";
import { Store, Globe, DollarSign, Clock, Save, RefreshCw, HelpCircle } from "lucide-react";

interface StoreIdentityTabProps {
  initialData: BusinessSettingsRecord;
  onSaved: (updated: BusinessSettingsRecord) => void;
}

export function StoreIdentityTab({ initialData, onSaved }: StoreIdentityTabProps) {
  const [formData, setFormData] = React.useState<BusinessSettingsRecord>(initialData);
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await updateStoreIdentityAction(formData);
      if (res.success) {
        toast.success("Store identity saved successfully.");
        onSaved(res.data);
      } else {
        toast.error(res.error || "Failed to update store identity.");
      }
    } catch {
      toast.error("Unexpected error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header Info */}
      <div className="rounded-2xl border border-border/80 bg-white p-6 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-violet/10 text-violet">
            <Store className="size-5" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-ink">Store Identity & Legal Profile</h3>
            <p className="text-xs text-muted-foreground">
              Configure your primary store branding, legal company entity, and customer-facing metadata.
            </p>
          </div>
        </div>

        {/* Page Help Alert */}
        <div className="mt-4 rounded-xl bg-violet-wash/30 border border-violet/20 p-3.5 flex items-start gap-2.5 text-xs text-ink/80">
          <HelpCircle className="size-4 text-violet shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-violet">Operational Policy: </span>
            Changes to the store name and branding propagate immediately to the storefront header, invoices, and customer communications. Historical order records snapshot company metadata at checkout.
          </div>
        </div>
      </div>

      {/* Main Form Fields */}
      <div className="rounded-2xl border border-border/80 bg-white p-6 shadow-xs space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-ink flex items-center gap-1">
              Store Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.store_name}
              onChange={(e) => setFormData((prev) => ({ ...prev, store_name: e.target.value }))}
              placeholder="e.g. Print Studio"
              className="w-full rounded-xl border border-border bg-paper/60 px-3.5 py-2.5 text-xs font-semibold text-ink focus:bg-white focus:border-violet focus:outline-none"
            />
            <p className="text-[0.6875rem] text-muted-foreground">Displayed across customer headers and page titles.</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-ink">Legal Business Name</label>
            <input
              type="text"
              value={formData.legal_business_name || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, legal_business_name: e.target.value }))}
              placeholder="e.g. Print Studio Solutions Private Limited"
              className="w-full rounded-xl border border-border bg-paper/60 px-3.5 py-2.5 text-xs font-semibold text-ink focus:bg-white focus:border-violet focus:outline-none"
            />
            <p className="text-[0.6875rem] text-muted-foreground">Printed on GST tax invoices and regulatory compliance documents.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-ink">Public Tagline</label>
            <input
              type="text"
              value={formData.tagline || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, tagline: e.target.value }))}
              placeholder="e.g. Custom printing for individuals and businesses"
              className="w-full rounded-xl border border-border bg-paper/60 px-3.5 py-2.5 text-xs font-semibold text-ink focus:bg-white focus:border-violet focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-ink">Canonical Website URL</label>
            <div className="relative">
              <input
                type="url"
                value={formData.website_url || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, website_url: e.target.value }))}
                placeholder="https://example.com"
                className="w-full rounded-xl border border-border bg-paper/60 pl-8 pr-3.5 py-2.5 text-xs font-semibold text-ink focus:bg-white focus:border-violet focus:outline-none"
              />
              <Globe className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-ink">Storefront Description (SEO & Social Sharing)</label>
          <textarea
            rows={3}
            value={formData.description || ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="High-quality custom printing, stationery, apparel, packaging, and branding solutions..."
            className="w-full rounded-xl border border-border bg-paper/60 p-3 text-xs font-medium text-ink focus:bg-white focus:border-violet focus:outline-none"
          />
        </div>

        {/* Currency & Locale System Snapshot */}
        <div className="pt-4 border-t border-border/60 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl border border-border/80 bg-paper/40 p-3 space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-bold">
              <DollarSign className="size-3.5 text-violet" />
              <span>Base Currency</span>
            </div>
            <div className="font-mono text-sm font-black text-ink">
              {formData.currency_code} ({formData.currency_symbol})
            </div>
          </div>

          <div className="rounded-xl border border-border/80 bg-paper/40 p-3 space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-bold">
              <Clock className="size-3.5 text-violet" />
              <span>Operational Timezone</span>
            </div>
            <div className="font-mono text-sm font-black text-ink">{formData.timezone}</div>
          </div>

          <div className="rounded-xl border border-border/80 bg-paper/40 p-3 space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-bold">
              <Globe className="size-3.5 text-violet" />
              <span>Locale Formatting</span>
            </div>
            <div className="font-mono text-sm font-black text-ink">{formData.locale}</div>
          </div>
        </div>
      </div>

      {/* Save Action Bar */}
      <div className="flex items-center justify-between rounded-2xl border border-border/80 bg-white p-4 shadow-xs">
        <span className="font-mono text-[0.6875rem] text-muted-foreground">
          Configuration Version: <code className="font-bold text-ink">v{formData.version}</code>
        </span>
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded-xl bg-violet px-5 py-2.5 text-xs font-bold text-white shadow-lift hover:bg-violet-lift transition-all disabled:opacity-50"
        >
          {isSaving ? <RefreshCw className="size-4 animate-spin" /> : <Save className="size-4" />}
          <span>{isSaving ? "Saving Configuration..." : "Save Store Identity"}</span>
        </button>
      </div>
    </form>
  );
}
