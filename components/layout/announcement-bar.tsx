"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, X, Tag, ArrowRight, Phone } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { createClient } from "@/lib/supabase/client";
import { useStoreSettings } from "@/lib/settings/settings-context";

interface ActiveSaleBanner {
  id: string;
  name: string;
  code: string | null;
  description: string | null;
  type: string;
  discount_value: number;
}

export function AnnouncementBar() {
  const settings = useStoreSettings();
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
        // Fallback gracefully
      }
    }
    loadActivePromotions();
  }, []);

  // Merge dynamic live promotions with store settings announcement and default site announcements
  const allAnnouncements = React.useMemo(() => {
    const list: Array<{ text: string; code?: string | null; href: string; isLiveSale?: boolean }> = [];

    if (activePromos.length > 0) {
      activePromos.forEach((p) => {
        const discountLabel =
          p.type === "percentage_discount"
            ? `${p.discount_value}% OFF`
            : `₹${p.discount_value} OFF`;
        list.push({
          text: p.description || `${p.name} · Flat ${discountLabel}`,
          code: p.code,
          href: "/products",
          isLiveSale: true,
        });
      });
    }

    if (settings.announcement_enabled && settings.announcement_message) {
      list.push({
        text: settings.announcement_message,
        href: settings.announcement_link || "/same-day",
      });
    } else {
      siteConfig.announcements.forEach((a) => {
        list.push({
          text: a.text,
          code: a.code,
          href: a.href || "/products",
        });
      });
    }

    return list;
  }, [activePromos, settings]);

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
          ? "bg-gradient-to-r from-red-600 via-primary to-rose-700 border-red-700"
          : "bg-zinc-900 border-zinc-800"
      }`}
    >
      <div className="shell flex items-center justify-between py-2 px-4">
        {/* Left: Direct Help Contact */}
        <div className="hidden lg:flex items-center gap-2 text-white/70">
          <Phone className="size-3 text-marigold" />
          <span>Need help with specs?</span>
          <a
            href={`tel:${(settings.phone || siteConfig.contact.phone).replace(/\s+/g, "")}`}
            className="font-mono font-medium text-white hover:text-marigold transition-colors"
          >
            {settings.phone || siteConfig.contact.phone}
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
            {isLiveSale && <Tag className="size-3.5 text-amber-400 shrink-0" />}
            <span>{current.text}</span>

            {promoCode && (
              <span className="hidden sm:inline-flex items-center gap-1 rounded bg-amber-400/20 px-1.5 py-0.5 font-mono text-[0.6875rem] font-bold text-amber-300 border border-amber-400/30">
                <Tag className="size-2.5" />
                Use Code: {promoCode}
              </span>
            )}

            <Link
              href={current.href}
              className="inline-flex items-center gap-1 font-bold text-marigold hover:underline ml-1"
            >
              {isLiveSale ? "Shop Sale" : "Learn More"}
              <ArrowRight className="size-3" />
            </Link>
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
          type="button"
          onClick={() => setDismissed(true)}
          className="text-white/60 hover:text-white transition-colors p-1"
          aria-label="Dismiss announcement banner"
        >
          <X className="size-3.5" />
        </button>
      </div>
    </aside>
  );
}
