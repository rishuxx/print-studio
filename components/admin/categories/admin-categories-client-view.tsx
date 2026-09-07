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
  RefreshCw,
  Search,
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
  deleteCategoryAction,
  resetCategoriesToDefaultAction,
} from "@/lib/catalogue/mutations";
import {
  fetchAllAttributeDefinitions,
  saveAttributeDefinitionAction,
  assignCategoryAttributeTemplatesAction,
} from "@/lib/catalogue/attributes";
import { normalizeHandle } from "@/lib/catalogue/validation";
import { Icon, iconRegistry } from "@/lib/icon-map";
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
  const [catParentId, setCatParentId] = React.useState<string | null>(null);
  const [catImageUrl, setCatImageUrl] = React.useState("");
  const [isUploadingImage, setIsUploadingImage] = React.useState(false);
  const [catIsFeatured, setCatIsFeatured] = React.useState(false);
  const [catIsNav, setCatIsNav] = React.useState(true);
  const [catSortOrder, setCatSortOrder] = React.useState(0);
  const [catSelectedAttrIds, setCatSelectedAttrIds] = React.useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Icon Picker State
  const [isIconPickerOpen, setIsIconPickerOpen] = React.useState(false);
  const [iconSearchTerm, setIconSearchTerm] = React.useState("");

  // Deletion Confirmation State
  const [categoryToDelete, setCategoryToDelete] = React.useState<DatabaseCategory | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  // Reset to Defaults Confirmation State
  const [isResetConfirmOpen, setIsResetConfirmOpen] = React.useState(false);
  const [isResetting, setIsResetting] = React.useState(false);

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
    setCatParentId(null);
    setCatImageUrl("");
    setCatIsFeatured(false);
    setCatIsNav(true);
    setCatSortOrder((categories.length + 1) * 10);
    setCatSelectedAttrIds([]);
    setIsCategoryModalOpen(true);
  };

  const openEditCategory = (cat: DatabaseCategory) => {
    setEditingCategory(cat);
    setCatTitle(cat.title);
    setCatHandle(cat.handle);
    setCatBlurb(cat.blurb || "");
    setCatIcon(cat.icon || "Folder");
    setCatParentId(cat.parent_id || null);
    setCatImageUrl(cat.image_url || "");
    setCatIsFeatured(cat.is_featured);
    setCatIsNav(cat.is_nav ?? true);
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
      parent_id: catParentId || null,
      status: editingCategory?.status || "active",
      sort_order: Number(catSortOrder),
      is_featured: catIsFeatured,
      is_nav: catIsNav,
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

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;
    setIsDeleting(true);

    const res = await deleteCategoryAction(categoryToDelete.id);
    setIsDeleting(false);

    if (res.success) {
      toast.success(`Category "${categoryToDelete.title}" deleted successfully!`);
      setCategories(categories.filter((c) => c.id !== categoryToDelete.id));
      setCategoryToDelete(null);
    } else {
      toast.error(res.error || "Failed to delete category");
    }
  };

  const handleResetToDefaults = async () => {
    setIsResetting(true);
    const res = await resetCategoriesToDefaultAction();
    setIsResetting(false);

    if (res.success) {
      toast.success(`Restored ${res.restoredCount} default categories successfully!`);
      setIsResetConfirmOpen(false);
      window.location.reload();
    } else {
      toast.error(res.error || "Failed to reset categories");
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

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsResetConfirmOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-300 bg-white px-3.5 py-2 text-xs font-bold text-zinc-700 shadow-xs hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
              title="Reset categories back to clean official defaults"
            >
              <RefreshCw className="size-3.5 text-zinc-500" />
              <span className="hidden sm:inline">Reset to Defaults</span>
            </button>

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
      </div>

      {/* TAB 1: CATEGORIES LIST */}
      {activeTab === "categories" && (
        <div className="rounded-2xl border border-border bg-white shadow-sheet overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-paper text-muted-foreground font-mono uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3">Category & Icon</th>
                  <th className="px-4 py-3">Hierarchy / Parent</th>
                  <th className="px-4 py-3">Handle / URL</th>
                  <th className="px-4 py-3">Attributes</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3" title="Sequence in which categories appear (lower number = earlier)">
                    Display Order
                  </th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {categories.map((cat) => {
                  const parent = cat.parent_id ? categories.find((c) => c.id === cat.parent_id) : null;
                  return (
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
                              <Icon name={cat.icon || "Folder"} className="size-5 text-violet" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-sm text-ink">{cat.title}</span>
                              {cat.is_featured && (
                                <span className="rounded-full bg-violet-wash px-1.5 py-0.5 text-[9px] font-bold text-violet border border-violet/20">
                                  Featured
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-muted-foreground line-clamp-1">
                              {cat.blurb || "No description"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        {parent ? (
                          <div className="flex items-center gap-1 text-[11px] text-zinc-600 font-medium bg-zinc-100/80 px-2 py-1 rounded-md w-fit border border-zinc-200">
                            <span className="text-zinc-400">└─</span>
                            <span className="font-semibold text-zinc-800">{parent.title}</span>
                          </div>
                        ) : (
                          <span className="text-[10.5px] font-medium text-zinc-400 bg-zinc-50 px-2 py-0.5 rounded border border-zinc-200/60">
                            Top-Level
                          </span>
                        )}
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
                      <td className="px-4 py-4 font-mono text-zinc-700 font-bold">
                        <span title="Display sorting sequence (lower numbers appear first on nav)">
                          {cat.sort_order}
                        </span>
                      </td>
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
                          <button
                            onClick={() => setCategoryToDelete(cat)}
                            className="rounded-lg p-1.5 text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors"
                            title="Delete Category"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
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

              {/* Icon Picker Field */}
              <div>
                <label className="font-bold text-ink block mb-1">Category Icon</label>
                <div className="flex items-center gap-2.5">
                  <div className="flex size-10 items-center justify-center rounded-xl border border-border bg-paper text-violet shadow-2xs">
                    <Icon name={catIcon || "Folder"} className="size-5" />
                  </div>
                  <div className="flex-1">
                    <button
                      type="button"
                      onClick={() => setIsIconPickerOpen(true)}
                      className="w-full flex items-center justify-between rounded-xl border border-border px-3.5 py-2 text-xs font-semibold text-ink hover:bg-paper transition-colors"
                    >
                      <span className="font-mono">{catIcon || "Folder"}</span>
                      <span className="text-violet font-bold text-[11px]">Change Icon →</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Parent Category Selector (For Subcategories) */}
              <div>
                <label className="font-bold text-ink block mb-1">
                  Parent Category <span className="font-normal text-muted-foreground">(Leave empty for Top-Level)</span>
                </label>
                <select
                  value={catParentId || ""}
                  onChange={(e) => setCatParentId(e.target.value || null)}
                  className="w-full rounded-xl border border-border px-3.5 py-2 text-xs focus:border-violet focus:outline-none bg-white text-ink"
                >
                  <option value="">None (Top-Level Category)</option>
                  {categories
                    .filter((c) => !editingCategory || c.id !== editingCategory.id)
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title} (/category/{c.handle})
                      </option>
                    ))}
                </select>
                <p className="mt-1 text-[10.5px] text-muted-foreground">
                  Subcategories will be grouped under this parent in navigation and table hierarchy.
                </p>
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
                  <label className="font-bold text-ink block mb-1">
                    Display Order / Sequence
                  </label>
                  <input
                    type="number"
                    value={catSortOrder}
                    onChange={(e) => setCatSortOrder(Number(e.target.value))}
                    className="w-full rounded-xl border border-border px-3.5 py-2 text-xs focus:border-violet focus:outline-none"
                    placeholder="10, 20, 30..."
                  />
                  <span className="text-[10px] text-muted-foreground mt-0.5 block">
                    Lower numbers appear first (e.g. 10, 20, 30)
                  </span>
                </div>
                <div className="space-y-2 pt-2">
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={catIsFeatured}
                      onChange={(e) => setCatIsFeatured(e.target.checked)}
                      className="size-4 rounded border-border text-violet focus:ring-violet"
                    />
                    <span className="font-semibold text-ink">Featured in Nav Strip</span>
                  </label>
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={catIsNav}
                      onChange={(e) => setCatIsNav(e.target.checked)}
                      className="size-4 rounded border-border text-violet focus:ring-violet"
                    />
                    <span className="font-semibold text-ink">Visible in Nav Mega-Menu</span>
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

      {/* MODAL 1B: VISUAL ICON PICKER MODAL */}
      {isIconPickerOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/70 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-white p-5 shadow-pop space-y-3.5">
            <div className="flex items-center justify-between border-b border-border pb-2.5">
              <h3 className="font-display text-base font-bold text-ink">Select Category Icon</h3>
              <button
                type="button"
                onClick={() => setIsIconPickerOpen(false)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-paper hover:text-ink"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Icon Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <input
                type="text"
                value={iconSearchTerm}
                onChange={(e) => setIconSearchTerm(e.target.value)}
                placeholder="Search icons (e.g. Card, Shirt, Gift, Box, Tag)..."
                className="w-full rounded-xl border border-border pl-9 pr-3.5 py-2 text-xs focus:border-violet focus:outline-none"
              />
            </div>

            {/* Icon Grid */}
            <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 max-h-64 overflow-y-auto p-1">
              {Object.keys(iconRegistry)
                .filter((iconName) =>
                  iconName.toLowerCase().includes(iconSearchTerm.toLowerCase().trim())
                )
                .map((iconName) => {
                  const isSelected = catIcon === iconName;
                  return (
                    <button
                      key={iconName}
                      type="button"
                      onClick={() => {
                        setCatIcon(iconName);
                        setIsIconPickerOpen(false);
                      }}
                      className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all text-center group cursor-pointer ${
                        isSelected
                          ? "border-violet bg-violet text-white shadow-sm"
                          : "border-border/80 bg-paper/40 hover:bg-violet-wash hover:border-violet/40 text-zinc-700"
                      }`}
                      title={iconName}
                    >
                      <Icon name={iconName} className="size-5 mb-1" />
                      <span className="text-[9px] font-mono truncate w-full">{iconName}</span>
                    </button>
                  );
                })}
            </div>

            <div className="flex justify-end pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setIsIconPickerOpen(false)}
                className="rounded-xl border border-border px-3.5 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-paper"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1C: DELETE CONFIRMATION MODAL */}
      {categoryToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/70 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-5 shadow-pop space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="flex size-10 items-center justify-center rounded-xl bg-red-100">
                <Trash2 className="size-5" />
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-ink">Delete Category</h3>
                <p className="text-xs text-muted-foreground">Permanent deletion action</p>
              </div>
            </div>

            <p className="text-xs text-zinc-600 leading-relaxed">
              Are you sure you want to permanently delete the category{" "}
              <strong className="text-ink">&ldquo;{categoryToDelete.title}&rdquo;</strong> (
              <span className="font-mono text-violet">/category/{categoryToDelete.handle}</span>)?
            </p>

            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-[11px] text-amber-900 space-y-1">
              <p className="font-semibold">Safe Deletion Guarantee:</p>
              <ul className="list-disc list-inside space-y-0.5 text-[10.5px]">
                <li>All products linked to this category remain safe and unharmed.</li>
                <li>Child subcategories will automatically become top-level categories.</li>
                <li>This category will be immediately removed from the storefront & nav strip.</li>
              </ul>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setCategoryToDelete(null)}
                className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-paper"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteCategory}
                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Yes, Delete Category"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1D: RESET TO DEFAULTS CONFIRMATION MODAL */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/70 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-border bg-white p-5 shadow-pop space-y-4">
            <div className="flex items-center gap-3 text-zinc-900">
              <div className="flex size-10 items-center justify-center rounded-xl bg-violet-wash text-violet">
                <RefreshCw className="size-5" />
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-ink">Reset Categories to Default</h3>
                <p className="text-xs text-muted-foreground">Clean official catalog restoration</p>
              </div>
            </div>

            <p className="text-xs text-zinc-600 leading-relaxed">
              This will remove test or corrupted categories (such as <span className="font-mono text-red-600">cars</span>, <span className="font-mono text-red-600">rishu</span>) and restore all official print categories with their verified icons, ordering, and product mappings.
            </p>

            <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-3 text-[11px] text-blue-900 space-y-1">
              <p className="font-semibold">What will happen:</p>
              <ul className="list-disc list-inside space-y-0.5 text-[10.5px]">
                <li>Official categories (Visiting Cards, Apparel, Gifts, Signage, etc.) are restored.</li>
                <li>All 350+ existing database products will be cleanly re-linked.</li>
                <li>Display orders will be cleanly set to 10, 20, 30, 40...</li>
              </ul>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                disabled={isResetting}
                onClick={() => setIsResetConfirmOpen(false)}
                className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-paper"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isResetting}
                onClick={handleResetToDefaults}
                className="rounded-xl bg-violet px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-violet-lift disabled:opacity-50"
              >
                {isResetting ? "Resetting Categories..." : "Confirm & Reset Categories"}
              </button>
            </div>
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
