"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/cart-store";
import { useOrderStore, type PaymentMethod } from "@/lib/order-store";
import { formatMoney } from "@/lib/pricing";
import { siteConfig } from "@/lib/site-config";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { ProductMockup } from "@/components/shared/product-mockup";
import {
  CreditCard,
  QrCode,
  Building2,
  Wallet,
  ShieldCheck,
  Lock,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

export default function PaymentPage() {
  const router = useRouter();
  const isHydrated = useSyncExternalStoreHydration();

  const lines = useCartStore((state) => state.lines);
  const discount = useCartStore((state) => state.discount);
  const getCart = useCartStore((state) => state.getCart);
  const clearCart = useCartStore((state) => state.clearCart);

  const draftCheckout = useOrderStore((state) => state.currentDraftCheckout);

  const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethod>("UPI");
  const [isProcessing, setIsProcessing] = React.useState(false);

  if (!isHydrated) {
    return (
      <div className="shell py-12 text-center text-xs text-muted-foreground">
        Loading payment verification...
      </div>
    );
  }

  // If no draft checkout exists or cart is empty, redirect back to checkout
  if (!draftCheckout || lines.length === 0) {
    return (
      <div className="shell py-12 max-w-xl mx-auto text-center space-y-4">
        <h1 className="font-display text-2xl font-bold text-ink">Checkout Context Missing</h1>
        <p className="text-xs text-muted-foreground">
          Your cart is empty or checkout session has expired. Please configure products to proceed.
        </p>
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 rounded-xl bg-violet px-6 py-2.5 text-xs font-bold text-white shadow-lift hover:bg-violet-lift transition-all"
        >
          <span>Return to Cart</span>
          <ArrowRight className="size-4" />
        </Link>
      </div>
    );
  }

  const cart = getCart();

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    const toastId = toast.loading("Initializing secure Razorpay payment gateway...");

    try {
      // 1. Create Razorpay order and business order via Server Endpoint
      const createRes = await fetch("/api/payments/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          draftCheckout,
          lines,
          discount: discount ? { percent: discount.percent, code: discount.code } : null,
          clientTotalPaise: cart.cost.total.amount,
        }),
      });

      const createData = await createRes.json();

      if (!createRes.ok || !createData.success) {
        setIsProcessing(false);
        toast.error("Payment initialization failed", {
          id: toastId,
          description: createData.error || "Unable to contact payment provider.",
        });
        return;
      }

      const { razorpayKeyId, razorpayOrderId, internalOrderId, orderNumber, amount } = createData;

      // 2. Load Razorpay Standard Checkout SDK if not present
      const loadRazorpayScript = (): Promise<boolean> => {
        return new Promise((resolve) => {
          if (typeof window !== "undefined" && "Razorpay" in window) {
            resolve(true);
            return;
          }
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);
          document.body.appendChild(script);
        });
      };

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setIsProcessing(false);
        toast.error("Gateway load error", {
          id: toastId,
          description: "Razorpay Checkout script failed to load. Please check your connection.",
        });
        return;
      }

      toast.dismiss(toastId);

      // 3. Configure Razorpay Standard Checkout Options
      interface RazorpayCheckoutOptions {
        key: string;
        amount: number;
        currency: string;
        name: string;
        description: string;
        order_id: string;
        prefill: {
          name: string;
          email: string;
          contact: string;
        };
        theme: {
          color: string;
          backdrop_color: string;
        };
        config?: {
          display?: {
            language?: string;
            blocks?: Record<string, unknown>;
            sequence?: string[];
            preferences?: {
              show_default_blocks?: boolean;
            };
          };
        };
        modal: {
          ondismiss: () => void;
          backdropclose?: boolean;
          escape?: boolean;
        };
        handler: (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => Promise<void>;
      }

      const options: RazorpayCheckoutOptions = {
        key: razorpayKeyId,
        amount: amount,
        currency: "INR",
        name: "Print Studio",
        description: `Custom Print Order #${orderNumber}`,
        order_id: razorpayOrderId,
        prefill: {
          name: draftCheckout.customer.fullName,
          email: draftCheckout.customer.email,
          contact: draftCheckout.customer.phone,
        },
        theme: {
          color: "#4f46e5", // Violet theme
          backdrop_color: "rgba(15, 23, 42, 0.6)",
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            toast.info("Payment cancelled. Your order has not been charged.");
          },
          backdropclose: false,
          escape: true,
        },
        handler: async (response) => {
          const verifyToast = toast.loading("Verifying payment security signature...");

          try {
            // 4. Server-Side Signature Verification
            const verifyRes = await fetch("/api/payments/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                internalOrderId,
                orderNumber,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();

            if (!verifyRes.ok || !verifyData.success) {
              setIsProcessing(false);
              toast.error("Payment Verification Failed", {
                id: verifyToast,
                description: verifyData.error || "Signature verification failed.",
              });
              return;
            }

            // 5. Success: Clear cart & navigate to order confirmation
            clearCart();
            toast.success("Payment Received & Order Confirmed!", {
              id: verifyToast,
              description: `Order #${orderNumber}`,
            });

            router.push(`/order-confirmed?orderId=${encodeURIComponent(orderNumber)}`);
          } catch (err: unknown) {
            setIsProcessing(false);
            const msg = err instanceof Error ? err.message : "Verification error.";
            toast.error("Verification communication error", {
              id: verifyToast,
              description: msg,
            });
          }
        },
      };

      const RazorpayConstructor = (window as unknown as { Razorpay: new (opts: RazorpayCheckoutOptions) => { on: (event: string, cb: (res: { error?: { description?: string } }) => void) => void; open: () => void } }).Razorpay;
      const razorpayInstance = new RazorpayConstructor(options);
      razorpayInstance.on("payment.failed", (response) => {
        setIsProcessing(false);
        toast.error("Payment Declined", {
          description: response.error?.description || "Transaction failed at bank/gateway.",
        });
      });

      razorpayInstance.open();
    } catch (err: unknown) {
      setIsProcessing(false);
      const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
      toast.error("Payment Gateway Error", {
        id: toastId,
        description: msg,
      });
    }
  };

  return (
    <div className="shell py-8 space-y-8 max-w-6xl mx-auto">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Cart", href: "/cart" },
          { label: "Checkout", href: "/checkout" },
          { label: "Payment Verification" },
        ]}
      />

      <div className="space-y-2 text-center sm:text-left">
        <h1 className="font-display text-3xl font-extrabold text-ink sm:text-4xl">
          Complete Payment & Confirm Order
        </h1>
        <p className="text-xs text-muted-foreground sm:text-sm">
          Select your preferred payment method. Pre-press digital proofing starts immediately upon confirmation.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* ── Left Column: Payment Options ───────────────────────────── */}
        <div className="lg:col-span-7 space-y-6">
          {/* Payment Method Selector */}
          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm space-y-5 text-xs">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="font-bold text-sm text-ink uppercase font-mono tracking-wider">
                Select Payment Mode
              </h2>
              <span className="flex items-center gap-1 text-[0.6875rem] text-emerald-600 font-semibold font-mono">
                <ShieldCheck className="size-3.5" />
                <span>256-Bit Encrypted</span>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod("UPI")}
                className={`flex flex-col items-center justify-center rounded-xl border p-3.5 text-center transition-all ${
                  paymentMethod === "UPI"
                    ? "border-violet bg-violet/5 font-bold text-violet ring-1 ring-violet shadow-sm"
                    : "border-border bg-white text-ink hover:bg-paper"
                }`}
              >
                <QrCode className="size-5 mb-1.5 text-violet" />
                <span>UPI / QR</span>
                <span className="text-[0.625rem] text-muted-foreground font-normal">GPay, PhonePe</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("CARD")}
                className={`flex flex-col items-center justify-center rounded-xl border p-3.5 text-center transition-all ${
                  paymentMethod === "CARD"
                    ? "border-violet bg-violet/5 font-bold text-violet ring-1 ring-violet shadow-sm"
                    : "border-border bg-white text-ink hover:bg-paper"
                }`}
              >
                <CreditCard className="size-5 mb-1.5 text-violet" />
                <span>Cards</span>
                <span className="text-[0.625rem] text-muted-foreground font-normal">Credit & Debit</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("NET_BANKING")}
                className={`flex flex-col items-center justify-center rounded-xl border p-3.5 text-center transition-all ${
                  paymentMethod === "NET_BANKING"
                    ? "border-violet bg-violet/5 font-bold text-violet ring-1 ring-violet shadow-sm"
                    : "border-border bg-white text-ink hover:bg-paper"
                }`}
              >
                <Building2 className="size-5 mb-1.5 text-violet" />
                <span>Net Banking</span>
                <span className="text-[0.625rem] text-muted-foreground font-normal">All Major Banks</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("WALLET")}
                className={`flex flex-col items-center justify-center rounded-xl border p-3.5 text-center transition-all ${
                  paymentMethod === "WALLET"
                    ? "border-violet bg-violet/5 font-bold text-violet ring-1 ring-violet shadow-sm"
                    : "border-border bg-white text-ink hover:bg-paper"
                }`}
              >
                <Wallet className="size-5 mb-1.5 text-violet" />
                <span>Wallets</span>
                <span className="text-[0.625rem] text-muted-foreground font-normal">Paytm, Mobikwik</span>
              </button>
            </div>

            {/* Razorpay Gateway Channel Summary */}
            <div className="rounded-xl border border-border/80 bg-paper p-4 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-ink">
                <span>Selected Gateway: Razorpay Standard Web Checkout</span>
                <span className="text-violet font-mono">100% PCI-DSS Compliant</span>
              </div>
              <p className="text-[0.6875rem] text-muted-foreground leading-relaxed">
                Clicking the confirmation button below launches the official Razorpay Checkout modal where you can complete payment via UPI apps (GPay, PhonePe, Paytm), credit/debit cards, NetBanking across all Indian banks, or EMI.
              </p>
            </div>
          </div>
        </div>

        {/* ── Right Column: Final Order & Destination Summary ────────── */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-border bg-paper p-6 space-y-5 text-xs shadow-sm">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="font-display text-base font-bold text-ink">
                Final Order Summary
              </h2>
              <span className="font-mono text-xs text-violet font-semibold">
                {cart.totalQuantity} items
              </span>
            </div>

            {/* Customer & Address Preview */}
            <div className="rounded-xl border border-border/80 bg-white p-3.5 space-y-1 text-muted-foreground">
              <div className="font-bold text-ink">{draftCheckout.customer.fullName}</div>
              <div>{draftCheckout.customer.phone} · {draftCheckout.customer.email}</div>
              <div className="text-[0.6875rem] pt-1 border-t border-border/60 mt-1">
                {draftCheckout.delivery.addressLine1}, {draftCheckout.delivery.city}, {draftCheckout.delivery.state} — {draftCheckout.delivery.pincode}
              </div>
            </div>

            {/* Compact list of configured products */}
            <div className="divide-y divide-border/60 max-h-56 overflow-y-auto pr-1">
              {lines.map((line) => (
                <div key={line.id} className="py-2.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="size-10 rounded-lg border border-border bg-white p-1 shrink-0 flex items-center justify-center">
                      <ProductMockup kind={line.image?.kind ?? "card"} tone="transparent" className="h-full w-full" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-ink truncate">{line.productTitle}</div>
                      <div className="text-[0.6875rem] text-muted-foreground font-mono">
                        Qty: {line.quantity} × {line.tierQty ?? 1} {line.priceUnit}
                      </div>
                    </div>
                  </div>
                  <div className="font-mono font-semibold text-ink shrink-0">
                    {formatMoney(line.linePrice)}
                  </div>
                </div>
              ))}
            </div>

            {/* Pricing Total */}
            <div className="space-y-2 pt-3 border-t border-border">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
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
                <span>Shipping</span>
                <span className="font-mono font-semibold text-emerald-600">
                  {cart.cost.shipping.amount === 0 ? "FREE" : formatMoney(cart.cost.shipping)}
                </span>
              </div>

              <div className="border-t border-border pt-3 flex justify-between items-baseline">
                <span className="font-bold text-sm text-ink">Total Payable</span>
                <span className="font-display text-2xl font-extrabold text-ink">
                  {formatMoney(cart.cost.total)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleProcessPayment}
              disabled={isProcessing}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-violet py-3.5 px-5 text-xs font-bold text-white shadow-lift hover:bg-violet-lift transition-all disabled:opacity-50"
            >
              <Lock className="size-3.5" />
              <span>{isProcessing ? "Processing Authorization..." : `Pay ${formatMoney(cart.cost.total)} & Confirm`}</span>
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      </div>
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
