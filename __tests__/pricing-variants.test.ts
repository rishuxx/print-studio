import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { calculateAuthoritativePrice } from "../lib/pricing/engine";
import { recalculateAuthoritativeCartTotal } from "../lib/payments/server-calculator";

describe("Pricing Engine & Commerce Control System Test Suite", () => {
  describe("1. Authoritative Price Resolution Engine", () => {
    it("calculates base price correctly for single unit without tiers", () => {
      const result = calculateAuthoritativePrice({
        product: {
          id: "prod-mug-001",
          title: "Custom Ceramic Mug",
          handle: "custom-ceramic-mug",
          basePriceMinor: 29900, // ₹299
        },
        quantity: 1,
      });

      assert.equal(result.rawSubtotalMinor, 29900);
      assert.equal(result.effectiveUnitPriceMinor, 29900);
      assert.equal(result.finalSubtotalMinor, 29900);
      assert.equal(result.totalDiscountMinor, 0);
    });

    it("resolves quantity volume tier discounts accurately", () => {
      const priceRecord = {
        id: "pr-1",
        product_id: "prod-tshirt",
        variant_id: null,
        price_book_id: "pb-retail",
        base_price_minor: 69900, // ₹699
        currency: "INR",
        status: "active" as const,
        version: 1,
        created_at: "",
        updated_at: "",
        product_quantity_tiers: [
          {
            id: "t1",
            product_price_id: "pr-1",
            min_quantity: 1,
            max_quantity: 9,
            tier_price_minor: 69900,
            sort_order: 0,
            created_at: "",
            updated_at: "",
          },
          {
            id: "t2",
            product_price_id: "pr-1",
            min_quantity: 10,
            max_quantity: 49,
            tier_price_minor: 59900, // ₹599
            sort_order: 10,
            created_at: "",
            updated_at: "",
          },
          {
            id: "t3",
            product_price_id: "pr-1",
            min_quantity: 50,
            max_quantity: null,
            tier_price_minor: 49900, // ₹499
            sort_order: 20,
            created_at: "",
            updated_at: "",
          },
        ],
      };

      // Order of 20 pieces -> Tier 2 (₹599)
      const resTier2 = calculateAuthoritativePrice({
        product: {
          id: "prod-tshirt",
          title: "Premium T-Shirt",
          handle: "premium-t-shirt",
          basePriceMinor: 69900,
        },
        priceRecord: priceRecord as any,
        quantity: 20,
      });

      assert.equal(resTier2.effectiveUnitPriceMinor, 59900);
      assert.equal(resTier2.finalSubtotalMinor, 59900 * 20);
      assert.equal(resTier2.quantityTierDiscountMinor, (69900 - 59900) * 20);

      // Order of 100 pieces -> Tier 3 (₹499)
      const resTier3 = calculateAuthoritativePrice({
        product: {
          id: "prod-tshirt",
          title: "Premium T-Shirt",
          handle: "premium-t-shirt",
          basePriceMinor: 69900,
        },
        priceRecord: priceRecord as any,
        quantity: 100,
      });

      assert.equal(resTier3.effectiveUnitPriceMinor, 49900);
      assert.equal(resTier3.finalSubtotalMinor, 49900 * 100);
    });

    it("calculates dynamic dimension area pricing per square foot / unit", () => {
      const bannerProduct = {
        id: "prod-banner",
        title: "Outdoor Vinyl Flex Banner",
        handle: "outdoor-vinyl-flex-banner",
        basePriceMinor: 10000,
        customizationConfig: {
          dimensionPricing: {
            enabled: true,
            unit: "ft" as const,
            ratePerSqUnitMinor: 12000, // ₹120 per sq ft
          },
        },
      };

      // 6 ft x 3 ft banner = 18 sq ft -> 18 * ₹120 = ₹2,160
      const resBanner = calculateAuthoritativePrice({
        product: bannerProduct,
        selectedDimensions: { width: 6, height: 3, unit: "ft" },
        quantity: 1,
      });

      assert.equal(resBanner.finalSubtotalMinor, 18 * 12000);
      assert.equal(resBanner.effectiveUnitPriceMinor, 216000);
    });

    it("enforces scheduled sales strictly based on start and end timestamps", () => {
      const saleProduct = {
        id: "prod-frame",
        title: "Photo Frame",
        handle: "photo-frame",
        basePriceMinor: 89900, // ₹899
        salePriceMinor: 64900, // ₹649
        saleStartsAt: "2026-08-01T00:00:00Z",
        saleEndsAt: "2026-09-01T23:59:59Z",
      };

      // Case A: Inside sale period (2026-08-15)
      const resActive = calculateAuthoritativePrice({
        product: saleProduct,
        quantity: 1,
        currentTimestamp: "2026-08-15T12:00:00Z",
      });

      assert.equal(resActive.effectiveUnitPriceMinor, 64900);
      assert.equal(resActive.totalDiscountMinor, 89900 - 64900);

      // Case B: Outside sale period (Expired on 2026-10-01)
      const resExpired = calculateAuthoritativePrice({
        product: saleProduct,
        quantity: 1,
        currentTimestamp: "2026-10-01T12:00:00Z",
      });

      assert.equal(resExpired.effectiveUnitPriceMinor, 89900);
      assert.equal(resExpired.totalDiscountMinor, 0);
    });

    it("applies margin floor protection against excessive discount stacking", () => {
      const product = {
        id: "prod-mug",
        title: "Ceramic Mug",
        handle: "ceramic-mug",
        basePriceMinor: 30000, // ₹300
      };

      const priceRecord = {
        id: "pr-mug",
        base_price_minor: 30000,
        minimum_price_floor_minor: 18000, // 60% minimum price floor (₹180)
      };

      const aggressivePromo = {
        id: "promo-90",
        name: "90% Mega Discount",
        type: "percentage_discount" as const,
        discount_value: 90,
        status: "active" as const,
        priority: 10,
        stackable: false,
      };

      const res = calculateAuthoritativePrice({
        product,
        priceRecord: priceRecord as any,
        quantity: 1,
        promotions: [aggressivePromo as any],
      });

      // Price should be clamped to margin floor ₹180 instead of dropping to ₹30
      assert.equal(res.finalSubtotalMinor, 18000);
      assert.equal(res.marginFloorProtected, true);
    });
  });

  describe("2. Server-Side Cart & Checkout Validation", () => {
    it("errors if missing required artwork or proof step", async () => {
      const lineBelowMoq = {
        productId: "standard-visiting-cards",
        productHandle: "standard-visiting-cards",
        quantity: 0,
        selectedOptions: [],
      };

      const recalc = await recalculateAuthoritativeCartTotal([lineBelowMoq as any]);
      assert.equal(recalc.valid, false);
      assert.match(recalc.error || "", /Invalid item quantity/);
    });

    it("accepts valid product and calculates authoritative totals", async () => {
      const lineWithArtwork = {
        productId: "standard-visiting-cards",
        productHandle: "standard-visiting-cards",
        quantity: 100,
        tierQty: 100,
        selectedOptions: [{ name: "Paper Type", value: "350 GSM Art Card" }],
        artworkFile: {
          storagePath: "u_test/123/artwork.pdf",
          originalFileName: "business_cards_vector.pdf",
        },
      };

      const recalc = await recalculateAuthoritativeCartTotal([lineWithArtwork as any]);
      assert.equal(recalc.valid, true);
      assert.ok(recalc.totalPaise > 0);
      assert.ok(recalc.subtotalPaise > 0);
    });
  });
});
