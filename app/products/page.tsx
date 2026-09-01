import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getStorefrontAllProducts } from "@/lib/catalogue/storefront-queries";
import { categories } from "@/lib/data/categories";
import { ProductCard } from "@/components/shared/product-card";
import { CategoryCard } from "@/components/shared/category-card";

export const metadata: Metadata = {
  title: "All Products — Print Catalogue",
  description: "Browse all custom printing products, stationery, apparel, gifts, and packaging.",
};

export default async function ProductsPage() {
  const allProducts = await getStorefrontAllProducts();

  return (
    <div className="shell py-8 space-y-10">
      <div className="space-y-3">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-ink transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Home</span>
        </Link>
        <h1 className="font-display text-3xl font-extrabold text-ink sm:text-4xl">
          All Products & Categories
        </h1>
        <p className="text-xs text-muted-foreground sm:text-sm max-w-2xl">
          Browse our complete catalogue of custom print products across major printing categories.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="space-y-4">
        <h2 className="font-display text-xl font-bold text-ink">Categories</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {categories.map((cat) => (
            <CategoryCard key={cat.handle} category={cat} />
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="space-y-4 pt-6 border-t border-border">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-ink">All Products</h2>
          <span className="font-mono text-xs text-muted-foreground">
            {allProducts.length} Products
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {allProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
