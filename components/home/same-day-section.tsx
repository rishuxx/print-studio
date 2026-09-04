import * as React from "react";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

export function SameDaySection() {
  const isSameDay = siteConfig.operations.sameDayAvailable;

  return (
    <section className="shell">
      <div className="relative overflow-hidden rounded-3xl border border-zinc-200/80 bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 p-6 sm:p-8 md:p-10 text-white shadow-sheet">
        <div className="relative z-10 max-w-2xl space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/20 border border-primary/40 px-3 py-1 font-mono text-xs font-bold uppercase text-red-200">
            <Clock className="size-3.5 stroke-[1.75] text-red-400" />
            <span>{isSameDay ? "Fast Turnaround" : "Urgent Orders"}</span>
          </div>

          <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-extrabold text-white">
            {isSameDay ? "Need printing quickly?" : "Have an urgent printing requirement?"}
          </h3>

          <p className="text-xs text-zinc-300 sm:text-sm leading-relaxed">
            {isSameDay
              ? siteConfig.operations.sameDayMessage
              : "Contact us to check turnaround times and production capacity for time-sensitive print jobs."}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/same-day"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-xs font-bold text-white hover:bg-primary/90 transition-all shadow-sheet"
            >
              <span>Check Availability</span>
              <ArrowRight className="size-3.5 stroke-[2]" />
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-800/80 px-6 py-2.5 text-xs font-semibold text-zinc-200 hover:bg-zinc-700 transition-all"
            >
              <Clock className="size-3.5 stroke-[1.75]" />
              <span>Contact Support</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
