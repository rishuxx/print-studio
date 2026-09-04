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
import { SiteLogo } from "@/components/shared/site-logo";

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
        <div className="grid grid-cols-3 h-[4.25rem] items-center px-4">
          {/* Left: Drawer Menu Toggle */}
          <div className="flex items-center justify-start">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="flex size-11 cursor-pointer items-center justify-center rounded-lg text-ink hover:bg-muted active:bg-muted/80"
              aria-label="Open menu"
            >
              <Menu className="size-6 pointer-events-none" />
            </button>
          </div>

          {/* Center: Brand Logo Lockup */}
          <div className="flex items-center justify-center">
            <SiteLogo isMobile={true} className="justify-center" />
          </div>

          {/* Right: Shopping Cart Link */}
          <div className="flex items-center justify-end">
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
            className="flex h-11 w-full cursor-pointer items-center gap-3 rounded-full border border-zinc-200 bg-zinc-50/80 px-4 text-sm text-zinc-500 active:bg-zinc-100 transition-colors shadow-2xs"
          >
            <Search className="size-4 pointer-events-none text-zinc-400" />
            <span className="text-xs sm:text-sm pointer-events-none text-zinc-500 truncate">
              Search visiting cards, t-shirts, mugs, packaging...
            </span>
          </button>
        </div>

        {/* ── Mobile Horizontal Category Rail ──────────────────────────── */}
        <div className="border-t border-zinc-200/80 bg-white py-2 px-3 overflow-x-auto no-scrollbar flex items-center gap-2 scroll-smooth">
          {categories.map((cat) => {
            return (
              <Link
                key={cat.handle}
                href={`/category/${cat.handle}`}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-600 whitespace-nowrap shadow-2xs transition-colors hover:text-primary hover:border-primary/40 active:text-primary active:bg-primary/5 group"
              >
                <span className="text-zinc-400 transition-colors group-hover:text-primary group-active:text-primary">
                  <Icon name={cat.icon} className="size-3.5 stroke-[1.5]" />
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
