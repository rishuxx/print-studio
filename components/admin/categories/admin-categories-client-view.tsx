"use client";

import * as React from "react";
import {
  Plus,
  Edit,
  Archive,
  Folder,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Sparkles,
  Settings2,
  Trash2,
  ExternalLink,
  ChevronRight,
  Upload,
  Image as ImageIcon,
  X,
} from "lucide-react";
import { uploadBannerImageAction } from "@/lib/hero/actions";
import type {
  DatabaseCategory,
  DatabaseAttributeDefinition,
  AttributeType,
  AllowedValueItem,
} from "@/lib/catalogue/types";
import {
  saveCategoryAction,
  updateCategoryStatusAction,
} from "@/lib/catalogue/mutations";
import {
  fetchAllAttributeDefinitions,
  saveAttributeDefinitionAction,
  assignCategoryAttributeTemplatesAction,
} from "@/lib/catalogue/attributes";
import { normalizeHandle } from "@/lib/catalogue/validation";
import { toast } from "sonner";

interface AdminCategoriesClientViewProps {
  categories: DatabaseCategory[];
}

export function AdminCategoriesClientView({
  categories: initialCategories,
}: AdminCategoriesClientViewProps) {
  const [categories, setCategories] = React.useState(initialCategories);
  const [attributes, setAttributes] = React.useState<DatabaseAttributeDefinition[]>([]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = React.useState(false);
  const [isAttributeModalOpen, setIsAttributeModalOpen] = React.useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<"categories" | "attributes">("categories");

  // Selected for editing
  const [editingCategory, setEditingCategory] = React.useState<DatabaseCategory | null>(null);
  const [editingAttribute, setEditingAttribute] = React.useState<DatabaseAttributeDefinition | null>(null);
  const [templateCategory, setTemplateCategory] = React.useState<DatabaseCategory | null>(null);

  // Category Form State
  const [catTitle, setCatTitle] = React.useState("");
  const [catHandle, setCatHandle] = React.useState("");
  const [catBlurb, setCatBlurb] = React.useState("");
  const [catIcon, setCatIcon] = React.useState("Folder");
  const [catImageUrl, setCatImageUrl] = React.useState("");
  const [isUploadingImage, setIsUploadingImage] = React.useState(false);
  const [catIsFeatured, setCatIsFeatured] = React.useState(false);
  const [catSortOrder, setCatSortOrder] = React.useState(0);
  const [catSelectedAttrIds, setCatSelectedAttrIds] = React.useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Attribute Form State
  const [attrCode, setAttrCode] = React.useState("");
  const [attrName, setAttrName] = React.useState("");
  const [attrLabel, setAttrLabel] = React.useState("");
  const [attrType, setAttrType] = React.useState<AttributeType>("SELECT");
  const [attrUnit, setAttrUnit] = React.useState("");
  const [attrIsRequired, setAttrIsRequired] = React.useState(false);
  const [attrUsedForVariant, setAttrUsedForVariant] = React.useState(true);
  const [attrAllowedValues, setAttrAllowedValues] = React.useState<AllowedValueItem[]>([
    { label: "Option 1", value: "Option 1" },
  ]);

  // Load global attributes
  React.useEffect(() => {
    fetchAllAttributeDefinitions().then((data) => {
      setAttributes(data);
    });
  }, []);

  const openCreateCategory = () => {
    setEditingCategory(null);
    setCatTitle("");
    setCatHandle("");
    setCatBlurb("");
    setCatIcon("Folder");
    setCatImageUrl("");
    setCatIsFeatured(false);
    setCatSortOrder(categories.length * 10);
    setCatSelectedAttrIds([]);
    setIsCategoryModalOpen(true);
  };

  const openEditCategory = (cat: DatabaseCategory) => {
    setEditingCategory(cat);
    setCatTitle(cat.title);
    setCatHandle(cat.handle);
    setCatBlurb(cat.blurb || "");
    setCatIcon(cat.icon || "Folder");
    setCatImageUrl(cat.image_url || "");
    setCatIsFeatured(cat.is_featured);
    setCatSortOrder(cat.sort_order);
    setCatSelectedAttrIds(cat.attribute_templates?.map((t) => t.attribute_id) || []);
    setIsCategoryModalOpen(true);
  };

  const openCreateAttribute = () => {
    setEditingAttribute(null);
    setAttrCode("");
    setAttrName("");
    setAttrLabel("");
    setAttrType("SELECT");
    setAttrUnit("");
    setAttrIsRequired(false);
    setAttrUsedForVariant(true);
    setAttrAllowedValues([
      { label: "Option 1", value: "Option 1" },
      { label: "Option 2", value: "Option 2" },
    ]);
    setIsAttributeModalOpen(true);
  };

  const openEditAttribute = (attr: DatabaseAttributeDefinition) => {
    setEditingAttribute(attr);
    setAttrCode(attr.code);
    setAttrName(attr.name);
    setAttrLabel(attr.label);
    setAttrType(attr.type);
    setAttrUnit(attr.unit || "");
    setAttrIsRequired(attr.is_required);
    setAttrUsedForVariant(attr.used_for_variant);
    setAttrAllowedValues(
      attr.allowed_values?.length > 0
        ? attr.allowed_values
        : [{ label: "Standard", value: "Standard" }]
    );
    setIsAttributeModalOpen(true);
  };

  const openTemplateManager = (cat: DatabaseCategory) => {
    setTemplateCategory(cat);
    setCatSelectedAttrIds(cat.attribute_templates?.map((t) => t.attribute_id) || []);
    setIsTemplateModalOpen(true);
  };

  const handleCategoryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    try {
      // 1. Direct client-side upload to Supabase Storage
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const { PRODUCT_MEDIA_BUCKET } = await import("@/lib/storage/product-media-utils");
        const supabase = createClient();

        const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
        const fileName = `categories/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`;

        const { error: clientUploadErr } = await supabase.storage
          .from(PRODUCT_MEDIA_BUCKET)
          .upload(fileName, file, {
            contentType: file.type || "image/jpeg",
            upsert: true,
          });

        if (!clientUploadErr) {
          const { data } = supabase.storage.from(PRODUCT_MEDIA_BUCKET).getPublicUrl(fileName);
          if (data?.publicUrl) {
            setCatImageUrl(data.publicUrl);
            toast.success("Category card image uploaded successfully.");
            return;
          }
        }
      } catch (clientErr) {
        console.warn("Direct upload error, falling back to server action:", clientErr);
      }

      // 2. Server action fallback
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "categories");

      const res = await uploadBannerImageAction(formData);
      if (res.success && res.url) {
        setCatImageUrl(res.url);
        toast.success("Category card image uploaded successfully.");
      } else {
        toast.error(res.error || "Failed to upload category image.");
      }
    } catch (err: any) {
      toast.error(err?.message || "Error uploading image.");
    } finally {
      setIsUploadingImage(false);
      e.target.value = "";
    }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const res = await saveCategoryAction({
      id: editingCategory?.id,
      title: catTitle.trim(),
      handle: normalizeHandle(catHandle),
      blurb: catBlurb.trim() || null,
      icon: catIcon,
      image_url: catImageUrl.trim() || null,
      status: editingCategory?.status || "active",
      sort_order: Number(catSortOrder),
      is_featured: catIsFeatured,
      is_nav: true,
      attribute_ids: catSelectedAttrIds,
    });

    setIsSubmitting(false);

    if (res.success) {
      toast.success("Category saved successfully!");
      setIsCategoryModalOpen(false);
      window.location.reload();
    } else {
      toast.error(res.error || "Failed to save category");
    }
  };

  const handleSaveAttribute = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const res = await saveAttributeDefinitionAction({
      id: editingAttribute?.id,
      code: attrCode,
      name: attrName,
      label: attrLabel || attrName,
      type: attrType,
      unit: attrUnit || undefined,
      is_required: attrIsRequired,
      visible_on_storefront: true,
      used_for_variant: attrUsedForVariant,
      used_for_filtering: true,
      used_for_search: true,
      is_global: true,
      sort_order: 0,
      allowed_values: attrAllowedValues.filter((v) => v.label.trim()),
      validation_rules: {},
    });

    setIsSubmitting(false);

    if (res.success) {
      toast.success("Attribute definition saved successfully!");
      setIsAttributeModalOpen(false);
      const updated = await fetchAllAttributeDefinitions();
      setAttributes(updated);
    } else {
      toast.error(res.error || "Failed to save attribute");
    }
  };

  const handleSaveTemplates = async () => {
    if (!templateCategory) return;
    setIsSubmitting(true);

    const res = await assignCategoryAttributeTemplatesAction(
      templateCategory.id,
      catSelectedAttrIds
    );

    setIsSubmitting(false);

    if (res.success) {
      toast.success("Category attribute template updated!");
      setIsTemplateModalOpen(false);
      window.location.reload();
    } else {
      toast.error(res.error || "Failed to assign templates");
    }
  };

  const handleToggleArchive = async (cat: DatabaseCategory) => {
    const nextStatus = cat.status === "active" ? "archived" : "active";
    const res = await updateCategoryStatusAction(cat.id, nextStatus);
    if (res.success) {
      toast.success(`Category ${nextStatus === "active" ? "restored" : "archived"}`);
      setCategories(
        categories.map((c) => (c.id === cat.id ? { ...c, status: nextStatus } : c))
      );
    } else {
      toast.error(res.error || "Status update failed");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Tab Switching */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-black tracking-tight text-ink sm:text-3xl">
            Categories & Dynamic Attributes
          </h1>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Control the catalog taxonomy, hierarchy, and reusable category attribute templates.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="inline-flex rounded-xl border border-border bg-paper p-1">
            <button
              onClick={() => setActiveTab("categories")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-colors ${
                activeTab === "categories"
                  ? "bg-violet text-white shadow-sm"
                  : "text-muted-foreground hover:text-ink"
              }`}
            >
              Categories ({categories.length})
            </button>
            <button
              onClick={() => setActiveTab("attributes")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-colors ${
                activeTab === "attributes"
                  ? "bg-violet text-white shadow-sm"
                  : "text-muted-foreground hover:text-ink"
              }`}
            >
              Attributes ({attributes.length})
            </button>
          </div>

          {activeTab === "categories" ? (
            <button
              onClick={openCreateCategory}
              className="inline-flex items-center gap-1.5 rounded-xl bg-violet px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-violet-lift transition-colors"
            >
              <Plus className="size-4" />
              <span>New Category</span>
            </button>
          ) : (
            <button
              onClick={openCreateAttribute}
              className="inline-flex items-center gap-1.5 rounded-xl bg-violet px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-violet-lift transition-colors"
            >
              <Plus className="size-4" />
              <span>New Attribute</span>
            </button>
          )}
        </div>
      </div>

      {/* TAB 1: CATEGORIES LIST */}
      {activeTab === "categories" && (
        <div className="rounded-2xl border border-border bg-white shadow-sheet overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-paper text-muted-foreground font-mono uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-4 py-3">Handle / URL</th>
                  <th className="px-4 py-3">Attribute Templates</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-paper/40 transition-colors">
                    <td className="px-5 py-4 font-semibold text-ink">
                      <div className="flex items-center gap-3">
                        <div className="relative size-10 shrink-0 overflow-hidden rounded-lg border border-border bg-paper flex items-center justify-center">
                          {cat.image_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={cat.image_url}
                              alt={cat.title}
                              className="size-full object-cover"
                            />
                          ) : (
                            <Folder className="size-4 text-violet" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-ink">{cat.title}</div>
                          <div className="text-[11px] text-muted-foreground line-clamp-1">
                            {cat.blurb || "No description"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 font-mono text-[11px] text-muted-foreground">
                      /category/{cat.handle}
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => openTemplateManager(cat)}
                        className="inline-flex items-center gap-1 rounded-md border border-violet/30 bg-violet-wash px-2 py-1 text-[11px] font-bold text-violet hover:bg-violet-tint transition-colors"
                      >
                        <Layers className="size-3" />
                        <span>{cat.attribute_templates?.length || 0} Attributes</span>
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          cat.status === "active"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {cat.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-mono text-muted-foreground">{cat.sort_order}</td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditCategory(cat)}
                          className="rounded-lg p-1.5 text-muted-foreground hover:bg-paper hover:text-ink transition-colors"
                          title="Edit Category"
                        >
                          <Edit className="size-3.5" />
                        </button>
                        <button
                          onClick={() => handleToggleArchive(cat)}
                          className="rounded-lg p-1.5 text-muted-foreground hover:bg-amber-50 hover:text-amber-700 transition-colors"
                          title={cat.status === "active" ? "Archive" : "Restore"}
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
      )}

      {/* TAB 2: ATTRIBUTE DEFINITIONS LIST */}
      {activeTab === "attributes" && (
        <div className="rounded-2xl border border-border bg-white shadow-sheet overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-paper text-muted-foreground font-mono uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3">Attribute</th>
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Unit</th>
                  <th className="px-4 py-3">Allowed Options</th>
                  <th className="px-4 py-3">Variant Driver</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {attributes.map((attr) => (
                  <tr key={attr.id} className="hover:bg-paper/40 transition-colors">
                    <td className="px-5 py-4 font-bold text-ink">
                      <div>{attr.name}</div>
                      <div className="text-[11px] text-muted-foreground font-normal">
                        Label: {attr.label}
                      </div>
                    </td>
                    <td className="px-4 py-4 font-mono text-[11px] text-violet font-semibold">
                      {attr.code}
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex rounded-md bg-paper px-2 py-0.5 font-mono text-[11px] font-bold text-ink border border-border">
                        {attr.type}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-mono text-muted-foreground">
                      {attr.unit || "—"}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {attr.allowed_values?.slice(0, 4).map((val, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 rounded bg-paper-deep px-1.5 py-0.5 text-[10px] text-ink font-medium"
                          >
                            {val.hex && (
                              <span
                                className="size-2 rounded-full border border-black/20"
                                style={{ backgroundColor: val.hex }}
                              />
                            )}
                            <span>{val.label}</span>
                          </span>
                        ))}
                        {(attr.allowed_values?.length || 0) > 4 && (
                          <span className="text-[10px] text-muted-foreground">
                            +{attr.allowed_values.length - 4} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {attr.used_for_variant ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                          <CheckCircle2 className="size-3.5" /> Yes
                        </span>
                      ) : (
                        <span className="text-[11px] text-muted-foreground">No</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => openEditAttribute(attr)}
                        className="rounded-lg p-1.5 text-muted-foreground hover:bg-paper hover:text-ink transition-colors"
                      >
                        <Edit className="size-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: CREATE / EDIT CATEGORY */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-white p-6 shadow-pop space-y-4">
            <h2 className="font-display text-lg font-bold text-ink">
              {editingCategory ? "Edit Category" : "Create New Category"}
            </h2>

            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-ink block mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={catTitle}
                  onChange={(e) => {
                    setCatTitle(e.target.value);
                    if (!editingCategory && (!catHandle || catHandle === normalizeHandle(catTitle))) {
                      setCatHandle(normalizeHandle(e.target.value));
                    }
                  }}
                  className="w-full rounded-xl border border-border px-3.5 py-2 text-xs focus:border-violet focus:outline-none"
                  placeholder="e.g. Photo Frames"
                />
              </div>

              <div>
                <label className="font-bold text-ink block mb-1">URL Handle / Slug</label>
                <input
                  type="text"
                  required
                  value={catHandle}
                  onChange={(e) => setCatHandle(normalizeHandle(e.target.value))}
                  className="w-full rounded-xl border border-border px-3.5 py-2 font-mono text-xs focus:border-violet focus:outline-none"
                  placeholder="photo-frames"
                />
              </div>

              <div>
                <label className="font-bold text-ink block mb-1">Blurb / Description</label>
                <textarea
                  rows={2}
                  value={catBlurb}
                  onChange={(e) => setCatBlurb(e.target.value)}
                  className="w-full rounded-xl border border-border px-3.5 py-2 text-xs focus:border-violet focus:outline-none"
                  placeholder="Premium custom frames in natural teak and solid oak..."
                />
              </div>

              {/* Category Card Image (Homepage & Grid) */}
              <div className="rounded-xl border border-zinc-200 p-3.5 space-y-2.5 bg-zinc-50/60">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-ink flex items-center gap-1.5 text-xs">
                    <ImageIcon className="size-3.5 text-zinc-600" />
                    <span>Homepage Category Card Image</span>
                  </label>
                  <span className="text-[10px] text-zinc-500 font-medium">Square or 4:3 (Auto-fits)</span>
                </div>

                {catImageUrl ? (
                  <div className="relative size-24 rounded-lg overflow-hidden border border-zinc-200 bg-zinc-100 group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={catImageUrl}
                      alt="Category preview"
                      className="size-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setCatImageUrl("")}
                      className="absolute top-1 right-1 size-5 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer"
                      title="Remove image"
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-zinc-300 rounded-lg hover:border-violet/60 bg-white cursor-pointer transition-colors p-3 text-center">
                    <Upload className="size-5 text-zinc-400 mb-1" />
                    <span className="text-[11px] font-semibold text-zinc-700">
                      {isUploadingImage ? "Uploading category image..." : "Upload Category Card Image"}
                    </span>
                    <span className="text-[10px] text-zinc-400">JPG, PNG, WEBP (up to 25MB)</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={isUploadingImage}
                      onChange={handleCategoryImageUpload}
                      className="hidden"
                    />
                  </label>
                )}

                <input
                  type="text"
                  value={catImageUrl}
                  onChange={(e) => setCatImageUrl(e.target.value)}
                  placeholder="Or paste direct image URL (https://...)"
                  className="w-full rounded-lg border border-border px-3 py-1.5 text-[11px] bg-white text-ink focus:border-violet focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-ink block mb-1">Sort Order</label>
                  <input
                    type="number"
                    value={catSortOrder}
                    onChange={(e) => setCatSortOrder(Number(e.target.value))}
                    className="w-full rounded-xl border border-border px-3.5 py-2 text-xs focus:border-violet focus:outline-none"
                  />
                </div>
                <div className="flex items-center pt-5">
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={catIsFeatured}
                      onChange={(e) => setCatIsFeatured(e.target.checked)}
                      className="size-4 rounded border-border text-violet focus:ring-violet"
                    />
                    <span className="font-semibold text-ink">Featured in Nav Strip</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="rounded-xl border border-border px-4 py-2 font-semibold text-muted-foreground hover:bg-paper"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-violet px-4 py-2 font-bold text-white shadow-sm hover:bg-violet-lift disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Save Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CATEGORY ATTRIBUTE TEMPLATE ATTACHMENT */}
      {isTemplateModalOpen && templateCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-xl rounded-2xl border border-border bg-white p-6 shadow-pop space-y-4">
            <div>
              <h2 className="font-display text-lg font-bold text-ink">
                Assign Attributes to &ldquo;{templateCategory.title}&rdquo;
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Selected attributes will automatically appear on all products created under this category.
              </p>
            </div>

            <div className="max-h-72 overflow-y-auto divide-y divide-border rounded-xl border border-border bg-paper/30 p-2">
              {attributes.map((attr) => {
                const isSelected = catSelectedAttrIds.includes(attr.id);
                return (
                  <label
                    key={attr.id}
                    className="flex items-center justify-between p-2.5 hover:bg-white rounded-lg cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setCatSelectedAttrIds([...catSelectedAttrIds, attr.id]);
                          } else {
                            setCatSelectedAttrIds(
                              catSelectedAttrIds.filter((id) => id !== attr.id)
                            );
                          }
                        }}
                        className="size-4 rounded border-border text-violet focus:ring-violet"
                      />
                      <div>
                        <div className="font-bold text-xs text-ink">{attr.name}</div>
                        <div className="text-[10px] text-muted-foreground">
                          Code: <span className="font-mono text-violet">{attr.code}</span> • Type:{" "}
                          {attr.type} {attr.unit ? `(${attr.unit})` : ""}
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono text-muted-foreground">
                      {attr.allowed_values?.length || 0} Options
                    </span>
                  </label>
                );
              })}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsTemplateModalOpen(false)}
                className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-paper"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveTemplates}
                disabled={isSubmitting}
                className="rounded-xl bg-violet px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-violet-lift disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : "Save Template Mapping"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: CREATE / EDIT ATTRIBUTE DEFINITION */}
      {isAttributeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-xl rounded-2xl border border-border bg-white p-6 shadow-pop space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="font-display text-lg font-bold text-ink">
              {editingAttribute ? "Edit Attribute Definition" : "Create Attribute Definition"}
            </h2>

            <form onSubmit={handleSaveAttribute} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-ink block mb-1">Name</label>
                  <input
                    type="text"
                    required
                    value={attrName}
                    onChange={(e) => {
                      setAttrName(e.target.value);
                      if (!editingAttribute && !attrCode) {
                        setAttrCode(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "_"));
                      }
                      if (!attrLabel) setAttrLabel(e.target.value);
                    }}
                    className="w-full rounded-xl border border-border px-3.5 py-2 text-xs focus:border-violet focus:outline-none"
                    placeholder="e.g. Paper GSM"
                  />
                </div>
                <div>
                  <label className="font-bold text-ink block mb-1">Code (Identifier)</label>
                  <input
                    type="text"
                    required
                    value={attrCode}
                    onChange={(e) =>
                      setAttrCode(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "_"))
                    }
                    className="w-full rounded-xl border border-border px-3.5 py-2 font-mono text-xs focus:border-violet focus:outline-none"
                    placeholder="paper_gsm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-ink block mb-1">Attribute Type</label>
                  <select
                    value={attrType}
                    onChange={(e) => setAttrType(e.target.value as AttributeType)}
                    className="w-full rounded-xl border border-border px-3.5 py-2 text-xs focus:border-violet focus:outline-none bg-white"
                  >
                    <option value="SELECT">Select Dropdown</option>
                    <option value="MULTI_SELECT">Multi-Select Checkboxes</option>
                    <option value="COLOUR_SWATCH">Colour Swatch</option>
                    <option value="TEXT">Text Input</option>
                    <option value="NUMBER">Number Input</option>
                    <option value="DIMENSION">Dimension (Width / Height)</option>
                    <option value="FILE_UPLOAD">File / Artwork Upload</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-ink block mb-1">Unit (Optional)</label>
                  <input
                    type="text"
                    value={attrUnit}
                    onChange={(e) => setAttrUnit(e.target.value)}
                    className="w-full rounded-xl border border-border px-3.5 py-2 text-xs focus:border-violet focus:outline-none"
                    placeholder="e.g. GSM, cm, inch, ml"
                  />
                </div>
              </div>

              {/* Allowed Values Manager for SELECT / SWATCH */}
              {["SELECT", "MULTI_SELECT", "COLOUR_SWATCH", "RADIO"].includes(attrType) && (
                <div className="space-y-2 pt-2 border-t border-border">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-ink">Allowed Values / Options</label>
                    <button
                      type="button"
                      onClick={() =>
                        setAttrAllowedValues([
                          ...attrAllowedValues,
                          {
                            label: `Option ${attrAllowedValues.length + 1}`,
                            value: `Option ${attrAllowedValues.length + 1}`,
                          },
                        ])
                      }
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-violet hover:underline"
                    >
                      <Plus className="size-3" /> Add Option
                    </button>
                  </div>

                  <div className="space-y-2 max-h-48 overflow-y-auto p-1">
                    {attrAllowedValues.map((val, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        {attrType === "COLOUR_SWATCH" && (
                          <input
                            type="color"
                            value={val.hex || "#000000"}
                            onChange={(e) => {
                              const next = [...attrAllowedValues];
                              next[idx].hex = e.target.value;
                              setAttrAllowedValues(next);
                            }}
                            className="size-8 rounded border border-border cursor-pointer shrink-0"
                            title="Pick colour"
                          />
                        )}
                        <input
                          type="text"
                          value={val.label}
                          onChange={(e) => {
                            const next = [...attrAllowedValues];
                            next[idx].label = e.target.value;
                            next[idx].value = e.target.value;
                            setAttrAllowedValues(next);
                          }}
                          className="flex-1 rounded-xl border border-border px-3 py-1.5 text-xs focus:border-violet focus:outline-none"
                          placeholder="Option label"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setAttrAllowedValues(attrAllowedValues.filter((_, i) => i !== idx))
                          }
                          className="p-1.5 text-muted-foreground hover:text-red-600 rounded-lg"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4 pt-2 border-t border-border">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={attrUsedForVariant}
                    onChange={(e) => setAttrUsedForVariant(e.target.checked)}
                    className="size-4 rounded border-border text-violet focus:ring-violet"
                  />
                  <span className="font-semibold text-ink">Used for Variant Generation</span>
                </label>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={attrIsRequired}
                    onChange={(e) => setAttrIsRequired(e.target.checked)}
                    className="size-4 rounded border-border text-violet focus:ring-violet"
                  />
                  <span className="font-semibold text-ink">Required by Default</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAttributeModalOpen(false)}
                  className="rounded-xl border border-border px-4 py-2 font-semibold text-muted-foreground hover:bg-paper"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-violet px-4 py-2 font-bold text-white shadow-sm hover:bg-violet-lift disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Save Attribute"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
