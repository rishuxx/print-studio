import type { CanonicalShipmentStatus } from "./types";

/**
 * Maps canonical shipping status to clean, non-technical customer copy
 */
export function getCustomerStatusCopy(status: CanonicalShipmentStatus): {
  label: string;
  description: string;
  badgeClass: string;
} {
  switch (status) {
    case "created":
      return {
        label: "Preparing Shipment",
        description: "Your customized print package is packed and awaiting courier manifest.",
        badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
      };
    case "label_generated":
    case "manifested":
      return {
        label: "Waybill Generated",
        description: "Courier tracking waybill allocated. Awaiting courier pickup scan.",
        badgeClass: "bg-indigo-50 text-indigo-700 border-indigo-200",
      };
    case "ready_for_pickup":
    case "picked_up":
      return {
        label: "Picked Up",
        description: "Courier has collected your parcel from our production facility.",
        badgeClass: "bg-violet/10 text-violet border-violet/20",
      };
    case "in_transit":
    case "arrived_at_hub":
      return {
        label: "In Transit",
        description: "Package is moving through courier network hubs towards your city.",
        badgeClass: "bg-amber-50 text-amber-800 border-amber-200",
      };
    case "out_for_delivery":
      return {
        label: "Out for Delivery",
        description: "Delivery executive is on the way to your destination address today.",
        badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-300 animate-pulse",
      };
    case "delivery_attempted":
      return {
        label: "Delivery Attempted",
        description: "Courier attempted delivery. A re-attempt will be scheduled shortly.",
        badgeClass: "bg-orange-50 text-orange-800 border-orange-200",
      };
    case "delivered":
      return {
        label: "Delivered",
        description: "Parcel successfully delivered to your recipient address.",
        badgeClass: "bg-emerald-100 text-emerald-900 border-emerald-300 font-bold",
      };
    case "ndr":
      return {
        label: "Action Required",
        description: "Delivery delayed due to recipient unavailability or address clarification.",
        badgeClass: "bg-rose-50 text-rose-800 border-rose-200 font-bold",
      };
    case "rto_initiated":
    case "rto_in_transit":
      return {
        label: "Return in Transit",
        description: "Package is returning to our central warehouse.",
        badgeClass: "bg-purple-50 text-purple-800 border-purple-200",
      };
    case "rto_delivered":
      return {
        label: "Returned to Origin",
        description: "Package returned to our printing hub.",
        badgeClass: "bg-slate-100 text-slate-800 border-slate-300",
      };
    case "cancelled":
      return {
        label: "Shipment Cancelled",
        description: "This consignment was cancelled prior to dispatch.",
        badgeClass: "bg-slate-100 text-slate-600 border-slate-200",
      };
    case "lost":
    case "damaged":
    case "exception":
      return {
        label: "Delivery Exception",
        description: "We are actively coordinating with courier management to resolve a transit delay.",
        badgeClass: "bg-rose-100 text-rose-900 border-rose-300",
      };
    default:
      return {
        label: "Active Shipment",
        description: "Tracking information is being updated by the logistics provider.",
        badgeClass: "bg-paper text-muted-foreground border-border",
      };
  }
}
