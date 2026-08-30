import { fetchShipmentByToken } from "@/lib/shipping/queries";
import { notFound } from "next/navigation";
import { getCustomerStatusCopy } from "@/lib/shipping/status-copy";
import { Truck, MapPin, ShieldCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface PublicTrackingPageProps {
  params: Promise<{ trackingToken: string }>;
}

export async function generateMetadata({ params }: PublicTrackingPageProps): Promise<Metadata> {
  const { trackingToken } = await params;
  const shipment = await fetchShipmentByToken(trackingToken);

  return {
    title: shipment
      ? `Track Consignment #${shipment.awb_number} · Print Studio`
      : "Consignment Tracking · Print Studio",
    robots: { index: false, follow: false },
  };
}

export default async function PublicTrackingPage({ params }: PublicTrackingPageProps) {
  const { trackingToken } = await params;
  const shipment = await fetchShipmentByToken(trackingToken);

  if (!shipment) {
    notFound();
  }

  const copy = getCustomerStatusCopy(shipment.shipment_status);
  const dest = shipment.destination_snapshot || {};

  return (
    <div className="min-h-[70vh] py-10 px-4 max-w-4xl mx-auto space-y-6 relative z-10">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-ink transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Print Studio</span>
        </Link>
        <span className="text-xs font-mono font-bold text-violet bg-violet/10 px-2 py-0.5 rounded">
          Public Secure Tracking
        </span>
      </div>

      <div className="rounded-3xl border border-border bg-white p-6 sm:p-8 shadow-xs space-y-6">
        {/* Header Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
          <div className="flex items-center gap-3.5">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-violet text-white shadow-xs">
              <Truck className="size-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-xl font-black text-ink">
                  {shipment.carrier?.name || "Express Courier"}
                </h1>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono border ${copy.badgeClass}`}>
                  {copy.label}
                </span>
              </div>
              <div className="text-xs text-muted-foreground font-mono mt-0.5">
                Waybill (AWB): <span className="font-bold text-ink">{shipment.awb_number}</span>
              </div>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-muted-foreground text-[0.6875rem] font-bold uppercase font-mono block">
              Estimated Delivery
            </span>
            <span className="font-display font-black text-ink text-base">
              {shipment.estimated_delivery_at
                ? new Date(shipment.estimated_delivery_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "2–4 Business Days"}
            </span>
          </div>
        </div>

        {/* Destination Details Masked */}
        <div className="p-4 rounded-2xl bg-paper/50 border border-border flex items-center justify-between text-xs">
          <div>
            <span className="text-muted-foreground text-[0.6875rem] font-mono block font-bold uppercase">
              Destination City
            </span>
            <span className="font-bold text-ink">
              {dest.city || "Dehradun"}, {dest.state || "Uttarakhand"} - {dest.postal_code || "248007"}
            </span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground font-mono text-[0.6875rem]">
            <ShieldCheck className="size-3.5 text-emerald-600" />
            <span>Recipient PII Masked</span>
          </div>
        </div>

        {/* Chronological Event History */}
        <div className="space-y-4 pt-2">
          <h3 className="font-display text-sm font-bold text-ink">Tracking Milestones & Courier Scans</h3>

          <div className="relative border-l-2 border-border ml-3 pl-5 space-y-6 text-xs">
            {shipment.tracking_events && shipment.tracking_events.length > 0 ? (
              shipment.tracking_events.map((evt, idx) => {
                const isLatest = idx === shipment.tracking_events!.length - 1;
                return (
                  <div key={evt.id} className="relative space-y-1">
                    <div
                      className={`absolute -left-[1.625rem] top-0.5 size-3 rounded-full ring-4 ring-white ${
                        isLatest ? "bg-violet animate-pulse" : "bg-muted-foreground/40"
                      }`}
                    />
                    <div className="flex items-center justify-between">
                      <span className={`font-bold ${isLatest ? "text-violet font-display text-sm" : "text-ink"}`}>
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
                        <MapPin className="size-3 text-violet" />
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
                Consignment manifested. Initial pickup scan will reflect upon courier collection.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
