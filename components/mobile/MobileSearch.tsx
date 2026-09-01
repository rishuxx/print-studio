"use client";

import * as React from "react";
import Link from "next/link";
import { X, Search as SearchIcon, ArrowLeft } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { searchProducts } from "@/lib/data/products";
import { formatMoney } from "@/lib/pricing";

interface MobileSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileSearch({ open, onOpenChange }: MobileSearchProps) {
  const [query, setQuery] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Auto-focus input when search opens
  React.useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setQuery(""); // Clear on close
    }
  }, [open]);

  const results = React.useMemo(() => {
    if (query.trim().length > 1) {
      return searchProducts(query, 10);
    }
    return [];
  }, [query]);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        {/* Render as a full-screen mobile sheet that slides up */}
        <DialogPrimitive.Content className="fixed inset-0 z-50 flex flex-col bg-white transition-transform duration-300 data-[state=closed]:translate-y-full data-[state=open]:translate-y-0">
          
          {/* Header & Search Input */}
          <div className="flex h-[4.25rem] items-center gap-2 border-b border-border px-3 bg-white">
            <DialogPrimitive.Close className="flex size-10 items-center justify-center rounded-full text-ink hover:bg-muted">
              <ArrowLeft className="size-6" />
              <span className="sr-only">Close search</span>
            </DialogPrimitive.Close>

            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="search"
                inputMode="search"
                placeholder="Search products..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-11 w-full rounded-full bg-paper px-4 text-base font-medium text-ink focus:outline-none focus:ring-2 focus:ring-violet/30"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    inputRef.current?.focus();
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex size-6 items-center justify-center rounded-full bg-muted text-muted-foreground"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Results Area */}
          <div className="flex-1 overflow-y-auto bg-paper">
            {query.trim().length > 1 ? (
              <div className="flex flex-col bg-white">
                {results.length > 0 ? (
                  <ul className="divide-y divide-border">
                    {results.map((product) => (
                      <li key={product.id}>
                        <Link
                          href={`/product/${product.handle}`}
                          onClick={() => onOpenChange(false)}
                          className="flex items-center justify-between px-4 py-4 hover:bg-violet-wash transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-lg bg-paper">
                              <SearchIcon className="size-4 text-muted-foreground" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-ink">{product.title}</span>
                              <span className="text-xs text-muted-foreground">in {product.productType}</span>
                            </div>
                          </div>
                          <span className="font-display text-sm font-bold text-ink">
                            {formatMoney(product.priceFrom)}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                    <SearchIcon className="size-12 text-muted-foreground/30 mb-4" />
                    <h3 className="text-lg font-bold text-ink">No results found</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      We couldn't find anything matching "{query}". Try a different term.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                  Popular Searches
                </h3>
                <div className="flex flex-wrap gap-2">
                  {["Visiting Cards", "T-Shirts", "Mugs", "Stamps", "Letterhead"].map((term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-ink shadow-sm"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
