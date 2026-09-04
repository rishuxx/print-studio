"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/cart-store";
import { formatMoney } from "@/lib/pricing";
import { siteConfig } from "@/lib/site-config";
import { ProductMockup } from "@/components/shared/product-mockup";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Truck,
  FileCheck,
  Edit2,
} from "lucide-react";
import { toast } from "sonner";

export default function CartPage() {
  const router = useRouter();
  const isHydrated = useSyncExternalStoreHydration();

  const lines = useCartStore((state) => state.lines);
  const removeLine = useCartStore((state) => state.removeLine);
  const updateLineQuantity = useCartStore((state) => state.updateLineQuantity);
  const getCart = useCartStore((state) => state.getCart);
  const clearCart = useCartStore((state) => state.clearCart);

  if (!isHydrated) {
    return (
      <div className="shell py-12 text-center text-xs text-muted-foreground">
        Loading cart configuration...
      </div>
    );
  }

  const cart = getCart();

  return (
    <div className="shell py-8 space-y-8 max-w-6xl mx-auto">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: `Shopping Cart (${lines.length})` },
        ]}
      />

      <div className="space-y-2 text-center sm:text-left">
        <h1 className="font-display text-3xl font-extrabold text-ink sm:text-4xl">
          Your Printing Cart
        </h1>
        <p className="text-xs text-muted-foreground sm:text-sm">
          Review your configured print specifications, quantities, and pre-press attachments.
        </p>
      </div>

      {lines.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-white p-12 text-center space-y-4">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-paper text-muted-foreground">
            <ShoppingBag className="size-6 text-violet" />
          </div>
          <div className="space-y-1">
            <h2 className="font-display text-lg font-bold text-ink">Your cart is currently empty</h2>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Explore our customized printing catalogue — visiting cards, apparel, packaging, gifts, and signage.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-xl bg-violet px-6 py-3 text-xs font-bold text-white shadow-lift hover:bg-violet-lift transition-all"
          >
            <span>Explore All Products</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* ── Left Column: Configured Cart Items List ───────────────── */}
          <div className="lg:col-span-8 space-y-4">
            {lines.map((line) => (
              <div
                key={line.id}
                className="rounded-2xl border border-border bg-white p-5 sm:p-6 shadow-sm space-y-4 transition-all"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-4">
                  <div className="flex items-center gap-4">
                    {/* Visual mockup thumbnail */}
                    <div className="size-16 rounded-xl border border-border bg-paper shrink-0 flex items-center justify-center overflow-hidden">
                      {line.image?.url && !line.image.url.includes("placeholder-product.png") ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={line.image.url}
                          alt={line.productTitle}
                          className="size-full object-cover"
                        />
                      ) : (
                        <div className="p-2 size-full flex items-center justify-center">
                          <ProductMockup
                            kind={line.image?.kind ?? "card"}
                            tone="transparent"
                            className="h-full w-full"
                          />
                        </div>
                      )}
                    </div>
                    <div>
                      <Link
                        href={`/product/${line.productHandle}`}
                        className="font-bold text-sm text-ink hover:text-violet transition-colors"
                      >
                        {line.productTitle}
                      </Link>
                      <div className="text-xs text-muted-foreground font-mono mt-0.5">
                        {line.tierQty
                          ? `${line.tierQty} ${line.priceUnit?.replace(/^per\s+/i, "") || "units"} / batch`
                          : line.priceUnit}
                      </div>
                    </div>
                  </div>

                  {/* Line Total Price */}
                  <div className="text-right sm:self-center">
                    <span className="font-display text-lg font-extrabold text-ink">
                      {formatMoney(line.linePrice)}
                    </span>
                    {line.quantity > 1 ? (
                      <div className="text-[0.6875rem] text-muted-foreground font-mono">
                        ({formatMoney(line.unitPrice)} each)
                      </div>
                    ) : line.tierQty && line.tierQty > 1 ? (
                      <div className="text-[0.6875rem] text-muted-foreground font-mono">
                        (₹{(line.unitPrice.amount / (line.tierQty * 100)).toFixed(2)} / unit)
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* Selected Specifications & Artwork Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="rounded-xl border border-border/80 bg-paper p-3 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-ink text-[0.6875rem] uppercase font-mono">
                        Custom Options
                      </span>
                      <Link
                        href={`/product/${line.productHandle}?editLine=${encodeURIComponent(line.id)}`}
                        className="inline-flex items-center gap-1 text-[0.6875rem] font-semibold text-violet hover:underline"
                      >
                        <Edit2 className="size-3" />
                        <span>Edit Config</span>
                      </Link>
                    </div>
                    <div className="space-y-1">
                      {line.selectedOptions.map((opt, idx) => (
                        <div key={`${opt.name}-${opt.value}-${idx}`} className="flex justify-between text-muted-foreground">
                          <span>{opt.name}:</span>
                          <span className="font-semibold text-ink">{opt.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-border/80 bg-paper p-3 space-y-1.5">
                    <span className="font-bold text-ink text-[0.6875rem] uppercase font-mono block">
                      Artwork / Pre-Press
                    </span>
                    <div className="flex items-start gap-2 text-muted-foreground">
                      <FileCheck className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="font-medium text-ink truncate">
                        {line.design?.summary || "Ready for Digital Proof"}
                      </span>
                    </div>
                    {line.addOns.length > 0 && (
                      <div className="text-[0.6875rem] text-violet font-semibold pt-1">
                        + {line.addOns.map((a) => a.title).join(", ")} ({formatMoney(line.addOns[0].price)})
                      </div>
                    )}
                  </div>
                </div>

                {/* Quantity Controls & Actions */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground font-medium">Quantity:</span>
                    <div className="inline-flex items-center rounded-lg border border-border bg-paper p-1">
                      <button
                        type="button"
                        onClick={() => updateLineQuantity(line.id, line.quantity - 1)}
                        className="size-6 flex items-center justify-center rounded text-ink hover:bg-white transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="size-3" />
                      </button>
                      <span className="w-8 text-center font-mono font-bold text-ink">
                        {line.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateLineQuantity(line.id, line.quantity + 1)}
                        className="size-6 flex items-center justify-center rounded text-ink hover:bg-white transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="size-3" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Link
                      href={`/product/${line.productHandle}?editLine=${encodeURIComponent(line.id)}`}
                      className="inline-flex items-center gap-1 text-muted-foreground hover:text-violet transition-colors"
                    >
                      <Edit2 className="size-3.5" />
                      <span>Edit</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        removeLine(line.id);
                        toast.info("Item removed from cart");
                      }}
                      className="inline-flex items-center gap-1 text-muted-foreground hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="size-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-between items-center pt-2">
              <Link
                href="/products"
                className="text-xs font-semibold text-violet hover:underline"
              >
                &larr; Continue Shopping
              </Link>
              <button
                type="button"
                onClick={() => {
                  clearCart();
                  toast.info("Cart cleared");
                }}
                className="text-xs text-muted-foreground hover:text-red-500 transition-colors"
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* ── Right Column: Order Summary & Checkout CTA ─────────────── */}
          <div className="lg:col-span-4 space-y-4">
            <div className="rounded-2xl border border-border bg-paper p-6 space-y-5 text-xs shadow-sm">
              <h2 className="font-display text-base font-bold text-ink border-b border-border pb-3">
                Order Summary
              </h2>

              <div className="space-y-2.5">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal ({cart.totalQuantity} items)</span>
                  <span className="font-mono font-semibold text-ink">{formatMoney(cart.cost.subtotal)}</span>
                </div>

                {cart.cost.discount.amount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Promotional Discount:</span>
                    <span className="font-mono">-{formatMoney(cart.cost.discount)}</span>
                  </div>
                )}

                {(useCartStore.getState().gstMode || siteConfig.pricingPolicy.gstMode) === "exclusive" && cart.cost.tax.amount > 0 && (
                  <div className="flex justify-between text-muted-foreground">
                    <span>Estimated GST ({Math.round((useCartStore.getState().gstRate || siteConfig.pricingPolicy.gstRate) * 100)}%):</span>
                    <span className="font-mono font-semibold text-ink">{formatMoney(cart.cost.tax)}</span>
                  </div>
                )}

                <div className="flex justify-between text-muted-foreground">
                  <span>Standard Dispatch / Shipping</span>
                  <span className="font-mono font-semibold text-emerald-600">
                    {cart.cost.shipping.amount === 0 ? "FREE" : formatMoney(cart.cost.shipping)}
                  </span>
                </div>

                <div className="border-t border-border pt-3 flex justify-between items-baseline">
                  <span className="font-bold text-sm text-ink">Estimated Total</span>
                  <span className="font-display text-2xl font-extrabold text-ink">
                    {formatMoney(cart.cost.total)}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    router.push("/checkout");
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-violet py-3.5 px-5 text-xs font-bold text-white shadow-lift hover:bg-violet-lift transition-all"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="size-4" />
                </button>
              </div>

              <div className="space-y-2 pt-3 border-t border-border text-[0.6875rem] text-muted-foreground">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-3.5 text-violet shrink-0" />
                  <span>Digital artwork proof provided before press run</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="size-3.5 text-emerald-600 shrink-0" />
                  <span>Standard 2–4 working days production dispatch</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function useSyncExternalStoreHydration() {
  return React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}
