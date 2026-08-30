export default function AdminOrdersLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-paper rounded-xl" />
          <div className="h-4 w-96 bg-paper/60 rounded-lg" />
        </div>
        <div className="h-10 w-32 bg-paper rounded-xl" />
      </div>

      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-paper/50 rounded-2xl border border-border p-4 space-y-2">
            <div className="h-4 w-20 bg-paper rounded" />
            <div className="h-7 w-16 bg-paper rounded-lg" />
          </div>
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="rounded-2xl border border-border bg-white p-6 shadow-sm space-y-4">
        <div className="h-10 bg-paper/40 rounded-xl" />
        <div className="space-y-3 pt-2">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="h-14 bg-paper/30 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
