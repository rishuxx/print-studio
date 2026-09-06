"use client";

import * as React from "react";
import { DatabaseBusinessSettings } from "@/lib/settings/types";
import { saveBrandingSettingsAction, uploadBannerImageAction } from "@/lib/hero/actions";
import { toast } from "sonner";
import { Palette, Image as ImageIcon, Type, Upload, Check, RefreshCw } from "lucide-react";

interface AdminBrandingManagerProps {
  initialSettings: DatabaseBusinessSettings;
}

export function AdminBrandingManager({ initialSettings }: AdminBrandingManagerProps) {
  const [logoMode, setLogoMode] = React.useState<"text" | "image">(
    (initialSettings as any).logo_mode || (initialSettings.logo_url ? "image" : "text")
  );
  const [logoUrl, setLogoUrl] = React.useState<string>(initialSettings.logo_url || "");
  const [logoMobileUrl, setLogoMobileUrl] = React.useState<string>(
    (initialSettings as any).logo_mobile_url || ""
  );
  const [logoAltText, setLogoAltText] = React.useState<string>(
    (initialSettings as any).logo_alt_text || initialSettings.business_name
  );
  const [logoHeightDesktop, setLogoHeightDesktop] = React.useState<number>(
    Number((initialSettings as any).logo_height_desktop) || 54
  );
  const [logoHeightMobile, setLogoHeightMobile] = React.useState<number>(
    Number((initialSettings as any).logo_height_mobile) || 40
  );
  const [faviconUrl, setFaviconUrl] = React.useState<string>(
    (initialSettings as any).favicon_url || ""
  );
  const [businessName, setBusinessName] = React.useState<string>(initialSettings.business_name);
  const [primaryColor, setPrimaryColor] = React.useState<string>(
    (initialSettings as any).primary_brand_color || "#e53935"
  );
  const [secondaryColor, setSecondaryColor] = React.useState<string>(
    (initialSettings as any).secondary_brand_color || "#fef2f2"
  );
  const [accentColor, setAccentColor] = React.useState<string>(
    (initialSettings as any).accent_brand_color || "#f97316"
  );

  const [isUploadingLogo, setIsUploadingLogo] = React.useState(false);
  const [isUploadingFavicon, setIsUploadingFavicon] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingFavicon(true);
    try {
      // 1. Direct client-side upload to Supabase Storage
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const { PRODUCT_MEDIA_BUCKET } = await import("@/lib/storage/product-media-utils");
        const supabase = createClient();

        const ext = (file.name.split(".").pop() || "ico").toLowerCase().replace(/[^a-z0-9]/g, "");
        const fileName = `branding/favicon-${Date.now()}.${ext}`;

        const { error: clientUploadErr } = await supabase.storage
          .from(PRODUCT_MEDIA_BUCKET)
          .upload(fileName, file, {
            contentType: file.type || "image/x-icon",
            upsert: true,
          });

        if (!clientUploadErr) {
          const { data } = supabase.storage.from(PRODUCT_MEDIA_BUCKET).getPublicUrl(fileName);
          if (data?.publicUrl) {
            setFaviconUrl(data.publicUrl);
            toast.success("Favicon uploaded successfully.");
            return;
          }
        }
      } catch (clientErr) {
        console.warn("Direct favicon upload fallback:", clientErr);
      }

      // 2. Server action fallback
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "branding");

      const res = await uploadBannerImageAction(formData);
      if (res.success && res.url) {
        setFaviconUrl(res.url);
        toast.success("Favicon uploaded successfully.");
      } else {
        toast.error(res.error || "Failed to upload favicon.");
      }
    } catch {
      toast.error("Favicon upload error.");
    } finally {
      setIsUploadingFavicon(false);
      e.target.value = "";
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>, isMobile = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingLogo(true);
    try {
      // 1. Direct client-side upload to Supabase Storage
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const { PRODUCT_MEDIA_BUCKET } = await import("@/lib/storage/product-media-utils");
        const supabase = createClient();

        const ext = (file.name.split(".").pop() || "png").toLowerCase().replace(/[^a-z0-9]/g, "");
        const fileName = `branding/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`;

        const { error: clientUploadErr } = await supabase.storage
          .from(PRODUCT_MEDIA_BUCKET)
          .upload(fileName, file, {
            contentType: file.type || "image/png",
            upsert: true,
          });

        if (!clientUploadErr) {
          const { data } = supabase.storage.from(PRODUCT_MEDIA_BUCKET).getPublicUrl(fileName);
          if (data?.publicUrl) {
            if (isMobile) {
              setLogoMobileUrl(data.publicUrl);
            } else {
              setLogoUrl(data.publicUrl);
            }
            toast.success("Logo uploaded successfully.");
            return;
          }
        }
      } catch (clientErr) {
        console.warn("Direct logo upload fallback:", clientErr);
      }

      // 2. Server action fallback
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "branding");

      const res = await uploadBannerImageAction(formData);
      if (res.success && res.url) {
        if (isMobile) {
          setLogoMobileUrl(res.url);
        } else {
          setLogoUrl(res.url);
        }
        toast.success("Logo uploaded successfully.");
      } else {
        toast.error(res.error || "Failed to upload logo.");
      }
    } catch {
      toast.error("Upload error.");
    } finally {
      setIsUploadingLogo(false);
      e.target.value = "";
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await saveBrandingSettingsAction({
        logo_mode: logoMode,
        logo_url: logoUrl || null,
        logo_mobile_url: logoMobileUrl || null,
        logo_alt_text: logoAltText,
        logo_height_desktop: logoHeightDesktop,
        logo_height_mobile: logoHeightMobile,
        favicon_url: faviconUrl || null,
        business_name: businessName,
        primary_brand_color: primaryColor,
        secondary_brand_color: secondaryColor,
        accent_brand_color: accentColor,
      });

      if (res.success) {
        toast.success("Branding, logo, and favicon settings saved! Updating storefront...");
      } else {
        toast.error(res.error || "Failed to save settings.");
      }
    } catch {
      toast.error("An error occurred while saving branding settings.");
    } finally {
      setIsSaving(false);
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
                Storefront Visual Identity
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">
              Branding & Logo Control
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 max-w-2xl leading-relaxed">
              Configure your store logo presentation (image logo or text logo), upload responsive logo files, and fine-tune primary brand colors across the customer storefront.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Logo Mode Selection */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-zinc-900">Logo Presentation Mode</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setLogoMode("text")}
              className={`flex items-start gap-3 p-4 rounded-xl border text-left cursor-pointer transition-all ${
                logoMode === "text"
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-zinc-200 hover:border-zinc-300"
              }`}
            >
              <div className="flex size-9 items-center justify-center rounded-lg bg-white border border-zinc-200 text-zinc-700">
                <Type className="size-5 text-primary" />
              </div>
              <div>
                <div className="text-xs font-bold text-zinc-900">Text Logo (Clean Typography)</div>
                <p className="text-[11px] text-zinc-500 mt-1">
                  Renders the brand name using modern geometric typography with subtle signature CMYK accent.
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setLogoMode("image")}
              className={`flex items-start gap-3 p-4 rounded-xl border text-left cursor-pointer transition-all ${
                logoMode === "image"
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-zinc-200 hover:border-zinc-300"
              }`}
            >
              <div className="flex size-9 items-center justify-center rounded-lg bg-white border border-zinc-200 text-zinc-700">
                <ImageIcon className="size-5 text-primary" />
              </div>
              <div>
                <div className="text-xs font-bold text-zinc-900">Image Logo (Custom Upload)</div>
                <p className="text-[11px] text-zinc-500 mt-1">
                  Renders an uploaded transparent PNG/SVG/WEBP logo file across desktop and mobile headers.
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Image Logo Uploader */}
        {logoMode === "image" && (
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xs space-y-4">
            <h2 className="text-sm font-bold text-zinc-900">Logo File Assets</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Primary Logo */}
              <div className="rounded-xl border border-zinc-200 p-4 space-y-3 bg-zinc-50/50">
                <label className="text-xs font-bold text-zinc-800 block">
                  Desktop & General Logo (PNG, SVG, WEBP)
                </label>
                {logoUrl ? (
                  <div className="relative h-24 w-full rounded-lg border border-zinc-200 bg-white flex items-center justify-center p-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={logoUrl}
                      alt={logoAltText || "Brand logo"}
                      className="max-h-full max-w-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => setLogoUrl("")}
                      className="absolute top-2 right-2 rounded bg-black/70 px-2 py-0.5 text-[10px] text-white hover:bg-black cursor-pointer"
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-zinc-300 rounded-lg hover:border-primary/50 bg-white cursor-pointer transition-colors p-3 text-center">
                    <Upload className="size-5 text-zinc-400 mb-1" />
                    <span className="text-xs font-semibold text-zinc-700">
                      {isUploadingLogo ? "Uploading..." : "Upload Logo File"}
                    </span>
                    <span className="text-[10px] text-zinc-400">Transparent background recommended</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={isUploadingLogo}
                      onChange={(e) => handleLogoUpload(e, false)}
                      className="hidden"
                    />
                  </label>
                )}
                <input
                  type="text"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="Or enter logo image URL directly"
                  className="w-full rounded-lg border border-zinc-200 px-3 py-1.5 text-xs bg-white"
                />
              </div>

              {/* Alt Text & Mobile Variant */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-800">Logo Alt Text</label>
                  <input
                    type="text"
                    value={logoAltText}
                    onChange={(e) => setLogoAltText(e.target.value)}
                    placeholder="e.g. PreetyPrints — Custom Online Printing"
                    className="w-full rounded-xl border border-zinc-200 px-3.5 py-2 text-xs"
                  />
                  <p className="text-[11px] text-zinc-400">Essential for SEO and accessibility screen readers.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-800">Mobile Logo URL (Optional)</label>
                  <input
                    type="text"
                    value={logoMobileUrl}
                    onChange={(e) => setLogoMobileUrl(e.target.value)}
                    placeholder="Optional compact mobile logo or icon"
                    className="w-full rounded-xl border border-zinc-200 px-3.5 py-2 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Logo Sizing Control Sliders */}
            <div className="border-t border-zinc-100 pt-5 mt-2 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-zinc-900">Logo Size & Header Scale</h3>
                  <p className="text-[11px] text-zinc-500">
                    Adjust the height in pixels to make your logo as prominent as needed.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setLogoHeightDesktop(54);
                    setLogoHeightMobile(40);
                  }}
                  className="text-[11px] font-semibold text-primary hover:underline cursor-pointer"
                >
                  Reset Defaults
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-zinc-50/70 p-4 rounded-xl border border-zinc-200">
                {/* Desktop Size */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
                      <span>Desktop Header Logo Height</span>
                    </label>
                    <span className="text-xs font-mono font-bold text-primary bg-white border border-zinc-200 px-2 py-0.5 rounded">
                      {logoHeightDesktop}px
                    </span>
                  </div>
                  <input
                    type="range"
                    min={24}
                    max={96}
                    step={2}
                    value={logoHeightDesktop}
                    onChange={(e) => setLogoHeightDesktop(Number(e.target.value))}
                    className="w-full accent-primary cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
                    <span>24px (Small)</span>
                    <span>54px (Standard)</span>
                    <span>96px (Extra Large)</span>
                  </div>
                </div>

                {/* Mobile Size */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
                      <span>Mobile Header Logo Height</span>
                    </label>
                    <span className="text-xs font-mono font-bold text-primary bg-white border border-zinc-200 px-2 py-0.5 rounded">
                      {logoHeightMobile}px
                    </span>
                  </div>
                  <input
                    type="range"
                    min={20}
                    max={64}
                    step={2}
                    value={logoHeightMobile}
                    onChange={(e) => setLogoHeightMobile(Number(e.target.value))}
                    className="w-full accent-primary cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
                    <span>20px (Compact)</span>
                    <span>40px (Standard)</span>
                    <span>64px (Large)</span>
                  </div>
                </div>
              </div>

              {/* Live Preview Bar */}
              {logoUrl && (
                <div className="rounded-xl border border-zinc-200 bg-white p-4 space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                    Live Header Appearance Preview
                  </div>
                  <div className="flex items-center gap-6 p-4 rounded-lg bg-zinc-50 border border-dashed border-zinc-200 min-h-[72px] overflow-x-auto">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={logoUrl}
                      alt="Preview"
                      style={{ height: `${logoHeightDesktop}px`, maxHeight: `${logoHeightDesktop}px` }}
                      className="w-auto object-contain transition-all"
                    />
                    <div className="h-6 w-px bg-zinc-200 hidden sm:block" />
                    <span className="text-xs text-zinc-400 italic hidden sm:inline">
                      Simulating navigation header presentation at {logoHeightDesktop}px height
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Website Favicon (Browser Tab Icon) */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                <span>Website Favicon (Browser Tab Icon)</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                  Tab & Bookmark Icon
                </span>
              </h2>
              <p className="text-xs text-zinc-500 mt-1">
                Customize the icon displayed in browser tabs, bookmarks, and mobile home screen shortcuts across the entire website and admin panel.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {/* Live Browser Tab Mockup */}
            <div className="rounded-xl border border-zinc-200 p-4 bg-zinc-50/70 space-y-3">
              <label className="text-xs font-bold text-zinc-800 block">
                Browser Tab Simulation
              </label>
              
              {/* Chrome-like Tab Frame */}
              <div className="rounded-lg border border-zinc-300 bg-zinc-200/80 p-2 space-y-2">
                <div className="flex items-center gap-1.5 pb-1">
                  <div className="size-2 rounded-full bg-rose-400" />
                  <div className="size-2 rounded-full bg-amber-400" />
                  <div className="size-2 rounded-full bg-emerald-400" />
                </div>
                <div className="flex items-center gap-2 bg-white rounded-md px-2.5 py-1.5 shadow-2xs border border-zinc-200 max-w-full">
                  <div className="size-4 shrink-0 flex items-center justify-center rounded overflow-hidden bg-zinc-100">
                    {faviconUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={faviconUrl}
                        alt="Favicon"
                        className="size-4 object-contain"
                      />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src="/favicon.ico"
                        alt="Default Favicon"
                        className="size-4 object-contain"
                      />
                    )}
                  </div>
                  <span className="text-[11px] font-semibold text-zinc-800 truncate">
                    {businessName || "PreetyPrints"} · Custom Printing
                  </span>
                  <span className="text-[10px] text-zinc-400 ml-auto">×</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <div className="flex flex-col items-center gap-1">
                  <div className="size-8 rounded-lg border border-zinc-200 bg-white flex items-center justify-center p-1 shadow-2xs">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={faviconUrl || "/favicon.ico"}
                      alt="16px preview"
                      className="size-4 object-contain"
                    />
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500">16×16</span>
                </div>

                <div className="flex flex-col items-center gap-1">
                  <div className="size-10 rounded-lg border border-zinc-200 bg-white flex items-center justify-center p-1.5 shadow-2xs">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={faviconUrl || "/favicon.ico"}
                      alt="32px preview"
                      className="size-6 object-contain"
                    />
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500">32×32</span>
                </div>

                <div className="flex flex-col items-center gap-1">
                  <div className="size-12 rounded-lg border border-zinc-200 bg-white flex items-center justify-center p-2 shadow-2xs">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={faviconUrl || "/favicon.ico"}
                      alt="48px preview"
                      className="size-8 object-contain"
                    />
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500">48×48</span>
                </div>
              </div>
            </div>

            {/* Upload & URL Controls */}
            <div className="md:col-span-2 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Upload Button */}
                <label className="flex flex-col items-center justify-center h-28 border-2 border-dashed border-zinc-300 rounded-xl hover:border-primary/60 bg-zinc-50 hover:bg-white cursor-pointer transition-colors p-4 text-center">
                  <Upload className="size-5 text-zinc-500 mb-1.5" />
                  <span className="text-xs font-bold text-zinc-700">
                    {isUploadingFavicon ? "Uploading Favicon..." : "Upload New Favicon"}
                  </span>
                  <span className="text-[10px] text-zinc-400 mt-0.5">
                    Supports .ico, .png, or .svg (Square 1:1, min 32×32)
                  </span>
                  <input
                    type="file"
                    accept=".ico,image/png,image/svg+xml,image/x-icon,image/webp"
                    disabled={isUploadingFavicon}
                    onChange={handleFaviconUpload}
                    className="hidden"
                  />
                </label>

                {/* Reset / Clear Option */}
                <div className="flex flex-col justify-between p-4 rounded-xl border border-zinc-200 bg-zinc-50/50">
                  <div>
                    <div className="text-xs font-bold text-zinc-800">Default Fallback</div>
                    <p className="text-[11px] text-zinc-500 mt-1">
                      Clear custom favicon to revert to the default high-resolution brand icon (`/favicon.ico`).
                    </p>
                  </div>
                  {faviconUrl && (
                    <button
                      type="button"
                      onClick={() => setFaviconUrl("")}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-300 bg-white text-xs font-semibold text-zinc-700 hover:bg-zinc-100 cursor-pointer mt-2"
                    >
                      Reset to Default Favicon
                    </button>
                  )}
                </div>
              </div>

              {/* Direct URL input */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-800">
                  Favicon CDN / Remote URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={faviconUrl}
                    onChange={(e) => setFaviconUrl(e.target.value)}
                    placeholder="https://.../favicon.ico or upload above"
                    className="flex-1 rounded-xl border border-zinc-200 px-3 py-2 text-xs font-mono"
                  />
                  {faviconUrl && (
                    <button
                      type="button"
                      onClick={() => setFaviconUrl("")}
                      className="px-3 py-2 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-zinc-400">
                  Upload an image above or paste any publicly hosted URL directly.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Brand Text & Colors */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-zinc-900">Brand Identity & Color Tokens</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-800">Brand Name</label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="PreetyPrints"
                className="w-full rounded-xl border border-zinc-200 px-3.5 py-2 text-xs font-semibold"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-zinc-700 block truncate">Primary Red</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="size-8 rounded border border-zinc-300 cursor-pointer"
                  />
                  <span className="text-[10px] font-mono text-zinc-500">{primaryColor}</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-zinc-700 block truncate">Wash Tint</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="size-8 rounded border border-zinc-300 cursor-pointer"
                  />
                  <span className="text-[10px] font-mono text-zinc-500">{secondaryColor}</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-zinc-700 block truncate">Accent Warm</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="size-8 rounded border border-zinc-300 cursor-pointer"
                  />
                  <span className="text-[10px] font-mono text-zinc-500">{accentColor}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-xs font-bold text-white shadow-xs hover:bg-primary/90 transition-all cursor-pointer disabled:opacity-50"
          >
            {isSaving ? <RefreshCw className="size-4 animate-spin" /> : <Check className="size-4" />}
            <span>{isSaving ? "Saving..." : "Save Branding Configuration"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
