import { NextRequest, NextResponse } from "next/server";
import { fetchPublicCatalogue } from "@/lib/catalogue/queries";
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
    const { products } = await fetchPublicCatalogue({
      q,
      pageSize: limit,
      page: 1,
      sort: "relevance"
    });

    const results = products.map((p) => {
      // Find base price or lowest tier price for formatting
      const basePrice = p.variants?.[0]?.price_minor || 0;
      
      return {
        id: p.id,
        handle: p.handle,
        title: p.title,
        subtitle: p.subtitle || "",
        productType: p.product_type || "Print",
        priceUnit: p.unit || "piece",
        priceFormatted: formatMoney({ amount: basePrice, currencyCode: "INR" }),
        image: p.media && p.media.length > 0 ? p.media[0].url : "/placeholder-product.png",
      };
    });

    return NextResponse.json({ products: results });
  } catch (error) {
    console.error("Storefront Search API error:", error);
    return NextResponse.json({ products: [] }, { status: 500 });
  }
}
