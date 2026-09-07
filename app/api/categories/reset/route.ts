import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { categories as staticCategories } from "@/lib/data/categories";
import { products as staticProducts } from "@/lib/data/products";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const supabase = await createClient();

    // 1. Delete ALL existing category templates, product-category links, and categories
    await supabase.from("category_attribute_templates").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    await supabase.from("product_category_links").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    await supabase.from("categories").delete().neq("id", "00000000-0000-0000-0000-000000000000");

    // 2. Insert clean, pristine static categories with verified icons & sequential sort orders (10, 20, 30...)
    const categoryMap = new Map<string, string>(); // handle -> id
    for (let i = 0; i < staticCategories.length; i++) {
      const sc = staticCategories[i];
      const { data: inserted, error: insErr } = await supabase
        .from("categories")
        .insert({
          handle: sc.handle,
          title: sc.title,
          blurb: sc.blurb || "",
          icon: sc.icon || "Folder",
          status: "active",
          sort_order: (i + 1) * 10,
          is_featured: !!sc.inQuickStrip,
          is_nav: sc.inNav ?? true,
          parent_id: null,
          image_url: null, // Reset any messy or broken test image URLs
          banner_url: null,
          seo_title: `${sc.title} | Custom Printing Services`,
          seo_description: sc.blurb || `Shop ${sc.title} printing with doorstep delivery.`,
        })
        .select("id, handle")
        .single();

      if (insErr) {
        console.error("Failed to insert default category:", sc.handle, insErr);
      } else if (inserted) {
        categoryMap.set(inserted.handle, inserted.id);
      }
    }

    // 3. Re-link existing database products to the pristine categories
    const { data: dbProducts } = await supabase.from("products").select("id, handle, title");

    if (dbProducts && dbProducts.length > 0) {
      const staticProdMap = new Map(staticProducts.map((p) => [p.handle, p]));

      for (const prod of dbProducts) {
        const staticP = staticProdMap.get(prod.handle);
        const targetHandles = new Set<string>();

        if (staticP?.categoryHandles) {
          staticP.categoryHandles.forEach((h) => targetHandles.add(h));
        }

        // Infer from product title if no static category handles exist
        const lower = prod.title.toLowerCase();
        if (lower.includes("card")) targetHandles.add("visiting-cards");
        if (
          lower.includes("t-shirt") ||
          lower.includes("polo") ||
          lower.includes("hoodie") ||
          lower.includes("jacket") ||
          lower.includes("apparel") ||
          lower.includes("sweatshirt")
        ) {
          targetHandles.add("apparel");
        }
        if (
          lower.includes("mug") ||
          lower.includes("frame") ||
          lower.includes("photo") ||
          lower.includes("gift") ||
          lower.includes("canvas")
        ) {
          targetHandles.add("personalised-gifts");
        }
        if (
          lower.includes("stamp") ||
          lower.includes("letterhead") ||
          lower.includes("pen") ||
          lower.includes("flyer") ||
          lower.includes("notebook") ||
          lower.includes("envelope") ||
          lower.includes("stationery")
        ) {
          targetHandles.add("stationery-stamps");
        }
        if (
          lower.includes("sticker") ||
          lower.includes("label") ||
          lower.includes("box") ||
          lower.includes("packaging") ||
          lower.includes("tape")
        ) {
          targetHandles.add("labels-packaging");
        }
        if (
          lower.includes("sign") ||
          lower.includes("standee") ||
          lower.includes("banner") ||
          lower.includes("poster")
        ) {
          targetHandles.add("signage");
        }
        if (
          lower.includes("bottle") ||
          lower.includes("tumbler") ||
          lower.includes("sipper") ||
          lower.includes("coaster")
        ) {
          targetHandles.add("decor-drinkware");
        }

        for (const catHandle of targetHandles) {
          const catId = categoryMap.get(catHandle);
          if (catId) {
            await supabase.from("product_category_links").insert({
              product_id: prod.id,
              category_id: catId,
            });
          }
        }
      }
    }

    revalidatePath("/admin/categories");
    revalidatePath("/products");
    revalidatePath("/", "layout");

    return NextResponse.json({
      success: true,
      message: "Database categories successfully reset to default clean state.",
      count: categoryMap.size,
    });
  } catch (error: any) {
    console.error("Reset categories error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to reset categories" },
      { status: 500 }
    );
  }
}
