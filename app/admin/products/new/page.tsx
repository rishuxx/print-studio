import { requireAdminAuth } from "@/lib/supabase/admin-guard";
import { fetchAdminCategories } from "@/lib/catalogue/queries";
import { AdminProductEditor } from "@/components/admin/products/admin-product-editor";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Create Product · Admin Command Center",
};

export default async function AdminNewProductPage() {
  await requireAdminAuth("/admin/products");

  const { categories } = await fetchAdminCategories();

  return <AdminProductEditor initialProduct={null} categories={categories} />;
}
