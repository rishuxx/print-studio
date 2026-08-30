"use client";

import * as React from "react";
import Link from "next/link";
import { useStoreSettings } from "@/lib/settings/settings-context";
import { Phone, Mail, MessageSquare, RefreshCw, Lock, Sparkles, CheckCircle2, Clock } from "lucide-react";

export function StorefrontMaintenanceScreen() {
  const settings = useStoreSettings();
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    window.location.reload();
  };

  const message =
    settings.store_pause_message ||
    "We are currently upgrading our production systems and calibrating equipment to serve you better. Please check back shortly.";

  const storeName = settings.business_name || settings.business_short_name || "Print Studio";

  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-[#f8f7fb] text-ink selection:bg-violet-wash selection:text-violet relative overflow-hidden">
      {/* Subtle modern light-mesh background accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] pointer-events-none overflow-hidden">
        <div className="absolute -top-32 left-1/4 size-[420px] rounded-full bg-violet/5 blur-[90px]" />
        <div className="absolute -top-20 right-1/4 size-[380px] rounded-full bg-marigold/10 blur-[80px]" />
        <div className="absolute top-40 left-1/2 -translate-x-1/2 size-[600px] rounded-full bg-violet-wash/60 blur-[100px]" />
      </div>

      {/* Top Header Brand Bar */}
      <header className="w-full max-w-5xl mx-auto px-6 py-8 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-violet text-white font-display font-black text-lg shadow-sm">
            {storeName.charAt(0)}
          </div>
          <span className="font-display text-xl font-bold text-ink tracking-tight">
            {storeName}
          </span>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50/80 px-3.5 py-1 text-xs font-semibold text-amber-800 shadow-xs">
          <span className="size-2 rounded-full bg-amber-500 animate-pulse" />
          <span>Under Maintenance</span>
        </div>
      </header>

      {/* Main Content Card */}
      <main className="w-full max-w-2xl mx-auto px-4 py-4 relative z-10">
        <div className="rounded-3xl border border-border/80 bg-white p-8 sm:p-12 shadow-[0_20px_60px_-15px_rgba(27,11,46,0.06)] text-center space-y-8">
          
          {/* Modern Minimal Graphic / Plug Illustration */}
          <div className="relative mx-auto flex items-center justify-center">
            <div className="relative size-24 sm:size-28 rounded-3xl bg-violet-wash/60 border border-violet/10 flex items-center justify-center shadow-inner">
              {/* Clean SVG Vector Plug / Calibration Art */}
              <svg
                className="size-14 sm:size-16 text-violet drop-shadow-xs"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Left Plug Connector */}
                <path
                  d="M10 32H24M24 24V40C24 42.2091 22.2091 44 20 44H14C11.7909 44 10 42.2091 10 40V24C10 21.7909 11.7909 20 14 20H20C22.2091 20 24 21.7909 24 24Z"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="opacity-90"
                />
                <path
                  d="M24 28H28M24 36H28"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Right Socket Connector */}
                <path
                  d="M54 32H40M40 24V40C40 42.2091 41.7909 44 44 44H50C52.2091 44 54 42.2091 54 40V24C54 21.7909 52.2091 20 50 20H44C41.7909 20 40 21.7909 40 24Z"
                  stroke="#f2a31c"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M36 28H40M36 36H40"
                  stroke="#f2a31c"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Center Sparkle */}
                <circle cx="32" cy="32" r="2.5" fill="#4a1e9e" className="animate-ping" />
              </svg>

              <span className="absolute -top-1.5 -right-1.5 flex size-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full size-4 bg-amber-500 border-2 border-white" />
              </span>
            </div>
          </div>

          {/* Heading & Notice Message */}
          <div className="space-y-3 max-w-lg mx-auto">
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
              We&apos;re currently tuning our presses
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-normal">
              {message}
            </p>
          </div>

          {/* Reassurance Checkpoints */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left p-4 rounded-2xl bg-paper/60 border border-border/60">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="size-4 text-emerald-600 mt-0.5 shrink-0" />
              <div className="text-xs text-ink/80">
                <span className="font-bold text-ink">Active Orders: </span>
                Printing and dispatch workflows are progressing on schedule.
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Clock className="size-4 text-violet mt-0.5 shrink-0" />
              <div className="text-xs text-ink/80">
                <span className="font-bold text-ink">Live Support: </span>
                Our production team is available for inquiries and bulk quotes.
              </div>
            </div>
          </div>

          {/* Direct Support Contact Grid */}
          <div className="space-y-3">
            <div className="text-[0.6875rem] font-bold uppercase tracking-wider text-muted-foreground font-mono">
              Need immediate assistance? Reach our studio desk
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {settings.support_phone && (
                <a
                  href={`tel:${settings.support_phone}`}
                  className="flex flex-col items-center justify-center p-3.5 rounded-2xl border border-border/70 bg-white hover:bg-violet-wash/30 hover:border-violet/30 transition-all text-ink group shadow-2xs"
                >
                  <div className="size-8 rounded-xl bg-violet/10 flex items-center justify-center text-violet mb-2 group-hover:scale-105 transition-transform">
                    <Phone className="size-4" />
                  </div>
                  <span className="text-[0.6875rem] text-muted-foreground font-medium">Call Studio</span>
                  <span className="font-mono text-xs font-bold text-ink mt-0.5">{settings.support_phone}</span>
                </a>
              )}

              {settings.support_email && (
                <a
                  href={`mailto:${settings.support_email}`}
                  className="flex flex-col items-center justify-center p-3.5 rounded-2xl border border-border/70 bg-white hover:bg-violet-wash/30 hover:border-violet/30 transition-all text-ink group shadow-2xs"
                >
                  <div className="size-8 rounded-xl bg-violet/10 flex items-center justify-center text-violet mb-2 group-hover:scale-105 transition-transform">
                    <Mail className="size-4" />
                  </div>
                  <span className="text-[0.6875rem] text-muted-foreground font-medium">Email Desk</span>
                  <span className="font-mono text-xs font-bold text-ink mt-0.5 truncate max-w-[170px]">
                    {settings.support_email}
                  </span>
                </a>
              )}

              {settings.whatsapp_number && (
                <a
                  href={`https://wa.me/${settings.whatsapp_number.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-3.5 rounded-2xl border border-emerald-200/80 bg-emerald-50/40 hover:bg-emerald-50/80 transition-all text-emerald-950 group shadow-2xs"
                >
                  <div className="size-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                    <MessageSquare className="size-4" />
                  </div>
                  <span className="text-[0.6875rem] text-emerald-800 font-medium">WhatsApp</span>
                  <span className="text-xs font-bold text-emerald-900 mt-0.5">Chat Directly</span>
                </a>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-violet px-6 py-3 text-xs font-bold text-white shadow-lift hover:bg-violet-lift transition-all disabled:opacity-50"
            >
              <RefreshCw className={`size-4 ${isRefreshing ? "animate-spin" : ""}`} />
              <span>{isRefreshing ? "Checking Live Status..." : "Check Status Again"}</span>
            </button>

            <Link
              href="/admin/settings"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-white px-5 py-3 text-xs font-bold text-ink hover:bg-paper hover:border-violet/30 transition-all"
            >
              <Lock className="size-3.5 text-muted-foreground" />
              <span>Admin Staff Login</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-5xl mx-auto px-6 py-8 text-center text-xs text-muted-foreground relative z-10 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-border/60">
        <div className="flex items-center gap-2">
          <Sparkles className="size-3.5 text-violet" />
          <span>© {new Date().getFullYear()} {storeName}. All rights reserved.</span>
        </div>
        <div className="font-mono text-[0.6875rem] text-muted-foreground/80">
          System State: <span className="font-bold text-amber-600">SCHEDULED_MAINTENANCE</span>
        </div>
      </footer>
    </div>
  );
}
