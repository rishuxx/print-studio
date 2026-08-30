import * as React from "react";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact & Store Location",
  description: "Get in touch with our printing support team or visit our store.",
};

export default function ContactPage() {
  return (
    <div className="shell py-8 space-y-8 max-w-4xl mx-auto">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Contact Us" },
        ]}
      />

      <div className="space-y-2 text-center sm:text-left">
        <h1 className="font-display text-3xl font-extrabold text-ink sm:text-4xl">
          Contact & Location
        </h1>
        <p className="text-xs text-muted-foreground sm:text-sm max-w-xl">
          Have questions about print specifications, custom sizes, order status, or artwork files? We are here to assist.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
        {/* Contact Info Card */}
        <div className="md:col-span-5 rounded-2xl border border-border bg-paper p-6 sm:p-8 space-y-6 text-xs">
          <div className="space-y-4">
            <h2 className="font-bold text-sm text-ink uppercase font-mono tracking-wider">
              Store Information
            </h2>

            <div className="flex items-start gap-3 text-ink">
              <MapPin className="size-4 text-violet shrink-0 mt-0.5" />
              <div>
                <div className="font-bold">{siteConfig.businessName}</div>
                <div className="text-muted-foreground">
                  {siteConfig.address.line1}, {siteConfig.address.line2}
                </div>
                <div className="text-muted-foreground">
                  {siteConfig.address.city}, {siteConfig.address.state} — {siteConfig.address.pincode}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-ink">
              <Phone className="size-4 text-violet shrink-0" />
              <div>
                <div className="font-bold">Phone Support</div>
                <a href={siteConfig.contact.phoneHref} className="text-muted-foreground hover:text-violet font-mono">
                  {siteConfig.contact.phone}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3 text-ink">
              <Mail className="size-4 text-violet shrink-0" />
              <div>
                <div className="font-bold">Email Support</div>
                <a href={siteConfig.contact.emailHref} className="text-muted-foreground hover:text-violet">
                  {siteConfig.contact.email}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3 text-ink">
              <Clock className="size-4 text-violet shrink-0" />
              <div>
                <div className="font-bold">Working Hours</div>
                <div className="text-muted-foreground">{siteConfig.contact.supportHours}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Message Form */}
        <div className="md:col-span-7 rounded-2xl border border-border bg-white p-6 sm:p-8 space-y-5 text-xs shadow-sm">
          <h2 className="font-bold text-sm text-ink">Send Us a Message</h2>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="font-bold text-ink">Your Name</label>
              <input
                type="text"
                placeholder="Full Name"
                className="w-full rounded-xl border border-border px-3.5 py-2.5 text-xs focus:border-violet focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="font-bold text-ink">Email</label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="w-full rounded-xl border border-border px-3.5 py-2.5 text-xs focus:border-violet focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-bold text-ink">Phone</label>
                <input
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full rounded-xl border border-border px-3.5 py-2.5 text-xs focus:border-violet focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-ink">Subject / Inquiry</label>
              <input
                type="text"
                placeholder="e.g. Order Inquiry / File Check"
                className="w-full rounded-xl border border-border px-3.5 py-2.5 text-xs focus:border-violet focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-ink">Message</label>
              <textarea
                rows={4}
                placeholder="How can we help you?"
                className="w-full rounded-xl border border-border px-3.5 py-2.5 text-xs focus:border-violet focus:outline-none"
              />
            </div>

            <button
              type="button"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet py-3 text-xs font-bold text-white shadow-lift hover:bg-violet-lift transition-all"
            >
              <Send className="size-3.5" />
              <span>Send Message</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
