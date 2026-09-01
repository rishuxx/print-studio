export type ProductStatus = "draft" | "active" | "paused" | "archived";
export type ProductVisibility =
  | "public"
  | "hidden"
  | "catalog_only"
  | "search_only"
  | "direct_link_only"
  | "scheduled";

export type CategoryStatus = "active" | "archived";

export type AttributeType =
  | "TEXT"
  | "TEXTAREA"
  | "NUMBER"
  | "DECIMAL"
  | "BOOLEAN"
  | "SELECT"
  | "MULTI_SELECT"
  | "COLOUR_SWATCH"
  | "IMAGE_SWATCH"
  | "RADIO"
  | "CHECKBOX"
  | "DATE"
  | "DATE_TIME"
  | "DIMENSION"
  | "WEIGHT"
  | "CURRENCY"
  | "FILE_UPLOAD"
  | "IMAGE_UPLOAD";

export interface AllowedValueItem {
  id?: string;
  label: string;
  value: string;
  hex?: string;
  imageUrl?: string;
  priceModifierMinor?: number; // Surcharge or adjustment in paise
  isDefault?: boolean;
}

export interface AttributeValidationRules {
  min?: number;
  max?: number;
  step?: number;
  minLength?: number;
  maxLength?: number;
  regex?: string;
  allowedFileTypes?: string[];
  maxFileSizeMb?: number;
}

export interface DatabaseAttributeDefinition {
  id: string;
  code: string;
  name: string;
  label: string;
  description?: string | null;
  type: AttributeType;
  unit?: string | null;
  is_required: boolean;
  visible_on_storefront: boolean;
  used_for_variant: boolean;
  used_for_filtering: boolean;
  used_for_search: boolean;
  is_global: boolean;
  sort_order: number;
  default_value?: unknown;
  allowed_values: AllowedValueItem[];
  validation_rules: AttributeValidationRules;
  created_at: string;
  updated_at: string;
}

export interface DatabaseCategoryAttributeTemplate {
  id: string;
  category_id: string;
  attribute_id: string;
  sort_order: number;
  is_required_override?: boolean | null;
  created_at: string;
  attribute?: DatabaseAttributeDefinition;
}

export interface DatabaseProductAttributeValue {
  id: string;
  product_id: string;
  attribute_id: string;
  variant_id?: string | null;
  value: unknown;
  created_at: string;
  updated_at: string;
  attribute?: DatabaseAttributeDefinition;
}

export interface DatabaseCategory {
  id: string;
  handle: string;
  title: string;
  blurb: string | null;
  icon: string;
  status: CategoryStatus;
  sort_order: number;
  is_featured: boolean;
  parent_id?: string | null;
  image_url?: string | null;
  banner_url?: string | null;
  is_nav?: boolean;
  metadata?: Record<string, unknown>;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
  product_count?: number;
  attribute_templates?: DatabaseCategoryAttributeTemplate[];
}

export interface DatabaseProductMedia {
  id: string;
  product_id: string;
  variant_id?: string | null;
  url: string;
  thumbnail_url?: string | null;
  storage_key?: string | null;
  alt_text: string;
  caption?: string | null;
  width: number;
  height: number;
  mime_type?: string;
  file_size?: number;
  is_primary: boolean;
  is_thumbnail?: boolean;
  is_gallery?: boolean;
  hide_from_storefront?: boolean;
  sort_order: number;
  created_at: string;
}

export interface DatabaseProductOption {
  id: string;
  product_id: string;
  name: string;
  values: string[];
  sort_order: number;
}

export interface DatabaseProductVariant {
  id: string;
  product_id: string;
  sku: string;
  title: string;
  barcode?: string | null;
  available_for_sale: boolean;
  selected_options: Array<{ name: string; value: string }>;
  price_factor: number;
  price_minor?: number | null;
  sale_price_minor?: number | null;
  cost_price_minor?: number | null;
  inventory_quantity: number;
  reserved_quantity?: number;
  track_inventory: boolean;
  allow_backorder: boolean;
  weight_grams?: number | null;
  dimensions_cm?: { width: number; height: number; length: number };
  status: "active" | "paused" | "archived";
  media_ids?: string[];
  metadata?: Record<string, unknown>;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface CustomizationFieldConfig {
  id: string;
  name: string;
  label: string;
  type: "text" | "textarea" | "dropdown" | "file" | "artwork_pdf" | "color" | "dimensions";
  required: boolean;
  placeholder?: string;
  options?: string[];
  allowedExtensions?: string[];
  maxFileSizeMb?: number;
  priceAdjustmentMinor?: number;
}

export interface DimensionPricingConfig {
  enabled: boolean;
  unit: "ft" | "inch" | "cm";
  ratePerSqUnitMinor: number;
  minArea?: number;
  maxArea?: number;
  defaultWidth?: number;
  defaultHeight?: number;
}

export interface CustomizationConfig {
  requiresArtworkUpload: boolean;
  allowedArtworkFormats?: string[];
  maxArtworkSizeMb?: number;
  requiresProofApproval: boolean;
  enableCanvasCustomizer: boolean;
  customFields?: CustomizationFieldConfig[];
  dimensionPricing?: DimensionPricingConfig;
}

export interface ShippingConfig {
  shippingClass?: string;
  weightGrams?: number;
  dimensionsCm?: { width: number; height: number; length: number };
  isFragile?: boolean;
  isOversized?: boolean;
  specialHandlingNotes?: string;
}

export interface MerchandisingConfig {
  featuredRank?: number;
  relatedProductHandles?: string[];
  upsellHandles?: string[];
  crossSellHandles?: string[];
  frequentlyBoughtTogether?: string[];
}

export interface DatabaseCatalogAuditLog {
  id: string;
  entity_type: "product" | "category" | "attribute" | "variant" | "price" | "media";
  entity_id: string;
  action:
    | "CREATE"
    | "UPDATE"
    | "DELETE"
    | "PUBLISH"
    | "PAUSE"
    | "ARCHIVE"
    | "PRICE_UPDATE"
    | "BULK_UPDATE"
    | "DUPLICATE";
  old_state?: Record<string, unknown> | null;
  new_state?: Record<string, unknown> | null;
  reason?: string | null;
  admin_id?: string | null;
  admin_email?: string | null;
  ip_address?: string | null;
  created_at: string;
}

export interface DatabaseProduct {
  id: string;
  handle: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  sku: string;
  status: ProductStatus;
  visibility: ProductVisibility;
  product_type: string;
  brand?: string;
  tags?: string[];
  badges?: string[];
  unit: string;
  min_order_qty: number;
  qty_increment: number;
  turnaround_days: number;
  is_featured: boolean;
  same_day_eligible: boolean;
  bulk_eligible: boolean;
  requires_artwork: boolean;
  requires_proof: boolean;
  customizable: boolean;
  upload_only: boolean;
  sort_order: number;
  version: number;
  base_price_minor?: number;
  compare_at_price_minor?: number | null;
  cost_price_minor?: number | null;
  sale_price_minor?: number | null;
  sale_starts_at?: string | null;
  sale_ends_at?: string | null;
  publish_at?: string | null;
  unpublish_at?: string | null;
  customization_config?: CustomizationConfig;
  shipping_config?: ShippingConfig;
  merchandising_config?: MerchandisingConfig;
  health_score?: number;
  seo_title: string | null;
  seo_description: string | null;
  canonical_url: string | null;
  og_title?: string | null;
  og_description?: string | null;
  og_image?: string | null;
  no_index?: boolean;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  archived_at: string | null;
  categories?: DatabaseCategory[];
  media?: DatabaseProductMedia[];
  options?: DatabaseProductOption[];
  variants?: DatabaseProductVariant[];
  attributes?: DatabaseProductAttributeValue[];
  audit_logs?: DatabaseCatalogAuditLog[];
}

export interface AdminProductListFilter {
  q?: string;
  status?: ProductStatus | "ALL";
  visibility?: ProductVisibility | "ALL";
  categoryHandle?: string | "ALL";
  isFeatured?: boolean | "ALL";
  productType?: string | "ALL";
  badge?: string | "ALL";
  sort?: "newest" | "oldest" | "title_asc" | "title_desc" | "sort_order" | "price_asc" | "price_desc";
  page?: number;
  pageSize?: number;
}

export interface AdminProductListResult {
  products: DatabaseProduct[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  categories: Array<{ id: string; handle: string; title: string }>;
  error?: string;
}

export interface ProductHealthIssue {
  field: string;
  level: "error" | "warning" | "info";
  message: string;
}

export interface ProductHealthReport {
  score: number;
  status: "ready" | "needs_attention" | "incomplete";
  issues: ProductHealthIssue[];
}
