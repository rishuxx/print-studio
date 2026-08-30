import * as React from "react";

export function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Choose a product",
      description: "Browse 160+ print items across cards, apparel, packaging, gifts and marketing stationery.",
    },
    {
      num: "02",
      title: "Customize requirements",
      description: "Select size, paper stock, thickness, surface finish, quantity and packaging preferences.",
    },
    {
      num: "03",
      title: "Upload or request artwork",
      description: "Submit print-ready files (PDF, AI, PNG) or request free formatting and design support.",
    },
    {
      num: "04",
      title: "Confirm your order",
      description: "Review production details, approve digital proof, and select pickup or delivery.",
    },
  ];

  return (
    <section className="border-y border-border bg-paper py-14 sm:py-16">
      <div className="shell">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="font-mono text-xs font-bold uppercase tracking-wider text-violet">
            Process
          </div>
          <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
            How It Works
          </h2>
          <p className="text-xs text-muted-foreground sm:text-sm">
            Simple 4-step workflow from initial idea to completed print.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div
              key={step.num}
              className="flex flex-col rounded-2xl border border-border bg-white p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex size-12 items-center justify-center rounded-xl bg-violet/10 font-mono text-lg font-bold text-violet">
                {step.num}
              </div>
              <h3 className="mt-4 font-bold text-sm text-ink">{step.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
