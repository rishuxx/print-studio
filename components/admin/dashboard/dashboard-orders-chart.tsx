"use client";

import * as React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { OrderTrendPoint } from "@/lib/admin/dashboard/types";
import { Package } from "lucide-react";

interface DashboardOrdersChartProps {
  data: OrderTrendPoint[];
}

export function DashboardOrdersChart({ data }: DashboardOrdersChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-72 w-full flex-col items-center justify-center rounded-2xl border border-border/80 bg-white p-6 text-center">
        <div className="flex size-10 items-center justify-center rounded-xl bg-paper text-muted-foreground mb-2">
          <Package className="size-5" />
        </div>
        <p className="text-sm font-bold text-ink">No order volume recorded</p>
        <p className="text-xs text-muted-foreground mt-1 max-w-xs">
          Order transactions within the selected time period will appear on this volume chart.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border/80 bg-white p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-base font-bold text-ink">Order Volume</h3>
          <p className="text-xs text-muted-foreground">Order influx and paid status distribution</p>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-xs font-semibold text-violet bg-violet/10 px-2 py-1 rounded-lg">
          <Package className="size-3" />
          <span>Total Jobs</span>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={{ stroke: "#e2e8f0" }}
              tick={{ fontSize: 11, fill: "#64748b" }}
            />
            <YAxis
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "#64748b" }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const p = payload[0].payload as OrderTrendPoint;
                  return (
                    <div className="rounded-xl border border-border bg-white p-3 shadow-lg text-xs space-y-1">
                      <div className="font-bold text-ink">{p.label}</div>
                      <div className="text-ink font-semibold font-mono">
                        Total Orders: {p.orderCount}
                      </div>
                      <div className="text-emerald-600 text-[0.6875rem] font-medium">
                        Paid / Verified: {p.paidOrderCount}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar
              dataKey="orderCount"
              fill="#e73959"
              radius={[4, 4, 0, 0]}
              maxBarSize={36}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
