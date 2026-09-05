import type { Product } from "@/lib/commerce/types";
import { allProductHandles, productIndex } from "@/lib/data/categories";

import { cardProducts } from "./cards";
import { apparelProducts } from "./apparel";
import { giftProducts } from "./gifts";
import { stationeryProducts } from "./stationery";
import { packagingProducts } from "./packaging";
import { signageProducts } from "./signage";
import { decorProducts } from "./decor";
import { festiveProducts } from "./festive";
import { bulkProducts } from "./bulk";

/**
 * ══════════════════════════════════════════════════════════════════
 * PRODUCT CATALOG — 165 products across 10 categories.
 *
 * Split by category so each file stays reviewable. This module is the
 * only place the halves are joined; everything else imports from here
 * (or, better, from `lib/commerce` so the Shopify swap stays clean).
 * ══════════════════════════════════════════════════════════════════
 */
export const products: Product[] = [
  ...cardProducts,
  ...apparelProducts,
  ...giftProducts,
  ...stationeryProducts,
  ...packagingProducts,
  ...signageProducts,
  ...decorProducts,
  ...festiveProducts,
  ...bulkProducts,
];

export const productsByHandle: Record<string, Product> = Object.fromEntries(
  products.map((p) => [p.handle, p]),
);

export function getProduct(handle: string): Product | undefined {
  return productsByHandle[handle];
}

export function getProductsByHandles(handles: string[]): Product[] {
  return handles.map((h) => productsByHandle[h]).filter(Boolean) as Product[];
}

/** Products carrying a given category handle, in nav order. */
export function getProductsInCategory(categoryHandle: string): Product[] {
  const order = productIndex
    .filter((r) => r.categoryHandle === categoryHandle)
    .map((r) => r.handle);
  const seen = new Set<string>();
  const ordered: Product[] = [];
  for (const handle of order) {
    if (seen.has(handle)) continue;
    seen.add(handle);
    const p = productsByHandle[handle];
    if (p) ordered.push(p);
  }
  // Anything tagged into the category but not present in the nav tree.
  for (const p of products) {
    if (p.categoryHandles.includes(categoryHandle) && !seen.has(p.handle)) {
      ordered.push(p);
    }
  }
  return ordered;
}

export function hasBadge(p: Product, badge: Product["badges"][number]): boolean {
  return p.badges.includes(badge);
}

export function getAllProducts(): Product[] {
  return products;
}

export function getProductBySlug(slug: string): Product | undefined {
  return getProduct(slug);
}

export function getFeaturedProducts(limit = 8): Product[] {
  return products
    .filter((p) => p.badges.includes("popular") || p.badges.includes("recommended") || p.badges.includes("bestseller"))
    .slice(0, limit);
}

export function getBestSellers(limit = 8): Product[] {
  return products
    .filter((p) => p.badges.includes("bestseller"))
    .slice(0, limit);
}

export function getSameDayProducts(limit = 8): Product[] {
  return products
    .filter((p) => p.sameDayEligible || p.badges.includes("same-day"))
    .slice(0, limit);
}

export function searchProducts(query: string, limit = 20): Product[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  // Generate normalized terms (e.g. "tshirt" -> ["tshirt", "t-shirt", "t shirt", "tee"])
  const terms = new Set<string>();
  terms.add(q);
  if (q.includes("-")) {
    terms.add(q.replace(/-/g, ""));
    terms.add(q.replace(/-/g, " "));
  }
  if (q.includes(" ")) {
    terms.add(q.replace(/\s+/g, "-"));
    terms.add(q.replace(/\s+/g, ""));
  }
  if (q === "tshirt" || q === "tshirts") {
    terms.add("t-shirt");
    terms.add("t shirt");
    terms.add("t-shirts");
    terms.add("tee");
  } else if (q === "t-shirt" || q === "t-shirts") {
    terms.add("tshirt");
    terms.add("tshirts");
    terms.add("tee");
  }

  const termList = Array.from(terms);

  return products
    .filter((p) => {
      const titleLower = p.title.toLowerCase();
      const subtitleLower = (p.subtitle || "").toLowerCase();
      const typeLower = (p.productType || "").toLowerCase();
      const handleLower = (p.handle || "").toLowerCase();
      const tagsLower = (p.tags || []).map((t) => t.toLowerCase());

      return termList.some((t) =>
        titleLower.includes(t) ||
        subtitleLower.includes(t) ||
        typeLower.includes(t) ||
        handleLower.includes(t) ||
        tagsLower.some((tag) => tag.includes(t))
      );
    })
    .slice(0, limit);
}

export { categories as getAllCategories, getCategory as getCategoryBySlug } from "@/lib/data/categories";

/**
 * Dev guard: every handle in the nav tree must resolve to a real product,
 * or a category page renders an empty grid. Logged once, server-side only.
 */
if (process.env.NODE_ENV === "development") {
  const missing = allProductHandles.filter((h) => !productsByHandle[h]);
  if (missing.length) {
    console.warn(
      `[catalog] ${missing.length} nav handle(s) have no product: ${missing.join(", ")}`,
    );
  }
}
