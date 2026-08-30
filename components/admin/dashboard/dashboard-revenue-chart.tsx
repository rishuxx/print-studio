"use client";

import * as React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { RevenueTrendPoint } from "@/lib/admin/dashboard/types";
import { formatPaiseToInr } from "@/lib/admin/dashboard/formatters";
import { IndianRupee } from "lucide-react";

interface DashboardRevenueChartProps {
  data: RevenueTrendPoint[];
}

export function DashboardRevenueChart({ data }: DashboardRevenueChartProps) {
  // Convert paise to rupees for chart coordinate scaling
  const chartData = React.useMemo(() => {
    return data.map((d) => ({
      ...d,
      revenueRupees: Math.round(d.revenuePaise / 100),
    }));
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <div className="flex h-72 w-full flex-col items-center justify-center rounded-2xl border border-border/80 bg-white p-6 text-center">
        <div className="flex size-10 items-center justify-center rounded-xl bg-paper text-muted-foreground mb-2">
          <IndianRupee className="size-5" />
        </div>
        <p className="text-sm font-bold text-ink">No revenue activity recorded</p>
        <p className="text-xs text-muted-foreground mt-1 max-w-xs">
          Paid customer orders within the selected time period will appear on this financial chart.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border/80 bg-white p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-base font-bold text-ink">Revenue Trend</h3>
          <p className="text-xs text-muted-foreground">Paid order gross volume over period</p>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg">
          <IndianRupee className="size-3" />
          <span>INR Gross</span>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4a1e9e" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#4a1e9e" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={{ stroke: "#e2e8f0" }}
              tick={{ fontSize: 11, fill: "#64748b" }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "#64748b" }}
              tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const p = payload[0].payload as RevenueTrendPoint;
                  return (
                    <div className="rounded-xl border border-border bg-white p-3 shadow-lg text-xs space-y-1">
                      <div className="font-bold text-ink">{p.label}</div>
                      <div className="text-violet font-semibold font-mono">
                        Revenue: {formatPaiseToInr(p.revenuePaise)}
                      </div>
                      <div className="text-muted-foreground text-[0.6875rem]">
                        Orders: {p.orderCount}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="revenueRupees"
              stroke="#4a1e9e"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#revenueGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
