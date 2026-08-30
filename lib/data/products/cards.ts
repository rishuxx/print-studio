import { money, type Product } from "@/lib/commerce/types";

export const cardProducts: Product[] = [
  {
    "id": "prod-standard-visiting-cards",
    "handle": "standard-visiting-cards",
    "title": "Standard Visiting Cards",
    "subtitle": "Premium 350 GSM stock, custom cut and finished for standard visiting cards",
    "description": "Professional Standard Visiting Cards crafted with high-definition CMYK printing. Designed for lasting impressions with clean edge trim and tactile finishing options.",
    "productType": "Visiting Cards",
    "categoryHandles": [
      "same-day",
      "visiting-cards"
    ],
    "tags": [
      "standard visiting cards",
      "visiting cards",
      "card-stack",
      "same day",
      "express",
      "bestseller",
      "same-day"
    ],
    "badges": [
      "bestseller",
      "same-day"
    ],
    "images": [
      {
        "url": "",
        "altText": "Standard Visiting Cards preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "card-stack",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Standard Visiting Cards detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "card-stack",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Standard Visiting Cards packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "card-stack",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Paper",
        "values": [
          "300 GSM Art Card",
          "350 GSM Art Card",
          "400 GSM Super Premium"
        ]
      },
      {
        "name": "Finish",
        "values": [
          "Matte Lamination",
          "Gloss Lamination",
          "Soft Touch Velvet"
        ]
      },
      {
        "name": "Sides",
        "values": [
          "Single Side",
          "Both Sides"
        ]
      }
    ],
    "variants": [
      {
        "id": "standard-visiting-cards-300-m",
        "title": "300 GSM / Matte",
        "sku": "VC-STAN-300M",
        price: money(29900),
        compareAtPrice: money(39900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Paper",
            "value": "300 GSM Art Card"
          },
          {
            "name": "Finish",
            "value": "Matte Lamination"
          }
        ]
      },
      {
        "id": "standard-visiting-cards-350-m",
        "title": "350 GSM / Matte",
        "sku": "VC-STAN-350M",
        price: money(37400),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.25,
        "selectedOptions": [
          {
            "name": "Paper",
            "value": "350 GSM Art Card"
          },
          {
            "name": "Finish",
            "value": "Matte Lamination"
          }
        ]
      },
      {
        "id": "standard-visiting-cards-400-v",
        "title": "400 GSM / Velvet",
        "sku": "VC-STAN-400V",
        price: money(47800),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.6,
        "selectedOptions": [
          {
            "name": "Paper",
            "value": "400 GSM Super Premium"
          },
          {
            "name": "Finish",
            "value": "Soft Touch Velvet"
          }
        ]
      }
    ],
    priceFrom: money(29900),
    compareAtFrom: money(39900),
    "quantityTiers": [
      {
        "qty": 100,
        price: money(29900),
        compareAtPrice: money(39900)
      },
      {
        "qty": 250,
        price: money(62800)
      },
      {
        "qty": 500,
        price: money(107600),
        "note": "Popular"
      },
      {
        "qty": 1000,
        price: money(185400),
        "note": "Best Value"
      }
    ],
    "priceUnit": "per 100 cards",
    "specs": [
      {
        "label": "Paper Weight",
        "value": "300 - 400 GSM Art Stock"
      },
      {
        "label": "Standard Dimensions",
        "value": "89 × 54 mm (3.5 × 2 in)"
      },
      {
        "label": "Print Method",
        "value": "4-Colour Offset CMYK"
      },
      {
        "label": "Bleed Allowance",
        "value": "2 mm on all edges"
      },
      {
        "label": "Dispatch Schedule",
        "value": "Same Day (Order before 11 AM)"
      }
    ],
    "minOrderQty": 100,
    "turnaroundDays": 1,
    "sameDayEligible": true,
    "customizable": true,
    "rating": 4.5,
    "reviewCount": 542,
    "faqs": [
      {
        "q": "What resolution should my artwork file have?",
        "a": "We recommend submitting vector PDFs or 300 DPI high-resolution CMYK files with 2 mm bleed margins."
      },
      {
        "q": "Can I print different names in a single order?",
        "a": "Multiple names require separate batches or our corporate stationery packs for bundled savings."
      },
      {
        "q": "Is same-day pickup available locally?",
        "a": "Yes, orders confirmed before 11:00 AM can be picked up at our our local store facility the same evening."
      }
    ],
    "relatedHandles": [
      "rounded-corner-cards",
      "matte-laminated-cards",
      "spot-uv-cards",
      "velvet-touch-cards"
    ],
    "highlights": [
      "Crisp high-resolution colour fidelity",
      "Protective moisture-resistant lamination",
      "Consistent hydraulic die-cut precision"
    ]
  },
  {
    "id": "prod-rounded-corner-cards",
    "handle": "rounded-corner-cards",
    "title": "Rounded Corner Cards",
    "subtitle": "Premium 350 GSM stock, custom cut and finished for rounded corner cards",
    "description": "Professional Rounded Corner Cards crafted with high-definition CMYK printing. Designed for lasting impressions with clean edge trim and tactile finishing options.",
    "productType": "Visiting Cards",
    "categoryHandles": [
      "visiting-cards"
    ],
    "tags": [
      "rounded corner cards",
      "visiting cards",
      "card",
      "popular"
    ],
    "badges": [
      "popular"
    ],
    "images": [
      {
        "url": "",
        "altText": "Rounded Corner Cards preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Rounded Corner Cards detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Rounded Corner Cards packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Paper",
        "values": [
          "300 GSM Art Card",
          "350 GSM Art Card",
          "400 GSM Super Premium"
        ]
      },
      {
        "name": "Finish",
        "values": [
          "Matte Lamination",
          "Gloss Lamination",
          "Soft Touch Velvet"
        ]
      },
      {
        "name": "Sides",
        "values": [
          "Single Side",
          "Both Sides"
        ]
      }
    ],
    "variants": [
      {
        "id": "rounded-corner-cards-300-m",
        "title": "300 GSM / Matte",
        "sku": "VC-ROUN-300M",
        price: money(29900),
        compareAtPrice: money(39900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Paper",
            "value": "300 GSM Art Card"
          },
          {
            "name": "Finish",
            "value": "Matte Lamination"
          }
        ]
      },
      {
        "id": "rounded-corner-cards-350-m",
        "title": "350 GSM / Matte",
        "sku": "VC-ROUN-350M",
        price: money(37400),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.25,
        "selectedOptions": [
          {
            "name": "Paper",
            "value": "350 GSM Art Card"
          },
          {
            "name": "Finish",
            "value": "Matte Lamination"
          }
        ]
      },
      {
        "id": "rounded-corner-cards-400-v",
        "title": "400 GSM / Velvet",
        "sku": "VC-ROUN-400V",
        price: money(47800),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.6,
        "selectedOptions": [
          {
            "name": "Paper",
            "value": "400 GSM Super Premium"
          },
          {
            "name": "Finish",
            "value": "Soft Touch Velvet"
          }
        ]
      }
    ],
    priceFrom: money(29900),
    compareAtFrom: money(39900),
    "quantityTiers": [
      {
        "qty": 100,
        price: money(29900),
        compareAtPrice: money(39900)
      },
      {
        "qty": 250,
        price: money(62800)
      },
      {
        "qty": 500,
        price: money(107600),
        "note": "Popular"
      },
      {
        "qty": 1000,
        price: money(185400),
        "note": "Best Value"
      }
    ],
    "priceUnit": "per 100 cards",
    "specs": [
      {
        "label": "Paper Weight",
        "value": "300 - 400 GSM Art Stock"
      },
      {
        "label": "Standard Dimensions",
        "value": "89 × 54 mm (3.5 × 2 in)"
      },
      {
        "label": "Print Method",
        "value": "4-Colour Offset CMYK"
      },
      {
        "label": "Bleed Allowance",
        "value": "2 mm on all edges"
      },
      {
        "label": "Dispatch Schedule",
        "value": "2 Working Days"
      }
    ],
    "minOrderQty": 100,
    "turnaroundDays": 2,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.9,
    "reviewCount": 510,
    "faqs": [
      {
        "q": "What resolution should my artwork file have?",
        "a": "We recommend submitting vector PDFs or 300 DPI high-resolution CMYK files with 2 mm bleed margins."
      },
      {
        "q": "Can I print different names in a single order?",
        "a": "Multiple names require separate batches or our corporate stationery packs for bundled savings."
      },
      {
        "q": "Is same-day pickup available locally?",
        "a": "Yes, orders confirmed before 11:00 AM can be picked up at our our local store facility the same evening."
      }
    ],
    "relatedHandles": [
      "standard-visiting-cards",
      "matte-laminated-cards",
      "spot-uv-cards",
      "velvet-touch-cards"
    ],
    "highlights": [
      "Crisp high-resolution colour fidelity",
      "Protective moisture-resistant lamination",
      "Consistent hydraulic die-cut precision"
    ]
  },
  {
    "id": "prod-matte-laminated-cards",
    "handle": "matte-laminated-cards",
    "title": "Matte Laminated Cards",
    "subtitle": "Premium 350 GSM stock, custom cut and finished for matte laminated cards",
    "description": "Professional Matte Laminated Cards crafted with high-definition CMYK printing. Designed for lasting impressions with clean edge trim and tactile finishing options.",
    "productType": "Visiting Cards",
    "categoryHandles": [
      "visiting-cards"
    ],
    "tags": [
      "matte laminated cards",
      "visiting cards",
      "card-stack",
      "popular"
    ],
    "badges": [
      "popular"
    ],
    "images": [
      {
        "url": "",
        "altText": "Matte Laminated Cards preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "card-stack",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Matte Laminated Cards detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "card-stack",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Matte Laminated Cards packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "card-stack",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Paper",
        "values": [
          "300 GSM Art Card",
          "350 GSM Art Card",
          "400 GSM Super Premium"
        ]
      },
      {
        "name": "Finish",
        "values": [
          "Matte Lamination",
          "Gloss Lamination",
          "Soft Touch Velvet"
        ]
      },
      {
        "name": "Sides",
        "values": [
          "Single Side",
          "Both Sides"
        ]
      }
    ],
    "variants": [
      {
        "id": "matte-laminated-cards-300-m",
        "title": "300 GSM / Matte",
        "sku": "VC-MATT-300M",
        price: money(29900),
        compareAtPrice: money(39900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Paper",
            "value": "300 GSM Art Card"
          },
          {
            "name": "Finish",
            "value": "Matte Lamination"
          }
        ]
      },
      {
        "id": "matte-laminated-cards-350-m",
        "title": "350 GSM / Matte",
        "sku": "VC-MATT-350M",
        price: money(37400),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.25,
        "selectedOptions": [
          {
            "name": "Paper",
            "value": "350 GSM Art Card"
          },
          {
            "name": "Finish",
            "value": "Matte Lamination"
          }
        ]
      },
      {
        "id": "matte-laminated-cards-400-v",
        "title": "400 GSM / Velvet",
        "sku": "VC-MATT-400V",
        price: money(47800),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.6,
        "selectedOptions": [
          {
            "name": "Paper",
            "value": "400 GSM Super Premium"
          },
          {
            "name": "Finish",
            "value": "Soft Touch Velvet"
          }
        ]
      }
    ],
    priceFrom: money(29900),
    compareAtFrom: money(39900),
    "quantityTiers": [
      {
        "qty": 100,
        price: money(29900),
        compareAtPrice: money(39900)
      },
      {
        "qty": 250,
        price: money(62800)
      },
      {
        "qty": 500,
        price: money(107600),
        "note": "Popular"
      },
      {
        "qty": 1000,
        price: money(185400),
        "note": "Best Value"
      }
    ],
    "priceUnit": "per 100 cards",
    "specs": [
      {
        "label": "Paper Weight",
        "value": "300 - 400 GSM Art Stock"
      },
      {
        "label": "Standard Dimensions",
        "value": "89 × 54 mm (3.5 × 2 in)"
      },
      {
        "label": "Print Method",
        "value": "4-Colour Offset CMYK"
      },
      {
        "label": "Bleed Allowance",
        "value": "2 mm on all edges"
      },
      {
        "label": "Dispatch Schedule",
        "value": "2 Working Days"
      }
    ],
    "minOrderQty": 100,
    "turnaroundDays": 2,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.5,
    "reviewCount": 160,
    "faqs": [
      {
        "q": "What resolution should my artwork file have?",
        "a": "We recommend submitting vector PDFs or 300 DPI high-resolution CMYK files with 2 mm bleed margins."
      },
      {
        "q": "Can I print different names in a single order?",
        "a": "Multiple names require separate batches or our corporate stationery packs for bundled savings."
      },
      {
        "q": "Is same-day pickup available locally?",
        "a": "Yes, orders confirmed before 11:00 AM can be picked up at our our local store facility the same evening."
      }
    ],
    "relatedHandles": [
      "standard-visiting-cards",
      "rounded-corner-cards",
      "spot-uv-cards",
      "velvet-touch-cards"
    ],
    "highlights": [
      "Crisp high-resolution colour fidelity",
      "Protective moisture-resistant lamination",
      "Consistent hydraulic die-cut precision"
    ]
  },
  {
    "id": "prod-spot-uv-cards",
    "handle": "spot-uv-cards",
    "title": "Spot UV Cards",
    "subtitle": "Premium 350 GSM stock, custom cut and finished for spot uv cards",
    "description": "Professional Spot UV Cards crafted with high-definition CMYK printing. Designed for lasting impressions with clean edge trim and tactile finishing options.",
    "productType": "Visiting Cards",
    "categoryHandles": [
      "visiting-cards"
    ],
    "tags": [
      "spot uv cards",
      "visiting cards",
      "card",
      "recommended"
    ],
    "badges": [
      "recommended"
    ],
    "images": [
      {
        "url": "",
        "altText": "Spot UV Cards preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Spot UV Cards detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Spot UV Cards packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Paper",
        "values": [
          "300 GSM Art Card",
          "350 GSM Art Card",
          "400 GSM Super Premium"
        ]
      },
      {
        "name": "Finish",
        "values": [
          "Matte Lamination",
          "Gloss Lamination",
          "Soft Touch Velvet"
        ]
      },
      {
        "name": "Sides",
        "values": [
          "Single Side",
          "Both Sides"
        ]
      }
    ],
    "variants": [
      {
        "id": "spot-uv-cards-300-m",
        "title": "300 GSM / Matte",
        "sku": "VC-SPOT-300M",
        price: money(79900),
        compareAtPrice: money(99900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Paper",
            "value": "300 GSM Art Card"
          },
          {
            "name": "Finish",
            "value": "Matte Lamination"
          }
        ]
      },
      {
        "id": "spot-uv-cards-350-m",
        "title": "350 GSM / Matte",
        "sku": "VC-SPOT-350M",
        price: money(99900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.25,
        "selectedOptions": [
          {
            "name": "Paper",
            "value": "350 GSM Art Card"
          },
          {
            "name": "Finish",
            "value": "Matte Lamination"
          }
        ]
      },
      {
        "id": "spot-uv-cards-400-v",
        "title": "400 GSM / Velvet",
        "sku": "VC-SPOT-400V",
        price: money(127800),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.6,
        "selectedOptions": [
          {
            "name": "Paper",
            "value": "400 GSM Super Premium"
          },
          {
            "name": "Finish",
            "value": "Soft Touch Velvet"
          }
        ]
      }
    ],
    priceFrom: money(79900),
    compareAtFrom: money(99900),
    "quantityTiers": [
      {
        "qty": 100,
        price: money(79900),
        compareAtPrice: money(99900)
      },
      {
        "qty": 250,
        price: money(167800)
      },
      {
        "qty": 500,
        price: money(287600),
        "note": "Popular"
      },
      {
        "qty": 1000,
        price: money(495400),
        "note": "Best Value"
      }
    ],
    "priceUnit": "per 100 cards",
    "specs": [
      {
        "label": "Paper Weight",
        "value": "300 - 400 GSM Art Stock"
      },
      {
        "label": "Standard Dimensions",
        "value": "89 × 54 mm (3.5 × 2 in)"
      },
      {
        "label": "Print Method",
        "value": "4-Colour Offset CMYK"
      },
      {
        "label": "Bleed Allowance",
        "value": "2 mm on all edges"
      },
      {
        "label": "Dispatch Schedule",
        "value": "2 Working Days"
      }
    ],
    "minOrderQty": 100,
    "turnaroundDays": 2,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.4,
    "reviewCount": 661,
    "faqs": [
      {
        "q": "What resolution should my artwork file have?",
        "a": "We recommend submitting vector PDFs or 300 DPI high-resolution CMYK files with 2 mm bleed margins."
      },
      {
        "q": "Can I print different names in a single order?",
        "a": "Multiple names require separate batches or our corporate stationery packs for bundled savings."
      },
      {
        "q": "Is same-day pickup available locally?",
        "a": "Yes, orders confirmed before 11:00 AM can be picked up at our our local store facility the same evening."
      }
    ],
    "relatedHandles": [
      "standard-visiting-cards",
      "rounded-corner-cards",
      "matte-laminated-cards",
      "velvet-touch-cards"
    ],
    "highlights": [
      "Crisp high-resolution colour fidelity",
      "Protective moisture-resistant lamination",
      "Consistent hydraulic die-cut precision"
    ]
  },
  {
    "id": "prod-velvet-touch-cards",
    "handle": "velvet-touch-cards",
    "title": "Velvet Touch Cards",
    "subtitle": "Premium 350 GSM stock, custom cut and finished for velvet touch cards",
    "description": "Professional Velvet Touch Cards crafted with high-definition CMYK printing. Designed for lasting impressions with clean edge trim and tactile finishing options.",
    "productType": "Visiting Cards",
    "categoryHandles": [
      "visiting-cards"
    ],
    "tags": [
      "velvet touch cards",
      "visiting cards",
      "card",
      "premium"
    ],
    "badges": [
      "premium"
    ],
    "images": [
      {
        "url": "",
        "altText": "Velvet Touch Cards preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Velvet Touch Cards detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Velvet Touch Cards packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Paper",
        "values": [
          "300 GSM Art Card",
          "350 GSM Art Card",
          "400 GSM Super Premium"
        ]
      },
      {
        "name": "Finish",
        "values": [
          "Matte Lamination",
          "Gloss Lamination",
          "Soft Touch Velvet"
        ]
      },
      {
        "name": "Sides",
        "values": [
          "Single Side",
          "Both Sides"
        ]
      }
    ],
    "variants": [
      {
        "id": "velvet-touch-cards-300-m",
        "title": "300 GSM / Matte",
        "sku": "VC-VELV-300M",
        price: money(79900),
        compareAtPrice: money(99900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Paper",
            "value": "300 GSM Art Card"
          },
          {
            "name": "Finish",
            "value": "Matte Lamination"
          }
        ]
      },
      {
        "id": "velvet-touch-cards-350-m",
        "title": "350 GSM / Matte",
        "sku": "VC-VELV-350M",
        price: money(99900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.25,
        "selectedOptions": [
          {
            "name": "Paper",
            "value": "350 GSM Art Card"
          },
          {
            "name": "Finish",
            "value": "Matte Lamination"
          }
        ]
      },
      {
        "id": "velvet-touch-cards-400-v",
        "title": "400 GSM / Velvet",
        "sku": "VC-VELV-400V",
        price: money(127800),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.6,
        "selectedOptions": [
          {
            "name": "Paper",
            "value": "400 GSM Super Premium"
          },
          {
            "name": "Finish",
            "value": "Soft Touch Velvet"
          }
        ]
      }
    ],
    priceFrom: money(79900),
    compareAtFrom: money(99900),
    "quantityTiers": [
      {
        "qty": 100,
        price: money(79900),
        compareAtPrice: money(99900)
      },
      {
        "qty": 250,
        price: money(167800)
      },
      {
        "qty": 500,
        price: money(287600),
        "note": "Popular"
      },
      {
        "qty": 1000,
        price: money(495400),
        "note": "Best Value"
      }
    ],
    "priceUnit": "per 100 cards",
    "specs": [
      {
        "label": "Paper Weight",
        "value": "300 - 400 GSM Art Stock"
      },
      {
        "label": "Standard Dimensions",
        "value": "89 × 54 mm (3.5 × 2 in)"
      },
      {
        "label": "Print Method",
        "value": "4-Colour Offset CMYK"
      },
      {
        "label": "Bleed Allowance",
        "value": "2 mm on all edges"
      },
      {
        "label": "Dispatch Schedule",
        "value": "2 Working Days"
      }
    ],
    "minOrderQty": 100,
    "turnaroundDays": 2,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.8,
    "reviewCount": 333,
    "faqs": [
      {
        "q": "What resolution should my artwork file have?",
        "a": "We recommend submitting vector PDFs or 300 DPI high-resolution CMYK files with 2 mm bleed margins."
      },
      {
        "q": "Can I print different names in a single order?",
        "a": "Multiple names require separate batches or our corporate stationery packs for bundled savings."
      },
      {
        "q": "Is same-day pickup available locally?",
        "a": "Yes, orders confirmed before 11:00 AM can be picked up at our our local store facility the same evening."
      }
    ],
    "relatedHandles": [
      "standard-visiting-cards",
      "rounded-corner-cards",
      "matte-laminated-cards",
      "spot-uv-cards"
    ],
    "highlights": [
      "Crisp high-resolution colour fidelity",
      "Protective moisture-resistant lamination",
      "Consistent hydraulic die-cut precision"
    ]
  },
  {
    "id": "prod-classic-rectangle-cards",
    "handle": "classic-rectangle-cards",
    "title": "Classic Rectangle Cards",
    "subtitle": "Premium 350 GSM stock, custom cut and finished for classic rectangle cards",
    "description": "Professional Classic Rectangle Cards crafted with high-definition CMYK printing. Designed for lasting impressions with clean edge trim and tactile finishing options.",
    "productType": "Visiting Cards",
    "categoryHandles": [
      "visiting-cards"
    ],
    "tags": [
      "classic rectangle cards",
      "visiting cards",
      "card"
    ],
    "badges": [],
    "images": [
      {
        "url": "",
        "altText": "Classic Rectangle Cards preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Classic Rectangle Cards detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Classic Rectangle Cards packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Paper",
        "values": [
          "300 GSM Art Card",
          "350 GSM Art Card",
          "400 GSM Super Premium"
        ]
      },
      {
        "name": "Finish",
        "values": [
          "Matte Lamination",
          "Gloss Lamination",
          "Soft Touch Velvet"
        ]
      },
      {
        "name": "Sides",
        "values": [
          "Single Side",
          "Both Sides"
        ]
      }
    ],
    "variants": [
      {
        "id": "classic-rectangle-cards-300-m",
        "title": "300 GSM / Matte",
        "sku": "VC-CLAS-300M",
        price: money(29900),
        compareAtPrice: money(39900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Paper",
            "value": "300 GSM Art Card"
          },
          {
            "name": "Finish",
            "value": "Matte Lamination"
          }
        ]
      },
      {
        "id": "classic-rectangle-cards-350-m",
        "title": "350 GSM / Matte",
        "sku": "VC-CLAS-350M",
        price: money(37400),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.25,
        "selectedOptions": [
          {
            "name": "Paper",
            "value": "350 GSM Art Card"
          },
          {
            "name": "Finish",
            "value": "Matte Lamination"
          }
        ]
      },
      {
        "id": "classic-rectangle-cards-400-v",
        "title": "400 GSM / Velvet",
        "sku": "VC-CLAS-400V",
        price: money(47800),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.6,
        "selectedOptions": [
          {
            "name": "Paper",
            "value": "400 GSM Super Premium"
          },
          {
            "name": "Finish",
            "value": "Soft Touch Velvet"
          }
        ]
      }
    ],
    priceFrom: money(29900),
    compareAtFrom: money(39900),
    "quantityTiers": [
      {
        "qty": 100,
        price: money(29900),
        compareAtPrice: money(39900)
      },
      {
        "qty": 250,
        price: money(62800)
      },
      {
        "qty": 500,
        price: money(107600),
        "note": "Popular"
      },
      {
        "qty": 1000,
        price: money(185400),
        "note": "Best Value"
      }
    ],
    "priceUnit": "per 100 cards",
    "specs": [
      {
        "label": "Paper Weight",
        "value": "300 - 400 GSM Art Stock"
      },
      {
        "label": "Standard Dimensions",
        "value": "89 × 54 mm (3.5 × 2 in)"
      },
      {
        "label": "Print Method",
        "value": "4-Colour Offset CMYK"
      },
      {
        "label": "Bleed Allowance",
        "value": "2 mm on all edges"
      },
      {
        "label": "Dispatch Schedule",
        "value": "2 Working Days"
      }
    ],
    "minOrderQty": 100,
    "turnaroundDays": 2,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.8,
    "reviewCount": 355,
    "faqs": [
      {
        "q": "What resolution should my artwork file have?",
        "a": "We recommend submitting vector PDFs or 300 DPI high-resolution CMYK files with 2 mm bleed margins."
      },
      {
        "q": "Can I print different names in a single order?",
        "a": "Multiple names require separate batches or our corporate stationery packs for bundled savings."
      },
      {
        "q": "Is same-day pickup available locally?",
        "a": "Yes, orders confirmed before 11:00 AM can be picked up at our our local store facility the same evening."
      }
    ],
    "relatedHandles": [
      "standard-visiting-cards",
      "rounded-corner-cards",
      "matte-laminated-cards",
      "spot-uv-cards"
    ],
    "highlights": [
      "Crisp high-resolution colour fidelity",
      "Protective moisture-resistant lamination",
      "Consistent hydraulic die-cut precision"
    ]
  },
  {
    "id": "prod-textured-cards",
    "handle": "textured-cards",
    "title": "Textured Cards",
    "subtitle": "Premium 350 GSM stock, custom cut and finished for textured cards",
    "description": "Professional Textured Cards crafted with high-definition CMYK printing. Designed for lasting impressions with clean edge trim and tactile finishing options.",
    "productType": "Visiting Cards",
    "categoryHandles": [
      "visiting-cards"
    ],
    "tags": [
      "textured cards",
      "visiting cards",
      "card"
    ],
    "badges": [],
    "images": [
      {
        "url": "",
        "altText": "Textured Cards preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Textured Cards detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Textured Cards packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Paper",
        "values": [
          "300 GSM Art Card",
          "350 GSM Art Card",
          "400 GSM Super Premium"
        ]
      },
      {
        "name": "Finish",
        "values": [
          "Matte Lamination",
          "Gloss Lamination",
          "Soft Touch Velvet"
        ]
      },
      {
        "name": "Sides",
        "values": [
          "Single Side",
          "Both Sides"
        ]
      }
    ],
    "variants": [
      {
        "id": "textured-cards-300-m",
        "title": "300 GSM / Matte",
        "sku": "VC-TEXT-300M",
        price: money(49900),
        compareAtPrice: money(59900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Paper",
            "value": "300 GSM Art Card"
          },
          {
            "name": "Finish",
            "value": "Matte Lamination"
          }
        ]
      },
      {
        "id": "textured-cards-350-m",
        "title": "350 GSM / Matte",
        "sku": "VC-TEXT-350M",
        price: money(62400),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.25,
        "selectedOptions": [
          {
            "name": "Paper",
            "value": "350 GSM Art Card"
          },
          {
            "name": "Finish",
            "value": "Matte Lamination"
          }
        ]
      },
      {
        "id": "textured-cards-400-v",
        "title": "400 GSM / Velvet",
        "sku": "VC-TEXT-400V",
        price: money(79800),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.6,
        "selectedOptions": [
          {
            "name": "Paper",
            "value": "400 GSM Super Premium"
          },
          {
            "name": "Finish",
            "value": "Soft Touch Velvet"
          }
        ]
      }
    ],
    priceFrom: money(49900),
    compareAtFrom: money(59900),
    "quantityTiers": [
      {
        "qty": 100,
        price: money(49900),
        compareAtPrice: money(59900)
      },
      {
        "qty": 250,
        price: money(104800)
      },
      {
        "qty": 500,
        price: money(179600),
        "note": "Popular"
      },
      {
        "qty": 1000,
        price: money(309400),
        "note": "Best Value"
      }
    ],
    "priceUnit": "per 100 cards",
    "specs": [
      {
        "label": "Paper Weight",
        "value": "300 - 400 GSM Art Stock"
      },
      {
        "label": "Standard Dimensions",
        "value": "89 × 54 mm (3.5 × 2 in)"
      },
      {
        "label": "Print Method",
        "value": "4-Colour Offset CMYK"
      },
      {
        "label": "Bleed Allowance",
        "value": "2 mm on all edges"
      },
      {
        "label": "Dispatch Schedule",
        "value": "2 Working Days"
      }
    ],
    "minOrderQty": 100,
    "turnaroundDays": 2,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.9,
    "reviewCount": 330,
    "faqs": [
      {
        "q": "What resolution should my artwork file have?",
        "a": "We recommend submitting vector PDFs or 300 DPI high-resolution CMYK files with 2 mm bleed margins."
      },
      {
        "q": "Can I print different names in a single order?",
        "a": "Multiple names require separate batches or our corporate stationery packs for bundled savings."
      },
      {
        "q": "Is same-day pickup available locally?",
        "a": "Yes, orders confirmed before 11:00 AM can be picked up at our our local store facility the same evening."
      }
    ],
    "relatedHandles": [
      "standard-visiting-cards",
      "rounded-corner-cards",
      "matte-laminated-cards",
      "spot-uv-cards"
    ],
    "highlights": [
      "Crisp high-resolution colour fidelity",
      "Protective moisture-resistant lamination",
      "Consistent hydraulic die-cut precision"
    ]
  },
  {
    "id": "prod-special-paper-cards",
    "handle": "special-paper-cards",
    "title": "Special Paper Cards",
    "subtitle": "Premium 350 GSM stock, custom cut and finished for special paper cards",
    "description": "Professional Special Paper Cards crafted with high-definition CMYK printing. Designed for lasting impressions with clean edge trim and tactile finishing options.",
    "productType": "Visiting Cards",
    "categoryHandles": [
      "visiting-cards"
    ],
    "tags": [
      "special paper cards",
      "visiting cards",
      "card"
    ],
    "badges": [],
    "images": [
      {
        "url": "",
        "altText": "Special Paper Cards preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Special Paper Cards detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Special Paper Cards packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Paper",
        "values": [
          "300 GSM Art Card",
          "350 GSM Art Card",
          "400 GSM Super Premium"
        ]
      },
      {
        "name": "Finish",
        "values": [
          "Matte Lamination",
          "Gloss Lamination",
          "Soft Touch Velvet"
        ]
      },
      {
        "name": "Sides",
        "values": [
          "Single Side",
          "Both Sides"
        ]
      }
    ],
    "variants": [
      {
        "id": "special-paper-cards-300-m",
        "title": "300 GSM / Matte",
        "sku": "VC-SPEC-300M",
        price: money(29900),
        compareAtPrice: money(39900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Paper",
            "value": "300 GSM Art Card"
          },
          {
            "name": "Finish",
            "value": "Matte Lamination"
          }
        ]
      },
      {
        "id": "special-paper-cards-350-m",
        "title": "350 GSM / Matte",
        "sku": "VC-SPEC-350M",
        price: money(37400),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.25,
        "selectedOptions": [
          {
            "name": "Paper",
            "value": "350 GSM Art Card"
          },
          {
            "name": "Finish",
            "value": "Matte Lamination"
          }
        ]
      },
      {
        "id": "special-paper-cards-400-v",
        "title": "400 GSM / Velvet",
        "sku": "VC-SPEC-400V",
        price: money(47800),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.6,
        "selectedOptions": [
          {
            "name": "Paper",
            "value": "400 GSM Super Premium"
          },
          {
            "name": "Finish",
            "value": "Soft Touch Velvet"
          }
        ]
      }
    ],
    priceFrom: money(29900),
    compareAtFrom: money(39900),
    "quantityTiers": [
      {
        "qty": 100,
        price: money(29900),
        compareAtPrice: money(39900)
      },
      {
        "qty": 250,
        price: money(62800)
      },
      {
        "qty": 500,
        price: money(107600),
        "note": "Popular"
      },
      {
        "qty": 1000,
        price: money(185400),
        "note": "Best Value"
      }
    ],
    "priceUnit": "per 100 cards",
    "specs": [
      {
        "label": "Paper Weight",
        "value": "300 - 400 GSM Art Stock"
      },
      {
        "label": "Standard Dimensions",
        "value": "89 × 54 mm (3.5 × 2 in)"
      },
      {
        "label": "Print Method",
        "value": "4-Colour Offset CMYK"
      },
      {
        "label": "Bleed Allowance",
        "value": "2 mm on all edges"
      },
      {
        "label": "Dispatch Schedule",
        "value": "2 Working Days"
      }
    ],
    "minOrderQty": 100,
    "turnaroundDays": 2,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.4,
    "reviewCount": 281,
    "faqs": [
      {
        "q": "What resolution should my artwork file have?",
        "a": "We recommend submitting vector PDFs or 300 DPI high-resolution CMYK files with 2 mm bleed margins."
      },
      {
        "q": "Can I print different names in a single order?",
        "a": "Multiple names require separate batches or our corporate stationery packs for bundled savings."
      },
      {
        "q": "Is same-day pickup available locally?",
        "a": "Yes, orders confirmed before 11:00 AM can be picked up at our our local store facility the same evening."
      }
    ],
    "relatedHandles": [
      "standard-visiting-cards",
      "rounded-corner-cards",
      "matte-laminated-cards",
      "spot-uv-cards"
    ],
    "highlights": [
      "Crisp high-resolution colour fidelity",
      "Protective moisture-resistant lamination",
      "Consistent hydraulic die-cut precision"
    ]
  },
  {
    "id": "prod-kraft-paper-cards",
    "handle": "kraft-paper-cards",
    "title": "Kraft Paper Cards",
    "subtitle": "Premium 350 GSM stock, custom cut and finished for kraft paper cards",
    "description": "Professional Kraft Paper Cards crafted with high-definition CMYK printing. Designed for lasting impressions with clean edge trim and tactile finishing options.",
    "productType": "Visiting Cards",
    "categoryHandles": [
      "visiting-cards"
    ],
    "tags": [
      "kraft paper cards",
      "visiting cards",
      "card",
      "eco"
    ],
    "badges": [
      "eco"
    ],
    "images": [
      {
        "url": "",
        "altText": "Kraft Paper Cards preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Kraft Paper Cards detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Kraft Paper Cards packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Paper",
        "values": [
          "300 GSM Art Card",
          "350 GSM Art Card",
          "400 GSM Super Premium"
        ]
      },
      {
        "name": "Finish",
        "values": [
          "Matte Lamination",
          "Gloss Lamination",
          "Soft Touch Velvet"
        ]
      },
      {
        "name": "Sides",
        "values": [
          "Single Side",
          "Both Sides"
        ]
      }
    ],
    "variants": [
      {
        "id": "kraft-paper-cards-300-m",
        "title": "300 GSM / Matte",
        "sku": "VC-KRAF-300M",
        price: money(49900),
        compareAtPrice: money(59900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Paper",
            "value": "300 GSM Art Card"
          },
          {
            "name": "Finish",
            "value": "Matte Lamination"
          }
        ]
      },
      {
        "id": "kraft-paper-cards-350-m",
        "title": "350 GSM / Matte",
        "sku": "VC-KRAF-350M",
        price: money(62400),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.25,
        "selectedOptions": [
          {
            "name": "Paper",
            "value": "350 GSM Art Card"
          },
          {
            "name": "Finish",
            "value": "Matte Lamination"
          }
        ]
      },
      {
        "id": "kraft-paper-cards-400-v",
        "title": "400 GSM / Velvet",
        "sku": "VC-KRAF-400V",
        price: money(79800),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.6,
        "selectedOptions": [
          {
            "name": "Paper",
            "value": "400 GSM Super Premium"
          },
          {
            "name": "Finish",
            "value": "Soft Touch Velvet"
          }
        ]
      }
    ],
    priceFrom: money(49900),
    compareAtFrom: money(59900),
    "quantityTiers": [
      {
        "qty": 100,
        price: money(49900),
        compareAtPrice: money(59900)
      },
      {
        "qty": 250,
        price: money(104800)
      },
      {
        "qty": 500,
        price: money(179600),
        "note": "Popular"
      },
      {
        "qty": 1000,
        price: money(309400),
        "note": "Best Value"
      }
    ],
    "priceUnit": "per 100 cards",
    "specs": [
      {
        "label": "Paper Weight",
        "value": "300 - 400 GSM Art Stock"
      },
      {
        "label": "Standard Dimensions",
        "value": "89 × 54 mm (3.5 × 2 in)"
      },
      {
        "label": "Print Method",
        "value": "4-Colour Offset CMYK"
      },
      {
        "label": "Bleed Allowance",
        "value": "2 mm on all edges"
      },
      {
        "label": "Dispatch Schedule",
        "value": "2 Working Days"
      }
    ],
    "minOrderQty": 100,
    "turnaroundDays": 2,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.9,
    "reviewCount": 210,
    "faqs": [
      {
        "q": "What resolution should my artwork file have?",
        "a": "We recommend submitting vector PDFs or 300 DPI high-resolution CMYK files with 2 mm bleed margins."
      },
      {
        "q": "Can I print different names in a single order?",
        "a": "Multiple names require separate batches or our corporate stationery packs for bundled savings."
      },
      {
        "q": "Is same-day pickup available locally?",
        "a": "Yes, orders confirmed before 11:00 AM can be picked up at our our local store facility the same evening."
      }
    ],
    "relatedHandles": [
      "standard-visiting-cards",
      "rounded-corner-cards",
      "matte-laminated-cards",
      "spot-uv-cards"
    ],
    "highlights": [
      "Crisp high-resolution colour fidelity",
      "Protective moisture-resistant lamination",
      "Consistent hydraulic die-cut precision"
    ]
  },
  {
    "id": "prod-eco-friendly-cards",
    "handle": "eco-friendly-cards",
    "title": "Eco-Friendly Cards",
    "subtitle": "Premium 350 GSM stock, custom cut and finished for eco-friendly cards",
    "description": "Professional Eco-Friendly Cards crafted with high-definition CMYK printing. Designed for lasting impressions with clean edge trim and tactile finishing options.",
    "productType": "Visiting Cards",
    "categoryHandles": [
      "visiting-cards"
    ],
    "tags": [
      "eco-friendly cards",
      "visiting cards",
      "card",
      "eco"
    ],
    "badges": [
      "eco"
    ],
    "images": [
      {
        "url": "",
        "altText": "Eco-Friendly Cards preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Eco-Friendly Cards detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Eco-Friendly Cards packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Paper",
        "values": [
          "300 GSM Art Card",
          "350 GSM Art Card",
          "400 GSM Super Premium"
        ]
      },
      {
        "name": "Finish",
        "values": [
          "Matte Lamination",
          "Gloss Lamination",
          "Soft Touch Velvet"
        ]
      },
      {
        "name": "Sides",
        "values": [
          "Single Side",
          "Both Sides"
        ]
      }
    ],
    "variants": [
      {
        "id": "eco-friendly-cards-300-m",
        "title": "300 GSM / Matte",
        "sku": "VC-ECO--300M",
        price: money(49900),
        compareAtPrice: money(59900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Paper",
            "value": "300 GSM Art Card"
          },
          {
            "name": "Finish",
            "value": "Matte Lamination"
          }
        ]
      },
      {
        "id": "eco-friendly-cards-350-m",
        "title": "350 GSM / Matte",
        "sku": "VC-ECO--350M",
        price: money(62400),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.25,
        "selectedOptions": [
          {
            "name": "Paper",
            "value": "350 GSM Art Card"
          },
          {
            "name": "Finish",
            "value": "Matte Lamination"
          }
        ]
      },
      {
        "id": "eco-friendly-cards-400-v",
        "title": "400 GSM / Velvet",
        "sku": "VC-ECO--400V",
        price: money(79800),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.6,
        "selectedOptions": [
          {
            "name": "Paper",
            "value": "400 GSM Super Premium"
          },
          {
            "name": "Finish",
            "value": "Soft Touch Velvet"
          }
        ]
      }
    ],
    priceFrom: money(49900),
    compareAtFrom: money(59900),
    "quantityTiers": [
      {
        "qty": 100,
        price: money(49900),
        compareAtPrice: money(59900)
      },
      {
        "qty": 250,
        price: money(104800)
      },
      {
        "qty": 500,
        price: money(179600),
        "note": "Popular"
      },
      {
        "qty": 1000,
        price: money(309400),
        "note": "Best Value"
      }
    ],
    "priceUnit": "per 100 cards",
    "specs": [
      {
        "label": "Paper Weight",
        "value": "300 - 400 GSM Art Stock"
      },
      {
        "label": "Standard Dimensions",
        "value": "89 × 54 mm (3.5 × 2 in)"
      },
      {
        "label": "Print Method",
        "value": "4-Colour Offset CMYK"
      },
      {
        "label": "Bleed Allowance",
        "value": "2 mm on all edges"
      },
      {
        "label": "Dispatch Schedule",
        "value": "2 Working Days"
      }
    ],
    "minOrderQty": 100,
    "turnaroundDays": 2,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.9,
    "reviewCount": 294,
    "faqs": [
      {
        "q": "What resolution should my artwork file have?",
        "a": "We recommend submitting vector PDFs or 300 DPI high-resolution CMYK files with 2 mm bleed margins."
      },
      {
        "q": "Can I print different names in a single order?",
        "a": "Multiple names require separate batches or our corporate stationery packs for bundled savings."
      },
      {
        "q": "Is same-day pickup available locally?",
        "a": "Yes, orders confirmed before 11:00 AM can be picked up at our our local store facility the same evening."
      }
    ],
    "relatedHandles": [
      "standard-visiting-cards",
      "rounded-corner-cards",
      "matte-laminated-cards",
      "spot-uv-cards"
    ],
    "highlights": [
      "Crisp high-resolution colour fidelity",
      "Protective moisture-resistant lamination",
      "Consistent hydraulic die-cut precision"
    ]
  },
  {
    "id": "prod-non-tearable-cards",
    "handle": "non-tearable-cards",
    "title": "Non-Tearable Cards",
    "subtitle": "Premium 350 GSM stock, custom cut and finished for non-tearable cards",
    "description": "Professional Non-Tearable Cards crafted with high-definition CMYK printing. Designed for lasting impressions with clean edge trim and tactile finishing options.",
    "productType": "Visiting Cards",
    "categoryHandles": [
      "visiting-cards"
    ],
    "tags": [
      "non-tearable cards",
      "visiting cards",
      "card"
    ],
    "badges": [],
    "images": [
      {
        "url": "",
        "altText": "Non-Tearable Cards preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Non-Tearable Cards detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Non-Tearable Cards packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Paper",
        "values": [
          "300 GSM Art Card",
          "350 GSM Art Card",
          "400 GSM Super Premium"
        ]
      },
      {
        "name": "Finish",
        "values": [
          "Matte Lamination",
          "Gloss Lamination",
          "Soft Touch Velvet"
        ]
      },
      {
        "name": "Sides",
        "values": [
          "Single Side",
          "Both Sides"
        ]
      }
    ],
    "variants": [
      {
        "id": "non-tearable-cards-300-m",
        "title": "300 GSM / Matte",
        "sku": "VC-NON--300M",
        price: money(29900),
        compareAtPrice: money(39900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Paper",
            "value": "300 GSM Art Card"
          },
          {
            "name": "Finish",
            "value": "Matte Lamination"
          }
        ]
      },
      {
        "id": "non-tearable-cards-350-m",
        "title": "350 GSM / Matte",
        "sku": "VC-NON--350M",
        price: money(37400),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.25,
        "selectedOptions": [
          {
            "name": "Paper",
            "value": "350 GSM Art Card"
          },
          {
            "name": "Finish",
            "value": "Matte Lamination"
          }
        ]
      },
      {
        "id": "non-tearable-cards-400-v",
        "title": "400 GSM / Velvet",
        "sku": "VC-NON--400V",
        price: money(47800),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.6,
        "selectedOptions": [
          {
            "name": "Paper",
            "value": "400 GSM Super Premium"
          },
          {
            "name": "Finish",
            "value": "Soft Touch Velvet"
          }
        ]
      }
    ],
    priceFrom: money(29900),
    compareAtFrom: money(39900),
    "quantityTiers": [
      {
        "qty": 100,
        price: money(29900),
        compareAtPrice: money(39900)
      },
      {
        "qty": 250,
        price: money(62800)
      },
      {
        "qty": 500,
        price: money(107600),
        "note": "Popular"
      },
      {
        "qty": 1000,
        price: money(185400),
        "note": "Best Value"
      }
    ],
    "priceUnit": "per 100 cards",
    "specs": [
      {
        "label": "Paper Weight",
        "value": "300 - 400 GSM Art Stock"
      },
      {
        "label": "Standard Dimensions",
        "value": "89 × 54 mm (3.5 × 2 in)"
      },
      {
        "label": "Print Method",
        "value": "4-Colour Offset CMYK"
      },
      {
        "label": "Bleed Allowance",
        "value": "2 mm on all edges"
      },
      {
        "label": "Dispatch Schedule",
        "value": "2 Working Days"
      }
    ],
    "minOrderQty": 100,
    "turnaroundDays": 2,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.8,
    "reviewCount": 63,
    "faqs": [
      {
        "q": "What resolution should my artwork file have?",
        "a": "We recommend submitting vector PDFs or 300 DPI high-resolution CMYK files with 2 mm bleed margins."
      },
      {
        "q": "Can I print different names in a single order?",
        "a": "Multiple names require separate batches or our corporate stationery packs for bundled savings."
      },
      {
        "q": "Is same-day pickup available locally?",
        "a": "Yes, orders confirmed before 11:00 AM can be picked up at our our local store facility the same evening."
      }
    ],
    "relatedHandles": [
      "standard-visiting-cards",
      "rounded-corner-cards",
      "matte-laminated-cards",
      "spot-uv-cards"
    ],
    "highlights": [
      "Crisp high-resolution colour fidelity",
      "Protective moisture-resistant lamination",
      "Consistent hydraulic die-cut precision"
    ]
  },
  {
    "id": "prod-plastic-cards",
    "handle": "plastic-cards",
    "title": "Plastic Cards",
    "subtitle": "Premium 350 GSM stock, custom cut and finished for plastic cards",
    "description": "Professional Plastic Cards crafted with high-definition CMYK printing. Designed for lasting impressions with clean edge trim and tactile finishing options.",
    "productType": "Visiting Cards",
    "categoryHandles": [
      "visiting-cards"
    ],
    "tags": [
      "plastic cards",
      "visiting cards",
      "card"
    ],
    "badges": [],
    "images": [
      {
        "url": "",
        "altText": "Plastic Cards preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Plastic Cards detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Plastic Cards packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Paper",
        "values": [
          "300 GSM Art Card",
          "350 GSM Art Card",
          "400 GSM Super Premium"
        ]
      },
      {
        "name": "Finish",
        "values": [
          "Matte Lamination",
          "Gloss Lamination",
          "Soft Touch Velvet"
        ]
      },
      {
        "name": "Sides",
        "values": [
          "Single Side",
          "Both Sides"
        ]
      }
    ],
    "variants": [
      {
        "id": "plastic-cards-300-m",
        "title": "300 GSM / Matte",
        "sku": "VC-PLAS-300M",
        price: money(29900),
        compareAtPrice: money(39900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Paper",
            "value": "300 GSM Art Card"
          },
          {
            "name": "Finish",
            "value": "Matte Lamination"
          }
        ]
      },
      {
        "id": "plastic-cards-350-m",
        "title": "350 GSM / Matte",
        "sku": "VC-PLAS-350M",
        price: money(37400),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.25,
        "selectedOptions": [
          {
            "name": "Paper",
            "value": "350 GSM Art Card"
          },
          {
            "name": "Finish",
            "value": "Matte Lamination"
          }
        ]
      },
      {
        "id": "plastic-cards-400-v",
        "title": "400 GSM / Velvet",
        "sku": "VC-PLAS-400V",
        price: money(47800),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.6,
        "selectedOptions": [
          {
            "name": "Paper",
            "value": "400 GSM Super Premium"
          },
          {
            "name": "Finish",
            "value": "Soft Touch Velvet"
          }
        ]
      }
    ],
    priceFrom: money(29900),
    compareAtFrom: money(39900),
    "quantityTiers": [
      {
        "qty": 100,
        price: money(29900),
        compareAtPrice: money(39900)
      },
      {
        "qty": 250,
        price: money(62800)
      },
      {
        "qty": 500,
        price: money(107600),
        "note": "Popular"
      },
      {
        "qty": 1000,
        price: money(185400),
        "note": "Best Value"
      }
    ],
    "priceUnit": "per 100 cards",
    "specs": [
      {
        "label": "Paper Weight",
        "value": "300 - 400 GSM Art Stock"
      },
      {
        "label": "Standard Dimensions",
        "value": "89 × 54 mm (3.5 × 2 in)"
      },
      {
        "label": "Print Method",
        "value": "4-Colour Offset CMYK"
      },
      {
        "label": "Bleed Allowance",
        "value": "2 mm on all edges"
      },
      {
        "label": "Dispatch Schedule",
        "value": "2 Working Days"
      }
    ],
    "minOrderQty": 100,
    "turnaroundDays": 2,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.6,
    "reviewCount": 577,
    "faqs": [
      {
        "q": "What resolution should my artwork file have?",
        "a": "We recommend submitting vector PDFs or 300 DPI high-resolution CMYK files with 2 mm bleed margins."
      },
      {
        "q": "Can I print different names in a single order?",
        "a": "Multiple names require separate batches or our corporate stationery packs for bundled savings."
      },
      {
        "q": "Is same-day pickup available locally?",
        "a": "Yes, orders confirmed before 11:00 AM can be picked up at our our local store facility the same evening."
      }
    ],
    "relatedHandles": [
      "standard-visiting-cards",
      "rounded-corner-cards",
      "matte-laminated-cards",
      "spot-uv-cards"
    ],
    "highlights": [
      "Crisp high-resolution colour fidelity",
      "Protective moisture-resistant lamination",
      "Consistent hydraulic die-cut precision"
    ]
  },
  {
    "id": "prod-sandwich-cards",
    "handle": "sandwich-cards",
    "title": "Sandwich Cards",
    "subtitle": "Premium 350 GSM stock, custom cut and finished for sandwich cards",
    "description": "Professional Sandwich Cards crafted with high-definition CMYK printing. Designed for lasting impressions with clean edge trim and tactile finishing options.",
    "productType": "Visiting Cards",
    "categoryHandles": [
      "visiting-cards"
    ],
    "tags": [
      "sandwich cards",
      "visiting cards",
      "card",
      "premium"
    ],
    "badges": [
      "premium"
    ],
    "images": [
      {
        "url": "",
        "altText": "Sandwich Cards preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Sandwich Cards detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Sandwich Cards packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Paper",
        "values": [
          "300 GSM Art Card",
          "350 GSM Art Card",
          "400 GSM Super Premium"
        ]
      },
      {
        "name": "Finish",
        "values": [
          "Matte Lamination",
          "Gloss Lamination",
          "Soft Touch Velvet"
        ]
      },
      {
        "name": "Sides",
        "values": [
          "Single Side",
          "Both Sides"
        ]
      }
    ],
    "variants": [
      {
        "id": "sandwich-cards-300-m",
        "title": "300 GSM / Matte",
        "sku": "VC-SAND-300M",
        price: money(79900),
        compareAtPrice: money(99900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Paper",
            "value": "300 GSM Art Card"
          },
          {
            "name": "Finish",
            "value": "Matte Lamination"
          }
        ]
      },
      {
        "id": "sandwich-cards-350-m",
        "title": "350 GSM / Matte",
        "sku": "VC-SAND-350M",
        price: money(99900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.25,
        "selectedOptions": [
          {
            "name": "Paper",
            "value": "350 GSM Art Card"
          },
          {
            "name": "Finish",
            "value": "Matte Lamination"
          }
        ]
      },
      {
        "id": "sandwich-cards-400-v",
        "title": "400 GSM / Velvet",
        "sku": "VC-SAND-400V",
        price: money(127800),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.6,
        "selectedOptions": [
          {
            "name": "Paper",
            "value": "400 GSM Super Premium"
          },
          {
            "name": "Finish",
            "value": "Soft Touch Velvet"
          }
        ]
      }
    ],
    priceFrom: money(79900),
    compareAtFrom: money(99900),
    "quantityTiers": [
      {
        "qty": 100,
        price: money(79900),
        compareAtPrice: money(99900)
      },
      {
        "qty": 250,
        price: money(167800)
      },
      {
        "qty": 500,
        price: money(287600),
        "note": "Popular"
      },
      {
        "qty": 1000,
        price: money(495400),
        "note": "Best Value"
      }
    ],
    "priceUnit": "per 100 cards",
    "specs": [
      {
        "label": "Paper Weight",
        "value": "300 - 400 GSM Art Stock"
      },
      {
        "label": "Standard Dimensions",
        "value": "89 × 54 mm (3.5 × 2 in)"
      },
      {
        "label": "Print Method",
        "value": "4-Colour Offset CMYK"
      },
      {
        "label": "Bleed Allowance",
        "value": "2 mm on all edges"
      },
      {
        "label": "Dispatch Schedule",
        "value": "2 Working Days"
      }
    ],
    "minOrderQty": 100,
    "turnaroundDays": 2,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.9,
    "reviewCount": 192,
    "faqs": [
      {
        "q": "What resolution should my artwork file have?",
        "a": "We recommend submitting vector PDFs or 300 DPI high-resolution CMYK files with 2 mm bleed margins."
      },
      {
        "q": "Can I print different names in a single order?",
        "a": "Multiple names require separate batches or our corporate stationery packs for bundled savings."
      },
      {
        "q": "Is same-day pickup available locally?",
        "a": "Yes, orders confirmed before 11:00 AM can be picked up at our our local store facility the same evening."
      }
    ],
    "relatedHandles": [
      "standard-visiting-cards",
      "rounded-corner-cards",
      "matte-laminated-cards",
      "spot-uv-cards"
    ],
    "highlights": [
      "Crisp high-resolution colour fidelity",
      "Protective moisture-resistant lamination",
      "Consistent hydraulic die-cut precision"
    ]
  },
  {
    "id": "prod-square-cards",
    "handle": "square-cards",
    "title": "Square Cards",
    "subtitle": "Premium 350 GSM stock, custom cut and finished for square cards",
    "description": "Professional Square Cards crafted with high-definition CMYK printing. Designed for lasting impressions with clean edge trim and tactile finishing options.",
    "productType": "Visiting Cards",
    "categoryHandles": [
      "visiting-cards"
    ],
    "tags": [
      "square cards",
      "visiting cards",
      "card"
    ],
    "badges": [],
    "images": [
      {
        "url": "",
        "altText": "Square Cards preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Square Cards detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Square Cards packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Paper",
        "values": [
          "300 GSM Art Card",
          "350 GSM Art Card",
          "400 GSM Super Premium"
        ]
      },
      {
        "name": "Finish",
        "values": [
          "Matte Lamination",
          "Gloss Lamination",
          "Soft Touch Velvet"
        ]
      },
      {
        "name": "Sides",
        "values": [
          "Single Side",
          "Both Sides"
        ]
      }
    ],
    "variants": [
      {
        "id": "square-cards-300-m",
        "title": "300 GSM / Matte",
        "sku": "VC-SQUA-300M",
        price: money(29900),
        compareAtPrice: money(39900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Paper",
            "value": "300 GSM Art Card"
          },
          {
            "name": "Finish",
            "value": "Matte Lamination"
          }
        ]
      },
      {
        "id": "square-cards-350-m",
        "title": "350 GSM / Matte",
        "sku": "VC-SQUA-350M",
        price: money(37400),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.25,
        "selectedOptions": [
          {
            "name": "Paper",
            "value": "350 GSM Art Card"
          },
          {
            "name": "Finish",
            "value": "Matte Lamination"
          }
        ]
      },
      {
        "id": "square-cards-400-v",
        "title": "400 GSM / Velvet",
        "sku": "VC-SQUA-400V",
        price: money(47800),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.6,
        "selectedOptions": [
          {
            "name": "Paper",
            "value": "400 GSM Super Premium"
          },
          {
            "name": "Finish",
            "value": "Soft Touch Velvet"
          }
        ]
      }
    ],
    priceFrom: money(29900),
    compareAtFrom: money(39900),
    "quantityTiers": [
      {
        "qty": 100,
        price: money(29900),
        compareAtPrice: money(39900)
      },
      {
        "qty": 250,
        price: money(62800)
      },
      {
        "qty": 500,
        price: money(107600),
        "note": "Popular"
      },
      {
        "qty": 1000,
        price: money(185400),
        "note": "Best Value"
      }
    ],
    "priceUnit": "per 100 cards",
    "specs": [
      {
        "label": "Paper Weight",
        "value": "300 - 400 GSM Art Stock"
      },
      {
        "label": "Standard Dimensions",
        "value": "89 × 54 mm (3.5 × 2 in)"
      },
      {
        "label": "Print Method",
        "value": "4-Colour Offset CMYK"
      },
      {
        "label": "Bleed Allowance",
        "value": "2 mm on all edges"
      },
      {
        "label": "Dispatch Schedule",
        "value": "2 Working Days"
      }
    ],
    "minOrderQty": 100,
    "turnaroundDays": 2,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.9,
    "reviewCount": 270,
    "faqs": [
      {
        "q": "What resolution should my artwork file have?",
        "a": "We recommend submitting vector PDFs or 300 DPI high-resolution CMYK files with 2 mm bleed margins."
      },
      {
        "q": "Can I print different names in a single order?",
        "a": "Multiple names require separate batches or our corporate stationery packs for bundled savings."
      },
      {
        "q": "Is same-day pickup available locally?",
        "a": "Yes, orders confirmed before 11:00 AM can be picked up at our our local store facility the same evening."
      }
    ],
    "relatedHandles": [
      "standard-visiting-cards",
      "rounded-corner-cards",
      "matte-laminated-cards",
      "spot-uv-cards"
    ],
    "highlights": [
      "Crisp high-resolution colour fidelity",
      "Protective moisture-resistant lamination",
      "Consistent hydraulic die-cut precision"
    ]
  },
  {
    "id": "prod-circular-cards",
    "handle": "circular-cards",
    "title": "Circular Cards",
    "subtitle": "Premium 350 GSM stock, custom cut and finished for circular cards",
    "description": "Professional Circular Cards crafted with high-definition CMYK printing. Designed for lasting impressions with clean edge trim and tactile finishing options.",
    "productType": "Visiting Cards",
    "categoryHandles": [
      "visiting-cards"
    ],
    "tags": [
      "circular cards",
      "visiting cards",
      "card"
    ],
    "badges": [],
    "images": [
      {
        "url": "",
        "altText": "Circular Cards preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Circular Cards detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Circular Cards packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Paper",
        "values": [
          "300 GSM Art Card",
          "350 GSM Art Card",
          "400 GSM Super Premium"
        ]
      },
      {
        "name": "Finish",
        "values": [
          "Matte Lamination",
          "Gloss Lamination",
          "Soft Touch Velvet"
        ]
      },
      {
        "name": "Sides",
        "values": [
          "Single Side",
          "Both Sides"
        ]
      }
    ],
    "variants": [
      {
        "id": "circular-cards-300-m",
        "title": "300 GSM / Matte",
        "sku": "VC-CIRC-300M",
        price: money(29900),
        compareAtPrice: money(39900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Paper",
            "value": "300 GSM Art Card"
          },
          {
            "name": "Finish",
            "value": "Matte Lamination"
          }
        ]
      },
      {
        "id": "circular-cards-350-m",
        "title": "350 GSM / Matte",
        "sku": "VC-CIRC-350M",
        price: money(37400),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.25,
        "selectedOptions": [
          {
            "name": "Paper",
            "value": "350 GSM Art Card"
          },
          {
            "name": "Finish",
            "value": "Matte Lamination"
          }
        ]
      },
      {
        "id": "circular-cards-400-v",
        "title": "400 GSM / Velvet",
        "sku": "VC-CIRC-400V",
        price: money(47800),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.6,
        "selectedOptions": [
          {
            "name": "Paper",
            "value": "400 GSM Super Premium"
          },
          {
            "name": "Finish",
            "value": "Soft Touch Velvet"
          }
        ]
      }
    ],
    priceFrom: money(29900),
    compareAtFrom: money(39900),
    "quantityTiers": [
      {
        "qty": 100,
        price: money(29900),
        compareAtPrice: money(39900)
      },
      {
        "qty": 250,
        price: money(62800)
      },
      {
        "qty": 500,
        price: money(107600),
        "note": "Popular"
      },
      {
        "qty": 1000,
        price: money(185400),
        "note": "Best Value"
      }
    ],
    "priceUnit": "per 100 cards",
    "specs": [
      {
        "label": "Paper Weight",
        "value": "300 - 400 GSM Art Stock"
      },
      {
        "label": "Standard Dimensions",
        "value": "89 × 54 mm (3.5 × 2 in)"
      },
      {
        "label": "Print Method",
        "value": "4-Colour Offset CMYK"
      },
      {
        "label": "Bleed Allowance",
        "value": "2 mm on all edges"
      },
      {
        "label": "Dispatch Schedule",
        "value": "2 Working Days"
      }
    ],
    "minOrderQty": 100,
    "turnaroundDays": 2,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.7,
    "reviewCount": 96,
    "faqs": [
      {
        "q": "What resolution should my artwork file have?",
        "a": "We recommend submitting vector PDFs or 300 DPI high-resolution CMYK files with 2 mm bleed margins."
      },
      {
        "q": "Can I print different names in a single order?",
        "a": "Multiple names require separate batches or our corporate stationery packs for bundled savings."
      },
      {
        "q": "Is same-day pickup available locally?",
        "a": "Yes, orders confirmed before 11:00 AM can be picked up at our our local store facility the same evening."
      }
    ],
    "relatedHandles": [
      "standard-visiting-cards",
      "rounded-corner-cards",
      "matte-laminated-cards",
      "spot-uv-cards"
    ],
    "highlights": [
      "Crisp high-resolution colour fidelity",
      "Protective moisture-resistant lamination",
      "Consistent hydraulic die-cut precision"
    ]
  },
  {
    "id": "prod-oval-cards",
    "handle": "oval-cards",
    "title": "Oval Cards",
    "subtitle": "Premium 350 GSM stock, custom cut and finished for oval cards",
    "description": "Professional Oval Cards crafted with high-definition CMYK printing. Designed for lasting impressions with clean edge trim and tactile finishing options.",
    "productType": "Visiting Cards",
    "categoryHandles": [
      "visiting-cards"
    ],
    "tags": [
      "oval cards",
      "visiting cards",
      "card"
    ],
    "badges": [],
    "images": [
      {
        "url": "",
        "altText": "Oval Cards preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Oval Cards detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Oval Cards packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Paper",
        "values": [
          "300 GSM Art Card",
          "350 GSM Art Card",
          "400 GSM Super Premium"
        ]
      },
      {
        "name": "Finish",
        "values": [
          "Matte Lamination",
          "Gloss Lamination",
          "Soft Touch Velvet"
        ]
      },
      {
        "name": "Sides",
        "values": [
          "Single Side",
          "Both Sides"
        ]
      }
    ],
    "variants": [
      {
        "id": "oval-cards-300-m",
        "title": "300 GSM / Matte",
        "sku": "VC-OVAL-300M",
        price: money(29900),
        compareAtPrice: money(39900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Paper",
            "value": "300 GSM Art Card"
          },
          {
            "name": "Finish",
            "value": "Matte Lamination"
          }
        ]
      },
      {
        "id": "oval-cards-350-m",
        "title": "350 GSM / Matte",
        "sku": "VC-OVAL-350M",
        price: money(37400),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.25,
        "selectedOptions": [
          {
            "name": "Paper",
            "value": "350 GSM Art Card"
          },
          {
            "name": "Finish",
            "value": "Matte Lamination"
          }
        ]
      },
      {
        "id": "oval-cards-400-v",
        "title": "400 GSM / Velvet",
        "sku": "VC-OVAL-400V",
        price: money(47800),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.6,
        "selectedOptions": [
          {
            "name": "Paper",
            "value": "400 GSM Super Premium"
          },
          {
            "name": "Finish",
            "value": "Soft Touch Velvet"
          }
        ]
      }
    ],
    priceFrom: money(29900),
    compareAtFrom: money(39900),
    "quantityTiers": [
      {
        "qty": 100,
        price: money(29900),
        compareAtPrice: money(39900)
      },
      {
        "qty": 250,
        price: money(62800)
      },
      {
        "qty": 500,
        price: money(107600),
        "note": "Popular"
      },
      {
        "qty": 1000,
        price: money(185400),
        "note": "Best Value"
      }
    ],
    "priceUnit": "per 100 cards",
    "specs": [
      {
        "label": "Paper Weight",
        "value": "300 - 400 GSM Art Stock"
      },
      {
        "label": "Standard Dimensions",
        "value": "89 × 54 mm (3.5 × 2 in)"
      },
      {
        "label": "Print Method",
        "value": "4-Colour Offset CMYK"
      },
      {
        "label": "Bleed Allowance",
        "value": "2 mm on all edges"
      },
      {
        "label": "Dispatch Schedule",
        "value": "2 Working Days"
      }
    ],
    "minOrderQty": 100,
    "turnaroundDays": 2,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.4,
    "reviewCount": 147,
    "faqs": [
      {
        "q": "What resolution should my artwork file have?",
        "a": "We recommend submitting vector PDFs or 300 DPI high-resolution CMYK files with 2 mm bleed margins."
      },
      {
        "q": "Can I print different names in a single order?",
        "a": "Multiple names require separate batches or our corporate stationery packs for bundled savings."
      },
      {
        "q": "Is same-day pickup available locally?",
        "a": "Yes, orders confirmed before 11:00 AM can be picked up at our our local store facility the same evening."
      }
    ],
    "relatedHandles": [
      "standard-visiting-cards",
      "rounded-corner-cards",
      "matte-laminated-cards",
      "spot-uv-cards"
    ],
    "highlights": [
      "Crisp high-resolution colour fidelity",
      "Protective moisture-resistant lamination",
      "Consistent hydraulic die-cut precision"
    ]
  },
  {
    "id": "prod-u-shape-cards",
    "handle": "u-shape-cards",
    "title": "U-Shape Cards",
    "subtitle": "Premium 350 GSM stock, custom cut and finished for u-shape cards",
    "description": "Professional U-Shape Cards crafted with high-definition CMYK printing. Designed for lasting impressions with clean edge trim and tactile finishing options.",
    "productType": "Visiting Cards",
    "categoryHandles": [
      "visiting-cards"
    ],
    "tags": [
      "u-shape cards",
      "visiting cards",
      "card"
    ],
    "badges": [],
    "images": [
      {
        "url": "",
        "altText": "U-Shape Cards preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "U-Shape Cards detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "U-Shape Cards packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Paper",
        "values": [
          "300 GSM Art Card",
          "350 GSM Art Card",
          "400 GSM Super Premium"
        ]
      },
      {
        "name": "Finish",
        "values": [
          "Matte Lamination",
          "Gloss Lamination",
          "Soft Touch Velvet"
        ]
      },
      {
        "name": "Sides",
        "values": [
          "Single Side",
          "Both Sides"
        ]
      }
    ],
    "variants": [
      {
        "id": "u-shape-cards-300-m",
        "title": "300 GSM / Matte",
        "sku": "VC-U-SH-300M",
        price: money(29900),
        compareAtPrice: money(39900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Paper",
            "value": "300 GSM Art Card"
          },
          {
            "name": "Finish",
            "value": "Matte Lamination"
          }
        ]
      },
      {
        "id": "u-shape-cards-350-m",
        "title": "350 GSM / Matte",
        "sku": "VC-U-SH-350M",
        price: money(37400),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.25,
        "selectedOptions": [
          {
            "name": "Paper",
            "value": "350 GSM Art Card"
          },
          {
            "name": "Finish",
            "value": "Matte Lamination"
          }
        ]
      },
      {
        "id": "u-shape-cards-400-v",
        "title": "400 GSM / Velvet",
        "sku": "VC-U-SH-400V",
        price: money(47800),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.6,
        "selectedOptions": [
          {
            "name": "Paper",
            "value": "400 GSM Super Premium"
          },
          {
            "name": "Finish",
            "value": "Soft Touch Velvet"
          }
        ]
      }
    ],
    priceFrom: money(29900),
    compareAtFrom: money(39900),
    "quantityTiers": [
      {
        "qty": 100,
        price: money(29900),
        compareAtPrice: money(39900)
      },
      {
        "qty": 250,
        price: money(62800)
      },
      {
        "qty": 500,
        price: money(107600),
        "note": "Popular"
      },
      {
        "qty": 1000,
        price: money(185400),
        "note": "Best Value"
      }
    ],
    "priceUnit": "per 100 cards",
    "specs": [
      {
        "label": "Paper Weight",
        "value": "300 - 400 GSM Art Stock"
      },
      {
        "label": "Standard Dimensions",
        "value": "89 × 54 mm (3.5 × 2 in)"
      },
      {
        "label": "Print Method",
        "value": "4-Colour Offset CMYK"
      },
      {
        "label": "Bleed Allowance",
        "value": "2 mm on all edges"
      },
      {
        "label": "Dispatch Schedule",
        "value": "2 Working Days"
      }
    ],
    "minOrderQty": 100,
    "turnaroundDays": 2,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.9,
    "reviewCount": 100,
    "faqs": [
      {
        "q": "What resolution should my artwork file have?",
        "a": "We recommend submitting vector PDFs or 300 DPI high-resolution CMYK files with 2 mm bleed margins."
      },
      {
        "q": "Can I print different names in a single order?",
        "a": "Multiple names require separate batches or our corporate stationery packs for bundled savings."
      },
      {
        "q": "Is same-day pickup available locally?",
        "a": "Yes, orders confirmed before 11:00 AM can be picked up at our our local store facility the same evening."
      }
    ],
    "relatedHandles": [
      "standard-visiting-cards",
      "rounded-corner-cards",
      "matte-laminated-cards",
      "spot-uv-cards"
    ],
    "highlights": [
      "Crisp high-resolution colour fidelity",
      "Protective moisture-resistant lamination",
      "Consistent hydraulic die-cut precision"
    ]
  },
  {
    "id": "prod-mini-cards",
    "handle": "mini-cards",
    "title": "Mini Cards",
    "subtitle": "Premium 350 GSM stock, custom cut and finished for mini cards",
    "description": "Professional Mini Cards crafted with high-definition CMYK printing. Designed for lasting impressions with clean edge trim and tactile finishing options.",
    "productType": "Visiting Cards",
    "categoryHandles": [
      "visiting-cards"
    ],
    "tags": [
      "mini cards",
      "visiting cards",
      "card",
      "new"
    ],
    "badges": [
      "new"
    ],
    "images": [
      {
        "url": "",
        "altText": "Mini Cards preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Mini Cards detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Mini Cards packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Paper",
        "values": [
          "300 GSM Art Card",
          "350 GSM Art Card",
          "400 GSM Super Premium"
        ]
      },
      {
        "name": "Finish",
        "values": [
          "Matte Lamination",
          "Gloss Lamination",
          "Soft Touch Velvet"
        ]
      },
      {
        "name": "Sides",
        "values": [
          "Single Side",
          "Both Sides"
        ]
      }
    ],
    "variants": [
      {
        "id": "mini-cards-300-m",
        "title": "300 GSM / Matte",
        "sku": "VC-MINI-300M",
        price: money(29900),
        compareAtPrice: money(39900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Paper",
            "value": "300 GSM Art Card"
          },
          {
            "name": "Finish",
            "value": "Matte Lamination"
          }
        ]
      },
      {
        "id": "mini-cards-350-m",
        "title": "350 GSM / Matte",
        "sku": "VC-MINI-350M",
        price: money(37400),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.25,
        "selectedOptions": [
          {
            "name": "Paper",
            "value": "350 GSM Art Card"
          },
          {
            "name": "Finish",
            "value": "Matte Lamination"
          }
        ]
      },
      {
        "id": "mini-cards-400-v",
        "title": "400 GSM / Velvet",
        "sku": "VC-MINI-400V",
        price: money(47800),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.6,
        "selectedOptions": [
          {
            "name": "Paper",
            "value": "400 GSM Super Premium"
          },
          {
            "name": "Finish",
            "value": "Soft Touch Velvet"
          }
        ]
      }
    ],
    priceFrom: money(29900),
    compareAtFrom: money(39900),
    "quantityTiers": [
      {
        "qty": 100,
        price: money(29900),
        compareAtPrice: money(39900)
      },
      {
        "qty": 250,
        price: money(62800)
      },
      {
        "qty": 500,
        price: money(107600),
        "note": "Popular"
      },
      {
        "qty": 1000,
        price: money(185400),
        "note": "Best Value"
      }
    ],
    "priceUnit": "per 100 cards",
    "specs": [
      {
        "label": "Paper Weight",
        "value": "300 - 400 GSM Art Stock"
      },
      {
        "label": "Standard Dimensions",
        "value": "89 × 54 mm (3.5 × 2 in)"
      },
      {
        "label": "Print Method",
        "value": "4-Colour Offset CMYK"
      },
      {
        "label": "Bleed Allowance",
        "value": "2 mm on all edges"
      },
      {
        "label": "Dispatch Schedule",
        "value": "2 Working Days"
      }
    ],
    "minOrderQty": 100,
    "turnaroundDays": 2,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.7,
    "reviewCount": 508,
    "faqs": [
      {
        "q": "What resolution should my artwork file have?",
        "a": "We recommend submitting vector PDFs or 300 DPI high-resolution CMYK files with 2 mm bleed margins."
      },
      {
        "q": "Can I print different names in a single order?",
        "a": "Multiple names require separate batches or our corporate stationery packs for bundled savings."
      },
      {
        "q": "Is same-day pickup available locally?",
        "a": "Yes, orders confirmed before 11:00 AM can be picked up at our our local store facility the same evening."
      }
    ],
    "relatedHandles": [
      "standard-visiting-cards",
      "rounded-corner-cards",
      "matte-laminated-cards",
      "spot-uv-cards"
    ],
    "highlights": [
      "Crisp high-resolution colour fidelity",
      "Protective moisture-resistant lamination",
      "Consistent hydraulic die-cut precision"
    ]
  },
  {
    "id": "prod-die-cut-cards",
    "handle": "die-cut-cards",
    "title": "Die-Cut Cards",
    "subtitle": "Premium 350 GSM stock, custom cut and finished for die-cut cards",
    "description": "Professional Die-Cut Cards crafted with high-definition CMYK printing. Designed for lasting impressions with clean edge trim and tactile finishing options.",
    "productType": "Visiting Cards",
    "categoryHandles": [
      "visiting-cards"
    ],
    "tags": [
      "die-cut cards",
      "visiting cards",
      "card"
    ],
    "badges": [],
    "images": [
      {
        "url": "",
        "altText": "Die-Cut Cards preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Die-Cut Cards detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Die-Cut Cards packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Paper",
        "values": [
          "300 GSM Art Card",
          "350 GSM Art Card",
          "400 GSM Super Premium"
        ]
      },
      {
        "name": "Finish",
        "values": [
          "Matte Lamination",
          "Gloss Lamination",
          "Soft Touch Velvet"
        ]
      },
      {
        "name": "Sides",
        "values": [
          "Single Side",
          "Both Sides"
        ]
      }
    ],
    "variants": [
      {
        "id": "die-cut-cards-300-m",
        "title": "300 GSM / Matte",
        "sku": "VC-DIE--300M",
        price: money(29900),
        compareAtPrice: money(39900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Paper",
            "value": "300 GSM Art Card"
          },
          {
            "name": "Finish",
            "value": "Matte Lamination"
          }
        ]
      },
      {
        "id": "die-cut-cards-350-m",
        "title": "350 GSM / Matte",
        "sku": "VC-DIE--350M",
        price: money(37400),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.25,
        "selectedOptions": [
          {
            "name": "Paper",
            "value": "350 GSM Art Card"
          },
          {
            "name": "Finish",
            "value": "Matte Lamination"
          }
        ]
      },
      {
        "id": "die-cut-cards-400-v",
        "title": "400 GSM / Velvet",
        "sku": "VC-DIE--400V",
        price: money(47800),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.6,
        "selectedOptions": [
          {
            "name": "Paper",
            "value": "400 GSM Super Premium"
          },
          {
            "name": "Finish",
            "value": "Soft Touch Velvet"
          }
        ]
      }
    ],
    priceFrom: money(29900),
    compareAtFrom: money(39900),
    "quantityTiers": [
      {
        "qty": 100,
        price: money(29900),
        compareAtPrice: money(39900)
      },
      {
        "qty": 250,
        price: money(62800)
      },
      {
        "qty": 500,
        price: money(107600),
        "note": "Popular"
      },
      {
        "qty": 1000,
        price: money(185400),
        "note": "Best Value"
      }
    ],
    "priceUnit": "per 100 cards",
    "specs": [
      {
        "label": "Paper Weight",
        "value": "300 - 400 GSM Art Stock"
      },
      {
        "label": "Standard Dimensions",
        "value": "89 × 54 mm (3.5 × 2 in)"
      },
      {
        "label": "Print Method",
        "value": "4-Colour Offset CMYK"
      },
      {
        "label": "Bleed Allowance",
        "value": "2 mm on all edges"
      },
      {
        "label": "Dispatch Schedule",
        "value": "2 Working Days"
      }
    ],
    "minOrderQty": 100,
    "turnaroundDays": 2,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.9,
    "reviewCount": 178,
    "faqs": [
      {
        "q": "What resolution should my artwork file have?",
        "a": "We recommend submitting vector PDFs or 300 DPI high-resolution CMYK files with 2 mm bleed margins."
      },
      {
        "q": "Can I print different names in a single order?",
        "a": "Multiple names require separate batches or our corporate stationery packs for bundled savings."
      },
      {
        "q": "Is same-day pickup available locally?",
        "a": "Yes, orders confirmed before 11:00 AM can be picked up at our our local store facility the same evening."
      }
    ],
    "relatedHandles": [
      "standard-visiting-cards",
      "rounded-corner-cards",
      "matte-laminated-cards",
      "spot-uv-cards"
    ],
    "highlights": [
      "Crisp high-resolution colour fidelity",
      "Protective moisture-resistant lamination",
      "Consistent hydraulic die-cut precision"
    ]
  },
  {
    "id": "prod-custom-shape-cards",
    "handle": "custom-shape-cards",
    "title": "Custom Shape Cards",
    "subtitle": "Premium 350 GSM stock, custom cut and finished for custom shape cards",
    "description": "Professional Custom Shape Cards crafted with high-definition CMYK printing. Designed for lasting impressions with clean edge trim and tactile finishing options.",
    "productType": "Visiting Cards",
    "categoryHandles": [
      "visiting-cards"
    ],
    "tags": [
      "custom shape cards",
      "visiting cards",
      "card"
    ],
    "badges": [],
    "images": [
      {
        "url": "",
        "altText": "Custom Shape Cards preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Custom Shape Cards detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Custom Shape Cards packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Paper",
        "values": [
          "300 GSM Art Card",
          "350 GSM Art Card",
          "400 GSM Super Premium"
        ]
      },
      {
        "name": "Finish",
        "values": [
          "Matte Lamination",
          "Gloss Lamination",
          "Soft Touch Velvet"
        ]
      },
      {
        "name": "Sides",
        "values": [
          "Single Side",
          "Both Sides"
        ]
      }
    ],
    "variants": [
      {
        "id": "custom-shape-cards-300-m",
        "title": "300 GSM / Matte",
        "sku": "VC-CUST-300M",
        price: money(29900),
        compareAtPrice: money(39900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Paper",
            "value": "300 GSM Art Card"
          },
          {
            "name": "Finish",
            "value": "Matte Lamination"
          }
        ]
      },
      {
        "id": "custom-shape-cards-350-m",
        "title": "350 GSM / Matte",
        "sku": "VC-CUST-350M",
        price: money(37400),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.25,
        "selectedOptions": [
          {
            "name": "Paper",
            "value": "350 GSM Art Card"
          },
          {
            "name": "Finish",
            "value": "Matte Lamination"
          }
        ]
      },
      {
        "id": "custom-shape-cards-400-v",
        "title": "400 GSM / Velvet",
        "sku": "VC-CUST-400V",
        price: money(47800),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.6,
        "selectedOptions": [
          {
            "name": "Paper",
            "value": "400 GSM Super Premium"
          },
          {
            "name": "Finish",
            "value": "Soft Touch Velvet"
          }
        ]
      }
    ],
    priceFrom: money(29900),
    compareAtFrom: money(39900),
    "quantityTiers": [
      {
        "qty": 100,
        price: money(29900),
        compareAtPrice: money(39900)
      },
      {
        "qty": 250,
        price: money(62800)
      },
      {
        "qty": 500,
        price: money(107600),
        "note": "Popular"
      },
      {
        "qty": 1000,
        price: money(185400),
        "note": "Best Value"
      }
    ],
    "priceUnit": "per 100 cards",
    "specs": [
      {
        "label": "Paper Weight",
        "value": "300 - 400 GSM Art Stock"
      },
      {
        "label": "Standard Dimensions",
        "value": "89 × 54 mm (3.5 × 2 in)"
      },
      {
        "label": "Print Method",
        "value": "4-Colour Offset CMYK"
      },
      {
        "label": "Bleed Allowance",
        "value": "2 mm on all edges"
      },
      {
        "label": "Dispatch Schedule",
        "value": "2 Working Days"
      }
    ],
    "minOrderQty": 100,
    "turnaroundDays": 2,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.5,
    "reviewCount": 484,
    "faqs": [
      {
        "q": "What resolution should my artwork file have?",
        "a": "We recommend submitting vector PDFs or 300 DPI high-resolution CMYK files with 2 mm bleed margins."
      },
      {
        "q": "Can I print different names in a single order?",
        "a": "Multiple names require separate batches or our corporate stationery packs for bundled savings."
      },
      {
        "q": "Is same-day pickup available locally?",
        "a": "Yes, orders confirmed before 11:00 AM can be picked up at our our local store facility the same evening."
      }
    ],
    "relatedHandles": [
      "standard-visiting-cards",
      "rounded-corner-cards",
      "matte-laminated-cards",
      "spot-uv-cards"
    ],
    "highlights": [
      "Crisp high-resolution colour fidelity",
      "Protective moisture-resistant lamination",
      "Consistent hydraulic die-cut precision"
    ]
  },
  {
    "id": "prod-metallic-finish-cards",
    "handle": "metallic-finish-cards",
    "title": "Metallic Finish Cards",
    "subtitle": "Premium 350 GSM stock, custom cut and finished for metallic finish cards",
    "description": "Professional Metallic Finish Cards crafted with high-definition CMYK printing. Designed for lasting impressions with clean edge trim and tactile finishing options.",
    "productType": "Visiting Cards",
    "categoryHandles": [
      "visiting-cards"
    ],
    "tags": [
      "metallic finish cards",
      "visiting cards",
      "card",
      "premium"
    ],
    "badges": [
      "premium"
    ],
    "images": [
      {
        "url": "",
        "altText": "Metallic Finish Cards preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Metallic Finish Cards detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Metallic Finish Cards packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Paper",
        "values": [
          "300 GSM Art Card",
          "350 GSM Art Card",
          "400 GSM Super Premium"
        ]
      },
      {
        "name": "Finish",
        "values": [
          "Matte Lamination",
          "Gloss Lamination",
          "Soft Touch Velvet"
        ]
      },
      {
        "name": "Sides",
        "values": [
          "Single Side",
          "Both Sides"
        ]
      }
    ],
    "variants": [
      {
        "id": "metallic-finish-cards-300-m",
        "title": "300 GSM / Matte",
        "sku": "VC-META-300M",
        price: money(79900),
        compareAtPrice: money(99900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Paper",
            "value": "300 GSM Art Card"
          },
          {
            "name": "Finish",
            "value": "Matte Lamination"
          }
        ]
      },
      {
        "id": "metallic-finish-cards-350-m",
        "title": "350 GSM / Matte",
        "sku": "VC-META-350M",
        price: money(99900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.25,
        "selectedOptions": [
          {
            "name": "Paper",
            "value": "350 GSM Art Card"
          },
          {
            "name": "Finish",
            "value": "Matte Lamination"
          }
        ]
      },
      {
        "id": "metallic-finish-cards-400-v",
        "title": "400 GSM / Velvet",
        "sku": "VC-META-400V",
        price: money(127800),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.6,
        "selectedOptions": [
          {
            "name": "Paper",
            "value": "400 GSM Super Premium"
          },
          {
            "name": "Finish",
            "value": "Soft Touch Velvet"
          }
        ]
      }
    ],
    priceFrom: money(79900),
    compareAtFrom: money(99900),
    "quantityTiers": [
      {
        "qty": 100,
        price: money(79900),
        compareAtPrice: money(99900)
      },
      {
        "qty": 250,
        price: money(167800)
      },
      {
        "qty": 500,
        price: money(287600),
        "note": "Popular"
      },
      {
        "qty": 1000,
        price: money(495400),
        "note": "Best Value"
      }
    ],
    "priceUnit": "per 100 cards",
    "specs": [
      {
        "label": "Paper Weight",
        "value": "300 - 400 GSM Art Stock"
      },
      {
        "label": "Standard Dimensions",
        "value": "89 × 54 mm (3.5 × 2 in)"
      },
      {
        "label": "Print Method",
        "value": "4-Colour Offset CMYK"
      },
      {
        "label": "Bleed Allowance",
        "value": "2 mm on all edges"
      },
      {
        "label": "Dispatch Schedule",
        "value": "2 Working Days"
      }
    ],
    "minOrderQty": 100,
    "turnaroundDays": 2,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.9,
    "reviewCount": 410,
    "faqs": [
      {
        "q": "What resolution should my artwork file have?",
        "a": "We recommend submitting vector PDFs or 300 DPI high-resolution CMYK files with 2 mm bleed margins."
      },
      {
        "q": "Can I print different names in a single order?",
        "a": "Multiple names require separate batches or our corporate stationery packs for bundled savings."
      },
      {
        "q": "Is same-day pickup available locally?",
        "a": "Yes, orders confirmed before 11:00 AM can be picked up at our our local store facility the same evening."
      }
    ],
    "relatedHandles": [
      "standard-visiting-cards",
      "rounded-corner-cards",
      "matte-laminated-cards",
      "spot-uv-cards"
    ],
    "highlights": [
      "Crisp high-resolution colour fidelity",
      "Protective moisture-resistant lamination",
      "Consistent hydraulic die-cut precision"
    ]
  },
  {
    "id": "prod-gold-foil-cards",
    "handle": "gold-foil-cards",
    "title": "Gold Foil Cards",
    "subtitle": "Premium 350 GSM stock, custom cut and finished for gold foil cards",
    "description": "Professional Gold Foil Cards crafted with high-definition CMYK printing. Designed for lasting impressions with clean edge trim and tactile finishing options.",
    "productType": "Visiting Cards",
    "categoryHandles": [
      "visiting-cards"
    ],
    "tags": [
      "gold foil cards",
      "visiting cards",
      "card",
      "premium"
    ],
    "badges": [
      "premium"
    ],
    "images": [
      {
        "url": "",
        "altText": "Gold Foil Cards preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Gold Foil Cards detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Gold Foil Cards packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Paper",
        "values": [
          "300 GSM Art Card",
          "350 GSM Art Card",
          "400 GSM Super Premium"
        ]
      },
      {
        "name": "Finish",
        "values": [
          "Matte Lamination",
          "Gloss Lamination",
          "Soft Touch Velvet"
        ]
      },
      {
        "name": "Sides",
        "values": [
          "Single Side",
          "Both Sides"
        ]
      }
    ],
    "variants": [
      {
        "id": "gold-foil-cards-300-m",
        "title": "300 GSM / Matte",
        "sku": "VC-GOLD-300M",
        price: money(79900),
        compareAtPrice: money(99900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Paper",
            "value": "300 GSM Art Card"
          },
          {
            "name": "Finish",
            "value": "Matte Lamination"
          }
        ]
      },
      {
        "id": "gold-foil-cards-350-m",
        "title": "350 GSM / Matte",
        "sku": "VC-GOLD-350M",
        price: money(99900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.25,
        "selectedOptions": [
          {
            "name": "Paper",
            "value": "350 GSM Art Card"
          },
          {
            "name": "Finish",
            "value": "Matte Lamination"
          }
        ]
      },
      {
        "id": "gold-foil-cards-400-v",
        "title": "400 GSM / Velvet",
        "sku": "VC-GOLD-400V",
        price: money(127800),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.6,
        "selectedOptions": [
          {
            "name": "Paper",
            "value": "400 GSM Super Premium"
          },
          {
            "name": "Finish",
            "value": "Soft Touch Velvet"
          }
        ]
      }
    ],
    priceFrom: money(79900),
    compareAtFrom: money(99900),
    "quantityTiers": [
      {
        "qty": 100,
        price: money(79900),
        compareAtPrice: money(99900)
      },
      {
        "qty": 250,
        price: money(167800)
      },
      {
        "qty": 500,
        price: money(287600),
        "note": "Popular"
      },
      {
        "qty": 1000,
        price: money(495400),
        "note": "Best Value"
      }
    ],
    "priceUnit": "per 100 cards",
    "specs": [
      {
        "label": "Paper Weight",
        "value": "300 - 400 GSM Art Stock"
      },
      {
        "label": "Standard Dimensions",
        "value": "89 × 54 mm (3.5 × 2 in)"
      },
      {
        "label": "Print Method",
        "value": "4-Colour Offset CMYK"
      },
      {
        "label": "Bleed Allowance",
        "value": "2 mm on all edges"
      },
      {
        "label": "Dispatch Schedule",
        "value": "2 Working Days"
      }
    ],
    "minOrderQty": 100,
    "turnaroundDays": 2,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.9,
    "reviewCount": 274,
    "faqs": [
      {
        "q": "What resolution should my artwork file have?",
        "a": "We recommend submitting vector PDFs or 300 DPI high-resolution CMYK files with 2 mm bleed margins."
      },
      {
        "q": "Can I print different names in a single order?",
        "a": "Multiple names require separate batches or our corporate stationery packs for bundled savings."
      },
      {
        "q": "Is same-day pickup available locally?",
        "a": "Yes, orders confirmed before 11:00 AM can be picked up at our our local store facility the same evening."
      }
    ],
    "relatedHandles": [
      "standard-visiting-cards",
      "rounded-corner-cards",
      "matte-laminated-cards",
      "spot-uv-cards"
    ],
    "highlights": [
      "Crisp high-resolution colour fidelity",
      "Protective moisture-resistant lamination",
      "Consistent hydraulic die-cut precision"
    ]
  },
  {
    "id": "prod-silver-foil-cards",
    "handle": "silver-foil-cards",
    "title": "Silver Foil Cards",
    "subtitle": "Premium 350 GSM stock, custom cut and finished for silver foil cards",
    "description": "Professional Silver Foil Cards crafted with high-definition CMYK printing. Designed for lasting impressions with clean edge trim and tactile finishing options.",
    "productType": "Visiting Cards",
    "categoryHandles": [
      "visiting-cards"
    ],
    "tags": [
      "silver foil cards",
      "visiting cards",
      "card"
    ],
    "badges": [],
    "images": [
      {
        "url": "",
        "altText": "Silver Foil Cards preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Silver Foil Cards detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Silver Foil Cards packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Paper",
        "values": [
          "300 GSM Art Card",
          "350 GSM Art Card",
          "400 GSM Super Premium"
        ]
      },
      {
        "name": "Finish",
        "values": [
          "Matte Lamination",
          "Gloss Lamination",
          "Soft Touch Velvet"
        ]
      },
      {
        "name": "Sides",
        "values": [
          "Single Side",
          "Both Sides"
        ]
      }
    ],
    "variants": [
      {
        "id": "silver-foil-cards-300-m",
        "title": "300 GSM / Matte",
        "sku": "VC-SILV-300M",
        price: money(79900),
        compareAtPrice: money(99900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Paper",
            "value": "300 GSM Art Card"
          },
          {
            "name": "Finish",
            "value": "Matte Lamination"
          }
        ]
      },
      {
        "id": "silver-foil-cards-350-m",
        "title": "350 GSM / Matte",
        "sku": "VC-SILV-350M",
        price: money(99900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.25,
        "selectedOptions": [
          {
            "name": "Paper",
            "value": "350 GSM Art Card"
          },
          {
            "name": "Finish",
            "value": "Matte Lamination"
          }
        ]
      },
      {
        "id": "silver-foil-cards-400-v",
        "title": "400 GSM / Velvet",
        "sku": "VC-SILV-400V",
        price: money(127800),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.6,
        "selectedOptions": [
          {
            "name": "Paper",
            "value": "400 GSM Super Premium"
          },
          {
            "name": "Finish",
            "value": "Soft Touch Velvet"
          }
        ]
      }
    ],
    priceFrom: money(79900),
    compareAtFrom: money(99900),
    "quantityTiers": [
      {
        "qty": 100,
        price: money(79900),
        compareAtPrice: money(99900)
      },
      {
        "qty": 250,
        price: money(167800)
      },
      {
        "qty": 500,
        price: money(287600),
        "note": "Popular"
      },
      {
        "qty": 1000,
        price: money(495400),
        "note": "Best Value"
      }
    ],
    "priceUnit": "per 100 cards",
    "specs": [
      {
        "label": "Paper Weight",
        "value": "300 - 400 GSM Art Stock"
      },
      {
        "label": "Standard Dimensions",
        "value": "89 × 54 mm (3.5 × 2 in)"
      },
      {
        "label": "Print Method",
        "value": "4-Colour Offset CMYK"
      },
      {
        "label": "Bleed Allowance",
        "value": "2 mm on all edges"
      },
      {
        "label": "Dispatch Schedule",
        "value": "2 Working Days"
      }
    ],
    "minOrderQty": 100,
    "turnaroundDays": 2,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.8,
    "reviewCount": 283,
    "faqs": [
      {
        "q": "What resolution should my artwork file have?",
        "a": "We recommend submitting vector PDFs or 300 DPI high-resolution CMYK files with 2 mm bleed margins."
      },
      {
        "q": "Can I print different names in a single order?",
        "a": "Multiple names require separate batches or our corporate stationery packs for bundled savings."
      },
      {
        "q": "Is same-day pickup available locally?",
        "a": "Yes, orders confirmed before 11:00 AM can be picked up at our our local store facility the same evening."
      }
    ],
    "relatedHandles": [
      "standard-visiting-cards",
      "rounded-corner-cards",
      "matte-laminated-cards",
      "spot-uv-cards"
    ],
    "highlights": [
      "Crisp high-resolution colour fidelity",
      "Protective moisture-resistant lamination",
      "Consistent hydraulic die-cut precision"
    ]
  },
  {
    "id": "prod-raised-foil-cards",
    "handle": "raised-foil-cards",
    "title": "Raised Foil Cards",
    "subtitle": "Premium 350 GSM stock, custom cut and finished for raised foil cards",
    "description": "Professional Raised Foil Cards crafted with high-definition CMYK printing. Designed for lasting impressions with clean edge trim and tactile finishing options.",
    "productType": "Visiting Cards",
    "categoryHandles": [
      "visiting-cards"
    ],
    "tags": [
      "raised foil cards",
      "visiting cards",
      "card",
      "new"
    ],
    "badges": [
      "new"
    ],
    "images": [
      {
        "url": "",
        "altText": "Raised Foil Cards preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Raised Foil Cards detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Raised Foil Cards packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Paper",
        "values": [
          "300 GSM Art Card",
          "350 GSM Art Card",
          "400 GSM Super Premium"
        ]
      },
      {
        "name": "Finish",
        "values": [
          "Matte Lamination",
          "Gloss Lamination",
          "Soft Touch Velvet"
        ]
      },
      {
        "name": "Sides",
        "values": [
          "Single Side",
          "Both Sides"
        ]
      }
    ],
    "variants": [
      {
        "id": "raised-foil-cards-300-m",
        "title": "300 GSM / Matte",
        "sku": "VC-RAIS-300M",
        price: money(79900),
        compareAtPrice: money(99900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Paper",
            "value": "300 GSM Art Card"
          },
          {
            "name": "Finish",
            "value": "Matte Lamination"
          }
        ]
      },
      {
        "id": "raised-foil-cards-350-m",
        "title": "350 GSM / Matte",
        "sku": "VC-RAIS-350M",
        price: money(99900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.25,
        "selectedOptions": [
          {
            "name": "Paper",
            "value": "350 GSM Art Card"
          },
          {
            "name": "Finish",
            "value": "Matte Lamination"
          }
        ]
      },
      {
        "id": "raised-foil-cards-400-v",
        "title": "400 GSM / Velvet",
        "sku": "VC-RAIS-400V",
        price: money(127800),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.6,
        "selectedOptions": [
          {
            "name": "Paper",
            "value": "400 GSM Super Premium"
          },
          {
            "name": "Finish",
            "value": "Soft Touch Velvet"
          }
        ]
      }
    ],
    priceFrom: money(79900),
    compareAtFrom: money(99900),
    "quantityTiers": [
      {
        "qty": 100,
        price: money(79900),
        compareAtPrice: money(99900)
      },
      {
        "qty": 250,
        price: money(167800)
      },
      {
        "qty": 500,
        price: money(287600),
        "note": "Popular"
      },
      {
        "qty": 1000,
        price: money(495400),
        "note": "Best Value"
      }
    ],
    "priceUnit": "per 100 cards",
    "specs": [
      {
        "label": "Paper Weight",
        "value": "300 - 400 GSM Art Stock"
      },
      {
        "label": "Standard Dimensions",
        "value": "89 × 54 mm (3.5 × 2 in)"
      },
      {
        "label": "Print Method",
        "value": "4-Colour Offset CMYK"
      },
      {
        "label": "Bleed Allowance",
        "value": "2 mm on all edges"
      },
      {
        "label": "Dispatch Schedule",
        "value": "2 Working Days"
      }
    ],
    "minOrderQty": 100,
    "turnaroundDays": 2,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.9,
    "reviewCount": 98,
    "faqs": [
      {
        "q": "What resolution should my artwork file have?",
        "a": "We recommend submitting vector PDFs or 300 DPI high-resolution CMYK files with 2 mm bleed margins."
      },
      {
        "q": "Can I print different names in a single order?",
        "a": "Multiple names require separate batches or our corporate stationery packs for bundled savings."
      },
      {
        "q": "Is same-day pickup available locally?",
        "a": "Yes, orders confirmed before 11:00 AM can be picked up at our our local store facility the same evening."
      }
    ],
    "relatedHandles": [
      "standard-visiting-cards",
      "rounded-corner-cards",
      "matte-laminated-cards",
      "spot-uv-cards"
    ],
    "highlights": [
      "Crisp high-resolution colour fidelity",
      "Protective moisture-resistant lamination",
      "Consistent hydraulic die-cut precision"
    ]
  },
  {
    "id": "prod-glossy-laminated-cards",
    "handle": "glossy-laminated-cards",
    "title": "Glossy Laminated Cards",
    "subtitle": "Premium 350 GSM stock, custom cut and finished for glossy laminated cards",
    "description": "Professional Glossy Laminated Cards crafted with high-definition CMYK printing. Designed for lasting impressions with clean edge trim and tactile finishing options.",
    "productType": "Visiting Cards",
    "categoryHandles": [
      "visiting-cards"
    ],
    "tags": [
      "glossy laminated cards",
      "visiting cards",
      "card"
    ],
    "badges": [],
    "images": [
      {
        "url": "",
        "altText": "Glossy Laminated Cards preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Glossy Laminated Cards detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Glossy Laminated Cards packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Paper",
        "values": [
          "300 GSM Art Card",
          "350 GSM Art Card",
          "400 GSM Super Premium"
        ]
      },
      {
        "name": "Finish",
        "values": [
          "Matte Lamination",
          "Gloss Lamination",
          "Soft Touch Velvet"
        ]
      },
      {
        "name": "Sides",
        "values": [
          "Single Side",
          "Both Sides"
        ]
      }
    ],
    "variants": [
      {
        "id": "glossy-laminated-cards-300-m",
        "title": "300 GSM / Matte",
        "sku": "VC-GLOS-300M",
        price: money(29900),
        compareAtPrice: money(39900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Paper",
            "value": "300 GSM Art Card"
          },
          {
            "name": "Finish",
            "value": "Matte Lamination"
          }
        ]
      },
      {
        "id": "glossy-laminated-cards-350-m",
        "title": "350 GSM / Matte",
        "sku": "VC-GLOS-350M",
        price: money(37400),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.25,
        "selectedOptions": [
          {
            "name": "Paper",
            "value": "350 GSM Art Card"
          },
          {
            "name": "Finish",
            "value": "Matte Lamination"
          }
        ]
      },
      {
        "id": "glossy-laminated-cards-400-v",
        "title": "400 GSM / Velvet",
        "sku": "VC-GLOS-400V",
        price: money(47800),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.6,
        "selectedOptions": [
          {
            "name": "Paper",
            "value": "400 GSM Super Premium"
          },
          {
            "name": "Finish",
            "value": "Soft Touch Velvet"
          }
        ]
      }
    ],
    priceFrom: money(29900),
    compareAtFrom: money(39900),
    "quantityTiers": [
      {
        "qty": 100,
        price: money(29900),
        compareAtPrice: money(39900)
      },
      {
        "qty": 250,
        price: money(62800)
      },
      {
        "qty": 500,
        price: money(107600),
        "note": "Popular"
      },
      {
        "qty": 1000,
        price: money(185400),
        "note": "Best Value"
      }
    ],
    "priceUnit": "per 100 cards",
    "specs": [
      {
        "label": "Paper Weight",
        "value": "300 - 400 GSM Art Stock"
      },
      {
        "label": "Standard Dimensions",
        "value": "89 × 54 mm (3.5 × 2 in)"
      },
      {
        "label": "Print Method",
        "value": "4-Colour Offset CMYK"
      },
      {
        "label": "Bleed Allowance",
        "value": "2 mm on all edges"
      },
      {
        "label": "Dispatch Schedule",
        "value": "2 Working Days"
      }
    ],
    "minOrderQty": 100,
    "turnaroundDays": 2,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.9,
    "reviewCount": 610,
    "faqs": [
      {
        "q": "What resolution should my artwork file have?",
        "a": "We recommend submitting vector PDFs or 300 DPI high-resolution CMYK files with 2 mm bleed margins."
      },
      {
        "q": "Can I print different names in a single order?",
        "a": "Multiple names require separate batches or our corporate stationery packs for bundled savings."
      },
      {
        "q": "Is same-day pickup available locally?",
        "a": "Yes, orders confirmed before 11:00 AM can be picked up at our our local store facility the same evening."
      }
    ],
    "relatedHandles": [
      "standard-visiting-cards",
      "rounded-corner-cards",
      "matte-laminated-cards",
      "spot-uv-cards"
    ],
    "highlights": [
      "Crisp high-resolution colour fidelity",
      "Protective moisture-resistant lamination",
      "Consistent hydraulic die-cut precision"
    ]
  },
  {
    "id": "prod-qr-code-cards",
    "handle": "qr-code-cards",
    "title": "QR-Code Cards",
    "subtitle": "Premium 350 GSM stock, custom cut and finished for qr-code cards",
    "description": "Professional QR-Code Cards crafted with high-definition CMYK printing. Designed for lasting impressions with clean edge trim and tactile finishing options.",
    "productType": "Visiting Cards",
    "categoryHandles": [
      "visiting-cards"
    ],
    "tags": [
      "qr-code cards",
      "visiting cards",
      "card",
      "recommended"
    ],
    "badges": [
      "recommended"
    ],
    "images": [
      {
        "url": "",
        "altText": "QR-Code Cards preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "QR-Code Cards detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "QR-Code Cards packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Paper",
        "values": [
          "300 GSM Art Card",
          "350 GSM Art Card",
          "400 GSM Super Premium"
        ]
      },
      {
        "name": "Finish",
        "values": [
          "Matte Lamination",
          "Gloss Lamination",
          "Soft Touch Velvet"
        ]
      },
      {
        "name": "Sides",
        "values": [
          "Single Side",
          "Both Sides"
        ]
      }
    ],
    "variants": [
      {
        "id": "qr-code-cards-300-m",
        "title": "300 GSM / Matte",
        "sku": "VC-QR-C-300M",
        price: money(29900),
        compareAtPrice: money(39900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Paper",
            "value": "300 GSM Art Card"
          },
          {
            "name": "Finish",
            "value": "Matte Lamination"
          }
        ]
      },
      {
        "id": "qr-code-cards-350-m",
        "title": "350 GSM / Matte",
        "sku": "VC-QR-C-350M",
        price: money(37400),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.25,
        "selectedOptions": [
          {
            "name": "Paper",
            "value": "350 GSM Art Card"
          },
          {
            "name": "Finish",
            "value": "Matte Lamination"
          }
        ]
      },
      {
        "id": "qr-code-cards-400-v",
        "title": "400 GSM / Velvet",
        "sku": "VC-QR-C-400V",
        price: money(47800),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.6,
        "selectedOptions": [
          {
            "name": "Paper",
            "value": "400 GSM Super Premium"
          },
          {
            "name": "Finish",
            "value": "Soft Touch Velvet"
          }
        ]
      }
    ],
    priceFrom: money(29900),
    compareAtFrom: money(39900),
    "quantityTiers": [
      {
        "qty": 100,
        price: money(29900),
        compareAtPrice: money(39900)
      },
      {
        "qty": 250,
        price: money(62800)
      },
      {
        "qty": 500,
        price: money(107600),
        "note": "Popular"
      },
      {
        "qty": 1000,
        price: money(185400),
        "note": "Best Value"
      }
    ],
    "priceUnit": "per 100 cards",
    "specs": [
      {
        "label": "Paper Weight",
        "value": "300 - 400 GSM Art Stock"
      },
      {
        "label": "Standard Dimensions",
        "value": "89 × 54 mm (3.5 × 2 in)"
      },
      {
        "label": "Print Method",
        "value": "4-Colour Offset CMYK"
      },
      {
        "label": "Bleed Allowance",
        "value": "2 mm on all edges"
      },
      {
        "label": "Dispatch Schedule",
        "value": "2 Working Days"
      }
    ],
    "minOrderQty": 100,
    "turnaroundDays": 2,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.9,
    "reviewCount": 576,
    "faqs": [
      {
        "q": "What resolution should my artwork file have?",
        "a": "We recommend submitting vector PDFs or 300 DPI high-resolution CMYK files with 2 mm bleed margins."
      },
      {
        "q": "Can I print different names in a single order?",
        "a": "Multiple names require separate batches or our corporate stationery packs for bundled savings."
      },
      {
        "q": "Is same-day pickup available locally?",
        "a": "Yes, orders confirmed before 11:00 AM can be picked up at our our local store facility the same evening."
      }
    ],
    "relatedHandles": [
      "standard-visiting-cards",
      "rounded-corner-cards",
      "matte-laminated-cards",
      "spot-uv-cards"
    ],
    "highlights": [
      "Crisp high-resolution colour fidelity",
      "Protective moisture-resistant lamination",
      "Consistent hydraulic die-cut precision"
    ]
  },
  {
    "id": "prod-business-stationery-combos",
    "handle": "business-stationery-combos",
    "title": "Stationery Combos",
    "subtitle": "Premium 350 GSM stock, custom cut and finished for stationery combos",
    "description": "Professional Stationery Combos crafted with high-definition CMYK printing. Designed for lasting impressions with clean edge trim and tactile finishing options.",
    "productType": "Visiting Cards",
    "categoryHandles": [
      "visiting-cards"
    ],
    "tags": [
      "stationery combos",
      "visiting cards",
      "generic",
      "bulk-saver"
    ],
    "badges": [
      "bulk-saver"
    ],
    "images": [
      {
        "url": "",
        "altText": "Stationery Combos preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "generic",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Stationery Combos detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "generic",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Stationery Combos packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "generic",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Paper",
        "values": [
          "300 GSM Art Card",
          "350 GSM Art Card",
          "400 GSM Super Premium"
        ]
      },
      {
        "name": "Finish",
        "values": [
          "Matte Lamination",
          "Gloss Lamination",
          "Soft Touch Velvet"
        ]
      },
      {
        "name": "Sides",
        "values": [
          "Single Side",
          "Both Sides"
        ]
      }
    ],
    "variants": [
      {
        "id": "business-stationery-combos-300-m",
        "title": "300 GSM / Matte",
        "sku": "VC-BUSI-300M",
        price: money(29900),
        compareAtPrice: money(39900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Paper",
            "value": "300 GSM Art Card"
          },
          {
            "name": "Finish",
            "value": "Matte Lamination"
          }
        ]
      },
      {
        "id": "business-stationery-combos-350-m",
        "title": "350 GSM / Matte",
        "sku": "VC-BUSI-350M",
        price: money(37400),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.25,
        "selectedOptions": [
          {
            "name": "Paper",
            "value": "350 GSM Art Card"
          },
          {
            "name": "Finish",
            "value": "Matte Lamination"
          }
        ]
      },
      {
        "id": "business-stationery-combos-400-v",
        "title": "400 GSM / Velvet",
        "sku": "VC-BUSI-400V",
        price: money(47800),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.6,
        "selectedOptions": [
          {
            "name": "Paper",
            "value": "400 GSM Super Premium"
          },
          {
            "name": "Finish",
            "value": "Soft Touch Velvet"
          }
        ]
      }
    ],
    priceFrom: money(29900),
    compareAtFrom: money(39900),
    "quantityTiers": [
      {
        "qty": 100,
        price: money(29900),
        compareAtPrice: money(39900)
      },
      {
        "qty": 250,
        price: money(62800)
      },
      {
        "qty": 500,
        price: money(107600),
        "note": "Popular"
      },
      {
        "qty": 1000,
        price: money(185400),
        "note": "Best Value"
      }
    ],
    "priceUnit": "per 100 cards",
    "specs": [
      {
        "label": "Paper Weight",
        "value": "300 - 400 GSM Art Stock"
      },
      {
        "label": "Standard Dimensions",
        "value": "89 × 54 mm (3.5 × 2 in)"
      },
      {
        "label": "Print Method",
        "value": "4-Colour Offset CMYK"
      },
      {
        "label": "Bleed Allowance",
        "value": "2 mm on all edges"
      },
      {
        "label": "Dispatch Schedule",
        "value": "2 Working Days"
      }
    ],
    "minOrderQty": 100,
    "turnaroundDays": 2,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.7,
    "reviewCount": 284,
    "faqs": [
      {
        "q": "What resolution should my artwork file have?",
        "a": "We recommend submitting vector PDFs or 300 DPI high-resolution CMYK files with 2 mm bleed margins."
      },
      {
        "q": "Can I print different names in a single order?",
        "a": "Multiple names require separate batches or our corporate stationery packs for bundled savings."
      },
      {
        "q": "Is same-day pickup available locally?",
        "a": "Yes, orders confirmed before 11:00 AM can be picked up at our our local store facility the same evening."
      }
    ],
    "relatedHandles": [
      "standard-visiting-cards",
      "rounded-corner-cards",
      "matte-laminated-cards",
      "spot-uv-cards"
    ],
    "highlights": [
      "Crisp high-resolution colour fidelity",
      "Protective moisture-resistant lamination",
      "Consistent hydraulic die-cut precision"
    ]
  }
];
