import * as React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categories, getCategory } from "@/lib/data/categories";
import { getStorefrontCategory, getStorefrontAllProducts } from "@/lib/catalogue/storefront-queries";
import { getCategoryHeroBanners } from "@/lib/hero/queries";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { CategoryListingClient } from "@/components/category/category-listing-client";
import { CategoryHero } from "@/components/category/category-hero";

interface PageProps {
  params: Promise<{ handle: string }>;
}

export async function generateStaticParams() {
  return categories.map((c) => ({
    handle: c.handle,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { handle } = await params;
  const category = await getStorefrontCategory(handle);
  if (!category) return { title: "Category Not Found · PreetyPrints" };

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://preetyprints.in";
  const canonicalUrl = `${baseUrl}/category/${category.handle}`;

  return {
    title: `${category.title} Printing Online — Custom ${category.title} | PreetyPrints`,
    description: category.blurb || `Order custom ${category.title} online with live volume discounting and express delivery across India.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${category.title} Printing Online | PreetyPrints`,
      description: category.blurb || `Order custom ${category.title} online.`,
      url: canonicalUrl,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${category.title} Printing | PreetyPrints`,
      description: category.blurb,
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { handle } = await params;
  const category = await getStorefrontCategory(handle);
  if (!category) notFound();

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://preetyprints.com";

  // Schema.org BreadcrumbList Structured Data (JSON-LD)
  const breadcrumbsJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl,
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Products",
        "item": `${baseUrl}/products`,
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": category.title,
        "item": `${baseUrl}/category/${category.handle}`,
      },
    ],
  };

  const allProducts = await getStorefrontAllProducts();
  const products = allProducts.filter(
    (p) => p.categoryHandles.includes(handle) || p.categoryHandles.includes(category.handle)
  );

  const categoryBanners = await getCategoryHeroBanners(category.handle);

  return (
    <div className="shell py-8 space-y-8">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          { label: category.title },
        ]}
      />

      <CategoryHero category={category} banners={categoryBanners} />

      <CategoryListingClient category={category} initialProducts={products} />
    </div>
  );
}
