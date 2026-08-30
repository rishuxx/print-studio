import { money, type Product } from "@/lib/commerce/types";

export const bulkProducts: Product[] = [
  {
    "id": "prod-bulk-visiting-cards",
    "handle": "bulk-visiting-cards",
    "title": "Bulk Visiting Cards",
    "subtitle": "Enterprise volume pricing with dedicated press runs and account manager",
    "description": "Optimized for institutional volumes, Bulk Visiting Cards delivers wholesale cost efficiencies with rigorous color consistency across massive batch runs.",
    "productType": "Bulk & Corporate Solutions",
    "categoryHandles": [
      "bulk"
    ],
    "tags": [
      "bulk visiting cards",
      "bulk",
      "card-stack",
      "bestseller"
    ],
    "badges": [
      "bestseller"
    ],
    "images": [
      {
        "url": "",
        "altText": "Bulk Visiting Cards preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "card-stack",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Bulk Visiting Cards detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "card-stack",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Bulk Visiting Cards packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "card-stack",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Production Volume",
        "values": [
          "500 Units",
          "1,000 Units",
          "2,500 Units",
          "5,000 Units"
        ]
      },
      {
        "name": "Stock Specification",
        "values": [
          "Standard Industry Spec",
          "Heavy Duty Premium"
        ]
      }
    ],
    "variants": [
      {
        "id": "bulk-visiting-cards-500",
        "title": "500 Units / Standard",
        "sku": "BLK-BULK-500",
        price: money(249900),
        compareAtPrice: money(329900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Production Volume",
            "value": "500 Units"
          },
          {
            "name": "Stock Specification",
            "value": "Standard Industry Spec"
          }
        ]
      },
      {
        "id": "bulk-visiting-cards-1000",
        "title": "1,000 Units / Standard",
        "sku": "BLK-BULK-1K",
        price: money(424800),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.7,
        "selectedOptions": [
          {
            "name": "Production Volume",
            "value": "1,000 Units"
          },
          {
            "name": "Stock Specification",
            "value": "Standard Industry Spec"
          }
        ]
      }
    ],
    priceFrom: money(249900),
    compareAtFrom: money(329900),
    "quantityTiers": [
      {
        "qty": 500,
        price: money(249900),
        compareAtPrice: money(329900)
      },
      {
        "qty": 1000,
        price: money(424800),
        "note": "Recommended"
      },
      {
        "qty": 2500,
        price: money(949600),
        "note": "Wholesale Tier"
      },
      {
        "qty": 5000,
        price: money(1624400),
        "note": "Max Economy"
      }
    ],
    "priceUnit": "per 500 units",
    "specs": [
      {
        "label": "Minimum Batch",
        "value": "500 units"
      },
      {
        "label": "Press Type",
        "value": "Heidelberg 4-Colour High Speed Offset"
      },
      {
        "label": "Quality Control",
        "value": "Spectrophotometer ΔE < 2.0 tolerance"
      },
      {
        "label": "GST Invoice",
        "value": "Eligible for full 18% B2B Input Tax Credit"
      }
    ],
    "minOrderQty": 500,
    "turnaroundDays": 4,
    "sameDayEligible": false,
    "customizable": true,
    "uploadOnly": true,
    "rating": 4.4,
    "reviewCount": 181,
    "faqs": [
      {
        "q": "Can we get a physical press proof before the full run?",
        "a": "Yes, on runs exceeding ₹25,000 we provide a physical wet proof for color sign-off."
      },
      {
        "q": "Do you support multi-location dispatches for franchises?",
        "a": "Yes, provide a dispatch manifest and we will split-pack and courier to multiple branch offices."
      },
      {
        "q": "What payment terms are available for corporate accounts?",
        "a": "Standard orders require 50% advance, with net-30 credit terms available for verified corporate clients."
      }
    ],
    "relatedHandles": [
      "onboarding-kits",
      "bulk-brochures",
      "standard-visiting-cards",
      "business-flyers"
    ],
    "highlights": [
      "Up to 45% volume discount compared to standard retail tiers",
      "Dedicated prepress proofing with physical sample sign-off",
      "Scheduled palletized shipping and GST tax invoice compliance"
    ]
  },
  {
    "id": "prod-onboarding-kits",
    "handle": "onboarding-kits",
    "title": "Onboarding Kits",
    "subtitle": "Enterprise volume pricing with dedicated press runs and account manager",
    "description": "Optimized for institutional volumes, Onboarding Kits delivers wholesale cost efficiencies with rigorous color consistency across massive batch runs.",
    "productType": "Bulk & Corporate Solutions",
    "categoryHandles": [
      "bulk"
    ],
    "tags": [
      "onboarding kits",
      "bulk",
      "signage",
      "recommended"
    ],
    "badges": [
      "recommended"
    ],
    "images": [
      {
        "url": "",
        "altText": "Onboarding Kits preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "signage",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Onboarding Kits detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "signage",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Onboarding Kits packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "signage",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Production Volume",
        "values": [
          "500 Units",
          "1,000 Units",
          "2,500 Units",
          "5,000 Units"
        ]
      },
      {
        "name": "Stock Specification",
        "values": [
          "Standard Industry Spec",
          "Heavy Duty Premium"
        ]
      }
    ],
    "variants": [
      {
        "id": "onboarding-kits-500",
        "title": "500 Units / Standard",
        "sku": "BLK-ONBO-500",
        price: money(249900),
        compareAtPrice: money(329900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Production Volume",
            "value": "500 Units"
          },
          {
            "name": "Stock Specification",
            "value": "Standard Industry Spec"
          }
        ]
      },
      {
        "id": "onboarding-kits-1000",
        "title": "1,000 Units / Standard",
        "sku": "BLK-ONBO-1K",
        price: money(424800),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.7,
        "selectedOptions": [
          {
            "name": "Production Volume",
            "value": "1,000 Units"
          },
          {
            "name": "Stock Specification",
            "value": "Standard Industry Spec"
          }
        ]
      }
    ],
    priceFrom: money(249900),
    compareAtFrom: money(329900),
    "quantityTiers": [
      {
        "qty": 500,
        price: money(249900),
        compareAtPrice: money(329900)
      },
      {
        "qty": 1000,
        price: money(424800),
        "note": "Recommended"
      },
      {
        "qty": 2500,
        price: money(949600),
        "note": "Wholesale Tier"
      },
      {
        "qty": 5000,
        price: money(1624400),
        "note": "Max Economy"
      }
    ],
    "priceUnit": "per 500 units",
    "specs": [
      {
        "label": "Minimum Batch",
        "value": "500 units"
      },
      {
        "label": "Press Type",
        "value": "Heidelberg 4-Colour High Speed Offset"
      },
      {
        "label": "Quality Control",
        "value": "Spectrophotometer ΔE < 2.0 tolerance"
      },
      {
        "label": "GST Invoice",
        "value": "Eligible for full 18% B2B Input Tax Credit"
      }
    ],
    "minOrderQty": 500,
    "turnaroundDays": 4,
    "sameDayEligible": false,
    "customizable": true,
    "uploadOnly": true,
    "rating": 4.9,
    "reviewCount": 406,
    "faqs": [
      {
        "q": "Can we get a physical press proof before the full run?",
        "a": "Yes, on runs exceeding ₹25,000 we provide a physical wet proof for color sign-off."
      },
      {
        "q": "Do you support multi-location dispatches for franchises?",
        "a": "Yes, provide a dispatch manifest and we will split-pack and courier to multiple branch offices."
      },
      {
        "q": "What payment terms are available for corporate accounts?",
        "a": "Standard orders require 50% advance, with net-30 credit terms available for verified corporate clients."
      }
    ],
    "relatedHandles": [
      "bulk-visiting-cards",
      "bulk-brochures",
      "standard-visiting-cards",
      "business-flyers"
    ],
    "highlights": [
      "Up to 45% volume discount compared to standard retail tiers",
      "Dedicated prepress proofing with physical sample sign-off",
      "Scheduled palletized shipping and GST tax invoice compliance"
    ]
  },
  {
    "id": "prod-bulk-brochures",
    "handle": "bulk-brochures",
    "title": "Bulk Brochures",
    "subtitle": "Enterprise volume pricing with dedicated press runs and account manager",
    "description": "Optimized for institutional volumes, Bulk Brochures delivers wholesale cost efficiencies with rigorous color consistency across massive batch runs.",
    "productType": "Bulk & Corporate Solutions",
    "categoryHandles": [
      "bulk"
    ],
    "tags": [
      "bulk brochures",
      "bulk",
      "brochure"
    ],
    "badges": [],
    "images": [
      {
        "url": "",
        "altText": "Bulk Brochures preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "brochure",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Bulk Brochures detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "brochure",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Bulk Brochures packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "brochure",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Production Volume",
        "values": [
          "500 Units",
          "1,000 Units",
          "2,500 Units",
          "5,000 Units"
        ]
      },
      {
        "name": "Stock Specification",
        "values": [
          "Standard Industry Spec",
          "Heavy Duty Premium"
        ]
      }
    ],
    "variants": [
      {
        "id": "bulk-brochures-500",
        "title": "500 Units / Standard",
        "sku": "BLK-BULK-500",
        price: money(249900),
        compareAtPrice: money(329900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Production Volume",
            "value": "500 Units"
          },
          {
            "name": "Stock Specification",
            "value": "Standard Industry Spec"
          }
        ]
      },
      {
        "id": "bulk-brochures-1000",
        "title": "1,000 Units / Standard",
        "sku": "BLK-BULK-1K",
        price: money(424800),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.7,
        "selectedOptions": [
          {
            "name": "Production Volume",
            "value": "1,000 Units"
          },
          {
            "name": "Stock Specification",
            "value": "Standard Industry Spec"
          }
        ]
      }
    ],
    priceFrom: money(249900),
    compareAtFrom: money(329900),
    "quantityTiers": [
      {
        "qty": 500,
        price: money(249900),
        compareAtPrice: money(329900)
      },
      {
        "qty": 1000,
        price: money(424800),
        "note": "Recommended"
      },
      {
        "qty": 2500,
        price: money(949600),
        "note": "Wholesale Tier"
      },
      {
        "qty": 5000,
        price: money(1624400),
        "note": "Max Economy"
      }
    ],
    "priceUnit": "per 500 units",
    "specs": [
      {
        "label": "Minimum Batch",
        "value": "500 units"
      },
      {
        "label": "Press Type",
        "value": "Heidelberg 4-Colour High Speed Offset"
      },
      {
        "label": "Quality Control",
        "value": "Spectrophotometer ΔE < 2.0 tolerance"
      },
      {
        "label": "GST Invoice",
        "value": "Eligible for full 18% B2B Input Tax Credit"
      }
    ],
    "minOrderQty": 500,
    "turnaroundDays": 4,
    "sameDayEligible": false,
    "customizable": true,
    "uploadOnly": true,
    "rating": 4.4,
    "reviewCount": 99,
    "faqs": [
      {
        "q": "Can we get a physical press proof before the full run?",
        "a": "Yes, on runs exceeding ₹25,000 we provide a physical wet proof for color sign-off."
      },
      {
        "q": "Do you support multi-location dispatches for franchises?",
        "a": "Yes, provide a dispatch manifest and we will split-pack and courier to multiple branch offices."
      },
      {
        "q": "What payment terms are available for corporate accounts?",
        "a": "Standard orders require 50% advance, with net-30 credit terms available for verified corporate clients."
      }
    ],
    "relatedHandles": [
      "bulk-visiting-cards",
      "onboarding-kits",
      "standard-visiting-cards",
      "business-flyers"
    ],
    "highlights": [
      "Up to 45% volume discount compared to standard retail tiers",
      "Dedicated prepress proofing with physical sample sign-off",
      "Scheduled palletized shipping and GST tax invoice compliance"
    ]
  }
];
