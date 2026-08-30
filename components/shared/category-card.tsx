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
          "group flex items-center gap-3 rounded-xl border border-border bg-white p-3 transition-all duration-200 hover:border-violet hover:shadow-sheet",
          className
        )}
      >
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-violet-wash text-violet-deep transition-colors group-hover:bg-violet group-hover:text-white">
          <Icon name={category.icon} className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="truncate text-sm font-bold text-ink group-hover:text-violet">
            {category.title}
          </h4>
          <p className="truncate text-xs text-muted-foreground">{category.blurb}</p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/category/${category.handle}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-white transition-all duration-300 hover:-translate-y-1 hover:border-violet/30 hover:shadow-lift",
        className
      )}
    >
      {/* Category Mockup Top Visual */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-paper">
        <ProductMockup
          kind={category.mockup || "card-stack"}
          tone="#f1edfb"
          className="group-hover:scale-105"
        />
        <div className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-lg bg-white/90 shadow-sm backdrop-blur-sm text-violet-deep">
          <Icon name={category.icon} className="size-4" />
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold text-ink transition-colors group-hover:text-violet">
          {category.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {category.blurb}
        </p>

        <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-violet">
          <span>Explore collection</span>
          <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
