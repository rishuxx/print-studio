import type { DatabaseProduct, ProductVisibility, ProductStatus } from "./types";

export interface VisibilityResult {
  isVisible: boolean;
  isPurchasable: boolean;
  reason?: string;
}

export const ProductService = {
  /**
   * Determine the visibility and purchaseability of a product based on its canonical state.
   */
  getProductVisibility(
    product: DatabaseProduct | null | undefined,
    context?: { isPreview?: boolean }
  ): VisibilityResult {
    if (!product) {
      return { isVisible: false, isPurchasable: false, reason: "Product not found" };
    }

    if (context?.isPreview) {
      return { isVisible: true, isPurchasable: false, reason: "Admin preview mode" };
    }

    const status: ProductStatus = product.status || "active";
    const visibility: ProductVisibility = product.visibility || "public";

    // 1. DRAFT & ARCHIVED
    if (status === "draft") {
      return { isVisible: false, isPurchasable: false, reason: "Product is in draft state" };
    }
    if (status === "archived") {
      return { isVisible: false, isPurchasable: false, reason: "Product is archived" };
    }

    // 2. PAUSED
    if (status === "paused") {
      // It might be visible on catalog/direct link but definitely not purchasable
      return { isVisible: visibility !== "hidden", isPurchasable: false, reason: "Sales are paused for this product" };
    }

    // 3. ACTIVE
    // Check specific visibility toggles
    if (visibility === "hidden") {
      return { isVisible: false, isPurchasable: false, reason: "Product is hidden" };
    }

    // Check publish/unpublish dates if present
    const now = new Date();
    if (product.publish_at && new Date(product.publish_at) > now) {
      return { isVisible: false, isPurchasable: false, reason: "Product is scheduled for future publishing" };
    }
    if (product.unpublish_at && new Date(product.unpublish_at) < now) {
      return { isVisible: false, isPurchasable: false, reason: "Product has been unpublished" };
    }

    // If we reach here, it's ACTIVE and visible
    return { isVisible: true, isPurchasable: true };
  },

  /**
   * Quick check if a product can be purchased right now.
   */
  canPurchaseProduct(product: DatabaseProduct | null | undefined): boolean {
    return this.getProductVisibility(product).isPurchasable;
  },
};
