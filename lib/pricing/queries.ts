import { createClient } from "@/lib/supabase/server";
import type {
  DatabasePriceBook,
  DatabaseProductPrice,
  DatabasePromotion,
  PricingHealthIssue,
} from "./types";

/**
 * Auto-Seed Default Retail Price Book if missing
 */
export async function getOrCreateDefaultPriceBook(): Promise<DatabasePriceBook | null> {
  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("price_books")
    .select("*")
    .eq("code", "DEFAULT_RETAIL")
    .maybeSingle();

  if (existing) return existing as DatabasePriceBook;

  const { data: inserted, error } = await supabase
    .from("price_books")
    .insert({
      name: "Default Retail Price Book",
      code: "DEFAULT_RETAIL",
      description: "Standard customer-facing retail price list in INR.",
      currency: "INR",
      status: "active",
      priority: 0,
      is_default: true,
    })
    .select("*")
    .single();

  if (error) {
    console.error("[getOrCreateDefaultPriceBook error]:", error);
    return null;
  }

  return inserted as DatabasePriceBook;
}

import { autoSyncStaticCatalogueIfEmpty } from "@/lib/catalogue/queries";

/**
 * Fetch Pricing Engine Dashboard Metrics & Rules
 */
export async function fetchPricingDashboardData(): Promise<{
  priceBooks: DatabasePriceBook[];
  activeSalesCount: number;
  scheduledSalesCount: number;
  promotions: DatabasePromotion[];
  healthIssues: PricingHealthIssue[];
  productPrices: DatabaseProductPrice[];
}> {
  const supabase = await createClient();
  await getOrCreateDefaultPriceBook();
  await autoSyncStaticCatalogueIfEmpty();

  // Run in parallel for high performance
  const [
    { data: priceBooksData },
    { data: promotionsData },
    { data: productPricesData },
  ] = await Promise.all([
    supabase.from("price_books").select("*").order("priority", { ascending: false }),
    supabase.from("promotions_and_sales").select("*").order("created_at", { ascending: false }),
    supabase
      .from("product_prices")
      .select(
        `
        *,
        product:products (id, title, handle, sku),
        product_quantity_tiers (*),
        price_book:price_books (*)
      `
      )
      .eq("status", "active")
      .limit(100),
  ]);

  const priceBooks = (priceBooksData || []) as DatabasePriceBook[];
  const promotions = (promotionsData || []) as DatabasePromotion[];
  let productPrices = (productPricesData || []) as DatabaseProductPrice[];

  // If database product_prices is empty, auto-seed with static catalog for seamless zero-config operation
  if (productPrices.length === 0) {
    const defaultBook = priceBooks.find((b) => b.is_default) || priceBooks[0] || {
      id: "default-retail-book",
      name: "Default Retail Price Book",
      code: "DEFAULT_RETAIL",
      description: "Standard customer-facing retail price list in INR.",
      currency: "INR",
      status: "active" as const,
      priority: 0,
      is_default: true,
      version: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { products: staticProds } = await import("@/lib/data/products/index");
    
    // Fetch products from DB
    const { data: dbProds } = await supabase.from("products").select("id, handle, title, sku");
    const dbProdsMap = new Map((dbProds || []).map((p) => [p.handle, p]));

    const mockPriceList: DatabaseProductPrice[] = [];

    for (const sp of staticProds) {
      const dbProd = dbProdsMap.get(sp.handle) || {
        id: sp.id || `prod-${sp.handle}`,
        handle: sp.handle,
        title: sp.title,
        sku: `PRT-${sp.handle.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10)}-001`,
      };

      const basePriceMinor = sp.priceFrom ? sp.priceFrom.amount : 19900;
      const compareAtMinor = sp.compareAtFrom ? sp.compareAtFrom.amount : null;

      const tiers = (sp.quantityTiers || []).map((t, idx) => ({
        id: `tier-${sp.handle}-${t.qty}`,
        product_price_id: `price-${sp.handle}`,
        min_quantity: t.qty,
        max_quantity: sp.quantityTiers[idx + 1] ? sp.quantityTiers[idx + 1].qty - 1 : null,
        tier_price_minor: t.price.amount,
        discount_percent: basePriceMinor > 0 && t.price.amount < basePriceMinor
          ? Number((((basePriceMinor - t.price.amount) / basePriceMinor) * 100).toFixed(2))
          : 0,
        sort_order: idx * 10,
      }));

      const synthRecord: DatabaseProductPrice = {
        id: `price-${sp.handle}`,
        product_id: dbProd.id,
        variant_id: null,
        price_book_id: defaultBook.id,
        base_price_minor: basePriceMinor,
        compare_at_price_minor: compareAtMinor,
        cost_price_minor: Math.round(basePriceMinor * 0.6),
        minimum_price_floor_minor: Math.round(basePriceMinor * 0.7),
        currency: "INR",
        status: "active",
        version: 1,
        effective_from: null,
        effective_until: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        product: {
          id: dbProd.id,
          title: dbProd.title || sp.title,
          handle: dbProd.handle || sp.handle,
          sku: dbProd.sku || `PRT-${sp.handle.toUpperCase().slice(0, 8)}`,
        },
        quantity_tiers: tiers,
        product_quantity_tiers: tiers,
        price_book: defaultBook,
      };

      mockPriceList.push(synthRecord);

      // Best-effort background DB persist if connected
      try {
        if (dbProdsMap.has(sp.handle) && defaultBook.id !== "default-retail-book") {
          const { data: insertedPrice } = await supabase
            .from("product_prices")
            .upsert(
              {
                product_id: dbProd.id,
                price_book_id: defaultBook.id,
                base_price_minor: basePriceMinor,
                compare_at_price_minor: compareAtMinor,
                cost_price_minor: Math.round(basePriceMinor * 0.6),
                minimum_price_floor_minor: Math.round(basePriceMinor * 0.7),
                currency: "INR",
                status: "active",
                version: 1,
              },
              { onConflict: "product_id,variant_id,price_book_id" }
            )
            .select("id")
            .maybeSingle();

          if (insertedPrice && sp.quantityTiers && sp.quantityTiers.length > 0) {
            for (let tIdx = 0; tIdx < sp.quantityTiers.length; tIdx++) {
              const tier = sp.quantityTiers[tIdx];
              await supabase.from("product_quantity_tiers").insert({
                product_price_id: insertedPrice.id,
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
      } catch (err) {
        console.warn("[pricing auto-seed background warning]:", err);
      }
    }

    productPrices = mockPriceList;
  }

  const activeSalesCount = promotions.filter((p) => p.status === "active").length;
  const scheduledSalesCount = promotions.filter((p) => p.status === "scheduled").length;

  // Run health diagnostics
  const healthIssues: PricingHealthIssue[] = [];

  for (const promo of promotions) {
    if (promo.status === "active" && promo.ends_at && new Date(promo.ends_at).getTime() < Date.now()) {
      healthIssues.push({
        id: `expired-${promo.id}`,
        severity: "medium",
        type: "expired_active_sale",
        entityType: "promotion",
        entityId: promo.id,
        entityName: promo.name,
        explanation: `Promotion '${promo.name}' has passed its end date but is still marked active.`,
        recommendedAction: "Pause or archive this promotion.",
      });
    }
  }

  return {
    priceBooks,
    activeSalesCount,
    scheduledSalesCount,
    promotions,
    healthIssues,
    productPrices,
  };
}

/**
 * Fetch the highest-priority active promotional sale for customer storefront banner
 */
export async function fetchActiveStorefrontPromotion(): Promise<DatabasePromotion | null> {
  try {
    const supabase = await createClient();
    const now = new Date().toISOString();

    const { data } = await supabase
      .from("promotions_and_sales")
      .select("*")
      .eq("status", "active")
      .or(`starts_at.is.null,starts_at.lte.${now}`)
      .or(`ends_at.is.null,ends_at.gte.${now}`)
      .order("priority", { ascending: false })
      .limit(1)
      .maybeSingle();

    return (data || null) as DatabasePromotion | null;
  } catch (err) {
    console.error("[fetchActiveStorefrontPromotion error]:", err);
    return null;
  }
}

