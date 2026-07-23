"use client";

import { useEffect, useRef, useState } from "react";
import { Building2 } from "lucide-react";
import { getMediaUrl } from "@/lib/env";
import { cn } from "@/lib/utils";
import type { Partner } from "@/lib/automex/types";

interface PartnersLogoGridProps {
  partners: Partner[];
  /** Optional section title above the grid. Defaults to nothing. */
  title?: string;
  /** Limit the number of logos shown. Defaults to all. */
  maxLogos?: number;
  /** Additional class names for the outer container. */
  className?: string;
  /** Pixels per second scroll speed. Default 40. */
  speed?: number;
}

/** Convert a dash/slug to Title Case for fallback display. */
function titleCase(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/**
 * PartnersLogoGrid — A smooth infinite-scrolling logo carousel.
 *
 * Use this on home and about pages to display partner logos in a "Trusted by"
 * section. Renders only logos (no names/descriptions) for minimal DOM weight.
 * Uses CSS animation with dynamic duration for a consistent scroll speed
 * regardless of logo count. Pauses on hover.
 */
export function PartnersLogoGrid({
  partners,
  title,
  maxLogos,
  className,
  speed = 40,
}: PartnersLogoGridProps) {
  const visible = maxLogos ? partners.slice(0, maxLogos) : partners;
  const trackRef = useRef<HTMLDivElement>(null);
  const [duration, setDuration] = useState(20);

  // On mount, measure the inner track to compute a consistent scroll speed.
  useEffect(() => {
    if (!trackRef.current) return;
    const singleSetWidth = trackRef.current.scrollWidth / 2;
    if (singleSetWidth <= 0) return;
    const seconds = singleSetWidth / speed;
    setDuration(Math.max(seconds, 8)); // floor at 8s so very short sets don't flicker
  }, [visible, speed]);

  if (visible.length === 0) return null;

  // Two copies per child × two children = four total — exactly 2× the set.
  // translateX(-50%) moves by one full set, creating a seamless infinite loop.
  const logos = [...visible, ...visible];

  return (
    <section className={cn("w-full overflow-hidden py-12", className)}>
      {title && (
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-center text-[13px] font-semibold uppercase tracking-widest text-muted-foreground mb-6">
            {title}
          </h2>
        </div>
      )}

      <div className="relative group">
        {/* Left fade */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute start-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-r from-background to-transparent"
        />
        {/* Right fade */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute end-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-l from-background to-transparent"
        />

        <div className="overflow-hidden flex justify-center">
          <div
            ref={trackRef}
            className="partners-scroll-track flex w-max shrink-0"
            style={{
              animation: `scroll-partners ${duration}s linear infinite`,
            }}
          >
            {/* First set */}
            <div className="flex items-center gap-8 py-4 shrink-0">
              {logos.map((partner, i) => {
                const displayName = partner.name || titleCase(partner.slug);
                const image = partner.logo?.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={getMediaUrl(partner.logo.url)}
                    alt={partner.logo.alt_text || displayName}
                    className="h-10 w-auto max-w-[120px] object-contain opacity-60 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0 hover:scale-110"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex size-10 items-center justify-center rounded-lg bg-muted/30">
                    <Building2 className="size-5 text-primary/30" aria-hidden="true" />
                  </div>
                );

                return partner.website_url ? (
                  <a
                    key={`${partner.id}-${i}`}
                    href={partner.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0"
                    title={displayName}
                    aria-label={displayName}
                  >
                    {image}
                  </a>
                ) : (
                  <span
                    key={`${partner.id}-${i}`}
                    className="shrink-0"
                    title={displayName}
                  >
                    {image}
                  </span>
                );
              })}
            </div>

            {/* Duplicate — identical content for seamless infinite loop */}
            <div className="flex items-center gap-8 py-4 shrink-0" aria-hidden="true">
              {logos.map((partner, i) => {
                const displayName = partner.name || titleCase(partner.slug);
                const image = partner.logo?.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={getMediaUrl(partner.logo.url)}
                    alt=""
                    className="h-10 w-auto max-w-[120px] object-contain opacity-60 grayscale"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex size-10 items-center justify-center rounded-lg bg-muted/30">
                    <Building2 className="size-5 text-primary/30" aria-hidden="true" />
                  </div>
                );

                return partner.website_url ? (
                  <a
                    key={`dup-${partner.id}-${i}`}
                    href={partner.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0"
                    tabIndex={-1}
                    aria-hidden="true"
                  >
                    {image}
                  </a>
                ) : (
                  <span key={`dup-${partner.id}-${i}`} className="shrink-0" aria-hidden="true">
                    {image}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Injected keyframes — one-time cost, not scoped so Tailwind can reference it */}
      <style>{`
        @keyframes scroll-partners {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .partners-scroll-track:hover {
          animation-play-state: paused !important;
        }
      `}</style>
    </section>
  );
}
