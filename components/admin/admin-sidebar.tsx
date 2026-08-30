"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, ExternalLink, ShieldCheck } from "lucide-react";
import { ADMIN_NAVIGATION, type AdminNavItem } from "@/lib/admin/navigation";
import { AdminPageHelpButton } from "@/components/admin/admin-page-help-button";
import { siteConfig } from "@/lib/site-config";
import { logoutCustomer } from "@/lib/supabase/actions";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  adminEmail: string;
  adminName: string;
  adminRole: string;
  onNavigate?: () => void;
  className?: string;
}

export function AdminSidebar({
  adminEmail,
  adminName,
  adminRole,
  onNavigate,
  className,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // Continue to server logout
    }
    await logoutCustomer();
  };

  const isItemActive = (item: AdminNavItem) => {
    if (item.exact) {
      return pathname === item.href;
    }
    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  };

  return (
    <aside
      className={cn(
        "flex h-full flex-col justify-between border-r border-border/80 bg-white text-ink",
        className
      )}
    >
      {/* Top Section: Brand & Navigation */}
      <div className="flex flex-1 flex-col overflow-y-auto">
        {/* Admin Header / Brand */}
        <div className="flex h-16 sm:h-20 shrink-0 items-center justify-between border-b border-border/80 px-6">
          <Link
            href="/admin"
            onClick={onNavigate}
            className="flex items-center gap-2.5 group"
          >
            <div className="flex size-9 items-center justify-center rounded-xl bg-violet text-white shadow-sm font-black text-sm tracking-wider">
              AG
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-display font-black text-ink text-base tracking-tight">
                  {siteConfig.businessShortName}
                </span>
                <span className="rounded bg-violet/10 px-1.5 py-0.5 font-mono text-[0.625rem] font-bold text-violet uppercase tracking-wider">
                  Ops
                </span>
              </div>
              <span className="text-[0.6875rem] font-medium text-muted-foreground mt-0.5">
                Admin Console
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 px-4 py-6 space-y-6">
          {ADMIN_NAVIGATION.map((section, sIdx) => (
            <div key={section.title || sIdx} className="space-y-1.5">
              {section.title && (
                <div className="px-3 text-[0.6875rem] font-bold uppercase tracking-wider text-muted-foreground/80 font-mono">
                  {section.title}
                </div>
              )}

              <nav className="space-y-1" aria-label={section.title}>
                {section.items.map((item) => {
                  const active = isItemActive(item);
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onNavigate}
                      className={cn(
                        "group flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-all",
                        active
                          ? "bg-violet text-white shadow-sm font-bold"
                          : "text-ink hover:bg-paper hover:text-violet"
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon
                          className={cn(
                            "size-4 shrink-0 transition-colors",
                            active
                              ? "text-white"
                              : "text-muted-foreground group-hover:text-violet"
                          )}
                        />
                        <span>{item.title}</span>
                      </div>

                      {item.badge && (
                        <span
                          className={cn(
                            "rounded-md px-1.5 py-0.5 text-[0.5625rem] font-mono font-medium tracking-tight",
                            active
                              ? "bg-white/20 text-white"
                              : "bg-paper text-muted-foreground border border-border/60"
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Section: Page Help, Admin Identity, Store Link & Logout */}
      <div className="shrink-0 border-t border-border/80 bg-paper/60 p-4 space-y-3">
        {/* Staff Page Help Button at the bottom */}
        <AdminPageHelpButton variant="sidebar" />

        {/* Customer Site Preview Link */}
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between rounded-xl border border-border/80 bg-white px-3 py-2 text-xs font-semibold text-ink hover:border-violet hover:text-violet transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="size-3.5 text-muted-foreground" />
            <span>Store Front</span>
          </span>
          <span className="font-mono text-[0.625rem] text-muted-foreground">Live</span>
        </Link>

        {/* User Identity & Logout Card */}
        <div className="flex items-center justify-between rounded-xl border border-border/80 bg-white p-2.5">
          <div className="flex items-center gap-2.5 min-w-0 pr-2">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-violet/10 text-violet">
              <ShieldCheck className="size-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-ink leading-tight">
                {adminName || "Administrator"}
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="inline-block size-1.5 rounded-full bg-emerald-500" />
                <span className="truncate text-[0.625rem] font-mono uppercase text-muted-foreground font-semibold">
                  {adminRole}
                </span>
                <span className="text-muted-foreground text-[0.625rem]">•</span>
                <span className="truncate text-[0.625rem] font-mono text-muted-foreground max-w-20">
                  {adminEmail}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            title="Sign out of Admin Console"
            className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors disabled:opacity-50"
            aria-label="Sign out of Admin Console"
          >
            <LogOut className="size-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
