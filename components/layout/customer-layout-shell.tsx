"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { AdminControlTopBar } from "@/components/layout/admin-control-top-bar";
import { WhatsAppFab } from "@/components/shared/whatsapp-fab";

interface CustomerLayoutShellProps {
  children: React.ReactNode;
}

/**
 * Customer layout shell conditionally mounting customer navigation,
 * footer, announcement bar, and WhatsApp FAB for public/customer routes.
 * When browsing under `/admin/*`, these elements are cleanly omitted so the
 * dedicated admin console receives full viewport and isolated layout.
 */
export function CustomerLayoutShell({ children }: CustomerLayoutShellProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>
      <AdminControlTopBar />
      <AnnouncementBar />
      <SiteHeader />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter />
      <WhatsAppFab />
    </>
  );
}
