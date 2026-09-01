import * as React from "react";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms and conditions for placing print orders.",
};

export default function TermsPage() {
  return (
    <div className="shell py-8 space-y-6 max-w-3xl mx-auto text-xs leading-relaxed">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Terms of Service" },
        ]}
      />

      <h1 className="font-display text-3xl font-extrabold text-ink sm:text-4xl">
        Terms of Service
      </h1>

      <div className="space-y-4 text-muted-foreground">
        <p>
          By placing an order with PreetyPrints, you agree that you possess the necessary rights and copyright permissions for all artwork and images submitted for reproduction.
        </p>
        <p>
          Print production initiates upon digital proof approval and order confirmation. Because custom printed goods are produced to custom specifications, changes or cancellations must be requested prior to press scheduling.
        </p>
      </div>
    </div>
  );
}
