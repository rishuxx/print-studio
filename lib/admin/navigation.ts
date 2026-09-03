import {
  LayoutDashboard,
  Package,
  Layers,
  IndianRupee,
  CreditCard,
  Users,
  Printer,
  FileText,
  ShieldAlert,
  Sliders,
  FolderTree,
  Truck,
  Bell,
  MessageSquare,
  RotateCcw,
  LucideIcon,
} from "lucide-react";
import type { Permission } from "@/lib/auth/permissions";

export interface AdminNavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  exact?: boolean;
  section?: string;
  disabled?: boolean;
  requiredPermission?: Permission;
}

export interface AdminNavSection {
  title: string;
  items: AdminNavItem[];
}

export const ADMIN_NAVIGATION: AdminNavSection[] = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
        exact: true,
        requiredPermission: "dashboard.view",
      },
    ],
  },
  {
    title: "Commerce & Operations",
    items: [
      {
        title: "Orders",
        href: "/admin/orders",
        icon: Package,
        requiredPermission: "orders.view",
      },
      {
        title: "Products",
        href: "/admin/products",
        icon: Layers,
        requiredPermission: "products.view",
      },
      {
        title: "Categories",
        href: "/admin/categories",
        icon: FolderTree,
        requiredPermission: "products.view",
      },
      {
        title: "Pricing Engine",
        href: "/admin/pricing",
        icon: IndianRupee,
        requiredPermission: "pricing.view",
      },
      {
        title: "Payments",
        href: "/admin/payments",
        icon: CreditCard,
        requiredPermission: "payments.view",
      },
      {
        title: "Customers",
        href: "/admin/customers",
        icon: Users,
        requiredPermission: "customers.view",
      },
      {
        title: "Shipments & Tracking",
        href: "/admin/shipping",
        icon: Truck,
        requiredPermission: "settings.view", // assuming settings.view for shipping
      },
      {
        title: "Returns & Resolutions",
        href: "/admin/resolutions",
        icon: RotateCcw,
        requiredPermission: "orders.view",
      },
    ],
  },
  {
    title: "Manufacturing & Content",
    items: [
      {
        title: "Production & Press Queue",
        href: "/admin/production",
        icon: Printer,
        requiredPermission: "orders.view",
      },
      {
        title: "Content & SEO",
        href: "/admin/content",
        icon: FileText,
        badge: "Phase 10I",
        requiredPermission: "dashboard.view",
      },
    ],
  },
  {
    title: "System & Governance",
    items: [
      {
        title: "Admin Users",
        href: "/admin/users",
        icon: Users,
        requiredPermission: "users.view",
      },
      {
        title: "Audit Log",
        href: "/admin/audit-log",
        icon: ShieldAlert,
        requiredPermission: "users.view", // only owner/admin
      },
      {
        title: "Notifications",
        href: "/admin/notifications",
        icon: Bell,
        requiredPermission: "settings.view",
      },
      {
        title: "WhatsApp Business",
        href: "/admin/whatsapp",
        icon: MessageSquare,
        requiredPermission: "settings.view",
      },
      {
        title: "Store Settings",
        href: "/admin/settings",
        icon: Sliders,
        requiredPermission: "settings.view",
      },
    ],
  },
];
