import * as React from "react";
import Link from "next/link";
import { ArrowRight, Briefcase, ChevronRight } from "lucide-react";
import { getStorefrontAllProducts } from "@/lib/catalogue/storefront-queries";
import { ProductCard } from "@/components/shared/product-card";

export async function BusinessPrintingSection() {
  const allProducts = await getStorefrontAllProducts();
  const cards = allProducts.filter((p) => p.categoryHandles.includes("visiting-cards")).slice(0, 2);
  const stationery = allProducts.filter((p) => p.categoryHandles.includes("stationery-stamps") || p.categoryHandles.includes("stationery-office-essentials")).slice(0, 2);
  const businessProducts = [...cards, ...stationery];

  return (
    <section className="shell">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between border-b border-border pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wider text-violet">
            <Briefcase className="size-3.5" />
            <span>For Startups, Shops & Offices</span>
          </div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Business Printing & Stationery
          </h2>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Visiting cards, letterheads, brochures, stamps, signage and marketing collateral.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/category/visiting-cards"
            className="flex items-center gap-1 text-xs font-semibold text-violet hover:underline"
          >
            <span>Explore Business Printing</span>
            <ChevronRight className="size-3.5" />
          </Link>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4">
        {businessProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-paper p-4 text-xs">
        <div className="text-muted-foreground">
          Need custom volume, GST invoices, or dedicated artwork support for your team?
        </div>
        <Link
          href="/bulk-quote"
          className="inline-flex items-center gap-1.5 font-bold text-violet hover:underline"
        >
          <span>Request a Bulk Quote</span>
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </section>
  );
}
