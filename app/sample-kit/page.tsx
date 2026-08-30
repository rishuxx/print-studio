import * as React from "react";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Order Paper Sample Kit",
  description: "Experience 12+ paper stocks, textures, and luxury finishes before placing your custom print order.",
};

export default function SampleKitPage() {
  return (
    <div className="shell py-8 space-y-8 max-w-3xl mx-auto">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Sample Kit" },
        ]}
      />

      <div className="rounded-2xl border border-border bg-paper p-6 sm:p-10 space-y-6">
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 rounded-md bg-violet/10 px-2.5 py-1 font-mono text-xs font-bold text-violet">
            <Sparkles className="size-3.5 text-violet" />
            <span>Tactile Swatch Kit</span>
          </div>
          <h1 className="font-display text-3xl font-extrabold text-ink sm:text-4xl">
            Paper & Finish Sample Kit
          </h1>
          <p className="text-xs text-muted-foreground sm:text-sm leading-relaxed">
            Feel the weight, texture, rigidity and reflectivity of our curated paper stocks, laminates, and metallic foil finishes before your press run.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="rounded-xl border border-border bg-white p-4 space-y-2">
            <h3 className="font-bold text-ink">Included Paper Stocks:</h3>
            <ul className="space-y-1.5 text-muted-foreground">
              <li>• 300 GSM Art Card (Standard)</li>
              <li>• 350 GSM Heavy Premium Card</li>
              <li>• 400 GSM Ultra Velvet Board</li>
              <li>• Natural Textured & Linen Paper</li>
              <li>• Kraft Recycled Eco Board</li>
              <li>• Tear-Resistant Synthetic Sheet</li>
            </ul>
          </div>

          <div className="rounded-xl border border-border bg-white p-4 space-y-2">
            <h3 className="font-bold text-ink">Included Finishes & Foils:</h3>
            <ul className="space-y-1.5 text-muted-foreground">
              <li>• Matte Silk Lamination</li>
              <li>• High Gloss Lamination</li>
              <li>• Velvet Touch Soft Feel</li>
              <li>• Precision Raised Spot UV</li>
              <li>• Gold & Silver Hot Foil Stamping</li>
              <li>• Die-Cut Rounded Corners</li>
            </ul>
          </div>
        </div>

        <div className="rounded-xl border border-violet/20 bg-violet/5 p-5 text-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="font-bold text-sm text-ink">Sample Kit ₹99</div>
            <div className="text-muted-foreground">
              100% refundable as coupon credit on your first order.
            </div>
          </div>
          <Link
            href="/bulk-quote"
            className="inline-flex items-center gap-2 rounded-xl bg-violet px-5 py-2.5 font-bold text-white shadow-lift hover:bg-violet-lift transition-all"
          >
            <span>Request Sample Kit</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
