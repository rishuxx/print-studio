"use client";

import * as React from "react";
import Link from "next/link";
import { useStoreSettings } from "@/lib/settings/settings-context";
import { Wrench, Phone, Mail, MessageSquare, RefreshCw, ShieldAlert, Lock } from "lucide-react";

export function StorefrontMaintenanceScreen() {
  const settings = useStoreSettings();
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    window.location.reload();
  };

  const message =
    settings.store_pause_message ||
    "We are currently performing scheduled maintenance and press calibration. Please check back shortly.";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0d0714] text-white px-4 py-12 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute -top-40 -left-40 size-96 rounded-full bg-violet/20 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 size-96 rounded-full bg-rose-500/10 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-xl text-center relative z-10 space-y-8">
        {/* Animated Status Icon */}
        <div className="relative inline-flex items-center justify-center">
          <div className="size-24 rounded-3xl bg-violet/10 border border-violet/30 flex items-center justify-center shadow-2xl backdrop-blur-md">
            <Wrench className="size-10 text-violet animate-pulse" />
          </div>
          <span className="absolute -top-2 -right-2 flex size-5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full size-5 bg-amber-500 border-2 border-[#0d0714]" />
          </span>
        </div>

        {/* Brand & Headline */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
            <ShieldAlert className="size-3.5" />
            <span>Scheduled Store Maintenance</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-black tracking-tight text-white">
            {settings.business_name || "Print Studio"}
          </h1>

          <p className="text-sm sm:text-base text-white/70 max-w-md mx-auto leading-relaxed">
            {message}
          </p>
        </div>

        {/* Support & Reach Out Box */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl space-y-4 text-left shadow-xl">
          <div className="text-xs font-bold uppercase tracking-wider text-white/50 font-mono">
            Urgent Inquiries & Direct Support
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {settings.support_phone && (
              <a
                href={`tel:${settings.support_phone}`}
                className="flex items-center gap-3 p-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-violet/40 transition-colors text-xs font-semibold text-white/90"
              >
                <div className="size-8 rounded-lg bg-violet/20 flex items-center justify-center text-violet shrink-0">
                  <Phone className="size-4" />
                </div>
                <div className="truncate">
                  <div className="text-[0.625rem] text-white/50">Call Helpline</div>
                  <div className="font-mono">{settings.support_phone}</div>
                </div>
              </a>
            )}

            {settings.support_email && (
              <a
                href={`mailto:${settings.support_email}`}
                className="flex items-center gap-3 p-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-violet/40 transition-colors text-xs font-semibold text-white/90"
              >
                <div className="size-8 rounded-lg bg-violet/20 flex items-center justify-center text-violet shrink-0">
                  <Mail className="size-4" />
                </div>
                <div className="truncate">
                  <div className="text-[0.625rem] text-white/50">Email Studio</div>
                  <div className="font-mono">{settings.support_email}</div>
                </div>
              </a>
            )}

            {settings.whatsapp_number && (
              <a
                href={`https://wa.me/${settings.whatsapp_number.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="sm:col-span-2 flex items-center gap-3 p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 transition-colors text-xs font-semibold text-emerald-300"
              >
                <div className="size-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <MessageSquare className="size-4" />
                </div>
                <div>
                  <div className="text-[0.625rem] text-emerald-400/70">WhatsApp Support</div>
                  <div>Chat directly with our production desk</div>
                </div>
              </a>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-violet px-6 py-3 text-xs font-bold text-white shadow-lg hover:bg-violet-lift transition-all disabled:opacity-50"
          >
            <RefreshCw className={`size-4 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>{isRefreshing ? "Checking Live Status..." : "Check Status Again"}</span>
          </button>

          <Link
            href="/admin/settings"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-xs font-bold text-white/80 hover:bg-white/10 transition-all"
          >
            <Lock className="size-3.5 text-white/60" />
            <span>Admin Staff Login</span>
          </Link>
        </div>

        {/* Footer */}
        <div className="text-[0.6875rem] text-white/40 font-mono">
          System State: <span className="text-amber-400">MAINTENANCE_LOCKED</span> · All active orders remain safe and in queue.
        </div>
      </div>
    </div>
  );
}
