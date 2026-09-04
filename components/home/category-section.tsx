"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { quickStripCategories } from "@/lib/data/categories";
import { CategoryCard } from "@/components/shared/category-card";

export function CategorySection() {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);

  const checkScroll = React.useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
  }, []);

  React.useEffect(() => {
    checkScroll();
    const el = scrollContainerRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  const handleScroll = (direction: "left" | "right") => {
    const el = scrollContainerRef.current;
    if (!el) return;
    // Scroll approximately 2 to 3 card widths at a time
    const scrollAmount = el.clientWidth * 0.75;
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section className="shell">
      {/* Header with Title and Carousel Controls */}
      <div className="flex items-end justify-between border-b border-border/80 pb-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-primary">
            Categories
          </div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
            Shop by Category
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/products"
            className="group hidden items-center gap-1 text-xs font-semibold text-zinc-600 hover:text-primary transition-colors sm:flex mr-1"
          >
            <span>View All Products</span>
            <ChevronRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>

          {/* Carousel Arrows */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleScroll("left")}
              disabled={!canScrollLeft}
              className="flex size-9 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-700 shadow-2xs transition-all hover:bg-zinc-50 hover:border-zinc-300 active:scale-95 disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer"
              aria-label="Scroll categories left"
            >
              <ChevronLeft className="size-4 stroke-[2.25]" />
            </button>
            <button
              type="button"
              onClick={() => handleScroll("right")}
              disabled={!canScrollRight}
              className="flex size-9 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-700 shadow-2xs transition-all hover:bg-zinc-50 hover:border-zinc-300 active:scale-95 disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer"
              aria-label="Scroll categories right"
            >
              <ChevronRight className="size-4 stroke-[2.25]" />
            </button>
          </div>
        </div>
      </div>

      {/* Carousel Track: shows ~5 to 6 cards on desktop, 3 to 4 on tablet, 2 on mobile */}
      <div className="relative mt-6">
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scroll-smooth pb-3 pt-1 no-scrollbar snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {quickStripCategories.map((category) => (
            <div
              key={category.handle}
              className="w-[calc(50%-8px)] sm:w-[calc(33.333%-11px)] md:w-[calc(25%-12px)] lg:w-[calc(19%-12px)] xl:w-[calc(16.666%-14px)] shrink-0 snap-start"
            >
              <CategoryCard category={category} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
