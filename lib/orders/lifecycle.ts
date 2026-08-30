import { OrderStatus } from "@/lib/supabase/database.types";

/**
 * Authoritative Order Status Transition Rules & Metadata
 */
export interface StatusMetadata {
  label: string;
  badgeClass: string;
  eventTitle: string;
  eventDescription: string;
  allowedRoles: Array<"admin" | "customer">;
}

export const ORDER_STATUS_METADATA: Record<OrderStatus, StatusMetadata> = {
  pending: {
    label: "Pending",
    badgeClass: "bg-amber-100 text-amber-800",
    eventTitle: "Order Received",
    eventDescription: "Order and printing specifications registered in system queue.",
    allowedRoles: ["admin"],
  },
  confirmed: {
    label: "Confirmed",
    badgeClass: "bg-blue-100 text-blue-800",
    eventTitle: "Payment Verified",
    eventDescription: "Transaction verified and order scheduled for pre-press audit.",
    allowedRoles: ["admin"],
  },
  artwork_review: {
    label: "Artwork Review",
    badgeClass: "bg-violet-100 text-violet-800",
    eventTitle: "Pre-Press & Artwork Review",
    eventDescription: "Studio technician verifying 300 DPI resolution, 3mm bleed margins, and CMYK color gamut.",
    allowedRoles: ["admin"],
  },
  proof_pending: {
    label: "Proof Pending",
    badgeClass: "bg-purple-100 text-purple-800",
    eventTitle: "Digital Proof Dispatched",
    eventDescription: "Digital proof generated and awaiting customer approval.",
    allowedRoles: ["admin"],
  },
  proof_approved: {
    label: "Proof Approved",
    badgeClass: "bg-emerald-100 text-emerald-800",
    eventTitle: "Proof Approved",
    eventDescription: "Customer approved pre-press digital proof for plate imaging and press scheduling.",
    allowedRoles: ["admin", "customer"],
  },
  in_production: {
    label: "In Production",
    badgeClass: "bg-indigo-100 text-indigo-800",
    eventTitle: "Press Printing & Finishing",
    eventDescription: "Offset / Digital press run, substrate coating, and die-cutting in progress.",
    allowedRoles: ["admin"],
  },
  quality_check: {
    label: "Quality Check",
    badgeClass: "bg-cyan-100 text-cyan-800",
    eventTitle: "Studio Quality Inspection",
    eventDescription: "Quality check for color fidelity, sheet count, and structural trim accuracy.",
    allowedRoles: ["admin"],
  },
  ready: {
    label: "Ready for Dispatch",
    badgeClass: "bg-teal-100 text-teal-800",
    eventTitle: "Packed & Labelled",
    eventDescription: "Order packed in protective moisture-resistant shipping carton.",
    allowedRoles: ["admin"],
  },
  shipped: {
    label: "Shipped",
    badgeClass: "bg-blue-100 text-blue-800",
    eventTitle: "Handed to Logistics Partner",
    eventDescription: "Order dispatched and tracking docket generated.",
    allowedRoles: ["admin"],
  },
  out_for_delivery: {
    label: "Out for Delivery",
    badgeClass: "bg-amber-100 text-amber-800",
    eventTitle: "Out for Local Delivery",
    eventDescription: "Courier partner has dispatched order for final doorstep delivery.",
    allowedRoles: ["admin"],
  },
  delivered: {
    label: "Delivered",
    badgeClass: "bg-emerald-100 text-emerald-800",
    eventTitle: "Successfully Delivered",
    eventDescription: "Consignment handed over to recipient. Print order completed.",
    allowedRoles: ["admin"],
  },
  cancelled: {
    label: "Cancelled",
    badgeClass: "bg-red-100 text-red-700",
    eventTitle: "Order Cancelled",
    eventDescription: "Order cancelled prior to plate exposure and press run.",
    allowedRoles: ["admin", "customer"],
  },
};

/**
 * Centralized State Machine: Defines strictly allowed transitions from each state
 */
export const ALLOWED_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ["confirmed", "artwork_review", "cancelled"],
  confirmed: ["artwork_review", "cancelled"],
  artwork_review: ["proof_pending", "proof_approved", "in_production", "cancelled"],
  proof_pending: ["proof_approved", "artwork_review", "cancelled"],
  proof_approved: ["in_production"],
  in_production: ["quality_check"],
  quality_check: ["ready", "in_production"],
  ready: ["shipped"],
  shipped: ["out_for_delivery", "delivered"],
  out_for_delivery: ["delivered"],
  delivered: [],
  cancelled: [],
};

/**
 * Check if a status can be cancelled
 */
export function canCancelOrderStatus(status: OrderStatus): boolean {
  return status === "pending" || status === "confirmed" || status === "artwork_review" || status === "proof_pending";
}

/**
 * Validate if a transition from currentStatus to targetStatus is permitted
 */
export function isValidStatusTransition(
  currentStatus: OrderStatus,
  targetStatus: OrderStatus
): boolean {
  const allowed = ALLOWED_STATUS_TRANSITIONS[currentStatus];
  return Boolean(allowed && allowed.includes(targetStatus));
}
