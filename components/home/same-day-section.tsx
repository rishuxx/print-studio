import * as React from "react";
import Link from "next/link";
import { ArrowRight, Clock, Zap } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

export function SameDaySection() {
  const isSameDay = siteConfig.operations.sameDayAvailable;

  return (
    <section className="shell">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-ink via-ink-soft to-violet p-6 sm:p-8 md:p-10 text-white shadow-lift">
        <div className="relative z-10 max-w-2xl space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-1.5 rounded-md bg-marigold px-2.5 py-1 font-mono text-xs font-bold uppercase text-ink">
            <Zap className="size-3.5 fill-ink" />
            <span>{isSameDay ? "Fast Turnaround" : "Urgent Orders"}</span>
          </div>

          <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-extrabold text-white">
            {isSameDay ? "Need printing quickly?" : "Have an urgent printing requirement?"}
          </h3>

          <p className="text-xs text-white/80 sm:text-sm leading-relaxed">
            {isSameDay
              ? siteConfig.operations.sameDayMessage
              : "Contact us to check turnaround times and production capacity for time-sensitive print jobs."}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/same-day"
              className="inline-flex items-center gap-2 rounded-xl bg-marigold px-5 py-2.5 text-xs font-bold text-ink hover:brightness-105 transition-all"
            >
              <span>Check Availability</span>
              <ArrowRight className="size-3.5" />
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-2.5 text-xs font-semibold text-white hover:bg-white/20 transition-all"
            >
              <Clock className="size-3.5" />
              <span>Contact Support</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
