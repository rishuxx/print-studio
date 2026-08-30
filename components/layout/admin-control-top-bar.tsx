"use client";

import * as React from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { ShieldCheck, LayoutDashboard, ArrowRight } from "lucide-react";

export function AdminControlTopBar() {
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [adminName, setAdminName] = React.useState<string | null>(null);

  React.useEffect(() => {
    try {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data }) => {
        if (data.user) {
          supabase
            .from("profiles")
            .select("role, full_name")
            .eq("id", data.user.id)
            .maybeSingle()
            .then(({ data: prof }) => {
              if (prof?.role === "admin") {
                setIsAdmin(true);
                setAdminName(prof.full_name || "Administrator");
              } else {
                setIsAdmin(false);
              }
            });
        } else {
          setIsAdmin(false);
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          supabase
            .from("profiles")
            .select("role, full_name")
            .eq("id", session.user.id)
            .maybeSingle()
            .then(({ data: prof }) => {
              if (prof?.role === "admin") {
                setIsAdmin(true);
                setAdminName(prof.full_name || "Administrator");
              } else {
                setIsAdmin(false);
              }
            });
        } else {
          setIsAdmin(false);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    } catch {
      // Graceful fallback
    }
  }, []);

  if (!isAdmin) return null;

  return (
    <div className="relative z-50 bg-gradient-to-r from-violet-950 via-[#2e1065] to-ink border-b border-violet/40 text-white text-xs py-2 px-4 shadow-sm">
      <div className="shell flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex size-5 items-center justify-center rounded-md bg-emerald-500/20 text-emerald-400">
            <ShieldCheck className="size-3.5" />
          </div>
          <span className="font-semibold text-white/90">
            Administrator Mode Active ({adminName})
          </span>
          <span className="hidden sm:inline-block text-white/50">•</span>
          <span className="hidden sm:inline-block text-white/70">
            You are browsing the customer storefront
          </span>
        </div>

        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 rounded-lg bg-violet hover:bg-violet-lift px-3 py-1 font-bold text-white shadow-xs transition-all text-xs shrink-0"
        >
          <LayoutDashboard className="size-3.5" />
          <span>Return to Dashboard</span>
          <ArrowRight className="size-3" />
        </Link>
      </div>
    </div>
  );
}
