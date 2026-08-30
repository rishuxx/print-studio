"use client";

import * as React from "react";
import type { ProductImage } from "@/lib/commerce/types";
import { ProductMockup } from "@/components/shared/product-mockup";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: ProductImage[];
  title: string;
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  // Ensure at least 1 image mockup exists
  const activeImage = images[selectedIndex] ?? images[0] ?? { kind: "card", tone: "transparent" };

  return (
    <div className="flex flex-col gap-4">
      {/* Main High-Resolution Showcase Surface */}
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-border bg-white p-8 sm:p-12 shadow-sm flex items-center justify-center">
        <ProductMockup
          kind={activeImage.kind ?? "card"}
          tone={activeImage.tone ?? "transparent"}
          className="h-full w-full drop-shadow-md transition-all duration-300"
        />
      </div>

      {/* Thumbnails Row (if product has multiple views or configurations) */}
      {images.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-1 no-scrollbar">
          {images.map((img, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={cn(
                  "relative size-16 shrink-0 overflow-hidden rounded-xl border p-2 bg-white transition-all",
                  isSelected
                    ? "border-violet ring-2 ring-violet/20"
                    : "border-border hover:border-violet/40"
                )}
                aria-label={`${title} view ${idx + 1}`}
              >
                <ProductMockup
                  kind={img.kind ?? "card"}
                  tone="transparent"
                  className="h-full w-full"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
