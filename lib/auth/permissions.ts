import { UserRole } from "@/lib/supabase/database.types";

export type Permission = 
  | "dashboard.view"
  | "orders.view"
  | "orders.manage"
  | "payments.view"
  | "payments.refund"
  | "products.view"
  | "products.manage"
  | "pricing.view"
  | "pricing.manage"
  | "customers.view"
  | "settings.view"
  | "users.view"
  | "users.manage";

export const AVAILABLE_PERMISSIONS: { id: Permission; label: string; description: string }[] = [
  { id: "dashboard.view", label: "View Dashboard", description: "Access the main overview and metrics" },
  { id: "orders.view", label: "View Orders", description: "See all orders and statuses" },
  { id: "orders.manage", label: "Manage Orders", description: "Update order status and handle processing" },
  { id: "payments.view", label: "View Payments", description: "See payment transactions" },
  { id: "payments.refund", label: "Refund Payments", description: "Process customer refunds" },
  { id: "products.view", label: "View Products", description: "See catalogue items" },
  { id: "products.manage", label: "Manage Products", description: "Create, edit, and archive products/categories" },
  { id: "pricing.view", label: "View Pricing", description: "See price formulas and sheets" },
  { id: "pricing.manage", label: "Manage Pricing", description: "Update base prices, markup, and logic" },
  { id: "customers.view", label: "View Customers", description: "See customer profiles and history" },
  { id: "settings.view", label: "Manage Store Settings", description: "Update business info and general configurations" },
  { id: "users.view", label: "View Staff", description: "See admin users" },
  { id: "users.manage", label: "Manage Staff", description: "Update staff roles, permissions, and status" },
];
