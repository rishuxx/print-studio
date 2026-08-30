import { OrderStatus, PaymentStatus } from "@/lib/supabase/database.types";
import { ORDER_STATUS_METADATA } from "@/lib/orders/lifecycle";

/**
 * Status Categories for Operational Command:
 * Active Orders: All states except 'delivered' and 'cancelled'.
 * Completed Orders: 'delivered'.
 * Action Needed: 'artwork_review', 'proof_pending', 'pending'.
 * Payment Issues: Orders where payment_status in ('failed', 'pending') but order is not cancelled.
 */

export const ACTIVE_ORDER_STATUSES: OrderStatus[] = [
  "pending",
  "confirmed",
  "artwork_review",
  "proof_pending",
  "proof_approved",
  "in_production",
  "quality_check",
  "ready",
  "shipped",
  "out_for_delivery",
];

export const COMPLETED_ORDER_STATUSES: OrderStatus[] = ["delivered"];

export const REVENUE_ELIGIBLE_PAYMENT_STATUSES: PaymentStatus[] = ["paid", "authorized"];

export function isOrderRevenueEligible(order: {
  payment_status: PaymentStatus;
  status: OrderStatus;
}): boolean {
  // Revenue is recognized for paid/authorized orders that are not cancelled
  return (
    REVENUE_ELIGIBLE_PAYMENT_STATUSES.includes(order.payment_status) &&
    order.status !== "cancelled"
  );
}

export function getOrderStatusBadge(status: OrderStatus) {
  return ORDER_STATUS_METADATA[status] || {
    label: status,
    badgeClass: "bg-paper text-ink border-border",
    eventTitle: status,
    eventDescription: "",
    allowedRoles: ["admin"],
  };
}
