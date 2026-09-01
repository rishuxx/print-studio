"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/cart-store";
import { useOrderStore } from "@/lib/order-store";
import { formatMoney } from "@/lib/pricing";
import { siteConfig } from "@/lib/site-config";
import { ProductMockup } from "@/components/shared/product-mockup";
import {
  ShieldCheck,
  UserCheck,
  Truck,
  ArrowRight,
  Lock,
  CheckCircle2,
  Tag,
  Sparkles,
  X,
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { toast } from "sonner";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import {
  validateAndApplyCouponAction,
  type AvailableCoupon,
} from "@/lib/pricing/coupon-actions";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
type AddressRow = Database["public"]["Tables"]["addresses"]["Row"];

import { checkPincodeServiceability } from "@/lib/shipping/serviceability";

interface CustomerForm {
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  addressLine1: string;
  city: string;
  state: string;
  pincode: string;
  notes: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  addressLine1?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

interface CheckoutClientViewProps {
  user: SupabaseUser | null;
  initialProfile: ProfileRow | null;
  savedAddresses: AddressRow[];
  availableCoupons?: AvailableCoupon[];
}

export function CheckoutClientView({
  user,
  initialProfile,
  savedAddresses,
  availableCoupons = [],
}: CheckoutClientViewProps) {
  const router = useRouter();
  const isHydrated = useSyncExternalStoreHydration();

  const lines = useCartStore((state) => state.lines);
  const discount = useCartStore((state) => state.discount);
  const applyDiscount = useCartStore((state) => state.applyDiscount);
  const getCart = useCartStore((state) => state.getCart);
  const setDraftCheckout = useOrderStore((state) => state.setDraftCheckout);
  const draftCheckout = useOrderStore((state) => state.currentDraftCheckout);

  const defaultAddr = savedAddresses.find((a) => a.is_default) || savedAddresses[0];

  const [selectedAddressId, setSelectedAddressId] = React.useState<string | "custom">(
    defaultAddr ? defaultAddr.id : "custom"
  );

  const [form, setForm] = React.useState<CustomerForm>(() => ({
    fullName: defaultAddr?.full_name || initialProfile?.full_name || draftCheckout?.customer.fullName || "",
    companyName: initialProfile?.company_name || draftCheckout?.customer.companyName || "",
    email: user?.email || draftCheckout?.customer.email || "",
    phone: defaultAddr?.phone || initialProfile?.phone || draftCheckout?.customer.phone || "",
    addressLine1: defaultAddr?.line1
      ? `${defaultAddr.line1}${defaultAddr.line2 ? ` ${defaultAddr.line2}` : ""}`
      : draftCheckout?.delivery.addressLine1 || "",
    city: defaultAddr?.city || draftCheckout?.delivery.city || "",
    state: defaultAddr?.state || draftCheckout?.delivery.state || "",
    pincode: defaultAddr?.pincode || draftCheckout?.delivery.pincode || "",
    notes: draftCheckout?.delivery.notes || "",
  }));

  const [errors, setErrors] = React.useState<FormErrors>({});

  // Coupon state
  const [couponInput, setCouponInput] = React.useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = React.useState(false);
  const [showCouponsDrawer, setShowCouponsDrawer] = React.useState(false);
  const [isLookingUpPin, setIsLookingUpPin] = React.useState(false);

  if (!isHydrated) {
    return (
      <div className="shell py-12 text-center text-xs text-muted-foreground">
        Loading checkout details...
      </div>
    );
  }

  const cart = getCart();

  const handleSelectSavedAddress = (addr: AddressRow) => {
    setSelectedAddressId(addr.id);
    setForm((prev) => ({
      ...prev,
      fullName: addr.full_name,
      phone: addr.phone || prev.phone,
      addressLine1: `${addr.line1}${addr.line2 ? ` ${addr.line2}` : ""}`,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
    }));
    setErrors({});
  };

  const handleInputChange = (field: keyof CustomerForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field in errors) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    // Auto-detect & auto-fill City and State when user enters 6-digit Pincode
    if (field === "pincode" && value.length === 6) {
      lookupCityAndState(value);
    }
  };

  const lookupCityAndState = async (pin: string) => {
    setIsLookingUpPin(true);
    try {
      // 1. Direct Postal API Query
      const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
      if (res.ok) {
        const data = await res.json();
        const po = data?.[0]?.PostOffice?.[0];
        if (po && po.District && po.State) {
          setForm((prev) => ({
            ...prev,
            city: po.District,
            state: po.State,
          }));
          setErrors((prev) => ({ ...prev, city: undefined, state: undefined, pincode: undefined }));
          toast.success(`Location detected: ${po.District}, ${po.State}`);
          return;
        }
      }

      // 2. Delhivery Pincode Gateway Resolution
      const sRes = await fetch("/api/shipping/serviceability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pincode: pin, weightGrams: 500 }),
      });
      if (sRes.ok) {
        const sData = await sRes.json();
        if (sData.success && sData.result) {
          const resolvedCity = sData.result.city && sData.result.city !== "India" ? sData.result.city : undefined;
          const resolvedState = sData.result.state && sData.result.state !== "India" ? sData.result.state : undefined;

          if (resolvedCity || resolvedState) {
            setForm((prev) => ({
              ...prev,
              ...(resolvedCity ? { city: resolvedCity } : {}),
              ...(resolvedState ? { state: resolvedState } : {}),
            }));
            setErrors((prev) => ({ ...prev, city: undefined, state: undefined, pincode: undefined }));
            toast.success(`Location detected: ${resolvedCity || ""}${resolvedCity && resolvedState ? ", " : ""}${resolvedState || ""}`);
          }
        }
      }
    } catch {
      // User can still manually edit
    } finally {
      setIsLookingUpPin(false);
    }
  };

  const handleApplyCoupon = async (codeToApply?: string) => {
    const targetCode = (codeToApply || couponInput).trim().toUpperCase();
    if (!targetCode) {
      toast.error("Please enter a coupon code");
      return;
    }

    setIsApplyingCoupon(true);
    const lineSummaries = lines.map((l) => ({
      productId: l.productId,
      productHandle: l.productHandle,
      quantity: l.quantity,
      lineTotalPaise: l.linePrice.amount,
    }));
    const res = await validateAndApplyCouponAction(targetCode, cart.cost.subtotal.amount, lineSummaries);
    setIsApplyingCoupon(false);

    if (res.valid && res.code && res.discountPercent !== undefined) {
      applyDiscount({
        code: res.code,
        percent: res.discountPercent,
        label: `${res.discountPercent}% OFF (${res.code})`,
      });
      setCouponInput("");
      setShowCouponsDrawer(false);
      toast.success(res.message || `Coupon ${res.code} applied!`);
    } else {
      toast.error(res.message || "Invalid coupon code");
    }
  };

  const handleRemoveCoupon = () => {
    applyDiscount(null);
    toast.info("Coupon discount removed");
  };

  const validateForm = (): boolean => {
    const errs: FormErrors = {};

    if (!form.fullName.trim()) errs.fullName = "Full name is required";
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) {
      errs.email = "Valid email address is required";
    }
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone.replace(/[^0-9]/g, ""))) {
      errs.phone = "Valid 10-digit mobile number is required";
    }
    if (!form.addressLine1.trim()) errs.addressLine1 = "Street address is required";
    if (!form.city.trim()) errs.city = "City is required";
    if (!form.state.trim()) errs.state = "State is required";
    if (!form.pincode.trim() || !/^\d{6}$/.test(form.pincode.replace(/[^0-9]/g, ""))) {
      errs.pincode = "Valid 6-digit PIN code is required";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the errors in the delivery form");
      return;
    }

    if (lines.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    // Verify Pincode serviceability
    const sResult = checkPincodeServiceability(form.pincode, 500, form.city, form.state);
    const validCarriers = sResult.options.filter((o) => o.carrierCode !== "fake" && o.isServiceable);

    if (validCarriers.length === 0) {
      toast.error(`Pincode ${form.pincode} is not serviceable`, {
        description: "None of our courier partners currently deliver to this destination. Please provide an alternate PIN code.",
      });
      return;
    }

    if (!user) {
      toast.error("Account Sign In Required", {
        description: "Please sign in or create an account to proceed with your order.",
      });
      router.push("/login?redirect=/checkout");
      return;
    }

    // Persist draft checkout into local state store
    setDraftCheckout(
      {
        fullName: form.fullName.trim(),
        companyName: form.companyName.trim() || undefined,
        email: form.email.trim(),
        phone: form.phone.trim(),
      },
      {
        addressLine1: form.addressLine1.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        pincode: form.pincode.trim(),
        notes: form.notes.trim() || undefined,
      }
    );

    router.push("/payment");
  };

  return (
    <form onSubmit={handleProceedToPayment} className="grid grid-cols-1 gap-8 lg:grid-cols-12">
      {/* ── Left Column: Saved Addresses & Customer Details ─────────── */}
      <div className="lg:col-span-7 space-y-6">
        {/* Unauthenticated Customer Banner (Mandatory Authentication) */}
        {!user && (
          <div className="rounded-2xl border border-violet/30 bg-violet-wash/40 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex size-9 items-center justify-center rounded-xl bg-violet/10 text-violet shrink-0 mt-0.5">
                <UserCheck className="size-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-ink">Customer Account Required for Checkout</h3>
                <p className="text-[0.6875rem] text-muted-foreground">
                  Please sign in or create an account to save your delivery destinations, review digital proofs, and receive invoices.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/login?redirect=/checkout"
                className="rounded-xl border border-violet bg-white px-3.5 py-2 text-xs font-bold text-violet hover:bg-violet/5 transition-all"
              >
                Sign In
              </Link>
              <Link
                href="/register?redirect=/checkout"
                className="rounded-xl bg-violet px-3.5 py-2 text-xs font-bold text-white hover:bg-violet-lift shadow-xs transition-all"
              >
                Register
              </Link>
            </div>
          </div>
        )}

        {/* Saved Addresses Selector (for logged in customers) */}
        {user && savedAddresses.length > 0 && (
          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="font-bold text-sm text-ink uppercase font-mono tracking-wider">
                Saved Delivery Destinations
              </h2>
              <button
                type="button"
                onClick={() => {
                  setSelectedAddressId("custom");
                  setForm((prev) => ({
                    ...prev,
                    addressLine1: "",
                    city: "",
                    state: "",
                    pincode: "",
                  }));
                }}
                className="text-[0.6875rem] font-semibold text-violet hover:underline"
              >
                + Use Different Address
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {savedAddresses.map((addr) => {
                const isSelected = selectedAddressId === addr.id;
                return (
                  <button
                    key={addr.id}
                    type="button"
                    onClick={() => handleSelectSavedAddress(addr)}
                    className={`rounded-xl border p-3.5 text-left space-y-1 transition-all ${
                      isSelected
                        ? "border-violet bg-violet-wash ring-1 ring-violet"
                        : "border-border hover:border-violet/40 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-ink">{addr.label || "Destination"}</span>
                      {isSelected && <CheckCircle2 className="size-3.5 text-violet" />}
                    </div>
                    <div className="text-[0.6875rem] text-muted-foreground line-clamp-2">
                      {addr.full_name} · {addr.line1}, {addr.city} — {addr.pincode}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Customer Information */}
        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h2 className="font-bold text-sm text-ink uppercase font-mono tracking-wider">
              1. Customer Information
            </h2>
            {!user && (
              <Link href="/login?redirect=/checkout" className="text-[0.6875rem] font-semibold text-violet hover:underline">
                Sign in for 1-click address autofill
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-bold text-ink">Full Name *</label>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                placeholder="e.g. Ramesh Kumar"
                className={`w-full rounded-xl border px-3.5 py-2.5 text-xs text-ink focus:outline-none ${
                  errors.fullName ? "border-red-500 bg-red-50/20" : "border-border focus:border-violet"
                }`}
              />
              {errors.fullName && <p className="text-[0.6875rem] text-red-500">{errors.fullName}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-ink">Company / Studio (Optional)</label>
              <input
                type="text"
                value={form.companyName}
                onChange={(e) => handleInputChange("companyName", e.target.value)}
                placeholder="e.g. Studio Vertex Pvt Ltd"
                className="w-full rounded-xl border border-border px-3.5 py-2.5 text-xs text-ink focus:border-violet focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-bold text-ink">Email Address (for proofs & invoice) *</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="name@example.com"
                className={`w-full rounded-xl border px-3.5 py-2.5 text-xs text-ink focus:outline-none ${
                  errors.email ? "border-red-500 bg-red-50/20" : "border-border focus:border-violet"
                }`}
              />
              {errors.email && <p className="text-[0.6875rem] text-red-500">{errors.email}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-ink">Phone Number (10 digits) *</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="98XXXXXXXX"
                className={`w-full rounded-xl border px-3.5 py-2.5 text-xs text-ink font-mono focus:outline-none ${
                  errors.phone ? "border-red-500 bg-red-50/20" : "border-border focus:border-violet"
                }`}
              />
              {errors.phone && <p className="text-[0.6875rem] text-red-500">{errors.phone}</p>}
            </div>
          </div>
        </div>

        {/* Delivery Destination */}
        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm space-y-4 text-xs">
          <h2 className="font-bold text-sm text-ink uppercase font-mono tracking-wider border-b border-border pb-3">
            2. Delivery Address
          </h2>

          <div className="space-y-1.5">
            <label className="font-bold text-ink">Street Address & Landmark *</label>
            <input
              type="text"
              value={form.addressLine1}
              onChange={(e) => handleInputChange("addressLine1", e.target.value)}
              placeholder="Flat / Office No, Building Name, Street"
              className={`w-full rounded-xl border px-3.5 py-2.5 text-xs text-ink focus:outline-none ${
                errors.addressLine1 ? "border-red-500 bg-red-50/20" : "border-border focus:border-violet"
              }`}
            />
            {errors.addressLine1 && <p className="text-[0.6875rem] text-red-500">{errors.addressLine1}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="font-bold text-ink">City *</label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                placeholder="Bengaluru"
                className={`w-full rounded-xl border px-3.5 py-2.5 text-xs text-ink focus:outline-none ${
                  errors.city ? "border-red-500 bg-red-50/20" : "border-border focus:border-violet"
                }`}
              />
              {errors.city && <p className="text-[0.6875rem] text-red-500">{errors.city}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-ink">State *</label>
              <input
                type="text"
                value={form.state}
                onChange={(e) => handleInputChange("state", e.target.value)}
                placeholder="Karnataka"
                className={`w-full rounded-xl border px-3.5 py-2.5 text-xs text-ink focus:outline-none ${
                  errors.state ? "border-red-500 bg-red-50/20" : "border-border focus:border-violet"
                }`}
              />
              {errors.state && <p className="text-[0.6875rem] text-red-500">{errors.state}</p>}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-bold text-ink">PIN Code (6 digits) *</label>
                {isLookingUpPin && (
                  <span className="text-[0.625rem] text-violet font-semibold animate-pulse">
                    Detecting City & State...
                  </span>
                )}
              </div>
              <input
                type="text"
                value={form.pincode}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                  handleInputChange("pincode", val);
                }}
                placeholder="560001"
                maxLength={6}
                className={`w-full rounded-xl border px-3.5 py-2.5 text-xs font-mono text-ink focus:outline-none ${
                  errors.pincode ? "border-red-500 bg-red-50/20" : "border-border focus:border-violet"
                }`}
              />
              {errors.pincode && <p className="text-[0.6875rem] text-red-500">{errors.pincode}</p>}
            </div>
          </div>

          {/* Live Pincode Serviceability Indicator */}
          {form.pincode.length === 6 && (
            <div className="pt-1">
              {(() => {
                const s = checkPincodeServiceability(form.pincode, 500, form.city, form.state);
                const serviceableCount = s.options.filter((o) => o.carrierCode !== "fake" && o.isServiceable).length;

                if (serviceableCount === 0) {
                  return (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-[0.6875rem] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="flex size-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="font-bold">PIN {form.pincode} is currently unserviceable by our direct courier network.</span>
                      </div>
                      <span className="font-mono font-bold text-red-700">NO COURIER COVERAGE</span>
                    </div>
                  );
                }

                return (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-[0.6875rem] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="size-3.5 text-emerald-600" />
                      <span>
                        <strong>Serviceable PIN ({form.pincode}):</strong> {serviceableCount} courier partner{serviceableCount > 1 ? "s" : ""} available with express dispatch.
                      </span>
                    </div>
                    <span className="font-mono font-bold text-emerald-700">DELIVERY AVAILABLE</span>
                  </div>
                );
              })()}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="font-bold text-ink">Special Print Instructions (Optional)</label>
            <textarea
              rows={3}
              value={form.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="e.g. Deliver to rear loading dock. Call upon arrival."
              className="w-full rounded-xl border border-border px-3.5 py-2.5 text-xs text-ink focus:border-violet focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* ── Right Column: Order Summary, Coupons & Proceed CTA ──────── */}
      <div className="lg:col-span-5 space-y-6">
        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm space-y-6 text-xs sticky top-24">
          <h2 className="font-bold text-sm text-ink uppercase font-mono tracking-wider border-b border-border pb-3">
            3. Order Summary ({cart.totalQuantity} items)
          </h2>

          {/* Configured Item List */}
          <div className="max-h-60 overflow-y-auto divide-y divide-border/60 pr-1 space-y-2">
            {lines.map((line) => (
              <div key={line.id} className="pt-2 first:pt-0 flex items-start gap-3 justify-between">
                <div className="flex items-start gap-2.5">
                  <div className="size-12 rounded-lg border border-border bg-paper shrink-0 flex items-center justify-center overflow-hidden">
                    {line.image?.url && !line.image.url.includes("placeholder-product.png") ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={line.image.url}
                        alt={line.productTitle}
                        className="size-full object-cover"
                      />
                    ) : (
                      <div className="p-1 size-full flex items-center justify-center">
                        <ProductMockup kind={line.image?.kind ?? "card"} tone="transparent" className="h-full w-full" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-ink leading-tight">{line.productTitle}</div>
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

          {/* ── PROMOTIONAL / COUPON CODE SECTION ──────────────────────── */}
          <div className="border-t border-border pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-ink uppercase font-mono text-[0.6875rem] flex items-center gap-1.5">
                <Tag className="size-3 text-violet" />
                <span>Promo / Coupon Code</span>
              </span>
              {availableCoupons.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowCouponsDrawer(!showCouponsDrawer)}
                  className="text-violet font-semibold text-[0.6875rem] hover:underline flex items-center gap-1"
                >
                  <Sparkles className="size-3" />
                  <span>{availableCoupons.length} Available</span>
                  {showCouponsDrawer ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
                </button>
              )}
            </div>

            {/* Applied Coupon Display */}
            {discount ? (
              <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900">
                <div className="flex items-center gap-2">
                  <div className="size-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <Check className="size-3" />
                  </div>
                  <div>
                    <div className="font-mono font-bold text-xs">{discount.code}</div>
                    <div className="text-[0.6875rem] text-emerald-700">
                      {discount.percent}% discount applied to subtotal
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveCoupon}
                  className="p-1 rounded-lg text-emerald-700 hover:text-rose-600 hover:bg-emerald-100"
                  title="Remove coupon"
                >
                  <X className="size-4" />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  placeholder="Enter coupon (e.g. DIWALI20)"
                  className="flex-1 px-3 py-2 text-xs font-mono font-bold uppercase rounded-xl border border-border bg-paper/40 focus:bg-white focus:outline-none focus:ring-1 focus:ring-violet"
                />
                <button
                  type="button"
                  disabled={isApplyingCoupon || !couponInput.trim()}
                  onClick={() => handleApplyCoupon()}
                  className="px-4 py-2 bg-ink text-white font-bold text-xs rounded-xl hover:bg-ink/90 disabled:opacity-50 transition-all shadow-xs"
                >
                  {isApplyingCoupon ? "..." : "Apply"}
                </button>
              </div>
            )}

            {/* Available Coupons Dropdown / List */}
            {showCouponsDrawer && availableCoupons.length > 0 && !discount && (
              <div className="p-3 bg-paper/70 rounded-xl border border-border space-y-2 animate-in fade-in">
                <div className="text-[0.6875rem] font-bold text-muted-foreground uppercase font-mono">
                  Tap to Apply Discount
                </div>
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {availableCoupons.map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => handleApplyCoupon(c.code)}
                      className="w-full text-left p-2.5 rounded-lg border border-dashed border-violet/40 bg-white hover:bg-violet-wash hover:border-violet transition-all flex items-center justify-between group"
                    >
                      <div>
                        <div className="font-mono font-bold text-violet text-xs flex items-center gap-1.5">
                          <span>{c.code}</span>
                          <span className="px-1.5 py-0.2 rounded text-[0.625rem] bg-violet/10 text-violet">
                            {c.type === "percentage_discount" ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`}
                          </span>
                        </div>
                        {c.description && (
                          <div className="text-[0.6875rem] text-muted-foreground line-clamp-1 mt-0.5">
                            {c.description}
                          </div>
                        )}
                      </div>
                      <span className="text-[0.6875rem] font-bold text-violet group-hover:underline">
                        Apply &rarr;
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Financial Breakdown */}
          <div className="border-t border-border pt-4 space-y-2 text-muted-foreground">
            <div className="flex justify-between">
              <span>Item Subtotal:</span>
              <span className="font-mono font-semibold text-ink">{formatMoney(cart.cost.subtotal)}</span>
            </div>

            {cart.cost.discount.amount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Promotional Discount ({discount?.code || "PROMO"}):</span>
                <span className="font-mono">-{formatMoney(cart.cost.discount)}</span>
              </div>
            )}

            {(useCartStore.getState().gstMode || siteConfig.pricingPolicy.gstMode) === "exclusive" && cart.cost.tax.amount > 0 && (
              <div className="flex justify-between">
                <span>Estimated GST ({Math.round((useCartStore.getState().gstRate || siteConfig.pricingPolicy.gstRate) * 100)}%):</span>
                <span className="font-mono font-semibold text-ink">{formatMoney(cart.cost.tax)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Studio Dispatch / Delivery:</span>
              <span className="font-mono font-semibold text-emerald-600">
                {cart.cost.shipping.amount === 0 ? "FREE" : formatMoney(cart.cost.shipping)}
              </span>
            </div>

            <div className="border-t border-border pt-3 flex justify-between items-baseline">
              <span className="font-bold text-sm text-ink">Total Payable:</span>
              <span className="font-display text-2xl font-extrabold text-ink">{formatMoney(cart.cost.total)}</span>
            </div>
          </div>

          {/* Proceed Button */}
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-violet py-3.5 px-6 text-xs font-bold text-white shadow-lift hover:bg-violet-lift transition-all"
          >
            <Lock className="size-3.5" />
            <span>Proceed to Secure Payment</span>
            <ArrowRight className="size-4" />
          </button>

          {/* Guarantees */}
          <div className="border-t border-border pt-4 space-y-2 text-[0.6875rem] text-muted-foreground">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-3.5 text-violet shrink-0" />
              <span>Digital Proof Approval before Press Run</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="size-3.5 text-violet shrink-0" />
              <span>Free Secure Doorstep Delivery on orders above ₹999</span>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

function useSyncExternalStoreHydration() {
  return React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}
