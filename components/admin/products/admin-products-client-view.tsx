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
} from "lucide-react";
import type { DatabaseProduct, ProductStatus } from "@/lib/catalogue/types";
import { bulkUpdateProductStatusAction } from "@/lib/catalogue/mutations";

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
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

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

  // Debounced search query update
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

  const handleBulkAction = async (status: ProductStatus) => {
    if (selectedIds.size === 0) return;
    setIsBulkPending(true);
    const res = await bulkUpdateProductStatusAction(Array.from(selectedIds), status);
    setIsBulkPending(false);
    if (res.success) {
      setSelectedIds(new Set());
      setToastMessage(`Successfully updated ${res.updatedCount} products to ${status}`);
      setTimeout(() => setToastMessage(null), 4000);
    } else {
      alert(res.error || "Bulk action failed");
    }
  };

  const getStatusBadge = (status: ProductStatus) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="size-3 text-emerald-600" />
            Active
          </span>
        );
      case "draft":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300">
            <AlertCircle className="size-3 text-slate-500" />
            Draft
          </span>
        );
      case "paused":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <PauseCircle className="size-3 text-amber-600" />
            Paused
          </span>
        );
      case "archived":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <Archive className="size-3 text-rose-600" />
            Archived
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-extrabold text-ink tracking-tight">
            Products & Catalogue
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage your printing catalogue, technical specifications, variants, and SEO.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/categories"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-3.5 py-2 text-xs font-bold text-ink hover:bg-paper transition-all shadow-xs"
          >
            <Layers className="size-3.5 text-violet" />
            <span>Manage Categories</span>
          </Link>

          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 rounded-xl bg-violet px-4 py-2 text-xs font-bold text-white hover:bg-violet/90 transition-all shadow-sm"
          >
            <Plus className="size-4" />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 animate-in fade-in">
          {toastMessage}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-border p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products by title, SKU, or slug..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-border bg-paper/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-violet/20"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter */}
            <select
              value={initialStatus}
              onChange={(e) => updateParams({ status: e.target.value, page: "1" })}
              className="px-3 py-2 text-xs rounded-xl border border-border bg-white text-ink font-semibold focus:outline-hidden focus:ring-2 focus:ring-violet/20"
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
              className="px-3 py-2 text-xs rounded-xl border border-border bg-white text-ink font-semibold focus:outline-hidden focus:ring-2 focus:ring-violet/20 max-w-44"
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

        {/* Bulk Action Strip */}
        {selectedIds.size > 0 && (
          <div className="flex items-center justify-between p-3 bg-violet/5 border border-violet/20 rounded-xl text-xs">
            <span className="font-bold text-ink">
              {selectedIds.size} product{selectedIds.size > 1 ? "s" : ""} selected
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={isBulkPending}
                onClick={() => handleBulkAction("active")}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-all"
              >
                Publish Selected
              </button>
              <button
                type="button"
                disabled={isBulkPending}
                onClick={() => handleBulkAction("paused")}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition-all"
              >
                Pause Selected
              </button>
              <button
                type="button"
                disabled={isBulkPending}
                onClick={() => handleBulkAction("archived")}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg transition-all"
              >
                Archive Selected
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-2xl border border-border shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border bg-paper/60 font-mono text-[0.6875rem] font-bold text-muted-foreground uppercase">
                <th className="p-4 w-10">
                  <input
                    type="checkbox"
                    checked={products.length > 0 && selectedIds.size === products.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-border size-3.5"
                  />
                </th>
                <th className="p-4">Product</th>
                <th className="p-4">SKU</th>
                <th className="p-4">Category</th>
                <th className="p-4">Status</th>
                <th className="p-4">Min Qty</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-muted-foreground">
                    <div className="max-w-xs mx-auto space-y-2">
                      <p className="font-bold text-ink">No products found</p>
                      <p className="text-xs">
                        Try adjusting your search criteria, clear filters, or add a new product.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="hover:bg-paper/40 transition-colors">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(p.id)}
                        onChange={() => toggleSelect(p.id)}
                        className="rounded border-border size-3.5"
                      />
                    </td>
                    <td className="p-4">
                      <div className="space-y-0.5">
                        <Link
                          href={`/admin/products/${p.id}`}
                          className="font-bold text-ink hover:text-violet transition-colors flex items-center gap-1.5"
                        >
                          <span>{p.title}</span>
                          {p.is_featured && (
                            <span title="Featured Product">
                              <Sparkles className="size-3 text-amber-500 fill-amber-400" />
                            </span>
                          )}
                        </Link>
                        <p className="text-[0.6875rem] text-muted-foreground font-mono">
                          /{p.handle}
                        </p>
                      </div>
                    </td>
                    <td className="p-4 font-mono font-bold text-slate-700">{p.sku}</td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {p.categories && p.categories.length > 0 ? (
                          p.categories.map((c) => (
                            <span
                              key={c.id}
                              className="px-2 py-0.5 rounded bg-paper border border-border text-[0.6875rem] text-muted-foreground"
                            >
                              {c.title}
                            </span>
                          ))
                        ) : (
                          <span className="text-muted-foreground/60 italic text-[0.6875rem]">
                            Uncategorized
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">{getStatusBadge(p.status)}</td>
                    <td className="p-4 font-mono">
                      {p.min_order_qty} {p.unit}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/product/${p.handle}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-ink hover:bg-paper"
                          title="View on storefront"
                        >
                          <ExternalLink className="size-3.5" />
                        </Link>
                        <Link
                          href={`/admin/products/${p.id}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border bg-white text-ink hover:border-violet hover:text-violet font-bold text-xs transition-all shadow-2xs"
                        >
                          <Edit className="size-3" />
                          <span>Edit</span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
            <div>
              Showing {products.length} of {totalCount} total products
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => updateParams({ page: String(currentPage - 1) })}
                className="p-2 rounded-lg border border-border hover:bg-paper disabled:opacity-40"
              >
                <ChevronLeft className="size-4" />
              </button>
              <span className="font-mono font-bold text-ink">
                {currentPage} / {totalPages}
              </span>
              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => updateParams({ page: String(currentPage + 1) })}
                className="p-2 rounded-lg border border-border hover:bg-paper disabled:opacity-40"
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
