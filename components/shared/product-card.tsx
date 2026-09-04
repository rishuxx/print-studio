"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowRight, Star } from "lucide-react";
import type { Product } from "@/lib/commerce/types";
import { formatMoney } from "@/lib/pricing";
import { CatalogBadge } from "@/components/ui/badge";
import { ProductMockup } from "./product-mockup";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  className?: string;
  compact?: boolean;
}

export function ProductCard({ product, className, compact = false }: ProductCardProps) {
  const primaryImage = product.images[0] || {
    url: "",
    altText: product.title,
    width: 1200,
    height: 1200,
    kind: "generic",
    tone: "#f1edfb",
  };

  const primaryBadge = product.badges[0];

  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-200/80 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-sheet",
        className
      )}
    >
      {/* Product Image / Mockup Surface */}
      <Link
        href={`/product/${product.handle}`}
        className="relative block aspect-[4/3] w-full overflow-hidden bg-paper"
      >
        {primaryImage.url && !primaryImage.url.includes("placeholder-product.png") ? (
          <Image
            src={primaryImage.url}
            alt={primaryImage.altText || product.title}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            loading="lazy"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <ProductMockup
            kind={primaryImage.kind}
            tone={primaryImage.tone}
            aria-label={primaryImage.altText || product.title}
          />
        )}

        {/* Top Badges */}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5 z-10">
          {primaryBadge && <CatalogBadge kind={primaryBadge} size="sm" />}
          {product.sameDayEligible && primaryBadge !== "same-day" && (
            <span className="inline-flex items-center gap-1 rounded-md bg-marigold-wash px-1.5 py-0.5 font-mono text-[0.625rem] font-semibold uppercase text-marigold-deep border border-marigold/30">
              <Clock className="size-2.5 stroke-[2]" /> Express
            </span>
          )}
        </div>

        {/* Subtle hover overlay indicator */}
        <div className="absolute inset-0 bg-ink/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </Link>

      {/* Body Info */}
      <div className="flex flex-1 flex-col p-3 sm:p-5">
        <div className="mb-1.5 flex items-center justify-between gap-1 sm:gap-2">
          <span className="font-mono text-[0.5625rem] sm:text-[0.6875rem] uppercase tracking-wider text-muted-foreground truncate">
            {product.productType}
          </span>
          {product.rating > 0 && (
            <span className="inline-flex items-center gap-1 font-mono text-xs text-ink">
              <Star className="size-3 fill-marigold text-marigold" />
              <span>{product.rating}</span>
              <span className="text-muted-foreground text-[0.6875rem]">({product.reviewCount})</span>
            </span>
          )}
        </div>

        <h3 className="line-clamp-2 sm:line-clamp-1 text-sm sm:text-base font-bold text-zinc-800 transition-colors group-hover:text-primary">
          <Link href={`/product/${product.handle}`}>{product.title}</Link>
        </h3>

        {!compact && (
          <p className="mt-1 hidden sm:-webkit-box line-clamp-2 text-xs leading-relaxed text-zinc-500">
            {product.subtitle || product.description}
          </p>
        )}

        {/* Footer with Pricing and CTA */}
        <div className="mt-auto pt-3 sm:pt-4 flex items-end justify-between border-t border-zinc-100">
          <div>
            <span className="block font-mono text-[0.5rem] sm:text-[0.625rem] uppercase tracking-wider text-zinc-400">
              Starting from
            </span>
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-0 sm:gap-1.5">
              <span className="font-display text-base sm:text-lg font-extrabold text-zinc-800 leading-none">
                {formatMoney(product.priceFrom)}
              </span>
              {product.compareAtFrom && (
                <span className="font-mono text-[0.625rem] sm:text-xs text-zinc-400 line-through">
                  {formatMoney(product.compareAtFrom)}
                </span>
              )}
            </div>
            <span className="font-mono text-[0.5rem] sm:text-[0.625rem] text-zinc-500 mt-0.5 sm:mt-0 block">
              {product.priceUnit}
            </span>
          </div>

          <Link
            href={`/product/${product.handle}`}
            className="inline-flex size-7 sm:size-9 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500 transition-all duration-200 group-hover:bg-primary group-hover:text-white"
            aria-label={`Configure ${product.title}`}
          >
            <ArrowRight className="size-3.5 sm:size-4 stroke-[1.75]" />
          </Link>
        </div>
      </div>
    </div>
  );
}
