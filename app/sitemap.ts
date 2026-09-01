import { MetadataRoute } from "next";
import { getStorefrontAllProducts } from "@/lib/catalogue/storefront-queries";
import { categories } from "@/lib/data/categories";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://preetyprints.com";
  const now = new Date();

  // 1. Static storefront pages
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/products`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/same-day`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/bulk-quote`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/sample-kit`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/help/shipping`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/help/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/help/privacy`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/help/terms`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
  ];

  // 2. Category pages
  const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${baseUrl}/category/${cat.handle}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // 3. Active product pages
  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const products = await getStorefrontAllProducts();
    productRoutes = products.map((p) => ({
      url: `${baseUrl}/product/${p.handle}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    }));
  } catch (err) {
    console.error("Failed to generate product sitemap entries:", err);
  }

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
