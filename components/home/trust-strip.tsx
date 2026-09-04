import * as React from "react";
import { Printer, Briefcase, Gift, Boxes } from "lucide-react";

export function TrustStrip() {
  const propositions = [
    {
      icon: Printer,
      title: "Custom Printing",
      description: "Print designs made for your exact needs",
    },
    {
      icon: Briefcase,
      title: "Business Printing",
      description: "Materials for everyday business branding",
    },
    {
      icon: Gift,
      title: "Personalised Products",
      description: "Turn your photos and ideas into products",
    },
    {
      icon: Boxes,
      title: "Bulk Orders",
      description: "Printing support for larger requirements",
    },
  ];

  return (
    <section className="border-b border-zinc-200/80 bg-white py-4 sm:py-8">
      <div className="shell">
        {/* On mobile: 2-column compact grid; On tablet: 2-column; On desktop: 4-column */}
        <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-4">
          {propositions.map((prop, idx) => {
            const IconComp = prop.icon;
            return (
              <div
                key={idx}
                className="group flex items-center gap-2 sm:gap-3.5 rounded-xl sm:rounded-2xl border border-zinc-100 bg-zinc-50/50 p-2.5 sm:p-4 transition-all duration-200 hover:border-primary/30 hover:bg-white hover:shadow-xs"
              >
                <div className="flex size-8 sm:size-11 shrink-0 items-center justify-center rounded-lg sm:rounded-xl bg-white border border-zinc-200/80 text-zinc-400 group-hover:text-primary group-hover:border-primary/30 transition-colors">
                  <IconComp className="size-4 sm:size-5 stroke-[1.5]" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-[11px] sm:text-sm font-bold text-zinc-800 group-hover:text-primary transition-colors leading-tight truncate sm:whitespace-normal">
                    {prop.title}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-zinc-500 line-clamp-1 leading-normal sm:line-clamp-2">
                    {prop.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
