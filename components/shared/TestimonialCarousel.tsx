"use client";

// components/shared/TestimonialCarousel.tsx
//
// Reusable testimonial display component with two variants:
//   "carousel" — horizontal scrollable track with prev/next + dots
//   "grid"     — responsive CSS grid with staggered animations
//
// Accepts raw API Testimonial[] directly — no consumer mapping needed.
// Theme: amber/gold accent (#f59e0b, #d97706).
//
// Usage:
//   <TestimonialCarousel
//     testimonials={testimonials}
//     variant="grid"
//     title="What our clients say"
//     maxItems={6}
//   />

import { useState, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import type { Testimonial, MediaAsset } from "@/lib/automex/types";

// ─── Constants ────────────────────────────────────────────────────────────

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const SOURCE_LABELS: Record<string, string> = {
  manual: "Direct",
  clutch: "Clutch",
  google: "Google",
  linkedin: "LinkedIn",
  trustpilot: "Trustpilot",
};

const SOURCE_COLORS: Record<string, string> = {
  clutch: "bg-red-500/10 text-red-600 dark:text-red-400",
  google: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  linkedin: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  trustpilot: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  manual: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
};

// ─── Helpers ──────────────────────────────────────────────────────────────

function deriveInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function resolveAvatarUrl(avatar: MediaAsset | null): string | null {
  if (!avatar) return null;
  return avatar.url ?? null;
}

function sourceLabel(source?: string): string {
  if (!source) return "";
  return SOURCE_LABELS[source] ?? source;
}

function sourceColor(source?: string): string {
  if (!source) return "bg-muted text-muted-foreground";
  return SOURCE_COLORS[source] ?? "bg-muted text-muted-foreground";
}

// ─── Responsive helpers (avoid dynamic Tailwind classes) ──────────────

const GRID_COL_MAP: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
};

const SM_GRID_COL_MAP: Record<number, string> = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
};

const LG_GRID_COL_MAP: Record<number, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
};

// ─── Types ────────────────────────────────────────────────────────────────

export interface TestimonialCarouselProps {
  testimonials: Testimonial[];
  variant: "carousel" | "grid";
  slidesPerView?: { mobile?: number; tablet?: number; desktop?: number };
  gridCols?: { mobile?: number; tablet?: number; desktop?: number };
  eyebrow?: string;
  title?: string;
  description?: string;
  isRtl?: boolean;
  className?: string;
  maxItems?: number;
  featuredOnly?: boolean;
  /** Filter by related_service UUID */
  serviceId?: string;
}

// ─── Animation presets ────────────────────────────────────────────────────

const fadeUpInView = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { delay, duration: 0.65, ease: EASE },
});

// ─── Stars Row ────────────────────────────────────────────────────────────

function StarRating({ rating = 5 }: { rating?: number }) {
  const clamped = Math.max(1, Math.min(5, Math.round(rating)));
  return (
    <div className="flex items-center gap-0.5" aria-label={`${clamped} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`size-4 ${
            i < clamped
              ? "fill-amber-400 text-amber-400"
              : "fill-none text-muted-foreground/30"
          }`}
        />
      ))}
    </div>
  );
}

// ─── Card Component ───────────────────────────────────────────────────────

function TestimonialCard({
  testimonial,
  delay,
}: {
  testimonial: Testimonial;
  delay: number;
}) {
  const avatarUrl = resolveAvatarUrl(testimonial.client_avatar);
  const initials = deriveInitials(testimonial.client_name);
  const sourceText = sourceLabel(testimonial.source);
  const sourceCls = sourceColor(testimonial.source);

  return (
    <motion.div
      {...fadeUpInView(delay)}
      className="group relative flex flex-col rounded-3xl border border-border/60 bg-card p-6 shadow-md transition-shadow duration-300 hover:shadow-xl hover:border-amber-500/30 sm:p-7"
    >
      {/* Decorative quote icon */}
      <Quote className="absolute right-5 top-5 size-10 text-amber-500/10" aria-hidden="true" />

      {/* Quote text */}
      <div className="relative flex-1">
        <p className="text-[15px] italic leading-relaxed text-foreground/85 line-clamp-5">
          &ldquo;{testimonial.quote}&rdquo;
        </p>
      </div>

      {/* Divider */}
      <div className="my-5 border-t border-border/50" />

      {/* Bottom: avatar + info + rating */}
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="relative size-10 shrink-0 overflow-hidden rounded-full">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={testimonial.client_name}
              fill
              sizes="40px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-amber-500/20 text-xs font-bold text-amber-600">
              {initials}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground truncate">
            {testimonial.client_name}
          </p>
          {(testimonial.client_role || testimonial.client_company) && (
            <p className="mt-0.5 text-xs text-muted-foreground truncate">
              {[testimonial.client_role, testimonial.client_company]
                .filter(Boolean)
                .join(" · ")}
            </p>
          )}
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <StarRating rating={testimonial.rating} />
            {sourceText && (
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${sourceCls}`}>
                {sourceText}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title?: string;
  description?: string;
}) {
  if (!eyebrow && !title && !description) return null;

  return (
    <div className="mb-12 text-center">
      {eyebrow && (
        <motion.p
          {...fadeUpInView(0)}
          className="text-[11px] font-bold uppercase tracking-[0.18em] text-amber-500"
        >
          {eyebrow}
        </motion.p>
      )}
      {title && (
        <motion.h2
          {...fadeUpInView(0.07)}
          className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
        >
          {title}
        </motion.h2>
      )}
      {description && (
        <motion.p
          {...fadeUpInView(0.14)}
          className="mx-auto mt-4 max-w-xl text-base leading-7 text-muted-foreground"
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}

// ─── Carousel Track ───────────────────────────────────────────────────────

function CarouselTrack({
  testimonials,
  slidesPerView,
  isRtl,
}: {
  testimonials: Testimonial[];
  slidesPerView: { mobile: number; tablet: number; desktop: number };
  isRtl: boolean;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const perPage = slidesPerView.desktop;
  const totalPages = Math.ceil(testimonials.length / perPage);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
  }, [totalPages]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
  }, [totalPages]);

  if (testimonials.length === 0) return null;

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <motion.div
          className="flex gap-6"
          animate={{ x: isRtl ? `${currentIndex * 100}%` : `-${currentIndex * 100}%` }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="w-full shrink-0"
              style={{
                maxWidth: `calc((100% - ${(perPage - 1) * 1.5}rem) / ${perPage})`,
                flex: `0 0 calc((100% - ${(perPage - 1) * 1.5}rem) / ${perPage})`,
              }}
            >
              <TestimonialCard testimonial={t} delay={0} />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Nav arrows */}
      {totalPages > 1 && (
        <>
          <button
            onClick={isRtl ? goNext : goPrev}
            className="absolute -left-3 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-border/60 bg-card text-foreground shadow-md transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Previous testimonials"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            onClick={isRtl ? goPrev : goNext}
            className="absolute -right-3 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-border/60 bg-card text-foreground shadow-md transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Next testimonials"
          >
            <ChevronRight className="size-5" />
          </button>
        </>
      )}

      {/* Dots */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`size-2.5 rounded-full transition-all duration-300 ${
                i === currentIndex
                  ? "w-7 bg-amber-500"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────

export function TestimonialCarousel({
  testimonials,
  variant,
  slidesPerView: rawSlidesPerView,
  gridCols: rawGridCols,
  eyebrow,
  title,
  description,
  isRtl = false,
  className = "",
  maxItems,
  featuredOnly = false,
  serviceId,
}: TestimonialCarouselProps) {
  // Filter
  let filtered = [...testimonials];
  if (featuredOnly) {
    filtered = filtered.filter((t) => t.is_featured);
  }
  if (serviceId) {
    filtered = filtered.filter((t) => t.related_service === serviceId);
  }
  // Sort by order
  filtered.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
  if (maxItems != null && maxItems > 0) {
    filtered = filtered.slice(0, maxItems);
  }

  // Defaults
  const slidesPerView = {
    mobile: rawSlidesPerView?.mobile ?? 1,
    tablet: rawSlidesPerView?.tablet ?? 2,
    desktop: rawSlidesPerView?.desktop ?? 3,
  };
  const gridCols = {
    mobile: rawGridCols?.mobile ?? 1,
    tablet: rawGridCols?.tablet ?? 2,
    desktop: rawGridCols?.desktop ?? 3,
  };

  const gridColClass = [
    GRID_COL_MAP[gridCols.mobile] ?? "grid-cols-1",
    SM_GRID_COL_MAP[gridCols.tablet] ?? "sm:grid-cols-2",
    LG_GRID_COL_MAP[gridCols.desktop] ?? "lg:grid-cols-3",
  ].join(" ");

  return (
    <section
      dir={isRtl ? "rtl" : "ltr"}
      className={`px-4 py-20 sm:px-6 lg:px-8 lg:py-28 ${className}`}
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow={eyebrow}
          title={title}
          description={description}
        />

        {filtered.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">
            No testimonials to display.
          </p>
        ) : variant === "carousel" ? (
          <CarouselTrack
            testimonials={filtered}
            slidesPerView={slidesPerView}
            isRtl={isRtl}
          />
        ) : (
          /* Grid variant */
          <div className={`grid gap-6 ${gridColClass}`}>
            {filtered.map((t, i) => (
              <TestimonialCard
                key={t.id}
                testimonial={t}
                delay={0.06 + i * 0.1}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
