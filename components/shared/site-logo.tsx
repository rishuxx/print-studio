"use client";

import * as React from "react";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { useStoreSettings } from "@/lib/settings/settings-context";
import { cn } from "@/lib/utils";

interface SiteLogoProps {
  className?: string;
  isMobile?: boolean;
}

export function SiteLogo({ className, isMobile = false }: SiteLogoProps) {
  const settings = useStoreSettings();

  const logoMode = (settings as any).logo_mode || (settings.logo_url ? "image" : "text");
  const logoUrl = isMobile && (settings as any).logo_mobile_url
    ? (settings as any).logo_mobile_url
    : settings.logo_url;
  const altText = (settings as any).logo_alt_text || settings.business_name || siteConfig.businessName;
  const businessName = settings.business_name || siteConfig.businessName;

  if (logoMode === "image" && logoUrl) {
    const desktopHeight = Number((settings as any).logo_height_desktop) || 54;
    const mobileHeight = Number((settings as any).logo_height_mobile) || 40;
    const activeHeight = isMobile ? mobileHeight : desktopHeight;

    return (
      <Link href="/" className={cn("flex items-center group shrink-0", className)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoUrl}
          alt={altText}
          style={{ height: `${activeHeight}px`, maxHeight: `${activeHeight}px` }}
          className="w-auto object-contain transition-transform duration-200 group-hover:scale-102"
        />
      </Link>
    );
  }

  return (
    <Link href="/" className={cn("flex items-center gap-2 group shrink-0", className)}>
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className="font-display text-xl sm:text-2xl font-extrabold tracking-tight text-zinc-900 group-hover:text-primary transition-colors">
            {businessName}
          </span>
        </div>
        {/* CMYK Mini Registration Mark */}
        <div className="flex h-1 w-full gap-0.5 mt-0.5 rounded-full overflow-hidden">
          <span className="flex-1 bg-[#00aeef]" />
          <span className="flex-1 bg-[#ec008c]" />
          <span className="flex-1 bg-[#fff200]" />
          <span className="flex-1 bg-[#1b0b2e]" />
        </div>
      </div>
    </Link>
  );
}
