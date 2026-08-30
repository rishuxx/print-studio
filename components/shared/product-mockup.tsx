import * as React from "react";
import type { MockupKind } from "@/lib/commerce/types";
import { cn } from "@/lib/utils";

interface ProductMockupProps extends React.SVGProps<SVGSVGElement> {
  kind?: MockupKind;
  tone?: string;
  className?: string;
}

const toneMap: Record<string, string> = {
  violet: "rgba(74, 30, 158, 0.15)",
  marigold: "rgba(242, 163, 28, 0.15)",
  ink: "rgba(255, 255, 255, 0.08)",
  paper: "#f8f6f0",
  transparent: "transparent",
};

export function ProductMockup({
  kind = "generic",
  tone = "transparent",
  className,
  ...props
}: ProductMockupProps) {
  const resolvedBg = tone.startsWith("#") || tone.startsWith("rgb") ? tone : (toneMap[tone] ?? "transparent");

  return (
    <div
      className={cn(
        "relative flex h-full w-full items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-105 rounded-xl",
        className
      )}
      style={{ backgroundColor: resolvedBg }}
    >
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-3/4 w-3/4 text-ink/80 transition-transform duration-300"
        {...props}
      >
        {renderMockupSilhouette(kind)}
      </svg>
    </div>
  );
}

function renderMockupSilhouette(kind: MockupKind) {
  switch (kind) {
    case "card":
    case "card-stack":
      return (
        <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.85">
          <rect x="35" y="45" width="130" height="85" rx="6" fill="#ffffff" fillOpacity="0.8" />
          <rect x="45" y="65" width="130" height="85" rx="6" fill="#ffffff" />
          <line x1="60" y1="85" x2="105" y2="85" stroke="var(--color-violet, #4a1e9e)" strokeWidth="3" />
          <line x1="60" y1="100" x2="145" y2="100" stroke="#a09aa9" strokeWidth="2" />
          <line x1="60" y1="112" x2="125" y2="112" stroke="#a09aa9" strokeWidth="2" />
          <circle cx="150" cy="85" r="8" fill="var(--color-marigold, #f2a31c)" stroke="none" />
        </g>
      );
    case "tshirt":
    case "polo":
      return (
        <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="#ffffff" fillOpacity="0.85">
          <path d="M70 35 L40 55 L55 80 L68 72 L68 165 L132 165 L132 72 L145 80 L160 55 L130 35 C120 48 80 48 70 35 Z" />
          {kind === "polo" ? (
            <>
              <path d="M85 35 L100 65 L115 35" fill="none" strokeWidth="2" />
              <line x1="100" y1="65" x2="100" y2="100" strokeWidth="2" />
            </>
          ) : (
            <path d="M82 39 C88 50 112 50 118 39" fill="none" strokeWidth="2" />
          )}
          <rect x="85" y="85" width="30" height="35" rx="3" fill="var(--color-violet-wash, #f1edfb)" stroke="var(--color-violet, #4a1e9e)" strokeWidth="1.5" strokeDasharray="2 2" />
        </g>
      );
    case "hoodie":
      return (
        <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="#ffffff" fillOpacity="0.85">
          <path d="M65 45 L35 65 L50 90 L65 82 L65 168 L135 168 L135 82 L150 90 L165 65 L135 45 C125 55 75 55 65 45 Z" />
          <path d="M80 40 Q100 20 120 40 Q100 55 80 40 Z" fill="var(--color-violet-tint, #e4dcf7)" />
          <path d="M80 120 L120 120 L125 150 L75 150 Z" fill="none" strokeWidth="2" />
        </g>
      );
    case "mug":
    case "tumbler":
    case "bottle":
      return (
        <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="#ffffff" fillOpacity="0.85">
          {kind === "bottle" ? (
            <>
              <rect x="88" y="25" width="24" height="20" rx="3" fill="#ffffff" />
              <rect x="75" y="45" width="50" height="130" rx="10" fill="#ffffff" />
              <line x1="88" y1="25" x2="112" y2="25" strokeWidth="4" />
            </>
          ) : kind === "tumbler" ? (
            <>
              <path d="M72 45 L128 45 L120 168 L80 168 Z" fill="#ffffff" />
              <line x1="68" y1="45" x2="132" y2="45" strokeWidth="4" />
              <line x1="100" y1="20" x2="100" y2="45" strokeWidth="3" />
            </>
          ) : (
            <>
              <rect x="60" y="55" width="75" height="95" rx="8" fill="#ffffff" />
              <path d="M135 70 C155 70 155 125 135 125" fill="none" strokeWidth="3.5" />
              <rect x="75" y="75" width="45" height="50" rx="4" fill="var(--color-violet-wash, #f1edfb)" stroke="var(--color-violet, #4a1e9e)" strokeWidth="1.5" strokeDasharray="3 3" />
            </>
          )}
        </g>
      );
    case "notebook":
    case "booklet":
    case "brochure":
    case "flyer":
    case "poster":
      return (
        <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="#ffffff" fillOpacity="0.85">
          <rect x="55" y="35" width="90" height="130" rx="4" fill="#ffffff" />
          {kind === "notebook" && (
            <>
              <line x1="55" y1="35" x2="55" y2="165" strokeWidth="6" stroke="var(--color-violet, #4a1e9e)" />
              <circle cx="62" cy="50" r="2" fill="currentColor" />
              <circle cx="62" cy="70" r="2" fill="currentColor" />
              <circle cx="62" cy="90" r="2" fill="currentColor" />
              <circle cx="62" cy="110" r="2" fill="currentColor" />
              <circle cx="62" cy="130" r="2" fill="currentColor" />
              <circle cx="62" cy="150" r="2" fill="currentColor" />
            </>
          )}
          <line x1="75" y1="65" x2="125" y2="65" stroke="var(--color-violet, #4a1e9e)" strokeWidth="3" />
          <line x1="75" y1="85" x2="125" y2="85" stroke="#a09aa9" strokeWidth="2" />
          <line x1="75" y1="100" x2="115" y2="100" stroke="#a09aa9" strokeWidth="2" />
          <line x1="75" y1="115" x2="125" y2="115" stroke="#a09aa9" strokeWidth="2" />
        </g>
      );
    case "sticker":
    case "sticker-sheet":
    case "label":
      return (
        <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="#ffffff" fillOpacity="0.9">
          {kind === "sticker" ? (
            <>
              <circle cx="100" cy="100" r="50" fill="#ffffff" strokeWidth="3" />
              <path d="M135 135 L100 100 L135 100 Z" fill="var(--color-marigold-tint, #fce8c2)" stroke="var(--color-marigold, #f2a31c)" />
              <circle cx="100" cy="100" r="32" stroke="var(--color-violet, #4a1e9e)" strokeWidth="2" strokeDasharray="3 3" fill="none" />
            </>
          ) : (
            <>
              <rect x="50" y="40" width="100" height="120" rx="6" fill="#ffffff" />
              <circle cx="75" cy="70" r="14" fill="var(--color-violet-wash, #f1edfb)" stroke="var(--color-violet, #4a1e9e)" />
              <circle cx="125" cy="70" r="14" fill="var(--color-marigold-wash, #fef6e7)" stroke="var(--color-marigold, #f2a31c)" />
              <circle cx="75" cy="120" r="14" fill="var(--color-paper-deep, #edebf2)" stroke="currentColor" />
              <circle cx="125" cy="120" r="14" fill="var(--color-violet-tint, #e4dcf7)" stroke="var(--color-violet, #4a1e9e)" />
            </>
          )}
        </g>
      );
    case "box":
    case "mailer":
    case "bag":
    case "tote":
      return (
        <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="#ffffff" fillOpacity="0.9">
          {kind === "tote" || kind === "bag" ? (
            <>
              <path d="M80 60 C80 30 120 30 120 60" fill="none" strokeWidth="3" />
              <path d="M55 60 L145 60 L138 160 L62 160 Z" fill="#ffffff" />
              <rect x="78" y="90" width="44" height="44" rx="4" fill="var(--color-violet-wash, #f1edfb)" stroke="var(--color-violet, #4a1e9e)" strokeWidth="1.5" />
            </>
          ) : (
            <>
              <path d="M100 40 L160 70 L100 100 L40 70 Z" fill="var(--color-paper-deep, #edebf2)" />
              <path d="M40 70 L100 100 L100 160 L40 130 Z" fill="#ffffff" />
              <path d="M160 70 L100 100 L100 160 L160 130 Z" fill="var(--color-paper, #f6f5f8)" />
            </>
          )}
        </g>
      );
    case "frame":
    case "canvas":
    case "photo-print":
    case "acrylic":
      return (
        <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="#ffffff" fillOpacity="0.9">
          <rect x="45" y="45" width="110" height="110" rx="4" fill="#ffffff" strokeWidth="4" />
          <rect x="57" y="57" width="86" height="86" fill="var(--color-violet-wash, #f1edfb)" stroke="none" />
          <path d="M58 125 L85 95 L105 115 L125 85 L143 125 Z" fill="var(--color-violet-tint, #e4dcf7)" stroke="none" />
          <circle cx="78" cy="78" r="7" fill="var(--color-marigold, #f2a31c)" stroke="none" />
        </g>
      );
    case "signage":
    case "decal":
      return (
        <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="#ffffff" fillOpacity="0.9">
          <rect x="65" y="35" width="70" height="120" rx="4" fill="#ffffff" strokeWidth="3" />
          <line x1="50" y1="165" x2="150" y2="165" strokeWidth="5" />
          <line x1="100" y1="155" x2="100" y2="165" strokeWidth="4" />
          <rect x="75" y="55" width="50" height="60" rx="3" fill="var(--color-violet-wash, #f1edfb)" stroke="var(--color-violet, #4a1e9e)" strokeWidth="1.5" />
        </g>
      );
    case "stamp":
      return (
        <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="#ffffff" fillOpacity="0.9">
          <rect x="70" y="35" width="60" height="50" rx="6" fill="var(--color-violet, #4a1e9e)" stroke="none" />
          <rect x="55" y="85" width="90" height="60" rx="6" fill="#ffffff" />
          <line x1="50" y1="145" x2="150" y2="145" strokeWidth="5" stroke="currentColor" />
          <line x1="75" y1="110" x2="125" y2="110" stroke="var(--color-violet, #4a1e9e)" strokeWidth="3" />
        </g>
      );
    case "idcard":
    case "lanyard":
      return (
        <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="#ffffff" fillOpacity="0.9">
          <path d="M100 20 L100 45" strokeWidth="4" stroke="var(--color-violet, #4a1e9e)" />
          <rect x="60" y="45" width="80" height="120" rx="6" fill="#ffffff" strokeWidth="3" />
          <rect x="85" y="52" width="30" height="6" rx="3" fill="currentColor" stroke="none" />
          <circle cx="100" cy="85" r="15" fill="var(--color-violet-wash, #f1edfb)" stroke="var(--color-violet, #4a1e9e)" strokeWidth="1.5" />
          <line x1="75" y1="115" x2="125" y2="115" stroke="currentColor" strokeWidth="2.5" />
          <line x1="80" y1="130" x2="120" y2="130" stroke="#a09aa9" strokeWidth="2" />
        </g>
      );
    default:
      return (
        <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="#ffffff" fillOpacity="0.9">
          <rect x="50" y="50" width="100" height="100" rx="8" fill="#ffffff" />
          <path d="M80 80 L120 120 M120 80 L80 120" stroke="var(--color-violet, #4a1e9e)" strokeWidth="2" />
          <circle cx="100" cy="100" r="35" stroke="#a09aa9" strokeWidth="1.5" strokeDasharray="3 3" fill="none" />
        </g>
      );
  }
}
