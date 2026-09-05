import { NextRequest, NextResponse } from "next/server";
import { fetchPublicCatalogue } from "@/lib/catalogue/queries";
import { searchProducts as searchStaticProducts, getProduct as getStaticProduct } from "@/lib/data/products";
import { formatMoney } from "@/lib/pricing";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();
  // Safe clamping of limit
  const limit = Math.max(1, Math.min(20, parseInt(searchParams.get("limit") || "8", 10)));

  if (!q || q.length < 1) {
    return NextResponse.json({ products: [] });
  }

  try {
    // 1. Query database catalog (which now expands query synonyms e.g. tshirt -> t-shirt)
    const { products: dbProducts } = await fetchPublicCatalogue({
      q,
      pageSize: limit * 2,
      page: 1,
      sort: "relevance",
    });

    // 2. Also query rich static catalog with lenient tags and title matching
    const staticMatches = searchStaticProducts(q, limit * 2);

    // 3. Merge results, deduplicate by handle
    const seenHandles = new Set<string>();
    const mergedResults: any[] = [];

    // Helper to calculate non-zero display price
    const resolveBasePrice = (p: any, staticDef?: any): number => {
      if (typeof p.base_price_minor === "number" && p.base_price_minor > 0) {
        return p.base_price_minor;
      }
      if (p.variants && p.variants.length > 0 && typeof p.variants[0]?.price_minor === "number" && p.variants[0].price_minor > 0) {
        return p.variants[0].price_minor;
      }
      if (staticDef?.priceFrom?.amount && staticDef.priceFrom.amount > 0) {
        return staticDef.priceFrom.amount;
      }
      return 19900; // Safe minimum default ₹199
    };

    // Helper to resolve product image
    const resolveImage = (p: any, staticDef?: any): string => {
      if (p.media && p.media.length > 0 && p.media[0]?.url) {
        return p.media[0].url;
      }
      if (staticDef?.images && staticDef.images.length > 0 && staticDef.images[0]?.url) {
        return staticDef.images[0].url;
      }
      return "/placeholder-product.png";
    };

    // Helper to resolve unit
    const resolveUnit = (unitStr?: string): string => {
      if (!unitStr) return "per piece";
      return unitStr.startsWith("per ") ? unitStr : `per ${unitStr}`;
    };

    // Add DB products first
    for (const dbP of dbProducts) {
      if (seenHandles.has(dbP.handle)) continue;
      seenHandles.add(dbP.handle);

      const staticDef = getStaticProduct(dbP.handle);
      const basePrice = resolveBasePrice(dbP, staticDef);

      mergedResults.push({
        id: dbP.id,
        handle: dbP.handle,
        title: dbP.title,
        subtitle: dbP.subtitle || staticDef?.subtitle || "",
        productType: dbP.product_type || staticDef?.productType || "Print",
        priceUnit: resolveUnit(dbP.unit || staticDef?.priceUnit),
        priceFormatted: formatMoney({ amount: basePrice, currencyCode: "INR" }),
        priceFrom: { amount: basePrice, currencyCode: "INR" },
        image: resolveImage(dbP, staticDef),
      });
    }

    // Add static matches if not already included
    for (const sp of staticMatches) {
      if (seenHandles.has(sp.handle)) continue;
      seenHandles.add(sp.handle);

      const basePrice = resolveBasePrice({}, sp);

      mergedResults.push({
        id: sp.id,
        handle: sp.handle,
        title: sp.title,
        subtitle: sp.subtitle || "",
        productType: sp.productType || "Print",
        priceUnit: resolveUnit(sp.priceUnit),
        priceFormatted: formatMoney({ amount: basePrice, currencyCode: "INR" }),
        priceFrom: { amount: basePrice, currencyCode: "INR" },
        image: resolveImage({}, sp),
      });
    }

    // Slice to the requested limit
    const finalResults = mergedResults.slice(0, limit);

    return NextResponse.json({ products: finalResults });
  } catch (error) {
    console.error("Storefront Search API error:", error);
    return NextResponse.json({ products: [] }, { status: 500 });
  }
}
