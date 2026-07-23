"use client";

import { ArrowLeft, Sparkles, ArrowUpRight } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import type { TechExpertiseArea } from "@/lib/automex/types";

// ─── Helpers ────────────────────────────────────────────────────────────

/** Resolve a lucide:icon-name or plain icon-name string to a lucide-react component. */
function resolveLucideIcon(iconName: string | undefined): React.ElementType {
  if (!iconName) return Sparkles;
  const name = iconName.startsWith("lucide:") ? iconName.slice(7) : iconName;
  const pascal = name
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join("");
  const map = LucideIcons as unknown as Record<string, React.ElementType>;
  return map[pascal] || Sparkles;
}

/** Title-case a slug for fallback display when name is null. */
function titleCase(slug: string): string {
  return slug
    .replace(/_/g, " ")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// ─── Component ──────────────────────────────────────────────────────────

export function TechExpertiseDetailClientPage({ area }: { area: TechExpertiseArea }) {
  const t = useTranslations("TechExpertise");
  const displayName = area.name || titleCase(area.slug);
  const AreaIcon = resolveLucideIcon(area.icon);

  return (
    <div className="relative overflow-hidden">
      {/* Background decorations */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 right-0 size-[450px] rounded-full bg-[#0ab8fb]/3 blur-3xl" />
        <div className="absolute top-1/3 -left-32 size-[350px] rounded-full bg-[#324b9d]/3 blur-3xl" />
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
        {area.category_display && (
          <div className="mb-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#0ab8fb]/20 bg-[#0ab8fb]/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#0a9fdf]">
              {area.category_display}
            </span>
          </div>
        )}

        {/* Title with icon */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tight leading-tight flex items-center gap-4 flex-wrap">
          <span
            className="inline-flex items-center justify-center size-12 sm:size-14 rounded-2xl bg-brand-gradient text-white shadow-brand shrink-0"
            aria-hidden="true"
          >
            <AreaIcon className="size-6 sm:size-7" />
          </span>
          <span className="text-brand-gradient">{displayName}</span>
        </h1>

        {/* Description */}
        {area.description && (
          <section className="mb-10">
            <h2 className="text-xl font-bold text-foreground mb-4">
              {t("detail.about")}
            </h2>
            <div className="prose text-[15px] text-muted-foreground leading-relaxed space-y-3">
              {area.description.split("\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </section>
        )}

        {/* Technologies */}
        {area.technologies.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-bold text-foreground mb-4">
              {t("detail.technologies")} ({area.technologies.length})
            </h2>
            <div className="flex flex-wrap gap-2">
              {area.technologies.map((tech) => {
                const TechIcon = resolveLucideIcon(tech.icon);
                const chip = (
                  <span
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border/40 bg-muted/30 px-2.5 py-1.5 text-[12px] text-foreground/80 hover:border-primary/30 hover:bg-muted/50 transition-colors"
                  >
                    <TechIcon className="size-3.5 shrink-0" aria-hidden="true" />
                    {tech.name}
                  </span>
                );
                return tech.website_url ? (
                  <a
                    key={tech.id}
                    href={tech.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {chip}
                  </a>
                ) : (
                  <span key={tech.id}>{chip}</span>
                );
              })}
            </div>
          </section>
        )}

        {/* Related Case Studies */}
        {area.case_studies && area.case_studies.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-bold text-foreground mb-4">
              {t("detail.caseStudies.title")}
            </h2>
            <div className="flex items-center gap-3 rounded-xl border border-border/40 bg-card/60 p-4">
              <span className="inline-flex items-center justify-center size-10 rounded-lg bg-brand-gradient-soft text-primary text-sm font-bold shrink-0">
                {area.case_studies.length}
              </span>
              <p className="text-[14px] text-muted-foreground flex-1">
                {t("detail.caseStudies.title")}
              </p>
              <Link
                href="/case-studies"
                className="inline-flex items-center gap-1 text-[13px] font-medium text-primary hover:underline shrink-0"
              >
                {t("detail.caseStudies.viewAll")}
                <ArrowUpRight className="size-3.5 rtl:rotate-180" aria-hidden="true" />
              </Link>
            </div>
          </section>
        )}

        {/* Bottom CTA */}
        <section className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/70 backdrop-blur-sm p-8 sm:p-10 text-center">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-[#0ab8fb]/5 via-transparent to-[#324b9d]/5"
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
            <ArrowUpRight className="size-4 rtl:rotate-180" aria-hidden="true" />
          </Link>
        </section>
      </article>
    </div>
  );
}
