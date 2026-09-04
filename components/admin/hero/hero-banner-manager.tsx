"use client";

import * as React from "react";
import { HeroBannerRecord, SaveHeroBannerInput } from "@/lib/hero/types";
import {
  saveHeroBannerAction,
  deleteHeroBannerAction,
  toggleHeroBannerStatusAction,
  uploadBannerImageAction,
} from "@/lib/hero/actions";
import { toast } from "sonner";
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  ArrowRight,
  Upload,
  CheckCircle2,
  XCircle,
  Monitor,
  Smartphone,
  Sparkles,
  Layers,
  ArrowUpRight,
} from "lucide-react";

interface HeroBannerManagerProps {
  initialBanners: HeroBannerRecord[];
}

export function HeroBannerManager({ initialBanners }: HeroBannerManagerProps) {
  const [banners, setBanners] = React.useState<HeroBannerRecord[]>(initialBanners);
  const [isEditing, setIsEditing] = React.useState(false);
  const [activePreviewTab, setActivePreviewTab] = React.useState<"desktop" | "mobile">("desktop");
  const [isSaving, setIsSaving] = React.useState(false);
  const [isUploadingDesktop, setIsUploadingDesktop] = React.useState(false);
  const [isUploadingMobile, setIsUploadingMobile] = React.useState(false);

  // Form State
  const [currentId, setCurrentId] = React.useState<string | undefined>(undefined);
  const [title, setTitle] = React.useState("");
  const [subtitle, setSubtitle] = React.useState("");
  const [eyebrow, setEyebrow] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [desktopImageUrl, setDesktopImageUrl] = React.useState("");
  const [mobileImageUrl, setMobileImageUrl] = React.useState("");
  const [altText, setAltText] = React.useState("");
  const [contentMode, setContentMode] = React.useState<"image_only" | "image_overlay">("image_overlay");
  const [primaryCtaText, setPrimaryCtaText] = React.useState("Explore Products");
  const [primaryCtaUrl, setPrimaryCtaUrl] = React.useState("/products");
  const [primaryCtaBgColor, setPrimaryCtaBgColor] = React.useState("#e53935");
  const [primaryCtaTextColor, setPrimaryCtaTextColor] = React.useState("#ffffff");
  const [secondaryCtaText, setSecondaryCtaText] = React.useState("Get a Quote");
  const [secondaryCtaUrl, setSecondaryCtaUrl] = React.useState("/bulk-quote");
  const [secondaryCtaBgColor, setSecondaryCtaBgColor] = React.useState("#ffffff");
  const [secondaryCtaTextColor, setSecondaryCtaTextColor] = React.useState("#222225");
  const [textColor, setTextColor] = React.useState("#222225");
  const [overlayEnabled, setOverlayEnabled] = React.useState(false);
  const [overlayOpacity, setOverlayOpacity] = React.useState(30);
  const [displayOrder, setDisplayOrder] = React.useState(1);
  const [isActive, setIsActive] = React.useState(true);

  const openCreateModal = () => {
    setCurrentId(undefined);
    setTitle("Print Anything. Make It Yours.");
    setSubtitle("India's Premier Custom Printing Platform");
    setEyebrow("CUSTOM PRINTING & MERCHANDISE");
    setDescription(
      "Luxury visiting cards, custom apparel, corporate merchandise, and packaging delivered nationwide."
    );
    setDesktopImageUrl("");
    setMobileImageUrl("");
    setAltText("PreetyPrints Custom Online Printing Banner");
    setContentMode("image_overlay");
    setPrimaryCtaText("Explore Products");
    setPrimaryCtaUrl("/products");
    setPrimaryCtaBgColor("#e53935");
    setPrimaryCtaTextColor("#ffffff");
    setSecondaryCtaText("Get a Quote");
    setSecondaryCtaUrl("/bulk-quote");
    setSecondaryCtaBgColor("#ffffff");
    setSecondaryCtaTextColor("#222225");
    setTextColor("#222225");
    setOverlayEnabled(false);
    setOverlayOpacity(30);
    setDisplayOrder(banners.length + 1);
    setIsActive(true);
    setIsEditing(true);
  };

  const openEditModal = (banner: HeroBannerRecord) => {
    setCurrentId(banner.id);
    setTitle(banner.title);
    setSubtitle(banner.subtitle || "");
    setEyebrow(banner.eyebrow || "");
    setDescription(banner.description || "");
    setDesktopImageUrl(banner.desktop_image_url || "");
    setMobileImageUrl(banner.mobile_image_url || "");
    setAltText(banner.alt_text || "");
    setContentMode(banner.content_mode);
    setPrimaryCtaText(banner.primary_cta_text || "");
    setPrimaryCtaUrl(banner.primary_cta_url || "");
    setPrimaryCtaBgColor(banner.primary_cta_bg_color || "#e53935");
    setPrimaryCtaTextColor(banner.primary_cta_text_color || "#ffffff");
    setSecondaryCtaText(banner.secondary_cta_text || "");
    setSecondaryCtaUrl(banner.secondary_cta_url || "");
    setSecondaryCtaBgColor(banner.secondary_cta_bg_color || "#ffffff");
    setSecondaryCtaTextColor(banner.secondary_cta_text_color || "#222225");
    setTextColor(banner.text_color || "#222225");
    setOverlayEnabled(banner.overlay_enabled);
    setOverlayOpacity(banner.overlay_opacity || 30);
    setDisplayOrder(banner.display_order);
    setIsActive(banner.is_active);
    setIsEditing(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: "desktop" | "mobile") => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (target === "desktop") setIsUploadingDesktop(true);
    else setIsUploadingMobile(true);

    try {
      // 1. Direct client-side upload to Supabase Storage (Bypasses Next.js Server Action body size limits completely)
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const { PRODUCT_MEDIA_BUCKET } = await import("@/lib/storage/product-media-utils");
        const supabase = createClient();

        const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
        const fileName = `hero/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`;

        const { error: clientUploadErr } = await supabase.storage
          .from(PRODUCT_MEDIA_BUCKET)
          .upload(fileName, file, {
            contentType: file.type || "image/jpeg",
            upsert: true,
          });

        if (!clientUploadErr) {
          const { data } = supabase.storage.from(PRODUCT_MEDIA_BUCKET).getPublicUrl(fileName);
          if (data?.publicUrl) {
            if (target === "desktop") setDesktopImageUrl(data.publicUrl);
            else setMobileImageUrl(data.publicUrl);
            toast.success(`${target === "desktop" ? "Desktop" : "Mobile"} image uploaded successfully.`);
            return;
          }
        } else {
          console.warn("Direct client upload reported error, trying server action fallback:", clientUploadErr);
        }
      } catch (clientErr) {
        console.warn("Direct upload error, falling back to server action:", clientErr);
      }

      // 2. Server Action fallback
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "hero");

      const res = await uploadBannerImageAction(formData);
      if (res.success && res.url) {
        if (target === "desktop") setDesktopImageUrl(res.url);
        else setMobileImageUrl(res.url);
        toast.success(`${target === "desktop" ? "Desktop" : "Mobile"} image uploaded successfully.`);
        return;
      } else {
        toast.error(res.error || "Failed to upload image. Please check file size or network connection.");
      }
    } catch (err: any) {
      console.error("Banner upload exception:", err);
      toast.error(err?.message || "An error occurred during file upload.");
    } finally {
      if (target === "desktop") setIsUploadingDesktop(false);
      else setIsUploadingMobile(false);
      e.target.value = "";
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Banner title is required.");
      return;
    }

    setIsSaving(true);
    try {
      const payload: SaveHeroBannerInput = {
        id: currentId,
        title: title.trim(),
        subtitle: subtitle.trim() || null,
        eyebrow: eyebrow.trim() || null,
        description: description.trim() || null,
        desktop_image_url: desktopImageUrl.trim(),
        mobile_image_url: mobileImageUrl.trim() || null,
        alt_text: altText.trim() || null,
        content_mode: contentMode,
        primary_cta_text: primaryCtaText.trim() || null,
        primary_cta_url: primaryCtaUrl.trim() || null,
        primary_cta_bg_color: primaryCtaBgColor,
        primary_cta_text_color: primaryCtaTextColor,
        secondary_cta_text: secondaryCtaText.trim() || null,
        secondary_cta_url: secondaryCtaUrl.trim() || null,
        secondary_cta_bg_color: secondaryCtaBgColor,
        secondary_cta_text_color: secondaryCtaTextColor,
        text_color: textColor,
        overlay_enabled: overlayEnabled,
        overlay_opacity: overlayOpacity,
        display_order: displayOrder,
        is_active: isActive,
      };

      const res = await saveHeroBannerAction(payload);
      if (res.success && res.data) {
        toast.success("Hero banner saved successfully!");
        if (currentId) {
          setBanners((prev) => prev.map((b) => (b.id === currentId ? res.data! : b)));
        } else {
          setBanners((prev) => [...prev, res.data!]);
        }
        setIsEditing(false);
      } else {
        toast.error(res.error || "Failed to save banner.");
      }
    } catch {
      toast.error("Unexpected error saving banner.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this hero banner? This action cannot be undone.")) {
      return;
    }
    try {
      const res = await deleteHeroBannerAction(id);
      if (res.success) {
        setBanners((prev) => prev.filter((b) => b.id !== id));
        toast.success("Hero banner deleted.");
      } else {
        toast.error(res.error || "Failed to delete.");
      }
    } catch {
      toast.error("Error deleting banner.");
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const res = await toggleHeroBannerStatusAction(id, !currentStatus);
      if (res.success) {
        setBanners((prev) =>
          prev.map((b) => (b.id === id ? { ...b, is_active: !currentStatus } : b))
        );
        toast.success(`Banner ${!currentStatus ? "activated" : "deactivated"}.`);
      } else {
        toast.error(res.error || "Failed to toggle status.");
      }
    } catch {
      toast.error("Error toggling status.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl border border-border/80 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex size-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Homepage Content Engine
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">
              Hero Promotional Banners
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 max-w-2xl leading-relaxed">
              Upload and organize responsive promotional hero banners (Desktop 16:5 / 16:6 and Mobile 4:5 / 1:1), customize call-to-actions, and preview before publishing.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-primary/90 transition-all self-start sm:self-auto cursor-pointer"
          >
            <Plus className="size-4 stroke-[2.5]" />
            <span>Add New Banner</span>
          </button>
        </div>
      </div>

      {/* Hero Banners Grid / List */}
      <div className="grid grid-cols-1 gap-4">
        {banners.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-zinc-200 bg-white p-12 text-center">
            <Layers className="size-10 mx-auto text-zinc-300 mb-3" />
            <h3 className="font-bold text-sm text-zinc-800">No Custom Hero Banners Yet</h3>
            <p className="text-xs text-zinc-500 mt-1 max-w-md mx-auto">
              Your homepage is currently rendering the default fallback layout. Add your first promotional marketing banner to take control from here!
            </p>
            <button
              type="button"
              onClick={openCreateModal}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <Plus className="size-3.5" />
              <span>Create First Banner</span>
            </button>
          </div>
        ) : (
          banners.map((banner, index) => (
            <div
              key={banner.id}
              className="group rounded-2xl border border-zinc-200 bg-white p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              {/* Left Details & Thumbnail */}
              <div className="flex items-start gap-4 min-w-0">
                <div className="relative size-24 shrink-0 rounded-xl border border-zinc-200 bg-zinc-100 overflow-hidden flex items-center justify-center">
                  {banner.desktop_image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={banner.desktop_image_url}
                      alt={banner.alt_text || banner.title}
                      className="size-full object-cover"
                    />
                  ) : (
                    <div className="p-2 text-center text-[10px] font-semibold text-zinc-400">
                      Default Style
                    </div>
                  )}
                  <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[9px] font-mono font-bold text-white">
                    #{index + 1}
                  </span>
                </div>

                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        banner.is_active
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-zinc-100 text-zinc-500 border border-zinc-200"
                      }`}
                    >
                      {banner.is_active ? (
                        <>
                          <CheckCircle2 className="size-3 text-emerald-600" /> Active on Homepage
                        </>
                      ) : (
                        <>
                          <XCircle className="size-3 text-zinc-400" /> Draft / Inactive
                        </>
                      )}
                    </span>
                    <span className="rounded bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-600">
                      Mode: {banner.content_mode === "image_only" ? "Image Only" : "Image + Overlay"}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-zinc-900 truncate">
                    {banner.title}
                  </h3>

                  {banner.subtitle && (
                    <p className="text-xs text-zinc-500 line-clamp-1">{banner.subtitle}</p>
                  )}

                  <div className="flex items-center gap-4 text-xs text-zinc-400 pt-1">
                    <span>Order: {banner.display_order}</span>
                    {banner.primary_cta_text && (
                      <span className="text-primary font-medium flex items-center gap-1">
                        CTA: {banner.primary_cta_text} &rarr; {banner.primary_cta_url}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-zinc-100">
                <button
                  type="button"
                  onClick={() => handleToggleActive(banner.id, banner.is_active)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
                    banner.is_active
                      ? "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
                      : "border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                  }`}
                >
                  {banner.is_active ? "Disable" : "Activate"}
                </button>

                <button
                  type="button"
                  onClick={() => openEditModal(banner)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50 transition-colors cursor-pointer"
                >
                  <Edit2 className="size-3.5 text-zinc-500" />
                  <span>Edit</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(banner.id)}
                  className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  title="Delete Banner"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit / Create Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-4xl rounded-2xl bg-white p-6 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4 mb-6">
              <div>
                <h2 className="font-display text-xl font-bold text-zinc-900">
                  {currentId ? "Edit Promotional Hero Banner" : "Create New Hero Banner"}
                </h2>
                <p className="text-xs text-zinc-500">
                  Customize artwork images, text overlays, and interactive call-to-action buttons.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              {/* Image Upload Row (Desktop & Mobile) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Desktop Asset */}
                <div className="rounded-xl border border-zinc-200 p-4 space-y-3 bg-zinc-50/50">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
                      <Monitor className="size-4 text-zinc-600" />
                      <span>Desktop Banner Artwork</span>
                    </label>
                    <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Auto-adapts any size
                    </span>
                  </div>

                  {desktopImageUrl ? (
                    <div className="relative aspect-[16/6] w-full rounded-lg overflow-hidden border border-zinc-200 bg-zinc-950 flex items-center justify-center group">
                      {/* Blurred ambient backdrop */}
                      <div
                        className="absolute inset-0 size-full scale-125 blur-lg opacity-40 bg-center bg-cover"
                        style={{ backgroundImage: `url(${desktopImageUrl})` }}
                      />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={desktopImageUrl}
                        alt="Desktop banner preview"
                        className="relative size-full object-cover object-center"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => setDesktopImageUrl("")}
                          className="rounded-lg bg-white/90 px-3 py-1.5 text-xs font-bold text-zinc-800 hover:bg-white shadow-md cursor-pointer"
                        >
                          Replace Image
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center aspect-[16/6] border-2 border-dashed border-zinc-300 rounded-lg hover:border-primary/50 bg-white cursor-pointer transition-colors p-4 text-center">
                      <Upload className="size-6 text-zinc-400 mb-1" />
                      <span className="text-xs font-semibold text-zinc-700">
                        {isUploadingDesktop ? "Uploading banner..." : "Upload Desktop Banner"}
                      </span>
                      <span className="text-[10px] text-zinc-400 mt-0.5">Any size or ratio • JPG, PNG, WEBP (up to 25MB)</span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={isUploadingDesktop}
                        onChange={(e) => handleFileUpload(e, "desktop")}
                        className="hidden"
                      />
                    </label>
                  )}
                  <input
                    type="text"
                    value={desktopImageUrl}
                    onChange={(e) => setDesktopImageUrl(e.target.value)}
                    placeholder="Or paste banner image URL directly"
                    className="w-full rounded-lg border border-zinc-200 px-3 py-1.5 text-xs text-zinc-700 bg-white"
                  />
                </div>

                {/* Mobile Asset */}
                <div className="rounded-xl border border-zinc-200 p-4 space-y-3 bg-zinc-50/50">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
                      <Smartphone className="size-4 text-zinc-600" />
                      <span>Mobile Banner Artwork (Optional)</span>
                    </label>
                    <span className="text-[10px] font-medium text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full">
                      Falls back to desktop
                    </span>
                  </div>

                  {mobileImageUrl ? (
                    <div className="relative aspect-[16/6] w-full rounded-lg overflow-hidden border border-zinc-200 bg-zinc-950 flex items-center justify-center group">
                      {/* Blurred ambient backdrop */}
                      <div
                        className="absolute inset-0 size-full scale-125 blur-lg opacity-40 bg-center bg-cover"
                        style={{ backgroundImage: `url(${mobileImageUrl})` }}
                      />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={mobileImageUrl}
                        alt="Mobile banner preview"
                        className="relative size-full object-cover object-center"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => setMobileImageUrl("")}
                          className="rounded-lg bg-white/90 px-3 py-1.5 text-xs font-bold text-zinc-800 hover:bg-white shadow-md cursor-pointer"
                        >
                          Replace Image
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center aspect-[16/6] border-2 border-dashed border-zinc-300 rounded-lg hover:border-primary/50 bg-white cursor-pointer transition-colors p-4 text-center">
                      <Upload className="size-6 text-zinc-400 mb-1" />
                      <span className="text-xs font-semibold text-zinc-700">
                        {isUploadingMobile ? "Uploading mobile banner..." : "Upload Mobile Banner"}
                      </span>
                      <span className="text-[10px] text-zinc-400 mt-0.5">Adapts any resolution (Square, 4:5, 16:9, etc.)</span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={isUploadingMobile}
                        onChange={(e) => handleFileUpload(e, "mobile")}
                        className="hidden"
                      />
                    </label>
                  )}
                  <input
                    type="text"
                    value={mobileImageUrl}
                    onChange={(e) => setMobileImageUrl(e.target.value)}
                    placeholder="Or paste mobile image URL directly"
                    className="w-full rounded-lg border border-zinc-200 px-3 py-1.5 text-xs text-zinc-700 bg-white"
                  />
                </div>
              </div>

              {/* Content Mode Selection */}
              <div className="rounded-xl border border-zinc-200 p-4 space-y-3 bg-white">
                <label className="text-xs font-bold text-zinc-900 block">Content Mode</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setContentMode("image_overlay")}
                    className={`flex items-start gap-3 p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      contentMode === "image_overlay"
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-zinc-200 hover:border-zinc-300"
                    }`}
                  >
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white border border-zinc-200 text-zinc-700">
                      <Sparkles className="size-4 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-zinc-900">Image + Content Overlay</div>
                      <p className="text-[11px] text-zinc-500 mt-0.5">
                        Displays HTML text, title, badges, and clickable buttons over the banner graphic.
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setContentMode("image_only")}
                    className={`flex items-start gap-3 p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      contentMode === "image_only"
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-zinc-200 hover:border-zinc-300"
                    }`}
                  >
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white border border-zinc-200 text-zinc-700">
                      <Layers className="size-4 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-zinc-900">Image Only (Designed Banner)</div>
                      <p className="text-[11px] text-zinc-500 mt-0.5">
                        Ideal if marketing created a banner image that already has its own typography baked in.
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Text Fields */}
              <div className="rounded-xl border border-zinc-200 p-4 space-y-4 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-900">Banner Title *</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Print Anything. Make It Yours."
                      className="w-full rounded-xl border border-zinc-200 px-3.5 py-2 text-xs font-semibold text-zinc-800 focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-900">Eyebrow / Small Marketing Label</label>
                    <input
                      type="text"
                      value={eyebrow}
                      onChange={(e) => setEyebrow(e.target.value)}
                      placeholder="e.g. CUSTOM PRINTING & PERSONALISED PRODUCTS"
                      className="w-full rounded-xl border border-zinc-200 px-3.5 py-2 text-xs text-zinc-800 focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-900">Subtitle / Tagline</label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="e.g. India's Premier Custom Printing & Merchandise Platform"
                    className="w-full rounded-xl border border-zinc-200 px-3.5 py-2 text-xs text-zinc-800 focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-900">Supporting Description</label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief 1-2 sentence description explaining the offer or collection..."
                    className="w-full rounded-xl border border-zinc-200 p-3 text-xs text-zinc-800 focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-900">Image Alt Text (SEO)</label>
                  <input
                    type="text"
                    value={altText}
                    onChange={(e) => setAltText(e.target.value)}
                    placeholder="e.g. PreetyPrints Custom Visiting Cards and Corporate Printing"
                    className="w-full rounded-xl border border-zinc-200 px-3.5 py-2 text-xs text-zinc-800 focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              {/* CTAs Configuration */}
              <div className="rounded-xl border border-zinc-200 p-4 space-y-4 bg-white">
                <h4 className="text-xs font-bold text-zinc-900">Call To Action Buttons</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Primary CTA */}
                  <div className="p-3.5 rounded-xl border border-zinc-200 space-y-3 bg-zinc-50/50">
                    <span className="text-xs font-bold text-zinc-800 block">Primary CTA</span>
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={primaryCtaText}
                        onChange={(e) => setPrimaryCtaText(e.target.value)}
                        placeholder="Button Text (e.g. Explore Products)"
                        className="w-full rounded-lg border border-zinc-200 px-3 py-1.5 text-xs bg-white"
                      />
                      <input
                        type="text"
                        value={primaryCtaUrl}
                        onChange={(e) => setPrimaryCtaUrl(e.target.value)}
                        placeholder="Destination URL (e.g. /products)"
                        className="w-full rounded-lg border border-zinc-200 px-3 py-1.5 text-xs bg-white"
                      />
                      <div className="flex items-center gap-3 pt-1">
                        <label className="text-[11px] text-zinc-500">Color:</label>
                        <input
                          type="color"
                          value={primaryCtaBgColor}
                          onChange={(e) => setPrimaryCtaBgColor(e.target.value)}
                          className="size-7 rounded border border-zinc-300 cursor-pointer"
                        />
                        <span className="text-[11px] font-mono text-zinc-600">{primaryCtaBgColor}</span>
                      </div>
                    </div>
                  </div>

                  {/* Secondary CTA */}
                  <div className="p-3.5 rounded-xl border border-zinc-200 space-y-3 bg-zinc-50/50">
                    <span className="text-xs font-bold text-zinc-800 block">Secondary CTA (Optional)</span>
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={secondaryCtaText}
                        onChange={(e) => setSecondaryCtaText(e.target.value)}
                        placeholder="Button Text (e.g. Get a Quote)"
                        className="w-full rounded-lg border border-zinc-200 px-3 py-1.5 text-xs bg-white"
                      />
                      <input
                        type="text"
                        value={secondaryCtaUrl}
                        onChange={(e) => setSecondaryCtaUrl(e.target.value)}
                        placeholder="Destination URL (e.g. /bulk-quote)"
                        className="w-full rounded-lg border border-zinc-200 px-3 py-1.5 text-xs bg-white"
                      />
                      <div className="flex items-center gap-3 pt-1">
                        <label className="text-[11px] text-zinc-500">Color:</label>
                        <input
                          type="color"
                          value={secondaryCtaBgColor}
                          onChange={(e) => setSecondaryCtaBgColor(e.target.value)}
                          className="size-7 rounded border border-zinc-300 cursor-pointer"
                        />
                        <span className="text-[11px] font-mono text-zinc-600">{secondaryCtaBgColor}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Visibility & Ordering */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-xl border border-zinc-200 p-3 space-y-1">
                  <label className="text-xs font-bold text-zinc-800 block">Display Order</label>
                  <input
                    type="number"
                    min={1}
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(Number(e.target.value))}
                    className="w-full rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-mono"
                  />
                </div>

                <div className="rounded-xl border border-zinc-200 p-3 space-y-1">
                  <label className="text-xs font-bold text-zinc-800 block">Dark Overlay</label>
                  <label className="flex items-center gap-2 pt-1 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={overlayEnabled}
                      onChange={(e) => setOverlayEnabled(e.target.checked)}
                      className="size-4 rounded text-primary"
                    />
                    <span>Dim image for readability</span>
                  </label>
                </div>

                <div className="rounded-xl border border-zinc-200 p-3 space-y-1">
                  <label className="text-xs font-bold text-zinc-800 block">Publish Status</label>
                  <label className="flex items-center gap-2 pt-1 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="size-4 rounded text-primary"
                    />
                    <span className={isActive ? "font-bold text-emerald-700" : "text-zinc-500"}>
                      {isActive ? "Active on Storefront" : "Draft / Inactive"}
                    </span>
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-2.5 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-600 hover:bg-zinc-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-primary text-xs font-bold text-white shadow-xs hover:bg-primary/90 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : currentId ? "Update Banner" : "Publish Banner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
