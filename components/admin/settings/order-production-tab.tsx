import * as React from "react";
import { OrderSettingsRecord, ProductionSettingsRecord } from "@/lib/business-settings/types";
import {
  updateOrderSettingsAction,
  updateProductionSettingsAction,
} from "@/lib/business-settings/mutations";
import { toast } from "sonner";
import { Sliders, Factory, Save, RefreshCw } from "lucide-react";

interface OrderProductionTabProps {
  initialOrder: OrderSettingsRecord;
  initialProduction: ProductionSettingsRecord;
  onOrderSaved: (updated: OrderSettingsRecord) => void;
  onProductionSaved: (updated: ProductionSettingsRecord) => void;
}

export function OrderProductionTab({
  initialOrder,
  initialProduction,
  onOrderSaved,
  onProductionSaved,
}: OrderProductionTabProps) {
  const [orderData, setOrderData] = React.useState<OrderSettingsRecord>(initialOrder);
  const [prodData, setProdData] = React.useState<ProductionSettingsRecord>(initialProduction);
  const [isSavingOrder, setIsSavingOrder] = React.useState(false);
  const [isSavingProd, setIsSavingProd] = React.useState(false);

  const handleSaveOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingOrder(true);
    try {
      const res = await updateOrderSettingsAction(orderData);
      if (res.success) {
        toast.success("Order rules saved successfully.");
        onOrderSaved(res.data);
      } else {
        toast.error(res.error || "Failed to update order rules.");
      }
    } catch {
      toast.error("Unexpected error occurred.");
    } finally {
      setIsSavingOrder(false);
    }
  };

  const handleSaveProd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProd(true);
    try {
      const res = await updateProductionSettingsAction(prodData);
      if (res.success) {
        toast.success("Production turnaround SLA saved.");
        onProductionSaved(res.data);
      } else {
        toast.error(res.error || "Failed to update production SLA.");
      }
    } catch {
      toast.error("Unexpected error occurred.");
    } finally {
      setIsSavingProd(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* ── Order Rules Section ───────────────────────────────────── */}
      <form onSubmit={handleSaveOrder} className="space-y-6">
        <div className="rounded-2xl border border-border/80 bg-white p-6 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-violet/10 text-violet">
              <Sliders className="size-5" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-ink">Order Rules & Cancellation Policy</h3>
              <p className="text-xs text-muted-foreground">
                Govern customer checkout constraints, cancellation grace windows, and re-order policies.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border/80 bg-white p-6 shadow-xs space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex items-center gap-2.5 p-3 rounded-xl border border-border/80 bg-paper/30 cursor-pointer">
              <input
                type="checkbox"
                checked={orderData.allow_guest_checkout}
                onChange={(e) => setOrderData((prev) => ({ ...prev, allow_guest_checkout: e.target.checked }))}
                className="size-4 rounded text-violet focus:ring-violet"
              />
              <div className="text-xs">
                <div className="font-bold text-ink">Allow Guest Checkout</div>
                <div className="text-[0.6875rem] text-muted-foreground">Customers can order without creating an account.</div>
              </div>
            </label>

            <label className="flex items-center gap-2.5 p-3 rounded-xl border border-border/80 bg-paper/30 cursor-pointer">
              <input
                type="checkbox"
                checked={orderData.allow_order_cancellation}
                onChange={(e) => setOrderData((prev) => ({ ...prev, allow_order_cancellation: e.target.checked }))}
                className="size-4 rounded text-violet focus:ring-violet"
              />
              <div className="text-xs">
                <div className="font-bold text-ink">Customer Cancellation Window</div>
                <div className="text-[0.6875rem] text-muted-foreground">Allow cancellation before pre-press/press plates.</div>
              </div>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-border/60">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-ink">Cancellation Grace Window (Minutes)</label>
              <input
                type="number"
                min={0}
                max={1440}
                value={orderData.customer_cancellation_window_minutes}
                onChange={(e) =>
                  setOrderData((prev) => ({
                    ...prev,
                    customer_cancellation_window_minutes: parseInt(e.target.value) || 0,
                  }))
                }
                className="w-full rounded-xl border border-border bg-paper/60 px-3.5 py-2.5 font-mono text-xs font-bold text-ink focus:bg-white focus:border-violet focus:outline-none"
              />
              <p className="text-[0.6875rem] text-muted-foreground">Grace time allowed for customer self-cancellation.</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-ink">Min Order Value (₹)</label>
              <input
                type="number"
                min={0}
                value={orderData.minimum_order_value_minor / 100}
                onChange={(e) =>
                  setOrderData((prev) => ({
                    ...prev,
                    minimum_order_value_minor: Math.round((parseFloat(e.target.value) || 0) * 100),
                  }))
                }
                className="w-full rounded-xl border border-border bg-paper/60 px-3.5 py-2.5 font-mono text-xs font-bold text-ink focus:bg-white focus:border-violet focus:outline-none"
              />
              <p className="text-[0.6875rem] text-muted-foreground">Minimum checkout threshold.</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-ink">Max Order Value (₹)</label>
              <input
                type="number"
                min={100}
                value={orderData.maximum_order_value_minor / 100}
                onChange={(e) =>
                  setOrderData((prev) => ({
                    ...prev,
                    maximum_order_value_minor: Math.round((parseFloat(e.target.value) || 0) * 100),
                  }))
                }
                className="w-full rounded-xl border border-border bg-paper/60 px-3.5 py-2.5 font-mono text-xs font-bold text-ink focus:bg-white focus:border-violet focus:outline-none"
              />
              <p className="text-[0.6875rem] text-muted-foreground">Upper credit/fraud safety limit.</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-border/80 bg-white p-4 shadow-xs">
          <span className="font-mono text-[0.6875rem] text-muted-foreground">
            Order Policy: <code className="font-bold text-ink">v{orderData.version}</code>
          </span>
          <button
            type="submit"
            disabled={isSavingOrder}
            className="inline-flex items-center gap-2 rounded-xl bg-violet px-5 py-2.5 text-xs font-bold text-white shadow-lift hover:bg-violet-lift transition-all disabled:opacity-50"
          >
            {isSavingOrder ? <RefreshCw className="size-4 animate-spin" /> : <Save className="size-4" />}
            <span>{isSavingOrder ? "Saving..." : "Save Order Rules"}</span>
          </button>
        </div>
      </form>

      {/* ── Production SLA Section ─────────────────────────────────── */}
      <form onSubmit={handleSaveProd} className="space-y-6">
        <div className="rounded-2xl border border-border/80 bg-white p-6 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-violet/10 text-violet">
              <Factory className="size-5" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-ink">Production Turnaround SLA & Cutoff Times</h3>
              <p className="text-xs text-muted-foreground">
                Set realistic manufacturing days, daily press plate cutoffs, and quality-check requirements.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border/80 bg-white p-6 shadow-xs space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-ink">Default Min Production Days</label>
              <input
                type="number"
                min={0}
                max={30}
                value={prodData.default_production_days_min}
                onChange={(e) =>
                  setProdData((prev) => ({
                    ...prev,
                    default_production_days_min: parseInt(e.target.value) || 0,
                  }))
                }
                className="w-full rounded-xl border border-border bg-paper/60 px-3.5 py-2.5 font-mono text-xs font-bold text-ink focus:bg-white focus:border-violet focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-ink">Default Max Production Days</label>
              <input
                type="number"
                min={prodData.default_production_days_min}
                max={60}
                value={prodData.default_production_days_max}
                onChange={(e) =>
                  setProdData((prev) => ({
                    ...prev,
                    default_production_days_max: parseInt(e.target.value) || 0,
                  }))
                }
                className="w-full rounded-xl border border-border bg-paper/60 px-3.5 py-2.5 font-mono text-xs font-bold text-ink focus:bg-white focus:border-violet focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-border/60">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-ink">Daily Production Cutoff Time (24hr)</label>
              <input
                type="text"
                pattern="^([01]\d|2[0-3]):([0-5]\d)$"
                value={prodData.production_cutoff_time}
                onChange={(e) => setProdData((prev) => ({ ...prev, production_cutoff_time: e.target.value }))}
                placeholder="14:00"
                className="w-full rounded-xl border border-border bg-paper/60 px-3.5 py-2.5 font-mono text-xs font-bold text-ink focus:bg-white focus:border-violet focus:outline-none"
              />
              <p className="text-[0.6875rem] text-muted-foreground">Orders confirmed after this time roll into the next manufacturing day.</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-ink">Same-Day Dispatch Cutoff Time</label>
              <input
                type="text"
                pattern="^([01]\d|2[0-3]):([0-5]\d)$"
                value={prodData.same_day_cutoff_time}
                onChange={(e) => setProdData((prev) => ({ ...prev, same_day_cutoff_time: e.target.value }))}
                placeholder="11:00"
                className="w-full rounded-xl border border-border bg-paper/60 px-3.5 py-2.5 font-mono text-xs font-bold text-ink focus:bg-white focus:border-violet focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-border/80 bg-white p-4 shadow-xs">
          <span className="font-mono text-[0.6875rem] text-muted-foreground">
            Production SLA: <code className="font-bold text-ink">v{prodData.version}</code>
          </span>
          <button
            type="submit"
            disabled={isSavingProd}
            className="inline-flex items-center gap-2 rounded-xl bg-violet px-5 py-2.5 text-xs font-bold text-white shadow-lift hover:bg-violet-lift transition-all disabled:opacity-50"
          >
            {isSavingProd ? <RefreshCw className="size-4 animate-spin" /> : <Save className="size-4" />}
            <span>{isSavingProd ? "Saving..." : "Save Production SLA"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
