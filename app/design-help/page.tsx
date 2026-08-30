import * as React from "react";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Paintbrush, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Artwork Guidelines & Design Assistance",
  description: "Get free pre-press verification, formatting advice, and design help for custom print files.",
};

export default function DesignHelpPage() {
  return (
    <div className="shell py-8 space-y-8 max-w-3xl mx-auto">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Design Help" },
        ]}
      />

      <div className="rounded-2xl border border-border bg-paper p-6 sm:p-10 space-y-6">
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 rounded-md bg-violet/10 px-2.5 py-1 font-mono text-xs font-bold text-violet">
            <Paintbrush className="size-3.5" />
            <span>Pre-Press Support</span>
          </div>
          <h1 className="font-display text-3xl font-extrabold text-ink sm:text-4xl">
            Design & Artwork Assistance
          </h1>
          <p className="text-xs text-muted-foreground sm:text-sm leading-relaxed">
            Need help ensuring your artwork prints cleanly without blurry text or clipped borders? Our pre-press team reviews file resolution, bleed zones, and color calibration.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="rounded-xl border border-border bg-white p-4 space-y-2">
            <h3 className="font-bold text-ink">File Setup Best Practices</h3>
            <ul className="space-y-1.5 text-muted-foreground">
              <li>• Resolution: Minimum 300 DPI at 100% scale</li>
              <li>• Color Mode: CMYK (avoids RGB color shift)</li>
              <li>• Bleed: 3 mm safe trim bleed on all sides</li>
              <li>• Fonts: Converted to curves/outlines</li>
              <li>• File types: PDF, AI, EPS, PSD, TIFF, PNG</li>
            </ul>
          </div>

          <div className="rounded-xl border border-border bg-white p-4 space-y-2">
            <h3 className="font-bold text-ink">Services Included Free</h3>
            <ul className="space-y-1.5 text-muted-foreground">
              <li>• Bleed margin extension & safety check</li>
              <li>• Resolution and pixelation inspection</li>
              <li>• Digital PDF proof preview before print</li>
              <li>• Spot UV & Foil vector mask creation</li>
              <li>• Minor text/alignment adjustments</li>
            </ul>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-white p-5 text-xs space-y-3">
          <h3 className="font-bold text-sm text-ink">Have a design ready or need help?</h3>
          <p className="text-muted-foreground">
            You can share your artwork draft with your order inquiry, and we will send back a digital proof confirmation.
          </p>
          <div className="pt-2">
            <Link
              href="/bulk-quote"
              className="inline-flex items-center gap-2 rounded-xl bg-violet px-5 py-2.5 font-bold text-white shadow-lift hover:bg-violet-lift transition-all"
            >
              <span>Submit File for Review</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
