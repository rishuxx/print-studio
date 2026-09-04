import * as React from "react";
import type { Metadata } from "next";
import { getStorefrontAllProducts } from "@/lib/catalogue/storefront-queries";
import { ProductCard } from "@/components/shared/product-card";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Clock } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Same Day & Express Printing",
  description: "Express printing products eligible for quick turnaround and local dispatch.",
};

export default async function SameDayPage() {
  const allProducts = await getStorefrontAllProducts();
  const expressProducts = allProducts.filter((p) => p.sameDayEligible || p.badges.includes("same-day")).slice(0, 20);

  return (
    <div className="shell py-8 space-y-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Same Day Printing" },
        ]}
      />

      <div className="rounded-3xl border border-zinc-200/80 bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 p-6 sm:p-10 text-white space-y-4 shadow-sheet">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/20 border border-primary/40 px-3 py-1 font-mono text-xs font-bold uppercase text-red-200">
          <Clock className="size-3.5 stroke-[1.75] text-red-400" />
          <span>Express Production</span>
        </div>
        <h1 className="font-display text-3xl font-extrabold text-white sm:text-4xl">
          Same Day & Quick Turnaround Printing
        </h1>
        <p className="text-xs text-zinc-300 sm:text-sm max-w-2xl leading-relaxed">
          {siteConfig.operations.sameDayMessage}. Need prints urgently for a meeting, conference, or event? Browse products eligible for expedited production.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-ink">
            Express Eligible Items ({expressProducts.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {expressProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
