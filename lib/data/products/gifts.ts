import { money, type Product } from "@/lib/commerce/types";

export const giftProducts: Product[] = [
  {
    "id": "prod-classic-photo-prints",
    "handle": "classic-photo-prints",
    "title": "Classic Photo Prints",
    "subtitle": "High-gloss finish, customized photo reproduction with vibrant tone",
    "description": "Cherish your favorite memories with custom Classic Photo Prints. Crafted from handpicked materials to deliver exceptional visual depth and durability.",
    "productType": "Personalised Gifts",
    "categoryHandles": [
      "same-day",
      "personalised-gifts"
    ],
    "tags": [
      "classic photo prints",
      "personalised gifts",
      "photo-print",
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
        "altText": "Classic Photo Prints preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "photo-print",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Classic Photo Prints detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "photo-print",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Classic Photo Prints packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "photo-print",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Size",
        "values": [
          "Standard (A5 / 6x4)",
          "Medium (A4 / 8x6)",
          "Large (A3 / 12x8)"
        ]
      },
      {
        "name": "Finish",
        "values": [
          "Glossy Photo",
          "Matte Fine Art",
          "Metallic Luster"
        ]
      }
    ],
    "variants": [
      {
        "id": "classic-photo-prints-std-gloss",
        "title": "Standard / Glossy",
        "sku": "GFT-CLAS-STDG",
        price: money(19900),
        compareAtPrice: money(24900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "Standard (A5 / 6x4)"
          },
          {
            "name": "Finish",
            "value": "Glossy Photo"
          }
        ]
      },
      {
        "id": "classic-photo-prints-med-gloss",
        "title": "Medium / Glossy",
        "sku": "GFT-CLAS-MEDG",
        price: money(29900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.5,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "Medium (A4 / 8x6)"
          },
          {
            "name": "Finish",
            "value": "Glossy Photo"
          }
        ]
      }
    ],
    priceFrom: money(19900),
    compareAtFrom: money(24900),
    "quantityTiers": [
      {
        "qty": 1,
        price: money(19900),
        compareAtPrice: money(24900)
      },
      {
        "qty": 5,
        price: money(87600)
      },
      {
        "qty": 10,
        price: money(163200),
        "note": "Gift Pack"
      }
    ],
    "priceUnit": "per piece",
    "specs": [
      {
        "label": "Print Quality",
        "value": "1200 DPI Photo Pigment Ink"
      },
      {
        "label": "Substrate",
        "value": "Premium Grade Media / Ceramic"
      },
      {
        "label": "UV Resistance",
        "value": "Fade-proof indoor rating (10+ years)"
      },
      {
        "label": "Packaging",
        "value": "Drop-safe bubble lined box"
      },
      {
        "label": "Lead Time",
        "value": "Same Day Express"
      }
    ],
    "minOrderQty": 1,
    "turnaroundDays": 1,
    "sameDayEligible": true,
    "customizable": true,
    "rating": 4.6,
    "reviewCount": 571,
    "faqs": [
      {
        "q": "Can I upload photos directly from my phone?",
        "a": "Yes, our upload portal and canvas editor accept phone images in JPG, PNG, and HEIC formats."
      },
      {
        "q": "Will low resolution photos look blurry?",
        "a": "Our automated checker flags low-resolution images before printing so you can swap them for sharper files."
      },
      {
        "q": "Are photo mugs microwave and dishwasher safe?",
        "a": "Yes, our sublimated ceramic mugs are tested safe for everyday microwave and dishwasher usage."
      }
    ],
    "relatedHandles": [
      "retro-polaroid-prints",
      "square-photo-prints",
      "passport-photos",
      "bulk-photo-prints"
    ],
    "highlights": [
      "Rich colour gradation and skin-tone reproduction",
      "Scratch-resistant protective exterior coating",
      "Gift-ready packaging with optional personalized note"
    ]
  },
  {
    "id": "prod-retro-polaroid-prints",
    "handle": "retro-polaroid-prints",
    "title": "Retro Polaroid Prints",
    "subtitle": "High-gloss finish, customized photo reproduction with vibrant tone",
    "description": "Cherish your favorite memories with custom Retro Polaroid Prints. Crafted from handpicked materials to deliver exceptional visual depth and durability.",
    "productType": "Personalised Gifts",
    "categoryHandles": [
      "personalised-gifts"
    ],
    "tags": [
      "retro polaroid prints",
      "personalised gifts",
      "photo-print",
      "popular"
    ],
    "badges": [
      "popular"
    ],
    "images": [
      {
        "url": "",
        "altText": "Retro Polaroid Prints preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "photo-print",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Retro Polaroid Prints detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "photo-print",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Retro Polaroid Prints packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "photo-print",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Size",
        "values": [
          "Standard (A5 / 6x4)",
          "Medium (A4 / 8x6)",
          "Large (A3 / 12x8)"
        ]
      },
      {
        "name": "Finish",
        "values": [
          "Glossy Photo",
          "Matte Fine Art",
          "Metallic Luster"
        ]
      }
    ],
    "variants": [
      {
        "id": "retro-polaroid-prints-std-gloss",
        "title": "Standard / Glossy",
        "sku": "GFT-RETR-STDG",
        price: money(19900),
        compareAtPrice: money(24900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "Standard (A5 / 6x4)"
          },
          {
            "name": "Finish",
            "value": "Glossy Photo"
          }
        ]
      },
      {
        "id": "retro-polaroid-prints-med-gloss",
        "title": "Medium / Glossy",
        "sku": "GFT-RETR-MEDG",
        price: money(29900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.5,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "Medium (A4 / 8x6)"
          },
          {
            "name": "Finish",
            "value": "Glossy Photo"
          }
        ]
      }
    ],
    priceFrom: money(19900),
    compareAtFrom: money(24900),
    "quantityTiers": [
      {
        "qty": 1,
        price: money(19900),
        compareAtPrice: money(24900)
      },
      {
        "qty": 5,
        price: money(87600)
      },
      {
        "qty": 10,
        price: money(163200),
        "note": "Gift Pack"
      }
    ],
    "priceUnit": "per piece",
    "specs": [
      {
        "label": "Print Quality",
        "value": "1200 DPI Photo Pigment Ink"
      },
      {
        "label": "Substrate",
        "value": "Premium Grade Media / Ceramic"
      },
      {
        "label": "UV Resistance",
        "value": "Fade-proof indoor rating (10+ years)"
      },
      {
        "label": "Packaging",
        "value": "Drop-safe bubble lined box"
      },
      {
        "label": "Lead Time",
        "value": "1 - 2 Business Days"
      }
    ],
    "minOrderQty": 1,
    "turnaroundDays": 2,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.6,
    "reviewCount": 455,
    "faqs": [
      {
        "q": "Can I upload photos directly from my phone?",
        "a": "Yes, our upload portal and canvas editor accept phone images in JPG, PNG, and HEIC formats."
      },
      {
        "q": "Will low resolution photos look blurry?",
        "a": "Our automated checker flags low-resolution images before printing so you can swap them for sharper files."
      },
      {
        "q": "Are photo mugs microwave and dishwasher safe?",
        "a": "Yes, our sublimated ceramic mugs are tested safe for everyday microwave and dishwasher usage."
      }
    ],
    "relatedHandles": [
      "classic-photo-prints",
      "square-photo-prints",
      "passport-photos",
      "bulk-photo-prints"
    ],
    "highlights": [
      "Rich colour gradation and skin-tone reproduction",
      "Scratch-resistant protective exterior coating",
      "Gift-ready packaging with optional personalized note"
    ]
  },
  {
    "id": "prod-square-photo-prints",
    "handle": "square-photo-prints",
    "title": "Square Photo Prints",
    "subtitle": "High-gloss finish, customized photo reproduction with vibrant tone",
    "description": "Cherish your favorite memories with custom Square Photo Prints. Crafted from handpicked materials to deliver exceptional visual depth and durability.",
    "productType": "Personalised Gifts",
    "categoryHandles": [
      "personalised-gifts"
    ],
    "tags": [
      "square photo prints",
      "personalised gifts",
      "photo-print"
    ],
    "badges": [],
    "images": [
      {
        "url": "",
        "altText": "Square Photo Prints preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "photo-print",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Square Photo Prints detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "photo-print",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Square Photo Prints packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "photo-print",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Size",
        "values": [
          "Standard (A5 / 6x4)",
          "Medium (A4 / 8x6)",
          "Large (A3 / 12x8)"
        ]
      },
      {
        "name": "Finish",
        "values": [
          "Glossy Photo",
          "Matte Fine Art",
          "Metallic Luster"
        ]
      }
    ],
    "variants": [
      {
        "id": "square-photo-prints-std-gloss",
        "title": "Standard / Glossy",
        "sku": "GFT-SQUA-STDG",
        price: money(19900),
        compareAtPrice: money(24900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "Standard (A5 / 6x4)"
          },
          {
            "name": "Finish",
            "value": "Glossy Photo"
          }
        ]
      },
      {
        "id": "square-photo-prints-med-gloss",
        "title": "Medium / Glossy",
        "sku": "GFT-SQUA-MEDG",
        price: money(29900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.5,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "Medium (A4 / 8x6)"
          },
          {
            "name": "Finish",
            "value": "Glossy Photo"
          }
        ]
      }
    ],
    priceFrom: money(19900),
    compareAtFrom: money(24900),
    "quantityTiers": [
      {
        "qty": 1,
        price: money(19900),
        compareAtPrice: money(24900)
      },
      {
        "qty": 5,
        price: money(87600)
      },
      {
        "qty": 10,
        price: money(163200),
        "note": "Gift Pack"
      }
    ],
    "priceUnit": "per piece",
    "specs": [
      {
        "label": "Print Quality",
        "value": "1200 DPI Photo Pigment Ink"
      },
      {
        "label": "Substrate",
        "value": "Premium Grade Media / Ceramic"
      },
      {
        "label": "UV Resistance",
        "value": "Fade-proof indoor rating (10+ years)"
      },
      {
        "label": "Packaging",
        "value": "Drop-safe bubble lined box"
      },
      {
        "label": "Lead Time",
        "value": "1 - 2 Business Days"
      }
    ],
    "minOrderQty": 1,
    "turnaroundDays": 2,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.5,
    "reviewCount": 540,
    "faqs": [
      {
        "q": "Can I upload photos directly from my phone?",
        "a": "Yes, our upload portal and canvas editor accept phone images in JPG, PNG, and HEIC formats."
      },
      {
        "q": "Will low resolution photos look blurry?",
        "a": "Our automated checker flags low-resolution images before printing so you can swap them for sharper files."
      },
      {
        "q": "Are photo mugs microwave and dishwasher safe?",
        "a": "Yes, our sublimated ceramic mugs are tested safe for everyday microwave and dishwasher usage."
      }
    ],
    "relatedHandles": [
      "classic-photo-prints",
      "retro-polaroid-prints",
      "passport-photos",
      "bulk-photo-prints"
    ],
    "highlights": [
      "Rich colour gradation and skin-tone reproduction",
      "Scratch-resistant protective exterior coating",
      "Gift-ready packaging with optional personalized note"
    ]
  },
  {
    "id": "prod-passport-photos",
    "handle": "passport-photos",
    "title": "Passport Photos",
    "subtitle": "High-gloss finish, customized photo reproduction with vibrant tone",
    "description": "Cherish your favorite memories with custom Passport Photos. Crafted from handpicked materials to deliver exceptional visual depth and durability.",
    "productType": "Personalised Gifts",
    "categoryHandles": [
      "personalised-gifts"
    ],
    "tags": [
      "passport photos",
      "personalised gifts",
      "photo-print",
      "same day",
      "express",
      "same-day"
    ],
    "badges": [
      "same-day"
    ],
    "images": [
      {
        "url": "",
        "altText": "Passport Photos preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "photo-print",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Passport Photos detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "photo-print",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Passport Photos packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "photo-print",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Size",
        "values": [
          "Standard (A5 / 6x4)",
          "Medium (A4 / 8x6)",
          "Large (A3 / 12x8)"
        ]
      },
      {
        "name": "Finish",
        "values": [
          "Glossy Photo",
          "Matte Fine Art",
          "Metallic Luster"
        ]
      }
    ],
    "variants": [
      {
        "id": "passport-photos-std-gloss",
        "title": "Standard / Glossy",
        "sku": "GFT-PASS-STDG",
        price: money(19900),
        compareAtPrice: money(24900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "Standard (A5 / 6x4)"
          },
          {
            "name": "Finish",
            "value": "Glossy Photo"
          }
        ]
      },
      {
        "id": "passport-photos-med-gloss",
        "title": "Medium / Glossy",
        "sku": "GFT-PASS-MEDG",
        price: money(29900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.5,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "Medium (A4 / 8x6)"
          },
          {
            "name": "Finish",
            "value": "Glossy Photo"
          }
        ]
      }
    ],
    priceFrom: money(19900),
    compareAtFrom: money(24900),
    "quantityTiers": [
      {
        "qty": 1,
        price: money(19900),
        compareAtPrice: money(24900)
      },
      {
        "qty": 5,
        price: money(87600)
      },
      {
        "qty": 10,
        price: money(163200),
        "note": "Gift Pack"
      }
    ],
    "priceUnit": "per piece",
    "specs": [
      {
        "label": "Print Quality",
        "value": "1200 DPI Photo Pigment Ink"
      },
      {
        "label": "Substrate",
        "value": "Premium Grade Media / Ceramic"
      },
      {
        "label": "UV Resistance",
        "value": "Fade-proof indoor rating (10+ years)"
      },
      {
        "label": "Packaging",
        "value": "Drop-safe bubble lined box"
      },
      {
        "label": "Lead Time",
        "value": "Same Day Express"
      }
    ],
    "minOrderQty": 1,
    "turnaroundDays": 1,
    "sameDayEligible": true,
    "customizable": true,
    "rating": 4.6,
    "reviewCount": 219,
    "faqs": [
      {
        "q": "Can I upload photos directly from my phone?",
        "a": "Yes, our upload portal and canvas editor accept phone images in JPG, PNG, and HEIC formats."
      },
      {
        "q": "Will low resolution photos look blurry?",
        "a": "Our automated checker flags low-resolution images before printing so you can swap them for sharper files."
      },
      {
        "q": "Are photo mugs microwave and dishwasher safe?",
        "a": "Yes, our sublimated ceramic mugs are tested safe for everyday microwave and dishwasher usage."
      }
    ],
    "relatedHandles": [
      "classic-photo-prints",
      "retro-polaroid-prints",
      "square-photo-prints",
      "bulk-photo-prints"
    ],
    "highlights": [
      "Rich colour gradation and skin-tone reproduction",
      "Scratch-resistant protective exterior coating",
      "Gift-ready packaging with optional personalized note"
    ]
  },
  {
    "id": "prod-bulk-photo-prints",
    "handle": "bulk-photo-prints",
    "title": "Bulk Photo Prints",
    "subtitle": "High-gloss finish, customized photo reproduction with vibrant tone",
    "description": "Cherish your favorite memories with custom Bulk Photo Prints. Crafted from handpicked materials to deliver exceptional visual depth and durability.",
    "productType": "Personalised Gifts",
    "categoryHandles": [
      "personalised-gifts",
      "bulk"
    ],
    "tags": [
      "bulk photo prints",
      "personalised gifts",
      "photo-print",
      "bulk-saver"
    ],
    "badges": [
      "bulk-saver"
    ],
    "images": [
      {
        "url": "",
        "altText": "Bulk Photo Prints preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "photo-print",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Bulk Photo Prints detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "photo-print",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Bulk Photo Prints packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "photo-print",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Size",
        "values": [
          "Standard (A5 / 6x4)",
          "Medium (A4 / 8x6)",
          "Large (A3 / 12x8)"
        ]
      },
      {
        "name": "Finish",
        "values": [
          "Glossy Photo",
          "Matte Fine Art",
          "Metallic Luster"
        ]
      }
    ],
    "variants": [
      {
        "id": "bulk-photo-prints-std-gloss",
        "title": "Standard / Glossy",
        "sku": "GFT-BULK-STDG",
        price: money(19900),
        compareAtPrice: money(24900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "Standard (A5 / 6x4)"
          },
          {
            "name": "Finish",
            "value": "Glossy Photo"
          }
        ]
      },
      {
        "id": "bulk-photo-prints-med-gloss",
        "title": "Medium / Glossy",
        "sku": "GFT-BULK-MEDG",
        price: money(29900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.5,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "Medium (A4 / 8x6)"
          },
          {
            "name": "Finish",
            "value": "Glossy Photo"
          }
        ]
      }
    ],
    priceFrom: money(19900),
    compareAtFrom: money(24900),
    "quantityTiers": [
      {
        "qty": 1,
        price: money(19900),
        compareAtPrice: money(24900)
      },
      {
        "qty": 5,
        price: money(87600)
      },
      {
        "qty": 10,
        price: money(163200),
        "note": "Gift Pack"
      }
    ],
    "priceUnit": "per piece",
    "specs": [
      {
        "label": "Print Quality",
        "value": "1200 DPI Photo Pigment Ink"
      },
      {
        "label": "Substrate",
        "value": "Premium Grade Media / Ceramic"
      },
      {
        "label": "UV Resistance",
        "value": "Fade-proof indoor rating (10+ years)"
      },
      {
        "label": "Packaging",
        "value": "Drop-safe bubble lined box"
      },
      {
        "label": "Lead Time",
        "value": "1 - 2 Business Days"
      }
    ],
    "minOrderQty": 1,
    "turnaroundDays": 2,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.6,
    "reviewCount": 515,
    "faqs": [
      {
        "q": "Can I upload photos directly from my phone?",
        "a": "Yes, our upload portal and canvas editor accept phone images in JPG, PNG, and HEIC formats."
      },
      {
        "q": "Will low resolution photos look blurry?",
        "a": "Our automated checker flags low-resolution images before printing so you can swap them for sharper files."
      },
      {
        "q": "Are photo mugs microwave and dishwasher safe?",
        "a": "Yes, our sublimated ceramic mugs are tested safe for everyday microwave and dishwasher usage."
      }
    ],
    "relatedHandles": [
      "classic-photo-prints",
      "retro-polaroid-prints",
      "square-photo-prints",
      "passport-photos"
    ],
    "highlights": [
      "Rich colour gradation and skin-tone reproduction",
      "Scratch-resistant protective exterior coating",
      "Gift-ready packaging with optional personalized note"
    ]
  },
  {
    "id": "prod-photo-albums",
    "handle": "photo-albums",
    "title": "Photo Albums & Books",
    "subtitle": "High-gloss finish, customized photo reproduction with vibrant tone",
    "description": "Cherish your favorite memories with custom Photo Albums & Books. Crafted from handpicked materials to deliver exceptional visual depth and durability.",
    "productType": "Personalised Gifts",
    "categoryHandles": [
      "personalised-gifts"
    ],
    "tags": [
      "photo albums & books",
      "personalised gifts",
      "album",
      "premium"
    ],
    "badges": [
      "premium"
    ],
    "images": [
      {
        "url": "",
        "altText": "Photo Albums & Books preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "album",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Photo Albums & Books detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "album",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Photo Albums & Books packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "album",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Size",
        "values": [
          "Standard (A5 / 6x4)",
          "Medium (A4 / 8x6)",
          "Large (A3 / 12x8)"
        ]
      },
      {
        "name": "Finish",
        "values": [
          "Glossy Photo",
          "Matte Fine Art",
          "Metallic Luster"
        ]
      }
    ],
    "variants": [
      {
        "id": "photo-albums-std-gloss",
        "title": "Standard / Glossy",
        "sku": "GFT-PHOT-STDG",
        price: money(19900),
        compareAtPrice: money(24900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "Standard (A5 / 6x4)"
          },
          {
            "name": "Finish",
            "value": "Glossy Photo"
          }
        ]
      },
      {
        "id": "photo-albums-med-gloss",
        "title": "Medium / Glossy",
        "sku": "GFT-PHOT-MEDG",
        price: money(29900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.5,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "Medium (A4 / 8x6)"
          },
          {
            "name": "Finish",
            "value": "Glossy Photo"
          }
        ]
      }
    ],
    priceFrom: money(19900),
    compareAtFrom: money(24900),
    "quantityTiers": [
      {
        "qty": 1,
        price: money(19900),
        compareAtPrice: money(24900)
      },
      {
        "qty": 5,
        price: money(87600)
      },
      {
        "qty": 10,
        price: money(163200),
        "note": "Gift Pack"
      }
    ],
    "priceUnit": "per piece",
    "specs": [
      {
        "label": "Print Quality",
        "value": "1200 DPI Photo Pigment Ink"
      },
      {
        "label": "Substrate",
        "value": "Premium Grade Media / Ceramic"
      },
      {
        "label": "UV Resistance",
        "value": "Fade-proof indoor rating (10+ years)"
      },
      {
        "label": "Packaging",
        "value": "Drop-safe bubble lined box"
      },
      {
        "label": "Lead Time",
        "value": "1 - 2 Business Days"
      }
    ],
    "minOrderQty": 1,
    "turnaroundDays": 2,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.7,
    "reviewCount": 678,
    "faqs": [
      {
        "q": "Can I upload photos directly from my phone?",
        "a": "Yes, our upload portal and canvas editor accept phone images in JPG, PNG, and HEIC formats."
      },
      {
        "q": "Will low resolution photos look blurry?",
        "a": "Our automated checker flags low-resolution images before printing so you can swap them for sharper files."
      },
      {
        "q": "Are photo mugs microwave and dishwasher safe?",
        "a": "Yes, our sublimated ceramic mugs are tested safe for everyday microwave and dishwasher usage."
      }
    ],
    "relatedHandles": [
      "classic-photo-prints",
      "retro-polaroid-prints",
      "square-photo-prints",
      "passport-photos"
    ],
    "highlights": [
      "Rich colour gradation and skin-tone reproduction",
      "Scratch-resistant protective exterior coating",
      "Gift-ready packaging with optional personalized note"
    ]
  },
  {
    "id": "prod-classic-photo-frames",
    "handle": "classic-photo-frames",
    "title": "Classic Photo Frames",
    "subtitle": "High-gloss finish, customized photo reproduction with vibrant tone",
    "description": "Cherish your favorite memories with custom Classic Photo Frames. Crafted from handpicked materials to deliver exceptional visual depth and durability.",
    "productType": "Personalised Gifts",
    "categoryHandles": [
      "personalised-gifts"
    ],
    "tags": [
      "classic photo frames",
      "personalised gifts",
      "frame",
      "popular"
    ],
    "badges": [
      "popular"
    ],
    "images": [
      {
        "url": "",
        "altText": "Classic Photo Frames preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "frame",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Classic Photo Frames detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "frame",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Classic Photo Frames packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "frame",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Size",
        "values": [
          "Standard (A5 / 6x4)",
          "Medium (A4 / 8x6)",
          "Large (A3 / 12x8)"
        ]
      },
      {
        "name": "Finish",
        "values": [
          "Glossy Photo",
          "Matte Fine Art",
          "Metallic Luster"
        ]
      }
    ],
    "variants": [
      {
        "id": "classic-photo-frames-std-gloss",
        "title": "Standard / Glossy",
        "sku": "GFT-CLAS-STDG",
        price: money(59900),
        compareAtPrice: money(79900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "Standard (A5 / 6x4)"
          },
          {
            "name": "Finish",
            "value": "Glossy Photo"
          }
        ]
      },
      {
        "id": "classic-photo-frames-med-gloss",
        "title": "Medium / Glossy",
        "sku": "GFT-CLAS-MEDG",
        price: money(89900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.5,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "Medium (A4 / 8x6)"
          },
          {
            "name": "Finish",
            "value": "Glossy Photo"
          }
        ]
      }
    ],
    priceFrom: money(59900),
    compareAtFrom: money(79900),
    "quantityTiers": [
      {
        "qty": 1,
        price: money(59900),
        compareAtPrice: money(79900)
      },
      {
        "qty": 5,
        price: money(263600)
      },
      {
        "qty": 10,
        price: money(491200),
        "note": "Gift Pack"
      }
    ],
    "priceUnit": "per piece",
    "specs": [
      {
        "label": "Print Quality",
        "value": "1200 DPI Photo Pigment Ink"
      },
      {
        "label": "Substrate",
        "value": "Premium Grade Media / Ceramic"
      },
      {
        "label": "UV Resistance",
        "value": "Fade-proof indoor rating (10+ years)"
      },
      {
        "label": "Packaging",
        "value": "Drop-safe bubble lined box"
      },
      {
        "label": "Lead Time",
        "value": "1 - 2 Business Days"
      }
    ],
    "minOrderQty": 1,
    "turnaroundDays": 2,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.8,
    "reviewCount": 601,
    "faqs": [
      {
        "q": "Can I upload photos directly from my phone?",
        "a": "Yes, our upload portal and canvas editor accept phone images in JPG, PNG, and HEIC formats."
      },
      {
        "q": "Will low resolution photos look blurry?",
        "a": "Our automated checker flags low-resolution images before printing so you can swap them for sharper files."
      },
      {
        "q": "Are photo mugs microwave and dishwasher safe?",
        "a": "Yes, our sublimated ceramic mugs are tested safe for everyday microwave and dishwasher usage."
      }
    ],
    "relatedHandles": [
      "classic-photo-prints",
      "retro-polaroid-prints",
      "square-photo-prints",
      "passport-photos"
    ],
    "highlights": [
      "Rich colour gradation and skin-tone reproduction",
      "Scratch-resistant protective exterior coating",
      "Gift-ready packaging with optional personalized note"
    ]
  },
  {
    "id": "prod-wall-photo-frames",
    "handle": "wall-photo-frames",
    "title": "Wall Photo Frames",
    "subtitle": "High-gloss finish, customized photo reproduction with vibrant tone",
    "description": "Cherish your favorite memories with custom Wall Photo Frames. Crafted from handpicked materials to deliver exceptional visual depth and durability.",
    "productType": "Personalised Gifts",
    "categoryHandles": [
      "personalised-gifts"
    ],
    "tags": [
      "wall photo frames",
      "personalised gifts",
      "frame"
    ],
    "badges": [],
    "images": [
      {
        "url": "",
        "altText": "Wall Photo Frames preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "frame",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Wall Photo Frames detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "frame",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Wall Photo Frames packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "frame",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Size",
        "values": [
          "Standard (A5 / 6x4)",
          "Medium (A4 / 8x6)",
          "Large (A3 / 12x8)"
        ]
      },
      {
        "name": "Finish",
        "values": [
          "Glossy Photo",
          "Matte Fine Art",
          "Metallic Luster"
        ]
      }
    ],
    "variants": [
      {
        "id": "wall-photo-frames-std-gloss",
        "title": "Standard / Glossy",
        "sku": "GFT-WALL-STDG",
        price: money(59900),
        compareAtPrice: money(79900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "Standard (A5 / 6x4)"
          },
          {
            "name": "Finish",
            "value": "Glossy Photo"
          }
        ]
      },
      {
        "id": "wall-photo-frames-med-gloss",
        "title": "Medium / Glossy",
        "sku": "GFT-WALL-MEDG",
        price: money(89900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.5,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "Medium (A4 / 8x6)"
          },
          {
            "name": "Finish",
            "value": "Glossy Photo"
          }
        ]
      }
    ],
    priceFrom: money(59900),
    compareAtFrom: money(79900),
    "quantityTiers": [
      {
        "qty": 1,
        price: money(59900),
        compareAtPrice: money(79900)
      },
      {
        "qty": 5,
        price: money(263600)
      },
      {
        "qty": 10,
        price: money(491200),
        "note": "Gift Pack"
      }
    ],
    "priceUnit": "per piece",
    "specs": [
      {
        "label": "Print Quality",
        "value": "1200 DPI Photo Pigment Ink"
      },
      {
        "label": "Substrate",
        "value": "Premium Grade Media / Ceramic"
      },
      {
        "label": "UV Resistance",
        "value": "Fade-proof indoor rating (10+ years)"
      },
      {
        "label": "Packaging",
        "value": "Drop-safe bubble lined box"
      },
      {
        "label": "Lead Time",
        "value": "1 - 2 Business Days"
      }
    ],
    "minOrderQty": 1,
    "turnaroundDays": 2,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.8,
    "reviewCount": 131,
    "faqs": [
      {
        "q": "Can I upload photos directly from my phone?",
        "a": "Yes, our upload portal and canvas editor accept phone images in JPG, PNG, and HEIC formats."
      },
      {
        "q": "Will low resolution photos look blurry?",
        "a": "Our automated checker flags low-resolution images before printing so you can swap them for sharper files."
      },
      {
        "q": "Are photo mugs microwave and dishwasher safe?",
        "a": "Yes, our sublimated ceramic mugs are tested safe for everyday microwave and dishwasher usage."
      }
    ],
    "relatedHandles": [
      "classic-photo-prints",
      "retro-polaroid-prints",
      "square-photo-prints",
      "passport-photos"
    ],
    "highlights": [
      "Rich colour gradation and skin-tone reproduction",
      "Scratch-resistant protective exterior coating",
      "Gift-ready packaging with optional personalized note"
    ]
  },
  {
    "id": "prod-premium-photo-frames",
    "handle": "premium-photo-frames",
    "title": "Premium Photo Frames",
    "subtitle": "High-gloss finish, customized photo reproduction with vibrant tone",
    "description": "Cherish your favorite memories with custom Premium Photo Frames. Crafted from handpicked materials to deliver exceptional visual depth and durability.",
    "productType": "Personalised Gifts",
    "categoryHandles": [
      "personalised-gifts"
    ],
    "tags": [
      "premium photo frames",
      "personalised gifts",
      "frame",
      "premium"
    ],
    "badges": [
      "premium"
    ],
    "images": [
      {
        "url": "",
        "altText": "Premium Photo Frames preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "frame",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Premium Photo Frames detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "frame",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Premium Photo Frames packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "frame",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Size",
        "values": [
          "Standard (A5 / 6x4)",
          "Medium (A4 / 8x6)",
          "Large (A3 / 12x8)"
        ]
      },
      {
        "name": "Finish",
        "values": [
          "Glossy Photo",
          "Matte Fine Art",
          "Metallic Luster"
        ]
      }
    ],
    "variants": [
      {
        "id": "premium-photo-frames-std-gloss",
        "title": "Standard / Glossy",
        "sku": "GFT-PREM-STDG",
        price: money(59900),
        compareAtPrice: money(79900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "Standard (A5 / 6x4)"
          },
          {
            "name": "Finish",
            "value": "Glossy Photo"
          }
        ]
      },
      {
        "id": "premium-photo-frames-med-gloss",
        "title": "Medium / Glossy",
        "sku": "GFT-PREM-MEDG",
        price: money(89900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.5,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "Medium (A4 / 8x6)"
          },
          {
            "name": "Finish",
            "value": "Glossy Photo"
          }
        ]
      }
    ],
    priceFrom: money(59900),
    compareAtFrom: money(79900),
    "quantityTiers": [
      {
        "qty": 1,
        price: money(59900),
        compareAtPrice: money(79900)
      },
      {
        "qty": 5,
        price: money(263600)
      },
      {
        "qty": 10,
        price: money(491200),
        "note": "Gift Pack"
      }
    ],
    "priceUnit": "per piece",
    "specs": [
      {
        "label": "Print Quality",
        "value": "1200 DPI Photo Pigment Ink"
      },
      {
        "label": "Substrate",
        "value": "Premium Grade Media / Ceramic"
      },
      {
        "label": "UV Resistance",
        "value": "Fade-proof indoor rating (10+ years)"
      },
      {
        "label": "Packaging",
        "value": "Drop-safe bubble lined box"
      },
      {
        "label": "Lead Time",
        "value": "1 - 2 Business Days"
      }
    ],
    "minOrderQty": 1,
    "turnaroundDays": 2,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.5,
    "reviewCount": 252,
    "faqs": [
      {
        "q": "Can I upload photos directly from my phone?",
        "a": "Yes, our upload portal and canvas editor accept phone images in JPG, PNG, and HEIC formats."
      },
      {
        "q": "Will low resolution photos look blurry?",
        "a": "Our automated checker flags low-resolution images before printing so you can swap them for sharper files."
      },
      {
        "q": "Are photo mugs microwave and dishwasher safe?",
        "a": "Yes, our sublimated ceramic mugs are tested safe for everyday microwave and dishwasher usage."
      }
    ],
    "relatedHandles": [
      "classic-photo-prints",
      "retro-polaroid-prints",
      "square-photo-prints",
      "passport-photos"
    ],
    "highlights": [
      "Rich colour gradation and skin-tone reproduction",
      "Scratch-resistant protective exterior coating",
      "Gift-ready packaging with optional personalized note"
    ]
  },
  {
    "id": "prod-canvas-gallery-wraps",
    "handle": "canvas-gallery-wraps",
    "title": "Canvas Gallery Wraps",
    "subtitle": "High-gloss finish, customized photo reproduction with vibrant tone",
    "description": "Cherish your favorite memories with custom Canvas Gallery Wraps. Crafted from handpicked materials to deliver exceptional visual depth and durability.",
    "productType": "Personalised Gifts",
    "categoryHandles": [
      "personalised-gifts"
    ],
    "tags": [
      "canvas gallery wraps",
      "personalised gifts",
      "canvas",
      "recommended"
    ],
    "badges": [
      "recommended"
    ],
    "images": [
      {
        "url": "",
        "altText": "Canvas Gallery Wraps preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "canvas",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Canvas Gallery Wraps detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "canvas",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Canvas Gallery Wraps packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "canvas",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Size",
        "values": [
          "Standard (A5 / 6x4)",
          "Medium (A4 / 8x6)",
          "Large (A3 / 12x8)"
        ]
      },
      {
        "name": "Finish",
        "values": [
          "Glossy Photo",
          "Matte Fine Art",
          "Metallic Luster"
        ]
      }
    ],
    "variants": [
      {
        "id": "canvas-gallery-wraps-std-gloss",
        "title": "Standard / Glossy",
        "sku": "GFT-CANV-STDG",
        price: money(59900),
        compareAtPrice: money(79900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "Standard (A5 / 6x4)"
          },
          {
            "name": "Finish",
            "value": "Glossy Photo"
          }
        ]
      },
      {
        "id": "canvas-gallery-wraps-med-gloss",
        "title": "Medium / Glossy",
        "sku": "GFT-CANV-MEDG",
        price: money(89900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.5,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "Medium (A4 / 8x6)"
          },
          {
            "name": "Finish",
            "value": "Glossy Photo"
          }
        ]
      }
    ],
    priceFrom: money(59900),
    compareAtFrom: money(79900),
    "quantityTiers": [
      {
        "qty": 1,
        price: money(59900),
        compareAtPrice: money(79900)
      },
      {
        "qty": 5,
        price: money(263600)
      },
      {
        "qty": 10,
        price: money(491200),
        "note": "Gift Pack"
      }
    ],
    "priceUnit": "per piece",
    "specs": [
      {
        "label": "Print Quality",
        "value": "1200 DPI Photo Pigment Ink"
      },
      {
        "label": "Substrate",
        "value": "Premium Grade Media / Ceramic"
      },
      {
        "label": "UV Resistance",
        "value": "Fade-proof indoor rating (10+ years)"
      },
      {
        "label": "Packaging",
        "value": "Drop-safe bubble lined box"
      },
      {
        "label": "Lead Time",
        "value": "1 - 2 Business Days"
      }
    ],
    "minOrderQty": 1,
    "turnaroundDays": 2,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.7,
    "reviewCount": 662,
    "faqs": [
      {
        "q": "Can I upload photos directly from my phone?",
        "a": "Yes, our upload portal and canvas editor accept phone images in JPG, PNG, and HEIC formats."
      },
      {
        "q": "Will low resolution photos look blurry?",
        "a": "Our automated checker flags low-resolution images before printing so you can swap them for sharper files."
      },
      {
        "q": "Are photo mugs microwave and dishwasher safe?",
        "a": "Yes, our sublimated ceramic mugs are tested safe for everyday microwave and dishwasher usage."
      }
    ],
    "relatedHandles": [
      "classic-photo-prints",
      "retro-polaroid-prints",
      "square-photo-prints",
      "passport-photos"
    ],
    "highlights": [
      "Rich colour gradation and skin-tone reproduction",
      "Scratch-resistant protective exterior coating",
      "Gift-ready packaging with optional personalized note"
    ]
  },
  {
    "id": "prod-rolled-canvas-prints",
    "handle": "rolled-canvas-prints",
    "title": "Rolled Canvas Prints",
    "subtitle": "High-gloss finish, customized photo reproduction with vibrant tone",
    "description": "Cherish your favorite memories with custom Rolled Canvas Prints. Crafted from handpicked materials to deliver exceptional visual depth and durability.",
    "productType": "Personalised Gifts",
    "categoryHandles": [
      "personalised-gifts"
    ],
    "tags": [
      "rolled canvas prints",
      "personalised gifts",
      "canvas"
    ],
    "badges": [],
    "images": [
      {
        "url": "",
        "altText": "Rolled Canvas Prints preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "canvas",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Rolled Canvas Prints detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "canvas",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Rolled Canvas Prints packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "canvas",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Size",
        "values": [
          "Standard (A5 / 6x4)",
          "Medium (A4 / 8x6)",
          "Large (A3 / 12x8)"
        ]
      },
      {
        "name": "Finish",
        "values": [
          "Glossy Photo",
          "Matte Fine Art",
          "Metallic Luster"
        ]
      }
    ],
    "variants": [
      {
        "id": "rolled-canvas-prints-std-gloss",
        "title": "Standard / Glossy",
        "sku": "GFT-ROLL-STDG",
        price: money(59900),
        compareAtPrice: money(79900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "Standard (A5 / 6x4)"
          },
          {
            "name": "Finish",
            "value": "Glossy Photo"
          }
        ]
      },
      {
        "id": "rolled-canvas-prints-med-gloss",
        "title": "Medium / Glossy",
        "sku": "GFT-ROLL-MEDG",
        price: money(89900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.5,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "Medium (A4 / 8x6)"
          },
          {
            "name": "Finish",
            "value": "Glossy Photo"
          }
        ]
      }
    ],
    priceFrom: money(59900),
    compareAtFrom: money(79900),
    "quantityTiers": [
      {
        "qty": 1,
        price: money(59900),
        compareAtPrice: money(79900)
      },
      {
        "qty": 5,
        price: money(263600)
      },
      {
        "qty": 10,
        price: money(491200),
        "note": "Gift Pack"
      }
    ],
    "priceUnit": "per piece",
    "specs": [
      {
        "label": "Print Quality",
        "value": "1200 DPI Photo Pigment Ink"
      },
      {
        "label": "Substrate",
        "value": "Premium Grade Media / Ceramic"
      },
      {
        "label": "UV Resistance",
        "value": "Fade-proof indoor rating (10+ years)"
      },
      {
        "label": "Packaging",
        "value": "Drop-safe bubble lined box"
      },
      {
        "label": "Lead Time",
        "value": "1 - 2 Business Days"
      }
    ],
    "minOrderQty": 1,
    "turnaroundDays": 2,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.4,
    "reviewCount": 491,
    "faqs": [
      {
        "q": "Can I upload photos directly from my phone?",
        "a": "Yes, our upload portal and canvas editor accept phone images in JPG, PNG, and HEIC formats."
      },
      {
        "q": "Will low resolution photos look blurry?",
        "a": "Our automated checker flags low-resolution images before printing so you can swap them for sharper files."
      },
      {
        "q": "Are photo mugs microwave and dishwasher safe?",
        "a": "Yes, our sublimated ceramic mugs are tested safe for everyday microwave and dishwasher usage."
      }
    ],
    "relatedHandles": [
      "classic-photo-prints",
      "retro-polaroid-prints",
      "square-photo-prints",
      "passport-photos"
    ],
    "highlights": [
      "Rich colour gradation and skin-tone reproduction",
      "Scratch-resistant protective exterior coating",
      "Gift-ready packaging with optional personalized note"
    ]
  },
  {
    "id": "prod-mdf-canvas-prints",
    "handle": "mdf-canvas-prints",
    "title": "MDF Canvas Prints",
    "subtitle": "High-gloss finish, customized photo reproduction with vibrant tone",
    "description": "Cherish your favorite memories with custom MDF Canvas Prints. Crafted from handpicked materials to deliver exceptional visual depth and durability.",
    "productType": "Personalised Gifts",
    "categoryHandles": [
      "personalised-gifts"
    ],
    "tags": [
      "mdf canvas prints",
      "personalised gifts",
      "canvas",
      "new"
    ],
    "badges": [
      "new"
    ],
    "images": [
      {
        "url": "",
        "altText": "MDF Canvas Prints preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "canvas",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "MDF Canvas Prints detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "canvas",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "MDF Canvas Prints packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "canvas",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Size",
        "values": [
          "Standard (A5 / 6x4)",
          "Medium (A4 / 8x6)",
          "Large (A3 / 12x8)"
        ]
      },
      {
        "name": "Finish",
        "values": [
          "Glossy Photo",
          "Matte Fine Art",
          "Metallic Luster"
        ]
      }
    ],
    "variants": [
      {
        "id": "mdf-canvas-prints-std-gloss",
        "title": "Standard / Glossy",
        "sku": "GFT-MDF--STDG",
        price: money(59900),
        compareAtPrice: money(79900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "Standard (A5 / 6x4)"
          },
          {
            "name": "Finish",
            "value": "Glossy Photo"
          }
        ]
      },
      {
        "id": "mdf-canvas-prints-med-gloss",
        "title": "Medium / Glossy",
        "sku": "GFT-MDF--MEDG",
        price: money(89900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.5,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "Medium (A4 / 8x6)"
          },
          {
            "name": "Finish",
            "value": "Glossy Photo"
          }
        ]
      }
    ],
    priceFrom: money(59900),
    compareAtFrom: money(79900),
    "quantityTiers": [
      {
        "qty": 1,
        price: money(59900),
        compareAtPrice: money(79900)
      },
      {
        "qty": 5,
        price: money(263600)
      },
      {
        "qty": 10,
        price: money(491200),
        "note": "Gift Pack"
      }
    ],
    "priceUnit": "per piece",
    "specs": [
      {
        "label": "Print Quality",
        "value": "1200 DPI Photo Pigment Ink"
      },
      {
        "label": "Substrate",
        "value": "Premium Grade Media / Ceramic"
      },
      {
        "label": "UV Resistance",
        "value": "Fade-proof indoor rating (10+ years)"
      },
      {
        "label": "Packaging",
        "value": "Drop-safe bubble lined box"
      },
      {
        "label": "Lead Time",
        "value": "1 - 2 Business Days"
      }
    ],
    "minOrderQty": 1,
    "turnaroundDays": 2,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.5,
    "reviewCount": 212,
    "faqs": [
      {
        "q": "Can I upload photos directly from my phone?",
        "a": "Yes, our upload portal and canvas editor accept phone images in JPG, PNG, and HEIC formats."
      },
      {
        "q": "Will low resolution photos look blurry?",
        "a": "Our automated checker flags low-resolution images before printing so you can swap them for sharper files."
      },
      {
        "q": "Are photo mugs microwave and dishwasher safe?",
        "a": "Yes, our sublimated ceramic mugs are tested safe for everyday microwave and dishwasher usage."
      }
    ],
    "relatedHandles": [
      "classic-photo-prints",
      "retro-polaroid-prints",
      "square-photo-prints",
      "passport-photos"
    ],
    "highlights": [
      "Rich colour gradation and skin-tone reproduction",
      "Scratch-resistant protective exterior coating",
      "Gift-ready packaging with optional personalized note"
    ]
  },
  {
    "id": "prod-canvas-combos",
    "handle": "canvas-combos",
    "title": "Canvas Combos",
    "subtitle": "High-gloss finish, customized photo reproduction with vibrant tone",
    "description": "Cherish your favorite memories with custom Canvas Combos. Crafted from handpicked materials to deliver exceptional visual depth and durability.",
    "productType": "Personalised Gifts",
    "categoryHandles": [
      "personalised-gifts"
    ],
    "tags": [
      "canvas combos",
      "personalised gifts",
      "canvas",
      "bulk-saver"
    ],
    "badges": [
      "bulk-saver"
    ],
    "images": [
      {
        "url": "",
        "altText": "Canvas Combos preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "canvas",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Canvas Combos detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "canvas",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Canvas Combos packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "canvas",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Size",
        "values": [
          "Standard (A5 / 6x4)",
          "Medium (A4 / 8x6)",
          "Large (A3 / 12x8)"
        ]
      },
      {
        "name": "Finish",
        "values": [
          "Glossy Photo",
          "Matte Fine Art",
          "Metallic Luster"
        ]
      }
    ],
    "variants": [
      {
        "id": "canvas-combos-std-gloss",
        "title": "Standard / Glossy",
        "sku": "GFT-CANV-STDG",
        price: money(59900),
        compareAtPrice: money(79900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "Standard (A5 / 6x4)"
          },
          {
            "name": "Finish",
            "value": "Glossy Photo"
          }
        ]
      },
      {
        "id": "canvas-combos-med-gloss",
        "title": "Medium / Glossy",
        "sku": "GFT-CANV-MEDG",
        price: money(89900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.5,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "Medium (A4 / 8x6)"
          },
          {
            "name": "Finish",
            "value": "Glossy Photo"
          }
        ]
      }
    ],
    priceFrom: money(59900),
    compareAtFrom: money(79900),
    "quantityTiers": [
      {
        "qty": 1,
        price: money(59900),
        compareAtPrice: money(79900)
      },
      {
        "qty": 5,
        price: money(263600)
      },
      {
        "qty": 10,
        price: money(491200),
        "note": "Gift Pack"
      }
    ],
    "priceUnit": "per piece",
    "specs": [
      {
        "label": "Print Quality",
        "value": "1200 DPI Photo Pigment Ink"
      },
      {
        "label": "Substrate",
        "value": "Premium Grade Media / Ceramic"
      },
      {
        "label": "UV Resistance",
        "value": "Fade-proof indoor rating (10+ years)"
      },
      {
        "label": "Packaging",
        "value": "Drop-safe bubble lined box"
      },
      {
        "label": "Lead Time",
        "value": "1 - 2 Business Days"
      }
    ],
    "minOrderQty": 1,
    "turnaroundDays": 2,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.6,
    "reviewCount": 547,
    "faqs": [
      {
        "q": "Can I upload photos directly from my phone?",
        "a": "Yes, our upload portal and canvas editor accept phone images in JPG, PNG, and HEIC formats."
      },
      {
        "q": "Will low resolution photos look blurry?",
        "a": "Our automated checker flags low-resolution images before printing so you can swap them for sharper files."
      },
      {
        "q": "Are photo mugs microwave and dishwasher safe?",
        "a": "Yes, our sublimated ceramic mugs are tested safe for everyday microwave and dishwasher usage."
      }
    ],
    "relatedHandles": [
      "classic-photo-prints",
      "retro-polaroid-prints",
      "square-photo-prints",
      "passport-photos"
    ],
    "highlights": [
      "Rich colour gradation and skin-tone reproduction",
      "Scratch-resistant protective exterior coating",
      "Gift-ready packaging with optional personalized note"
    ]
  },
  {
    "id": "prod-acrylic-photo-frames",
    "handle": "acrylic-photo-frames",
    "title": "Acrylic Photo Frames",
    "subtitle": "High-gloss finish, customized photo reproduction with vibrant tone",
    "description": "Cherish your favorite memories with custom Acrylic Photo Frames. Crafted from handpicked materials to deliver exceptional visual depth and durability.",
    "productType": "Personalised Gifts",
    "categoryHandles": [
      "personalised-gifts"
    ],
    "tags": [
      "acrylic photo frames",
      "personalised gifts",
      "frame",
      "popular"
    ],
    "badges": [
      "popular"
    ],
    "images": [
      {
        "url": "",
        "altText": "Acrylic Photo Frames preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "frame",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Acrylic Photo Frames detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "frame",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Acrylic Photo Frames packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "frame",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Size",
        "values": [
          "Standard (A5 / 6x4)",
          "Medium (A4 / 8x6)",
          "Large (A3 / 12x8)"
        ]
      },
      {
        "name": "Finish",
        "values": [
          "Glossy Photo",
          "Matte Fine Art",
          "Metallic Luster"
        ]
      }
    ],
    "variants": [
      {
        "id": "acrylic-photo-frames-std-gloss",
        "title": "Standard / Glossy",
        "sku": "GFT-ACRY-STDG",
        price: money(59900),
        compareAtPrice: money(79900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "Standard (A5 / 6x4)"
          },
          {
            "name": "Finish",
            "value": "Glossy Photo"
          }
        ]
      },
      {
        "id": "acrylic-photo-frames-med-gloss",
        "title": "Medium / Glossy",
        "sku": "GFT-ACRY-MEDG",
        price: money(89900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.5,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "Medium (A4 / 8x6)"
          },
          {
            "name": "Finish",
            "value": "Glossy Photo"
          }
        ]
      }
    ],
    priceFrom: money(59900),
    compareAtFrom: money(79900),
    "quantityTiers": [
      {
        "qty": 1,
        price: money(59900),
        compareAtPrice: money(79900)
      },
      {
        "qty": 5,
        price: money(263600)
      },
      {
        "qty": 10,
        price: money(491200),
        "note": "Gift Pack"
      }
    ],
    "priceUnit": "per piece",
    "specs": [
      {
        "label": "Print Quality",
        "value": "1200 DPI Photo Pigment Ink"
      },
      {
        "label": "Substrate",
        "value": "Premium Grade Media / Ceramic"
      },
      {
        "label": "UV Resistance",
        "value": "Fade-proof indoor rating (10+ years)"
      },
      {
        "label": "Packaging",
        "value": "Drop-safe bubble lined box"
      },
      {
        "label": "Lead Time",
        "value": "1 - 2 Business Days"
      }
    ],
    "minOrderQty": 1,
    "turnaroundDays": 2,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.5,
    "reviewCount": 68,
    "faqs": [
      {
        "q": "Can I upload photos directly from my phone?",
        "a": "Yes, our upload portal and canvas editor accept phone images in JPG, PNG, and HEIC formats."
      },
      {
        "q": "Will low resolution photos look blurry?",
        "a": "Our automated checker flags low-resolution images before printing so you can swap them for sharper files."
      },
      {
        "q": "Are photo mugs microwave and dishwasher safe?",
        "a": "Yes, our sublimated ceramic mugs are tested safe for everyday microwave and dishwasher usage."
      }
    ],
    "relatedHandles": [
      "classic-photo-prints",
      "retro-polaroid-prints",
      "square-photo-prints",
      "passport-photos"
    ],
    "highlights": [
      "Rich colour gradation and skin-tone reproduction",
      "Scratch-resistant protective exterior coating",
      "Gift-ready packaging with optional personalized note"
    ]
  },
  {
    "id": "prod-premium-acrylic-frames",
    "handle": "premium-acrylic-frames",
    "title": "Premium Acrylic Frames",
    "subtitle": "High-gloss finish, customized photo reproduction with vibrant tone",
    "description": "Cherish your favorite memories with custom Premium Acrylic Frames. Crafted from handpicked materials to deliver exceptional visual depth and durability.",
    "productType": "Personalised Gifts",
    "categoryHandles": [
      "personalised-gifts"
    ],
    "tags": [
      "premium acrylic frames",
      "personalised gifts",
      "frame",
      "premium"
    ],
    "badges": [
      "premium"
    ],
    "images": [
      {
        "url": "",
        "altText": "Premium Acrylic Frames preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "frame",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Premium Acrylic Frames detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "frame",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Premium Acrylic Frames packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "frame",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Size",
        "values": [
          "Standard (A5 / 6x4)",
          "Medium (A4 / 8x6)",
          "Large (A3 / 12x8)"
        ]
      },
      {
        "name": "Finish",
        "values": [
          "Glossy Photo",
          "Matte Fine Art",
          "Metallic Luster"
        ]
      }
    ],
    "variants": [
      {
        "id": "premium-acrylic-frames-std-gloss",
        "title": "Standard / Glossy",
        "sku": "GFT-PREM-STDG",
        price: money(59900),
        compareAtPrice: money(79900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "Standard (A5 / 6x4)"
          },
          {
            "name": "Finish",
            "value": "Glossy Photo"
          }
        ]
      },
      {
        "id": "premium-acrylic-frames-med-gloss",
        "title": "Medium / Glossy",
        "sku": "GFT-PREM-MEDG",
        price: money(89900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.5,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "Medium (A4 / 8x6)"
          },
          {
            "name": "Finish",
            "value": "Glossy Photo"
          }
        ]
      }
    ],
    priceFrom: money(59900),
    compareAtFrom: money(79900),
    "quantityTiers": [
      {
        "qty": 1,
        price: money(59900),
        compareAtPrice: money(79900)
      },
      {
        "qty": 5,
        price: money(263600)
      },
      {
        "qty": 10,
        price: money(491200),
        "note": "Gift Pack"
      }
    ],
    "priceUnit": "per piece",
    "specs": [
      {
        "label": "Print Quality",
        "value": "1200 DPI Photo Pigment Ink"
      },
      {
        "label": "Substrate",
        "value": "Premium Grade Media / Ceramic"
      },
      {
        "label": "UV Resistance",
        "value": "Fade-proof indoor rating (10+ years)"
      },
      {
        "label": "Packaging",
        "value": "Drop-safe bubble lined box"
      },
      {
        "label": "Lead Time",
        "value": "1 - 2 Business Days"
      }
    ],
    "minOrderQty": 1,
    "turnaroundDays": 2,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.4,
    "reviewCount": 61,
    "faqs": [
      {
        "q": "Can I upload photos directly from my phone?",
        "a": "Yes, our upload portal and canvas editor accept phone images in JPG, PNG, and HEIC formats."
      },
      {
        "q": "Will low resolution photos look blurry?",
        "a": "Our automated checker flags low-resolution images before printing so you can swap them for sharper files."
      },
      {
        "q": "Are photo mugs microwave and dishwasher safe?",
        "a": "Yes, our sublimated ceramic mugs are tested safe for everyday microwave and dishwasher usage."
      }
    ],
    "relatedHandles": [
      "classic-photo-prints",
      "retro-polaroid-prints",
      "square-photo-prints",
      "passport-photos"
    ],
    "highlights": [
      "Rich colour gradation and skin-tone reproduction",
      "Scratch-resistant protective exterior coating",
      "Gift-ready packaging with optional personalized note"
    ]
  },
  {
    "id": "prod-leatherette-photo-frames",
    "handle": "leatherette-photo-frames",
    "title": "Leatherette Photo Frames",
    "subtitle": "High-gloss finish, customized photo reproduction with vibrant tone",
    "description": "Cherish your favorite memories with custom Leatherette Photo Frames. Crafted from handpicked materials to deliver exceptional visual depth and durability.",
    "productType": "Personalised Gifts",
    "categoryHandles": [
      "personalised-gifts"
    ],
    "tags": [
      "leatherette photo frames",
      "personalised gifts",
      "frame"
    ],
    "badges": [],
    "images": [
      {
        "url": "",
        "altText": "Leatherette Photo Frames preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "frame",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Leatherette Photo Frames detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "frame",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Leatherette Photo Frames packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "frame",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Size",
        "values": [
          "Standard (A5 / 6x4)",
          "Medium (A4 / 8x6)",
          "Large (A3 / 12x8)"
        ]
      },
      {
        "name": "Finish",
        "values": [
          "Glossy Photo",
          "Matte Fine Art",
          "Metallic Luster"
        ]
      }
    ],
    "variants": [
      {
        "id": "leatherette-photo-frames-std-gloss",
        "title": "Standard / Glossy",
        "sku": "GFT-LEAT-STDG",
        price: money(59900),
        compareAtPrice: money(79900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "Standard (A5 / 6x4)"
          },
          {
            "name": "Finish",
            "value": "Glossy Photo"
          }
        ]
      },
      {
        "id": "leatherette-photo-frames-med-gloss",
        "title": "Medium / Glossy",
        "sku": "GFT-LEAT-MEDG",
        price: money(89900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.5,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "Medium (A4 / 8x6)"
          },
          {
            "name": "Finish",
            "value": "Glossy Photo"
          }
        ]
      }
    ],
    priceFrom: money(59900),
    compareAtFrom: money(79900),
    "quantityTiers": [
      {
        "qty": 1,
        price: money(59900),
        compareAtPrice: money(79900)
      },
      {
        "qty": 5,
        price: money(263600)
      },
      {
        "qty": 10,
        price: money(491200),
        "note": "Gift Pack"
      }
    ],
    "priceUnit": "per piece",
    "specs": [
      {
        "label": "Print Quality",
        "value": "1200 DPI Photo Pigment Ink"
      },
      {
        "label": "Substrate",
        "value": "Premium Grade Media / Ceramic"
      },
      {
        "label": "UV Resistance",
        "value": "Fade-proof indoor rating (10+ years)"
      },
      {
        "label": "Packaging",
        "value": "Drop-safe bubble lined box"
      },
      {
        "label": "Lead Time",
        "value": "1 - 2 Business Days"
      }
    ],
    "minOrderQty": 1,
    "turnaroundDays": 2,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.9,
    "reviewCount": 346,
    "faqs": [
      {
        "q": "Can I upload photos directly from my phone?",
        "a": "Yes, our upload portal and canvas editor accept phone images in JPG, PNG, and HEIC formats."
      },
      {
        "q": "Will low resolution photos look blurry?",
        "a": "Our automated checker flags low-resolution images before printing so you can swap them for sharper files."
      },
      {
        "q": "Are photo mugs microwave and dishwasher safe?",
        "a": "Yes, our sublimated ceramic mugs are tested safe for everyday microwave and dishwasher usage."
      }
    ],
    "relatedHandles": [
      "classic-photo-prints",
      "retro-polaroid-prints",
      "square-photo-prints",
      "passport-photos"
    ],
    "highlights": [
      "Rich colour gradation and skin-tone reproduction",
      "Scratch-resistant protective exterior coating",
      "Gift-ready packaging with optional personalized note"
    ]
  },
  {
    "id": "prod-white-photo-mug",
    "handle": "white-photo-mug",
    "title": "White Photo Mug",
    "subtitle": "High-gloss finish, customized photo reproduction with vibrant tone",
    "description": "Cherish your favorite memories with custom White Photo Mug. Crafted from handpicked materials to deliver exceptional visual depth and durability.",
    "productType": "Personalised Gifts",
    "categoryHandles": [
      "same-day",
      "personalised-gifts"
    ],
    "tags": [
      "white photo mug",
      "personalised gifts",
      "mug",
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
        "altText": "White Photo Mug preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "mug",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "White Photo Mug detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "mug",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "White Photo Mug packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "mug",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Size",
        "values": [
          "Standard (A5 / 6x4)",
          "Medium (A4 / 8x6)",
          "Large (A3 / 12x8)"
        ]
      },
      {
        "name": "Finish",
        "values": [
          "Glossy Photo",
          "Matte Fine Art",
          "Metallic Luster"
        ]
      }
    ],
    "variants": [
      {
        "id": "white-photo-mug-std-gloss",
        "title": "Standard / Glossy",
        "sku": "GFT-WHIT-STDG",
        price: money(24900),
        compareAtPrice: money(34900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "Standard (A5 / 6x4)"
          },
          {
            "name": "Finish",
            "value": "Glossy Photo"
          }
        ]
      },
      {
        "id": "white-photo-mug-med-gloss",
        "title": "Medium / Glossy",
        "sku": "GFT-WHIT-MEDG",
        price: money(37400),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.5,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "Medium (A4 / 8x6)"
          },
          {
            "name": "Finish",
            "value": "Glossy Photo"
          }
        ]
      }
    ],
    priceFrom: money(24900),
    compareAtFrom: money(34900),
    "quantityTiers": [
      {
        "qty": 1,
        price: money(24900),
        compareAtPrice: money(34900)
      },
      {
        "qty": 5,
        price: money(109600)
      },
      {
        "qty": 10,
        price: money(204200),
        "note": "Gift Pack"
      }
    ],
    "priceUnit": "per piece",
    "specs": [
      {
        "label": "Print Quality",
        "value": "1200 DPI Photo Pigment Ink"
      },
      {
        "label": "Substrate",
        "value": "Premium Grade Media / Ceramic"
      },
      {
        "label": "UV Resistance",
        "value": "Fade-proof indoor rating (10+ years)"
      },
      {
        "label": "Packaging",
        "value": "Drop-safe bubble lined box"
      },
      {
        "label": "Lead Time",
        "value": "Same Day Express"
      }
    ],
    "minOrderQty": 1,
    "turnaroundDays": 1,
    "sameDayEligible": true,
    "customizable": true,
    "rating": 4.8,
    "reviewCount": 447,
    "faqs": [
      {
        "q": "Can I upload photos directly from my phone?",
        "a": "Yes, our upload portal and canvas editor accept phone images in JPG, PNG, and HEIC formats."
      },
      {
        "q": "Will low resolution photos look blurry?",
        "a": "Our automated checker flags low-resolution images before printing so you can swap them for sharper files."
      },
      {
        "q": "Are photo mugs microwave and dishwasher safe?",
        "a": "Yes, our sublimated ceramic mugs are tested safe for everyday microwave and dishwasher usage."
      }
    ],
    "relatedHandles": [
      "classic-photo-prints",
      "retro-polaroid-prints",
      "square-photo-prints",
      "passport-photos"
    ],
    "highlights": [
      "Rich colour gradation and skin-tone reproduction",
      "Scratch-resistant protective exterior coating",
      "Gift-ready packaging with optional personalized note"
    ]
  },
  {
    "id": "prod-magic-photo-mug",
    "handle": "magic-photo-mug",
    "title": "Magic Colour-Change Mug",
    "subtitle": "High-gloss finish, customized photo reproduction with vibrant tone",
    "description": "Cherish your favorite memories with custom Magic Colour-Change Mug. Crafted from handpicked materials to deliver exceptional visual depth and durability.",
    "productType": "Personalised Gifts",
    "categoryHandles": [
      "personalised-gifts"
    ],
    "tags": [
      "magic colour-change mug",
      "personalised gifts",
      "mug",
      "popular"
    ],
    "badges": [
      "popular"
    ],
    "images": [
      {
        "url": "",
        "altText": "Magic Colour-Change Mug preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "mug",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Magic Colour-Change Mug detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "mug",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Magic Colour-Change Mug packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "mug",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Size",
        "values": [
          "Standard (A5 / 6x4)",
          "Medium (A4 / 8x6)",
          "Large (A3 / 12x8)"
        ]
      },
      {
        "name": "Finish",
        "values": [
          "Glossy Photo",
          "Matte Fine Art",
          "Metallic Luster"
        ]
      }
    ],
    "variants": [
      {
        "id": "magic-photo-mug-std-gloss",
        "title": "Standard / Glossy",
        "sku": "GFT-MAGI-STDG",
        price: money(24900),
        compareAtPrice: money(34900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "Standard (A5 / 6x4)"
          },
          {
            "name": "Finish",
            "value": "Glossy Photo"
          }
        ]
      },
      {
        "id": "magic-photo-mug-med-gloss",
        "title": "Medium / Glossy",
        "sku": "GFT-MAGI-MEDG",
        price: money(37400),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.5,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "Medium (A4 / 8x6)"
          },
          {
            "name": "Finish",
            "value": "Glossy Photo"
          }
        ]
      }
    ],
    priceFrom: money(24900),
    compareAtFrom: money(34900),
    "quantityTiers": [
      {
        "qty": 1,
        price: money(24900),
        compareAtPrice: money(34900)
      },
      {
        "qty": 5,
        price: money(109600)
      },
      {
        "qty": 10,
        price: money(204200),
        "note": "Gift Pack"
      }
    ],
    "priceUnit": "per piece",
    "specs": [
      {
        "label": "Print Quality",
        "value": "1200 DPI Photo Pigment Ink"
      },
      {
        "label": "Substrate",
        "value": "Premium Grade Media / Ceramic"
      },
      {
        "label": "UV Resistance",
        "value": "Fade-proof indoor rating (10+ years)"
      },
      {
        "label": "Packaging",
        "value": "Drop-safe bubble lined box"
      },
      {
        "label": "Lead Time",
        "value": "1 - 2 Business Days"
      }
    ],
    "minOrderQty": 1,
    "turnaroundDays": 2,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.6,
    "reviewCount": 143,
    "faqs": [
      {
        "q": "Can I upload photos directly from my phone?",
        "a": "Yes, our upload portal and canvas editor accept phone images in JPG, PNG, and HEIC formats."
      },
      {
        "q": "Will low resolution photos look blurry?",
        "a": "Our automated checker flags low-resolution images before printing so you can swap them for sharper files."
      },
      {
        "q": "Are photo mugs microwave and dishwasher safe?",
        "a": "Yes, our sublimated ceramic mugs are tested safe for everyday microwave and dishwasher usage."
      }
    ],
    "relatedHandles": [
      "classic-photo-prints",
      "retro-polaroid-prints",
      "square-photo-prints",
      "passport-photos"
    ],
    "highlights": [
      "Rich colour gradation and skin-tone reproduction",
      "Scratch-resistant protective exterior coating",
      "Gift-ready packaging with optional personalized note"
    ]
  },
  {
    "id": "prod-inner-colour-mug",
    "handle": "inner-colour-mug",
    "title": "Inner Colour Mug",
    "subtitle": "High-gloss finish, customized photo reproduction with vibrant tone",
    "description": "Cherish your favorite memories with custom Inner Colour Mug. Crafted from handpicked materials to deliver exceptional visual depth and durability.",
    "productType": "Personalised Gifts",
    "categoryHandles": [
      "personalised-gifts"
    ],
    "tags": [
      "inner colour mug",
      "personalised gifts",
      "mug"
    ],
    "badges": [],
    "images": [
      {
        "url": "",
        "altText": "Inner Colour Mug preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "mug",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Inner Colour Mug detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "mug",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Inner Colour Mug packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "mug",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Size",
        "values": [
          "Standard (A5 / 6x4)",
          "Medium (A4 / 8x6)",
          "Large (A3 / 12x8)"
        ]
      },
      {
        "name": "Finish",
        "values": [
          "Glossy Photo",
          "Matte Fine Art",
          "Metallic Luster"
        ]
      }
    ],
    "variants": [
      {
        "id": "inner-colour-mug-std-gloss",
        "title": "Standard / Glossy",
        "sku": "GFT-INNE-STDG",
        price: money(24900),
        compareAtPrice: money(34900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "Standard (A5 / 6x4)"
          },
          {
            "name": "Finish",
            "value": "Glossy Photo"
          }
        ]
      },
      {
        "id": "inner-colour-mug-med-gloss",
        "title": "Medium / Glossy",
        "sku": "GFT-INNE-MEDG",
        price: money(37400),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.5,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "Medium (A4 / 8x6)"
          },
          {
            "name": "Finish",
            "value": "Glossy Photo"
          }
        ]
      }
    ],
    priceFrom: money(24900),
    compareAtFrom: money(34900),
    "quantityTiers": [
      {
        "qty": 1,
        price: money(24900),
        compareAtPrice: money(34900)
      },
      {
        "qty": 5,
        price: money(109600)
      },
      {
        "qty": 10,
        price: money(204200),
        "note": "Gift Pack"
      }
    ],
    "priceUnit": "per piece",
    "specs": [
      {
        "label": "Print Quality",
        "value": "1200 DPI Photo Pigment Ink"
      },
      {
        "label": "Substrate",
        "value": "Premium Grade Media / Ceramic"
      },
      {
        "label": "UV Resistance",
        "value": "Fade-proof indoor rating (10+ years)"
      },
      {
        "label": "Packaging",
        "value": "Drop-safe bubble lined box"
      },
      {
        "label": "Lead Time",
        "value": "1 - 2 Business Days"
      }
    ],
    "minOrderQty": 1,
    "turnaroundDays": 2,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.9,
    "reviewCount": 650,
    "faqs": [
      {
        "q": "Can I upload photos directly from my phone?",
        "a": "Yes, our upload portal and canvas editor accept phone images in JPG, PNG, and HEIC formats."
      },
      {
        "q": "Will low resolution photos look blurry?",
        "a": "Our automated checker flags low-resolution images before printing so you can swap them for sharper files."
      },
      {
        "q": "Are photo mugs microwave and dishwasher safe?",
        "a": "Yes, our sublimated ceramic mugs are tested safe for everyday microwave and dishwasher usage."
      }
    ],
    "relatedHandles": [
      "classic-photo-prints",
      "retro-polaroid-prints",
      "square-photo-prints",
      "passport-photos"
    ],
    "highlights": [
      "Rich colour gradation and skin-tone reproduction",
      "Scratch-resistant protective exterior coating",
      "Gift-ready packaging with optional personalized note"
    ]
  },
  {
    "id": "prod-beer-mug",
    "handle": "beer-mug",
    "title": "Beer Mug",
    "subtitle": "High-gloss finish, customized photo reproduction with vibrant tone",
    "description": "Cherish your favorite memories with custom Beer Mug. Crafted from handpicked materials to deliver exceptional visual depth and durability.",
    "productType": "Personalised Gifts",
    "categoryHandles": [
      "personalised-gifts"
    ],
    "tags": [
      "beer mug",
      "personalised gifts",
      "mug"
    ],
    "badges": [],
    "images": [
      {
        "url": "",
        "altText": "Beer Mug preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "mug",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Beer Mug detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "mug",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Beer Mug packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "mug",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Size",
        "values": [
          "Standard (A5 / 6x4)",
          "Medium (A4 / 8x6)",
          "Large (A3 / 12x8)"
        ]
      },
      {
        "name": "Finish",
        "values": [
          "Glossy Photo",
          "Matte Fine Art",
          "Metallic Luster"
        ]
      }
    ],
    "variants": [
      {
        "id": "beer-mug-std-gloss",
        "title": "Standard / Glossy",
        "sku": "GFT-BEER-STDG",
        price: money(24900),
        compareAtPrice: money(34900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "Standard (A5 / 6x4)"
          },
          {
            "name": "Finish",
            "value": "Glossy Photo"
          }
        ]
      },
      {
        "id": "beer-mug-med-gloss",
        "title": "Medium / Glossy",
        "sku": "GFT-BEER-MEDG",
        price: money(37400),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.5,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "Medium (A4 / 8x6)"
          },
          {
            "name": "Finish",
            "value": "Glossy Photo"
          }
        ]
      }
    ],
    priceFrom: money(24900),
    compareAtFrom: money(34900),
    "quantityTiers": [
      {
        "qty": 1,
        price: money(24900),
        compareAtPrice: money(34900)
      },
      {
        "qty": 5,
        price: money(109600)
      },
      {
        "qty": 10,
        price: money(204200),
        "note": "Gift Pack"
      }
    ],
    "priceUnit": "per piece",
    "specs": [
      {
        "label": "Print Quality",
        "value": "1200 DPI Photo Pigment Ink"
      },
      {
        "label": "Substrate",
        "value": "Premium Grade Media / Ceramic"
      },
      {
        "label": "UV Resistance",
        "value": "Fade-proof indoor rating (10+ years)"
      },
      {
        "label": "Packaging",
        "value": "Drop-safe bubble lined box"
      },
      {
        "label": "Lead Time",
        "value": "1 - 2 Business Days"
      }
    ],
    "minOrderQty": 1,
    "turnaroundDays": 2,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.8,
    "reviewCount": 319,
    "faqs": [
      {
        "q": "Can I upload photos directly from my phone?",
        "a": "Yes, our upload portal and canvas editor accept phone images in JPG, PNG, and HEIC formats."
      },
      {
        "q": "Will low resolution photos look blurry?",
        "a": "Our automated checker flags low-resolution images before printing so you can swap them for sharper files."
      },
      {
        "q": "Are photo mugs microwave and dishwasher safe?",
        "a": "Yes, our sublimated ceramic mugs are tested safe for everyday microwave and dishwasher usage."
      }
    ],
    "relatedHandles": [
      "classic-photo-prints",
      "retro-polaroid-prints",
      "square-photo-prints",
      "passport-photos"
    ],
    "highlights": [
      "Rich colour gradation and skin-tone reproduction",
      "Scratch-resistant protective exterior coating",
      "Gift-ready packaging with optional personalized note"
    ]
  },
  {
    "id": "prod-mini-mug",
    "handle": "mini-mug",
    "title": "Mini Mug",
    "subtitle": "High-gloss finish, customized photo reproduction with vibrant tone",
    "description": "Cherish your favorite memories with custom Mini Mug. Crafted from handpicked materials to deliver exceptional visual depth and durability.",
    "productType": "Personalised Gifts",
    "categoryHandles": [
      "personalised-gifts"
    ],
    "tags": [
      "mini mug",
      "personalised gifts",
      "mug",
      "new"
    ],
    "badges": [
      "new"
    ],
    "images": [
      {
        "url": "",
        "altText": "Mini Mug preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "mug",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Mini Mug detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "mug",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Mini Mug packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "mug",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Size",
        "values": [
          "Standard (A5 / 6x4)",
          "Medium (A4 / 8x6)",
          "Large (A3 / 12x8)"
        ]
      },
      {
        "name": "Finish",
        "values": [
          "Glossy Photo",
          "Matte Fine Art",
          "Metallic Luster"
        ]
      }
    ],
    "variants": [
      {
        "id": "mini-mug-std-gloss",
        "title": "Standard / Glossy",
        "sku": "GFT-MINI-STDG",
        price: money(24900),
        compareAtPrice: money(34900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "Standard (A5 / 6x4)"
          },
          {
            "name": "Finish",
            "value": "Glossy Photo"
          }
        ]
      },
      {
        "id": "mini-mug-med-gloss",
        "title": "Medium / Glossy",
        "sku": "GFT-MINI-MEDG",
        price: money(37400),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.5,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "Medium (A4 / 8x6)"
          },
          {
            "name": "Finish",
            "value": "Glossy Photo"
          }
        ]
      }
    ],
    priceFrom: money(24900),
    compareAtFrom: money(34900),
    "quantityTiers": [
      {
        "qty": 1,
        price: money(24900),
        compareAtPrice: money(34900)
      },
      {
        "qty": 5,
        price: money(109600)
      },
      {
        "qty": 10,
        price: money(204200),
        "note": "Gift Pack"
      }
    ],
    "priceUnit": "per piece",
    "specs": [
      {
        "label": "Print Quality",
        "value": "1200 DPI Photo Pigment Ink"
      },
      {
        "label": "Substrate",
        "value": "Premium Grade Media / Ceramic"
      },
      {
        "label": "UV Resistance",
        "value": "Fade-proof indoor rating (10+ years)"
      },
      {
        "label": "Packaging",
        "value": "Drop-safe bubble lined box"
      },
      {
        "label": "Lead Time",
        "value": "1 - 2 Business Days"
      }
    ],
    "minOrderQty": 1,
    "turnaroundDays": 2,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.9,
    "reviewCount": 468,
    "faqs": [
      {
        "q": "Can I upload photos directly from my phone?",
        "a": "Yes, our upload portal and canvas editor accept phone images in JPG, PNG, and HEIC formats."
      },
      {
        "q": "Will low resolution photos look blurry?",
        "a": "Our automated checker flags low-resolution images before printing so you can swap them for sharper files."
      },
      {
        "q": "Are photo mugs microwave and dishwasher safe?",
        "a": "Yes, our sublimated ceramic mugs are tested safe for everyday microwave and dishwasher usage."
      }
    ],
    "relatedHandles": [
      "classic-photo-prints",
      "retro-polaroid-prints",
      "square-photo-prints",
      "passport-photos"
    ],
    "highlights": [
      "Rich colour gradation and skin-tone reproduction",
      "Scratch-resistant protective exterior coating",
      "Gift-ready packaging with optional personalized note"
    ]
  },
  {
    "id": "prod-wedding-invitations",
    "handle": "wedding-invitations",
    "title": "Wedding Invitations",
    "subtitle": "High-gloss finish, customized photo reproduction with vibrant tone",
    "description": "Cherish your favorite memories with custom Wedding Invitations. Crafted from handpicked materials to deliver exceptional visual depth and durability.",
    "productType": "Personalised Gifts",
    "categoryHandles": [
      "personalised-gifts"
    ],
    "tags": [
      "wedding invitations",
      "personalised gifts",
      "invitation",
      "popular"
    ],
    "badges": [
      "popular"
    ],
    "images": [
      {
        "url": "",
        "altText": "Wedding Invitations preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "invitation",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Wedding Invitations detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "invitation",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Wedding Invitations packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "invitation",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Size",
        "values": [
          "Standard (A5 / 6x4)",
          "Medium (A4 / 8x6)",
          "Large (A3 / 12x8)"
        ]
      },
      {
        "name": "Finish",
        "values": [
          "Glossy Photo",
          "Matte Fine Art",
          "Metallic Luster"
        ]
      }
    ],
    "variants": [
      {
        "id": "wedding-invitations-std-gloss",
        "title": "Standard / Glossy",
        "sku": "GFT-WEDD-STDG",
        price: money(49900),
        compareAtPrice: money(59900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "Standard (A5 / 6x4)"
          },
          {
            "name": "Finish",
            "value": "Glossy Photo"
          }
        ]
      },
      {
        "id": "wedding-invitations-med-gloss",
        "title": "Medium / Glossy",
        "sku": "GFT-WEDD-MEDG",
        price: money(74900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.5,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "Medium (A4 / 8x6)"
          },
          {
            "name": "Finish",
            "value": "Glossy Photo"
          }
        ]
      }
    ],
    priceFrom: money(49900),
    compareAtFrom: money(59900),
    "quantityTiers": [
      {
        "qty": 1,
        price: money(49900),
        compareAtPrice: money(59900)
      },
      {
        "qty": 5,
        price: money(219600)
      },
      {
        "qty": 10,
        price: money(409200),
        "note": "Gift Pack"
      }
    ],
    "priceUnit": "per 50 cards",
    "specs": [
      {
        "label": "Print Quality",
        "value": "1200 DPI Photo Pigment Ink"
      },
      {
        "label": "Substrate",
        "value": "Premium Grade Media / Ceramic"
      },
      {
        "label": "UV Resistance",
        "value": "Fade-proof indoor rating (10+ years)"
      },
      {
        "label": "Packaging",
        "value": "Drop-safe bubble lined box"
      },
      {
        "label": "Lead Time",
        "value": "1 - 2 Business Days"
      }
    ],
    "minOrderQty": 50,
    "turnaroundDays": 2,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.7,
    "reviewCount": 202,
    "faqs": [
      {
        "q": "Can I upload photos directly from my phone?",
        "a": "Yes, our upload portal and canvas editor accept phone images in JPG, PNG, and HEIC formats."
      },
      {
        "q": "Will low resolution photos look blurry?",
        "a": "Our automated checker flags low-resolution images before printing so you can swap them for sharper files."
      },
      {
        "q": "Are photo mugs microwave and dishwasher safe?",
        "a": "Yes, our sublimated ceramic mugs are tested safe for everyday microwave and dishwasher usage."
      }
    ],
    "relatedHandles": [
      "classic-photo-prints",
      "retro-polaroid-prints",
      "square-photo-prints",
      "passport-photos"
    ],
    "highlights": [
      "Rich colour gradation and skin-tone reproduction",
      "Scratch-resistant protective exterior coating",
      "Gift-ready packaging with optional personalized note"
    ]
  },
  {
    "id": "prod-birthday-invitations",
    "handle": "birthday-invitations",
    "title": "Birthday Invitations",
    "subtitle": "High-gloss finish, customized photo reproduction with vibrant tone",
    "description": "Cherish your favorite memories with custom Birthday Invitations. Crafted from handpicked materials to deliver exceptional visual depth and durability.",
    "productType": "Personalised Gifts",
    "categoryHandles": [
      "personalised-gifts"
    ],
    "tags": [
      "birthday invitations",
      "personalised gifts",
      "invitation"
    ],
    "badges": [],
    "images": [
      {
        "url": "",
        "altText": "Birthday Invitations preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "invitation",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Birthday Invitations detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "invitation",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Birthday Invitations packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "invitation",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Size",
        "values": [
          "Standard (A5 / 6x4)",
          "Medium (A4 / 8x6)",
          "Large (A3 / 12x8)"
        ]
      },
      {
        "name": "Finish",
        "values": [
          "Glossy Photo",
          "Matte Fine Art",
          "Metallic Luster"
        ]
      }
    ],
    "variants": [
      {
        "id": "birthday-invitations-std-gloss",
        "title": "Standard / Glossy",
        "sku": "GFT-BIRT-STDG",
        price: money(49900),
        compareAtPrice: money(59900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "Standard (A5 / 6x4)"
          },
          {
            "name": "Finish",
            "value": "Glossy Photo"
          }
        ]
      },
      {
        "id": "birthday-invitations-med-gloss",
        "title": "Medium / Glossy",
        "sku": "GFT-BIRT-MEDG",
        price: money(74900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.5,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "Medium (A4 / 8x6)"
          },
          {
            "name": "Finish",
            "value": "Glossy Photo"
          }
        ]
      }
    ],
    priceFrom: money(49900),
    compareAtFrom: money(59900),
    "quantityTiers": [
      {
        "qty": 1,
        price: money(49900),
        compareAtPrice: money(59900)
      },
      {
        "qty": 5,
        price: money(219600)
      },
      {
        "qty": 10,
        price: money(409200),
        "note": "Gift Pack"
      }
    ],
    "priceUnit": "per 50 cards",
    "specs": [
      {
        "label": "Print Quality",
        "value": "1200 DPI Photo Pigment Ink"
      },
      {
        "label": "Substrate",
        "value": "Premium Grade Media / Ceramic"
      },
      {
        "label": "UV Resistance",
        "value": "Fade-proof indoor rating (10+ years)"
      },
      {
        "label": "Packaging",
        "value": "Drop-safe bubble lined box"
      },
      {
        "label": "Lead Time",
        "value": "1 - 2 Business Days"
      }
    ],
    "minOrderQty": 50,
    "turnaroundDays": 2,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.8,
    "reviewCount": 259,
    "faqs": [
      {
        "q": "Can I upload photos directly from my phone?",
        "a": "Yes, our upload portal and canvas editor accept phone images in JPG, PNG, and HEIC formats."
      },
      {
        "q": "Will low resolution photos look blurry?",
        "a": "Our automated checker flags low-resolution images before printing so you can swap them for sharper files."
      },
      {
        "q": "Are photo mugs microwave and dishwasher safe?",
        "a": "Yes, our sublimated ceramic mugs are tested safe for everyday microwave and dishwasher usage."
      }
    ],
    "relatedHandles": [
      "classic-photo-prints",
      "retro-polaroid-prints",
      "square-photo-prints",
      "passport-photos"
    ],
    "highlights": [
      "Rich colour gradation and skin-tone reproduction",
      "Scratch-resistant protective exterior coating",
      "Gift-ready packaging with optional personalized note"
    ]
  },
  {
    "id": "prod-business-invitations",
    "handle": "business-invitations",
    "title": "Business Invitations",
    "subtitle": "High-gloss finish, customized photo reproduction with vibrant tone",
    "description": "Cherish your favorite memories with custom Business Invitations. Crafted from handpicked materials to deliver exceptional visual depth and durability.",
    "productType": "Personalised Gifts",
    "categoryHandles": [
      "personalised-gifts"
    ],
    "tags": [
      "business invitations",
      "personalised gifts",
      "invitation"
    ],
    "badges": [],
    "images": [
      {
        "url": "",
        "altText": "Business Invitations preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "invitation",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Business Invitations detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "invitation",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Business Invitations packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "invitation",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Size",
        "values": [
          "Standard (A5 / 6x4)",
          "Medium (A4 / 8x6)",
          "Large (A3 / 12x8)"
        ]
      },
      {
        "name": "Finish",
        "values": [
          "Glossy Photo",
          "Matte Fine Art",
          "Metallic Luster"
        ]
      }
    ],
    "variants": [
      {
        "id": "business-invitations-std-gloss",
        "title": "Standard / Glossy",
        "sku": "GFT-BUSI-STDG",
        price: money(49900),
        compareAtPrice: money(59900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "Standard (A5 / 6x4)"
          },
          {
            "name": "Finish",
            "value": "Glossy Photo"
          }
        ]
      },
      {
        "id": "business-invitations-med-gloss",
        "title": "Medium / Glossy",
        "sku": "GFT-BUSI-MEDG",
        price: money(74900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.5,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "Medium (A4 / 8x6)"
          },
          {
            "name": "Finish",
            "value": "Glossy Photo"
          }
        ]
      }
    ],
    priceFrom: money(49900),
    compareAtFrom: money(59900),
    "quantityTiers": [
      {
        "qty": 1,
        price: money(49900),
        compareAtPrice: money(59900)
      },
      {
        "qty": 5,
        price: money(219600)
      },
      {
        "qty": 10,
        price: money(409200),
        "note": "Gift Pack"
      }
    ],
    "priceUnit": "per 50 cards",
    "specs": [
      {
        "label": "Print Quality",
        "value": "1200 DPI Photo Pigment Ink"
      },
      {
        "label": "Substrate",
        "value": "Premium Grade Media / Ceramic"
      },
      {
        "label": "UV Resistance",
        "value": "Fade-proof indoor rating (10+ years)"
      },
      {
        "label": "Packaging",
        "value": "Drop-safe bubble lined box"
      },
      {
        "label": "Lead Time",
        "value": "1 - 2 Business Days"
      }
    ],
    "minOrderQty": 50,
    "turnaroundDays": 2,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.9,
    "reviewCount": 398,
    "faqs": [
      {
        "q": "Can I upload photos directly from my phone?",
        "a": "Yes, our upload portal and canvas editor accept phone images in JPG, PNG, and HEIC formats."
      },
      {
        "q": "Will low resolution photos look blurry?",
        "a": "Our automated checker flags low-resolution images before printing so you can swap them for sharper files."
      },
      {
        "q": "Are photo mugs microwave and dishwasher safe?",
        "a": "Yes, our sublimated ceramic mugs are tested safe for everyday microwave and dishwasher usage."
      }
    ],
    "relatedHandles": [
      "classic-photo-prints",
      "retro-polaroid-prints",
      "square-photo-prints",
      "passport-photos"
    ],
    "highlights": [
      "Rich colour gradation and skin-tone reproduction",
      "Scratch-resistant protective exterior coating",
      "Gift-ready packaging with optional personalized note"
    ]
  },
  {
    "id": "prod-a5-standard-invitations",
    "handle": "a5-standard-invitations",
    "title": "A5 Standard Invitations",
    "subtitle": "High-gloss finish, customized photo reproduction with vibrant tone",
    "description": "Cherish your favorite memories with custom A5 Standard Invitations. Crafted from handpicked materials to deliver exceptional visual depth and durability.",
    "productType": "Personalised Gifts",
    "categoryHandles": [
      "personalised-gifts"
    ],
    "tags": [
      "a5 standard invitations",
      "personalised gifts",
      "invitation"
    ],
    "badges": [],
    "images": [
      {
        "url": "",
        "altText": "A5 Standard Invitations preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "invitation",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "A5 Standard Invitations detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "invitation",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "A5 Standard Invitations packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "invitation",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Size",
        "values": [
          "Standard (A5 / 6x4)",
          "Medium (A4 / 8x6)",
          "Large (A3 / 12x8)"
        ]
      },
      {
        "name": "Finish",
        "values": [
          "Glossy Photo",
          "Matte Fine Art",
          "Metallic Luster"
        ]
      }
    ],
    "variants": [
      {
        "id": "a5-standard-invitations-std-gloss",
        "title": "Standard / Glossy",
        "sku": "GFT-A5-S-STDG",
        price: money(49900),
        compareAtPrice: money(59900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "Standard (A5 / 6x4)"
          },
          {
            "name": "Finish",
            "value": "Glossy Photo"
          }
        ]
      },
      {
        "id": "a5-standard-invitations-med-gloss",
        "title": "Medium / Glossy",
        "sku": "GFT-A5-S-MEDG",
        price: money(74900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.5,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "Medium (A4 / 8x6)"
          },
          {
            "name": "Finish",
            "value": "Glossy Photo"
          }
        ]
      }
    ],
    priceFrom: money(49900),
    compareAtFrom: money(59900),
    "quantityTiers": [
      {
        "qty": 1,
        price: money(49900),
        compareAtPrice: money(59900)
      },
      {
        "qty": 5,
        price: money(219600)
      },
      {
        "qty": 10,
        price: money(409200),
        "note": "Gift Pack"
      }
    ],
    "priceUnit": "per 50 cards",
    "specs": [
      {
        "label": "Print Quality",
        "value": "1200 DPI Photo Pigment Ink"
      },
      {
        "label": "Substrate",
        "value": "Premium Grade Media / Ceramic"
      },
      {
        "label": "UV Resistance",
        "value": "Fade-proof indoor rating (10+ years)"
      },
      {
        "label": "Packaging",
        "value": "Drop-safe bubble lined box"
      },
      {
        "label": "Lead Time",
        "value": "1 - 2 Business Days"
      }
    ],
    "minOrderQty": 50,
    "turnaroundDays": 2,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.7,
    "reviewCount": 254,
    "faqs": [
      {
        "q": "Can I upload photos directly from my phone?",
        "a": "Yes, our upload portal and canvas editor accept phone images in JPG, PNG, and HEIC formats."
      },
      {
        "q": "Will low resolution photos look blurry?",
        "a": "Our automated checker flags low-resolution images before printing so you can swap them for sharper files."
      },
      {
        "q": "Are photo mugs microwave and dishwasher safe?",
        "a": "Yes, our sublimated ceramic mugs are tested safe for everyday microwave and dishwasher usage."
      }
    ],
    "relatedHandles": [
      "classic-photo-prints",
      "retro-polaroid-prints",
      "square-photo-prints",
      "passport-photos"
    ],
    "highlights": [
      "Rich colour gradation and skin-tone reproduction",
      "Scratch-resistant protective exterior coating",
      "Gift-ready packaging with optional personalized note"
    ]
  },
  {
    "id": "prod-flat-invitation-cards",
    "handle": "flat-invitation-cards",
    "title": "Flat Invitation Cards",
    "subtitle": "High-gloss finish, customized photo reproduction with vibrant tone",
    "description": "Cherish your favorite memories with custom Flat Invitation Cards. Crafted from handpicked materials to deliver exceptional visual depth and durability.",
    "productType": "Personalised Gifts",
    "categoryHandles": [
      "personalised-gifts"
    ],
    "tags": [
      "flat invitation cards",
      "personalised gifts",
      "card"
    ],
    "badges": [],
    "images": [
      {
        "url": "",
        "altText": "Flat Invitation Cards preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Flat Invitation Cards detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Flat Invitation Cards packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Size",
        "values": [
          "Standard (A5 / 6x4)",
          "Medium (A4 / 8x6)",
          "Large (A3 / 12x8)"
        ]
      },
      {
        "name": "Finish",
        "values": [
          "Glossy Photo",
          "Matte Fine Art",
          "Metallic Luster"
        ]
      }
    ],
    "variants": [
      {
        "id": "flat-invitation-cards-std-gloss",
        "title": "Standard / Glossy",
        "sku": "GFT-FLAT-STDG",
        price: money(49900),
        compareAtPrice: money(59900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "Standard (A5 / 6x4)"
          },
          {
            "name": "Finish",
            "value": "Glossy Photo"
          }
        ]
      },
      {
        "id": "flat-invitation-cards-med-gloss",
        "title": "Medium / Glossy",
        "sku": "GFT-FLAT-MEDG",
        price: money(74900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.5,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "Medium (A4 / 8x6)"
          },
          {
            "name": "Finish",
            "value": "Glossy Photo"
          }
        ]
      }
    ],
    priceFrom: money(49900),
    compareAtFrom: money(59900),
    "quantityTiers": [
      {
        "qty": 1,
        price: money(49900),
        compareAtPrice: money(59900)
      },
      {
        "qty": 5,
        price: money(219600)
      },
      {
        "qty": 10,
        price: money(409200),
        "note": "Gift Pack"
      }
    ],
    "priceUnit": "per 50 cards",
    "specs": [
      {
        "label": "Print Quality",
        "value": "1200 DPI Photo Pigment Ink"
      },
      {
        "label": "Substrate",
        "value": "Premium Grade Media / Ceramic"
      },
      {
        "label": "UV Resistance",
        "value": "Fade-proof indoor rating (10+ years)"
      },
      {
        "label": "Packaging",
        "value": "Drop-safe bubble lined box"
      },
      {
        "label": "Lead Time",
        "value": "1 - 2 Business Days"
      }
    ],
    "minOrderQty": 50,
    "turnaroundDays": 2,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.5,
    "reviewCount": 268,
    "faqs": [
      {
        "q": "Can I upload photos directly from my phone?",
        "a": "Yes, our upload portal and canvas editor accept phone images in JPG, PNG, and HEIC formats."
      },
      {
        "q": "Will low resolution photos look blurry?",
        "a": "Our automated checker flags low-resolution images before printing so you can swap them for sharper files."
      },
      {
        "q": "Are photo mugs microwave and dishwasher safe?",
        "a": "Yes, our sublimated ceramic mugs are tested safe for everyday microwave and dishwasher usage."
      }
    ],
    "relatedHandles": [
      "classic-photo-prints",
      "retro-polaroid-prints",
      "square-photo-prints",
      "passport-photos"
    ],
    "highlights": [
      "Rich colour gradation and skin-tone reproduction",
      "Scratch-resistant protective exterior coating",
      "Gift-ready packaging with optional personalized note"
    ]
  }
];
