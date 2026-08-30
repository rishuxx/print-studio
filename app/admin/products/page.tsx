import { requireAdminAuth } from "@/lib/supabase/admin-guard";
import { fetchAdminProducts } from "@/lib/catalogue/queries";
import { AdminProductsClientView } from "@/components/admin/products/admin-products-client-view";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Products & Catalogue · Admin Command Center",
};

interface AdminProductsPageProps {
  searchParams: Promise<{
    q?: string;
    status?: string;
    category?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function AdminProductsPage({ searchParams }: AdminProductsPageProps) {
  await requireAdminAuth("/admin/products");

  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page || "1", 10));

  const result = await fetchAdminProducts({
    q: params.q,
    status: (params.status || "ALL") as "draft" | "active" | "paused" | "archived" | "ALL",
    categoryHandle: params.category || "ALL",
    sort: (params.sort || "newest") as "newest" | "oldest" | "title_asc" | "title_desc" | "sort_order",
    page: currentPage,
    pageSize: 50,
  });

  return (
    <AdminProductsClientView
      products={result.products}
      totalCount={result.totalCount}
      currentPage={result.page}
      pageSize={result.pageSize}
      totalPages={result.totalPages}
      categories={result.categories}
      initialQuery={params.q || ""}
      initialStatus={params.status || "ALL"}
      initialCategory={params.category || "ALL"}
    />
  );
}
