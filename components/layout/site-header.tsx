"use client";

import * as React from "react";
import Link from "next/link";
import {
  Search,
  ShoppingBag,
  Menu,
  X,
  Phone,
  MapPin,
  ChevronDown,
  ArrowRight,
  Sparkles,
  Zap,
} from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { categories, linkHref } from "@/lib/data/categories";
import { searchProducts } from "@/lib/data/products";
import { formatMoney } from "@/lib/pricing";
import { useCartStore } from "@/lib/cart-store";
import { Icon } from "@/lib/icon-map";
import { CatalogBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HeaderAuthButton } from "@/components/layout/header-auth-button";
import { cn } from "@/lib/utils";

import { useStoreSettings } from "@/lib/settings/settings-context";

export function SiteHeader() {
  const settings = useStoreSettings();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [activeMegaCategory, setActiveMegaCategory] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [searchFocused, setSearchFocused] = React.useState(false);
  const searchContainerRef = React.useRef<HTMLDivElement>(null);

  // Compute search results directly with useMemo
  const searchResults = React.useMemo(() => {
    if (searchQuery.trim().length > 1) {
      return searchProducts(searchQuery, 6);
    }
    return [];
  }, [searchQuery]);

  const handleNavigate = React.useCallback(() => {
    setMobileMenuOpen(false);
    setActiveMegaCategory(null);
    setSearchQuery("");
    setSearchFocused(false);
  }, []);

  // Click outside to close search dropdown
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const totalCartCount = useCartStore((state) =>
    state.lines.reduce((total, line) => total + line.quantity, 0)
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-white/95 backdrop-blur-md">
      {/* ── Top Utility Bar ─────────────────────────────────────────── */}
      <div className="hidden border-b border-border/60 bg-paper py-1.5 text-xs text-muted-foreground md:block">
        <div className="shell flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium text-ink">
              <MapPin className="size-3 text-violet" />
              <span>{settings.city || siteConfig.address.city}, {settings.state || siteConfig.address.state}</span>
            </span>
            <span className="text-border">|</span>
            <span className="text-[0.6875rem]">{settings.delivery_estimate_text || siteConfig.operations.deliveryMessage}</span>
          </div>

          <div className="flex items-center gap-5 font-medium">
            <Link href="/bulk-quote" className="hover:text-violet transition-colors">
              Bulk Printing Quotes
            </Link>
            <Link href="/sample-kit" className="hover:text-violet transition-colors">
              Order Paper Sample Kit
            </Link>
            <a
              href={`tel:${(settings.phone || siteConfig.contact.phone).replace(/\s+/g, "")}`}
              className="flex items-center gap-1 hover:text-violet transition-colors font-mono"
            >
              <Phone className="size-3" />
              <span>{settings.phone || siteConfig.contact.phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* ── Main Navigation Bar ──────────────────────────────────────── */}
      <div className="shell flex h-16 sm:h-20 items-center justify-between gap-4">
        {/* Mobile Menu Toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex size-10 items-center justify-center rounded-xl border border-border text-ink hover:bg-muted md:hidden"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>

        {/* Brand Logo Lockup */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-display text-xl sm:text-2xl font-extrabold tracking-tight text-ink">
                {settings.business_name || siteConfig.businessName}
              </span>
            </div>
            {/* CMYK Mini Registration Mark */}
            <div className="flex h-1 w-full gap-0.5 mt-0.5 rounded-full overflow-hidden">
              <span className="flex-1 bg-[#00aeef]" />
              <span className="flex-1 bg-[#ec008c]" />
              <span className="flex-1 bg-[#fff200]" />
              <span className="flex-1 bg-[#1b0b2e]" />
            </div>
          </div>
        </Link>

        {/* Global Live Search Bar */}
        <div ref={searchContainerRef} className="relative hidden max-w-lg flex-1 md:block">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              placeholder="Search visiting cards, t-shirts, mugs, stamps, packaging..."
              className="h-11 w-full rounded-xl border border-border bg-paper/60 pl-10 pr-4 text-sm text-ink placeholder:text-muted-foreground focus:border-violet focus:bg-white focus:outline-none transition-all"
            />
          </div>

          {/* Search Dropdown Modal */}
          {searchFocused && (searchQuery.trim().length > 1 || searchResults.length > 0) && (
            <div className="absolute left-0 right-0 top-full mt-2 rounded-2xl border border-border bg-white p-3 shadow-pop z-50 animate-slide-down">
              {searchResults.length > 0 ? (
                <div>
                  <div className="px-2 py-1 text-xs font-semibold text-muted-foreground font-mono uppercase">
                    Products ({searchResults.length})
                  </div>
                  <div className="mt-1 flex flex-col gap-1">
                    {searchResults.map((product) => (
                      <Link
                        key={product.id}
                        href={`/product/${product.handle}`}
                        onClick={() => {
                          setSearchFocused(false);
                          setSearchQuery("");
                        }}
                        className="flex items-center justify-between rounded-xl p-2 hover:bg-violet-wash transition-colors group"
                      >
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-ink group-hover:text-violet">
                            {product.title}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {product.productType} · {product.priceUnit}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-display text-sm font-bold text-ink">
                            {formatMoney(product.priceFrom)}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  No matching printing products found for &ldquo;{searchQuery}&rdquo;.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Actions: Help, Account, Cart */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/contact"
            className="hidden lg:flex items-center gap-1.5 rounded-xl border border-border px-3.5 py-2 text-xs font-medium text-ink hover:border-violet hover:text-violet transition-colors"
          >
            <span>Need Help?</span>
          </Link>

          <HeaderAuthButton />

          <Link
            href="/cart"
            className="relative flex h-10 sm:h-11 items-center gap-2 rounded-xl bg-ink px-4 text-xs font-medium text-white hover:bg-ink-soft transition-colors"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="size-4 text-marigold" />
            <span className="hidden sm:inline">Cart</span>
            <span className="flex size-5 items-center justify-center rounded-full bg-violet text-[0.625rem] font-bold text-white">
              {totalCartCount}
            </span>
          </Link>
        </div>
      </div>

      {/* ── Desktop Mega Menu Navigation Bar ─────────────────────────── */}
      <nav
        aria-label="Main"
        className="hidden md:block border-t border-border/60 bg-white"
        onMouseLeave={() => setActiveMegaCategory(null)}
      >
        <div className="shell flex items-center justify-between">
          <ul className="flex items-center gap-1">
            {categories.map((cat) => {
              const isActive = activeMegaCategory === cat.handle;
              const isSameDay = cat.handle === "same-day";
              const isFestive = cat.handle === "festive";

              return (
                <li
                  key={cat.handle}
                  className="relative"
                  onMouseEnter={() => setActiveMegaCategory(cat.handle)}
                >
                  <Link
                    href={`/category/${cat.handle}`}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-3 text-xs font-semibold uppercase tracking-wider transition-colors",
                      isActive
                        ? "text-violet bg-violet-wash/70"
                        : "text-ink hover:text-violet hover:bg-paper",
                      isSameDay && "text-marigold-deep font-bold",
                      isFestive && "text-violet-deep font-bold"
                    )}
                  >
                    {isSameDay && <Zap className="size-3 text-marigold fill-marigold" />}
                    {isFestive && <Sparkles className="size-3 text-marigold" />}
                    <span>{cat.title}</span>
                    {cat.groups && cat.groups.length > 0 && (
                      <ChevronDown className="size-3 text-muted-foreground transition-transform" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2 py-2">
            <Link
              href="/same-day"
              className="inline-flex items-center gap-1 rounded-md bg-marigold-wash px-2.5 py-1 font-mono text-[0.625rem] font-bold uppercase text-marigold-deep border border-marigold/30 hover:brightness-95 transition-all"
            >
              <Zap className="size-3 fill-marigold text-marigold-deep" />
              <span>Express Printing</span>
            </Link>
          </div>
        </div>

        {/* ── Active Mega-Menu Dropdown Panel ─────────────────────────── */}
        {activeMegaCategory && (() => {
          const cat = categories.find((c) => c.handle === activeMegaCategory);
          if (!cat || !cat.groups || cat.groups.length === 0) return null;

          return (
            <div
              className="absolute left-0 right-0 top-full border-b border-border bg-white shadow-pop z-50 animate-slide-down"
              onMouseEnter={() => setActiveMegaCategory(cat.handle)}
              onMouseLeave={() => setActiveMegaCategory(null)}
            >
              <div className="shell grid grid-cols-12 gap-8 py-8">
                {/* Column Links */}
                <div className="col-span-8 lg:col-span-9 grid grid-cols-3 gap-6">
                  {cat.groups.map((group, gIdx) => (
                    <div key={`${group.title}-${gIdx}`} className="flex flex-col">
                      <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-ink pb-2 mb-2 border-b border-border/80">
                        {group.title}
                      </h4>
                      <ul className="flex flex-col space-y-1.5">
                        {group.items.map((item, iIdx) => {
                          const href = linkHref(item);
                          return (
                            <li key={`${item.title}-${iIdx}`}>
                              <Link
                                href={href}
                                className="group flex items-center justify-between py-1 text-xs text-muted-foreground hover:text-violet transition-colors"
                              >
                                <span className="truncate group-hover:translate-x-0.5 transition-transform">
                                  {item.title}
                                </span>
                                {item.badge && (
                                  <CatalogBadge kind={item.badge} size="sm" className="ml-2 shrink-0" />
                                )}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Feature Card Panel */}
                <div className="col-span-4 lg:col-span-3">
                  {cat.feature ? (
                    <div
                      className={cn(
                        "flex h-full flex-col justify-between rounded-2xl p-6 transition-all",
                        cat.feature.tone === "marigold" && "bg-marigold-wash text-ink border border-marigold/30",
                        cat.feature.tone === "violet" && "bg-violet-wash text-ink border border-violet/20",
                        cat.feature.tone === "ink" && "bg-ink text-white"
                      )}
                    >
                      <div>
                        <span className="font-mono text-[0.625rem] font-bold uppercase tracking-wider opacity-75">
                          {cat.feature.eyebrow}
                        </span>
                        <h4 className="mt-1 text-base font-bold leading-tight">
                          {cat.feature.title}
                        </h4>
                        <p className="mt-2 text-xs leading-relaxed opacity-85">
                          {cat.feature.body}
                        </p>
                      </div>

                      <div className="mt-6">
                        <Button asChild size="sm" variant={cat.feature.tone === "ink" ? "secondary" : "primary"}>
                          <Link href={cat.feature.href}>
                            {cat.feature.cta}
                            <ArrowRight className="size-3.5 ml-1" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex h-full flex-col justify-between rounded-2xl border border-border bg-paper p-6">
                      <div>
                        <h4 className="text-sm font-bold text-ink">{cat.title}</h4>
                        <p className="mt-1.5 text-xs text-muted-foreground">{cat.blurb}</p>
                      </div>
                      <Link
                        href={`/category/${cat.handle}`}
                        className="text-xs font-bold text-violet hover:underline inline-flex items-center gap-1"
                      >
                        View all products &rarr;
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })()}
      </nav>

      {/* ── Mobile Navigation Drawer ─────────────────────────────────── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-16 z-50 flex flex-col bg-white overflow-y-auto pb-20 md:hidden animate-slide-down">
          {/* Mobile Search */}
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search printing products..."
                className="h-10 w-full rounded-xl border border-border bg-paper pl-9 pr-3 text-sm focus:border-violet focus:outline-none"
              />
            </div>
            {searchResults.length > 0 && (
              <div className="mt-2 flex flex-col divide-y divide-border/60">
                {searchResults.map((p) => (
                  <Link
                    key={p.id}
                    href={`/product/${p.handle}`}
                    className="py-2.5 text-sm font-medium text-ink hover:text-violet flex justify-between"
                  >
                    <span>{p.title}</span>
                    <span className="font-mono text-xs">{formatMoney(p.priceFrom)}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Categories List */}
          <div className="flex flex-col divide-y divide-border/60 px-4">
            {categories.map((cat) => (
              <div key={cat.handle} className="py-3">
                <Link
                  href={`/category/${cat.handle}`}
                  onClick={handleNavigate}
                  className="flex items-center justify-between font-bold text-ink hover:text-violet"
                >
                  <div className="flex items-center gap-2">
                    <Icon name={cat.icon} className="size-4 text-violet" />
                    <span>{cat.title}</span>
                  </div>
                  <ArrowRight className="size-4 text-muted-foreground" />
                </Link>
              </div>
            ))}
          </div>

          {/* Mobile Footer Help */}
          <div className="mt-auto p-4 border-t border-border bg-paper space-y-3">
            <a
              href={siteConfig.contact.phoneHref}
              className="flex items-center gap-2 text-sm font-semibold text-ink"
            >
              <Phone className="size-4 text-violet" />
              <span>Call Us: {siteConfig.contact.phone}</span>
            </a>
            <p className="text-xs text-muted-foreground">
              {siteConfig.address.line1}, {siteConfig.address.city}
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
