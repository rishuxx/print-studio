"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Product, ProductOption, QuantityTier } from "@/lib/commerce/types";
import { formatMoney, tierPrice, tierCompareAtPrice, findVariant } from "@/lib/pricing";
import { useCartStore } from "@/lib/cart-store";
import { createClient } from "@/lib/supabase/client";
import {
  ARTWORK_BUCKET,
  MAX_ARTWORK_SIZE_MB,
  validateArtworkFile,
  generateArtworkStoragePath,
  type ArtworkFileMetadata,
} from "@/lib/storage/artwork";
import {
  Check,
  Upload,
  Paintbrush,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
  Trash2,
  FileCheck,
  Loader2,
  Ruler,
  RotateCcw,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface ProductConfiguratorProps {
  product: Product;
}

export function ProductConfigurator({ product }: ProductConfiguratorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editLineId = searchParams.get("editLine");

  const addLine = useCartStore((state) => state.addLine);
  const updateLineConfig = useCartStore((state) => state.updateLineConfig);
  const getLine = useCartStore((state) => state.getLine);

  const existingLine = editLineId ? getLine(editLineId) : undefined;

  // 1. Manage selected product options (Paper, Finish, Size, Colour, etc.)
  const [selectedOptions, setSelectedOptions] = React.useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    product.options.forEach((opt) => {
      if (opt.values.length > 0) {
        initial[opt.name] = opt.values[0];
      }
    });

    // Populate from existing cart line if in edit mode
    if (existingLine) {
      existingLine.selectedOptions.forEach((opt) => {
        if (opt.name !== "Dimensions") {
          initial[opt.name] = opt.value;
        }
      });
    }

    return initial;
  });

  // 2. Custom Dimensions (for Flex, Vinyl, Sunboard, Banners, Signage)
  const isDimensionBased =
    product.categoryHandles.includes("signage") ||
    product.categoryHandles.includes("labels-packaging") ||
    product.productType.toLowerCase().includes("banner") ||
    product.productType.toLowerCase().includes("board") ||
    product.productType.toLowerCase().includes("flex");

  const [customWidth, setCustomWidth] = React.useState<number>(() => {
    if (existingLine) {
      const dim = existingLine.selectedOptions.find((o) => o.name === "Dimensions");
      if (dim) {
        const parts = dim.value.split("×");
        if (parts[0]) return Number(parts[0].trim()) || 3;
      }
    }
    return 3;
  });

  const [customHeight, setCustomHeight] = React.useState<number>(() => {
    if (existingLine) {
      const dim = existingLine.selectedOptions.find((o) => o.name === "Dimensions");
      if (dim) {
        const parts = dim.value.split("×");
        if (parts[1]) return Number(parts[1].split(" ")[0].trim()) || 2;
      }
    }
    return 2;
  });

  const [dimensionUnit, setDimensionUnit] = React.useState<"ft" | "inch" | "cm">(() => {
    if (existingLine) {
      const dim = existingLine.selectedOptions.find((o) => o.name === "Dimensions");
      if (dim) {
        if (dim.value.includes("inch")) return "inch";
        if (dim.value.includes("cm")) return "cm";
      }
    }
    return "ft";
  });

  // 3. Manage selected quantity tier / batch
  const [selectedTierIndex, setSelectedTierIndex] = React.useState<number>(() => {
    if (existingLine && existingLine.tierQty) {
      const idx = product.quantityTiers.findIndex((t) => t.qty === existingLine.tierQty);
      if (idx > -1) return idx;
    }
    return 0;
  });

  const selectedTier: QuantityTier = React.useMemo(() => {
    return product.quantityTiers[selectedTierIndex] ?? product.quantityTiers[0] ?? { qty: 1, price: product.priceFrom };
  }, [product.quantityTiers, product.priceFrom, selectedTierIndex]);

  // 4. Manage artwork preference (upload vs design assistance vs later)
  const [artworkOption, setArtworkOption] = React.useState<"upload" | "design-help" | "later">(() => {
    if (existingLine && existingLine.addOns.length > 0) return "design-help";
    if (existingLine && existingLine.design?.summary.includes("Artwork File")) return "upload";
    return "upload";
  });

  const [uploadedArtwork, setUploadedArtwork] = React.useState<ArtworkFileMetadata | null>(() => {
    if (existingLine && existingLine.design?.state) {
      try {
        const parsed = JSON.parse(existingLine.design.state);
        if (parsed.artworkMetadata) return parsed.artworkMetadata;
      } catch {
        // Fallback
      }
    }
    return null;
  });

  const [isUploading, setIsUploading] = React.useState(false);

  // 5. Selected variant resolution
  const matchedVariant = findVariant(product, selectedOptions);

  // 6. Dynamic price calculation (taking into account variant factors, custom square footage if applicable)
  const calculatedUnitPrice = React.useMemo(() => {
    let baseAmount = tierPrice(selectedTier, matchedVariant).amount;

    if (isDimensionBased) {
      let sqFt = 1;
      if (dimensionUnit === "ft") {
        sqFt = customWidth * customHeight;
      } else if (dimensionUnit === "inch") {
        sqFt = (customWidth * customHeight) / 144;
      } else if (dimensionUnit === "cm") {
        sqFt = (customWidth * customHeight) / 929.03;
      }
      sqFt = Math.max(1, sqFt);
      baseAmount = Math.round(baseAmount * (sqFt / 6));
    }

    return {
      amount: Math.max(selectedTier.price.amount, baseAmount),
      currencyCode: product.priceFrom.currencyCode,
    };
  }, [selectedTier, matchedVariant, isDimensionBased, customWidth, customHeight, dimensionUnit, product.priceFrom]);

  const calculatedCompareAtPrice = React.useMemo(() => {
    const rawCompare = tierCompareAtPrice(selectedTier, matchedVariant);
    if (!rawCompare) return null;
    return {
      amount: Math.round(rawCompare.amount * (calculatedUnitPrice.amount / selectedTier.price.amount)),
      currencyCode: product.priceFrom.currencyCode,
    };
  }, [selectedTier, matchedVariant, calculatedUnitPrice, product.priceFrom]);

  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionName]: value,
    }));
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Client-side file validation
    const validation = validateArtworkFile(file.name, file.type, file.size);
    if (!validation.valid) {
      toast.error("Invalid artwork file", { description: validation.error });
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading(`Uploading "${file.name}" to pre-press storage...`);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      const sessionId = Math.random().toString(36).substring(2, 10);
      const storagePath = generateArtworkStoragePath(
        user?.id || null,
        sessionId,
        validation.extension || ".pdf"
      );

      // 2. Upload binary to Supabase Storage 'artwork' private bucket
      const { data, error } = await supabase.storage
        .from(ARTWORK_BUCKET)
        .upload(storagePath, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type || "application/octet-stream",
        });

      if (error || !data) {
        throw new Error(error?.message || "Storage service rejected upload.");
      }

      const metadata: ArtworkFileMetadata = {
        bucket: ARTWORK_BUCKET,
        storagePath: data.path,
        originalFileName: file.name,
        mimeType: file.type,
        fileSizeBytes: file.size,
        uploadedAt: new Date().toISOString(),
        fileExtension: validation.extension || "",
      };

      setUploadedArtwork(metadata);
      toast.success(`Artwork "${file.name}" attached successfully!`, { id: toastId });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Upload failed.";
      toast.error("Artwork upload failed", {
        id: toastId,
        description: message,
      });
    } finally {
      setIsUploading(false);
      // Reset input value
      e.target.value = "";
    }
  };

  const handleRemoveFile = () => {
    setUploadedArtwork(null);
    toast.info("Artwork file removed.");
  };

  const handleSaveCartAction = () => {
    const optionEntries = Object.entries(selectedOptions).map(([name, value]) => ({
      name,
      value,
    }));

    const filteredEntries = optionEntries.filter((opt) => opt.name !== "Dimensions");

    if (isDimensionBased) {
      filteredEntries.push({
        name: "Dimensions",
        value: `${customWidth} × ${customHeight} ${dimensionUnit}`,
      });
    }

    const designSummary =
      artworkOption === "upload" && uploadedArtwork
        ? `Artwork: ${uploadedArtwork.originalFileName}`
        : artworkOption === "design-help"
        ? "Requested Design Assistance (+ Pre-press Proofing)"
        : "Sending Artwork Later";

    const payload = {
      productId: product.id,
      productHandle: product.handle,
      productTitle: product.title,
      variantId: matchedVariant?.id || `var-${product.id}`,
      variantTitle: matchedVariant?.title || "Custom Configuration",
      selectedOptions: filteredEntries,
      image: product.images[0] ?? { url: "", altText: product.title, width: 200, height: 200, kind: "card" },
      quantity: existingLine ? existingLine.quantity : 1, // preserve quantity if editing
      tierQty: selectedTier.qty,
      priceUnit: product.priceUnit,
      unitPrice: calculatedUnitPrice,
      compareAtUnitPrice: calculatedCompareAtPrice,
      design: {
        preview: "",
        state: JSON.stringify({
          options: selectedOptions,
          artworkOption,
          artworkMetadata: uploadedArtwork,
        }),
        summary: designSummary,
        side: "front" as const,
      },
      addOns:
        artworkOption === "design-help"
          ? [
              {
                id: "addon-design-help",
                title: "Pre-press Design Assistance",
                price: { amount: 24900, currencyCode: "INR" as const },
              },
            ]
          : [],
      turnaroundDays: product.turnaroundDays,
      sameDayEligible: product.sameDayEligible,
      customizable: product.customizable,
    };

    if (editLineId) {
      updateLineConfig(editLineId, payload);
      toast.success(`Updated configuration for ${product.title}!`);
      router.push("/cart");
    } else {
      addLine(payload);
      toast.success(`Added ${product.title} to Cart!`, {
        description: `${selectedTier.qty} ${product.priceUnit} with your selected custom specifications.`,
        action: {
          label: "View Cart",
          onClick: () => {
            router.push("/cart");
          },
        },
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Edit Mode Banner if editing existing cart item ─────────── */}
      {editLineId && (
        <div className="flex items-center justify-between rounded-xl border border-violet/30 bg-violet/10 p-3 text-xs">
          <div className="flex items-center gap-2 text-violet font-semibold">
            <RotateCcw className="size-4" />
            <span>Editing Existing Cart Item</span>
          </div>
          <Link href="/cart" className="text-muted-foreground hover:text-ink font-semibold">
            Cancel
          </Link>
        </div>
      )}

      {/* ── Pricing & Batch Summary ─────────────────────────────────── */}
      <div className="rounded-2xl border border-border bg-paper p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-violet">
            Configured Price
          </span>
          {calculatedCompareAtPrice && (
            <span className="font-mono text-xs text-muted-foreground line-through">
              {formatMoney(calculatedCompareAtPrice)}
            </span>
          )}
        </div>

        <div className="flex items-baseline gap-3">
          <span className="font-display text-3xl sm:text-4xl font-extrabold text-ink">
            {formatMoney(calculatedUnitPrice)}
          </span>
          <span className="text-xs font-mono text-muted-foreground">
            / {selectedTier.qty} {product.priceUnit}
          </span>
        </div>

        <div className="text-[0.6875rem] text-muted-foreground">
          GST calculated at checkout. Free standard dispatch on orders over ₹999.
        </div>
      </div>

      {/* ── Custom Dimension Selector (for Signage / Flex / Banners / Sunboard) ── */}
      {isDimensionBased && (
        <div className="rounded-2xl border border-border bg-white p-5 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-bold text-ink">
              <Ruler className="size-4 text-violet" />
              <span>Custom Dimensions:</span>
            </div>
            <div className="flex items-center gap-1">
              {(["ft", "inch", "cm"] as const).map((unit) => (
                <button
                  key={unit}
                  type="button"
                  onClick={() => setDimensionUnit(unit)}
                  className={`rounded-md px-2 py-0.5 font-mono text-[0.6875rem] uppercase font-bold transition-all ${
                    dimensionUnit === unit
                      ? "bg-violet text-white"
                      : "bg-paper text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {unit}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="space-y-1">
              <label className="text-[0.6875rem] text-muted-foreground font-mono">Width ({dimensionUnit})</label>
              <input
                type="number"
                min={1}
                max={50}
                value={customWidth}
                onChange={(e) => setCustomWidth(Math.max(1, Number(e.target.value)))}
                className="w-full rounded-xl border border-border px-3 py-2 text-xs font-mono font-bold text-ink focus:border-violet focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[0.6875rem] text-muted-foreground font-mono">Height ({dimensionUnit})</label>
              <input
                type="number"
                min={1}
                max={50}
                value={customHeight}
                onChange={(e) => setCustomHeight(Math.max(1, Number(e.target.value)))}
                className="w-full rounded-xl border border-border px-3 py-2 text-xs font-mono font-bold text-ink focus:border-violet focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Dynamic Product Options (Paper, Stock, Finish, Size, Color, etc.) ── */}
      {product.options.map((option: ProductOption) => (
        <div key={option.name} className="space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-ink">{option.name}:</span>
            <span className="font-mono text-violet font-semibold">
              {selectedOptions[option.name]}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {option.values.map((val) => {
              const isSelected = selectedOptions[option.name] === val;
              return (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleOptionChange(option.name, val)}
                  className={`flex items-center justify-between rounded-xl border p-2.5 text-left text-xs transition-all ${
                    isSelected
                      ? "border-violet bg-violet/5 font-bold text-violet ring-1 ring-violet shadow-sm"
                      : "border-border bg-white text-ink hover:border-violet/40 hover:bg-paper"
                  }`}
                >
                  <span className="truncate">{val}</span>
                  {isSelected && <Check className="size-3.5 shrink-0 text-violet" />}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* ── Quantity Tiers Selection ──────────────────────────────── */}
      {product.quantityTiers.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-ink">Select Quantity Batch:</span>
            <span className="font-mono text-muted-foreground">
              Min: {product.minOrderQty}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {product.quantityTiers.map((tier, idx) => {
              const isSelected = selectedTierIndex === idx;
              return (
                <button
                  key={tier.qty}
                  type="button"
                  onClick={() => setSelectedTierIndex(idx)}
                  className={`flex flex-col rounded-xl border p-3 text-center transition-all ${
                    isSelected
                      ? "border-violet bg-violet/5 font-bold text-violet ring-1 ring-violet shadow-sm"
                      : "border-border bg-white text-ink hover:border-violet/40 hover:bg-paper"
                  }`}
                >
                  <span className="font-mono text-sm font-extrabold">{tier.qty}</span>
                  <span className="text-[0.6875rem] text-muted-foreground truncate">
                    {formatMoney(tier.price)}
                  </span>
                  {tier.note && (
                    <span className="mt-1 inline-block rounded bg-marigold/20 px-1 py-0.5 text-[0.625rem] font-bold text-marigold-deep">
                      {tier.note}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Artwork Upload & Pre-Press Section ─────────────────────── */}
      <div className="rounded-2xl border border-border bg-white p-5 space-y-3">
        <span className="font-bold text-xs text-ink block">Artwork & Print File:</span>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
          <button
            type="button"
            onClick={() => setArtworkOption("upload")}
            className={`rounded-xl border p-3 text-left transition-all ${
              artworkOption === "upload"
                ? "border-violet bg-violet/5 text-violet font-bold"
                : "border-border hover:bg-paper"
            }`}
          >
            <div className="flex items-center gap-2">
              <Upload className="size-3.5" />
              <span>Upload Design</span>
            </div>
            <div className="mt-1 text-[0.6875rem] text-muted-foreground font-normal">
              PDF, AI, CDR, PNG
            </div>
          </button>

          <button
            type="button"
            onClick={() => setArtworkOption("design-help")}
            className={`rounded-xl border p-3 text-left transition-all ${
              artworkOption === "design-help"
                ? "border-violet bg-violet/5 text-violet font-bold"
                : "border-border hover:bg-paper"
            }`}
          >
            <div className="flex items-center gap-2">
              <Paintbrush className="size-3.5" />
              <span>Need Design Help</span>
            </div>
            <div className="mt-1 text-[0.6875rem] text-muted-foreground font-normal">
              Pre-press file review
            </div>
          </button>

          <button
            type="button"
            onClick={() => setArtworkOption("later")}
            className={`rounded-xl border p-3 text-left transition-all ${
              artworkOption === "later"
                ? "border-violet bg-violet/5 text-violet font-bold"
                : "border-border hover:bg-paper"
            }`}
          >
            <div className="flex items-center gap-2">
              <Zap className="size-3.5" />
              <span>Send Files Later</span>
            </div>
            <div className="mt-1 text-[0.6875rem] text-muted-foreground font-normal">
              Email after order
            </div>
          </button>
        </div>

        {artworkOption === "upload" && (
          <div className="mt-2 rounded-xl border border-dashed border-border bg-paper p-4 text-center">
            {uploadedArtwork ? (
              <div className="flex items-center justify-between rounded-xl bg-white border border-border p-3 text-xs">
                <div className="flex items-center gap-2">
                  <FileCheck className="size-4 text-emerald-600 shrink-0" />
                  <div className="text-left">
                    <span className="font-bold text-ink block truncate max-w-56">{uploadedArtwork.originalFileName}</span>
                    <span className="text-[0.6875rem] text-muted-foreground font-mono">
                      {(uploadedArtwork.fileSizeBytes / (1024 * 1024)).toFixed(2)} MB · {uploadedArtwork.fileExtension.toUpperCase().replace(".", "")}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="rounded-lg p-1 text-muted-foreground hover:text-red-500 transition-colors"
                  aria-label="Remove uploaded file"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ) : isUploading ? (
              <div className="flex flex-col items-center justify-center py-4 space-y-2">
                <Loader2 className="size-6 text-violet animate-spin" />
                <span className="text-xs font-bold text-ink">Uploading & validating print asset...</span>
                <span className="text-[0.6875rem] text-muted-foreground font-mono">Max {MAX_ARTWORK_SIZE_MB}MB</span>
              </div>
            ) : (
              <>
                <input
                  type="file"
                  id="artwork-upload-input"
                  className="hidden"
                  onChange={handleFileSelect}
                  accept=".pdf,.png,.jpg,.jpeg,.webp,.tiff,.tif"
                />
                <label
                  htmlFor="artwork-upload-input"
                  className="cursor-pointer inline-flex items-center gap-2 text-xs font-semibold text-violet hover:underline"
                >
                  <Upload className="size-4" />
                  <span>Browse print file (PDF, PNG, JPG, WEBP, TIFF)</span>
                </label>
                <p className="mt-1 text-[0.6875rem] text-muted-foreground">
                  Up to {MAX_ARTWORK_SIZE_MB}MB · 300 DPI, CMYK format with 3mm bleed margin recommended.
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {/* ── 4. Primary Order & Quote Actions ─────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          type="button"
          onClick={handleSaveCartAction}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-violet py-3.5 px-6 text-xs font-bold text-white shadow-lift hover:bg-violet-lift transition-all active:scale-[0.98]"
        >
          <span>{editLineId ? "Update Cart Configuration" : "Add Configured Product to Cart"}</span>
          <ArrowRight className="size-4" />
        </button>

        <Link
          href={`/bulk-quote?product=${encodeURIComponent(product.title)}`}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-white py-3.5 px-5 text-xs font-semibold text-ink hover:bg-paper transition-all"
        >
          <span>Request Bulk Quote</span>
        </Link>
      </div>

      {/* Trust & Guarantee points */}
      <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
          <span>Pre-press digital proof before print</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-4 text-violet shrink-0" />
          <span>Quality output inspected</span>
        </div>
      </div>
    </div>
  );
}
