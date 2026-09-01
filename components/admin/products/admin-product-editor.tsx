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
  Upload,
  Layers,
  Sparkles,
  DollarSign,
  Package,
  Truck,
  Search,
  History,
  Copy,
  Sliders,
  Image as ImageIcon,
  Check,
  Eye,
  RefreshCw,
  Folder,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type {
  DatabaseProduct,
  DatabaseCategory,
  DatabaseProductMedia,
  DatabaseProductVariant,
  DatabaseAttributeDefinition,
  DatabaseCatalogAuditLog,
  ProductStatus,
  ProductVisibility,
} from "@/lib/catalogue/types";
import {
  saveProductAction,
  updateProductStatusAction,
  duplicateProductAction,
} from "@/lib/catalogue/mutations";
import {
  uploadProductMediaAction,
  deleteProductMediaAction,
} from "@/lib/storage/product-media";
import {
  fetchAllAttributeDefinitions,
  fetchCategoryAttributeTemplates,
} from "@/lib/catalogue/attributes";
import { validateAttributeValue } from "@/lib/catalogue/attribute-utils";
import {
  generateVariantsFromOptions,
  makeOptionKey,
} from "@/lib/catalogue/variants";
import {
  normalizeHandle,
  normalizeSKU,
  calculateProductHealth,
} from "@/lib/catalogue/validation";
import { calculateAuthoritativePrice } from "@/lib/pricing/engine";
import { toast } from "sonner";

interface AdminProductEditorProps {
  initialProduct?: DatabaseProduct | null;
  categories: DatabaseCategory[];
  auditLogs?: DatabaseCatalogAuditLog[];
}

type TabKey =
  | "general"
  | "media"
  | "categories"
  | "attributes"
  | "variants"
  | "customization"
  | "pricing"
  | "manufacturing"
  | "shipping"
  | "merchandising"
  | "seo"
  | "audit";

export function AdminProductEditor({
  initialProduct,
  categories,
  auditLogs = [],
}: AdminProductEditorProps) {
  const router = useRouter();
  const isNew = !initialProduct;

  const [activeTab, setActiveTab] = React.useState<TabKey>("general");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);

  const tabContainerRef = React.useRef<HTMLDivElement>(null);

  const scrollTabs = (direction: "left" | "right") => {
    if (tabContainerRef.current) {
      const scrollAmount = direction === "left" ? -260 : 260;
      tabContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleTabWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (tabContainerRef.current && e.deltaY !== 0) {
      tabContainerRef.current.scrollLeft += e.deltaY;
    }
  };

  // Form state: Tab 1 (General)
  const [title, setTitle] = React.useState(initialProduct?.title || "");
  const [handle, setHandle] = React.useState(initialProduct?.handle || "");
  const [sku, setSku] = React.useState(initialProduct?.sku || "");
  const [subtitle, setSubtitle] = React.useState(initialProduct?.subtitle || "");
  const [description, setDescription] = React.useState(initialProduct?.description || "");
  const [status, setStatus] = React.useState<ProductStatus>(initialProduct?.status || "draft");
  const [visibility, setVisibility] = React.useState<ProductVisibility>(
    initialProduct?.visibility || "public"
  );
  const [productType, setProductType] = React.useState(initialProduct?.product_type || "Print");
  const [brand, setBrand] = React.useState(initialProduct?.brand || "Doon Print Studio");
  const [tags, setTags] = React.useState<string[]>(initialProduct?.tags || []);
  const [tagInput, setTagInput] = React.useState("");
  const [badges, setBadges] = React.useState<string[]>(initialProduct?.badges || []);

  // Form state: Tab 2 (Media)
  const [mediaList, setMediaList] = React.useState<DatabaseProductMedia[]>(
    initialProduct?.media || []
  );
  const [isUploadingMedia, setIsUploadingMedia] = React.useState(false);

  // Form state: Tab 3 (Categories)
  const [selectedCategoryIds, setSelectedCategoryIds] = React.useState<string[]>(
    initialProduct?.categories?.map((c) => c.id) || []
  );

  // Form state: Tab 4 (Dynamic Attributes)
  const [availableAttributes, setAvailableAttributes] = React.useState<
    DatabaseAttributeDefinition[]
  >([]);
  const [attributeValues, setAttributeValues] = React.useState<Record<string, unknown>>(() => {
    const initial: Record<string, unknown> = {};
    initialProduct?.attributes?.forEach((av) => {
      initial[av.attribute_id] = av.value;
    });
    return initial;
  });

  const [isDragging, setIsDragging] = React.useState(false);

  // Form state: Tab 5 & 6 (Options & Variants)
  const [options, setOptions] = React.useState<Array<{ name: string; values: string[] }>>(
    initialProduct?.options?.map((o) => ({ name: o.name, values: o.values })) || [
      { name: "Paper Type", values: ["350 GSM Art Card", "400 GSM Velvet"] },
      { name: "Finish", values: ["Matte", "Gloss"] },
    ]
  );
  const [variants, setVariants] = React.useState<DatabaseProductVariant[]>(
    initialProduct?.variants || []
  );

  // Form state: Tab 6 (Customization & Artwork)
  const [requiresArtwork, setRequiresArtwork] = React.useState(
    initialProduct?.requires_artwork ?? true
  );
  const [requiresProof, setRequiresProof] = React.useState(
    initialProduct?.requires_proof ?? true
  );
  const [customizable, setCustomizable] = React.useState(
    initialProduct?.customizable ?? true
  );
  const [uploadOnly, setUploadOnly] = React.useState(initialProduct?.upload_only || false);
  const [dimensionPricingEnabled, setDimensionPricingEnabled] = React.useState(
    initialProduct?.customization_config?.dimensionPricing?.enabled || false
  );
  const [dimensionUnit, setDimensionUnit] = React.useState<"ft" | "inch" | "cm">(
    initialProduct?.customization_config?.dimensionPricing?.unit || "ft"
  );
  const [dimensionRateMinor, setDimensionRateMinor] = React.useState<number>(
    initialProduct?.customization_config?.dimensionPricing?.ratePerSqUnitMinor || 12000
  );

  // Form state: Tab 7 (Pricing & Tiers)
  const [basePriceMinor, setBasePriceMinor] = React.useState(
    initialProduct?.base_price_minor || 19900
  );
  const [compareAtPriceMinor, setCompareAtPriceMinor] = React.useState<number | null>(
    initialProduct?.compare_at_price_minor ?? null
  );
  const [costPriceMinor, setCostPriceMinor] = React.useState<number | null>(
    initialProduct?.cost_price_minor ?? Math.round((initialProduct?.base_price_minor || 19900) * 0.6)
  );
  const [salePriceMinor, setSalePriceMinor] = React.useState<number | null>(
    initialProduct?.sale_price_minor ?? null
  );
  const [saleStartsAt, setSaleStartsAt] = React.useState(
    initialProduct?.sale_starts_at ? initialProduct.sale_starts_at.slice(0, 16) : ""
  );
  const [saleEndsAt, setSaleEndsAt] = React.useState(
    initialProduct?.sale_ends_at ? initialProduct.sale_ends_at.slice(0, 16) : ""
  );
  const [quantityTiers, setQuantityTiers] = React.useState<
    Array<{ min_quantity: number; max_quantity?: number | null; tier_price_minor: number; discount_percent?: number }>
  >([
    { min_quantity: 1, max_quantity: 9, tier_price_minor: 19900 },
    { min_quantity: 10, max_quantity: 24, tier_price_minor: 17900, discount_percent: 10 },
    { min_quantity: 25, max_quantity: 49, tier_price_minor: 15900, discount_percent: 20 },
    { min_quantity: 50, max_quantity: null, tier_price_minor: 13900, discount_percent: 30 },
  ]);

  // Form state: Tab 8 (Manufacturing)
  const [unit, setUnit] = React.useState(initialProduct?.unit || "pieces");
  const [minOrderQty, setMinOrderQty] = React.useState(initialProduct?.min_order_qty || 1);
  const [qtyIncrement, setQtyIncrement] = React.useState(initialProduct?.qty_increment || 1);
  const [turnaroundDays, setTurnaroundDays] = React.useState(
    initialProduct?.turnaround_days || 3
  );
  const [sameDayEligible, setSameDayEligible] = React.useState(
    initialProduct?.same_day_eligible || false
  );
  const [bulkEligible, setBulkEligible] = React.useState(initialProduct?.bulk_eligible ?? true);
  const [sortOrder, setSortOrder] = React.useState(initialProduct?.sort_order || 0);

  // Form state: Tab 9 (Shipping)
  const [shippingWeightGrams, setShippingWeightGrams] = React.useState(
    initialProduct?.shipping_config?.weightGrams || 250
  );
  const [isFragile, setIsFragile] = React.useState(
    initialProduct?.shipping_config?.isFragile || false
  );

  // Form state: Tab 10 (Merchandising)
  const [isFeatured, setIsFeatured] = React.useState(initialProduct?.is_featured || false);
  const [relatedHandlesStr, setRelatedHandlesStr] = React.useState(
    initialProduct?.merchandising_config?.relatedProductHandles?.join(", ") || ""
  );

  // Form state: Tab 11 (SEO)
  const [seoTitle, setSeoTitle] = React.useState(initialProduct?.seo_title || "");
  const [seoDescription, setSeoDescription] = React.useState(
    initialProduct?.seo_description || ""
  );
  const [canonicalUrl, setCanonicalUrl] = React.useState(initialProduct?.canonical_url || "");
  const [ogTitle, setOgTitle] = React.useState(initialProduct?.og_title || "");
  const [ogDescription, setOgDescription] = React.useState(initialProduct?.og_description || "");

  // Optimistic locking
  const [version, setVersion] = React.useState(initialProduct?.version || 1);

  // Load all available attribute definitions
  React.useEffect(() => {
    fetchAllAttributeDefinitions().then(setAvailableAttributes);
  }, []);

  // Track changes
  const markDirty = () => setHasUnsavedChanges(true);

  // Auto-generate slug and SKU if creating a new product
  const handleTitleChange = (val: string) => {
    setTitle(val);
    markDirty();
    if (isNew && (!handle || handle === normalizeHandle(title))) {
      setHandle(normalizeHandle(val));
    }
    if (isNew && (!sku || sku.startsWith("PRT-"))) {
      setSku(`PRT-${normalizeSKU(val).slice(0, 10)}-001`);
    }
  };

  // Generate Cartesian Variants
  const handleGenerateVariants = () => {
    const generated = generateVariantsFromOptions({
      productId: initialProduct?.id,
      baseSku: sku || "PRT-PROD",
      basePriceMinor: Number(basePriceMinor),
      options: options as any,
      existingVariants: variants,
    });
    setVariants(generated);
    markDirty();
    toast.success(`Generated ${generated.length} variant combinations.`);
  };

  // Upload Media
  const uploadFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0 || !initialProduct?.id) {
      if (!initialProduct?.id) {
        toast.error("Please save the product draft once before uploading images.");
      }
      return;
    }

    if (files.length > 10) {
      toast.error("You can only upload up to 10 images at once.");
      return;
    }

    setIsUploadingMedia(true);
    let successCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("productId", initialProduct.id);
      formData.append("isPrimary", mediaList.length === 0 && i === 0 ? "true" : "false");
      formData.append("sortOrder", String((mediaList.length + i) * 10));

      const res = await uploadProductMediaAction(formData);
      if (res.success && res.media) {
        setMediaList((prev) => [...prev, res.media!]);
        successCount++;
      } else {
        toast.error(res.error || `Failed to upload ${file.name}`);
      }
    }

    setIsUploadingMedia(false);
    if (successCount > 0) {
      toast.success(`Uploaded ${successCount} images.`);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      await uploadFiles(e.target.files);
    }
    // Reset input value to allow uploading the same file again if deleted
    e.target.value = "";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (isUploadingMedia) return;

    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    );
    
    if (files.length === 0) {
      toast.error("Please drop valid image files (JPG, PNG, WEBP).");
      return;
    }
    
    await uploadFiles(files);
  };

  // Delete Media
  const handleDeleteMedia = async (mediaId: string) => {
    const res = await deleteProductMediaAction(mediaId);
    if (res.success) {
      setMediaList(mediaList.filter((m) => m.id !== mediaId));
      toast.success("Image deleted.");
    } else {
      toast.error(res.error || "Failed to delete image.");
    }
  };

  // Set Primary Media
  const handleSetPrimaryMedia = (mediaId: string) => {
    setMediaList(
      mediaList.map((m) => ({
        ...m,
        is_primary: m.id === mediaId,
      }))
    );
    markDirty();
    toast.success("Primary image updated.");
  };

  // Save Product
  const handleSave = async (targetStatus?: ProductStatus) => {
    setIsSubmitting(true);
    const nextStatus = targetStatus || status;

    const relatedHandles = relatedHandlesStr
      .split(",")
      .map((h) => h.trim())
      .filter(Boolean);

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
      brand: brand.trim(),
      tags,
      badges,
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
      base_price_minor: Number(basePriceMinor),
      compare_at_price_minor: compareAtPriceMinor ? Number(compareAtPriceMinor) : null,
      cost_price_minor: costPriceMinor ? Number(costPriceMinor) : null,
      sale_price_minor: salePriceMinor ? Number(salePriceMinor) : null,
      sale_starts_at: saleStartsAt ? new Date(saleStartsAt).toISOString() : null,
      sale_ends_at: saleEndsAt ? new Date(saleEndsAt).toISOString() : null,
      customization_config: {
        requiresArtworkUpload: requiresArtwork,
        requiresProofApproval: requiresProof,
        enableCanvasCustomizer: customizable && !uploadOnly,
        dimensionPricing: {
          enabled: dimensionPricingEnabled,
          unit: dimensionUnit,
          ratePerSqUnitMinor: Number(dimensionRateMinor),
        },
      },
      shipping_config: {
        weightGrams: Number(shippingWeightGrams),
        isFragile,
      },
      merchandising_config: {
        relatedProductHandles: relatedHandles,
      },
      seo_title: seoTitle.trim() || null,
      seo_description: seoDescription.trim() || null,
      canonical_url: canonicalUrl.trim() || null,
      og_title: ogTitle.trim() || null,
      og_description: ogDescription.trim() || null,
      no_index: false,
      category_ids: selectedCategoryIds,
      options,
      variants,
      attribute_values: Object.entries(attributeValues).map(([attrId, val]) => ({
        attribute_id: attrId,
        value: val,
      })),
      quantity_tiers: quantityTiers,
    };

    const res = await saveProductAction(payload);
    setIsSubmitting(false);

    if (res.success) {
      toast.success("Product saved successfully!");
      setHasUnsavedChanges(false);
      if (res.version) setVersion(res.version);
      if (targetStatus) setStatus(targetStatus);
      if (isNew && res.productId) {
        router.push(`/admin/products/${res.productId}`);
      }
    } else {
      toast.error(res.error || "Failed to save product.");
    }
  };

  const handleStatusChange = async (newStatus: ProductStatus) => {
    if (isNew || hasUnsavedChanges) {
      return handleSave(newStatus);
    }
    
    if (!initialProduct?.id) return;
    
    setIsSubmitting(true);
    const res = await updateProductStatusAction(initialProduct.id, newStatus);
    setIsSubmitting(false);
    
    if (res.success) {
      toast.success(`Product status updated to ${newStatus}`);
      setStatus(newStatus);
      if (version) setVersion(version + 1);
    } else {
      toast.error(res.error || "Failed to update product status.");
    }
  };

  // Duplicate Product
  const handleDuplicate = async () => {
    if (!initialProduct?.id) return;
    setIsSubmitting(true);
    const res = await duplicateProductAction(initialProduct.id);
    setIsSubmitting(false);

    if (res.success && res.newProductId) {
      toast.success("Product duplicated successfully!");
      router.push(`/admin/products/${res.newProductId}`);
    } else {
      toast.error(res.error || "Failed to duplicate product.");
    }
  };

  // Health Score Calculation
  const healthReport = calculateProductHealth({
    title,
    sku,
    description,
    base_price_minor: basePriceMinor,
    categories: selectedCategoryIds.map((id) => ({ id } as any)),
    media: mediaList,
    seo_title: seoTitle,
    seo_description: seoDescription,
  });

  // Price Simulation Preview
  const pricePreview = calculateAuthoritativePrice({
    product: {
      id: initialProduct?.id || "preview",
      title,
      handle,
      basePriceMinor: Number(basePriceMinor),
      salePriceMinor: salePriceMinor ? Number(salePriceMinor) : null,
      saleStartsAt,
      saleEndsAt,
      customizationConfig: {
        dimensionPricing: {
          enabled: dimensionPricingEnabled,
          unit: dimensionUnit,
          ratePerSqUnitMinor: Number(dimensionRateMinor),
        },
      },
    },
    quantity: Number(minOrderQty) || 1,
  });

  const tabs: Array<{ key: TabKey; label: string; icon: any }> = [
    { key: "general", label: "General", icon: Layers },
    { key: "media", label: `Media (${mediaList.length})`, icon: ImageIcon },
    { key: "categories", label: "Categories", icon: Folder },
    { key: "attributes", label: "Dynamic Attributes", icon: Sliders },
    { key: "variants", label: `Variants (${variants.length})`, icon: Sparkles },
    { key: "customization", label: "Customization & Proof", icon: Upload },
    { key: "pricing", label: "Pricing & Tiers", icon: DollarSign },
    { key: "manufacturing", label: "Manufacturing", icon: Package },
    { key: "shipping", label: "Shipping", icon: Truck },
    { key: "merchandising", label: "Merchandising", icon: Plus },
    { key: "seo", label: "SEO & Social", icon: Search },
    { key: "audit", label: `Audit Log (${auditLogs.length})`, icon: History },
  ];

  return (
    <div className="space-y-6 pb-24">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="flex size-9 items-center justify-center rounded-xl border border-border bg-white text-muted-foreground hover:bg-paper hover:text-ink transition-colors"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-xl font-black text-ink sm:text-2xl">
                {title ? title : "New Product"}
              </h1>
              <span
                className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                  status === "active"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : status === "paused"
                    ? "bg-amber-50 text-amber-700 border border-amber-200"
                    : "bg-paper-deep text-muted-foreground border border-border"
                }`}
              >
                {status}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
              <span>SKU: {sku || "—"}</span>
              <span>•</span>
              <span>Slug: /product/{handle || "—"}</span>
              <span>•</span>
              <span className="font-mono font-bold text-violet">Version v{version}</span>
            </div>
          </div>
        </div>

        {/* Health Score & Quick Actions */}
        <div className="flex items-center gap-2.5">
          <div className="hidden md:flex items-center gap-2 rounded-xl border border-border bg-white px-3 py-1.5 shadow-xs">
            <div className="text-right text-[11px]">
              <div className="font-bold text-ink">Completeness</div>
              <div className="text-[10px] text-muted-foreground">{healthReport.status}</div>
            </div>
            <div className="relative flex size-8 items-center justify-center rounded-full bg-violet-wash font-mono text-xs font-bold text-violet">
              {healthReport.score}%
            </div>
          </div>

          {!isNew && (
            <button
              onClick={handleDuplicate}
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-white px-3.5 py-2 text-xs font-bold text-ink shadow-xs hover:bg-paper transition-colors"
            >
              <Copy className="size-3.5" />
              <span>Duplicate</span>
            </button>
          )}

          {!isNew && (
            <Link
              href={`/product/${handle}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-white px-3.5 py-2 text-xs font-bold text-ink shadow-xs hover:bg-paper transition-colors"
            >
              <Eye className="size-3.5" />
              <span>Storefront View</span>
            </Link>
          )}
        </div>
      </div>

      {/* Tab Navigation Bar with Left/Right Buttons & Wheel Scroll */}
      <div className="relative flex items-center gap-2 border-b border-border pb-2">
        {/* Left Arrow Button */}
        <button
          type="button"
          onClick={() => scrollTabs("left")}
          className="flex size-8 shrink-0 items-center justify-center rounded-xl border border-border bg-white text-muted-foreground shadow-xs hover:bg-paper hover:text-ink active:scale-95 transition-all"
          title="Scroll Left"
          aria-label="Scroll Tabs Left"
        >
          <ChevronLeft className="size-4" />
        </button>

        {/* Scrollable Tab Strip */}
        <div
          ref={tabContainerRef}
          onWheel={handleTabWheel}
          className="flex flex-1 items-center gap-1.5 overflow-x-auto scroll-smooth py-1 scrollbar-thin"
          style={{ scrollbarWidth: "thin" }}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-bold transition-all shrink-0 ${
                  isActive
                    ? "bg-violet text-white shadow-sm ring-2 ring-violet/20"
                    : "bg-white text-muted-foreground hover:bg-paper hover:text-ink border border-border"
                }`}
              >
                <Icon className="size-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Arrow Button */}
        <button
          type="button"
          onClick={() => scrollTabs("right")}
          className="flex size-8 shrink-0 items-center justify-center rounded-xl border border-border bg-white text-muted-foreground shadow-xs hover:bg-paper hover:text-ink active:scale-95 transition-all"
          title="Scroll Right"
          aria-label="Scroll Tabs Right"
        >
          <ChevronRight className="size-4" />
        </button>

        {/* Quick Jump Dropdown */}
        <div className="hidden sm:block shrink-0">
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value as TabKey)}
            className="rounded-xl border border-border bg-white px-3 py-2 text-xs font-bold text-ink focus:border-violet focus:outline-none shadow-xs"
            aria-label="Jump to tab"
          >
            {tabs.map((t) => (
              <option key={t.key} value={t.key}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* TAB CONTENT CONTAINER */}
      <div className="rounded-2xl border border-border bg-white p-6 shadow-sheet">
        {/* TAB 1: GENERAL INFORMATION */}
        {activeTab === "general" && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <h2 className="font-display text-base font-bold text-ink">General Information</h2>
              <p className="text-xs text-muted-foreground">
                Core identity, SKU, naming, brand, visibility, and descriptions.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="font-bold text-xs text-ink block mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full rounded-xl border border-border px-3.5 py-2 text-xs focus:border-violet focus:outline-none"
                  placeholder="e.g. Custom Premium Visiting Cards"
                />
              </div>

              <div>
                <label className="font-bold text-xs text-ink block mb-1">SKU (Master SKU) *</label>
                <input
                  type="text"
                  required
                  value={sku}
                  onChange={(e) => {
                    setSku(normalizeSKU(e.target.value));
                    markDirty();
                  }}
                  className="w-full rounded-xl border border-border px-3.5 py-2 font-mono text-xs focus:border-violet focus:outline-none"
                  placeholder="PRT-CARD-001"
                />
              </div>

              <div>
                <label className="font-bold text-xs text-ink block mb-1">URL Slug (Handle) *</label>
                <input
                  type="text"
                  required
                  value={handle}
                  onChange={(e) => {
                    setHandle(normalizeHandle(e.target.value));
                    markDirty();
                  }}
                  className="w-full rounded-xl border border-border px-3.5 py-2 font-mono text-xs focus:border-violet focus:outline-none"
                  placeholder="visiting-cards"
                />
              </div>

              <div>
                <label className="font-bold text-xs text-ink block mb-1">Product Type</label>
                <select
                  value={productType}
                  onChange={(e) => {
                    setProductType(e.target.value);
                    markDirty();
                  }}
                  className="w-full rounded-xl border border-border px-3.5 py-2 text-xs focus:border-violet focus:outline-none bg-white"
                >
                  <option value="Print">Print Product</option>
                  <option value="Apparel">Apparel & Garments</option>
                  <option value="Gift">Gifts & Keepsakes</option>
                  <option value="Stationery">Office Stationery</option>
                  <option value="Packaging">Labels & Packaging</option>
                  <option value="Signage">Signage & Display Board</option>
                  <option value="Framed">Frames & Wall Art</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-xs text-ink block mb-1">Brand</label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => {
                    setBrand(e.target.value);
                    markDirty();
                  }}
                  className="w-full rounded-xl border border-border px-3.5 py-2 text-xs focus:border-violet focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-xs text-ink block mb-1">Visibility Status</label>
                <select
                  value={visibility}
                  onChange={(e) => {
                    setVisibility(e.target.value as ProductVisibility);
                    markDirty();
                  }}
                  className="w-full rounded-xl border border-border px-3.5 py-2 text-xs focus:border-violet focus:outline-none bg-white"
                >
                  <option value="public">Public (Visible Everywhere)</option>
                  <option value="hidden">Hidden (Storefront Hidden)</option>
                  <option value="catalog_only">Catalog Listing Only</option>
                  <option value="search_only">Search Results Only</option>
                  <option value="direct_link_only">Direct Link Only</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-xs text-ink block mb-1">Publishing Status</label>
                <select
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value as ProductStatus);
                    markDirty();
                  }}
                  className="w-full rounded-xl border border-border px-3.5 py-2 text-xs focus:border-violet focus:outline-none bg-white"
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active (Published)</option>
                  <option value="paused">Paused (Purchases Blocked)</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-xs text-ink block mb-1">Subtitle / Tagline</label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => {
                    setSubtitle(e.target.value);
                    markDirty();
                  }}
                  className="w-full rounded-xl border border-border px-3.5 py-2 text-xs focus:border-violet focus:outline-none"
                  placeholder="e.g. 350 GSM premium matte art card with crisp CMYK precision"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-xs text-ink block mb-1">Detailed Description</label>
                <textarea
                  rows={5}
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    markDirty();
                  }}
                  className="w-full rounded-xl border border-border px-3.5 py-2 text-xs focus:border-violet focus:outline-none"
                  placeholder="Describe substrate materials, print technology, finish textures..."
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MEDIA MANAGER */}
        {activeTab === "media" && (
          <div 
            className={`space-y-6 rounded-2xl border-2 transition-all p-4 ${
              isDragging ? "border-violet bg-violet-wash/30 border-dashed" : "border-transparent"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-base font-bold text-ink">Product Media Gallery</h2>
                <p className="text-xs text-muted-foreground">
                  Drag and drop up to 10 images, or browse to upload.
                </p>
              </div>

              <label className="inline-flex items-center gap-1.5 rounded-xl bg-violet px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-violet-lift cursor-pointer transition-colors">
                <Upload className="size-4" />
                <span>{isUploadingMedia ? "Uploading..." : "Upload Images"}</span>
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  onChange={handleFileUpload}
                  disabled={isUploadingMedia}
                  className="hidden"
                />
              </label>
            </div>

            {mediaList.length === 0 ? (
              <div className={`rounded-2xl border-2 border-dashed border-border bg-paper/30 p-12 text-center pointer-events-none transition-colors ${isDragging ? 'border-violet text-violet' : ''}`}>
                <ImageIcon className={`size-10 mx-auto mb-2 opacity-50 ${isDragging ? 'text-violet opacity-100' : 'text-muted-foreground'}`} />
                <div className="font-bold text-xs text-ink">{isDragging ? "Drop images here" : "No product images uploaded yet"}</div>
                <p className="text-[11px] text-muted-foreground mt-1 max-w-sm mx-auto">
                  Drag & drop high-resolution photography or product mockups here (JPG, PNG, WEBP, up to 15MB). Up to 10 at once.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {mediaList.map((media, idx) => (
                  <div
                    key={media.id || idx}
                    className={`group relative rounded-2xl border overflow-hidden bg-white shadow-xs transition-all ${
                      media.is_primary ? "border-violet ring-2 ring-violet/20" : "border-border"
                    }`}
                  >
                    <div className="aspect-square bg-paper flex items-center justify-center overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={media.url}
                        alt={media.alt_text || "Product image"}
                        className="size-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <div className="p-2.5 bg-white space-y-1.5">
                      <div className="flex items-center justify-between text-[10px]">
                        {media.is_primary ? (
                          <span className="inline-flex items-center gap-1 font-bold text-violet bg-violet-wash px-1.5 py-0.5 rounded">
                            <Check className="size-3" /> Primary
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSetPrimaryMedia(media.id)}
                            className="font-semibold text-muted-foreground hover:text-violet"
                          >
                            Set Primary
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleDeleteMedia(media.id)}
                          className="text-muted-foreground hover:text-red-600 p-1"
                          title="Delete image"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>

                      <input
                        type="text"
                        value={media.alt_text || ""}
                        onChange={(e) => {
                          const next = [...mediaList];
                          next[idx].alt_text = e.target.value;
                          setMediaList(next);
                          markDirty();
                        }}
                        className="w-full rounded border border-border px-2 py-1 text-[10px] text-muted-foreground focus:border-violet focus:outline-none"
                        placeholder="Alt text"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CATEGORIES ASSIGNMENT */}
        {activeTab === "categories" && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <h2 className="font-display text-base font-bold text-ink">Category Assignment</h2>
              <p className="text-xs text-muted-foreground">
                Assign this product to one or more store categories and navigation hierarchies.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {categories.map((cat) => {
                const isSelected = selectedCategoryIds.includes(cat.id);
                return (
                  <label
                    key={cat.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? "border-violet bg-violet-wash/50 text-ink"
                        : "border-border bg-white text-muted-foreground hover:bg-paper"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => {
                        markDirty();
                        if (e.target.checked) {
                          setSelectedCategoryIds([...selectedCategoryIds, cat.id]);
                        } else {
                          setSelectedCategoryIds(selectedCategoryIds.filter((id) => id !== cat.id));
                        }
                      }}
                      className="size-4 rounded border-border text-violet focus:ring-violet"
                    />
                    <div>
                      <div className="font-bold text-xs text-ink">{cat.title}</div>
                      <div className="text-[10px] text-muted-foreground font-mono">
                        /category/{cat.handle}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: DYNAMIC ATTRIBUTES */}
        {activeTab === "attributes" && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <h2 className="font-display text-base font-bold text-ink">Dynamic Product Attributes</h2>
              <p className="text-xs text-muted-foreground">
                Values for category-inherited templates and global product attributes.
              </p>
            </div>

            <div className="space-y-4">
              {availableAttributes.map((attr) => {
                const currentVal = attributeValues[attr.id];
                return (
                  <div key={attr.id} className="rounded-xl border border-border p-4 bg-white space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-xs text-ink">{attr.name}</span>
                        {attr.unit && (
                          <span className="ml-1 text-[11px] font-mono text-muted-foreground">
                            ({attr.unit})
                          </span>
                        )}
                        {attr.is_required && <span className="text-red-500 ml-1">*</span>}
                      </div>
                      <span className="font-mono text-[10px] text-violet bg-violet-wash px-2 py-0.5 rounded">
                        {attr.type}
                      </span>
                    </div>

                    {/* SELECT / SWATCH */}
                    {["SELECT", "COLOUR_SWATCH", "RADIO"].includes(attr.type) && (
                      <select
                        value={String(currentVal || "")}
                        onChange={(e) => {
                          setAttributeValues({
                            ...attributeValues,
                            [attr.id]: e.target.value,
                          });
                          markDirty();
                        }}
                        className="w-full rounded-xl border border-border px-3.5 py-2 text-xs focus:border-violet focus:outline-none bg-white"
                      >
                        <option value="">-- Select {attr.name} --</option>
                        {attr.allowed_values?.map((opt, i) => (
                          <option key={i} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    )}

                    {/* NUMBER / DIMENSION */}
                    {["NUMBER", "DECIMAL", "DIMENSION", "WEIGHT", "CURRENCY"].includes(attr.type) && (
                      <input
                        type="number"
                        value={currentVal !== undefined ? Number(currentVal) : ""}
                        onChange={(e) => {
                          setAttributeValues({
                            ...attributeValues,
                            [attr.id]: Number(e.target.value),
                          });
                          markDirty();
                        }}
                        className="w-full rounded-xl border border-border px-3.5 py-2 text-xs focus:border-violet focus:outline-none"
                        placeholder={`Enter ${attr.name}`}
                      />
                    )}

                    {/* TEXT */}
                    {["TEXT", "TEXTAREA"].includes(attr.type) && (
                      <input
                        type="text"
                        value={String(currentVal || "")}
                        onChange={(e) => {
                          setAttributeValues({
                            ...attributeValues,
                            [attr.id]: e.target.value,
                          });
                          markDirty();
                        }}
                        className="w-full rounded-xl border border-border px-3.5 py-2 text-xs focus:border-violet focus:outline-none"
                        placeholder={`Enter ${attr.name}`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 5: VARIANTS MATRIX */}
        {activeTab === "variants" && (
          <div className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-display text-base font-bold text-ink">Variant Matrix</h2>
                <p className="text-xs text-muted-foreground">
                  Individual purchasable units with custom SKUs, prices, sale rates, and inventory.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleGenerateVariants}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-violet px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-violet-lift transition-colors"
                >
                  <RefreshCw className="size-3.5" />
                  <span>Generate All Combinations</span>
                </button>
              </div>
            </div>

            {/* Options Builder Section */}
            <div className="rounded-xl border border-border bg-paper/30 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-ink">Product Options Driving Variants</span>
                <button
                  type="button"
                  onClick={() => {
                    setOptions([...options, { name: "New Option", values: ["Value 1"] }]);
                    markDirty();
                  }}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-violet hover:underline"
                >
                  <Plus className="size-3" /> Add Option
                </button>
              </div>

              <div className="space-y-2">
                {options.map((opt, optIdx) => (
                  <div key={optIdx} className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <input
                      type="text"
                      value={opt.name}
                      onChange={(e) => {
                        const next = [...options];
                        next[optIdx].name = e.target.value;
                        setOptions(next);
                        markDirty();
                      }}
                      className="w-48 rounded-xl border border-border px-3 py-1.5 text-xs font-bold text-ink focus:border-violet focus:outline-none"
                      placeholder="Option Name (e.g. Size)"
                    />
                    <input
                      type="text"
                      value={opt.values.join(", ")}
                      onChange={(e) => {
                        const next = [...options];
                        next[optIdx].values = e.target.value.split(",").map((s) => s.trim());
                        setOptions(next);
                        markDirty();
                      }}
                      className="flex-1 rounded-xl border border-border px-3 py-1.5 text-xs focus:border-violet focus:outline-none"
                      placeholder="Comma-separated values (e.g. S, M, L, XL)"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setOptions(options.filter((_, i) => i !== optIdx));
                        markDirty();
                      }}
                      className="p-1.5 text-muted-foreground hover:text-red-600"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Variants Table */}
            {variants.length > 0 ? (
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-border bg-paper text-muted-foreground font-mono uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-2.5">Variant</th>
                      <th className="px-4 py-2.5">SKU</th>
                      <th className="px-4 py-2.5">Price (₹)</th>
                      <th className="px-4 py-2.5">Sale (₹)</th>
                      <th className="px-4 py-2.5">Stock</th>
                      <th className="px-4 py-2.5">Status</th>
                      <th className="px-4 py-2.5 text-right">Delete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {variants.map((v, vIdx) => (
                      <tr key={v.id || vIdx} className="hover:bg-paper/30 transition-colors">
                        <td className="px-4 py-2.5 font-bold text-ink">{v.title}</td>
                        <td className="px-4 py-2.5">
                          <input
                            type="text"
                            value={v.sku}
                            onChange={(e) => {
                              const next = [...variants];
                              next[vIdx].sku = normalizeSKU(e.target.value);
                              setVariants(next);
                              markDirty();
                            }}
                            className="w-36 rounded-lg border border-border px-2 py-1 font-mono text-xs focus:border-violet focus:outline-none"
                          />
                        </td>
                        <td className="px-4 py-2.5">
                          <input
                            type="number"
                            value={v.price_minor !== null ? Math.round(v.price_minor / 100) : Math.round(basePriceMinor / 100)}
                            onChange={(e) => {
                              const next = [...variants];
                              next[vIdx].price_minor = e.target.value
                                ? Math.round(Number(e.target.value) * 100)
                                : null;
                              setVariants(next);
                              markDirty();
                            }}
                            className="w-24 rounded-lg border border-border px-2 py-1 font-mono text-xs focus:border-violet focus:outline-none"
                          />
                        </td>
                        <td className="px-4 py-2.5">
                          <input
                            type="number"
                            value={v.sale_price_minor ? Math.round(v.sale_price_minor / 100) : ""}
                            onChange={(e) => {
                              const next = [...variants];
                              next[vIdx].sale_price_minor = e.target.value
                                ? Math.round(Number(e.target.value) * 100)
                                : null;
                              setVariants(next);
                              markDirty();
                            }}
                            placeholder="—"
                            className="w-24 rounded-lg border border-border px-2 py-1 font-mono text-xs focus:border-violet focus:outline-none"
                          />
                        </td>
                        <td className="px-4 py-2.5">
                          <input
                            type="number"
                            value={v.inventory_quantity}
                            onChange={(e) => {
                              const next = [...variants];
                              next[vIdx].inventory_quantity = Number(e.target.value);
                              setVariants(next);
                              markDirty();
                            }}
                            className="w-20 rounded-lg border border-border px-2 py-1 font-mono text-xs focus:border-violet focus:outline-none"
                          />
                        </td>
                        <td className="px-4 py-2.5">
                          <select
                            value={v.status}
                            onChange={(e) => {
                              const next = [...variants];
                              next[vIdx].status = e.target.value as "active" | "paused" | "archived";
                              setVariants(next);
                              markDirty();
                            }}
                            className="rounded-lg border border-border px-2 py-1 text-xs focus:border-violet focus:outline-none bg-white"
                          >
                            <option value="active">Active</option>
                            <option value="paused">Paused</option>
                            <option value="archived">Archived</option>
                          </select>
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              setVariants(variants.filter((_, i) => i !== vIdx));
                              markDirty();
                            }}
                            className="p-1 text-muted-foreground hover:text-red-600"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border p-8 text-center text-xs text-muted-foreground">
                No variants configured. Click &ldquo;Generate All Combinations&rdquo; above.
              </div>
            )}
          </div>
        )}

        {/* TAB 6: CUSTOMIZATION & ARTWORK PROOF */}
        {activeTab === "customization" && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <h2 className="font-display text-base font-bold text-ink">
                Customer Customization & Pre-Press Rules
              </h2>
              <p className="text-xs text-muted-foreground">
                Control artwork requirements, digital soft-proof approval, and area-based pricing.
              </p>
            </div>

            <div className="space-y-4">
              <label className="flex items-start gap-3 p-4 rounded-xl border border-border bg-white cursor-pointer hover:bg-paper/30">
                <input
                  type="checkbox"
                  checked={requiresArtwork}
                  onChange={(e) => {
                    setRequiresArtwork(e.target.checked);
                    markDirty();
                  }}
                  className="size-4 mt-0.5 rounded border-border text-violet focus:ring-violet"
                />
                <div>
                  <div className="font-bold text-xs text-ink">
                    Requires High-Resolution PDF/CDR/AI Artwork Upload
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    Enforces that customers must supply print-ready files before checkout.
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 rounded-xl border border-border bg-white cursor-pointer hover:bg-paper/30">
                <input
                  type="checkbox"
                  checked={requiresProof}
                  onChange={(e) => {
                    setRequiresProof(e.target.checked);
                    markDirty();
                  }}
                  className="size-4 mt-0.5 rounded border-border text-violet focus:ring-violet"
                />
                <div>
                  <div className="font-bold text-xs text-ink">
                    Requires Digital Soft-Proof Approval
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    Order workflow holds production release until customer reviews and approves digital PDF soft-proof.
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 rounded-xl border border-border bg-white cursor-pointer hover:bg-paper/30">
                <input
                  type="checkbox"
                  checked={customizable}
                  onChange={(e) => {
                    setCustomizable(e.target.checked);
                    markDirty();
                  }}
                  className="size-4 mt-0.5 rounded border-border text-violet focus:ring-violet"
                />
                <div>
                  <div className="font-bold text-xs text-ink">
                    Enable Interactive Online Canvas Customizer
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    Opens interactive Konva canvas for live in-browser text and image positioning.
                  </div>
                </div>
              </label>

              {/* Dynamic Dimension Pricing Configuration */}
              <div className="rounded-xl border border-border p-4 bg-paper/20 space-y-3">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-ink">
                  <input
                    type="checkbox"
                    checked={dimensionPricingEnabled}
                    onChange={(e) => {
                      setDimensionPricingEnabled(e.target.checked);
                      markDirty();
                    }}
                    className="size-4 rounded border-border text-violet focus:ring-violet"
                  />
                  <span>Enable Custom Dimension Area Pricing (e.g. ₹X per sq ft / sq cm)</span>
                </label>

                {dimensionPricingEnabled && (
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="font-bold text-xs text-ink block mb-1">Dimension Unit</label>
                      <select
                        value={dimensionUnit}
                        onChange={(e) => {
                          setDimensionUnit(e.target.value as "ft" | "inch" | "cm");
                          markDirty();
                        }}
                        className="w-full rounded-xl border border-border px-3 py-2 text-xs focus:border-violet focus:outline-none bg-white"
                      >
                        <option value="ft">Square Feet (sq ft)</option>
                        <option value="inch">Square Inches (sq in)</option>
                        <option value="cm">Square Centimetres (sq cm)</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-bold text-xs text-ink block mb-1">
                        Rate per Unit (Paise / ₹)
                      </label>
                      <input
                        type="number"
                        value={dimensionRateMinor ? Math.round(dimensionRateMinor / 100) : ""}
                        onChange={(e) => {
                          setDimensionRateMinor(Math.round(Number(e.target.value) * 100));
                          markDirty();
                        }}
                        className="w-full rounded-xl border border-border px-3 py-2 text-xs focus:border-violet focus:outline-none bg-white font-mono"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: PRICING & VOLUME TIERS */}
        {activeTab === "pricing" && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <h2 className="font-display text-base font-bold text-ink">Pricing Workspace</h2>
              <p className="text-xs text-muted-foreground">
                Base rates, compare-at retail price, scheduled sales, and quantity tier breaks.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="font-bold text-xs text-ink block mb-1">Base Price (₹) *</label>
                <input
                  type="number"
                  required
                  value={Math.round(basePriceMinor / 100)}
                  onChange={(e) => {
                    setBasePriceMinor(Math.round(Number(e.target.value) * 100));
                    markDirty();
                  }}
                  className="w-full rounded-xl border border-border px-3.5 py-2 font-mono text-xs focus:border-violet focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-xs text-ink block mb-1">Compare-At Price (₹)</label>
                <input
                  type="number"
                  value={compareAtPriceMinor !== null ? Math.round(compareAtPriceMinor / 100) : ""}
                  onChange={(e) => {
                    setCompareAtPriceMinor(e.target.value ? Math.round(Number(e.target.value) * 100) : null);
                    markDirty();
                  }}
                  placeholder="e.g. 299"
                  className="w-full rounded-xl border border-border px-3.5 py-2 font-mono text-xs focus:border-violet focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-xs text-ink block mb-1">Estimated Cost Price (₹)</label>
                <input
                  type="number"
                  value={costPriceMinor !== null ? Math.round(costPriceMinor / 100) : ""}
                  onChange={(e) => {
                    setCostPriceMinor(e.target.value ? Math.round(Number(e.target.value) * 100) : null);
                    markDirty();
                  }}
                  className="w-full rounded-xl border border-border px-3.5 py-2 font-mono text-xs focus:border-violet focus:outline-none"
                />
              </div>
            </div>

            {/* Scheduled Sale Section */}
            <div className="rounded-xl border border-border bg-amber-50/40 p-4 space-y-3 relative group">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-amber-900">Scheduled Promotional Sale</span>
                {(salePriceMinor !== null || saleStartsAt || saleEndsAt) && (
                  <button
                    type="button"
                    onClick={() => {
                      setSalePriceMinor(null);
                      setSaleStartsAt("");
                      setSaleEndsAt("");
                      markDirty();
                    }}
                    className="text-[10px] font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2 py-1 rounded-md transition-colors"
                  >
                    Remove Sale
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div>
                  <label className="font-semibold text-xs text-amber-900 block mb-1">
                    Sale Price (₹)
                  </label>
                  <input
                    type="number"
                    value={salePriceMinor !== null ? Math.round(salePriceMinor / 100) : ""}
                    onChange={(e) => {
                      setSalePriceMinor(e.target.value ? Math.round(Number(e.target.value) * 100) : null);
                      markDirty();
                    }}
                    placeholder="e.g. 149"
                    className="w-full rounded-xl border border-amber-200 bg-white px-3 py-2 font-mono text-xs focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-xs text-amber-900 block mb-1">
                    Sale Starts At
                  </label>
                  <input
                    type="datetime-local"
                    value={saleStartsAt}
                    onChange={(e) => {
                      setSaleStartsAt(e.target.value);
                      markDirty();
                    }}
                    className="w-full rounded-xl border border-amber-200 bg-white px-3 py-2 text-xs focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-xs text-amber-900 block mb-1">
                    Sale Ends At
                  </label>
                  <input
                    type="datetime-local"
                    value={saleEndsAt}
                    onChange={(e) => {
                      setSaleEndsAt(e.target.value);
                      markDirty();
                    }}
                    className="w-full rounded-xl border border-amber-200 bg-white px-3 py-2 text-xs focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Quantity Volume Tiers */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-ink">Quantity Volume Discount Tiers</span>
                <button
                  type="button"
                  onClick={() => {
                    setQuantityTiers([
                      ...quantityTiers,
                      { min_quantity: 100, max_quantity: null, tier_price_minor: 11900 },
                    ]);
                    markDirty();
                  }}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-violet hover:underline"
                >
                  <Plus className="size-3" /> Add Volume Break
                </button>
              </div>

              <div className="space-y-2">
                {quantityTiers.map((t, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-16">Min Qty:</span>
                    <input
                      type="number"
                      value={t.min_quantity}
                      onChange={(e) => {
                        const next = [...quantityTiers];
                        next[idx].min_quantity = Number(e.target.value);
                        setQuantityTiers(next);
                        markDirty();
                      }}
                      className="w-24 rounded-lg border border-border px-2.5 py-1.5 font-mono text-xs focus:border-violet focus:outline-none"
                    />
                    <span className="text-xs text-muted-foreground w-[110px]">Total Batch Price (₹):</span>
                    <input
                      type="number"
                      value={t.tier_price_minor !== null ? Math.round(t.tier_price_minor / 100) : ""}
                      onChange={(e) => {
                        const next = [...quantityTiers];
                        next[idx].tier_price_minor = Math.round(Number(e.target.value) * 100);
                        setQuantityTiers(next);
                        markDirty();
                      }}
                      className="w-24 rounded-lg border border-border px-2.5 py-1.5 font-mono text-xs focus:border-violet focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setQuantityTiers(quantityTiers.filter((_, i) => i !== idx));
                        markDirty();
                      }}
                      className="p-1.5 text-muted-foreground hover:text-red-600"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: MANUFACTURING */}
        {activeTab === "manufacturing" && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <h2 className="font-display text-base font-bold text-ink">Manufacturing & Turnaround</h2>
              <p className="text-xs text-muted-foreground">
                Order increments, MOQ, dispatch lead times, and same-day express flags.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="font-bold text-xs text-ink block mb-1">Pricing / Order Unit</label>
                <input
                  type="text"
                  value={unit}
                  onChange={(e) => {
                    setUnit(e.target.value);
                    markDirty();
                  }}
                  className="w-full rounded-xl border border-border px-3.5 py-2 text-xs focus:border-violet focus:outline-none"
                  placeholder="e.g. pieces, 100 cards, banner"
                />
              </div>

              <div>
                <label className="font-bold text-xs text-ink block mb-1">
                  Minimum Order Quantity (MOQ)
                </label>
                <input
                  type="number"
                  min={1}
                  value={minOrderQty}
                  onChange={(e) => {
                    setMinOrderQty(Number(e.target.value));
                    markDirty();
                  }}
                  className="w-full rounded-xl border border-border px-3.5 py-2 font-mono text-xs focus:border-violet focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-xs text-ink block mb-1">
                  Production Turnaround (Working Days)
                </label>
                <input
                  type="number"
                  min={1}
                  value={turnaroundDays}
                  onChange={(e) => {
                    setTurnaroundDays(Number(e.target.value));
                    markDirty();
                  }}
                  className="w-full rounded-xl border border-border px-3.5 py-2 font-mono text-xs focus:border-violet focus:outline-none"
                />
              </div>

              <div className="flex items-center pt-6">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sameDayEligible}
                    onChange={(e) => {
                      setSameDayEligible(e.target.checked);
                      markDirty();
                    }}
                    className="size-4 rounded border-border text-marigold focus:ring-marigold"
                  />
                  <span className="font-bold text-xs text-ink">Eligible for Same-Day Express</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* TAB 9: SHIPPING */}
        {activeTab === "shipping" && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <h2 className="font-display text-base font-bold text-ink">Shipping & Package Rules</h2>
              <p className="text-xs text-muted-foreground">
                Item weight, dimensions, and fragile/oversized logistics handling.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="font-bold text-xs text-ink block mb-1">Weight (Grams)</label>
                <input
                  type="number"
                  value={shippingWeightGrams}
                  onChange={(e) => {
                    setShippingWeightGrams(Number(e.target.value));
                    markDirty();
                  }}
                  className="w-full rounded-xl border border-border px-3.5 py-2 font-mono text-xs focus:border-violet focus:outline-none"
                />
              </div>

              <div className="flex items-center pt-6">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFragile}
                    onChange={(e) => {
                      setIsFragile(e.target.checked);
                      markDirty();
                    }}
                    className="size-4 rounded border-border text-violet focus:ring-violet"
                  />
                  <span className="font-bold text-xs text-ink">Fragile / Special Packaging</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* TAB 10: MERCHANDISING */}
        {activeTab === "merchandising" && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <h2 className="font-display text-base font-bold text-ink">Merchandising & Cross-Sells</h2>
              <p className="text-xs text-muted-foreground">
                Featured priority, badges, and related product recommendations.
              </p>
            </div>

            <div className="space-y-4">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => {
                    setIsFeatured(e.target.checked);
                    markDirty();
                  }}
                  className="size-4 rounded border-border text-violet focus:ring-violet"
                />
                <span className="font-bold text-xs text-ink">Feature on Storefront Homepage</span>
              </label>

              <div>
                <label className="font-bold text-xs text-ink block mb-1">
                  Related Product Handles (Comma-Separated)
                </label>
                <input
                  type="text"
                  value={relatedHandlesStr}
                  onChange={(e) => {
                    setRelatedHandlesStr(e.target.value);
                    markDirty();
                  }}
                  className="w-full rounded-xl border border-border px-3.5 py-2 font-mono text-xs focus:border-violet focus:outline-none"
                  placeholder="visiting-cards, custom-hoodies, photo-mugs"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 11: SEO & SOCIAL META */}
        {activeTab === "seo" && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <h2 className="font-display text-base font-bold text-ink">Search Engine Optimization (SEO)</h2>
              <p className="text-xs text-muted-foreground">
                Customize Google search snippet, OpenGraph cards, and canonical links.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="font-bold text-xs text-ink block mb-1">Meta Title</label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => {
                    setSeoTitle(e.target.value);
                    markDirty();
                  }}
                  className="w-full rounded-xl border border-border px-3.5 py-2 text-xs focus:border-violet focus:outline-none"
                  placeholder="e.g. Custom Visiting Cards Printing Online | Fast Dispatch"
                />
              </div>

              <div>
                <label className="font-bold text-xs text-ink block mb-1">Meta Description</label>
                <textarea
                  rows={3}
                  value={seoDescription}
                  onChange={(e) => {
                    setSeoDescription(e.target.value);
                    markDirty();
                  }}
                  className="w-full rounded-xl border border-border px-3.5 py-2 text-xs focus:border-violet focus:outline-none"
                  placeholder="Order premium visiting cards with velvety matte finish..."
                />
              </div>

              <div>
                <label className="font-bold text-xs text-ink block mb-1">Canonical URL (Optional)</label>
                <input
                  type="url"
                  value={canonicalUrl}
                  onChange={(e) => {
                    setCanonicalUrl(e.target.value);
                    markDirty();
                  }}
                  className="w-full rounded-xl border border-border px-3.5 py-2 font-mono text-xs focus:border-violet focus:outline-none"
                  placeholder="https://doonprintstudio.com/product/visiting-cards"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 12: AUDIT HISTORY */}
        {activeTab === "audit" && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-base font-bold text-ink">Catalog Audit Log</h2>
              <p className="text-xs text-muted-foreground">
                Immutable record of who changed what on this product.
              </p>
            </div>

            {auditLogs.length > 0 ? (
              <div className="divide-y divide-border rounded-xl border border-border overflow-hidden">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-3.5 text-xs hover:bg-paper/30 transition-colors">
                    <div className="flex items-center justify-between font-mono text-[11px] text-muted-foreground">
                      <span className="font-bold text-violet">{log.action}</span>
                      <span>{new Date(log.created_at).toLocaleString("en-IN")}</span>
                    </div>
                    <div className="font-semibold text-ink mt-1">
                      {log.reason || "Product updated"}
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">
                      Admin: {log.admin_email || "System"}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border p-8 text-center text-xs text-muted-foreground">
                No recorded audit entries yet.
              </div>
            )}
          </div>
        )}
      </div>

      {/* STICKY SAVE & CONTROL BAR */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-border px-6 py-3.5 shadow-pop">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {hasUnsavedChanges && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                <AlertTriangle className="size-3.5" /> Unsaved changes
              </span>
            )}
            <span className="text-xs text-muted-foreground hidden sm:inline">
              Status: <strong className="text-ink font-semibold uppercase">{status}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            {status === "active" ? (
              <button
                type="button"
                onClick={() => handleStatusChange("paused")}
                disabled={isSubmitting}
                className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-2 text-xs font-bold text-amber-800 hover:bg-amber-100 disabled:opacity-50 transition-colors"
              >
                Pause Sales
              </button>
            ) : status === "paused" ? (
              <button
                type="button"
                onClick={() => handleStatusChange("active")}
                disabled={isSubmitting}
                className="rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-100 disabled:opacity-50 transition-colors"
              >
                Resume Sales
              </button>
            ) : null}

            <button
              type="button"
              onClick={() => handleSave("draft")}
              disabled={isSubmitting}
              className="rounded-xl border border-border bg-white px-4 py-2 text-xs font-bold text-ink hover:bg-paper disabled:opacity-50 transition-colors"
            >
              Save Draft
            </button>

            <button
              type="button"
              onClick={() => handleSave("active")}
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 rounded-xl bg-violet px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-violet-lift disabled:opacity-50 transition-colors"
            >
              <Save className="size-4" />
              <span>{isSubmitting ? "Publishing..." : "Save & Publish"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
