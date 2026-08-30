import { createClient } from "@/lib/supabase/server";
import { products as staticProducts } from "@/lib/data/products";
import { categories as staticCategories } from "@/lib/data/categories";
import type {
  AdminProductListFilter,
  AdminProductListResult,
  DatabaseProduct,
  DatabaseCategory,
} from "./types";

/**
 * Auto-sync helper: Seeds static categories and products into PostgreSQL
 * if the database catalogue is currently empty.
 */
export async function autoSyncStaticCatalogueIfEmpty(): Promise<void> {
  try {
    const supabase = await createClient();
    const { count, error } = await supabase
      .from("products")
      .select("id", { count: "exact", head: true });

    if (error || (count && count > 0)) return;

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

    // 2. Seed initial sample products from static definitions
    for (let i = 0; i < staticProducts.length; i++) {
      const sp = staticProducts[i];
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

        // Auto-seed Default Retail Price and Quantity Tiers for product
        const { data: defaultPriceBook } = await supabase
          .from("price_books")
          .select("id")
          .eq("code", "DEFAULT_RETAIL")
          .maybeSingle();

        if (defaultPriceBook) {
          const basePriceMinor = sp.priceFrom ? sp.priceFrom.amount : 19900;
          const compareAtMinor = sp.compareAtFrom ? sp.compareAtFrom.amount : null;

          const { data: priceRecord } = await supabase
            .from("product_prices")
            .upsert(
              {
                product_id: prod.id,
                price_book_id: defaultPriceBook.id,
                base_price_minor: basePriceMinor,
                compare_at_price_minor: compareAtMinor,
                cost_price_minor: Math.round(basePriceMinor * 0.6), // 40% gross margin estimate
                minimum_price_floor_minor: Math.round(basePriceMinor * 0.7), // 30% margin protection floor
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
    console.error("[autoSyncStaticCatalogueIfEmpty error]:", err);
  }
}

/**
 * Fetch paginated products with filters for admin list view
 */
export async function fetchAdminProducts(
  filters: AdminProductListFilter
): Promise<AdminProductListResult> {
  // Sync if needed
  await autoSyncStaticCatalogueIfEmpty();

  const supabase = await createClient();
  const page = Math.max(1, filters.page || 1);
  const pageSize = Math.min(100, Math.max(10, filters.pageSize || 50));
  const offset = (page - 1) * pageSize;

  // 1. Fetch available categories for filter dropdown
  const { data: dbCategories } = await supabase
    .from("categories")
    .select("id, handle, title")
    .eq("status", "active")
    .order("sort_order", { ascending: true });

  const categories = (dbCategories || []).map((c) => ({
    id: c.id,
    handle: c.handle,
    title: c.title,
  }));

  // 2. Build filtered product query
  let query = supabase
    .from("products")
    .select(
      `
      id,
      handle,
      title,
      subtitle,
      description,
      sku,
      status,
      visibility,
      product_type,
      unit,
      min_order_qty,
      qty_increment,
      turnaround_days,
      is_featured,
      same_day_eligible,
      bulk_eligible,
      requires_artwork,
      requires_proof,
      customizable,
      upload_only,
      sort_order,
      version,
      seo_title,
      seo_description,
      canonical_url,
      created_at,
      updated_at,
      published_at,
      archived_at,
      product_category_links (
        category_id,
        categories (
          id,
          handle,
          title,
          status,
          sort_order,
          is_featured,
          blurb,
          icon,
          seo_title,
          seo_description,
          created_at,
          updated_at
        )
      )
    `,
      { count: "exact" }
    );

  if (filters.q && filters.q.trim()) {
    const term = filters.q.trim();
    query = query.or(`title.ilike.%${term}%,sku.ilike.%${term}%,handle.ilike.%${term}%`);
  }

  if (filters.status && filters.status !== "ALL") {
    query = query.eq("status", filters.status);
  }

  if (filters.visibility && filters.visibility !== "ALL") {
    query = query.eq("visibility", filters.visibility);
  }

  if (filters.isFeatured && filters.isFeatured !== "ALL") {
    query = query.eq("is_featured", filters.isFeatured === true);
  }

  // Sort allowlist
  switch (filters.sort) {
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

  query = query.range(offset, offset + pageSize - 1);

  const { data, count, error } = await query;

  if (error) {
    console.error("[fetchAdminProducts error]:", error);
    return {
      products: [],
      totalCount: 0,
      page,
      pageSize,
      totalPages: 1,
      categories,
      error: error.message,
    };
  }

  const products: DatabaseProduct[] = (data || []).map((raw) => {
    const p = raw as unknown as DatabaseProduct & {
      product_category_links?: Array<{ categories: DatabaseCategory }>;
    };
    const linkedCategories = (p.product_category_links || [])
      .map((link) => link.categories)
      .filter(Boolean);

    return {
      ...p,
      categories: linkedCategories,
    };
  });

  // Category filter in memory if joined
  const filteredProducts =
    filters.categoryHandle && filters.categoryHandle !== "ALL"
      ? products.filter((p) => p.categories?.some((c) => c.handle === filters.categoryHandle))
      : products;

  const totalCount = count || 0;
  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  return {
    products: filteredProducts,
    totalCount,
    page,
    pageSize,
    totalPages,
    categories,
  };
}

/**
 * Fetch a single product by ID or Handle for the editor
 */
export async function fetchAdminProductById(
  productIdOrHandle: string
): Promise<{ product: DatabaseProduct | null; categories: DatabaseCategory[]; error?: string }> {
  const supabase = await createClient();

  // 1. Fetch all categories
  const { data: dbCats } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  const categories = (dbCats || []) as DatabaseCategory[];

  // 2. Fetch product by UUID or handle
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    productIdOrHandle
  );

  let query = supabase.from("products").select(`
    *,
    product_category_links (
      category_id,
      categories (*)
    ),
    product_media (*),
    product_options (*),
    product_variants (*)
  `);

  if (isUuid) {
    query = query.eq("id", productIdOrHandle);
  } else {
    query = query.eq("handle", productIdOrHandle);
  }

  const { data, error } = await query.maybeSingle();

  if (error || !data) {
    return { product: null, categories, error: error?.message || "Product not found" };
  }

  const rawProd = data as unknown as DatabaseProduct & {
    product_category_links?: Array<{ categories: DatabaseCategory }>;
    product_media?: DatabaseProduct["media"];
    product_options?: DatabaseProduct["options"];
    product_variants?: DatabaseProduct["variants"];
  };

  const product: DatabaseProduct = {
    ...rawProd,
    categories: (rawProd.product_category_links || []).map((l) => l.categories).filter(Boolean),
    media: (rawProd.product_media || []).sort((a, b) => a.sort_order - b.sort_order),
    options: (rawProd.product_options || []).sort((a, b) => a.sort_order - b.sort_order),
    variants: (rawProd.product_variants || []).sort((a, b) => a.sort_order - b.sort_order),
  };

  return { product, categories };
}

/**
 * Fetch all categories with product counts for /admin/categories
 */
export async function fetchAdminCategories(): Promise<{
  categories: DatabaseCategory[];
  error?: string;
}> {
  await autoSyncStaticCatalogueIfEmpty();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select(`
      *,
      product_category_links (count)
    `)
    .order("sort_order", { ascending: true });

  if (error) {
    return { categories: [], error: error.message };
  }

  const categories: DatabaseCategory[] = (data || []).map((raw) => {
    const c = raw as unknown as DatabaseCategory & {
      product_category_links?: Array<{ count: number }>;
    };
    return {
      ...c,
      product_count: c.product_category_links?.[0]?.count || 0,
    };
  });

  return { categories };
}
