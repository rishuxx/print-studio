import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, SearchX, SlidersHorizontal } from "lucide-react";
import { getStorefrontCatalogue } from "@/lib/catalogue/storefront-queries";
import { ProductCard } from "@/components/shared/product-card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Search Products — Print Catalogue",
  description: "Browse and search custom printing products.",
};

export const dynamic = "force-dynamic";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const q = typeof searchParams.q === "string" ? searchParams.q : undefined;
  const category = typeof searchParams.category === "string" ? searchParams.category : undefined;
  const sortParam = typeof searchParams.sort === "string" ? searchParams.sort : undefined;
  const sort = sortParam as any;
  const pageParam = typeof searchParams.page === "string" ? searchParams.page : "1";
  const page = parseInt(pageParam, 10) || 1;

  const { products, totalCount, totalPages, categories } = await getStorefrontCatalogue({
    q,
    categoryHandle: category,
    sort,
    page,
    pageSize: 24,
  });

  return (
    <div className="shell py-8 space-y-8">
      <div className="space-y-3 border-b border-border pb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-ink transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Home</span>
        </Link>
        <h1 className="font-display text-3xl font-extrabold text-ink sm:text-4xl">
          {q ? `Search results for "${q}"` : "All Products"}
        </h1>
        <p className="text-xs text-muted-foreground sm:text-sm max-w-2xl">
          {totalCount} product{totalCount !== 1 ? "s" : ""} found {category ? `in ${category}` : ""}
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Basic Search Sidebar (Server Rendered for simplicity) */}
        <aside className="w-full md:w-64 shrink-0 space-y-6">
          <div>
            <h3 className="font-bold text-ink mb-3 text-sm">Categories</h3>
            <div className="space-y-1">
              <Link
                href={`/products?q=${encodeURIComponent(q || "")}`}
                className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  !category ? "bg-violet text-white" : "text-muted-foreground hover:bg-muted hover:text-ink"
                }`}
              >
                All Categories
              </Link>
              {categories.map((c: any) => (
                <Link
                  key={c.id}
                  href={`/products?q=${encodeURIComponent(q || "")}&category=${c.handle}`}
                  className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    category === c.handle
                      ? "bg-violet text-white"
                      : "text-muted-foreground hover:bg-muted hover:text-ink"
                  }`}
                >
                  {c.title}
                </Link>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {products.length > 0 ? (
            <>
              <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4 mb-8">
                {products.map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Simple Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-6 border-t border-border">
                  {page > 1 && (
                    <Button variant="outline" asChild>
                      <Link
                        href={`/products?q=${encodeURIComponent(q || "")}&category=${category || ""}&page=${page - 1}`}
                      >
                        Previous
                      </Link>
                    </Button>
                  )}
                  <span className="text-sm font-medium text-muted-foreground px-4">
                    Page {page} of {totalPages}
                  </span>
                  {page < totalPages && (
                    <Button variant="outline" asChild>
                      <Link
                        href={`/products?q=${encodeURIComponent(q || "")}&category=${category || ""}&page=${page + 1}`}
                      >
                        Next
                      </Link>
                    </Button>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-border rounded-2xl">
              <div className="flex size-16 items-center justify-center rounded-full bg-paper mb-4 text-muted-foreground">
                <SearchX className="size-8" />
              </div>
              <h2 className="text-lg font-bold text-ink">No products found</h2>
              <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                We couldn't find anything matching your search. Try adjusting your filters or search terms.
              </p>
              <Button asChild className="mt-6" variant="outline">
                <Link href="/products">Clear all filters</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
