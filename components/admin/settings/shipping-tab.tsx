import * as React from "react";
import { ShippingSettingsRecord } from "@/lib/business-settings/types";
import { updateShippingSettingsAction } from "@/lib/business-settings/mutations";
import { toast } from "sonner";
import { Truck, Save, RefreshCw, HelpCircle } from "lucide-react";

interface ShippingTabProps {
  initialShipping: ShippingSettingsRecord;
  onSaved: (updatedShipping: ShippingSettingsRecord) => void;
}

export function ShippingTab({ initialShipping, onSaved }: ShippingTabProps) {
  const [shippingData, setShippingData] = React.useState<ShippingSettingsRecord>(initialShipping);
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await updateShippingSettingsAction(shippingData);
      if (res.success) {
        toast.success("Shipping defaults saved successfully.");
        onSaved(res.data);
      } else {
        toast.error(res.error || "Failed to update shipping rules.");
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
            <Truck className="size-5" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-ink">Shipping Defaults & Free Thresholds</h3>
            <p className="text-xs text-muted-foreground">
              Define baseline shipping fees, free shipping qualifying cart totals, and default fulfillment estimates.
            </p>
          </div>
        </div>

        {/* Page Help Alert */}
        <div className="mt-4 rounded-xl bg-violet-wash/30 border border-violet/20 p-3.5 flex items-start gap-2.5 text-xs text-ink/80">
          <HelpCircle className="size-4 text-violet shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-violet">Couriers vs Default Rules: </span>
            These settings control fallback pricing for carts and promotional free-shipping banners. Real-time carrier assignment, live AWB generation, and PIN serviceability remain managed by the Shipments & Tracking system.
          </div>
        </div>
      </div>

      {/* Main Form Fields */}
      <div className="rounded-2xl border border-border/80 bg-white p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between p-4 rounded-xl border border-border/80 bg-paper/30">
          <div className="space-y-0.5">
            <div className="text-xs font-bold text-ink">Enable Storefront Shipping & Delivery</div>
            <p className="text-[0.6875rem] text-muted-foreground">
              Enables courier deliveries across India. When disabled, only local store pickup applies.
            </p>
          </div>
          <input
            type="checkbox"
            checked={shippingData.shipping_enabled}
            onChange={(e) => setShippingData((prev) => ({ ...prev, shipping_enabled: e.target.checked }))}
            className="size-4.5 rounded border-border text-violet focus:ring-violet"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-ink flex items-center gap-1">
              Default Standard Shipping Charge (₹) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min={0}
              required
              value={shippingData.default_shipping_fee_minor / 100}
              onChange={(e) =>
                setShippingData((prev) => ({
                  ...prev,
                  default_shipping_fee_minor: Math.round((parseFloat(e.target.value) || 0) * 100),
                }))
              }
              className="w-full rounded-xl border border-border bg-paper/60 px-3.5 py-2.5 font-mono text-xs font-bold text-ink focus:bg-white focus:border-violet focus:outline-none"
            />
            <p className="text-[0.6875rem] text-muted-foreground">Standard flat fee applied if cart is below the free shipping threshold.</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-ink flex items-center gap-1">
              Free Shipping Qualifying Cart Total (₹)
            </label>
            <input
              type="number"
              min={0}
              value={shippingData.free_shipping_threshold_minor / 100}
              onChange={(e) =>
                setShippingData((prev) => ({
                  ...prev,
                  free_shipping_threshold_minor: Math.round((parseFloat(e.target.value) || 0) * 100),
                }))
              }
              className="w-full rounded-xl border border-border bg-paper/60 px-3.5 py-2.5 font-mono text-xs font-bold text-ink focus:bg-white focus:border-violet focus:outline-none"
            />
            <p className="text-[0.6875rem] text-muted-foreground">Orders at or above this value qualify for 100% free delivery across India.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-border/60">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-ink">Min Delivery Days</label>
            <input
              type="number"
              min={1}
              max={15}
              value={shippingData.estimated_delivery_min_days}
              onChange={(e) =>
                setShippingData((prev) => ({
                  ...prev,
                  estimated_delivery_min_days: parseInt(e.target.value) || 1,
                }))
              }
              className="w-full rounded-xl border border-border bg-paper/60 px-3.5 py-2.5 font-mono text-xs font-bold text-ink focus:bg-white focus:border-violet focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-ink">Max Delivery Days</label>
            <input
              type="number"
              min={shippingData.estimated_delivery_min_days}
              max={30}
              value={shippingData.estimated_delivery_max_days}
              onChange={(e) =>
                setShippingData((prev) => ({
                  ...prev,
                  estimated_delivery_max_days: parseInt(e.target.value) || 1,
                }))
              }
              className="w-full rounded-xl border border-border bg-paper/60 px-3.5 py-2.5 font-mono text-xs font-bold text-ink focus:bg-white focus:border-violet focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-ink">Dispatch Origin PIN</label>
            <input
              type="text"
              maxLength={6}
              value={shippingData.default_dispatch_postal_code}
              onChange={(e) =>
                setShippingData((prev) => ({
                  ...prev,
                  default_dispatch_postal_code: e.target.value.replace(/\D/g, ""),
                }))
              }
              className="w-full rounded-xl border border-border bg-paper/60 px-3.5 py-2.5 font-mono text-xs font-bold text-ink focus:bg-white focus:border-violet focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Save Action Bar */}
      <div className="flex items-center justify-between rounded-2xl border border-border/80 bg-white p-4 shadow-xs">
        <span className="font-mono text-[0.6875rem] text-muted-foreground">
          Shipping Rules Version: <code className="font-bold text-ink">v{shippingData.version}</code>
        </span>
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded-xl bg-violet px-5 py-2.5 text-xs font-bold text-white shadow-lift hover:bg-violet-lift transition-all disabled:opacity-50"
        >
          {isSaving ? <RefreshCw className="size-4 animate-spin" /> : <Save className="size-4" />}
          <span>{isSaving ? "Saving Shipping Rules..." : "Save Shipping Defaults"}</span>
        </button>
      </div>
    </form>
  );
}
