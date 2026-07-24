"use client";

// app/[locale]/dashboard/_components/DashboardSkeleton.tsx

import { cn } from "@/lib/utils";

// ─── Skeleton primitive ─────────────────────────────────────────────────────

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-muted-foreground/10",
        className
      )}
    />
  );
}

// ─── Stats skeleton ─────────────────────────────────────────────────────────

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-border/50 bg-card/70 p-5"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-20" />
              <Skeleton className="h-8 w-12" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="size-11 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Quick actions skeleton ─────────────────────────────────────────────────

function QuickActionsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-border/50 bg-card/70 p-5"
        >
          <Skeleton className="size-10 rounded-xl mb-3" />
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-3 w-full" />
        </div>
      ))}
    </div>
  );
}

// ─── Recent activity skeleton ───────────────────────────────────────────────

function RecentActivitySkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 rounded-xl border border-border/50 bg-card/70 p-3"
        >
          <Skeleton className="size-8 rounded-lg" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-3 w-40" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main export ────────────────────────────────────────────────────────────

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Stats section */}
      <section>
        <Skeleton className="h-5 w-32 mb-4" />
        <StatsSkeleton />
      </section>

      {/* Quick actions section */}
      <section>
        <Skeleton className="h-5 w-40 mb-4" />
        <QuickActionsSkeleton />
      </section>

      {/* Recent activity section */}
      <section>
        <Skeleton className="h-5 w-36 mb-4" />
        <RecentActivitySkeleton />
      </section>
    </div>
  );
}
