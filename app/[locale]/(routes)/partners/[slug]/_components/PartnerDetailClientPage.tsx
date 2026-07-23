"use client";

import { useTranslations } from "next-intl";
import { ArrowRight, Globe, Building2, ChevronLeft, ExternalLink, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/routing";
import { getMediaUrl } from "@/lib/env";
import type { Partner } from "@/lib/automex/types";

interface PartnerDetailClientPageProps {
  partner: Partner;
}

/** Tier color classes for badges. */
const TIER_COLORS: Record<string, string> = {
  diamond: "bg-brand-gradient text-white shadow-brand",
  platinum: "bg-slate-500/10 text-slate-500 border border-slate-500/20",
  gold: "bg-yellow-500/10 text-yellow-600 border border-yellow-500/20",
  silver: "bg-muted/50 text-muted-foreground border border-border/20",
};

/** Partner type icon mapping. */
function getTypeIcon(type: string) {
  switch (type) {
    case "cloud": return <Globe className="size-4" aria-hidden="true" />;
    case "technology": return <Shield className="size-4" aria-hidden="true" />;
    case "implementation": return <Building2 className="size-4" aria-hidden="true" />;
    default: return <Building2 className="size-4" aria-hidden="true" />;
  }
}

export function PartnerDetailClientPage({ partner }: PartnerDetailClientPageProps) {
  const t = useTranslations("Partners");

  return (
    <div className="relative overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 right-0 size-[450px] rounded-full bg-[#0ab8fb]/3 blur-3xl" />
        <div className="absolute top-1/3 -left-32 size-[350px] rounded-full bg-[#324b9d]/3 blur-3xl" />
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:py-20">
        {/* Back link */}
        <Link
          href="/partners"
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ChevronLeft className="size-4 rtl:rotate-180" aria-hidden="true" />
          {t("listing.hero.headline")}
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start gap-6 mb-10">
          {/* Logo */}
          <div className="flex size-20 sm:size-24 shrink-0 items-center justify-center rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm p-4">
            {partner.logo?.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={getMediaUrl(partner.logo.url)}
                alt={partner.logo.alt_text || partner.name}
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <Building2 className="size-10 text-primary/30" aria-hidden="true" />
            )}
          </div>

          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 tracking-tight">
              {partner.name}
            </h1>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {partner.partner_type && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[12px] font-medium text-primary">
                  {getTypeIcon(partner.partner_type)}
                  {partner.partner_type_display || partner.partner_type}
                </span>
              )}
              {partner.tier && partner.tier_display && (
                <span className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-semibold",
                  TIER_COLORS[partner.tier] || "bg-muted/50 text-muted-foreground border border-border/20"
                )}>
                  <Shield className="size-3.5" aria-hidden="true" />
                  {partner.tier_display}
                </span>
              )}
            </div>

            {partner.description && (
              <p className="text-[14px] sm:text-[15px] text-muted-foreground leading-relaxed max-w-2xl">
                {partner.description}
              </p>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-border/40 my-8" aria-hidden="true" />

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-4">
          {partner.website_url && (
            <Button asChild size="lg" className="bg-brand-gradient shadow-brand">
              <a href={partner.website_url} target="_blank" rel="noopener noreferrer">
                Visit Website
                <ExternalLink className="size-4 ml-1.5" aria-hidden="true" />
              </a>
            </Button>
          )}
          <Button asChild variant="outline" size="lg">
            <Link href="/crm/quote">
              Work with {partner.name}
              <ArrowRight className="size-4 ml-1.5 rtl:rotate-180" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
