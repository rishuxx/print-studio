import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://printstudio.example.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/*",
          "/account",
          "/account/*",
          "/orders",
          "/orders/*",
          "/checkout",
          "/payment",
          "/order-confirmed",
          "/api/*",
          "/auth/*",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
