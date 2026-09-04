"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Category } from "@/lib/commerce/types";
import { Icon } from "@/lib/icon-map";
import { ProductMockup } from "./product-mockup";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  category: Category;
  className?: string;
  variant?: "tile" | "banner" | "compact";
}

export function CategoryCard({ category, className, variant = "tile" }: CategoryCardProps) {
  if (variant === "compact") {
    return (
      <Link
        href={`/category/${category.handle}`}
        className={cn(
          "group flex items-center gap-3 rounded-xl border border-border/80 bg-white p-3 transition-all duration-200 hover:border-primary/40 hover:shadow-sm",
          className
        )}
      >
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600 transition-colors group-hover:bg-primary group-hover:text-white">
          <Icon name={category.icon} className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="truncate text-sm font-semibold text-zinc-900 group-hover:text-primary">
            {category.title}
          </h4>
          <p className="truncate text-xs text-zinc-500">{category.blurb}</p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/category/${category.handle}`}
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-3.5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md",
        className
      )}
    >
      {/* Category Visual - Displays Custom Uploaded Image or Silhouette Graphic */}
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-zinc-100/90 flex items-center justify-center">
        {category.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={category.image_url}
            alt={category.title}
            className="size-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <ProductMockup
            kind={category.mockup || "card-stack"}
            tone="transparent"
            className="size-full p-3 transition-transform duration-300 group-hover:scale-110"
          />
        )}
        {/* Soft-cornered floating icon badge */}
        <div className="absolute right-2.5 top-2.5 flex size-7 items-center justify-center rounded-lg bg-white/95 shadow-2xs border border-zinc-200/70 text-zinc-500 backdrop-blur-xs transition-colors duration-200 group-hover:text-primary group-hover:border-primary/20">
          <Icon name={category.icon} className="size-3.5" />
        </div>
      </div>

      {/* Info bottom - legible title and subtitle */}
      <div className="mt-3 flex flex-col px-0.5">
        <div className="flex items-center justify-between gap-1.5">
          <h3 className="truncate text-xs font-bold text-zinc-900 transition-colors group-hover:text-primary sm:text-sm">
            {category.title}
          </h3>
          <ArrowRight className="size-3.5 shrink-0 text-zinc-400 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-primary" />
        </div>
        <p className="mt-0.5 line-clamp-1 text-[11px] font-medium text-zinc-500">
          {category.blurb}
        </p>
      </div>
    </Link>
  );
}
