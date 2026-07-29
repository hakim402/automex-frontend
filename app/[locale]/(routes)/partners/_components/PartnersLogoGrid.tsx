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
  /** Optional subtitle below the title. */
  subtitle?: string;
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
 * Logos are displayed in full colour (no grayscale).
 */
export function PartnersLogoGrid({
  partners,
  title,
  subtitle,
  maxLogos,
  className,
  speed = 40,
}: PartnersLogoGridProps) {
  const visible = maxLogos ? partners.slice(0, maxLogos) : partners;
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [duration, setDuration] = useState(20);
  const [isVisible, setIsVisible] = useState(false);

  // Responsive speed: slower on mobile
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
  const effectiveSpeed = isMobile ? speed * 0.75 : speed;

  // Measure track width to set consistent scroll duration
  useEffect(() => {
    if (!trackRef.current) return;
    const singleSetWidth = trackRef.current.scrollWidth / 2;
    if (singleSetWidth <= 0) return;
    const seconds = singleSetWidth / effectiveSpeed;
    setDuration(Math.max(seconds, 8));
  }, [visible, effectiveSpeed]);

  // Fade in on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  if (visible.length === 0) return null;

  // Two copies for seamless infinite loop
  const logos = [...visible, ...visible];

  return (
    <section
      ref={containerRef}
      className={cn(
        "w-full overflow-hidden py-12 md:py-16"
      )}
      aria-label="Partner logos"
    >
      <div className="mx-auto max-w-7xl px-4">
        {title && (
          <div className="text-center mb-2">
            <h2 className="text-2xl font-semibold capitalize tracking-widest text-brand-gradient flex items-center justify-center gap-2">
              {title}
            </h2>
          </div>
        )}
      </div>

      <div
        className={cn(
          "relative group transition-opacity duration-700",
          isVisible ? "opacity-100" : "opacity-0",
        )}
      >
        {/* Gradient fades */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-s-0 top-0 bottom-0 w-24 z-10 bg-linear-to-r from-background dark:from-background to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-e-0 top-0 bottom-0 w-24 z-10 bg-linear-to-l from-background dark:from-background to-transparent"
        />

        <div className="overflow-hidden flex justify-center">
          <div
            ref={trackRef}
            className="partners-scroll-track flex w-max shrink-0 will-change-transform"
            style={{
              animation: `scroll-partners ${duration}s linear infinite`,
            }}
          >
            {/* First set */}
            <div className="flex items-center gap-6 md:gap-8 py-4 shrink-0">
              {logos.map((partner, i) => {
                const displayName = partner.name || titleCase(partner.slug);
                const image = partner.logo?.url ? (
                  <img
                    src={getMediaUrl(partner.logo.url)}
                    alt={`${displayName} logo`}
                    className="h-8 md:h-10 w-auto max-w-25 md:max-w-30 object-contain
                               opacity-70 dark:opacity-60
                               transition-all duration-300
                               hover:opacity-100 dark:hover:opacity-100
                               hover:scale-110
                               hover:shadow-md dark:hover:shadow-lg
                               rounded-lg
                               bg-card/30 dark:bg-card/10
                               p-2
                               border border-border/20 dark:border-border/10
                               hover:border-primary/30 dark:hover:border-primary/20"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted/30 dark:bg-muted/20">
                    <Building2
                      className="size-5 text-primary/30 dark:text-primary/20"
                      aria-hidden="true"
                    />
                  </div>
                );

                return partner.website_url ? (
                  <a
                    key={`${partner.id}-${i}`}
                    href={partner.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 focus:outline-none focus:ring-2 focus:ring-primary/60 rounded-lg"
                    title={displayName}
                    aria-label={`${displayName} website`}
                  >
                    {image}
                  </a>
                ) : (
                  <span
                    key={`${partner.id}-${i}`}
                    className="shrink-0 block focus:outline-none focus:ring-2 focus:ring-primary/60 rounded-lg"
                    title={displayName}
                    tabIndex={0}
                    role="link"
                    aria-label={displayName}
                  >
                    {image}
                  </span>
                );
              })}
            </div>

            {/* Duplicate (invisible to screen readers) */}
            <div
              className="flex items-center gap-6 md:gap-8 py-4 shrink-0"
              aria-hidden="true"
            >
              {logos.map((partner, i) => {
                const displayName = partner.name || titleCase(partner.slug);
                const image = partner.logo?.url ? (
                  <img
                    src={getMediaUrl(partner.logo.url)}
                    alt=""
                    className="h-8 md:h-10 w-auto max-w-25 md:max-w-30 object-contain
                               opacity-70 dark:opacity-60
                               transition-all duration-300
                               hover:opacity-100 dark:hover:opacity-100
                               hover:scale-110
                               hover:shadow-md dark:hover:shadow-lg
                               rounded-lg
                               bg-card/30 dark:bg-card/10
                               p-2
                               border border-border/20 dark:border-border/10
                               hover:border-primary/30 dark:hover:border-primary/20"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted/30 dark:bg-muted/20">
                    <Building2
                      className="size-5 text-primary/30 dark:text-primary/20"
                      aria-hidden="true"
                    />
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
                  <span
                    key={`dup-${partner.id}-${i}`}
                    className="shrink-0"
                    aria-hidden="true"
                  >
                    {image}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scroll-partners {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .partners-scroll-track:hover {
          animation-play-state: paused !important;
        }
        @media (prefers-reduced-motion: reduce) {
          .partners-scroll-track {
            animation: none !important;
          }
          .partners-scroll-track:hover {
            animation-play-state: running !important;
          }
        }
      `}</style>
    </section>
  );
}
