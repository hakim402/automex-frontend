"use client";

import { useTranslations, useLocale } from "next-intl";
import {
  ArrowRight,
  CheckCircle2,
  Lightbulb,
  Shield,
  Zap,
  ChevronDown,
  ExternalLink,
  Cpu,
  BrainCircuit,
  Database,
  Cloud,
  Palette,
  Users,
  Server,
  Sparkles,
  MessageSquare,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { SafeHTML } from "@/components/shared/SafeHTML";
import { cn } from "@/lib/utils";
import type { SupportedLocale } from "@/lib/locale";
import type { ServiceDetail, ServiceListItem } from "@/lib/automex/types";

// ─── Icon map (shared with listing page) ──────────────────────────────────

const ICON_MAP: Record<string, LucideIcon> = {
  cpu: Cpu,
  "brain-circuit": BrainCircuit,
  bot: BrainCircuit,
  database: Database,
  cloud: Cloud,
  palette: Palette,
  users: Users,
  server: Server,
};

function resolveIcon(icon?: string): LucideIcon {
  if (!icon) return Sparkles;
  return ICON_MAP[icon.replace(/^lucide:/, "")] ?? Sparkles;
}

// ─── Feature / Benefit icons ──────────────────────────────────────────────

const featureIcons = [Zap, Shield, Lightbulb, CheckCircle2] as const;

interface Props {
  service: ServiceDetail;
  relatedServices: ServiceListItem[];
  locale: SupportedLocale;
}

export function ServiceDetailClient({
  service,
  relatedServices,
  locale,
}: Props) {
  const t = useTranslations("ServiceDetail");
  const Icon = resolveIcon(service.icon);

  const isRtl = ["ar", "fa", "ps"].includes(locale);

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="min-h-screen">
      {/* ═══════════════════════════════════════════════════════════
                           1. HERO SECTION
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative isolate overflow-hidden">
        {/* Animated background */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(ellipse_80%_40%_at_50%_0%,rgb(10_184_251/15%),transparent)] dark:bg-[radial-gradient(ellipse_80%_40%_at_50%_0%,rgb(10_184_251/10%),transparent)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgb(148_198_233/0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgb(148_198_233/0.04)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,black,transparent)]"
        />

        <div className="mx-auto max-w-7xl px-4 py-20 sm:py-28 lg:py-32">
          <div className="flex flex-col items-center text-center gap-6">
            {/* Category badge */}
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[12px] font-medium text-primary">
              <Icon className="size-3.5" aria-hidden="true" />
              {service.category.name}
            </span>

            <h1 className="max-w-3xl text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              {service.name}
            </h1>

            <p className="max-w-2xl text-[15px] leading-relaxed text-muted-foreground sm:text-base">
              {service.short_description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <Button asChild size="lg">
                <Link
                  href={{
                    pathname: "/crm/quote",
                    query: { service: service.id },
                  }}
                >
                  {t("hero.ctaQuote")}
                  <ArrowRight
                    className="size-4 rtl:rotate-180"
                    aria-hidden="true"
                  />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/crm/book-a-call">
                  {t("hero.ctaBooking")}
                  <MessageSquare
                    className="size-4 rtl:rotate-180"
                    aria-hidden="true"
                  />
                </Link>
              </Button>
            </div>

            {/* Hero image */}
            {service.hero_image?.url && (
              <div className="mt-10 w-full max-w-4xl overflow-hidden rounded-2xl border border-border/40 shadow-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={service.hero_image.url}
                  alt={service.hero_image.alt_text || service.name}
                  className="h-auto w-full object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
                        2. OVERVIEW
      ═══════════════════════════════════════════════════════════ */}
      {service.overview && (
        <section className="mx-auto max-w-4xl px-4 py-16 sm:py-20">
          <div className="rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm p-8 sm:p-10">
            <h2 className="mb-4 text-xl font-semibold text-foreground">
              {t("overview.title")}
            </h2>
            <SafeHTML html={service.overview} />
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
                     3. PROBLEMS WE SOLVE
      ═══════════════════════════════════════════════════════════ */}
      {service.problems_we_solve && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
          <div className="mb-10 text-center">
            <p className="mb-2 text-[13px] font-semibold uppercase tracking-wider text-primary">
              {t("problems.eyebrow")}
            </p>
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              {t("problems.title")}
            </h2>
          </div>
          <SafeHTML
            html={service.problems_we_solve}
            className="mx-auto max-w-4xl rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm p-8 sm:p-10"
          />
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
                        4. FEATURES
      ═══════════════════════════════════════════════════════════ */}
      {service.features && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
          <div className="mb-10 text-center">
            <p className="mb-2 text-[13px] font-semibold uppercase tracking-wider text-primary">
              {t("features.eyebrow")}
            </p>
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              {t("features.title")}
            </h2>
          </div>

          {/* If HTML, render as HTML; otherwise split by newlines into cards */}
          {/<[a-z][\s\S]*>/i.test(service.features) ? (
            <SafeHTML
              html={service.features}
              className="mx-auto max-w-4xl rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm p-8 sm:p-10"
            />
          ) : (
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {service.features
                .split("\n")
                .filter(Boolean)
                .map((feature, i) => {
                  const Icon = featureIcons[i % featureIcons.length];
                  return (
                    <div
                      key={i}
                      className="group flex gap-3 rounded-xl border border-border/60 bg-card/80 backdrop-blur-sm p-5 transition-colors hover:border-primary/40"
                    >
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="size-4" aria-hidden="true" />
                      </div>
                      <p className="text-[14px] leading-relaxed text-muted-foreground">
                        {feature.trim()}
                      </p>
                    </div>
                  );
                })}
            </div>
          )}
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
                        5. BENEFITS
      ═══════════════════════════════════════════════════════════ */}
      {service.benefits && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
          <div className="mb-10 text-center">
            <p className="mb-2 text-[13px] font-semibold uppercase tracking-wider text-primary">
              {t("benefits.eyebrow")}
            </p>
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              {t("benefits.title")}
            </h2>
          </div>

          {/<[a-z][\s\S]*>/i.test(service.benefits) ? (
            <SafeHTML
              html={service.benefits}
              className="mx-auto max-w-4xl rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm p-8 sm:p-10"
            />
          ) : (
            <div className="mx-auto grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-2">
              {service.benefits
                .split("\n")
                .filter(Boolean)
                .map((benefit, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-lg p-3"
                  >
                    <CheckCircle2
                      className="mt-0.5 size-4 shrink-0 text-emerald-500"
                      aria-hidden="true"
                    />
                    <span className="text-[14px] leading-relaxed text-muted-foreground">
                      {benefit.trim()}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
                     6. TECHNOLOGIES
      ═══════════════════════════════════════════════════════════ */}
      {service.technologies && service.technologies.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
          <div className="mb-10 text-center">
            <p className="mb-2 text-[13px] font-semibold uppercase tracking-wider text-primary">
              {t("technologies.eyebrow")}
            </p>
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              {t("technologies.title")}
            </h2>
          </div>

          <div className="mx-auto flex max-w-4xl flex-wrap justify-center gap-3">
            {service.technologies.map((tech) => {
              const TechIcon = resolveIcon(tech.icon);
              return (
                <div
                  key={tech.id}
                  className="flex items-center gap-2 rounded-full border border-border/60 bg-card/80 backdrop-blur-sm px-4 py-2 text-[13px] font-medium text-foreground transition-colors hover:border-primary/40"
                >
                  <TechIcon
                    className="size-3.5 text-primary"
                    aria-hidden="true"
                  />
                  {tech.name}
                  {tech.website_url && (
                    <a
                      href={tech.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-1 text-muted-foreground hover:text-primary"
                      aria-label={`${tech.name} website`}
                    >
                      <ExternalLink className="size-3" />
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
                     7. INDUSTRIES
      ═══════════════════════════════════════════════════════════ */}
      {service.industries && service.industries.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
          <div className="mb-10 text-center">
            <p className="mb-2 text-[13px] font-semibold uppercase tracking-wider text-primary">
              {t("industries.eyebrow")}
            </p>
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              {t("industries.title")}
            </h2>
          </div>

          <div className="mx-auto flex max-w-4xl flex-wrap justify-center gap-3">
            {service.industries.map((industry) => {
              const IndIcon = resolveIcon(industry.icon);
              return (
                <div
                  key={industry.id}
                  className="flex items-center gap-2 rounded-xl border border-border/60 bg-card/80 backdrop-blur-sm px-5 py-3 transition-colors hover:border-primary/40"
                >
                  <IndIcon className="size-4 text-primary" aria-hidden="true" />
                  <div>
                    <p className="text-[14px] font-medium text-foreground">
                      {industry.name}
                    </p>
                    {industry.description && (
                      <p className="text-[12px] text-muted-foreground">
                        {industry.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
                        8. FAQ
      ═══════════════════════════════════════════════════════════ */}
      {service.faqs &&
        (() => {
          // faqs comes as a JSON string OR an already-parsed array from the API
          let faqItems: { question: string; answer: string }[] = [];

          if (Array.isArray(service.faqs)) {
            // Already parsed (actual API behavior)
            faqItems = service.faqs as unknown as { question: string; answer: string }[];
          } else if (typeof service.faqs === "string") {
            try {
              const parsed = JSON.parse(service.faqs);
              if (Array.isArray(parsed)) faqItems = parsed;
            } catch {
              // Plain-text fallback: each double-newline block as a Q&A pair
              const blocks = service.faqs.split(/\n{2,}/).filter(Boolean);
              for (let i = 0; i < blocks.length; i += 2) {
                faqItems.push({
                  question: blocks[i]?.trim() ?? "",
                  answer: blocks[i + 1]?.trim() ?? "",
                });
              }
            }
          }

          if (faqItems.length === 0) return null;

          return (
            <section className="mx-auto max-w-3xl px-4 py-16 sm:py-20">
              <div className="mb-10 text-center">
                <p className="mb-2 text-[13px] font-semibold uppercase tracking-wider text-primary">
                  {t("faq.eyebrow")}
                </p>
                <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
                  {t("faq.title")}
                </h2>
              </div>
              <div className="space-y-3">
                {faqItems.map((faq, i) => (
                  <details
                    key={i}
                    className="group rounded-xl border border-border/60 bg-card/80 backdrop-blur-sm"
                  >
                    <summary className="flex cursor-pointer items-center justify-between p-5 text-[15px] font-medium text-foreground [&::-webkit-details-marker]:hidden">
                      {faq.question}
                      <ChevronDown
                        className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
                        aria-hidden="true"
                      />
                    </summary>
                    <div className="px-5 pb-5">
                      <SafeHTML html={faq.answer} />
                    </div>
                  </details>
                ))}
              </div>
            </section>
          );
        })()}

      {/* ═══════════════════════════════════════════════════════════
                    9. RELATED SERVICES
      ═══════════════════════════════════════════════════════════ */}
      {relatedServices.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
          <div className="mb-10 text-center">
            <p className="mb-2 text-[13px] font-semibold uppercase tracking-wider text-primary">
              {t("related.eyebrow")}
            </p>
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              {t("related.title")}
            </h2>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relatedServices.map((rel) => {
              const RelIcon = resolveIcon(rel.icon);
              return (
                <Link
                  key={rel.id}
                  href={{ pathname: '/services/[slug]', params: { slug: rel.slug } }}
                  className="group flex flex-col gap-3 rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm p-6 transition-all hover:border-primary/50 hover:shadow-lg"
                >
                  <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <RelIcon className="size-5" aria-hidden="true" />
                  </div>
                  <h3 className="text-[15px] font-semibold text-foreground group-hover:text-primary transition-colors">
                    {rel.name}
                  </h3>
                  <p className="text-[13px] leading-relaxed text-muted-foreground">
                    {rel.short_description}
                  </p>
                  <span className="inline-flex items-center gap-1 text-[13px] font-medium text-primary">
                    {t("related.cta")}
                    <ArrowRight
                      className="size-3.5 rtl:rotate-180"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
                       10. BOTTOM CTA
      ═══════════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:pb-28">
        <div className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 p-8 sm:p-12 text-center">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgb(10_184_251/8%),transparent)]"
          />
          <h2 className="mb-3 text-2xl font-bold text-foreground sm:text-3xl">
            {t("cta.title")}
          </h2>
          <p className="mb-6 text-[14px] text-muted-foreground sm:text-base">
            {t("cta.description")}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link
                href={{
                  pathname: "/crm/quote",
                  query: { service: service.id },
                }}
              >
                {t("cta.primary")}
                <ArrowRight
                  className="size-4 rtl:rotate-180"
                  aria-hidden="true"
                />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/crm/book-a-call">{t("cta.secondary")}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
