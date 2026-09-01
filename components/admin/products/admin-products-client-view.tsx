"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  Plus,
  CheckCircle2,
  AlertCircle,
  PauseCircle,
  Archive,
  Layers,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ExternalLink,
  Edit,
  Copy,
  Trash2,
  Image as ImageIcon,
  MoreVertical,
} from "lucide-react";
import type { DatabaseProduct, ProductStatus } from "@/lib/catalogue/types";
import {
  bulkProductOperationsAction,
  updateProductStatusAction,
  duplicateProductAction,
  deleteProductSafelyAction,
} from "@/lib/catalogue/mutations";
import { toast } from "sonner";
import { UploadCloud } from "lucide-react";

interface AdminProductsClientViewProps {
  products: DatabaseProduct[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  categories: Array<{ id: string; handle: string; title: string }>;
  initialQuery?: string;
  initialStatus?: string;
  initialCategory?: string;
}

export function AdminProductsClientView({
  products,
  totalCount,
  currentPage,
  pageSize = 20,
  totalPages,
  categories,
  initialQuery = "",
  initialStatus = "ALL",
  initialCategory = "ALL",
}: AdminProductsClientViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = React.useState(initialQuery);
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [isBulkPending, setIsBulkPending] = React.useState(false);
  const [isImporting, setIsImporting] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const updateParams = React.useCallback(
    (newParams: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(newParams).forEach(([key, val]) => {
        if (val === undefined || val === "ALL" || val === "") {
          params.delete(key);
        } else {
          params.set(key, val);
        }
      });
      router.push(`/admin/products?${params.toString()}`);
    },
    [router, searchParams]
  );

  // Debounced search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== initialQuery) {
        updateParams({ q: searchTerm || undefined, page: "1" });
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm, initialQuery, updateParams]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(products.map((p) => p.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleBulkAction = async (operation: "publish" | "pause" | "archive" | "delete") => {
    if (selectedIds.size === 0) return;
    if (operation === "delete" && !confirm(`Are you sure you want to delete ${selectedIds.size} products?`)) {
      return;
    }

    setIsBulkPending(true);
    const res = await bulkProductOperationsAction(Array.from(selectedIds), operation);
    setIsBulkPending(false);

    if (res.success) {
      setSelectedIds(new Set());
      toast.success(`Successfully processed ${res.count} products.`);
      router.refresh();
    } else {
      toast.error(res.error || "Bulk action failed");
    }
  };

  const handleQuickStatus = async (productId: string, newStatus: ProductStatus) => {
    const res = await updateProductStatusAction(productId, newStatus);
    if (res.success) {
      toast.success(`Product status updated to ${newStatus}`);
      router.refresh();
    } else {
      toast.error(res.error || "Status update failed");
    }
  };

  const handleDuplicate = async (productId: string) => {
    const res = await duplicateProductAction(productId);
    if (res.success && res.newProductId) {
      toast.success("Product cloned successfully!");
      router.push(`/admin/products/${res.newProductId}`);
    } else {
      toast.error(res.error || "Failed to clone product");
    }
  };

  const handleDelete = async (productId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    const res = await deleteProductSafelyAction(productId);
    if (res.success) {
      toast.success(`Product ${res.actionTaken === "archived" ? "archived (has order history)" : "deleted"}`);
      router.refresh();
    } else {
      toast.error(res.error || "Failed to delete product");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const toastId = toast.loading("Uploading and processing Excel rate card...");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/products/import", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to import");

      toast.success(
        `Import Complete! Created: ${data.report.created}, Updated: ${data.report.updated}`,
        { id: toastId }
      );
      router.refresh();
    } catch (err: any) {
      toast.error(err.message, { id: toastId });
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-black tracking-tight text-ink sm:text-3xl">
            Products & Catalogue
          </h1>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Manage your entire catalog, variants, pricing, and live storefront publishing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/categories"
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-white px-3.5 py-2 text-xs font-bold text-ink shadow-xs hover:bg-paper transition-colors"
          >
            <Layers className="size-3.5" />
            <span>Category Taxonomy</span>
          </Link>

          <input
            type="file"
            accept=".xlsx, .xls, .csv"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileUpload}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isImporting}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-white px-3.5 py-2 text-xs font-bold text-ink shadow-xs hover:bg-paper transition-colors disabled:opacity-50"
          >
            <UploadCloud className="size-3.5" />
            <span>{isImporting ? "Importing..." : "Import Excel"}</span>
          </button>

          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-1.5 rounded-xl bg-violet px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-violet-lift transition-colors"
          >
            <Plus className="size-4" />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-white p-4 shadow-sheet sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title, SKU, or handle..."
            className="w-full rounded-xl border border-border bg-paper/50 pl-9 pr-4 py-2 text-xs text-ink focus:border-violet focus:bg-white focus:outline-none transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            value={initialStatus}
            onChange={(e) => updateParams({ status: e.target.value, page: "1" })}
            className="rounded-xl border border-border bg-paper/50 px-3 py-2 text-xs font-semibold text-ink focus:border-violet focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="paused">Paused</option>
            <option value="archived">Archived</option>
          </select>

          {/* Category Filter */}
          <select
            value={initialCategory}
            onChange={(e) => updateParams({ category: e.target.value, page: "1" })}
            className="rounded-xl border border-border bg-paper/50 px-3 py-2 text-xs font-semibold text-ink focus:border-violet focus:outline-none max-w-xs"
          >
            <option value="ALL">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.handle}>
                {c.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bulk Operations Bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center justify-between rounded-xl bg-violet-wash border border-violet/20 px-4 py-2.5 shadow-xs">
          <span className="font-bold text-xs text-violet">
            {selectedIds.size} product{selectedIds.size > 1 ? "s" : ""} selected
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBulkAction("publish")}
              disabled={isBulkPending}
              className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              Publish
            </button>
            <button
              onClick={() => handleBulkAction("pause")}
              disabled={isBulkPending}
              className="rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-amber-700 disabled:opacity-50"
            >
              Pause
            </button>
            <button
              onClick={() => handleBulkAction("archive")}
              disabled={isBulkPending}
              className="rounded-lg bg-slate-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-800 disabled:opacity-50"
            >
              Archive
            </button>
            <button
              onClick={() => handleBulkAction("delete")}
              disabled={isBulkPending}
              className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-700 disabled:opacity-50"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="rounded-2xl border border-border bg-white shadow-sheet overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-paper text-muted-foreground font-mono uppercase tracking-wider">
              <tr>
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.size === products.length && products.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="size-4 rounded border-border text-violet focus:ring-violet"
                  />
                </th>
                <th className="px-3 py-3">Product</th>
                <th className="px-3 py-3">Master SKU</th>
                <th className="px-3 py-3">Category</th>
                <th className="px-3 py-3">Price</th>
                <th className="px-3 py-3">Variants</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-xs text-muted-foreground">
                    No products matching your search criteria.
                  </td>
                </tr>
              ) : (
                products.map((p) => {
                  const isSelected = selectedIds.has(p.id);
                  const primaryImg = p.media?.find((m) => m.is_primary) || p.media?.[0];

                  return (
                    <tr
                      key={p.id}
                      className={`hover:bg-paper/40 transition-colors ${
                        isSelected ? "bg-violet-wash/30" : ""
                      }`}
                    >
                      <td className="px-4 py-3.5">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(p.id)}
                          className="size-4 rounded border-border text-violet focus:ring-violet"
                        />
                      </td>

                      <td className="px-3 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-paper border border-border overflow-hidden">
                            {primaryImg ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={primaryImg.url}
                                alt={p.title}
                                className="size-full object-cover"
                              />
                            ) : (
                              <ImageIcon className="size-4 text-muted-foreground opacity-40" />
                            )}
                          </div>

                          <div>
                            <Link
                              href={`/admin/products/${p.id}`}
                              className="font-bold text-ink hover:text-violet transition-colors line-clamp-1"
                            >
                              {p.title}
                            </Link>
                            <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
                              <span>/product/{p.handle}</span>
                              {p.is_featured && (
                                <span className="text-violet font-bold bg-violet-wash px-1 rounded">
                                  Featured
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-3 py-3.5 font-mono text-[11px] font-semibold text-ink">
                        {p.sku}
                      </td>

                      <td className="px-3 py-3.5">
                        <div className="flex flex-wrap gap-1 max-w-[140px]">
                          {p.categories && p.categories.length > 0 ? (
                            p.categories.map((c) => (
                              <span
                                key={c.id}
                                className="rounded bg-paper px-1.5 py-0.5 text-[10px] font-semibold text-ink border border-border"
                              >
                                {c.title}
                              </span>
                            ))
                          ) : (
                            <span className="text-muted-foreground text-[10px]">Unassigned</span>
                          )}
                        </div>
                      </td>

                      <td className="px-3 py-3.5 font-mono text-[11px]">
                        <div className="font-bold text-ink">
                          ₹{((p.base_price_minor || 19900) / 100).toFixed(2)}
                        </div>
                        {p.sale_price_minor && (
                          <div className="text-[10px] text-emerald-600 font-semibold">
                            Sale: ₹{(p.sale_price_minor / 100).toFixed(2)}
                          </div>
                        )}
                      </td>

                      <td className="px-3 py-3.5">
                        <span className="inline-flex rounded-full bg-paper px-2 py-0.5 font-mono text-[10px] font-bold text-ink border border-border">
                          {p.variants?.length || 0} Variants
                        </span>
                      </td>

                      <td className="px-3 py-3.5">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            p.status === "active"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : p.status === "paused"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-paper-deep text-muted-foreground border border-border"
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/admin/products/${p.id}`}
                            className="rounded-lg p-1.5 text-muted-foreground hover:bg-paper hover:text-ink transition-colors"
                            title="Edit"
                          >
                            <Edit className="size-3.5" />
                          </Link>

                          <button
                            onClick={() => handleDuplicate(p.id)}
                            className="rounded-lg p-1.5 text-muted-foreground hover:bg-paper hover:text-ink transition-colors"
                            title="Duplicate"
                          >
                            <Copy className="size-3.5" />
                          </button>

                          <Link
                            href={`/product/${p.handle}`}
                            target="_blank"
                            className="rounded-lg p-1.5 text-muted-foreground hover:bg-paper hover:text-ink transition-colors"
                            title="Storefront Preview"
                          >
                            <ExternalLink className="size-3.5" />
                          </Link>

                          <button
                            onClick={() => handleDelete(p.id, p.title)}
                            className="rounded-lg p-1.5 text-muted-foreground hover:bg-red-50 hover:text-red-700 transition-colors"
                            title="Delete / Archive"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border bg-paper/40 px-5 py-3 text-xs">
            <span className="text-muted-foreground">
              Showing {(currentPage - 1) * pageSize + 1} to{" "}
              {Math.min(currentPage * pageSize, totalCount)} of {totalCount} products
            </span>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => updateParams({ page: String(currentPage - 1) })}
                disabled={currentPage <= 1}
                className="flex size-8 items-center justify-center rounded-lg border border-border bg-white text-muted-foreground hover:bg-paper disabled:opacity-40"
              >
                <ChevronLeft className="size-4" />
              </button>
              <span className="font-mono text-xs font-bold text-ink px-2">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => updateParams({ page: String(currentPage + 1) })}
                disabled={currentPage >= totalPages}
                className="flex size-8 items-center justify-center rounded-lg border border-border bg-white text-muted-foreground hover:bg-paper disabled:opacity-40"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
