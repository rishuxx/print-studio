import * as React from "react";
import Link from "next/link";
import { PackageOpen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-white/60 p-8 text-center",
        className
      )}
    >
      <div className="flex size-14 items-center justify-center rounded-2xl bg-violet-wash text-violet-deep mb-4">
        {icon || <PackageOpen className="size-7" />}
      </div>
      <h3 className="text-lg font-bold text-ink">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">{description}</p>
      
      {(actionLabel && (actionHref || onAction)) && (
        <div className="mt-6">
          {actionHref ? (
            <Button asChild variant="primary" size="sm">
              <Link href={actionHref}>
                {actionLabel}
                <ArrowRight className="size-4 ml-1.5" />
              </Link>
            </Button>
          ) : (
            <Button onClick={onAction} variant="primary" size="sm">
              {actionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
