"use client";

import * as React from "react";
import { Truck, CheckCircle2, ArrowRight, RefreshCw } from "lucide-react";
import { checkPincodeServiceability } from "@/lib/shipping/serviceability";
import { createOrderShipmentAction } from "@/lib/shipping/mutations";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface DirectDispatchCardProps {
  orderId: string;
  orderNumber: string;
  pincode: string;
  city: string;
  state: string;
  existingAwb?: string;
  carrierName?: string;
}

export function DirectDispatchCard({
  orderId,
  orderNumber,
  pincode,
  city,
  state,
  existingAwb,
  carrierName,
}: DirectDispatchCardProps) {
  const router = useRouter();
  const [selectedCarrier, setSelectedCarrier] = React.useState<"delhivery" | "shiprocket" | "bluedart" | "fake">("delhivery");
  const [weightGrams, setWeightGrams] = React.useState(500);
  const [isAssigning, setIsAssigning] = React.useState(false);

  // Compute live serviceability options for recipient's exact pincode
  const serviceability = React.useMemo(() => {
    return checkPincodeServiceability(pincode || "248007", weightGrams, city, state);
  }, [pincode, weightGrams, city, state]);

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

  return (
    <div className={`rounded-2xl border-2 p-5 sm:p-6 shadow-sm space-y-5 ${
      existingAwb ? "border-emerald-300 bg-emerald-50/20" : "border-violet/30 bg-white"
    }`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <div className={`flex size-10 items-center justify-center rounded-xl text-white shadow-xs ${
            existingAwb ? "bg-emerald-600" : "bg-violet"
          }`}>
            <Truck className="size-5" />
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
              Destination: <strong className="text-ink">{city}, {state} ({pincode || "248007"})</strong> · Checked against live carrier routing rules.
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
        <div className="flex items-center justify-between">
          <span className="text-[0.6875rem] font-bold uppercase font-mono text-muted-foreground block tracking-wider">
            Available Carriers for PIN {pincode || "248007"}
          </span>
          {existingAwb && (
            <span className="text-[0.6875rem] text-muted-foreground italic">
              Carrier partner locked upon manifest generation.
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {serviceability.options.map((opt) => {
            const isSelected = selectedCarrier === opt.carrierCode;
            const isAlreadyAssignedCarrier = existingAwb && (
              carrierName?.toLowerCase().includes(opt.carrierCode) ||
              (opt.carrierCode === "delhivery" && carrierName?.toLowerCase().includes("delhivery"))
            );
            const isBlocked = !opt.isServiceable && !existingAwb;

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

      {/* Action Strip (Hidden when already assigned) */}
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
        <div className="p-3 rounded-xl bg-emerald-100/50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
          <span className="font-medium">
            Consignment has been manifested. Courier tracking is active and updates automatically.
          </span>
          <span className="font-mono font-bold text-emerald-800 text-[0.6875rem]">
            STATE: DISPATCHED
          </span>
        </div>
      )}
    </div>
  );
}
