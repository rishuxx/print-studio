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

  // 1. Manage selected product options (Paper, Finish, Size, Colour, Frame, Glass, etc.)
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

  // Match Variant
  const matchedVariant = findVariant(product, selectedOptions);

  // Calculate Square Footage / Area Multiplier
  let areaMultiplier = 1;
  if (isDimensionBased) {
    let sqFt = 1;
    if (dimensionUnit === "ft") {
      sqFt = customWidth * customHeight;
    } else if (dimensionUnit === "inch") {
      sqFt = (customWidth * customHeight) / 144;
    } else {
      // cm
      sqFt = (customWidth * customHeight) / 929.03;
    }
    sqFt = Math.max(0.5, sqFt);
    areaMultiplier = sqFt / 1.5; // normalized ratio
  }

  let lineTotalPaise = 0;
  let rawUnitPaise = 0;
  
  // Find the exact applicable tier based on selected quantity
  const applicableTier = [...product.quantityTiers]
    .sort((a, b) => b.qty - a.qty)
    .find((t) => selectedTierQty >= t.qty) || product.quantityTiers[0];

  if (applicableTier) {
    // Determine exact unit price for this tier
    // Note: the backend uses tier_price_minor / min_quantity for the unit price at that tier.
    // So we fetch the unit price at this tier and multiply by actual selected quantity.
    rawUnitPaise = Math.round(applicableTier.price.amount / applicableTier.qty);
  } else {
    rawUnitPaise = product.priceFrom.amount;
  }
  
  if (product.personalizationConfig?.enabled) {
    if (isPersonalized) {
      rawUnitPaise += product.personalizationConfig.personalizationFeeMinor || 0;
    }
  }

  if (isDimensionBased) {
    // If dimension based, the area multiplier affects the total and unit price
    const adjustedTotal = Math.max(10000, Math.round(rawUnitPaise * (selectedTierQty || 1) * areaMultiplier));
    lineTotalPaise = adjustedTotal;
    rawUnitPaise = adjustedTotal / (selectedTierQty || 1);
  } else {
    lineTotalPaise = rawUnitPaise * (selectedTierQty || 1);
  }

  // Add Flat Design fee if asked designer
  if (product.personalizationConfig?.enabled && needsDesignAssistance) {
    lineTotalPaise += product.personalizationConfig.designFeeMinor || 0;
  }

  const compareAtUnitPaise = applicableTier
    ? tierCompareAtPrice(applicableTier, matchedVariant)?.amount ? (tierCompareAtPrice(applicableTier, matchedVariant)!.amount / applicableTier.qty) : null
    : product.compareAtFrom?.amount || null;

  // Handle Option Click
  const handleOptionSelect = (optionName: string, value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionName]: value,
    }));
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

    // 3. SECURE PRICE VALIDATION (Thread Issue Fix)
    // Always fetch the true live price from the backend immediately before dispatching to cart
    // This entirely prevents a stale client from ever capturing an outdated price.
    const loadingToast = toast.loading("Validating price and adding to cart...");
    const { getLiveProductPriceAction } = await import("@/lib/actions/cart-actions");
    
    const livePriceCheck = await getLiveProductPriceAction(
      product.id,
      selectedTierQty,
      matchedVariant?.id,
      isPersonalized,
      needsDesignAssistance
    );

    toast.dismiss(loadingToast);

    if (!livePriceCheck.success || !livePriceCheck.pricePaise) {
      toast.error(livePriceCheck.error || "This product configuration is currently unavailable.");
      // Refresh the page silently to force UI into correct state
      router.refresh();
      return;
    }

    const secureUnitPaise = livePriceCheck.pricePaise;
    const secureCompareAtPaise = livePriceCheck.compareAtPaise || null;

    const linePayload = {
      productId: product.id,
      productHandle: product.handle,
      productTitle: product.title,
      variantId: matchedVariant?.id || `var-${product.id}`,
      variantTitle: matchedVariant?.title || "Standard",
      quantity: 1,
      tierQty: selectedTierQty,
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
      isPersonalized,
      needsDesignAssistance,
      designInstructions,
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

              return (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleOptionSelect(option.name, val)}
                  className={`relative flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                    isSelected
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
                value={customHeight}
                onChange={(e) => setCustomHeight(Math.max(1, Number(e.target.value)))}
                className="w-full rounded-xl border border-border bg-white px-3 py-1.5 font-mono text-xs font-bold text-ink focus:border-violet focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* 3. Quantity Volume Tiers - Dynamic Slider */}
      <div className="space-y-4 rounded-2xl border border-border bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-ink">Select Quantity & Save</span>
          {applicableTier && applicableTier.qty > 1 && (
             <span className="inline-flex rounded bg-marigold-wash text-marigold-deep px-2 py-0.5 text-[10px] font-bold">
               Volume Discount Applied!
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
             <label className="text-[11px] text-muted-foreground block mb-1">Direct Input</label>
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
                 onBlur={(e) => {
                    const val = Number(e.target.value);
                    if (val <= 0) setSelectedTierQty(1);
                    if (val > 200) setSelectedTierQty(200);
                 }}
                 className="w-full rounded-xl border border-border bg-white px-3 py-2 font-mono text-sm font-bold text-ink focus:border-violet focus:outline-none"
               />
               <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-bold">
                 {product.priceUnit}
               </span>
             </div>
           </div>
           
           <div className="flex-1 text-right">
              <div className="text-[11px] text-muted-foreground">Current Unit Price</div>
              <div className="font-mono text-lg font-bold text-violet">
                ₹{(rawUnitPaise / 100).toFixed(2)}
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
                  !isPersonalized ? "border-violet bg-violet-wash ring-2 ring-violet/20" : "border-border bg-paper hover:bg-gray-50"
                }`}
             >
                <div className="font-bold text-xs text-ink">Standard</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">No personalization</div>
             </button>
             
             <button
                type="button"
                onClick={() => setIsPersonalized(true)}
                className={`p-3 text-left rounded-xl border transition-all ${
                  isPersonalized ? "border-violet bg-violet-wash ring-2 ring-violet/20" : "border-border bg-paper hover:bg-gray-50"
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
                     placeholder="Tell our designers what you need (colors, text, fonts, style)..."
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

        {/* Digital Soft-Proof Assurance */}
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground pt-1 border-t border-border">
          <ShieldCheck className="size-3.5 text-violet shrink-0" />
          <span>Digital PDF Soft-Proof sent for customer approval prior to print run.</span>
        </div>
      </div>

      {/* 5. Pricing Summary & Add To Cart CTA */}
      <div className="rounded-2xl border border-border bg-paper p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[11px] text-muted-foreground">Total Price (incl. GST)</div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-2xl font-black text-ink">
                ₹{(lineTotalPaise / 100).toFixed(2)}
              </span>
              {compareAtUnitPaise && compareAtUnitPaise > rawUnitPaise && (
                <span className="font-mono text-xs text-muted-foreground line-through">
                  ₹{((compareAtUnitPaise * (selectedTier?.qty || 1)) / 100).toFixed(2)}
                </span>
              )}
            </div>
          </div>

          <div className="text-right text-[11px] text-muted-foreground">
            <span className="font-mono font-bold text-ink">
              ₹{(rawUnitPaise / 100).toFixed(2)}
            </span>{" "}
            / unit
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet py-3.5 text-sm font-bold text-white shadow-sheet hover:bg-violet-lift transition-all"
        >
          <span>{existingLine ? "Update Cart Configuration" : "Add to Cart"}</span>
          <ArrowRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
