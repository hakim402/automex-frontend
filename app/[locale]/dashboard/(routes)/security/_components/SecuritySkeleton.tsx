/**
 * SecuritySkeleton.tsx — Loading skeleton for the security page
 */
"use client";

import { cn } from "@/lib/utils";

function Bone({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-xl bg-muted/60 animate-pulse", className)} />
  );
}

function CardShell({ rows = 3 }: { rows?: number }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/80 p-6 space-y-5">
      <div className="flex gap-4 pb-4 border-b border-border/40">
        <Bone className="size-9 rounded-xl shrink-0" />
        <div className="space-y-2 flex-1">
          <Bone className="h-4 w-44" />
          <Bone className="h-3 w-64" />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {[...Array(rows)].map((_, i) => (
          <Bone key={i} className="h-16 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export function SecuritySkeleton() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      <Bone className="h-8 w-40" />
      <CardShell rows={4} />
      <CardShell rows={2} />
      <div className="rounded-2xl border border-border/60 bg-card/80 p-6 space-y-4">
        <div className="flex gap-4 pb-4 border-b border-border/40">
          <Bone className="size-9 rounded-xl shrink-0" />
          <div className="space-y-2 flex-1">
            <Bone className="h-4 w-36" />
            <Bone className="h-3 w-52" />
          </div>
        </div>
        {[...Array(3)].map((_, i) => (
          <Bone key={i} className="h-20 rounded-xl" />
        ))}
      </div>
      <CardShell rows={2} />
    </div>
  );
}
