"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartLine, CartCost } from "@/lib/commerce/types";

export type PrintOrderStatus =
  | "ORDER_PLACED"
  | "PAYMENT_CONFIRMED"
  | "ARTWORK_REVIEW"
  | "ARTWORK_APPROVED"
  | "PRE_PRESS"
  | "IN_PRODUCTION"
  | "QUALITY_CHECK"
  | "PACKED"
  | "DISPATCHED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "PAYMENT_FAILED"
  | "ARTWORK_CORRECTION_REQUIRED"
  | "CANCELLED";

export type PaymentMethod = "UPI" | "CARD" | "NET_BANKING" | "WALLET" | "TEST_GATEWAY";
export type PaymentStatus = "PAID" | "PENDING" | "FAILED";

export interface OrderCustomer {
  fullName: string;
  companyName?: string;
  email: string;
  phone: string;
}

export interface OrderDelivery {
  addressLine1: string;
  city: string;
  state: string;
  pincode: string;
  notes?: string;
}

export interface OrderTimelineStep {
  status: PrintOrderStatus;
  title: string;
  description: string;
  timestamp: string;
  completed: boolean;
  current: boolean;
}

export interface PrintOrder {
  id: string;
  invoiceNumber: string;
  createdAt: string;
  status: PrintOrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  paymentRef: string;
  customer: OrderCustomer;
  delivery: OrderDelivery;
  lines: CartLine[];
  cost: CartCost;
  estimatedDispatch: string;
  estimatedDelivery: string;
  timeline: OrderTimelineStep[];
  prePressNotes?: string;
  canCancel: boolean;
}

interface OrderStoreState {
  currentDraftCheckout: {
    customer: OrderCustomer;
    delivery: OrderDelivery;
  } | null;

  // Actions
  setDraftCheckout: (customer: OrderCustomer, delivery: OrderDelivery) => void;
  clearDraftCheckout: () => void;
  clearAllLocalState: () => void;
}

export const useOrderStore = create<OrderStoreState>()(
  persist(
    (set) => ({
      currentDraftCheckout: null,

      setDraftCheckout: (customer, delivery) => {
        set({ currentDraftCheckout: { customer, delivery } });
      },

      clearDraftCheckout: () => {
        set({ currentDraftCheckout: null });
      },

      clearAllLocalState: () => {
        set({ currentDraftCheckout: null });
        if (typeof window !== "undefined") {
          try {
            localStorage.removeItem("printo-orders-storage");
            localStorage.removeItem("printo-cart-storage");
          } catch {
            // Ignore
          }
        }
      },
    }),
    {
      name: "printo-orders-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
