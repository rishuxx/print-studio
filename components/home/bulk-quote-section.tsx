import * as React from "react";
import Link from "next/link";
import { ArrowRight, Boxes, CheckCircle2 } from "lucide-react";

export function BulkQuoteSection() {
  return (
    <section className="shell">
      <div className="rounded-2xl border border-border bg-white p-6 sm:p-8 md:p-12 shadow-sm">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-1.5 rounded-md bg-violet/10 px-2.5 py-1 font-mono text-xs font-bold text-violet">
              <Boxes className="size-3.5" />
              <span>Bulk & Corporate Printing</span>
            </div>

            <h3 className="font-display text-2xl font-bold text-ink sm:text-3xl">
              Printing for your business or event?
            </h3>

            <p className="text-xs text-muted-foreground sm:text-sm leading-relaxed max-w-xl">
              Tell us what you need and we can help with larger printing requirements, custom specs, and volume-based pricing.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/bulk-quote"
                className="inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-3 text-xs font-bold text-white hover:bg-ink-soft transition-all"
              >
                <span>Request a Bulk Quote</span>
                <ArrowRight className="size-3.5" />
              </Link>
              <Link
                href="/sample-kit"
                className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-3 text-xs font-semibold text-ink hover:bg-muted transition-all"
              >
                <span>Paper Sample Kit</span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-4 rounded-xl border border-border/80 bg-paper p-5 text-xs space-y-3">
            <div className="font-bold text-ink">What we provide for bulk orders:</div>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
                <span>Tiered pricing for larger quantities</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
                <span>GST-compliant business billing</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
                <span>Proof check before production</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
                <span>Support for custom dimensions & materials</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
