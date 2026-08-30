"use client";

import * as React from "react";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

/**
 * Client-side shell. Cart and wishlist stores hydrate themselves from
 * localStorage via zustand/persist, so there is no provider for them —
 * this only holds cross-cutting UI concerns.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider delayDuration={250} skipDelayDuration={0}>
      {children}
      <Toaster
        position="bottom-right"
        offset={16}
        gap={10}
        toastOptions={{
          classNames: {
            toast:
              "!rounded-xl !border !border-border !bg-white !text-ink !shadow-[0_4px_8px_rgb(27_11_46/0.06),0_28px_60px_-20px_rgb(27_11_46/0.24)] !font-sans",
            title: "!text-sm !font-semibold",
            description: "!text-[0.8125rem] !text-muted-foreground",
            actionButton:
              "!bg-violet !text-white !rounded-lg !text-xs !font-medium",
            cancelButton:
              "!bg-muted !text-muted-foreground !rounded-lg !text-xs",
          },
        }}
      />
    </TooltipProvider>
  );
}
