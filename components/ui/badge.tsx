import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { BadgeKind } from "@/lib/commerce/types";

const badgeVariants = cva(
  "inline-flex items-center gap-1 border font-mono font-semibold uppercase tracking-[0.1em] leading-none whitespace-nowrap",
  {
    variants: {
      tone: {
        neutral: "border-border bg-white/90 text-muted-foreground",
        violet: "border-violet/20 bg-violet-wash text-violet-deep",
        solid: "border-transparent bg-violet text-white",
        marigold: "border-marigold/30 bg-marigold-wash text-marigold-deep",
        ink: "border-transparent bg-ink text-white",
        eco: "border-success/25 bg-[#eaf6ee] text-success",
        danger: "border-destructive/25 bg-[#fdecec] text-destructive",
        outline: "border-ink/15 bg-transparent text-ink",
      },
      size: {
        sm: "rounded-md px-1.5 py-1 text-[0.5625rem]",
        default: "rounded-md px-2 py-1 text-[0.625rem]",
        lg: "rounded-lg px-2.5 py-1.5 text-[0.6875rem]",
      },
    },
    defaultVariants: { tone: "neutral", size: "default" },
  },
);

export interface BadgeProps
  extends React.ComponentProps<"span">,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, tone, size, ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ tone, size }), className)}
      {...props}
    />
  );
}

/* ─────────────────────────────────────────────────────────────────────
   Catalog badges — one place decides how "Popular" or "Same day" looks,
   so a chip means the same thing on every surface of the site.
   ───────────────────────────────────────────────────────────────────── */

export const badgeMeta: Record<
  BadgeKind,
  { label: string; tone: NonNullable<BadgeProps["tone"]> }
> = {
  bestseller: { label: "Best seller", tone: "solid" },
  popular: { label: "Popular", tone: "violet" },
  recommended: { label: "Recommended", tone: "neutral" },
  new: { label: "New", tone: "ink" },
  "same-day": { label: "Same day", tone: "marigold" },
  festive: { label: "Festive", tone: "marigold" },
  eco: { label: "Eco", tone: "eco" },
  premium: { label: "Premium", tone: "outline" },
  "bulk-saver": { label: "Bulk saver", tone: "violet" },
};

export function CatalogBadge({
  kind,
  size,
  className,
}: {
  kind: BadgeKind;
  size?: BadgeProps["size"];
  className?: string;
}) {
  const meta = badgeMeta[kind];
  if (!meta) return null;
  return (
    <Badge tone={meta.tone} size={size} className={className}>
      {meta.label}
    </Badge>
  );
}

export { Badge, badgeVariants };
