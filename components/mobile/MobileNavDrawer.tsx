"use client";

import * as React from "react";
import Link from "next/link";
import { X, ArrowRight, Phone, User, Package, MapPin, ChevronRight, LogOut, Info, UserCheck, ShieldCheck, LogIn } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { categories } from "@/lib/data/categories";
import { siteConfig } from "@/lib/site-config";
import { Icon } from "@/lib/icon-map";
import { cn } from "@/lib/utils";
import { useStoreSettings } from "@/lib/settings/settings-context";
import { createClient } from "@/lib/supabase/client";
import { logoutCustomer } from "@/lib/supabase/actions";
import { useOrderStore } from "@/lib/order-store";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface MobileNavDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileNavDrawer({ open, onOpenChange }: MobileNavDrawerProps) {
  const settings = useStoreSettings();
  const [user, setUser] = React.useState<SupabaseUser | null>(null);
  const [role, setRole] = React.useState<string | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = React.useState(true);

  React.useEffect(() => {
    try {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data }) => {
        setUser(data.user);
        setIsLoadingAuth(false);
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
        setIsLoadingAuth(false);
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
      setIsLoadingAuth(false);
    }
  }, []);

  const displayName =
    (user?.user_metadata?.full_name as string) ||
    user?.email?.split("@")[0] ||
    "Customer";

  const handleSignOut = async () => {
    onOpenChange(false);
    try {
      useOrderStore.getState().clearAllLocalState();
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // Ignore client error
    }
    await logoutCustomer();
  };
  
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-sm transition-opacity data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out" />
        <DialogPrimitive.Content className="fixed inset-y-0 left-0 z-50 w-[85%] max-w-sm border-r border-border bg-white shadow-pop transition-transform duration-300 data-[state=closed]:-translate-x-full data-[state=open]:translate-x-0 flex flex-col">
          <div className="flex h-[4.25rem] items-center justify-between border-b border-border px-4">
            <span className="font-display text-lg font-extrabold tracking-tight text-ink">
              Menu
            </span>
            <DialogPrimitive.Close className="flex size-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-ink">
              <X className="size-5" />
              <span className="sr-only">Close menu</span>
            </DialogPrimitive.Close>
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            {/* Account & Quick Actions Header */}
            <div className="p-4 bg-paper/60 border-b border-border flex flex-col gap-3">
              {user ? (
                /* Authenticated User Banner */
                <div className="space-y-3">
                  <div className="flex items-center gap-3 rounded-2xl border border-zinc-200/80 bg-white p-3 shadow-2xs">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-base">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-display text-sm font-bold text-zinc-900 truncate">
                          {displayName}
                        </span>
                        {role === "admin" && (
                          <span className="rounded bg-primary/10 px-1.5 py-0.2 font-mono text-[0.625rem] font-bold text-primary uppercase">
                            Admin
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-500 font-mono truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  {/* Account / Orders quick grid */}
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/account"
                      onClick={() => onOpenChange(false)}
                      className="flex items-center gap-2 rounded-xl border border-zinc-200/80 bg-white p-2.5 text-xs font-semibold text-zinc-800 hover:border-primary hover:text-primary transition-colors shadow-2xs"
                    >
                      <User className="size-4 text-primary" />
                      <span>My Profile</span>
                    </Link>
                    <Link
                      href="/orders"
                      onClick={() => onOpenChange(false)}
                      className="flex items-center gap-2 rounded-xl border border-zinc-200/80 bg-white p-2.5 text-xs font-semibold text-zinc-800 hover:border-primary hover:text-primary transition-colors shadow-2xs"
                    >
                      <Package className="size-4 text-primary" />
                      <span>My Orders</span>
                    </Link>
                  </div>

                  {/* Admin link if user is admin */}
                  {role === "admin" && (
                    <Link
                      href="/admin"
                      onClick={() => onOpenChange(false)}
                      className="flex items-center justify-between rounded-xl bg-violet/10 border border-violet/20 px-3 py-2 text-xs font-bold text-violet transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <ShieldCheck className="size-4 text-violet" />
                        Admin Console Dashboard
                      </span>
                      <ChevronRight className="size-3.5 text-violet" />
                    </Link>
                  )}

                  {/* Sign Out Button */}
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50/60 py-2 text-xs font-bold text-red-600 hover:bg-red-100 transition-colors cursor-pointer"
                  >
                    <LogOut className="size-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                /* Guest / Unauthenticated State */
                <>
                  <Link
                    href="/login"
                    onClick={() => onOpenChange(false)}
                    className="flex items-center justify-center gap-2 rounded-xl bg-primary text-white h-11 font-bold shadow-sheet hover:bg-primary/90 transition-colors"
                  >
                    <LogIn className="size-4" />
                    <span>Sign In / Register</span>
                  </Link>

                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <Link
                      href="/account"
                      onClick={() => onOpenChange(false)}
                      className="flex items-center gap-2 rounded-xl border border-zinc-200/80 bg-white p-2.5 text-xs font-semibold text-zinc-800 hover:border-primary hover:text-primary transition-colors shadow-2xs"
                    >
                      <User className="size-4 text-zinc-400" />
                      <span>Account</span>
                    </Link>
                    <Link
                      href="/orders"
                      onClick={() => onOpenChange(false)}
                      className="flex items-center gap-2 rounded-xl border border-zinc-200/80 bg-white p-2.5 text-xs font-semibold text-zinc-800 hover:border-primary hover:text-primary transition-colors shadow-2xs"
                    >
                      <Package className="size-4 text-zinc-400" />
                      <span>Orders</span>
                    </Link>
                  </div>
                </>
              )}
            </div>

            {/* Main Categories */}
            <div className="flex flex-col py-2">
              <div className="px-4 py-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Shop By Category
                </span>
              </div>
              <ul className="flex flex-col">
                {categories.map((cat) => {
                  return (
                    <li key={cat.handle}>
                      <Link
                        href={`/category/${cat.handle}`}
                        onClick={() => onOpenChange(false)}
                        className="group flex items-center justify-between px-4 py-3 text-sm font-semibold text-zinc-700 hover:text-primary hover:bg-zinc-50 active:bg-zinc-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex size-8 items-center justify-center rounded-xl bg-zinc-100 text-zinc-400 group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                            <Icon name={cat.icon} className="size-4 stroke-[1.5]" />
                          </div>
                          <span>{cat.title}</span>
                        </div>
                        <ChevronRight className="size-4 text-zinc-400 group-hover:text-primary transition-colors" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Help & Support */}
            <div className="flex flex-col py-2 border-t border-border mt-2">
              <div className="px-4 py-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Support
                </span>
              </div>
              <ul className="flex flex-col">
                <li>
                  <Link href="/contact" onClick={() => onOpenChange(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-ink hover:text-violet">
                    <Info className="size-4 text-muted-foreground" />
                    Help & Contact
                  </Link>
                </li>
                <li>
                  <Link href="/bulk-quote" onClick={() => onOpenChange(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-ink hover:text-violet">
                    <Package className="size-4 text-muted-foreground" />
                    Bulk Orders
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border bg-paper p-4">
            <a
              href={settings.phone ? `tel:${settings.phone.replace(/[^0-9+]/g, "")}` : siteConfig.contact.phoneHref}
              className="flex items-center justify-center gap-2 rounded-xl bg-ink py-3 text-sm font-bold text-white hover:bg-ink-soft transition-colors"
            >
              <Phone className="size-4" />
              Call {settings.phone || siteConfig.contact.phone}
            </a>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
