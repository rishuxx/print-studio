"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Calendar, RefreshCw } from "lucide-react";
import { DateRangePreset, ParsedDateRange } from "@/lib/admin/dashboard/types";
import { cn } from "@/lib/utils";

interface DashboardFiltersProps {
  currentRange: ParsedDateRange;
  isPending?: boolean;
}

const PRESETS: Array<{ id: DateRangePreset; label: string }> = [
  { id: "today", label: "Today" },
  { id: "yesterday", label: "Yesterday" },
  { id: "7d", label: "Last 7 Days" },
  { id: "30d", label: "Last 30 Days" },
  { id: "this_month", label: "This Month" },
  { id: "last_month", label: "Last Month" },
  { id: "this_year", label: "This Year" },
  { id: "all_time", label: "All Time" },
];

export function DashboardFilters({ currentRange }: DashboardFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [customOpen, setCustomOpen] = React.useState(currentRange.preset === "custom");
  const [fromInput, setFromInput] = React.useState(currentRange.fromParam || "");
  const [toInput, setToInput] = React.useState(currentRange.toParam || "");

  const handlePresetSelect = (preset: DateRangePreset) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("range", preset);
    params.delete("from");
    params.delete("to");
    setCustomOpen(false);
    router.push(`/admin?${params.toString()}`);
  };

  const handleCustomApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromInput || !toInput) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("range", "custom");
    params.set("from", fromInput);
    params.set("to", toInput);
    router.push(`/admin?${params.toString()}`);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-2xl border border-border/80 bg-white p-4 shadow-xs">
      {/* Left: Range Info & Presets */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 rounded-xl bg-paper px-3 py-2 text-xs font-semibold text-ink border border-border/60 mr-1">
          <Calendar className="size-3.5 text-violet" />
          <span>{currentRange.label}</span>
          <span className="text-[0.625rem] text-muted-foreground font-mono">
            ({currentRange.comparisonLabel})
          </span>
        </div>

        {/* Quick Range Buttons */}
        <div className="flex flex-wrap items-center gap-1">
          {PRESETS.map((p) => {
            const active = currentRange.preset === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handlePresetSelect(p.id)}
                className={cn(
                  "rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors",
                  active
                    ? "bg-violet text-white font-bold shadow-xs"
                    : "text-muted-foreground hover:bg-paper hover:text-ink"
                )}
              >
                {p.label}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => setCustomOpen(!customOpen)}
            className={cn(
              "rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors",
              currentRange.preset === "custom" || customOpen
                ? "bg-violet text-white font-bold"
                : "text-muted-foreground hover:bg-paper hover:text-ink"
            )}
          >
            Custom...
          </button>
        </div>
      </div>

      {/* Right: Refresh Control */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-3.5 py-2 text-xs font-bold text-ink hover:border-violet hover:text-violet transition-all disabled:opacity-50"
          aria-label="Refresh dashboard data from database"
        >
          <RefreshCw className={cn("size-3.5 text-violet", isRefreshing && "animate-spin")} />
          <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
        </button>
      </div>

      {/* Expandable Custom Date Range Selector */}
      {customOpen && (
        <form
          onSubmit={handleCustomApply}
          className="w-full pt-3 mt-2 border-t border-border/60 flex flex-wrap items-center gap-3 text-xs"
        >
          <div className="flex items-center gap-2">
            <label htmlFor="from-date" className="font-semibold text-muted-foreground">
              From:
            </label>
            <input
              id="from-date"
              type="date"
              value={fromInput}
              onChange={(e) => setFromInput(e.target.value)}
              className="rounded-lg border border-border px-2.5 py-1.5 text-xs focus:border-violet focus:outline-none"
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="to-date" className="font-semibold text-muted-foreground">
              To:
            </label>
            <input
              id="to-date"
              type="date"
              value={toInput}
              onChange={(e) => setToInput(e.target.value)}
              className="rounded-lg border border-border px-2.5 py-1.5 text-xs focus:border-violet focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="rounded-lg bg-violet px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-violet-lift"
          >
            Apply Range
          </button>
        </form>
      )}
    </div>
  );
}
