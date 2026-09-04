import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="rounded-2xl border border-dashed border-border bg-white p-8 sm:p-12 max-w-md w-full shadow-sm space-y-4">
        <span className="font-mono text-4xl font-extrabold text-violet">404</span>
        <h1 className="font-display text-xl font-bold text-ink sm:text-2xl">
          Page Not Found
        </h1>
        <p className="text-xs text-muted-foreground sm:text-sm">
          The page or product you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-violet px-5 py-2.5 text-xs font-bold text-white shadow-lift hover:bg-violet-lift transition-all"
          >
            <ArrowLeft className="size-3.5" />
            <span>Return to Home</span>
          </Link>
          <Link
            href="/products"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-white px-5 py-2.5 text-xs font-bold text-ink hover:bg-paper transition-all"
          >
            <Search className="size-3.5" />
            <span>Browse Products</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
