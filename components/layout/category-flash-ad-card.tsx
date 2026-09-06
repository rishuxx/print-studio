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
 * Clean, crisp white & red primary branding, high-contrast typography.
 */
const TONE_STYLES: Record<
  FlashCardTone,
  {
    cardBg: string;
    border: string;
    eyebrowText: string;
    titleText: string;
    bodyText: string;
    badgeBg: string;
    badgeText: string;
    btnBg: string;
    btnText: string;
    btnHover: string;
  }
> = {
  rose: {
    cardBg: "bg-white",
    border: "border-zinc-200 shadow-sm hover:border-red-300",
    eyebrowText: "text-red-600",
    titleText: "text-zinc-900",
    bodyText: "text-zinc-600",
    badgeBg: "bg-red-500 text-white",
    badgeText: "text-white",
    btnBg: "bg-[#e53935]",
    btnText: "text-white",
    btnHover: "hover:bg-[#d32f2f]",
  },
  ink: {
    cardBg: "bg-white",
    border: "border-zinc-200 shadow-sm hover:border-red-300",
    eyebrowText: "text-red-600",
    titleText: "text-zinc-950",
    bodyText: "text-zinc-600",
    badgeBg: "bg-red-600 text-white",
    badgeText: "text-white",
    btnBg: "bg-[#e53935]",
    btnText: "text-white",
    btnHover: "hover:bg-[#c62828]",
  },
  marigold: {
    cardBg: "bg-white",
    border: "border-zinc-200 shadow-sm hover:border-amber-300",
    eyebrowText: "text-amber-700",
    titleText: "text-zinc-900",
    bodyText: "text-zinc-600",
    badgeBg: "bg-amber-500 text-white",
    badgeText: "text-white",
    btnBg: "bg-[#e53935]",
    btnText: "text-white",
    btnHover: "hover:bg-[#d32f2f]",
  },
  emerald: {
    cardBg: "bg-white",
    border: "border-zinc-200 shadow-sm hover:border-emerald-300",
    eyebrowText: "text-emerald-700",
    titleText: "text-zinc-900",
    bodyText: "text-zinc-600",
    badgeBg: "bg-emerald-600 text-white",
    badgeText: "text-white",
    btnBg: "bg-[#e53935]",
    btnText: "text-white",
    btnHover: "hover:bg-[#d32f2f]",
  },
  violet: {
    cardBg: "bg-white",
    border: "border-zinc-200 shadow-sm hover:border-purple-300",
    eyebrowText: "text-purple-700",
    titleText: "text-zinc-900",
    bodyText: "text-zinc-600",
    badgeBg: "bg-purple-600 text-white",
    badgeText: "text-white",
    btnBg: "bg-[#e53935]",
    btnText: "text-white",
    btnHover: "hover:bg-[#d32f2f]",
  },
  indigo: {
    cardBg: "bg-white",
    border: "border-zinc-200 shadow-sm hover:border-blue-300",
    eyebrowText: "text-blue-700",
    titleText: "text-zinc-900",
    bodyText: "text-zinc-600",
    badgeBg: "bg-blue-600 text-white",
    badgeText: "text-white",
    btnBg: "bg-[#e53935]",
    btnText: "text-white",
    btnHover: "hover:bg-[#d32f2f]",
  },
  amber: {
    cardBg: "bg-white",
    border: "border-zinc-200 shadow-sm hover:border-orange-300",
    eyebrowText: "text-orange-700",
    titleText: "text-zinc-900",
    bodyText: "text-zinc-600",
    badgeBg: "bg-orange-500 text-white",
    badgeText: "text-white",
    btnBg: "bg-[#e53935]",
    btnText: "text-white",
    btnHover: "hover:bg-[#d32f2f]",
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
  const hasImage = Boolean(card?.image_url);
  const bannerStyle: "full_overlay" | "photo_only" = card?.banner_style || "full_overlay";
  const ctaStyle = card?.cta_style || "primary_red";
  const showCta = card?.show_cta !== false;

  // Resolve CTA button styling based on selected control
  const ctaBtnClasses = React.useMemo(() => {
    switch (ctaStyle) {
      case "dark":
        return "bg-zinc-950 text-white hover:bg-zinc-800 shadow-md";
      case "white":
        return "bg-white text-zinc-950 hover:bg-zinc-100 shadow-md font-bold";
      case "outline":
        return "bg-black/40 backdrop-blur-md text-white border border-white/40 hover:bg-black/60 shadow-sm";
      case "primary_red":
      default:
        return cn(styles.btnBg, styles.btnText, styles.btnHover, "shadow-md");
    }
  }, [ctaStyle, styles.btnBg, styles.btnText, styles.btnHover]);

  // When image is uploaded
  if (hasImage && card?.image_url) {
    // Mode A: ONLY PHOTO BANNER (Pure graphic flyer/banner with optional clickable CTA overlay)
    if (bannerStyle === "photo_only") {
      return (
        <Link
          href={ctaHref}
          className={cn(
            "group relative flex h-full min-h-[320px] w-full flex-col justify-end overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-900 transition-all duration-300 hover:shadow-xl hover:border-red-400 select-none",
            className
          )}
        >
          {/* Full Card Background Image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={card.image_url}
            alt={title || "Promotional Banner"}
            className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* If CTA is enabled, show an elegant floating bottom CTA pill or button */}
          {showCta && ctaStyle !== "none" && (
            <div className="relative z-10 p-3.5 bg-gradient-to-t from-black/85 via-black/30 to-transparent">
              <span
                className={cn(
                  "inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all group-hover:brightness-110 active:scale-[0.98]",
                  ctaBtnClasses
                )}
              >
                <span>{ctaText}</span>
                <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              </span>
            </div>
          )}
        </Link>
      );
    }

    // Mode B: PHOTO BANNER WITH TEXTS & HEADLINE & CTA (Blinkit / Swiggy style card)
    return (
      <Link
        href={ctaHref}
        className={cn(
          "group relative flex h-full min-h-[320px] w-full flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-900 transition-all duration-300 hover:shadow-xl hover:border-red-400 select-none",
          className
        )}
      >
        {/* Full Card Background Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={card.image_url}
          alt={title}
          className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Ambient dual gradients: top for badges, bottom for readable text */}
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

        {/* Top Badges overlay: Clean text eyebrow + badge */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-1.5 p-4">
          {eyebrow && (
            <span className="text-[11px] font-black uppercase tracking-wider text-white drop-shadow-md">
              {eyebrow}
            </span>
          )}

          {badgeText && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#e53935] px-2.5 py-0.5 text-[11px] font-bold text-white shadow-sm">
              <Sparkles className="size-3" />
              <span>{badgeText}</span>
            </span>
          )}
        </div>

        {/* Bottom Content & Button Overlay */}
        <div className="relative z-10 space-y-2.5 p-4 pt-0">
          <div>
            <h4 className="font-display text-base sm:text-lg font-extrabold leading-snug tracking-tight text-white drop-shadow-md">
              {title}
            </h4>
            {body && (
              <p className="mt-1 text-xs leading-relaxed text-zinc-200 line-clamp-2 drop-shadow-sm">
                {body}
              </p>
            )}
            {discountTag && (
              <div className="mt-1.5 inline-flex items-center gap-1 rounded-md bg-white/20 backdrop-blur-md px-2 py-0.5 text-[11px] font-bold text-white border border-white/20">
                <Tag className="size-3 shrink-0" />
                <span>{discountTag}</span>
              </div>
            )}
          </div>

          {showCta && ctaStyle !== "none" && (
            <div className="pt-1">
              <span
                className={cn(
                  "inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all group-hover:brightness-110 active:scale-[0.98]",
                  ctaBtnClasses
                )}
              >
                <span>{ctaText}</span>
                <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              </span>
            </div>
          )}
        </div>
      </Link>
    );
  }

  // Text-Only Fallback Card (When no image is uploaded)
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
          {/* Clean Eyebrow Text Only — NO container pill, NO vibe-coding */}
          {eyebrow && (
            <span className={cn("text-[11px] font-extrabold uppercase tracking-wider", styles.eyebrowText)}>
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
      </div>

      {/* Bottom CTA Action Button */}
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
