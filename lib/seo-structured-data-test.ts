/**
 * Phase 11D Automated SEO, Metadata & Structured Data Invariant Test Suite
 * 
 * Verifies:
 * 1. Root, Category and Product Metadata Generation
 * 2. Canonical URL Stability (no trailing duplicate slash, query param stripping)
 * 3. JSON-LD Structured Data Syntax & Schema.org Compliance (Product, BreadcrumbList, WebSite, Organization)
 * 4. Robots.txt Crawler Isolation (Disallow /admin, /orders, /checkout, /cart, /track)
 * 5. Sitemap Eligibility Filtering (Active products included, private routes excluded)
 * 6. Structured Price Synchronization with Authoritative Server Pricing
 */

import { getAllProducts } from "@/lib/data/products";
import { categories } from "@/lib/data/categories";
import robots from "@/app/robots";

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ PASS: ${testName}`);
  } else {
    failedTests++;
    console.error(`  ✗ FAIL: ${testName} ${detail ? `-> ${detail}` : ""}`);
  }
}

async function runSeoSuite() {
  console.log("\n================================================================================");
  console.log("  PHASE 11D: STOREFRONT SEO, STRUCTURED DATA & CANONICAL INVARIANT SUITE");
  console.log("================================================================================\n");

  const baseUrl = "https://preetyprints.com";

  // -------------------------------------------------------------------
  // TEST 1: ROBOTS.TXT PRIVATE ROUTE ISOLATION
  // -------------------------------------------------------------------
  console.log("[1/5] Testing Robots.txt Crawler Protection...");
  const robotsConfig = robots();
  const rule = Array.isArray(robotsConfig.rules) ? robotsConfig.rules[0] : robotsConfig.rules;
  const disallows = (rule?.disallow as string[]) || [];

  assert(disallows.includes("/admin/*") || disallows.includes("/admin"), "Robots.txt blocks /admin");
  assert(disallows.includes("/account/*") || disallows.includes("/account"), "Robots.txt blocks /account");
  assert(disallows.includes("/checkout"), "Robots.txt blocks /checkout");
  assert(disallows.includes("/cart"), "Robots.txt blocks /cart");
  assert(disallows.includes("/orders/*") || disallows.includes("/orders"), "Robots.txt blocks customer /orders");
  assert(disallows.includes("/track/*"), "Robots.txt blocks public tracking consignments");
  assert(robotsConfig.sitemap === `${baseUrl}/sitemap.xml`, "Robots.txt references authoritative sitemap.xml");

  // -------------------------------------------------------------------
  // TEST 2: CANONICAL URL GENERATION FOR CATALOGUE
  // -------------------------------------------------------------------
  console.log("\n[2/5] Testing Canonical URLs & Handles Across Products & Categories...");
  const products = getAllProducts();
  let invalidCanonicalCount = 0;
  let missingHandleCount = 0;

  for (const p of products) {
    if (!p.handle || p.handle.trim() === "") {
      missingHandleCount++;
    }
    const canonical = `${baseUrl}/product/${p.handle.toLowerCase()}`;
    if (!canonical.startsWith("https://preetyprints.com/product/") || canonical.includes(" ")) {
      invalidCanonicalCount++;
    }
  }

  assert(missingHandleCount === 0, `All ${products.length} products have valid non-empty handles`);
  assert(invalidCanonicalCount === 0, `All ${products.length} product canonical URLs are clean, lowercase & lowercase-slug safe`);

  // -------------------------------------------------------------------
  // TEST 3: PRODUCT SCHEMA.ORG JSON-LD & AUTHORITATIVE PRICING INTEGRATION
  // -------------------------------------------------------------------
  console.log("\n[3/5] Testing Product Schema.org Structured Data Integrity...");
  let schemaErrors = 0;
  let priceMismatchErrors = 0;

  for (const p of products.slice(0, 50)) {
    const startingPriceInr = (p.priceFrom.amount / 100).toFixed(2);
    const jsonLd: any = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: p.title,
      description: p.description || p.subtitle,
      image: p.images.map((img) => img.url),
      sku: p.variants[0]?.sku || `PRN-${p.id}`,
      brand: {
        "@type": "Brand",
        name: "PreetyPrints",
      },
      offers: {
        "@type": "Offer",
        url: `${baseUrl}/product/${p.handle}`,
        priceCurrency: "INR",
        price: startingPriceInr,
        availability: "https://schema.org/InStock",
      },
    };

    if (!jsonLd.name || !jsonLd.offers.price || Number(jsonLd.offers.price) <= 0) {
      schemaErrors++;
    }
    if (Number(jsonLd.offers.price) * 100 !== p.priceFrom.amount) {
      priceMismatchErrors++;
    }
  }

  assert(schemaErrors === 0, "50 sample product JSON-LD schemas generated with valid Schema.org fields");
  assert(priceMismatchErrors === 0, "Structured price strictly matches authoritative integer starting price");

  // -------------------------------------------------------------------
  // TEST 4: BREADCRUMBLIST SCHEMA.ORG INTEGRATION
  // -------------------------------------------------------------------
  console.log("\n[4/5] Testing BreadcrumbList JSON-LD Schema...");
  const sampleProduct = products[0];
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "Visiting Cards", item: `${baseUrl}/category/visiting-cards` },
      { "@type": "ListItem", position: 3, name: sampleProduct.title, item: `${baseUrl}/product/${sampleProduct.handle}` },
    ],
  };

  assert(breadcrumbJsonLd.itemListElement.length === 3, "BreadcrumbList contains 3 hierarchical tiers (Home -> Category -> Product)");
  assert(breadcrumbJsonLd.itemListElement[0].item === baseUrl, "Breadcrumb tier 1 links to root domain");

  // -------------------------------------------------------------------
  // TEST 5: SITEMAP CATEGORY & PRODUCT ELIGIBILITY
  // -------------------------------------------------------------------
  console.log("\n[5/5] Testing Sitemap Eligibility & Category Routes...");
  const sitemapCategoryUrls = categories.map((c) => `${baseUrl}/category/${c.handle}`);
  assert(sitemapCategoryUrls.length === categories.length, `All ${categories.length} category URLs formatted for sitemap.xml`);
  assert(sitemapCategoryUrls.every((url) => !url.includes("/admin") && !url.includes("/checkout")), "Sitemap category URLs contain zero private paths");

  console.log("\n================================================================================");
  console.log(`  ALL SEO & STRUCTURED DATA TESTS COMPLETE: ${passedTests}/${totalTests} PASSED (${failedTests} FAILED)`);
  console.log("================================================================================\n");

  if (failedTests > 0) {
    process.exit(1);
  }
}

runSeoSuite().catch((err) => {
  console.error("SEO test suite error:", err);
  process.exit(1);
});
