# Product authoring contract

One file per category group. **Do not edit `index.ts`** — it already imports your export.

| File | Export | Count |
|---|---|---|
| `cards.ts` | `cardProducts` | 27 |
| `apparel.ts` | `apparelProducts` | 17 |
| `gifts.ts` | `giftProducts` | 26 |
| `stationery.ts` | `stationeryProducts` | 28 |
| `packaging.ts` | `packagingProducts` | 17 |
| `signage.ts` | `signageProducts` | 14 |
| `decor.ts` | `decorProducts` | 20 |
| `festive.ts` | `festiveProducts` | 13 |
| `bulk.ts` | `bulkProducts` | 3 |

Each exports `const xProducts: Product[]`. Handles are fixed by the nav tree — use the exact list
you were given, spelled exactly. A missing handle means an empty category page.

---

## Rules

- **`Money` is integer paise.** Use the `money()` helper. `money(39900)` is ₹399.
- **`quantityTiers[].price` is the TOTAL for that batch**, not per-unit. `{ qty: 100, price: money(39900) }`
  means "100 cards for ₹399". Tiers ascend by `qty` and the per-unit rate must **fall** as `qty` rises.
- **`priceFrom` must equal `quantityTiers[0].price`** exactly. Same for `compareAtFrom` and
  `quantityTiers[0].compareAtPrice`. Set both compare-at values to `null` if the product isn't discounted.
- **`priceUnit`** reads naturally after the price: `"per 100 cards"`, `"per piece"`, `"per 50 sheets"`.
- **Realistic Indian print pricing.** Visiting cards ₹199–₹1,200 per 100. T-shirts ₹349–₹899 each.
  Mugs ₹249–₹549. Stickers ₹299–₹899 per 100. Signage ₹800–₹6,500. Trophies ₹450–₹2,800.
  Bulk lines start at 500+ pieces and undercut retail per-unit by 30–45%.
- **`variants`** = the cross-product of the **first one or two** options only (keep it under ~12
  variants). `priceFactor` is the multiplier on the tier price: `1` for the base variant, `1.25` for
  a premium paper, `0.9` for a cheaper one. Variant `price` = `priceFrom × priceFactor`, rounded to
  whole rupees (multiple of 100 paise). `sku` looks like `VC-STD-300M`. Set `availableForSale: false`
  on at most one variant per file, so the out-of-stock UI has something real to render.
- **`rating`** 4.3–4.9 with one decimal. **`reviewCount`** 40–900. Derive both with
  `hashInt(handle, …)` from `lib/utils` if you want spread without picking numbers by hand — but
  literal values are fine and clearer.
- **`images`**: 3–4 entries. No real photography exists, so every image is a generated mockup:
  `{ url: "", altText: "…", width: 1200, height: 1200, kind: "<MockupKind>", tone: "<hex>" }`.
  `url` stays `""` — the `ProductMockup` component draws from `kind`. Vary `tone` per image so the
  gallery isn't monotone. Pick `kind` from the `MockupKind` union in `lib/commerce/types.ts`; use the
  most specific match (`card-stack` not `generic`).
- **`specs`**: 4–6 job-ticket rows, rendered in mono. Real print vocabulary, e.g.
  `{ label: "Paper", value: "300 GSM art card" }`, `{ label: "Printing", value: "4/4 CMYK offset" }`,
  `{ label: "Finish", value: "Matte lamination, both sides" }`, `{ label: "Size", value: "89 × 54 mm" }`,
  `{ label: "Corners", value: "Square trim" }`, `{ label: "Turnaround", value: "2 working days" }`.
- **`turnaroundDays`** 1–7. `sameDayEligible: true` only for the 10 handles in the `same-day`
  category. `customizable: true` when a customer could design it on canvas (cards, mugs, t-shirts,
  stickers); `uploadOnly: true` for jobs that need print-ready artwork (large signage, bill books,
  document printing).
- **`badges`**: 0–2 per product, from `BadgeKind`. Don't badge everything — roughly a third of
  products carry none. `same-day` badge only on same-day handles.
- **`categoryHandles`**: the owning category, plus every other category whose nav tree lists this
  handle (you were told which). Same-day handles include `"same-day"`.
- **`relatedHandles`**: 4 sibling handles **from the list you were given** — never invent one.
- **`faqs`**: 3–4 genuinely useful Q&As, print-specific. Answer the questions a real customer asks:
  bleed and safe margins, file formats, what "300 GSM" means, minimum order, reprint policy,
  colour variation between screen and press, washing instructions for apparel.
- **`highlights`**: 3–4 short benefit lines, no full stops, no superlatives.
- **`description`**: 2–3 sentences. Concrete and specific — paper, process, use case. Not marketing air.
- **`subtitle`**: one clarifying line, under 60 characters.
- **No emoji.** Plain Indian English. "Personalised", "colour", "₹".

---

## Worked example — copy this shape exactly

```ts
import { money, type Product } from "@/lib/commerce/types";

export const cardProducts: Product[] = [
  {
    id: "vc-standard",
    handle: "standard-visiting-cards",
    title: "Standard Visiting Cards",
    subtitle: "300 GSM art card, matte or gloss, ready in 4 hours",
    description:
      "Our everyday workhorse card, printed 4/4 CMYK on 300 GSM art card and trimmed to the standard 89 × 54 mm. Choose matte lamination for a soft, writable surface or gloss for punchier colour. Order before 11 am and collect from our local store the same afternoon.",
    productType: "Visiting Cards",
    categoryHandles: ["visiting-cards", "same-day"],
    tags: ["visiting cards", "business cards", "300 gsm", "same day", "matte"],
    badges: ["bestseller", "same-day"],

    images: [
      { url: "", altText: "Standard visiting cards fanned out", width: 1200, height: 1200, kind: "card-stack", tone: "#f1edfb" },
      { url: "", altText: "Front and back of a matte laminated card", width: 1200, height: 1200, kind: "card", tone: "#edebf2" },
      { url: "", altText: "Close-up of the matte laminated surface", width: 1200, height: 1200, kind: "card", tone: "#e4dcf7" },
    ],

    options: [
      { name: "Paper", values: ["300 GSM art card", "350 GSM art card", "300 GSM matte"] },
      { name: "Finish", values: ["Matte lamination", "Gloss lamination", "No lamination"] },
      { name: "Corners", values: ["Square", "Rounded"] },
    ],
    variants: [
      { id: "vc-standard-300-matte", title: "300 GSM art card / Matte lamination", sku: "VC-STD-300M", price: money(39900), compareAtPrice: money(49900), availableForSale: true, priceFactor: 1, selectedOptions: [{ name: "Paper", value: "300 GSM art card" }, { name: "Finish", value: "Matte lamination" }] },
      { id: "vc-standard-300-gloss", title: "300 GSM art card / Gloss lamination", sku: "VC-STD-300G", price: money(39900), compareAtPrice: money(49900), availableForSale: true, priceFactor: 1, selectedOptions: [{ name: "Paper", value: "300 GSM art card" }, { name: "Finish", value: "Gloss lamination" }] },
      { id: "vc-standard-350-matte", title: "350 GSM art card / Matte lamination", sku: "VC-STD-350M", price: money(47900), compareAtPrice: null, availableForSale: true, priceFactor: 1.2, selectedOptions: [{ name: "Paper", value: "350 GSM art card" }, { name: "Finish", value: "Matte lamination" }] },
    ],

    priceFrom: money(39900),
    compareAtFrom: money(49900),
    quantityTiers: [
      { qty: 100, price: money(39900), compareAtPrice: money(49900) },
      { qty: 250, price: money(74900), compareAtPrice: money(94900) },
      { qty: 500, price: money(119900), compareAtPrice: money(159900), note: "Best value" },
      { qty: 1000, price: money(199900), compareAtPrice: money(279900) },
    ],
    priceUnit: "per 100 cards",

    specs: [
      { label: "Paper", value: "300 GSM art card" },
      { label: "Size", value: "89 × 54 mm" },
      { label: "Printing", value: "4/4 CMYK offset" },
      { label: "Finish", value: "Matte or gloss lamination" },
      { label: "Bleed", value: "2 mm all round" },
      { label: "Turnaround", value: "Same day before 11 am" },
    ],
    minOrderQty: 100,
    turnaroundDays: 1,
    sameDayEligible: true,
    customizable: true,

    rating: 4.8,
    reviewCount: 612,
    faqs: [
      { q: "What bleed and margin should my file have?", a: "Add 2 mm bleed on every edge and keep text at least 3 mm inside the trim line. We trim in stacks, so anything closer risks being clipped on the outer cards." },
      { q: "Can I print different names on the same order?", a: "Yes. Up to 10 name variations are included on orders of 500 or more — send the list on WhatsApp after checkout and we will set them up." },
      { q: "Will the colour match what I see on screen?", a: "Screens are backlit and CMYK ink is not, so deep blues and bright oranges print slightly softer. Ask for a hard proof at checkout if the shade is critical." },
    ],
    relatedHandles: ["rounded-corner-cards", "matte-laminated-cards", "spot-uv-cards", "letterheads"],
    highlights: [
      "Ready in 4 hours on same-day orders",
      "Free matte or gloss lamination",
      "Design on canvas or upload your own artwork",
    ],
  },
  // … 26 more
];
```

Finish by running `npx tsc --noEmit` and fixing anything in your own file.
