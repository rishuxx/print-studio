"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, Tag } from "lucide-react";
import { HeroBannerRecord } from "@/lib/hero/types";
import { Category } from "@/lib/commerce/types";
import { cn } from "@/lib/utils";

interface CategoryHeroProps {
  category: Category;
  banners?: HeroBannerRecord[];
}

export function CategoryHero({ category, banners = [] }: CategoryHeroProps) {
  const activeBanners = React.useMemo(() => {
    return banners.filter((b) => b.is_active);
  }, [banners]);

  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);
  const touchStartX = React.useRef<number | null>(null);
  const touchEndX = React.useRef<number | null>(null);

  // Auto slide timer (6 seconds, pauses on hover)
  React.useEffect(() => {
    if (activeBanners.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [activeBanners.length, isPaused]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // If no custom banners are uploaded/configured for this category in Admin, render the premium fallback banner
  if (activeBanners.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-2xl md:rounded-3xl border border-border/80 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 p-6 sm:p-10 md:p-12 text-white shadow-sheet">
        <div className="absolute -right-16 -top-16 size-72 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur-xs text-white">
            <Tag className="size-3 text-red-400 stroke-[2]" />
            <span>Curated Printing</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            {category.title}
          </h1>

          <p className="text-sm sm:text-base text-zinc-300 max-w-2xl leading-relaxed">
            {category.blurb || "High quality print craftsmanship with bulk tiered savings and express delivery across India."}
          </p>

          {category.feature && (
            <div className="pt-2">
              <div className="inline-block rounded-xl border border-white/15 bg-white/5 p-4 backdrop-blur-xs text-xs space-y-1 max-w-lg">
                <div className="font-bold text-red-300 flex items-center gap-1.5">
                  <Sparkles className="size-3.5" />
                  {category.feature.title}
                </div>
                <p className="text-zinc-300">{category.feature.body}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const hasMultiple = activeBanners.length > 1;

  return (
    <section
      className="relative w-full overflow-hidden rounded-2xl md:rounded-3xl border border-zinc-200/80 bg-zinc-950 shadow-sm transition-all"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label={`${category.title} Promotional Banners`}
    >
      <div className="relative w-full aspect-[4/5] sm:aspect-[16/7] md:aspect-[16/5.5] lg:aspect-[16/5] min-h-[300px] sm:min-h-[340px] md:min-h-[360px] lg:min-h-[390px] max-h-[500px]">
        {activeBanners.map((banner, index) => {
          const isSelected = index === currentIndex;
          const hasMobile = Boolean(banner.mobile_image_url);
          const hasDesktop = Boolean(banner.desktop_image_url);
          const bannerSrc = banner.desktop_image_url || banner.mobile_image_url || "";

          return (
            <div
              key={banner.id}
              className={cn(
                "absolute inset-0 size-full transition-opacity duration-500 ease-in-out overflow-hidden",
                isSelected ? "opacity-100 z-10" : "opacity-0 pointer-events-none z-0"
              )}
            >
              {/* Visual Image Banner with Responsive Picture & Adaptive Background Fill */}
              {hasDesktop || hasMobile ? (
                <div className="relative size-full overflow-hidden bg-zinc-950">
                  {bannerSrc && (
                    <div
                      className="absolute inset-0 size-full scale-110 blur-xl opacity-30 bg-center bg-cover pointer-events-none"
                      style={{ backgroundImage: `url(${bannerSrc})` }}
                      aria-hidden="true"
                    />
                  )}

                  <picture className="relative size-full block">
                    {hasMobile && (
                      <source
                        media="(max-width: 640px)"
                        srcSet={banner.mobile_image_url!}
                      />
                    )}
                    {hasDesktop && (
                      <source
                        media="(min-width: 641px)"
                        srcSet={banner.desktop_image_url}
                      />
                    )}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={bannerSrc}
                      alt={banner.alt_text || banner.title}
                      loading={index === 0 ? "eager" : "lazy"}
                      className="size-full object-cover object-center transform-gpu"
                    />
                  </picture>
                </div>
              ) : (
                <div className="size-full bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950" />
              )}

              {/* Dark Overlay */}
              {banner.overlay_enabled && (
                <div
                  className="absolute inset-0 bg-black"
                  style={{ opacity: (banner.overlay_opacity || 30) / 100 }}
                />
              )}

              {/* Content Mode 1: Image Only */}
              {banner.content_mode === "image_only" && banner.primary_cta_url && (
                <Link
                  href={banner.primary_cta_url}
                  className="absolute inset-0 z-20"
                  aria-label={banner.title}
                />
              )}

              {/* Content Mode 2: Image + Content Overlay */}
              {banner.content_mode === "image_overlay" && (
                <div className="absolute inset-0 z-20 flex flex-col justify-center p-6 sm:p-10 md:p-12 lg:p-14 max-w-2xl bg-gradient-to-t sm:bg-gradient-to-r from-black/85 via-black/55 to-transparent text-white">
                  {banner.eyebrow && (
                    <div className="inline-flex items-center gap-1.5 self-start rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider backdrop-blur-xs mb-3 text-white">
                      <Sparkles className="size-3 text-amber-300 stroke-[2]" />
                      <span>{banner.eyebrow}</span>
                    </div>
                  )}

                  <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-[1.15] text-white text-balance drop-shadow-xs">
                    {banner.title}
                  </h1>

                  {banner.subtitle && (
                    <p className="mt-2 text-sm sm:text-base font-medium text-white/90 line-clamp-2">
                      {banner.subtitle}
                    </p>
                  )}

                  {banner.description && (
                    <p className="mt-1 text-xs sm:text-sm leading-relaxed text-white/80 line-clamp-2 sm:line-clamp-3 max-w-lg">
                      {banner.description}
                    </p>
                  )}

                  {/* CTAs */}
                  {(banner.primary_cta_text || banner.secondary_cta_text) && (
                    <div className="mt-6 flex flex-wrap items-center gap-3">
                      {banner.primary_cta_text && banner.primary_cta_url && (
                        <Link
                          href={banner.primary_cta_url}
                          style={{
                            backgroundColor: banner.primary_cta_bg_color || "#e53935",
                            color: banner.primary_cta_text_color || "#ffffff",
                          }}
                          className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-bold shadow-md transition-transform hover:scale-102 active:scale-98"
                        >
                          <span>{banner.primary_cta_text}</span>
                          <ArrowRight className="size-4 stroke-[2]" />
                        </Link>
                      )}

                      {banner.secondary_cta_text && banner.secondary_cta_url && (
                        <Link
                          href={banner.secondary_cta_url}
                          style={{
                            backgroundColor: banner.secondary_cta_bg_color || "#ffffff",
                            color: banner.secondary_cta_text_color || "#222225",
                          }}
                          className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-semibold shadow-xs transition-colors hover:bg-white/90"
                        >
                          <span>{banner.secondary_cta_text}</span>
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Carousel Navigation Arrows */}
      {hasMultiple && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous Banner"
            className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-30 flex size-9 sm:size-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-xs border border-white/20 transition-all hover:bg-black/70 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <ChevronLeft className="size-5" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Next Banner"
            className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-30 flex size-9 sm:size-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-xs border border-white/20 transition-all hover:bg-black/70 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <ChevronRight className="size-5" />
          </button>
        </>
      )}

      {/* Pagination Dots */}
      {hasMultiple && (
        <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 p-1 rounded-full bg-black/30 backdrop-blur-xs border border-white/15">
          {activeBanners.map((_, dotIdx) => (
            <button
              key={dotIdx}
              type="button"
              onClick={() => setCurrentIndex(dotIdx)}
              aria-label={`Go to slide ${dotIdx + 1}`}
              className={cn(
                "size-2 sm:size-2.5 rounded-full transition-all cursor-pointer",
                dotIdx === currentIndex
                  ? "w-6 sm:w-7 bg-white"
                  : "bg-white/40 hover:bg-white/70"
              )}
            />
          ))}
        </div>
      )}
    </section>
  );
}
