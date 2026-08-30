import { money, type Product } from "@/lib/commerce/types";

export const packagingProducts: Product[] = [
  {
    "id": "prod-circle-stickers",
    "handle": "circle-stickers",
    "title": "Circle Stickers",
    "subtitle": "Die-cut labels, stickers, and custom boxes for retail and ecommerce",
    "description": "Upgrade your unboxing experience with custom Circle Stickers. Precision cut contours, waterproof vinyl, and sturdy corrugated materials.",
    "productType": "Labels & Packaging",
    "categoryHandles": [
      "same-day",
      "labels-packaging"
    ],
    "tags": [
      "circle stickers",
      "labels & packaging",
      "sticker",
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
        "altText": "Circle Stickers preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "sticker",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Circle Stickers detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "sticker",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Circle Stickers packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "sticker",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Material",
        "values": [
          "Glossy Vinyl",
          "Matte Paper",
          "Transparent Vinyl"
        ]
      },
      {
        "name": "Cut Style",
        "values": [
          "Kiss Cut Sheet",
          "Individual Die Cut"
        ]
      }
    ],
    "variants": [
      {
        "id": "circle-stickers-vin-gloss",
        "title": "Glossy Vinyl / Kiss Cut",
        "sku": "PKG-CIRC-VG",
        price: money(34900),
        compareAtPrice: money(44900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Material",
            "value": "Glossy Vinyl"
          },
          {
            "name": "Cut Style",
            "value": "Kiss Cut Sheet"
          }
        ]
      },
      {
        "id": "circle-stickers-vin-matte",
        "title": "Matte Paper / Die Cut",
        "sku": "PKG-CIRC-PM",
        price: money(40100),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.15,
        "selectedOptions": [
          {
            "name": "Material",
            "value": "Matte Paper"
          },
          {
            "name": "Cut Style",
            "value": "Individual Die Cut"
          }
        ]
      }
    ],
    priceFrom: money(34900),
    compareAtFrom: money(44900),
    "quantityTiers": [
      {
        "qty": 100,
        price: money(34900),
        compareAtPrice: money(44900)
      },
      {
        "qty": 300,
        price: money(87300)
      },
      {
        "qty": 1000,
        price: money(244300),
        "note": "Production Tier"
      }
    ],
    "priceUnit": "per 100 stickers",
    "specs": [
      {
        "label": "Adhesive Type",
        "value": "High-Tack Permanent Acrylic"
      },
      {
        "label": "Water Resistance",
        "value": "100% Waterproof on Vinyl grades"
      },
      {
        "label": "Cut Accuracy",
        "value": "±0.5 mm CNC digital blade"
      },
      {
        "label": "Supplied As",
        "value": "Individual cut or A4 gang sheets"
      }
    ],
    "minOrderQty": 100,
    "turnaroundDays": 1,
    "sameDayEligible": true,
    "customizable": true,
    "rating": 4.9,
    "reviewCount": 72,
    "faqs": [
      {
        "q": "Are these stickers suitable for refrigerated beverage bottles?",
        "a": "Yes, our waterproof vinyl labels resist condensation, refrigeration, and ice bucket immersion."
      },
      {
        "q": "Do you charge extra for custom contour shapes?",
        "a": "No, digital CNC cutting allows custom contour shapes without any additional die fee."
      },
      {
        "q": "What file format do I need for die-cut outlines?",
        "a": "Provide a vector cut path in a dedicated spot color or vector layer in PDF/AI format."
      }
    ],
    "relatedHandles": [
      "product-packaging-labels",
      "personalised-tote-bags",
      "flat-mailer-boxes",
      "square-stickers"
    ],
    "highlights": [
      "Waterproof, oil-proof, and tear-resistant vinyl options",
      "Custom contour cutting to any shape without die tooling charges",
      "Strong adhesive suitable for glass, cardboard, plastic, and metal"
    ]
  },
  {
    "id": "prod-product-packaging-labels",
    "handle": "product-packaging-labels",
    "title": "Product Packaging Labels",
    "subtitle": "Die-cut labels, stickers, and custom boxes for retail and ecommerce",
    "description": "Upgrade your unboxing experience with custom Product Packaging Labels. Precision cut contours, waterproof vinyl, and sturdy corrugated materials.",
    "productType": "Labels & Packaging",
    "categoryHandles": [
      "labels-packaging"
    ],
    "tags": [
      "product packaging labels",
      "labels & packaging",
      "label",
      "popular"
    ],
    "badges": [
      "popular"
    ],
    "images": [
      {
        "url": "",
        "altText": "Product Packaging Labels preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "label",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Product Packaging Labels detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "label",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Product Packaging Labels packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "label",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Material",
        "values": [
          "Glossy Vinyl",
          "Matte Paper",
          "Transparent Vinyl"
        ]
      },
      {
        "name": "Cut Style",
        "values": [
          "Kiss Cut Sheet",
          "Individual Die Cut"
        ]
      }
    ],
    "variants": [
      {
        "id": "product-packaging-labels-vin-gloss",
        "title": "Glossy Vinyl / Kiss Cut",
        "sku": "PKG-PROD-VG",
        price: money(34900),
        compareAtPrice: money(44900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Material",
            "value": "Glossy Vinyl"
          },
          {
            "name": "Cut Style",
            "value": "Kiss Cut Sheet"
          }
        ]
      },
      {
        "id": "product-packaging-labels-vin-matte",
        "title": "Matte Paper / Die Cut",
        "sku": "PKG-PROD-PM",
        price: money(40100),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.15,
        "selectedOptions": [
          {
            "name": "Material",
            "value": "Matte Paper"
          },
          {
            "name": "Cut Style",
            "value": "Individual Die Cut"
          }
        ]
      }
    ],
    priceFrom: money(34900),
    compareAtFrom: money(44900),
    "quantityTiers": [
      {
        "qty": 100,
        price: money(34900),
        compareAtPrice: money(44900)
      },
      {
        "qty": 300,
        price: money(87300)
      },
      {
        "qty": 1000,
        price: money(244300),
        "note": "Production Tier"
      }
    ],
    "priceUnit": "per 100 stickers",
    "specs": [
      {
        "label": "Adhesive Type",
        "value": "High-Tack Permanent Acrylic"
      },
      {
        "label": "Water Resistance",
        "value": "100% Waterproof on Vinyl grades"
      },
      {
        "label": "Cut Accuracy",
        "value": "±0.5 mm CNC digital blade"
      },
      {
        "label": "Supplied As",
        "value": "Individual cut or A4 gang sheets"
      }
    ],
    "minOrderQty": 100,
    "turnaroundDays": 3,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.7,
    "reviewCount": 304,
    "faqs": [
      {
        "q": "Are these stickers suitable for refrigerated beverage bottles?",
        "a": "Yes, our waterproof vinyl labels resist condensation, refrigeration, and ice bucket immersion."
      },
      {
        "q": "Do you charge extra for custom contour shapes?",
        "a": "No, digital CNC cutting allows custom contour shapes without any additional die fee."
      },
      {
        "q": "What file format do I need for die-cut outlines?",
        "a": "Provide a vector cut path in a dedicated spot color or vector layer in PDF/AI format."
      }
    ],
    "relatedHandles": [
      "circle-stickers",
      "personalised-tote-bags",
      "flat-mailer-boxes",
      "square-stickers"
    ],
    "highlights": [
      "Waterproof, oil-proof, and tear-resistant vinyl options",
      "Custom contour cutting to any shape without die tooling charges",
      "Strong adhesive suitable for glass, cardboard, plastic, and metal"
    ]
  },
  {
    "id": "prod-personalised-tote-bags",
    "handle": "personalised-tote-bags",
    "title": "Personalised Tote Bags",
    "subtitle": "Die-cut labels, stickers, and custom boxes for retail and ecommerce",
    "description": "Upgrade your unboxing experience with custom Personalised Tote Bags. Precision cut contours, waterproof vinyl, and sturdy corrugated materials.",
    "productType": "Labels & Packaging",
    "categoryHandles": [
      "labels-packaging"
    ],
    "tags": [
      "personalised tote bags",
      "labels & packaging",
      "tote",
      "popular"
    ],
    "badges": [
      "popular"
    ],
    "images": [
      {
        "url": "",
        "altText": "Personalised Tote Bags preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "tote",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Personalised Tote Bags detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "tote",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Personalised Tote Bags packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "tote",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Material",
        "values": [
          "Glossy Vinyl",
          "Matte Paper",
          "Transparent Vinyl"
        ]
      },
      {
        "name": "Cut Style",
        "values": [
          "Kiss Cut Sheet",
          "Individual Die Cut"
        ]
      }
    ],
    "variants": [
      {
        "id": "personalised-tote-bags-vin-gloss",
        "title": "Glossy Vinyl / Kiss Cut",
        "sku": "PKG-PERS-VG",
        price: money(99900),
        compareAtPrice: money(129900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Material",
            "value": "Glossy Vinyl"
          },
          {
            "name": "Cut Style",
            "value": "Kiss Cut Sheet"
          }
        ]
      },
      {
        "id": "personalised-tote-bags-vin-matte",
        "title": "Matte Paper / Die Cut",
        "sku": "PKG-PERS-PM",
        price: money(114900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.15,
        "selectedOptions": [
          {
            "name": "Material",
            "value": "Matte Paper"
          },
          {
            "name": "Cut Style",
            "value": "Individual Die Cut"
          }
        ]
      }
    ],
    priceFrom: money(99900),
    compareAtFrom: money(129900),
    "quantityTiers": [
      {
        "qty": 25,
        price: money(99900),
        compareAtPrice: money(129900)
      },
      {
        "qty": 75,
        price: money(249800)
      },
      {
        "qty": 250,
        price: money(699300),
        "note": "Production Tier"
      }
    ],
    "priceUnit": "per 25 units",
    "specs": [
      {
        "label": "Adhesive Type",
        "value": "High-Tack Permanent Acrylic"
      },
      {
        "label": "Water Resistance",
        "value": "100% Waterproof on Vinyl grades"
      },
      {
        "label": "Cut Accuracy",
        "value": "±0.5 mm CNC digital blade"
      },
      {
        "label": "Supplied As",
        "value": "Individual cut or A4 gang sheets"
      }
    ],
    "minOrderQty": 25,
    "turnaroundDays": 3,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.6,
    "reviewCount": 393,
    "faqs": [
      {
        "q": "Are these stickers suitable for refrigerated beverage bottles?",
        "a": "Yes, our waterproof vinyl labels resist condensation, refrigeration, and ice bucket immersion."
      },
      {
        "q": "Do you charge extra for custom contour shapes?",
        "a": "No, digital CNC cutting allows custom contour shapes without any additional die fee."
      },
      {
        "q": "What file format do I need for die-cut outlines?",
        "a": "Provide a vector cut path in a dedicated spot color or vector layer in PDF/AI format."
      }
    ],
    "relatedHandles": [
      "circle-stickers",
      "product-packaging-labels",
      "flat-mailer-boxes",
      "square-stickers"
    ],
    "highlights": [
      "Waterproof, oil-proof, and tear-resistant vinyl options",
      "Custom contour cutting to any shape without die tooling charges",
      "Strong adhesive suitable for glass, cardboard, plastic, and metal"
    ]
  },
  {
    "id": "prod-flat-mailer-boxes",
    "handle": "flat-mailer-boxes",
    "title": "Flat Mailer Boxes",
    "subtitle": "Die-cut labels, stickers, and custom boxes for retail and ecommerce",
    "description": "Upgrade your unboxing experience with custom Flat Mailer Boxes. Precision cut contours, waterproof vinyl, and sturdy corrugated materials.",
    "productType": "Labels & Packaging",
    "categoryHandles": [
      "labels-packaging"
    ],
    "tags": [
      "flat mailer boxes",
      "labels & packaging",
      "box",
      "recommended"
    ],
    "badges": [
      "recommended"
    ],
    "images": [
      {
        "url": "",
        "altText": "Flat Mailer Boxes preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "box",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Flat Mailer Boxes detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "box",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Flat Mailer Boxes packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "box",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Material",
        "values": [
          "Glossy Vinyl",
          "Matte Paper",
          "Transparent Vinyl"
        ]
      },
      {
        "name": "Cut Style",
        "values": [
          "Kiss Cut Sheet",
          "Individual Die Cut"
        ]
      }
    ],
    "variants": [
      {
        "id": "flat-mailer-boxes-vin-gloss",
        "title": "Glossy Vinyl / Kiss Cut",
        "sku": "PKG-FLAT-VG",
        price: money(99900),
        compareAtPrice: money(129900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Material",
            "value": "Glossy Vinyl"
          },
          {
            "name": "Cut Style",
            "value": "Kiss Cut Sheet"
          }
        ]
      },
      {
        "id": "flat-mailer-boxes-vin-matte",
        "title": "Matte Paper / Die Cut",
        "sku": "PKG-FLAT-PM",
        price: money(114900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.15,
        "selectedOptions": [
          {
            "name": "Material",
            "value": "Matte Paper"
          },
          {
            "name": "Cut Style",
            "value": "Individual Die Cut"
          }
        ]
      }
    ],
    priceFrom: money(99900),
    compareAtFrom: money(129900),
    "quantityTiers": [
      {
        "qty": 25,
        price: money(99900),
        compareAtPrice: money(129900)
      },
      {
        "qty": 75,
        price: money(249800)
      },
      {
        "qty": 250,
        price: money(699300),
        "note": "Production Tier"
      }
    ],
    "priceUnit": "per 25 units",
    "specs": [
      {
        "label": "Adhesive Type",
        "value": "High-Tack Permanent Acrylic"
      },
      {
        "label": "Water Resistance",
        "value": "100% Waterproof on Vinyl grades"
      },
      {
        "label": "Cut Accuracy",
        "value": "±0.5 mm CNC digital blade"
      },
      {
        "label": "Supplied As",
        "value": "Individual cut or A4 gang sheets"
      }
    ],
    "minOrderQty": 25,
    "turnaroundDays": 3,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.6,
    "reviewCount": 591,
    "faqs": [
      {
        "q": "Are these stickers suitable for refrigerated beverage bottles?",
        "a": "Yes, our waterproof vinyl labels resist condensation, refrigeration, and ice bucket immersion."
      },
      {
        "q": "Do you charge extra for custom contour shapes?",
        "a": "No, digital CNC cutting allows custom contour shapes without any additional die fee."
      },
      {
        "q": "What file format do I need for die-cut outlines?",
        "a": "Provide a vector cut path in a dedicated spot color or vector layer in PDF/AI format."
      }
    ],
    "relatedHandles": [
      "circle-stickers",
      "product-packaging-labels",
      "personalised-tote-bags",
      "square-stickers"
    ],
    "highlights": [
      "Waterproof, oil-proof, and tear-resistant vinyl options",
      "Custom contour cutting to any shape without die tooling charges",
      "Strong adhesive suitable for glass, cardboard, plastic, and metal"
    ]
  },
  {
    "id": "prod-square-stickers",
    "handle": "square-stickers",
    "title": "Square Stickers",
    "subtitle": "Die-cut labels, stickers, and custom boxes for retail and ecommerce",
    "description": "Upgrade your unboxing experience with custom Square Stickers. Precision cut contours, waterproof vinyl, and sturdy corrugated materials.",
    "productType": "Labels & Packaging",
    "categoryHandles": [
      "labels-packaging"
    ],
    "tags": [
      "square stickers",
      "labels & packaging",
      "sticker"
    ],
    "badges": [],
    "images": [
      {
        "url": "",
        "altText": "Square Stickers preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "sticker",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Square Stickers detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "sticker",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Square Stickers packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "sticker",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Material",
        "values": [
          "Glossy Vinyl",
          "Matte Paper",
          "Transparent Vinyl"
        ]
      },
      {
        "name": "Cut Style",
        "values": [
          "Kiss Cut Sheet",
          "Individual Die Cut"
        ]
      }
    ],
    "variants": [
      {
        "id": "square-stickers-vin-gloss",
        "title": "Glossy Vinyl / Kiss Cut",
        "sku": "PKG-SQUA-VG",
        price: money(34900),
        compareAtPrice: money(44900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Material",
            "value": "Glossy Vinyl"
          },
          {
            "name": "Cut Style",
            "value": "Kiss Cut Sheet"
          }
        ]
      },
      {
        "id": "square-stickers-vin-matte",
        "title": "Matte Paper / Die Cut",
        "sku": "PKG-SQUA-PM",
        price: money(40100),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.15,
        "selectedOptions": [
          {
            "name": "Material",
            "value": "Matte Paper"
          },
          {
            "name": "Cut Style",
            "value": "Individual Die Cut"
          }
        ]
      }
    ],
    priceFrom: money(34900),
    compareAtFrom: money(44900),
    "quantityTiers": [
      {
        "qty": 100,
        price: money(34900),
        compareAtPrice: money(44900)
      },
      {
        "qty": 300,
        price: money(87300)
      },
      {
        "qty": 1000,
        price: money(244300),
        "note": "Production Tier"
      }
    ],
    "priceUnit": "per 100 stickers",
    "specs": [
      {
        "label": "Adhesive Type",
        "value": "High-Tack Permanent Acrylic"
      },
      {
        "label": "Water Resistance",
        "value": "100% Waterproof on Vinyl grades"
      },
      {
        "label": "Cut Accuracy",
        "value": "±0.5 mm CNC digital blade"
      },
      {
        "label": "Supplied As",
        "value": "Individual cut or A4 gang sheets"
      }
    ],
    "minOrderQty": 100,
    "turnaroundDays": 3,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.8,
    "reviewCount": 653,
    "faqs": [
      {
        "q": "Are these stickers suitable for refrigerated beverage bottles?",
        "a": "Yes, our waterproof vinyl labels resist condensation, refrigeration, and ice bucket immersion."
      },
      {
        "q": "Do you charge extra for custom contour shapes?",
        "a": "No, digital CNC cutting allows custom contour shapes without any additional die fee."
      },
      {
        "q": "What file format do I need for die-cut outlines?",
        "a": "Provide a vector cut path in a dedicated spot color or vector layer in PDF/AI format."
      }
    ],
    "relatedHandles": [
      "circle-stickers",
      "product-packaging-labels",
      "personalised-tote-bags",
      "flat-mailer-boxes"
    ],
    "highlights": [
      "Waterproof, oil-proof, and tear-resistant vinyl options",
      "Custom contour cutting to any shape without die tooling charges",
      "Strong adhesive suitable for glass, cardboard, plastic, and metal"
    ]
  },
  {
    "id": "prod-custom-die-cut-stickers",
    "handle": "custom-die-cut-stickers",
    "title": "Custom Die-Cut Stickers",
    "subtitle": "Die-cut labels, stickers, and custom boxes for retail and ecommerce",
    "description": "Upgrade your unboxing experience with custom Custom Die-Cut Stickers. Precision cut contours, waterproof vinyl, and sturdy corrugated materials.",
    "productType": "Labels & Packaging",
    "categoryHandles": [
      "labels-packaging"
    ],
    "tags": [
      "custom die-cut stickers",
      "labels & packaging",
      "sticker",
      "new"
    ],
    "badges": [
      "new"
    ],
    "images": [
      {
        "url": "",
        "altText": "Custom Die-Cut Stickers preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "sticker",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Custom Die-Cut Stickers detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "sticker",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Custom Die-Cut Stickers packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "sticker",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Material",
        "values": [
          "Glossy Vinyl",
          "Matte Paper",
          "Transparent Vinyl"
        ]
      },
      {
        "name": "Cut Style",
        "values": [
          "Kiss Cut Sheet",
          "Individual Die Cut"
        ]
      }
    ],
    "variants": [
      {
        "id": "custom-die-cut-stickers-vin-gloss",
        "title": "Glossy Vinyl / Kiss Cut",
        "sku": "PKG-CUST-VG",
        price: money(34900),
        compareAtPrice: money(44900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Material",
            "value": "Glossy Vinyl"
          },
          {
            "name": "Cut Style",
            "value": "Kiss Cut Sheet"
          }
        ]
      },
      {
        "id": "custom-die-cut-stickers-vin-matte",
        "title": "Matte Paper / Die Cut",
        "sku": "PKG-CUST-PM",
        price: money(40100),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.15,
        "selectedOptions": [
          {
            "name": "Material",
            "value": "Matte Paper"
          },
          {
            "name": "Cut Style",
            "value": "Individual Die Cut"
          }
        ]
      }
    ],
    priceFrom: money(34900),
    compareAtFrom: money(44900),
    "quantityTiers": [
      {
        "qty": 100,
        price: money(34900),
        compareAtPrice: money(44900)
      },
      {
        "qty": 300,
        price: money(87300)
      },
      {
        "qty": 1000,
        price: money(244300),
        "note": "Production Tier"
      }
    ],
    "priceUnit": "per 100 stickers",
    "specs": [
      {
        "label": "Adhesive Type",
        "value": "High-Tack Permanent Acrylic"
      },
      {
        "label": "Water Resistance",
        "value": "100% Waterproof on Vinyl grades"
      },
      {
        "label": "Cut Accuracy",
        "value": "±0.5 mm CNC digital blade"
      },
      {
        "label": "Supplied As",
        "value": "Individual cut or A4 gang sheets"
      }
    ],
    "minOrderQty": 100,
    "turnaroundDays": 3,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.6,
    "reviewCount": 425,
    "faqs": [
      {
        "q": "Are these stickers suitable for refrigerated beverage bottles?",
        "a": "Yes, our waterproof vinyl labels resist condensation, refrigeration, and ice bucket immersion."
      },
      {
        "q": "Do you charge extra for custom contour shapes?",
        "a": "No, digital CNC cutting allows custom contour shapes without any additional die fee."
      },
      {
        "q": "What file format do I need for die-cut outlines?",
        "a": "Provide a vector cut path in a dedicated spot color or vector layer in PDF/AI format."
      }
    ],
    "relatedHandles": [
      "circle-stickers",
      "product-packaging-labels",
      "personalised-tote-bags",
      "flat-mailer-boxes"
    ],
    "highlights": [
      "Waterproof, oil-proof, and tear-resistant vinyl options",
      "Custom contour cutting to any shape without die tooling charges",
      "Strong adhesive suitable for glass, cardboard, plastic, and metal"
    ]
  },
  {
    "id": "prod-sticker-sheets",
    "handle": "sticker-sheets",
    "title": "Sticker Sheets",
    "subtitle": "Die-cut labels, stickers, and custom boxes for retail and ecommerce",
    "description": "Upgrade your unboxing experience with custom Sticker Sheets. Precision cut contours, waterproof vinyl, and sturdy corrugated materials.",
    "productType": "Labels & Packaging",
    "categoryHandles": [
      "labels-packaging"
    ],
    "tags": [
      "sticker sheets",
      "labels & packaging",
      "sticker-sheet"
    ],
    "badges": [],
    "images": [
      {
        "url": "",
        "altText": "Sticker Sheets preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "sticker-sheet",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Sticker Sheets detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "sticker-sheet",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Sticker Sheets packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "sticker-sheet",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Material",
        "values": [
          "Glossy Vinyl",
          "Matte Paper",
          "Transparent Vinyl"
        ]
      },
      {
        "name": "Cut Style",
        "values": [
          "Kiss Cut Sheet",
          "Individual Die Cut"
        ]
      }
    ],
    "variants": [
      {
        "id": "sticker-sheets-vin-gloss",
        "title": "Glossy Vinyl / Kiss Cut",
        "sku": "PKG-STIC-VG",
        price: money(34900),
        compareAtPrice: money(44900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Material",
            "value": "Glossy Vinyl"
          },
          {
            "name": "Cut Style",
            "value": "Kiss Cut Sheet"
          }
        ]
      },
      {
        "id": "sticker-sheets-vin-matte",
        "title": "Matte Paper / Die Cut",
        "sku": "PKG-STIC-PM",
        price: money(40100),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.15,
        "selectedOptions": [
          {
            "name": "Material",
            "value": "Matte Paper"
          },
          {
            "name": "Cut Style",
            "value": "Individual Die Cut"
          }
        ]
      }
    ],
    priceFrom: money(34900),
    compareAtFrom: money(44900),
    "quantityTiers": [
      {
        "qty": 100,
        price: money(34900),
        compareAtPrice: money(44900)
      },
      {
        "qty": 300,
        price: money(87300)
      },
      {
        "qty": 1000,
        price: money(244300),
        "note": "Production Tier"
      }
    ],
    "priceUnit": "per 100 stickers",
    "specs": [
      {
        "label": "Adhesive Type",
        "value": "High-Tack Permanent Acrylic"
      },
      {
        "label": "Water Resistance",
        "value": "100% Waterproof on Vinyl grades"
      },
      {
        "label": "Cut Accuracy",
        "value": "±0.5 mm CNC digital blade"
      },
      {
        "label": "Supplied As",
        "value": "Individual cut or A4 gang sheets"
      }
    ],
    "minOrderQty": 100,
    "turnaroundDays": 3,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.6,
    "reviewCount": 479,
    "faqs": [
      {
        "q": "Are these stickers suitable for refrigerated beverage bottles?",
        "a": "Yes, our waterproof vinyl labels resist condensation, refrigeration, and ice bucket immersion."
      },
      {
        "q": "Do you charge extra for custom contour shapes?",
        "a": "No, digital CNC cutting allows custom contour shapes without any additional die fee."
      },
      {
        "q": "What file format do I need for die-cut outlines?",
        "a": "Provide a vector cut path in a dedicated spot color or vector layer in PDF/AI format."
      }
    ],
    "relatedHandles": [
      "circle-stickers",
      "product-packaging-labels",
      "personalised-tote-bags",
      "flat-mailer-boxes"
    ],
    "highlights": [
      "Waterproof, oil-proof, and tear-resistant vinyl options",
      "Custom contour cutting to any shape without die tooling charges",
      "Strong adhesive suitable for glass, cardboard, plastic, and metal"
    ]
  },
  {
    "id": "prod-rectangle-hang-tags",
    "handle": "rectangle-hang-tags",
    "title": "Rectangle Hang Tags",
    "subtitle": "Die-cut labels, stickers, and custom boxes for retail and ecommerce",
    "description": "Upgrade your unboxing experience with custom Rectangle Hang Tags. Precision cut contours, waterproof vinyl, and sturdy corrugated materials.",
    "productType": "Labels & Packaging",
    "categoryHandles": [
      "labels-packaging"
    ],
    "tags": [
      "rectangle hang tags",
      "labels & packaging",
      "hangtag"
    ],
    "badges": [],
    "images": [
      {
        "url": "",
        "altText": "Rectangle Hang Tags preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "hangtag",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Rectangle Hang Tags detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "hangtag",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Rectangle Hang Tags packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "hangtag",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Material",
        "values": [
          "Glossy Vinyl",
          "Matte Paper",
          "Transparent Vinyl"
        ]
      },
      {
        "name": "Cut Style",
        "values": [
          "Kiss Cut Sheet",
          "Individual Die Cut"
        ]
      }
    ],
    "variants": [
      {
        "id": "rectangle-hang-tags-vin-gloss",
        "title": "Glossy Vinyl / Kiss Cut",
        "sku": "PKG-RECT-VG",
        price: money(34900),
        compareAtPrice: money(44900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Material",
            "value": "Glossy Vinyl"
          },
          {
            "name": "Cut Style",
            "value": "Kiss Cut Sheet"
          }
        ]
      },
      {
        "id": "rectangle-hang-tags-vin-matte",
        "title": "Matte Paper / Die Cut",
        "sku": "PKG-RECT-PM",
        price: money(40100),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.15,
        "selectedOptions": [
          {
            "name": "Material",
            "value": "Matte Paper"
          },
          {
            "name": "Cut Style",
            "value": "Individual Die Cut"
          }
        ]
      }
    ],
    priceFrom: money(34900),
    compareAtFrom: money(44900),
    "quantityTiers": [
      {
        "qty": 100,
        price: money(34900),
        compareAtPrice: money(44900)
      },
      {
        "qty": 300,
        price: money(87300)
      },
      {
        "qty": 1000,
        price: money(244300),
        "note": "Production Tier"
      }
    ],
    "priceUnit": "per 100 stickers",
    "specs": [
      {
        "label": "Adhesive Type",
        "value": "High-Tack Permanent Acrylic"
      },
      {
        "label": "Water Resistance",
        "value": "100% Waterproof on Vinyl grades"
      },
      {
        "label": "Cut Accuracy",
        "value": "±0.5 mm CNC digital blade"
      },
      {
        "label": "Supplied As",
        "value": "Individual cut or A4 gang sheets"
      }
    ],
    "minOrderQty": 100,
    "turnaroundDays": 3,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.6,
    "reviewCount": 123,
    "faqs": [
      {
        "q": "Are these stickers suitable for refrigerated beverage bottles?",
        "a": "Yes, our waterproof vinyl labels resist condensation, refrigeration, and ice bucket immersion."
      },
      {
        "q": "Do you charge extra for custom contour shapes?",
        "a": "No, digital CNC cutting allows custom contour shapes without any additional die fee."
      },
      {
        "q": "What file format do I need for die-cut outlines?",
        "a": "Provide a vector cut path in a dedicated spot color or vector layer in PDF/AI format."
      }
    ],
    "relatedHandles": [
      "circle-stickers",
      "product-packaging-labels",
      "personalised-tote-bags",
      "flat-mailer-boxes"
    ],
    "highlights": [
      "Waterproof, oil-proof, and tear-resistant vinyl options",
      "Custom contour cutting to any shape without die tooling charges",
      "Strong adhesive suitable for glass, cardboard, plastic, and metal"
    ]
  },
  {
    "id": "prod-custom-hang-tags",
    "handle": "custom-hang-tags",
    "title": "Custom Hang Tags",
    "subtitle": "Die-cut labels, stickers, and custom boxes for retail and ecommerce",
    "description": "Upgrade your unboxing experience with custom Custom Hang Tags. Precision cut contours, waterproof vinyl, and sturdy corrugated materials.",
    "productType": "Labels & Packaging",
    "categoryHandles": [
      "labels-packaging"
    ],
    "tags": [
      "custom hang tags",
      "labels & packaging",
      "hangtag"
    ],
    "badges": [],
    "images": [
      {
        "url": "",
        "altText": "Custom Hang Tags preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "hangtag",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Custom Hang Tags detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "hangtag",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Custom Hang Tags packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "hangtag",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Material",
        "values": [
          "Glossy Vinyl",
          "Matte Paper",
          "Transparent Vinyl"
        ]
      },
      {
        "name": "Cut Style",
        "values": [
          "Kiss Cut Sheet",
          "Individual Die Cut"
        ]
      }
    ],
    "variants": [
      {
        "id": "custom-hang-tags-vin-gloss",
        "title": "Glossy Vinyl / Kiss Cut",
        "sku": "PKG-CUST-VG",
        price: money(34900),
        compareAtPrice: money(44900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Material",
            "value": "Glossy Vinyl"
          },
          {
            "name": "Cut Style",
            "value": "Kiss Cut Sheet"
          }
        ]
      },
      {
        "id": "custom-hang-tags-vin-matte",
        "title": "Matte Paper / Die Cut",
        "sku": "PKG-CUST-PM",
        price: money(40100),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.15,
        "selectedOptions": [
          {
            "name": "Material",
            "value": "Matte Paper"
          },
          {
            "name": "Cut Style",
            "value": "Individual Die Cut"
          }
        ]
      }
    ],
    priceFrom: money(34900),
    compareAtFrom: money(44900),
    "quantityTiers": [
      {
        "qty": 100,
        price: money(34900),
        compareAtPrice: money(44900)
      },
      {
        "qty": 300,
        price: money(87300)
      },
      {
        "qty": 1000,
        price: money(244300),
        "note": "Production Tier"
      }
    ],
    "priceUnit": "per 100 stickers",
    "specs": [
      {
        "label": "Adhesive Type",
        "value": "High-Tack Permanent Acrylic"
      },
      {
        "label": "Water Resistance",
        "value": "100% Waterproof on Vinyl grades"
      },
      {
        "label": "Cut Accuracy",
        "value": "±0.5 mm CNC digital blade"
      },
      {
        "label": "Supplied As",
        "value": "Individual cut or A4 gang sheets"
      }
    ],
    "minOrderQty": 100,
    "turnaroundDays": 3,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.8,
    "reviewCount": 601,
    "faqs": [
      {
        "q": "Are these stickers suitable for refrigerated beverage bottles?",
        "a": "Yes, our waterproof vinyl labels resist condensation, refrigeration, and ice bucket immersion."
      },
      {
        "q": "Do you charge extra for custom contour shapes?",
        "a": "No, digital CNC cutting allows custom contour shapes without any additional die fee."
      },
      {
        "q": "What file format do I need for die-cut outlines?",
        "a": "Provide a vector cut path in a dedicated spot color or vector layer in PDF/AI format."
      }
    ],
    "relatedHandles": [
      "circle-stickers",
      "product-packaging-labels",
      "personalised-tote-bags",
      "flat-mailer-boxes"
    ],
    "highlights": [
      "Waterproof, oil-proof, and tear-resistant vinyl options",
      "Custom contour cutting to any shape without die tooling charges",
      "Strong adhesive suitable for glass, cardboard, plastic, and metal"
    ]
  },
  {
    "id": "prod-rigid-gift-boxes",
    "handle": "rigid-gift-boxes",
    "title": "Rigid Gift Boxes",
    "subtitle": "Die-cut labels, stickers, and custom boxes for retail and ecommerce",
    "description": "Upgrade your unboxing experience with custom Rigid Gift Boxes. Precision cut contours, waterproof vinyl, and sturdy corrugated materials.",
    "productType": "Labels & Packaging",
    "categoryHandles": [
      "labels-packaging"
    ],
    "tags": [
      "rigid gift boxes",
      "labels & packaging",
      "box",
      "premium"
    ],
    "badges": [
      "premium"
    ],
    "images": [
      {
        "url": "",
        "altText": "Rigid Gift Boxes preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "box",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Rigid Gift Boxes detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "box",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Rigid Gift Boxes packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "box",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Material",
        "values": [
          "Glossy Vinyl",
          "Matte Paper",
          "Transparent Vinyl"
        ]
      },
      {
        "name": "Cut Style",
        "values": [
          "Kiss Cut Sheet",
          "Individual Die Cut"
        ]
      }
    ],
    "variants": [
      {
        "id": "rigid-gift-boxes-vin-gloss",
        "title": "Glossy Vinyl / Kiss Cut",
        "sku": "PKG-RIGI-VG",
        price: money(99900),
        compareAtPrice: money(129900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Material",
            "value": "Glossy Vinyl"
          },
          {
            "name": "Cut Style",
            "value": "Kiss Cut Sheet"
          }
        ]
      },
      {
        "id": "rigid-gift-boxes-vin-matte",
        "title": "Matte Paper / Die Cut",
        "sku": "PKG-RIGI-PM",
        price: money(114900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.15,
        "selectedOptions": [
          {
            "name": "Material",
            "value": "Matte Paper"
          },
          {
            "name": "Cut Style",
            "value": "Individual Die Cut"
          }
        ]
      }
    ],
    priceFrom: money(99900),
    compareAtFrom: money(129900),
    "quantityTiers": [
      {
        "qty": 25,
        price: money(99900),
        compareAtPrice: money(129900)
      },
      {
        "qty": 75,
        price: money(249800)
      },
      {
        "qty": 250,
        price: money(699300),
        "note": "Production Tier"
      }
    ],
    "priceUnit": "per 25 units",
    "specs": [
      {
        "label": "Adhesive Type",
        "value": "High-Tack Permanent Acrylic"
      },
      {
        "label": "Water Resistance",
        "value": "100% Waterproof on Vinyl grades"
      },
      {
        "label": "Cut Accuracy",
        "value": "±0.5 mm CNC digital blade"
      },
      {
        "label": "Supplied As",
        "value": "Individual cut or A4 gang sheets"
      }
    ],
    "minOrderQty": 25,
    "turnaroundDays": 3,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.6,
    "reviewCount": 517,
    "faqs": [
      {
        "q": "Are these stickers suitable for refrigerated beverage bottles?",
        "a": "Yes, our waterproof vinyl labels resist condensation, refrigeration, and ice bucket immersion."
      },
      {
        "q": "Do you charge extra for custom contour shapes?",
        "a": "No, digital CNC cutting allows custom contour shapes without any additional die fee."
      },
      {
        "q": "What file format do I need for die-cut outlines?",
        "a": "Provide a vector cut path in a dedicated spot color or vector layer in PDF/AI format."
      }
    ],
    "relatedHandles": [
      "circle-stickers",
      "product-packaging-labels",
      "personalised-tote-bags",
      "flat-mailer-boxes"
    ],
    "highlights": [
      "Waterproof, oil-proof, and tear-resistant vinyl options",
      "Custom contour cutting to any shape without die tooling charges",
      "Strong adhesive suitable for glass, cardboard, plastic, and metal"
    ]
  },
  {
    "id": "prod-top-bottom-rigid-boxes",
    "handle": "top-bottom-rigid-boxes",
    "title": "Top & Bottom Rigid Boxes",
    "subtitle": "Die-cut labels, stickers, and custom boxes for retail and ecommerce",
    "description": "Upgrade your unboxing experience with custom Top & Bottom Rigid Boxes. Precision cut contours, waterproof vinyl, and sturdy corrugated materials.",
    "productType": "Labels & Packaging",
    "categoryHandles": [
      "labels-packaging"
    ],
    "tags": [
      "top & bottom rigid boxes",
      "labels & packaging",
      "box"
    ],
    "badges": [],
    "images": [
      {
        "url": "",
        "altText": "Top & Bottom Rigid Boxes preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "box",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Top & Bottom Rigid Boxes detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "box",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Top & Bottom Rigid Boxes packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "box",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Material",
        "values": [
          "Glossy Vinyl",
          "Matte Paper",
          "Transparent Vinyl"
        ]
      },
      {
        "name": "Cut Style",
        "values": [
          "Kiss Cut Sheet",
          "Individual Die Cut"
        ]
      }
    ],
    "variants": [
      {
        "id": "top-bottom-rigid-boxes-vin-gloss",
        "title": "Glossy Vinyl / Kiss Cut",
        "sku": "PKG-TOP--VG",
        price: money(99900),
        compareAtPrice: money(129900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Material",
            "value": "Glossy Vinyl"
          },
          {
            "name": "Cut Style",
            "value": "Kiss Cut Sheet"
          }
        ]
      },
      {
        "id": "top-bottom-rigid-boxes-vin-matte",
        "title": "Matte Paper / Die Cut",
        "sku": "PKG-TOP--PM",
        price: money(114900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.15,
        "selectedOptions": [
          {
            "name": "Material",
            "value": "Matte Paper"
          },
          {
            "name": "Cut Style",
            "value": "Individual Die Cut"
          }
        ]
      }
    ],
    priceFrom: money(99900),
    compareAtFrom: money(129900),
    "quantityTiers": [
      {
        "qty": 25,
        price: money(99900),
        compareAtPrice: money(129900)
      },
      {
        "qty": 75,
        price: money(249800)
      },
      {
        "qty": 250,
        price: money(699300),
        "note": "Production Tier"
      }
    ],
    "priceUnit": "per 25 units",
    "specs": [
      {
        "label": "Adhesive Type",
        "value": "High-Tack Permanent Acrylic"
      },
      {
        "label": "Water Resistance",
        "value": "100% Waterproof on Vinyl grades"
      },
      {
        "label": "Cut Accuracy",
        "value": "±0.5 mm CNC digital blade"
      },
      {
        "label": "Supplied As",
        "value": "Individual cut or A4 gang sheets"
      }
    ],
    "minOrderQty": 25,
    "turnaroundDays": 3,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.7,
    "reviewCount": 598,
    "faqs": [
      {
        "q": "Are these stickers suitable for refrigerated beverage bottles?",
        "a": "Yes, our waterproof vinyl labels resist condensation, refrigeration, and ice bucket immersion."
      },
      {
        "q": "Do you charge extra for custom contour shapes?",
        "a": "No, digital CNC cutting allows custom contour shapes without any additional die fee."
      },
      {
        "q": "What file format do I need for die-cut outlines?",
        "a": "Provide a vector cut path in a dedicated spot color or vector layer in PDF/AI format."
      }
    ],
    "relatedHandles": [
      "circle-stickers",
      "product-packaging-labels",
      "personalised-tote-bags",
      "flat-mailer-boxes"
    ],
    "highlights": [
      "Waterproof, oil-proof, and tear-resistant vinyl options",
      "Custom contour cutting to any shape without die tooling charges",
      "Strong adhesive suitable for glass, cardboard, plastic, and metal"
    ]
  },
  {
    "id": "prod-gift-paper-bags",
    "handle": "gift-paper-bags",
    "title": "Gift Paper Bags",
    "subtitle": "Die-cut labels, stickers, and custom boxes for retail and ecommerce",
    "description": "Upgrade your unboxing experience with custom Gift Paper Bags. Precision cut contours, waterproof vinyl, and sturdy corrugated materials.",
    "productType": "Labels & Packaging",
    "categoryHandles": [
      "labels-packaging"
    ],
    "tags": [
      "gift paper bags",
      "labels & packaging",
      "tote"
    ],
    "badges": [],
    "images": [
      {
        "url": "",
        "altText": "Gift Paper Bags preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "tote",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Gift Paper Bags detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "tote",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Gift Paper Bags packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "tote",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Material",
        "values": [
          "Glossy Vinyl",
          "Matte Paper",
          "Transparent Vinyl"
        ]
      },
      {
        "name": "Cut Style",
        "values": [
          "Kiss Cut Sheet",
          "Individual Die Cut"
        ]
      }
    ],
    "variants": [
      {
        "id": "gift-paper-bags-vin-gloss",
        "title": "Glossy Vinyl / Kiss Cut",
        "sku": "PKG-GIFT-VG",
        price: money(34900),
        compareAtPrice: money(44900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Material",
            "value": "Glossy Vinyl"
          },
          {
            "name": "Cut Style",
            "value": "Kiss Cut Sheet"
          }
        ]
      },
      {
        "id": "gift-paper-bags-vin-matte",
        "title": "Matte Paper / Die Cut",
        "sku": "PKG-GIFT-PM",
        price: money(40100),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.15,
        "selectedOptions": [
          {
            "name": "Material",
            "value": "Matte Paper"
          },
          {
            "name": "Cut Style",
            "value": "Individual Die Cut"
          }
        ]
      }
    ],
    priceFrom: money(34900),
    compareAtFrom: money(44900),
    "quantityTiers": [
      {
        "qty": 100,
        price: money(34900),
        compareAtPrice: money(44900)
      },
      {
        "qty": 300,
        price: money(87300)
      },
      {
        "qty": 1000,
        price: money(244300),
        "note": "Production Tier"
      }
    ],
    "priceUnit": "per 100 stickers",
    "specs": [
      {
        "label": "Adhesive Type",
        "value": "High-Tack Permanent Acrylic"
      },
      {
        "label": "Water Resistance",
        "value": "100% Waterproof on Vinyl grades"
      },
      {
        "label": "Cut Accuracy",
        "value": "±0.5 mm CNC digital blade"
      },
      {
        "label": "Supplied As",
        "value": "Individual cut or A4 gang sheets"
      }
    ],
    "minOrderQty": 100,
    "turnaroundDays": 3,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.5,
    "reviewCount": 152,
    "faqs": [
      {
        "q": "Are these stickers suitable for refrigerated beverage bottles?",
        "a": "Yes, our waterproof vinyl labels resist condensation, refrigeration, and ice bucket immersion."
      },
      {
        "q": "Do you charge extra for custom contour shapes?",
        "a": "No, digital CNC cutting allows custom contour shapes without any additional die fee."
      },
      {
        "q": "What file format do I need for die-cut outlines?",
        "a": "Provide a vector cut path in a dedicated spot color or vector layer in PDF/AI format."
      }
    ],
    "relatedHandles": [
      "circle-stickers",
      "product-packaging-labels",
      "personalised-tote-bags",
      "flat-mailer-boxes"
    ],
    "highlights": [
      "Waterproof, oil-proof, and tear-resistant vinyl options",
      "Custom contour cutting to any shape without die tooling charges",
      "Strong adhesive suitable for glass, cardboard, plastic, and metal"
    ]
  },
  {
    "id": "prod-kraft-paper-bags",
    "handle": "kraft-paper-bags",
    "title": "Kraft Paper Bags",
    "subtitle": "Die-cut labels, stickers, and custom boxes for retail and ecommerce",
    "description": "Upgrade your unboxing experience with custom Kraft Paper Bags. Precision cut contours, waterproof vinyl, and sturdy corrugated materials.",
    "productType": "Labels & Packaging",
    "categoryHandles": [
      "labels-packaging"
    ],
    "tags": [
      "kraft paper bags",
      "labels & packaging",
      "tote",
      "eco"
    ],
    "badges": [
      "eco"
    ],
    "images": [
      {
        "url": "",
        "altText": "Kraft Paper Bags preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "tote",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Kraft Paper Bags detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "tote",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Kraft Paper Bags packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "tote",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Material",
        "values": [
          "Glossy Vinyl",
          "Matte Paper",
          "Transparent Vinyl"
        ]
      },
      {
        "name": "Cut Style",
        "values": [
          "Kiss Cut Sheet",
          "Individual Die Cut"
        ]
      }
    ],
    "variants": [
      {
        "id": "kraft-paper-bags-vin-gloss",
        "title": "Glossy Vinyl / Kiss Cut",
        "sku": "PKG-KRAF-VG",
        price: money(34900),
        compareAtPrice: money(44900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Material",
            "value": "Glossy Vinyl"
          },
          {
            "name": "Cut Style",
            "value": "Kiss Cut Sheet"
          }
        ]
      },
      {
        "id": "kraft-paper-bags-vin-matte",
        "title": "Matte Paper / Die Cut",
        "sku": "PKG-KRAF-PM",
        price: money(40100),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.15,
        "selectedOptions": [
          {
            "name": "Material",
            "value": "Matte Paper"
          },
          {
            "name": "Cut Style",
            "value": "Individual Die Cut"
          }
        ]
      }
    ],
    priceFrom: money(34900),
    compareAtFrom: money(44900),
    "quantityTiers": [
      {
        "qty": 100,
        price: money(34900),
        compareAtPrice: money(44900)
      },
      {
        "qty": 300,
        price: money(87300)
      },
      {
        "qty": 1000,
        price: money(244300),
        "note": "Production Tier"
      }
    ],
    "priceUnit": "per 100 stickers",
    "specs": [
      {
        "label": "Adhesive Type",
        "value": "High-Tack Permanent Acrylic"
      },
      {
        "label": "Water Resistance",
        "value": "100% Waterproof on Vinyl grades"
      },
      {
        "label": "Cut Accuracy",
        "value": "±0.5 mm CNC digital blade"
      },
      {
        "label": "Supplied As",
        "value": "Individual cut or A4 gang sheets"
      }
    ],
    "minOrderQty": 100,
    "turnaroundDays": 3,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.9,
    "reviewCount": 406,
    "faqs": [
      {
        "q": "Are these stickers suitable for refrigerated beverage bottles?",
        "a": "Yes, our waterproof vinyl labels resist condensation, refrigeration, and ice bucket immersion."
      },
      {
        "q": "Do you charge extra for custom contour shapes?",
        "a": "No, digital CNC cutting allows custom contour shapes without any additional die fee."
      },
      {
        "q": "What file format do I need for die-cut outlines?",
        "a": "Provide a vector cut path in a dedicated spot color or vector layer in PDF/AI format."
      }
    ],
    "relatedHandles": [
      "circle-stickers",
      "product-packaging-labels",
      "personalised-tote-bags",
      "flat-mailer-boxes"
    ],
    "highlights": [
      "Waterproof, oil-proof, and tear-resistant vinyl options",
      "Custom contour cutting to any shape without die tooling charges",
      "Strong adhesive suitable for glass, cardboard, plastic, and metal"
    ]
  },
  {
    "id": "prod-custom-packing-tape",
    "handle": "custom-packing-tape",
    "title": "Custom Packing Tape",
    "subtitle": "Die-cut labels, stickers, and custom boxes for retail and ecommerce",
    "description": "Upgrade your unboxing experience with custom Custom Packing Tape. Precision cut contours, waterproof vinyl, and sturdy corrugated materials.",
    "productType": "Labels & Packaging",
    "categoryHandles": [
      "labels-packaging"
    ],
    "tags": [
      "custom packing tape",
      "labels & packaging",
      "tape"
    ],
    "badges": [],
    "images": [
      {
        "url": "",
        "altText": "Custom Packing Tape preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "tape",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Custom Packing Tape detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "tape",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Custom Packing Tape packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "tape",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Material",
        "values": [
          "Glossy Vinyl",
          "Matte Paper",
          "Transparent Vinyl"
        ]
      },
      {
        "name": "Cut Style",
        "values": [
          "Kiss Cut Sheet",
          "Individual Die Cut"
        ]
      }
    ],
    "variants": [
      {
        "id": "custom-packing-tape-vin-gloss",
        "title": "Glossy Vinyl / Kiss Cut",
        "sku": "PKG-CUST-VG",
        price: money(34900),
        compareAtPrice: money(44900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Material",
            "value": "Glossy Vinyl"
          },
          {
            "name": "Cut Style",
            "value": "Kiss Cut Sheet"
          }
        ]
      },
      {
        "id": "custom-packing-tape-vin-matte",
        "title": "Matte Paper / Die Cut",
        "sku": "PKG-CUST-PM",
        price: money(40100),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.15,
        "selectedOptions": [
          {
            "name": "Material",
            "value": "Matte Paper"
          },
          {
            "name": "Cut Style",
            "value": "Individual Die Cut"
          }
        ]
      }
    ],
    priceFrom: money(34900),
    compareAtFrom: money(44900),
    "quantityTiers": [
      {
        "qty": 100,
        price: money(34900),
        compareAtPrice: money(44900)
      },
      {
        "qty": 300,
        price: money(87300)
      },
      {
        "qty": 1000,
        price: money(244300),
        "note": "Production Tier"
      }
    ],
    "priceUnit": "per 100 stickers",
    "specs": [
      {
        "label": "Adhesive Type",
        "value": "High-Tack Permanent Acrylic"
      },
      {
        "label": "Water Resistance",
        "value": "100% Waterproof on Vinyl grades"
      },
      {
        "label": "Cut Accuracy",
        "value": "±0.5 mm CNC digital blade"
      },
      {
        "label": "Supplied As",
        "value": "Individual cut or A4 gang sheets"
      }
    ],
    "minOrderQty": 100,
    "turnaroundDays": 3,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.4,
    "reviewCount": 475,
    "faqs": [
      {
        "q": "Are these stickers suitable for refrigerated beverage bottles?",
        "a": "Yes, our waterproof vinyl labels resist condensation, refrigeration, and ice bucket immersion."
      },
      {
        "q": "Do you charge extra for custom contour shapes?",
        "a": "No, digital CNC cutting allows custom contour shapes without any additional die fee."
      },
      {
        "q": "What file format do I need for die-cut outlines?",
        "a": "Provide a vector cut path in a dedicated spot color or vector layer in PDF/AI format."
      }
    ],
    "relatedHandles": [
      "circle-stickers",
      "product-packaging-labels",
      "personalised-tote-bags",
      "flat-mailer-boxes"
    ],
    "highlights": [
      "Waterproof, oil-proof, and tear-resistant vinyl options",
      "Custom contour cutting to any shape without die tooling charges",
      "Strong adhesive suitable for glass, cardboard, plastic, and metal"
    ]
  },
  {
    "id": "prod-custom-tissue-paper",
    "handle": "custom-tissue-paper",
    "title": "Custom Tissue Paper",
    "subtitle": "Die-cut labels, stickers, and custom boxes for retail and ecommerce",
    "description": "Upgrade your unboxing experience with custom Custom Tissue Paper. Precision cut contours, waterproof vinyl, and sturdy corrugated materials.",
    "productType": "Labels & Packaging",
    "categoryHandles": [
      "labels-packaging"
    ],
    "tags": [
      "custom tissue paper",
      "labels & packaging",
      "generic",
      "new"
    ],
    "badges": [
      "new"
    ],
    "images": [
      {
        "url": "",
        "altText": "Custom Tissue Paper preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "generic",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Custom Tissue Paper detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "generic",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Custom Tissue Paper packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "generic",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Material",
        "values": [
          "Glossy Vinyl",
          "Matte Paper",
          "Transparent Vinyl"
        ]
      },
      {
        "name": "Cut Style",
        "values": [
          "Kiss Cut Sheet",
          "Individual Die Cut"
        ]
      }
    ],
    "variants": [
      {
        "id": "custom-tissue-paper-vin-gloss",
        "title": "Glossy Vinyl / Kiss Cut",
        "sku": "PKG-CUST-VG",
        price: money(34900),
        compareAtPrice: money(44900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Material",
            "value": "Glossy Vinyl"
          },
          {
            "name": "Cut Style",
            "value": "Kiss Cut Sheet"
          }
        ]
      },
      {
        "id": "custom-tissue-paper-vin-matte",
        "title": "Matte Paper / Die Cut",
        "sku": "PKG-CUST-PM",
        price: money(40100),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.15,
        "selectedOptions": [
          {
            "name": "Material",
            "value": "Matte Paper"
          },
          {
            "name": "Cut Style",
            "value": "Individual Die Cut"
          }
        ]
      }
    ],
    priceFrom: money(34900),
    compareAtFrom: money(44900),
    "quantityTiers": [
      {
        "qty": 100,
        price: money(34900),
        compareAtPrice: money(44900)
      },
      {
        "qty": 300,
        price: money(87300)
      },
      {
        "qty": 1000,
        price: money(244300),
        "note": "Production Tier"
      }
    ],
    "priceUnit": "per 100 stickers",
    "specs": [
      {
        "label": "Adhesive Type",
        "value": "High-Tack Permanent Acrylic"
      },
      {
        "label": "Water Resistance",
        "value": "100% Waterproof on Vinyl grades"
      },
      {
        "label": "Cut Accuracy",
        "value": "±0.5 mm CNC digital blade"
      },
      {
        "label": "Supplied As",
        "value": "Individual cut or A4 gang sheets"
      }
    ],
    "minOrderQty": 100,
    "turnaroundDays": 3,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.4,
    "reviewCount": 631,
    "faqs": [
      {
        "q": "Are these stickers suitable for refrigerated beverage bottles?",
        "a": "Yes, our waterproof vinyl labels resist condensation, refrigeration, and ice bucket immersion."
      },
      {
        "q": "Do you charge extra for custom contour shapes?",
        "a": "No, digital CNC cutting allows custom contour shapes without any additional die fee."
      },
      {
        "q": "What file format do I need for die-cut outlines?",
        "a": "Provide a vector cut path in a dedicated spot color or vector layer in PDF/AI format."
      }
    ],
    "relatedHandles": [
      "circle-stickers",
      "product-packaging-labels",
      "personalised-tote-bags",
      "flat-mailer-boxes"
    ],
    "highlights": [
      "Waterproof, oil-proof, and tear-resistant vinyl options",
      "Custom contour cutting to any shape without die tooling charges",
      "Strong adhesive suitable for glass, cardboard, plastic, and metal"
    ]
  },
  {
    "id": "prod-thank-you-cards",
    "handle": "thank-you-cards",
    "title": "Thank-You Cards",
    "subtitle": "Die-cut labels, stickers, and custom boxes for retail and ecommerce",
    "description": "Upgrade your unboxing experience with custom Thank-You Cards. Precision cut contours, waterproof vinyl, and sturdy corrugated materials.",
    "productType": "Labels & Packaging",
    "categoryHandles": [
      "labels-packaging"
    ],
    "tags": [
      "thank-you cards",
      "labels & packaging",
      "card"
    ],
    "badges": [],
    "images": [
      {
        "url": "",
        "altText": "Thank-You Cards preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Thank-You Cards detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Thank-You Cards packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Material",
        "values": [
          "Glossy Vinyl",
          "Matte Paper",
          "Transparent Vinyl"
        ]
      },
      {
        "name": "Cut Style",
        "values": [
          "Kiss Cut Sheet",
          "Individual Die Cut"
        ]
      }
    ],
    "variants": [
      {
        "id": "thank-you-cards-vin-gloss",
        "title": "Glossy Vinyl / Kiss Cut",
        "sku": "PKG-THAN-VG",
        price: money(34900),
        compareAtPrice: money(44900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Material",
            "value": "Glossy Vinyl"
          },
          {
            "name": "Cut Style",
            "value": "Kiss Cut Sheet"
          }
        ]
      },
      {
        "id": "thank-you-cards-vin-matte",
        "title": "Matte Paper / Die Cut",
        "sku": "PKG-THAN-PM",
        price: money(40100),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.15,
        "selectedOptions": [
          {
            "name": "Material",
            "value": "Matte Paper"
          },
          {
            "name": "Cut Style",
            "value": "Individual Die Cut"
          }
        ]
      }
    ],
    priceFrom: money(34900),
    compareAtFrom: money(44900),
    "quantityTiers": [
      {
        "qty": 100,
        price: money(34900),
        compareAtPrice: money(44900)
      },
      {
        "qty": 300,
        price: money(87300)
      },
      {
        "qty": 1000,
        price: money(244300),
        "note": "Production Tier"
      }
    ],
    "priceUnit": "per 100 stickers",
    "specs": [
      {
        "label": "Adhesive Type",
        "value": "High-Tack Permanent Acrylic"
      },
      {
        "label": "Water Resistance",
        "value": "100% Waterproof on Vinyl grades"
      },
      {
        "label": "Cut Accuracy",
        "value": "±0.5 mm CNC digital blade"
      },
      {
        "label": "Supplied As",
        "value": "Individual cut or A4 gang sheets"
      }
    ],
    "minOrderQty": 100,
    "turnaroundDays": 3,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.6,
    "reviewCount": 601,
    "faqs": [
      {
        "q": "Are these stickers suitable for refrigerated beverage bottles?",
        "a": "Yes, our waterproof vinyl labels resist condensation, refrigeration, and ice bucket immersion."
      },
      {
        "q": "Do you charge extra for custom contour shapes?",
        "a": "No, digital CNC cutting allows custom contour shapes without any additional die fee."
      },
      {
        "q": "What file format do I need for die-cut outlines?",
        "a": "Provide a vector cut path in a dedicated spot color or vector layer in PDF/AI format."
      }
    ],
    "relatedHandles": [
      "circle-stickers",
      "product-packaging-labels",
      "personalised-tote-bags",
      "flat-mailer-boxes"
    ],
    "highlights": [
      "Waterproof, oil-proof, and tear-resistant vinyl options",
      "Custom contour cutting to any shape without die tooling charges",
      "Strong adhesive suitable for glass, cardboard, plastic, and metal"
    ]
  },
  {
    "id": "prod-void-fill-inserts",
    "handle": "void-fill-inserts",
    "title": "Void Fill & Inserts",
    "subtitle": "Die-cut labels, stickers, and custom boxes for retail and ecommerce",
    "description": "Upgrade your unboxing experience with custom Void Fill & Inserts. Precision cut contours, waterproof vinyl, and sturdy corrugated materials.",
    "productType": "Labels & Packaging",
    "categoryHandles": [
      "labels-packaging"
    ],
    "tags": [
      "void fill & inserts",
      "labels & packaging",
      "generic"
    ],
    "badges": [],
    "images": [
      {
        "url": "",
        "altText": "Void Fill & Inserts preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "generic",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Void Fill & Inserts detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "generic",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Void Fill & Inserts packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "generic",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Material",
        "values": [
          "Glossy Vinyl",
          "Matte Paper",
          "Transparent Vinyl"
        ]
      },
      {
        "name": "Cut Style",
        "values": [
          "Kiss Cut Sheet",
          "Individual Die Cut"
        ]
      }
    ],
    "variants": [
      {
        "id": "void-fill-inserts-vin-gloss",
        "title": "Glossy Vinyl / Kiss Cut",
        "sku": "PKG-VOID-VG",
        price: money(34900),
        compareAtPrice: money(44900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Material",
            "value": "Glossy Vinyl"
          },
          {
            "name": "Cut Style",
            "value": "Kiss Cut Sheet"
          }
        ]
      },
      {
        "id": "void-fill-inserts-vin-matte",
        "title": "Matte Paper / Die Cut",
        "sku": "PKG-VOID-PM",
        price: money(40100),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.15,
        "selectedOptions": [
          {
            "name": "Material",
            "value": "Matte Paper"
          },
          {
            "name": "Cut Style",
            "value": "Individual Die Cut"
          }
        ]
      }
    ],
    priceFrom: money(34900),
    compareAtFrom: money(44900),
    "quantityTiers": [
      {
        "qty": 100,
        price: money(34900),
        compareAtPrice: money(44900)
      },
      {
        "qty": 300,
        price: money(87300)
      },
      {
        "qty": 1000,
        price: money(244300),
        "note": "Production Tier"
      }
    ],
    "priceUnit": "per 100 stickers",
    "specs": [
      {
        "label": "Adhesive Type",
        "value": "High-Tack Permanent Acrylic"
      },
      {
        "label": "Water Resistance",
        "value": "100% Waterproof on Vinyl grades"
      },
      {
        "label": "Cut Accuracy",
        "value": "±0.5 mm CNC digital blade"
      },
      {
        "label": "Supplied As",
        "value": "Individual cut or A4 gang sheets"
      }
    ],
    "minOrderQty": 100,
    "turnaroundDays": 3,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.5,
    "reviewCount": 560,
    "faqs": [
      {
        "q": "Are these stickers suitable for refrigerated beverage bottles?",
        "a": "Yes, our waterproof vinyl labels resist condensation, refrigeration, and ice bucket immersion."
      },
      {
        "q": "Do you charge extra for custom contour shapes?",
        "a": "No, digital CNC cutting allows custom contour shapes without any additional die fee."
      },
      {
        "q": "What file format do I need for die-cut outlines?",
        "a": "Provide a vector cut path in a dedicated spot color or vector layer in PDF/AI format."
      }
    ],
    "relatedHandles": [
      "circle-stickers",
      "product-packaging-labels",
      "personalised-tote-bags",
      "flat-mailer-boxes"
    ],
    "highlights": [
      "Waterproof, oil-proof, and tear-resistant vinyl options",
      "Custom contour cutting to any shape without die tooling charges",
      "Strong adhesive suitable for glass, cardboard, plastic, and metal"
    ]
  }
];
