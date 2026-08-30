"use client";

import * as React from "react";
import type { Product, Category, BadgeKind } from "@/lib/commerce/types";
import { ProductCard } from "@/components/shared/product-card";
import { SlidersHorizontal, Search, X } from "lucide-react";

interface CategoryListingClientProps {
  category: Category;
  initialProducts: Product[];
}

type SortOption = "popular" | "price-asc" | "price-desc" | "rating" | "newest";

export function CategoryListingClient({
  category,
  initialProducts,
}: CategoryListingClientProps) {
  const [selectedSubgroup, setSelectedSubgroup] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [selectedBadge, setSelectedBadge] = React.useState<string>("all");
  const [sortBy, setSortBy] = React.useState<SortOption>("popular");
  const [mobileFilterOpen, setMobileFilterOpen] = React.useState<boolean>(false);

  // Extract all subcategory groups from category definition safely with useMemo
  const groups = React.useMemo(() => category.groups ?? [], [category.groups]);

  // Filter products based on search, badge and subcategory
  const filteredProducts = React.useMemo(() => {
    return initialProducts.filter((product) => {
      // 1. Text Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = product.title.toLowerCase().includes(q);
        const matchesSubtitle = product.subtitle?.toLowerCase().includes(q);
        const matchesTags = product.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesSubtitle && !matchesTags) {
          return false;
        }
      }

      // 2. Badge filter
      if (selectedBadge !== "all") {
        if (!product.badges.includes(selectedBadge as BadgeKind)) {
          return false;
        }
      }

      // 3. Subgroup / Subcategory filter
      if (selectedSubgroup !== "all") {
        const group = groups.find((g) => g.title === selectedSubgroup);
        if (group) {
          const handlesInGroup = group.items.map((i) => i.handle).filter(Boolean);
          if (!handlesInGroup.includes(product.handle)) {
            return false;
          }
        }
      }

      return true;
    });
  }, [initialProducts, searchQuery, selectedBadge, selectedSubgroup, groups]);

  // Sort filtered products
  const sortedProducts = React.useMemo(() => {
    const list = [...filteredProducts];
    switch (sortBy) {
      case "price-asc":
        return list.sort((a, b) => a.priceFrom.amount - b.priceFrom.amount);
      case "price-desc":
        return list.sort((a, b) => b.priceFrom.amount - a.priceFrom.amount);
      case "rating":
        return list.sort((a, b) => (b.badges.includes("popular") ? 1 : 0) - (a.badges.includes("popular") ? 1 : 0));
      case "newest":
        return list.sort((a, b) => (b.badges.includes("new") ? 1 : 0) - (a.badges.includes("new") ? 1 : 0));
      case "popular":
      default:
        return list.sort((a, b) => {
          const aScore = a.badges.includes("bestseller") ? 3 : a.badges.includes("popular") ? 2 : 1;
          const bScore = b.badges.includes("bestseller") ? 3 : b.badges.includes("popular") ? 2 : 1;
          return bScore - aScore;
        });
    }
  }, [filteredProducts, sortBy]);

  const hasActiveFilters = selectedSubgroup !== "all" || selectedBadge !== "all" || searchQuery.trim() !== "";

  const clearAllFilters = () => {
    setSelectedSubgroup("all");
    setSelectedBadge("all");
    setSearchQuery("");
    setSortBy("popular");
  };

  return (
    <div className="space-y-6">
      {/* ── Control Bar: Search, Filter count & Sorting ─────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-border bg-white p-3 shadow-sm text-xs">
        {/* Search input within category */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${category.title}...`}
            className="w-full rounded-lg border border-border pl-8 pr-8 py-1.5 text-xs text-ink placeholder:text-muted-foreground focus:border-violet focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-ink"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        {/* Right: Subgroup Pills & Sort Dropdown */}
        <div className="flex items-center justify-between sm:justify-end gap-3">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 font-semibold text-ink sm:hidden"
          >
            <SlidersHorizontal className="size-3.5" />
            <span>Filters</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-muted-foreground hidden md:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="rounded-lg border border-border bg-white px-2.5 py-1.5 text-xs font-semibold text-ink focus:border-violet focus:outline-none"
            >
              <option value="popular">Most Popular</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Newest Additions</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Subgroup Navigation Pills ──────────────────────────────── */}
      {groups.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
          <button
            onClick={() => setSelectedSubgroup("all")}
            className={`whitespace-nowrap rounded-lg px-3 py-1.5 font-medium transition-all ${
              selectedSubgroup === "all"
                ? "bg-violet text-white font-bold shadow-sm"
                : "bg-paper text-muted-foreground border border-border hover:text-ink hover:bg-muted"
            }`}
          >
            All ({initialProducts.length})
          </button>

          {groups.map((group) => (
            <button
              key={group.title}
              onClick={() => setSelectedSubgroup(group.title)}
              className={`whitespace-nowrap rounded-lg px-3 py-1.5 font-medium transition-all ${
                selectedSubgroup === group.title
                  ? "bg-violet text-white font-bold shadow-sm"
                  : "bg-paper text-muted-foreground border border-border hover:text-ink hover:bg-muted"
              }`}
            >
              {group.title}
            </button>
          ))}
        </div>
      )}

      {/* ── Quick Badge Filter Chips ──────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="font-mono text-[0.6875rem] uppercase text-muted-foreground">
          Quick Filters:
        </span>
        {["all", "bestseller", "popular", "same-day", "premium"].map((badge) => (
          <button
            key={badge}
            onClick={() => setSelectedBadge(badge)}
            className={`rounded-md px-2 py-0.5 font-mono text-[0.6875rem] uppercase font-bold transition-colors ${
              selectedBadge === badge
                ? "bg-ink text-white"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {badge === "all" ? "All Types" : badge}
          </button>
        ))}

        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-[0.6875rem] font-semibold text-violet hover:underline ml-auto"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* ── Product Grid or Empty State ────────────────────────────── */}
      {sortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-white p-12 text-center space-y-4">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-paper text-muted-foreground">
            <Search className="size-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-ink">No products match your filters</h3>
            <p className="text-xs text-muted-foreground">
              Try adjusting your search keyword or clearing selected subcategories and filters.
            </p>
          </div>
          <button
            onClick={clearAllFilters}
            className="inline-flex items-center gap-2 rounded-xl bg-violet px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-violet-lift transition-all"
          >
            <span>Reset Filters</span>
          </button>
        </div>
      )}
    </div>
  );
}
