"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  AlertTriangle,
  PauseCircle,
  ExternalLink,
  Plus,
  Trash2,
} from "lucide-react";
import type { DatabaseProduct, DatabaseCategory } from "@/lib/catalogue/types";
import { saveProductAction, updateProductStatusAction } from "@/lib/catalogue/mutations";
import { normalizeHandle, normalizeSKU } from "@/lib/catalogue/validation";

interface AdminProductEditorProps {
  initialProduct?: DatabaseProduct | null;
  categories: DatabaseCategory[];
}

export function AdminProductEditor({ initialProduct, categories }: AdminProductEditorProps) {
  const router = useRouter();
  const isNew = !initialProduct;

  const [activeTab, setActiveTab] = React.useState<"general" | "specs" | "options" | "seo">("general");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  // Form state
  const [title, setTitle] = React.useState(initialProduct?.title || "");
  const [handle, setHandle] = React.useState(initialProduct?.handle || "");
  const [sku, setSku] = React.useState(initialProduct?.sku || "");
  const [subtitle, setSubtitle] = React.useState(initialProduct?.subtitle || "");
  const [description, setDescription] = React.useState(initialProduct?.description || "");
  const [status, setStatus] = React.useState(initialProduct?.status || "draft");
  const [visibility, setVisibility] = React.useState(initialProduct?.visibility || "public");
  const [productType, setProductType] = React.useState(initialProduct?.product_type || "Print");
  const [unit, setUnit] = React.useState(initialProduct?.unit || "pieces");
  const [minOrderQty, setMinOrderQty] = React.useState(initialProduct?.min_order_qty || 1);
  const [qtyIncrement, setQtyIncrement] = React.useState(initialProduct?.qty_increment || 1);
  const [turnaroundDays, setTurnaroundDays] = React.useState(initialProduct?.turnaround_days || 3);
  const [isFeatured, setIsFeatured] = React.useState(initialProduct?.is_featured || false);
  const [sameDayEligible, setSameDayEligible] = React.useState(initialProduct?.same_day_eligible || false);
  const [bulkEligible, setBulkEligible] = React.useState(initialProduct?.bulk_eligible ?? true);
  const [requiresArtwork, setRequiresArtwork] = React.useState(initialProduct?.requires_artwork ?? true);
  const [requiresProof, setRequiresProof] = React.useState(initialProduct?.requires_proof ?? true);
  const [customizable, setCustomizable] = React.useState(initialProduct?.customizable ?? true);
  const [uploadOnly, setUploadOnly] = React.useState(initialProduct?.upload_only || false);
  const [sortOrder, setSortOrder] = React.useState(initialProduct?.sort_order || 0);
  const [version, setVersion] = React.useState(initialProduct?.version || 1);

  // Categories selection
  const [selectedCategoryIds, setSelectedCategoryIds] = React.useState<string[]>(
    initialProduct?.categories?.map((c) => c.id) || []
  );

  // SEO fields
  const [seoTitle, setSeoTitle] = React.useState(initialProduct?.seo_title || "");
  const [seoDescription, setSeoDescription] = React.useState(initialProduct?.seo_description || "");
  const [canonicalUrl, setCanonicalUrl] = React.useState(initialProduct?.canonical_url || "");

  // Options & Values (Size, Paper, Finish)
  const [options, setOptions] = React.useState<Array<{ name: string; values: string[] }>>(
    initialProduct?.options?.map((o) => ({ name: o.name, values: o.values })) || [
      { name: "Paper Type", values: ["350 GSM Art Card", "400 GSM Premium Matte"] },
    ]
  );

  // Auto-generate slug and SKU from title if creating a new product
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (isNew && (!handle || handle === normalizeHandle(title))) {
      setHandle(normalizeHandle(val));
    }
    if (isNew && (!sku || sku.startsWith("PRT-"))) {
      setSku(`PRT-${normalizeSKU(val).slice(0, 10)}-001`);
    }
  };

  const toggleCategory = (catId: string) => {
    if (selectedCategoryIds.includes(catId)) {
      setSelectedCategoryIds(selectedCategoryIds.filter((id) => id !== catId));
    } else {
      setSelectedCategoryIds([...selectedCategoryIds, catId]);
    }
  };

  const handleSave = async (targetStatus?: "draft" | "active" | "paused" | "archived") => {
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const nextStatus = targetStatus || status;

    const payload = {
      id: initialProduct?.id,
      title: title.trim(),
      handle: normalizeHandle(handle),
      sku: normalizeSKU(sku),
      subtitle: subtitle.trim() || null,
      description: description.trim() || null,
      status: nextStatus,
      visibility,
      product_type: productType,
      unit,
      min_order_qty: Number(minOrderQty),
      qty_increment: Number(qtyIncrement),
      turnaround_days: Number(turnaroundDays),
      is_featured: isFeatured,
      same_day_eligible: sameDayEligible,
      bulk_eligible: bulkEligible,
      requires_artwork: requiresArtwork,
      requires_proof: requiresProof,
      customizable,
      upload_only: uploadOnly,
      sort_order: Number(sortOrder),
      version,
      seo_title: seoTitle.trim() || null,
      seo_description: seoDescription.trim() || null,
      canonical_url: canonicalUrl.trim() || null,
      category_ids: selectedCategoryIds,
      options,
      media: [],
    };

    const res = await saveProductAction(payload);
    setIsSubmitting(false);

    if (res.success) {
      setSuccessMessage("Product configuration saved successfully!");
      if (res.version) setVersion(res.version);
      if (targetStatus) setStatus(targetStatus);
      if (isNew && res.productId) {
        router.push(`/admin/products/${res.productId}`);
      }
    } else {
      setErrorMessage(res.error || "Failed to save product.");
    }
  };

  const handleStatusTransition = async (newStatus: "draft" | "active" | "paused" | "archived") => {
    if (!initialProduct?.id) {
      handleSave(newStatus);
      return;
    }
    setIsSubmitting(true);
    setErrorMessage(null);
    const res = await updateProductStatusAction(initialProduct.id, newStatus);
    setIsSubmitting(false);
    if (res.success) {
      setStatus(newStatus);
      setSuccessMessage(`Product status updated to ${newStatus}`);
    } else {
      setErrorMessage(res.error || "Status update failed.");
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="p-2 rounded-xl border border-border bg-white hover:bg-paper text-ink transition-colors shadow-2xs"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[0.6875rem] font-bold uppercase font-mono text-violet">
                {isNew ? "New Product Creation" : `SKU: ${sku}`}
              </span>
              {!isNew && (
                <span className="px-2 py-0.5 rounded-full text-[0.6875rem] font-bold uppercase bg-paper border border-border">
                  {status}
                </span>
              )}
            </div>
            <h2 className="font-display text-xl font-extrabold text-ink tracking-tight">
              {title || "Untitled Product"}
            </h2>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {!isNew && handle && (
            <Link
              href={`/product/${handle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-white text-xs font-bold text-ink hover:bg-paper transition-all shadow-2xs"
            >
              <ExternalLink className="size-3.5 text-muted-foreground" />
              <span>Preview</span>
            </Link>
          )}

          {status !== "active" && (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleStatusTransition("active")}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white transition-all shadow-xs disabled:opacity-50"
            >
              <CheckCircle2 className="size-3.5" />
              <span>Publish Live</span>
            </button>
          )}

          {status === "active" && (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleStatusTransition("paused")}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-xs font-bold text-white transition-all shadow-xs disabled:opacity-50"
            >
              <PauseCircle className="size-3.5" />
              <span>Pause Sales</span>
            </button>
          )}

          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleSave()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet hover:bg-violet/90 text-xs font-bold text-white transition-all shadow-xs disabled:opacity-50"
          >
            <Save className="size-3.5" />
            <span>{isSubmitting ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-800 flex items-center gap-2">
          <AlertTriangle className="size-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Editor Tab Strip */}
      <div className="flex items-center gap-2 border-b border-border pb-1 text-xs font-bold overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("general")}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === "general"
              ? "bg-ink text-white shadow-2xs"
              : "text-muted-foreground hover:text-ink hover:bg-paper"
          }`}
        >
          General Information
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("specs")}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === "specs"
              ? "bg-ink text-white shadow-2xs"
              : "text-muted-foreground hover:text-ink hover:bg-paper"
          }`}
        >
          Manufacturing & Quantities
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("options")}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === "options"
              ? "bg-ink text-white shadow-2xs"
              : "text-muted-foreground hover:text-ink hover:bg-paper"
          }`}
        >
          Options & Attributes
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("seo")}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === "seo"
              ? "bg-ink text-white shadow-2xs"
              : "text-muted-foreground hover:text-ink hover:bg-paper"
          }`}
        >
          SEO & Search Metadata
        </button>
      </div>

      {/* TAB 1: General Information */}
      {activeTab === "general" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-5 bg-white p-6 rounded-2xl border border-border shadow-xs">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-ink">Product Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Standard Visiting Cards"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-border bg-paper/30 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-violet/20 font-semibold text-ink"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-ink">SKU (Item Identifier) *</label>
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value.toUpperCase())}
                  placeholder="e.g. PRT-VC-001"
                  className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl border border-border bg-paper/30 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-violet/20 font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-ink">URL Slug *</label>
                <div className="flex items-center rounded-xl border border-border bg-paper/30 focus-within:bg-white focus-within:ring-2 focus-within:ring-violet/20">
                  <span className="pl-3 text-[0.6875rem] text-muted-foreground font-mono">/product/</span>
                  <input
                    type="text"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    placeholder="standard-visiting-cards"
                    className="w-full px-2 py-2.5 text-xs font-mono bg-transparent border-0 focus:outline-hidden font-bold"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-ink">Subtitle / Short Summary</label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. 350 GSM premium art card with matte lamination."
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-border bg-paper/30 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-violet/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-ink">Full Description</label>
              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed technical specifications, paper thickness, print finishes, and usage recommendations..."
                className="w-full p-3.5 text-xs rounded-xl border border-border bg-paper/30 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-violet/20 leading-relaxed"
              />
            </div>
          </div>

          {/* Right Sidebar: Categories & Visibility */}
          <div className="space-y-5">
            <div className="bg-white p-5 rounded-2xl border border-border shadow-xs space-y-4">
              <h3 className="font-display text-xs font-bold uppercase text-ink">
                Catalogue Assignment
              </h3>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {categories.map((c) => (
                  <label
                    key={c.id}
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-paper/80 cursor-pointer text-xs transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategoryIds.includes(c.id)}
                      onChange={() => toggleCategory(c.id)}
                      className="rounded border-border size-3.5 text-violet"
                    />
                    <span className="font-semibold text-ink">{c.title}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-border shadow-xs space-y-3">
              <h3 className="font-display text-xs font-bold uppercase text-ink">Visibility & Type</h3>
              <div className="space-y-2">
                <label className="block text-[0.6875rem] font-bold text-muted-foreground uppercase">
                  Storefront Visibility
                </label>
                <select
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value as "public" | "hidden")}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-white text-ink font-semibold"
                >
                  <option value="public">Public (Visible in search/catalogue)</option>
                  <option value="hidden">Hidden (Direct link only)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-[0.6875rem] font-bold text-muted-foreground uppercase">
                  Product Type
                </label>
                <input
                  type="text"
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                  placeholder="e.g. Print, Apparel, Signage"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-paper/30 font-semibold"
                />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-border shadow-xs space-y-3">
              <h3 className="font-display text-xs font-bold uppercase text-ink">Badges & Flags</h3>
              <label className="flex items-center gap-2.5 text-xs font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded border-border size-3.5 text-violet"
                />
                <span>Featured / Bestseller Badge</span>
              </label>
              <label className="flex items-center gap-2.5 text-xs font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={sameDayEligible}
                  onChange={(e) => setSameDayEligible(e.target.checked)}
                  className="rounded border-border size-3.5 text-violet"
                />
                <span>Express Same-Day Dispatch</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Manufacturing & Quantities */}
      {activeTab === "specs" && (
        <div className="bg-white p-6 rounded-2xl border border-border shadow-xs space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-ink">Order Unit</label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="e.g. cards, boxes, pieces"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-border bg-paper/30"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-ink">Minimum Order Quantity (MOQ)</label>
              <input
                type="number"
                min={1}
                value={minOrderQty}
                onChange={(e) => setMinOrderQty(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl border border-border bg-paper/30"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-ink">Quantity Increment Step</label>
              <input
                type="number"
                min={1}
                value={qtyIncrement}
                onChange={(e) => setQtyIncrement(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl border border-border bg-paper/30"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-ink">Dispatch Turnaround (Days)</label>
              <input
                type="number"
                min={1}
                value={turnaroundDays}
                onChange={(e) => setTurnaroundDays(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl border border-border bg-paper/30"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-ink">Sort Display Order</label>
              <input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(parseInt(e.target.value, 10) || 0)}
                className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl border border-border bg-paper/30"
              />
            </div>
          </div>

          <div className="border-t border-border pt-5 space-y-3">
            <h3 className="font-display text-xs font-bold uppercase text-ink">Pre-Press & Ordering Flags</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex items-center gap-2.5 p-3 rounded-xl border border-border bg-paper/30 text-xs font-semibold">
                <input
                  type="checkbox"
                  checked={requiresArtwork}
                  onChange={(e) => setRequiresArtwork(e.target.checked)}
                  className="rounded border-border size-3.5 text-violet"
                />
                <span>Requires High-Resolution PDF/CDR Upload</span>
              </label>

              <label className="flex items-center gap-2.5 p-3 rounded-xl border border-border bg-paper/30 text-xs font-semibold">
                <input
                  type="checkbox"
                  checked={requiresProof}
                  onChange={(e) => setRequiresProof(e.target.checked)}
                  className="rounded border-border size-3.5 text-violet"
                />
                <span>Requires Digital Soft-Proof Approval</span>
              </label>

              <label className="flex items-center gap-2.5 p-3 rounded-xl border border-border bg-paper/30 text-xs font-semibold">
                <input
                  type="checkbox"
                  checked={customizable}
                  onChange={(e) => setCustomizable(e.target.checked)}
                  className="rounded border-border size-3.5 text-violet"
                />
                <span>Enable Interactive Online Canvas Customizer</span>
              </label>

              <label className="flex items-center gap-2.5 p-3 rounded-xl border border-border bg-paper/30 text-xs font-semibold">
                <input
                  type="checkbox"
                  checked={bulkEligible}
                  onChange={(e) => setBulkEligible(e.target.checked)}
                  className="rounded border-border size-3.5 text-violet"
                />
                <span>Eligible for High-Volume B2B Pricing</span>
              </label>

              <label className="flex items-center gap-2.5 p-3 rounded-xl border border-border bg-paper/30 text-xs font-semibold sm:col-span-2">
                <input
                  type="checkbox"
                  checked={uploadOnly}
                  onChange={(e) => setUploadOnly(e.target.checked)}
                  className="rounded border-border size-3.5 text-violet"
                />
                <span>Upload Only (Disable template canvas, require ready artwork)</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Options & Attributes */}
      {activeTab === "options" && (
        <div className="bg-white p-6 rounded-2xl border border-border shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-sm font-bold text-ink">Print Options & Values</h3>
              <p className="text-xs text-muted-foreground">
                Configure customizable selections such as Paper GSM, Finishes, or Sizes.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOptions([...options, { name: "Finish", values: ["Matte", "Gloss"] }])}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-paper font-bold text-xs hover:bg-border transition-all"
            >
              <Plus className="size-3.5" />
              <span>Add Option</span>
            </button>
          </div>

          <div className="space-y-4">
            {options.map((opt, optIdx) => (
              <div key={optIdx} className="p-4 rounded-xl border border-border bg-paper/30 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <input
                    type="text"
                    value={opt.name}
                    onChange={(e) => {
                      const next = [...options];
                      next[optIdx].name = e.target.value;
                      setOptions(next);
                    }}
                    placeholder="Option Name (e.g. Paper Finish)"
                    className="w-64 px-3 py-1.5 text-xs font-bold rounded-lg border border-border bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setOptions(options.filter((_, i) => i !== optIdx))}
                    className="p-1.5 text-muted-foreground hover:text-rose-600 rounded-lg hover:bg-rose-50"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {opt.values.map((v, valIdx) => (
                    <span
                      key={valIdx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-border text-xs font-semibold"
                    >
                      <span>{v}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const next = [...options];
                          next[optIdx].values = next[optIdx].values.filter((_, i) => i !== valIdx);
                          setOptions(next);
                        }}
                        className="text-muted-foreground hover:text-rose-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const val = prompt("Enter new option value:");
                      if (val && val.trim()) {
                        const next = [...options];
                        next[optIdx].values.push(val.trim());
                        setOptions(next);
                      }
                    }}
                    className="px-2.5 py-1 rounded-lg border border-dashed border-border bg-white text-xs text-muted-foreground hover:text-ink font-semibold"
                  >
                    + Add Value
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SEO Metadata */}
      {activeTab === "seo" && (
        <div className="bg-white p-6 rounded-2xl border border-border shadow-xs space-y-5">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-ink">SEO Meta Title</label>
            <input
              type="text"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              placeholder="e.g. Standard Visiting Cards | Premium 350 GSM Card Printing"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-border bg-paper/30"
            />
            <p className="text-[0.6875rem] text-muted-foreground">{seoTitle.length} / 60 characters</p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-ink">SEO Meta Description</label>
            <textarea
              rows={3}
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              placeholder="e.g. Order custom business cards with high definition offset printing, matte lamination, and fast doorstep delivery across India."
              className="w-full p-3.5 text-xs rounded-xl border border-border bg-paper/30 leading-relaxed"
            />
            <p className="text-[0.6875rem] text-muted-foreground">
              {seoDescription.length} / 160 characters
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-ink">Canonical URL Override (Optional)</label>
            <input
              type="text"
              value={canonicalUrl}
              onChange={(e) => setCanonicalUrl(e.target.value)}
              placeholder="https://printstudio.in/product/standard-visiting-cards"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-border bg-paper/30 font-mono"
            />
          </div>
        </div>
      )}
    </div>
  );
}
