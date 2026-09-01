"use client";

import * as React from "react";
import Link from "next/link";
import { X, ArrowRight, Phone, User, Package, MapPin, ChevronRight, LogOut, Info } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { categories } from "@/lib/data/categories";
import { siteConfig } from "@/lib/site-config";
import { Icon } from "@/lib/icon-map";
import { useStoreSettings } from "@/lib/settings/settings-context";

interface MobileNavDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileNavDrawer({ open, onOpenChange }: MobileNavDrawerProps) {
  const settings = useStoreSettings();
  
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
            {/* Account & Quick Actions */}
            <div className="p-4 bg-paper/50 border-b border-border flex flex-col gap-3">
              <Link href="/login" onClick={() => onOpenChange(false)} className="flex items-center justify-center gap-2 rounded-xl bg-violet text-white h-11 font-bold shadow-sm">
                Sign In / Register
              </Link>
              
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Link href="/account" onClick={() => onOpenChange(false)} className="flex items-center gap-2 rounded-xl border border-border bg-white p-3 text-sm font-semibold text-ink hover:border-violet">
                  <User className="size-4 text-violet" />
                  Account
                </Link>
                <Link href="/orders" onClick={() => onOpenChange(false)} className="flex items-center gap-2 rounded-xl border border-border bg-white p-3 text-sm font-semibold text-ink hover:border-violet">
                  <Package className="size-4 text-violet" />
                  Orders
                </Link>
              </div>
            </div>

            {/* Main Categories */}
            <div className="flex flex-col py-2">
              <div className="px-4 py-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Shop By Category
                </span>
              </div>
              <ul className="flex flex-col">
                {categories.map((cat) => (
                  <li key={cat.handle}>
                    <Link
                      href={`/category/${cat.handle}`}
                      onClick={() => onOpenChange(false)}
                      className="flex items-center justify-between px-4 py-3.5 text-sm font-bold text-ink hover:bg-violet-wash hover:text-violet transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-paper">
                          <Icon name={cat.icon} className="size-4 text-violet" />
                        </div>
                        {cat.title}
                      </div>
                      <ChevronRight className="size-4 text-muted-foreground" />
                    </Link>
                  </li>
                ))}
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
