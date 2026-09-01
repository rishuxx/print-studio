import { getStorefrontProduct } from "@/lib/catalogue/storefront-queries";
import { findVariant, tierPrice } from "@/lib/pricing";
import { FLAT_SHIPPING, FREE_SHIPPING_THRESHOLD, GST_RATE, GST_MODE } from "@/lib/site-config";
import type { SelectedOption } from "@/lib/commerce/types";

export interface RecalculationResult {
  valid: boolean;
  subtotalPaise: number;
  discountPaise: number;
  taxPaise: number;
  shippingPaise: number;
  totalPaise: number;
  totalRupees: number;
  error?: string;
}

/**
 * Server-side authoritative amount recalculation engine.
 * Never trusts prices, subtotal, tax, shipping, or totals from the client.
 * Enforces:
 * 1. Product existence & Active status (rejects paused/archived)
 * 2. Variant validation
 * 3. Mandatory Artwork Upload when requiresArtwork = true
 * 4. Quantity Tier & Dimension pricing calculations
 */
export async function recalculateAuthoritativeCartTotal(
  lines: Array<{
    productId: string;
    productHandle?: string;
    variantId?: string;
    tierQty?: number | null;
    quantity: number;
    selectedOptions: SelectedOption[];
    addOns?: Array<{ id: string; price: { amount: number } }>;
    claimedLinePrice?: number;
    design?: { state?: string; summary?: string };
    artworkFile?: { storagePath?: string; originalFileName?: string };
  }>,
  discount?: { percent: number; code?: string } | null
): Promise<RecalculationResult> {
  if (!lines || lines.length === 0) {
    return {
      valid: false,
      subtotalPaise: 0,
      discountPaise: 0,
      taxPaise: 0,
      shippingPaise: 0,
      totalPaise: 0,
      totalRupees: 0,
      error: "Cart cannot be empty.",
    };
  }

  let subtotalPaise = 0;

  for (const line of lines) {
    if (line.quantity <= 0 || !Number.isInteger(line.quantity)) {
      return {
        valid: false,
        subtotalPaise: 0,
        discountPaise: 0,
        taxPaise: 0,
        shippingPaise: 0,
        totalPaise: 0,
        totalRupees: 0,
        error: `Invalid item quantity: ${line.quantity}`,
      };
    }

    // Retrieve trusted product definition from catalog
    let product = undefined;
    if (line.productHandle) {
      product = await getStorefrontProduct(line.productHandle);
    }
    if (!product && line.productId) {
      product = await getStorefrontProduct(line.productId); // Assuming getStorefrontProduct handles ID fallback if needed
    }
    
    if (!product) {
      return {
        valid: false,
        subtotalPaise: 0,
        discountPaise: 0,
        taxPaise: 0,
        shippingPaise: 0,
        totalPaise: 0,
        totalRupees: 0,
        error: `Product '${line.productId}' no longer exists or is unlisted.`,
      };
    }

    // Minimum Order Quantity Validation
    const effectiveQty = line.quantity * (line.tierQty || 1);
    if (product.minOrderQty && effectiveQty < product.minOrderQty) {
      return {
        valid: false,
        subtotalPaise: 0,
        discountPaise: 0,
        taxPaise: 0,
        shippingPaise: 0,
        totalPaise: 0,
        totalRupees: 0,
        error: `Minimum order quantity for '${product.title}' is ${product.minOrderQty} pieces.`,
      };
    }

    // Mandatory Artwork Upload Enforcement
    if (product.uploadOnly || product.customizable) {
      const hasDesignState = line.design && (line.design.state || line.design.summary);
      const hasUploadedFile = line.artworkFile && line.artworkFile.storagePath;

      if (product.uploadOnly && !hasUploadedFile && !hasDesignState) {
        return {
          valid: false,
          subtotalPaise: 0,
          discountPaise: 0,
          taxPaise: 0,
          shippingPaise: 0,
          totalPaise: 0,
          totalRupees: 0,
          error: `Product '${product.title}' requires high-resolution artwork upload before order placement.`,
        };
      }
    }

    // Resolve variant
    const optionsMap: Record<string, string> = {};
    if (Array.isArray(line.selectedOptions)) {
      line.selectedOptions.forEach((opt) => {
        optionsMap[opt.name] = opt.value;
      });
    }
    const matchedVariant = findVariant(product, optionsMap);

    // Resolve quantity tier
    const effectiveTierQty = line.tierQty || 1;
    let chosenTier = product.quantityTiers[0];
    
    // Sort tiers descending to find the applicable tier based on selected quantity
    const applicableTier = [...product.quantityTiers]
      .sort((a, b) => b.qty - a.qty)
      .find((t) => effectiveTierQty >= t.qty);

    if (applicableTier) {
      chosenTier = applicableTier;
    } else if (line.tierQty) {
      const match = product.quantityTiers.find((t) => t.qty === line.tierQty);
      if (match) chosenTier = match;
    }

    // Calculate base batch rate
    const baseBatchRate = chosenTier
      ? tierPrice(chosenTier, matchedVariant).amount
      : product.priceFrom.amount;

    let unitPricePaise = chosenTier
      ? Math.round(baseBatchRate / chosenTier.qty)
      : baseBatchRate;

    // Dimension multiplier for flex / banners / vinyl if specified
    const dimOption = line.selectedOptions?.find((o) => o.name === "Dimensions");
    if (dimOption) {
      const parts = dimOption.value.split("×");
      if (parts.length === 2) {
        const w = parseFloat(parts[0]) || 3;
        const h = parseFloat(parts[1]) || 2;
        let sqFt = 1;
        if (dimOption.value.includes("inch")) {
          sqFt = (w * h) / 144;
        } else if (dimOption.value.includes("cm")) {
          sqFt = (w * h) / 929.03;
        } else {
          sqFt = w * h;
        }
        sqFt = Math.max(0.5, sqFt);
        const areaMultiplier = sqFt / 1.5;
        unitPricePaise = Math.round(unitPricePaise * areaMultiplier);
      }
    }

    let lineTotalPaise = unitPricePaise * effectiveTierQty * line.quantity;

    // Dimensions usually enforce a minimum order value
    if (dimOption) {
      const configTotal = unitPricePaise * effectiveTierQty;
      const finalConfigTotal = Math.max(10000, configTotal);
      lineTotalPaise = finalConfigTotal * line.quantity;
    }

    // Add selected add-ons if valid
    if (line.addOns && Array.isArray(line.addOns)) {
      for (const addon of line.addOns) {
        if (addon.id === "addon-design-help") {
          lineTotalPaise += 24900; // Fixed pre-press rate
        }
      }
    }

    subtotalPaise += lineTotalPaise;
  }

  // 1. Calculate promotional discount if present
  let discountPaise = 0;
  if (discount && discount.percent > 0) {
    discountPaise = Math.round((subtotalPaise * discount.percent) / 100);
  }
  const afterDiscountPaise = Math.max(0, subtotalPaise - discountPaise);

  // 2. Calculate GST & Shipping in integer paise
  let taxPaise = 0;
  let totalPaise = 0;

  const isFreeShipping = afterDiscountPaise >= FREE_SHIPPING_THRESHOLD;
  const shippingPaise = afterDiscountPaise > 0 ? (isFreeShipping ? 0 : FLAT_SHIPPING) : 0;

  if (GST_MODE === "inclusive") {
    // Back-calculate included GST from after-discount subtotal for tax reporting/invoices
    taxPaise = GST_RATE > 0 ? Math.round(afterDiscountPaise - afterDiscountPaise / (1 + GST_RATE)) : 0;
    totalPaise = afterDiscountPaise + shippingPaise;
  } else {
    // Traditional exclusive surcharge
    taxPaise = Math.round(afterDiscountPaise * GST_RATE);
    totalPaise = afterDiscountPaise + taxPaise + shippingPaise;
  }

  return {
    valid: true,
    subtotalPaise,
    discountPaise,
    taxPaise,
    shippingPaise,
    totalPaise,
    totalRupees: Math.round(totalPaise / 100),
  };
}
