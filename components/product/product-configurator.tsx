"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Product, ProductOption, QuantityTier } from "@/lib/commerce/types";
import { formatMoney, tierPrice, tierCompareAtPrice, findVariant } from "@/lib/pricing";
import { useCartStore } from "@/lib/cart-store";
import { createClient } from "@/lib/supabase/client";
import { getLiveProductPriceAction } from "@/lib/actions/cart-actions";
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
  AlertCircle,
  FileText,
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

  // Real-time synchronization: listen for admin price/status changes and refresh server state silently
  React.useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`product-sync-${product.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "products", filter: `id=eq.${product.id}` },
        () => {
          toast("Product details updated. Refreshing prices...");
          router.refresh();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "product_prices", filter: `product_id=eq.${product.id}` },
        () => {
          toast("Prices updated. Refreshing...");
          router.refresh();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "product_quantity_tiers", filter: `product_id=eq.${product.id}` },
        () => {
          toast("Volume discounts updated. Refreshing...");
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [product.id, router]);

  // 1. Manage selected product options
  const [selectedOptions, setSelectedOptions] = React.useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    product.options.forEach((opt) => {
      if (opt.values.length > 0) {
        initial[opt.name] = opt.values[0];
      }
    });

    if (existingLine) {
      existingLine.selectedOptions.forEach((opt) => {
        if (opt.name !== "Dimensions") {
          initial[opt.name] = opt.value;
        }
      });
    }

    return initial;
  });

  // 2. Custom Dimensions (for Frames, Signage, Banners, Flex, Acrylic Signs)
  const isDimensionBased =
    product.categoryHandles.includes("signage") ||
    product.categoryHandles.includes("labels-packaging") ||
    product.categoryHandles.includes("frames") ||
    product.productType.toLowerCase().includes("banner") ||
    product.productType.toLowerCase().includes("frame") ||
    product.productType.toLowerCase().includes("acrylic") ||
    product.productType.toLowerCase().includes("flex");

  const [customWidth, setCustomWidth] = React.useState<number>(() => {
    if (existingLine) {
      const dim = existingLine.selectedOptions.find((o) => o.name === "Dimensions");
      if (dim) {
        const parts = dim.value.split("×");
        if (parts[0]) return Number(parts[0].trim()) || 12;
      }
    }
    return 12;
  });

  const [customHeight, setCustomHeight] = React.useState<number>(() => {
    if (existingLine) {
      const dim = existingLine.selectedOptions.find((o) => o.name === "Dimensions");
      if (dim) {
        const parts = dim.value.split("×");
        if (parts[1]) return Number(parts[1].split(" ")[0].trim()) || 18;
      }
    }
    return 18;
  });

  const [dimensionUnit, setDimensionUnit] = React.useState<"ft" | "inch" | "cm">(() => {
    if (existingLine) {
      const dim = existingLine.selectedOptions.find((o) => o.name === "Dimensions");
      if (dim && dim.value.includes("ft")) return "ft";
      if (dim && dim.value.includes("cm")) return "cm";
      if (dim && dim.value.includes("inch")) return "inch";
    }
    return "inch";
  });

  // 3. Manage Selected Quantity Tier
  const [selectedTierQty, setSelectedTierQty] = React.useState<number>(() => {
    if (existingLine && existingLine.tierQty) return existingLine.tierQty;
    return product.quantityTiers[0]?.qty || product.minOrderQty || 1;
  });

  // 4. Artwork File Upload State
  const [uploadedArtwork, setUploadedArtwork] = React.useState<ArtworkFileMetadata | null>(() => {
    if (existingLine && existingLine.design?.state) {
      try {
        const parsed = JSON.parse(existingLine.design.state);
        if (parsed.storagePath && parsed.originalFileName) {
          return parsed as ArtworkFileMetadata;
        }
      } catch {}
    }
    return null;
  });
  const [isUploadingArtwork, setIsUploadingArtwork] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // 5. Personalization Options
  const [isPersonalized, setIsPersonalized] = React.useState(false);
  const [needsDesignAssistance, setNeedsDesignAssistance] = React.useState(false);
  const [designInstructions, setDesignInstructions] = React.useState("");

  // 6. Server-authoritative live price state & validation errors
  const [isCalculatingPrice, setIsCalculatingPrice] = React.useState(false);
  const [validationErrors, setValidationErrors] = React.useState<string[]>([]);
  const [serverPricePaise, setServerPricePaise] = React.useState<number>(() => product.priceFrom.amount);
  const [serverUnitPricePaise, setServerUnitPricePaise] = React.useState<number>(() => product.priceFrom.amount);
  const [serverCompareAtPaise, setServerCompareAtPaise] = React.useState<number | null>(
    () => product.compareAtFrom?.amount || null
  );

  // Match Variant based on current selections
  const matchedVariant = findVariant(product, selectedOptions);

  // Request sequencing counter to prevent race conditions from out-of-order responses
  const requestSeqRef = React.useRef(0);

  // Debounced server-side price recalculation & configuration validation
  React.useEffect(() => {
    const currentSeq = ++requestSeqRef.current;
    setIsCalculatingPrice(true);

    const timer = setTimeout(async () => {
      try {
        const optionsList = Object.entries(selectedOptions).map(([name, value]) => ({
          name,
          value,
        }));

        const dimensionsPayload = isDimensionBased
          ? {
              width: customWidth,
              height: customHeight,
              unit: dimensionUnit,
            }
          : null;

        const res = await getLiveProductPriceAction(
          product.id,
          selectedTierQty,
          matchedVariant?.id,
          isPersonalized,
          needsDesignAssistance,
          {
            selectedOptions: optionsList,
            dimensions: dimensionsPayload,
            specialInstructions: designInstructions,
            tierQty: selectedTierQty,
          }
        );

        // Discard stale responses
        if (currentSeq !== requestSeqRef.current) return;

        if (res.success && res.pricePaise !== undefined) {
          setServerPricePaise(res.pricePaise);
          setServerUnitPricePaise(res.unitPricePaise || Math.round(res.pricePaise / Math.max(1, selectedTierQty)));
          setServerCompareAtPaise(res.compareAtPaise ?? null);
          setValidationErrors([]);
        } else {
          setValidationErrors(res.errors || [res.error || "Configuration combination is currently unavailable."]);
        }
      } catch {
        if (currentSeq === requestSeqRef.current) {
          setValidationErrors(["Unable to connect to live pricing server."]);
        }
      } finally {
        if (currentSeq === requestSeqRef.current) {
          setIsCalculatingPrice(false);
        }
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [
    product.id,
    selectedOptions,
    selectedTierQty,
    isDimensionBased,
    customWidth,
    customHeight,
    dimensionUnit,
    isPersonalized,
    needsDesignAssistance,
    designInstructions,
    matchedVariant?.id,
  ]);

  // Handle Option Click with dependency auto-adjustment
  const handleOptionSelect = (optionName: string, value: string) => {
    setSelectedOptions((prev) => {
      const updated = { ...prev, [optionName]: value };

      // Dependency Rule: Circular shape cannot have Rounded Corners
      if (optionName.toLowerCase() === "shape" && value.toLowerCase().includes("circle")) {
        const cornerKey = Object.keys(updated).find((k) => k.toLowerCase().includes("corner"));
        if (cornerKey && updated[cornerKey]?.toLowerCase().includes("rounded")) {
          updated[cornerKey] = "Standard Square";
        }
      }

      // Dependency Rule: Velvet/Anti-scratch finish requires heavy GSM
      if (
        (optionName.toLowerCase().includes("finish") || optionName.toLowerCase().includes("lamination")) &&
        (value.toLowerCase().includes("velvet") || value.toLowerCase().includes("anti-scratch"))
      ) {
        const gsmKey = Object.keys(updated).find((k) => k.toLowerCase().includes("gsm"));
        if (gsmKey && (updated[gsmKey]?.includes("130") || updated[gsmKey]?.includes("170"))) {
          const gsmOpt = product.options.find((o) => o.name === gsmKey);
          const higherGsm = gsmOpt?.values.find((v) => v.includes("300") || v.includes("350"));
          if (higherGsm) updated[gsmKey] = higherGsm;
        }
      }

      return updated;
    });
  };

  // Handle Artwork Upload to Supabase Storage
  const handleArtworkFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateArtworkFile(file.name, file.type, file.size);
    if (!validation.valid) {
      toast.error(validation.error || "Invalid file format.");
      return;
    }

    setIsUploadingArtwork(true);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const sessionId = crypto.randomUUID().slice(0, 8);
      const storagePath = generateArtworkStoragePath(
        user?.id || null,
        sessionId,
        validation.extension!
      );

      const { error: uploadError } = await supabase.storage
        .from(ARTWORK_BUCKET)
        .upload(storagePath, file, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        toast.error(`Upload failed: ${uploadError.message}`);
        setIsUploadingArtwork(false);
        return;
      }

      const metadata: ArtworkFileMetadata = {
        bucket: ARTWORK_BUCKET,
        storagePath,
        originalFileName: file.name,
        mimeType: file.type,
        fileSizeBytes: file.size,
        uploadedAt: new Date().toISOString(),
        fileExtension: validation.extension!,
      };

      setUploadedArtwork(metadata);
      toast.success("Print-ready artwork attached successfully!");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Artwork upload failed.");
    } finally {
      setIsUploadingArtwork(false);
    }
  };

  const handleRemoveArtwork = () => {
    setUploadedArtwork(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    toast.info("Artwork attachment removed.");
  };

  // Add To Cart Action
  const handleAddToCart = async () => {
    // 1. Mandatory Artwork Validation
    if (product.uploadOnly && !uploadedArtwork) {
      toast.error(
        "Please upload your print-ready artwork (PDF, PNG, JPG) before adding to cart."
      );
      return;
    }

    if (validationErrors.length > 0) {
      toast.error("Please fix configuration errors before adding to cart.", {
        description: validationErrors[0],
      });
      return;
    }

    // 2. Prepare Selected Options Array
    const optionsArray = Object.entries(selectedOptions).map(([name, value]) => ({
      name,
      value,
    }));

    if (isDimensionBased) {
      optionsArray.push({
        name: "Dimensions",
        value: `${customWidth}×${customHeight} ${dimensionUnit}`,
      });
    }

    // 3. SECURE AUTHORITATIVE SERVER PRICE & CANONICAL SNAPSHOT VALIDATION
    const loadingToast = toast.loading("Verifying product specifications with pricing engine...");

    const dimensionsPayload = isDimensionBased
      ? {
          width: customWidth,
          height: customHeight,
          unit: dimensionUnit,
        }
      : null;

    const livePriceCheck = await getLiveProductPriceAction(
      product.id,
      selectedTierQty,
      matchedVariant?.id,
      isPersonalized,
      needsDesignAssistance,
      {
        selectedOptions: optionsArray,
        dimensions: dimensionsPayload,
        specialInstructions: designInstructions,
        tierQty: selectedTierQty,
      }
    );

    toast.dismiss(loadingToast);

    if (!livePriceCheck.success || !livePriceCheck.pricePaise) {
      toast.error(livePriceCheck.error || "This configuration is currently unavailable.");
      return;
    }

    const secureUnitPaise = livePriceCheck.unitPricePaise || Math.round(livePriceCheck.pricePaise / Math.max(1, selectedTierQty));
    const secureCompareAtPaise = livePriceCheck.compareAtPaise || null;

    const linePayload = {
      productId: product.id,
      productHandle: product.handle,
      productTitle: product.title,
      variantId: livePriceCheck.matchedVariantId || matchedVariant?.id || `var-${product.id}`,
      variantTitle: livePriceCheck.matchedVariantTitle || matchedVariant?.title || "Standard",
      quantity: 1,
      tierQty: selectedTierQty,
      sameDayEligible: product.sameDayEligible || false,
      priceUnit: product.priceUnit,
      unitPrice: { amount: secureUnitPaise, currencyCode: "INR" as const },
      compareAtUnitPrice: secureCompareAtPaise
        ? { amount: secureCompareAtPaise, currencyCode: "INR" as const }
        : null,
      selectedOptions: optionsArray,
      image: product.images[0] || {
        url: "/placeholder-product.png",
        alt: product.title,
      },
      addOns: [],
      design: uploadedArtwork
        ? {
            preview: "",
            side: "front" as const,
            state: JSON.stringify(uploadedArtwork),
            summary: `Uploaded File: ${uploadedArtwork.originalFileName}`,
          }
        : null,
      turnaroundDays: product.turnaroundDays,
      customizable: product.customizable,
      configHash: livePriceCheck.canonicalSnapshot?.configHash,
      configurationSnapshot: livePriceCheck.canonicalSnapshot,
    };

    if (existingLine && editLineId) {
      updateLineConfig(editLineId, linePayload);
      toast.success("Updated cart configuration!");
    } else {
      addLine(linePayload);
      toast.success(`Added ${product.title} to cart!`);
    }

    router.push("/cart");
  };

  return (
    <div className="space-y-6">
      {/* Validation Error Banner if combinations are incompatible */}
      {validationErrors.length > 0 && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs text-red-800 space-y-1">
          <div className="flex items-center gap-1.5 font-bold">
            <AlertCircle className="size-4 text-red-600 shrink-0" />
            <span>Option Combination Warning</span>
          </div>
          {validationErrors.map((err, i) => (
            <div key={i} className="pl-5 text-red-700">
              • {err}
            </div>
          ))}
        </div>
      )}

      {/* 1. Dynamic Product Options (Paper, Finish, Size, Colour, Frame Material, Glass, etc.) */}
      {product.options.map((option) => (
        <div key={option.name} className="space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-ink">{option.name}</span>
            <span className="font-mono text-muted-foreground">
              {selectedOptions[option.name] || "Select"}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {option.values.map((val) => {
              const isSelected = selectedOptions[option.name] === val;
              const isColorOption = option.name.toLowerCase().includes("colo");

              // Determine if an option value is disabled by dependency rules
              let isDisabled = false;
              if (
                option.name.toLowerCase().includes("corner") &&
                val.toLowerCase().includes("rounded") &&
                selectedOptions["Shape"]?.toLowerCase().includes("circle")
              ) {
                isDisabled = true;
              }

              return (
                <button
                  key={val}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => handleOptionSelect(option.name, val)}
                  aria-pressed={isSelected}
                  className={`relative flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                    isDisabled
                      ? "opacity-40 cursor-not-allowed bg-paper border-border text-muted-foreground line-through"
                      : isSelected
                      ? "border-violet bg-violet-wash text-violet ring-2 ring-violet/20 font-bold"
                      : "border border-border bg-white text-ink hover:bg-paper"
                  }`}
                >
                  {isColorOption && (
                    <span
                      className="size-3 rounded-full border border-black/20"
                      style={{
                        backgroundColor:
                          val.toLowerCase() === "black"
                            ? "#111111"
                            : val.toLowerCase() === "white"
                            ? "#FFFFFF"
                            : val.toLowerCase() === "navy"
                            ? "#001F3F"
                            : val.toLowerCase() === "grey"
                            ? "#888888"
                            : "#4A1E9E",
                      }}
                    />
                  )}
                  <span>{val}</span>
                  {isSelected && <Check className="size-3 text-violet ml-0.5" />}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* 2. Custom Dimensions Input (For Frames, Signage, Banners, Flex) */}
      {isDimensionBased && (
        <div className="rounded-2xl border border-border bg-paper/50 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-xs text-ink">
              <Ruler className="size-3.5 text-violet" />
              <span>Custom Dimensions</span>
            </div>
            <div className="flex rounded-lg border border-border bg-white p-0.5 text-[10px] font-bold">
              {(["inch", "ft", "cm"] as const).map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => setDimensionUnit(u)}
                  className={`px-2 py-0.5 rounded ${
                    dimensionUnit === u ? "bg-violet text-white" : "text-muted-foreground"
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-muted-foreground block mb-1">
                Width ({dimensionUnit})
              </label>
              <input
                type="number"
                min={1}
                max={500}
                value={customWidth}
                onChange={(e) => setCustomWidth(Math.max(1, Number(e.target.value)))}
                className="w-full rounded-xl border border-border bg-white px-3 py-1.5 font-mono text-xs font-bold text-ink focus:border-violet focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] text-muted-foreground block mb-1">
                Height ({dimensionUnit})
              </label>
              <input
                type="number"
                min={1}
                max={500}
                value={customHeight}
                onChange={(e) => setCustomHeight(Math.max(1, Number(e.target.value)))}
                className="w-full rounded-xl border border-border bg-white px-3 py-1.5 font-mono text-xs font-bold text-ink focus:border-violet focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* 3. Quantity Volume Tiers - Interactive Selector */}
      <div className="space-y-4 rounded-2xl border border-border bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-ink">Select Quantity & Save</span>
          {product.quantityTiers.length > 1 && (
            <span className="inline-flex rounded bg-marigold-wash text-marigold-deep px-2 py-0.5 text-[10px] font-bold">
              Volume Discount Enabled
            </span>
          )}
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setSelectedTierQty(Math.max(1, selectedTierQty - 1))}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-paper hover:bg-violet-wash hover:text-violet transition-colors font-bold text-lg"
          >
            -
          </button>

          <div className="relative flex-1">
            <input
              type="range"
              min={1}
              max={200}
              step={1}
              value={selectedTierQty}
              onChange={(e) => setSelectedTierQty(Number(e.target.value))}
              className="w-full h-2 bg-paper rounded-lg appearance-none cursor-pointer accent-violet"
            />
          </div>

          <button
            type="button"
            onClick={() => setSelectedTierQty(Math.min(200, selectedTierQty + 1))}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-paper hover:bg-violet-wash hover:text-violet transition-colors font-bold text-lg"
          >
            +
          </button>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-border pt-4">
          <div className="flex-1">
            <label className="text-[11px] text-muted-foreground block mb-1">Direct Quantity</label>
            <div className="relative">
              <input
                type="number"
                min={1}
                max={200}
                value={selectedTierQty}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val > 0 && val <= 200) setSelectedTierQty(val);
                }}
                onBlur={() => {
                  if (selectedTierQty <= 0) setSelectedTierQty(1);
                  if (selectedTierQty > 200) setSelectedTierQty(200);
                }}
                className="w-full rounded-xl border border-border bg-white px-3 py-2 font-mono text-sm font-bold text-ink focus:border-violet focus:outline-none"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-bold">
                {product.priceUnit}
              </span>
            </div>
          </div>

          <div className="flex-1 text-right">
            <div className="text-[11px] text-muted-foreground">Unit Rate</div>
            <div className="font-mono text-lg font-bold text-violet flex items-center justify-end gap-1.5">
              {isCalculatingPrice ? (
                <Loader2 className="size-4 animate-spin text-muted-foreground" />
              ) : (
                <span>₹{(serverUnitPricePaise / 100).toFixed(2)}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Personalization Configuration */}
      {product.personalizationConfig?.enabled && (
        <div className="rounded-2xl border border-border bg-white p-4 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-ink mb-2">
            <Paintbrush className="size-4 text-violet" />
            <h3 className="font-display text-sm font-bold">Personalization Options</h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setIsPersonalized(false)}
              className={`p-3 text-left rounded-xl border transition-all ${
                !isPersonalized
                  ? "border-violet bg-violet-wash ring-2 ring-violet/20"
                  : "border-border bg-paper hover:bg-gray-50"
              }`}
            >
              <div className="font-bold text-xs text-ink">Standard</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">No personalization</div>
            </button>

            <button
              type="button"
              onClick={() => setIsPersonalized(true)}
              className={`p-3 text-left rounded-xl border transition-all ${
                isPersonalized
                  ? "border-violet bg-violet-wash ring-2 ring-violet/20"
                  : "border-border bg-paper hover:bg-gray-50"
              }`}
            >
              <div className="font-bold text-xs text-ink">Personalized</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">
                +₹{(product.personalizationConfig.personalizationFeeMinor / 100).toFixed(2)}/unit
              </div>
            </button>
          </div>

          {isPersonalized && (
            <div className="mt-4 pt-4 border-t border-border space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={needsDesignAssistance}
                  onChange={(e) => setNeedsDesignAssistance(e.target.checked)}
                  className="rounded border-border text-violet focus:ring-violet"
                />
                <span className="text-xs font-bold text-ink">Need Design Assistance?</span>
                {product.personalizationConfig.designFeeMinor > 0 && (
                  <span className="text-[10px] font-mono text-violet bg-violet-wash px-1.5 py-0.5 rounded">
                    +₹{(product.personalizationConfig.designFeeMinor / 100).toFixed(2)}
                  </span>
                )}
              </label>

              {needsDesignAssistance && (
                <textarea
                  placeholder="Describe your design specifications (colors, copy, typography)..."
                  value={designInstructions}
                  onChange={(e) => setDesignInstructions(e.target.value)}
                  className="w-full h-24 rounded-xl border border-border bg-white p-3 text-xs text-ink focus:border-violet focus:outline-none resize-none"
                />
              )}
            </div>
          )}
        </div>
      )}

      {/* 5. Artwork Upload & Pre-Press Requirements */}
      <div className="rounded-2xl border border-border bg-white p-4 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-bold text-xs text-ink">
            <Upload className="size-3.5 text-violet" />
            <span>Print-Ready Artwork</span>
            {product.uploadOnly && (
              <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.2 rounded border border-red-200">
                Required
              </span>
            )}
          </div>
          <span className="text-[10px] text-muted-foreground font-mono">PDF, PNG, JPG ≤ 25MB</span>
        </div>

        {uploadedArtwork ? (
          <div className="flex items-center justify-between rounded-xl bg-emerald-50 border border-emerald-200 p-3">
            <div className="flex items-center gap-2.5 text-xs text-emerald-900">
              <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
              <div>
                <div className="font-bold line-clamp-1">{uploadedArtwork.originalFileName}</div>
                <div className="text-[10px] text-emerald-700">
                  Ready for pre-press soft-proof review
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemoveArtwork}
              className="text-emerald-700 hover:text-red-600 p-1"
              title="Remove file"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-paper/40 p-4 text-center cursor-pointer hover:bg-paper/70 transition-colors">
            {isUploadingArtwork ? (
              <div className="flex items-center gap-2 text-xs font-bold text-violet">
                <Loader2 className="size-4 animate-spin" />
                <span>Uploading artwork securely...</span>
              </div>
            ) : (
              <>
                <FileCheck className="size-5 text-muted-foreground mb-1 opacity-70" />
                <span className="font-bold text-xs text-ink">Click to upload print artwork</span>
                <span className="text-[10px] text-muted-foreground mt-0.5">
                  High-res 300 DPI vector PDF or CMYK image recommended
                </span>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.webp,.tif,.tiff"
              onChange={handleArtworkFileChange}
              disabled={isUploadingArtwork}
              className="hidden"
            />
          </label>
        )}

        <div className="flex items-center gap-2 text-[11px] text-muted-foreground pt-1 border-t border-border">
          <ShieldCheck className="size-3.5 text-violet shrink-0" />
          <span>Digital PDF Soft-Proof sent for customer approval prior to print run.</span>
        </div>
      </div>

      {/* 6. Pricing Summary & Add To Cart CTA */}
      <div className="rounded-2xl border border-border bg-paper p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[11px] text-muted-foreground">Total Price (incl. GST)</div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-2xl font-black text-ink">
                {isCalculatingPrice ? (
                  <span className="text-muted-foreground animate-pulse text-lg">Calculating...</span>
                ) : (
                  `₹${(serverPricePaise / 100).toFixed(2)}`
                )}
              </span>
              {serverCompareAtPaise && serverCompareAtPaise > serverPricePaise && (
                <span className="font-mono text-xs text-muted-foreground line-through">
                  ₹{(serverCompareAtPaise / 100).toFixed(2)}
                </span>
              )}
            </div>
          </div>

          <div className="text-right text-[11px] text-muted-foreground">
            <span className="font-mono font-bold text-ink">
              ₹{(serverUnitPricePaise / 100).toFixed(2)}
            </span>{" "}
            / unit
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={validationErrors.length > 0}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet py-3.5 text-sm font-bold text-white shadow-sheet hover:bg-violet-lift transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>{existingLine ? "Update Cart Configuration" : "Add to Cart"}</span>
          <ArrowRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
