"use client";

import * as React from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import { UserRole } from "@/lib/supabase/database.types";
import { PanelLeft, PanelLeftClose, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminShellProps {
  adminEmail: string;
  adminName: string;
  adminRole: UserRole;
  allowedPermissions: string[];
  children: React.ReactNode;
}

export function AdminShell({
  adminEmail,
  adminName,
  adminRole,
  allowedPermissions,
  children,
}: AdminShellProps) {
  // Drawer open state (closed by default or toggled)
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  // Close drawer on ESC key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && drawerOpen) {
        setDrawerOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [drawerOpen]);

  // Lock body scroll when drawer is open
  React.useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  return (
    <div className="flex min-h-screen bg-paper text-ink antialiased">
      {/* Sliding Drawer Sidebar (Works for Desktop & Mobile) */}
      <div
        className={cn(
          "fixed inset-0 z-50 transition-all duration-300",
          drawerOpen ? "pointer-events-auto visible" : "pointer-events-none invisible delay-200"
        )}
      >
        {/* Dark blurred Backdrop */}
        <div
          className={cn(
            "fixed inset-0 bg-ink/50 backdrop-blur-xs transition-opacity duration-300",
            drawerOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />

        {/* Drawer Panel Container */}
        <div
          className={cn(
            "relative flex h-full w-full max-w-[280px] sm:max-w-xs flex-1 flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out",
            drawerOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <AdminSidebar
            adminEmail={adminEmail}
            adminName={adminName}
            adminRole={adminRole}
            allowedPermissions={allowedPermissions}
            onNavigate={() => setDrawerOpen(false)}
            onClose={() => setDrawerOpen(false)}
            className="w-full border-r-0"
          />
        </div>
      </div>

      {/* Main Full-Width Content Area */}
      <div className="flex flex-1 flex-col min-w-0 w-full">
        <AdminHeader
          adminEmail={adminEmail}
          adminName={adminName}
          adminRole={adminRole}
          allowedPermissions={allowedPermissions}
          onToggleDrawer={() => setDrawerOpen((prev) => !prev)}
          isDrawerOpen={drawerOpen}
        />

        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
