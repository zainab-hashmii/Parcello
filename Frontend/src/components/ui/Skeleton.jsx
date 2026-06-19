export function Skeleton({ className = '' }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-linear-to-r from-orange-100/60 via-orange-50/40 to-orange-100/60 ${className}`}
    />
  )
}

export function ShipmentCardSkeleton() {
  return (
    <div className="rounded-[1.5rem] border border-orange-100/70 bg-white/80 p-5 shadow-sm backdrop-blur-md">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-2xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-28" />
          </div>
        </div>
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <Skeleton className="mt-5 h-2 w-full rounded-full" />
    </div>
  )
}

export function KpiCardSkeleton() {
  return (
    <div className="rounded-[1.5rem] border border-orange-100/70 bg-white/80 p-5 shadow-sm backdrop-blur-md">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="mt-3 h-7 w-16" />
    </div>
  )
}
