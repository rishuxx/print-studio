import type { Category, CategoryLink } from "@/lib/commerce/types";

/**
 * ══════════════════════════════════════════════════════════════════
 * CATALOG TREE — drives the mega-menu, mobile nav, homepage strip,
 * category pages, breadcrumbs and the sitemap footer.
 *
 * Mega-menu columns follow the pattern in the spec:
 *   Best sellers → Sub-types → By shape/material → Premium finish
 * ══════════════════════════════════════════════════════════════════
 */

export const categories: Category[] = [
  /* ─────────────────────────────────────────────────────────────────
     SAME DAY / EXPRESS
     ───────────────────────────────────────────────────────────────── */
  {
    handle: "same-day",
    title: "Same Day",
    blurb: "Walk in before 11 AM, collect the same evening locally.",
    icon: "Clock",
    inNav: true,
    inQuickStrip: true,
    badges: ["same-day"],
    mockup: "card-stack",
    feature: {
      eyebrow: "Cut-off 11:00 AM",
      title: "Need it today?",
      body: "Order before 11 AM and collect from our local store the same evening. Local delivery options available.",
      href: "/same-day",
      cta: "See today's list",
      tone: "marigold",
    },
    groups: [
      {
        title: "Ready in 4 hours",
        items: [
          { title: "Standard Visiting Cards", handle: "standard-visiting-cards", badge: "same-day" },
          { title: "Business Flyers A5", handle: "business-flyers", badge: "popular" },
          { title: "Document Printing", handle: "document-printing" },
          { title: "Standard Paper Posters", handle: "standard-paper-posters" },
          { title: "Classic Photo Prints", handle: "classic-photo-prints", badge: "popular" },
        ],
      },
      {
        title: "Ready by tomorrow",
        items: [
          { title: "Cotton Round Neck T-Shirt", handle: "cotton-round-neck-tshirt" },
          { title: "White Photo Mug", handle: "white-photo-mug" },
          { title: "Self-Inking Rubber Stamp", handle: "self-inking-rubber-stamp" },
          { title: "Circle Stickers", handle: "circle-stickers" },
          { title: "ID Cards", handle: "id-cards" },
        ],
      },
      {
        title: "How express works",
        items: [
          { title: "Same-day products", href: "/same-day" },
          { title: "Store pickup", href: "/store-locator" },
          { title: "Express delivery zones", href: "/help/shipping" },
          { title: "Upload artwork now", href: "/design-help" },
        ],
      },
    ],
  },

  /* ─────────────────────────────────────────────────────────────────
     VISITING CARDS
     ───────────────────────────────────────────────────────────────── */
  {
    handle: "visiting-cards",
    title: "Visiting Cards",
    blurb: "28 stocks and finishes, from 100 cards up. The first thing people keep.",
    icon: "CreditCard",
    inNav: true,
    inQuickStrip: true,
    mockup: "card-stack",
    feature: {
      eyebrow: "Not sure which paper?",
      title: "Order a sample kit",
      body: "12 stocks and 6 finishes you can hold, bend and hold up to the light. ₹99, refunded on your first order.",
      href: "/sample-kit",
      cta: "Get the kit",
      tone: "violet",
    },
    groups: [
      {
        title: "Best sellers",
        items: [
          { title: "Standard Visiting Cards", handle: "standard-visiting-cards", badge: "bestseller" },
          { title: "Rounded Corner Cards", handle: "rounded-corner-cards", badge: "popular" },
          { title: "Matte Laminated Cards", handle: "matte-laminated-cards", badge: "popular" },
          { title: "Spot UV Cards", handle: "spot-uv-cards", badge: "recommended" },
          { title: "Velvet Touch Cards", handle: "velvet-touch-cards", badge: "premium" },
          { title: "Classic Rectangle Cards", handle: "classic-rectangle-cards" },
        ],
      },
      {
        title: "Paper & material",
        items: [
          { title: "Textured Cards", handle: "textured-cards" },
          { title: "Special Paper Cards", handle: "special-paper-cards" },
          { title: "Kraft Paper Cards", handle: "kraft-paper-cards", badge: "eco" },
          { title: "Eco-Friendly Cards", handle: "eco-friendly-cards", badge: "eco" },
          { title: "Non-Tearable Cards", handle: "non-tearable-cards" },
          { title: "Plastic Cards", handle: "plastic-cards" },
          { title: "Sandwich Cards", handle: "sandwich-cards", badge: "premium" },
        ],
      },
      {
        title: "By shape",
        items: [
          { title: "Square Cards", handle: "square-cards" },
          { title: "Circular Cards", handle: "circular-cards" },
          { title: "Oval Cards", handle: "oval-cards" },
          { title: "U-Shape Cards", handle: "u-shape-cards" },
          { title: "Mini Cards", handle: "mini-cards", badge: "new" },
          { title: "Die-Cut Cards", handle: "die-cut-cards" },
          { title: "Custom Shape Cards", handle: "custom-shape-cards" },
        ],
      },
      {
        title: "Premium finishes",
        items: [
          { title: "Metallic Finish Cards", handle: "metallic-finish-cards", badge: "premium" },
          { title: "Gold Foil Cards", handle: "gold-foil-cards", badge: "premium" },
          { title: "Silver Foil Cards", handle: "silver-foil-cards" },
          { title: "Raised Foil Cards", handle: "raised-foil-cards", badge: "new" },
          { title: "Glossy Laminated Cards", handle: "glossy-laminated-cards" },
          { title: "QR-Code Cards", handle: "qr-code-cards", badge: "recommended" },
          { title: "Stationery Combos", handle: "business-stationery-combos", badge: "bulk-saver" },
        ],
      },
    ],
  },

  /* ─────────────────────────────────────────────────────────────────
     APPAREL
     ───────────────────────────────────────────────────────────────── */
  {
    handle: "apparel",
    title: "Apparel",
    blurb: "Print one or five hundred. Screen, DTF and embroidery in-house.",
    icon: "Shirt",
    inNav: true,
    inQuickStrip: true,
    mockup: "tshirt",
    feature: {
      eyebrow: "No minimum",
      title: "One t-shirt is a real order",
      body: "Single-piece printing at the same quality as a 500-piece run. Bulk pricing kicks in from 25 units.",
      href: "/category/apparel",
      cta: "Start with one",
      tone: "ink",
    },
    groups: [
      {
        title: "Best sellers",
        items: [
          { title: "Cotton Premium Round Neck", handle: "cotton-premium-round-neck", badge: "bestseller" },
          { title: "Ultra Premium Polo", handle: "ultra-premium-polo", badge: "popular" },
          { title: "Hooded Sweatshirt", handle: "hooded-sweatshirt", badge: "popular" },
          { title: "Dry-Fit Round Neck", handle: "dry-fit-round-neck", badge: "recommended" },
        ],
      },
      {
        title: "T-shirts",
        items: [
          { title: "Cotton Round Neck", handle: "cotton-round-neck-tshirt" },
          { title: "Premium Round Neck", handle: "premium-round-neck-tshirt" },
          { title: "Ultra Premium Round Neck", handle: "ultra-premium-round-neck-tshirt", badge: "premium" },
          { title: "Dry-Fit Round Neck", handle: "dry-fit-round-neck" },
          { title: "High Neck T-Shirt", handle: "high-neck-tshirt", badge: "new" },
        ],
      },
      {
        title: "Polos",
        items: [
          { title: "Standard Polo", handle: "standard-polo" },
          { title: "Premium Polo", handle: "premium-polo" },
          { title: "Popcorn Knit Polo", handle: "popcorn-knit-polo", badge: "new" },
          { title: "Ultra Premium Polo", handle: "ultra-premium-polo", badge: "premium" },
        ],
      },
      {
        title: "Warmwear & teams",
        items: [
          { title: "Crew Neck Sweatshirt", handle: "crew-neck-sweatshirt" },
          { title: "Zipper Hoodie", handle: "zipper-hoodie" },
          { title: "Classic High Neck Jacket", handle: "classic-high-neck-jacket" },
          { title: "Bomber Jacket", handle: "bomber-jacket", badge: "premium" },
          { title: "Bulk Team Kits", handle: "bulk-team-kits", badge: "bulk-saver" },
          { title: "Corporate Uniforms", handle: "corporate-uniforms" },
        ],
      },
    ],
  },

  /* ─────────────────────────────────────────────────────────────────
     PERSONALISED GIFTS
     ───────────────────────────────────────────────────────────────── */
  {
    handle: "personalised-gifts",
    title: "Personalised Gifts",
    blurb: "Photos on paper, canvas, ceramic, acrylic and wood.",
    icon: "Gift",
    inNav: true,
    inQuickStrip: true,
    mockup: "frame",
    feature: {
      eyebrow: "Gifting help",
      title: "Send us the photos, we'll do the rest",
      body: "WhatsApp your images and we'll crop, colour-correct and share a proof before printing. No extra charge.",
      href: "/design-help",
      cta: "Talk to a designer",
      tone: "marigold",
    },
    groups: [
      {
        title: "Photo prints & albums",
        items: [
          { title: "Classic Photo Prints", handle: "classic-photo-prints", badge: "bestseller" },
          { title: "Retro Polaroid Prints", handle: "retro-polaroid-prints", badge: "popular" },
          { title: "Square Photo Prints", handle: "square-photo-prints" },
          { title: "Passport Photos", handle: "passport-photos", badge: "same-day" },
          { title: "Bulk Photo Prints", handle: "bulk-photo-prints", badge: "bulk-saver" },
          { title: "Photo Albums & Books", handle: "photo-albums", badge: "premium" },
        ],
      },
      {
        title: "Frames & canvas",
        items: [
          { title: "Classic Photo Frames", handle: "classic-photo-frames", badge: "popular" },
          { title: "Wall Photo Frames", handle: "wall-photo-frames" },
          { title: "Premium Photo Frames", handle: "premium-photo-frames", badge: "premium" },
          { title: "Canvas Gallery Wraps", handle: "canvas-gallery-wraps", badge: "recommended" },
          { title: "Rolled Canvas Prints", handle: "rolled-canvas-prints" },
          { title: "MDF Canvas Prints", handle: "mdf-canvas-prints", badge: "new" },
          { title: "Canvas Combos", handle: "canvas-combos", badge: "bulk-saver" },
        ],
      },
      {
        title: "Acrylic & mugs",
        items: [
          { title: "Acrylic Photo Frames", handle: "acrylic-photo-frames", badge: "popular" },
          { title: "Premium Acrylic Frames", handle: "premium-acrylic-frames", badge: "premium" },
          { title: "Leatherette Photo Frames", handle: "leatherette-photo-frames" },
          { title: "White Photo Mug", handle: "white-photo-mug", badge: "bestseller" },
          { title: "Magic Colour-Change Mug", handle: "magic-photo-mug", badge: "popular" },
          { title: "Inner Colour Mug", handle: "inner-colour-mug" },
          { title: "Beer Mug", handle: "beer-mug" },
          { title: "Mini Mug", handle: "mini-mug", badge: "new" },
        ],
      },
      {
        title: "Invitations",
        items: [
          { title: "Wedding Invitations", handle: "wedding-invitations", badge: "popular" },
          { title: "Birthday Invitations", handle: "birthday-invitations" },
          { title: "Business Invitations", handle: "business-invitations" },
          { title: "A5 Standard Invitations", handle: "a5-standard-invitations" },
          { title: "Flat Invitation Cards", handle: "flat-invitation-cards" },
        ],
      },
    ],
  },

  /* ─────────────────────────────────────────────────────────────────
     STATIONERY & STAMPS
     ───────────────────────────────────────────────────────────────── */
  {
    handle: "stationery-stamps",
    title: "Stationery & Stamps",
    blurb: "The paperwork a business actually runs on.",
    icon: "NotebookPen",
    inNav: true,
    inQuickStrip: true,
    mockup: "notebook",
    feature: {
      eyebrow: "For repeat buyers",
      title: "Reorder in two taps",
      body: "Every stationery order is saved with its exact specs and artwork. Reorder without re-uploading anything.",
      href: "/account/orders",
      cta: "See your orders",
      tone: "violet",
    },
    groups: [
      {
        title: "Notebooks & booklets",
        items: [
          { title: "Wiro Notebooks", handle: "wiro-notebooks", badge: "bestseller" },
          { title: "Perfect Bound Notebooks", handle: "perfect-bound-notebooks" },
          { title: "Staple Bound Notebooks", handle: "staple-bound-notebooks" },
          { title: "Hard Cover Notebooks", handle: "hard-cover-notebooks", badge: "premium" },
          { title: "Kraft Notebooks", handle: "kraft-notebooks", badge: "eco" },
          { title: "Staple Binding Booklets", handle: "staple-binding-booklets", badge: "popular" },
          { title: "Perfect Binding Booklets", handle: "perfect-binding-booklets" },
          { title: "Hard Cover Booklets", handle: "hard-cover-booklets" },
        ],
      },
      {
        title: "Marketing paper",
        items: [
          { title: "Custom Brochures", handle: "custom-brochures", badge: "popular" },
          { title: "Tri-Fold Brochures", handle: "tri-fold-brochures", badge: "recommended" },
          { title: "Half-Fold Brochures", handle: "half-fold-brochures" },
          { title: "Folded Menu Cards", handle: "folded-menu-cards" },
          { title: "Business Flyers", handle: "business-flyers", badge: "same-day" },
          { title: "Offer Flyers", handle: "offer-flyers" },
          { title: "DL Promo Flyers", handle: "dl-promo-flyers" },
        ],
      },
      {
        title: "Stamps & ID",
        items: [
          { title: "Self-Inking Rubber Stamp", handle: "self-inking-rubber-stamp", badge: "bestseller" },
          { title: "Pre-Inked Rubber Stamp", handle: "pre-inked-rubber-stamp" },
          { title: "Circle Rubber Stamp", handle: "circle-rubber-stamp" },
          { title: "Large Rubber Stamp", handle: "large-rubber-stamp" },
          { title: "ID Cards", handle: "id-cards", badge: "popular" },
          { title: "Lanyards", handle: "lanyards" },
        ],
      },
      {
        title: "Office essentials",
        items: [
          { title: "Letterheads", handle: "letterheads", badge: "popular" },
          { title: "Bill Books", handle: "bill-books", badge: "bestseller" },
          { title: "Envelopes", handle: "envelopes" },
          { title: "Notepads", handle: "notepads" },
          { title: "Presentation Folders", handle: "presentation-folders" },
          { title: "Branded Pens", handle: "branded-pens" },
          { title: "Document Printing", handle: "document-printing", badge: "same-day" },
        ],
      },
    ],
  },

  /* ─────────────────────────────────────────────────────────────────
     LABELS & PACKAGING
     ───────────────────────────────────────────────────────────────── */
  {
    handle: "labels-packaging",
    title: "Labels & Packaging",
    blurb: "Everything between your product and your customer's hands.",
    icon: "Package",
    inNav: true,
    inQuickStrip: true,
    mockup: "box",
    feature: {
      eyebrow: "End-to-end",
      title: "One brief, every piece of your unboxing",
      body: "Mailer box, tissue, sticker seal, hang tag and tape — spec'd together so the colours actually match.",
      href: "/business-solutions/end-to-end-packaging",
      cta: "See the bundle",
      tone: "ink",
    },
    groups: [
      {
        title: "Best sellers",
        items: [
          { title: "Circle Stickers", handle: "circle-stickers", badge: "bestseller" },
          { title: "Product Packaging Labels", handle: "product-packaging-labels", badge: "popular" },
          { title: "Personalised Tote Bags", handle: "personalised-tote-bags", badge: "popular" },
          { title: "Flat Mailer Boxes", handle: "flat-mailer-boxes", badge: "recommended" },
        ],
      },
      {
        title: "Stickers & labels",
        items: [
          { title: "Circle Stickers", handle: "circle-stickers" },
          { title: "Square Stickers", handle: "square-stickers" },
          { title: "Custom Die-Cut Stickers", handle: "custom-die-cut-stickers", badge: "new" },
          { title: "Sticker Sheets", handle: "sticker-sheets" },
          { title: "Product Packaging Labels", handle: "product-packaging-labels" },
          { title: "Rectangle Hang Tags", handle: "rectangle-hang-tags" },
          { title: "Custom Hang Tags", handle: "custom-hang-tags" },
        ],
      },
      {
        title: "Boxes & bags",
        items: [
          { title: "Flat Mailer Boxes", handle: "flat-mailer-boxes" },
          { title: "Rigid Gift Boxes", handle: "rigid-gift-boxes", badge: "premium" },
          { title: "Top & Bottom Rigid Boxes", handle: "top-bottom-rigid-boxes" },
          { title: "Gift Paper Bags", handle: "gift-paper-bags" },
          { title: "Kraft Paper Bags", handle: "kraft-paper-bags", badge: "eco" },
          { title: "Personalised Tote Bags", handle: "personalised-tote-bags" },
        ],
      },
      {
        title: "Finishing touches",
        items: [
          { title: "Custom Packing Tape", handle: "custom-packing-tape" },
          { title: "Custom Tissue Paper", handle: "custom-tissue-paper", badge: "new" },
          { title: "Thank-You Cards", handle: "thank-you-cards" },
          { title: "Void Fill & Inserts", handle: "void-fill-inserts" },
        ],
      },
    ],
  },

  /* ─────────────────────────────────────────────────────────────────
     SIGNAGE
     ───────────────────────────────────────────────────────────────── */
  {
    handle: "signage",
    title: "Signage",
    blurb: "Board, acrylic, vinyl and standees — measured, printed, installed.",
    icon: "Signpost",
    inNav: true,
    inQuickStrip: true,
    mockup: "signage",
    feature: {
      eyebrow: "Local Service Area",
      title: "We measure and install",
      body: "Send a photo of the wall or shopfront. We'll site-measure, print and fit it — no third-party fabricator.",
      href: "/contact",
      cta: "Book a site visit",
      tone: "violet",
    },
    groups: [
      {
        title: "Best sellers",
        items: [
          { title: "Acrylic Signage", handle: "acrylic-signage", badge: "bestseller" },
          { title: "Standard Paper Posters", handle: "standard-paper-posters", badge: "same-day" },
          { title: "Wall Decals", handle: "wall-decals", badge: "popular" },
          { title: "Roll-Up Standees", handle: "roll-up-standees", badge: "recommended" },
        ],
      },
      {
        title: "Boards & panels",
        items: [
          { title: "Acrylic Signage", handle: "acrylic-signage" },
          { title: "Custom Acrylic Sign Board", handle: "custom-acrylic-sign-board", badge: "new" },
          { title: "Foam Board Signs", handle: "foam-board-signs" },
          { title: "Sunboard Signs", handle: "sunboard-signs" },
          { title: "Backlit Signage", handle: "backlit-signage", badge: "premium" },
        ],
      },
      {
        title: "Posters & vinyl",
        items: [
          { title: "Standard Paper Posters", handle: "standard-paper-posters" },
          { title: "Premium Photo Posters", handle: "premium-photo-posters" },
          { title: "Wall Decals", handle: "wall-decals" },
          { title: "Floor Decals", handle: "floor-decals" },
          { title: "Window Vinyl", handle: "window-vinyl" },
        ],
      },
      {
        title: "Events & display",
        items: [
          { title: "Roll-Up Standees", handle: "roll-up-standees" },
          { title: "Canopy & Backdrop", handle: "canopy-backdrop" },
          { title: "Table Tent Cards", handle: "table-tent-cards" },
          { title: "Acrylic Desk Stands", handle: "acrylic-desk-stands" },
        ],
      },
    ],
  },

  /* ─────────────────────────────────────────────────────────────────
     DECOR & DRINKWARE
     ───────────────────────────────────────────────────────────────── */
  {
    handle: "decor-drinkware",
    title: "Decor & Drinkware",
    blurb: "Desk, wall and everyday-carry objects, personalised.",
    icon: "Coffee",
    inNav: true,
    inQuickStrip: true,
    mockup: "tumbler",
    feature: {
      eyebrow: "New this season",
      title: "Radiate tumblers, laser-etched",
      body: "1200 ml double-wall steel with a permanent etched mark that survives the dishwasher. Minimum 1.",
      href: "/product/radiate-tumbler-1200ml",
      cta: "See the tumbler",
      tone: "marigold",
    },
    groups: [
      {
        title: "Drinkware",
        items: [
          { title: "Radiate Tumbler 1200 ml", handle: "radiate-tumbler-1200ml", badge: "new" },
          { title: "Insulated Tumblers", handle: "insulated-tumblers", badge: "popular" },
          { title: "Sipper Bottles", handle: "sipper-bottles" },
          { title: "Premium Ceramic Mugs", handle: "premium-ceramic-mugs", badge: "premium" },
          { title: "Steel Water Bottles", handle: "steel-water-bottles" },
        ],
      },
      {
        title: "Home decor",
        items: [
          { title: "Wall Decor Panels", handle: "wall-decor-panels" },
          { title: "Photo Pendant Wooden Stand", handle: "photo-pendant-wooden-stand", badge: "popular" },
          { title: "Coasters", handle: "coasters" },
          { title: "Wooden Engraved Plaques", handle: "wooden-engraved-plaques", badge: "premium" },
          { title: "Fridge Magnets", handle: "fridge-magnets", badge: "new" },
          { title: "Bottle Opener Magnets", handle: "bottle-opener-magnets" },
        ],
      },
      {
        title: "Desk & office",
        items: [
          { title: "Desk Calendars", handle: "desk-calendars", badge: "bestseller" },
          { title: "Wooden Base Calendars", handle: "wooden-base-calendars" },
          { title: "Desktop Organisers", handle: "desktop-organisers" },
          { title: "Laptop Sleeves", handle: "laptop-sleeves", badge: "popular" },
          { title: "Personalised Keychains", handle: "personalised-keychains" },
        ],
      },
      {
        title: "Recognition",
        items: [
          { title: "Awards & Trophies", handle: "awards-trophies", badge: "popular" },
          { title: "Certificates", handle: "certificates" },
          { title: "Crystal Awards", handle: "crystal-awards", badge: "premium" },
          { title: "Employee Gift Sets", handle: "employee-gift-sets", badge: "bulk-saver" },
        ],
      },
    ],
  },

  /* ─────────────────────────────────────────────────────────────────
     BULK PRINTING
     ───────────────────────────────────────────────────────────────── */
  {
    handle: "bulk",
    title: "Bulk",
    blurb: "500 pieces and up, priced by the job instead of the unit.",
    icon: "Boxes",
    inNav: true,
    mockup: "card-stack",
    feature: {
      eyebrow: "Reply within 4 working hours",
      title: "Tell us the job, get a real number",
      body: "Quantity, deadline, artwork — one form. A named person quotes it, not an algorithm.",
      href: "/bulk-quote",
      cta: "Request a quote",
      tone: "ink",
    },
    groups: [
      {
        title: "Popular bulk jobs",
        items: [
          { title: "Bulk Visiting Cards", handle: "bulk-visiting-cards", badge: "bestseller" },
          { title: "Bulk Team Kits", handle: "bulk-team-kits", badge: "popular" },
          { title: "Bulk Photo Prints", handle: "bulk-photo-prints" },
          { title: "Onboarding Kits", handle: "onboarding-kits", badge: "recommended" },
          { title: "Bulk Brochures", handle: "bulk-brochures" },
        ],
      },
      {
        title: "By industry",
        items: [
          { title: "Startup Branding", href: "/business-solutions/startup-branding" },
          { title: "Cafe & Restaurant", href: "/business-solutions/cafe-restaurant" },
          { title: "Education & Campus", href: "/business-solutions/education-campus" },
          { title: "Events & Promotions", href: "/business-solutions/events-promotions" },
          { title: "E-commerce", href: "/business-solutions/ecommerce" },
        ],
      },
      {
        title: "Get help",
        items: [
          { title: "Request a bulk quote", href: "/bulk-quote", badge: "recommended" },
          { title: "Business Solutions", href: "/business-solutions" },
          { title: "Talk to sales", href: "/contact" },
          { title: "Design assistance", href: "/design-help" },
          { title: "Order a sample kit", href: "/sample-kit" },
        ],
      },
    ],
  },

  /* ─────────────────────────────────────────────────────────────────
     FESTIVE SPECIALS (seasonal)
     ───────────────────────────────────────────────────────────────── */
  {
    handle: "festive",
    title: "Festive",
    blurb: "Navratri to Christmas — gifting, cards and decor, dated to the calendar.",
    icon: "PartyPopper",
    inNav: true,
    seasonal: true,
    badges: ["festive"],
    mockup: "hamper",
    feature: {
      eyebrow: "Diwali 2026 · 8 Nov",
      title: "Corporate hampers close 20 Oct",
      body: "Bulk Diwali gifting needs three weeks for custom boxes and sleeves. Lock quantities now, finalise artwork later.",
      href: "/festive/diwali",
      cta: "Plan Diwali gifting",
      tone: "marigold",
    },
    groups: [
      {
        title: "Diwali",
        items: [
          { title: "Custom Diyas & Gift Boxes", handle: "custom-diyas-gift-boxes", badge: "festive" },
          { title: "Diwali Cards", handle: "diwali-cards", badge: "popular" },
          { title: "Diwali Hampers", handle: "diwali-hampers", badge: "bestseller" },
          { title: "Corporate Diwali Gifting", handle: "corporate-diwali-gifting", badge: "bulk-saver" },
          { title: "Rangoli & Decor Stickers", handle: "rangoli-decor-stickers" },
        ],
      },
      {
        title: "Navratri & Dussehra",
        items: [
          { title: "Navratri Decor Kits", handle: "navratri-decor-kits", badge: "festive" },
          { title: "Garba Event Standees", handle: "garba-event-standees" },
          { title: "Dussehra Greeting Cards", handle: "dussehra-greeting-cards" },
          { title: "Festive Photo Gifts", handle: "festive-photo-gifts", badge: "popular" },
        ],
      },
      {
        title: "Christmas & New Year",
        items: [
          { title: "Christmas Cards", handle: "christmas-cards", badge: "festive" },
          { title: "Christmas Decor", handle: "christmas-decor" },
          { title: "New Year Desk Calendars", handle: "new-year-desk-calendars", badge: "bestseller" },
          { title: "New Year Diaries", handle: "new-year-diaries" },
        ],
      },
      {
        title: "Festive hubs",
        items: [
          { title: "All festive specials", href: "/festive" },
          { title: "Diwali", href: "/festive/diwali", badge: "festive" },
          { title: "Navratri", href: "/festive/navratri" },
          { title: "Dussehra", href: "/festive/dussehra" },
          { title: "Christmas", href: "/festive/christmas" },
          { title: "Corporate gifting guide", href: "/blog/corporate-diwali-gifting-guide" },
        ],
      },
    ],
  },
];

/* ─────────────────────────────────────────────────────────────────────
   LOOKUPS

   Model note: top-level entries (10) are CATEGORIES → /category/<handle>.
   Their mega-menu leaves are PRODUCTS → /product/<handle>, matching how
   printo.in works ("Visiting Cards" is the category, "Standard Visiting
   Cards" is a product with paper/finish/shape options). Links carrying an
   `href` are ordinary pages and belong to neither index.
   ───────────────────────────────────────────────────────────────────── */

/** Top-level categories that appear in the primary nav bar. */
export const navCategories = categories.filter((c) => c.inNav);

/** Categories shown in the homepage quick-icon strip. */
export const quickStripCategories = categories.filter((c) => c.inQuickStrip);

export function getCategory(handle: string): Category | undefined {
  return categories.find((c) => c.handle === handle);
}

export const categoryHandles: string[] = categories.map((c) => c.handle!);

/** Resolves a mega-menu link to its destination URL. */
export function linkHref(item: CategoryLink): string {
  if (item.href) return item.href;
  if (item.isCategory) return `/category/${item.handle}`;
  return `/product/${item.handle}`;
}

export interface ProductRef {
  handle: string;
  title: string;
  categoryHandle: string;
  categoryTitle: string;
  groupTitle: string;
  badge?: string;
}

/**
 * Every product referenced by the mega-menu, with the category and column
 * it was listed under. The catalog in lib/data/products must cover all of
 * these handles — `npm run check:catalog` fails the build if one is missing.
 */
export const productIndex: ProductRef[] = categories.flatMap((cat) =>
  (cat.groups ?? []).flatMap((group) =>
    group.items
      .filter((item) => !item.href && !item.isCategory && item.handle)
      .map((item) => ({
        handle: item.handle!,
        title: item.title,
        categoryHandle: cat.handle!,
        categoryTitle: cat.title,
        groupTitle: group.title,
        badge: item.badge,
      })),
  ),
);

/** Deduplicated product handles — drives generateStaticParams and catalog checks. */
export const allProductHandles: string[] = Array.from(
  new Set(productIndex.map((p) => p.handle)),
);

/** Product handles grouped by their owning category. */
export const productHandlesByCategory: Record<string, string[]> =
  Object.fromEntries(
    categories.map((cat) => [
      cat.handle!,
      Array.from(
        new Set(
          productIndex
            .filter((p) => p.categoryHandle === cat.handle)
            .map((p) => p.handle),
        ),
      ),
    ]),
  );

export function getProductRef(handle: string): ProductRef | undefined {
  return productIndex.find((p) => p.handle === handle);
}

/** Breadcrumb trail for a category page. */
export function getCategoryBreadcrumbs(
  handle: string,
): Array<{ title: string; href: string }> {
  const cat = getCategory(handle);
  const trail = [{ title: "All products", href: "/products" }];
  if (cat) trail.push({ title: cat.title, href: `/category/${cat.handle}` });
  return trail;
}

/** Breadcrumb trail for a product page, via its first-listed category. */
export function getProductBreadcrumbs(
  handle: string,
  fallbackTitle?: string,
): Array<{ title: string; href: string }> {
  const ref = getProductRef(handle);
  const trail = [{ title: "All products", href: "/products" }];
  if (ref) {
    trail.push({
      title: ref.categoryTitle,
      href: `/category/${ref.categoryHandle}`,
    });
    trail.push({ title: ref.title, href: `/product/${ref.handle}` });
  } else if (fallbackTitle) {
    trail.push({ title: fallbackTitle, href: `/product/${handle}` });
  }
  return trail;
}

/** Sibling products in the same mega-menu column. */
export function getSiblingProducts(handle: string, limit = 8): ProductRef[] {
  const ref = getProductRef(handle);
  if (!ref) return [];
  return productIndex
    .filter((p) => p.categoryHandle === ref.categoryHandle && p.handle !== handle)
    .slice(0, limit);
}
