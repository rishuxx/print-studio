export type ProductStatus = "draft" | "active" | "paused" | "archived";
export type ProductVisibility = "public" | "hidden";
export type CategoryStatus = "active" | "archived";

export interface DatabaseCategory {
  id: string;
  handle: string;
  title: string;
  blurb: string | null;
  icon: string;
  status: CategoryStatus;
  sort_order: number;
  is_featured: boolean;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
  product_count?: number;
}

export interface DatabaseProductMedia {
  id: string;
  product_id: string;
  url: string;
  alt_text: string;
  width: number;
  height: number;
  is_primary: boolean;
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
  available_for_sale: boolean;
  selected_options: Array<{ name: string; value: string }>;
  price_factor: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
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
  seo_title: string | null;
  seo_description: string | null;
  canonical_url: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  archived_at: string | null;
  categories?: DatabaseCategory[];
  media?: DatabaseProductMedia[];
  options?: DatabaseProductOption[];
  variants?: DatabaseProductVariant[];
}

export interface AdminProductListFilter {
  q?: string;
  status?: ProductStatus | "ALL";
  visibility?: ProductVisibility | "ALL";
  categoryHandle?: string | "ALL";
  isFeatured?: boolean | "ALL";
  sort?: "newest" | "oldest" | "title_asc" | "title_desc" | "sort_order";
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
