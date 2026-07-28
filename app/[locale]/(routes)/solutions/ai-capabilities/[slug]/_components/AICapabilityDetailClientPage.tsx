"use client";

// app/[locale]/(routes)/solutions/ai-capablity/slug/_components/AICapabilityDetailClientPage.tsx

import { useTranslations } from "next-intl";
import {
  ExternalLink,
  Sparkles,
  Layers,
  Cpu,
  ArrowUpRight,
  BadgeCheck,
  FlaskConical,
  Rocket,
  Beaker,
  type LucideIcon,
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import type { AICapability, ServiceListItem } from "@/lib/automex/types";
import { sanitizeRichHtml } from "@/lib/automex/rich-content";
import { MediaImage } from "@/components/MediaImage";
import { FooterSection } from "@/app/[locale]/_components/Footer/FooterSections";

const MATURITY_COLORS: Record<string, string> = {
  research: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  production: "bg-green-500/10 text-green-500 border-green-500/20",
  experimental: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
};

const MATURITY_ICONS: Record<string, LucideIcon> = {
  research: Beaker,
  production: Rocket,
  experimental: FlaskConical,
};

function resolveLucideIcon(iconName: string | undefined): LucideIcon {
  if (!iconName) return Cpu;
  const name = iconName.startsWith("lucide:") ? iconName.slice(7) : iconName;
  const pascal = name
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join("");
  const map = LucideIcons as unknown as Record<string, LucideIcon>;
  return map[pascal] || Cpu;
}

function BlueprintGrid({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 -z-10", className)}
      style={{
        backgroundImage:
          "radial-gradient(circle, currentColor 1px, transparent 1px)",
        backgroundSize: "22px 22px",
        color: "var(--border)",
        opacity: 0.35,
        maskImage:
          "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)",
      }}
    />
  );
}

function SectionHeading({
  icon: Icon,
  children,
  count,
}: {
  icon: LucideIcon;
  children: React.ReactNode;
  count?: number;
}) {
  return (
    <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
      <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
        <Icon className="size-4" aria-hidden="true" />
      </span>
      {children}
      {typeof count === "number" && (
        <span className="text-[13px] font-normal text-muted-foreground">
          ({count})
        </span>
      )}
    </h2>
  );
}

export function AICapabilityDetailClientPage({
  capability: cap,
  relatedServices,
}: {
  capability: AICapability;
  relatedServices: ServiceListItem[];
}) {
  const t = useTranslations("AICapabilities");
  const CapIcon = resolveLucideIcon(cap.icon);
  const MaturityIcon = cap.maturity_level
    ? (MATURITY_ICONS[cap.maturity_level] ?? BadgeCheck)
    : null;

  const maturityLabel = cap.maturity_level
    ? (() => {
        try {
          return t(`detail.maturity.${cap.maturity_level}` as any);
        } catch {
          return cap.maturity_level_display || cap.maturity_level;
        }
      })()
    : null;

  const sanitizedDescription = sanitizeRichHtml(cap.description);

  return (
    <>
      <div className="relative overflow-hidden mt-10 md:mt-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
        >
          <div className="absolute -top-24 right-0 size-112.5 rounded-full bg-[#0ab8fb]/3 blur-3xl" />
          <div className="absolute top-1/3 -left-32 size-87.5 rounded-full bg-[#324b9d]/3 blur-3xl" />
        </div>

        <article className="mx-auto max-w-4xl px-4 py-16 sm:py-24">
          {/* ─── Cover Image ─────────────────────────────── */}
          {cap.cover_image?.url && (
            <figure className="relative mb-8 rounded-2xl overflow-hidden border border-border/30 shadow-brand h-72 sm:h-96">
              <MediaImage
                src={cap.cover_image.url}
                alt={cap.cover_image.alt_text || cap.name}
                fallbackIcon={CapIcon}
              />
              <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-background/20 to-transparent pointer-events-none" />
            </figure>
          )}

          {/* ─── Title with Icon ─────────────────────────── */}
          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground tracking-tight leading-tight">
              {cap.name}
            </h1>
          </div>

          {/* ─── Category + maturity badges ────────────────────── */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
              <Layers className="size-3" aria-hidden="true" />
              {cap.category_display}
            </span>
            {maturityLabel && MaturityIcon && (
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full border text-[10px] font-semibold px-2.5 py-1",
                  MATURITY_COLORS[cap.maturity_level || ""] ||
                    "bg-muted/50 text-muted-foreground border-border/20",
                )}
              >
                <MaturityIcon className="size-3" aria-hidden="true" />
                {maturityLabel}
              </span>
            )}
            {cap.is_active && (
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 text-[10px] font-semibold px-2.5 py-1">
                <BadgeCheck className="size-3" aria-hidden="true" />
                Active
              </span>
            )}
          </div>

          {/* ─── Description (sanitized rich HTML) ──────────────── */}
          {sanitizedDescription && (
            <section className="mb-10 rounded-2xl border border-border/30 bg-card/40 backdrop-blur-sm p-6 sm:p-8">
              <SectionHeading icon={Sparkles}>
                {t("detail.about")}
              </SectionHeading>
              <div
                className="prose-content prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-foreground prose-ul:text-muted-foreground prose-li:text-muted-foreground prose-blockquote:border-primary prose-blockquote:bg-muted/30 prose-blockquote:p-4 prose-blockquote:rounded-xl prose-pre:bg-muted/50 prose-code:text-primary prose-code:bg-muted/30 prose-code:px-1 prose-code:py-0.5 prose-code:rounded"
                dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
              />
            </section>
          )}

          {/* ─── Technologies ────────────────────────────────────── */}
          {cap.technologies.length > 0 && (
            <section className="mb-10">
              <SectionHeading icon={Cpu}>
                {t("detail.technologies")}
              </SectionHeading>
              <div className="flex flex-wrap gap-2">
                {cap.technologies.map((tech) => {
                  const TechIcon = resolveLucideIcon(tech.icon);
                  const chip = (
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-border/40 bg-muted/30 px-2.5 py-1.5 text-[12px] text-foreground/80 hover:border-primary/30 hover:bg-muted/50 transition-colors">
                      <TechIcon
                        className="size-3.5 shrink-0"
                        aria-hidden="true"
                      />
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

          {/* ─── Related Services ────────────────────────────────── */}
          {relatedServices.length > 0 && (
            <section className="mb-10">
              <SectionHeading icon={Layers} count={relatedServices.length}>
                {t("detail.relatedServices")}
              </SectionHeading>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {relatedServices.map((service) => {
                  const ServiceIcon = resolveLucideIcon(service.icon);
                  return (
                    <Link
                      key={service.id}
                      href={`/services/${service.slug}` as any}
                      className="group flex items-start gap-3 rounded-xl border border-border/40 bg-card/50 backdrop-blur-sm p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:shadow-brand/5 hover:border-primary/40"
                    >
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-gradient/5 text-primary/60 mt-0.5">
                        <ServiceIcon className="size-4" aria-hidden="true" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                          {service.name}
                        </h3>
                        {service.short_description && (
                          <p className="text-[12px] text-muted-foreground leading-relaxed line-clamp-2">
                            {service.short_description}
                          </p>
                        )}
                      </div>
                      <ArrowUpRight
                        className="size-3.5 shrink-0 text-muted-foreground/40 group-hover:text-primary transition-colors mt-1"
                        aria-hidden="true"
                      />
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {/* ─── Demo URL ────────────────────────────────────────── */}
          {cap.demo_url && (
            <section className="mb-10">
              <a
                href={cap.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-5 py-3 text-[14px] font-medium text-primary hover:bg-primary/10 hover:border-primary/50 transition-all"
              >
                <ExternalLink
                  className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
                {t("detail.demo")}
              </a>
            </section>
          )}

          {/* ─── Bottom CTA ──────────────────────────────────────── */}
          <section className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/70 backdrop-blur-sm p-8 sm:p-10 text-center">
            <BlueprintGrid />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-br from-[#0ab8fb]/5 via-transparent to-[#324b9d]/5"
            />
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
              className="inline-flex items-center gap-2 rounded-lg bg-brand-gradient text-white px-6 py-3 text-[14px] font-semibold shadow-brand hover:opacity-90 hover:scale-105 transition-all"
            >
              {t("detail.cta.quote")}
            </Link>
          </section>
        </article>
      </div>
      <FooterSection />
    </>
  );
}
