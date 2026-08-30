export default function AdminSettingsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-paper rounded-xl" />
          <div className="h-4 w-96 bg-paper/60 rounded-lg" />
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-white p-6 shadow-sm space-y-6">
        <div className="h-8 w-48 bg-paper rounded-xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-paper/40 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
