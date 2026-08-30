import * as React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { quickStripCategories } from "@/lib/data/categories";
import { CategoryCard } from "@/components/shared/category-card";

export function CategorySection() {
  return (
    <section className="shell">
      <div className="flex items-end justify-between border-b border-border pb-4">
        <div>
          <div className="font-mono text-xs font-bold uppercase tracking-wider text-violet">
            Categories
          </div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Shop by Category
          </h2>
        </div>
        <Link
          href="/products"
          className="hidden items-center gap-1 text-xs font-semibold text-violet hover:underline sm:flex"
        >
          <span>View All Products</span>
          <ChevronRight className="size-3.5" />
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8">
        {quickStripCategories.map((category) => (
          <CategoryCard key={category.handle} category={category} />
        ))}
      </div>
    </section>
  );
}
