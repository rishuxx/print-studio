import { NextResponse } from "next/server";
import { getStorefrontCategories } from "@/lib/catalogue/storefront-queries";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const categories = await getStorefrontCategories();
    return NextResponse.json(
      {
        success: true,
        categories,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
