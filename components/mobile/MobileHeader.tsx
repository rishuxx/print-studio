"use client";

import * as React from "react";
import Link from "next/link";
import { Search, ShoppingBag, Menu } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
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

        <div className="px-4 pb-3">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="flex h-12 w-full cursor-pointer items-center gap-3 rounded-xl border border-border bg-paper px-4 text-sm text-muted-foreground active:bg-muted/50"
          >
            <Search className="size-5 pointer-events-none" />
            <span className="text-sm pointer-events-none">Search products, cards, mugs...</span>
          </button>
        </div>
      </header>

      <MobileNavDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />
      <MobileSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
