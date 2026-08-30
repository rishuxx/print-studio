import { money, type Product } from "@/lib/commerce/types";

export const festiveProducts: Product[] = [
  {
    "id": "prod-custom-diyas-gift-boxes",
    "handle": "custom-diyas-gift-boxes",
    "title": "Custom Diyas & Gift Boxes",
    "subtitle": "Curated festive packaging, greeting suites, and celebratory decor",
    "description": "Celebrate auspicious occasions in style with custom Custom Diyas & Gift Boxes. Foil stamped motifs, handmade artisanal textures, and custom sweets hampers.",
    "productType": "Festive Specials",
    "categoryHandles": [
      "festive"
    ],
    "tags": [
      "custom diyas & gift boxes",
      "festive",
      "box",
      "festive"
    ],
    "badges": [
      "festive"
    ],
    "images": [
      {
        "url": "",
        "altText": "Custom Diyas & Gift Boxes preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "box",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Custom Diyas & Gift Boxes detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "box",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Custom Diyas & Gift Boxes packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "box",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Edition",
        "values": [
          "Classic Festive",
          "Royal Gold Suite",
          "Eco Handcrafted"
        ]
      },
      {
        "name": "Quantity Pack",
        "values": [
          "Single Pack",
          "Family Pack of 5",
          "Corporate Hamper Pack of 25"
        ]
      }
    ],
    "variants": [
      {
        "id": "custom-diyas-gift-boxes-classic",
        "title": "Classic Festive",
        "sku": "FST-CUST-CLS",
        price: money(49900),
        compareAtPrice: money(64900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Edition",
            "value": "Classic Festive"
          },
          {
            "name": "Quantity Pack",
            "value": "Single Pack"
          }
        ]
      },
      {
        "id": "custom-diyas-gift-boxes-royal",
        "title": "Royal Gold Suite",
        "sku": "FST-CUST-RYL",
        price: money(74900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.5,
        "selectedOptions": [
          {
            "name": "Edition",
            "value": "Royal Gold Suite"
          },
          {
            "name": "Quantity Pack",
            "value": "Single Pack"
          }
        ]
      }
    ],
    priceFrom: money(49900),
    compareAtFrom: money(64900),
    "quantityTiers": [
      {
        "qty": 1,
        price: money(49900),
        compareAtPrice: money(64900)
      },
      {
        "qty": 10,
        price: money(439100)
      },
      {
        "qty": 50,
        price: money(1896200),
        "note": "Festive Corporate"
      }
    ],
    "priceUnit": "per set",
    "specs": [
      {
        "label": "Finishing",
        "value": "Hot Foil Stamping & Embossed Accents"
      },
      {
        "label": "Paper Type",
        "value": "350 GSM Textured Metallic Pearl Card"
      },
      {
        "label": "Envelope / Box",
        "value": "Custom matching lined envelope included"
      },
      {
        "label": "Seasonality",
        "value": "Limited Seasonal Run"
      }
    ],
    "minOrderQty": 1,
    "turnaroundDays": 2,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.9,
    "reviewCount": 340,
    "faqs": [
      {
        "q": "Can corporate greeting cards include custom signatures?",
        "a": "Yes, upload your team signatures and logo to have them printed in matching metallic ink."
      },
      {
        "q": "When is the cutoff date for Diwali bulk deliveries?",
        "a": "We recommend locking orders 10 business days before Diwali to guarantee on-time transit."
      },
      {
        "q": "Do you provide sweet box inner partitions?",
        "a": "Yes, our hamper boxes include food-grade compartmentalized inserts for dry fruits and sweets."
      }
    ],
    "relatedHandles": [
      "diwali-cards",
      "diwali-hampers",
      "corporate-diwali-gifting",
      "rangoli-decor-stickers"
    ],
    "highlights": [
      "Gilded gold foil stamping and intricate laser-cut patterns",
      "Matching bespoke packaging boxes and envelope seals",
      "Personalized greeting messages and custom corporate logos"
    ]
  },
  {
    "id": "prod-diwali-cards",
    "handle": "diwali-cards",
    "title": "Diwali Cards",
    "subtitle": "Curated festive packaging, greeting suites, and celebratory decor",
    "description": "Celebrate auspicious occasions in style with custom Diwali Cards. Foil stamped motifs, handmade artisanal textures, and custom sweets hampers.",
    "productType": "Festive Specials",
    "categoryHandles": [
      "festive"
    ],
    "tags": [
      "diwali cards",
      "festive",
      "card",
      "popular"
    ],
    "badges": [
      "popular"
    ],
    "images": [
      {
        "url": "",
        "altText": "Diwali Cards preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Diwali Cards detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Diwali Cards packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Edition",
        "values": [
          "Classic Festive",
          "Royal Gold Suite",
          "Eco Handcrafted"
        ]
      },
      {
        "name": "Quantity Pack",
        "values": [
          "Single Pack",
          "Family Pack of 5",
          "Corporate Hamper Pack of 25"
        ]
      }
    ],
    "variants": [
      {
        "id": "diwali-cards-classic",
        "title": "Classic Festive",
        "sku": "FST-DIWA-CLS",
        price: money(49900),
        compareAtPrice: money(64900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Edition",
            "value": "Classic Festive"
          },
          {
            "name": "Quantity Pack",
            "value": "Single Pack"
          }
        ]
      },
      {
        "id": "diwali-cards-royal",
        "title": "Royal Gold Suite",
        "sku": "FST-DIWA-RYL",
        price: money(74900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.5,
        "selectedOptions": [
          {
            "name": "Edition",
            "value": "Royal Gold Suite"
          },
          {
            "name": "Quantity Pack",
            "value": "Single Pack"
          }
        ]
      }
    ],
    priceFrom: money(49900),
    compareAtFrom: money(64900),
    "quantityTiers": [
      {
        "qty": 1,
        price: money(49900),
        compareAtPrice: money(64900)
      },
      {
        "qty": 10,
        price: money(439100)
      },
      {
        "qty": 50,
        price: money(1896200),
        "note": "Festive Corporate"
      }
    ],
    "priceUnit": "per set",
    "specs": [
      {
        "label": "Finishing",
        "value": "Hot Foil Stamping & Embossed Accents"
      },
      {
        "label": "Paper Type",
        "value": "350 GSM Textured Metallic Pearl Card"
      },
      {
        "label": "Envelope / Box",
        "value": "Custom matching lined envelope included"
      },
      {
        "label": "Seasonality",
        "value": "Limited Seasonal Run"
      }
    ],
    "minOrderQty": 1,
    "turnaroundDays": 2,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.4,
    "reviewCount": 211,
    "faqs": [
      {
        "q": "Can corporate greeting cards include custom signatures?",
        "a": "Yes, upload your team signatures and logo to have them printed in matching metallic ink."
      },
      {
        "q": "When is the cutoff date for Diwali bulk deliveries?",
        "a": "We recommend locking orders 10 business days before Diwali to guarantee on-time transit."
      },
      {
        "q": "Do you provide sweet box inner partitions?",
        "a": "Yes, our hamper boxes include food-grade compartmentalized inserts for dry fruits and sweets."
      }
    ],
    "relatedHandles": [
      "custom-diyas-gift-boxes",
      "diwali-hampers",
      "corporate-diwali-gifting",
      "rangoli-decor-stickers"
    ],
    "highlights": [
      "Gilded gold foil stamping and intricate laser-cut patterns",
      "Matching bespoke packaging boxes and envelope seals",
      "Personalized greeting messages and custom corporate logos"
    ]
  },
  {
    "id": "prod-diwali-hampers",
    "handle": "diwali-hampers",
    "title": "Diwali Hampers",
    "subtitle": "Curated festive packaging, greeting suites, and celebratory decor",
    "description": "Celebrate auspicious occasions in style with custom Diwali Hampers. Foil stamped motifs, handmade artisanal textures, and custom sweets hampers.",
    "productType": "Festive Specials",
    "categoryHandles": [
      "festive"
    ],
    "tags": [
      "diwali hampers",
      "festive",
      "hamper",
      "bestseller"
    ],
    "badges": [
      "bestseller"
    ],
    "images": [
      {
        "url": "",
        "altText": "Diwali Hampers preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "hamper",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Diwali Hampers detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "hamper",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Diwali Hampers packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "hamper",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Edition",
        "values": [
          "Classic Festive",
          "Royal Gold Suite",
          "Eco Handcrafted"
        ]
      },
      {
        "name": "Quantity Pack",
        "values": [
          "Single Pack",
          "Family Pack of 5",
          "Corporate Hamper Pack of 25"
        ]
      }
    ],
    "variants": [
      {
        "id": "diwali-hampers-classic",
        "title": "Classic Festive",
        "sku": "FST-DIWA-CLS",
        price: money(49900),
        compareAtPrice: money(64900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Edition",
            "value": "Classic Festive"
          },
          {
            "name": "Quantity Pack",
            "value": "Single Pack"
          }
        ]
      },
      {
        "id": "diwali-hampers-royal",
        "title": "Royal Gold Suite",
        "sku": "FST-DIWA-RYL",
        price: money(74900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.5,
        "selectedOptions": [
          {
            "name": "Edition",
            "value": "Royal Gold Suite"
          },
          {
            "name": "Quantity Pack",
            "value": "Single Pack"
          }
        ]
      }
    ],
    priceFrom: money(49900),
    compareAtFrom: money(64900),
    "quantityTiers": [
      {
        "qty": 1,
        price: money(49900),
        compareAtPrice: money(64900)
      },
      {
        "qty": 10,
        price: money(439100)
      },
      {
        "qty": 50,
        price: money(1896200),
        "note": "Festive Corporate"
      }
    ],
    "priceUnit": "per set",
    "specs": [
      {
        "label": "Finishing",
        "value": "Hot Foil Stamping & Embossed Accents"
      },
      {
        "label": "Paper Type",
        "value": "350 GSM Textured Metallic Pearl Card"
      },
      {
        "label": "Envelope / Box",
        "value": "Custom matching lined envelope included"
      },
      {
        "label": "Seasonality",
        "value": "Limited Seasonal Run"
      }
    ],
    "minOrderQty": 1,
    "turnaroundDays": 2,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.5,
    "reviewCount": 420,
    "faqs": [
      {
        "q": "Can corporate greeting cards include custom signatures?",
        "a": "Yes, upload your team signatures and logo to have them printed in matching metallic ink."
      },
      {
        "q": "When is the cutoff date for Diwali bulk deliveries?",
        "a": "We recommend locking orders 10 business days before Diwali to guarantee on-time transit."
      },
      {
        "q": "Do you provide sweet box inner partitions?",
        "a": "Yes, our hamper boxes include food-grade compartmentalized inserts for dry fruits and sweets."
      }
    ],
    "relatedHandles": [
      "custom-diyas-gift-boxes",
      "diwali-cards",
      "corporate-diwali-gifting",
      "rangoli-decor-stickers"
    ],
    "highlights": [
      "Gilded gold foil stamping and intricate laser-cut patterns",
      "Matching bespoke packaging boxes and envelope seals",
      "Personalized greeting messages and custom corporate logos"
    ]
  },
  {
    "id": "prod-corporate-diwali-gifting",
    "handle": "corporate-diwali-gifting",
    "title": "Corporate Diwali Gifting",
    "subtitle": "Curated festive packaging, greeting suites, and celebratory decor",
    "description": "Celebrate auspicious occasions in style with custom Corporate Diwali Gifting. Foil stamped motifs, handmade artisanal textures, and custom sweets hampers.",
    "productType": "Festive Specials",
    "categoryHandles": [
      "festive"
    ],
    "tags": [
      "corporate diwali gifting",
      "festive",
      "generic",
      "bulk-saver"
    ],
    "badges": [
      "bulk-saver"
    ],
    "images": [
      {
        "url": "",
        "altText": "Corporate Diwali Gifting preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "generic",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Corporate Diwali Gifting detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "generic",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Corporate Diwali Gifting packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "generic",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Edition",
        "values": [
          "Classic Festive",
          "Royal Gold Suite",
          "Eco Handcrafted"
        ]
      },
      {
        "name": "Quantity Pack",
        "values": [
          "Single Pack",
          "Family Pack of 5",
          "Corporate Hamper Pack of 25"
        ]
      }
    ],
    "variants": [
      {
        "id": "corporate-diwali-gifting-classic",
        "title": "Classic Festive",
        "sku": "FST-CORP-CLS",
        price: money(49900),
        compareAtPrice: money(64900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Edition",
            "value": "Classic Festive"
          },
          {
            "name": "Quantity Pack",
            "value": "Single Pack"
          }
        ]
      },
      {
        "id": "corporate-diwali-gifting-royal",
        "title": "Royal Gold Suite",
        "sku": "FST-CORP-RYL",
        price: money(74900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.5,
        "selectedOptions": [
          {
            "name": "Edition",
            "value": "Royal Gold Suite"
          },
          {
            "name": "Quantity Pack",
            "value": "Single Pack"
          }
        ]
      }
    ],
    priceFrom: money(49900),
    compareAtFrom: money(64900),
    "quantityTiers": [
      {
        "qty": 1,
        price: money(49900),
        compareAtPrice: money(64900)
      },
      {
        "qty": 10,
        price: money(439100)
      },
      {
        "qty": 50,
        price: money(1896200),
        "note": "Festive Corporate"
      }
    ],
    "priceUnit": "per set",
    "specs": [
      {
        "label": "Finishing",
        "value": "Hot Foil Stamping & Embossed Accents"
      },
      {
        "label": "Paper Type",
        "value": "350 GSM Textured Metallic Pearl Card"
      },
      {
        "label": "Envelope / Box",
        "value": "Custom matching lined envelope included"
      },
      {
        "label": "Seasonality",
        "value": "Limited Seasonal Run"
      }
    ],
    "minOrderQty": 1,
    "turnaroundDays": 2,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.9,
    "reviewCount": 214,
    "faqs": [
      {
        "q": "Can corporate greeting cards include custom signatures?",
        "a": "Yes, upload your team signatures and logo to have them printed in matching metallic ink."
      },
      {
        "q": "When is the cutoff date for Diwali bulk deliveries?",
        "a": "We recommend locking orders 10 business days before Diwali to guarantee on-time transit."
      },
      {
        "q": "Do you provide sweet box inner partitions?",
        "a": "Yes, our hamper boxes include food-grade compartmentalized inserts for dry fruits and sweets."
      }
    ],
    "relatedHandles": [
      "custom-diyas-gift-boxes",
      "diwali-cards",
      "diwali-hampers",
      "rangoli-decor-stickers"
    ],
    "highlights": [
      "Gilded gold foil stamping and intricate laser-cut patterns",
      "Matching bespoke packaging boxes and envelope seals",
      "Personalized greeting messages and custom corporate logos"
    ]
  },
  {
    "id": "prod-rangoli-decor-stickers",
    "handle": "rangoli-decor-stickers",
    "title": "Rangoli & Decor Stickers",
    "subtitle": "Curated festive packaging, greeting suites, and celebratory decor",
    "description": "Celebrate auspicious occasions in style with custom Rangoli & Decor Stickers. Foil stamped motifs, handmade artisanal textures, and custom sweets hampers.",
    "productType": "Festive Specials",
    "categoryHandles": [
      "festive"
    ],
    "tags": [
      "rangoli & decor stickers",
      "festive",
      "sticker"
    ],
    "badges": [],
    "images": [
      {
        "url": "",
        "altText": "Rangoli & Decor Stickers preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "sticker",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Rangoli & Decor Stickers detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "sticker",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Rangoli & Decor Stickers packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "sticker",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Edition",
        "values": [
          "Classic Festive",
          "Royal Gold Suite",
          "Eco Handcrafted"
        ]
      },
      {
        "name": "Quantity Pack",
        "values": [
          "Single Pack",
          "Family Pack of 5",
          "Corporate Hamper Pack of 25"
        ]
      }
    ],
    "variants": [
      {
        "id": "rangoli-decor-stickers-classic",
        "title": "Classic Festive",
        "sku": "FST-RANG-CLS",
        price: money(49900),
        compareAtPrice: money(64900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Edition",
            "value": "Classic Festive"
          },
          {
            "name": "Quantity Pack",
            "value": "Single Pack"
          }
        ]
      },
      {
        "id": "rangoli-decor-stickers-royal",
        "title": "Royal Gold Suite",
        "sku": "FST-RANG-RYL",
        price: money(74900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.5,
        "selectedOptions": [
          {
            "name": "Edition",
            "value": "Royal Gold Suite"
          },
          {
            "name": "Quantity Pack",
            "value": "Single Pack"
          }
        ]
      }
    ],
    priceFrom: money(49900),
    compareAtFrom: money(64900),
    "quantityTiers": [
      {
        "qty": 1,
        price: money(49900),
        compareAtPrice: money(64900)
      },
      {
        "qty": 10,
        price: money(439100)
      },
      {
        "qty": 50,
        price: money(1896200),
        "note": "Festive Corporate"
      }
    ],
    "priceUnit": "per set",
    "specs": [
      {
        "label": "Finishing",
        "value": "Hot Foil Stamping & Embossed Accents"
      },
      {
        "label": "Paper Type",
        "value": "350 GSM Textured Metallic Pearl Card"
      },
      {
        "label": "Envelope / Box",
        "value": "Custom matching lined envelope included"
      },
      {
        "label": "Seasonality",
        "value": "Limited Seasonal Run"
      }
    ],
    "minOrderQty": 1,
    "turnaroundDays": 2,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.9,
    "reviewCount": 390,
    "faqs": [
      {
        "q": "Can corporate greeting cards include custom signatures?",
        "a": "Yes, upload your team signatures and logo to have them printed in matching metallic ink."
      },
      {
        "q": "When is the cutoff date for Diwali bulk deliveries?",
        "a": "We recommend locking orders 10 business days before Diwali to guarantee on-time transit."
      },
      {
        "q": "Do you provide sweet box inner partitions?",
        "a": "Yes, our hamper boxes include food-grade compartmentalized inserts for dry fruits and sweets."
      }
    ],
    "relatedHandles": [
      "custom-diyas-gift-boxes",
      "diwali-cards",
      "diwali-hampers",
      "corporate-diwali-gifting"
    ],
    "highlights": [
      "Gilded gold foil stamping and intricate laser-cut patterns",
      "Matching bespoke packaging boxes and envelope seals",
      "Personalized greeting messages and custom corporate logos"
    ]
  },
  {
    "id": "prod-navratri-decor-kits",
    "handle": "navratri-decor-kits",
    "title": "Navratri Decor Kits",
    "subtitle": "Curated festive packaging, greeting suites, and celebratory decor",
    "description": "Celebrate auspicious occasions in style with custom Navratri Decor Kits. Foil stamped motifs, handmade artisanal textures, and custom sweets hampers.",
    "productType": "Festive Specials",
    "categoryHandles": [
      "festive"
    ],
    "tags": [
      "navratri decor kits",
      "festive",
      "generic",
      "festive"
    ],
    "badges": [
      "festive"
    ],
    "images": [
      {
        "url": "",
        "altText": "Navratri Decor Kits preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "generic",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Navratri Decor Kits detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "generic",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Navratri Decor Kits packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "generic",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Edition",
        "values": [
          "Classic Festive",
          "Royal Gold Suite",
          "Eco Handcrafted"
        ]
      },
      {
        "name": "Quantity Pack",
        "values": [
          "Single Pack",
          "Family Pack of 5",
          "Corporate Hamper Pack of 25"
        ]
      }
    ],
    "variants": [
      {
        "id": "navratri-decor-kits-classic",
        "title": "Classic Festive",
        "sku": "FST-NAVR-CLS",
        price: money(49900),
        compareAtPrice: money(64900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Edition",
            "value": "Classic Festive"
          },
          {
            "name": "Quantity Pack",
            "value": "Single Pack"
          }
        ]
      },
      {
        "id": "navratri-decor-kits-royal",
        "title": "Royal Gold Suite",
        "sku": "FST-NAVR-RYL",
        price: money(74900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.5,
        "selectedOptions": [
          {
            "name": "Edition",
            "value": "Royal Gold Suite"
          },
          {
            "name": "Quantity Pack",
            "value": "Single Pack"
          }
        ]
      }
    ],
    priceFrom: money(49900),
    compareAtFrom: money(64900),
    "quantityTiers": [
      {
        "qty": 1,
        price: money(49900),
        compareAtPrice: money(64900)
      },
      {
        "qty": 10,
        price: money(439100)
      },
      {
        "qty": 50,
        price: money(1896200),
        "note": "Festive Corporate"
      }
    ],
    "priceUnit": "per set",
    "specs": [
      {
        "label": "Finishing",
        "value": "Hot Foil Stamping & Embossed Accents"
      },
      {
        "label": "Paper Type",
        "value": "350 GSM Textured Metallic Pearl Card"
      },
      {
        "label": "Envelope / Box",
        "value": "Custom matching lined envelope included"
      },
      {
        "label": "Seasonality",
        "value": "Limited Seasonal Run"
      }
    ],
    "minOrderQty": 1,
    "turnaroundDays": 2,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.9,
    "reviewCount": 382,
    "faqs": [
      {
        "q": "Can corporate greeting cards include custom signatures?",
        "a": "Yes, upload your team signatures and logo to have them printed in matching metallic ink."
      },
      {
        "q": "When is the cutoff date for Diwali bulk deliveries?",
        "a": "We recommend locking orders 10 business days before Diwali to guarantee on-time transit."
      },
      {
        "q": "Do you provide sweet box inner partitions?",
        "a": "Yes, our hamper boxes include food-grade compartmentalized inserts for dry fruits and sweets."
      }
    ],
    "relatedHandles": [
      "custom-diyas-gift-boxes",
      "diwali-cards",
      "diwali-hampers",
      "corporate-diwali-gifting"
    ],
    "highlights": [
      "Gilded gold foil stamping and intricate laser-cut patterns",
      "Matching bespoke packaging boxes and envelope seals",
      "Personalized greeting messages and custom corporate logos"
    ]
  },
  {
    "id": "prod-garba-event-standees",
    "handle": "garba-event-standees",
    "title": "Garba Event Standees",
    "subtitle": "Curated festive packaging, greeting suites, and celebratory decor",
    "description": "Celebrate auspicious occasions in style with custom Garba Event Standees. Foil stamped motifs, handmade artisanal textures, and custom sweets hampers.",
    "productType": "Festive Specials",
    "categoryHandles": [
      "festive"
    ],
    "tags": [
      "garba event standees",
      "festive",
      "signage"
    ],
    "badges": [],
    "images": [
      {
        "url": "",
        "altText": "Garba Event Standees preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "signage",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Garba Event Standees detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "signage",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Garba Event Standees packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "signage",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Edition",
        "values": [
          "Classic Festive",
          "Royal Gold Suite",
          "Eco Handcrafted"
        ]
      },
      {
        "name": "Quantity Pack",
        "values": [
          "Single Pack",
          "Family Pack of 5",
          "Corporate Hamper Pack of 25"
        ]
      }
    ],
    "variants": [
      {
        "id": "garba-event-standees-classic",
        "title": "Classic Festive",
        "sku": "FST-GARB-CLS",
        price: money(49900),
        compareAtPrice: money(64900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Edition",
            "value": "Classic Festive"
          },
          {
            "name": "Quantity Pack",
            "value": "Single Pack"
          }
        ]
      },
      {
        "id": "garba-event-standees-royal",
        "title": "Royal Gold Suite",
        "sku": "FST-GARB-RYL",
        price: money(74900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.5,
        "selectedOptions": [
          {
            "name": "Edition",
            "value": "Royal Gold Suite"
          },
          {
            "name": "Quantity Pack",
            "value": "Single Pack"
          }
        ]
      }
    ],
    priceFrom: money(49900),
    compareAtFrom: money(64900),
    "quantityTiers": [
      {
        "qty": 1,
        price: money(49900),
        compareAtPrice: money(64900)
      },
      {
        "qty": 10,
        price: money(439100)
      },
      {
        "qty": 50,
        price: money(1896200),
        "note": "Festive Corporate"
      }
    ],
    "priceUnit": "per set",
    "specs": [
      {
        "label": "Finishing",
        "value": "Hot Foil Stamping & Embossed Accents"
      },
      {
        "label": "Paper Type",
        "value": "350 GSM Textured Metallic Pearl Card"
      },
      {
        "label": "Envelope / Box",
        "value": "Custom matching lined envelope included"
      },
      {
        "label": "Seasonality",
        "value": "Limited Seasonal Run"
      }
    ],
    "minOrderQty": 1,
    "turnaroundDays": 2,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.8,
    "reviewCount": 453,
    "faqs": [
      {
        "q": "Can corporate greeting cards include custom signatures?",
        "a": "Yes, upload your team signatures and logo to have them printed in matching metallic ink."
      },
      {
        "q": "When is the cutoff date for Diwali bulk deliveries?",
        "a": "We recommend locking orders 10 business days before Diwali to guarantee on-time transit."
      },
      {
        "q": "Do you provide sweet box inner partitions?",
        "a": "Yes, our hamper boxes include food-grade compartmentalized inserts for dry fruits and sweets."
      }
    ],
    "relatedHandles": [
      "custom-diyas-gift-boxes",
      "diwali-cards",
      "diwali-hampers",
      "corporate-diwali-gifting"
    ],
    "highlights": [
      "Gilded gold foil stamping and intricate laser-cut patterns",
      "Matching bespoke packaging boxes and envelope seals",
      "Personalized greeting messages and custom corporate logos"
    ]
  },
  {
    "id": "prod-dussehra-greeting-cards",
    "handle": "dussehra-greeting-cards",
    "title": "Dussehra Greeting Cards",
    "subtitle": "Curated festive packaging, greeting suites, and celebratory decor",
    "description": "Celebrate auspicious occasions in style with custom Dussehra Greeting Cards. Foil stamped motifs, handmade artisanal textures, and custom sweets hampers.",
    "productType": "Festive Specials",
    "categoryHandles": [
      "festive"
    ],
    "tags": [
      "dussehra greeting cards",
      "festive",
      "card"
    ],
    "badges": [],
    "images": [
      {
        "url": "",
        "altText": "Dussehra Greeting Cards preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Dussehra Greeting Cards detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Dussehra Greeting Cards packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Edition",
        "values": [
          "Classic Festive",
          "Royal Gold Suite",
          "Eco Handcrafted"
        ]
      },
      {
        "name": "Quantity Pack",
        "values": [
          "Single Pack",
          "Family Pack of 5",
          "Corporate Hamper Pack of 25"
        ]
      }
    ],
    "variants": [
      {
        "id": "dussehra-greeting-cards-classic",
        "title": "Classic Festive",
        "sku": "FST-DUSS-CLS",
        price: money(49900),
        compareAtPrice: money(64900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Edition",
            "value": "Classic Festive"
          },
          {
            "name": "Quantity Pack",
            "value": "Single Pack"
          }
        ]
      },
      {
        "id": "dussehra-greeting-cards-royal",
        "title": "Royal Gold Suite",
        "sku": "FST-DUSS-RYL",
        price: money(74900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.5,
        "selectedOptions": [
          {
            "name": "Edition",
            "value": "Royal Gold Suite"
          },
          {
            "name": "Quantity Pack",
            "value": "Single Pack"
          }
        ]
      }
    ],
    priceFrom: money(49900),
    compareAtFrom: money(64900),
    "quantityTiers": [
      {
        "qty": 1,
        price: money(49900),
        compareAtPrice: money(64900)
      },
      {
        "qty": 10,
        price: money(439100)
      },
      {
        "qty": 50,
        price: money(1896200),
        "note": "Festive Corporate"
      }
    ],
    "priceUnit": "per set",
    "specs": [
      {
        "label": "Finishing",
        "value": "Hot Foil Stamping & Embossed Accents"
      },
      {
        "label": "Paper Type",
        "value": "350 GSM Textured Metallic Pearl Card"
      },
      {
        "label": "Envelope / Box",
        "value": "Custom matching lined envelope included"
      },
      {
        "label": "Seasonality",
        "value": "Limited Seasonal Run"
      }
    ],
    "minOrderQty": 1,
    "turnaroundDays": 2,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.9,
    "reviewCount": 484,
    "faqs": [
      {
        "q": "Can corporate greeting cards include custom signatures?",
        "a": "Yes, upload your team signatures and logo to have them printed in matching metallic ink."
      },
      {
        "q": "When is the cutoff date for Diwali bulk deliveries?",
        "a": "We recommend locking orders 10 business days before Diwali to guarantee on-time transit."
      },
      {
        "q": "Do you provide sweet box inner partitions?",
        "a": "Yes, our hamper boxes include food-grade compartmentalized inserts for dry fruits and sweets."
      }
    ],
    "relatedHandles": [
      "custom-diyas-gift-boxes",
      "diwali-cards",
      "diwali-hampers",
      "corporate-diwali-gifting"
    ],
    "highlights": [
      "Gilded gold foil stamping and intricate laser-cut patterns",
      "Matching bespoke packaging boxes and envelope seals",
      "Personalized greeting messages and custom corporate logos"
    ]
  },
  {
    "id": "prod-festive-photo-gifts",
    "handle": "festive-photo-gifts",
    "title": "Festive Photo Gifts",
    "subtitle": "Curated festive packaging, greeting suites, and celebratory decor",
    "description": "Celebrate auspicious occasions in style with custom Festive Photo Gifts. Foil stamped motifs, handmade artisanal textures, and custom sweets hampers.",
    "productType": "Festive Specials",
    "categoryHandles": [
      "festive"
    ],
    "tags": [
      "festive photo gifts",
      "festive",
      "generic",
      "popular"
    ],
    "badges": [
      "popular"
    ],
    "images": [
      {
        "url": "",
        "altText": "Festive Photo Gifts preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "generic",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Festive Photo Gifts detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "generic",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Festive Photo Gifts packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "generic",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Edition",
        "values": [
          "Classic Festive",
          "Royal Gold Suite",
          "Eco Handcrafted"
        ]
      },
      {
        "name": "Quantity Pack",
        "values": [
          "Single Pack",
          "Family Pack of 5",
          "Corporate Hamper Pack of 25"
        ]
      }
    ],
    "variants": [
      {
        "id": "festive-photo-gifts-classic",
        "title": "Classic Festive",
        "sku": "FST-FEST-CLS",
        price: money(49900),
        compareAtPrice: money(64900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Edition",
            "value": "Classic Festive"
          },
          {
            "name": "Quantity Pack",
            "value": "Single Pack"
          }
        ]
      },
      {
        "id": "festive-photo-gifts-royal",
        "title": "Royal Gold Suite",
        "sku": "FST-FEST-RYL",
        price: money(74900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.5,
        "selectedOptions": [
          {
            "name": "Edition",
            "value": "Royal Gold Suite"
          },
          {
            "name": "Quantity Pack",
            "value": "Single Pack"
          }
        ]
      }
    ],
    priceFrom: money(49900),
    compareAtFrom: money(64900),
    "quantityTiers": [
      {
        "qty": 1,
        price: money(49900),
        compareAtPrice: money(64900)
      },
      {
        "qty": 10,
        price: money(439100)
      },
      {
        "qty": 50,
        price: money(1896200),
        "note": "Festive Corporate"
      }
    ],
    "priceUnit": "per set",
    "specs": [
      {
        "label": "Finishing",
        "value": "Hot Foil Stamping & Embossed Accents"
      },
      {
        "label": "Paper Type",
        "value": "350 GSM Textured Metallic Pearl Card"
      },
      {
        "label": "Envelope / Box",
        "value": "Custom matching lined envelope included"
      },
      {
        "label": "Seasonality",
        "value": "Limited Seasonal Run"
      }
    ],
    "minOrderQty": 1,
    "turnaroundDays": 2,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.5,
    "reviewCount": 660,
    "faqs": [
      {
        "q": "Can corporate greeting cards include custom signatures?",
        "a": "Yes, upload your team signatures and logo to have them printed in matching metallic ink."
      },
      {
        "q": "When is the cutoff date for Diwali bulk deliveries?",
        "a": "We recommend locking orders 10 business days before Diwali to guarantee on-time transit."
      },
      {
        "q": "Do you provide sweet box inner partitions?",
        "a": "Yes, our hamper boxes include food-grade compartmentalized inserts for dry fruits and sweets."
      }
    ],
    "relatedHandles": [
      "custom-diyas-gift-boxes",
      "diwali-cards",
      "diwali-hampers",
      "corporate-diwali-gifting"
    ],
    "highlights": [
      "Gilded gold foil stamping and intricate laser-cut patterns",
      "Matching bespoke packaging boxes and envelope seals",
      "Personalized greeting messages and custom corporate logos"
    ]
  },
  {
    "id": "prod-christmas-cards",
    "handle": "christmas-cards",
    "title": "Christmas Cards",
    "subtitle": "Curated festive packaging, greeting suites, and celebratory decor",
    "description": "Celebrate auspicious occasions in style with custom Christmas Cards. Foil stamped motifs, handmade artisanal textures, and custom sweets hampers.",
    "productType": "Festive Specials",
    "categoryHandles": [
      "festive"
    ],
    "tags": [
      "christmas cards",
      "festive",
      "card",
      "festive"
    ],
    "badges": [
      "festive"
    ],
    "images": [
      {
        "url": "",
        "altText": "Christmas Cards preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Christmas Cards detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Christmas Cards packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Edition",
        "values": [
          "Classic Festive",
          "Royal Gold Suite",
          "Eco Handcrafted"
        ]
      },
      {
        "name": "Quantity Pack",
        "values": [
          "Single Pack",
          "Family Pack of 5",
          "Corporate Hamper Pack of 25"
        ]
      }
    ],
    "variants": [
      {
        "id": "christmas-cards-classic",
        "title": "Classic Festive",
        "sku": "FST-CHRI-CLS",
        price: money(49900),
        compareAtPrice: money(64900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Edition",
            "value": "Classic Festive"
          },
          {
            "name": "Quantity Pack",
            "value": "Single Pack"
          }
        ]
      },
      {
        "id": "christmas-cards-royal",
        "title": "Royal Gold Suite",
        "sku": "FST-CHRI-RYL",
        price: money(74900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.5,
        "selectedOptions": [
          {
            "name": "Edition",
            "value": "Royal Gold Suite"
          },
          {
            "name": "Quantity Pack",
            "value": "Single Pack"
          }
        ]
      }
    ],
    priceFrom: money(49900),
    compareAtFrom: money(64900),
    "quantityTiers": [
      {
        "qty": 1,
        price: money(49900),
        compareAtPrice: money(64900)
      },
      {
        "qty": 10,
        price: money(439100)
      },
      {
        "qty": 50,
        price: money(1896200),
        "note": "Festive Corporate"
      }
    ],
    "priceUnit": "per set",
    "specs": [
      {
        "label": "Finishing",
        "value": "Hot Foil Stamping & Embossed Accents"
      },
      {
        "label": "Paper Type",
        "value": "350 GSM Textured Metallic Pearl Card"
      },
      {
        "label": "Envelope / Box",
        "value": "Custom matching lined envelope included"
      },
      {
        "label": "Seasonality",
        "value": "Limited Seasonal Run"
      }
    ],
    "minOrderQty": 1,
    "turnaroundDays": 2,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.6,
    "reviewCount": 59,
    "faqs": [
      {
        "q": "Can corporate greeting cards include custom signatures?",
        "a": "Yes, upload your team signatures and logo to have them printed in matching metallic ink."
      },
      {
        "q": "When is the cutoff date for Diwali bulk deliveries?",
        "a": "We recommend locking orders 10 business days before Diwali to guarantee on-time transit."
      },
      {
        "q": "Do you provide sweet box inner partitions?",
        "a": "Yes, our hamper boxes include food-grade compartmentalized inserts for dry fruits and sweets."
      }
    ],
    "relatedHandles": [
      "custom-diyas-gift-boxes",
      "diwali-cards",
      "diwali-hampers",
      "corporate-diwali-gifting"
    ],
    "highlights": [
      "Gilded gold foil stamping and intricate laser-cut patterns",
      "Matching bespoke packaging boxes and envelope seals",
      "Personalized greeting messages and custom corporate logos"
    ]
  },
  {
    "id": "prod-christmas-decor",
    "handle": "christmas-decor",
    "title": "Christmas Decor",
    "subtitle": "Curated festive packaging, greeting suites, and celebratory decor",
    "description": "Celebrate auspicious occasions in style with custom Christmas Decor. Foil stamped motifs, handmade artisanal textures, and custom sweets hampers.",
    "productType": "Festive Specials",
    "categoryHandles": [
      "festive"
    ],
    "tags": [
      "christmas decor",
      "festive",
      "generic"
    ],
    "badges": [],
    "images": [
      {
        "url": "",
        "altText": "Christmas Decor preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "generic",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Christmas Decor detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "generic",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Christmas Decor packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "generic",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Edition",
        "values": [
          "Classic Festive",
          "Royal Gold Suite",
          "Eco Handcrafted"
        ]
      },
      {
        "name": "Quantity Pack",
        "values": [
          "Single Pack",
          "Family Pack of 5",
          "Corporate Hamper Pack of 25"
        ]
      }
    ],
    "variants": [
      {
        "id": "christmas-decor-classic",
        "title": "Classic Festive",
        "sku": "FST-CHRI-CLS",
        price: money(49900),
        compareAtPrice: money(64900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Edition",
            "value": "Classic Festive"
          },
          {
            "name": "Quantity Pack",
            "value": "Single Pack"
          }
        ]
      },
      {
        "id": "christmas-decor-royal",
        "title": "Royal Gold Suite",
        "sku": "FST-CHRI-RYL",
        price: money(74900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.5,
        "selectedOptions": [
          {
            "name": "Edition",
            "value": "Royal Gold Suite"
          },
          {
            "name": "Quantity Pack",
            "value": "Single Pack"
          }
        ]
      }
    ],
    priceFrom: money(49900),
    compareAtFrom: money(64900),
    "quantityTiers": [
      {
        "qty": 1,
        price: money(49900),
        compareAtPrice: money(64900)
      },
      {
        "qty": 10,
        price: money(439100)
      },
      {
        "qty": 50,
        price: money(1896200),
        "note": "Festive Corporate"
      }
    ],
    "priceUnit": "per set",
    "specs": [
      {
        "label": "Finishing",
        "value": "Hot Foil Stamping & Embossed Accents"
      },
      {
        "label": "Paper Type",
        "value": "350 GSM Textured Metallic Pearl Card"
      },
      {
        "label": "Envelope / Box",
        "value": "Custom matching lined envelope included"
      },
      {
        "label": "Seasonality",
        "value": "Limited Seasonal Run"
      }
    ],
    "minOrderQty": 1,
    "turnaroundDays": 2,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.6,
    "reviewCount": 369,
    "faqs": [
      {
        "q": "Can corporate greeting cards include custom signatures?",
        "a": "Yes, upload your team signatures and logo to have them printed in matching metallic ink."
      },
      {
        "q": "When is the cutoff date for Diwali bulk deliveries?",
        "a": "We recommend locking orders 10 business days before Diwali to guarantee on-time transit."
      },
      {
        "q": "Do you provide sweet box inner partitions?",
        "a": "Yes, our hamper boxes include food-grade compartmentalized inserts for dry fruits and sweets."
      }
    ],
    "relatedHandles": [
      "custom-diyas-gift-boxes",
      "diwali-cards",
      "diwali-hampers",
      "corporate-diwali-gifting"
    ],
    "highlights": [
      "Gilded gold foil stamping and intricate laser-cut patterns",
      "Matching bespoke packaging boxes and envelope seals",
      "Personalized greeting messages and custom corporate logos"
    ]
  },
  {
    "id": "prod-new-year-desk-calendars",
    "handle": "new-year-desk-calendars",
    "title": "New Year Desk Calendars",
    "subtitle": "Curated festive packaging, greeting suites, and celebratory decor",
    "description": "Celebrate auspicious occasions in style with custom New Year Desk Calendars. Foil stamped motifs, handmade artisanal textures, and custom sweets hampers.",
    "productType": "Festive Specials",
    "categoryHandles": [
      "festive"
    ],
    "tags": [
      "new year desk calendars",
      "festive",
      "calendar",
      "bestseller"
    ],
    "badges": [
      "bestseller"
    ],
    "images": [
      {
        "url": "",
        "altText": "New Year Desk Calendars preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "calendar",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "New Year Desk Calendars detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "calendar",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "New Year Desk Calendars packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "calendar",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Edition",
        "values": [
          "Classic Festive",
          "Royal Gold Suite",
          "Eco Handcrafted"
        ]
      },
      {
        "name": "Quantity Pack",
        "values": [
          "Single Pack",
          "Family Pack of 5",
          "Corporate Hamper Pack of 25"
        ]
      }
    ],
    "variants": [
      {
        "id": "new-year-desk-calendars-classic",
        "title": "Classic Festive",
        "sku": "FST-NEW--CLS",
        price: money(49900),
        compareAtPrice: money(64900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Edition",
            "value": "Classic Festive"
          },
          {
            "name": "Quantity Pack",
            "value": "Single Pack"
          }
        ]
      },
      {
        "id": "new-year-desk-calendars-royal",
        "title": "Royal Gold Suite",
        "sku": "FST-NEW--RYL",
        price: money(74900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.5,
        "selectedOptions": [
          {
            "name": "Edition",
            "value": "Royal Gold Suite"
          },
          {
            "name": "Quantity Pack",
            "value": "Single Pack"
          }
        ]
      }
    ],
    priceFrom: money(49900),
    compareAtFrom: money(64900),
    "quantityTiers": [
      {
        "qty": 1,
        price: money(49900),
        compareAtPrice: money(64900)
      },
      {
        "qty": 10,
        price: money(439100)
      },
      {
        "qty": 50,
        price: money(1896200),
        "note": "Festive Corporate"
      }
    ],
    "priceUnit": "per set",
    "specs": [
      {
        "label": "Finishing",
        "value": "Hot Foil Stamping & Embossed Accents"
      },
      {
        "label": "Paper Type",
        "value": "350 GSM Textured Metallic Pearl Card"
      },
      {
        "label": "Envelope / Box",
        "value": "Custom matching lined envelope included"
      },
      {
        "label": "Seasonality",
        "value": "Limited Seasonal Run"
      }
    ],
    "minOrderQty": 1,
    "turnaroundDays": 2,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.6,
    "reviewCount": 215,
    "faqs": [
      {
        "q": "Can corporate greeting cards include custom signatures?",
        "a": "Yes, upload your team signatures and logo to have them printed in matching metallic ink."
      },
      {
        "q": "When is the cutoff date for Diwali bulk deliveries?",
        "a": "We recommend locking orders 10 business days before Diwali to guarantee on-time transit."
      },
      {
        "q": "Do you provide sweet box inner partitions?",
        "a": "Yes, our hamper boxes include food-grade compartmentalized inserts for dry fruits and sweets."
      }
    ],
    "relatedHandles": [
      "custom-diyas-gift-boxes",
      "diwali-cards",
      "diwali-hampers",
      "corporate-diwali-gifting"
    ],
    "highlights": [
      "Gilded gold foil stamping and intricate laser-cut patterns",
      "Matching bespoke packaging boxes and envelope seals",
      "Personalized greeting messages and custom corporate logos"
    ]
  },
  {
    "id": "prod-new-year-diaries",
    "handle": "new-year-diaries",
    "title": "New Year Diaries",
    "subtitle": "Curated festive packaging, greeting suites, and celebratory decor",
    "description": "Celebrate auspicious occasions in style with custom New Year Diaries. Foil stamped motifs, handmade artisanal textures, and custom sweets hampers.",
    "productType": "Festive Specials",
    "categoryHandles": [
      "festive"
    ],
    "tags": [
      "new year diaries",
      "festive",
      "generic"
    ],
    "badges": [],
    "images": [
      {
        "url": "",
        "altText": "New Year Diaries preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "generic",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "New Year Diaries detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "generic",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "New Year Diaries packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "generic",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Edition",
        "values": [
          "Classic Festive",
          "Royal Gold Suite",
          "Eco Handcrafted"
        ]
      },
      {
        "name": "Quantity Pack",
        "values": [
          "Single Pack",
          "Family Pack of 5",
          "Corporate Hamper Pack of 25"
        ]
      }
    ],
    "variants": [
      {
        "id": "new-year-diaries-classic",
        "title": "Classic Festive",
        "sku": "FST-NEW--CLS",
        price: money(49900),
        compareAtPrice: money(64900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Edition",
            "value": "Classic Festive"
          },
          {
            "name": "Quantity Pack",
            "value": "Single Pack"
          }
        ]
      },
      {
        "id": "new-year-diaries-royal",
        "title": "Royal Gold Suite",
        "sku": "FST-NEW--RYL",
        price: money(74900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.5,
        "selectedOptions": [
          {
            "name": "Edition",
            "value": "Royal Gold Suite"
          },
          {
            "name": "Quantity Pack",
            "value": "Single Pack"
          }
        ]
      }
    ],
    priceFrom: money(49900),
    compareAtFrom: money(64900),
    "quantityTiers": [
      {
        "qty": 1,
        price: money(49900),
        compareAtPrice: money(64900)
      },
      {
        "qty": 10,
        price: money(439100)
      },
      {
        "qty": 50,
        price: money(1896200),
        "note": "Festive Corporate"
      }
    ],
    "priceUnit": "per set",
    "specs": [
      {
        "label": "Finishing",
        "value": "Hot Foil Stamping & Embossed Accents"
      },
      {
        "label": "Paper Type",
        "value": "350 GSM Textured Metallic Pearl Card"
      },
      {
        "label": "Envelope / Box",
        "value": "Custom matching lined envelope included"
      },
      {
        "label": "Seasonality",
        "value": "Limited Seasonal Run"
      }
    ],
    "minOrderQty": 1,
    "turnaroundDays": 2,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.6,
    "reviewCount": 561,
    "faqs": [
      {
        "q": "Can corporate greeting cards include custom signatures?",
        "a": "Yes, upload your team signatures and logo to have them printed in matching metallic ink."
      },
      {
        "q": "When is the cutoff date for Diwali bulk deliveries?",
        "a": "We recommend locking orders 10 business days before Diwali to guarantee on-time transit."
      },
      {
        "q": "Do you provide sweet box inner partitions?",
        "a": "Yes, our hamper boxes include food-grade compartmentalized inserts for dry fruits and sweets."
      }
    ],
    "relatedHandles": [
      "custom-diyas-gift-boxes",
      "diwali-cards",
      "diwali-hampers",
      "corporate-diwali-gifting"
    ],
    "highlights": [
      "Gilded gold foil stamping and intricate laser-cut patterns",
      "Matching bespoke packaging boxes and envelope seals",
      "Personalized greeting messages and custom corporate logos"
    ]
  }
];
