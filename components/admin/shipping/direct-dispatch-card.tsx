"use client";

import * as React from "react";
import { Truck, CheckCircle2, ArrowRight, RefreshCw, Plus, ExternalLink, Calendar, MapPin, X } from "lucide-react";
import { checkPincodeServiceability } from "@/lib/shipping/serviceability";
import {
  createOrderShipmentAction,
  refreshShipmentTrackingAction,
  requestShipmentPickupAction,
  addManualTrackingEventAction,
} from "@/lib/shipping/mutations";
import type { ShippingShipment, CanonicalShipmentStatus } from "@/lib/shipping/types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface DirectDispatchCardProps {
  orderId: string;
  orderNumber: string;
  pincode: string;
  city: string;
  state: string;
  existingAwb?: string;
  carrierName?: string;
  shipment?: ShippingShipment;
}

export function DirectDispatchCard({
  orderId,
  orderNumber,
  pincode,
  city,
  state,
  existingAwb,
  carrierName,
  shipment,
}: DirectDispatchCardProps) {
  const router = useRouter();
  const [selectedCarrier, setSelectedCarrier] = React.useState<"delhivery" | "shiprocket" | "bluedart" | "fake">("delhivery");
  const [weightGrams, setWeightGrams] = React.useState(500);
  const [isAssigning, setIsAssigning] = React.useState(false);
  const [isRefreshingTracking, setIsRefreshingTracking] = React.useState(false);
  const [isRequestingPickup, setIsRequestingPickup] = React.useState(false);
  const [liveServiceability, setLiveServiceability] = React.useState<ReturnType<typeof checkPincodeServiceability> | null>(null);
  const [isLoadingRates, setIsLoadingRates] = React.useState(false);
  const [logoError, setLogoError] = React.useState(false);

  // Manual Checkpoint Modal State
  const [showCheckpointModal, setShowCheckpointModal] = React.useState(false);
  const [manualStatus, setManualStatus] = React.useState<CanonicalShipmentStatus>(
    shipment?.shipment_status || "in_transit"
  );
  const [manualDesc, setManualDesc] = React.useState("");
  const [manualCity, setManualCity] = React.useState(city || "Dehradun Hub");
  const [manualState, setManualState] = React.useState(state || "Uttarakhand");
  const [isSubmittingCheckpoint, setIsSubmittingCheckpoint] = React.useState(false);

  const getCarrierLogoUrl = () => {
    if (existingAwb && carrierName) {
      const name = carrierName.toLowerCase();
      if (name.includes("delhivery")) return "https://www.google.com/s2/favicons?domain=delhivery.com&sz=128";
      if (name.includes("shiprocket")) return "https://www.google.com/s2/favicons?domain=shiprocket.in&sz=128";
      if (name.includes("blue dart") || name.includes("bluedart")) return "https://www.google.com/s2/favicons?domain=bluedart.com&sz=128";
      return null;
    }
    
    switch (selectedCarrier) {
      case "delhivery": return "https://www.google.com/s2/favicons?domain=delhivery.com&sz=128";
      case "shiprocket": return "https://www.google.com/s2/favicons?domain=shiprocket.in&sz=128";
      case "bluedart": return "https://www.google.com/s2/favicons?domain=bluedart.com&sz=128";
      default: return null;
    }
  };

  const carrierLogoUrl = getCarrierLogoUrl();

  React.useEffect(() => {
    setLogoError(false);
  }, [carrierLogoUrl]);

  const baseline = React.useMemo(() => {
    return checkPincodeServiceability(pincode || "248007", weightGrams, city, state);
  }, [pincode, weightGrams, city, state]);

  React.useEffect(() => {
    let isCancelled = false;
    async function fetchLiveRates() {
      setIsLoadingRates(true);
      try {
        const res = await fetch("/api/shipping/serviceability", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pincode: pincode || "248007", weightGrams, city, state }),
        });
        const data = await res.json();
        if (!isCancelled && data.success && data.result) {
          setLiveServiceability(data.result);
        }
      } catch {
        // fallback to baseline
      } finally {
        if (!isCancelled) setIsLoadingRates(false);
      }
    }

    fetchLiveRates();
    return () => {
      isCancelled = true;
    };
  }, [pincode, weightGrams, city, state]);

  const serviceability = liveServiceability || baseline;

  const handleAssignDispatch = async (carrierCode: "delhivery" | "shiprocket" | "bluedart" | "fake") => {
    if (existingAwb) {
      toast.info("Logistics partner is permanently locked for this order.");
      return;
    }

    setIsAssigning(true);
    try {
      const res = await createOrderShipmentAction({
        order_id: orderNumber || orderId,
        carrier_code: carrierCode,
        weight_grams: weightGrams,
      });

      if (res.success) {
        toast.success(`Consignment Dispatched! AWB #${res.awbNumber}`, {
          description: `Assigned to ${carrierCode.toUpperCase()} for PIN ${pincode || "248007"}.`,
        });
        router.refresh();
      } else {
        toast.error(res.error || "Failed to assign logistics partner");
      }
    } catch {
      toast.error("Network communication error");
    } finally {
      setIsAssigning(false);
    }
  };

  const handleRefreshTracking = async () => {
    if (!shipment?.id) {
      toast.error("No shipment ID found to refresh tracking.");
      return;
    }
    setIsRefreshingTracking(true);
    try {
      const res = await refreshShipmentTrackingAction(shipment.id);
      if (res.success) {
        toast.success("Courier tracking updated!", {
          description: "Authoritative scans and timeline refreshed from carrier API.",
        });
        router.refresh();
      } else {
        toast.error(res.error || "Failed to refresh carrier tracking.");
      }
    } catch {
      toast.error("Error communicating with logistics server.");
    } finally {
      setIsRefreshingTracking(false);
    }
  };

  const handleRequestPickup = async () => {
    if (!shipment?.id) {
      toast.error("No shipment ID found to request pickup.");
      return;
    }
    setIsRequestingPickup(true);
    try {
      const res = await requestShipmentPickupAction(shipment.id);
      if (res.success) {
        toast.success("Courier Pickup Scheduled!", {
          description: `Pickup docket ${res.pickupReference} registered with carrier.`,
        });
        router.refresh();
      } else {
        toast.error(res.error || "Failed to schedule pickup.");
      }
    } catch {
      toast.error("Error requesting courier pickup.");
    } finally {
      setIsRequestingPickup(false);
    }
  };

  const handleOpenCheckpointModal = () => {
    if (!shipment) {
      toast.error("No shipment record found.");
      return;
    }
    setManualStatus(shipment.shipment_status || "in_transit");
    setManualDesc(
      shipment.shipment_status === "out_for_delivery"
        ? "Consignment out for delivery with executive."
        : shipment.shipment_status === "delivered"
        ? "Package handed over to recipient."
        : "Package processed at transit sorting center."
    );
    setManualCity(shipment.destination_snapshot?.city || city || "Dehradun Hub");
    setManualState(shipment.destination_snapshot?.state || state || "Uttarakhand");
    setShowCheckpointModal(true);
  };

  const handleSubmitCheckpoint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shipment?.id) return;
    if (!manualDesc.trim()) {
      toast.error("Please enter a checkpoint description.");
      return;
    }

    setIsSubmittingCheckpoint(true);
    try {
      const res = await addManualTrackingEventAction({
        shipmentId: shipment.id,
        canonicalStatus: manualStatus,
        description: manualDesc.trim(),
        locationCity: manualCity.trim() || undefined,
        locationState: manualState.trim() || undefined,
      });

      if (res.success) {
        toast.success("Tracking Checkpoint Appended!", {
          description: "Lifecycle timeline and customer notification updated instantly.",
        });
        setShowCheckpointModal(false);
        router.refresh();
      } else {
        toast.error(res.error || "Failed to append tracking checkpoint.");
      }
    } catch {
      toast.error("Network communication error.");
    } finally {
      setIsSubmittingCheckpoint(false);
    }
  };

  return (
    <div className={`rounded-2xl border-2 p-5 sm:p-6 shadow-sm space-y-5 ${
      existingAwb ? "border-emerald-300 bg-emerald-50/20" : "border-violet/30 bg-white"
    }`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <div className={`flex size-10 flex-shrink-0 items-center justify-center rounded-xl overflow-hidden shadow-xs ${
            existingAwb ? "bg-emerald-600" : "bg-violet"
          }`}>
            {carrierLogoUrl && !logoError ? (
              <div className="w-full h-full bg-white flex items-center justify-center p-1.5">
                <img 
                  src={carrierLogoUrl} 
                  alt="Carrier Logo" 
                  className="w-full h-full object-contain"
                  onError={() => setLogoError(true)}
                />
              </div>
            ) : (
              <Truck className="size-5 text-white" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display text-base font-bold text-ink">
                Logistics Partner & Serviceability
              </h3>
              {existingAwb && (
                <span className="px-2 py-0.5 rounded text-[0.6875rem] font-mono font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                  ASSIGNED & LOCKED
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Destination: <strong className="text-ink">{city}, {state} ({pincode || "248007"})</strong> · 
              {isLoadingRates ? (
                <span className="text-violet font-semibold animate-pulse ml-1">Calculating live courier freight...</span>
              ) : (
                <span className="ml-1">Live Delhivery rate & serviceability active.</span>
              )}
            </p>
          </div>
        </div>

        {existingAwb && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-emerald-100/80 text-emerald-950 border border-emerald-300 px-3 py-1.5 rounded-xl text-xs font-mono font-bold">
              <CheckCircle2 className="size-3.5 text-emerald-700" />
              <span>{carrierName || "Courier"}: AWB #{existingAwb}</span>
            </div>
          </div>
        )}
      </div>

      {/* Available Carrier Partners for this Pincode */}
      <div className="space-y-3">
        <div className="text-[0.6875rem] font-bold text-ink uppercase font-mono tracking-wider flex items-center justify-between">
          <span>Courier Partner Performance & SLAs</span>
          {serviceability.calculatedByDelhiveryApi && (
            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-normal lowercase">
              verified via live delhivery api
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {serviceability.options.map((opt) => {
            const isSelected = selectedCarrier === opt.carrierCode;
            const isBlocked = !opt.isServiceable;
            const isAlreadyAssignedCarrier = existingAwb && (
              carrierName?.toLowerCase().includes(opt.carrierCode) ||
              (opt.carrierCode === "fake" && carrierName?.toLowerCase().includes("sandbox"))
            );

            return (
              <div
                key={opt.carrierCode}
                onClick={() => {
                  if (!existingAwb && opt.isServiceable) setSelectedCarrier(opt.carrierCode);
                }}
                className={`p-4 rounded-xl border transition-all relative space-y-2 ${
                  isBlocked
                    ? "border-red-200 bg-red-50/40 opacity-75 cursor-not-allowed"
                    : existingAwb
                    ? isAlreadyAssignedCarrier
                      ? "border-emerald-500 bg-emerald-50/80 ring-2 ring-emerald-500/20"
                      : "border-border/60 bg-paper/20 opacity-60 cursor-not-allowed"
                    : isSelected
                    ? "border-violet bg-violet/5 ring-2 ring-violet/20 shadow-xs cursor-pointer"
                    : "border-border bg-paper/30 hover:border-violet/40 hover:bg-paper/60 cursor-pointer"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`font-bold text-xs ${isBlocked ? "text-red-950" : "text-ink"}`}>{opt.carrierName}</span>
                      {isBlocked ? (
                        <span className="px-2 py-0.5 rounded text-[0.625rem] font-mono font-bold bg-red-100 text-red-700 border border-red-200">
                          UNSERVICEABLE
                        </span>
                      ) : opt.recommendedBadge ? (
                        <span className="px-2 py-0.5 rounded text-[0.625rem] font-mono font-bold bg-violet/10 text-violet">
                          {opt.recommendedBadge}
                        </span>
                      ) : null}
                    </div>
                    {isBlocked ? (
                      <span className="text-[0.6875rem] text-red-600 font-medium block mt-0.5">
                        {opt.unserviceableReason || "Non-serviceable delivery zone"}
                      </span>
                    ) : (
                      <span className="text-[0.6875rem] text-muted-foreground block mt-0.5">
                        Mode: <strong className="text-ink">{opt.mode}</strong> · Speed: <strong className="text-ink">{opt.deliverySpeed}</strong>
                      </span>
                    )}
                  </div>

                  <input
                    type="radio"
                    name="carrier_selection"
                    checked={existingAwb ? Boolean(isAlreadyAssignedCarrier) : isSelected && opt.isServiceable}
                    disabled={Boolean(existingAwb) || isBlocked}
                    onChange={() => {
                      if (!existingAwb && opt.isServiceable) setSelectedCarrier(opt.carrierCode);
                    }}
                    className="accent-violet size-4 mt-0.5"
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/60 text-[0.6875rem]">
                  <span className="text-muted-foreground">
                    {isBlocked ? (
                      <span className="text-red-500 font-medium">Cannot manifest for PIN {pincode}</span>
                    ) : (
                      <>Estimated Delivery: <strong className="text-ink">{opt.estimatedDeliveryDate}</strong></>
                    )}
                  </span>
                  <span className={`font-mono font-bold ${isBlocked ? "text-muted-foreground line-through" : "text-violet"}`}>
                    {isBlocked ? "Unavailable" : opt.rateEstimateInr === 0 ? "FREE (Sandbox)" : `Est. ₹${opt.rateEstimateInr}`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Strip */}
      {!existingAwb ? (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-border">
          <div className="flex items-center gap-2 text-xs">
            <label className="font-bold text-ink font-mono text-[0.6875rem] uppercase">
              Parcel Weight (Grams):
            </label>
            <input
              type="number"
              value={weightGrams}
              onChange={(e) => setWeightGrams(Number(e.target.value))}
              min={50}
              max={50000}
              className="w-24 px-2.5 py-1.5 rounded-lg border border-border font-mono text-xs text-ink"
            />
          </div>

          <button
            type="button"
            disabled={isAssigning}
            onClick={() => handleAssignDispatch(selectedCarrier)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-violet text-white text-xs font-bold shadow-lift hover:bg-violet-lift transition-all disabled:opacity-50"
          >
            {isAssigning ? (
              <>
                <RefreshCw className="size-3.5 animate-spin" />
                <span>Manifesting with {selectedCarrier.toUpperCase()}...</span>
              </>
            ) : (
              <>
                <span>Assign & Dispatch via {selectedCarrier.toUpperCase()}</span>
                <ArrowRight className="size-3.5" />
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-3 pt-3 border-t border-emerald-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-emerald-100/60 border border-emerald-200">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-emerald-950">
                  Consignment Active & Manifested
                </span>
                <span className="font-mono font-bold text-emerald-800 text-[0.625rem] bg-emerald-200/80 px-2 py-0.5 rounded">
                  STATE: {shipment?.shipment_status?.toUpperCase() || "DISPATCHED"}
                </span>
              </div>
              <p className="text-[0.6875rem] text-emerald-800">
                AWB #{existingAwb} via {carrierName || "Logistics Partner"}. Timeline and customer notifications update automatically.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Refresh Tracking Action */}
              <button
                type="button"
                onClick={handleRefreshTracking}
                disabled={isRefreshingTracking}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-emerald-300 text-emerald-900 text-xs font-bold shadow-xs hover:bg-emerald-50 transition-all disabled:opacity-50"
              >
                <RefreshCw className={`size-3 text-emerald-700 ${isRefreshingTracking ? "animate-spin" : ""}`} />
                <span>{isRefreshingTracking ? "Syncing..." : "Sync Tracking Scans"}</span>
              </button>

              {/* Request Pickup Button if not yet picked up */}
              {shipment && shipment.shipment_status === "manifested" && (
                <button
                  type="button"
                  onClick={handleRequestPickup}
                  disabled={isRequestingPickup}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 text-white text-xs font-bold shadow-xs hover:bg-emerald-800 transition-all disabled:opacity-50"
                >
                  <Calendar className="size-3" />
                  <span>{isRequestingPickup ? "Scheduling..." : "Request Pickup"}</span>
                </button>
              )}

              {/* Add Tracking Checkpoint Milestone Button */}
              {shipment && (
                <button
                  type="button"
                  onClick={handleOpenCheckpointModal}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet text-white text-xs font-bold shadow-xs hover:bg-violet-lift transition-all"
                >
                  <Plus className="size-3" />
                  <span>Update Tracking Milestone</span>
                </button>
              )}

              {/* Public Tracking Link */}
              {shipment?.tracking_token && (
                <Link
                  href={`/track/${shipment.tracking_token}`}
                  target="_blank"
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-emerald-300 bg-white text-emerald-800 text-xs font-bold hover:bg-emerald-50"
                >
                  <ExternalLink className="size-3" />
                  <span>Live Tracking URL</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Manual Tracking Checkpoint Modal */}
      {showCheckpointModal && shipment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-border space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-violet/10 text-violet">
                  <MapPin className="size-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-ink">Update Logistics Milestone</h3>
                  <p className="text-[0.6875rem] text-muted-foreground font-mono">
                    AWB #{shipment.awb_number} · {carrierName || "Carrier Partner"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCheckpointModal(false)}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-paper hover:text-ink transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitCheckpoint} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-ink">Target Logistics Status</label>
                <select
                  value={manualStatus}
                  onChange={(e) => setManualStatus(e.target.value as CanonicalShipmentStatus)}
                  className="w-full rounded-xl border border-border bg-white px-3 py-2 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-violet/20"
                >
                  <option value="picked_up">Picked Up by Courier</option>
                  <option value="in_transit">In Transit (Sorting / Hub)</option>
                  <option value="arrived_at_hub">Arrived at Destination Hub</option>
                  <option value="out_for_delivery">Out for Delivery</option>
                  <option value="delivered">Successfully Delivered</option>
                  <option value="ndr">Delivery Attempt Exception (NDR)</option>
                  <option value="rto_in_transit">Return to Origin (RTO)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-ink">Milestone Description</label>
                <input
                  type="text"
                  value={manualDesc}
                  onChange={(e) => setManualDesc(e.target.value)}
                  placeholder="e.g. Package dispatched from Dehradun Sorting Center"
                  className="w-full rounded-xl border border-border bg-white px-3 py-2 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-violet/20"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-ink">Location City</label>
                  <input
                    type="text"
                    value={manualCity}
                    onChange={(e) => setManualCity(e.target.value)}
                    className="w-full rounded-xl border border-border bg-white px-3 py-2 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-violet/20"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-ink">Location State</label>
                  <input
                    type="text"
                    value={manualState}
                    onChange={(e) => setManualState(e.target.value)}
                    className="w-full rounded-xl border border-border bg-white px-3 py-2 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-violet/20"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-violet/5 border border-violet/20 text-[0.6875rem] text-muted-foreground leading-relaxed">
                Updating this milestone immediately appends an event to the <strong>Production & Dispatch Timeline</strong>, records an authoritative PostgreSQL audit entry, and dispatches a live tracking notification to the customer.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowCheckpointModal(false)}
                  className="px-4 py-2 rounded-xl border border-border text-xs font-bold text-ink hover:bg-paper"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingCheckpoint}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-violet text-white text-xs font-bold shadow-lift hover:bg-violet-lift transition-all disabled:opacity-50"
                >
                  {isSubmittingCheckpoint ? (
                    <>
                      <RefreshCw className="size-3 animate-spin" />
                      <span>Saving Checkpoint...</span>
                    </>
                  ) : (
                    <span>Post Checkpoint & Notify Customer</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
