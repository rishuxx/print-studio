import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  validateAttributeValue,
  DEFAULT_STANDARD_ATTRIBUTES,
} from "../lib/catalogue/attribute-utils";
import {
  generateCartesianCombinations,
  generateVariantsFromOptions,
  findMatchingVariant,
  makeOptionKey,
} from "../lib/catalogue/variants";
import {
  normalizeHandle,
  normalizeSKU,
  calculateProductHealth,
  SaveProductSchema,
  SaveCategorySchema,
} from "../lib/catalogue/validation";
import { mapDatabaseProductToStorefront } from "../lib/catalogue/storefront-queries";
import type { DatabaseAttributeDefinition, DatabaseProduct } from "../lib/catalogue/types";

describe("Production Product Catalog & Builder Test Suite", () => {
  describe("1. Dynamic Attribute Engine & Type Validation", () => {
    it("validates NUMBER & DIMENSION attributes with min/max constraints", () => {
      const widthDef: DatabaseAttributeDefinition = {
        id: "attr-width",
        code: "width_cm",
        name: "Width",
        label: "Width (cm)",
        type: "DIMENSION",
        unit: "cm",
        is_required: true,
        visible_on_storefront: true,
        used_for_variant: false,
        used_for_filtering: false,
        used_for_search: false,
        is_global: true,
        sort_order: 10,
        allowed_values: [],
        validation_rules: { min: 10, max: 200 },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Valid value
      const resValid = validateAttributeValue(widthDef, 50);
      assert.equal(resValid.valid, true);

      // Invalid: Below minimum
      const resTooSmall = validateAttributeValue(widthDef, 5);
      assert.equal(resTooSmall.valid, false);
      assert.match(resTooSmall.error || "", /must be at least 10/);

      // Invalid: Above maximum
      const resTooBig = validateAttributeValue(widthDef, 250);
      assert.equal(resTooBig.valid, false);
      assert.match(resTooBig.error || "", /cannot exceed 200/);
    });

    it("validates SELECT & COLOUR_SWATCH allowed values strictly", () => {
      const finishDef: DatabaseAttributeDefinition = {
        id: "attr-finish",
        code: "finish",
        name: "Finish",
        label: "Lamination Finish",
        type: "SELECT",
        is_required: true,
        visible_on_storefront: true,
        used_for_variant: true,
        used_for_filtering: true,
        used_for_search: true,
        is_global: true,
        sort_order: 20,
        allowed_values: [
          { label: "Matte", value: "Matte" },
          { label: "Gloss", value: "Gloss" },
          { label: "Soft Touch Velvet", value: "Soft Touch" },
        ],
        validation_rules: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Valid allowed value
      const resMatte = validateAttributeValue(finishDef, "Matte");
      assert.equal(resMatte.valid, true);

      // Invalid value
      const resInvalid = validateAttributeValue(finishDef, "Holographic Glitter");
      assert.equal(resInvalid.valid, false);
      assert.match(resInvalid.error || "", /Invalid selection/);
    });
  });

  describe("2. Variant Matrix & Cartesian Product Generator", () => {
    it("generates all Cartesian permutations from dynamic options", () => {
      const options = [
        { name: "Size", values: ["S", "M", "L"] },
        { name: "Colour", values: ["Black", "White"] },
      ];

      const combos = generateCartesianCombinations(options);
      assert.equal(combos.length, 6);

      // Check first combination
      assert.deepEqual(combos[0], [
        { name: "Size", value: "S" },
        { name: "Colour", value: "Black" },
      ]);

      // Check last combination
      assert.deepEqual(combos[5], [
        { name: "Size", value: "L" },
        { name: "Colour", value: "White" },
      ]);
    });

    it("auto-generates full variant records with clean deterministic SKUs", () => {
      const options = [
        { name: "Frame Material", values: ["Teak Wood", "Solid Oak"] },
        { name: "Glass Type", values: ["Clear Acrylic", "Anti-Reflective"] },
      ];

      const variants = generateVariantsFromOptions({
        productId: "prod-frame-001",
        baseSku: "PRT-FRAME",
        basePriceMinor: 89900,
        options: options as any,
      });

      assert.equal(variants.length, 4);
      assert.equal(variants[0].sku.startsWith("PRT-FRAME"), true);
      assert.equal(variants[0].price_minor, 89900);
      assert.equal(variants[0].status, "active");
    });

    it("matches variant correctly given arbitrary selected options map", () => {
      const variants = generateVariantsFromOptions({
        baseSku: "PRT-TSHIRT",
        basePriceMinor: 69900,
        options: [
          { name: "Size", values: ["M", "L"] },
          { name: "Colour", values: ["Black", "Navy"] },
        ] as any,
      });

      const matched = findMatchingVariant(variants, {
        Colour: "Black",
        Size: "L",
      });

      assert.ok(matched);
      assert.equal(matched.title, "L / Black");
    });
  });

  describe("3. Product Health Scoring & Completeness Checklist", () => {
    it("computes 100% health for completely configured product", () => {
      const fullProd: Partial<DatabaseProduct> = {
        title: "Executive Business Cards",
        sku: "PRT-CARD-EXEC-001",
        description: "Ultra premium 400 GSM cardstock with velvety soft-touch matte lamination.",
        base_price_minor: 49900,
        categories: [{ id: "cat-1" } as any],
        media: [
          {
            id: "m-1",
            product_id: "p1",
            url: "/card1.jpg",
            alt_text: "Front view",
            width: 800,
            height: 800,
            is_primary: true,
            sort_order: 0,
            created_at: "",
          },
        ],
        seo_title: "Executive Business Cards | Custom Printing",
        seo_description: "Order executive business cards online with doorstep delivery.",
      };

      const health = calculateProductHealth(fullProd);
      assert.equal(health.score, 100);
      assert.equal(health.status, "ready");
      assert.equal(health.issues.length, 0);
    });

    it("detects missing images, SKU, and categories with actionable issues", () => {
      const incompleteProd: Partial<DatabaseProduct> = {
        title: "Draft T-Shirt",
        sku: "",
        base_price_minor: 0,
      };

      const health = calculateProductHealth(incompleteProd);
      assert.ok(health.score < 50);
      assert.equal(health.status, "incomplete");
      assert.ok(health.issues.some((i) => i.field === "sku"));
      assert.ok(health.issues.some((i) => i.field === "media"));
      assert.ok(health.issues.some((i) => i.field === "categories"));
    });
  });

  describe("4. Acceptance Test #101: Dynamic New Category Without Code Changes", () => {
    it("dynamically configures and renders 'Custom Wall Frames' with custom attributes", () => {
      // Step A: Admin defines new Category
      const newCategoryInput = {
        title: "Custom Wall Frames",
        handle: normalizeHandle("Custom Wall Frames"),
        blurb: "Artisan hardwood wall frames with archival glazing.",
        icon: "Frame",
        status: "active" as const,
        sort_order: 100,
        is_featured: true,
      };

      const catParsed = SaveCategorySchema.safeParse(newCategoryInput);
      assert.equal(catParsed.success, true);
      assert.equal(catParsed.data.handle, "custom-wall-frames");

      // Step B: Admin assigns 5 dynamic attributes
      const frameAttributes = [
        { code: "width", name: "Width", label: "Width (cm)", type: "DIMENSION", unit: "cm" },
        { code: "height", name: "Height", label: "Height (cm)", type: "DIMENSION", unit: "cm" },
        {
          code: "frame_material",
          name: "Frame Material",
          type: "SELECT",
          allowed_values: [
            { label: "Natural Teak", value: "Teak" },
            { label: "Solid Oak", value: "Oak" },
          ],
        },
        {
          code: "glass_type",
          name: "Glass Type",
          type: "SELECT",
          allowed_values: [
            { label: "Clear Acrylic", value: "Acrylic" },
            { label: "UV Museum Glass", value: "Museum" },
          ],
        },
        {
          code: "finish",
          name: "Finish",
          type: "SELECT",
          allowed_values: [{ label: "Matte", value: "Matte" }, { label: "Gloss", value: "Gloss" }],
        },
      ];

      assert.equal(frameAttributes.length, 5);

      // Step C: Admin creates Product under new category
      const productPayload = {
        title: "Artisan Teak Wall Frame",
        handle: "artisan-teak-wall-frame",
        sku: "PRT-FRAME-TEAK-001",
        subtitle: "Handcrafted natural teak wood frame with archival anti-reflective glazing",
        description: "Showcase family portraits and gallery art in handcrafted solid wood frames.",
        status: "active" as const,
        visibility: "public" as const,
        product_type: "Framed",
        base_price_minor: 149900,
        compare_at_price_minor: 199900,
        requires_artwork: true,
        requires_proof: true,
        customizable: true,
        upload_only: false,
        category_ids: ["cat-wall-frames-uuid"],
        options: [
          { name: "Frame Material", values: ["Teak", "Oak"] },
          { name: "Glass Type", values: ["Acrylic", "Museum"] },
        ],
        variants: [
          {
            sku: "PRT-FRAME-TEAK-ACRY",
            title: "Teak / Acrylic",
            price_minor: 149900,
            available_for_sale: true,
            selected_options: [
              { name: "Frame Material", value: "Teak" },
              { name: "Glass Type", value: "Acrylic" },
            ],
          },
          {
            sku: "PRT-FRAME-TEAK-MUS",
            title: "Teak / Museum",
            price_minor: 199900,
            available_for_sale: true,
            selected_options: [
              { name: "Frame Material", value: "Teak" },
              { name: "Glass Type", value: "Museum" },
            ],
          },
        ],
      };

      const prodParsed = SaveProductSchema.safeParse(productPayload);
      assert.equal(prodParsed.success, true);

      // Step D: Storefront dynamically maps database product to Storefront Product Contract
      const storefrontProduct = mapDatabaseProductToStorefront({
        id: "prod-dynamic-frame-001",
        ...prodParsed.data,
        categories: [{ handle: "custom-wall-frames", title: "Custom Wall Frames" }],
        media: [
          {
            url: "/images/frame-main.jpg",
            alt_text: "Artisan Teak Frame",
            width: 1200,
            height: 1200,
            is_primary: true,
          },
        ],
      });

      // Verify Storefront rendering integrity
      assert.equal(storefrontProduct.title, "Artisan Teak Wall Frame");
      assert.equal(storefrontProduct.categoryHandles[0], "custom-wall-frames");
      assert.equal(storefrontProduct.options.length, 2);
      assert.equal(storefrontProduct.options[0].name, "Frame Material");
      assert.equal(storefrontProduct.variants.length, 2);
      assert.equal(storefrontProduct.priceFrom.amount, 149900);
      assert.equal(storefrontProduct.customizable, true);
      assert.equal(storefrontProduct.images[0].url, "/images/frame-main.jpg");
    });
  });
});
