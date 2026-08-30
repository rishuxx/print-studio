import * as React from "react";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Boxes, CheckCircle2, Send, Phone, Mail } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Request a Bulk Printing Quote",
  description: "Get volume discounts and customized specifications for large commercial and business printing orders.",
};

export default function BulkQuotePage() {
  return (
    <div className="shell py-8 space-y-8 max-w-4xl mx-auto">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Bulk Quote" },
        ]}
      />

      <div className="space-y-3 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 rounded-md bg-violet/10 px-2.5 py-1 font-mono text-xs font-bold text-violet">
          <Boxes className="size-3.5" />
          <span>Volume & Corporate Orders</span>
        </div>
        <h1 className="font-display text-3xl font-extrabold text-ink sm:text-4xl">
          Request a Bulk Printing Quote
        </h1>
        <p className="text-xs text-muted-foreground sm:text-sm max-w-xl">
          Planning an order of 500+ pieces or need custom fabrication? Submit your requirements and our team will get back to you with a structured quotation.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
        {/* Left: Interactive Quote Request Form */}
        <div className="md:col-span-7 rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-sm space-y-5">
          <h2 className="font-display text-lg font-bold text-ink border-b border-border pb-3">
            Project Specifications
          </h2>

          <div className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-ink">Your Name / Organization</label>
              <input
                type="text"
                placeholder="Full Name or Company Name"
                className="w-full rounded-xl border border-border px-3.5 py-2.5 text-xs focus:border-violet focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="font-bold text-ink">Email Address</label>
                <input
                  type="email"
                  placeholder="name@company.com"
                  className="w-full rounded-xl border border-border px-3.5 py-2.5 text-xs focus:border-violet focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-bold text-ink">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full rounded-xl border border-border px-3.5 py-2.5 text-xs focus:border-violet focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-ink">Product Category</label>
              <select className="w-full rounded-xl border border-border px-3.5 py-2.5 text-xs focus:border-violet focus:outline-none bg-white">
                <option>Visiting Cards / Stationery</option>
                <option>Apparel & Uniforms</option>
                <option>Packaging Boxes & Labels</option>
                <option>Flyers, Brochures & Booklets</option>
                <option>Signage & Standees</option>
                <option>Personalised Gifts / Drinkware</option>
                <option>Other Custom Requirement</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-ink">Estimated Quantity</label>
              <input
                type="text"
                placeholder="e.g. 500, 1000, 5000 units"
                className="w-full rounded-xl border border-border px-3.5 py-2.5 text-xs focus:border-violet focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-ink">Details & Custom Specifications</label>
              <textarea
                rows={4}
                placeholder="Describe size, paper stock, finishes (matte, gloss, UV, foil), delivery location, or timeline..."
                className="w-full rounded-xl border border-border px-3.5 py-2.5 text-xs focus:border-violet focus:outline-none"
              />
            </div>

            <button
              type="button"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet py-3 text-xs font-bold text-white shadow-lift hover:bg-violet-lift transition-all"
            >
              <Send className="size-3.5" />
              <span>Submit Quote Inquiry</span>
            </button>
          </div>
        </div>

        {/* Right: What You Get */}
        <div className="md:col-span-5 space-y-4">
          <div className="rounded-2xl border border-border bg-paper p-6 space-y-4 text-xs">
            <h3 className="font-bold text-sm text-ink">Bulk Customer Benefits</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Tiered volume discounts for orders of 500+ units</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>GST-compliant business invoice for input credit</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Free pre-press artwork proof and review</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Dedicated account assistance for repeat reorders</span>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-white p-6 space-y-3 text-xs">
            <h3 className="font-bold text-sm text-ink">Direct Assistance</h3>
            <div className="space-y-2 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="size-3.5 text-violet" />
                <span>{siteConfig.contact.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="size-3.5 text-violet" />
                <span>{siteConfig.contact.phone}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
