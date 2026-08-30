import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function FinalCta() {
  return (
    <section className="shell">
      <div className="relative overflow-hidden rounded-2xl bg-ink text-white p-8 sm:p-12 md:p-16 text-center shadow-pop">
        {/* Glow effect */}
        <div className="absolute -left-20 -top-20 size-60 rounded-full bg-violet/30 blur-3xl pointer-events-none" />
        <div className="absolute -right-20 -bottom-20 size-60 rounded-full bg-marigold/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <h2 className="font-display text-3xl font-extrabold sm:text-4xl md:text-5xl text-white">
            Ready to Print?
          </h2>

          <p className="text-xs text-white/80 sm:text-sm md:text-base leading-relaxed">
            Browse our catalog of products or tell us what you need for a tailored quotation.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-xl bg-violet px-6 py-3.5 text-xs sm:text-sm font-bold text-white shadow-lift hover:bg-violet-lift transition-all"
            >
              <span>Explore Products</span>
              <ArrowRight className="size-4" />
            </Link>

            <Link
              href="/bulk-quote"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 text-xs sm:text-sm font-semibold text-white hover:bg-white/20 transition-all"
            >
              <span>Get a Quote</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
