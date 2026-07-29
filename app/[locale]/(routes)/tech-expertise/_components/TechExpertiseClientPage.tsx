"use client";

import { useTranslations } from "next-intl";
import {
  ArrowRight,
  Sparkles,
  Code2,
  ArrowUpRight,
  Folders,
  ChevronRight,
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getMediaUrl } from "@/lib/env";
import { Link, useRouter } from "@/i18n/routing";
import type { TechExpertiseArea } from "@/lib/automex/types";
import { FooterSection } from "@/app/[locale]/_components/Footer/FooterSections";

// ─── Category metadata ──────────────────────────────────────────────────

const CATEGORY_META: Record<string, { icon: string; label: string }> = {
  architecture: { icon: "cpu", label: "Architecture" },
  cloud: { icon: "cloud", label: "Cloud" },
  data_engineering: { icon: "database", label: "Data Engineering" },
  ai: { icon: "sparkles", label: "AI" },
  security: { icon: "shield-check", label: "Security" },
  mobile: { icon: "smartphone", label: "Mobile" },
  devops: { icon: "container", label: "DevOps" },
  qa: { icon: "shield-check", label: "QA" },
};

const CATEGORY_ORDER = [
  "ai",
  "security",
  "mobile",
  "cloud",
  "data_engineering",
  "architecture",
  "devops",
  "qa",
];

// ─── Helpers ────────────────────────────────────────────────────────────

/** Resolve a lucide:icon-name or plain icon-name string to a lucide-react component. */
function resolveLucideIcon(iconName: string | undefined): React.ElementType {
  if (!iconName) return Code2;
  const name = iconName.startsWith("lucide:") ? iconName.slice(7) : iconName;
  const pascal = name
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join("");
  const map = LucideIcons as unknown as Record<string, React.ElementType>;
  return map[pascal] || Code2;
}

/** Title-case a slug for fallback display. */
function titleCase(slug: string): string {
  return slug
    .replace(/_/g, " ")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function groupByCategory(
  areas: TechExpertiseArea[],
): Map<string, TechExpertiseArea[]> {
  const groups = new Map<string, TechExpertiseArea[]>();
  for (const area of areas) {
    const key = area.category;
    const list = groups.get(key);
    if (list) list.push(area);
    else groups.set(key, [area]);
  }
  return groups;
}

// ─── Component ──────────────────────────────────────────────────────────

export function TechExpertiseClientPage({
  areas,
  activeCategory,
}: {
  areas: TechExpertiseArea[];
  activeCategory?: string;
}) {
  const t = useTranslations("TechExpertise");
  const router = useRouter();

  // Filter out inactive areas
  const activeAreas = areas.filter((area) => area.is_active !== false);

  const grouped = groupByCategory(activeAreas);
  const availableCategories = CATEGORY_ORDER.filter((cat) => grouped.has(cat));

  return (
    <div className="relative overflow-hidden mt-10 md:mt-24">
      {/* Background decorations */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute -top-24 right-0 size-112.5 rounded-full bg-[#0ab8fb]/3 blur-3xl" />
        <div className="absolute top-1/3 -left-32 size-87.5 rounded-full bg-[#324b9d]/3 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 size-75 rounded-full bg-[#13a89e]/3 blur-3xl -translate-x-1/2" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:py-24">
        {/* ── Hero ── */}
        <section className="text-center mb-10 sm:mb-14">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
            <span className="text-brand-gradient">
              {t("listing.hero.headline")}
            </span>
          </h1>
          <p className="text-[15px] sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t("listing.hero.description")}
          </p>
        </section>

        {/* ── Category filter tabs ── */}
        {availableCategories.length > 1 && (
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            <Link
              href={{ pathname: "/tech-expertise" }}
              replace
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[13px] font-medium transition-all duration-200 border",
                !activeCategory
                  ? "bg-brand-gradient text-white border-transparent shadow-brand"
                  : "border-border/60 bg-card/60 text-muted-foreground hover:text-foreground hover:border-primary/40",
              )}
            >
              {t("listing.filters.all")}
            </Link>
            {availableCategories.map((cat) => {
              const meta = CATEGORY_META[cat];
              const Icon = meta ? resolveLucideIcon(meta.icon) : Code2;
              const label = meta?.label || titleCase(cat);
              return (
                <Link
                  key={cat}
                  href={{
                    pathname: "/tech-expertise",
                    query: { category: cat },
                  }}
                  replace
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[13px] font-medium transition-all duration-200 border",
                    activeCategory === cat
                      ? "bg-brand-gradient text-white border-transparent shadow-brand"
                      : "border-border/60 bg-card/60 text-muted-foreground hover:text-foreground hover:border-primary/40",
                  )}
                >
                  <Icon className="size-3.5" aria-hidden="true" />
                  {label}
                </Link>
              );
            })}
          </div>
        )}

        {/* ── Content ── */}
        {activeAreas.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-muted/50 mb-4">
              <Code2
                className="size-7 text-muted-foreground/40"
                aria-hidden="true"
              />
            </div>
            <p className="text-[14px] text-muted-foreground">
              {t("listing.empty")}
            </p>
          </div>
        ) : (
          <>
            {Array.from(grouped.entries()).map(([category, items]) => {
              const meta = CATEGORY_META[category];
              const CatIcon = meta ? resolveLucideIcon(meta.icon) : Code2;
              const displayCategory =
                items[0]?.category_display ||
                meta?.label ||
                titleCase(category);

              return (
                <section key={category} className="mb-16 last:mb-0">
                  {/* Category header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center gap-2.5">
                      <div className="flex items-center justify-center size-9 rounded-xl text-white shadow-brand shrink-0">
                        <CatIcon className="size-4.5 text-brand-gradient" aria-hidden="true" />
                      </div>
                      <h2 className="text-lg font-bold text-foreground">
                        {displayCategory}
                      </h2>
                    </div>
                    <div
                      className="h-px flex-1 bg-linear-to-r from-border/40 to-transparent"
                      aria-hidden="true"
                    />
                    <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                      {t("listing.items", { count: items.length })}
                    </span>
                  </div>

                  {/* Cards grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {items.map((area) => {
                      const displayName = area.name || titleCase(area.slug);
                      const AreaIcon = resolveLucideIcon(area.icon);
                      const previewTechs = area.technologies?.slice(0, 4) || [];
                      const totalTechs = area.technologies?.length || 0;
                      const caseStudyCount = area.case_studies?.length || 0;

                      return (
                        <Link
                          key={area.id}
                          href={{
                            pathname: "/tech-expertise/[slug]",
                            params: { slug: area.slug },
                          }}
                          className="group relative flex flex-col rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-brand/5 hover:border-primary/40"
                        >
                          {/* Icon – clean, no background */}
                          <div className="flex items-center gap-2 mb-3">
                            <AreaIcon
                              className="size-5 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:text-brand"
                              aria-hidden="true"
                            />
                            <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
                              {area.category_display || meta?.label}
                            </span>
                          </div>

                          {/* Name */}
                          <h3 className="text-[17px] font-bold text-foreground group-hover:text-primary transition-colors mb-1.5">
                            {displayName}
                          </h3>

                          {/* Description */}
                          {area.description && (
                            <p className="text-[14px] text-muted-foreground flex-1 leading-relaxed line-clamp-3 mb-4">
                              {area.description}
                            </p>
                          )}

                          {/* Technology preview row */}
                          {totalTechs > 0 && (
                            <div className="flex items-center gap-2.5 mb-4">
                              <div className="flex items-center -space-x-1.5">
                                {previewTechs.map((tech) => {
                                  const logoUrl = tech.logo?.url
                                    ? getMediaUrl(tech.logo.url)
                                    : null;
                                  const TechIcon = resolveLucideIcon(tech.icon);
                                  return logoUrl ? (
                                    <div
                                      key={tech.id}
                                      className="flex items-center justify-center size-7 rounded-full bg-muted/40 border-2 border-background p-1 overflow-hidden"
                                      title={tech.name}
                                    >
                                      <img
                                        src={logoUrl}
                                        alt={tech.logo?.alt_text || tech.name}
                                        className="size-full object-contain"
                                        loading="lazy"
                                      />
                                    </div>
                                  ) : (
                                    <div
                                      key={tech.id}
                                      className="flex items-center justify-center size-7 rounded-full bg-muted/40 border-2 border-background"
                                      title={tech.name}
                                    >
                                      <TechIcon className="size-3.5 text-muted-foreground" />
                                    </div>
                                  );
                                })}
                                {totalTechs > 4 && (
                                  <div className="flex items-center justify-center size-7 rounded-full bg-brand-gradient/10 border-2 border-background">
                                    <span className="text-[10px] font-bold text-primary">
                                      +{totalTechs - 4}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {t("listing.card.technologies", {
                                  count: totalTechs,
                                  plural: totalTechs !== 1 ? "ies" : "y",
                                })}
                              </span>
                            </div>
                          )}

                          {/* Case studies count */}
                          {caseStudyCount > 0 && (
                            <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1.5">
                              <Folders
                                className="size-3 shrink-0 text-primary/50"
                                aria-hidden="true"
                              />
                              {t("listing.card.caseStudies", {
                                count: caseStudyCount,
                                plural: caseStudyCount !== 1 ? "ies" : "y",
                              })}
                            </p>
                          )}

                          {/* Explore link */}
                          <div className="mt-auto pt-2 flex items-center justify-between">
                            <span className="inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
                              {t("listing.card.explore")}
                              <ArrowUpRight
                                className="size-3.5 rtl:rotate-180 transition-transform group-hover:translate-x-0.5"
                                aria-hidden="true"
                              />
                            </span>
                            <ChevronRight
                              className="size-4 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all rtl:rotate-180"
                              aria-hidden="true"
                            />
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </>
        )}

        {/* ── Bottom CTA ── */}
        <section className="mt-8 relative overflow-hidden rounded-2xl border border-border/50 bg-card/70 backdrop-blur-sm p-8 sm:p-10 text-center">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-br from-[#0ab8fb]/5 via-transparent to-[#324b9d]/5 animate-gradient"
            style={{
              backgroundSize: "200% 200%",
              animation: "gradient-shift 8s ease-in-out infinite alternate",
            }}
          />
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#0ab8fb]/20 bg-[#0ab8fb]/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#0a9fdf] mb-4">
            <Sparkles className="size-3" aria-hidden="true" />
            {t("listing.cta.eyebrow")}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
            {t("listing.cta.title")}
          </h2>
          <p className="text-[14px] text-muted-foreground mb-8 max-w-xl mx-auto leading-relaxed">
            {t("listing.cta.description")}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="bg-brand-gradient shadow-brand hover:shadow-xl transition-all hover:scale-105"
            >
              <Link href="/crm/quote">
                {t("listing.cta.quote")}
                <ArrowRight
                  className="size-4 ml-1.5 rtl:rotate-180"
                  aria-hidden="true"
                />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-brand-gradient hover:border-primary/50 transition-all hover:scale-105"
            >
              <Link href="/crm/book-a-call">{t("listing.cta.booking")}</Link>
            </Button>
          </div>
        </section>
      </div>
      <FooterSection />

      <style jsx>{`
        @keyframes gradient-shift {
          0% {
            background-position: 0% 0%;
          }
          100% {
            background-position: 100% 100%;
          }
        }
        .animate-gradient {
          animation: gradient-shift 8s ease-in-out infinite alternate;
        }
      `}</style>
    </div>
  );
}
