import { z } from "zod";

/**
 * Normalize slug: lowercase, replace spaces/symbols with hyphens, remove dangerous characters
 */
export function normalizeHandle(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Normalize SKU: uppercase, trimmed, alphanumeric with hyphens/underscores
 */
export function normalizeSKU(input: string): string {
  return input
    .toUpperCase()
    .trim()
    .replace(/[^A-Z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const ProductOptionValueSchema = z.object({
  name: z.string().min(1, "Option name is required").max(50),
  values: z.array(z.string().min(1).max(100)).min(1, "At least one option value is required"),
});

export const ProductMediaInputSchema = z.object({
  url: z.string().url("Must be a valid URL").max(1000),
  alt_text: z.string().max(200).default(""),
  width: z.number().int().positive().default(800),
  height: z.number().int().positive().default(800),
  is_primary: z.boolean().default(false),
  sort_order: z.number().int().default(0),
});

export const SaveProductSchema = z.object({
  id: z.string().uuid().optional(),
  handle: z
    .string()
    .min(2, "Handle must be at least 2 characters")
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Handle can only contain lowercase letters, numbers, and hyphens"),
  title: z.string().min(2, "Product title is required").max(150),
  subtitle: z.string().max(250).optional().nullable(),
  description: z.string().max(10000).optional().nullable(),
  sku: z
    .string()
    .min(2, "SKU is required")
    .max(50)
    .regex(/^[A-Z0-9_-]+$/, "SKU can only contain uppercase letters, numbers, hyphens, and underscores"),
  status: z.enum(["draft", "active", "paused", "archived"]).default("draft"),
  visibility: z.enum(["public", "hidden"]).default("public"),
  product_type: z.string().min(1).max(50).default("Print"),
  unit: z.string().min(1).max(30).default("pieces"),
  min_order_qty: z.number().int().positive("Minimum order quantity must be greater than 0").default(1),
  qty_increment: z.number().int().positive("Quantity increment must be greater than 0").default(1),
  turnaround_days: z.number().int().min(1, "Turnaround days must be at least 1").default(3),
  is_featured: z.boolean().default(false),
  same_day_eligible: z.boolean().default(false),
  bulk_eligible: z.boolean().default(true),
  requires_artwork: z.boolean().default(true),
  requires_proof: z.boolean().default(true),
  customizable: z.boolean().default(true),
  upload_only: z.boolean().default(false),
  sort_order: z.number().int().default(0),
  version: z.number().int().positive().default(1),
  seo_title: z.string().max(120).optional().nullable(),
  seo_description: z.string().max(320).optional().nullable(),
  canonical_url: z.string().url("Must be a valid URL").max(500).optional().nullable().or(z.literal("")),
  category_ids: z.array(z.string().uuid()).default([]),
  options: z.array(ProductOptionValueSchema).default([]),
  media: z.array(ProductMediaInputSchema).default([]),
});

export const SaveCategorySchema = z.object({
  id: z.string().uuid().optional(),
  handle: z
    .string()
    .min(2, "Handle must be at least 2 characters")
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Handle can only contain lowercase letters, numbers, and hyphens"),
  title: z.string().min(2, "Category title is required").max(100),
  blurb: z.string().max(300).optional().nullable(),
  icon: z.string().min(1).max(50).default("Folder"),
  status: z.enum(["active", "archived"]).default("active"),
  sort_order: z.number().int().default(0),
  is_featured: z.boolean().default(false),
  seo_title: z.string().max(120).optional().nullable(),
  seo_description: z.string().max(320).optional().nullable(),
});

export type SaveProductInput = z.infer<typeof SaveProductSchema>;
export type SaveCategoryInput = z.infer<typeof SaveCategorySchema>;
