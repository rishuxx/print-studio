import * as React from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";

interface AdminShellProps {
  adminEmail: string;
  adminName: string;
  adminRole: string;
  children: React.ReactNode;
}

export function AdminShell({
  adminEmail,
  adminName,
  adminRole,
  children,
}: AdminShellProps) {
  return (
    <div className="flex min-h-screen bg-paper text-ink antialiased">
      {/* Desktop Sidebar — Fixed width, sticky on large screens */}
      <div className="hidden lg:flex lg:w-72 lg:flex-col lg:fixed lg:inset-y-0 lg:z-40">
        <AdminSidebar
          adminEmail={adminEmail}
          adminName={adminName}
          adminRole={adminRole}
          className="w-72"
        />
      </div>

      {/* Main Content Area — Offset on desktop */}
      <div className="flex flex-1 flex-col lg:pl-72 min-w-0">
        <AdminHeader
          adminEmail={adminEmail}
          adminName={adminName}
          adminRole={adminRole}
        />

        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
