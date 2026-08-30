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

export const metadata: Metadata = {
  title: `Custom Printing & Personalised Products | ${siteConfig.businessName}`,
  description:
    "Explore custom printing, business stationery, apparel, personalised gifts, signage, packaging and more with high-definition digital and offset output.",
};

export default function HomePage() {
  return (
    <div className="flex flex-col gap-12 sm:gap-16 pb-16">
      {/* 1. Hero Section */}
      <HomeHero />

      {/* 2. Trust / Value Strip */}
      <TrustStrip />

      {/* 3. Shop by Category */}
      <CategorySection />

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
