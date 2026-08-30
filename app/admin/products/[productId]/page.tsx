import { requireAdminAuth } from "@/lib/supabase/admin-guard";
import { fetchAdminProductById } from "@/lib/catalogue/queries";
import { AdminProductEditor } from "@/components/admin/products/admin-product-editor";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Edit Product · Admin Command Center",
};

interface AdminProductDetailPageProps {
  params: Promise<{
    productId: string;
  }>;
}

export default async function AdminProductDetailPage({ params }: AdminProductDetailPageProps) {
  await requireAdminAuth("/admin/products");

  const { productId } = await params;
  const { product, categories, error } = await fetchAdminProductById(productId);

  if (error || !product) {
    notFound();
  }

  return <AdminProductEditor initialProduct={product} categories={categories} />;
}
