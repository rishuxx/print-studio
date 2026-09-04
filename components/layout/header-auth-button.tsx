"use client";

import * as React from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { logoutCustomer } from "@/lib/supabase/actions";
import { useOrderStore } from "@/lib/order-store";
import { User, LogIn, LogOut, Package, UserCheck, ChevronDown } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { NotificationBell } from "@/components/notifications/notification-bell";

export function HeaderAuthButton() {
  const [user, setUser] = React.useState<SupabaseUser | null>(null);
  const [role, setRole] = React.useState<string | null>(null);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    try {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data }) => {
        setUser(data.user);
        if (data.user) {
          supabase
            .from("profiles")
            .select("role")
            .eq("id", data.user.id)
            .maybeSingle()
            .then(({ data: prof }) => {
              if (prof?.role) setRole(prof.role);
            });
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          supabase
            .from("profiles")
            .select("role")
            .eq("id", session.user.id)
            .maybeSingle()
            .then(({ data: prof }) => {
              if (prof?.role) setRole(prof.role);
            });
        } else {
          setRole(null);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    } catch {
      // Graceful fallback if env variables are not initialized
    }
  }, []);

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) {
    return (
      <Link
        href="/login"
        className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-700 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
        aria-label="Customer Sign In"
      >
        <LogIn className="size-3.5 stroke-[1.75] text-zinc-400 group-hover:text-primary" />
        <span>Sign In</span>
      </Link>
    );
  }

  const displayName = (user.user_metadata?.full_name as string) || user.email?.split("@")[0] || "Account";

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <NotificationBell />
      <div className="relative hidden sm:block" ref={menuRef}>
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3.5 py-2 text-xs font-bold text-zinc-700 hover:border-primary hover:text-primary transition-all h-10 shadow-2xs"
        >
          <UserCheck className="size-3.5 text-primary stroke-[1.75]" />
          <span className="max-w-24 truncate">{displayName}</span>
          <ChevronDown className="size-3 text-zinc-400" />
        </button>

        {menuOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-border bg-white p-2 shadow-lift z-50 text-xs space-y-1 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-2 border-b border-border/60">
            <div className="font-bold text-ink truncate">{displayName}</div>
            <div className="text-[0.625rem] text-muted-foreground font-mono truncate">{user.email}</div>
          </div>

          <Link
            href="/account"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 rounded-xl px-3 py-2 font-medium text-ink hover:bg-paper hover:text-violet transition-colors"
          >
            <User className="size-3.5" />
            <span>My Account Profile</span>
          </Link>

          <Link
            href="/orders"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 rounded-xl px-3 py-2 font-medium text-ink hover:bg-paper hover:text-violet transition-colors"
          >
            <Package className="size-3.5" />
            <span>My Print Orders</span>
          </Link>

          {role === "admin" && (
            <>
              <Link
                href="/admin"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 rounded-xl px-3 py-2 font-bold text-violet bg-violet/10 hover:bg-violet/20 transition-colors"
              >
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Admin Dashboard</span>
              </Link>

              <Link
                href="/admin/orders"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 rounded-xl px-3 py-2 font-semibold text-ink hover:bg-paper hover:text-violet transition-colors"
              >
                <Package className="size-3.5" />
                <span>Admin Order Console</span>
              </Link>
            </>
          )}

          <button
            type="button"
            onClick={async () => {
              setMenuOpen(false);
              try {
                // Clear client-side store and storage
                useOrderStore.getState().clearAllLocalState();
                const supabase = createClient();
                await supabase.auth.signOut();
              } catch {
                // Ignore client error
              }
              await logoutCustomer();
            }}
            className="w-full flex items-center gap-2 rounded-xl px-3 py-2 font-semibold text-red-600 hover:bg-red-50 transition-colors text-left"
          >
            <LogOut className="size-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
      </div>
    </div>
  );
}
