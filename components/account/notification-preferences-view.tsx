"use client";

import React, { useEffect, useState, useTransition } from "react";
import { fetchNotificationPreferencesAction } from "@/lib/notifications/actions";
import { updateCustomerNotificationPreferencesAction } from "@/lib/notifications/mutations";
import { CustomerNotificationPreferences } from "@/lib/notifications/types";
import { Bell, ShieldCheck, Tag, Box, Sliders, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export function NotificationPreferencesView() {
  const [preferences, setPreferences] = useState<CustomerNotificationPreferences | null>(null);
  const [inAppPromo, setInAppPromo] = useState(true);
  const [inAppProduct, setInAppProduct] = useState(true);
  const [inAppSystem, setInAppSystem] = useState(true);
  const [emailOrder, setEmailOrder] = useState(true);
  const [whatsappOrder, setWhatsappOrder] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    fetchNotificationPreferencesAction().then((pref) => {
      if (pref) {
        setPreferences(pref);
        setInAppPromo(pref.in_app_promotional_updates);
        setInAppProduct(pref.in_app_product_updates);
        setInAppSystem(pref.in_app_system_updates);
        setEmailOrder(pref.email_order_updates);
        setWhatsappOrder(pref.whatsapp_order_updates);
      }
      setIsLoading(false);
    });
  }, []);

  const handleSave = () => {
    startTransition(async () => {
      const res = await updateCustomerNotificationPreferencesAction({
        inAppPromo,
        inAppProduct,
        inAppSystem,
        emailOrder,
        whatsappOrder,
      });

      if (res.success) {
        toast.success("Preferences updated successfully!");
      } else {
        toast.error("Failed to save preferences", { description: res.error });
      }
    });
  };

  if (isLoading) {
    return (
      <div className="p-6 rounded-2xl border border-zinc-200 bg-white animate-pulse text-xs text-zinc-500">
        Loading communication preferences...
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-2xs space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-zinc-900 flex items-center gap-2">
            <Sliders className="size-4 text-primary" />
            <span>Notification & Communication Preferences</span>
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Control which transactional updates, product launches, and seasonal discounts you receive.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Mandatory Transactional Group */}
        <div className="flex items-start justify-between p-3.5 rounded-xl bg-zinc-50/80 border border-zinc-200/60">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200/60 mt-0.5">
              <ShieldCheck className="size-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-bold text-zinc-900">
                  Order & Delivery Lifecycle
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                  Mandatory Transactional
                </span>
              </div>
              <p className="text-xs text-zinc-500 mt-1">
                Order confirmation, pre-press proof inspection, dispatch manifests, and live courier tracking.
              </p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={true}
            disabled
            className="size-4 rounded border-zinc-300 text-primary accent-primary cursor-not-allowed opacity-80"
          />
        </div>

        {/* In-App Promotions Toggle */}
        <div className="flex items-start justify-between p-3.5 rounded-xl border border-zinc-200 hover:border-zinc-300 transition-colors">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-violet-50 text-primary border border-violet-100 mt-0.5">
              <Tag className="size-4" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-bold text-zinc-900">
                Offers, Festival Campaigns & Bulk Discounts
              </span>
              <p className="text-xs text-zinc-500 mt-1">
                Promotional coupons, seasonal print sales, and special volume pricing notifications.
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer mt-1">
            <input
              type="checkbox"
              checked={inAppPromo}
              onChange={(e) => setInAppPromo(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>

        {/* Product Launches Toggle */}
        <div className="flex items-start justify-between p-3.5 rounded-xl border border-zinc-200 hover:border-zinc-300 transition-colors">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 mt-0.5">
              <Box className="size-4" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-bold text-zinc-900">
                New Printing Products & Finishes
              </span>
              <p className="text-xs text-zinc-500 mt-1">
                Announcements when new paper stocks, spot UV finishes, or packaging dies are added.
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer mt-1">
            <input
              type="checkbox"
              checked={inAppProduct}
              onChange={(e) => setInAppProduct(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>

        {/* System & Maintenance Notices */}
        <div className="flex items-start justify-between p-3.5 rounded-xl border border-zinc-200 hover:border-zinc-300 transition-colors">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600 border border-amber-100 mt-0.5">
              <Bell className="size-4" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-bold text-zinc-900">
                Service & Holiday Schedule Notices
              </span>
              <p className="text-xs text-zinc-500 mt-1">
                Press maintenance alerts and Diwali / regional courier dispatch cut-off schedules.
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer mt-1">
            <input
              type="checkbox"
              checked={inAppSystem}
              onChange={(e) => setInAppSystem(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          onClick={handleSave}
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-xs font-bold text-white hover:bg-primary/90 transition-all shadow-sheet disabled:opacity-50 cursor-pointer"
        >
          {isPending ? (
            <div className="size-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : (
            <CheckCircle2 className="size-3.5" />
          )}
          <span>Save Communication Preferences</span>
        </button>
      </div>
    </div>
  );
}
