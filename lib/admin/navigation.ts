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
  LucideIcon,
} from "lucide-react";

export interface AdminNavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  exact?: boolean;
  section?: string;
  disabled?: boolean;
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
      },
      {
        title: "Products",
        href: "/admin/products",
        icon: Layers,
      },
      {
        title: "Categories",
        href: "/admin/categories",
        icon: FolderTree,
      },
      {
        title: "Pricing Engine",
        href: "/admin/pricing",
        icon: IndianRupee,
      },
      {
        title: "Payments",
        href: "/admin/payments",
        icon: CreditCard,
      },
      {
        title: "Customers",
        href: "/admin/customers",
        icon: Users,
      },
    ],
  },
  {
    title: "Manufacturing & Content",
    items: [
      {
        title: "Artwork & Production",
        href: "/admin/production",
        icon: Printer,
        badge: "Phase 10H",
      },
      {
        title: "Content & SEO",
        href: "/admin/content",
        icon: FileText,
        badge: "Phase 10I",
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
        badge: "Phase 10J",
      },
      {
        title: "Audit Log",
        href: "/admin/audit-log",
        icon: ShieldAlert,
        badge: "Phase 10K",
      },
      {
        title: "Store Settings",
        href: "/admin/settings",
        icon: Sliders,
      },
    ],
  },
];
