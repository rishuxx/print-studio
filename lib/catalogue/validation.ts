import { z } from "zod";
import type { DatabaseProduct, ProductHealthReport } from "./types";

/**
 * Normalizes URL slugs: lowercase, replaces spaces/special characters with hyphens
 */
export function normalizeHandle(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Normalizes SKUs: uppercase, hyphens, alphanumeric only
 */
export function normalizeSKU(input: string): string {
  return input
    .toUpperCase()
    .trim()
    .replace(/[^A-Z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const SaveProductSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(2, "Product title must be at least 2 characters").max(200),
  handle: z.string().min(2, "URL handle must be at least 2 characters").max(200),
  sku: z.string().min(2, "SKU must be at least 2 characters").max(100),
  subtitle: z.string().max(300).nullable().optional(),
  description: z.string().nullable().optional(),
  status: z.enum(["draft", "active", "paused", "archived"]).default("draft"),
  visibility: z
    .enum(["public", "hidden", "catalog_only", "search_only", "direct_link_only", "scheduled"])
    .default("public"),
  product_type: z.string().default("Print"),
  brand: z.string().default("Doon Print Studio"),
  tags: z.array(z.string()).default([]),
  badges: z.array(z.string()).default([]),
  unit: z.string().min(1).default("pieces"),
  min_order_qty: z.coerce.number().int().min(1, "Minimum order quantity must be at least 1").default(1),
  qty_increment: z.coerce.number().int().min(1, "Quantity increment must be at least 1").default(1),
  turnaround_days: z.coerce.number().int().min(1, "Turnaround days must be at least 1").default(3),
  is_featured: z.boolean().default(false),
  same_day_eligible: z.boolean().default(false),
  bulk_eligible: z.boolean().default(true),
  requires_artwork: z.boolean().default(true),
  requires_proof: z.boolean().default(true),
  customizable: z.boolean().default(true),
  upload_only: z.boolean().default(false),
  sort_order: z.coerce.number().int().default(0),
  version: z.coerce.number().int().default(1),

  // Pricing
  base_price_minor: z.coerce.number().int().min(0, "Base price cannot be negative").default(19900),
  compare_at_price_minor: z.coerce.number().int().min(0).nullable().optional(),
  cost_price_minor: z.coerce.number().int().min(0).nullable().optional(),
  sale_price_minor: z.coerce.number().int().min(0).nullable().optional(),
  sale_starts_at: z.string().nullable().optional(),
  sale_ends_at: z.string().nullable().optional(),
  publish_at: z.string().nullable().optional(),
  unpublish_at: z.string().nullable().optional(),

  // Configurations
  customization_config: z.record(z.string(), z.unknown()).optional(),
  shipping_config: z.record(z.string(), z.unknown()).optional(),
  merchandising_config: z.record(z.string(), z.unknown()).optional(),

  // SEO & Social
  seo_title: z.string().max(160).nullable().optional(),
  seo_description: z.string().max(320).nullable().optional(),
  canonical_url: z.string().url("Invalid canonical URL").nullable().optional().or(z.literal("")),
  og_title: z.string().max(160).nullable().optional(),
  og_description: z.string().max(320).nullable().optional(),
  og_image: z.string().nullable().optional(),
  no_index: z.boolean().default(false),

  // Relational & Matrix Data
  category_ids: z.array(z.string()).default([]),
  options: z
    .array(
      z.object({
        name: z.string().min(1, "Option name is required"),
        values: z.array(z.string()).min(1, "Option must have at least one value"),
      })
    )
    .default([]),
  variants: z
    .array(
      z.object({
        id: z.string().optional(),
        sku: z.string().min(1, "Variant SKU required"),
        title: z.string().min(1, "Variant title required"),
        barcode: z.string().nullable().optional(),
        available_for_sale: z.boolean().default(true),
        selected_options: z.array(z.object({ name: z.string(), value: z.string() })),
        price_factor: z.coerce.number().default(1.0),
        price_minor: z.coerce.number().int().min(0).nullable().optional(),
        sale_price_minor: z.coerce.number().int().min(0).nullable().optional(),
        cost_price_minor: z.coerce.number().int().min(0).nullable().optional(),
        inventory_quantity: z.coerce.number().int().default(100),
        track_inventory: z.boolean().default(false),
        allow_backorder: z.boolean().default(true),
        status: z.enum(["active", "paused", "archived"]).default("active"),
        sort_order: z.coerce.number().int().default(0),
      })
    )
    .default([]),
  attribute_values: z
    .array(
      z.object({
        attribute_id: z.string(),
        value: z.unknown(),
      })
    )
    .default([]),
  quantity_tiers: z
    .array(
      z.object({
        min_quantity: z.coerce.number().int().min(1),
        max_quantity: z.coerce.number().int().nullable().optional(),
        tier_price_minor: z.coerce.number().int().min(0),
        discount_percent: z.coerce.number().min(0).max(100).optional(),
      })
    )
    .default([]),
});

export type SaveProductInput = z.infer<typeof SaveProductSchema>;

export const SaveCategorySchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(2, "Title must be at least 2 characters").max(100),
  handle: z.string().min(2, "Handle must be at least 2 characters").max(100),
  blurb: z.string().max(500).nullable().optional(),
  icon: z.string().default("Folder"),
  status: z.enum(["active", "archived"]).default("active"),
  sort_order: z.coerce.number().int().default(0),
  is_featured: z.boolean().default(false),
  parent_id: z.string().uuid().nullable().optional(),
  image_url: z.string().nullable().optional(),
  banner_url: z.string().nullable().optional(),
  is_nav: z.boolean().default(true),
  seo_title: z.string().max(160).nullable().optional(),
  seo_description: z.string().max(320).nullable().optional(),
  attribute_ids: z.array(z.string()).default([]),
});

export type SaveCategoryInput = z.infer<typeof SaveCategorySchema>;

/**
 * Calculate Product Health and Completeness Checklist
 */
export function calculateProductHealth(product: Partial<DatabaseProduct>): ProductHealthReport {
  const issues: Array<{ field: string; level: "error" | "warning" | "info"; message: string }> = [];
  let score = 100;

  // Title check
  if (!product.title || product.title.trim().length < 3) {
    issues.push({ field: "title", level: "error", message: "Title is missing or too short." });
    score -= 20;
  }

  // SKU check
  if (!product.sku || product.sku.trim().length < 3) {
    issues.push({ field: "sku", level: "error", message: "Product SKU is required." });
    score -= 20;
  }

  // Description check
  if (!product.description || product.description.trim().length < 10) {
    issues.push({ field: "description", level: "warning", message: "Add a detailed product description." });
    score -= 10;
  }

  // Media check
  const mediaCount = product.media?.length || 0;
  if (mediaCount === 0) {
    issues.push({ field: "media", level: "warning", message: "No product images uploaded. Upload at least 1 image." });
    score -= 15;
  } else if (!product.media?.some((m) => m.is_primary)) {
    issues.push({ field: "media_primary", level: "info", message: "Assign a primary image for catalog display." });
    score -= 5;
  }

  // Categories check
  const catCount = product.categories?.length || 0;
  if (catCount === 0) {
    issues.push({ field: "categories", level: "warning", message: "Assign this product to at least one category." });
    score -= 10;
  }

  // Pricing check
  if (!product.base_price_minor || product.base_price_minor <= 0) {
    issues.push({ field: "pricing", level: "error", message: "Base price must be greater than zero." });
    score -= 15;
  }

  // SEO check
  if (!product.seo_title || !product.seo_description) {
    issues.push({ field: "seo", level: "info", message: "Add custom SEO meta title and description for search engines." });
    score -= 5;
  }

  const finalScore = Math.max(0, Math.min(100, score));
  const status = finalScore >= 80 ? "ready" : finalScore >= 50 ? "needs_attention" : "incomplete";

  return {
    score: finalScore,
    status,
    issues,
  };
}
