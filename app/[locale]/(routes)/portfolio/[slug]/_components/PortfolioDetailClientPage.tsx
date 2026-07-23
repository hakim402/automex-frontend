"use client";

import { useLocale, useTranslations } from "next-intl";
import { ArrowLeft, Calendar, Globe, FolderCode, Sparkles, ExternalLink, Briefcase, Layers } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { Link } from "@/i18n/routing";
import { getMediaUrl } from "@/lib/env";
import type { PortfolioProjectDetail } from "@/lib/automex/types";

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

export function PortfolioDetailClientPage({ project }: { project: PortfolioProjectDetail }) {
  const t = useTranslations("Portfolio");
  const locale = useLocale();

  return (
    <>
      <div className="relative overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-24 right-0 size-[450px] rounded-full bg-[#0ab8fb]/3 blur-3xl" />
          <div className="absolute top-1/3 -left-32 size-[350px] rounded-full bg-[#324b9d]/3 blur-3xl" />
        </div>

        <article className="mx-auto max-w-4xl px-4 py-16 sm:py-24">
          {/* Back link */}
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="size-3.5 rtl:rotate-180" aria-hidden="true" />
            {t("detail.back")}
          </Link>

          {/* Industry + featured badge */}
          <div className="flex items-center gap-3 mb-4">
            {project.industry && (
              <span className="text-[11px] font-medium uppercase tracking-wider text-primary">
                {project.industry.name}
              </span>
            )}
            {project.is_featured && (
              <span className="inline-flex items-center gap-1 rounded-full bg-brand-gradient text-white text-[11px] font-semibold px-2.5 py-1 shadow-brand">
                <Sparkles className="size-3" aria-hidden="true" />
                {t("detail.featured")}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tight leading-tight">
            {project.title}
          </h1>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-4 text-[13px] text-muted-foreground mb-8 pb-6 border-b border-border/30">
            {project.client_name && (
              <span className="font-medium text-foreground flex items-center gap-1.5">
                <Briefcase className="size-3.5" aria-hidden="true" />
                {project.client_name}
              </span>
            )}
            {project.completion_year && (
              <span className="inline-flex items-center gap-1">
                <Calendar className="size-3.5" aria-hidden="true" />
                {project.completion_year}
              </span>
            )}
            {project.project_url && (
              <a
                href={project.project_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline"
              >
                <Globe className="size-3.5" aria-hidden="true" />
                {t("detail.liveProject")}
              </a>
            )}
          </div>

          {/* Cover image */}
          {project.cover_image?.url && (
            <figure className="relative mb-10 rounded-2xl overflow-hidden border border-border/30 shadow-brand">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getMediaUrl(project.cover_image.url)}
                alt={project.cover_image.alt_text || project.title}
                className="w-full h-auto max-h-[500px] object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
            </figure>
          )}

          {/* Description */}
          {project.short_description && (
            <section className="mb-10">
              <h2 className="text-xl font-bold text-foreground mb-4">{t("detail.about")}</h2>
              <p className="text-[15px] text-muted-foreground leading-relaxed">
                {project.short_description}
              </p>
            </section>
          )}

          {/* Services */}
          {Array.isArray(project.services) && project.services.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Layers className="size-5 text-primary" aria-hidden="true" />
                {t("detail.services")}
                <span className="text-[13px] font-normal text-muted-foreground">({project.services.length})</span>
              </h2>
              <div className="flex flex-wrap gap-2">
                {project.services.map((svc: any) => (
                  <a
                    key={svc.id || svc.slug}
                    href={`/${locale}/services/${svc.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border/40 bg-muted/30 px-3 py-2 text-[13px] text-foreground/80 hover:border-primary/30 hover:bg-muted/50 hover:text-primary transition-all"
                  >
                    {svc.name}
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* Technologies */}
          {project.technologies.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xl font-bold text-foreground mb-4">{t("detail.technologies")}</h2>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => {
                  const TechIcon = resolveLucideIcon(tech.icon);
                  const chip = (
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-border/40 bg-muted/30 px-2.5 py-1.5 text-[12px] text-foreground/80 hover:border-primary/30 hover:bg-muted/50 transition-colors">
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

          {/* Gallery */}
          {project.gallery.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xl font-bold text-foreground mb-4">{t("detail.gallery")}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {project.gallery.map((img) => (
                  <figure key={img.id} className="group rounded-xl overflow-hidden border border-border/30 bg-muted/20">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getMediaUrl(img.image.url)}
                      alt={img.caption || project.title}
                      className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {img.caption && (
                      <figcaption className="text-[12px] text-muted-foreground p-3 text-center">
                        {img.caption}
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
            </section>
          )}

          {/* Bottom CTA */}
          <section className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/70 backdrop-blur-sm p-8 sm:p-10 text-center">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-[#0ab8fb]/5 via-transparent to-[#324b9d]/5" />
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#0ab8fb]/20 bg-[#0ab8fb]/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#0a9fdf] mb-4">
              <Sparkles className="size-3" aria-hidden="true" />
              {t("detail.cta.eyebrow")}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
              {t("detail.cta.title")}
            </h2>
            <p className="text-[14px] text-muted-foreground mb-6 max-w-md mx-auto leading-relaxed">
              {t("detail.cta.description")}
            </p>
            <Link
              href="/crm/quote"
              className="inline-flex items-center gap-2 rounded-lg bg-brand-gradient text-white px-6 py-3 text-[14px] font-semibold shadow-brand hover:opacity-90 transition-opacity"
            >
              {t("detail.cta.quote")}
            </Link>
          </section>
        </article>
      </div>
    </>
  );
}
