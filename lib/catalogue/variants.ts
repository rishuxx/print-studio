import type { DatabaseProductOption, DatabaseProductVariant } from "./types";
import { normalizeSKU } from "./validation";

/**
 * Generate Cartesian product of all option permutations
 */
export function generateCartesianCombinations(
  options: Array<{ name: string; values: string[] }>
): Array<Array<{ name: string; value: string }>> {
  const activeOptions = options.filter((o) => o.name.trim() && o.values && o.values.length > 0);
  if (activeOptions.length === 0) return [];

  let results: Array<Array<{ name: string; value: string }>> = [[]];

  for (const option of activeOptions) {
    const nextResults: Array<Array<{ name: string; value: string }>> = [];
    for (const currentCombination of results) {
      for (const val of option.values) {
        nextResults.push([...currentCombination, { name: option.name.trim(), value: val.trim() }]);
      }
    }
    results = nextResults;
  }

  return results;
}

/**
 * Auto-generate full variant list from options with deterministic SKUs and prices
 */
export function generateVariantsFromOptions({
  productId,
  baseSku,
  basePriceMinor,
  options,
  existingVariants = [],
}: {
  productId?: string;
  baseSku: string;
  basePriceMinor: number;
  options: DatabaseProductOption[];
  existingVariants?: DatabaseProductVariant[];
}): DatabaseProductVariant[] {
  const combinations = generateCartesianCombinations(options);
  if (combinations.length === 0) return [];

  const existingMap = new Map<string, DatabaseProductVariant>();
  existingVariants.forEach((v) => {
    const key = makeOptionKey(v.selected_options);
    existingMap.set(key, v);
  });

  const generated: DatabaseProductVariant[] = [];
  const cleanBaseSku = normalizeSKU(baseSku || "PRT-PROD");

  combinations.forEach((combo, idx) => {
    const key = makeOptionKey(combo);
    const existing = existingMap.get(key);

    if (existing) {
      // Preserve existing prices, inventory, status and custom SKU if present
      generated.push({
        ...existing,
        sort_order: idx * 10,
        selected_options: combo,
      });
    } else {
      // Generate clean abbreviation for SKU segments
      const skuSegments = combo.map((item) =>
        item.value
          .toUpperCase()
          .replace(/[^A-Z0-9]/g, "")
          .slice(0, 4)
      );

      const variantSku = normalizeSKU(`${cleanBaseSku}-${skuSegments.join("-")}`);
      const title = combo.map((c) => c.value).join(" / ");

      generated.push({
        id: `var-temp-${idx}-${Date.now()}`,
        product_id: productId || "",
        sku: variantSku,
        title,
        available_for_sale: true,
        selected_options: combo,
        price_factor: 1.0,
        price_minor: basePriceMinor,
        sale_price_minor: null,
        cost_price_minor: Math.round(basePriceMinor * 0.6),
        inventory_quantity: 100,
        reserved_quantity: 0,
        track_inventory: false,
        allow_backorder: true,
        status: "active",
        sort_order: idx * 10,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }
  });

  return generated;
}

/**
 * Generate stable canonical key for option combinations to match regardless of key order
 */
export function makeOptionKey(options: Array<{ name: string; value: string }>): string {
  return [...options]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((o) => `${o.name.toLowerCase().trim()}:${o.value.toLowerCase().trim()}`)
    .join("|");
}

/**
 * Find matching variant given user selections
 */
export function findMatchingVariant(
  variants: DatabaseProductVariant[],
  selectedOptionsMap: Record<string, string>
): DatabaseProductVariant | undefined {
  if (!variants || variants.length === 0) return undefined;

  const targetKey = Object.entries(selectedOptionsMap)
    .filter(([k, v]) => k && v && k !== "Dimensions")
    .map(([name, value]) => ({ name, value }));

  const searchKey = makeOptionKey(targetKey);

  return variants.find((v) => {
    if (v.status === "archived") return false;
    const vKey = makeOptionKey(v.selected_options);
    return vKey === searchKey;
  });
}
