"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { MobileHeader } from "@/components/mobile/MobileHeader";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { AdminControlTopBar } from "@/components/layout/admin-control-top-bar";
import { useStoreSettings } from "@/lib/settings/settings-context";
import { StorefrontMaintenanceScreen } from "@/components/layout/storefront-maintenance-screen";
import { createClient } from "@/lib/supabase/client";
import { ShieldAlert, Settings, Eye, EyeOff } from "lucide-react";

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
  const settings = useStoreSettings();
  const isAdminRoute = pathname.startsWith("/admin");

  const [isAdmin, setIsAdmin] = React.useState(false);
  const [simulateCustomerView, setSimulateCustomerView] = React.useState(false);

  React.useEffect(() => {
    let isMounted = true;
    const supabase = createClient();

    const checkAdmin = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        if (data.user && isMounted) {
          const { data: prof } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", data.user.id)
            .maybeSingle();

          if (isMounted) {
            setIsAdmin(prof?.role === "admin");
          }
        }
      } catch {
        // Non-blocking
      }
    };

    checkAdmin();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .maybeSingle()
          .then(({ data: prof }) => {
            if (isMounted) {
              setIsAdmin(prof?.role === "admin");
            }
          });
      } else if (isMounted) {
        setIsAdmin(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (isAdminRoute) {
    return <>{children}</>;
  }

  const isMaintenance =
    settings.store_status === "PAUSED" ||
    (settings as unknown as { maintenance_mode?: boolean }).maintenance_mode === true;

  // 1. If maintenance mode is active AND user is not an admin (or admin opted to simulate customer view)
  if (isMaintenance && (!isAdmin || simulateCustomerView)) {
    return (
      <>
        {isAdmin && (
          <div className="fixed top-0 left-0 right-0 z-[110] bg-amber-500 text-ink px-4 py-2 text-xs font-bold flex items-center justify-between shadow-md">
            <span className="flex items-center gap-2">
              <Eye className="size-4" />
              <span>Simulating Customer View (Maintenance Screen Active)</span>
            </span>
            <button
              onClick={() => setSimulateCustomerView(false)}
              className="rounded-lg bg-ink text-white px-3 py-1 text-xs hover:bg-ink/80 transition-colors"
            >
              Exit Simulation & View Storefront
            </button>
          </div>
        )}
        <StorefrontMaintenanceScreen />
      </>
    );
  }

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>

      {/* Prominent Admin Notice Banner when Maintenance Mode is Active */}
      {isMaintenance && isAdmin && (
        <aside
          aria-label="Maintenance mode active preview notice"
          className="sticky top-0 z-[120] bg-amber-50 border-b border-amber-200/90 text-amber-950 px-4 py-2 text-xs font-semibold flex flex-wrap items-center justify-between gap-3 shadow-xs animate-in slide-in-from-top duration-300"
        >
          <div className="flex items-center gap-2">
            <ShieldAlert className="size-4 text-amber-600 shrink-0" />
            <span>
              <strong className="text-amber-900">Maintenance Mode Active:</strong> Public visitors see the maintenance screen. You are viewing with Administrator Bypass.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSimulateCustomerView(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-white px-2.5 py-1 text-[0.6875rem] font-bold text-amber-900 hover:bg-amber-100/60 transition-colors shadow-2xs"
            >
              <EyeOff className="size-3 text-amber-700" />
              <span>Simulate Customer View</span>
            </button>
            <Link
              href="/admin/settings"
              className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 text-white px-2.5 py-1 text-[0.6875rem] font-bold hover:bg-amber-700 transition-colors shadow-2xs"
            >
              <Settings className="size-3" />
              <span>Open Settings</span>
            </Link>
          </div>
        </aside>
      )}

      <AdminControlTopBar />
      <AnnouncementBar />
      <MobileHeader />
      <SiteHeader />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
