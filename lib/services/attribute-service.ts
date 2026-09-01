import { createClient } from "@/lib/supabase/server";
import { DatabaseAttributeDefinition } from "@/lib/catalogue/types";
import { Product, ProductVariant } from "@/lib/commerce/types";

export class AttributeService {
  /**
   * Resolve applicable attributes for a specific product for the storefront.
   * This determines which dynamic attributes are relevant based on category inheritance
   * and product-level overrides.
   */
  static async getProductStorefrontAttributes(
    productId: string,
    categoryIds: string[]
  ): Promise<DatabaseAttributeDefinition[]> {
    try {
      const supabase = await createClient();

      // 1. Get templates assigned to the product's categories
      const { data: categoryTemplates } = await supabase
        .from("category_attribute_templates")
        .select("attribute_id")
        .in("category_id", categoryIds);

      const templateAttrIds = categoryTemplates?.map((t) => t.attribute_id) || [];

      // 2. Fetch the actual attribute definitions that are visible on storefront
      if (templateAttrIds.length > 0) {
        const { data: attributes } = await supabase
          .from("attribute_definitions")
          .select("*")
          .in("id", templateAttrIds)
          .eq("visible_on_storefront", true)
          .order("sort_order", { ascending: true });

        return (attributes as DatabaseAttributeDefinition[]) || [];
      }

      return [];
    } catch (err) {
      console.error("Failed to fetch product attributes:", err);
      return [];
    }
  }

  /**
   * Map selected options from the ProductConfigurator into an explicit
   * list of variant traits.
   */
  static resolveSelectedOptions(
    product: Product,
    selectedVariant: ProductVariant | null,
    selectedCustomOptions: Record<string, string>
  ) {
    const resolved: Record<string, string> = { ...selectedCustomOptions };
    
    // Inject core variant option selections if available
    if (selectedVariant && selectedVariant.selectedOptions) {
      Object.entries(selectedVariant.selectedOptions).forEach(([key, val]) => {
        if (!resolved[key]) {
          resolved[key] = String(val);
        }
      });
    }

    return resolved;
  }
}
