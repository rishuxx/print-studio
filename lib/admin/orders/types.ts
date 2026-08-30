export type OrderSortOption = "newest" | "oldest" | "highest_value" | "lowest_value" | "recently_updated";

export type PaymentStatusFilter = "ALL" | "paid" | "pending" | "failed" | "refunded" | "unpaid";

export type DateRangePreset =
  | "ALL"
  | "today"
  | "yesterday"
  | "last_7_days"
  | "last_30_days"
  | "this_month"
  | "last_month"
  | "this_year"
  | "custom";

export interface AdminOrdersFilterParams {
  q?: string;
  status?: string;
  paymentStatus?: PaymentStatusFilter;
  dateRange?: DateRangePreset;
  from?: string; // YYYY-MM-DD
  to?: string;   // YYYY-MM-DD
  sort?: OrderSortOption;
  page?: number;
  pageSize?: number;
}

export interface BulkOperationResultItem {
  orderId: string;
  orderNumber: string;
  success: boolean;
  error?: string;
  newStatus?: string;
}

export interface BulkOperationResponse {
  totalRequested: number;
  successCount: number;
  failedCount: number;
  results: BulkOperationResultItem[];
}
