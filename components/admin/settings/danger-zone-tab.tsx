import * as React from "react";
import { StorefrontSettingsRecord, BusinessSettingsRecord } from "@/lib/business-settings/types";
import { updateStorefrontSettingsAction } from "@/lib/business-settings/mutations";
import { toast } from "sonner";
import { ShieldAlert, Power, Save, RefreshCw } from "lucide-react";

interface DangerZoneTabProps {
  initialStorefront: StorefrontSettingsRecord;
  initialBusiness: BusinessSettingsRecord;
  onSaved: (updated: StorefrontSettingsRecord) => void;
}

export function DangerZoneTab({ initialStorefront, onSaved }: DangerZoneTabProps) {
  const [storefrontData, setStorefrontData] = React.useState<StorefrontSettingsRecord>(initialStorefront);
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await updateStorefrontSettingsAction(storefrontData);
      if (res.success) {
        toast.success("Emergency store controls updated.");
        onSaved(res.data);
      } else {
        toast.error(res.error || "Failed to update controls.");
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
      <div className="rounded-2xl border border-rose-200 bg-rose-50/40 p-6 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-rose-600 text-white">
            <ShieldAlert className="size-5" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-rose-950">Storefront Emergency Controls & Maintenance</h3>
            <p className="text-xs text-rose-800">
              Critical operational switches to pause customer checkout or display emergency scheduled maintenance.
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="rounded-2xl border border-rose-200 bg-white p-6 shadow-xs space-y-5">
        <div className="flex items-start justify-between gap-4 p-4 rounded-xl border border-rose-200 bg-rose-50/30">
          <div className="space-y-1">
            <div className="text-xs font-bold text-rose-950 flex items-center gap-1.5">
              <Power className="size-4 text-rose-600" />
              <span>Enable Storefront Maintenance Mode</span>
            </div>
            <p className="text-xs text-rose-900/80 leading-relaxed">
              When enabled, customer storefront displays a maintenance message. All Administrator consoles and order pipelines remain 100% accessible to authorized admins.
            </p>
          </div>
          <input
            type="checkbox"
            checked={storefrontData.maintenance_mode}
            onChange={(e) => setStorefrontData((prev) => ({ ...prev, maintenance_mode: e.target.checked }))}
            className="size-5 rounded border-rose-300 text-rose-600 focus:ring-rose-500 shrink-0 mt-1"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-ink">Custom Maintenance Notice to Customers</label>
          <textarea
            rows={3}
            value={storefrontData.maintenance_message || ""}
            onChange={(e) => setStorefrontData((prev) => ({ ...prev, maintenance_message: e.target.value }))}
            placeholder="We are currently performing scheduled maintenance. Please check back shortly."
            className="w-full rounded-xl border border-border bg-paper/60 p-3 text-xs font-medium text-ink focus:bg-white focus:border-rose-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Save Action Bar */}
      <div className="flex items-center justify-between rounded-2xl border border-rose-200 bg-white p-4 shadow-xs">
        <span className="font-mono text-[0.6875rem] text-rose-700 font-bold">
          Emergency Status: {storefrontData.maintenance_mode ? "⚠️ MAINTENANCE ACTIVE" : "🟢 STOREFRONT LIVE"}
        </span>
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-bold text-white shadow-lift hover:bg-rose-700 transition-all disabled:opacity-50"
        >
          {isSaving ? <RefreshCw className="size-4 animate-spin" /> : <Save className="size-4" />}
          <span>{isSaving ? "Applying..." : "Apply Emergency Controls"}</span>
        </button>
      </div>
    </form>
  );
}
