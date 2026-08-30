import { money, type Product } from "@/lib/commerce/types";

export const stationeryProducts: Product[] = [
  {
    "id": "prod-wiro-notebooks",
    "handle": "wiro-notebooks",
    "title": "Wiro Notebooks",
    "subtitle": "Essential office stationery customized with high precision print",
    "description": "Streamline your workplace branding with customized Wiro Notebooks. Professional paperweights, crisp typography, and long-lasting impression quality.",
    "productType": "Stationery & Stamps",
    "categoryHandles": [
      "stationery-stamps"
    ],
    "tags": [
      "wiro notebooks",
      "stationery & stamps",
      "notebook",
      "bestseller"
    ],
    "badges": [
      "bestseller"
    ],
    "images": [
      {
        "url": "",
        "altText": "Wiro Notebooks preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "notebook",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Wiro Notebooks detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "notebook",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Wiro Notebooks packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "notebook",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Format",
        "values": [
          "Standard A4",
          "Compact A5",
          "Custom DL"
        ]
      },
      {
        "name": "Binding / Ink",
        "values": [
          "Standard Option",
          "Premium Finish"
        ]
      }
    ],
    "variants": [
      {
        "id": "wiro-notebooks-std",
        "title": "Standard / Option A",
        "sku": "STN-WIRO-STD",
        price: money(14900),
        compareAtPrice: money(19900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Format",
            "value": "Standard A4"
          },
          {
            "name": "Binding / Ink",
            "value": "Standard Option"
          }
        ]
      },
      {
        "id": "wiro-notebooks-prm",
        "title": "Premium / Option B",
        "sku": "STN-WIRO-PRM",
        price: money(19400),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.3,
        "selectedOptions": [
          {
            "name": "Format",
            "value": "Standard A4"
          },
          {
            "name": "Binding / Ink",
            "value": "Premium Finish"
          }
        ]
      }
    ],
    priceFrom: money(14900),
    compareAtFrom: money(19900),
    "quantityTiers": [
      {
        "qty": 10,
        price: money(14900),
        compareAtPrice: money(19900)
      },
      {
        "qty": 50,
        price: money(62600)
      },
      {
        "qty": 100,
        price: money(111800),
        "note": "Office Pack"
      }
    ],
    "priceUnit": "per piece",
    "specs": [
      {
        "label": "Paper Stock",
        "value": "80 - 120 GSM Executive Bond"
      },
      {
        "label": "Standard Sizes",
        "value": "A4, A5, DL, or Custom Cut"
      },
      {
        "label": "Ink Consistency",
        "value": "Crisp smudge-resistant pigment"
      },
      {
        "label": "Turnaround",
        "value": "2 Business Days"
      }
    ],
    "minOrderQty": 10,
    "turnaroundDays": 2,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.8,
    "reviewCount": 117,
    "faqs": [
      {
        "q": "Are letterheads compatible with office desktop printers?",
        "a": "Yes, our 100 GSM superwhite letterhead paper feeds cleanly through all standard inkjet and laser printers."
      },
      {
        "q": "How many impressions does a pre-inked rubber stamp yield?",
        "a": "Pre-inked stamps deliver up to 10,000 clean impressions before requiring an ink refill."
      },
      {
        "q": "Can bill books be numbered sequentially?",
        "a": "Yes, consecutive numbering and perforated tearing are standard on duplicate and triplicate NCR books."
      }
    ],
    "relatedHandles": [
      "perfect-bound-notebooks",
      "staple-bound-notebooks",
      "hard-cover-notebooks",
      "kraft-notebooks"
    ],
    "highlights": [
      "Crisp letterform reproduction and vector alignment",
      "Smooth fountain-pen and laser-printer compatible paper",
      "Durable construction designed for heavy office utility"
    ]
  },
  {
    "id": "prod-perfect-bound-notebooks",
    "handle": "perfect-bound-notebooks",
    "title": "Perfect Bound Notebooks",
    "subtitle": "Essential office stationery customized with high precision print",
    "description": "Streamline your workplace branding with customized Perfect Bound Notebooks. Professional paperweights, crisp typography, and long-lasting impression quality.",
    "productType": "Stationery & Stamps",
    "categoryHandles": [
      "stationery-stamps"
    ],
    "tags": [
      "perfect bound notebooks",
      "stationery & stamps",
      "notebook"
    ],
    "badges": [],
    "images": [
      {
        "url": "",
        "altText": "Perfect Bound Notebooks preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "notebook",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Perfect Bound Notebooks detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "notebook",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Perfect Bound Notebooks packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "notebook",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Format",
        "values": [
          "Standard A4",
          "Compact A5",
          "Custom DL"
        ]
      },
      {
        "name": "Binding / Ink",
        "values": [
          "Standard Option",
          "Premium Finish"
        ]
      }
    ],
    "variants": [
      {
        "id": "perfect-bound-notebooks-std",
        "title": "Standard / Option A",
        "sku": "STN-PERF-STD",
        price: money(14900),
        compareAtPrice: money(19900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Format",
            "value": "Standard A4"
          },
          {
            "name": "Binding / Ink",
            "value": "Standard Option"
          }
        ]
      },
      {
        "id": "perfect-bound-notebooks-prm",
        "title": "Premium / Option B",
        "sku": "STN-PERF-PRM",
        price: money(19400),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.3,
        "selectedOptions": [
          {
            "name": "Format",
            "value": "Standard A4"
          },
          {
            "name": "Binding / Ink",
            "value": "Premium Finish"
          }
        ]
      }
    ],
    priceFrom: money(14900),
    compareAtFrom: money(19900),
    "quantityTiers": [
      {
        "qty": 10,
        price: money(14900),
        compareAtPrice: money(19900)
      },
      {
        "qty": 50,
        price: money(62600)
      },
      {
        "qty": 100,
        price: money(111800),
        "note": "Office Pack"
      }
    ],
    "priceUnit": "per piece",
    "specs": [
      {
        "label": "Paper Stock",
        "value": "80 - 120 GSM Executive Bond"
      },
      {
        "label": "Standard Sizes",
        "value": "A4, A5, DL, or Custom Cut"
      },
      {
        "label": "Ink Consistency",
        "value": "Crisp smudge-resistant pigment"
      },
      {
        "label": "Turnaround",
        "value": "2 Business Days"
      }
    ],
    "minOrderQty": 10,
    "turnaroundDays": 2,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.5,
    "reviewCount": 102,
    "faqs": [
      {
        "q": "Are letterheads compatible with office desktop printers?",
        "a": "Yes, our 100 GSM superwhite letterhead paper feeds cleanly through all standard inkjet and laser printers."
      },
      {
        "q": "How many impressions does a pre-inked rubber stamp yield?",
        "a": "Pre-inked stamps deliver up to 10,000 clean impressions before requiring an ink refill."
      },
      {
        "q": "Can bill books be numbered sequentially?",
        "a": "Yes, consecutive numbering and perforated tearing are standard on duplicate and triplicate NCR books."
      }
    ],
    "relatedHandles": [
      "wiro-notebooks",
      "staple-bound-notebooks",
      "hard-cover-notebooks",
      "kraft-notebooks"
    ],
    "highlights": [
      "Crisp letterform reproduction and vector alignment",
      "Smooth fountain-pen and laser-printer compatible paper",
      "Durable construction designed for heavy office utility"
    ]
  },
  {
    "id": "prod-staple-bound-notebooks",
    "handle": "staple-bound-notebooks",
    "title": "Staple Bound Notebooks",
    "subtitle": "Essential office stationery customized with high precision print",
    "description": "Streamline your workplace branding with customized Staple Bound Notebooks. Professional paperweights, crisp typography, and long-lasting impression quality.",
    "productType": "Stationery & Stamps",
    "categoryHandles": [
      "stationery-stamps"
    ],
    "tags": [
      "staple bound notebooks",
      "stationery & stamps",
      "notebook"
    ],
    "badges": [],
    "images": [
      {
        "url": "",
        "altText": "Staple Bound Notebooks preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "notebook",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Staple Bound Notebooks detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "notebook",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Staple Bound Notebooks packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "notebook",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Format",
        "values": [
          "Standard A4",
          "Compact A5",
          "Custom DL"
        ]
      },
      {
        "name": "Binding / Ink",
        "values": [
          "Standard Option",
          "Premium Finish"
        ]
      }
    ],
    "variants": [
      {
        "id": "staple-bound-notebooks-std",
        "title": "Standard / Option A",
        "sku": "STN-STAP-STD",
        price: money(14900),
        compareAtPrice: money(19900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Format",
            "value": "Standard A4"
          },
          {
            "name": "Binding / Ink",
            "value": "Standard Option"
          }
        ]
      },
      {
        "id": "staple-bound-notebooks-prm",
        "title": "Premium / Option B",
        "sku": "STN-STAP-PRM",
        price: money(19400),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.3,
        "selectedOptions": [
          {
            "name": "Format",
            "value": "Standard A4"
          },
          {
            "name": "Binding / Ink",
            "value": "Premium Finish"
          }
        ]
      }
    ],
    priceFrom: money(14900),
    compareAtFrom: money(19900),
    "quantityTiers": [
      {
        "qty": 10,
        price: money(14900),
        compareAtPrice: money(19900)
      },
      {
        "qty": 50,
        price: money(62600)
      },
      {
        "qty": 100,
        price: money(111800),
        "note": "Office Pack"
      }
    ],
    "priceUnit": "per piece",
    "specs": [
      {
        "label": "Paper Stock",
        "value": "80 - 120 GSM Executive Bond"
      },
      {
        "label": "Standard Sizes",
        "value": "A4, A5, DL, or Custom Cut"
      },
      {
        "label": "Ink Consistency",
        "value": "Crisp smudge-resistant pigment"
      },
      {
        "label": "Turnaround",
        "value": "2 Business Days"
      }
    ],
    "minOrderQty": 10,
    "turnaroundDays": 2,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.9,
    "reviewCount": 394,
    "faqs": [
      {
        "q": "Are letterheads compatible with office desktop printers?",
        "a": "Yes, our 100 GSM superwhite letterhead paper feeds cleanly through all standard inkjet and laser printers."
      },
      {
        "q": "How many impressions does a pre-inked rubber stamp yield?",
        "a": "Pre-inked stamps deliver up to 10,000 clean impressions before requiring an ink refill."
      },
      {
        "q": "Can bill books be numbered sequentially?",
        "a": "Yes, consecutive numbering and perforated tearing are standard on duplicate and triplicate NCR books."
      }
    ],
    "relatedHandles": [
      "wiro-notebooks",
      "perfect-bound-notebooks",
      "hard-cover-notebooks",
      "kraft-notebooks"
    ],
    "highlights": [
      "Crisp letterform reproduction and vector alignment",
      "Smooth fountain-pen and laser-printer compatible paper",
      "Durable construction designed for heavy office utility"
    ]
  },
  {
    "id": "prod-hard-cover-notebooks",
    "handle": "hard-cover-notebooks",
    "title": "Hard Cover Notebooks",
    "subtitle": "Essential office stationery customized with high precision print",
    "description": "Streamline your workplace branding with customized Hard Cover Notebooks. Professional paperweights, crisp typography, and long-lasting impression quality.",
    "productType": "Stationery & Stamps",
    "categoryHandles": [
      "stationery-stamps"
    ],
    "tags": [
      "hard cover notebooks",
      "stationery & stamps",
      "notebook",
      "premium"
    ],
    "badges": [
      "premium"
    ],
    "images": [
      {
        "url": "",
        "altText": "Hard Cover Notebooks preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "notebook",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Hard Cover Notebooks detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "notebook",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Hard Cover Notebooks packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "notebook",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Format",
        "values": [
          "Standard A4",
          "Compact A5",
          "Custom DL"
        ]
      },
      {
        "name": "Binding / Ink",
        "values": [
          "Standard Option",
          "Premium Finish"
        ]
      }
    ],
    "variants": [
      {
        "id": "hard-cover-notebooks-std",
        "title": "Standard / Option A",
        "sku": "STN-HARD-STD",
        price: money(14900),
        compareAtPrice: money(19900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Format",
            "value": "Standard A4"
          },
          {
            "name": "Binding / Ink",
            "value": "Standard Option"
          }
        ]
      },
      {
        "id": "hard-cover-notebooks-prm",
        "title": "Premium / Option B",
        "sku": "STN-HARD-PRM",
        price: money(19400),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.3,
        "selectedOptions": [
          {
            "name": "Format",
            "value": "Standard A4"
          },
          {
            "name": "Binding / Ink",
            "value": "Premium Finish"
          }
        ]
      }
    ],
    priceFrom: money(14900),
    compareAtFrom: money(19900),
    "quantityTiers": [
      {
        "qty": 10,
        price: money(14900),
        compareAtPrice: money(19900)
      },
      {
        "qty": 50,
        price: money(62600)
      },
      {
        "qty": 100,
        price: money(111800),
        "note": "Office Pack"
      }
    ],
    "priceUnit": "per piece",
    "specs": [
      {
        "label": "Paper Stock",
        "value": "80 - 120 GSM Executive Bond"
      },
      {
        "label": "Standard Sizes",
        "value": "A4, A5, DL, or Custom Cut"
      },
      {
        "label": "Ink Consistency",
        "value": "Crisp smudge-resistant pigment"
      },
      {
        "label": "Turnaround",
        "value": "2 Business Days"
      }
    ],
    "minOrderQty": 10,
    "turnaroundDays": 2,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.8,
    "reviewCount": 563,
    "faqs": [
      {
        "q": "Are letterheads compatible with office desktop printers?",
        "a": "Yes, our 100 GSM superwhite letterhead paper feeds cleanly through all standard inkjet and laser printers."
      },
      {
        "q": "How many impressions does a pre-inked rubber stamp yield?",
        "a": "Pre-inked stamps deliver up to 10,000 clean impressions before requiring an ink refill."
      },
      {
        "q": "Can bill books be numbered sequentially?",
        "a": "Yes, consecutive numbering and perforated tearing are standard on duplicate and triplicate NCR books."
      }
    ],
    "relatedHandles": [
      "wiro-notebooks",
      "perfect-bound-notebooks",
      "staple-bound-notebooks",
      "kraft-notebooks"
    ],
    "highlights": [
      "Crisp letterform reproduction and vector alignment",
      "Smooth fountain-pen and laser-printer compatible paper",
      "Durable construction designed for heavy office utility"
    ]
  },
  {
    "id": "prod-kraft-notebooks",
    "handle": "kraft-notebooks",
    "title": "Kraft Notebooks",
    "subtitle": "Essential office stationery customized with high precision print",
    "description": "Streamline your workplace branding with customized Kraft Notebooks. Professional paperweights, crisp typography, and long-lasting impression quality.",
    "productType": "Stationery & Stamps",
    "categoryHandles": [
      "stationery-stamps"
    ],
    "tags": [
      "kraft notebooks",
      "stationery & stamps",
      "notebook",
      "eco"
    ],
    "badges": [
      "eco"
    ],
    "images": [
      {
        "url": "",
        "altText": "Kraft Notebooks preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "notebook",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Kraft Notebooks detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "notebook",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Kraft Notebooks packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "notebook",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Format",
        "values": [
          "Standard A4",
          "Compact A5",
          "Custom DL"
        ]
      },
      {
        "name": "Binding / Ink",
        "values": [
          "Standard Option",
          "Premium Finish"
        ]
      }
    ],
    "variants": [
      {
        "id": "kraft-notebooks-std",
        "title": "Standard / Option A",
        "sku": "STN-KRAF-STD",
        price: money(14900),
        compareAtPrice: money(19900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Format",
            "value": "Standard A4"
          },
          {
            "name": "Binding / Ink",
            "value": "Standard Option"
          }
        ]
      },
      {
        "id": "kraft-notebooks-prm",
        "title": "Premium / Option B",
        "sku": "STN-KRAF-PRM",
        price: money(19400),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.3,
        "selectedOptions": [
          {
            "name": "Format",
            "value": "Standard A4"
          },
          {
            "name": "Binding / Ink",
            "value": "Premium Finish"
          }
        ]
      }
    ],
    priceFrom: money(14900),
    compareAtFrom: money(19900),
    "quantityTiers": [
      {
        "qty": 10,
        price: money(14900),
        compareAtPrice: money(19900)
      },
      {
        "qty": 50,
        price: money(62600)
      },
      {
        "qty": 100,
        price: money(111800),
        "note": "Office Pack"
      }
    ],
    "priceUnit": "per piece",
    "specs": [
      {
        "label": "Paper Stock",
        "value": "80 - 120 GSM Executive Bond"
      },
      {
        "label": "Standard Sizes",
        "value": "A4, A5, DL, or Custom Cut"
      },
      {
        "label": "Ink Consistency",
        "value": "Crisp smudge-resistant pigment"
      },
      {
        "label": "Turnaround",
        "value": "2 Business Days"
      }
    ],
    "minOrderQty": 10,
    "turnaroundDays": 2,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.9,
    "reviewCount": 84,
    "faqs": [
      {
        "q": "Are letterheads compatible with office desktop printers?",
        "a": "Yes, our 100 GSM superwhite letterhead paper feeds cleanly through all standard inkjet and laser printers."
      },
      {
        "q": "How many impressions does a pre-inked rubber stamp yield?",
        "a": "Pre-inked stamps deliver up to 10,000 clean impressions before requiring an ink refill."
      },
      {
        "q": "Can bill books be numbered sequentially?",
        "a": "Yes, consecutive numbering and perforated tearing are standard on duplicate and triplicate NCR books."
      }
    ],
    "relatedHandles": [
      "wiro-notebooks",
      "perfect-bound-notebooks",
      "staple-bound-notebooks",
      "hard-cover-notebooks"
    ],
    "highlights": [
      "Crisp letterform reproduction and vector alignment",
      "Smooth fountain-pen and laser-printer compatible paper",
      "Durable construction designed for heavy office utility"
    ]
  },
  {
    "id": "prod-staple-binding-booklets",
    "handle": "staple-binding-booklets",
    "title": "Staple Binding Booklets",
    "subtitle": "Essential office stationery customized with high precision print",
    "description": "Streamline your workplace branding with customized Staple Binding Booklets. Professional paperweights, crisp typography, and long-lasting impression quality.",
    "productType": "Stationery & Stamps",
    "categoryHandles": [
      "stationery-stamps"
    ],
    "tags": [
      "staple binding booklets",
      "stationery & stamps",
      "booklet",
      "popular"
    ],
    "badges": [
      "popular"
    ],
    "images": [
      {
        "url": "",
        "altText": "Staple Binding Booklets preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "booklet",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Staple Binding Booklets detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "booklet",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Staple Binding Booklets packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "booklet",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Format",
        "values": [
          "Standard A4",
          "Compact A5",
          "Custom DL"
        ]
      },
      {
        "name": "Binding / Ink",
        "values": [
          "Standard Option",
          "Premium Finish"
        ]
      }
    ],
    "variants": [
      {
        "id": "staple-binding-booklets-std",
        "title": "Standard / Option A",
        "sku": "STN-STAP-STD",
        price: money(14900),
        compareAtPrice: money(19900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Format",
            "value": "Standard A4"
          },
          {
            "name": "Binding / Ink",
            "value": "Standard Option"
          }
        ]
      },
      {
        "id": "staple-binding-booklets-prm",
        "title": "Premium / Option B",
        "sku": "STN-STAP-PRM",
        price: money(19400),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.3,
        "selectedOptions": [
          {
            "name": "Format",
            "value": "Standard A4"
          },
          {
            "name": "Binding / Ink",
            "value": "Premium Finish"
          }
        ]
      }
    ],
    priceFrom: money(14900),
    compareAtFrom: money(19900),
    "quantityTiers": [
      {
        "qty": 10,
        price: money(14900),
        compareAtPrice: money(19900)
      },
      {
        "qty": 50,
        price: money(62600)
      },
      {
        "qty": 100,
        price: money(111800),
        "note": "Office Pack"
      }
    ],
    "priceUnit": "per piece",
    "specs": [
      {
        "label": "Paper Stock",
        "value": "80 - 120 GSM Executive Bond"
      },
      {
        "label": "Standard Sizes",
        "value": "A4, A5, DL, or Custom Cut"
      },
      {
        "label": "Ink Consistency",
        "value": "Crisp smudge-resistant pigment"
      },
      {
        "label": "Turnaround",
        "value": "2 Business Days"
      }
    ],
    "minOrderQty": 10,
    "turnaroundDays": 2,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.5,
    "reviewCount": 138,
    "faqs": [
      {
        "q": "Are letterheads compatible with office desktop printers?",
        "a": "Yes, our 100 GSM superwhite letterhead paper feeds cleanly through all standard inkjet and laser printers."
      },
      {
        "q": "How many impressions does a pre-inked rubber stamp yield?",
        "a": "Pre-inked stamps deliver up to 10,000 clean impressions before requiring an ink refill."
      },
      {
        "q": "Can bill books be numbered sequentially?",
        "a": "Yes, consecutive numbering and perforated tearing are standard on duplicate and triplicate NCR books."
      }
    ],
    "relatedHandles": [
      "wiro-notebooks",
      "perfect-bound-notebooks",
      "staple-bound-notebooks",
      "hard-cover-notebooks"
    ],
    "highlights": [
      "Crisp letterform reproduction and vector alignment",
      "Smooth fountain-pen and laser-printer compatible paper",
      "Durable construction designed for heavy office utility"
    ]
  },
  {
    "id": "prod-perfect-binding-booklets",
    "handle": "perfect-binding-booklets",
    "title": "Perfect Binding Booklets",
    "subtitle": "Essential office stationery customized with high precision print",
    "description": "Streamline your workplace branding with customized Perfect Binding Booklets. Professional paperweights, crisp typography, and long-lasting impression quality.",
    "productType": "Stationery & Stamps",
    "categoryHandles": [
      "stationery-stamps"
    ],
    "tags": [
      "perfect binding booklets",
      "stationery & stamps",
      "booklet"
    ],
    "badges": [],
    "images": [
      {
        "url": "",
        "altText": "Perfect Binding Booklets preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "booklet",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Perfect Binding Booklets detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "booklet",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Perfect Binding Booklets packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "booklet",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Format",
        "values": [
          "Standard A4",
          "Compact A5",
          "Custom DL"
        ]
      },
      {
        "name": "Binding / Ink",
        "values": [
          "Standard Option",
          "Premium Finish"
        ]
      }
    ],
    "variants": [
      {
        "id": "perfect-binding-booklets-std",
        "title": "Standard / Option A",
        "sku": "STN-PERF-STD",
        price: money(14900),
        compareAtPrice: money(19900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Format",
            "value": "Standard A4"
          },
          {
            "name": "Binding / Ink",
            "value": "Standard Option"
          }
        ]
      },
      {
        "id": "perfect-binding-booklets-prm",
        "title": "Premium / Option B",
        "sku": "STN-PERF-PRM",
        price: money(19400),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.3,
        "selectedOptions": [
          {
            "name": "Format",
            "value": "Standard A4"
          },
          {
            "name": "Binding / Ink",
            "value": "Premium Finish"
          }
        ]
      }
    ],
    priceFrom: money(14900),
    compareAtFrom: money(19900),
    "quantityTiers": [
      {
        "qty": 10,
        price: money(14900),
        compareAtPrice: money(19900)
      },
      {
        "qty": 50,
        price: money(62600)
      },
      {
        "qty": 100,
        price: money(111800),
        "note": "Office Pack"
      }
    ],
    "priceUnit": "per piece",
    "specs": [
      {
        "label": "Paper Stock",
        "value": "80 - 120 GSM Executive Bond"
      },
      {
        "label": "Standard Sizes",
        "value": "A4, A5, DL, or Custom Cut"
      },
      {
        "label": "Ink Consistency",
        "value": "Crisp smudge-resistant pigment"
      },
      {
        "label": "Turnaround",
        "value": "2 Business Days"
      }
    ],
    "minOrderQty": 10,
    "turnaroundDays": 2,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.5,
    "reviewCount": 564,
    "faqs": [
      {
        "q": "Are letterheads compatible with office desktop printers?",
        "a": "Yes, our 100 GSM superwhite letterhead paper feeds cleanly through all standard inkjet and laser printers."
      },
      {
        "q": "How many impressions does a pre-inked rubber stamp yield?",
        "a": "Pre-inked stamps deliver up to 10,000 clean impressions before requiring an ink refill."
      },
      {
        "q": "Can bill books be numbered sequentially?",
        "a": "Yes, consecutive numbering and perforated tearing are standard on duplicate and triplicate NCR books."
      }
    ],
    "relatedHandles": [
      "wiro-notebooks",
      "perfect-bound-notebooks",
      "staple-bound-notebooks",
      "hard-cover-notebooks"
    ],
    "highlights": [
      "Crisp letterform reproduction and vector alignment",
      "Smooth fountain-pen and laser-printer compatible paper",
      "Durable construction designed for heavy office utility"
    ]
  },
  {
    "id": "prod-hard-cover-booklets",
    "handle": "hard-cover-booklets",
    "title": "Hard Cover Booklets",
    "subtitle": "Essential office stationery customized with high precision print",
    "description": "Streamline your workplace branding with customized Hard Cover Booklets. Professional paperweights, crisp typography, and long-lasting impression quality.",
    "productType": "Stationery & Stamps",
    "categoryHandles": [
      "stationery-stamps"
    ],
    "tags": [
      "hard cover booklets",
      "stationery & stamps",
      "booklet"
    ],
    "badges": [],
    "images": [
      {
        "url": "",
        "altText": "Hard Cover Booklets preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "booklet",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Hard Cover Booklets detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "booklet",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Hard Cover Booklets packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "booklet",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Format",
        "values": [
          "Standard A4",
          "Compact A5",
          "Custom DL"
        ]
      },
      {
        "name": "Binding / Ink",
        "values": [
          "Standard Option",
          "Premium Finish"
        ]
      }
    ],
    "variants": [
      {
        "id": "hard-cover-booklets-std",
        "title": "Standard / Option A",
        "sku": "STN-HARD-STD",
        price: money(14900),
        compareAtPrice: money(19900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Format",
            "value": "Standard A4"
          },
          {
            "name": "Binding / Ink",
            "value": "Standard Option"
          }
        ]
      },
      {
        "id": "hard-cover-booklets-prm",
        "title": "Premium / Option B",
        "sku": "STN-HARD-PRM",
        price: money(19400),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.3,
        "selectedOptions": [
          {
            "name": "Format",
            "value": "Standard A4"
          },
          {
            "name": "Binding / Ink",
            "value": "Premium Finish"
          }
        ]
      }
    ],
    priceFrom: money(14900),
    compareAtFrom: money(19900),
    "quantityTiers": [
      {
        "qty": 10,
        price: money(14900),
        compareAtPrice: money(19900)
      },
      {
        "qty": 50,
        price: money(62600)
      },
      {
        "qty": 100,
        price: money(111800),
        "note": "Office Pack"
      }
    ],
    "priceUnit": "per piece",
    "specs": [
      {
        "label": "Paper Stock",
        "value": "80 - 120 GSM Executive Bond"
      },
      {
        "label": "Standard Sizes",
        "value": "A4, A5, DL, or Custom Cut"
      },
      {
        "label": "Ink Consistency",
        "value": "Crisp smudge-resistant pigment"
      },
      {
        "label": "Turnaround",
        "value": "2 Business Days"
      }
    ],
    "minOrderQty": 10,
    "turnaroundDays": 2,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.7,
    "reviewCount": 86,
    "faqs": [
      {
        "q": "Are letterheads compatible with office desktop printers?",
        "a": "Yes, our 100 GSM superwhite letterhead paper feeds cleanly through all standard inkjet and laser printers."
      },
      {
        "q": "How many impressions does a pre-inked rubber stamp yield?",
        "a": "Pre-inked stamps deliver up to 10,000 clean impressions before requiring an ink refill."
      },
      {
        "q": "Can bill books be numbered sequentially?",
        "a": "Yes, consecutive numbering and perforated tearing are standard on duplicate and triplicate NCR books."
      }
    ],
    "relatedHandles": [
      "wiro-notebooks",
      "perfect-bound-notebooks",
      "staple-bound-notebooks",
      "hard-cover-notebooks"
    ],
    "highlights": [
      "Crisp letterform reproduction and vector alignment",
      "Smooth fountain-pen and laser-printer compatible paper",
      "Durable construction designed for heavy office utility"
    ]
  },
  {
    "id": "prod-custom-brochures",
    "handle": "custom-brochures",
    "title": "Custom Brochures",
    "subtitle": "Essential office stationery customized with high precision print",
    "description": "Streamline your workplace branding with customized Custom Brochures. Professional paperweights, crisp typography, and long-lasting impression quality.",
    "productType": "Stationery & Stamps",
    "categoryHandles": [
      "stationery-stamps"
    ],
    "tags": [
      "custom brochures",
      "stationery & stamps",
      "brochure",
      "popular"
    ],
    "badges": [
      "popular"
    ],
    "images": [
      {
        "url": "",
        "altText": "Custom Brochures preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "brochure",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Custom Brochures detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "brochure",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Custom Brochures packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "brochure",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Format",
        "values": [
          "Standard A4",
          "Compact A5",
          "Custom DL"
        ]
      },
      {
        "name": "Binding / Ink",
        "values": [
          "Standard Option",
          "Premium Finish"
        ]
      }
    ],
    "variants": [
      {
        "id": "custom-brochures-std",
        "title": "Standard / Option A",
        "sku": "STN-CUST-STD",
        price: money(69900),
        compareAtPrice: money(84900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Format",
            "value": "Standard A4"
          },
          {
            "name": "Binding / Ink",
            "value": "Standard Option"
          }
        ]
      },
      {
        "id": "custom-brochures-prm",
        "title": "Premium / Option B",
        "sku": "STN-CUST-PRM",
        price: money(90900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.3,
        "selectedOptions": [
          {
            "name": "Format",
            "value": "Standard A4"
          },
          {
            "name": "Binding / Ink",
            "value": "Premium Finish"
          }
        ]
      }
    ],
    priceFrom: money(69900),
    compareAtFrom: money(84900),
    "quantityTiers": [
      {
        "qty": 100,
        price: money(69900),
        compareAtPrice: money(84900)
      },
      {
        "qty": 500,
        price: money(293600)
      },
      {
        "qty": 1000,
        price: money(524300),
        "note": "Office Pack"
      }
    ],
    "priceUnit": "per 100 sheets",
    "specs": [
      {
        "label": "Paper Stock",
        "value": "80 - 120 GSM Executive Bond"
      },
      {
        "label": "Standard Sizes",
        "value": "A4, A5, DL, or Custom Cut"
      },
      {
        "label": "Ink Consistency",
        "value": "Crisp smudge-resistant pigment"
      },
      {
        "label": "Turnaround",
        "value": "2 Business Days"
      }
    ],
    "minOrderQty": 100,
    "turnaroundDays": 2,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.5,
    "reviewCount": 288,
    "faqs": [
      {
        "q": "Are letterheads compatible with office desktop printers?",
        "a": "Yes, our 100 GSM superwhite letterhead paper feeds cleanly through all standard inkjet and laser printers."
      },
      {
        "q": "How many impressions does a pre-inked rubber stamp yield?",
        "a": "Pre-inked stamps deliver up to 10,000 clean impressions before requiring an ink refill."
      },
      {
        "q": "Can bill books be numbered sequentially?",
        "a": "Yes, consecutive numbering and perforated tearing are standard on duplicate and triplicate NCR books."
      }
    ],
    "relatedHandles": [
      "wiro-notebooks",
      "perfect-bound-notebooks",
      "staple-bound-notebooks",
      "hard-cover-notebooks"
    ],
    "highlights": [
      "Crisp letterform reproduction and vector alignment",
      "Smooth fountain-pen and laser-printer compatible paper",
      "Durable construction designed for heavy office utility"
    ]
  },
  {
    "id": "prod-tri-fold-brochures",
    "handle": "tri-fold-brochures",
    "title": "Tri-Fold Brochures",
    "subtitle": "Essential office stationery customized with high precision print",
    "description": "Streamline your workplace branding with customized Tri-Fold Brochures. Professional paperweights, crisp typography, and long-lasting impression quality.",
    "productType": "Stationery & Stamps",
    "categoryHandles": [
      "stationery-stamps"
    ],
    "tags": [
      "tri-fold brochures",
      "stationery & stamps",
      "brochure",
      "recommended"
    ],
    "badges": [
      "recommended"
    ],
    "images": [
      {
        "url": "",
        "altText": "Tri-Fold Brochures preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "brochure",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Tri-Fold Brochures detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "brochure",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Tri-Fold Brochures packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "brochure",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Format",
        "values": [
          "Standard A4",
          "Compact A5",
          "Custom DL"
        ]
      },
      {
        "name": "Binding / Ink",
        "values": [
          "Standard Option",
          "Premium Finish"
        ]
      }
    ],
    "variants": [
      {
        "id": "tri-fold-brochures-std",
        "title": "Standard / Option A",
        "sku": "STN-TRI--STD",
        price: money(69900),
        compareAtPrice: money(84900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Format",
            "value": "Standard A4"
          },
          {
            "name": "Binding / Ink",
            "value": "Standard Option"
          }
        ]
      },
      {
        "id": "tri-fold-brochures-prm",
        "title": "Premium / Option B",
        "sku": "STN-TRI--PRM",
        price: money(90900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.3,
        "selectedOptions": [
          {
            "name": "Format",
            "value": "Standard A4"
          },
          {
            "name": "Binding / Ink",
            "value": "Premium Finish"
          }
        ]
      }
    ],
    priceFrom: money(69900),
    compareAtFrom: money(84900),
    "quantityTiers": [
      {
        "qty": 100,
        price: money(69900),
        compareAtPrice: money(84900)
      },
      {
        "qty": 500,
        price: money(293600)
      },
      {
        "qty": 1000,
        price: money(524300),
        "note": "Office Pack"
      }
    ],
    "priceUnit": "per 100 sheets",
    "specs": [
      {
        "label": "Paper Stock",
        "value": "80 - 120 GSM Executive Bond"
      },
      {
        "label": "Standard Sizes",
        "value": "A4, A5, DL, or Custom Cut"
      },
      {
        "label": "Ink Consistency",
        "value": "Crisp smudge-resistant pigment"
      },
      {
        "label": "Turnaround",
        "value": "2 Business Days"
      }
    ],
    "minOrderQty": 100,
    "turnaroundDays": 2,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.5,
    "reviewCount": 154,
    "faqs": [
      {
        "q": "Are letterheads compatible with office desktop printers?",
        "a": "Yes, our 100 GSM superwhite letterhead paper feeds cleanly through all standard inkjet and laser printers."
      },
      {
        "q": "How many impressions does a pre-inked rubber stamp yield?",
        "a": "Pre-inked stamps deliver up to 10,000 clean impressions before requiring an ink refill."
      },
      {
        "q": "Can bill books be numbered sequentially?",
        "a": "Yes, consecutive numbering and perforated tearing are standard on duplicate and triplicate NCR books."
      }
    ],
    "relatedHandles": [
      "wiro-notebooks",
      "perfect-bound-notebooks",
      "staple-bound-notebooks",
      "hard-cover-notebooks"
    ],
    "highlights": [
      "Crisp letterform reproduction and vector alignment",
      "Smooth fountain-pen and laser-printer compatible paper",
      "Durable construction designed for heavy office utility"
    ]
  },
  {
    "id": "prod-half-fold-brochures",
    "handle": "half-fold-brochures",
    "title": "Half-Fold Brochures",
    "subtitle": "Essential office stationery customized with high precision print",
    "description": "Streamline your workplace branding with customized Half-Fold Brochures. Professional paperweights, crisp typography, and long-lasting impression quality.",
    "productType": "Stationery & Stamps",
    "categoryHandles": [
      "stationery-stamps"
    ],
    "tags": [
      "half-fold brochures",
      "stationery & stamps",
      "brochure"
    ],
    "badges": [],
    "images": [
      {
        "url": "",
        "altText": "Half-Fold Brochures preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "brochure",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Half-Fold Brochures detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "brochure",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Half-Fold Brochures packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "brochure",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Format",
        "values": [
          "Standard A4",
          "Compact A5",
          "Custom DL"
        ]
      },
      {
        "name": "Binding / Ink",
        "values": [
          "Standard Option",
          "Premium Finish"
        ]
      }
    ],
    "variants": [
      {
        "id": "half-fold-brochures-std",
        "title": "Standard / Option A",
        "sku": "STN-HALF-STD",
        price: money(69900),
        compareAtPrice: money(84900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Format",
            "value": "Standard A4"
          },
          {
            "name": "Binding / Ink",
            "value": "Standard Option"
          }
        ]
      },
      {
        "id": "half-fold-brochures-prm",
        "title": "Premium / Option B",
        "sku": "STN-HALF-PRM",
        price: money(90900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.3,
        "selectedOptions": [
          {
            "name": "Format",
            "value": "Standard A4"
          },
          {
            "name": "Binding / Ink",
            "value": "Premium Finish"
          }
        ]
      }
    ],
    priceFrom: money(69900),
    compareAtFrom: money(84900),
    "quantityTiers": [
      {
        "qty": 100,
        price: money(69900),
        compareAtPrice: money(84900)
      },
      {
        "qty": 500,
        price: money(293600)
      },
      {
        "qty": 1000,
        price: money(524300),
        "note": "Office Pack"
      }
    ],
    "priceUnit": "per 100 sheets",
    "specs": [
      {
        "label": "Paper Stock",
        "value": "80 - 120 GSM Executive Bond"
      },
      {
        "label": "Standard Sizes",
        "value": "A4, A5, DL, or Custom Cut"
      },
      {
        "label": "Ink Consistency",
        "value": "Crisp smudge-resistant pigment"
      },
      {
        "label": "Turnaround",
        "value": "2 Business Days"
      }
    ],
    "minOrderQty": 100,
    "turnaroundDays": 2,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.7,
    "reviewCount": 500,
    "faqs": [
      {
        "q": "Are letterheads compatible with office desktop printers?",
        "a": "Yes, our 100 GSM superwhite letterhead paper feeds cleanly through all standard inkjet and laser printers."
      },
      {
        "q": "How many impressions does a pre-inked rubber stamp yield?",
        "a": "Pre-inked stamps deliver up to 10,000 clean impressions before requiring an ink refill."
      },
      {
        "q": "Can bill books be numbered sequentially?",
        "a": "Yes, consecutive numbering and perforated tearing are standard on duplicate and triplicate NCR books."
      }
    ],
    "relatedHandles": [
      "wiro-notebooks",
      "perfect-bound-notebooks",
      "staple-bound-notebooks",
      "hard-cover-notebooks"
    ],
    "highlights": [
      "Crisp letterform reproduction and vector alignment",
      "Smooth fountain-pen and laser-printer compatible paper",
      "Durable construction designed for heavy office utility"
    ]
  },
  {
    "id": "prod-folded-menu-cards",
    "handle": "folded-menu-cards",
    "title": "Folded Menu Cards",
    "subtitle": "Essential office stationery customized with high precision print",
    "description": "Streamline your workplace branding with customized Folded Menu Cards. Professional paperweights, crisp typography, and long-lasting impression quality.",
    "productType": "Stationery & Stamps",
    "categoryHandles": [
      "stationery-stamps"
    ],
    "tags": [
      "folded menu cards",
      "stationery & stamps",
      "card"
    ],
    "badges": [],
    "images": [
      {
        "url": "",
        "altText": "Folded Menu Cards preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Folded Menu Cards detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Folded Menu Cards packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Format",
        "values": [
          "Standard A4",
          "Compact A5",
          "Custom DL"
        ]
      },
      {
        "name": "Binding / Ink",
        "values": [
          "Standard Option",
          "Premium Finish"
        ]
      }
    ],
    "variants": [
      {
        "id": "folded-menu-cards-std",
        "title": "Standard / Option A",
        "sku": "STN-FOLD-STD",
        price: money(39900),
        compareAtPrice: money(49900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Format",
            "value": "Standard A4"
          },
          {
            "name": "Binding / Ink",
            "value": "Standard Option"
          }
        ]
      },
      {
        "id": "folded-menu-cards-prm",
        "title": "Premium / Option B",
        "sku": "STN-FOLD-PRM",
        price: money(51900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.3,
        "selectedOptions": [
          {
            "name": "Format",
            "value": "Standard A4"
          },
          {
            "name": "Binding / Ink",
            "value": "Premium Finish"
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
        "qty": 5,
        price: money(167600)
      },
      {
        "qty": 10,
        price: money(299300),
        "note": "Office Pack"
      }
    ],
    "priceUnit": "per batch",
    "specs": [
      {
        "label": "Paper Stock",
        "value": "80 - 120 GSM Executive Bond"
      },
      {
        "label": "Standard Sizes",
        "value": "A4, A5, DL, or Custom Cut"
      },
      {
        "label": "Ink Consistency",
        "value": "Crisp smudge-resistant pigment"
      },
      {
        "label": "Turnaround",
        "value": "2 Business Days"
      }
    ],
    "minOrderQty": 1,
    "turnaroundDays": 2,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.4,
    "reviewCount": 317,
    "faqs": [
      {
        "q": "Are letterheads compatible with office desktop printers?",
        "a": "Yes, our 100 GSM superwhite letterhead paper feeds cleanly through all standard inkjet and laser printers."
      },
      {
        "q": "How many impressions does a pre-inked rubber stamp yield?",
        "a": "Pre-inked stamps deliver up to 10,000 clean impressions before requiring an ink refill."
      },
      {
        "q": "Can bill books be numbered sequentially?",
        "a": "Yes, consecutive numbering and perforated tearing are standard on duplicate and triplicate NCR books."
      }
    ],
    "relatedHandles": [
      "wiro-notebooks",
      "perfect-bound-notebooks",
      "staple-bound-notebooks",
      "hard-cover-notebooks"
    ],
    "highlights": [
      "Crisp letterform reproduction and vector alignment",
      "Smooth fountain-pen and laser-printer compatible paper",
      "Durable construction designed for heavy office utility"
    ]
  },
  {
    "id": "prod-business-flyers",
    "handle": "business-flyers",
    "title": "Business Flyers",
    "subtitle": "Essential office stationery customized with high precision print",
    "description": "Streamline your workplace branding with customized Business Flyers. Professional paperweights, crisp typography, and long-lasting impression quality.",
    "productType": "Stationery & Stamps",
    "categoryHandles": [
      "same-day",
      "stationery-stamps"
    ],
    "tags": [
      "business flyers",
      "stationery & stamps",
      "flyer",
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
        "altText": "Business Flyers preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "flyer",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Business Flyers detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "flyer",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Business Flyers packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "flyer",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Format",
        "values": [
          "Standard A4",
          "Compact A5",
          "Custom DL"
        ]
      },
      {
        "name": "Binding / Ink",
        "values": [
          "Standard Option",
          "Premium Finish"
        ]
      }
    ],
    "variants": [
      {
        "id": "business-flyers-std",
        "title": "Standard / Option A",
        "sku": "STN-BUSI-STD",
        price: money(69900),
        compareAtPrice: money(84900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Format",
            "value": "Standard A4"
          },
          {
            "name": "Binding / Ink",
            "value": "Standard Option"
          }
        ]
      },
      {
        "id": "business-flyers-prm",
        "title": "Premium / Option B",
        "sku": "STN-BUSI-PRM",
        price: money(90900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.3,
        "selectedOptions": [
          {
            "name": "Format",
            "value": "Standard A4"
          },
          {
            "name": "Binding / Ink",
            "value": "Premium Finish"
          }
        ]
      }
    ],
    priceFrom: money(69900),
    compareAtFrom: money(84900),
    "quantityTiers": [
      {
        "qty": 100,
        price: money(69900),
        compareAtPrice: money(84900)
      },
      {
        "qty": 500,
        price: money(293600)
      },
      {
        "qty": 1000,
        price: money(524300),
        "note": "Office Pack"
      }
    ],
    "priceUnit": "per 100 sheets",
    "specs": [
      {
        "label": "Paper Stock",
        "value": "80 - 120 GSM Executive Bond"
      },
      {
        "label": "Standard Sizes",
        "value": "A4, A5, DL, or Custom Cut"
      },
      {
        "label": "Ink Consistency",
        "value": "Crisp smudge-resistant pigment"
      },
      {
        "label": "Turnaround",
        "value": "Same Day Pickup"
      }
    ],
    "minOrderQty": 100,
    "turnaroundDays": 1,
    "sameDayEligible": true,
    "customizable": true,
    "rating": 4.6,
    "reviewCount": 681,
    "faqs": [
      {
        "q": "Are letterheads compatible with office desktop printers?",
        "a": "Yes, our 100 GSM superwhite letterhead paper feeds cleanly through all standard inkjet and laser printers."
      },
      {
        "q": "How many impressions does a pre-inked rubber stamp yield?",
        "a": "Pre-inked stamps deliver up to 10,000 clean impressions before requiring an ink refill."
      },
      {
        "q": "Can bill books be numbered sequentially?",
        "a": "Yes, consecutive numbering and perforated tearing are standard on duplicate and triplicate NCR books."
      }
    ],
    "relatedHandles": [
      "wiro-notebooks",
      "perfect-bound-notebooks",
      "staple-bound-notebooks",
      "hard-cover-notebooks"
    ],
    "highlights": [
      "Crisp letterform reproduction and vector alignment",
      "Smooth fountain-pen and laser-printer compatible paper",
      "Durable construction designed for heavy office utility"
    ]
  },
  {
    "id": "prod-offer-flyers",
    "handle": "offer-flyers",
    "title": "Offer Flyers",
    "subtitle": "Essential office stationery customized with high precision print",
    "description": "Streamline your workplace branding with customized Offer Flyers. Professional paperweights, crisp typography, and long-lasting impression quality.",
    "productType": "Stationery & Stamps",
    "categoryHandles": [
      "stationery-stamps"
    ],
    "tags": [
      "offer flyers",
      "stationery & stamps",
      "flyer"
    ],
    "badges": [],
    "images": [
      {
        "url": "",
        "altText": "Offer Flyers preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "flyer",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Offer Flyers detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "flyer",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Offer Flyers packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "flyer",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Format",
        "values": [
          "Standard A4",
          "Compact A5",
          "Custom DL"
        ]
      },
      {
        "name": "Binding / Ink",
        "values": [
          "Standard Option",
          "Premium Finish"
        ]
      }
    ],
    "variants": [
      {
        "id": "offer-flyers-std",
        "title": "Standard / Option A",
        "sku": "STN-OFFE-STD",
        price: money(69900),
        compareAtPrice: money(84900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Format",
            "value": "Standard A4"
          },
          {
            "name": "Binding / Ink",
            "value": "Standard Option"
          }
        ]
      },
      {
        "id": "offer-flyers-prm",
        "title": "Premium / Option B",
        "sku": "STN-OFFE-PRM",
        price: money(90900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.3,
        "selectedOptions": [
          {
            "name": "Format",
            "value": "Standard A4"
          },
          {
            "name": "Binding / Ink",
            "value": "Premium Finish"
          }
        ]
      }
    ],
    priceFrom: money(69900),
    compareAtFrom: money(84900),
    "quantityTiers": [
      {
        "qty": 100,
        price: money(69900),
        compareAtPrice: money(84900)
      },
      {
        "qty": 500,
        price: money(293600)
      },
      {
        "qty": 1000,
        price: money(524300),
        "note": "Office Pack"
      }
    ],
    "priceUnit": "per 100 sheets",
    "specs": [
      {
        "label": "Paper Stock",
        "value": "80 - 120 GSM Executive Bond"
      },
      {
        "label": "Standard Sizes",
        "value": "A4, A5, DL, or Custom Cut"
      },
      {
        "label": "Ink Consistency",
        "value": "Crisp smudge-resistant pigment"
      },
      {
        "label": "Turnaround",
        "value": "2 Business Days"
      }
    ],
    "minOrderQty": 100,
    "turnaroundDays": 2,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.6,
    "reviewCount": 571,
    "faqs": [
      {
        "q": "Are letterheads compatible with office desktop printers?",
        "a": "Yes, our 100 GSM superwhite letterhead paper feeds cleanly through all standard inkjet and laser printers."
      },
      {
        "q": "How many impressions does a pre-inked rubber stamp yield?",
        "a": "Pre-inked stamps deliver up to 10,000 clean impressions before requiring an ink refill."
      },
      {
        "q": "Can bill books be numbered sequentially?",
        "a": "Yes, consecutive numbering and perforated tearing are standard on duplicate and triplicate NCR books."
      }
    ],
    "relatedHandles": [
      "wiro-notebooks",
      "perfect-bound-notebooks",
      "staple-bound-notebooks",
      "hard-cover-notebooks"
    ],
    "highlights": [
      "Crisp letterform reproduction and vector alignment",
      "Smooth fountain-pen and laser-printer compatible paper",
      "Durable construction designed for heavy office utility"
    ]
  },
  {
    "id": "prod-dl-promo-flyers",
    "handle": "dl-promo-flyers",
    "title": "DL Promo Flyers",
    "subtitle": "Essential office stationery customized with high precision print",
    "description": "Streamline your workplace branding with customized DL Promo Flyers. Professional paperweights, crisp typography, and long-lasting impression quality.",
    "productType": "Stationery & Stamps",
    "categoryHandles": [
      "stationery-stamps"
    ],
    "tags": [
      "dl promo flyers",
      "stationery & stamps",
      "flyer"
    ],
    "badges": [],
    "images": [
      {
        "url": "",
        "altText": "DL Promo Flyers preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "flyer",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "DL Promo Flyers detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "flyer",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "DL Promo Flyers packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "flyer",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Format",
        "values": [
          "Standard A4",
          "Compact A5",
          "Custom DL"
        ]
      },
      {
        "name": "Binding / Ink",
        "values": [
          "Standard Option",
          "Premium Finish"
        ]
      }
    ],
    "variants": [
      {
        "id": "dl-promo-flyers-std",
        "title": "Standard / Option A",
        "sku": "STN-DL-P-STD",
        price: money(69900),
        compareAtPrice: money(84900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Format",
            "value": "Standard A4"
          },
          {
            "name": "Binding / Ink",
            "value": "Standard Option"
          }
        ]
      },
      {
        "id": "dl-promo-flyers-prm",
        "title": "Premium / Option B",
        "sku": "STN-DL-P-PRM",
        price: money(90900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.3,
        "selectedOptions": [
          {
            "name": "Format",
            "value": "Standard A4"
          },
          {
            "name": "Binding / Ink",
            "value": "Premium Finish"
          }
        ]
      }
    ],
    priceFrom: money(69900),
    compareAtFrom: money(84900),
    "quantityTiers": [
      {
        "qty": 100,
        price: money(69900),
        compareAtPrice: money(84900)
      },
      {
        "qty": 500,
        price: money(293600)
      },
      {
        "qty": 1000,
        price: money(524300),
        "note": "Office Pack"
      }
    ],
    "priceUnit": "per 100 sheets",
    "specs": [
      {
        "label": "Paper Stock",
        "value": "80 - 120 GSM Executive Bond"
      },
      {
        "label": "Standard Sizes",
        "value": "A4, A5, DL, or Custom Cut"
      },
      {
        "label": "Ink Consistency",
        "value": "Crisp smudge-resistant pigment"
      },
      {
        "label": "Turnaround",
        "value": "2 Business Days"
      }
    ],
    "minOrderQty": 100,
    "turnaroundDays": 2,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.6,
    "reviewCount": 339,
    "faqs": [
      {
        "q": "Are letterheads compatible with office desktop printers?",
        "a": "Yes, our 100 GSM superwhite letterhead paper feeds cleanly through all standard inkjet and laser printers."
      },
      {
        "q": "How many impressions does a pre-inked rubber stamp yield?",
        "a": "Pre-inked stamps deliver up to 10,000 clean impressions before requiring an ink refill."
      },
      {
        "q": "Can bill books be numbered sequentially?",
        "a": "Yes, consecutive numbering and perforated tearing are standard on duplicate and triplicate NCR books."
      }
    ],
    "relatedHandles": [
      "wiro-notebooks",
      "perfect-bound-notebooks",
      "staple-bound-notebooks",
      "hard-cover-notebooks"
    ],
    "highlights": [
      "Crisp letterform reproduction and vector alignment",
      "Smooth fountain-pen and laser-printer compatible paper",
      "Durable construction designed for heavy office utility"
    ]
  },
  {
    "id": "prod-self-inking-rubber-stamp",
    "handle": "self-inking-rubber-stamp",
    "title": "Self-Inking Rubber Stamp",
    "subtitle": "Essential office stationery customized with high precision print",
    "description": "Streamline your workplace branding with customized Self-Inking Rubber Stamp. Professional paperweights, crisp typography, and long-lasting impression quality.",
    "productType": "Stationery & Stamps",
    "categoryHandles": [
      "same-day",
      "stationery-stamps"
    ],
    "tags": [
      "self-inking rubber stamp",
      "stationery & stamps",
      "stamp",
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
        "altText": "Self-Inking Rubber Stamp preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "stamp",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Self-Inking Rubber Stamp detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "stamp",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Self-Inking Rubber Stamp packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "stamp",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Format",
        "values": [
          "Standard A4",
          "Compact A5",
          "Custom DL"
        ]
      },
      {
        "name": "Binding / Ink",
        "values": [
          "Standard Option",
          "Premium Finish"
        ]
      }
    ],
    "variants": [
      {
        "id": "self-inking-rubber-stamp-std",
        "title": "Standard / Option A",
        "sku": "STN-SELF-STD",
        price: money(34900),
        compareAtPrice: money(44900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Format",
            "value": "Standard A4"
          },
          {
            "name": "Binding / Ink",
            "value": "Standard Option"
          }
        ]
      },
      {
        "id": "self-inking-rubber-stamp-prm",
        "title": "Premium / Option B",
        "sku": "STN-SELF-PRM",
        price: money(45400),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.3,
        "selectedOptions": [
          {
            "name": "Format",
            "value": "Standard A4"
          },
          {
            "name": "Binding / Ink",
            "value": "Premium Finish"
          }
        ]
      }
    ],
    priceFrom: money(34900),
    compareAtFrom: money(44900),
    "quantityTiers": [
      {
        "qty": 1,
        price: money(34900),
        compareAtPrice: money(44900)
      },
      {
        "qty": 5,
        price: money(146600)
      },
      {
        "qty": 10,
        price: money(261800),
        "note": "Office Pack"
      }
    ],
    "priceUnit": "per piece",
    "specs": [
      {
        "label": "Paper Stock",
        "value": "80 - 120 GSM Executive Bond"
      },
      {
        "label": "Standard Sizes",
        "value": "A4, A5, DL, or Custom Cut"
      },
      {
        "label": "Ink Consistency",
        "value": "Crisp smudge-resistant pigment"
      },
      {
        "label": "Turnaround",
        "value": "Same Day Pickup"
      }
    ],
    "minOrderQty": 1,
    "turnaroundDays": 1,
    "sameDayEligible": true,
    "customizable": true,
    "rating": 4.6,
    "reviewCount": 517,
    "faqs": [
      {
        "q": "Are letterheads compatible with office desktop printers?",
        "a": "Yes, our 100 GSM superwhite letterhead paper feeds cleanly through all standard inkjet and laser printers."
      },
      {
        "q": "How many impressions does a pre-inked rubber stamp yield?",
        "a": "Pre-inked stamps deliver up to 10,000 clean impressions before requiring an ink refill."
      },
      {
        "q": "Can bill books be numbered sequentially?",
        "a": "Yes, consecutive numbering and perforated tearing are standard on duplicate and triplicate NCR books."
      }
    ],
    "relatedHandles": [
      "wiro-notebooks",
      "perfect-bound-notebooks",
      "staple-bound-notebooks",
      "hard-cover-notebooks"
    ],
    "highlights": [
      "Crisp letterform reproduction and vector alignment",
      "Smooth fountain-pen and laser-printer compatible paper",
      "Durable construction designed for heavy office utility"
    ]
  },
  {
    "id": "prod-pre-inked-rubber-stamp",
    "handle": "pre-inked-rubber-stamp",
    "title": "Pre-Inked Rubber Stamp",
    "subtitle": "Essential office stationery customized with high precision print",
    "description": "Streamline your workplace branding with customized Pre-Inked Rubber Stamp. Professional paperweights, crisp typography, and long-lasting impression quality.",
    "productType": "Stationery & Stamps",
    "categoryHandles": [
      "stationery-stamps"
    ],
    "tags": [
      "pre-inked rubber stamp",
      "stationery & stamps",
      "stamp"
    ],
    "badges": [],
    "images": [
      {
        "url": "",
        "altText": "Pre-Inked Rubber Stamp preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "stamp",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Pre-Inked Rubber Stamp detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "stamp",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Pre-Inked Rubber Stamp packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "stamp",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Format",
        "values": [
          "Standard A4",
          "Compact A5",
          "Custom DL"
        ]
      },
      {
        "name": "Binding / Ink",
        "values": [
          "Standard Option",
          "Premium Finish"
        ]
      }
    ],
    "variants": [
      {
        "id": "pre-inked-rubber-stamp-std",
        "title": "Standard / Option A",
        "sku": "STN-PRE--STD",
        price: money(34900),
        compareAtPrice: money(44900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Format",
            "value": "Standard A4"
          },
          {
            "name": "Binding / Ink",
            "value": "Standard Option"
          }
        ]
      },
      {
        "id": "pre-inked-rubber-stamp-prm",
        "title": "Premium / Option B",
        "sku": "STN-PRE--PRM",
        price: money(45400),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.3,
        "selectedOptions": [
          {
            "name": "Format",
            "value": "Standard A4"
          },
          {
            "name": "Binding / Ink",
            "value": "Premium Finish"
          }
        ]
      }
    ],
    priceFrom: money(34900),
    compareAtFrom: money(44900),
    "quantityTiers": [
      {
        "qty": 1,
        price: money(34900),
        compareAtPrice: money(44900)
      },
      {
        "qty": 5,
        price: money(146600)
      },
      {
        "qty": 10,
        price: money(261800),
        "note": "Office Pack"
      }
    ],
    "priceUnit": "per piece",
    "specs": [
      {
        "label": "Paper Stock",
        "value": "80 - 120 GSM Executive Bond"
      },
      {
        "label": "Standard Sizes",
        "value": "A4, A5, DL, or Custom Cut"
      },
      {
        "label": "Ink Consistency",
        "value": "Crisp smudge-resistant pigment"
      },
      {
        "label": "Turnaround",
        "value": "2 Business Days"
      }
    ],
    "minOrderQty": 1,
    "turnaroundDays": 2,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.8,
    "reviewCount": 245,
    "faqs": [
      {
        "q": "Are letterheads compatible with office desktop printers?",
        "a": "Yes, our 100 GSM superwhite letterhead paper feeds cleanly through all standard inkjet and laser printers."
      },
      {
        "q": "How many impressions does a pre-inked rubber stamp yield?",
        "a": "Pre-inked stamps deliver up to 10,000 clean impressions before requiring an ink refill."
      },
      {
        "q": "Can bill books be numbered sequentially?",
        "a": "Yes, consecutive numbering and perforated tearing are standard on duplicate and triplicate NCR books."
      }
    ],
    "relatedHandles": [
      "wiro-notebooks",
      "perfect-bound-notebooks",
      "staple-bound-notebooks",
      "hard-cover-notebooks"
    ],
    "highlights": [
      "Crisp letterform reproduction and vector alignment",
      "Smooth fountain-pen and laser-printer compatible paper",
      "Durable construction designed for heavy office utility"
    ]
  },
  {
    "id": "prod-circle-rubber-stamp",
    "handle": "circle-rubber-stamp",
    "title": "Circle Rubber Stamp",
    "subtitle": "Essential office stationery customized with high precision print",
    "description": "Streamline your workplace branding with customized Circle Rubber Stamp. Professional paperweights, crisp typography, and long-lasting impression quality.",
    "productType": "Stationery & Stamps",
    "categoryHandles": [
      "stationery-stamps"
    ],
    "tags": [
      "circle rubber stamp",
      "stationery & stamps",
      "stamp"
    ],
    "badges": [],
    "images": [
      {
        "url": "",
        "altText": "Circle Rubber Stamp preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "stamp",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Circle Rubber Stamp detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "stamp",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Circle Rubber Stamp packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "stamp",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Format",
        "values": [
          "Standard A4",
          "Compact A5",
          "Custom DL"
        ]
      },
      {
        "name": "Binding / Ink",
        "values": [
          "Standard Option",
          "Premium Finish"
        ]
      }
    ],
    "variants": [
      {
        "id": "circle-rubber-stamp-std",
        "title": "Standard / Option A",
        "sku": "STN-CIRC-STD",
        price: money(34900),
        compareAtPrice: money(44900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Format",
            "value": "Standard A4"
          },
          {
            "name": "Binding / Ink",
            "value": "Standard Option"
          }
        ]
      },
      {
        "id": "circle-rubber-stamp-prm",
        "title": "Premium / Option B",
        "sku": "STN-CIRC-PRM",
        price: money(45400),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.3,
        "selectedOptions": [
          {
            "name": "Format",
            "value": "Standard A4"
          },
          {
            "name": "Binding / Ink",
            "value": "Premium Finish"
          }
        ]
      }
    ],
    priceFrom: money(34900),
    compareAtFrom: money(44900),
    "quantityTiers": [
      {
        "qty": 1,
        price: money(34900),
        compareAtPrice: money(44900)
      },
      {
        "qty": 5,
        price: money(146600)
      },
      {
        "qty": 10,
        price: money(261800),
        "note": "Office Pack"
      }
    ],
    "priceUnit": "per piece",
    "specs": [
      {
        "label": "Paper Stock",
        "value": "80 - 120 GSM Executive Bond"
      },
      {
        "label": "Standard Sizes",
        "value": "A4, A5, DL, or Custom Cut"
      },
      {
        "label": "Ink Consistency",
        "value": "Crisp smudge-resistant pigment"
      },
      {
        "label": "Turnaround",
        "value": "2 Business Days"
      }
    ],
    "minOrderQty": 1,
    "turnaroundDays": 2,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.5,
    "reviewCount": 222,
    "faqs": [
      {
        "q": "Are letterheads compatible with office desktop printers?",
        "a": "Yes, our 100 GSM superwhite letterhead paper feeds cleanly through all standard inkjet and laser printers."
      },
      {
        "q": "How many impressions does a pre-inked rubber stamp yield?",
        "a": "Pre-inked stamps deliver up to 10,000 clean impressions before requiring an ink refill."
      },
      {
        "q": "Can bill books be numbered sequentially?",
        "a": "Yes, consecutive numbering and perforated tearing are standard on duplicate and triplicate NCR books."
      }
    ],
    "relatedHandles": [
      "wiro-notebooks",
      "perfect-bound-notebooks",
      "staple-bound-notebooks",
      "hard-cover-notebooks"
    ],
    "highlights": [
      "Crisp letterform reproduction and vector alignment",
      "Smooth fountain-pen and laser-printer compatible paper",
      "Durable construction designed for heavy office utility"
    ]
  },
  {
    "id": "prod-large-rubber-stamp",
    "handle": "large-rubber-stamp",
    "title": "Large Rubber Stamp",
    "subtitle": "Essential office stationery customized with high precision print",
    "description": "Streamline your workplace branding with customized Large Rubber Stamp. Professional paperweights, crisp typography, and long-lasting impression quality.",
    "productType": "Stationery & Stamps",
    "categoryHandles": [
      "stationery-stamps"
    ],
    "tags": [
      "large rubber stamp",
      "stationery & stamps",
      "stamp"
    ],
    "badges": [],
    "images": [
      {
        "url": "",
        "altText": "Large Rubber Stamp preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "stamp",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Large Rubber Stamp detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "stamp",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Large Rubber Stamp packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "stamp",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Format",
        "values": [
          "Standard A4",
          "Compact A5",
          "Custom DL"
        ]
      },
      {
        "name": "Binding / Ink",
        "values": [
          "Standard Option",
          "Premium Finish"
        ]
      }
    ],
    "variants": [
      {
        "id": "large-rubber-stamp-std",
        "title": "Standard / Option A",
        "sku": "STN-LARG-STD",
        price: money(34900),
        compareAtPrice: money(44900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Format",
            "value": "Standard A4"
          },
          {
            "name": "Binding / Ink",
            "value": "Standard Option"
          }
        ]
      },
      {
        "id": "large-rubber-stamp-prm",
        "title": "Premium / Option B",
        "sku": "STN-LARG-PRM",
        price: money(45400),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.3,
        "selectedOptions": [
          {
            "name": "Format",
            "value": "Standard A4"
          },
          {
            "name": "Binding / Ink",
            "value": "Premium Finish"
          }
        ]
      }
    ],
    priceFrom: money(34900),
    compareAtFrom: money(44900),
    "quantityTiers": [
      {
        "qty": 1,
        price: money(34900),
        compareAtPrice: money(44900)
      },
      {
        "qty": 5,
        price: money(146600)
      },
      {
        "qty": 10,
        price: money(261800),
        "note": "Office Pack"
      }
    ],
    "priceUnit": "per piece",
    "specs": [
      {
        "label": "Paper Stock",
        "value": "80 - 120 GSM Executive Bond"
      },
      {
        "label": "Standard Sizes",
        "value": "A4, A5, DL, or Custom Cut"
      },
      {
        "label": "Ink Consistency",
        "value": "Crisp smudge-resistant pigment"
      },
      {
        "label": "Turnaround",
        "value": "2 Business Days"
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
        "q": "Are letterheads compatible with office desktop printers?",
        "a": "Yes, our 100 GSM superwhite letterhead paper feeds cleanly through all standard inkjet and laser printers."
      },
      {
        "q": "How many impressions does a pre-inked rubber stamp yield?",
        "a": "Pre-inked stamps deliver up to 10,000 clean impressions before requiring an ink refill."
      },
      {
        "q": "Can bill books be numbered sequentially?",
        "a": "Yes, consecutive numbering and perforated tearing are standard on duplicate and triplicate NCR books."
      }
    ],
    "relatedHandles": [
      "wiro-notebooks",
      "perfect-bound-notebooks",
      "staple-bound-notebooks",
      "hard-cover-notebooks"
    ],
    "highlights": [
      "Crisp letterform reproduction and vector alignment",
      "Smooth fountain-pen and laser-printer compatible paper",
      "Durable construction designed for heavy office utility"
    ]
  },
  {
    "id": "prod-id-cards",
    "handle": "id-cards",
    "title": "ID Cards",
    "subtitle": "Essential office stationery customized with high precision print",
    "description": "Streamline your workplace branding with customized ID Cards. Professional paperweights, crisp typography, and long-lasting impression quality.",
    "productType": "Stationery & Stamps",
    "categoryHandles": [
      "same-day",
      "stationery-stamps"
    ],
    "tags": [
      "id cards",
      "stationery & stamps",
      "card",
      "same day",
      "express",
      "popular",
      "same-day"
    ],
    "badges": [
      "popular",
      "same-day"
    ],
    "images": [
      {
        "url": "",
        "altText": "ID Cards preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "ID Cards detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "ID Cards packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "card",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Format",
        "values": [
          "Standard A4",
          "Compact A5",
          "Custom DL"
        ]
      },
      {
        "name": "Binding / Ink",
        "values": [
          "Standard Option",
          "Premium Finish"
        ]
      }
    ],
    "variants": [
      {
        "id": "id-cards-std",
        "title": "Standard / Option A",
        "sku": "STN-ID-C-STD",
        price: money(9900),
        compareAtPrice: money(14900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Format",
            "value": "Standard A4"
          },
          {
            "name": "Binding / Ink",
            "value": "Standard Option"
          }
        ]
      },
      {
        "id": "id-cards-prm",
        "title": "Premium / Option B",
        "sku": "STN-ID-C-PRM",
        price: money(12900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.3,
        "selectedOptions": [
          {
            "name": "Format",
            "value": "Standard A4"
          },
          {
            "name": "Binding / Ink",
            "value": "Premium Finish"
          }
        ]
      }
    ],
    priceFrom: money(9900),
    compareAtFrom: money(14900),
    "quantityTiers": [
      {
        "qty": 5,
        price: money(9900),
        compareAtPrice: money(14900)
      },
      {
        "qty": 25,
        price: money(41600)
      },
      {
        "qty": 50,
        price: money(74300),
        "note": "Office Pack"
      }
    ],
    "priceUnit": "per piece",
    "specs": [
      {
        "label": "Paper Stock",
        "value": "80 - 120 GSM Executive Bond"
      },
      {
        "label": "Standard Sizes",
        "value": "A4, A5, DL, or Custom Cut"
      },
      {
        "label": "Ink Consistency",
        "value": "Crisp smudge-resistant pigment"
      },
      {
        "label": "Turnaround",
        "value": "Same Day Pickup"
      }
    ],
    "minOrderQty": 5,
    "turnaroundDays": 1,
    "sameDayEligible": true,
    "customizable": true,
    "rating": 4.7,
    "reviewCount": 544,
    "faqs": [
      {
        "q": "Are letterheads compatible with office desktop printers?",
        "a": "Yes, our 100 GSM superwhite letterhead paper feeds cleanly through all standard inkjet and laser printers."
      },
      {
        "q": "How many impressions does a pre-inked rubber stamp yield?",
        "a": "Pre-inked stamps deliver up to 10,000 clean impressions before requiring an ink refill."
      },
      {
        "q": "Can bill books be numbered sequentially?",
        "a": "Yes, consecutive numbering and perforated tearing are standard on duplicate and triplicate NCR books."
      }
    ],
    "relatedHandles": [
      "wiro-notebooks",
      "perfect-bound-notebooks",
      "staple-bound-notebooks",
      "hard-cover-notebooks"
    ],
    "highlights": [
      "Crisp letterform reproduction and vector alignment",
      "Smooth fountain-pen and laser-printer compatible paper",
      "Durable construction designed for heavy office utility"
    ]
  },
  {
    "id": "prod-lanyards",
    "handle": "lanyards",
    "title": "Lanyards",
    "subtitle": "Essential office stationery customized with high precision print",
    "description": "Streamline your workplace branding with customized Lanyards. Professional paperweights, crisp typography, and long-lasting impression quality.",
    "productType": "Stationery & Stamps",
    "categoryHandles": [
      "stationery-stamps"
    ],
    "tags": [
      "lanyards",
      "stationery & stamps",
      "lanyard"
    ],
    "badges": [],
    "images": [
      {
        "url": "",
        "altText": "Lanyards preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "lanyard",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Lanyards detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "lanyard",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Lanyards packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "lanyard",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Format",
        "values": [
          "Standard A4",
          "Compact A5",
          "Custom DL"
        ]
      },
      {
        "name": "Binding / Ink",
        "values": [
          "Standard Option",
          "Premium Finish"
        ]
      }
    ],
    "variants": [
      {
        "id": "lanyards-std",
        "title": "Standard / Option A",
        "sku": "STN-LANY-STD",
        price: money(9900),
        compareAtPrice: money(14900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Format",
            "value": "Standard A4"
          },
          {
            "name": "Binding / Ink",
            "value": "Standard Option"
          }
        ]
      },
      {
        "id": "lanyards-prm",
        "title": "Premium / Option B",
        "sku": "STN-LANY-PRM",
        price: money(12900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.3,
        "selectedOptions": [
          {
            "name": "Format",
            "value": "Standard A4"
          },
          {
            "name": "Binding / Ink",
            "value": "Premium Finish"
          }
        ]
      }
    ],
    priceFrom: money(9900),
    compareAtFrom: money(14900),
    "quantityTiers": [
      {
        "qty": 5,
        price: money(9900),
        compareAtPrice: money(14900)
      },
      {
        "qty": 25,
        price: money(41600)
      },
      {
        "qty": 50,
        price: money(74300),
        "note": "Office Pack"
      }
    ],
    "priceUnit": "per piece",
    "specs": [
      {
        "label": "Paper Stock",
        "value": "80 - 120 GSM Executive Bond"
      },
      {
        "label": "Standard Sizes",
        "value": "A4, A5, DL, or Custom Cut"
      },
      {
        "label": "Ink Consistency",
        "value": "Crisp smudge-resistant pigment"
      },
      {
        "label": "Turnaround",
        "value": "2 Business Days"
      }
    ],
    "minOrderQty": 5,
    "turnaroundDays": 2,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.8,
    "reviewCount": 601,
    "faqs": [
      {
        "q": "Are letterheads compatible with office desktop printers?",
        "a": "Yes, our 100 GSM superwhite letterhead paper feeds cleanly through all standard inkjet and laser printers."
      },
      {
        "q": "How many impressions does a pre-inked rubber stamp yield?",
        "a": "Pre-inked stamps deliver up to 10,000 clean impressions before requiring an ink refill."
      },
      {
        "q": "Can bill books be numbered sequentially?",
        "a": "Yes, consecutive numbering and perforated tearing are standard on duplicate and triplicate NCR books."
      }
    ],
    "relatedHandles": [
      "wiro-notebooks",
      "perfect-bound-notebooks",
      "staple-bound-notebooks",
      "hard-cover-notebooks"
    ],
    "highlights": [
      "Crisp letterform reproduction and vector alignment",
      "Smooth fountain-pen and laser-printer compatible paper",
      "Durable construction designed for heavy office utility"
    ]
  },
  {
    "id": "prod-letterheads",
    "handle": "letterheads",
    "title": "Letterheads",
    "subtitle": "Essential office stationery customized with high precision print",
    "description": "Streamline your workplace branding with customized Letterheads. Professional paperweights, crisp typography, and long-lasting impression quality.",
    "productType": "Stationery & Stamps",
    "categoryHandles": [
      "stationery-stamps"
    ],
    "tags": [
      "letterheads",
      "stationery & stamps",
      "letterhead",
      "popular"
    ],
    "badges": [
      "popular"
    ],
    "images": [
      {
        "url": "",
        "altText": "Letterheads preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "letterhead",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Letterheads detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "letterhead",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Letterheads packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "letterhead",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Format",
        "values": [
          "Standard A4",
          "Compact A5",
          "Custom DL"
        ]
      },
      {
        "name": "Binding / Ink",
        "values": [
          "Standard Option",
          "Premium Finish"
        ]
      }
    ],
    "variants": [
      {
        "id": "letterheads-std",
        "title": "Standard / Option A",
        "sku": "STN-LETT-STD",
        price: money(69900),
        compareAtPrice: money(84900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Format",
            "value": "Standard A4"
          },
          {
            "name": "Binding / Ink",
            "value": "Standard Option"
          }
        ]
      },
      {
        "id": "letterheads-prm",
        "title": "Premium / Option B",
        "sku": "STN-LETT-PRM",
        price: money(90900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.3,
        "selectedOptions": [
          {
            "name": "Format",
            "value": "Standard A4"
          },
          {
            "name": "Binding / Ink",
            "value": "Premium Finish"
          }
        ]
      }
    ],
    priceFrom: money(69900),
    compareAtFrom: money(84900),
    "quantityTiers": [
      {
        "qty": 100,
        price: money(69900),
        compareAtPrice: money(84900)
      },
      {
        "qty": 500,
        price: money(293600)
      },
      {
        "qty": 1000,
        price: money(524300),
        "note": "Office Pack"
      }
    ],
    "priceUnit": "per 100 sheets",
    "specs": [
      {
        "label": "Paper Stock",
        "value": "80 - 120 GSM Executive Bond"
      },
      {
        "label": "Standard Sizes",
        "value": "A4, A5, DL, or Custom Cut"
      },
      {
        "label": "Ink Consistency",
        "value": "Crisp smudge-resistant pigment"
      },
      {
        "label": "Turnaround",
        "value": "2 Business Days"
      }
    ],
    "minOrderQty": 100,
    "turnaroundDays": 2,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.9,
    "reviewCount": 548,
    "faqs": [
      {
        "q": "Are letterheads compatible with office desktop printers?",
        "a": "Yes, our 100 GSM superwhite letterhead paper feeds cleanly through all standard inkjet and laser printers."
      },
      {
        "q": "How many impressions does a pre-inked rubber stamp yield?",
        "a": "Pre-inked stamps deliver up to 10,000 clean impressions before requiring an ink refill."
      },
      {
        "q": "Can bill books be numbered sequentially?",
        "a": "Yes, consecutive numbering and perforated tearing are standard on duplicate and triplicate NCR books."
      }
    ],
    "relatedHandles": [
      "wiro-notebooks",
      "perfect-bound-notebooks",
      "staple-bound-notebooks",
      "hard-cover-notebooks"
    ],
    "highlights": [
      "Crisp letterform reproduction and vector alignment",
      "Smooth fountain-pen and laser-printer compatible paper",
      "Durable construction designed for heavy office utility"
    ]
  },
  {
    "id": "prod-bill-books",
    "handle": "bill-books",
    "title": "Bill Books",
    "subtitle": "Essential office stationery customized with high precision print",
    "description": "Streamline your workplace branding with customized Bill Books. Professional paperweights, crisp typography, and long-lasting impression quality.",
    "productType": "Stationery & Stamps",
    "categoryHandles": [
      "stationery-stamps"
    ],
    "tags": [
      "bill books",
      "stationery & stamps",
      "billbook",
      "bestseller"
    ],
    "badges": [
      "bestseller"
    ],
    "images": [
      {
        "url": "",
        "altText": "Bill Books preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "billbook",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Bill Books detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "billbook",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Bill Books packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "billbook",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Format",
        "values": [
          "Standard A4",
          "Compact A5",
          "Custom DL"
        ]
      },
      {
        "name": "Binding / Ink",
        "values": [
          "Standard Option",
          "Premium Finish"
        ]
      }
    ],
    "variants": [
      {
        "id": "bill-books-std",
        "title": "Standard / Option A",
        "sku": "STN-BILL-STD",
        price: money(69900),
        compareAtPrice: money(84900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Format",
            "value": "Standard A4"
          },
          {
            "name": "Binding / Ink",
            "value": "Standard Option"
          }
        ]
      },
      {
        "id": "bill-books-prm",
        "title": "Premium / Option B",
        "sku": "STN-BILL-PRM",
        price: money(90900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.3,
        "selectedOptions": [
          {
            "name": "Format",
            "value": "Standard A4"
          },
          {
            "name": "Binding / Ink",
            "value": "Premium Finish"
          }
        ]
      }
    ],
    priceFrom: money(69900),
    compareAtFrom: money(84900),
    "quantityTiers": [
      {
        "qty": 100,
        price: money(69900),
        compareAtPrice: money(84900)
      },
      {
        "qty": 500,
        price: money(293600)
      },
      {
        "qty": 1000,
        price: money(524300),
        "note": "Office Pack"
      }
    ],
    "priceUnit": "per 100 sheets",
    "specs": [
      {
        "label": "Paper Stock",
        "value": "80 - 120 GSM Executive Bond"
      },
      {
        "label": "Standard Sizes",
        "value": "A4, A5, DL, or Custom Cut"
      },
      {
        "label": "Ink Consistency",
        "value": "Crisp smudge-resistant pigment"
      },
      {
        "label": "Turnaround",
        "value": "2 Business Days"
      }
    ],
    "minOrderQty": 100,
    "turnaroundDays": 2,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.6,
    "reviewCount": 493,
    "faqs": [
      {
        "q": "Are letterheads compatible with office desktop printers?",
        "a": "Yes, our 100 GSM superwhite letterhead paper feeds cleanly through all standard inkjet and laser printers."
      },
      {
        "q": "How many impressions does a pre-inked rubber stamp yield?",
        "a": "Pre-inked stamps deliver up to 10,000 clean impressions before requiring an ink refill."
      },
      {
        "q": "Can bill books be numbered sequentially?",
        "a": "Yes, consecutive numbering and perforated tearing are standard on duplicate and triplicate NCR books."
      }
    ],
    "relatedHandles": [
      "wiro-notebooks",
      "perfect-bound-notebooks",
      "staple-bound-notebooks",
      "hard-cover-notebooks"
    ],
    "highlights": [
      "Crisp letterform reproduction and vector alignment",
      "Smooth fountain-pen and laser-printer compatible paper",
      "Durable construction designed for heavy office utility"
    ]
  },
  {
    "id": "prod-envelopes",
    "handle": "envelopes",
    "title": "Envelopes",
    "subtitle": "Essential office stationery customized with high precision print",
    "description": "Streamline your workplace branding with customized Envelopes. Professional paperweights, crisp typography, and long-lasting impression quality.",
    "productType": "Stationery & Stamps",
    "categoryHandles": [
      "stationery-stamps"
    ],
    "tags": [
      "envelopes",
      "stationery & stamps",
      "envelope"
    ],
    "badges": [],
    "images": [
      {
        "url": "",
        "altText": "Envelopes preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "envelope",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Envelopes detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "envelope",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Envelopes packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "envelope",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Format",
        "values": [
          "Standard A4",
          "Compact A5",
          "Custom DL"
        ]
      },
      {
        "name": "Binding / Ink",
        "values": [
          "Standard Option",
          "Premium Finish"
        ]
      }
    ],
    "variants": [
      {
        "id": "envelopes-std",
        "title": "Standard / Option A",
        "sku": "STN-ENVE-STD",
        price: money(39900),
        compareAtPrice: money(49900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Format",
            "value": "Standard A4"
          },
          {
            "name": "Binding / Ink",
            "value": "Standard Option"
          }
        ]
      },
      {
        "id": "envelopes-prm",
        "title": "Premium / Option B",
        "sku": "STN-ENVE-PRM",
        price: money(51900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.3,
        "selectedOptions": [
          {
            "name": "Format",
            "value": "Standard A4"
          },
          {
            "name": "Binding / Ink",
            "value": "Premium Finish"
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
        "qty": 5,
        price: money(167600)
      },
      {
        "qty": 10,
        price: money(299300),
        "note": "Office Pack"
      }
    ],
    "priceUnit": "per batch",
    "specs": [
      {
        "label": "Paper Stock",
        "value": "80 - 120 GSM Executive Bond"
      },
      {
        "label": "Standard Sizes",
        "value": "A4, A5, DL, or Custom Cut"
      },
      {
        "label": "Ink Consistency",
        "value": "Crisp smudge-resistant pigment"
      },
      {
        "label": "Turnaround",
        "value": "2 Business Days"
      }
    ],
    "minOrderQty": 1,
    "turnaroundDays": 2,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.7,
    "reviewCount": 196,
    "faqs": [
      {
        "q": "Are letterheads compatible with office desktop printers?",
        "a": "Yes, our 100 GSM superwhite letterhead paper feeds cleanly through all standard inkjet and laser printers."
      },
      {
        "q": "How many impressions does a pre-inked rubber stamp yield?",
        "a": "Pre-inked stamps deliver up to 10,000 clean impressions before requiring an ink refill."
      },
      {
        "q": "Can bill books be numbered sequentially?",
        "a": "Yes, consecutive numbering and perforated tearing are standard on duplicate and triplicate NCR books."
      }
    ],
    "relatedHandles": [
      "wiro-notebooks",
      "perfect-bound-notebooks",
      "staple-bound-notebooks",
      "hard-cover-notebooks"
    ],
    "highlights": [
      "Crisp letterform reproduction and vector alignment",
      "Smooth fountain-pen and laser-printer compatible paper",
      "Durable construction designed for heavy office utility"
    ]
  },
  {
    "id": "prod-notepads",
    "handle": "notepads",
    "title": "Notepads",
    "subtitle": "Essential office stationery customized with high precision print",
    "description": "Streamline your workplace branding with customized Notepads. Professional paperweights, crisp typography, and long-lasting impression quality.",
    "productType": "Stationery & Stamps",
    "categoryHandles": [
      "stationery-stamps"
    ],
    "tags": [
      "notepads",
      "stationery & stamps",
      "notepad"
    ],
    "badges": [],
    "images": [
      {
        "url": "",
        "altText": "Notepads preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "notepad",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Notepads detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "notepad",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Notepads packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "notepad",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Format",
        "values": [
          "Standard A4",
          "Compact A5",
          "Custom DL"
        ]
      },
      {
        "name": "Binding / Ink",
        "values": [
          "Standard Option",
          "Premium Finish"
        ]
      }
    ],
    "variants": [
      {
        "id": "notepads-std",
        "title": "Standard / Option A",
        "sku": "STN-NOTE-STD",
        price: money(39900),
        compareAtPrice: money(49900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Format",
            "value": "Standard A4"
          },
          {
            "name": "Binding / Ink",
            "value": "Standard Option"
          }
        ]
      },
      {
        "id": "notepads-prm",
        "title": "Premium / Option B",
        "sku": "STN-NOTE-PRM",
        price: money(51900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.3,
        "selectedOptions": [
          {
            "name": "Format",
            "value": "Standard A4"
          },
          {
            "name": "Binding / Ink",
            "value": "Premium Finish"
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
        "qty": 5,
        price: money(167600)
      },
      {
        "qty": 10,
        price: money(299300),
        "note": "Office Pack"
      }
    ],
    "priceUnit": "per batch",
    "specs": [
      {
        "label": "Paper Stock",
        "value": "80 - 120 GSM Executive Bond"
      },
      {
        "label": "Standard Sizes",
        "value": "A4, A5, DL, or Custom Cut"
      },
      {
        "label": "Ink Consistency",
        "value": "Crisp smudge-resistant pigment"
      },
      {
        "label": "Turnaround",
        "value": "2 Business Days"
      }
    ],
    "minOrderQty": 1,
    "turnaroundDays": 2,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.6,
    "reviewCount": 167,
    "faqs": [
      {
        "q": "Are letterheads compatible with office desktop printers?",
        "a": "Yes, our 100 GSM superwhite letterhead paper feeds cleanly through all standard inkjet and laser printers."
      },
      {
        "q": "How many impressions does a pre-inked rubber stamp yield?",
        "a": "Pre-inked stamps deliver up to 10,000 clean impressions before requiring an ink refill."
      },
      {
        "q": "Can bill books be numbered sequentially?",
        "a": "Yes, consecutive numbering and perforated tearing are standard on duplicate and triplicate NCR books."
      }
    ],
    "relatedHandles": [
      "wiro-notebooks",
      "perfect-bound-notebooks",
      "staple-bound-notebooks",
      "hard-cover-notebooks"
    ],
    "highlights": [
      "Crisp letterform reproduction and vector alignment",
      "Smooth fountain-pen and laser-printer compatible paper",
      "Durable construction designed for heavy office utility"
    ]
  },
  {
    "id": "prod-presentation-folders",
    "handle": "presentation-folders",
    "title": "Presentation Folders",
    "subtitle": "Essential office stationery customized with high precision print",
    "description": "Streamline your workplace branding with customized Presentation Folders. Professional paperweights, crisp typography, and long-lasting impression quality.",
    "productType": "Stationery & Stamps",
    "categoryHandles": [
      "stationery-stamps"
    ],
    "tags": [
      "presentation folders",
      "stationery & stamps",
      "folder"
    ],
    "badges": [],
    "images": [
      {
        "url": "",
        "altText": "Presentation Folders preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "folder",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Presentation Folders detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "folder",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Presentation Folders packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "folder",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Format",
        "values": [
          "Standard A4",
          "Compact A5",
          "Custom DL"
        ]
      },
      {
        "name": "Binding / Ink",
        "values": [
          "Standard Option",
          "Premium Finish"
        ]
      }
    ],
    "variants": [
      {
        "id": "presentation-folders-std",
        "title": "Standard / Option A",
        "sku": "STN-PRES-STD",
        price: money(39900),
        compareAtPrice: money(49900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Format",
            "value": "Standard A4"
          },
          {
            "name": "Binding / Ink",
            "value": "Standard Option"
          }
        ]
      },
      {
        "id": "presentation-folders-prm",
        "title": "Premium / Option B",
        "sku": "STN-PRES-PRM",
        price: money(51900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.3,
        "selectedOptions": [
          {
            "name": "Format",
            "value": "Standard A4"
          },
          {
            "name": "Binding / Ink",
            "value": "Premium Finish"
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
        "qty": 5,
        price: money(167600)
      },
      {
        "qty": 10,
        price: money(299300),
        "note": "Office Pack"
      }
    ],
    "priceUnit": "per batch",
    "specs": [
      {
        "label": "Paper Stock",
        "value": "80 - 120 GSM Executive Bond"
      },
      {
        "label": "Standard Sizes",
        "value": "A4, A5, DL, or Custom Cut"
      },
      {
        "label": "Ink Consistency",
        "value": "Crisp smudge-resistant pigment"
      },
      {
        "label": "Turnaround",
        "value": "2 Business Days"
      }
    ],
    "minOrderQty": 1,
    "turnaroundDays": 2,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.4,
    "reviewCount": 59,
    "faqs": [
      {
        "q": "Are letterheads compatible with office desktop printers?",
        "a": "Yes, our 100 GSM superwhite letterhead paper feeds cleanly through all standard inkjet and laser printers."
      },
      {
        "q": "How many impressions does a pre-inked rubber stamp yield?",
        "a": "Pre-inked stamps deliver up to 10,000 clean impressions before requiring an ink refill."
      },
      {
        "q": "Can bill books be numbered sequentially?",
        "a": "Yes, consecutive numbering and perforated tearing are standard on duplicate and triplicate NCR books."
      }
    ],
    "relatedHandles": [
      "wiro-notebooks",
      "perfect-bound-notebooks",
      "staple-bound-notebooks",
      "hard-cover-notebooks"
    ],
    "highlights": [
      "Crisp letterform reproduction and vector alignment",
      "Smooth fountain-pen and laser-printer compatible paper",
      "Durable construction designed for heavy office utility"
    ]
  },
  {
    "id": "prod-branded-pens",
    "handle": "branded-pens",
    "title": "Branded Pens",
    "subtitle": "Essential office stationery customized with high precision print",
    "description": "Streamline your workplace branding with customized Branded Pens. Professional paperweights, crisp typography, and long-lasting impression quality.",
    "productType": "Stationery & Stamps",
    "categoryHandles": [
      "stationery-stamps"
    ],
    "tags": [
      "branded pens",
      "stationery & stamps",
      "pen"
    ],
    "badges": [],
    "images": [
      {
        "url": "",
        "altText": "Branded Pens preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "pen",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Branded Pens detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "pen",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Branded Pens packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "pen",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Format",
        "values": [
          "Standard A4",
          "Compact A5",
          "Custom DL"
        ]
      },
      {
        "name": "Binding / Ink",
        "values": [
          "Standard Option",
          "Premium Finish"
        ]
      }
    ],
    "variants": [
      {
        "id": "branded-pens-std",
        "title": "Standard / Option A",
        "sku": "STN-BRAN-STD",
        price: money(39900),
        compareAtPrice: money(49900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Format",
            "value": "Standard A4"
          },
          {
            "name": "Binding / Ink",
            "value": "Standard Option"
          }
        ]
      },
      {
        "id": "branded-pens-prm",
        "title": "Premium / Option B",
        "sku": "STN-BRAN-PRM",
        price: money(51900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.3,
        "selectedOptions": [
          {
            "name": "Format",
            "value": "Standard A4"
          },
          {
            "name": "Binding / Ink",
            "value": "Premium Finish"
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
        "qty": 5,
        price: money(167600)
      },
      {
        "qty": 10,
        price: money(299300),
        "note": "Office Pack"
      }
    ],
    "priceUnit": "per batch",
    "specs": [
      {
        "label": "Paper Stock",
        "value": "80 - 120 GSM Executive Bond"
      },
      {
        "label": "Standard Sizes",
        "value": "A4, A5, DL, or Custom Cut"
      },
      {
        "label": "Ink Consistency",
        "value": "Crisp smudge-resistant pigment"
      },
      {
        "label": "Turnaround",
        "value": "2 Business Days"
      }
    ],
    "minOrderQty": 1,
    "turnaroundDays": 2,
    "sameDayEligible": false,
    "customizable": true,
    "rating": 4.5,
    "reviewCount": 502,
    "faqs": [
      {
        "q": "Are letterheads compatible with office desktop printers?",
        "a": "Yes, our 100 GSM superwhite letterhead paper feeds cleanly through all standard inkjet and laser printers."
      },
      {
        "q": "How many impressions does a pre-inked rubber stamp yield?",
        "a": "Pre-inked stamps deliver up to 10,000 clean impressions before requiring an ink refill."
      },
      {
        "q": "Can bill books be numbered sequentially?",
        "a": "Yes, consecutive numbering and perforated tearing are standard on duplicate and triplicate NCR books."
      }
    ],
    "relatedHandles": [
      "wiro-notebooks",
      "perfect-bound-notebooks",
      "staple-bound-notebooks",
      "hard-cover-notebooks"
    ],
    "highlights": [
      "Crisp letterform reproduction and vector alignment",
      "Smooth fountain-pen and laser-printer compatible paper",
      "Durable construction designed for heavy office utility"
    ]
  },
  {
    "id": "prod-document-printing",
    "handle": "document-printing",
    "title": "Document Printing",
    "subtitle": "Essential office stationery customized with high precision print",
    "description": "Streamline your workplace branding with customized Document Printing. Professional paperweights, crisp typography, and long-lasting impression quality.",
    "productType": "Stationery & Stamps",
    "categoryHandles": [
      "same-day",
      "stationery-stamps"
    ],
    "tags": [
      "document printing",
      "stationery & stamps",
      "flyer",
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
        "altText": "Document Printing preview showcase",
        "width": 1200,
        "height": 1200,
        "kind": "flyer",
        "tone": "#f1edfb"
      },
      {
        "url": "",
        "altText": "Document Printing detail and texture angle",
        "width": 1200,
        "height": 1200,
        "kind": "flyer",
        "tone": "#edebf2"
      },
      {
        "url": "",
        "altText": "Document Printing packaging and finish view",
        "width": 1200,
        "height": 1200,
        "kind": "flyer",
        "tone": "#e4dcf7"
      }
    ],
    "options": [
      {
        "name": "Format",
        "values": [
          "Standard A4",
          "Compact A5",
          "Custom DL"
        ]
      },
      {
        "name": "Binding / Ink",
        "values": [
          "Standard Option",
          "Premium Finish"
        ]
      }
    ],
    "variants": [
      {
        "id": "document-printing-std",
        "title": "Standard / Option A",
        "sku": "STN-DOCU-STD",
        price: money(39900),
        compareAtPrice: money(49900),
        "availableForSale": true,
        "priceFactor": 1,
        "selectedOptions": [
          {
            "name": "Format",
            "value": "Standard A4"
          },
          {
            "name": "Binding / Ink",
            "value": "Standard Option"
          }
        ]
      },
      {
        "id": "document-printing-prm",
        "title": "Premium / Option B",
        "sku": "STN-DOCU-PRM",
        price: money(51900),
        "compareAtPrice": null,
        "availableForSale": true,
        "priceFactor": 1.3,
        "selectedOptions": [
          {
            "name": "Format",
            "value": "Standard A4"
          },
          {
            "name": "Binding / Ink",
            "value": "Premium Finish"
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
        "qty": 5,
        price: money(167600)
      },
      {
        "qty": 10,
        price: money(299300),
        "note": "Office Pack"
      }
    ],
    "priceUnit": "per batch",
    "specs": [
      {
        "label": "Paper Stock",
        "value": "80 - 120 GSM Executive Bond"
      },
      {
        "label": "Standard Sizes",
        "value": "A4, A5, DL, or Custom Cut"
      },
      {
        "label": "Ink Consistency",
        "value": "Crisp smudge-resistant pigment"
      },
      {
        "label": "Turnaround",
        "value": "Same Day Pickup"
      }
    ],
    "minOrderQty": 1,
    "turnaroundDays": 1,
    "sameDayEligible": true,
    "customizable": true,
    "rating": 4.5,
    "reviewCount": 244,
    "faqs": [
      {
        "q": "Are letterheads compatible with office desktop printers?",
        "a": "Yes, our 100 GSM superwhite letterhead paper feeds cleanly through all standard inkjet and laser printers."
      },
      {
        "q": "How many impressions does a pre-inked rubber stamp yield?",
        "a": "Pre-inked stamps deliver up to 10,000 clean impressions before requiring an ink refill."
      },
      {
        "q": "Can bill books be numbered sequentially?",
        "a": "Yes, consecutive numbering and perforated tearing are standard on duplicate and triplicate NCR books."
      }
    ],
    "relatedHandles": [
      "wiro-notebooks",
      "perfect-bound-notebooks",
      "staple-bound-notebooks",
      "hard-cover-notebooks"
    ],
    "highlights": [
      "Crisp letterform reproduction and vector alignment",
      "Smooth fountain-pen and laser-printer compatible paper",
      "Durable construction designed for heavy office utility"
    ]
  }
];
