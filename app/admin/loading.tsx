export default function AdminDashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Welcome Banner Skeleton */}
      <div className="rounded-3xl border border-border bg-paper/40 p-6 sm:p-8 space-y-3">
        <div className="h-4 w-48 bg-paper rounded" />
        <div className="h-8 w-80 bg-paper/80 rounded-xl" />
        <div className="h-4 w-96 bg-paper/50 rounded" />
      </div>

      {/* Date Preset Filter Bar Skeleton */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-white p-3 shadow-xs">
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-8 w-20 bg-paper/60 rounded-xl" />
          ))}
        </div>
        <div className="h-8 w-24 bg-paper/60 rounded-xl" />
      </div>

      {/* 5 KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="rounded-2xl border border-border bg-white p-4 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="h-3 w-20 bg-paper rounded" />
              <div className="size-7 bg-paper/80 rounded-xl" />
            </div>
            <div className="h-7 w-24 bg-paper rounded-lg" />
            <div className="h-3 w-16 bg-paper/50 rounded" />
          </div>
        ))}
      </div>

      {/* Operational Attention Grid */}
      <div className="rounded-2xl border border-border bg-white p-6 space-y-4 shadow-xs">
        <div className="h-5 w-56 bg-paper rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 rounded-xl border border-border bg-paper/30 p-4 space-y-2">
              <div className="h-4 w-32 bg-paper rounded" />
              <div className="h-3 w-full bg-paper/50 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
