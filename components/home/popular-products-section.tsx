import * as React from "react";
import Link from "next/link";
import { ChevronRight, ArrowRight } from "lucide-react";
import { getFeaturedProducts } from "@/lib/data/products";
import { ProductCard } from "@/components/shared/product-card";

export function PopularProductsSection() {
  const products = getFeaturedProducts(8);

  return (
    <section className="shell">
      <div className="flex items-end justify-between border-b border-border pb-4">
        <div>
          <div className="font-mono text-xs font-bold uppercase tracking-wider text-violet">
            Popular Choices
          </div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Popular Printing Products
          </h2>
        </div>
        <Link
          href="/products"
          className="flex items-center gap-1 text-xs font-semibold text-violet hover:underline"
        >
          <span>View All Products</span>
          <ChevronRight className="size-3.5" />
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
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
