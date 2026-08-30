import * as React from "react";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How we protect and handle your personal and order data.",
};

export default function PrivacyPage() {
  return (
    <div className="shell py-8 space-y-6 max-w-3xl mx-auto text-xs leading-relaxed">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Privacy Policy" },
        ]}
      />

      <h1 className="font-display text-3xl font-extrabold text-ink sm:text-4xl">
        Privacy Policy
      </h1>

      <div className="space-y-4 text-muted-foreground">
        <p>
          We respect your privacy and process submitted files strictly for production, quality assurance, proofing, and fulfilment purposes.
        </p>
        <p>
          Customer contact information and address data are used exclusively for order tracking, quotation responses, and delivery communication.
        </p>
      </div>
    </div>
  );
}
