import * as React from "react";
import { cn } from "@/lib/utils";

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-2xl border border-border bg-white p-4",
        className
      )}
    >
      <div className="aspect-[4/3] w-full rounded-xl skeleton" />
      <div className="mt-4 flex items-center justify-between">
        <div className="h-3 w-20 rounded skeleton" />
        <div className="h-3 w-12 rounded skeleton" />
      </div>
      <div className="mt-2 h-5 w-3/4 rounded skeleton" />
      <div className="mt-2 h-3.5 w-full rounded skeleton" />
      <div className="mt-4 flex items-center justify-between pt-3 border-t border-border/60">
        <div className="h-5 w-24 rounded skeleton" />
        <div className="size-8 rounded-lg skeleton" />
      </div>
    </div>
  );
}
