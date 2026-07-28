"use client";

import { useLocale, useTranslations } from "next-intl";
import {
  ArrowLeft,
  Calendar,
  Globe,
  FolderCode,
  Sparkles,
  ExternalLink,
  Briefcase,
  Layers,
  ShieldCheck,
  ArrowUpRight,
  Server,
  Layout,
  Database,
  Cloud,
  Brain,
  Building2,
  Smartphone,
  GitBranch,
  Clock,
  Users,
  CheckCircle2,
} from "lucide-react";
import { useMemo } from "react";
import * as LucideIcons from "lucide-react";
import { Link } from "@/i18n/routing";
import { getMediaUrl } from "@/lib/env";
import { cn } from "@/lib/utils";
import type { PortfolioProjectDetailFull } from "@/lib/automex/types";

/** Resolve a lucide:icon-name string to a lucide-react component. */
function resolveLucideIcon(iconName: string | undefined): React.ElementType {
  if (!iconName) return FolderCode;
  const name = iconName.startsWith("lucide:") ? iconName.slice(7) : iconName;
  const pascal = name
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join("");
  const map = LucideIcons as unknown as Record<string, React.ElementType>;
  return map[pascal] || FolderCode;
}

// ─── Category meta for technologies ──────────────────────────────────

const CATEGORY_META: Record<
  string,
  { label: string; Icon: React.ElementType }
> = {
  backend: { label: "Backend", Icon: Server },
  frontend: { label: "Frontend", Icon: Layout },
  database: { label: "Database", Icon: Database },
  cloud: { label: "Cloud & Infrastructure", Icon: Cloud },
  ai: { label: "AI & Machine Learning", Icon: Brain },
  enterprise: { label: "Enterprise", Icon: Building2 },
  mobile: { label: "Mobile", Icon: Smartphone },
  devops: { label: "DevOps", Icon: GitBranch },
};

// ─── Sub‑components ──────────────────────────────────────────────────

function CategoryTaggedTechnologies({
  technologies,
}: {
  technologies: PortfolioProjectDetailFull["technologies"];
}) {
  const grouped = useMemo(() => {
    const map = new Map<string, typeof technologies>();
    for (const tech of technologies) {
      const cat = tech.category || "other";
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(tech);
    }
    return map;
  }, [technologies]);

  if (technologies.length === 0) return null;

  return (
    <div className="space-y-6">
      {Array.from(grouped.entries()).map(([category, techs]) => {
        const meta = CATEGORY_META[category] ?? {
          label: category.charAt(0).toUpperCase() + category.slice(1),
          Icon: FolderCode,
        };
        return (
          <div key={category}>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground/70">
              <meta.Icon className="size-4 text-primary" aria-hidden="true" />
              {meta.label}
              <span className="text-xs font-normal normal-case text-muted-foreground/50">
                ({techs.length})
              </span>
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {techs.map((tech) => {
                const TechIcon = resolveLucideIcon(tech.icon);
                const card = (
                  <div className="group flex items-start gap-3 rounded-xl border border-border/30 bg-card/60 p-4 backdrop-blur-sm transition-all hover:border-primary/30 hover:shadow-md">
                    {/* Logo / icon */}
                    <div className="shrink-0">
                      {tech.logo?.url ? (
                        <img
                          src={getMediaUrl(tech.logo.url)}
                          alt={tech.logo.alt_text || tech.name}
                          className="size-10 rounded-lg object-contain bg-muted/30"
                        />
                      ) : (
                        <span className="inline-flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <TechIcon className="size-5" />
                        </span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="truncate text-sm font-semibold text-foreground">
                          {tech.name}
                        </h4>
                        <span className="inline-flex shrink-0 rounded-full bg-muted/40 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
                          {tech.proficiency_level_display}
                        </span>
                      </div>
                      {tech.description && (
                        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                          {tech.description}
                        </p>
                      )}
                    </div>
                  </div>
                );

                return tech.website_url ? (
                  <a
                    key={tech.id}
                    href={tech.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    {card}
                  </a>
                ) : (
                  <div key={tech.id}>{card}</div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────

export function PortfolioDetailClientPage({
  project,
}: {
  project: PortfolioProjectDetailFull;
}) {
  const t = useTranslations("Portfolio");
  const locale = useLocale();

  const coverUrl = project.cover_image?.url
    ? getMediaUrl(project.cover_image.url)
    : null;
  const coverAlt = project.cover_image?.alt_text || project.title;

  return (
    <div className="relative overflow-hidden">
      {/* ─── Background decoration ─────────────────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute -top-24 right-0 size-96 rounded-full bg-primary/4 blur-3xl" />
        <div className="absolute top-1/3 -left-32 size-80 rounded-full bg-accent/30 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 size-72 rounded-full bg-primary/3 blur-3xl -translate-x-1/2" />
      </div>

      <article className="mx-auto max-w-4xl px-4 pb-16 sm:pb-24 mt-28 md:mt-40">
        {/* ─── Header ───────────────────────────────────────────── */}
        <header className="mb-8 text-center">
          {/* Badges */}
          <div className="mb-3 flex flex-wrap items-center justify-center gap-2">
            {project.is_featured && (
              <span className="inline-flex items-center gap-1 rounded-full bg-brand-gradient px-3 py-1 text-xs font-semibold text-white shadow-brand">
                <Sparkles className="size-3" aria-hidden="true" />
                {t("detail.featured")}
              </span>
            )}
            {project.industry && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary/80">
                <Briefcase className="size-3.5" aria-hidden="true" />
                {project.industry.name}
              </span>
            )}
          </div>

          <h1 className="text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-5xl">
            {project.title}
          </h1>

          {/* Meta row */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
            {project.client_name && (
              <span className="flex items-center gap-1.5">
                <Users className="size-4" aria-hidden="true" />
                {project.client_name}
              </span>
            )}
            {project.completion_year && (
              <span className="flex items-center gap-1.5">
                <Calendar className="size-4" aria-hidden="true" />
                {project.completion_year}
              </span>
            )}
            {project.project_url && (
              <a
                href={project.project_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-primary transition-colors hover:underline"
              >
                <Globe className="size-4" aria-hidden="true" />
                {t("detail.liveProject")}
                <ExternalLink className="size-3.5" aria-hidden="true" />
              </a>
            )}
          </div>
        </header>

        {/* ─── Cover Image ──────────────────────────────────────── */}
        {coverUrl && (
          <div className="mb-10 overflow-hidden rounded-2xl border border-border/20 shadow-lg">
            <img
              src={coverUrl}
              alt={coverAlt}
              className="h-auto max-h-120 w-full object-cover"
            />
          </div>
        )}

        {/* ─── Short Description ────────────────────────────────── */}
        {project.short_description && (
          <section className="mb-10">
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
              {project.short_description}
            </p>
          </section>
        )}

        {/* ─── Industry Card ────────────────────────────────────── */}
        {project.industry && (
          <section className="mb-10">
            <h2 className="mb-4 text-xl font-bold text-foreground">
              {t("detail.industry")}
            </h2>
            <Link
              href={`/industries/${project.industry.slug}` as any}
              className="group block rounded-2xl border border-border/30 bg-card/60 p-5 backdrop-blur-sm transition-all hover:border-primary/30 hover:shadow-md"
            >
              <div className="flex items-start gap-4">
                {/* Industry icon/image */}
                <div className="shrink-0">
                  {project.industry.icon_image?.url ? (
                    <img
                      src={getMediaUrl(project.industry.icon_image.url)}
                      alt={
                        project.industry.icon_image.alt_text ||
                        project.industry.name
                      }
                      className="size-12 rounded-xl object-cover"
                    />
                  ) : (
                    <span className="inline-flex size-12 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-brand">
                      {(() => {
                        const IndIcon = resolveLucideIcon(
                          project.industry.icon,
                        );
                        return <IndIcon className="size-5" />;
                      })()}
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="flex items-center gap-1.5 text-base font-semibold text-foreground transition-colors group-hover:text-primary">
                    {project.industry.name}
                    <ArrowUpRight
                      className="size-3.5 shrink-0 text-muted-foreground/40 transition-colors group-hover:text-primary"
                      aria-hidden="true"
                    />
                  </h3>
                  {project.industry.description && (
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {project.industry.description}
                    </p>
                  )}

                  {/* Compliance badges */}
                  {project.industry.compliance_standards?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {project.industry.compliance_standards
                        .slice(0, 4)
                        .map((std) => (
                          <span
                            key={std}
                            className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400"
                          >
                            <ShieldCheck
                              className="size-2.5"
                              aria-hidden="true"
                            />
                            {std}
                          </span>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* ─── Services ────────────────────────────────────────── */}
        {project.services.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-foreground">
              <Layers className="size-5 text-primary" aria-hidden="true" />
              {t("detail.services")}
              <span className="text-sm font-normal text-muted-foreground">
                ({project.services.length})
              </span>
            </h2>
            <div className="flex flex-wrap gap-2">
              {project.services.map((svc) => (
                <Link
                  key={svc.id}
                  href={`/services/${svc.slug}` as any}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border/30 bg-muted/30 px-3 py-2 text-sm text-foreground/80 transition-all hover:border-primary/30 hover:bg-muted/50 hover:text-primary"
                >
                  {svc.name}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ─── Technologies ────────────────────────────────────── */}
        {project.technologies.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-4 text-xl font-bold text-foreground">
              {t("detail.technologies")}
            </h2>
            <CategoryTaggedTechnologies technologies={project.technologies} />
          </section>
        )}

        {/* ─── Gallery ──────────────────────────────────────────── */}
        {project.gallery.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-4 text-xl font-bold text-foreground">
              {t("detail.gallery")}
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {project.gallery.map((img) => (
                <figure
                  key={img.id}
                  className="group overflow-hidden rounded-xl border border-border/20 bg-muted/20 transition-all hover:shadow-md"
                >
                  <img
                    src={getMediaUrl(img.image.url)}
                    alt={img.caption || project.title}
                    className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  {img.caption && (
                    <figcaption className="p-3 text-center text-xs text-muted-foreground">
                      {img.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          </section>
        )}

        {/* ─── Bottom CTA ──────────────────────────────────────── */}
        <section className="relative mt-12 overflow-hidden rounded-2xl border border-border/20 bg-brand-soft/40 p-8 text-center backdrop-blur-sm sm:p-10">
          <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-background/60 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary/80">
            <Sparkles className="size-3" aria-hidden="true" />
            {t("detail.cta.eyebrow")}
          </span>
          <h2 className="mb-2 text-xl font-bold text-foreground sm:text-2xl">
            {t("detail.cta.title")}
          </h2>
          <p className="mx-auto mb-6 max-w-md text-sm text-muted-foreground">
            {t("detail.cta.description")}
          </p>
          <Link
            href="/crm/quote"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-gradient px-7 py-3 text-sm font-semibold text-white shadow-brand transition-opacity hover:opacity-90"
          >
            {t("detail.cta.quote")}
            <LucideIcons.ArrowRight
              className="size-4 rtl:rotate-180"
              aria-hidden="true"
            />
          </Link>
        </section>
      </article>
    </div>
  );
}
