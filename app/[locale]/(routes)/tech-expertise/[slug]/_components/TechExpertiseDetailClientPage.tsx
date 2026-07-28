"use client";

import { useMemo, type ElementType } from "react";
import {
  ArrowLeft,
  Sparkles,
  ArrowUpRight,
  Code2,
  Server,
  Layout,
  Database,
  Cloud,
  Brain,
  Building2,
  Smartphone,
  GitBranch,
  Shield,
  ExternalLink,
  Folders,
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { getMediaUrl } from "@/lib/env";
import { cn } from "@/lib/utils";
import type {
  TechExpertiseArea,
  CaseStudyListItem,
  Technology,
} from "@/lib/automex/types";
import { FooterSection } from "@/app/[locale]/_components/Footer/FooterSections";

// ─── Category metadata for tech cards ────────────────────────────────────

const CATEGORY_META: Record<string, { label: string; Icon: ElementType }> = {
  backend: { label: "Backend", Icon: Server },
  frontend: { label: "Frontend", Icon: Layout },
  database: { label: "Database", Icon: Database },
  cloud: { label: "Cloud", Icon: Cloud },
  ai: { label: "AI & ML", Icon: Brain },
  enterprise: { label: "Enterprise", Icon: Building2 },
  mobile: { label: "Mobile", Icon: Smartphone },
  devops: { label: "DevOps", Icon: GitBranch },
  security: { label: "Security", Icon: Shield },
  other: { label: "Other", Icon: Code2 },
};

// ─── Helpers ────────────────────────────────────────────────────────────

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

function titleCase(slug: string): string {
  return slug
    .replace(/_/g, " ")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// ─── Sub-component: Category-tagged technology cards ────────────────────

function CategoryTaggedTechnologies({
  technologies,
  t,
}: {
  technologies: Technology[];
  t: ReturnType<typeof useTranslations<"TechExpertise">>;
}) {
  const grouped = useMemo(() => {
    const map = new Map<string, Technology[]>();
    for (const tech of technologies) {
      const cat = tech.category || "other";
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(tech);
    }
    return map;
  }, [technologies]);

  if (technologies.length === 0) return null;

  return (
    <section className="mb-12">
      {/* Section header */}
      <div className="mb-2 justify-center items-center text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#0ab8fb]/20 bg-[#0ab8fb]/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#0a9fdf]">
          <Server className="size-3" aria-hidden="true" />
          {t("detail.technologies.eyebrow")}
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6 mt-6">
          {t("detail.technologies.title")}
        </h2>
      </div>

      {Array.from(grouped.entries()).map(([category, techs]) => {
        const meta = CATEGORY_META[category] || CATEGORY_META.other;
        const CatIcon = meta.Icon;
        return (
          <div key={category} className="mb-10 last:mb-0">
            {/* Category header */}
            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex items-center justify-center size-7 rounded-lg bg-brand-gradient/10 text-primary shrink-0">
                <CatIcon className="size-3.5" aria-hidden="true" />
              </div>
              <h3 className="text-[13px] font-bold text-foreground uppercase tracking-wider">
                {meta.label}
              </h3>
              <span className="text-[11px] text-muted-foreground font-medium">
                {techs.length}{" "}
                {techs.length === 1 ? "technology" : "technologies"}
              </span>
            </div>

            {/* Tech cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {techs.map((tech) => {
                const TechIcon = resolveLucideIcon(tech.icon);
                const logoUrl = tech.logo?.url
                  ? getMediaUrl(tech.logo.url)
                  : null;

                const cardContent = (
                  <>
                    {/* Top: logo or icon */}
                    <div className="flex items-center gap-3 mb-3">
                      {logoUrl ? (
                        <div className="flex items-center justify-center size-10 rounded-lg bg-muted/30 p-1.5 shrink-0">
                          <img
                            src={logoUrl}
                            alt={tech.logo?.alt_text || tech.name}
                            className="size-full object-contain"
                            loading="lazy"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center size-10 rounded-lg bg-brand-gradient/10 text-primary shrink-0">
                          <TechIcon className="size-5" aria-hidden="true" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <h4 className="text-[14px] font-semibold text-foreground truncate">
                          {tech.name}
                        </h4>
                        {tech.proficiency_level_display && (
                          <span
                            className={cn(
                              "inline-block text-[10px] font-semibold uppercase tracking-wider mt-0.5 px-1.5 py-0.5 rounded-full",
                              tech.proficiency_level === "expert"
                                ? "bg-violet-500/10 text-violet-500 border border-violet-500/20"
                                : tech.proficiency_level === "advanced"
                                  ? "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                                  : "bg-muted text-muted-foreground border border-border/40",
                            )}
                          >
                            {tech.proficiency_level_display}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    {tech.description && (
                      <p className="text-[12px] text-muted-foreground leading-relaxed line-clamp-2 mb-2">
                        {tech.description}
                      </p>
                    )}
                  </>
                );

                const cardClasses =
                  "group flex flex-col rounded-xl border border-border/60 bg-card/80 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand/5 hover:border-primary/30";

                return tech.website_url ? (
                  <a
                    key={tech.id}
                    href={tech.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cardClasses}
                  >
                    {cardContent}
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-primary/70 group-hover:text-primary mt-auto transition-colors">
                      <ExternalLink className="size-3" aria-hidden="true" />
                      {tech.website_url
                        ?.replace(/^https?:\/\//, "")
                        .replace(/\/.*$/, "")}
                    </span>
                  </a>
                ) : (
                  <div key={tech.id} className={cardClasses}>
                    {cardContent}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </section>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────

export function TechExpertiseDetailClientPage({
  area,
  resolvedCaseStudies = [],
}: {
  area: TechExpertiseArea;
  resolvedCaseStudies?: Pick<CaseStudyListItem, "id" | "slug" | "title">[];
}) {
  const t = useTranslations("TechExpertise");
  const displayName = area.name || titleCase(area.slug);
  const AreaIcon = resolveLucideIcon(area.icon);

  const hasCaseStudies = resolvedCaseStudies.length > 0;

  return (
    <div className="relative overflow-hidden mt-14 md:mt-24">
      {/* Background decorations */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute -top-24 right-0 size-112.5 rounded-full bg-[#0ab8fb]/3 blur-3xl" />
        <div className="absolute top-1/3 -left-32 size-87.5 rounded-full bg-[#324b9d]/3 blur-3xl" />
      </div>

      <article className="mx-auto max-w-4xl px-4 py-16 sm:py-24">
        {/* Back link */}
        <Link
          href="/tech-expertise"
          className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="size-3.5 rtl:rotate-180" aria-hidden="true" />
          {t("detail.back")}
        </Link>

        {/* Category badge */}
        <div className="mb-4">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#0ab8fb]/20 bg-[#0ab8fb]/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#0a9fdf]">
            {(area as any).category_display ||
              (area as any).category ||
              "Technology"}
          </span>
        </div>

        {/* Title with icon */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight leading-tight flex items-center gap-4 flex-wrap">
          <span className="text-brand-gradient">{displayName}</span>
        </h1>

        {/* Stats bar */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          {area.technologies.length > 0 && (
            <span className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground">
              <Code2
                className="size-3.5 shrink-0 text-primary/60"
                aria-hidden="true"
              />
              {t("detail.stats.technologies", {
                count: area.technologies.length,
              })}
            </span>
          )}
          {hasCaseStudies && (
            <span className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground">
              <Folders
                className="size-3.5 shrink-0 text-primary/60"
                aria-hidden="true"
              />
              {t("detail.stats.caseStudies", {
                count: resolvedCaseStudies.length,
              })}
            </span>
          )}
        </div>

        {/* Description */}
        {area.description && (
          <section className="mb-12">
            <div className="mt-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#0ab8fb]/20 bg-[#0ab8fb]/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#0a9fdf] mb-3">
                {t("detail.about.eyebrow")}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-5">
              {t("detail.about.title")}
            </h2>
            <div className="prose text-[15px] text-muted-foreground leading-relaxed space-y-3">
              {area.description.split("\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </section>
        )}

        {/* Technologies — category-grouped cards */}
        <CategoryTaggedTechnologies technologies={area.technologies} t={t} />

        {/* Related Case Studies — resolved names with cards */}
        {hasCaseStudies && (
          <section className="mb-12">
            <div className="mb-2 justify-center items-center text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#0ab8fb]/20 bg-[#0ab8fb]/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#0a9fdf]">
                <Folders className="size-3" aria-hidden="true" />
                {t("detail.caseStudies.eyebrow")}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6 mt-6">
                {t("detail.caseStudies.title")}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {resolvedCaseStudies.map((cs) => (
                <Link
                  key={cs.id}
                  href={`/case-studies/${cs.slug}` as any}
                  className="group flex items-center gap-4 rounded-xl border border-border/60 bg-card/80 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand/5 hover:border-primary/30"
                >
                  <div className="flex items-center justify-center size-10 rounded-lg bg-brand-gradient/10 text-primary shrink-0">
                    <Folders className="size-5" aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[14px] font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {cs.title}
                    </h3>
                    <p className="text-[12px] text-muted-foreground mt-0.5">
                      {t("detail.caseStudies.readCaseStudy")}
                    </p>
                  </div>
                  <ArrowUpRight
                    className="size-4 rtl:rotate-180 text-muted-foreground group-hover:text-primary shrink-0 transition-colors"
                    aria-hidden="true"
                  />
                </Link>
              ))}
            </div>
            {area.case_studies &&
              area.case_studies.length > resolvedCaseStudies.length &&
              resolvedCaseStudies.length > 0 && (
                <div className="mt-3 text-center">
                  <Link
                    href="/case-studies"
                    className="inline-flex items-center gap-1 text-[13px] font-medium text-primary hover:underline"
                  >
                    {t("detail.caseStudies.viewAll")}
                    <ArrowUpRight
                      className="size-3.5 rtl:rotate-180"
                      aria-hidden="true"
                    />
                  </Link>
                </div>
              )}
          </section>
        )}

        {/* Bottom CTA */}
        <section className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/70 backdrop-blur-sm p-8 sm:p-10 text-center">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-br from-[#0ab8fb]/5 via-transparent to-[#324b9d]/5"
          />
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#0ab8fb]/20 bg-[#0ab8fb]/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#0a9fdf] mb-4">
            <Sparkles className="size-3" aria-hidden="true" />
            {t("detail.cta.eyebrow")}
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
            {t("detail.cta.title", { name: displayName.toLowerCase() })}
          </h2>
          <p className="text-[14px] text-muted-foreground mb-6 max-w-md mx-auto leading-relaxed">
            {t("detail.cta.description")}
          </p>
          <Link
            href="/crm/quote"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-gradient text-white px-6 py-3 text-[14px] font-semibold shadow-brand hover:opacity-90 transition-opacity"
          >
            {t("detail.cta.quote")}
            <ArrowUpRight
              className="size-4 rtl:rotate-180"
              aria-hidden="true"
            />
          </Link>
        </section>
      </article>
      <FooterSection />
    </div>
  );
}
