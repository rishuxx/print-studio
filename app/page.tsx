import * as React from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { HomeHero } from "@/components/home/home-hero";
import { TrustStrip } from "@/components/home/trust-strip";
import { CategorySection } from "@/components/home/category-section";
import { PopularProductsSection } from "@/components/home/popular-products-section";
import { BusinessPrintingSection } from "@/components/home/business-printing-section";
import { PersonalisedSection } from "@/components/home/personalised-section";
import { SameDaySection } from "@/components/home/same-day-section";
import { HowItWorks } from "@/components/home/how-it-works";
import { BulkQuoteSection } from "@/components/home/bulk-quote-section";
import { FaqSection } from "@/components/home/faq-section";
import { FinalCta } from "@/components/home/final-cta";
import { getActiveHeroBanners } from "@/lib/hero/queries";
import { getStorefrontCategories } from "@/lib/catalogue/storefront-queries";

export const metadata: Metadata = {
  title: `Custom Online Printing, Business Cards & Gifts | ${siteConfig.businessName}`,
  description:
    "PreetyPrints is India's premium custom printing destination. Order visiting cards, corporate merchandising, packaging, personalized t-shirts, mugs, and stationery online.",
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || "https://preetyprints.in",
  },
};

export default async function HomePage() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://preetyprints.in";

  // Schema.org WebSite & Organization Structured Data
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "PreetyPrints",
    "url": baseUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}/products?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "PreetyPrints",
    "url": baseUrl,
    "logo": `${baseUrl}/logo.png`,
    "description": "High-quality custom online printing, corporate merchandising, apparel, and packaging solutions across India.",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": siteConfig.contact.phone,
      "contactType": "customer service",
      "areaServed": "IN",
      "availableLanguage": ["English", "Hindi"],
    },
  };

  const [heroBanners, categories] = await Promise.all([
    getActiveHeroBanners(),
    getStorefrontCategories(),
  ]);

  return (
    <div className="flex flex-col gap-12 sm:gap-16 pb-16">
      {/* Schema.org Organization & WebSite JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      {/* 1. Hero Section - Dynamic Admin-Controlled Carousel */}
      <HomeHero banners={heroBanners} />

      {/* 2. Trust / Value Strip */}
      <TrustStrip />

      {/* 3. Shop by Category */}
      <CategorySection categories={categories} />

      {/* 4. Popular Printing Products */}
      <PopularProductsSection />

      {/* 5. Business Printing Section */}
      <BusinessPrintingSection />

      {/* 6. Personalised Products Section */}
      <PersonalisedSection />

      {/* 7. Same-Day / Local Section */}
      <SameDaySection />

      {/* 8. How It Works */}
      <HowItWorks />

      {/* 9. Bulk / Corporate Printing CTA */}
      <BulkQuoteSection />

      {/* 10. FAQ Preview */}
      <FaqSection />

      {/* 11. Final CTA */}
      <FinalCta />
    </div>
  );
}
