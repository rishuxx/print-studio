"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { useStoreSettings } from "@/lib/settings/settings-context";
import { Lottie } from "lottie-react";

const SESSION_STORAGE_KEY = "preetyprints_anim_loaded";

export function PageLoaderAnimation() {
  const pathname = usePathname();
  const settings = useStoreSettings();

  // Don't show in admin portal
  const isAdminRoute = pathname.startsWith("/admin");

  // Read config from store settings with ultra-safe fallbacks
  const isEnabled = settings.page_loader_enabled ?? true;
  const configuredUrl = settings.page_loader_lottie_url;
  const sizePx = Number(settings.page_loader_size_px) || 160;
  const bgMode = settings.page_loader_bg_mode || "glass";
  const maxDurationMs = Number(settings.page_loader_max_duration_ms) || 1200;
  const scope = settings.page_loader_scope || "initial_session";

  const [mounted, setMounted] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const [fadingOut, setFadingOut] = React.useState(false);
  const [animationSrc, setAnimationSrc] = React.useState<string | object>("/animations/loader.json");

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Determine visibility & load animation src
  React.useEffect(() => {
    if (!mounted || isAdminRoute || !isEnabled) {
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

    // Resolve URL safely
    let target = "/animations/loader.json";
    if (
      configuredUrl &&
      configuredUrl.startsWith("http") &&
      configuredUrl.endsWith(".json")
    ) {
      target = configuredUrl;
    }

    setAnimationSrc(target);
    setVisible(true);

    const dismissAnimation = () => {
      setFadingOut(true);
      setTimeout(() => {
        setVisible(false);
        if (typeof window !== "undefined" && scope === "initial_session") {
          sessionStorage.setItem(SESSION_STORAGE_KEY, "true");
        }
      }, 350);
    };

    if (typeof document !== "undefined") {
      if (document.readyState === "complete") {
        const minTimer = setTimeout(dismissAnimation, 650);
        return () => clearTimeout(minTimer);
      } else {
        const onPageLoaded = () => {
          setTimeout(dismissAnimation, 350);
        };
        window.addEventListener("load", onPageLoaded, { once: true });
        const failsafeTimer = setTimeout(dismissAnimation, maxDurationMs);

        return () => {
          window.removeEventListener("load", onPageLoaded);
          clearTimeout(failsafeTimer);
        };
      }
    }
  }, [mounted, isAdminRoute, isEnabled, scope, configuredUrl, maxDurationMs]);

  if (!mounted || !visible) return null;

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
        <Lottie
          src={animationSrc}
          loop
          autoplay
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    </div>
  );
}
