"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { HelpCircle, X, Info, AlertTriangle, Lightbulb } from "lucide-react";
import { createPortal } from "react-dom";
import { ADMIN_HELP_REGISTRY } from "@/lib/admin/help-content";

interface AdminPageHelpButtonProps {
  className?: string;
  variant?: "compact" | "sidebar";
}

export function AdminPageHelpButton({ className, variant = "compact" }: AdminPageHelpButtonProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();
  const isClient = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  // Match root path or parent path safely
  const helpData = React.useMemo(() => {
    if (!pathname) return ADMIN_HELP_REGISTRY["/admin"];
    if (ADMIN_HELP_REGISTRY[pathname]) return ADMIN_HELP_REGISTRY[pathname];
    if (pathname.startsWith("/admin/orders/")) return ADMIN_HELP_REGISTRY["/admin/orders"];
    if (pathname.startsWith("/admin/payments/")) return ADMIN_HELP_REGISTRY["/admin/payments"];
    return ADMIN_HELP_REGISTRY["/admin"];
  }, [pathname]);

  if (!helpData) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={
          className ||
          (variant === "sidebar"
            ? "flex w-full items-center justify-between rounded-xl border border-border/80 bg-white px-3 py-2 text-xs font-semibold text-ink hover:border-violet hover:text-violet transition-colors"
            : "inline-flex items-center gap-1.5 rounded-xl border border-border bg-white px-3 py-1.5 text-xs font-bold text-ink hover:bg-paper transition-all shadow-xs")
        }
        title="Open staff guidance & terminology help"
      >
        <div className="flex items-center gap-2">
          <HelpCircle className="size-3.5 text-violet" />
          <span>Page Help & Guide</span>
        </div>
        <span className="font-mono text-[0.625rem] text-violet font-bold uppercase">Manual</span>
      </button>

      {isOpen && isClient && typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-150">
            <div
              className="relative w-full max-w-2xl max-h-[85vh] my-auto flex flex-col bg-white rounded-2xl p-6 sm:p-8 shadow-2xl border border-border z-10 animate-in zoom-in-95 duration-150"
              onClick={(e) => e.stopPropagation()}
            >
            <div className="flex items-start justify-between border-b border-border pb-3 shrink-0">
              <div>
                <span className="text-[0.6875rem] font-bold uppercase font-mono text-violet block">
                  Staff Operational Manual
                </span>
                <h3 className="font-display text-lg font-extrabold text-ink">{helpData.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{helpData.description}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-ink p-1 rounded-lg hover:bg-paper"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-3.5 overflow-y-auto py-3 pr-1.5 text-xs flex-1">
              {helpData.sections.map((sec, i) => (
                <div
                  key={i}
                  className={`p-3.5 rounded-xl border space-y-1.5 ${
                    sec.variant === "warning"
                      ? "bg-amber-50/70 border-amber-200 text-amber-900"
                      : sec.variant === "tip"
                      ? "bg-emerald-50/70 border-emerald-200 text-emerald-900"
                      : "bg-paper/70 border-border text-ink"
                  }`}
                >
                  <div className="font-bold font-display flex items-center gap-1.5 text-xs">
                    {sec.variant === "warning" && <AlertTriangle className="size-3.5 text-amber-700" />}
                    {sec.variant === "tip" && <Lightbulb className="size-3.5 text-emerald-700" />}
                    {!sec.variant && <Info className="size-3.5 text-violet" />}
                    <span>{sec.heading}</span>
                  </div>

                  {Array.isArray(sec.content) ? (
                    <ul className="space-y-1 text-muted-foreground leading-relaxed">
                      {sec.content.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground leading-relaxed">{sec.content}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-xl bg-ink px-4 py-2 font-bold text-xs text-white hover:bg-ink/90 transition-all"
              >
                Got It
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
