"use client";

import * as React from "react";
import Link from "next/link";
import { Search, ShoppingBag, Menu } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { categories } from "@/lib/data/categories";
import { Icon } from "@/lib/icon-map";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/lib/cart-store";
import { useStoreSettings } from "@/lib/settings/settings-context";
import { MobileNavDrawer } from "./MobileNavDrawer";
import { MobileSearch } from "./MobileSearch";

export function MobileHeader() {
  const settings = useStoreSettings();
  const [mounted, setMounted] = React.useState(false);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const totalCartCount = useCartStore((state) =>
    state.lines.reduce((total, line) => total + line.quantity, 0)
  );

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border bg-white/95 backdrop-blur-md md:hidden">
        <div className="flex h-[4.25rem] items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="flex size-11 cursor-pointer items-center justify-center rounded-lg text-ink hover:bg-muted active:bg-muted/80"
              aria-label="Open menu"
            >
              <Menu className="size-6 pointer-events-none" />
            </button>

            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <span className="font-display text-xl font-extrabold tracking-tight text-ink">
                {settings.business_name || siteConfig.businessName}
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/cart"
              className="relative flex size-11 cursor-pointer items-center justify-center rounded-lg text-ink hover:bg-muted active:bg-muted/80"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="size-6 pointer-events-none" />
              {mounted && totalCartCount > 0 && (
                <span className="absolute right-1 top-1 flex size-[1.125rem] items-center justify-center rounded-full bg-violet text-[0.625rem] font-bold text-white">
                  {totalCartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        <div className="px-4 pb-2.5">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="flex h-11 w-full cursor-pointer items-center gap-3 rounded-xl border border-border bg-paper/80 px-3.5 text-sm text-muted-foreground active:bg-muted/50 transition-colors"
          >
            <Search className="size-4 pointer-events-none text-muted-foreground" />
            <span className="text-xs sm:text-sm pointer-events-none text-muted-foreground truncate">
              Search visiting cards, t-shirts, mugs, packaging...
            </span>
          </button>
        </div>

        {/* ── Mobile Horizontal Category Rail ──────────────────────────── */}
        <div className="border-t border-border/60 bg-paper/40 py-2 px-3 overflow-x-auto no-scrollbar flex items-center gap-2 scroll-smooth">
          {categories.map((cat) => {
            const isSameDay = cat.handle === "same-day";
            const isFestive = cat.handle === "festive";
            return (
              <Link
                key={cat.handle}
                href={`/category/${cat.handle}`}
                className={cn(
                  "inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-border/70 bg-white px-2.5 py-1.5 text-xs font-semibold text-ink whitespace-nowrap shadow-2xs transition-colors active:bg-violet-wash",
                  isSameDay && "border-amber-200 bg-amber-50/40 text-amber-950",
                  isFestive && "border-fuchsia-200 bg-fuchsia-50/40 text-fuchsia-950"
                )}
              >
                <span
                  className={cn(
                    "flex size-5 items-center justify-center rounded-md",
                    isSameDay
                      ? "bg-amber-100 text-amber-700"
                      : isFestive
                      ? "bg-fuchsia-100 text-fuchsia-700"
                      : "bg-slate-100 text-slate-700"
                  )}
                >
                  <Icon name={cat.icon} className="size-3 stroke-[1.75]" />
                </span>
                <span>{cat.title}</span>
              </Link>
            );
          })}
        </div>
      </header>

      <MobileNavDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />
      <MobileSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
