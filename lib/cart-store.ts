"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Cart, CartLine, AppliedDiscount } from "@/lib/commerce/types";
import { cartFromLines, makeLineId } from "@/lib/pricing";

interface CartStoreState {
  lines: CartLine[];
  discount: AppliedDiscount | null;
  fulfilment: "ship" | "pickup";
  pincode: string | null;
  gstMode?: "inclusive" | "exclusive";
  gstRate?: number;

  // Actions
  addLine: (line: Omit<CartLine, "id" | "linePrice">) => void;
  updateLineConfig: (oldLineId: string, updatedLine: Omit<CartLine, "id" | "linePrice">) => void;
  removeLine: (lineId: string) => void;
  updateLineQuantity: (lineId: string, quantity: number) => void;
  setFulfilment: (fulfilment: "ship" | "pickup") => void;
  setPincode: (pincode: string | null) => void;
  applyDiscount: (discount: AppliedDiscount | null) => void;
  setGstPolicy: (mode: "inclusive" | "exclusive", ratePercent?: number) => void;
  clearCart: () => void;

  // Selectors
  getCart: () => Cart;
  getLine: (lineId: string) => CartLine | undefined;
  getTotalItemsCount: () => number;
}

export const useCartStore = create<CartStoreState>()(
  persist(
    (set, get) => ({
      lines: [],
      discount: null,
      fulfilment: "ship",
      pincode: null,

      addLine: (rawLine) => {
        set((state) => {
          // Generate deterministic key to distinguish different option configurations
          const stableId = makeLineId({
            productId: rawLine.productId,
            variantId: rawLine.variantId,
            tierQty: rawLine.tierQty,
            configHash: rawLine.configHash || (rawLine.selectedOptions ? JSON.stringify(rawLine.selectedOptions) : "nc"),
            designHash: rawLine.design ? rawLine.design.summary : "nd",
            addOnIds: rawLine.addOns.map((a) => a.id),
          });

          // Compute total line price
          const linePrice = {
            amount: rawLine.unitPrice.amount * rawLine.quantity,
            currencyCode: rawLine.unitPrice.currencyCode,
          };

          const newLine: CartLine = {
            ...rawLine,
            id: stableId,
            linePrice,
          };

          // Check if an EXACT identical configuration already exists in the cart
          const existingIndex = state.lines.findIndex((l) => l.id === stableId);

          let updatedLines: CartLine[];
          if (existingIndex > -1) {
            // Update quantity of the matching line
            const existing = state.lines[existingIndex];
            const newQty = existing.quantity + rawLine.quantity;
            const updatedLine: CartLine = {
              ...existing,
              quantity: newQty,
              linePrice: {
                amount: existing.unitPrice.amount * newQty,
                currencyCode: existing.unitPrice.currencyCode,
              },
            };
            updatedLines = [...state.lines];
            updatedLines[existingIndex] = updatedLine;
          } else {
            // Add as a distinct new line item
            updatedLines = [newLine, ...state.lines];
          }

          return { lines: updatedLines };
        });
      },

      updateLineConfig: (oldLineId, updatedLine) => {
        set((state) => {
          const stableId = makeLineId({
            productId: updatedLine.productId,
            variantId: updatedLine.variantId,
            tierQty: updatedLine.tierQty,
            configHash: updatedLine.configHash || (updatedLine.selectedOptions ? JSON.stringify(updatedLine.selectedOptions) : "nc"),
            designHash: updatedLine.design ? updatedLine.design.summary : "nd",
            addOnIds: updatedLine.addOns.map((a) => a.id),
          });

          const linePrice = {
            amount: updatedLine.unitPrice.amount * updatedLine.quantity,
            currencyCode: updatedLine.unitPrice.currencyCode,
          };

          const newLine: CartLine = {
            ...updatedLine,
            id: stableId,
            linePrice,
          };

          // Replace old line with newly reconfigured line
          const filtered = state.lines.filter((l) => l.id !== oldLineId);
          return { lines: [newLine, ...filtered] };
        });
      },

      removeLine: (lineId: string) => {
        set((state) => ({
          lines: state.lines.filter((l) => l.id !== lineId),
        }));
      },

      updateLineQuantity: (lineId: string, quantity: number) => {
        set((state) => {
          if (quantity <= 0) {
            return { lines: state.lines.filter((l) => l.id !== lineId) };
          }

          const updatedLines = state.lines.map((line) => {
            if (line.id === lineId) {
              return {
                ...line,
                quantity,
                linePrice: {
                  amount: line.unitPrice.amount * quantity,
                  currencyCode: line.unitPrice.currencyCode,
                },
              };
            }
            return line;
          });

          return { lines: updatedLines };
        });
      },

      setFulfilment: (fulfilment) => set({ fulfilment }),
      setPincode: (pincode) => set({ pincode }),
      applyDiscount: (discount) => set({ discount }),
      setGstPolicy: (gstMode, ratePercent) =>
        set({
          gstMode,
          ...(ratePercent !== undefined ? { gstRate: ratePercent / 100 } : {}),
        }),
      clearCart: () => set({ lines: [], discount: null }),

      getCart: () => {
        const state = get();
        return cartFromLines(state.lines, {
          discount: state.discount,
          fulfilment: state.fulfilment,
          pincode: state.pincode,
          gstMode: state.gstMode,
          gstRate: state.gstRate,
        });
      },

      getLine: (lineId: string) => {
        const state = get();
        return state.lines.find((l) => l.id === lineId);
      },

      getTotalItemsCount: () => {
        const state = get();
        return state.lines.reduce((total, line) => total + line.quantity, 0);
      },
    }),
    {
      name: "printo-cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
