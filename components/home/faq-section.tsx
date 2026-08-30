import * as React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export function FaqSection() {
  const faqs = [
    {
      q: "What printing products do you offer?",
      a: "We offer visiting cards, custom apparel, personalised photo gifts, business stationery, rubber stamps, stickers, packaging boxes, and display signage.",
    },
    {
      q: "Can I customize a product?",
      a: "Yes. Most products allow you to select dimensions, paper stock, thickness, surface finishes (matte, gloss, velvet, spot UV, foil), and custom quantities.",
    },
    {
      q: "Can I provide my own design?",
      a: "Yes. You can upload print-ready files in PDF, AI, EPS, PSD, or high-resolution PNG/TIFF formats with CMYK color settings.",
    },
    {
      q: "Can you help with artwork?",
      a: "Yes. We offer design assistance to verify bleed margins, adjust sizing, or prepare artwork from your brief before output.",
    },
    {
      q: "Do you accept bulk orders?",
      a: "Yes. We offer volume-based pricing for businesses, events, and bulk requirements. You can submit a quotation request directly on our website.",
    },
    {
      q: "How can I request a quote?",
      a: "Simply click 'Request a Quote', specify your desired product, estimated quantity, and any special specifications, and our team will get back to you.",
    },
  ];

  return (
    <section className="shell">
      <div className="text-center max-w-xl mx-auto space-y-2 border-b border-border pb-4">
        <div className="font-mono text-xs font-bold uppercase tracking-wider text-violet">
          Help & FAQs
        </div>
        <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
          Frequently Asked Questions
        </h2>
      </div>

      <div className="mt-8 max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, idx) => (
            <AccordionItem key={idx} value={`faq-${idx}`}>
              <AccordionTrigger>{faq.q}</AccordionTrigger>
              <AccordionContent>{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
