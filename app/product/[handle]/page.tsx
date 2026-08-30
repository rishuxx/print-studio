import * as React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct, getAllProducts, getProductsInCategory } from "@/lib/data/products";
import { getCategory } from "@/lib/data/categories";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { CatalogBadge } from "@/components/ui/badge";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductConfigurator } from "@/components/product/product-configurator";
import { ProductCard } from "@/components/shared/product-card";
import { CheckCircle2, FileCheck, Layers, HelpCircle } from "lucide-react";

interface PageProps {
  params: Promise<{ handle: string }>;
}

export async function generateStaticParams() {
  const allProducts = getAllProducts();
  return allProducts.map((p) => ({
    handle: p.handle,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { handle } = await params;
  const product = getProduct(handle);
  if (!product) return { title: "Product Not Found" };

  return {
    title: `${product.title} — Custom Printing`,
    description: product.description || product.subtitle,
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { handle } = await params;
  const product = getProduct(handle);
  if (!product) notFound();

  // Find primary category for breadcrumbs & related products
  const primaryCategoryHandle = product.categoryHandles[0] ?? "visiting-cards";
  const category = getCategory(primaryCategoryHandle);

  // Sibling related products
  const relatedProducts = getProductsInCategory(primaryCategoryHandle)
    .filter((p) => p.handle !== product.handle)
    .slice(0, 4);

  return (
    <div className="shell py-8 space-y-12">
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

      {/* 3. Detailed Specifications & Artwork Preparation Tabs/Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-border pt-10">
        {/* Detailed Print Specifications */}
        <div className="rounded-2xl border border-border bg-white p-6 space-y-4">
          <div className="flex items-center gap-2 font-display text-lg font-bold text-ink">
            <Layers className="size-4 text-violet" />
            <h3>Print Specifications</h3>
          </div>

          <div className="divide-y divide-border/60 text-xs">
            {product.specs && product.specs.length > 0 ? (
              product.specs.map((spec) => (
                <div key={spec.label} className="py-2.5 flex items-center justify-between">
                  <span className="text-muted-foreground">{spec.label}</span>
                  <span className="font-semibold text-ink">{spec.value}</span>
                </div>
              ))
            ) : (
              <>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-muted-foreground">Standard Turnaround</span>
                  <span className="font-semibold text-ink">{product.turnaroundDays} Working Days</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-muted-foreground">Minimum Quantity</span>
                  <span className="font-semibold text-ink">{product.minOrderQty} {product.priceUnit}</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-muted-foreground">Print Technology</span>
                  <span className="font-semibold text-ink">Calibrated CMYK Output</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* How to Prepare Artwork */}
        <div className="rounded-2xl border border-border bg-paper p-6 space-y-4">
          <div className="flex items-center gap-2 font-display text-lg font-bold text-ink">
            <FileCheck className="size-4 text-violet" />
            <h3>Artwork & File Preparation</h3>
          </div>

          <ul className="space-y-3 text-xs text-muted-foreground">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Resolution:</strong> Keep files at 300 DPI or higher to guarantee crisp fonts and sharp images.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Color Mode:</strong> Use CMYK color profile to prevent unwanted RGB-to-print color shifts.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Bleed & Safe Zone:</strong> Include 3mm bleed margin around all edges for precision cutting.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>File Formats:</strong> We accept print-ready PDF, Adobe Illustrator (.AI), EPS, PSD, and TIFF.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* 4. Product FAQ */}
      {product.faqs && product.faqs.length > 0 && (
        <div className="space-y-4 border-t border-border pt-10">
          <div className="flex items-center gap-2 font-display text-xl font-bold text-ink">
            <HelpCircle className="size-5 text-violet" />
            <h3>Frequently Asked Questions for {product.title}</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {product.faqs.map((faq, idx) => (
              <div key={idx} className="rounded-xl border border-border bg-white p-5 space-y-2">
                <h4 className="font-bold text-ink">{faq.q}</h4>
                <p className="text-muted-foreground leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Related Products Grid */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 border-t border-border pt-10">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold text-ink">
              Related Products in {category?.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
