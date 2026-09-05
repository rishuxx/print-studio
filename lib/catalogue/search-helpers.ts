/**
 * Search normalization and lenient term expansion for storefront product queries.
 * Handles common abbreviations, compounding/hyphenation (e.g., tshirt <-> t-shirt, 
 * visiting card <-> business card), and typo tolerance.
 */

const SYNONYM_MAP: Record<string, string[]> = {
  // T-shirts and apparel
  tshirt: ["t-shirt", "t shirt", "tee", "apparel"],
  tshirts: ["t-shirt", "t-shirts", "tees", "apparel"],
  "t-shirt": ["tshirt", "t shirt", "tee", "apparel"],
  "t-shirts": ["tshirts", "t shirts", "tees", "apparel"],
  tee: ["t-shirt", "tshirt", "tee shirt", "t-shirts"],
  tees: ["t-shirts", "tshirts", "t-shirt"],
  shirt: ["t-shirt", "polo", "apparel"],
  polo: ["polo t-shirt", "polo tshirt", "apparel"],
  hoodie: ["hooded sweatshirt", "hoodies", "sweatshirt"],
  hoodies: ["hooded sweatshirt", "sweatshirt"],
  sweatshirt: ["hooded sweatshirt", "hoodie"],
  cap: ["caps", "headwear", "embroidered cap"],
  jersey: ["dry fit", "sportswear", "t-shirt"],

  // Cards and stationery
  "visiting card": ["business card", "visiting cards", "name card"],
  "visiting cards": ["business cards", "visiting card", "visiting-cards"],
  "business card": ["visiting card", "business cards", "visiting cards"],
  "business cards": ["visiting cards", "business card", "visiting-cards"],
  card: ["visiting card", "business card", "greeting card", "id card"],
  cards: ["visiting cards", "business cards", "playing cards", "id cards"],
  "id card": ["lanyard", "identity card", "pvc id card", "badges"],
  idcard: ["id card", "identity card", "lanyard"],
  lanyard: ["id card", "badge lanyard", "ribbon"],
  badge: ["pin badge", "id badge", "button badge"],
  letterhead: ["letter head", "stationery", "corporate stationery"],
  envelope: ["envelopes", "office envelope", "mailers"],
  diary: ["notebook", "planner", "journal"],
  notebook: ["diary", "notepad", "spiral notebook"],
  notepad: ["notebook", "writing pad", "memo"],
  pen: ["pens", "metal pen", "engraved pen"],
  stamp: ["rubber stamp", "self inking stamp", "seal"],

  // Mugs and drinkware
  mug: ["mugs", "coffee mug", "ceramic mug", "beer mug", "cup"],
  mugs: ["mug", "coffee mug", "cups", "beer mug"],
  cup: ["mug", "coffee cup", "paper cup"],
  bottle: ["water bottle", "sipper", "flask", "thermos"],
  flask: ["thermos", "vacuum flask", "bottle", "hot and cold bottle"],
  sipper: ["sports bottle", "sipper bottle", "water bottle"],
  coaster: ["tea coaster", "drink coaster", "mDF coaster"],

  // Labels and packaging
  sticker: ["stickers", "labels", "vinyl sticker", "die cut sticker"],
  stickers: ["sticker", "labels", "decals"],
  label: ["labels", "stickers", "product label", "barcode"],
  labels: ["label", "stickers", "product labels"],
  decal: ["sticker", "decals", "wall decal"],
  box: ["boxes", "packaging box", "carton", "corrugated box"],
  boxes: ["box", "packaging", "cartons"],
  bag: ["tote bag", "paper bag", "non woven bag", "pouches"],
  pouch: ["stand up pouch", "ziplock", "packaging pouch"],

  // Signage and marketing
  standee: ["roll up standee", "banner stand", "standees", "display stand"],
  standees: ["standee", "roll up stand", "banners"],
  banner: ["flex banner", "vinyl banner", "standee", "posters"],
  posters: ["poster", "photo poster", "frame"],
  poster: ["posters", "wall poster", "framed poster"],
  flyer: ["pamphlet", "brochure", "leaflet", "handbill"],
  flyers: ["flyer", "brochures", "pamphlets"],
  brochure: ["brochures", "pamphlet", "flyer", "catalogue", "folder"],
  pamphlet: ["flyer", "brochure", "leaflet"],
  canopy: ["tent", "gazebo", "promotional canopy", "stall"],
  acrylic: ["acrylic frame", "acrylic sign", "nameplate", "led sign"],

  // Gifts and photo products
  photo: ["frame", "photo gift", "canvas", "photo frame", "album"],
  frame: ["photo frame", "wall frame", "acrylic frame", "canvas print"],
  canvas: ["canvas print", "photo canvas", "wall art"],
  calendar: ["desk calendar", "wall calendar", "table calendar"],
  gift: ["corporate gift", "personalised gift", "hamper", "memento", "trophy"],
  trophy: ["award", "memento", "medal", "plaque"],
};

/**
 * Expands a raw user query string into an array of search query variations
 * to maximize match accuracy across hyphenations, synonyms, and word forms.
 */
export function expandSearchTerms(rawQuery: string): string[] {
  const clean = rawQuery.trim().toLowerCase();
  if (!clean) return [];

  const terms = new Set<string>();
  terms.add(clean);

  // 1. Hyphen and spacing variations (e.g. "t-shirt" <-> "tshirt" <-> "t shirt")
  if (clean.includes("-")) {
    terms.add(clean.replace(/-/g, ""));
    terms.add(clean.replace(/-/g, " "));
  }
  if (clean.includes(" ")) {
    terms.add(clean.replace(/\s+/g, "-"));
    terms.add(clean.replace(/\s+/g, ""));
  }

  // Common compaction/de-compaction
  if (clean === "tshirt" || clean === "tshirts") {
    terms.add("t-shirt");
    terms.add("t shirt");
    terms.add("t-shirts");
    terms.add("tee");
  } else if (clean === "t-shirt" || clean === "t-shirts") {
    terms.add("tshirt");
    terms.add("tshirts");
    terms.add("tee");
  }

  // 2. Direct dictionary synonyms
  if (SYNONYM_MAP[clean]) {
    SYNONYM_MAP[clean].forEach((s) => terms.add(s));
  }

  // 3. Word-by-word expansion for multi-word queries
  const words = clean.split(/[\s-]+/).filter((w) => w.length > 1);
  for (const w of words) {
    if (SYNONYM_MAP[w]) {
      SYNONYM_MAP[w].forEach((s) => terms.add(s));
    }
  }

  return Array.from(terms).filter((t) => t.length > 0);
}

/**
 * Builds a Postgres websearch_to_tsquery string that includes OR variants
 * for lenient search matching.
 */
export function buildWebsearchQuery(rawQuery: string): string {
  const variations = expandSearchTerms(rawQuery);
  if (variations.length === 0) return rawQuery.trim();

  // Pick top 4 unique variations joined with " or "
  const topVariations = variations.slice(0, 4);
  return topVariations.join(" or ");
}
