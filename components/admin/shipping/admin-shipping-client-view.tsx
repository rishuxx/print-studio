"use client";

import * as React from "react";
import {
  Search,
  RefreshCw,
  ExternalLink,
  Plus,
} from "lucide-react";
import type { ShippingShipment, ShippingCarrier } from "@/lib/shipping/types";
import { getCustomerStatusCopy } from "@/lib/shipping/status-copy";
import { createOrderShipmentAction, refreshShipmentTrackingAction } from "@/lib/shipping/mutations";
import { toast } from "sonner";
import Link from "next/link";
import { AdminPageHelpButton } from "@/components/admin/admin-page-help-button";

interface AdminShippingClientViewProps {
  initialShipments: ShippingShipment[];
  carriers: ShippingCarrier[];
  availableOrders?: Array<{ id: string; order_number: string; total: number; customer_name?: string }>;
  kpi: {
    totalActive: number;
    inTransit: number;
    outForDelivery: number;
    deliveredToday: number;
    ndrExceptions: number;
    rtoCount: number;
  };
}

export function AdminShippingClientView({
  initialShipments,
  carriers,
  availableOrders = [],
  kpi,
}: AdminShippingClientViewProps) {
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [carrierFilter, setCarrierFilter] = React.useState("all");
  const [refreshingId, setRefreshingId] = React.useState<string | null>(null);

  // Dynamic merged orders from server + client orderStore
  const isHydrated = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const orderList = React.useMemo(() => {
    if (!isHydrated) return availableOrders;
    try {
      const raw = localStorage.getItem("printo_orders_storage");
      if (raw) {
        const parsed = JSON.parse(raw);
        const localOrders = parsed.state?.orders || [];
        const mapped = localOrders.map((o: { id: string; invoiceNumber?: string; customer?: { fullName?: string }; lines?: unknown[]; cost?: { total?: number } }) => ({
          id: o.invoiceNumber || o.id,
          order_number: o.invoiceNumber || o.id,
          total: o.cost?.total || 0,
          customer_name: o.customer?.fullName || "Customer",
        }));

        const existingNumbers = new Set(availableOrders.map((x) => x.order_number));
        const merged = [...availableOrders];
        for (const lo of mapped) {
          if (!existingNumbers.has(lo.order_number)) {
            merged.unshift(lo);
            existingNumbers.add(lo.order_number);
          }
        }
        return merged;
      }
    } catch {
      // ignore
    }
    return availableOrders;
  }, [availableOrders, isHydrated]);

  // New Shipment Creation Dialog State
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [newOrderId, setNewOrderId] = React.useState("");
  const [customOrderIdInput, setCustomOrderIdInput] = React.useState("");
  const [newCarrierCode, setNewCarrierCode] = React.useState<"shiprocket" | "delhivery" | "bluedart" | "fake">("fake");
  const [newWeightGrams, setNewWeightGrams] = React.useState(500);
  const [isCreating, setIsCreating] = React.useState(false);

  // Filtered shipments list
  const filtered = React.useMemo(() => {
    return initialShipments.filter((s) => {
      if (statusFilter !== "all" && s.shipment_status !== statusFilter) return false;
      if (carrierFilter !== "all" && s.carrier_id !== carrierFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesAwb = s.awb_number.toLowerCase().includes(q);
        const matchesDest = s.destination_snapshot?.recipient_name?.toLowerCase().includes(q);
        const matchesCity = s.destination_snapshot?.city?.toLowerCase().includes(q);
        if (!matchesAwb && !matchesDest && !matchesCity) return false;
      }
      return true;
    });
  }, [initialShipments, statusFilter, carrierFilter, search]);

  const handleRefreshTracking = async (shipmentId: string) => {
    setRefreshingId(shipmentId);
    try {
      const res = await refreshShipmentTrackingAction(shipmentId);
      if (res.success) {
        toast.success("Shipment tracking synced with courier API.");
      } else {
        toast.error(res.error || "Failed to sync tracking.");
      }
    } catch {
      toast.error("Network or authorization error");
    } finally {
      setRefreshingId(null);
    }
  };

  const handleCreateShipment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrderId.trim()) {
      toast.error("Order UUID is required.");
      return;
    }

    setIsCreating(true);
    try {
      const res = await createOrderShipmentAction({
        order_id: newOrderId.trim(),
        carrier_code: newCarrierCode,
        weight_grams: newWeightGrams,
      });

      if (!res.success) {
        toast.error(res.error || "Failed to create shipment");
        return;
      }

      toast.success(`Waybill generated! AWB #${res.awbNumber}`);
      setShowCreateModal(false);
      setNewOrderId("");
    } catch {
      toast.error("Error creating shipment");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-violet bg-violet/10 px-2 py-0.5 rounded">
              Phase 11 Logistics Engine
            </span>
            <span className="text-xs text-muted-foreground">• Carrier API & Tracking Master</span>
          </div>
          <h1 className="font-display text-2xl font-black text-ink mt-1">Shipment Tracking & Logistics Command</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Monitor active dispatches, automated waybills, courier scan timelines, and NDR delivery exceptions.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <AdminPageHelpButton />
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet text-white text-xs font-bold shadow-xs hover:bg-violet-lift transition-colors"
          >
            <Plus className="size-3.5" />
            <span>Generate Waybill (AWB)</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-border shadow-xs space-y-1">
          <span className="text-muted-foreground text-[0.6875rem] font-bold uppercase font-mono">Active In Flight</span>
          <div className="font-display text-xl font-black text-ink">{kpi.totalActive}</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-border shadow-xs space-y-1">
          <span className="text-muted-foreground text-[0.6875rem] font-bold uppercase font-mono">In Transit</span>
          <div className="font-display text-xl font-black text-violet">{kpi.inTransit}</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-border shadow-xs space-y-1">
          <span className="text-muted-foreground text-[0.6875rem] font-bold uppercase font-mono">Out For Delivery</span>
          <div className="font-display text-xl font-black text-blue-600">{kpi.outForDelivery}</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-border shadow-xs space-y-1">
          <span className="text-muted-foreground text-[0.6875rem] font-bold uppercase font-mono">Delivered Today</span>
          <div className="font-display text-xl font-black text-emerald-600">{kpi.deliveredToday}</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-border shadow-xs space-y-1">
          <span className="text-muted-foreground text-[0.6875rem] font-bold uppercase font-mono">NDR Exceptions</span>
          <div className="font-display text-xl font-black text-rose-600">{kpi.ndrExceptions}</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-border shadow-xs space-y-1">
          <span className="text-muted-foreground text-[0.6875rem] font-bold uppercase font-mono">RTO In Transit</span>
          <div className="font-display text-xl font-black text-amber-600">{kpi.rtoCount}</div>
        </div>
      </div>

      {/* Filters Strip */}
      <div className="p-4 rounded-2xl bg-white border border-border shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search AWB, recipient, city..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-border font-semibold text-xs bg-paper/30"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-border font-semibold text-xs bg-white"
          >
            <option value="all">All Statuses</option>
            <option value="manifested">Manifested</option>
            <option value="picked_up">Picked Up</option>
            <option value="in_transit">In Transit</option>
            <option value="out_for_delivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
            <option value="ndr">NDR Exceptions</option>
            <option value="rto_in_transit">RTO In Transit</option>
          </select>

          <select
            value={carrierFilter}
            onChange={(e) => setCarrierFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-border font-semibold text-xs bg-white"
          >
            <option value="all">All Carriers</option>
            {carriers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Shipments Table */}
      <div className="bg-white rounded-2xl border border-border shadow-xs overflow-hidden text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-paper/50 font-mono uppercase text-[0.6875rem] text-muted-foreground">
                <th className="py-3 px-4 font-bold text-ink">AWB / Consignment</th>
                <th className="py-3 px-4 font-bold text-ink">Carrier</th>
                <th className="py-3 px-4 font-bold text-ink">Destination</th>
                <th className="py-3 px-4 font-bold text-ink">Status</th>
                <th className="py-3 px-4 font-bold text-ink">ETA</th>
                <th className="py-3 px-4 font-bold text-ink text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length > 0 ? (
                filtered.map((s) => {
                  const copy = getCustomerStatusCopy(s.shipment_status);
                  const isRefreshing = refreshingId === s.id;

                  return (
                    <tr key={s.id} className="hover:bg-paper/30 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-violet text-xs">{s.awb_number}</div>
                        <div className="text-[0.6875rem] text-muted-foreground font-mono">
                          Token: {s.tracking_token.slice(0, 10)}...
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-ink">
                        {s.carrier?.name || "Express Courier"}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-ink">
                          {s.destination_snapshot?.recipient_name || "Customer"}
                        </div>
                        <div className="text-[0.6875rem] text-muted-foreground">
                          {s.destination_snapshot?.city}, {s.destination_snapshot?.state} ({s.destination_snapshot?.postal_code})
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[0.625rem] font-mono border ${copy.badgeClass}`}>
                          {copy.label}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-muted-foreground">
                        {s.estimated_delivery_at
                          ? new Date(s.estimated_delivery_at).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                            })
                          : "3–4 Days"}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleRefreshTracking(s.id)}
                            disabled={isRefreshing}
                            title="Poll Courier API"
                            className="p-1.5 rounded-lg border border-border hover:bg-paper text-muted-foreground hover:text-ink disabled:opacity-50"
                          >
                            <RefreshCw className={`size-3.5 ${isRefreshing ? "animate-spin text-violet" : ""}`} />
                          </button>

                          <Link
                            href={`/track/${s.tracking_token}`}
                            target="_blank"
                            className="p-1.5 rounded-lg border border-border hover:bg-paper text-muted-foreground hover:text-ink"
                            title="Open Public Tracking View"
                          >
                            <ExternalLink className="size-3.5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground bg-paper/20">
                    No matching shipments found. Click &quot;Generate Waybill&quot; to manifest dispatches.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Waybill Creation Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-border shadow-lift space-y-4 text-xs">
            <div>
              <h3 className="font-display text-base font-bold text-ink">Generate Courier Waybill (AWB)</h3>
              <p className="text-muted-foreground text-xs">
                Manifest package with logistics partner and assign an automated tracking number.
              </p>
            </div>

            <form onSubmit={handleCreateShipment} className="space-y-3">
              <div className="space-y-1.5">
                <label className="font-bold text-ink flex items-center justify-between">
                  <span>Select Order</span>
                  <span className="text-[0.6875rem] text-muted-foreground font-normal">
                    Quick Choose
                  </span>
                </label>
                <select
                  value={newOrderId}
                  onChange={(e) => {
                    setNewOrderId(e.target.value);
                    if (e.target.value) setCustomOrderIdInput("");
                  }}
                  className="w-full p-2.5 rounded-xl border border-border font-mono text-xs bg-white font-bold"
                >
                  <option value="">-- Choose Order to Dispatch --</option>
                  {orderList.map((o) => (
                    <option key={o.id} value={o.order_number || o.id}>
                      {o.order_number} · {o.customer_name} (₹{o.total})
                    </option>
                  ))}
                </select>

                <div className="pt-1">
                  <label className="text-[0.6875rem] text-muted-foreground font-semibold block mb-1">
                    Or type / paste any Order Number manually:
                  </label>
                  <input
                    type="text"
                    value={customOrderIdInput}
                    onChange={(e) => {
                      setCustomOrderIdInput(e.target.value);
                      setNewOrderId(e.target.value);
                    }}
                    placeholder="e.g. PRT-2026-7680"
                    className="w-full p-2 rounded-xl border border-border font-mono text-xs bg-paper/20"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-ink">Logistics Partner</label>
                <select
                  value={newCarrierCode}
                  onChange={(e) => setNewCarrierCode(e.target.value as typeof newCarrierCode)}
                  className="w-full p-2.5 rounded-xl border border-border font-bold text-xs bg-white"
                >
                  <option value="fake">Development Sandbox Carrier (Zero Cost)</option>
                  <option value="shiprocket">Shiprocket Fulfillment</option>
                  <option value="delhivery">Delhivery Express</option>
                  <option value="bluedart">Blue Dart Express</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-ink">Consignment Weight (Grams)</label>
                <input
                  type="number"
                  value={newWeightGrams}
                  onChange={(e) => setNewWeightGrams(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-border font-mono text-xs"
                  min={50}
                  max={50000}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl border border-border bg-white text-ink font-bold hover:bg-paper"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-4 py-2 rounded-xl bg-violet text-white font-bold hover:bg-violet-lift disabled:opacity-50"
                >
                  {isCreating ? "Manifesting..." : "Assign Waybill"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
