"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Tag, Sparkles } from "lucide-react";
import { CategoryFlashCard, FlashCardTone } from "@/lib/flash-cards/types";
import { Category } from "@/lib/commerce/types";
import { cn } from "@/lib/utils";

interface CategoryFlashAdCardProps {
  card?: CategoryFlashCard;
  category: Category;
  className?: string;
}

/**
 * E-commerce style card themes (Blinkit / Swiggy / Zepto quick-commerce aesthetic)
 * Clean, crisp white & red primary branding, soft subtle tint backdrops, high-contrast typography.
 */
const TONE_STYLES: Record<
  FlashCardTone,
  {
    cardBg: string;
    border: string;
    eyebrowBg: string;
    eyebrowText: string;
    titleText: string;
    bodyText: string;
    badgeBg: string;
    badgeText: string;
    btnBg: string;
    btnText: string;
    btnHover: string;
    accentDot: string;
  }
> = {
  rose: {
    cardBg: "bg-gradient-to-b from-red-50/80 via-white to-white",
    border: "border-red-200/80 shadow-[0_4px_20px_-4px_rgba(229,57,53,0.12)]",
    eyebrowBg: "bg-red-100 text-red-700 border-red-200",
    eyebrowText: "text-red-600",
    titleText: "text-zinc-900",
    bodyText: "text-zinc-600",
    badgeBg: "bg-red-500 text-white",
    badgeText: "text-white",
    btnBg: "bg-[#e53935]",
    btnText: "text-white",
    btnHover: "hover:bg-[#d32f2f]",
    accentDot: "bg-[#e53935]",
  },
  ink: {
    // Pure clean Red & White Printo style
    cardBg: "bg-white",
    border: "border-zinc-200 shadow-sm hover:border-red-300",
    eyebrowBg: "bg-red-50 text-red-700 border-red-100",
    eyebrowText: "text-red-600",
    titleText: "text-zinc-950",
    bodyText: "text-zinc-600",
    badgeBg: "bg-red-600 text-white",
    badgeText: "text-white",
    btnBg: "bg-[#e53935]",
    btnText: "text-white",
    btnHover: "hover:bg-[#c62828]",
    accentDot: "bg-red-600",
  },
  marigold: {
    cardBg: "bg-gradient-to-b from-amber-50/70 via-white to-white",
    border: "border-amber-200 shadow-[0_4px_20px_-4px_rgba(245,158,11,0.12)]",
    eyebrowBg: "bg-amber-100 text-amber-800 border-amber-200",
    eyebrowText: "text-amber-700",
    titleText: "text-zinc-900",
    bodyText: "text-zinc-600",
    badgeBg: "bg-amber-500 text-white",
    badgeText: "text-white",
    btnBg: "bg-[#e53935]",
    btnText: "text-white",
    btnHover: "hover:bg-[#d32f2f]",
    accentDot: "bg-amber-500",
  },
  emerald: {
    cardBg: "bg-gradient-to-b from-emerald-50/70 via-white to-white",
    border: "border-emerald-200 shadow-[0_4px_20px_-4px_rgba(16,185,129,0.12)]",
    eyebrowBg: "bg-emerald-100 text-emerald-800 border-emerald-200",
    eyebrowText: "text-emerald-700",
    titleText: "text-zinc-900",
    bodyText: "text-zinc-600",
    badgeBg: "bg-emerald-600 text-white",
    badgeText: "text-white",
    btnBg: "bg-[#e53935]",
    btnText: "text-white",
    btnHover: "hover:bg-[#d32f2f]",
    accentDot: "bg-emerald-600",
  },
  violet: {
    cardBg: "bg-gradient-to-b from-purple-50/70 via-white to-white",
    border: "border-purple-200 shadow-[0_4px_20px_-4px_rgba(147,51,234,0.12)]",
    eyebrowBg: "bg-purple-100 text-purple-800 border-purple-200",
    eyebrowText: "text-purple-700",
    titleText: "text-zinc-900",
    bodyText: "text-zinc-600",
    badgeBg: "bg-purple-600 text-white",
    badgeText: "text-white",
    btnBg: "bg-[#e53935]",
    btnText: "text-white",
    btnHover: "hover:bg-[#d32f2f]",
    accentDot: "bg-purple-600",
  },
  indigo: {
    cardBg: "bg-gradient-to-b from-blue-50/70 via-white to-white",
    border: "border-blue-200 shadow-[0_4px_20px_-4px_rgba(37,99,235,0.12)]",
    eyebrowBg: "bg-blue-100 text-blue-800 border-blue-200",
    eyebrowText: "text-blue-700",
    titleText: "text-zinc-900",
    bodyText: "text-zinc-600",
    badgeBg: "bg-blue-600 text-white",
    badgeText: "text-white",
    btnBg: "bg-[#e53935]",
    btnText: "text-white",
    btnHover: "hover:bg-[#d32f2f]",
    accentDot: "bg-blue-600",
  },
  amber: {
    cardBg: "bg-gradient-to-b from-orange-50/70 via-white to-white",
    border: "border-orange-200 shadow-[0_4px_20px_-4px_rgba(249,115,22,0.12)]",
    eyebrowBg: "bg-orange-100 text-orange-800 border-orange-200",
    eyebrowText: "text-orange-700",
    titleText: "text-zinc-900",
    bodyText: "text-zinc-600",
    badgeBg: "bg-orange-500 text-white",
    badgeText: "text-white",
    btnBg: "bg-[#e53935]",
    btnText: "text-white",
    btnHover: "hover:bg-[#d32f2f]",
    accentDot: "bg-orange-500",
  },
};

export function CategoryFlashAdCard({ card, category, className }: CategoryFlashAdCardProps) {
  // Safe URL resolution to avoid any 404
  const ctaHref = React.useMemo(() => {
    const raw = card?.cta_url || category?.feature?.href || `/category/${category.handle}`;
    if (raw.startsWith("/business-solutions/end-to-end-packaging")) {
      return `/category/labels-packaging`;
    }
    if (raw.startsWith("/business-solutions")) {
      return `/bulk-quote`;
    }
    return raw;
  }, [card?.cta_url, category?.feature?.href, category.handle]);

  const toneKey: FlashCardTone = card?.tone || (category.feature?.tone as FlashCardTone) || "ink";
  const styles = TONE_STYLES[toneKey] || TONE_STYLES.ink;

  const eyebrow = card?.eyebrow || category.feature?.eyebrow || "FEATURED";
  const title = card?.title || category.feature?.title || category.title;
  const body = card?.body || category.feature?.body || category.blurb;
  const ctaText = card?.cta_text || category.feature?.cta || "Explore Now";
  const badgeText = card?.badge_text || null;
  const discountTag = card?.discount_tag || null;

  return (
    <div
      className={cn(
        "group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border p-5 transition-all duration-200 select-none",
        styles.cardBg,
        styles.border,
        className
      )}
    >
      {/* Top Header & Badges */}
      <div className="relative z-10 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-1.5">
          {eyebrow && (
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider border",
                styles.eyebrowBg
              )}
            >
              <span className={cn("size-1.5 rounded-full animate-pulse", styles.accentDot)} />
              {eyebrow}
            </span>
          )}

          {badgeText && (
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold shadow-xs",
                styles.badgeBg
              )}
            >
              <Sparkles className="size-3" />
              <span>{badgeText}</span>
            </span>
          )}
        </div>

        {/* Title & Description */}
        <div>
          <h4
            className={cn(
              "font-display text-base font-extrabold leading-snug tracking-tight",
              styles.titleText
            )}
          >
            {title}
          </h4>
          {body && (
            <p className={cn("mt-1.5 text-xs leading-relaxed line-clamp-3", styles.bodyText)}>
              {body}
            </p>
          )}
        </div>

        {/* Discount Pill if configured */}
        {discountTag && (
          <div className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 border border-red-200/80 px-2.5 py-1 text-xs font-bold text-red-600">
            <Tag className="size-3 shrink-0" />
            <span>{discountTag}</span>
          </div>
        )}

        {/* Product / Banner Image preview (E-commerce Style) */}
        {card?.image_url && (
          <div className="relative mt-2 h-28 w-full rounded-xl overflow-hidden border border-zinc-200 bg-zinc-50 shadow-xs">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={card.image_url}
              alt={title}
              className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}
      </div>

      {/* Bottom CTA Action Button — Bold high-contrast e-commerce button */}
      <div className="relative z-10 mt-5 pt-1">
        <Link
          href={ctaHref}
          className={cn(
            "group/btn inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold shadow-sm transition-all active:scale-[0.98]",
            styles.btnBg,
            styles.btnText,
            styles.btnHover
          )}
        >
          <span>{ctaText}</span>
          <ArrowRight className="size-3.5 transition-transform duration-200 group-hover/btn:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
