import type {
  DatabaseAttributeDefinition,
  AllowedValueItem,
  AttributeType,
} from "./types";

/**
 * Default standard attribute definitions for print e-commerce catalog
 */
export const DEFAULT_STANDARD_ATTRIBUTES: Array<
  Omit<DatabaseAttributeDefinition, "id" | "created_at" | "updated_at">
> = [
  {
    code: "paper_gsm",
    name: "Paper GSM",
    label: "Paper Thickness (GSM)",
    description: "Standard paper weight and density for cards, flyers, and stationery",
    type: "SELECT",
    unit: "GSM",
    is_required: true,
    visible_on_storefront: true,
    used_for_variant: true,
    used_for_filtering: true,
    used_for_search: true,
    is_global: true,
    sort_order: 10,
    allowed_values: [
      { label: "300 GSM Premium Card", value: "300 GSM" },
      { label: "350 GSM Heavy Art Card", value: "350 GSM" },
      { label: "400 GSM Ultra Velvet", value: "400 GSM" },
      { label: "450 GSM Textured Matte", value: "450 GSM" },
    ],
    validation_rules: {},
  },
  {
    code: "finish",
    name: "Finish",
    label: "Lamination / Protective Finish",
    description: "Protective laminate texture applied over printed sheets",
    type: "SELECT",
    is_required: true,
    visible_on_storefront: true,
    used_for_variant: true,
    used_for_filtering: true,
    used_for_search: true,
    is_global: true,
    sort_order: 20,
    allowed_values: [
      { label: "Matte Lamination", value: "Matte" },
      { label: "Gloss Lamination", value: "Gloss" },
      { label: "Velvet Soft-Touch", value: "Soft-Touch" },
      { label: "Anti-Scratch Matte", value: "Anti-Scratch" },
    ],
    validation_rules: {},
  },
  {
    code: "corner_style",
    name: "Corner Style",
    label: "Die-Cut Corners",
    description: "Corner finishing style",
    type: "SELECT",
    is_required: false,
    visible_on_storefront: true,
    used_for_variant: true,
    used_for_filtering: false,
    used_for_search: false,
    is_global: true,
    sort_order: 30,
    allowed_values: [
      { label: "Standard Square Corners", value: "Standard Square" },
      { label: "Rounded Corners (3mm Radius)", value: "Rounded Corners" },
    ],
    validation_rules: {},
  },
  {
    code: "foil_enhancement",
    name: "Metallic Foil Accent",
    label: "Hot Foil Stamping",
    description: "Raised metallic foil finish",
    type: "COLOUR_SWATCH",
    is_required: false,
    visible_on_storefront: true,
    used_for_variant: true,
    used_for_filtering: true,
    used_for_search: true,
    is_global: true,
    sort_order: 40,
    allowed_values: [
      { label: "None", value: "None", hex: "#E5E7EB" },
      { label: "Gold Foil", value: "Gold", hex: "#D4AF37" },
      { label: "Silver Foil", value: "Silver", hex: "#C0C0C0" },
      { label: "Rose Gold Foil", value: "Rose Gold", hex: "#B76E79" },
      { label: "Copper Foil", value: "Copper", hex: "#B87333" },
      { label: "Holographic Foil", value: "Holographic", hex: "#A855F7" },
    ],
    validation_rules: {},
  },
  {
    code: "spot_uv",
    name: "Spot UV Varnish",
    label: "Raised Spot Gloss",
    description: "Gloss highlights on logos and headlines",
    type: "BOOLEAN",
    is_required: false,
    visible_on_storefront: true,
    used_for_variant: true,
    used_for_filtering: false,
    used_for_search: false,
    is_global: true,
    sort_order: 50,
    allowed_values: [
      { label: "No Spot UV", value: "false" },
      { label: "Single Sided Spot UV", value: "true" },
    ],
    validation_rules: {},
  },
  {
    code: "apparel_size",
    name: "Size",
    label: "Garment Size",
    description: "Apparel sizing for t-shirts and hoodies",
    type: "SELECT",
    is_required: true,
    visible_on_storefront: true,
    used_for_variant: true,
    used_for_filtering: true,
    used_for_search: false,
    is_global: true,
    sort_order: 60,
    allowed_values: [
      { label: "XS (34\")", value: "XS" },
      { label: "S (36\")", value: "S" },
      { label: "M (38\")", value: "M" },
      { label: "L (40\")", value: "L" },
      { label: "XL (42\")", value: "XL" },
      { label: "2XL (44\")", value: "2XL" },
      { label: "3XL (46\")", value: "3XL" },
    ],
    validation_rules: {},
  },
  {
    code: "garment_color",
    name: "Fabric Colour",
    label: "Apparel Fabric Colour",
    description: "Fabric dye colors for textiles",
    type: "COLOUR_SWATCH",
    is_required: true,
    visible_on_storefront: true,
    used_for_variant: true,
    used_for_filtering: true,
    used_for_search: true,
    is_global: true,
    sort_order: 70,
    allowed_values: [
      { label: "Jet Black", value: "Black", hex: "#111111" },
      { label: "Pure White", value: "White", hex: "#FFFFFF" },
      { label: "Navy Blue", value: "Navy", hex: "#001F3F" },
      { label: "Heather Grey", value: "Heather Grey", hex: "#888888" },
      { label: "Forest Green", value: "Forest Green", hex: "#1B4D3E" },
      { label: "Maroon Red", value: "Maroon", hex: "#800000" },
    ],
    validation_rules: {},
  },
  {
    code: "frame_material",
    name: "Frame Material",
    label: "Wall Frame Material",
    description: "Moulding material for photo frames",
    type: "SELECT",
    is_required: true,
    visible_on_storefront: true,
    used_for_variant: true,
    used_for_filtering: true,
    used_for_search: true,
    is_global: true,
    sort_order: 80,
    allowed_values: [
      { label: "Natural Teak Wood", value: "Teak Wood" },
      { label: "Solid Oak", value: "Solid Oak" },
      { label: "Matte Black Synthetic Moulding", value: "Black Synthetic" },
      { label: "Brushed Gold Aluminium", value: "Gold Aluminium" },
    ],
    validation_rules: {},
  },
  {
    code: "glass_type",
    name: "Glass Type",
    label: "Frame Glazing Type",
    description: "Protective glazing over print artwork",
    type: "SELECT",
    is_required: true,
    visible_on_storefront: true,
    used_for_variant: true,
    used_for_filtering: false,
    used_for_search: false,
    is_global: true,
    sort_order: 90,
    allowed_values: [
      { label: "2mm Clear Float Glass", value: "Clear Glass" },
      { label: "Anti-Reflective Museum Acrylic", value: "Museum Acrylic" },
      { label: "Shatter-Resistant Polycarbonate", value: "Polycarbonate" },
    ],
    validation_rules: {},
  },
];

/**
 * Validate a specific attribute value against an attribute definition
 */
export function validateAttributeValue(
  def: DatabaseAttributeDefinition,
  value: unknown
): { valid: boolean; error?: string } {
  if (def.is_required && (value === undefined || value === null || value === "")) {
    return { valid: false, error: `${def.name} is required.` };
  }

  if (value === undefined || value === null || value === "") {
    return { valid: true };
  }

  switch (def.type) {
    case "NUMBER":
    case "DECIMAL":
    case "DIMENSION":
    case "WEIGHT":
    case "CURRENCY": {
      const num = Number(value);
      if (isNaN(num)) {
        return { valid: false, error: `${def.name} must be a valid number.` };
      }
      const rules = def.validation_rules || {};
      if (rules.min !== undefined && num < rules.min) {
        return { valid: false, error: `${def.name} must be at least ${rules.min} ${def.unit || ""}.`.trim() };
      }
      if (rules.max !== undefined && num > rules.max) {
        return { valid: false, error: `${def.name} cannot exceed ${rules.max} ${def.unit || ""}.`.trim() };
      }
      break;
    }

    case "SELECT":
    case "COLOUR_SWATCH":
    case "IMAGE_SWATCH":
    case "RADIO": {
      if (def.allowed_values && def.allowed_values.length > 0) {
        const strVal = String(value);
        const match = def.allowed_values.some((opt) => opt.value === strVal || opt.label === strVal);
        if (!match) {
          return { valid: false, error: `Invalid selection for ${def.name}.` };
        }
      }
      break;
    }

    case "MULTI_SELECT":
    case "CHECKBOX": {
      if (Array.isArray(value) && def.allowed_values && def.allowed_values.length > 0) {
        const validValues = new Set(def.allowed_values.map((opt) => opt.value));
        const allMatch = value.every((v) => validValues.has(String(v)));
        if (!allMatch) {
          return { valid: false, error: `Invalid option selected for ${def.name}.` };
        }
      }
      break;
    }

    case "TEXT":
    case "TEXTAREA": {
      const str = String(value);
      const rules = def.validation_rules || {};
      if (rules.minLength !== undefined && str.length < rules.minLength) {
        return { valid: false, error: `${def.name} must be at least ${rules.minLength} characters.` };
      }
      if (rules.maxLength !== undefined && str.length > rules.maxLength) {
        return { valid: false, error: `${def.name} cannot exceed ${rules.maxLength} characters.` };
      }
      if (rules.regex) {
        try {
          const re = new RegExp(rules.regex);
          if (!re.test(str)) {
            return { valid: false, error: `${def.name} format is invalid.` };
          }
        } catch {
          // ignore bad regex pattern in config
        }
      }
      break;
    }
  }

  return { valid: true };
}
