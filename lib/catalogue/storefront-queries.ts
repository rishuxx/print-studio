import { createClient as createSupabaseClient } from "@supabase/supabase-js";

function getPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY! || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
import { getProduct as getStaticProduct, getAllProducts as getStaticAllProducts } from "@/lib/data/products";
import { getCategory as getStaticCategory, categories as staticCategories } from "@/lib/data/categories";
import type { Product, ProductImage, ProductOption, ProductVariant, QuantityTier, BadgeKind } from "@/lib/commerce/types";
import { money } from "@/lib/commerce/types";
import { ProductService } from "./product-service";
import { PricingService } from "@/lib/pricing/pricing-service";

/**
 * Maps a database product record into the standard storefront Product interface
 */
export function mapDatabaseProductToStorefront(dbProduct: any, priceTiers: any[] = []): Product {
  const rawMedia = (dbProduct.media || []).slice().sort((a: any, b: any) => {
    if (a.is_primary && !b.is_primary) return -1;
    if (!a.is_primary && b.is_primary) return 1;
    return (a.sort_order || 0) - (b.sort_order || 0);
  });

  const images: ProductImage[] = rawMedia.map((m: any) => ({
    url: m.url,
    altText: m.alt_text || dbProduct.title,
    width: m.width || 800,
    height: m.height || 800,
  }));

  if (images.length === 0) {
    images.push({
      url: "/placeholder-product.png",
      altText: dbProduct.title,
      width: 800,
      height: 800,
      kind: "generic",
    });
  }

  const options: ProductOption[] = (dbProduct.options || []).map((o: any) => ({
    name: o.name,
    values: Array.isArray(o.values) ? o.values : [],
  }));

  const visibilityCheck = ProductService.getProductVisibility(dbProduct);
  const isPurchasableOverall = visibilityCheck.isPurchasable;

  const baseCalc = PricingService.calculateProductPrice({
    product: dbProduct,
    quantity: dbProduct.min_order_qty || 1,
  });

  const variants: ProductVariant[] = (dbProduct.variants || []).map((v: any) => {
    const variantCalc = PricingService.calculateProductPrice({
      product: dbProduct,
      variant: v,
      quantity: dbProduct.min_order_qty || 1,
    });
    return {
      id: v.id || v.sku,
      title: v.title,
      sku: v.sku,
      price: variantCalc.finalUnitPrice,
      compareAtPrice: variantCalc.compareAtPrice,
      availableForSale: isPurchasableOverall && v.status === "active" && v.available_for_sale,
      selectedOptions: v.selected_options || [],
      priceFactor: v.price_factor || 1.0,
    };
  });

  let quantityTiers: QuantityTier[] = priceTiers.map((t) => {
    // Recalculate each tier price accounting for sales
    const tierCalc = PricingService.calculateProductPrice({
      product: dbProduct,
      quantity: t.min_quantity,
    });
    return {
      qty: t.min_quantity,
      price: tierCalc.subtotal,
      note: t.discount_percent ? `${t.discount_percent}% off` : undefined,
    };
  });

  if (quantityTiers.length === 0) {
    const staticProd = getStaticProduct(dbProduct.handle) || getStaticProduct(dbProduct.id);
    if (staticProd && staticProd.quantityTiers && staticProd.quantityTiers.length > 0) {
      quantityTiers = staticProd.quantityTiers;
    } else {
      const basePaise = baseCalc.subtotal.amount;
      quantityTiers = [
        { qty: dbProduct.min_order_qty || 1, price: money(basePaise) },
        { qty: (dbProduct.min_order_qty || 1) * 5, price: money(Math.round(basePaise * 4.5)) },
        { qty: (dbProduct.min_order_qty || 1) * 10, price: money(Math.round(basePaise * 8.5)) },
      ];
    }
  }

  const CATEGORY_MAP: Record<string, string[]> = {
    "business-cards-visiting-cards": ["visiting-cards"],
    "business-cards-visiting-ca": ["visiting-cards"],
    "visiting-cards": ["visiting-cards"],
    "stationery-office-essentials": ["stationery-stamps"],
    "stationery-office-essentia": ["stationery-stamps"],
    "stationery-stamps": ["stationery-stamps"],
    "pens": ["stationery-stamps"],
    "apparel-t-shirts-polos-winterwear": ["apparel"],
    "apparel-t-shirts-polos-wi": ["apparel"],
    "apparel-caps-bags": ["apparel"],
    "apparel": ["apparel"],
    "stickers-labels-decals": ["labels-packaging"],
    "labels-stickers-packaging": ["labels-packaging"],
    "packaging-boxes": ["labels-packaging"],
    "labels-packaging": ["labels-packaging"],
    "signage-banners-standees": ["signage"],
    "signs-posters-marketing-materials": ["signage"],
    "signs-posters-marketing-m": ["signage"],
    "signage": ["signage"],
    "drinkware-bottles-sippers-mugs": ["decor-drinkware", "personalised-gifts"],
    "drinkware-bottles-sippers": ["decor-drinkware", "personalised-gifts"],
    "decor-drinkware": ["decor-drinkware"],
    "photo-gifts-mugs-albums": ["personalised-gifts", "decor-drinkware"],
    "personalised-gifts": ["personalised-gifts"],
  };

  const rawCatHandles = (dbProduct.categories || []).map((c: any) => c.handle || c.category_id || "general");
  const expandedCatHandles = new Set<string>();
  rawCatHandles.forEach((h: string) => {
    expandedCatHandles.add(h);
    if (CATEGORY_MAP[h]) {
      CATEGORY_MAP[h].forEach((parent) => expandedCatHandles.add(parent));
    }
  });

  // Infer primary category from title if needed
  const lowerTitle = (dbProduct.title || "").toLowerCase();
  if (lowerTitle.includes("visiting card") || lowerTitle.includes("business card") || lowerTitle.includes("cards")) {
    expandedCatHandles.add("visiting-cards");
  }
  if (lowerTitle.includes("t-shirt") || lowerTitle.includes("hoodie") || lowerTitle.includes("polo") || lowerTitle.includes("jacket") || lowerTitle.includes("sweatshirt") || lowerTitle.includes("cap")) {
    expandedCatHandles.add("apparel");
  }
  if (lowerTitle.includes("stamp") || lowerTitle.includes("letterhead") || lowerTitle.includes("notebook") || lowerTitle.includes("pen") || lowerTitle.includes("flyer") || lowerTitle.includes("envelope") || lowerTitle.includes("booklet") || lowerTitle.includes("diary")) {
    expandedCatHandles.add("stationery-stamps");
  }
  if (lowerTitle.includes("sticker") || lowerTitle.includes("label") || lowerTitle.includes("box") || lowerTitle.includes("packaging") || lowerTitle.includes("pouch") || lowerTitle.includes("bag") || lowerTitle.includes("decal") || lowerTitle.includes("tape")) {
    expandedCatHandles.add("labels-packaging");
  }
  if (lowerTitle.includes("standee") || lowerTitle.includes("banner") || lowerTitle.includes("signage") || lowerTitle.includes("board") || lowerTitle.includes("poster") || lowerTitle.includes("canopy") || lowerTitle.includes("acrylic sign")) {
    expandedCatHandles.add("signage");
  }
  if (lowerTitle.includes("bottle") || lowerTitle.includes("mug") || lowerTitle.includes("sipper") || lowerTitle.includes("flask") || lowerTitle.includes("coaster") || lowerTitle.includes("tumbler")) {
    expandedCatHandles.add("decor-drinkware");
    expandedCatHandles.add("personalised-gifts");
  }
  if (lowerTitle.includes("gift") || lowerTitle.includes("hamper") || lowerTitle.includes("frame") || lowerTitle.includes("album") || lowerTitle.includes("photo") || lowerTitle.includes("canvas") || lowerTitle.includes("calendar")) {
    expandedCatHandles.add("personalised-gifts");
  }

  const categoryHandles = Array.from(expandedCatHandles);
  const badges: BadgeKind[] = [];
  if (dbProduct.is_featured) badges.push("popular");
  if (dbProduct.same_day_eligible) badges.push("same-day");
  if (baseCalc.salePrice) badges.push("eco"); // Indicate a sale badge visually if needed

  if (Array.isArray(dbProduct.badges)) {
    dbProduct.badges.forEach((b: string) => {
      if (!badges.includes(b as BadgeKind)) {
        badges.push(b as BadgeKind);
      }
    });
  }

  return {
    id: dbProduct.id,
    handle: dbProduct.handle,
    title: dbProduct.title,
    subtitle: dbProduct.subtitle || "",
    description: dbProduct.description || "",
    productType: dbProduct.product_type || "Print",
    categoryHandles: categoryHandles.length > 0 ? categoryHandles : ["visiting-cards"],
    tags: dbProduct.tags || [],
    badges,
    images,
    options,
    variants,
    priceFrom: baseCalc.finalUnitPrice,
    compareAtFrom: baseCalc.compareAtPrice,
    quantityTiers,
    priceUnit: dbProduct.unit ? (dbProduct.unit.startsWith("per ") ? dbProduct.unit : `per ${dbProduct.unit}`) : "per piece",
    specs: [
      { label: "SKU", value: dbProduct.sku },
      { label: "Dispatch", value: `${dbProduct.turnaround_days || 3} Working Days` },
      { label: "Min Order", value: `${dbProduct.min_order_qty || 1} ${dbProduct.unit || "pcs"}` },
      ...(dbProduct.same_day_eligible ? [{ label: "Express", value: "Same-Day Ready" }] : []),
    ],
    minOrderQty: dbProduct.min_order_qty || 1,
    turnaroundDays: dbProduct.turnaround_days || 3,
    sameDayEligible: !!dbProduct.same_day_eligible,
    customizable: !!dbProduct.customizable,
    uploadOnly: !!dbProduct.upload_only,
    rating: 4.8,
    reviewCount: 42,
    faqs: [
      {
        q: "What file formats do you accept for custom printing?",
        a: "We accept PDF, PNG, JPG, EPS, AI, CDR, and TIFF files. PDF vector files are strongly recommended for the sharpest results.",
      },
      {
        q: "Do you provide a digital soft-proof before production?",
        a: "Yes, our pre-press team inspects every job and provides a digital proof for approval before printing commences.",
      },
    ],
    relatedHandles: dbProduct.merchandising_config?.relatedProductHandles || [],
    highlights: [
      "Precision HD industrial printing with calibrated CMYK colour fidelity.",
      "Strict pre-press soft-proof quality check before production release.",
      "Fast, securely packed doorstep delivery across India.",
    ],
  };
}

/**
 * Fetch product by handle for Storefront (Authoritative DB with fallback to static catalog)
 */
export async function getStorefrontProduct(handle: string): Promise<Product | undefined> {
  try {
    const supabase = getPublicClient();

    // 1. Fetch from PostgreSQL
    const { data: dbProduct } = await supabase
      .from("products")
      .select(
        `
        *,
        categories:product_category_links(
          category:categories(id, handle, title)
        ),
        media:product_media(*),
        options:product_options(*),
        variants:product_variants(*),
        prices:product_prices(
          id, base_price_minor, compare_at_price_minor,
          tiers:product_quantity_tiers(*)
        )
      `
      )
      .eq("handle", handle)
      .maybeSingle();

    if (dbProduct) {
      const p: any = dbProduct;
      const categories = (p.categories || []).map((c: any) => c.category).filter(Boolean);
      const media = (p.media || []).sort((a: any, b: any) => a.sort_order - b.sort_order);
      const options = (p.options || []).sort((a: any, b: any) => a.sort_order - b.sort_order);
      const variants = (p.variants || []).sort((a: any, b: any) => a.sort_order - b.sort_order);
      const priceRecord = p.prices?.[0];
      const tiers = priceRecord?.tiers || [];

      const mappedProduct = mapDatabaseProductToStorefront(
        {
          ...p,
          categories,
          media,
          options,
          variants,
        },
        tiers
      );
      
      const visibility = ProductService.getProductVisibility(p);
      if (!visibility.isVisible) {
        return undefined; // Hide from storefront
      }
      
      return mappedProduct;
    }
  } catch (err) {
    console.error("Failed to query DB product:", err);
  }

  // 2. Fallback to static catalog definition
  return getStaticProduct(handle);
}

/**
 * Fetch category by handle for Storefront
 */
export async function getStorefrontCategory(handle: string) {
  try {
    const supabase = getPublicClient();
    const { data: cat } = await supabase
      .from("categories")
      .select("*")
      .eq("handle", handle)
      .maybeSingle();

    if (cat && cat.status === "active") return cat;
    if (cat && cat.status !== "active") return undefined;
  } catch {}

  return getStaticCategory(handle);
}

/**
 * Fetch all products for storefront catalog
 */
export async function getStorefrontAllProducts(): Promise<Product[]> {
  try {
    const supabase = getPublicClient();
    const { data: dbProducts } = await supabase
      .from("products")
      .select(
        `
        *,
        categories:product_category_links(
          category:categories(id, handle, title)
        ),
        media:product_media(*)
      `
      )
      .eq("status", "active")
      .eq("visibility", "public")
      .order("sort_order", { ascending: true });

    if (dbProducts && dbProducts.length > 0) {
      const dbMapped = dbProducts
        .filter((p: any) => ProductService.getProductVisibility(p).isVisible)
        .map((p: any) =>
          mapDatabaseProductToStorefront({
            ...p,
            categories: (p.categories || []).map((c: any) => c.category).filter(Boolean),
            media: (p.media || []).sort((a: any, b: any) => a.sort_order - b.sort_order),
          })
        );

      // Deduplicate DB products by normalized title, prioritizing products with updated real prices
      const seenByTitle = new Map<string, Product>();
      for (const p of dbMapped) {
        const normTitle = p.title.toLowerCase().replace(/[^a-z0-9]+/g, "");
        if (!seenByTitle.has(normTitle)) {
          seenByTitle.set(normTitle, p);
        } else {
          const existing = seenByTitle.get(normTitle)!;
          if (existing.priceFrom.amount === 19900 && p.priceFrom.amount !== 19900) {
            seenByTitle.set(normTitle, p);
          }
        }
      }
      const uniqueDb = Array.from(seenByTitle.values());

      // Merge with static catalog handles to ensure full coverage
      const staticProds = getStaticAllProducts();
      const uniqueHandles = new Set(uniqueDb.map((p) => p.handle));
      const remainingStatic = staticProds.filter((p) => {
        if (uniqueHandles.has(p.handle)) return false;
        const norm = p.title.toLowerCase().replace(/[^a-z0-9]+/g, "");
        return !seenByTitle.has(norm);
      });

      return [...uniqueDb, ...remainingStatic];
    }
  } catch (err) {
    console.error("Failed to fetch all storefront products:", err);
  }

  return getStaticAllProducts();
}

/**
 * Fetch featured products for the storefront homepage
 */
export async function getStorefrontFeaturedProducts(): Promise<Product[]> {
  try {
    const supabase = getPublicClient();
    const { data: dbProducts } = await supabase
      .from("products")
      .select(
        `
        *,
        categories:product_category_links(
          category:categories(id, handle, title)
        ),
        media:product_media(*)
      `
      )
      .eq("status", "active")
      .eq("visibility", "public")
      .eq("is_featured", true)
      .order("sort_order", { ascending: true })
      .limit(10);

    if (dbProducts && dbProducts.length > 0) {
      const dbMapped = dbProducts
        .filter((p: any) => ProductService.getProductVisibility(p).isVisible)
        .map((p: any) =>
          mapDatabaseProductToStorefront({
            ...p,
            categories: (p.categories || []).map((c: any) => c.category).filter(Boolean),
            media: (p.media || []).sort((a: any, b: any) => a.sort_order - b.sort_order),
          })
        );

      if (dbMapped.length > 0) {
         return dbMapped;
      }
    }
  } catch (err) {
    console.error("Failed to fetch featured storefront products:", err);
  }
  // Fallback to static mock data
  const staticProds = getStaticAllProducts();
  return staticProds.filter((p: any) => p.isFeatured || p.categoryHandles?.includes("marketing-materials")).slice(0, 8);
}

/**
 * Fetch approved reviews for a product
 */
export async function getStorefrontReviews(productId: string): Promise<any[]> {
  try {
    const supabase = getPublicClient();
    const { data: reviews } = await supabase
      .from("product_reviews")
      .select(`
        id,
        rating,
        title,
        comment,
        user_id,
        verified_purchase,
        created_at
      `)
      .eq("product_id", productId)
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (reviews) {
      // Mock user names for now if no join is available on auth.users
      return reviews.map((r) => ({
        ...r,
        user_name: r.user_id ? "Verified Customer" : "Anonymous",
      }));
    }
  } catch (err) {
    console.error("Failed to fetch product reviews:", err);
  }
  return [];
}
