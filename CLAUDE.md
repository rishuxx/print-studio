# Doon Print Studio — build contract

Next.js 16 App Router · React 19 · TypeScript (strict) · Tailwind CSS v4 · Framer Motion · Zustand.
Online printing store for a Dehradun business. Front-end complete, Shopify-ready behind a provider seam.

**Read this file fully before writing code. Do not deviate from the contract below.**

---

## Hard rules

1. **No emoji. Anywhere.** Not in copy, not in JSX, not in data files, not in comments. All iconography
   comes from `lucide-react` via `resolveIcon()` or a direct import.
2. **Brand icons do not exist in lucide-react v1.** `Instagram`, `Facebook`, `Linkedin`, `Youtube`,
   `Twitter` were removed. Use `components/shared/brand-icons.tsx` (hand-written inline SVG).
3. **Mobile-first.** Write the base styles for 360 px, then layer `sm: md: lg: xl:`. Every layout must
   work at 360 px with no horizontal scroll. Tap targets ≥ 44 px.
4. **Every interactive element must actually do something.** No `href="#"`, no dead `onClick`, no
   "coming soon". Buttons either navigate, mutate a store, open a dialog, submit a form, or fire a
   toast. This is a working prototype, not a mockup.
5. **Money is integer paise.** `12900` is ₹129. Format only with `formatINR()`. Never do float maths on
   prices — use the helpers in `lib/pricing.ts`.
6. **Accessibility is not optional.** Real `<button>`/`<a>` elements, `aria-label` on icon-only
   controls, `aria-expanded` on disclosures, visible focus (already global), keyboard-operable menus.
   `prefers-reduced-motion` is handled globally in `globals.css` — don't fight it.
7. **`"use client"` only when needed** — state, effects, event handlers, browser APIs. Data files,
   pure presentational components and pages stay server components.
8. **Indian English and Indian conventions.** "Personalised", "colour", "₹", lakh/crore where natural,
   `en-IN` date and number formatting, pincode (not ZIP), GST, Dehradun/Uttarakhand context.

---

## Design system

Tokens live in `app/globals.css` under Tailwind v4 `@theme`. **There is no `tailwind.config.js`** —
do not create one. Use these as ordinary Tailwind classes (`bg-violet`, `text-marigold-deep`, …).

### Colour

| Token | Hex | Use |
|---|---|---|
| `ink` | `#1b0b2e` | violet-black; all headings, dark zones |
| `ink-soft` / `ink-line` | `#2c1848` / `#3d2a5c` | raised surfaces and borders inside dark zones |
| `violet` | `#4a1e9e` | **the** brand primary; primary buttons, links, active states |
| `violet-lift` | `#6d3fd1` | hover partner, focus ring |
| `violet-deep` | `#35146f` | text on `violet-wash` |
| `violet-wash` / `violet-tint` | `#f1edfb` / `#e4dcf7` | tinted panels, secondary buttons |
| `marigold` | `#f2a31c` | festive accent **only** — seasonal CTAs, countdowns, same-day |
| `marigold-deep` | `#a85a08` | marigold text on light (contrast-safe) |
| `marigold-wash` / `marigold-tint` | `#fef6e7` / `#fce8c2` | festive panels |
| `paper` / `paper-deep` | `#f6f5f8` / `#edebf2` | page background, recessed areas |
| `ink-c` `ink-m` `ink-y` `ink-k` | `#00aeef` `#ec008c` `#fff200` `#1b0b2e` | **process inks — colour bar and registration marks ONLY.** Never a UI colour. |

Also available: `background` `foreground` `card` `popover` `primary` `secondary` `muted`
`muted-foreground` `accent` `destructive` `success` `border` `input` `ring` (shadcn-compatible).

Marigold is rationed. If a section isn't festive, seasonal, or a same-day/urgency signal, it is violet
or ink. Never both accents competing in one block.

### Typography

- `font-display` — **Sora**. All headings. Weight 800, tight tracking (`tracking-[-0.03em]` or
  tighter at display sizes). Already the default for `h1`–`h5` via `globals.css`.
- `font-sans` — **Inter**. Body, UI, forms. Default on `body`.
- `font-mono` — **JetBrains Mono**. **The print-spec voice.** Every piece of job-ticket metadata is
  set in mono: GSM, `4/4 CMYK`, finish, size, SKU, order numbers, countdown digits, price-per-unit,
  eyebrow labels. This is the site's typographic signature — use it deliberately and consistently.

Use the `.spec` / `.spec-sm` utility classes for mono labels (they set size, weight, tracking and
uppercase together). Don't hand-roll `font-mono text-xs uppercase tracking-wider`.

Fluid display sizes: `text-[clamp(2.5rem,8vw,5.5rem)]` style clamps for hero type. Never a fixed
`text-6xl` on something that must survive 360 px.

### Utility classes (defined in `globals.css` — use them, don't reinvent)

| Class | Purpose |
|---|---|
| `.shell` | page container, max-w-84rem, responsive gutters |
| `.shell-wide` | wider container, max-w-96rem |
| `.zone` | vertical rhythm between homepage/page sections |
| `.spec` / `.spec-sm` | mono uppercase spec label |
| `.trim-rule` | dashed trim line with corner ticks — **only** between major zones |
| `.press-sheet` | white surface with faint fibre texture |
| `.ink-bar` | flex container for the CMYK colour bar (`> span` children flex equally) |
| `.lift` | hover-lift for cards (respects reduced motion) |
| `.rail` | horizontal snap-scroll strip (mobile category rows, carousels) |
| `.no-scrollbar` / `.edge-fade` | hide scrollbar / fade rail edges |
| `.skeleton` | shimmer loading block |
| `.ink-zone` | dark passage — ink background with violet/marigold ambient wash |
| `.link-draw` | underline that draws in on hover |

Shadows: `shadow-sheet` (rest) · `shadow-lift` (hover) · `shadow-pop` (overlays).
Radii: cards `rounded-2xl`, buttons `rounded-xl`, chips `rounded-md`, pills `rounded-full`.
Animations: `animate-stamp` `animate-rise` `animate-wipe` `animate-marquee` `animate-shimmer`
`animate-bounce-cart` `animate-fade-in` `animate-slide-down` `animate-slide-up`.

### Motion discipline

The hero has one orchestrated load sequence. Everything else gets **at most** a single subtle
scroll-reveal (`whileInView` with `once: true`, 20 px rise, 0.5 s) plus hover states. Do not add
parallax, floating blobs, gradient animations, typewriters, or staggered letter reveals. Scattered
effects read as AI-generated; restraint reads as designed.

---

## Existing API — use it, don't duplicate it

### `lib/utils.ts`
`cn` · `formatINR(paise)` · `formatNumber` · `slugify` · `titleCase` · `formatDate(iso)` ·
`formatDeliveryDate(date)` · `addBusinessDays(from, days)` · `clamp` · `hashFloat(seed)` ·
`hashInt(seed, min, max)` · `pluralize` · `truncate` · `discountPct` · `absoluteUrl`

`hashFloat`/`hashInt` are **deterministic** — use them instead of `Math.random()` for mock ratings,
review counts and similar, so server and client render identically. Never call `Math.random()` or
`Date.now()` at module scope or during render.

### `lib/site-config.ts`
`siteConfig` (name, logo, tagline, contact, address, social, announcements, trust, deliveryPromise) ·
`FREE_SHIPPING_THRESHOLD` · `FLAT_SHIPPING` · `GST_RATE`.
**Never hardcode the brand name, phone number, address or years-in-business.** Always read from
`siteConfig`.

### `lib/commerce/types.ts`
`Money` `money(paise)` `Product` `ProductVariant` `ProductOption` `QuantityTier` `PrintSpec`
`ProductImage` `MockupKind` `BadgeKind` `Category` `CategoryGroup` `CategoryLink` `CartLine` `Cart`
`CartCost` `DesignPayload` `Order` `OrderStatus` `Address` `Customer` `Review` `ProductFilters`
`SortKey` `ProductListResult` `DeliveryEstimate` `CommerceProvider`.

### `lib/data/categories.ts`
`categories` (10 top-level) · `navCategories` · `quickStripCategories` · `getCategory` ·
`categoryHandles` · `linkHref(item)` · `productIndex` · `allProductHandles` ·
`productHandlesByCategory` · `getProductRef` · `getCategoryBreadcrumbs` · `getProductBreadcrumbs` ·
`getSiblingProducts`.

**Catalog model:** the 10 top-level entries are **categories** → `/category/<handle>`. Their
mega-menu leaves are **products** → `/product/<handle>`. Mega-menu links carrying `href` are ordinary
pages. Always build menu URLs with `linkHref(item)`.

### `lib/pricing.ts`
`tierPrice` `tierCompareAtPrice` `unitRate` `formatUnitRate` `tierSavingPct` `recommendedTier`
`findTier` `findVariant` `defaultOptions` `lineTotal` `lineCompareAtTotal` `linePieces` `computeCost`
`emptyCost` `discountCodes` `validateDiscount` `addOnCatalog` `cartTurnaround`
`cartIsSameDayEligible` `makeLineId` `cartFromLines`.

Valid discount codes: `DIWALI20` (20%) · `FIRST10` (10%) · `DOON15` (15%) · `BULK25` (25%, needs 500+ pieces).

### `lib/icon-map.ts`
`iconRegistry` · `IconName` · `resolveIcon(name)`. Data files store icons as **strings**; components
resolve them. If you need an icon that isn't registered, add it to the registry import list.

### `components/ui/`
- `button.tsx` — `Button`, `buttonVariants`.
  Variants: `primary` `marigold` `ink` `secondary` `outline` `outline-invert` `ghost` `ghost-invert`
  `destructive` `link`. Sizes: `xs` `sm` `default` `lg` `xl` `icon` `icon-sm` `icon-xs`.
  Props: `pill` `full` `loading` `loadingText` `asChild`.
- `badge.tsx` — `Badge` (tones: `neutral` `violet` `solid` `marigold` `ink` `eco` `danger` `outline`),
  `CatalogBadge({ kind })` for `BadgeKind` values, `badgeMeta`.
  **Always render catalog badges via `CatalogBadge`** so "Popular" looks identical everywhere.
- `card.tsx` — `Card` (variants `plain` `sheet` `muted`), `CardHeader/Title/Description/Content/Footer`.
- `input.tsx` — `Input`, `Textarea`, `NativeSelect`, `fieldBase`.

Write further primitives in shadcn/ui style: Radix under the hood, `cva` for variants, `cn()` to
merge, `data-slot` attributes, forwarded props. They are copied source, not a dependency.

---

## Routing map

```
/                                 homepage
/products                         all products, filterable
/category/[handle]                10 category pages
/product/[handle]                 165 product pages
/customize/[handle]               canvas customizer
/cart  /checkout                  cart + mock checkout
/search  /wishlist
/same-day                         express hub
/festive  /festive/[slug]         hub + diwali|navratri|dussehra|christmas
/bulk-quote                       quote request form
/business-solutions               B2B landing
/business-solutions/[slug]        10 industry bundles
/sample-kit  /design-help
/store-locator  /track-order
/login  /account  /account/orders  /account/addresses
/blog  /blog/[slug]
/about  /contact
/help  /help/[slug]               help centre + FAQ topics
/legal/[slug]                     privacy|terms|shipping|returns|cancellation
```

Page params are Promises. Type them explicitly — this works and is version-proof:

```tsx
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ handle: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { handle } = await params;
  const sp = await searchParams;
}
```

Every dynamic page needs `generateStaticParams` and `generateMetadata`, and must call `notFound()`
for unknown handles.

---

## Copy voice

Plain, specific, confident. A 20-year print shop that knows its trade, not a startup.

- Name things the customer's way: "visiting cards" not "SKU-VC-001"; "paper" not "substrate".
- Active voice on controls; the label matches the result. "Add to cart" → toast "Added to cart".
- Be concrete: "Ready by Tuesday, 26 Aug" beats "fast turnaround". "300 GSM matte" beats "premium
  quality". "Reply within 4 working hours" beats "we'll get back to you soon".
- Errors say what happened and what to do: "That pincode isn't serviceable yet. We ship to 19,000+
  pincodes — try another, or WhatsApp us to arrange a courier."
- Empty states invite action, they don't apologise.
- No exclamation marks, no "Oops", no "Awesome!", no marketing superlatives, no em-dash-heavy
  breathless copy.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
