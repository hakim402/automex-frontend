"use client";

// components/MediaImage.tsx
//
// Plain <img> (no next/image host allow-listing required) that swaps to a
// lucide icon tile if the URL is missing or fails to load, instead of
// rendering nothing / a broken image.

import { useState } from "react";
import { cn } from "@/lib/utils";
import { resolveMediaUrl } from "@/lib/automex/media";
import type { LucideIcon } from "lucide-react";

export function MediaImage({
  src,
  alt,
  fallbackIcon: FallbackIcon,
  className,
  imgClassName,
}: {
  src?: string | null;
  alt: string;
  fallbackIcon: LucideIcon;
  className?: string;
  imgClassName?: string;
}) {
  const resolved = resolveMediaUrl(src);
  const [errored, setErrored] = useState(false);

  if (!resolved || errored) {
    return (
      <div
        className={cn(
          "flex size-full items-center justify-center bg-linear-to-br from-primary/10 via-primary/5 to-transparent",
          className,
        )}
      >
        <div className="flex size-14 items-center justify-center rounded-2xl bg-brand-gradient/10">
          <FallbackIcon className="size-7 text-primary/50" aria-hidden="true" />
        </div>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={resolved}
      alt={alt}
      loading="lazy"
      onError={() => setErrored(true)}
      className={cn("size-full object-cover", imgClassName)}
    />
  );
}