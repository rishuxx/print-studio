import * as React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getStorefrontProduct, getStorefrontCategory, getStorefrontAllProducts } from "@/lib/catalogue/storefront-queries";
import { getAllProducts } from "@/lib/data/products";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { CatalogBadge } from "@/components/ui/badge";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductConfigurator } from "@/components/product/product-configurator";
import { ProductCard } from "@/components/shared/product-card";
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
  if (!product) return { title: "Product Not Found" };

  return {
    title: `${product.title} — Custom Online Printing`,
    description: product.description || product.subtitle,
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { handle } = await params;
  const decodedHandle = decodeURIComponent(handle).toLowerCase().replace(/\s+/g, '-');
  const product = await getStorefrontProduct(decodedHandle);
  if (!product) notFound();

  // Find primary category for breadcrumbs & related products
  const primaryCategoryHandle = product.categoryHandles[0] ?? "visiting-cards";
  const category = await getStorefrontCategory(primaryCategoryHandle);

  // Sibling related products
  const allProducts = await getStorefrontAllProducts();
  const relatedProducts = allProducts
    .filter((p) => p.categoryHandles.includes(primaryCategoryHandle) && p.handle !== product.handle)
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

      {/* 4. Sibling Related Products */}
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

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
