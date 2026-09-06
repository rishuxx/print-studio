"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Tag, CheckCircle2 } from "lucide-react";
import { CategoryFlashCard, FlashCardTone } from "@/lib/flash-cards/types";
import { Category } from "@/lib/commerce/types";
import { cn } from "@/lib/utils";

interface CategoryFlashAdCardProps {
  card?: CategoryFlashCard;
  category: Category;
  className?: string;
}

const TONE_STYLES: Record<
  FlashCardTone,
  {
    wrapper: string;
    glow: string;
    eyebrow: string;
    title: string;
    body: string;
    badge: string;
    button: string;
    arrow: string;
  }
> = {
  emerald: {
    wrapper:
      "bg-gradient-to-br from-emerald-950 via-zinc-900 to-zinc-950 text-white border border-emerald-500/30 shadow-[0_8px_30px_rgb(16,185,129,0.15)]",
    glow: "bg-emerald-500/20",
    eyebrow: "text-emerald-400 font-mono",
    title: "text-white",
    body: "text-zinc-300",
    badge: "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30",
    button:
      "bg-emerald-500 text-zinc-950 hover:bg-emerald-400 font-bold shadow-[0_4px_14px_rgba(16,185,129,0.39)]",
    arrow: "text-zinc-950",
  },
  violet: {
    wrapper:
      "bg-gradient-to-br from-[#1e0e4b] via-zinc-900 to-[#0e0720] text-white border border-violet-500/30 shadow-[0_8px_30px_rgb(124,58,237,0.2)]",
    glow: "bg-violet-500/20",
    eyebrow: "text-violet-300 font-mono",
    title: "text-white",
    body: "text-zinc-300",
    badge: "bg-violet-500/20 text-violet-200 border border-violet-400/30",
    button:
      "bg-violet text-white hover:bg-violet-lift font-bold shadow-[0_4px_14px_rgba(124,58,237,0.4)]",
    arrow: "text-white",
  },
  marigold: {
    wrapper:
      "bg-gradient-to-br from-[#3b1f04] via-zinc-900 to-zinc-950 text-white border border-amber-500/30 shadow-[0_8px_30px_rgb(245,158,11,0.15)]",
    glow: "bg-amber-500/20",
    eyebrow: "text-amber-400 font-mono",
    title: "text-white",
    body: "text-zinc-300",
    badge: "bg-amber-500/20 text-amber-200 border border-amber-400/30",
    button:
      "bg-amber-500 text-zinc-950 hover:bg-amber-400 font-bold shadow-[0_4px_14px_rgba(245,158,11,0.35)]",
    arrow: "text-zinc-950",
  },
  indigo: {
    wrapper:
      "bg-gradient-to-br from-[#0c1b40] via-zinc-900 to-zinc-950 text-white border border-indigo-500/30 shadow-[0_8px_30px_rgb(99,102,241,0.18)]",
    glow: "bg-indigo-500/20",
    eyebrow: "text-indigo-400 font-mono",
    title: "text-white",
    body: "text-zinc-300",
    badge: "bg-indigo-500/20 text-indigo-200 border border-indigo-400/30",
    button:
      "bg-indigo-600 text-white hover:bg-indigo-500 font-bold shadow-[0_4px_14px_rgba(99,102,241,0.35)]",
    arrow: "text-white",
  },
  rose: {
    wrapper:
      "bg-gradient-to-br from-[#3f0d23] via-zinc-900 to-zinc-950 text-white border border-rose-500/30 shadow-[0_8px_30px_rgb(244,63,94,0.18)]",
    glow: "bg-rose-500/20",
    eyebrow: "text-rose-400 font-mono",
    title: "text-white",
    body: "text-zinc-300",
    badge: "bg-rose-500/20 text-rose-200 border border-rose-400/30",
    button:
      "bg-rose-600 text-white hover:bg-rose-500 font-bold shadow-[0_4px_14px_rgba(244,63,94,0.35)]",
    arrow: "text-white",
  },
  amber: {
    wrapper:
      "bg-gradient-to-br from-[#3a2203] via-zinc-900 to-zinc-950 text-white border border-orange-500/30 shadow-[0_8px_30px_rgb(249,115,22,0.18)]",
    glow: "bg-orange-500/20",
    eyebrow: "text-orange-400 font-mono",
    title: "text-white",
    body: "text-zinc-300",
    badge: "bg-orange-500/20 text-orange-200 border border-orange-400/30",
    button:
      "bg-orange-500 text-zinc-950 hover:bg-orange-400 font-bold shadow-[0_4px_14px_rgba(249,115,22,0.35)]",
    arrow: "text-zinc-950",
  },
  ink: {
    wrapper:
      "bg-gradient-to-br from-zinc-900 via-zinc-900 to-black text-white border border-zinc-700/60 shadow-[0_8px_30px_rgb(0,0,0,0.3)]",
    glow: "bg-primary/15",
    eyebrow: "text-zinc-400 font-mono",
    title: "text-white",
    body: "text-zinc-300",
    badge: "bg-white/10 text-zinc-200 border border-white/15",
    button:
      "bg-white text-zinc-950 hover:bg-zinc-100 font-bold shadow-[0_4px_14px_rgba(255,255,255,0.25)]",
    arrow: "text-zinc-950",
  },
};

export function CategoryFlashAdCard({ card, category, className }: CategoryFlashAdCardProps) {
  // Safe URL resolution to avoid any 404
  const ctaHref = React.useMemo(() => {
    const raw = card?.cta_url || category?.feature?.href || `/category/${category.handle}`;
    // Replace obsolete 404 links
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

  const eyebrow = card?.eyebrow || category.feature?.eyebrow || "FEATURED PROMOTION";
  const title = card?.title || category.feature?.title || category.title;
  const body = card?.body || category.feature?.body || category.blurb;
  const ctaText = card?.cta_text || category.feature?.cta || "Explore Collection";
  const badgeText = card?.badge_text || card?.discount_tag || null;

  return (
    <div
      className={cn(
        "group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl select-none",
        styles.wrapper,
        className
      )}
    >
      {/* Decorative radial background glow */}
      <div
        className={cn(
          "pointer-events-none absolute -top-12 -right-12 size-40 rounded-full blur-3xl opacity-50 transition-opacity duration-300 group-hover:opacity-80",
          styles.glow
        )}
      />

      {/* Top Header info */}
      <div className="relative z-10 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className={cn("text-[0.6875rem] font-bold tracking-wider uppercase", styles.eyebrow)}>
            {eyebrow}
          </span>
          {badgeText && (
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold tracking-tight",
                styles.badge
              )}
            >
              <Sparkles className="size-2.5 shrink-0" />
              <span>{badgeText}</span>
            </span>
          )}
        </div>

        <div>
          <h4 className={cn("font-display text-base font-extrabold leading-snug tracking-tight", styles.title)}>
            {title}
          </h4>
          {body && (
            <p className={cn("mt-2 text-xs leading-relaxed opacity-90 line-clamp-3", styles.body)}>
              {body}
            </p>
          )}
        </div>

        {/* Optional Showcase Image preview */}
        {card?.image_url && (
          <div className="relative mt-2 h-20 w-full rounded-xl overflow-hidden border border-white/10 bg-black/20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={card.image_url}
              alt={title}
              className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}
      </div>

      {/* Bottom CTA Action Button */}
      <div className="relative z-10 mt-6 pt-2">
        <Link
          href={ctaHref}
          className={cn(
            "group/btn inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs transition-all active:scale-[0.98]",
            styles.button
          )}
        >
          <span>{ctaText}</span>
          <ArrowRight
            className={cn(
              "size-3.5 transition-transform duration-200 group-hover/btn:translate-x-1",
              styles.arrow
            )}
          />
        </Link>
      </div>
    </div>
  );
}
