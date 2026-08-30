import { requireAdminAuth } from "@/lib/supabase/admin-guard";
import { fetchAdminCategories } from "@/lib/catalogue/queries";
import { AdminCategoriesClientView } from "@/components/admin/categories/admin-categories-client-view";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Categories & Navigation Tree · Admin Command Center",
};

export default async function AdminCategoriesPage() {
  await requireAdminAuth("/admin/categories");
  const { categories } = await fetchAdminCategories();

  return <AdminCategoriesClientView categories={categories} />;
}
