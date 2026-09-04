import * as React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categories, getCategory } from "@/lib/data/categories";
import { getStorefrontCategory, getStorefrontAllProducts } from "@/lib/catalogue/storefront-queries";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { CategoryListingClient } from "@/components/category/category-listing-client";

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

      <div className="rounded-2xl border border-border bg-paper p-6 sm:p-8 space-y-4">
        <div className="space-y-2">
          <h1 className="font-display text-3xl font-extrabold text-ink sm:text-4xl">
            {category.title}
          </h1>
          <p className="text-xs text-muted-foreground sm:text-sm max-w-2xl leading-relaxed">
            {category.blurb}
          </p>
        </div>

        {category.feature && (
          <div className="rounded-xl border border-violet/20 bg-white p-4 text-xs space-y-1">
            <div className="font-bold text-violet">{category.feature.title}</div>
            <p className="text-muted-foreground">{category.feature.body}</p>
          </div>
        )}
      </div>

      <CategoryListingClient category={category} initialProducts={products} />
    </div>
  );
}
