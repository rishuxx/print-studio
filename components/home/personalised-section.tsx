import * as React from "react";
import Link from "next/link";
import { ChevronRight, Gift } from "lucide-react";
import { getProductsInCategory } from "@/lib/data/products";
import { ProductCard } from "@/components/shared/product-card";

export function PersonalisedSection() {
  const gifts = getProductsInCategory("personalised-gifts").slice(0, 4);

  return (
    <section className="shell">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between border-b border-border pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wider text-violet">
            <Gift className="size-3.5" />
            <span>Memories & Celebrations</span>
          </div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Personalised Gifts & Keepsakes
          </h2>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Photo mugs, canvas prints, custom frames, acrylic keepsakes and celebration cards.
          </p>
        </div>
        <Link
          href="/category/personalised-gifts"
          className="flex items-center gap-1 text-xs font-semibold text-violet hover:underline"
        >
          <span>Explore Personalised Gifts</span>
          <ChevronRight className="size-3.5" />
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4">
        {gifts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
