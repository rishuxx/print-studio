import * as React from "react";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Truck, MapPin } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Shipping & Store Pickup Information",
  description: "Learn about standard shipping, dispatch timelines, and store pickup options.",
};

export default function ShippingPage() {
  return (
    <div className="shell py-8 space-y-8 max-w-3xl mx-auto">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Help & Information", href: "/help/faq" },
          { label: "Shipping & Pickup" },
        ]}
      />

      <div className="rounded-2xl border border-border bg-paper p-6 sm:p-10 space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-md bg-violet/10 px-2.5 py-1 font-mono text-xs font-bold text-violet">
            <Truck className="size-3.5" />
            <span>Fulfilment Options</span>
          </div>
          <h1 className="font-display text-3xl font-extrabold text-ink sm:text-4xl">
            Shipping & Pickup
          </h1>
          <p className="text-xs text-muted-foreground sm:text-sm leading-relaxed">
            We provide local store pickup as well as door-to-door courier dispatch across India.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="rounded-xl border border-border bg-white p-5 space-y-3">
            <div className="flex items-center gap-2 font-bold text-sm text-ink">
              <MapPin className="size-4 text-violet" />
              <span>Local Store Pickup</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {siteConfig.operations.pickupMessage}. You will receive an SMS and email notification once your order passes quality control and is packaged for pickup.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-white p-5 space-y-3">
            <div className="flex items-center gap-2 font-bold text-sm text-ink">
              <Truck className="size-4 text-violet" />
              <span>Doorstep Shipping</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {siteConfig.operations.shippingMessage}. Standard shipping is free on orders above ₹999. Tracking details are shared upon courier dispatch.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
