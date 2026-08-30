import * as React from "react";
import { TaxSettingsRecord } from "@/lib/business-settings/types";
import { updateTaxSettingsAction } from "@/lib/business-settings/mutations";
import { GST_RATE_PRESETS } from "@/lib/business-settings/constants";
import { toast } from "sonner";
import { Percent, ShieldCheck, AlertTriangle, Save, RefreshCw } from "lucide-react";

interface TaxGstTabProps {
  initialTax: TaxSettingsRecord;
  onSaved: (updatedTax: TaxSettingsRecord) => void;
}

export function TaxGstTab({ initialTax, onSaved }: TaxGstTabProps) {
  const [taxData, setTaxData] = React.useState<TaxSettingsRecord>(initialTax);
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await updateTaxSettingsAction(taxData);
      if (res.success) {
        toast.success("Tax & GST configuration updated.");
        onSaved(res.data);
      } else {
        toast.error(res.error || "Failed to update tax configuration.");
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
            <Percent className="size-5" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-ink">Tax & GST Configuration</h3>
            <p className="text-xs text-muted-foreground">
              Define statutory Goods and Services Tax (GST) rates, GSTIN identification, and tax invoice calculation modes.
            </p>
          </div>
        </div>

        {/* Warning Alert */}
        <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 p-3.5 flex items-start gap-2.5 text-xs text-amber-900">
          <AlertTriangle className="size-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Statutory Notice: </span>
            Changing GST configuration applies to new quotes, carts, and invoices. Existing issued tax invoices and completed orders are legally immutable and will not be recalculated.
          </div>
        </div>
      </div>

      {/* Main Settings */}
      <div className="rounded-2xl border border-border/80 bg-white p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between p-4 rounded-xl border border-border/80 bg-paper/30">
          <div className="space-y-0.5">
            <div className="text-xs font-bold text-ink flex items-center gap-1.5">
              <ShieldCheck className="size-4 text-emerald-600" />
              <span>Enable Goods & Services Tax (GST)</span>
            </div>
            <p className="text-[0.6875rem] text-muted-foreground">
              Applies statutory GST breakdown (CGST + SGST or IGST) to all print merchandise.
            </p>
          </div>
          <input
            type="checkbox"
            checked={taxData.gst_enabled}
            onChange={(e) => setTaxData((prev) => ({ ...prev, gst_enabled: e.target.checked }))}
            className="size-4.5 rounded border-border text-violet focus:ring-violet"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-ink flex items-center gap-1">
              Registered GSTIN <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              maxLength={15}
              value={taxData.gstin || ""}
              onChange={(e) => setTaxData((prev) => ({ ...prev, gstin: e.target.value.toUpperCase() }))}
              placeholder="05AAACH7409R1ZZ"
              className="w-full rounded-xl border border-border bg-paper/60 px-3.5 py-2.5 font-mono text-xs font-bold text-ink uppercase focus:bg-white focus:border-violet focus:outline-none"
            />
            <p className="text-[0.6875rem] text-muted-foreground">15-character statutory GST identification number.</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-ink">Tax Display Mode</label>
            <select
              value={taxData.invoice_tax_mode}
              onChange={(e) =>
                setTaxData((prev) => ({
                  ...prev,
                  invoice_tax_mode: e.target.value as "inclusive" | "exclusive",
                }))
              }
              className="w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-xs font-semibold text-ink focus:border-violet focus:outline-none"
            >
              <option value="inclusive">GST Inclusive (Catalog prices include tax)</option>
              <option value="exclusive">GST Exclusive (Tax added at checkout)</option>
            </select>
          </div>
        </div>

        {/* GST Rate Presets & Custom Basis Points */}
        <div className="space-y-2 pt-3 border-t border-border/60">
          <label className="text-xs font-bold text-ink">Default GST Rate Preset</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {GST_RATE_PRESETS.map((preset) => {
              const isSelected = taxData.gst_rate_basis_points === preset.bps;
              return (
                <button
                  key={preset.bps}
                  type="button"
                  onClick={() => setTaxData((prev) => ({ ...prev, gst_rate_basis_points: preset.bps }))}
                  className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "border-violet bg-violet-wash/40 text-violet shadow-xs"
                      : "border-border/80 bg-paper/40 text-ink hover:bg-paper"
                  }`}
                >
                  <span className="font-mono text-xs font-bold">{preset.label}</span>
                  <span className="font-mono text-[0.625rem] text-muted-foreground">{preset.bps} basis points</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Save Action Bar */}
      <div className="flex items-center justify-between rounded-2xl border border-border/80 bg-white p-4 shadow-xs">
        <span className="font-mono text-[0.6875rem] text-muted-foreground">
          Tax Policy Version: <code className="font-bold text-ink">v{taxData.version}</code>
        </span>
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded-xl bg-violet px-5 py-2.5 text-xs font-bold text-white shadow-lift hover:bg-violet-lift transition-all disabled:opacity-50"
        >
          {isSaving ? <RefreshCw className="size-4 animate-spin" /> : <Save className="size-4" />}
          <span>{isSaving ? "Saving Tax Policy..." : "Save Tax Policy"}</span>
        </button>
      </div>
    </form>
  );
}
