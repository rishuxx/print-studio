import * as React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getStorefrontProduct, getStorefrontCategory, getStorefrontAllProducts, getStorefrontReviews } from "@/lib/catalogue/storefront-queries";
import { getAllProducts } from "@/lib/data/products";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { CatalogBadge } from "@/components/ui/badge";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductConfigurator } from "@/components/product/product-configurator";
import { ProductCard } from "@/components/shared/product-card";
import { ProductReviews } from "@/components/product/product-reviews";
import { CheckCircle2, FileCheck, Layers, HelpCircle, PauseCircle, ShieldAlert } from "lucide-react";

interface PageProps {
  params: Promise<{ handle: string }>;
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { handle } = await params;
  const decodedHandle = decodeURIComponent(handle).toLowerCase().replace(/\s+/g, '-');
  const product = await getStorefrontProduct(decodedHandle);
  if (!product) return { title: "Product Not Found · PreetyPrints" };

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://preetyprints.com";
  const canonicalUrl = `${baseUrl}/product/${product.handle}`;
  const primaryImage = product.images[0]?.url || `${baseUrl}/og-image.jpg`;

  return {
    title: `${product.title} — Custom Printing Online | PreetyPrints`,
    description: product.description || product.subtitle || `Order custom ${product.title} online with live instant price calculation and express delivery across India.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${product.title} — Premium Custom Printing | PreetyPrints`,
      description: product.subtitle || product.description,
      url: canonicalUrl,
      images: [
        {
          url: primaryImage,
          alt: product.title,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.title} | PreetyPrints`,
      description: product.subtitle || product.description,
      images: [primaryImage],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { handle } = await params;
  const decodedHandle = decodeURIComponent(handle).toLowerCase().replace(/\s+/g, '-');
  const product = await getStorefrontProduct(decodedHandle);
  if (!product) notFound();

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://preetyprints.com";

  // Find primary category for breadcrumbs & related products
  const primaryCategoryHandle = product.categoryHandles[0] ?? "visiting-cards";
  const category = await getStorefrontCategory(primaryCategoryHandle);

  // Authoritative representative starting price in INR (converted from paise)
  const startingPriceInr = (product.priceFrom.amount / 100).toFixed(2);

  // Schema.org Product Structured Data (JSON-LD)
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "description": product.description || product.subtitle,
    "image": product.images.map((img) => img.url),
    "sku": product.variants[0]?.sku || `PRN-${product.id}`,
    "brand": {
      "@type": "Brand",
      "name": "PreetyPrints",
    },
    "offers": {
      "@type": "Offer",
      "url": `${baseUrl}/product/${product.handle}`,
      "priceCurrency": "INR",
      "price": startingPriceInr,
      "priceValidUntil": "2027-12-31",
      "availability": "https://schema.org/InStock",
      "itemCondition": "https://schema.org/NewCondition",
    },
  };

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
        "name": category?.title ?? "Catalogue",
        "item": `${baseUrl}/category/${primaryCategoryHandle}`,
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": product.title,
        "item": `${baseUrl}/product/${product.handle}`,
      },
    ],
  };

  // Sibling related products
  const allProducts = await getStorefrontAllProducts();
  let relatedProducts = allProducts.filter((p) => product.relatedHandles.includes(p.handle));

  if (relatedProducts.length === 0) {
    relatedProducts = allProducts
      .filter((p) => p.categoryHandles.includes(primaryCategoryHandle) && p.handle !== product.handle)
      .slice(0, 4);
  }

  // Reviews
  const reviews = await getStorefrontReviews(product.id);

  return (
    <div className="shell py-8 space-y-12">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />
      {/* 1. Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: category?.title ?? "Catalogue", href: `/category/${primaryCategoryHandle}` },
          { label: product.title },
        ]}
      />

      {/* 2. Main 2-Column Product Configurator Zone */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
        {/* Left: Interactive Image Gallery */}
        <div className="lg:col-span-6">
          <ProductGallery images={product.images} title={product.title} />
        </div>

        {/* Right: Product Metadata & Interactive Configurator */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-1.5">
              {product.badges.map((badge) => (
                <CatalogBadge key={badge} kind={badge} />
              ))}
              <span className="font-mono text-xs text-muted-foreground ml-1">
                SKU: {product.variants[0]?.sku || `PRN-${product.id}`}
              </span>
            </div>

            <h1 className="font-display text-2xl font-extrabold text-ink sm:text-3xl lg:text-4xl">
              {product.title}
            </h1>

            <p className="text-xs text-muted-foreground sm:text-sm leading-relaxed">
              {product.subtitle}
            </p>
          </div>

          {/* Interactive Configurator wrapped in Suspense for useSearchParams */}
          <React.Suspense
            fallback={
              <div className="rounded-2xl border border-border bg-paper p-8 text-center text-xs text-muted-foreground">
                Loading configurator...
              </div>
            }
          >
            <ProductConfigurator product={product} />
          </React.Suspense>
        </div>
      </div>

      {/* 3. Specifications & Quality Guarantees */}
      <div className="rounded-2xl border border-border bg-paper p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2 text-ink">
          <Layers className="size-5 text-violet" />
          <h2 className="font-display text-xl font-bold">Print & Manufacturing Specifications</h2>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {product.specs.map((spec, i) => (
            <div key={i} className="rounded-xl border border-border bg-white p-4 space-y-1">
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                {spec.label}
              </span>
              <div className="font-bold text-sm text-ink">{spec.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Ratings & Reviews */}
      <ProductReviews 
        productId={product.id} 
        rating={product.rating} 
        reviewCount={product.reviewCount} 
        reviews={reviews} 
      />

      {/* 5. Sibling Related Products (Carousel) */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-6 border-t border-border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl font-extrabold text-ink">Related Products</h2>
              <p className="text-xs text-muted-foreground sm:text-sm">
                Frequently paired with {product.title}
              </p>
            </div>
          </div>

          <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory hide-scrollbar">
            {relatedProducts.map((rel) => (
              <div key={rel.id} className="min-w-[280px] sm:min-w-[320px] snap-start shrink-0">
                <ProductCard product={rel} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
