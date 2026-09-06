"use client";

import * as React from "react";
import {
  CategoryFlashCard,
  FlashCardTone,
  FlashCardBannerStyle,
  FlashCardCtaStyle,
  SaveCategoryFlashCardInput,
  DEFAULT_FLASH_CARDS,
} from "@/lib/flash-cards/types";
import { categories } from "@/lib/data/categories";
import {
  saveCategoryFlashCardAction,
  toggleFlashCardStatusAction,
} from "@/lib/flash-cards/actions";
import { uploadBannerImageAction } from "@/lib/hero/actions";
import { CategoryFlashAdCard } from "@/components/layout/category-flash-ad-card";
import { toast } from "sonner";
import {
  Sparkles,
  Edit2,
  CheckCircle2,
  XCircle,
  Eye,
  Tag,
  Palette,
  RotateCcw,
  Sliders,
  Layers,
  ArrowRight,
  ShieldCheck,
  Upload,
  Image as ImageIcon,
  Trash2,
  RefreshCw,
  ExternalLink,
  LayoutTemplate,
  MousePointerClick,
} from "lucide-react";

interface FlashCardManagerProps {
  initialCards: CategoryFlashCard[];
}

/**
 * Clean Red & White / E-commerce color themes
 */
const TONE_OPTIONS: { id: FlashCardTone; label: string; swatch: string; pillColor: string }[] = [
  { id: "ink", label: "Classic Red & White", swatch: "bg-[#e53935] border-red-500", pillColor: "bg-red-50 text-red-700 border-red-200" },
  { id: "rose", label: "Ruby Rose Tint", swatch: "bg-red-600 border-red-700", pillColor: "bg-red-50 text-red-600 border-red-200" },
  { id: "marigold", label: "Warm Sunset Orange", swatch: "bg-amber-500 border-amber-600", pillColor: "bg-amber-50 text-amber-700 border-amber-200" },
  { id: "emerald", label: "Fresh Mint Green", swatch: "bg-emerald-600 border-emerald-700", pillColor: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { id: "violet", label: "Royal Purple Tint", swatch: "bg-purple-600 border-purple-700", pillColor: "bg-purple-50 text-purple-700 border-purple-200" },
  { id: "indigo", label: "Corporate Cobalt Blue", swatch: "bg-blue-600 border-blue-700", pillColor: "bg-blue-50 text-blue-700 border-blue-200" },
  { id: "amber", label: "Vibrant Tangerine", swatch: "bg-orange-500 border-orange-600", pillColor: "bg-orange-50 text-orange-700 border-orange-200" },
];

const CTA_STYLE_OPTIONS: { id: FlashCardCtaStyle; label: string; preview: string }[] = [
  { id: "primary_red", label: "Brand Red Button", preview: "bg-[#e53935] text-white" },
  { id: "dark", label: "Midnight Dark", preview: "bg-zinc-900 text-white" },
  { id: "white", label: "Crisp White High-Contrast", preview: "bg-white text-zinc-900 border border-zinc-200" },
  { id: "outline", label: "Glassmorphic Border", preview: "bg-black/30 border border-white/40 text-white" },
  { id: "none", label: "No Button (Banner Only)", preview: "bg-zinc-100 text-zinc-400" },
];

const SUGGESTED_TARGETS = [
  { label: "Labels & Packaging Hub", url: "/category/labels-packaging" },
  { label: "Visiting Cards & Stationery", url: "/category/visiting-cards" },
  { label: "Apparel & Uniforms", url: "/category/apparel" },
  { label: "Same-Day Express", url: "/same-day" },
  { label: "Corporate Gifting & Awards", url: "/category/corporate-gifts" },
  { label: "Festive & Occasions", url: "/category/festive" },
  { label: "Signages & Posters", url: "/category/signs-posters" },
  { label: "Photo Gifts & Canvases", url: "/category/photo-gifts" },
  { label: "Free Sample Kit Pack", url: "/sample-kit" },
  { label: "Bulk Enterprise Quote", url: "/bulk-quote" },
];

export function FlashCardManager({ initialCards }: FlashCardManagerProps) {
  const [cards, setCards] = React.useState<CategoryFlashCard[]>(initialCards);
  const [selectedHandle, setSelectedHandle] = React.useState<string>(categories[0]?.handle || "same-day");
  const [isEditing, setIsEditing] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isUploadingImage, setIsUploadingImage] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Form editing state
  const [formCategoryHandle, setFormCategoryHandle] = React.useState<string>(selectedHandle);
  const [formTitle, setFormTitle] = React.useState("");
  const [formEyebrow, setFormEyebrow] = React.useState("");
  const [formBody, setFormBody] = React.useState("");
  const [formCtaText, setFormCtaText] = React.useState("");
  const [formCtaUrl, setFormCtaUrl] = React.useState("");
  const [formTone, setFormTone] = React.useState<FlashCardTone>("ink");
  const [formBadgeText, setFormBadgeText] = React.useState("");
  const [formDiscountTag, setFormDiscountTag] = React.useState("");
  const [formImageUrl, setFormImageUrl] = React.useState("");
  const [formBannerStyle, setFormBannerStyle] = React.useState<FlashCardBannerStyle>("full_overlay");
  const [formCtaStyle, setFormCtaStyle] = React.useState<FlashCardCtaStyle>("primary_red");
  const [formShowCta, setFormShowCta] = React.useState(true);
  const [formIsActive, setFormIsActive] = React.useState(true);

  // Active card selected in view
  const currentCard = React.useMemo(() => {
    const found = cards.find((c) => c.category_handle === selectedHandle);
    if (found) return found;
    return (
      DEFAULT_FLASH_CARDS[selectedHandle] || {
        id: `temp-${selectedHandle}`,
        category_handle: selectedHandle,
        eyebrow: "FEATURED",
        title: "Explore Premium Collection",
        body: "Precision commercial printing with same-day dispatch and guaranteed color fidelity.",
        cta_text: "Shop Collection",
        cta_url: `/category/${selectedHandle}`,
        tone: "ink",
        badge_text: null,
        discount_tag: null,
        image_url: null,
        banner_style: "full_overlay",
        cta_style: "primary_red",
        show_cta: true,
        is_active: true,
        display_order: 1,
      }
    );
  }, [cards, selectedHandle]);

  const currentCategory = React.useMemo(() => {
    return categories.find((c) => c.handle === selectedHandle) || categories[0];
  }, [selectedHandle]);

  // Open editor pre-filled
  const handleOpenEdit = (cardToEdit: CategoryFlashCard) => {
    setFormCategoryHandle(cardToEdit.category_handle);
    setFormTitle(cardToEdit.title || "");
    setFormEyebrow(cardToEdit.eyebrow || "");
    setFormBody(cardToEdit.body || "");
    setFormCtaText(cardToEdit.cta_text || "Explore Now");
    setFormCtaUrl(cardToEdit.cta_url || `/category/${cardToEdit.category_handle}`);
    setFormTone(cardToEdit.tone || "ink");
    setFormBadgeText(cardToEdit.badge_text || "");
    setFormDiscountTag(cardToEdit.discount_tag || "");
    setFormImageUrl(cardToEdit.image_url || "");
    setFormBannerStyle(cardToEdit.banner_style || "full_overlay");
    setFormCtaStyle(cardToEdit.cta_style || "primary_red");
    setFormShowCta(cardToEdit.show_cta !== false);
    setFormIsActive(cardToEdit.is_active !== undefined ? cardToEdit.is_active : true);
    setIsEditing(true);
  };

  // Reset to high-converting default preset
  const handleResetToDefault = () => {
    const def = DEFAULT_FLASH_CARDS[formCategoryHandle];
    if (def) {
      setFormTitle(def.title);
      setFormEyebrow(def.eyebrow || "");
      setFormBody(def.body || "");
      setFormCtaText(def.cta_text);
      setFormCtaUrl(def.cta_url);
      setFormTone(def.tone);
      setFormBadgeText(def.badge_text || "");
      setFormDiscountTag(def.discount_tag || "");
      setFormImageUrl(def.image_url || "");
      setFormBannerStyle(def.banner_style || "full_overlay");
      setFormCtaStyle(def.cta_style || "primary_red");
      setFormShowCta(true);
      setFormIsActive(true);
      toast.info(`Loaded standard e-commerce template for ${formCategoryHandle}`);
    }
  };

  // Direct Image File Upload
  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file (PNG, JPG, WebP, SVG).");
      return;
    }

    setIsUploadingImage(true);
    try {
      // 1. Try Direct Client Upload to Supabase Storage
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const { PRODUCT_MEDIA_BUCKET } = await import("@/lib/storage/product-media-utils");
        const supabase = createClient();

        const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
        const fileName = `flash-ads/${formCategoryHandle}-${Date.now()}.${ext}`;

        const { error: uploadErr } = await supabase.storage
          .from(PRODUCT_MEDIA_BUCKET)
          .upload(fileName, file, {
            contentType: file.type || "image/jpeg",
            upsert: true,
          });

        if (!uploadErr) {
          const { data } = supabase.storage.from(PRODUCT_MEDIA_BUCKET).getPublicUrl(fileName);
          if (data?.publicUrl) {
            setFormImageUrl(data.publicUrl);
            toast.success("Ad image uploaded successfully!");
            setIsUploadingImage(false);
            return;
          }
        }
      } catch {
        // Fallback to server action
      }

      // 2. Server Action Fallback
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "flash-ads");

      const res = await uploadBannerImageAction(formData);
      if (res.success && res.url) {
        setFormImageUrl(res.url);
        toast.success("Ad image uploaded successfully!");
      } else {
        toast.error(res.error || "Failed to upload image.");
      }
    } catch {
      toast.error("Error uploading image file.");
    } finally {
      setIsUploadingImage(false);
      if (e.target) e.target.value = "";
    }
  };

  // Save changes
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const effectiveTitle = formTitle.trim() || (formBannerStyle === "photo_only" ? `Promotional Banner - ${formCategoryHandle}` : "");
    if (!effectiveTitle) {
      toast.error("Title is required for the flash ad card");
      return;
    }

    if (!formCtaUrl.trim()) {
      toast.error("Destination URL is required (must not be empty to avoid 404s)");
      return;
    }

    setIsSaving(true);
    const input: SaveCategoryFlashCardInput = {
      category_handle: formCategoryHandle,
      title: effectiveTitle,
      eyebrow: formEyebrow.trim() || null,
      body: formBody.trim() || null,
      cta_text: formCtaText.trim() || "Explore Now",
      cta_url: formCtaUrl.trim(),
      tone: formTone,
      badge_text: formBadgeText.trim() || null,
      discount_tag: formDiscountTag.trim() || null,
      image_url: formImageUrl.trim() || null,
      banner_style: formBannerStyle,
      cta_style: formCtaStyle,
      show_cta: formShowCta,
      is_active: formIsActive,
    };

    try {
      const res = await saveCategoryFlashCardAction(input);
      if (res.success && res.data) {
        toast.success(`Flash Ad Card for "${formCategoryHandle}" published successfully!`);
        // Update local state
        setCards((prev) => {
          const idx = prev.findIndex((c) => c.category_handle === formCategoryHandle);
          if (idx >= 0) {
            const next = [...prev];
            next[idx] = res.data!;
            return next;
          }
          return [...prev, res.data!];
        });
        setIsEditing(false);
      } else {
        toast.error(res.error || "Failed to save flash ad card.");
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle active status directly
  const handleToggleActive = async (card: CategoryFlashCard) => {
    const nextStatus = !card.is_active;
    const res = await toggleFlashCardStatusAction(card.category_handle, nextStatus);
    if (res.success) {
      setCards((prev) =>
        prev.map((c) =>
          c.category_handle === card.category_handle ? { ...c, is_active: nextStatus } : c
        )
      );
      toast.success(
        `Flash card for ${card.category_handle} is now ${nextStatus ? "Active" : "Paused"}`
      );
    } else {
      toast.error(res.error || "Failed to toggle status");
    }
  };

  // Live preview
  const previewCard: CategoryFlashCard = React.useMemo(() => {
    if (!isEditing) return currentCard;
    return {
      id: "preview-temp",
      category_handle: formCategoryHandle,
      title: formTitle || "Sample Product Offer Headline",
      eyebrow: formEyebrow || "LIMITED TIME OFFER",
      body: formBody || "High-quality precision commercial print delivered straight to your door.",
      cta_text: formCtaText || "Shop Now",
      cta_url: formCtaUrl || `/category/${formCategoryHandle}`,
      tone: formTone,
      badge_text: formBadgeText || null,
      discount_tag: formDiscountTag || null,
      image_url: formImageUrl || null,
      banner_style: formBannerStyle,
      cta_style: formCtaStyle,
      show_cta: formShowCta,
      is_active: formIsActive,
      display_order: 1,
    };
  }, [
    isEditing,
    currentCard,
    formCategoryHandle,
    formTitle,
    formEyebrow,
    formBody,
    formCtaText,
    formCtaUrl,
    formTone,
    formBadgeText,
    formDiscountTag,
    formImageUrl,
    formBannerStyle,
    formCtaStyle,
    formShowCta,
    formIsActive,
  ]);

  const filteredCategories = categories.filter(
    (cat) =>
      cat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.handle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-16">
      {/* Clean Header Banner — Red & White Brand Aesthetic */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-0.5 text-xs font-bold text-red-600 border border-red-200">
              <span className="size-2 rounded-full bg-red-600 animate-pulse" />
              Mega-Menu Advertising Engine
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900">
              Category Flash Ad Cards
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              Create, customize, and control promotional cards featured in every header navigation
              dropdown. Full control over images, offer copy, discount badges, and verified destination links.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Category List & Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Category Selector (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-zinc-900 text-xs sm:text-sm flex items-center gap-2">
                <Layers className="size-4 text-[#e53935]" />
                Select Category Menu ({categories.length})
              </h3>
              <span className="text-[11px] text-zinc-400">Click to preview & edit</span>
            </div>

            <input
              type="text"
              placeholder="Filter categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-zinc-900 placeholder:text-zinc-400"
            />

            <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
              {filteredCategories.map((cat) => {
                const card =
                  cards.find((c) => c.category_handle === cat.handle) ||
                  DEFAULT_FLASH_CARDS[cat.handle];
                const isSelected = selectedHandle === cat.handle;
                const isCardActive = card ? card.is_active : true;

                return (
                  <button
                    key={cat.handle}
                    onClick={() => {
                      setSelectedHandle(cat.handle);
                      if (isEditing) {
                        handleOpenEdit(card || currentCard);
                      }
                    }}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                      isSelected
                        ? "bg-red-50/70 border-red-500/80 shadow-xs ring-1 ring-red-500/20"
                        : "bg-white border-zinc-200 hover:border-zinc-300"
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold text-zinc-900 truncate">
                          {cat.title}
                        </span>
                        {card?.image_url && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                            Photo Ad
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-500 truncate mt-0.5">
                        {card?.title || "Default Promotional Card"}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-mono text-zinc-400 truncate max-w-[200px]">
                          Target: {card?.cta_url || `/category/${cat.handle}`}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <span
                        className={`size-2.5 rounded-full ${
                          isCardActive ? "bg-emerald-500" : "bg-zinc-300"
                        }`}
                        title={isCardActive ? "Active on storefront" : "Paused"}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Live Storefront Card Preview & Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card Management Controls Bar */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-zinc-900">
                  {currentCategory.title} Nav Ad Card
                </h2>
                <span
                  className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                    currentCard.is_active
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-zinc-100 text-zinc-600 border border-zinc-200"
                  }`}
                >
                  {currentCard.is_active ? (
                    <>
                      <CheckCircle2 className="size-3 text-emerald-600" /> Active
                    </>
                  ) : (
                    <>
                      <XCircle className="size-3 text-zinc-400" /> Paused
                    </>
                  )}
                </span>
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">
                Target URL:{" "}
                <code className="text-red-600 font-mono bg-red-50 px-1.5 py-0.5 rounded text-[11px] font-semibold border border-red-100">
                  {currentCard.cta_url}
                </code>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleToggleActive(currentCard)}
                className="px-3.5 py-2 text-xs font-bold rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 transition-colors shadow-2xs"
              >
                {currentCard.is_active ? "Pause Card" : "Activate Card"}
              </button>
              <button
                type="button"
                onClick={() => handleOpenEdit(currentCard)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-[#e53935] hover:bg-[#d32f2f] text-white shadow-xs transition-all"
              >
                <Edit2 className="size-3.5" />
                Edit Ad Details
              </button>
            </div>
          </div>

          {/* Live Storefront Preview — Light Clean Mega-Menu Dropdown Panel */}
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50/80 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between text-xs font-medium text-zinc-500">
              <span className="flex items-center gap-1.5 font-bold text-zinc-800">
                <Eye className="size-3.5 text-[#e53935]" />
                Storefront Mega-Menu Dropdown Preview
              </span>
              <span className="text-[10px] bg-white border border-zinc-200 px-2 py-0.5 rounded-full font-bold text-zinc-600">
                E-Commerce Card
              </span>
            </div>

            {/* Container mirroring the Mega-Menu Dropdown Panel */}
            <div className="max-w-[320px] mx-auto py-2">
              <CategoryFlashAdCard
                card={previewCard}
                category={currentCategory}
                className="shadow-sm"
              />
            </div>

            <p className="text-center text-[11px] text-zinc-500">
              Users clicking this ad will navigate directly to{" "}
              <span className="font-mono text-zinc-800 font-bold">{previewCard.cta_url}</span> (zero 404 guarantee).
            </p>
          </div>

          {/* Edit Drawer Form */}
          {isEditing && (
            <div className="rounded-2xl border-2 border-red-500/60 bg-white p-6 shadow-lg space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                <div className="space-y-0.5">
                  <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                    <Sliders className="size-4 text-[#e53935]" />
                    Edit Ad Card: {currentCategory.title}
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Customize your ad copy, offer badges, image, and destination link.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleResetToDefault}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-xl text-zinc-700 hover:bg-zinc-50 border border-zinc-200 shadow-2xs"
                    title="Load standard high-converting template"
                  >
                    <RotateCcw className="size-3" />
                    Load Default
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="text-zinc-400 hover:text-zinc-600 text-sm font-bold px-2 py-1"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <form onSubmit={handleSave} className="space-y-5">
                {/* 1. AD LAYOUT MODE: ONLY PHOTO BANNER vs PHOTO BANNER WITH TEXTS */}
                <div className="rounded-xl border border-zinc-200 bg-zinc-50/80 p-4 space-y-3">
                  <label className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
                    <LayoutTemplate className="size-4 text-[#e53935]" />
                    Ad Layout Format
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormBannerStyle("photo_only")}
                      className={`flex flex-col text-left p-3.5 rounded-xl border transition-all ${
                        formBannerStyle === "photo_only"
                          ? "border-red-500 bg-red-50/70 ring-2 ring-red-500/20 shadow-xs"
                          : "border-zinc-200 bg-white hover:border-zinc-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-zinc-900">
                          1. Only Photo Banner
                        </span>
                        {formBannerStyle === "photo_only" && (
                          <span className="size-2 rounded-full bg-red-600" />
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">
                        Uploaded image takes 100% of card with NO text overlays. Best for pre-designed marketing banners and posters.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormBannerStyle("full_overlay")}
                      className={`flex flex-col text-left p-3.5 rounded-xl border transition-all ${
                        formBannerStyle === "full_overlay"
                          ? "border-red-500 bg-red-50/70 ring-2 ring-red-500/20 shadow-xs"
                          : "border-zinc-200 bg-white hover:border-zinc-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-zinc-900">
                          2. Photo Banner + Text & Badges
                        </span>
                        {formBannerStyle === "full_overlay" && (
                          <span className="size-2 rounded-full bg-red-600" />
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">
                        Image background with high-contrast headline, body copy, eyebrow, and discount pill.
                      </p>
                    </button>
                  </div>
                </div>

                {/* Visual Color Theme */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Palette className="size-3.5 text-[#e53935]" />
                    Card Accent Theme
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {TONE_OPTIONS.map((t) => {
                      const isChosen = formTone === t.id;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setFormTone(t.id)}
                          className={`flex items-center gap-2 p-2 rounded-xl border text-left text-xs transition-all ${
                            isChosen
                              ? "border-red-500 bg-red-50/60 ring-2 ring-red-500/20 font-bold"
                              : "border-zinc-200 hover:border-zinc-300"
                          }`}
                        >
                          <div className={`size-3.5 rounded-full ${t.swatch} shrink-0`} />
                          <span className="truncate">{t.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Eyebrow & Badges Row (Only needed for Full Overlay mode or fallback) */}
                {formBannerStyle === "full_overlay" && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-bold text-zinc-800">
                        Eyebrow Header
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. FLASH DEAL or NO MINIMUM"
                        value={formEyebrow}
                        onChange={(e) => setFormEyebrow(e.target.value)}
                        className="mt-1 w-full text-xs px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-zinc-900"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-zinc-800">
                        Top Badge Pill (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. ⚡ 4-Hour Turnaround"
                        value={formBadgeText}
                        onChange={(e) => setFormBadgeText(e.target.value)}
                        className="mt-1 w-full text-xs px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-zinc-900"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-zinc-800">
                        Discount Pill (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Save 20% on Bulk"
                        value={formDiscountTag}
                        onChange={(e) => setFormDiscountTag(e.target.value)}
                        className="mt-1 w-full text-xs px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-zinc-900"
                      />
                    </div>
                  </div>
                )}

                {/* Title & Description (Shown for Full Overlay, or as internal admin reference for Photo Only) */}
                {formBannerStyle === "full_overlay" ? (
                  <>
                    <div>
                      <label className="text-xs font-bold text-zinc-800">
                        Card Title / Headline <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Custom Mailer Boxes & Branded Packaging"
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        className="mt-1 w-full text-sm font-bold px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-zinc-900"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-zinc-800">
                        Description Copy
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Brief compelling benefit copy for customers browsing the menu."
                        value={formBody}
                        onChange={(e) => setFormBody(e.target.value)}
                        className="mt-1 w-full text-xs px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-zinc-900"
                      />
                    </div>
                  </>
                ) : (
                  <div>
                    <label className="text-xs font-bold text-zinc-800 flex items-center justify-between">
                      <span>Ad Campaign Title (Admin Reference / Alt Text)</span>
                      <span className="text-[10px] text-zinc-400 font-normal">Hidden on photo-only banner</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Summer Packaging Flyer Banner"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      className="mt-1 w-full text-xs font-semibold px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-zinc-900"
                    />
                  </div>
                )}

                {/* IMAGE UPLOAD & URL SECTION (Requested by user) */}
                <div className="rounded-xl border border-zinc-200 bg-zinc-50/70 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
                      <ImageIcon className="size-4 text-[#e53935]" />
                      Ad Image Upload (Blinkit / Swiggy Style)
                    </label>
                    <span className="text-[10px] text-zinc-400">PNG, JPG, WebP</span>
                  </div>

                  {/* Upload button or preview */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageFileUpload}
                      accept="image/png,image/jpeg,image/webp,image/svg+xml"
                      className="hidden"
                    />

                    <button
                      type="button"
                      disabled={isUploadingImage}
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-zinc-200 text-xs font-bold text-zinc-700 hover:bg-zinc-50 shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {isUploadingImage ? (
                        <RefreshCw className="size-3.5 animate-spin text-red-600" />
                      ) : (
                        <Upload className="size-3.5 text-[#e53935]" />
                      )}
                      <span>{isUploadingImage ? "Uploading to Cloud..." : "Upload New Image"}</span>
                    </button>

                    {formImageUrl && (
                      <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-zinc-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={formImageUrl}
                          alt="Ad preview"
                          className="size-8 rounded object-cover border border-zinc-100"
                        />
                        <span className="text-xs font-mono text-zinc-500 truncate max-w-[160px]">
                          {formImageUrl}
                        </span>
                        <button
                          type="button"
                          onClick={() => setFormImageUrl("")}
                          className="text-red-500 hover:text-red-700 p-1"
                          title="Remove image"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Direct URL input fallback */}
                  <div className="pt-1">
                    <input
                      type="url"
                      placeholder="Or paste an image URL directly (https://...)"
                      value={formImageUrl}
                      onChange={(e) => setFormImageUrl(e.target.value)}
                      className="w-full text-xs font-mono px-3 py-1.5 rounded-lg bg-white border border-zinc-200 text-zinc-800 focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                  </div>
                </div>

                {/* CTA Button Controls & Styling */}
                <div className="rounded-xl border border-zinc-200 bg-zinc-50/70 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
                      <MousePointerClick className="size-4 text-[#e53935]" />
                      CTA Button Controls
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formShowCta}
                        onChange={(e) => setFormShowCta(e.target.checked)}
                        className="rounded border-zinc-300 text-red-600 focus:ring-red-500"
                      />
                      <span className="text-xs font-bold text-zinc-700">Display CTA Button</span>
                    </label>
                  </div>

                  {formShowCta && (
                    <div className="space-y-3 pt-1">
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                        {CTA_STYLE_OPTIONS.map((style) => (
                          <button
                            key={style.id}
                            type="button"
                            onClick={() => setFormCtaStyle(style.id)}
                            className={`p-2 rounded-xl border text-left text-xs transition-all flex flex-col gap-1.5 ${
                              formCtaStyle === style.id
                                ? "border-red-500 bg-red-50/70 ring-2 ring-red-500/20 font-bold"
                                : "border-zinc-200 bg-white hover:border-zinc-300"
                            }`}
                          >
                            <span className={`w-full py-1 text-center rounded text-[10px] font-bold ${style.preview}`}>
                              Button
                            </span>
                            <span className="text-[11px] text-zinc-700 truncate">{style.label}</span>
                          </button>
                        ))}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                        <div>
                          <label className="text-xs font-bold text-zinc-800">
                            Button Text
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Shop Now or View Offer"
                            value={formCtaText}
                            onChange={(e) => setFormCtaText(e.target.value)}
                            className="mt-1 w-full text-xs px-3 py-2 rounded-xl bg-white border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-zinc-900"
                          />
                        </div>
                        <div>
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-zinc-800 flex items-center gap-1">
                              Destination URL <span className="text-red-500">*</span>
                            </label>
                            <span className="text-[10px] text-emerald-600 font-bold">
                              ✓ Prevents 404
                            </span>
                          </div>
                          <input
                            type="text"
                            required
                            placeholder="/category/labels-packaging"
                            value={formCtaUrl}
                            onChange={(e) => setFormCtaUrl(e.target.value)}
                            className="mt-1 w-full text-xs font-mono px-3 py-2 rounded-xl bg-white border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-red-600 font-bold"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {!formShowCta && (
                    <p className="text-[11px] text-zinc-500 italic">
                      CTA button is hidden. The entire card image/banner remains clickable to destination URL.
                    </p>
                  )}
                </div>

                {/* Quick-Pick Safe Destination URLs */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-zinc-600 flex items-center gap-1">
                    <ShieldCheck className="size-3.5 text-emerald-600" />
                    Quick-pick valid storefront routes:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {SUGGESTED_TARGETS.map((target) => (
                      <button
                        key={target.url}
                        type="button"
                        onClick={() => setFormCtaUrl(target.url)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border transition-colors ${
                          formCtaUrl === target.url
                            ? "bg-red-600 text-white border-red-600 font-bold"
                            : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300"
                        }`}
                      >
                        {target.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Status Toggle */}
                <div className="flex items-center gap-3 pt-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formIsActive}
                      onChange={(e) => setFormIsActive(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-zinc-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                  <span className="text-xs font-bold text-zinc-800">
                    Ad Card is Active on Navigation Mega-Menu
                  </span>
                </div>

                {/* Form Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-xs font-bold rounded-xl text-zinc-600 hover:bg-zinc-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2.5 text-xs font-bold rounded-xl bg-[#e53935] hover:bg-[#d32f2f] text-white shadow-xs disabled:opacity-50 transition-all cursor-pointer"
                  >
                    {isSaving ? "Publishing..." : "Save & Publish Ad Card"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
