/**
 * ══════════════════════════════════════════════════════════════════
 * COMMERCE CONTRACT
 *
 * These types deliberately mirror the **Shopify Storefront API** shape
 * (`handle`, `variants`, `selectedOptions`, `compareAtPrice`,
 * `availableForSale`, `MoneyV2`) so that swapping the mock provider for
 * a real Shopify provider is a single-file change — no component or
 * page needs to be touched.
 *
 * MONEY: stored as integer **paise** (₹1 = 100). Integer maths avoids
 * float drift on quantity tiers. `toShopifyMoney()` converts to the
 * decimal-string form Shopify expects at the provider boundary.
 * ══════════════════════════════════════════════════════════════════
 */

export type CurrencyCode = "INR";

export interface Money {
  /** Integer paise. ₹1,299.00 → 129900 */
  amount: number;
  currencyCode: CurrencyCode;
}

export const money = (paise: number): Money => ({
  amount: paise,
  currencyCode: "INR",
});

/** Shopify wants `{ amount: "1299.00", currencyCode: "INR" }`. */
export const toShopifyMoney = (m: Money) => ({
  amount: (m.amount / 100).toFixed(2),
  currencyCode: m.currencyCode,
});

export interface ProductImage {
  url: string;
  altText: string;
  width: number;
  height: number;
  /** Present for placeholder art: drives the generated mockup. */
  kind?: MockupKind;
  /** Hex background for the generated mockup surface. */
  tone?: string;
}

/** Which generated mockup silhouette to draw for a placeholder image. */
export type MockupKind =
  | "card"
  | "card-stack"
  | "tshirt"
  | "hoodie"
  | "polo"
  | "mug"
  | "tumbler"
  | "bottle"
  | "notebook"
  | "booklet"
  | "brochure"
  | "flyer"
  | "poster"
  | "sticker"
  | "sticker-sheet"
  | "label"
  | "box"
  | "mailer"
  | "bag"
  | "tote"
  | "hangtag"
  | "tape"
  | "frame"
  | "canvas"
  | "photo-print"
  | "album"
  | "acrylic"
  | "signage"
  | "decal"
  | "plaque"
  | "trophy"
  | "certificate"
  | "calendar"
  | "coaster"
  | "stamp"
  | "pen"
  | "idcard"
  | "lanyard"
  | "envelope"
  | "letterhead"
  | "billbook"
  | "folder"
  | "notepad"
  | "invitation"
  | "diya"
  | "hamper"
  | "laptop-sleeve"
  | "organiser"
  | "magnet"
  | "keychain"
  | "generic";

export type BadgeKind =
  | "popular"
  | "new"
  | "recommended"
  | "bestseller"
  | "same-day"
  | "festive"
  | "eco"
  | "premium"
  | "bulk-saver";

export interface ProductOption {
  /** e.g. "Paper", "Finish", "Size", "Colour", "Shape" */
  name: string;
  values: string[];
}

export interface SelectedOption {
  name: string;
  value: string;
}

export interface ProductVariant {
  id: string;
  title: string;
  sku: string;
  price: Money;
  compareAtPrice: Money | null;
  availableForSale: boolean;
  selectedOptions: SelectedOption[];
  /** Multiplier applied to the base quantity-tier unit price. */
  priceFactor?: number;
}

/**
 * Print pricing is per-batch, not per-unit: "100 cards ₹399 · 250 cards ₹749".
 * `qty` is the batch size, `price` the TOTAL for that batch.
 */
export interface QuantityTier {
  qty: number;
  price: Money;
  compareAtPrice?: Money | null;
  /** e.g. "Best value" */
  note?: string;
}

/** A line on the job ticket. Rendered as a mono spec chip. */
export interface PrintSpec {
  label: string;
  value: string;
}

export interface ProductFaq {
  q: string;
  a: string;
}

export interface Review {
  id: string;
  author: string;
  city: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  verified: boolean;
  /** e.g. "Ordered 500 visiting cards" */
  context?: string;
}

export interface Product {
  id: string;
  /** URL segment. Shopify calls this `handle`. */
  handle: string;
  title: string;
  /** One-line clarifier under the title. */
  subtitle: string;
  description: string;
  /** Shopify `productType`. */
  productType: string;
  /** Every category/subcategory handle this product appears under. */
  categoryHandles: string[];
  tags: string[];
  badges: BadgeKind[];

  images: ProductImage[];
  options: ProductOption[];
  variants: ProductVariant[];

  /** Cheapest tier total — drives "from ₹x" on cards. */
  priceFrom: Money;
  compareAtFrom: Money | null;
  quantityTiers: QuantityTier[];
  /** "per 100 cards" — the unit shown beside the price. */
  priceUnit: string;

  specs: PrintSpec[];
  minOrderQty: number;
  /** Business days to dispatch. */
  turnaroundDays: number;
  sameDayEligible: boolean;
  /** Opens the canvas customizer instead of a plain add-to-cart. */
  customizable: boolean;
  /** Requires artwork upload rather than on-canvas design. */
  uploadOnly?: boolean;

  rating: number;
  reviewCount: number;
  faqs: ProductFaq[];
  relatedHandles: string[];

  /** Marketing bullets shown on the product page. */
  highlights: string[];
}

/** Nav + catalog tree node. */
export interface Category {
  handle: string;
  title: string;
  /** Short line used on category hero and tiles. */
  blurb: string;
  /** Lucide icon name, resolved through `lib/icon-map.ts`. */
  icon: string;
  /** Grouped columns for the mega-menu. */
  groups?: CategoryGroup[];
  children?: Category[];
  badges?: BadgeKind[];
  /** Shown in the mega-menu feature panel. */
  feature?: {
    eyebrow: string;
    title: string;
    body: string;
    href: string;
    cta: string;
    tone: "violet" | "marigold" | "ink";
  };
  /** Appears in the top-level nav bar. */
  inNav?: boolean;
  /** Appears in the homepage quick-category strip. */
  inQuickStrip?: boolean;
  seasonal?: boolean;
  mockup?: MockupKind;
}

export interface CategoryGroup {
  /** e.g. "Best sellers", "By shape", "Premium finishes" */
  title: string;
  items: CategoryLink[];
}

export interface CategoryLink {
  title: string;
  /** Product handle → /product/<handle>. The default for catalog leaves. */
  handle?: string;
  /**
   * Direct page link, used instead of `handle` for destinations that aren't
   * catalog nodes (/bulk-quote, /festive/diwali, /help/shipping …).
   * Links with an `href` are excluded from the product index.
   */
  href?: string;
  badge?: BadgeKind;
  /** Set when the link targets a nested category rather than a product. */
  isCategory?: boolean;
}

/* ─────────────────────────────────────────────────────────────────────
   CART
   ───────────────────────────────────────────────────────────────────── */

/** Saved output of the canvas customizer, passed to Shopify as line-item props. */
export interface DesignPayload {
  /** data-URL preview thumbnail. */
  preview: string;
  /** Serialised canvas state so the design can be reopened and edited. */
  state: string;
  /** Human-readable summary for the cart line: "2 texts, 1 logo, front only". */
  summary: string;
  side: "front" | "both";
  templateId?: string;
}

export interface CartLine {
  /** Stable line id — same product+variant+design collapses into one line. */
  id: string;
  productId: string;
  productHandle: string;
  productTitle: string;
  variantId: string;
  variantTitle: string;
  selectedOptions: SelectedOption[];
  image: ProductImage;
  /** Number of BATCHES when the product is tier-priced, else units. */
  quantity: number;
  /** The batch size chosen from `quantityTiers`, if tiered. */
  tierQty: number | null;
  priceUnit: string;
  /** Total for ONE batch/unit at the chosen variant + tier. */
  unitPrice: Money;
  compareAtUnitPrice: Money | null;
  /** unitPrice × quantity. */
  linePrice: Money;
  design: DesignPayload | null;
  /** Selected add-ons, e.g. design assist. */
  addOns: CartAddOn[];
  turnaroundDays: number;
  sameDayEligible: boolean;
  customizable: boolean;
}

export interface CartAddOn {
  id: string;
  title: string;
  price: Money;
}

export interface CartCost {
  subtotal: Money;
  discount: Money;
  shipping: Money;
  tax: Money;
  total: Money;
  /** Paise still needed to unlock free shipping. 0 when unlocked. */
  freeShippingGap: number;
}

export interface AppliedDiscount {
  code: string;
  /** Percentage off subtotal. */
  percent: number;
  label: string;
}

export interface Cart {
  id: string;
  lines: CartLine[];
  cost: CartCost;
  discount: AppliedDiscount | null;
  /** Set when the customer picks in-store collection. */
  fulfilment: "ship" | "pickup";
  /** Delivery pincode used for the estimate. */
  pincode: string | null;
  /** Shopify hands back a hosted checkout URL here. */
  checkoutUrl: string | null;
  totalQuantity: number;
}

/* ─────────────────────────────────────────────────────────────────────
   ORDERS / ACCOUNT
   ───────────────────────────────────────────────────────────────────── */

export type OrderStatus =
  | "placed"
  | "in-design"
  | "printing"
  | "quality-check"
  | "dispatched"
  | "out-for-delivery"
  | "ready-for-pickup"
  | "delivered"
  | "cancelled";

export interface OrderEvent {
  status: OrderStatus;
  label: string;
  note: string;
  at: string | null;
  done: boolean;
}

export interface Order {
  id: string;
  number: string;
  placedAt: string;
  status: OrderStatus;
  lines: CartLine[];
  cost: CartCost;
  fulfilment: "ship" | "pickup";
  timeline: OrderEvent[];
  address: Address | null;
  courier: { name: string; awb: string; trackUrl: string } | null;
  eta: string;
}

export interface Address {
  id: string;
  label: string;
  name: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  addresses: Address[];
  /** GST number for B2B invoicing. */
  gstin?: string;
  company?: string;
}

/* ─────────────────────────────────────────────────────────────────────
   PROVIDER INTERFACE — the Shopify seam
   ───────────────────────────────────────────────────────────────────── */

export interface ProductFilters {
  categoryHandle?: string;
  search?: string;
  materials?: string[];
  finishes?: string[];
  shapes?: string[];
  sizes?: string[];
  colours?: string[];
  badges?: BadgeKind[];
  minPrice?: number;
  maxPrice?: number;
  maxMoq?: number;
  sameDayOnly?: boolean;
  customizableOnly?: boolean;
  sort?: SortKey;
  page?: number;
  perPage?: number;
}

export type SortKey =
  | "relevance"
  | "popular"
  | "price-asc"
  | "price-desc"
  | "newest"
  | "rating"
  | "fastest";

export interface FacetValue {
  value: string;
  count: number;
}

export interface ProductListResult {
  products: Product[];
  total: number;
  page: number;
  perPage: number;
  facets: {
    materials: FacetValue[];
    finishes: FacetValue[];
    shapes: FacetValue[];
    sizes: FacetValue[];
    colours: FacetValue[];
    badges: FacetValue[];
    priceRange: { min: number; max: number };
    moqRange: { min: number; max: number };
  };
}

export interface DeliveryEstimate {
  pincode: string;
  serviceable: boolean;
  zone: "local" | "state" | "north-india" | "rest-of-india";
  zoneLabel: string;
  /** Business days to arrive, on top of turnaround. */
  transitDays: number;
  sameDayAvailable: boolean;
  pickupAvailable: boolean;
  shippingCost: Money;
  message: string;
}

/**
 * Every data read in the app goes through this interface.
 * `lib/commerce/index.ts` picks the implementation; today that's the mock
 * provider, tomorrow it's `shopify-provider.ts`.
 */
export interface CommerceProvider {
  readonly name: string;
  getProduct(handle: string): Promise<Product | null>;
  getProducts(filters?: ProductFilters): Promise<ProductListResult>;
  getProductsByHandles(handles: string[]): Promise<Product[]>;
  getBestSellers(limit?: number): Promise<Product[]>;
  getNewArrivals(limit?: number): Promise<Product[]>;
  getSameDayProducts(limit?: number): Promise<Product[]>;
  getReviews(handle: string): Promise<Review[]>;
  search(query: string, limit?: number): Promise<Product[]>;
  estimateDelivery(pincode: string, turnaroundDays: number): Promise<DeliveryEstimate>;
  createCheckout(cart: Cart): Promise<{ url: string; orderNumber: string }>;
  getOrder(numberOrEmail: string): Promise<Order | null>;
  getOrders(): Promise<Order[]>;
}
