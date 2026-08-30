import * as React from "react";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  Truck,
  Sparkles,
  Zap,
} from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { categories } from "@/lib/data/categories";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-ink-line bg-ink text-white">
      {/* ── Process Inks (CMYK) Signature Color Bar ─────────────────── */}
      <div className="flex h-1.5 w-full">
        <span className="flex-1 bg-[#00aeef]" title="Cyan" />
        <span className="flex-1 bg-[#ec008c]" title="Magenta" />
        <span className="flex-1 bg-[#fff200]" title="Yellow" />
        <span className="flex-1 bg-[#1b0b2e]" title="Key (Black)" />
      </div>

      {/* ── Value Props / Features ─────────────────────────────────── */}
      <div className="border-b border-ink-line/60 bg-ink-soft/40 py-10">
        <div className="shell grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-start gap-3.5">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-violet/30 text-violet-tint">
              <Zap className="size-5 text-marigold" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Fast Local Dispatch</h4>
              <p className="mt-1 text-xs text-white/70">
                {siteConfig.operations.sameDayMessage}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-violet/30 text-violet-tint">
              <ShieldCheck className="size-5 text-violet-lift" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">High-Definition Output</h4>
              <p className="mt-1 text-xs text-white/70">
                Precision offset, digital, and wide-format printing with careful quality review.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-violet/30 text-violet-tint">
              <Truck className="size-5 text-marigold" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Pickup & Delivery</h4>
              <p className="mt-1 text-xs text-white/70">
                {siteConfig.operations.pickupMessage}. {siteConfig.operations.shippingMessage}.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-violet/30 text-violet-tint">
              <Sparkles className="size-5 text-violet-lift" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Corporate & Bulk Printing</h4>
              <p className="mt-1 text-xs text-white/70">
                Volume pricing and GST-compliant invoicing for businesses and organizations.
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
            <div className="flex items-center gap-1.5">
              <span className="font-display text-2xl font-extrabold text-white">
                {siteConfig.logo.lead}
              </span>
              <span className="font-display text-2xl font-extrabold text-violet-tint">
                {siteConfig.logo.trail}
              </span>
            </div>
            <p className="text-xs leading-relaxed text-white/70 max-w-sm">
              {siteConfig.description}
            </p>

            <div className="space-y-2 pt-2 text-xs text-white/80">
              <div className="flex items-start gap-2">
                <MapPin className="size-4 shrink-0 text-marigold mt-0.5" />
                <span>
                  {siteConfig.address.line1}, {siteConfig.address.line2}, {siteConfig.address.city}, {siteConfig.address.state} — {siteConfig.address.pincode}
                </span>
              </div>
              <div className="flex items-center gap-2 font-mono">
                <Phone className="size-4 shrink-0 text-violet-tint" />
                <a href={siteConfig.contact.phoneHref} className="hover:text-marigold transition-colors">
                  {siteConfig.contact.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="size-4 shrink-0 text-violet-tint" />
                <a href={siteConfig.contact.emailHref} className="hover:text-marigold transition-colors">
                  {siteConfig.contact.email}
                </a>
              </div>
              <div className="flex items-center gap-2 text-white/60">
                <Clock className="size-4 shrink-0 text-white/40" />
                <span>Hours: {siteConfig.contact.supportHours}</span>
              </div>
            </div>
          </div>

          {/* Popular Print Categories */}
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
              Categories
            </h4>
            <ul className="mt-4 space-y-2 text-xs text-white/70">
              {categories.slice(0, 7).map((cat) => (
                <li key={cat.handle}>
                  <Link
                    href={`/category/${cat.handle}`}
                    className="hover:text-white transition-colors"
                  >
                    {cat.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Business & Corporate Services */}
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
              Services
            </h4>
            <ul className="mt-4 space-y-2 text-xs text-white/70">
              <li>
                <Link href="/bulk-quote" className="hover:text-white transition-colors">
                  Request Bulk Quote
                </Link>
              </li>
              <li>
                <Link href="/sample-kit" className="hover:text-white transition-colors">
                  Paper Sample Kit
                </Link>
              </li>
              <li>
                <Link href="/same-day" className="hover:text-white transition-colors">
                  Express Printing
                </Link>
              </li>
              <li>
                <Link href="/design-help" className="hover:text-white transition-colors">
                  Design Assistance
                </Link>
              </li>
              <li>
                <Link href="/store-locator" className="hover:text-white transition-colors">
                  Store Location
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care & Policies */}
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
              Information
            </h4>
            <ul className="mt-4 space-y-2 text-xs text-white/70">
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/help/shipping" className="hover:text-white transition-colors">
                  Shipping & Pickup
                </Link>
              </li>
              <li>
                <Link href="/help/faq" className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/help/artwork-guidelines" className="hover:text-white transition-colors">
                  Artwork Guidelines
                </Link>
              </li>
              <li>
                <Link href="/help/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/help/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── Bottom Copyright and GST Bar ────────────────────────────── */}
      <div className="border-t border-ink-line/80 py-6 text-xs text-white/50">
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
