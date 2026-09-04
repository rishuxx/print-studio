"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "relative inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium",
    "transition-[background-color,color,box-shadow,transform,border-color] duration-200",
    "disabled:pointer-events-none disabled:opacity-45",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
    "active:translate-y-px",
    "select-none",
  ].join(" "),
  {
    variants: {
      variant: {
        /** The one true primary. Deep indigo-violet. */
        primary:
          "bg-violet text-white shadow-[0_1px_0_0_rgb(255_255_255/0.14)_inset,0_6px_16px_-8px_rgb(74_30_158/0.7)] hover:bg-violet-lift hover:shadow-[0_1px_0_0_rgb(255_255_255/0.18)_inset,0_10px_24px_-8px_rgb(74_30_158/0.6)]",
        /** Festive / seasonal calls to action. */
        marigold:
          "bg-marigold text-ink shadow-[0_1px_0_0_rgb(255_255_255/0.3)_inset,0_6px_16px_-8px_rgb(242_163_28/0.75)] hover:brightness-105",
        /** Dark, for use on paper when primary would be too loud. */
        ink: "bg-ink text-white hover:bg-ink-soft",
        secondary:
          "bg-violet-wash text-violet-deep hover:bg-violet-tint",
        outline:
          "border border-border bg-white text-ink hover:border-violet hover:text-violet",
        /** Outline sitting on a dark ink zone. */
        "outline-invert":
          "border border-white/25 bg-white/5 text-white backdrop-blur-sm hover:border-white/60 hover:bg-white/10",
        ghost: "text-ink hover:bg-muted",
        "ghost-invert": "text-white/80 hover:bg-white/10 hover:text-white",
        destructive:
          "bg-destructive text-white hover:brightness-110",
        /** Express Printing / high-priority action navigation CTA */
        express:
          "bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-white shadow-2xs font-semibold rounded-full",
        link: "text-primary underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        xs: "h-8 rounded-md px-2.5 text-xs [&_svg]:size-3.5",
        sm: "h-9 rounded-lg px-3.5 text-[0.8125rem] [&_svg]:size-4",
        default: "h-11 rounded-xl px-5 text-sm [&_svg]:size-4",
        lg: "h-[3.25rem] rounded-xl px-7 text-[0.9375rem] [&_svg]:size-[1.125rem]",
        xl: "h-14 rounded-2xl px-8 text-base [&_svg]:size-5",
        icon: "size-11 rounded-xl [&_svg]:size-[1.125rem]",
        "icon-sm": "size-9 rounded-lg [&_svg]:size-4",
        "icon-xs": "size-8 rounded-md [&_svg]:size-3.5",
      },
      /** Pill shape — reserved for festive banner CTAs per the design system. */
      pill: { true: "rounded-full", false: "" },
      full: { true: "w-full", false: "" },
    },
    defaultVariants: { variant: "primary", size: "default", pill: false, full: false },
  },
);

export interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  /** Announced to screen readers while `loading` is true. */
  loadingText?: string;
}

function Button({
  className,
  variant,
  size,
  pill,
  full,
  asChild = false,
  loading = false,
  loadingText,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  if (asChild) {
    return (
      <Comp
        data-slot="button"
        className={cn(buttonVariants({ variant, size, pill, full }), className)}
        {...props}
      >
        {children}
      </Comp>
    );
  }

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, pill, full }), className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <Loader2 className="animate-spin" aria-hidden="true" />}
      {loading && loadingText ? loadingText : children}
    </Comp>
  );
}

export { Button, buttonVariants };
