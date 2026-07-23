"use client";

// app/[locale]/(routes)/error.tsx
// Shared error boundary for all content pages. Shows error message with retry button.

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";

export default function RoutesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[RoutesError]", error);
  }, [error]);

  return (
    <div className="relative overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 right-0 size-[450px] rounded-full bg-[#0ab8fb]/3 blur-3xl" />
        <div className="absolute top-1/3 -left-32 size-[350px] rounded-full bg-[#324b9d]/3 blur-3xl" />
      </div>

      <div className="mx-auto max-w-2xl px-4 py-24 sm:py-32 text-center">
        <div className="flex justify-center mb-6">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20">
            <AlertTriangle className="size-8 text-red-400" aria-hidden="true" />
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
          Something went wrong
        </h1>

        <p className="text-[14px] text-muted-foreground mb-8 leading-relaxed max-w-md mx-auto">
          An unexpected error occurred while loading this page. Please try again, or return to the homepage.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <Button onClick={reset} size="lg" className="bg-brand-gradient shadow-brand">
            <RefreshCcw className="size-4 mr-2" aria-hidden="true" />
            Try Again
          </Button>
          <Button asChild variant="outline" size="lg" className="border-brand-gradient">
            <Link href="/">
              <Home className="size-4 mr-2" aria-hidden="true" />
              Go Home
            </Link>
          </Button>
        </div>

        {process.env.NODE_ENV === "development" && (
          <details className="mt-10 text-left">
            <summary className="text-[12px] text-muted-foreground cursor-pointer hover:text-foreground">
              Error details (dev only)
            </summary>
            <pre className="mt-2 rounded-xl border border-red-500/10 bg-red-500/5 p-4 text-[11px] text-red-300 overflow-auto max-h-48">
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
