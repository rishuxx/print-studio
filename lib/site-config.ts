/**
 * ══════════════════════════════════════════════════════════════════
 * CENTRALIZED BUSINESS & SITE CONFIGURATION
 *
 * This is the SINGLE SOURCE OF TRUTH for business identity, location,
 * contact details, operations, and policy defaults.
 *
 * NOTE: All business-specific values are neutral template defaults.
 * Real values can be configured by the store owner via Admin Settings.
 * ══════════════════════════════════════════════════════════════════
 */

export interface BusinessConfig {
  businessName: string;
  businessShortName: string;
  logo: {
    lead: string;
    trail: string;
  };
  tagline: string;
  description: string;
  
  contact: {
    phone: string;
    phoneHref: string;
    whatsapp: string | null;
    whatsappHref: string | null;
    whatsappMessage: string;
    email: string;
    emailHref: string;
    salesEmail: string;
    supportHours: string;
  };

  address: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };

  operations: {
    gstin: string;
    pickupAvailable: boolean;
    pickupMessage: string;
    deliveryMessage: string;
    shippingMessage: string;
    sameDayAvailable: boolean;
    sameDayMessage: string;
  };

  trust: {
    yearsInBusiness: string | null;
    ordersCompleted: string | null;
    clientsServed: string | null;
    rating: string | null;
    reviewCount: number | null;
    deliveryCoverage: string | null;
  };

  socialLinks: {
    instagram?: string;
    facebook?: string;
    linkedin?: string;
    youtube?: string;
    x?: string;
  };

  announcements: Array<{
    id: string;
    text: string;
    href?: string;
    cta?: string;
    code?: string;
  }>;

  pricingPolicy: {
    freeShippingThresholdPaise: number;
    flatShippingPaise: number;
    gstRate: number;
    gstMode: "inclusive" | "exclusive";
  };
}

export const siteConfig: BusinessConfig = {
  businessName: "PreetyPrints",
  businessShortName: "PreetyPrints",
  logo: {
    lead: "Preety",
    trail: "Prints",
  },
  tagline: "Custom printing for individuals and businesses",
  description:
    "High-quality custom printing, stationery, apparel, packaging, and business branding solutions with fast local turnaround.",

  contact: {
    phone: "+91 XXXXX XXXXX",
    phoneHref: "tel:+910000000000",
    whatsapp: "910000000000",
    whatsappHref: "https://wa.me/910000000000",
    whatsappMessage: "Hello, I would like to inquire about a custom print order.",
    email: "hello@example.com",
    emailHref: "mailto:hello@example.com",
    salesEmail: "bulk@example.com",
    supportHours: "Mon–Sat: 10:00 AM – 7:00 PM",
  },

  address: {
    line1: "Your Business Address",
    line2: "Commercial Complex",
    city: "Your City",
    state: "Your State",
    pincode: "000000",
    country: "India",
  },

  operations: {
    gstin: "XXAAAAA0000A1Z5",
    pickupAvailable: true,
    pickupMessage: "Store pickup available during business hours",
    deliveryMessage: "Local delivery available on eligible orders",
    shippingMessage: "Standard shipping available across India",
    sameDayAvailable: true,
    sameDayMessage: "Express same-day dispatch available on select products",
  },

  trust: {
    yearsInBusiness: null,
    ordersCompleted: null,
    clientsServed: null,
    rating: "4.8",
    reviewCount: 450,
    deliveryCoverage: "Nationwide shipping across India",
  },

  socialLinks: {
    instagram: "",
    facebook: "",
    linkedin: "",
    youtube: "",
    x: "",
  },

  announcements: [
    {
      id: "express",
      text: "Fast local printing and dispatch on select products",
      href: "/same-day",
      cta: "Explore express products",
    },
    {
      id: "promo",
      text: "Seasonal discount available on bulk corporate orders",
      href: "/bulk-quote",
      cta: "Request a quote",
      code: "PRINT10",
    },
    {
      id: "shipping",
      text: "Free standard shipping on orders over ₹999",
      href: "/help/shipping",
      cta: "View shipping info",
    },
  ],

  pricingPolicy: {
    freeShippingThresholdPaise: 99900,
    flatShippingPaise: 7900,
    gstRate: 0.18, // 18% standard Indian GST rate for printing goods (SAC 9989 / HSN 4911)
    gstMode: "inclusive" as "inclusive" | "exclusive", // "inclusive" = smart all-inclusive MRP (hidden in product prices like major e-commerce leaders, back-calculated on tax invoices), "exclusive" = added as separate surcharge at checkout
  },
};

export type SiteConfig = typeof siteConfig;

export const FREE_SHIPPING_THRESHOLD = siteConfig.pricingPolicy.freeShippingThresholdPaise;
export const FLAT_SHIPPING = siteConfig.pricingPolicy.flatShippingPaise;
export const GST_RATE = siteConfig.pricingPolicy.gstRate;
export const GST_MODE = siteConfig.pricingPolicy.gstMode;
