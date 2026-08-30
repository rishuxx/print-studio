"use client";

import * as React from "react";
import { MessageCircle } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

export function WhatsAppFab() {
  if (!siteConfig.contact.whatsapp) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2">
      <a
        href={`${siteConfig.contact.whatsappHref}?text=${encodeURIComponent(siteConfig.contact.whatsappMessage)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex size-13 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lift transition-all duration-300 hover:scale-110 hover:shadow-pop"
        aria-label="Chat on WhatsApp with Doon Print Studio support"
      >
        <MessageCircle className="size-7 fill-white text-transparent" />
        
        {/* Tooltip on hover */}
        <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-xl bg-ink px-3 py-1.5 text-xs font-semibold text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
          Chat with a Print Expert
        </span>
      </a>
    </div>
  );
}
