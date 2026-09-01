"use client";

import * as React from "react";
import type { ProductImage } from "@/lib/commerce/types";
import { ProductMockup } from "@/components/shared/product-mockup";
import { cn } from "@/lib/utils";
import { Image as ImageIcon, ZoomIn } from "lucide-react";

interface ProductGalleryProps {
  images: ProductImage[];
  title: string;
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [imageErrorMap, setImageErrorMap] = React.useState<Record<number, boolean>>({});
  const [isZoomed, setIsZoomed] = React.useState(false);

  // Ensure selected index is in bounds
  const activeImage = images[selectedIndex] ?? images[0] ?? {
    url: "",
    altText: title,
    width: 800,
    height: 800,
    kind: "generic",
    tone: "transparent",
  };

  const isRealImage =
    Boolean(activeImage.url) &&
    !activeImage.url.includes("placeholder-product.png") &&
    !imageErrorMap[selectedIndex];

  return (
    <div className="flex flex-col gap-4">
      {/* Main Showcase Surface */}
      <div
        className="group relative aspect-square w-full overflow-hidden rounded-2xl border border-border bg-white shadow-sheet flex items-center justify-center cursor-pointer"
        onClick={() => isRealImage && setIsZoomed(!isZoomed)}
      >
        {isRealImage ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeImage.url}
              alt={activeImage.altText || title}
              className={cn(
                "size-full object-cover transition-transform duration-500",
                isZoomed ? "scale-125 cursor-zoom-out" : "group-hover:scale-105 cursor-zoom-in"
              )}
              onError={() => {
                setImageErrorMap((prev) => ({ ...prev, [selectedIndex]: true }));
              }}
            />
            <div className="absolute bottom-3 right-3 flex size-8 items-center justify-center rounded-xl bg-black/40 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
              <ZoomIn className="size-4" />
            </div>
          </>
        ) : (
          <div className="p-8 sm:p-12 size-full flex items-center justify-center bg-paper/50">
            <ProductMockup
              kind={activeImage.kind ?? "card"}
              tone={activeImage.tone ?? "transparent"}
              className="h-full w-full drop-shadow-md transition-all duration-300"
            />
          </div>
        )}
      </div>

      {/* Thumbnails Row */}
      {images.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-1 no-scrollbar">
          {images.map((img, idx) => {
            const isSelected = idx === selectedIndex;
            const hasRealUrl =
              Boolean(img.url) &&
              !img.url.includes("placeholder-product.png") &&
              !imageErrorMap[idx];

            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setSelectedIndex(idx);
                  setIsZoomed(false);
                }}
                className={cn(
                  "relative size-16 shrink-0 overflow-hidden rounded-xl border bg-white transition-all",
                  isSelected
                    ? "border-violet ring-2 ring-violet/30 shadow-xs"
                    : "border-border hover:border-violet/40 opacity-70 hover:opacity-100"
                )}
                aria-label={`${title} view ${idx + 1}`}
              >
                {hasRealUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={img.url}
                    alt={img.altText || `${title} thumbnail ${idx + 1}`}
                    className="size-full object-cover"
                    onError={() => {
                      setImageErrorMap((prev) => ({ ...prev, [idx]: true }));
                    }}
                  />
                ) : (
                  <div className="p-1 size-full flex items-center justify-center bg-paper">
                    <ProductMockup
                      kind={img.kind ?? "card"}
                      tone="transparent"
                      className="h-full w-full"
                    />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
