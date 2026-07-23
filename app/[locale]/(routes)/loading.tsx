// app/[locale]/(routes)/loading.tsx
// Shared loading skeleton for all content pages (services, blog, case-studies, portfolio, etc.)

export default function RoutesLoading() {
  return (
    <div className="relative overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 right-0 size-[450px] rounded-full bg-[#0ab8fb]/3 blur-3xl" />
        <div className="absolute top-1/3 -left-32 size-[350px] rounded-full bg-[#324b9d]/3 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:py-24">
        {/* Hero skeleton */}
        <div className="flex flex-col items-center mb-12 animate-pulse">
          <div className="h-6 w-32 rounded-full bg-muted/50 mb-4" />
          <div className="h-10 w-64 rounded-lg bg-muted/40 mb-4" />
          <div className="h-4 w-96 max-w-full rounded bg-muted/30" />
        </div>

        {/* Filter pills skeleton */}
        <div className="flex justify-center gap-2 mb-10 animate-pulse">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-8 w-20 rounded-full bg-muted/40" />
          ))}
        </div>

        {/* Card grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-pulse">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border/60 bg-card/80 overflow-hidden"
            >
              <div className="h-44 w-full bg-muted/30" />
              <div className="p-5 space-y-3">
                <div className="h-3 w-24 rounded bg-muted/40" />
                <div className="h-5 w-full rounded bg-muted/30" />
                <div className="h-4 w-full rounded bg-muted/20" />
                <div className="h-4 w-2/3 rounded bg-muted/20" />
                <div className="h-3 w-32 rounded bg-muted/30 mt-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
