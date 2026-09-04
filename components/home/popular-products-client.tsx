"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRight, ArrowRight, LayoutGrid, Grid3X3 } from "lucide-react";
import type { Product } from "@/lib/commerce/types";
import { ProductCard } from "@/components/shared/product-card";
import { cn } from "@/lib/utils";

interface PopularProductsClientProps {
  products: Product[];
}

export function PopularProductsClient({ products }: PopularProductsClientProps) {
  // Density mode: 'compact' (3-4 cards across on tablet/desktop, dense on mobile) vs 'standard'
  const [viewMode, setViewMode] = React.useState<"compact" | "standard">("compact");

  return (
    <section className="shell">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between border-b border-border pb-4">
        <div>
          <div className="font-mono text-xs font-bold uppercase tracking-wider text-violet">
            Popular Choices
          </div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Popular Printing Products
          </h2>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3">
          {/* Card Density / Layout Toggle */}
          <div className="inline-flex items-center rounded-xl border border-zinc-200 bg-zinc-50/80 p-1 text-xs shadow-2xs">
            <button
              type="button"
              onClick={() => setViewMode("compact")}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-medium transition-all cursor-pointer",
                viewMode === "compact"
                  ? "bg-white text-zinc-900 shadow-xs font-bold"
                  : "text-zinc-500 hover:text-zinc-800"
              )}
              title="Dense Grid (3-4 across)"
            >
              <Grid3X3 className="size-3.5" />
              <span className="text-[11px]">3-4 Cards</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("standard")}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-medium transition-all cursor-pointer",
                viewMode === "standard"
                  ? "bg-white text-zinc-900 shadow-xs font-bold"
                  : "text-zinc-500 hover:text-zinc-800"
              )}
              title="Standard Grid (Larger cards)"
            >
              <LayoutGrid className="size-3.5" />
              <span className="text-[11px]">Standard</span>
            </button>
          </div>

          <Link
            href="/products"
            className="flex items-center gap-1 text-xs font-semibold text-violet hover:underline ml-1"
          >
            <span>View All</span>
            <ChevronRight className="size-3.5" />
          </Link>
        </div>
      </div>

      {/* Product Grid dynamically responding to toggle */}
      <div
        className={cn(
          "mt-6 transition-all duration-300",
          viewMode === "compact"
            ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-2.5 sm:gap-4"
            : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5"
        )}
      >
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            compact={viewMode === "compact"}
          />
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-6 py-3 text-xs font-bold text-ink shadow-sm hover:bg-paper transition-all"
        >
          <span>View All Products</span>
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </section>
  );
}
