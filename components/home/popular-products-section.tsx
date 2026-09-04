import * as React from "react";
import { getStorefrontFeaturedProducts } from "@/lib/catalogue/storefront-queries";
import { PopularProductsClient } from "@/components/home/popular-products-client";

export async function PopularProductsSection() {
  const products = await getStorefrontFeaturedProducts();
  const displayProducts = products.slice(0, 8);

  return <PopularProductsClient products={displayProducts} />;
}
