"use client";

import * as React from "react";
import { Plus, Edit, Archive, Folder, CheckCircle2, AlertTriangle } from "lucide-react";
import type { DatabaseCategory } from "@/lib/catalogue/types";
import { saveCategoryAction, updateCategoryStatusAction } from "@/lib/catalogue/mutations";
import { normalizeHandle } from "@/lib/catalogue/validation";

interface AdminCategoriesClientViewProps {
  categories: DatabaseCategory[];
}

export function AdminCategoriesClientView({ categories: initialCategories }: AdminCategoriesClientViewProps) {
  const [categories, setCategories] = React.useState(initialCategories);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState<DatabaseCategory | null>(null);

  // Form State
  const [title, setTitle] = React.useState("");
  const [handle, setHandle] = React.useState("");
  const [blurb, setBlurb] = React.useState("");
  const [icon, setIcon] = React.useState("Folder");
  const [isFeatured, setIsFeatured] = React.useState(false);
  const [sortOrder, setSortOrder] = React.useState(0);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const openCreateModal = () => {
    setEditingCategory(null);
    setTitle("");
    setHandle("");
    setBlurb("");
    setIcon("Folder");
    setIsFeatured(false);
    setSortOrder(categories.length * 10);
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const openEditModal = (cat: DatabaseCategory) => {
    setEditingCategory(cat);
    setTitle(cat.title);
    setHandle(cat.handle);
    setBlurb(cat.blurb || "");
    setIcon(cat.icon || "Folder");
    setIsFeatured(cat.is_featured);
    setSortOrder(cat.sort_order);
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingCategory && (!handle || handle === normalizeHandle(title))) {
      setHandle(normalizeHandle(val));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    const res = await saveCategoryAction({
      id: editingCategory?.id,
      title: title.trim(),
      handle: normalizeHandle(handle),
      blurb: blurb.trim() || null,
      icon,
      status: editingCategory?.status || "active",
      sort_order: Number(sortOrder),
      is_featured: isFeatured,
    });

    setIsSubmitting(false);

    if (res.success) {
      setIsModalOpen(false);
      window.location.reload();
    } else {
      setErrorMsg(res.error || "Failed to save category");
    }
  };

  const handleToggleArchive = async (cat: DatabaseCategory) => {
    const nextStatus = cat.status === "active" ? "archived" : "active";
    if (
      nextStatus === "archived" &&
      cat.product_count &&
      cat.product_count > 0 &&
      !confirm(
        `This category currently has ${cat.product_count} active products. Archiving it will remove it from customer navigation. Continue?`
      )
    ) {
      return;
    }

    const res = await updateCategoryStatusAction(cat.id, nextStatus);
    if (res.success) {
      setCategories(
        categories.map((c) => (c.id === cat.id ? { ...c, status: nextStatus } : c))
      );
    } else {
      alert(res.error || "Status update failed");
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-extrabold text-ink tracking-tight">
            Categories & Navigation Tree
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Organize products into customer-facing departments, mega-menus, and storefront strips.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-xl bg-violet px-4 py-2 text-xs font-bold text-white hover:bg-violet/90 transition-all shadow-sm"
        >
          <Plus className="size-4" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-2xl border border-border shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border bg-paper/60 font-mono text-[0.6875rem] font-bold text-muted-foreground uppercase">
                <th className="p-4">Category</th>
                <th className="p-4">Slug Handle</th>
                <th className="p-4">Products</th>
                <th className="p-4">Sort Order</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {categories.map((c) => (
                <tr key={c.id} className="hover:bg-paper/40 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-2.5">
                      <div className="size-8 rounded-xl bg-violet/10 flex items-center justify-center text-violet">
                        <Folder className="size-4" />
                      </div>
                      <div>
                        <div className="font-bold text-ink flex items-center gap-1.5">
                          <span>{c.title}</span>
                          {c.is_featured && (
                            <span className="px-1.5 py-0.5 rounded text-[0.625rem] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                              Featured Strip
                            </span>
                          )}
                        </div>
                        {c.blurb && (
                          <p className="text-[0.6875rem] text-muted-foreground line-clamp-1">
                            {c.blurb}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-mono font-bold text-muted-foreground">/{c.handle}</td>
                  <td className="p-4 font-mono font-bold text-ink">
                    {c.product_count || 0} products
                  </td>
                  <td className="p-4 font-mono text-muted-foreground">{c.sort_order}</td>
                  <td className="p-4">
                    {c.status === "active" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="size-3 text-emerald-600" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                        <Archive className="size-3 text-rose-600" />
                        Archived
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(c)}
                        className="p-1.5 rounded-lg border border-border bg-white text-ink hover:border-violet hover:text-violet font-bold shadow-2xs"
                        title="Edit Category"
                      >
                        <Edit className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleArchive(c)}
                        className="p-1.5 rounded-lg border border-border bg-white text-muted-foreground hover:text-rose-600 hover:border-rose-200 shadow-2xs"
                        title={c.status === "active" ? "Archive Category" : "Restore Category"}
                      >
                        <Archive className="size-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <form
            onSubmit={handleSave}
            className="w-full max-w-lg bg-white rounded-2xl p-6 space-y-4 shadow-2xl border border-border"
          >
            <div className="border-b border-border pb-3">
              <span className="text-[0.6875rem] font-bold uppercase font-mono text-violet">
                {editingCategory ? "Update Category" : "New Category"}
              </span>
              <h3 className="font-display text-lg font-extrabold text-ink">
                {editingCategory ? editingCategory.title : "Create Catalogue Category"}
              </h3>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-800 flex items-center gap-2">
                <AlertTriangle className="size-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="block font-bold text-ink">Category Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Visiting Cards"
                  className="w-full px-3.5 py-2 rounded-xl border border-border bg-paper/30 font-semibold text-ink"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-ink">URL Slug Handle *</label>
                <input
                  type="text"
                  required
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  placeholder="e.g. visiting-cards"
                  className="w-full px-3.5 py-2 font-mono rounded-xl border border-border bg-paper/30 font-bold text-ink"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-ink">Short Summary / Blurb</label>
                <textarea
                  rows={2}
                  value={blurb}
                  onChange={(e) => setBlurb(e.target.value)}
                  placeholder="High quality standard and premium visiting cards."
                  className="w-full p-3 rounded-xl border border-border bg-paper/30 leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block font-bold text-ink">Sort Order</label>
                  <input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-3.5 py-2 font-mono rounded-xl border border-border bg-paper/30"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="rounded border-border size-3.5 text-violet"
                    />
                    <span>Featured in Home Strip</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-border bg-white text-xs font-bold text-ink hover:bg-paper"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 rounded-xl bg-violet text-xs font-bold text-white hover:bg-violet/90 disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : "Save Category"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
