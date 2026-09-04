import * as React from "react";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  Truck,
  Headphones,
} from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { categories } from "@/lib/data/categories";

import { useStoreSettings } from "@/lib/settings/settings-context";
import { SiteLogo } from "@/components/shared/site-logo";

export function SiteFooter() {
  const settings = useStoreSettings();

  return (
    <footer className="mt-auto border-t border-zinc-200 bg-white text-zinc-600">
      {/* ── Value Props / Features ─────────────────────────────────── */}
      <div className="border-b border-zinc-100 bg-zinc-50/60 py-10">
        <div className="shell grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-start gap-3.5">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white border border-zinc-200/80 text-zinc-400">
              <Clock className="size-5 stroke-[1.5] text-primary" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-800">Fast Local Dispatch</h4>
              <p className="mt-1 text-xs text-zinc-500">
                {settings.delivery_estimate_text || siteConfig.operations.sameDayMessage}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white border border-zinc-200/80 text-zinc-400">
              <ShieldCheck className="size-5 stroke-[1.5] text-primary" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-800">High-Definition Output</h4>
              <p className="mt-1 text-xs text-zinc-500">
                Precision offset, digital, and wide-format printing with careful quality review.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white border border-zinc-200/80 text-zinc-400">
              <Truck className="size-5 stroke-[1.5] text-primary" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-800">Pickup & Delivery</h4>
              <p className="mt-1 text-xs text-zinc-500">
                Free shipping on orders above ₹{(settings.free_shipping_threshold_minor / 100).toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white border border-zinc-200/80 text-zinc-400">
              <Headphones className="size-5 stroke-[1.5] text-primary" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-800">Dedicated Support</h4>
              <p className="mt-1 text-xs text-zinc-500">
                {settings.support_hours || siteConfig.contact.supportHours}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Links Columns ───────────────────────────────────────── */}
      <div className="shell py-14">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand & Store Info */}
          <div className="col-span-2 lg:col-span-2 space-y-4">
            <SiteLogo />
            <p className="text-xs leading-relaxed text-zinc-500 max-w-sm">
              {settings.site_description || siteConfig.description}
            </p>

            <div className="space-y-2 pt-2 text-xs text-zinc-600">
              <div className="flex items-start gap-2">
                <MapPin className="size-4 shrink-0 text-primary mt-0.5 stroke-[1.75]" />
                <span>
                  {settings.address_line_1 || siteConfig.address.line1}, {settings.city || siteConfig.address.city}, {settings.state || siteConfig.address.state} — {settings.postal_code || siteConfig.address.pincode}
                </span>
              </div>
              <div className="flex items-center gap-2 font-mono">
                <Phone className="size-4 shrink-0 text-zinc-400 stroke-[1.75]" />
                <a href={`tel:${(settings.phone || siteConfig.contact.phone).replace(/\s+/g, "")}`} className="hover:text-primary transition-colors">
                  {settings.phone || siteConfig.contact.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="size-4 shrink-0 text-zinc-400 stroke-[1.75]" />
                <a href={`mailto:${settings.email || siteConfig.contact.email}`} className="hover:text-primary transition-colors">
                  {settings.email || siteConfig.contact.email}
                </a>
              </div>
              <div className="flex items-center gap-2 text-zinc-400">
                <Clock className="size-4 shrink-0 stroke-[1.75]" />
                <span>Hours: {settings.support_hours || siteConfig.contact.supportHours}</span>
              </div>
            </div>
          </div>

          {/* Popular Print Categories */}
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-900">
              Categories
            </h4>
            <ul className="mt-4 space-y-2 text-xs text-zinc-500">
              {categories.slice(0, 7).map((cat) => (
                <li key={cat.handle}>
                  <Link
                    href={`/category/${cat.handle}`}
                    className="hover:text-primary transition-colors"
                  >
                    {cat.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Corporate / Business Solutions */}
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-900">
              Solutions
            </h4>
            <ul className="mt-4 space-y-2 text-xs text-zinc-500">
              <li>
                <Link href="/bulk-quote" className="hover:text-primary transition-colors">
                  Bulk Order Quote
                </Link>
              </li>
              <li>
                <Link href="/business-solutions" className="hover:text-primary transition-colors">
                  Corporate Printing
                </Link>
              </li>
              <li>
                <Link href="/sample-kit" className="hover:text-primary transition-colors">
                  Paper Sample Kit
                </Link>
              </li>
              <li>
                <Link href="/design-help" className="hover:text-primary transition-colors">
                  Design Assistance
                </Link>
              </li>
              <li>
                <Link href="/store-locator" className="hover:text-primary transition-colors">
                  Store Location
                </Link>
              </li>
            </ul>
          </div>

          {/* Need Help? / Customer Support */}
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-900">
              Need Help?
            </h4>
            <ul className="mt-4 space-y-2 text-xs text-zinc-500">
              <li>
                <Link href="/orders" className="hover:text-primary transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">
                  Contact Customer Support
                </Link>
              </li>
              {(settings.whatsapp_number || siteConfig.contact.whatsapp) && (
                <li>
                  <a
                    href={`https://wa.me/${(settings.whatsapp_number || siteConfig.contact.whatsapp || "").replace(/[^0-9]/g, "")}?text=${encodeURIComponent(siteConfig.contact.whatsappMessage)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-600 hover:text-emerald-700 transition-colors inline-flex items-center gap-1.5 font-medium"
                  >
                    <span>WhatsApp Support</span>
                  </a>
                </li>
              )}
              <li>
                <a
                  href={`tel:${(settings.phone || siteConfig.contact.phone).replace(/\s+/g, "")}`}
                  className="hover:text-primary transition-colors"
                >
                  Call: {settings.phone || siteConfig.contact.phone}
                </a>
              </li>
              <li>
                <Link href="/help/faq" className="hover:text-primary transition-colors">
                  Help & FAQs
                </Link>
              </li>
              <li>
                <Link href="/help/shipping" className="hover:text-primary transition-colors">
                  Shipping & Dispatch
                </Link>
              </li>
              <li>
                <Link href="/help/artwork-guidelines" className="hover:text-primary transition-colors">
                  Artwork Guidelines
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── Bottom Copyright and GST Bar ────────────────────────────── */}
      <div className="border-t border-zinc-200/80 py-6 text-xs text-zinc-400 bg-zinc-50/50">
        <div className="shell flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span>&copy; {new Date().getFullYear()} {siteConfig.businessName}. All rights reserved.</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 font-mono text-[0.6875rem]">
            <span>GSTIN: {siteConfig.operations.gstin}</span>
            <span>·</span>
            <span>{siteConfig.address.city}, {siteConfig.address.country}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
