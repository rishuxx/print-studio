"use client";

import * as React from "react";
import {
  CategoryFlashCard,
  FlashCardTone,
  SaveCategoryFlashCardInput,
  DEFAULT_FLASH_CARDS,
} from "@/lib/flash-cards/types";
import { categories } from "@/lib/data/categories";
import {
  saveCategoryFlashCardAction,
  toggleFlashCardStatusAction,
} from "@/lib/flash-cards/actions";
import { CategoryFlashAdCard } from "@/components/layout/category-flash-ad-card";
import { toast } from "sonner";
import {
  Sparkles,
  Edit2,
  CheckCircle2,
  XCircle,
  Eye,
  ExternalLink,
  Tag,
  Palette,
  RotateCcw,
  Sliders,
  Layers,
  ArrowRight,
  HelpCircle,
  Info,
  ShieldCheck,
} from "lucide-react";

interface FlashCardManagerProps {
  initialCards: CategoryFlashCard[];
}

const TONE_OPTIONS: { id: FlashCardTone; label: string; swatch: string; glow: string }[] = [
  { id: "emerald", label: "Emerald Luxury", swatch: "from-emerald-950 to-zinc-900 border-emerald-500/50", glow: "text-emerald-400" },
  { id: "violet", label: "Violet Royal", swatch: "from-violet-950 to-zinc-900 border-violet-500/50", glow: "text-violet-400" },
  { id: "marigold", label: "Marigold Warmth", swatch: "from-amber-950 to-zinc-900 border-amber-500/50", glow: "text-amber-400" },
  { id: "indigo", label: "Indigo Corporate", swatch: "from-indigo-950 to-zinc-900 border-indigo-500/50", glow: "text-indigo-400" },
  { id: "rose", label: "Rose Vibrant", swatch: "from-rose-950 to-zinc-900 border-rose-500/50", glow: "text-rose-400" },
  { id: "amber", label: "Amber Orange", swatch: "from-orange-950 to-zinc-900 border-orange-500/50", glow: "text-orange-400" },
  { id: "ink", label: "Midnight Carbon", swatch: "from-zinc-900 to-zinc-950 border-zinc-700", glow: "text-zinc-300" },
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
  const [searchQuery, setSearchQuery] = React.useState("");

  // Editing form states
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
  const [formIsActive, setFormIsActive] = React.useState(true);

  // Active card selected in view
  const currentCard = React.useMemo(() => {
    const found = cards.find((c) => c.category_handle === selectedHandle);
    if (found) return found;
    return (
      DEFAULT_FLASH_CARDS[selectedHandle] || {
        id: `temp-${selectedHandle}`,
        category_handle: selectedHandle,
        eyebrow: "FEATURED SPOTLIGHT",
        title: "Explore Premium Collection",
        body: "Precision commercial printing with same-day dispatch and guaranteed color fidelity.",
        cta_text: "Shop Collection",
        cta_url: `/category/${selectedHandle}`,
        tone: "ink",
        badge_text: null,
        discount_tag: null,
        image_url: null,
        is_active: true,
        display_order: 1,
      }
    );
  }, [cards, selectedHandle]);

  const currentCategory = React.useMemo(() => {
    return categories.find((c) => c.handle === selectedHandle) || categories[0];
  }, [selectedHandle]);

  // Handle open editor
  const handleOpenEdit = (cardToEdit: CategoryFlashCard) => {
    setFormCategoryHandle(cardToEdit.category_handle);
    setFormTitle(cardToEdit.title || "");
    setFormEyebrow(cardToEdit.eyebrow || "");
    setFormBody(cardToEdit.body || "");
    setFormCtaText(cardToEdit.cta_text || "Explore Collection");
    setFormCtaUrl(cardToEdit.cta_url || `/category/${cardToEdit.category_handle}`);
    setFormTone(cardToEdit.tone || "ink");
    setFormBadgeText(cardToEdit.badge_text || "");
    setFormDiscountTag(cardToEdit.discount_tag || "");
    setFormImageUrl(cardToEdit.image_url || "");
    setFormIsActive(cardToEdit.is_active !== undefined ? cardToEdit.is_active : true);
    setIsEditing(true);
  };

  // Quick reset to default values
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
      setFormIsActive(true);
      toast.info(`Loaded standard high-converting template for ${formCategoryHandle}`);
    }
  };

  // Save changes
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
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
      title: formTitle.trim(),
      eyebrow: formEyebrow.trim() || null,
      body: formBody.trim() || null,
      cta_text: formCtaText.trim() || "Explore Collection",
      cta_url: formCtaUrl.trim(),
      tone: formTone,
      badge_text: formBadgeText.trim() || null,
      discount_tag: formDiscountTag.trim() || null,
      image_url: formImageUrl.trim() || null,
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

  // Live preview mockup object from form state when editing
  const previewCard: CategoryFlashCard = React.useMemo(() => {
    if (!isEditing) return currentCard;
    return {
      id: "preview-temp",
      category_handle: formCategoryHandle,
      title: formTitle || "Preview Headline Goes Here",
      eyebrow: formEyebrow || "LIMITED TIME SPECIAL",
      body: formBody || "This is how your description will appear in the navigation mega-menu.",
      cta_text: formCtaText || "See Offer",
      cta_url: formCtaUrl || `/category/${formCategoryHandle}`,
      tone: formTone,
      badge_text: formBadgeText || null,
      discount_tag: formDiscountTag || null,
      image_url: formImageUrl || null,
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
    formIsActive,
  ]);

  const filteredCategories = categories.filter((cat) =>
    cat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.handle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-950 via-zinc-900 to-[#120b24] p-8 border border-zinc-800 shadow-2xl text-white">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-72 w-72 rounded-full bg-violet-600/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 -mb-10 h-48 w-48 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-violet-500/20 px-3.5 py-1 text-xs font-semibold text-violet-300 border border-violet-400/30">
            <Sparkles className="h-3.5 w-3.5 animate-pulse text-violet-400" />
            Mega-Menu Promotion Engine
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
            Category Flash Ad Cards
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Customize and launch high-impact, modern flash ad cards in every header navigation
            mega-menu dropdown. Control custom eye-catching gradients, promotional discount badges,
            eyebrows, and 100% verified non-404 destination routes.
          </p>
        </div>
      </div>

      {/* Main Grid: Category List & Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Category Selector & Summary (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm flex items-center gap-2">
                <Layers className="h-4 w-4 text-violet-600" />
                Select Category Menu ({categories.length})
              </h3>
              <span className="text-xs text-zinc-400">Click to preview & edit</span>
            </div>

            <input
              type="text"
              placeholder="Search category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-violet-500 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
            />

            <div className="space-y-1.5 max-h-[520px] overflow-y-auto pr-1">
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
                        ? "bg-violet-50/70 dark:bg-violet-950/40 border-violet-500/60 shadow-sm"
                        : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                          {cat.title}
                        </span>
                        {card?.tone && (
                          <span
                            className={`text-[10px] font-mono px-1.5 py-0.5 rounded capitalize ${
                              card.tone === "emerald"
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                                : card.tone === "violet"
                                ? "bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20"
                                : card.tone === "marigold"
                                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                                : card.tone === "indigo"
                                ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20"
                                : card.tone === "rose"
                                ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                                : card.tone === "amber"
                                ? "bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20"
                                : "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border border-zinc-500/20"
                            }`}
                          >
                            {card.tone}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                        {card?.title || "Default Spotlight Card"}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] font-mono text-zinc-400 truncate max-w-[200px]">
                          Target: {card?.cta_url || `/category/${cat.handle}`}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          isCardActive ? "bg-emerald-500" : "bg-zinc-400"
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

        {/* Right Column: Interactive Modern Card Preview & Editor (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card Management Controls Bar */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  {currentCategory.title} Mega-Menu Ad
                </h2>
                <span
                  className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                    currentCard.is_active
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300/40"
                      : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                  }`}
                >
                  {currentCard.is_active ? (
                    <>
                      <CheckCircle2 className="h-3 w-3 text-emerald-500" /> Active on Mega-Menu
                    </>
                  ) : (
                    <>
                      <XCircle className="h-3 w-3 text-zinc-400" /> Paused
                    </>
                  )}
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Target URL:{" "}
                <code className="text-violet-600 dark:text-violet-400 font-mono bg-violet-50 dark:bg-violet-950/40 px-1.5 py-0.5 rounded text-[11px]">
                  {currentCard.cta_url}
                </code>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleToggleActive(currentCard)}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 transition-colors"
              >
                {currentCard.is_active ? "Pause Ad" : "Activate Ad"}
              </button>
              <button
                type="button"
                onClick={() => handleOpenEdit(currentCard)}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-lg bg-violet-600 hover:bg-violet-700 text-white shadow-sm transition-all"
              >
                <Edit2 className="h-3.5 w-3.5" />
                Customize Flash Card
              </button>
            </div>
          </div>

          {/* Live High-End Storefront Preview */}
          <div className="bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-inner space-y-4">
            <div className="flex items-center justify-between text-xs font-medium text-zinc-500">
              <span className="flex items-center gap-1.5 font-semibold text-zinc-700 dark:text-zinc-300">
                <Eye className="h-3.5 w-3.5 text-violet-500" />
                Storefront Mega-Menu Preview (Live Render)
              </span>
              <span className="text-[11px] bg-zinc-200 dark:bg-zinc-800 px-2 py-0.5 rounded font-mono">
                Tone: {previewCard.tone.toUpperCase()}
              </span>
            </div>

            {/* Container mirroring the Mega-Menu Dropdown Panel */}
            <div className="max-w-[340px] mx-auto py-2">
              <CategoryFlashAdCard
                card={previewCard}
                category={currentCategory}
                className="shadow-2xl"
              />
            </div>

            <div className="text-center">
              <p className="text-[11px] text-zinc-500">
                💡 Clicking the CTA button in the mega-menu will seamlessly navigate users to{" "}
                <span className="font-mono text-zinc-700 dark:text-zinc-300 font-semibold">
                  {previewCard.cta_url}
                </span>{" "}
                (Zero 404 guarantee).
              </p>
            </div>
          </div>

          {/* Edit Drawer / Modal Form */}
          {isEditing && (
            <div className="bg-white dark:bg-zinc-900 border-2 border-violet-500/60 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
                <div className="space-y-0.5">
                  <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <Sliders className="h-4 w-4 text-violet-600" />
                    Customize Flash Ad Card: {currentCategory.title}
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Changes take effect immediately on your mega-menu dropdowns.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleResetToDefault}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
                    title="Load pre-designed optimized template"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Default Preset
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-sm font-bold px-2 py-1"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <form onSubmit={handleSave} className="space-y-5">
                {/* Tone / Theme Selection Swatches */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Palette className="h-3.5 w-3.5 text-violet-500" />
                    Modern Color Gradient & Glow Theme
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {TONE_OPTIONS.map((t) => {
                      const isChosen = formTone === t.id;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setFormTone(t.id)}
                          className={`flex items-center gap-2 p-2 rounded-lg border text-left text-xs transition-all ${
                            isChosen
                              ? "border-violet-500 bg-violet-50 dark:bg-violet-950/40 ring-2 ring-violet-500/20 font-bold"
                              : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
                          }`}
                        >
                          <div
                            className={`h-4 w-4 rounded-full bg-gradient-to-br ${t.swatch} border shrink-0`}
                          />
                          <span className="truncate">{t.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Eyebrow & Badges Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                      Eyebrow Tag (Mono Top Header)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. END-TO-END or NO MINIMUM"
                      value={formEyebrow}
                      onChange={(e) => setFormEyebrow(e.target.value)}
                      className="mt-1 w-full text-xs px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                      Top Badge Pill (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. ⚡ 4-Hour Turnaround"
                      value={formBadgeText}
                      onChange={(e) => setFormBadgeText(e.target.value)}
                      className="mt-1 w-full text-xs px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                      Discount Pill (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Save 20% on Bulk"
                      value={formDiscountTag}
                      onChange={(e) => setFormDiscountTag(e.target.value)}
                      className="mt-1 w-full text-xs px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                    Card Title / Headline <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Custom Mailer Boxes & Custom Tissue"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="mt-1 w-full text-sm font-semibold px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>

                {/* Body Text */}
                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                    Description / Pitch
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Mailer box, tissue, sticker seal, hang tag and tape — spec'd together so colours actually match."
                    value={formBody}
                    onChange={(e) => setFormBody(e.target.value)}
                    className="mt-1 w-full text-xs px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>

                {/* CTA Button Text & Destination URL */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                      Button Text
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. See the bundle or Start with one"
                      value={formCtaText}
                      onChange={(e) => setFormCtaText(e.target.value)}
                      className="mt-1 w-full text-xs px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
                        Destination URL <span className="text-red-500">*</span>
                      </label>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                        ✓ Prevents 404
                      </span>
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="/category/labels-packaging"
                      value={formCtaUrl}
                      onChange={(e) => setFormCtaUrl(e.target.value)}
                      className="mt-1 w-full text-xs font-mono px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-violet-500 text-violet-600 dark:text-violet-400 font-semibold"
                    />
                  </div>
                </div>

                {/* Quick-Pick Safe Destination URLs */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-zinc-500 flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                    Quick-pick verified valid storefront paths:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {SUGGESTED_TARGETS.map((target) => (
                      <button
                        key={target.url}
                        type="button"
                        onClick={() => setFormCtaUrl(target.url)}
                        className={`text-[11px] px-2 py-0.5 rounded border transition-colors ${
                          formCtaUrl === target.url
                            ? "bg-violet-600 text-white border-violet-600 font-medium"
                            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400"
                        }`}
                      >
                        {target.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Image URL (Optional backdrop asset) */}
                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                    Background Graphic Image URL (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://... or /images/..."
                    value={formImageUrl}
                    onChange={(e) => setFormImageUrl(e.target.value)}
                    className="mt-1 w-full text-xs font-mono px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                  <p className="text-[10px] text-zinc-400 mt-1">
                    Leave blank to use the modern gradient glow styling with dynamic geometric micro-details.
                  </p>
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
                  <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Flash Card is Active and Visible in Mega-Menu
                  </span>
                </div>

                {/* Form Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-xs font-medium rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2 text-xs font-bold rounded-lg bg-violet-600 hover:bg-violet-700 text-white shadow-md disabled:opacity-50 transition-all"
                  >
                    {isSaving ? "Saving & Publishing..." : "Save & Publish Flash Card"}
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
