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
    <section className="border-b border-zinc-200/80 bg-white py-8">
      <div className="shell">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {propositions.map((prop, idx) => {
            const IconComp = prop.icon;
            return (
              <div
                key={idx}
                className="group flex items-center gap-3.5 rounded-2xl border border-zinc-100 bg-zinc-50/50 p-4 transition-all duration-200 hover:border-primary/30 hover:bg-white hover:shadow-xs"
              >
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white border border-zinc-200/80 text-zinc-400 group-hover:text-primary group-hover:border-primary/30 transition-colors">
                  <IconComp className="size-5 stroke-[1.5]" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-zinc-800 sm:text-sm group-hover:text-primary transition-colors">
                    {prop.title}
                  </h3>
                  <p className="text-xs text-zinc-500">{prop.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
