"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useStoreSettings } from "@/lib/settings/settings-context";

// Dynamically import DotLottieReact with SSR turned off so it NEVER bloats initial HTML or server rendering
const DotLottieReact = dynamic(
  () => import("@lottiefiles/dotlottie-react").then((mod) => mod.DotLottieReact),
  { ssr: false }
);

const SESSION_STORAGE_KEY = "preetyprints_anim_loaded";

export function PageLoaderAnimation() {
  const pathname = usePathname();
  const settings = useStoreSettings();

  // Don't show in admin portal
  const isAdminRoute = pathname.startsWith("/admin");

  // Read config from store settings with ultra-safe fallbacks
  const isEnabled = settings.page_loader_enabled ?? true;
  const lottieUrl =
    settings.page_loader_lottie_url ||
    "https://lottie.host/d81c2a5a-19a8-4153-8e46-4aee9b50cf2b/U0uqeX0LSG.lottie";
  const sizePx = Number(settings.page_loader_size_px) || 160;
  const bgMode = settings.page_loader_bg_mode || "glass";
  const maxDurationMs = Number(settings.page_loader_max_duration_ms) || 1200;
  const scope = settings.page_loader_scope || "initial_session";

  const [visible, setVisible] = React.useState(false);
  const [fadingOut, setFadingOut] = React.useState(false);

  React.useEffect(() => {
    if (isAdminRoute || !isEnabled) {
      setVisible(false);
      return;
    }

    // Check session scope: if initial_session, only run once per browser session
    if (typeof window !== "undefined") {
      if (scope === "initial_session") {
        const alreadyShown = sessionStorage.getItem(SESSION_STORAGE_KEY);
        if (alreadyShown) {
          setVisible(false);
          return;
        }
      }
    }

    // Mark as active for this session
    setVisible(true);

    const dismissAnimation = () => {
      setFadingOut(true);
      setTimeout(() => {
        setVisible(false);
        if (typeof window !== "undefined" && scope === "initial_session") {
          sessionStorage.setItem(SESSION_STORAGE_KEY, "true");
        }
      }, 350); // smooth 350ms fade out transition
    };

    // FAST & RELAXED: Dismiss as soon as document completes loading
    if (typeof document !== "undefined") {
      if (document.readyState === "complete") {
        // Hydrated and page complete: display briefly (min 400ms for smooth visual feel) then fade out
        const minTimer = setTimeout(dismissAnimation, 600);
        return () => clearTimeout(minTimer);
      } else {
        const onPageLoaded = () => {
          setTimeout(dismissAnimation, 300);
        };
        window.addEventListener("load", onPageLoaded, { once: true });

        // Hard failsafe: Never let it block longer than maxDurationMs even on slow mobile networks
        const failsafeTimer = setTimeout(dismissAnimation, maxDurationMs);

        return () => {
          window.removeEventListener("load", onPageLoaded);
          clearTimeout(failsafeTimer);
        };
      }
    }
  }, [isAdminRoute, isEnabled, scope, maxDurationMs]);

  if (!visible) return null;

  // Background overlay styling based on admin settings
  const bgClass =
    bgMode === "dark"
      ? "bg-zinc-950/95"
      : bgMode === "light"
      ? "bg-white/95"
      : "bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md";

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center transition-opacity duration-350 pointer-events-auto ${bgClass} ${
        fadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div
        className="relative flex flex-col items-center justify-center"
        style={{ width: `${sizePx}px`, height: `${sizePx}px` }}
      >
        <DotLottieReact
          src={lottieUrl}
          loop
          autoplay
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    </div>
  );
}
