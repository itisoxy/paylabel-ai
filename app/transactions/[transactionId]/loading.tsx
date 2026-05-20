export default function Loading() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="h-[640px] animate-pulse rounded-3xl border border-slate-200 bg-slate-100" />
      <div className="space-y-6">
        <div className="h-48 animate-pulse rounded-3xl border border-slate-200 bg-slate-100" />
        <div className="h-48 animate-pulse rounded-3xl border border-slate-200 bg-slate-100" />
      </div>
    </div>
  )
}
