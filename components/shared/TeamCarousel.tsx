"use client";

// components/shared/TeamCarousel.tsx
//
// Reusable team display component with two variants:
//   "carousel" — horizontal scrollable track with prev/next + dots
//   "grid"     — responsive CSS grid with staggered animations
//
// Each card opens a detail dialog with full member info + social links.
// Accepts raw API TeamMember[] directly — no consumer mapping needed.
//
// Usage:
//   <TeamCarousel
//     members={teamMembers}
//     variant="grid"
//     eyebrow="Leadership"
//     title="Meet the team"
//     isRtl={isRtl}
//   />

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Briefcase, Tag } from "lucide-react";
import { FaLinkedin, FaXTwitter, FaGithub } from "react-icons/fa6";
import type { TeamMember, MediaAsset } from "@/lib/automex/types";

// ─── Constants ────────────────────────────────────────────────────────────

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const COLOR_PALETTE = [
  "#0ab8fb", "#324b9d", "#13a89e", "#f59e0b",
  "#7c3aed", "#ec4899", "#10b981", "#f97316",
];

// ─── Helpers ──────────────────────────────────────────────────────────────

function deriveInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function deriveColor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLOR_PALETTE[Math.abs(hash) % COLOR_PALETTE.length];
}

function resolvePhotoUrl(photo: MediaAsset | null): string | null {
  if (!photo) return null;
  return photo.url ?? null;
}

function departmentLabel(dep?: string): string {
  const map: Record<string, string> = {
    engineering: "Engineering",
    design: "Design",
    ai: "AI",
    devops: "DevOps",
    management: "Management",
    sales: "Sales",
    qa: "QA",
    other: "Other",
  };
  return dep ? (map[dep] ?? dep) : "";
}

// ─── Types ────────────────────────────────────────────────────────────────

export interface TeamDialogLabels {
  close?: string;
  role?: string;
  department?: string;
  bio?: string;
  social?: string;
}

export interface TeamCarouselProps {
  members: TeamMember[];
  variant: "carousel" | "grid";
  slidesPerView?: { mobile?: number; tablet?: number; desktop?: number };
  gridCols?: { mobile?: number; tablet?: number; desktop?: number };
  eyebrow?: string;
  title?: string;
  description?: string;
  dialogLabels?: TeamDialogLabels;
  isRtl?: boolean;
  className?: string;
  maxItems?: number;
  leadershipOnly?: boolean;
}

// ─── Animation presets ────────────────────────────────────────────────────

const fadeUpInView = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { delay, duration: 0.65, ease: EASE },
});

// ─── Dialog Component ─────────────────────────────────────────────────────

function TeamDialog({
  member,
  color,
  initials,
  photoUrl,
  labels,
  onClose,
}: {
  member: TeamMember;
  color: string;
  initials: string;
  photoUrl: string | null;
  labels?: TeamDialogLabels;
  onClose: () => void;
}) {
  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const dept = departmentLabel(member.department);
  const hasSocial =
    member.linkedin_url || member.twitter_url || member.github_url;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${member.full_name} — ${member.role_title}`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        transition={{ duration: 0.3, ease: EASE }}
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-border/60 bg-card shadow-2xl"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 flex size-9 items-center justify-center rounded-full bg-background/70 text-foreground backdrop-blur transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={labels?.close ?? "Close"}
        >
          <X className="size-4" />
        </button>

        {/* Hero area — photo or gradient */}
        <div className="relative h-72 w-full shrink-0 overflow-hidden">
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt={member.full_name}
              fill
              sizes="(max-width: 512px) 100vw, 512px"
              className="object-cover object-top"
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center text-7xl font-bold text-white"
              style={{
                background: `linear-gradient(135deg, ${color} 0%, ${color}88 100%)`,
              }}
            >
              {initials}
            </div>
          )}
          {/* Bottom gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to top, var(--card) 0%, transparent 50%)`,
            }}
          />
          {/* Color accent bar */}
          <div
            className="absolute inset-x-0 top-0 h-1"
            style={{ backgroundColor: color }}
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-8 pt-5">
          {/* Name + Role */}
          <div className="mb-4">
            <h3 className="text-2xl font-bold text-foreground">
              {member.full_name}
            </h3>
            <p
              className="mt-1 text-base font-semibold"
              style={{ color }}
            >
              {member.role_title}
            </p>
          </div>

          {/* Department badge */}
          {dept && (
            <div className="mb-5 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-accent px-3 py-1.5 text-xs font-medium text-muted-foreground">
                <Briefcase className="size-3" />
                {dept}
              </span>
            </div>
          )}

          {/* Bio */}
          {member.bio && (
            <div className="mb-5">
              {labels?.bio && (
                <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  {labels.bio}
                </p>
              )}
              <p className="text-sm leading-6 text-muted-foreground">
                {member.bio}
              </p>
            </div>
          )}

          {/* Social links */}
          {hasSocial && (
            <div>
              {labels?.social && (
                <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  {labels.social}
                </p>
              )}
              <div className="flex flex-wrap gap-2">
                {member.linkedin_url && (
                  <a
                    href={member.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <FaLinkedin className="size-4" />
                    LinkedIn
                  </a>
                )}
                {member.twitter_url && (
                  <a
                    href={member.twitter_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <FaXTwitter className="size-4" />
                    X / Twitter
                  </a>
                )}
                {member.github_url && (
                  <a
                    href={member.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <FaGithub className="size-4" />
                    GitHub
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// ─── Card Component ───────────────────────────────────────────────────────

function TeamCard({
  member,
  color,
  initials,
  photoUrl,
  delay,
  onClick,
}: {
  member: TeamMember;
  color: string;
  initials: string;
  photoUrl: string | null;
  delay: number;
  onClick: () => void;
}) {
  return (
    <motion.div
      {...fadeUpInView(delay)}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className="group relative cursor-pointer overflow-hidden rounded-3xl border border-border/60 bg-card shadow-md transition-shadow duration-300 hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      style={{ minHeight: 360 }}
    >
      {/* Photo or gradient */}
      <div className="relative h-56 w-full overflow-hidden">
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt={`${member.full_name} — ${member.role_title}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center text-5xl font-bold text-white"
            style={{
              background: `linear-gradient(135deg, ${color} 0%, ${color}88 100%)`,
            }}
          >
            {initials}
          </div>
        )}

        {/* Bottom gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to top, var(--card) 0%, var(--card)/60 30%, transparent 70%)`,
          }}
        />

        {/* Color accent bar */}
        <div
          className="absolute inset-x-0 top-0 h-1"
          style={{ backgroundColor: color }}
        />
      </div>

      {/* Info */}
      <div className="relative px-5 pb-5 pt-3">
        <h3 className="text-lg font-bold text-foreground">
          {member.full_name}
        </h3>
        <p
          className="mt-0.5 text-sm font-semibold"
          style={{ color }}
        >
          {member.role_title}
        </p>

        {/* "Click to view" hint on hover */}
        <div className="mt-3 overflow-hidden opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-medium text-primary">
            <Tag className="size-3" />
            View Profile
          </span>
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
          className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary"
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

// ─── Responsive helpers (avoid dynamic Tailwind classes) ──────────────

const GRID_COL_MAP: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
};

const SM_GRID_COL_MAP: Record<number, string> = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-4",
  5: "sm:grid-cols-5",
};

const LG_GRID_COL_MAP: Record<number, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
};

function CarouselTrack({
  members,
  photos,
  colors,
  initials,
  onCardClick,
  slidesPerView,
  isRtl,
}: {
  members: TeamMember[];
  photos: (string | null)[];
  colors: string[];
  initials: string[];
  onCardClick: (i: number) => void;
  slidesPerView: { mobile: number; tablet: number; desktop: number };
  isRtl: boolean;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  // Use desktop count for page calculation
  const perPage = slidesPerView.desktop;
  const totalPages = Math.ceil(members.length / perPage);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) =>
      prev < totalPages - 1 ? prev + 1 : 0
    );
  }, [totalPages]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) =>
      prev > 0 ? prev - 1 : totalPages - 1
    );
  }, [totalPages]);

  if (members.length === 0) return null;

  return (
    <div className="relative">
      {/* Cards */}
      <div className="overflow-hidden">
        <motion.div
          className="flex gap-6"
          animate={{ x: isRtl ? `${currentIndex * 100}%` : `-${currentIndex * 100}%` }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          {members.map((member, i) => (
            <div
              key={member.id}
              className="w-full shrink-0"
              style={{
                maxWidth: `calc((100% - ${(perPage - 1) * 1.5}rem) / ${perPage})`,
                flex: `0 0 calc((100% - ${(perPage - 1) * 1.5}rem) / ${perPage})`,
              }}
            >
              <TeamCard
                member={member}
                color={colors[i]}
                initials={initials[i]}
                photoUrl={photos[i]}
                delay={0}
                onClick={() => onCardClick(i)}
              />
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
            aria-label="Previous"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            onClick={isRtl ? goPrev : goNext}
            className="absolute -right-3 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-border/60 bg-card text-foreground shadow-md transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Next"
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
                  ? "w-7 bg-primary"
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

export function TeamCarousel({
  members,
  variant,
  slidesPerView: rawSlidesPerView,
  gridCols: rawGridCols,
  eyebrow,
  title,
  description,
  dialogLabels,
  isRtl = false,
  className = "",
  maxItems,
  leadershipOnly = false,
}: TeamCarouselProps) {
  const [dialogIndex, setDialogIndex] = useState<number | null>(null);

  // Filter
  let filtered = [...members];
  if (leadershipOnly) {
    filtered = filtered.filter((m) => m.is_leadership);
  }
  // Sort by order
  filtered.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
  if (maxItems != null && maxItems > 0) {
    filtered = filtered.slice(0, maxItems);
  }

  // Pre-compute derived values
  const photos = filtered.map((m) => resolvePhotoUrl(m.photo));
  const colors = filtered.map((m) => deriveColor(m.id));
  const initialsArr = filtered.map((m) => deriveInitials(m.full_name));

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

  // Grid column class (static maps to avoid dynamic Tailwind issues)
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
            No team members to display.
          </p>
        ) : variant === "carousel" ? (
          <CarouselTrack
            members={filtered}
            photos={photos}
            colors={colors}
            initials={initialsArr}
            onCardClick={setDialogIndex}
            slidesPerView={slidesPerView}
            isRtl={isRtl}
          />
        ) : (
          /* Grid variant */
          <div className={`grid gap-6 ${gridColClass}`}>
            {filtered.map((member, i) => (
              <TeamCard
                key={member.id}
                member={member}
                color={colors[i]}
                initials={initialsArr[i]}
                photoUrl={photos[i]}
                delay={0.06 + i * 0.1}
                onClick={() => setDialogIndex(i)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Detail Dialog */}
      <AnimatePresence>
        {dialogIndex != null && filtered[dialogIndex] && (
          <TeamDialog
            key="team-dialog"
            member={filtered[dialogIndex]}
            color={colors[dialogIndex]}
            initials={initialsArr[dialogIndex]}
            photoUrl={photos[dialogIndex]}
            labels={dialogLabels}
            onClose={() => setDialogIndex(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
