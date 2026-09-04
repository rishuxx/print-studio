import * as React from "react";
import type { Metadata } from "next";
import { getStorefrontAllProducts } from "@/lib/catalogue/storefront-queries";
import { getCategoryHeroBanners } from "@/lib/hero/queries";
import { getCategory } from "@/lib/data/categories";
import { ProductCard } from "@/components/shared/product-card";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { CategoryHero } from "@/components/category/category-hero";
import { Clock } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Same Day & Express Printing",
  description: "Express printing products eligible for quick turnaround and local dispatch.",
};

export default async function SameDayPage() {
  const allProducts = await getStorefrontAllProducts();
  const expressProducts = allProducts.filter((p) => p.sameDayEligible || p.badges.includes("same-day")).slice(0, 20);
  const sameDayCategory = getCategory("same-day") || {
    handle: "same-day",
    title: "Same Day & Express Printing",
    blurb: siteConfig.operations.sameDayMessage,
    icon: "Clock",
    inNav: true,
    inQuickStrip: true,
    groups: [],
    feature: {
      eyebrow: "Cut-off 11:00 AM",
      title: "Need it today?",
      body: "Order before 11 AM and collect from our local store the same evening. Local delivery options available.",
      href: "/same-day",
      cta: "See today's list",
      tone: "marigold",
    },
  };
  const banners = await getCategoryHeroBanners("same-day");

  return (
    <div className="shell py-8 space-y-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Same Day Printing" },
        ]}
      />

      <CategoryHero category={sameDayCategory} banners={banners} />

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
