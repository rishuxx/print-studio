import { requireAdminAuth } from "@/lib/supabase/admin-guard";
import { fetchAdminCategories } from "@/lib/catalogue/queries";
import { AdminCategoriesClientView } from "@/components/admin/categories/admin-categories-client-view";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Categories & Navigation Tree · Admin Command Center",
};

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams?: Promise<{ reset?: string }>;
}) {
  await requireAdminAuth("/admin/categories");
  const params = searchParams ? await searchParams : {};
  
  // If reset=true is in URL or we detect corrupt/test categories, clean them out
  const { categories: staticCategories } = await import("@/lib/data/categories");
  const officialHandles = new Set(staticCategories.map((c) => c.handle));
  
  let categories = await fetchAdminCategories();
  const hasDirtyCategories = categories.some((c) => !officialHandles.has(c.handle) || c.image_url !== null);
  
  if (params?.reset === "true" || hasDirtyCategories) {
    const { resetCategoriesToDefaultAction } = await import("@/lib/catalogue/mutations");
    await resetCategoriesToDefaultAction();
    categories = await fetchAdminCategories();
  }

  return <AdminCategoriesClientView categories={categories} />;
}
