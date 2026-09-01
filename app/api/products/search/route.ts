import { NextRequest, NextResponse } from "next/server";
import { getStorefrontAllProducts } from "@/lib/catalogue/storefront-queries";
import { formatMoney } from "@/lib/pricing";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim().toLowerCase();
  const limit = parseInt(searchParams.get("limit") || "8", 10);

  if (!q || q.length < 1) {
    return NextResponse.json({ products: [] });
  }

  try {
    const allProducts = await getStorefrontAllProducts();
    
    // Fuzzy/substring match across title, subtitle, tags, productType, and categoryHandles
    const matches = allProducts.filter((p) => {
      const titleMatch = p.title.toLowerCase().includes(q);
      const subtitleMatch = p.subtitle ? p.subtitle.toLowerCase().includes(q) : false;
      const tagMatch = Array.isArray(p.tags) && p.tags.some((t) => t.toLowerCase().includes(q));
      const typeMatch = p.productType ? p.productType.toLowerCase().includes(q) : false;
      const handleMatch = p.handle.toLowerCase().includes(q.replace(/\s+/g, "-"));
      return titleMatch || subtitleMatch || tagMatch || typeMatch || handleMatch;
    });

    const results = matches.slice(0, limit).map((p) => ({
      id: p.id,
      handle: p.handle,
      title: p.title,
      subtitle: p.subtitle || "",
      productType: p.productType || "Print",
      priceUnit: p.priceUnit || "per piece",
      priceFormatted: formatMoney(p.priceFrom),
      image: p.images && p.images[0] ? p.images[0].url : "",
    }));

    return NextResponse.json({ products: results });
  } catch (error) {
    console.error("Storefront Search API error:", error);
    return NextResponse.json({ products: [] }, { status: 500 });
  }
}
