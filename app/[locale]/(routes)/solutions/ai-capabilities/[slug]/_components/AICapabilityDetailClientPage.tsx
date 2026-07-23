"use client";

import { useTranslations } from "next-intl";
import { ArrowLeft, ExternalLink, Sparkles, Layers, Cpu } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { Link } from "@/i18n/routing";
import { getMediaUrl } from "@/lib/env";
import { cn } from "@/lib/utils";
import type { AICapability } from "@/lib/automex/types";

const MATURITY_COLORS: Record<string, string> = {
  research: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  production: "bg-green-500/10 text-green-500 border-green-500/20",
  experimental: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
};

/** Resolve a lucide:icon-name string to a lucide-react component. */
function resolveLucideIcon(iconName: string | undefined): React.ElementType {
  if (!iconName) return Cpu;
  const name = iconName.startsWith("lucide:") ? iconName.slice(7) : iconName;
  const pascal = name
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join("");
  const map = LucideIcons as unknown as Record<string, React.ElementType>;
  return map[pascal] || Cpu;
}

export function AICapabilityDetailClientPage({ capability: cap }: { capability: AICapability }) {
  const t = useTranslations("AICapabilities");
  const CapIcon = resolveLucideIcon(cap.icon);

  function maturityLabel(level: string): string {
    try {
      return t(`detail.maturity.${level}` as any);
    } catch {
      return t(`listing.maturity.${level}` as any);
    }
  }

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
            href="/solutions/ai-capabilities"
            className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="size-3.5 rtl:rotate-180" aria-hidden="true" />
            {t("detail.back")}
          </Link>

          {/* Category + maturity */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[11px] font-medium uppercase tracking-wider text-primary">
              {cap.category_display}
            </span>
            {cap.maturity_level && (
              <span
                className={cn(
                  "inline-flex items-center rounded-full border text-[10px] font-semibold px-2 py-0.5",
                  MATURITY_COLORS[cap.maturity_level] || "bg-muted/50 text-muted-foreground border-border/20"
                )}
              >
                {maturityLabel(cap.maturity_level)}
              </span>
            )}
          </div>

          {/* Title with icon in a styled badge */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tight leading-tight flex items-center gap-4">
            <span className="inline-flex items-center justify-center size-12 sm:size-14 rounded-2xl bg-brand-gradient text-white shrink-0 shadow-brand" aria-hidden="true">
              <CapIcon className="size-6 sm:size-7" />
            </span>
            {cap.name}
          </h1>

          {/* Cover image */}
          {cap.cover_image?.url && (
            <figure className="relative mb-10 rounded-2xl overflow-hidden border border-border/30 shadow-brand">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getMediaUrl(cap.cover_image.url)}
                alt={cap.cover_image.alt_text || cap.name}
                className="w-full h-auto max-h-[500px] object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
            </figure>
          )}

          {/* Description */}
          {cap.description && (
            <section className="mb-10">
              <h2 className="text-xl font-bold text-foreground mb-4">{t("detail.about")}</h2>
              <div className="prose text-[15px] text-muted-foreground leading-relaxed space-y-3">
                {cap.description.split("\n").map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </section>
          )}

          {/* Technologies */}
          {cap.technologies.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xl font-bold text-foreground mb-4">{t("detail.technologies")}</h2>
              <div className="flex flex-wrap gap-2">
                {cap.technologies.map((tech) => {
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

          {/* Related Services */}
          {cap.related_services && cap.related_services.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Layers className="size-5 text-primary" aria-hidden="true" />
                {t("detail.relatedServices")}
                <span className="text-[13px] font-normal text-muted-foreground">({cap.related_services.length})</span>
              </h2>
            </section>
          )}

          {/* Demo URL */}
          {cap.demo_url && (
            <section className="mb-10">
              <a
                href={cap.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-5 py-3 text-[14px] font-medium text-primary hover:bg-primary/10 transition-colors"
              >
                <ExternalLink className="size-4" aria-hidden="true" />
                {t("detail.demo")}
              </a>
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
              {t("detail.cta.title", { name: cap.name })}
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
