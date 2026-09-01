import { createClient } from "@/lib/supabase/server";
import { products as staticProducts } from "@/lib/data/products";
import { categories as staticCategories } from "@/lib/data/categories";
import { autoSeedAttributesIfEmpty } from "./attributes";
import type {
  AdminProductListFilter,
  AdminProductListResult,
  DatabaseProduct,
  DatabaseCategory,
  DatabaseCatalogAuditLog,
} from "./types";

/**
 * Auto-sync helper: Seeds static categories, products, price books, and attribute templates
 * into PostgreSQL if the database catalogue is currently empty.
 */
export async function autoSyncStaticCatalogueIfEmpty(): Promise<void> {
  try {
    const supabase = await createClient();
    const { count, error } = await supabase
      .from("products")
      .select("id", { count: "exact", head: true });

    if (error || (count && count > 0)) return;

    // 0. Seed attribute definitions
    await autoSeedAttributesIfEmpty();

    // 1. Seed categories
    const categoryMap = new Map<string, string>(); // handle -> UUID
    for (let i = 0; i < staticCategories.length; i++) {
      const cat = staticCategories[i];
      const { data: inserted } = await supabase
        .from("categories")
        .upsert(
          {
            handle: cat.handle,
            title: cat.title,
            blurb: cat.blurb || "",
            icon: cat.icon || "Folder",
            status: "active",
            sort_order: i * 10,
            is_featured: !!cat.inQuickStrip,
            seo_title: `${cat.title} | Custom Printing Services`,
            seo_description: cat.blurb || `Shop ${cat.title} printing with doorstep delivery.`,
          },
          { onConflict: "handle" }
        )
        .select("id, handle")
        .single();

      if (inserted) {
        categoryMap.set(inserted.handle, inserted.id);
      }
    }

    // 2. Ensure Default Price Book exists
    let { data: defaultPriceBook } = await supabase
      .from("price_books")
      .select("id")
      .eq("code", "DEFAULT_RETAIL")
      .maybeSingle();

    if (!defaultPriceBook) {
      const { data: newBook } = await supabase
        .from("price_books")
        .insert({
          name: "Default Retail Price Book",
          code: "DEFAULT_RETAIL",
          description: "Standard customer-facing retail price list in INR.",
          currency: "INR",
          status: "active",
          priority: 0,
          is_default: true,
          version: 1,
        })
        .select("id")
        .single();
      defaultPriceBook = newBook;
    }

    // 3. Seed initial sample products from static definitions
    for (let i = 0; i < staticProducts.length; i++) {
      const sp = staticProducts[i];
      const basePriceMinor = sp.priceFrom ? sp.priceFrom.amount : 19900;
      const compareAtMinor = sp.compareAtFrom ? sp.compareAtFrom.amount : null;

      const { data: prod } = await supabase
        .from("products")
        .upsert(
          {
            handle: sp.handle,
            title: sp.title,
            subtitle: sp.subtitle || "",
            description: sp.description || "",
            sku: `PRT-${sp.handle.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 12)}-001`,
            status: "active",
            visibility: "public",
            product_type: sp.productType || "Print",
            brand: "Doon Print Studio",
            tags: sp.tags || [],
            badges: sp.badges || [],
            unit: sp.priceUnit || "pieces",
            min_order_qty: sp.minOrderQty || 1,
            qty_increment: 1,
            turnaround_days: sp.turnaroundDays || 3,
            is_featured: sp.badges.includes("popular") || sp.badges.includes("bestseller"),
            same_day_eligible: !!sp.sameDayEligible,
            bulk_eligible: true,
            requires_artwork: !sp.uploadOnly,
            requires_proof: true,
            customizable: !!sp.customizable,
            upload_only: !!sp.uploadOnly,
            sort_order: i * 10,
            version: 1,
            base_price_minor: basePriceMinor,
            compare_at_price_minor: compareAtMinor,
            cost_price_minor: Math.round(basePriceMinor * 0.6),
            seo_title: `${sp.title} | Custom Online Printing`,
            seo_description: sp.subtitle || sp.description.slice(0, 150),
            published_at: new Date().toISOString(),
          },
          { onConflict: "handle" }
        )
        .select("id")
        .single();

      if (prod) {
        // Link Categories
        if (sp.categoryHandles && sp.categoryHandles.length > 0) {
          for (const catHandle of sp.categoryHandles) {
            const catId = categoryMap.get(catHandle);
            if (catId) {
              await supabase
                .from("product_category_links")
                .upsert(
                  { product_id: prod.id, category_id: catId },
                  { onConflict: "product_id,category_id" }
                );
            }
          }
        }

        // Seed Media Images
        if (sp.images && sp.images.length > 0) {
          for (let mIdx = 0; mIdx < sp.images.length; mIdx++) {
            const img = sp.images[mIdx];
            await supabase.from("product_media").insert({
              product_id: prod.id,
              url: img.url,
              alt_text: img.altText || sp.title,
              width: img.width || 800,
              height: img.height || 800,
              is_primary: mIdx === 0,
              sort_order: mIdx * 10,
            });
          }
        }

        // Seed Options
        if (sp.options && sp.options.length > 0) {
          for (let oIdx = 0; oIdx < sp.options.length; oIdx++) {
            const opt = sp.options[oIdx];
            await supabase.from("product_options").insert({
              product_id: prod.id,
              name: opt.name,
              values: opt.values,
              sort_order: oIdx * 10,
            });
          }
        }

        // Seed Variants
        if (sp.variants && sp.variants.length > 0) {
          for (let vIdx = 0; vIdx < sp.variants.length; vIdx++) {
            const v = sp.variants[vIdx];
            await supabase.from("product_variants").upsert(
              {
                product_id: prod.id,
                sku: v.sku,
                title: v.title,
                available_for_sale: v.availableForSale ?? true,
                selected_options: v.selectedOptions || [],
                price_factor: v.priceFactor || 1.0,
                price_minor: v.price ? v.price.amount : basePriceMinor,
                sale_price_minor: v.compareAtPrice ? v.price.amount : null,
                cost_price_minor: Math.round(basePriceMinor * 0.6),
                inventory_quantity: 100,
                status: "active",
                sort_order: vIdx * 10,
              },
              { onConflict: "sku" }
            );
          }
        }

        // Seed Retail Price and Quantity Tiers
        if (defaultPriceBook) {
          const { data: priceRecord } = await supabase
            .from("product_prices")
            .upsert(
              {
                product_id: prod.id,
                price_book_id: defaultPriceBook.id,
                base_price_minor: basePriceMinor,
                compare_at_price_minor: compareAtMinor,
                cost_price_minor: Math.round(basePriceMinor * 0.6),
                minimum_price_floor_minor: Math.round(basePriceMinor * 0.4),
                currency: "INR",
                status: "active",
                version: 1,
              },
              { onConflict: "product_id,variant_id,price_book_id" }
            )
            .select("id")
            .maybeSingle();

          if (priceRecord && sp.quantityTiers && sp.quantityTiers.length > 0) {
            for (let tIdx = 0; tIdx < sp.quantityTiers.length; tIdx++) {
              const tier = sp.quantityTiers[tIdx];
              await supabase.from("product_quantity_tiers").insert({
                product_price_id: priceRecord.id,
                min_quantity: tier.qty,
                max_quantity: sp.quantityTiers[tIdx + 1] ? sp.quantityTiers[tIdx + 1].qty - 1 : null,
                tier_price_minor: tier.price.amount,
                discount_percent:
                  basePriceMinor > 0 && tier.price.amount < basePriceMinor
                    ? Number((((basePriceMinor - tier.price.amount) / basePriceMinor) * 100).toFixed(2))
                    : 0,
                sort_order: tIdx * 10,
              });
            }
          }
        }
      }
    }
  } catch (err) {
    console.error("Auto-sync static catalogue failed:", err);
  }
}

/**
 * Fetch filtered, paginated products for the Admin Command Center
 */
export async function fetchAdminProducts(
  filter: AdminProductListFilter = {}
): Promise<AdminProductListResult> {
  const supabase = await createClient();
  await autoSyncStaticCatalogueIfEmpty();

  const page = Math.max(1, filter.page || 1);
  const pageSize = Math.max(1, Math.min(100, filter.pageSize || 50));
  const offset = (page - 1) * pageSize;

  let query = supabase.from("products").select(
    `
      *,
      categories:product_category_links(
        category:categories(id, handle, title)
      ),
      media:product_media(id, url, alt_text, is_primary, sort_order),
      variants:product_variants(id, sku, title, price_minor, available_for_sale, status)
    `,
    { count: "exact" }
  );

  // Status Filter
  if (filter.status && filter.status !== "ALL") {
    query = query.eq("status", filter.status);
  }

  // Visibility Filter
  if (filter.visibility && filter.visibility !== "ALL") {
    query = query.eq("visibility", filter.visibility);
  }

  // Product Type Filter
  if (filter.productType && filter.productType !== "ALL") {
    query = query.eq("product_type", filter.productType);
  }

  // Featured Filter
  if (filter.isFeatured !== undefined && filter.isFeatured !== "ALL") {
    query = query.eq("is_featured", filter.isFeatured === true);
  }

  // Category Filter
  if (filter.categoryHandle && filter.categoryHandle !== "ALL") {
    const { data: matchedCats } = await supabase
      .from("categories")
      .select("id")
      .eq("handle", filter.categoryHandle);

    if (matchedCats && matchedCats.length > 0) {
      const catIds = matchedCats.map((c) => c.id);
      const { data: linkRows } = await supabase
        .from("product_category_links")
        .select("product_id")
        .in("category_id", catIds);

      const productIds = (linkRows || []).map((l) => l.product_id);
      if (productIds.length > 0) {
        query = query.in("id", productIds);
      } else {
        const { data: categoryRows } = await supabase
          .from("categories")
          .select("id, handle, title")
          .order("sort_order", { ascending: true });

        return {
          products: [],
          totalCount: 0,
          page,
          pageSize,
          totalPages: 0,
          categories: categoryRows || [],
        };
      }
    } else {
      const { data: categoryRows } = await supabase
        .from("categories")
        .select("id, handle, title")
        .order("sort_order", { ascending: true });

      return {
        products: [],
        totalCount: 0,
        page,
        pageSize,
        totalPages: 0,
        categories: categoryRows || [],
      };
    }
  }

  // Text Search across title, SKU, handle
  if (filter.q && filter.q.trim()) {
    const term = filter.q.trim();
    query = query.or(`title.ilike.%${term}%,sku.ilike.%${term}%,handle.ilike.%${term}%`);
  }

  // Sorting
  switch (filter.sort) {
    case "oldest":
      query = query.order("created_at", { ascending: true });
      break;
    case "title_asc":
      query = query.order("title", { ascending: true });
      break;
    case "title_desc":
      query = query.order("title", { ascending: false });
      break;
    case "sort_order":
      query = query.order("sort_order", { ascending: true });
      break;
    case "newest":
    default:
      query = query.order("created_at", { ascending: false });
      break;
  }

  const { data: rawProducts, count, error } = await query.range(offset, offset + pageSize - 1);

  if (error) {
    return {
      products: [],
      totalCount: 0,
      page,
      pageSize,
      totalPages: 0,
      categories: [],
      error: error.message,
    };
  }

  // Fetch all active categories for filtering dropdown
  const { data: categoryRows } = await supabase
    .from("categories")
    .select("id, handle, title")
    .order("sort_order", { ascending: true });

  const totalCount = count || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  // Normalize products
  const products: DatabaseProduct[] = (rawProducts || []).map((p: any) => ({
    ...p,
    categories: (p.categories || []).map((c: any) => c.category).filter(Boolean),
    media: (p.media || []).sort((a: any, b: any) => a.sort_order - b.sort_order),
    variants: p.variants || [],
  }));

  return {
    products,
    totalCount,
    page,
    pageSize,
    totalPages,
    categories: categoryRows || [],
  };
}

/**
 * Fetch a single product by ID with full relations for the Admin Editor
 */
export async function fetchAdminProductById(productId: string): Promise<{
  product: DatabaseProduct | null;
  categories: DatabaseCategory[];
  auditLogs: DatabaseCatalogAuditLog[];
  error?: string;
}> {
  const supabase = await createClient();

  const [
    { data: rawProd, error: prodErr },
    { data: allCats },
    { data: auditLogsData },
  ] = await Promise.all([
    supabase
      .from("products")
      .select(
        `
        *,
        categories:product_category_links(
          category:categories(*)
        ),
        media:product_media(*),
        options:product_options(*),
        variants:product_variants(*),
        attributes:product_attribute_values(
          *,
          attribute:attribute_definitions(*)
        )
      `
      )
      .eq("id", productId)
      .single(),
    supabase.from("categories").select("*").order("sort_order", { ascending: true }),
    supabase
      .from("catalog_audit_logs")
      .select("*")
      .eq("entity_id", productId)
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  if (prodErr || !rawProd) {
    return {
      product: null,
      categories: (allCats || []) as DatabaseCategory[],
      auditLogs: [],
      error: prodErr?.message || "Product not found",
    };
  }

  const p: any = rawProd;
  const product: DatabaseProduct = {
    ...p,
    categories: (p.categories || []).map((c: any) => c.category).filter(Boolean),
    media: (p.media || []).sort((a: any, b: any) => a.sort_order - b.sort_order),
    options: (p.options || []).sort((a: any, b: any) => a.sort_order - b.sort_order),
    variants: (p.variants || []).sort((a: any, b: any) => a.sort_order - b.sort_order),
    attributes: p.attributes || [],
  };

  return {
    product,
    categories: (allCats || []) as DatabaseCategory[],
    auditLogs: (auditLogsData || []) as DatabaseCatalogAuditLog[],
  };
}

/**
 * Fetch all categories with subcategories and product counts for Admin
 */
export async function fetchAdminCategories(): Promise<DatabaseCategory[]> {
  const supabase = await createClient();
  await autoSyncStaticCatalogueIfEmpty();

  const { data, error } = await supabase
    .from("categories")
    .select(
      `
      *,
      attribute_templates:category_attribute_templates(
        *,
        attribute:attribute_definitions(*)
      )
    `
    )
    .order("sort_order", { ascending: true });

  if (error || !data) return [];
  return data as DatabaseCategory[];
}
