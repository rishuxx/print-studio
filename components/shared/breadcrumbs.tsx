import * as React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  title?: string;
  label?: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumbs"
      className={cn("flex items-center space-x-1 text-xs text-muted-foreground", className)}
    >
      <Link
        href="/"
        className="flex items-center gap-1 hover:text-ink transition-colors"
        aria-label="Home"
      >
        <Home className="size-3.5" />
        <span className="sr-only">Home</span>
      </Link>

      {items.map((item, index) => {
        const itemText = item.title || item.label || "";
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={`${itemText}-${index}`}>
            <ChevronRight className="size-3 text-border shrink-0" aria-hidden="true" />
            {isLast || !item.href ? (
              <span
                className="font-medium text-ink truncate max-w-[200px] sm:max-w-none"
                aria-current={isLast ? "page" : undefined}
              >
                {itemText}
              </span>
            ) : (
              <Link
                href={item.href}
                className="hover:text-ink transition-colors truncate max-w-[150px] sm:max-w-none"
              >
                {itemText}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
