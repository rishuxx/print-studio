"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, X, Phone, Tag, Sparkles } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { createClient } from "@/lib/supabase/client";

interface ActiveSaleBanner {
  id: string;
  name: string;
  code: string | null;
  description: string | null;
  type: string;
  discount_value: number;
}

export function AnnouncementBar() {
  const [index, setIndex] = React.useState(0);
  const [dismissed, setDismissed] = React.useState(false);
  const [activePromos, setActivePromos] = React.useState<ActiveSaleBanner[]>([]);

  // Fetch active promotional campaigns dynamically from Supabase
  React.useEffect(() => {
    async function loadActivePromotions() {
      try {
        const supabase = createClient();
        const now = new Date().toISOString();
        const { data } = await supabase
          .from("promotions_and_sales")
          .select("id, name, code, description, type, discount_value")
          .eq("status", "active")
          .or(`starts_at.is.null,starts_at.lte.${now}`)
          .or(`ends_at.is.null,ends_at.gte.${now}`)
          .order("priority", { ascending: false });

        if (data && data.length > 0) {
          setActivePromos(data as ActiveSaleBanner[]);
        }
      } catch {
        // Fallback gracefully to siteConfig announcements
      }
    }
    loadActivePromotions();
  }, []);

  // Merge dynamic live promotions with default site announcements
  const allAnnouncements = React.useMemo(() => {
    if (activePromos.length > 0) {
      const dynamicItems = activePromos.map((p) => {
        const discountLabel =
          p.type === "percentage_discount"
            ? `${p.discount_value}% OFF`
            : `₹${p.discount_value} OFF`;
        return {
          text: p.description || `${p.name} · Flat ${discountLabel}`,
          code: p.code,
          href: "/products",
          isLiveSale: true,
        };
      });
      return [...dynamicItems, ...siteConfig.announcements];
    }
    return siteConfig.announcements;
  }, [activePromos]);

  React.useEffect(() => {
    if (allAnnouncements.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % allAnnouncements.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [allAnnouncements.length]);

  const current = allAnnouncements[index] || allAnnouncements[0];
  if (dismissed || !current) return null;
  const promoCode = "code" in current ? (current.code as string) : null;
  const isLiveSale = "isLiveSale" in current && current.isLiveSale;

  return (
    <aside
      aria-label="Announcements"
      className={`relative z-50 text-white text-xs border-b overflow-hidden transition-colors ${
        isLiveSale
          ? "bg-gradient-to-r from-violet via-purple-900 to-ink border-violet/40"
          : "bg-ink border-ink-line"
      }`}
    >
      <div className="shell flex items-center justify-between py-2 px-4">
        {/* Left: Direct Help Contact */}
        <div className="hidden lg:flex items-center gap-2 text-white/70">
          <Phone className="size-3 text-marigold" />
          <span>Need help with specs?</span>
          <a
            href={siteConfig.contact.phoneHref}
            className="font-mono font-medium text-white hover:text-marigold transition-colors"
          >
            {siteConfig.contact.phone}
          </a>
        </div>

        {/* Center: Announcement ticker */}
        <div className="flex-1 flex items-center justify-center gap-2 text-center">
          {allAnnouncements.length > 1 && (
            <button
              onClick={() => setIndex((prev) => (prev - 1 + allAnnouncements.length) % allAnnouncements.length)}
              className="p-1 text-white/60 hover:text-white transition-colors"
              aria-label="Previous announcement"
            >
              <ChevronLeft className="size-3.5" />
            </button>
          )}

          <div className="flex items-center gap-2 font-medium">
            {isLiveSale && <Sparkles className="size-3.5 text-amber-400 fill-amber-400 shrink-0" />}
            <span>{current.text}</span>
            {promoCode && (
              <span className="inline-flex items-center gap-1 rounded bg-amber-400/20 px-2 py-0.5 font-mono text-[0.6875rem] font-bold text-amber-300 border border-amber-400/40 animate-pulse">
                <Tag className="size-2.5" /> Use Code: {promoCode}
              </span>
            )}
            {"href" in current && current.href && (
              <Link
                href={current.href as string}
                className="underline underline-offset-2 hover:text-amber-300 text-white/90 font-bold ml-1 transition-colors"
              >
                Shop Sale &rarr;
              </Link>
            )}
          </div>

          {allAnnouncements.length > 1 && (
            <button
              onClick={() => setIndex((prev) => (prev + 1) % allAnnouncements.length)}
              className="p-1 text-white/60 hover:text-white transition-colors"
              aria-label="Next announcement"
            >
              <ChevronRight className="size-3.5" />
            </button>
          )}
        </div>

        {/* Right: Dismiss button */}
        <button
          onClick={() => setDismissed(true)}
          className="text-white/60 hover:text-white p-1 transition-colors ml-4"
          aria-label="Dismiss banner"
        >
          <X className="size-3.5" />
        </button>
      </div>
    </aside>
  );
}
