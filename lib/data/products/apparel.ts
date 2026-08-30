import { money, type Product } from "@/lib/commerce/types";

export const apparelProducts: Product[] = [
  {
    "id": "prod-cotton-premium-round-neck",
    "handle": "cotton-premium-round-neck",
    "title": "Cotton Premium Round Neck",
    "subtitle": "100% breathable fabric, high-durability digital / screen print",
    "description": "Premium quality Cotton Premium Round Neck engineered for supreme comfort and vibrant logo reproduction. Ideal for corporate branding, events, and personal merchandise.",
    "productType": "Apparel",
    "categoryHandles": [
      "apparel"
    ],
    "tags": [
      "cotton premium round neck",
      "apparel",
      "tshirt",
      "bestseller"
    ],
    "badges": [
      "bestseller"
    ],
    "images": [
      {
        "url": "",
        "altText": "Cotton Premium Round Neck preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "tshirt",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Cotton Premium Round Neck detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "tshirt",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Cotton Premium Round Neck packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "tshirt",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Size",
        "values": [
          "S (38)",
          "M (40)",
          "L (42)",
          "XL (44)",
          "XXL (46)"
        ]
      },
      {
        "name": "Colour",
        "values": [
          "Jet Black",
          "Navy Blue",
          "Heather Grey",
          "Pure White"
        ]
      },
      {
        "name": "Print Position",
        "values": [
          "Left Chest",
          "Front Center",
          "Back Large",
          "Chest + Back"
        ]
      }
    ],
    "variants": [
      {
        "id": "cotton-premium-round-neck-m-black",
        "title": "M / Jet Black",
        "sku": "APP-COTT-MBK",
        price: money(39900),
        compareAtPrice: money(49900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "M (40)"
          },
          {
            "name": "Colour",
            "value": "Jet Black"
          }
        ]
      },
      {
        "id": "cotton-premium-round-neck-l-black",
        "title": "L / Jet Black",
        "sku": "APP-COTT-LBK",
        price: money(39900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "L (42)"
          },
          {
            "name": "Colour",
            "value": "Jet Black"
          }
        ]
      },
      {
        "id": "cotton-premium-round-neck-l-navy",
        "title": "L / Navy Blue",
        "sku": "APP-COTT-LNV",
        price: money(39900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "L (42)"
          },
          {
            "name": "Colour",
            "value": "Navy Blue"
          }
        ]
      }
    ],
    priceFrom: money(39900),
    compareAtFrom: money(49900),
    "quantityTiers": [
      {
        "qty": 1,
        price: money(39900),
        compareAtPrice: money(49900)
      },
      {
        "qty": 10,
        price: money(359100)
      },
      {
        "qty": 25,
        price: money(798000),
        "note": "Team Pack"
      },
      {
        "qty": 50,
        price: money(1436400),
        "note": "Bulk Saver"
      }
    ],
    "priceUnit": "per piece",
    "specs": [
      {
        "label": "Material",
        "value": "100% Combed Cotton / Bio-Washed"
      },
      {
        "label": "Fabric Density",
        "value": "180 - 240 GSM"
      },
      {
        "label": "Printing Technique",
        "value": "DTF / High-Density Screen Print"
      },
      {
        "label": "Fit Type",
        "value": "Regular Comfort Fit"
      },
      {
        "label": "Care Instructions",
        "value": "Machine wash cold, iron inside out"
      }
    ],
    "minOrderQty": 1,
    "turnaroundDays": 3,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.4,
    "reviewCount": 193,
    "faqs": [
      {
        "q": "How long will the print last after washing?",
        "a": "Our DTF and screen prints withstand 50+ machine washes when washed inside out in cold water."
      },
      {
        "q": "Can I order samples before placing a bulk team order?",
        "a": "Yes, single piece orders are supported with full custom printing before committing to volume runs."
      },
      {
        "q": "What is the maximum print dimension on the chest?",
        "a": "Standard front center prints measure up to 10 × 12 inches, while left chest logos are 3.5 × 3.5 inches."
      }
    ],
    "relatedHandles": [
      "ultra-premium-polo",
      "hooded-sweatshirt",
      "dry-fit-round-neck",
      "cotton-round-neck-tshirt"
    ],
    "highlights": [
      "Pre-shrunk ring-spun bio-washed cotton",
      "Wash-fast inks resistant to fading and cracking",
      "Reinforced double-needle neck and hem stitching"
    ]
  },
  {
    "id": "prod-ultra-premium-polo",
    "handle": "ultra-premium-polo",
    "title": "Ultra Premium Polo",
    "subtitle": "100% breathable fabric, high-durability digital / screen print",
    "description": "Premium quality Ultra Premium Polo engineered for supreme comfort and vibrant logo reproduction. Ideal for corporate branding, events, and personal merchandise.",
    "productType": "Apparel",
    "categoryHandles": [
      "apparel"
    ],
    "tags": [
      "ultra premium polo",
      "apparel",
      "polo",
      "popular"
    ],
    "badges": [
      "popular"
    ],
    "images": [
      {
        "url": "",
        "altText": "Ultra Premium Polo preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "polo",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Ultra Premium Polo detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "polo",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Ultra Premium Polo packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "polo",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Size",
        "values": [
          "S (38)",
          "M (40)",
          "L (42)",
          "XL (44)",
          "XXL (46)"
        ]
      },
      {
        "name": "Colour",
        "values": [
          "Jet Black",
          "Navy Blue",
          "Heather Grey",
          "Pure White"
        ]
      },
      {
        "name": "Print Position",
        "values": [
          "Left Chest",
          "Front Center",
          "Back Large",
          "Chest + Back"
        ]
      }
    ],
    "variants": [
      {
        "id": "ultra-premium-polo-m-black",
        "title": "M / Jet Black",
        "sku": "APP-ULTR-MBK",
        price: money(64900),
        compareAtPrice: money(79900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "M (40)"
          },
          {
            "name": "Colour",
            "value": "Jet Black"
          }
        ]
      },
      {
        "id": "ultra-premium-polo-l-black",
        "title": "L / Jet Black",
        "sku": "APP-ULTR-LBK",
        price: money(64900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "L (42)"
          },
          {
            "name": "Colour",
            "value": "Jet Black"
          }
        ]
      },
      {
        "id": "ultra-premium-polo-l-navy",
        "title": "L / Navy Blue",
        "sku": "APP-ULTR-LNV",
        price: money(64900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "L (42)"
          },
          {
            "name": "Colour",
            "value": "Navy Blue"
          }
        ]
      }
    ],
    priceFrom: money(64900),
    compareAtFrom: money(79900),
    "quantityTiers": [
      {
        "qty": 1,
        price: money(64900),
        compareAtPrice: money(79900)
      },
      {
        "qty": 10,
        price: money(584100)
      },
      {
        "qty": 25,
        price: money(1298000),
        "note": "Team Pack"
      },
      {
        "qty": 50,
        price: money(2336400),
        "note": "Bulk Saver"
      }
    ],
    "priceUnit": "per piece",
    "specs": [
      {
        "label": "Material",
        "value": "100% Combed Cotton / Bio-Washed"
      },
      {
        "label": "Fabric Density",
        "value": "180 - 240 GSM"
      },
      {
        "label": "Printing Technique",
        "value": "DTF / High-Density Screen Print"
      },
      {
        "label": "Fit Type",
        "value": "Regular Comfort Fit"
      },
      {
        "label": "Care Instructions",
        "value": "Machine wash cold, iron inside out"
      }
    ],
    "minOrderQty": 1,
    "turnaroundDays": 3,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.7,
    "reviewCount": 136,
    "faqs": [
      {
        "q": "How long will the print last after washing?",
        "a": "Our DTF and screen prints withstand 50+ machine washes when washed inside out in cold water."
      },
      {
        "q": "Can I order samples before placing a bulk team order?",
        "a": "Yes, single piece orders are supported with full custom printing before committing to volume runs."
      },
      {
        "q": "What is the maximum print dimension on the chest?",
        "a": "Standard front center prints measure up to 10 × 12 inches, while left chest logos are 3.5 × 3.5 inches."
      }
    ],
    "relatedHandles": [
      "cotton-premium-round-neck",
      "hooded-sweatshirt",
      "dry-fit-round-neck",
      "cotton-round-neck-tshirt"
    ],
    "highlights": [
      "Pre-shrunk ring-spun bio-washed cotton",
      "Wash-fast inks resistant to fading and cracking",
      "Reinforced double-needle neck and hem stitching"
    ]
  },
  {
    "id": "prod-hooded-sweatshirt",
    "handle": "hooded-sweatshirt",
    "title": "Hooded Sweatshirt",
    "subtitle": "100% breathable fabric, high-durability digital / screen print",
    "description": "Premium quality Hooded Sweatshirt engineered for supreme comfort and vibrant logo reproduction. Ideal for corporate branding, events, and personal merchandise.",
    "productType": "Apparel",
    "categoryHandles": [
      "apparel"
    ],
    "tags": [
      "hooded sweatshirt",
      "apparel",
      "tshirt",
      "popular"
    ],
    "badges": [
      "popular"
    ],
    "images": [
      {
        "url": "",
        "altText": "Hooded Sweatshirt preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "tshirt",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Hooded Sweatshirt detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "tshirt",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Hooded Sweatshirt packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "tshirt",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Size",
        "values": [
          "S (38)",
          "M (40)",
          "L (42)",
          "XL (44)",
          "XXL (46)"
        ]
      },
      {
        "name": "Colour",
        "values": [
          "Jet Black",
          "Navy Blue",
          "Heather Grey",
          "Pure White"
        ]
      },
      {
        "name": "Print Position",
        "values": [
          "Left Chest",
          "Front Center",
          "Back Large",
          "Chest + Back"
        ]
      }
    ],
    "variants": [
      {
        "id": "hooded-sweatshirt-m-black",
        "title": "M / Jet Black",
        "sku": "APP-HOOD-MBK",
        price: money(99900),
        compareAtPrice: money(129900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "M (40)"
          },
          {
            "name": "Colour",
            "value": "Jet Black"
          }
        ]
      },
      {
        "id": "hooded-sweatshirt-l-black",
        "title": "L / Jet Black",
        "sku": "APP-HOOD-LBK",
        price: money(99900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "L (42)"
          },
          {
            "name": "Colour",
            "value": "Jet Black"
          }
        ]
      },
      {
        "id": "hooded-sweatshirt-l-navy",
        "title": "L / Navy Blue",
        "sku": "APP-HOOD-LNV",
        price: money(99900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "L (42)"
          },
          {
            "name": "Colour",
            "value": "Navy Blue"
          }
        ]
      }
    ],
    priceFrom: money(99900),
    compareAtFrom: money(129900),
    "quantityTiers": [
      {
        "qty": 1,
        price: money(99900),
        compareAtPrice: money(129900)
      },
      {
        "qty": 10,
        price: money(899100)
      },
      {
        "qty": 25,
        price: money(1998000),
        "note": "Team Pack"
      },
      {
        "qty": 50,
        price: money(3596400),
        "note": "Bulk Saver"
      }
    ],
    "priceUnit": "per piece",
    "specs": [
      {
        "label": "Material",
        "value": "100% Combed Cotton / Bio-Washed"
      },
      {
        "label": "Fabric Density",
        "value": "180 - 240 GSM"
      },
      {
        "label": "Printing Technique",
        "value": "DTF / High-Density Screen Print"
      },
      {
        "label": "Fit Type",
        "value": "Regular Comfort Fit"
      },
      {
        "label": "Care Instructions",
        "value": "Machine wash cold, iron inside out"
      }
    ],
    "minOrderQty": 1,
    "turnaroundDays": 3,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.6,
    "reviewCount": 519,
    "faqs": [
      {
        "q": "How long will the print last after washing?",
        "a": "Our DTF and screen prints withstand 50+ machine washes when washed inside out in cold water."
      },
      {
        "q": "Can I order samples before placing a bulk team order?",
        "a": "Yes, single piece orders are supported with full custom printing before committing to volume runs."
      },
      {
        "q": "What is the maximum print dimension on the chest?",
        "a": "Standard front center prints measure up to 10 × 12 inches, while left chest logos are 3.5 × 3.5 inches."
      }
    ],
    "relatedHandles": [
      "cotton-premium-round-neck",
      "ultra-premium-polo",
      "dry-fit-round-neck",
      "cotton-round-neck-tshirt"
    ],
    "highlights": [
      "Pre-shrunk ring-spun bio-washed cotton",
      "Wash-fast inks resistant to fading and cracking",
      "Reinforced double-needle neck and hem stitching"
    ]
  },
  {
    "id": "prod-dry-fit-round-neck",
    "handle": "dry-fit-round-neck",
    "title": "Dry-Fit Round Neck",
    "subtitle": "100% breathable fabric, high-durability digital / screen print",
    "description": "Premium quality Dry-Fit Round Neck engineered for supreme comfort and vibrant logo reproduction. Ideal for corporate branding, events, and personal merchandise.",
    "productType": "Apparel",
    "categoryHandles": [
      "apparel"
    ],
    "tags": [
      "dry-fit round neck",
      "apparel",
      "tshirt",
      "recommended"
    ],
    "badges": [
      "recommended"
    ],
    "images": [
      {
        "url": "",
        "altText": "Dry-Fit Round Neck preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "tshirt",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Dry-Fit Round Neck detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "tshirt",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Dry-Fit Round Neck packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "tshirt",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Size",
        "values": [
          "S (38)",
          "M (40)",
          "L (42)",
          "XL (44)",
          "XXL (46)"
        ]
      },
      {
        "name": "Colour",
        "values": [
          "Jet Black",
          "Navy Blue",
          "Heather Grey",
          "Pure White"
        ]
      },
      {
        "name": "Print Position",
        "values": [
          "Left Chest",
          "Front Center",
          "Back Large",
          "Chest + Back"
        ]
      }
    ],
    "variants": [
      {
        "id": "dry-fit-round-neck-m-black",
        "title": "M / Jet Black",
        "sku": "APP-DRY--MBK",
        price: money(39900),
        compareAtPrice: money(49900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "M (40)"
          },
          {
            "name": "Colour",
            "value": "Jet Black"
          }
        ]
      },
      {
        "id": "dry-fit-round-neck-l-black",
        "title": "L / Jet Black",
        "sku": "APP-DRY--LBK",
        price: money(39900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "L (42)"
          },
          {
            "name": "Colour",
            "value": "Jet Black"
          }
        ]
      },
      {
        "id": "dry-fit-round-neck-l-navy",
        "title": "L / Navy Blue",
        "sku": "APP-DRY--LNV",
        price: money(39900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "L (42)"
          },
          {
            "name": "Colour",
            "value": "Navy Blue"
          }
        ]
      }
    ],
    priceFrom: money(39900),
    compareAtFrom: money(49900),
    "quantityTiers": [
      {
        "qty": 1,
        price: money(39900),
        compareAtPrice: money(49900)
      },
      {
        "qty": 10,
        price: money(359100)
      },
      {
        "qty": 25,
        price: money(798000),
        "note": "Team Pack"
      },
      {
        "qty": 50,
        price: money(1436400),
        "note": "Bulk Saver"
      }
    ],
    "priceUnit": "per piece",
    "specs": [
      {
        "label": "Material",
        "value": "100% Combed Cotton / Bio-Washed"
      },
      {
        "label": "Fabric Density",
        "value": "180 - 240 GSM"
      },
      {
        "label": "Printing Technique",
        "value": "DTF / High-Density Screen Print"
      },
      {
        "label": "Fit Type",
        "value": "Regular Comfort Fit"
      },
      {
        "label": "Care Instructions",
        "value": "Machine wash cold, iron inside out"
      }
    ],
    "minOrderQty": 1,
    "turnaroundDays": 3,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.6,
    "reviewCount": 681,
    "faqs": [
      {
        "q": "How long will the print last after washing?",
        "a": "Our DTF and screen prints withstand 50+ machine washes when washed inside out in cold water."
      },
      {
        "q": "Can I order samples before placing a bulk team order?",
        "a": "Yes, single piece orders are supported with full custom printing before committing to volume runs."
      },
      {
        "q": "What is the maximum print dimension on the chest?",
        "a": "Standard front center prints measure up to 10 × 12 inches, while left chest logos are 3.5 × 3.5 inches."
      }
    ],
    "relatedHandles": [
      "cotton-premium-round-neck",
      "ultra-premium-polo",
      "hooded-sweatshirt",
      "cotton-round-neck-tshirt"
    ],
    "highlights": [
      "Pre-shrunk ring-spun bio-washed cotton",
      "Wash-fast inks resistant to fading and cracking",
      "Reinforced double-needle neck and hem stitching"
    ]
  },
  {
    "id": "prod-cotton-round-neck-tshirt",
    "handle": "cotton-round-neck-tshirt",
    "title": "Cotton Round Neck",
    "subtitle": "100% breathable fabric, high-durability digital / screen print",
    "description": "Premium quality Cotton Round Neck engineered for supreme comfort and vibrant logo reproduction. Ideal for corporate branding, events, and personal merchandise.",
    "productType": "Apparel",
    "categoryHandles": [
      "same-day",
      "apparel"
    ],
    "tags": [
      "cotton round neck",
      "apparel",
      "tshirt",
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
        "altText": "Cotton Round Neck preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "tshirt",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Cotton Round Neck detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "tshirt",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Cotton Round Neck packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "tshirt",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Size",
        "values": [
          "S (38)",
          "M (40)",
          "L (42)",
          "XL (44)",
          "XXL (46)"
        ]
      },
      {
        "name": "Colour",
        "values": [
          "Jet Black",
          "Navy Blue",
          "Heather Grey",
          "Pure White"
        ]
      },
      {
        "name": "Print Position",
        "values": [
          "Left Chest",
          "Front Center",
          "Back Large",
          "Chest + Back"
        ]
      }
    ],
    "variants": [
      {
        "id": "cotton-round-neck-tshirt-m-black",
        "title": "M / Jet Black",
        "sku": "APP-COTT-MBK",
        price: money(39900),
        compareAtPrice: money(49900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "M (40)"
          },
          {
            "name": "Colour",
            "value": "Jet Black"
          }
        ]
      },
      {
        "id": "cotton-round-neck-tshirt-l-black",
        "title": "L / Jet Black",
        "sku": "APP-COTT-LBK",
        price: money(39900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "L (42)"
          },
          {
            "name": "Colour",
            "value": "Jet Black"
          }
        ]
      },
      {
        "id": "cotton-round-neck-tshirt-l-navy",
        "title": "L / Navy Blue",
        "sku": "APP-COTT-LNV",
        price: money(39900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "L (42)"
          },
          {
            "name": "Colour",
            "value": "Navy Blue"
          }
        ]
      }
    ],
    priceFrom: money(39900),
    compareAtFrom: money(49900),
    "quantityTiers": [
      {
        "qty": 1,
        price: money(39900),
        compareAtPrice: money(49900)
      },
      {
        "qty": 10,
        price: money(359100)
      },
      {
        "qty": 25,
        price: money(798000),
        "note": "Team Pack"
      },
      {
        "qty": 50,
        price: money(1436400),
        "note": "Bulk Saver"
      }
    ],
    "priceUnit": "per piece",
    "specs": [
      {
        "label": "Material",
        "value": "100% Combed Cotton / Bio-Washed"
      },
      {
        "label": "Fabric Density",
        "value": "180 - 240 GSM"
      },
      {
        "label": "Printing Technique",
        "value": "DTF / High-Density Screen Print"
      },
      {
        "label": "Fit Type",
        "value": "Regular Comfort Fit"
      },
      {
        "label": "Care Instructions",
        "value": "Machine wash cold, iron inside out"
      }
    ],
    "minOrderQty": 1,
    "turnaroundDays": 1,
    "sameDayEligible": true,
    "customizable": true,
    "rating": 4.7,
    "reviewCount": 476,
    "faqs": [
      {
        "q": "How long will the print last after washing?",
        "a": "Our DTF and screen prints withstand 50+ machine washes when washed inside out in cold water."
      },
      {
        "q": "Can I order samples before placing a bulk team order?",
        "a": "Yes, single piece orders are supported with full custom printing before committing to volume runs."
      },
      {
        "q": "What is the maximum print dimension on the chest?",
        "a": "Standard front center prints measure up to 10 × 12 inches, while left chest logos are 3.5 × 3.5 inches."
      }
    ],
    "relatedHandles": [
      "cotton-premium-round-neck",
      "ultra-premium-polo",
      "hooded-sweatshirt",
      "dry-fit-round-neck"
    ],
    "highlights": [
      "Pre-shrunk ring-spun bio-washed cotton",
      "Wash-fast inks resistant to fading and cracking",
      "Reinforced double-needle neck and hem stitching"
    ]
  },
  {
    "id": "prod-premium-round-neck-tshirt",
    "handle": "premium-round-neck-tshirt",
    "title": "Premium Round Neck",
    "subtitle": "100% breathable fabric, high-durability digital / screen print",
    "description": "Premium quality Premium Round Neck engineered for supreme comfort and vibrant logo reproduction. Ideal for corporate branding, events, and personal merchandise.",
    "productType": "Apparel",
    "categoryHandles": [
      "apparel"
    ],
    "tags": [
      "premium round neck",
      "apparel",
      "tshirt"
    ],
    "badges": [],
    "images": [
      {
        "url": "",
        "altText": "Premium Round Neck preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "tshirt",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Premium Round Neck detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "tshirt",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Premium Round Neck packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "tshirt",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Size",
        "values": [
          "S (38)",
          "M (40)",
          "L (42)",
          "XL (44)",
          "XXL (46)"
        ]
      },
      {
        "name": "Colour",
        "values": [
          "Jet Black",
          "Navy Blue",
          "Heather Grey",
          "Pure White"
        ]
      },
      {
        "name": "Print Position",
        "values": [
          "Left Chest",
          "Front Center",
          "Back Large",
          "Chest + Back"
        ]
      }
    ],
    "variants": [
      {
        "id": "premium-round-neck-tshirt-m-black",
        "title": "M / Jet Black",
        "sku": "APP-PREM-MBK",
        price: money(39900),
        compareAtPrice: money(49900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "M (40)"
          },
          {
            "name": "Colour",
            "value": "Jet Black"
          }
        ]
      },
      {
        "id": "premium-round-neck-tshirt-l-black",
        "title": "L / Jet Black",
        "sku": "APP-PREM-LBK",
        price: money(39900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "L (42)"
          },
          {
            "name": "Colour",
            "value": "Jet Black"
          }
        ]
      },
      {
        "id": "premium-round-neck-tshirt-l-navy",
        "title": "L / Navy Blue",
        "sku": "APP-PREM-LNV",
        price: money(39900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "L (42)"
          },
          {
            "name": "Colour",
            "value": "Navy Blue"
          }
        ]
      }
    ],
    priceFrom: money(39900),
    compareAtFrom: money(49900),
    "quantityTiers": [
      {
        "qty": 1,
        price: money(39900),
        compareAtPrice: money(49900)
      },
      {
        "qty": 10,
        price: money(359100)
      },
      {
        "qty": 25,
        price: money(798000),
        "note": "Team Pack"
      },
      {
        "qty": 50,
        price: money(1436400),
        "note": "Bulk Saver"
      }
    ],
    "priceUnit": "per piece",
    "specs": [
      {
        "label": "Material",
        "value": "100% Combed Cotton / Bio-Washed"
      },
      {
        "label": "Fabric Density",
        "value": "180 - 240 GSM"
      },
      {
        "label": "Printing Technique",
        "value": "DTF / High-Density Screen Print"
      },
      {
        "label": "Fit Type",
        "value": "Regular Comfort Fit"
      },
      {
        "label": "Care Instructions",
        "value": "Machine wash cold, iron inside out"
      }
    ],
    "minOrderQty": 1,
    "turnaroundDays": 3,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.5,
    "reviewCount": 266,
    "faqs": [
      {
        "q": "How long will the print last after washing?",
        "a": "Our DTF and screen prints withstand 50+ machine washes when washed inside out in cold water."
      },
      {
        "q": "Can I order samples before placing a bulk team order?",
        "a": "Yes, single piece orders are supported with full custom printing before committing to volume runs."
      },
      {
        "q": "What is the maximum print dimension on the chest?",
        "a": "Standard front center prints measure up to 10 × 12 inches, while left chest logos are 3.5 × 3.5 inches."
      }
    ],
    "relatedHandles": [
      "cotton-premium-round-neck",
      "ultra-premium-polo",
      "hooded-sweatshirt",
      "dry-fit-round-neck"
    ],
    "highlights": [
      "Pre-shrunk ring-spun bio-washed cotton",
      "Wash-fast inks resistant to fading and cracking",
      "Reinforced double-needle neck and hem stitching"
    ]
  },
  {
    "id": "prod-ultra-premium-round-neck-tshirt",
    "handle": "ultra-premium-round-neck-tshirt",
    "title": "Ultra Premium Round Neck",
    "subtitle": "100% breathable fabric, high-durability digital / screen print",
    "description": "Premium quality Ultra Premium Round Neck engineered for supreme comfort and vibrant logo reproduction. Ideal for corporate branding, events, and personal merchandise.",
    "productType": "Apparel",
    "categoryHandles": [
      "apparel"
    ],
    "tags": [
      "ultra premium round neck",
      "apparel",
      "tshirt",
      "premium"
    ],
    "badges": [
      "premium"
    ],
    "images": [
      {
        "url": "",
        "altText": "Ultra Premium Round Neck preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "tshirt",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Ultra Premium Round Neck detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "tshirt",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Ultra Premium Round Neck packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "tshirt",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Size",
        "values": [
          "S (38)",
          "M (40)",
          "L (42)",
          "XL (44)",
          "XXL (46)"
        ]
      },
      {
        "name": "Colour",
        "values": [
          "Jet Black",
          "Navy Blue",
          "Heather Grey",
          "Pure White"
        ]
      },
      {
        "name": "Print Position",
        "values": [
          "Left Chest",
          "Front Center",
          "Back Large",
          "Chest + Back"
        ]
      }
    ],
    "variants": [
      {
        "id": "ultra-premium-round-neck-tshirt-m-black",
        "title": "M / Jet Black",
        "sku": "APP-ULTR-MBK",
        price: money(39900),
        compareAtPrice: money(49900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "M (40)"
          },
          {
            "name": "Colour",
            "value": "Jet Black"
          }
        ]
      },
      {
        "id": "ultra-premium-round-neck-tshirt-l-black",
        "title": "L / Jet Black",
        "sku": "APP-ULTR-LBK",
        price: money(39900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "L (42)"
          },
          {
            "name": "Colour",
            "value": "Jet Black"
          }
        ]
      },
      {
        "id": "ultra-premium-round-neck-tshirt-l-navy",
        "title": "L / Navy Blue",
        "sku": "APP-ULTR-LNV",
        price: money(39900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "L (42)"
          },
          {
            "name": "Colour",
            "value": "Navy Blue"
          }
        ]
      }
    ],
    priceFrom: money(39900),
    compareAtFrom: money(49900),
    "quantityTiers": [
      {
        "qty": 1,
        price: money(39900),
        compareAtPrice: money(49900)
      },
      {
        "qty": 10,
        price: money(359100)
      },
      {
        "qty": 25,
        price: money(798000),
        "note": "Team Pack"
      },
      {
        "qty": 50,
        price: money(1436400),
        "note": "Bulk Saver"
      }
    ],
    "priceUnit": "per piece",
    "specs": [
      {
        "label": "Material",
        "value": "100% Combed Cotton / Bio-Washed"
      },
      {
        "label": "Fabric Density",
        "value": "180 - 240 GSM"
      },
      {
        "label": "Printing Technique",
        "value": "DTF / High-Density Screen Print"
      },
      {
        "label": "Fit Type",
        "value": "Regular Comfort Fit"
      },
      {
        "label": "Care Instructions",
        "value": "Machine wash cold, iron inside out"
      }
    ],
    "minOrderQty": 1,
    "turnaroundDays": 3,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.8,
    "reviewCount": 73,
    "faqs": [
      {
        "q": "How long will the print last after washing?",
        "a": "Our DTF and screen prints withstand 50+ machine washes when washed inside out in cold water."
      },
      {
        "q": "Can I order samples before placing a bulk team order?",
        "a": "Yes, single piece orders are supported with full custom printing before committing to volume runs."
      },
      {
        "q": "What is the maximum print dimension on the chest?",
        "a": "Standard front center prints measure up to 10 × 12 inches, while left chest logos are 3.5 × 3.5 inches."
      }
    ],
    "relatedHandles": [
      "cotton-premium-round-neck",
      "ultra-premium-polo",
      "hooded-sweatshirt",
      "dry-fit-round-neck"
    ],
    "highlights": [
      "Pre-shrunk ring-spun bio-washed cotton",
      "Wash-fast inks resistant to fading and cracking",
      "Reinforced double-needle neck and hem stitching"
    ]
  },
  {
    "id": "prod-high-neck-tshirt",
    "handle": "high-neck-tshirt",
    "title": "High Neck T-Shirt",
    "subtitle": "100% breathable fabric, high-durability digital / screen print",
    "description": "Premium quality High Neck T-Shirt engineered for supreme comfort and vibrant logo reproduction. Ideal for corporate branding, events, and personal merchandise.",
    "productType": "Apparel",
    "categoryHandles": [
      "apparel"
    ],
    "tags": [
      "high neck t-shirt",
      "apparel",
      "tshirt",
      "new"
    ],
    "badges": [
      "new"
    ],
    "images": [
      {
        "url": "",
        "altText": "High Neck T-Shirt preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "tshirt",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "High Neck T-Shirt detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "tshirt",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "High Neck T-Shirt packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "tshirt",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Size",
        "values": [
          "S (38)",
          "M (40)",
          "L (42)",
          "XL (44)",
          "XXL (46)"
        ]
      },
      {
        "name": "Colour",
        "values": [
          "Jet Black",
          "Navy Blue",
          "Heather Grey",
          "Pure White"
        ]
      },
      {
        "name": "Print Position",
        "values": [
          "Left Chest",
          "Front Center",
          "Back Large",
          "Chest + Back"
        ]
      }
    ],
    "variants": [
      {
        "id": "high-neck-tshirt-m-black",
        "title": "M / Jet Black",
        "sku": "APP-HIGH-MBK",
        price: money(39900),
        compareAtPrice: money(49900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "M (40)"
          },
          {
            "name": "Colour",
            "value": "Jet Black"
          }
        ]
      },
      {
        "id": "high-neck-tshirt-l-black",
        "title": "L / Jet Black",
        "sku": "APP-HIGH-LBK",
        price: money(39900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "L (42)"
          },
          {
            "name": "Colour",
            "value": "Jet Black"
          }
        ]
      },
      {
        "id": "high-neck-tshirt-l-navy",
        "title": "L / Navy Blue",
        "sku": "APP-HIGH-LNV",
        price: money(39900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "L (42)"
          },
          {
            "name": "Colour",
            "value": "Navy Blue"
          }
        ]
      }
    ],
    priceFrom: money(39900),
    compareAtFrom: money(49900),
    "quantityTiers": [
      {
        "qty": 1,
        price: money(39900),
        compareAtPrice: money(49900)
      },
      {
        "qty": 10,
        price: money(359100)
      },
      {
        "qty": 25,
        price: money(798000),
        "note": "Team Pack"
      },
      {
        "qty": 50,
        price: money(1436400),
        "note": "Bulk Saver"
      }
    ],
    "priceUnit": "per piece",
    "specs": [
      {
        "label": "Material",
        "value": "100% Combed Cotton / Bio-Washed"
      },
      {
        "label": "Fabric Density",
        "value": "180 - 240 GSM"
      },
      {
        "label": "Printing Technique",
        "value": "DTF / High-Density Screen Print"
      },
      {
        "label": "Fit Type",
        "value": "Regular Comfort Fit"
      },
      {
        "label": "Care Instructions",
        "value": "Machine wash cold, iron inside out"
      }
    ],
    "minOrderQty": 1,
    "turnaroundDays": 3,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.9,
    "reviewCount": 426,
    "faqs": [
      {
        "q": "How long will the print last after washing?",
        "a": "Our DTF and screen prints withstand 50+ machine washes when washed inside out in cold water."
      },
      {
        "q": "Can I order samples before placing a bulk team order?",
        "a": "Yes, single piece orders are supported with full custom printing before committing to volume runs."
      },
      {
        "q": "What is the maximum print dimension on the chest?",
        "a": "Standard front center prints measure up to 10 × 12 inches, while left chest logos are 3.5 × 3.5 inches."
      }
    ],
    "relatedHandles": [
      "cotton-premium-round-neck",
      "ultra-premium-polo",
      "hooded-sweatshirt",
      "dry-fit-round-neck"
    ],
    "highlights": [
      "Pre-shrunk ring-spun bio-washed cotton",
      "Wash-fast inks resistant to fading and cracking",
      "Reinforced double-needle neck and hem stitching"
    ]
  },
  {
    "id": "prod-standard-polo",
    "handle": "standard-polo",
    "title": "Standard Polo",
    "subtitle": "100% breathable fabric, high-durability digital / screen print",
    "description": "Premium quality Standard Polo engineered for supreme comfort and vibrant logo reproduction. Ideal for corporate branding, events, and personal merchandise.",
    "productType": "Apparel",
    "categoryHandles": [
      "apparel"
    ],
    "tags": [
      "standard polo",
      "apparel",
      "polo"
    ],
    "badges": [],
    "images": [
      {
        "url": "",
        "altText": "Standard Polo preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "polo",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Standard Polo detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "polo",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Standard Polo packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "polo",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Size",
        "values": [
          "S (38)",
          "M (40)",
          "L (42)",
          "XL (44)",
          "XXL (46)"
        ]
      },
      {
        "name": "Colour",
        "values": [
          "Jet Black",
          "Navy Blue",
          "Heather Grey",
          "Pure White"
        ]
      },
      {
        "name": "Print Position",
        "values": [
          "Left Chest",
          "Front Center",
          "Back Large",
          "Chest + Back"
        ]
      }
    ],
    "variants": [
      {
        "id": "standard-polo-m-black",
        "title": "M / Jet Black",
        "sku": "APP-STAN-MBK",
        price: money(64900),
        compareAtPrice: money(79900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "M (40)"
          },
          {
            "name": "Colour",
            "value": "Jet Black"
          }
        ]
      },
      {
        "id": "standard-polo-l-black",
        "title": "L / Jet Black",
        "sku": "APP-STAN-LBK",
        price: money(64900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "L (42)"
          },
          {
            "name": "Colour",
            "value": "Jet Black"
          }
        ]
      },
      {
        "id": "standard-polo-l-navy",
        "title": "L / Navy Blue",
        "sku": "APP-STAN-LNV",
        price: money(64900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "L (42)"
          },
          {
            "name": "Colour",
            "value": "Navy Blue"
          }
        ]
      }
    ],
    priceFrom: money(64900),
    compareAtFrom: money(79900),
    "quantityTiers": [
      {
        "qty": 1,
        price: money(64900),
        compareAtPrice: money(79900)
      },
      {
        "qty": 10,
        price: money(584100)
      },
      {
        "qty": 25,
        price: money(1298000),
        "note": "Team Pack"
      },
      {
        "qty": 50,
        price: money(2336400),
        "note": "Bulk Saver"
      }
    ],
    "priceUnit": "per piece",
    "specs": [
      {
        "label": "Material",
        "value": "100% Combed Cotton / Bio-Washed"
      },
      {
        "label": "Fabric Density",
        "value": "180 - 240 GSM"
      },
      {
        "label": "Printing Technique",
        "value": "DTF / High-Density Screen Print"
      },
      {
        "label": "Fit Type",
        "value": "Regular Comfort Fit"
      },
      {
        "label": "Care Instructions",
        "value": "Machine wash cold, iron inside out"
      }
    ],
    "minOrderQty": 1,
    "turnaroundDays": 3,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.6,
    "reviewCount": 201,
    "faqs": [
      {
        "q": "How long will the print last after washing?",
        "a": "Our DTF and screen prints withstand 50+ machine washes when washed inside out in cold water."
      },
      {
        "q": "Can I order samples before placing a bulk team order?",
        "a": "Yes, single piece orders are supported with full custom printing before committing to volume runs."
      },
      {
        "q": "What is the maximum print dimension on the chest?",
        "a": "Standard front center prints measure up to 10 × 12 inches, while left chest logos are 3.5 × 3.5 inches."
      }
    ],
    "relatedHandles": [
      "cotton-premium-round-neck",
      "ultra-premium-polo",
      "hooded-sweatshirt",
      "dry-fit-round-neck"
    ],
    "highlights": [
      "Pre-shrunk ring-spun bio-washed cotton",
      "Wash-fast inks resistant to fading and cracking",
      "Reinforced double-needle neck and hem stitching"
    ]
  },
  {
    "id": "prod-premium-polo",
    "handle": "premium-polo",
    "title": "Premium Polo",
    "subtitle": "100% breathable fabric, high-durability digital / screen print",
    "description": "Premium quality Premium Polo engineered for supreme comfort and vibrant logo reproduction. Ideal for corporate branding, events, and personal merchandise.",
    "productType": "Apparel",
    "categoryHandles": [
      "apparel"
    ],
    "tags": [
      "premium polo",
      "apparel",
      "polo"
    ],
    "badges": [],
    "images": [
      {
        "url": "",
        "altText": "Premium Polo preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "polo",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Premium Polo detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "polo",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Premium Polo packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "polo",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Size",
        "values": [
          "S (38)",
          "M (40)",
          "L (42)",
          "XL (44)",
          "XXL (46)"
        ]
      },
      {
        "name": "Colour",
        "values": [
          "Jet Black",
          "Navy Blue",
          "Heather Grey",
          "Pure White"
        ]
      },
      {
        "name": "Print Position",
        "values": [
          "Left Chest",
          "Front Center",
          "Back Large",
          "Chest + Back"
        ]
      }
    ],
    "variants": [
      {
        "id": "premium-polo-m-black",
        "title": "M / Jet Black",
        "sku": "APP-PREM-MBK",
        price: money(64900),
        compareAtPrice: money(79900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "M (40)"
          },
          {
            "name": "Colour",
            "value": "Jet Black"
          }
        ]
      },
      {
        "id": "premium-polo-l-black",
        "title": "L / Jet Black",
        "sku": "APP-PREM-LBK",
        price: money(64900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "L (42)"
          },
          {
            "name": "Colour",
            "value": "Jet Black"
          }
        ]
      },
      {
        "id": "premium-polo-l-navy",
        "title": "L / Navy Blue",
        "sku": "APP-PREM-LNV",
        price: money(64900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "L (42)"
          },
          {
            "name": "Colour",
            "value": "Navy Blue"
          }
        ]
      }
    ],
    priceFrom: money(64900),
    compareAtFrom: money(79900),
    "quantityTiers": [
      {
        "qty": 1,
        price: money(64900),
        compareAtPrice: money(79900)
      },
      {
        "qty": 10,
        price: money(584100)
      },
      {
        "qty": 25,
        price: money(1298000),
        "note": "Team Pack"
      },
      {
        "qty": 50,
        price: money(2336400),
        "note": "Bulk Saver"
      }
    ],
    "priceUnit": "per piece",
    "specs": [
      {
        "label": "Material",
        "value": "100% Combed Cotton / Bio-Washed"
      },
      {
        "label": "Fabric Density",
        "value": "180 - 240 GSM"
      },
      {
        "label": "Printing Technique",
        "value": "DTF / High-Density Screen Print"
      },
      {
        "label": "Fit Type",
        "value": "Regular Comfort Fit"
      },
      {
        "label": "Care Instructions",
        "value": "Machine wash cold, iron inside out"
      }
    ],
    "minOrderQty": 1,
    "turnaroundDays": 3,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.4,
    "reviewCount": 91,
    "faqs": [
      {
        "q": "How long will the print last after washing?",
        "a": "Our DTF and screen prints withstand 50+ machine washes when washed inside out in cold water."
      },
      {
        "q": "Can I order samples before placing a bulk team order?",
        "a": "Yes, single piece orders are supported with full custom printing before committing to volume runs."
      },
      {
        "q": "What is the maximum print dimension on the chest?",
        "a": "Standard front center prints measure up to 10 × 12 inches, while left chest logos are 3.5 × 3.5 inches."
      }
    ],
    "relatedHandles": [
      "cotton-premium-round-neck",
      "ultra-premium-polo",
      "hooded-sweatshirt",
      "dry-fit-round-neck"
    ],
    "highlights": [
      "Pre-shrunk ring-spun bio-washed cotton",
      "Wash-fast inks resistant to fading and cracking",
      "Reinforced double-needle neck and hem stitching"
    ]
  },
  {
    "id": "prod-popcorn-knit-polo",
    "handle": "popcorn-knit-polo",
    "title": "Popcorn Knit Polo",
    "subtitle": "100% breathable fabric, high-durability digital / screen print",
    "description": "Premium quality Popcorn Knit Polo engineered for supreme comfort and vibrant logo reproduction. Ideal for corporate branding, events, and personal merchandise.",
    "productType": "Apparel",
    "categoryHandles": [
      "apparel"
    ],
    "tags": [
      "popcorn knit polo",
      "apparel",
      "polo",
      "new"
    ],
    "badges": [
      "new"
    ],
    "images": [
      {
        "url": "",
        "altText": "Popcorn Knit Polo preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "polo",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Popcorn Knit Polo detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "polo",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Popcorn Knit Polo packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "polo",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Size",
        "values": [
          "S (38)",
          "M (40)",
          "L (42)",
          "XL (44)",
          "XXL (46)"
        ]
      },
      {
        "name": "Colour",
        "values": [
          "Jet Black",
          "Navy Blue",
          "Heather Grey",
          "Pure White"
        ]
      },
      {
        "name": "Print Position",
        "values": [
          "Left Chest",
          "Front Center",
          "Back Large",
          "Chest + Back"
        ]
      }
    ],
    "variants": [
      {
        "id": "popcorn-knit-polo-m-black",
        "title": "M / Jet Black",
        "sku": "APP-POPC-MBK",
        price: money(64900),
        compareAtPrice: money(79900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "M (40)"
          },
          {
            "name": "Colour",
            "value": "Jet Black"
          }
        ]
      },
      {
        "id": "popcorn-knit-polo-l-black",
        "title": "L / Jet Black",
        "sku": "APP-POPC-LBK",
        price: money(64900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "L (42)"
          },
          {
            "name": "Colour",
            "value": "Jet Black"
          }
        ]
      },
      {
        "id": "popcorn-knit-polo-l-navy",
        "title": "L / Navy Blue",
        "sku": "APP-POPC-LNV",
        price: money(64900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "L (42)"
          },
          {
            "name": "Colour",
            "value": "Navy Blue"
          }
        ]
      }
    ],
    priceFrom: money(64900),
    compareAtFrom: money(79900),
    "quantityTiers": [
      {
        "qty": 1,
        price: money(64900),
        compareAtPrice: money(79900)
      },
      {
        "qty": 10,
        price: money(584100)
      },
      {
        "qty": 25,
        price: money(1298000),
        "note": "Team Pack"
      },
      {
        "qty": 50,
        price: money(2336400),
        "note": "Bulk Saver"
      }
    ],
    "priceUnit": "per piece",
    "specs": [
      {
        "label": "Material",
        "value": "100% Combed Cotton / Bio-Washed"
      },
      {
        "label": "Fabric Density",
        "value": "180 - 240 GSM"
      },
      {
        "label": "Printing Technique",
        "value": "DTF / High-Density Screen Print"
      },
      {
        "label": "Fit Type",
        "value": "Regular Comfort Fit"
      },
      {
        "label": "Care Instructions",
        "value": "Machine wash cold, iron inside out"
      }
    ],
    "minOrderQty": 1,
    "turnaroundDays": 3,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.9,
    "reviewCount": 244,
    "faqs": [
      {
        "q": "How long will the print last after washing?",
        "a": "Our DTF and screen prints withstand 50+ machine washes when washed inside out in cold water."
      },
      {
        "q": "Can I order samples before placing a bulk team order?",
        "a": "Yes, single piece orders are supported with full custom printing before committing to volume runs."
      },
      {
        "q": "What is the maximum print dimension on the chest?",
        "a": "Standard front center prints measure up to 10 × 12 inches, while left chest logos are 3.5 × 3.5 inches."
      }
    ],
    "relatedHandles": [
      "cotton-premium-round-neck",
      "ultra-premium-polo",
      "hooded-sweatshirt",
      "dry-fit-round-neck"
    ],
    "highlights": [
      "Pre-shrunk ring-spun bio-washed cotton",
      "Wash-fast inks resistant to fading and cracking",
      "Reinforced double-needle neck and hem stitching"
    ]
  },
  {
    "id": "prod-crew-neck-sweatshirt",
    "handle": "crew-neck-sweatshirt",
    "title": "Crew Neck Sweatshirt",
    "subtitle": "100% breathable fabric, high-durability digital / screen print",
    "description": "Premium quality Crew Neck Sweatshirt engineered for supreme comfort and vibrant logo reproduction. Ideal for corporate branding, events, and personal merchandise.",
    "productType": "Apparel",
    "categoryHandles": [
      "apparel"
    ],
    "tags": [
      "crew neck sweatshirt",
      "apparel",
      "tshirt"
    ],
    "badges": [],
    "images": [
      {
        "url": "",
        "altText": "Crew Neck Sweatshirt preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "tshirt",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Crew Neck Sweatshirt detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "tshirt",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Crew Neck Sweatshirt packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "tshirt",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Size",
        "values": [
          "S (38)",
          "M (40)",
          "L (42)",
          "XL (44)",
          "XXL (46)"
        ]
      },
      {
        "name": "Colour",
        "values": [
          "Jet Black",
          "Navy Blue",
          "Heather Grey",
          "Pure White"
        ]
      },
      {
        "name": "Print Position",
        "values": [
          "Left Chest",
          "Front Center",
          "Back Large",
          "Chest + Back"
        ]
      }
    ],
    "variants": [
      {
        "id": "crew-neck-sweatshirt-m-black",
        "title": "M / Jet Black",
        "sku": "APP-CREW-MBK",
        price: money(99900),
        compareAtPrice: money(129900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "M (40)"
          },
          {
            "name": "Colour",
            "value": "Jet Black"
          }
        ]
      },
      {
        "id": "crew-neck-sweatshirt-l-black",
        "title": "L / Jet Black",
        "sku": "APP-CREW-LBK",
        price: money(99900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "L (42)"
          },
          {
            "name": "Colour",
            "value": "Jet Black"
          }
        ]
      },
      {
        "id": "crew-neck-sweatshirt-l-navy",
        "title": "L / Navy Blue",
        "sku": "APP-CREW-LNV",
        price: money(99900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "L (42)"
          },
          {
            "name": "Colour",
            "value": "Navy Blue"
          }
        ]
      }
    ],
    priceFrom: money(99900),
    compareAtFrom: money(129900),
    "quantityTiers": [
      {
        "qty": 1,
        price: money(99900),
        compareAtPrice: money(129900)
      },
      {
        "qty": 10,
        price: money(899100)
      },
      {
        "qty": 25,
        price: money(1998000),
        "note": "Team Pack"
      },
      {
        "qty": 50,
        price: money(3596400),
        "note": "Bulk Saver"
      }
    ],
    "priceUnit": "per piece",
    "specs": [
      {
        "label": "Material",
        "value": "100% Combed Cotton / Bio-Washed"
      },
      {
        "label": "Fabric Density",
        "value": "180 - 240 GSM"
      },
      {
        "label": "Printing Technique",
        "value": "DTF / High-Density Screen Print"
      },
      {
        "label": "Fit Type",
        "value": "Regular Comfort Fit"
      },
      {
        "label": "Care Instructions",
        "value": "Machine wash cold, iron inside out"
      }
    ],
    "minOrderQty": 1,
    "turnaroundDays": 3,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.6,
    "reviewCount": 617,
    "faqs": [
      {
        "q": "How long will the print last after washing?",
        "a": "Our DTF and screen prints withstand 50+ machine washes when washed inside out in cold water."
      },
      {
        "q": "Can I order samples before placing a bulk team order?",
        "a": "Yes, single piece orders are supported with full custom printing before committing to volume runs."
      },
      {
        "q": "What is the maximum print dimension on the chest?",
        "a": "Standard front center prints measure up to 10 × 12 inches, while left chest logos are 3.5 × 3.5 inches."
      }
    ],
    "relatedHandles": [
      "cotton-premium-round-neck",
      "ultra-premium-polo",
      "hooded-sweatshirt",
      "dry-fit-round-neck"
    ],
    "highlights": [
      "Pre-shrunk ring-spun bio-washed cotton",
      "Wash-fast inks resistant to fading and cracking",
      "Reinforced double-needle neck and hem stitching"
    ]
  },
  {
    "id": "prod-zipper-hoodie",
    "handle": "zipper-hoodie",
    "title": "Zipper Hoodie",
    "subtitle": "100% breathable fabric, high-durability digital / screen print",
    "description": "Premium quality Zipper Hoodie engineered for supreme comfort and vibrant logo reproduction. Ideal for corporate branding, events, and personal merchandise.",
    "productType": "Apparel",
    "categoryHandles": [
      "apparel"
    ],
    "tags": [
      "zipper hoodie",
      "apparel",
      "hoodie"
    ],
    "badges": [],
    "images": [
      {
        "url": "",
        "altText": "Zipper Hoodie preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "hoodie",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Zipper Hoodie detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "hoodie",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Zipper Hoodie packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "hoodie",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Size",
        "values": [
          "S (38)",
          "M (40)",
          "L (42)",
          "XL (44)",
          "XXL (46)"
        ]
      },
      {
        "name": "Colour",
        "values": [
          "Jet Black",
          "Navy Blue",
          "Heather Grey",
          "Pure White"
        ]
      },
      {
        "name": "Print Position",
        "values": [
          "Left Chest",
          "Front Center",
          "Back Large",
          "Chest + Back"
        ]
      }
    ],
    "variants": [
      {
        "id": "zipper-hoodie-m-black",
        "title": "M / Jet Black",
        "sku": "APP-ZIPP-MBK",
        price: money(99900),
        compareAtPrice: money(129900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "M (40)"
          },
          {
            "name": "Colour",
            "value": "Jet Black"
          }
        ]
      },
      {
        "id": "zipper-hoodie-l-black",
        "title": "L / Jet Black",
        "sku": "APP-ZIPP-LBK",
        price: money(99900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "L (42)"
          },
          {
            "name": "Colour",
            "value": "Jet Black"
          }
        ]
      },
      {
        "id": "zipper-hoodie-l-navy",
        "title": "L / Navy Blue",
        "sku": "APP-ZIPP-LNV",
        price: money(99900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "L (42)"
          },
          {
            "name": "Colour",
            "value": "Navy Blue"
          }
        ]
      }
    ],
    priceFrom: money(99900),
    compareAtFrom: money(129900),
    "quantityTiers": [
      {
        "qty": 1,
        price: money(99900),
        compareAtPrice: money(129900)
      },
      {
        "qty": 10,
        price: money(899100)
      },
      {
        "qty": 25,
        price: money(1998000),
        "note": "Team Pack"
      },
      {
        "qty": 50,
        price: money(3596400),
        "note": "Bulk Saver"
      }
    ],
    "priceUnit": "per piece",
    "specs": [
      {
        "label": "Material",
        "value": "100% Combed Cotton / Bio-Washed"
      },
      {
        "label": "Fabric Density",
        "value": "180 - 240 GSM"
      },
      {
        "label": "Printing Technique",
        "value": "DTF / High-Density Screen Print"
      },
      {
        "label": "Fit Type",
        "value": "Regular Comfort Fit"
      },
      {
        "label": "Care Instructions",
        "value": "Machine wash cold, iron inside out"
      }
    ],
    "minOrderQty": 1,
    "turnaroundDays": 3,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.9,
    "reviewCount": 380,
    "faqs": [
      {
        "q": "How long will the print last after washing?",
        "a": "Our DTF and screen prints withstand 50+ machine washes when washed inside out in cold water."
      },
      {
        "q": "Can I order samples before placing a bulk team order?",
        "a": "Yes, single piece orders are supported with full custom printing before committing to volume runs."
      },
      {
        "q": "What is the maximum print dimension on the chest?",
        "a": "Standard front center prints measure up to 10 × 12 inches, while left chest logos are 3.5 × 3.5 inches."
      }
    ],
    "relatedHandles": [
      "cotton-premium-round-neck",
      "ultra-premium-polo",
      "hooded-sweatshirt",
      "dry-fit-round-neck"
    ],
    "highlights": [
      "Pre-shrunk ring-spun bio-washed cotton",
      "Wash-fast inks resistant to fading and cracking",
      "Reinforced double-needle neck and hem stitching"
    ]
  },
  {
    "id": "prod-classic-high-neck-jacket",
    "handle": "classic-high-neck-jacket",
    "title": "Classic High Neck Jacket",
    "subtitle": "100% breathable fabric, high-durability digital / screen print",
    "description": "Premium quality Classic High Neck Jacket engineered for supreme comfort and vibrant logo reproduction. Ideal for corporate branding, events, and personal merchandise.",
    "productType": "Apparel",
    "categoryHandles": [
      "apparel"
    ],
    "tags": [
      "classic high neck jacket",
      "apparel",
      "hoodie"
    ],
    "badges": [],
    "images": [
      {
        "url": "",
        "altText": "Classic High Neck Jacket preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "hoodie",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Classic High Neck Jacket detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "hoodie",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Classic High Neck Jacket packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "hoodie",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Size",
        "values": [
          "S (38)",
          "M (40)",
          "L (42)",
          "XL (44)",
          "XXL (46)"
        ]
      },
      {
        "name": "Colour",
        "values": [
          "Jet Black",
          "Navy Blue",
          "Heather Grey",
          "Pure White"
        ]
      },
      {
        "name": "Print Position",
        "values": [
          "Left Chest",
          "Front Center",
          "Back Large",
          "Chest + Back"
        ]
      }
    ],
    "variants": [
      {
        "id": "classic-high-neck-jacket-m-black",
        "title": "M / Jet Black",
        "sku": "APP-CLAS-MBK",
        price: money(99900),
        compareAtPrice: money(129900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "M (40)"
          },
          {
            "name": "Colour",
            "value": "Jet Black"
          }
        ]
      },
      {
        "id": "classic-high-neck-jacket-l-black",
        "title": "L / Jet Black",
        "sku": "APP-CLAS-LBK",
        price: money(99900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "L (42)"
          },
          {
            "name": "Colour",
            "value": "Jet Black"
          }
        ]
      },
      {
        "id": "classic-high-neck-jacket-l-navy",
        "title": "L / Navy Blue",
        "sku": "APP-CLAS-LNV",
        price: money(99900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "L (42)"
          },
          {
            "name": "Colour",
            "value": "Navy Blue"
          }
        ]
      }
    ],
    priceFrom: money(99900),
    compareAtFrom: money(129900),
    "quantityTiers": [
      {
        "qty": 1,
        price: money(99900),
        compareAtPrice: money(129900)
      },
      {
        "qty": 10,
        price: money(899100)
      },
      {
        "qty": 25,
        price: money(1998000),
        "note": "Team Pack"
      },
      {
        "qty": 50,
        price: money(3596400),
        "note": "Bulk Saver"
      }
    ],
    "priceUnit": "per piece",
    "specs": [
      {
        "label": "Material",
        "value": "100% Combed Cotton / Bio-Washed"
      },
      {
        "label": "Fabric Density",
        "value": "180 - 240 GSM"
      },
      {
        "label": "Printing Technique",
        "value": "DTF / High-Density Screen Print"
      },
      {
        "label": "Fit Type",
        "value": "Regular Comfort Fit"
      },
      {
        "label": "Care Instructions",
        "value": "Machine wash cold, iron inside out"
      }
    ],
    "minOrderQty": 1,
    "turnaroundDays": 3,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.8,
    "reviewCount": 133,
    "faqs": [
      {
        "q": "How long will the print last after washing?",
        "a": "Our DTF and screen prints withstand 50+ machine washes when washed inside out in cold water."
      },
      {
        "q": "Can I order samples before placing a bulk team order?",
        "a": "Yes, single piece orders are supported with full custom printing before committing to volume runs."
      },
      {
        "q": "What is the maximum print dimension on the chest?",
        "a": "Standard front center prints measure up to 10 × 12 inches, while left chest logos are 3.5 × 3.5 inches."
      }
    ],
    "relatedHandles": [
      "cotton-premium-round-neck",
      "ultra-premium-polo",
      "hooded-sweatshirt",
      "dry-fit-round-neck"
    ],
    "highlights": [
      "Pre-shrunk ring-spun bio-washed cotton",
      "Wash-fast inks resistant to fading and cracking",
      "Reinforced double-needle neck and hem stitching"
    ]
  },
  {
    "id": "prod-bomber-jacket",
    "handle": "bomber-jacket",
    "title": "Bomber Jacket",
    "subtitle": "100% breathable fabric, high-durability digital / screen print",
    "description": "Premium quality Bomber Jacket engineered for supreme comfort and vibrant logo reproduction. Ideal for corporate branding, events, and personal merchandise.",
    "productType": "Apparel",
    "categoryHandles": [
      "apparel"
    ],
    "tags": [
      "bomber jacket",
      "apparel",
      "hoodie",
      "premium"
    ],
    "badges": [
      "premium"
    ],
    "images": [
      {
        "url": "",
        "altText": "Bomber Jacket preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "hoodie",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Bomber Jacket detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "hoodie",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Bomber Jacket packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "hoodie",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Size",
        "values": [
          "S (38)",
          "M (40)",
          "L (42)",
          "XL (44)",
          "XXL (46)"
        ]
      },
      {
        "name": "Colour",
        "values": [
          "Jet Black",
          "Navy Blue",
          "Heather Grey",
          "Pure White"
        ]
      },
      {
        "name": "Print Position",
        "values": [
          "Left Chest",
          "Front Center",
          "Back Large",
          "Chest + Back"
        ]
      }
    ],
    "variants": [
      {
        "id": "bomber-jacket-m-black",
        "title": "M / Jet Black",
        "sku": "APP-BOMB-MBK",
        price: money(99900),
        compareAtPrice: money(129900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "M (40)"
          },
          {
            "name": "Colour",
            "value": "Jet Black"
          }
        ]
      },
      {
        "id": "bomber-jacket-l-black",
        "title": "L / Jet Black",
        "sku": "APP-BOMB-LBK",
        price: money(99900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "L (42)"
          },
          {
            "name": "Colour",
            "value": "Jet Black"
          }
        ]
      },
      {
        "id": "bomber-jacket-l-navy",
        "title": "L / Navy Blue",
        "sku": "APP-BOMB-LNV",
        price: money(99900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "L (42)"
          },
          {
            "name": "Colour",
            "value": "Navy Blue"
          }
        ]
      }
    ],
    priceFrom: money(99900),
    compareAtFrom: money(129900),
    "quantityTiers": [
      {
        "qty": 1,
        price: money(99900),
        compareAtPrice: money(129900)
      },
      {
        "qty": 10,
        price: money(899100)
      },
      {
        "qty": 25,
        price: money(1998000),
        "note": "Team Pack"
      },
      {
        "qty": 50,
        price: money(3596400),
        "note": "Bulk Saver"
      }
    ],
    "priceUnit": "per piece",
    "specs": [
      {
        "label": "Material",
        "value": "100% Combed Cotton / Bio-Washed"
      },
      {
        "label": "Fabric Density",
        "value": "180 - 240 GSM"
      },
      {
        "label": "Printing Technique",
        "value": "DTF / High-Density Screen Print"
      },
      {
        "label": "Fit Type",
        "value": "Regular Comfort Fit"
      },
      {
        "label": "Care Instructions",
        "value": "Machine wash cold, iron inside out"
      }
    ],
    "minOrderQty": 1,
    "turnaroundDays": 3,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.4,
    "reviewCount": 681,
    "faqs": [
      {
        "q": "How long will the print last after washing?",
        "a": "Our DTF and screen prints withstand 50+ machine washes when washed inside out in cold water."
      },
      {
        "q": "Can I order samples before placing a bulk team order?",
        "a": "Yes, single piece orders are supported with full custom printing before committing to volume runs."
      },
      {
        "q": "What is the maximum print dimension on the chest?",
        "a": "Standard front center prints measure up to 10 × 12 inches, while left chest logos are 3.5 × 3.5 inches."
      }
    ],
    "relatedHandles": [
      "cotton-premium-round-neck",
      "ultra-premium-polo",
      "hooded-sweatshirt",
      "dry-fit-round-neck"
    ],
    "highlights": [
      "Pre-shrunk ring-spun bio-washed cotton",
      "Wash-fast inks resistant to fading and cracking",
      "Reinforced double-needle neck and hem stitching"
    ]
  },
  {
    "id": "prod-bulk-team-kits",
    "handle": "bulk-team-kits",
    "title": "Bulk Team Kits",
    "subtitle": "100% breathable fabric, high-durability digital / screen print",
    "description": "Premium quality Bulk Team Kits engineered for supreme comfort and vibrant logo reproduction. Ideal for corporate branding, events, and personal merchandise.",
    "productType": "Apparel",
    "categoryHandles": [
      "apparel",
      "bulk"
    ],
    "tags": [
      "bulk team kits",
      "apparel",
      "tshirt",
      "bulk-saver"
    ],
    "badges": [
      "bulk-saver"
    ],
    "images": [
      {
        "url": "",
        "altText": "Bulk Team Kits preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "tshirt",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Bulk Team Kits detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "tshirt",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Bulk Team Kits packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "tshirt",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Size",
        "values": [
          "S (38)",
          "M (40)",
          "L (42)",
          "XL (44)",
          "XXL (46)"
        ]
      },
      {
        "name": "Colour",
        "values": [
          "Jet Black",
          "Navy Blue",
          "Heather Grey",
          "Pure White"
        ]
      },
      {
        "name": "Print Position",
        "values": [
          "Left Chest",
          "Front Center",
          "Back Large",
          "Chest + Back"
        ]
      }
    ],
    "variants": [
      {
        "id": "bulk-team-kits-m-black",
        "title": "M / Jet Black",
        "sku": "APP-BULK-MBK",
        price: money(39900),
        compareAtPrice: money(49900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "M (40)"
          },
          {
            "name": "Colour",
            "value": "Jet Black"
          }
        ]
      },
      {
        "id": "bulk-team-kits-l-black",
        "title": "L / Jet Black",
        "sku": "APP-BULK-LBK",
        price: money(39900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "L (42)"
          },
          {
            "name": "Colour",
            "value": "Jet Black"
          }
        ]
      },
      {
        "id": "bulk-team-kits-l-navy",
        "title": "L / Navy Blue",
        "sku": "APP-BULK-LNV",
        price: money(39900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "L (42)"
          },
          {
            "name": "Colour",
            "value": "Navy Blue"
          }
        ]
      }
    ],
    priceFrom: money(39900),
    compareAtFrom: money(49900),
    "quantityTiers": [
      {
        "qty": 1,
        price: money(39900),
        compareAtPrice: money(49900)
      },
      {
        "qty": 10,
        price: money(359100)
      },
      {
        "qty": 25,
        price: money(798000),
        "note": "Team Pack"
      },
      {
        "qty": 50,
        price: money(1436400),
        "note": "Bulk Saver"
      }
    ],
    "priceUnit": "per piece",
    "specs": [
      {
        "label": "Material",
        "value": "100% Combed Cotton / Bio-Washed"
      },
      {
        "label": "Fabric Density",
        "value": "180 - 240 GSM"
      },
      {
        "label": "Printing Technique",
        "value": "DTF / High-Density Screen Print"
      },
      {
        "label": "Fit Type",
        "value": "Regular Comfort Fit"
      },
      {
        "label": "Care Instructions",
        "value": "Machine wash cold, iron inside out"
      }
    ],
    "minOrderQty": 1,
    "turnaroundDays": 3,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.6,
    "reviewCount": 455,
    "faqs": [
      {
        "q": "How long will the print last after washing?",
        "a": "Our DTF and screen prints withstand 50+ machine washes when washed inside out in cold water."
      },
      {
        "q": "Can I order samples before placing a bulk team order?",
        "a": "Yes, single piece orders are supported with full custom printing before committing to volume runs."
      },
      {
        "q": "What is the maximum print dimension on the chest?",
        "a": "Standard front center prints measure up to 10 × 12 inches, while left chest logos are 3.5 × 3.5 inches."
      }
    ],
    "relatedHandles": [
      "cotton-premium-round-neck",
      "ultra-premium-polo",
      "hooded-sweatshirt",
      "dry-fit-round-neck"
    ],
    "highlights": [
      "Pre-shrunk ring-spun bio-washed cotton",
      "Wash-fast inks resistant to fading and cracking",
      "Reinforced double-needle neck and hem stitching"
    ]
  },
  {
    "id": "prod-corporate-uniforms",
    "handle": "corporate-uniforms",
    "title": "Corporate Uniforms",
    "subtitle": "100% breathable fabric, high-durability digital / screen print",
    "description": "Premium quality Corporate Uniforms engineered for supreme comfort and vibrant logo reproduction. Ideal for corporate branding, events, and personal merchandise.",
    "productType": "Apparel",
    "categoryHandles": [
      "apparel"
    ],
    "tags": [
      "corporate uniforms",
      "apparel",
      "generic"
    ],
    "badges": [],
    "images": [
      {
        "url": "",
        "altText": "Corporate Uniforms preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "generic",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Corporate Uniforms detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "generic",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Corporate Uniforms packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "generic",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Size",
        "values": [
          "S (38)",
          "M (40)",
          "L (42)",
          "XL (44)",
          "XXL (46)"
        ]
      },
      {
        "name": "Colour",
        "values": [
          "Jet Black",
          "Navy Blue",
          "Heather Grey",
          "Pure White"
        ]
      },
      {
        "name": "Print Position",
        "values": [
          "Left Chest",
          "Front Center",
          "Back Large",
          "Chest + Back"
        ]
      }
    ],
    "variants": [
      {
        "id": "corporate-uniforms-m-black",
        "title": "M / Jet Black",
        "sku": "APP-CORP-MBK",
        price: money(39900),
        compareAtPrice: money(49900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "M (40)"
          },
          {
            "name": "Colour",
            "value": "Jet Black"
          }
        ]
      },
      {
        "id": "corporate-uniforms-l-black",
        "title": "L / Jet Black",
        "sku": "APP-CORP-LBK",
        price: money(39900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "L (42)"
          },
          {
            "name": "Colour",
            "value": "Jet Black"
          }
        ]
      },
      {
        "id": "corporate-uniforms-l-navy",
        "title": "L / Navy Blue",
        "sku": "APP-CORP-LNV",
        price: money(39900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Size",
            "value": "L (42)"
          },
          {
            "name": "Colour",
            "value": "Navy Blue"
          }
        ]
      }
    ],
    priceFrom: money(39900),
    compareAtFrom: money(49900),
    "quantityTiers": [
      {
        "qty": 1,
        price: money(39900),
        compareAtPrice: money(49900)
      },
      {
        "qty": 10,
        price: money(359100)
      },
      {
        "qty": 25,
        price: money(798000),
        "note": "Team Pack"
      },
      {
        "qty": 50,
        price: money(1436400),
        "note": "Bulk Saver"
      }
    ],
    "priceUnit": "per piece",
    "specs": [
      {
        "label": "Material",
        "value": "100% Combed Cotton / Bio-Washed"
      },
      {
        "label": "Fabric Density",
        "value": "180 - 240 GSM"
      },
      {
        "label": "Printing Technique",
        "value": "DTF / High-Density Screen Print"
      },
      {
        "label": "Fit Type",
        "value": "Regular Comfort Fit"
      },
      {
        "label": "Care Instructions",
        "value": "Machine wash cold, iron inside out"
      }
    ],
    "minOrderQty": 1,
    "turnaroundDays": 3,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.7,
    "reviewCount": 54,
    "faqs": [
      {
        "q": "How long will the print last after washing?",
        "a": "Our DTF and screen prints withstand 50+ machine washes when washed inside out in cold water."
      },
      {
        "q": "Can I order samples before placing a bulk team order?",
        "a": "Yes, single piece orders are supported with full custom printing before committing to volume runs."
      },
      {
        "q": "What is the maximum print dimension on the chest?",
        "a": "Standard front center prints measure up to 10 × 12 inches, while left chest logos are 3.5 × 3.5 inches."
      }
    ],
    "relatedHandles": [
      "cotton-premium-round-neck",
      "ultra-premium-polo",
      "hooded-sweatshirt",
      "dry-fit-round-neck"
    ],
    "highlights": [
      "Pre-shrunk ring-spun bio-washed cotton",
      "Wash-fast inks resistant to fading and cracking",
      "Reinforced double-needle neck and hem stitching"
    ]
  }
];
