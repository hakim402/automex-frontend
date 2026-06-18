/**
 * ProfileSkeleton.tsx — Loading skeleton for the profile page
 * Shown while AuthContext is hydrating on first load.
 */
"use client";

import { cn } from "@/lib/utils";

function Bone({ className }: { className?: string }) {
  return (
    <div className={cn(
      "rounded-xl bg-muted/60 animate-pulse",
      className,
    )} />
  );
}

export function ProfileSkeleton() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      {/* Header skeleton */}
      <Bone className="h-8 w-48" />

      {/* Profile header card */}
      <div className="rounded-2xl border border-border/60 bg-card/80 p-6 sm:p-8 flex gap-6">
        <Bone className="size-20 rounded-2xl shrink-0" />
        <div className="flex-1 space-y-3 py-1">
          <Bone className="h-6 w-48" />
          <Bone className="h-4 w-64" />
          <div className="flex gap-3">
            <Bone className="h-4 w-28" />
            <Bone className="h-4 w-36" />
          </div>
        </div>
      </div>

      {/* Form card */}
      <div className="rounded-2xl border border-border/60 bg-card/80 p-6 space-y-5">
        <div className="flex gap-4 pb-4 border-b border-border/40">
          <Bone className="size-9 rounded-xl shrink-0" />
          <div className="space-y-2 flex-1">
            <Bone className="h-4 w-40" />
            <Bone className="h-3 w-64" />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-1.5">
              <Bone className="h-3 w-24" />
              <Bone className="h-10 w-full rounded-lg" />
            </div>
          ))}
        </div>
      </div>

      {/* Account info card */}
      <div className="rounded-2xl border border-border/60 bg-card/80 p-6 space-y-4">
        <div className="flex gap-4 pb-4 border-b border-border/40">
          <Bone className="size-9 rounded-xl shrink-0" />
          <div className="space-y-2 flex-1">
            <Bone className="h-4 w-36" />
            <Bone className="h-3 w-52" />
          </div>
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex justify-between py-2 border-b border-border/20">
            <Bone className="h-4 w-28" />
            <Bone className="h-4 w-40" />
          </div>
        ))}
      </div>
    </div>
  );
}