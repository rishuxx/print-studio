import { z } from "zod";

export const SaveProductPriceSchema = z.object({
  id: z.string().uuid().optional(),
  productId: z.string().uuid({ message: "Valid product ID is required" }),
  variantId: z.string().uuid().nullable().optional(),
  priceBookId: z.string().uuid({ message: "Valid price book ID is required" }),
  basePriceMinor: z.number().int().min(0, { message: "Base price cannot be negative" }),
  compareAtPriceMinor: z.number().int().min(0).nullable().optional(),
  costPriceMinor: z.number().int().min(0).nullable().optional(),
  minimumPriceFloorMinor: z.number().int().min(0).nullable().optional(),
  status: z.enum(["active", "archived"]).default("active"),
  version: z.number().int().min(1).default(1),
  quantityTiers: z
    .array(
      z.object({
        minQuantity: z.number().int().min(1),
        maxQuantity: z.number().int().min(1).nullable().optional(),
        tierPriceMinor: z.number().int().min(0),
        discountPercent: z.number().min(0).max(100).nullable().optional(),
      })
    )
    .optional(),
});

export const SavePromotionSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2, { message: "Promotion name must be at least 2 characters" }).max(120),
  code: z
    .string()
    .max(30)
    .regex(/^[A-Z0-9_-]*$/, { message: "Coupon code must be uppercase alphanumeric" })
    .nullable()
    .optional(),
  description: z.string().max(500).nullable().optional(),
  type: z.enum(["sale_price", "percentage_discount", "fixed_discount", "bulk_tier_discount"]),
  status: z.enum(["draft", "scheduled", "active", "paused", "expired", "cancelled"]).default("draft"),
  stackable: z.boolean().default(false),
  priority: z.number().int().min(0).max(100).default(10),
  discountValue: z.number().min(0, { message: "Discount value cannot be negative" }),
  minOrderValueMinor: z.number().int().min(0).nullable().optional(),
  maxDiscountAmountMinor: z.number().int().min(0).nullable().optional(),
  targetType: z.enum(["all", "category", "product", "variant"]).default("all"),
  targetIds: z.array(z.string()).default([]),
  startsAt: z.string().nullable().optional(),
  endsAt: z.string().nullable().optional(),
  timezone: z.string().default("Asia/Kolkata"),
  maxUsageLimit: z.number().int().min(1).nullable().optional(),
  version: z.number().int().min(1).optional().default(1),
});

export const BulkPriceAdjustmentSchema = z.object({
  productIds: z.array(z.string().uuid()).min(1, { message: "Select at least 1 product" }),
  priceBookId: z.string().uuid(),
  adjustmentType: z.enum([
    "percentage_increase",
    "percentage_decrease",
    "fixed_increase",
    "fixed_decrease",
    "set_fixed_price",
  ]),
  adjustmentValue: z.number().min(0),
  enforceMarginProtection: z.boolean().default(true),
  reason: z.string().min(3, { message: "Reason is required for audit trail" }).max(200),
});

export const SavePriceBookSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2, { message: "Price book name must be at least 2 characters" }).max(100),
  code: z
    .string()
    .max(50)
    .regex(/^[A-Z0-9_]+$/, { message: "Code must be uppercase alphanumeric and underscores only" }),
  description: z.string().max(300).nullable().optional(),
  currency: z.string().default("INR"),
  status: z.enum(["active", "archived"]).default("active"),
  priority: z.number().int().min(0).max(100).default(0),
  isDefault: z.boolean().default(false),
});

export type SaveProductPriceInput = z.input<typeof SaveProductPriceSchema>;
export type SavePromotionInput = z.input<typeof SavePromotionSchema>;
export type BulkPriceAdjustmentInput = z.input<typeof BulkPriceAdjustmentSchema>;
export type SavePriceBookInput = z.input<typeof SavePriceBookSchema>;

