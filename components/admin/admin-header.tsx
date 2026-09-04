"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, ShieldCheck, ArrowUpRight, PanelLeft } from "lucide-react";
import { ADMIN_NAVIGATION } from "@/lib/admin/navigation";
import { AdminPageHelpButton } from "@/components/admin/admin-page-help-button";

import { type Permission } from "@/lib/auth/permissions";
import { UserRole } from "@/lib/supabase/database.types";

interface AdminHeaderProps {
  adminEmail: string;
  adminName: string;
  adminRole: UserRole;
  allowedPermissions: string[];
  onToggleDrawer?: () => void;
  isDrawerOpen?: boolean;
}

export function AdminHeader({
  adminEmail,
  adminName,
  adminRole,
  allowedPermissions,
  onToggleDrawer,
  isDrawerOpen,
}: AdminHeaderProps) {
  const pathname = usePathname();

  // Derive current page title from navigation config
  const currentPageTitle = React.useMemo(() => {
    if (pathname === "/admin") return "Overview Dashboard";
    
    for (const section of ADMIN_NAVIGATION) {
      for (const item of section.items) {
        if (item.exact ? pathname === item.href : (pathname === item.href || pathname.startsWith(`${item.href}/`))) {
          return item.title;
        }
      }
    }
    return "Operations";
  }, [pathname]);

  // Generate breadcrumb items
  const breadcrumbParts = React.useMemo(() => {
    const parts = pathname.split("/").filter(Boolean); // ['admin', 'orders', ...]
    if (parts.length <= 1) return [];

    const trail: Array<{ label: string; href: string }> = [
      { label: "Admin", href: "/admin" },
    ];

    let currentPath = "/admin";
    for (let i = 1; i < parts.length; i++) {
      currentPath += `/${parts[i]}`;
      const formatted = parts[i].charAt(0).toUpperCase() + parts[i].slice(1).replace(/-/g, " ");
      trail.push({
        label: formatted,
        href: currentPath,
      });
    }

    return trail;
  }, [pathname]);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 sm:h-20 w-full items-center justify-between border-b border-border/80 bg-white/95 px-4 sm:px-8 backdrop-blur-md">
        {/* Left Side: Mobile Menu Button & Breadcrumb/Title */}
        <div className="flex items-center gap-3">
          {/* Drawer Trigger Button (Desktop & Mobile) */}
          <button
            type="button"
            onClick={onToggleDrawer}
            className="flex size-10 items-center justify-center rounded-xl border border-border text-ink hover:bg-paper hover:text-violet transition-colors shadow-2xs cursor-pointer"
            aria-label="Toggle Admin Navigation Drawer"
            title="Toggle Navigation Menu"
            aria-expanded={isDrawerOpen}
          >
            <PanelLeft className="size-5" />
          </button>

          {/* Breadcrumb / Title */}
          <div className="flex flex-col">
            {breadcrumbParts.length > 1 && (
              <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                {breadcrumbParts.map((item, idx) => {
                  const isLast = idx === breadcrumbParts.length - 1;
                  return (
                    <React.Fragment key={item.href}>
                      {idx > 0 && <ChevronRight className="size-3 text-muted-foreground/60" />}
                      {isLast ? (
                        <span className="font-semibold text-ink">{item.label}</span>
                      ) : (
                        <Link href={item.href} className="hover:text-violet transition-colors">
                          {item.label}
                        </Link>
                      )}
                    </React.Fragment>
                  );
                })}
              </nav>
            )}
            <h1 className="font-display text-base sm:text-lg font-bold text-ink tracking-tight">
              {currentPageTitle}
            </h1>
          </div>
        </div>

        {/* Right Side: Security Badge & Status & Help */}
        <div className="flex items-center gap-2 sm:gap-3">
          <AdminPageHelpButton />

          <div className="hidden sm:flex items-center gap-2 rounded-xl border border-border/80 bg-paper/60 px-3 py-1.5">
            <ShieldCheck className="size-4 text-violet" />
            <div className="flex items-center gap-1.5 font-mono text-[0.6875rem]">
              <span className="font-bold text-ink uppercase tracking-wider">{adminRole}</span>
              <span className="size-1 rounded-full bg-border" />
              <span className="text-muted-foreground truncate max-w-40">{adminEmail}</span>
            </div>
          </div>

          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-1 rounded-xl border border-border/80 bg-white px-3 py-2 text-xs font-semibold text-ink hover:border-violet hover:text-violet transition-all"
          >
            <span>Live Site</span>
            <ArrowUpRight className="size-3.5 text-muted-foreground" />
          </Link>
        </div>
      </header>

      {/* Drawer handled by AdminShell */}
    </>
  );
}
