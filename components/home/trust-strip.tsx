import * as React from "react";
import { Printer, Briefcase, Gift, Boxes } from "lucide-react";

export function TrustStrip() {
  const propositions = [
    {
      icon: Printer,
      title: "Custom Printing",
      description: "Print designs made for your exact needs",
      colorClass: "bg-blue-50 text-blue-600 border border-blue-100",
    },
    {
      icon: Briefcase,
      title: "Business Printing",
      description: "Materials for everyday business branding",
      colorClass: "bg-indigo-50 text-indigo-600 border border-indigo-100",
    },
    {
      icon: Gift,
      title: "Personalised Products",
      description: "Turn your photos and ideas into products",
      colorClass: "bg-rose-50 text-rose-600 border border-rose-100",
    },
    {
      icon: Boxes,
      title: "Bulk Orders",
      description: "Printing support for larger requirements",
      colorClass: "bg-amber-50 text-amber-600 border border-amber-100",
    },
  ];

  return (
    <section className="border-b border-border bg-white py-8">
      <div className="shell">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {propositions.map((prop, idx) => {
            const IconComp = prop.icon;
            return (
              <div key={idx} className="flex items-center gap-3.5">
                <div className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${prop.colorClass}`}>
                  <IconComp className="size-5 stroke-[1.75]" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-ink sm:text-sm">{prop.title}</h3>
                  <p className="text-xs text-muted-foreground">{prop.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
