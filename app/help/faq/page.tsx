import * as React from "react";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { FaqSection } from "@/components/home/faq-section";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Answers to common printing, file setup, payment, and delivery questions.",
};

export default function FaqPage() {
  return (
    <div className="shell py-8 space-y-8 max-w-3xl mx-auto">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "FAQs" },
        ]}
      />

      <FaqSection />
    </div>
  );
}
