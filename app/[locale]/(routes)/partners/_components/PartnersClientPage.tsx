"use client";

import { useTranslations } from "next-intl";
import { ArrowRight, Sparkles, ExternalLink, Building2, Globe, Handshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/routing";
import { getMediaUrl } from "@/lib/env";
import type { Partner } from "@/lib/automex/types";

interface PartnersClientPageProps {
  partners: Partner[];
  activePartnerType?: string;
  activeTier?: string;
}

/** Convert a dash/slug to Title Case for fallback display. */
function titleCase(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** Tier color classes for visual hierarchy. */
const TIER_COLORS: Record<string, string> = {
  diamond: "bg-brand-gradient text-white shadow-brand",
  platinum: "bg-slate-500/10 text-slate-500 border border-slate-500/20",
  gold: "bg-yellow-500/10 text-yellow-600 border border-yellow-500/20",
  silver: "bg-muted/50 text-muted-foreground border border-border/20",
};

function groupByType(partners: Partner[]): Map<string, Partner[]> {
  const groups = new Map<string, Partner[]>();
  for (const p of partners) {
    const key = p.partner_type_display || p.partner_type;
    const list = groups.get(key);
    if (list) list.push(p);
    else groups.set(key, [p]);
  }
  return groups;
}

function extractPartnerTypes(partners: Partner[]): { value: string; label: string }[] {
  const seen = new Set<string>();
  return partners
    .filter((p) => {
      if (seen.has(p.partner_type)) return false;
      seen.add(p.partner_type);
      return true;
    })
    .map((p) => ({ value: p.partner_type, label: p.partner_type_display }));
}

function extractTiers(partners: Partner[]): { value: string; label: string }[] {
  const seen = new Set<string>();
  return partners
    .filter((p) => {
      if (!p.tier || seen.has(p.tier)) return false;
      seen.add(p.tier);
      return true;
    })
    .map((p) => ({ value: p.tier!, label: p.tier_display }))
    .sort((a, b) => {
      const order = ["diamond", "platinum", "gold", "silver"];
      return order.indexOf(a.value) - order.indexOf(b.value);
    });
}

export function PartnersClientPage({
  partners,
  activePartnerType,
  activeTier,
}: PartnersClientPageProps) {
  const t = useTranslations("Partners");
  const grouped = groupByType(partners);
  const types = extractPartnerTypes(partners);
  const tiers = extractTiers(partners);

  function buildQuery(overrides: { type?: string; tier?: string }): Record<string, string> {
    const q: Record<string, string> = {};
    const pt = overrides.type !== undefined ? overrides.type : activePartnerType;
    const tr = overrides.tier !== undefined ? overrides.tier : activeTier;
    if (pt) q.partner_type = pt;
    if (tr) q.tier = tr;
    return q;
  }

  const hasActiveFilters = activePartnerType || activeTier;

  return (
    <div className="relative overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 right-0 size-[450px] rounded-full bg-[#0ab8fb]/3 blur-3xl" />
        <div className="absolute top-1/3 -left-32 size-[350px] rounded-full bg-[#324b9d]/3 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:py-24">
        {/* Hero */}
        <section className="text-center mb-8 sm:mb-12">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#0ab8fb]/20 bg-[#0ab8fb]/5 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#0a9fdf] mb-4">
            <Handshake className="size-3" aria-hidden="true" />
            {t("listing.hero.eyebrow")}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
            <span className="text-brand-gradient">{t("listing.hero.headline")}</span>
          </h1>
          <p className="text-[15px] sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t("listing.hero.description")}
          </p>
        </section>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {/* Partner type filters */}
          {types.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={{ pathname: "/partners", query: buildQuery({ type: undefined }) as any }}
                className={cn(
                  "rounded-full px-4 py-1.5 text-[13px] font-medium transition-all duration-200",
                  !activePartnerType ? "bg-brand-gradient text-white shadow-brand" : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted/80"
                )}
              >
                {t("listing.filters.allTypes")}
              </Link>
              {types.map((tp) => (
                <Link
                  key={tp.value}
                  href={{ pathname: "/partners", query: buildQuery({ type: tp.value }) as any }}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-[13px] font-medium transition-all duration-200",
                    activePartnerType === tp.value ? "bg-brand-gradient text-white shadow-brand" : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted/80"
                  )}
                >
                  {tp.label}
                </Link>
              ))}
            </div>
          )}

          {/* Tier filters */}
          {tiers.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={{ pathname: "/partners", query: buildQuery({ tier: undefined }) as any }}
                className={cn(
                  "rounded-full px-4 py-1.5 text-[13px] font-medium transition-all duration-200",
                  !activeTier ? "bg-brand-gradient text-white shadow-brand" : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted/80"
                )}
              >
                {t("listing.filters.allTiers")}
              </Link>
              {tiers.map((tr) => (
                <Link
                  key={tr.value}
                  href={{ pathname: "/partners", query: buildQuery({ tier: tr.value }) as any }}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-[13px] font-medium transition-all duration-200",
                    activeTier === tr.value ? "bg-brand-gradient text-white shadow-brand" : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted/80"
                  )}
                >
                  {tr.label}
                </Link>
              ))}
            </div>
          )}

          {/* Clear all */}
          {hasActiveFilters && (
            <Link
              href="/partners"
              className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[12px] text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
            >
              {t("listing.filters.clearAll")}
            </Link>
          )}
        </div>

        <p className="text-center text-[12px] text-muted-foreground mb-10">
          {partners.length === 1 ? t("listing.count.singular", { count: partners.length }) : t("listing.count.plural", { count: partners.length })}
        </p>

        {partners.length === 0 ? (
          <div className="text-center py-20">
            <div className="mb-4 opacity-30"><Handshake className="size-10 mx-auto" aria-hidden="true" /></div>
            <p className="text-[14px] text-muted-foreground">{t("listing.empty")}</p>
          </div>
        ) : (
          <>
            {Array.from(grouped.entries()).map(([type, items]) => (
              <section key={type} className="mb-16">
                <div className="flex items-center gap-3 mb-8">
                  <div className="h-px flex-1 bg-border/40" aria-hidden="true" />
                  <h2 className="text-[13px] font-semibold uppercase tracking-widest text-muted-foreground whitespace-nowrap">
                    {type}
                  </h2>
                  <div className="h-px flex-1 bg-border/40" aria-hidden="true" />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {items.map((partner) => {
                    const displayName = partner.name || titleCase(partner.slug);
                    return (
                      <div
                        key={partner.id}
                        className="group relative flex flex-col items-center gap-3 rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand/5 hover:border-primary/40"
                      >
                        {/* Logo */}
                        {partner.logo?.url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={getMediaUrl(partner.logo.url)}
                            alt={partner.logo.alt_text || displayName}
                            className="h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex size-14 items-center justify-center rounded-xl bg-muted/30">
                            <Building2 className="size-7 text-primary/30" aria-hidden="true" />
                          </div>
                        )}

                        {/* Name */}
                        <h3 className="text-[14px] font-semibold text-foreground line-clamp-2">{displayName}</h3>

                        {/* Description */}
                        {partner.description && (
                          <p className="text-[12px] text-muted-foreground line-clamp-2 leading-relaxed">
                            {partner.description}
                          </p>
                        )}

                        {/* Tier badge */}
                        {partner.tier && partner.tier_display && (
                          <span className={cn(
                            "inline-flex items-center rounded-full text-[10px] font-semibold px-2.5 py-0.5",
                            TIER_COLORS[partner.tier] || "bg-muted/50 text-muted-foreground border border-border/20"
                          )}>
                            {partner.tier_display}
                          </span>
                        )}

                        {/* Website link */}
                        {partner.website_url && (
                          <a
                            href={partner.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-auto inline-flex items-center gap-1 text-[12px] text-primary hover:underline"
                          >
                            <Globe className="size-3" aria-hidden="true" />
                            {t("listing.card.visitWebsite")}
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </>
        )}

        {/* Bottom CTA */}
        <section className="mt-8 relative overflow-hidden rounded-2xl border border-border/50 bg-card/70 backdrop-blur-sm p-8 sm:p-10 text-center">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-[#0ab8fb]/5 via-transparent to-[#324b9d]/5" />
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#0ab8fb]/20 bg-[#0ab8fb]/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#0a9fdf] mb-4">
            <Handshake className="size-3" aria-hidden="true" />
            {t("listing.cta.eyebrow")}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">{t("listing.cta.title")}</h2>
          <p className="text-[14px] text-muted-foreground mb-8 max-w-xl mx-auto leading-relaxed">
            {t("listing.cta.description")}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="bg-brand-gradient shadow-brand">
              <Link href="/crm/quote">
                {t("listing.cta.quote")}
                <ArrowRight className="size-4 ml-1.5 rtl:rotate-180" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
