import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * A card is a piece of paper. Hairline border, no heavy shadow at rest,
 * lifts on hover. `variant="sheet"` adds the press-sheet dot texture.
 */
function Card({
  className,
  variant = "plain",
  ...props
}: React.ComponentProps<"div"> & { variant?: "plain" | "sheet" | "muted" }) {
  return (
    <div
      data-slot="card"
      className={cn(
        "rounded-2xl border border-border text-card-foreground",
        variant === "plain" && "bg-card",
        variant === "sheet" && "press-sheet",
        variant === "muted" && "bg-paper",
        className,
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn("flex flex-col gap-1.5 p-5 sm:p-6", className)}
      {...props}
    />
  );
}

function CardTitle({
  className,
  as: As = "h3",
  ...props
}: React.ComponentProps<"h3"> & { as?: React.ElementType }) {
  return (
    <As
      data-slot="card-title"
      className={cn("text-lg leading-tight tracking-[-0.02em]", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("p-5 pt-0 sm:p-6 sm:pt-0", className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center gap-3 p-5 pt-0 sm:p-6 sm:pt-0", className)}
      {...props}
    />
  );
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
