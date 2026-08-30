import * as React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { ProductMockup } from "@/components/shared/product-mockup";

export function HomeHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-ink via-ink to-ink-soft text-white py-14 sm:py-16 md:py-20">
      {/* Decorative grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="shell relative z-10">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Heading & Value Proposition */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-tint/30 bg-violet/20 px-3.5 py-1 text-xs font-semibold text-violet-tint backdrop-blur-sm mx-auto lg:mx-0">
              <Sparkles className="size-3.5 text-marigold" />
              <span>Custom Printing & Personalised Products</span>
            </div>

            <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl leading-[1.1] text-balance">
              Print Anything. <br />
              <span className="bg-gradient-to-r from-violet-tint via-white to-marigold bg-clip-text text-transparent">
                Make It Yours.
              </span>
            </h1>

            <p className="max-w-xl text-sm leading-relaxed text-white/80 sm:text-base md:text-lg mx-auto lg:mx-0 text-balance">
              Custom printing for businesses, events, celebrations and everyday needs. High-quality production with easy customization.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-1">
              <Link
                href="/category/visiting-cards"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet px-6 py-3.5 text-sm font-bold text-white shadow-lift transition-all hover:bg-violet-lift hover:shadow-pop"
              >
                <span>Explore Products</span>
                <ArrowRight className="size-4" />
              </Link>

              <Link
                href="/bulk-quote"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
              >
                <span>Get a Quote</span>
              </Link>
            </div>

            {/* Neutral Guarantees */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-6 border-t border-white/10 text-[0.6875rem] sm:text-xs text-white/70">
              <div className="flex items-center justify-center lg:justify-start gap-1.5 sm:gap-2">
                <CheckCircle2 className="size-3.5 sm:size-4 text-marigold shrink-0" />
                <span>Custom Sizes & Stocks</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-1.5 sm:gap-2">
                <CheckCircle2 className="size-3.5 sm:size-4 text-violet-tint shrink-0" />
                <span>Single & Bulk Runs</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-1.5 sm:gap-2">
                <CheckCircle2 className="size-3.5 sm:size-4 text-marigold shrink-0" />
                <span>Digital & Offset Quality</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Product Showcase Grid */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl border border-white/15 bg-white/5 p-4 sm:p-6 backdrop-blur-md shadow-pop">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-violet-tint">
                  Popular Print Types
                </span>
                <span className="font-mono text-[0.6875rem] text-white/60">160+ Products</span>
              </div>

              {/* 2x2 Clean Visual Mockup Showcase */}
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/category/visiting-cards"
                  className="group rounded-xl border border-white/10 bg-white/5 p-3 text-center transition-all hover:border-violet-tint hover:bg-white/10"
                >
                  <div className="mx-auto flex h-24 items-center justify-center">
                    <ProductMockup kind="card-stack" tone="transparent" className="h-20 w-auto" />
                  </div>
                  <div className="mt-2 font-bold text-xs text-white group-hover:text-violet-tint transition-colors">
                    Visiting Cards
                  </div>
                  <div className="text-[0.6875rem] text-white/60">Standard & Luxury</div>
                </Link>

                <Link
                  href="/category/apparel"
                  className="group rounded-xl border border-white/10 bg-white/5 p-3 text-center transition-all hover:border-violet-tint hover:bg-white/10"
                >
                  <div className="mx-auto flex h-24 items-center justify-center">
                    <ProductMockup kind="tshirt" tone="transparent" className="h-20 w-auto" />
                  </div>
                  <div className="mt-2 font-bold text-xs text-white group-hover:text-violet-tint transition-colors">
                    Custom Apparel
                  </div>
                  <div className="text-[0.6875rem] text-white/60">T-Shirts & Polos</div>
                </Link>

                <Link
                  href="/category/personalised-gifts"
                  className="group rounded-xl border border-white/10 bg-white/5 p-3 text-center transition-all hover:border-violet-tint hover:bg-white/10"
                >
                  <div className="mx-auto flex h-24 items-center justify-center">
                    <ProductMockup kind="mug" tone="transparent" className="h-20 w-auto" />
                  </div>
                  <div className="mt-2 font-bold text-xs text-white group-hover:text-violet-tint transition-colors">
                    Personalised Gifts
                  </div>
                  <div className="text-[0.6875rem] text-white/60">Mugs & Frames</div>
                </Link>

                <Link
                  href="/category/labels-packaging"
                  className="group rounded-xl border border-white/10 bg-white/5 p-3 text-center transition-all hover:border-violet-tint hover:bg-white/10"
                >
                  <div className="mx-auto flex h-24 items-center justify-center">
                    <ProductMockup kind="box" tone="transparent" className="h-20 w-auto" />
                  </div>
                  <div className="mt-2 font-bold text-xs text-white group-hover:text-violet-tint transition-colors">
                    Packaging
                  </div>
                  <div className="text-[0.6875rem] text-white/60">Boxes & Stickers</div>
                </Link>
              </div>

              <div className="mt-4 rounded-xl border border-violet/30 bg-violet/10 p-2.5 text-center text-xs text-white/80">
                <span>Looking for bespoke requirements? </span>
                <Link href="/bulk-quote" className="font-semibold text-marigold hover:underline">
                  Request a Quote &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
