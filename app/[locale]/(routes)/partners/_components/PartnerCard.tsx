"use client";

import { Globe, Building2 } from "lucide-react";
import { getMediaUrl } from "@/lib/env";
import { cn } from "@/lib/utils";
import type { Partner } from "@/lib/automex/types";

interface PartnerCardProps {
  partner: Partner;
  /** Show the description? Defaults to true. */
  showDescription?: boolean;
  /** Show the tier badge? Defaults to true. */
  showTier?: boolean;
  /** Show the website link? Defaults to true. */
  showWebsite?: boolean;
  /** Additional class names. */
  className?: string;
}

/** Tier color classes for visual hierarchy. */
const TIER_COLORS: Record<string, string> = {
  diamond: "bg-brand-gradient text-white shadow-brand",
  platinum: "bg-slate-500/10 text-slate-500 border border-slate-500/20",
  gold: "bg-yellow-500/10 text-yellow-600 border border-yellow-500/20",
  silver: "bg-muted/50 text-muted-foreground border border-border/20",
};

/** Convert a dash/slug to Title Case for fallback display. */
function titleCase(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/**
 * PartnerCard — A single partner card for use in custom layouts.
 *
 * Lightweight, configurable via props. Use in grid layouts, sidebars,
 * or anywhere a single partner needs to be displayed.
 */
export function PartnerCard({
  partner,
  showDescription = true,
  showTier = true,
  showWebsite = true,
  className,
}: PartnerCardProps) {
  const displayName = partner.name || titleCase(partner.slug);

  return (
    <div
      className={cn(
        "group relative flex flex-col items-center gap-3 rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand/5 hover:border-primary/40",
        className
      )}
    >
      {/* Logo */}
      {partner.logo?.url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={getMediaUrl(partner.logo.url)}
          alt={partner.logo.alt_text || displayName}
          className="h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      ) : (
        <div className="flex size-14 items-center justify-center rounded-xl bg-muted/30">
          <Building2 className="size-7 text-primary/30" aria-hidden="true" />
        </div>
      )}

      {/* Name */}
      <h3 className="text-[14px] font-semibold text-foreground line-clamp-2">
        {displayName}
      </h3>

      {/* Description */}
      {showDescription && partner.description && (
        <p className="text-[12px] text-muted-foreground line-clamp-2 leading-relaxed">
          {partner.description}
        </p>
      )}

      {/* Tier badge */}
      {showTier && partner.tier && partner.tier_display && (
        <span
          className={cn(
            "inline-flex items-center rounded-full text-[10px] font-semibold px-2.5 py-0.5",
            TIER_COLORS[partner.tier] ||
              "bg-muted/50 text-muted-foreground border border-border/20"
          )}
        >
          {partner.tier_display}
        </span>
      )}

      {/* Website link */}
      {showWebsite && partner.website_url && (
        <a
          href={partner.website_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-flex items-center gap-1 text-[12px] text-primary hover:underline"
        >
          <Globe className="size-3" aria-hidden="true" />
          Visit website
        </a>
      )}
    </div>
  );
}
