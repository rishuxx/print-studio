"use client";

import * as React from "react";
import { Truck, ExternalLink, MapPin, ArrowRight } from "lucide-react";
import type { ShippingShipment } from "@/lib/shipping/types";
import { getCustomerStatusCopy } from "@/lib/shipping/status-copy";
import Link from "next/link";

interface CustomerShipmentCardProps {
  shipments: ShippingShipment[];
}

export function CustomerShipmentCard({ shipments }: CustomerShipmentCardProps) {
  if (!shipments || shipments.length === 0) return null;

  return (
    <div className="space-y-4">
      {shipments.map((shipment) => {
        const copy = getCustomerStatusCopy(shipment.shipment_status);
        const latestEvent = shipment.tracking_events?.[shipment.tracking_events.length - 1];

        return (
          <div
            key={shipment.id}
            className="rounded-2xl border border-border bg-white p-5 sm:p-6 shadow-xs space-y-5"
          >
            {/* Header: Carrier & AWB */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/80 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-violet/10 text-violet">
                  <Truck className="size-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-ink text-sm">
                      {shipment.carrier?.name || "Express Courier"}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[0.6875rem] font-mono border ${copy.badgeClass}`}>
                      {copy.label}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground font-mono mt-0.5">
                    AWB: <span className="font-bold text-ink">{shipment.awb_number}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {shipment.tracking_url && (
                  <a
                    href={shipment.tracking_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-border bg-paper/50 hover:bg-paper text-xs font-bold text-ink transition-colors"
                  >
                    <span>Courier Portal</span>
                    <ExternalLink className="size-3 text-muted-foreground" />
                  </a>
                )}
                <Link
                  href={`/track/${shipment.tracking_token}`}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-violet text-white text-xs font-bold hover:bg-violet-lift transition-colors"
                >
                  <span>Live Tracking</span>
                  <ArrowRight className="size-3" />
                </Link>
              </div>
            </div>

            {/* Estimated Delivery & Latest Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-paper/40 border border-border/60 text-xs">
              <div>
                <span className="text-muted-foreground text-[0.6875rem] block font-bold uppercase font-mono">
                  Estimated Delivery
                </span>
                <span className="font-display font-black text-ink text-sm">
                  {shipment.estimated_delivery_at
                    ? new Date(shipment.estimated_delivery_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "2–4 Business Days"}
                </span>
              </div>

              <div>
                <span className="text-muted-foreground text-[0.6875rem] block font-bold uppercase font-mono">
                  Latest Milestone
                </span>
                <span className="font-semibold text-ink">
                  {latestEvent ? latestEvent.event_description : copy.description}
                </span>
              </div>
            </div>

            {/* Step Progression Timeline */}
            <div className="space-y-3 pt-2">
              <span className="text-[0.6875rem] font-bold text-muted-foreground uppercase font-mono tracking-wider">
                Consignment Milestones
              </span>

              <div className="relative border-l-2 border-border ml-3 pl-4 space-y-4 text-xs">
                {shipment.tracking_events && shipment.tracking_events.length > 0 ? (
                  shipment.tracking_events.map((evt, idx) => {
                    const isLatest = idx === shipment.tracking_events!.length - 1;
                    return (
                      <div key={evt.id} className="relative space-y-1">
                        <div
                          className={`absolute -left-[1.375rem] top-0.5 size-2.5 rounded-full ring-4 ring-white ${
                            isLatest ? "bg-violet animate-pulse" : "bg-muted-foreground/50"
                          }`}
                        />
                        <div className="flex items-center justify-between">
                          <span className={`font-bold ${isLatest ? "text-violet font-display" : "text-ink"}`}>
                            {evt.event_description}
                          </span>
                          <span className="text-[0.6875rem] text-muted-foreground font-mono">
                            {new Date(evt.event_timestamp).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        {evt.location_city && (
                          <div className="flex items-center gap-1 text-[0.6875rem] text-muted-foreground">
                            <MapPin className="size-3" />
                            <span>
                              {evt.location_city}
                              {evt.location_state && `, ${evt.location_state}`}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="text-xs text-muted-foreground">
                    Waybill registered. Awaiting initial pickup scan from courier facility.
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
