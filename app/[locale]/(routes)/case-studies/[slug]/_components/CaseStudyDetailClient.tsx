"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Calendar,
  Cpu,
  ExternalLink,
  Lightbulb,
  Sparkles,
  Target,
  Trophy,
  X,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/routing";
import { SafeHTML } from "@/components/shared/SafeHTML";
import type { SupportedLocale } from "@/lib/locale";
import type { CaseStudyDetail, CaseStudyListItem, Technology } from "@/lib/automex/types";

// ─── Tech icon map (same as ServiceDetail) ─────────────────────────────

const ICON_MAP: Record<string, LucideIcon> = {
  cpu: Cpu,
  "brain-circuit": Sparkles,
  bot: Sparkles,
  database: Cpu,
  cloud: Cpu,
  palette: Cpu,
  users: Cpu,
  server: Cpu,
};

function resolveIcon(icon?: string): LucideIcon {
  if (!icon) return Sparkles;
  return ICON_MAP[icon.replace(/^lucide:/, "")] ?? Sparkles;
}

// ─── Safe text resolver ───────────────────────────────────────────────

function resolveText(value: unknown): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.filter((v) => typeof v === "string").join("\n\n");
  return "";
}

// ─── Props ────────────────────────────────────────────────────────────

interface CaseStudyDetailClientProps {
  caseStudy: CaseStudyDetail;
  relatedCaseStudies: CaseStudyListItem[];
  locale: SupportedLocale;
}

// ─── Gallery lightbox ─────────────────────────────────────────────────

function GallerySection({ caseStudy, t }: { caseStudy: CaseStudyDetail; t: ReturnType<typeof useTranslations<"CaseStudyDetail">> }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!caseStudy.gallery || caseStudy.gallery.length === 0) return null;

  const images = caseStudy.gallery;

  function close() {
    setLightboxIndex(null);
  }

  function prev() {
    setLightboxIndex((i) => (i == null ? null : i > 0 ? i - 1 : images.length - 1));
  }

  function next() {
    setLightboxIndex((i) => (i == null ? null : i < images.length - 1 ? i + 1 : 0));
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
      <div className="mb-10 text-center">
        <p className="mb-2 text-[13px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
          {t("gallery.eyebrow")}
        </p>
        <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
          {t("gallery.title")}
        </h2>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((img, i) => (
          <button
            key={img.id}
            onClick={() => setLightboxIndex(i)}
            className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-border/60 bg-muted transition-all hover:border-emerald-500/40"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.media.url ?? ""}
              alt={img.caption || caseStudy.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {img.caption && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-[12px] text-white">{img.caption}</p>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIndex != null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={close}
          role="dialog"
          aria-modal="true"
        >
          <div className="relative mx-4 max-h-[90vh] max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={close}
              className="absolute -top-10 right-0 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
              aria-label={t("gallery.close")}
            >
              <X className="size-5" />
            </button>

            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
              aria-label={t("gallery.previous")}
            >
              <ArrowLeft className="size-5" />
            </button>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[lightboxIndex].media.url ?? ""}
              alt={images[lightboxIndex].caption || caseStudy.title}
              className="max-h-[85vh] max-w-full rounded-xl object-contain"
            />

            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
              aria-label={t("gallery.next")}
            >
              <ArrowRight className="size-5" />
            </button>

            {images[lightboxIndex].caption && (
              <p className="mt-3 text-center text-[13px] text-white/80">{images[lightboxIndex].caption}</p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

// ─── Main Component ───────────────────────────────────────────────────

export function CaseStudyDetailClient({
  caseStudy,
  relatedCaseStudies,
  locale,
}: CaseStudyDetailClientProps) {
  const t = useTranslations("CaseStudyDetail");
  const isRtl = ["ar", "fa", "ps"].includes(locale);

  const thumbUrl = caseStudy.thumbnail?.url;
  const logoUrl = caseStudy.client_logo?.url;
  const techCount = caseStudy.technologies?.length ?? 0;
  const overview = resolveText(caseStudy.overview);
  const challenge = resolveText(caseStudy.challenge);
  const solution = resolveText(caseStudy.solution);
  const results = resolveText(caseStudy.results);

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="min-h-screen">
      {/* ═══════════════════════════════════════════════════════════
                          HERO
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative isolate overflow-hidden pb-12 pt-20 sm:pb-16 sm:pt-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 left-1/2 -z-10 -translate-x-1/2 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div className="relative aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-emerald-500 to-teal-600 opacity-20 sm:w-[72.1875rem]" />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgb(148_198_233/0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgb(148_198_233/0.04)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,black,transparent)]"
        />

        <div className="mx-auto max-w-4xl px-4">
          {/* Back link */}
          <Link
            href="/case-studies"
            className="mb-8 inline-flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden="true" />
            {t("backToCaseStudies")}
          </Link>

          {/* Industry badge */}
          <div className="mb-4 flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1 text-[12px] font-medium text-emerald-600 dark:text-emerald-400">
              <Building2 className="size-3.5" aria-hidden="true" />
              {caseStudy.client_industry.name}
            </span>
            {caseStudy.is_featured && (
              <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                {t("featuredBadge")}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {caseStudy.title}
          </h1>

          {/* Client name */}
          {caseStudy.client_name && (
            <p className="mt-3 text-[15px] text-muted-foreground">
              {t("hero.clientLabel")}: {caseStudy.client_name}
            </p>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
                      COVER IMAGE + CLIENT LOGO
      ═══════════════════════════════════════════════════════════ */}
      {thumbUrl && (
        <section className="mx-auto max-w-4xl px-4 pb-6">
          <div className="relative overflow-hidden rounded-2xl border border-border/40 shadow-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={thumbUrl}
              alt={caseStudy.thumbnail?.alt_text || caseStudy.title}
              className="h-auto w-full object-cover"
            />
            {/* Client logo overlay */}
            {logoUrl && (
              <div className="absolute bottom-4 right-4 rounded-xl bg-white/90 dark:bg-black/80 p-3 shadow-lg backdrop-blur-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logoUrl}
                  alt={caseStudy.client_logo?.alt_text || caseStudy.client_name || ""}
                  className="h-8 w-auto object-contain"
                />
              </div>
            )}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
                      STATS BAR
      ═══════════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-4xl px-4 pb-12">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {caseStudy.project_duration_weeks != null && (
            <div className="flex flex-col items-center gap-1 rounded-xl border border-border/60 bg-card/80 backdrop-blur-sm p-4 text-center">
              <Calendar className="size-5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
              <p className="text-lg font-bold text-foreground">{caseStudy.project_duration_weeks}</p>
              <p className="text-[11px] text-muted-foreground">{t("stats.weeks")}</p>
            </div>
          )}
          {techCount > 0 && (
            <div className="flex flex-col items-center gap-1 rounded-xl border border-border/60 bg-card/80 backdrop-blur-sm p-4 text-center">
              <Cpu className="size-5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
              <p className="text-lg font-bold text-foreground">{techCount}</p>
              <p className="text-[11px] text-muted-foreground">{t("stats.technologies")}</p>
            </div>
          )}
          <div className="flex flex-col items-center gap-1 rounded-xl border border-border/60 bg-card/80 backdrop-blur-sm p-4 text-center">
            <Building2 className="size-5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
            <p className="text-lg font-bold text-foreground">{caseStudy.client_industry.name}</p>
            <p className="text-[11px] text-muted-foreground">{t("stats.industry")}</p>
          </div>
          {caseStudy.project_url && (
            <div className="flex flex-col items-center gap-1 rounded-xl border border-border/60 bg-card/80 backdrop-blur-sm p-4 text-center">
              <ExternalLink className="size-5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
              <a
                href={caseStudy.project_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] font-medium text-primary hover:underline"
              >
                {t("stats.liveUrl")}
              </a>
              <p className="text-[11px] text-muted-foreground">{t("stats.viewProject")}</p>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
                      OVERVIEW
      ═══════════════════════════════════════════════════════════ */}
      {overview && (
        <section className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
          <div className="mb-6">
            <p className="mb-2 text-[13px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              {t("overview.eyebrow")}
            </p>
            <h2 className="text-2xl font-bold text-foreground">{t("overview.title")}</h2>
          </div>
          <div className="rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm p-6 sm:p-8">
            <SafeHTML html={overview} />
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
                      CHALLENGE
      ═══════════════════════════════════════════════════════════ */}
      {challenge && (
        <section className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-rose-500/10 text-rose-500">
              <Target className="size-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-[13px] font-semibold uppercase tracking-wider text-rose-500">
                {t("challenge.eyebrow")}
              </p>
              <h2 className="text-xl font-bold text-foreground">{t("challenge.title")}</h2>
            </div>
          </div>
          <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 backdrop-blur-sm p-6 sm:p-8">
            <SafeHTML html={challenge} />
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
                      SOLUTION
      ═══════════════════════════════════════════════════════════ */}
      {solution && (
        <section className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
              <Lightbulb className="size-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-[13px] font-semibold uppercase tracking-wider text-amber-500">
                {t("solution.eyebrow")}
              </p>
              <h2 className="text-xl font-bold text-foreground">{t("solution.title")}</h2>
            </div>
          </div>
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 backdrop-blur-sm p-6 sm:p-8">
            <SafeHTML html={solution} />
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
                      RESULTS
      ═══════════════════════════════════════════════════════════ */}
      {results && (
        <section className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
              <Trophy className="size-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-[13px] font-semibold uppercase tracking-wider text-emerald-500">
                {t("results.eyebrow")}
              </p>
              <h2 className="text-xl font-bold text-foreground">{t("results.title")}</h2>
            </div>
          </div>
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-sm p-6 sm:p-8">
            <SafeHTML html={results} />
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
                      TECHNOLOGY STACK
      ═══════════════════════════════════════════════════════════ */}
      {caseStudy.technologies && caseStudy.technologies.length > 0 && (
        <section className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
          <div className="mb-8 text-center">
            <p className="mb-2 text-[13px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              {t("technologies.eyebrow")}
            </p>
            <h2 className="text-2xl font-bold text-foreground">{t("technologies.title")}</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {(caseStudy.technologies as Technology[]).map((tech) => {
              const TechIcon = resolveIcon(tech.icon);
              return (
                <div
                  key={tech.id}
                  className="flex items-center gap-2 rounded-full border border-border/60 bg-card/80 backdrop-blur-sm px-4 py-2 text-[13px] font-medium text-foreground transition-colors hover:border-emerald-500/40"
                >
                  <TechIcon className="size-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                  {tech.name}
                  {tech.website_url && (
                    <a
                      href={tech.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-1 text-muted-foreground hover:text-emerald-600"
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
                      GALLERY
      ═══════════════════════════════════════════════════════════ */}
      <GallerySection caseStudy={caseStudy} t={t} />

      {/* ═══════════════════════════════════════════════════════════
                      RELATED CASE STUDIES
      ═══════════════════════════════════════════════════════════ */}
      {relatedCaseStudies.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:pb-20">
          <div className="mb-8 text-center">
            <p className="mb-2 text-[13px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              {t("related.eyebrow")}
            </p>
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              {t("related.title")}
            </h2>
          </div>
          <div className="mx-auto grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2">
            {relatedCaseStudies.map((cs) => {
              const relThumb = cs.thumbnail?.url;
              return (
                <Link
                  key={cs.id}
                  href={{ pathname: "/case-studies/[slug]", params: { slug: cs.slug } }}
                  className="group flex gap-4 rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm p-4 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-lg"
                >
                  <div className="h-24 w-28 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-emerald-500/10 to-teal-500/5">
                    {relThumb ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={relThumb}
                        alt={cs.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Building2 className="size-6 text-muted-foreground/30" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col justify-center gap-1">
                    <h3 className="text-[14px] font-semibold text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                      {cs.title}
                    </h3>
                    {cs.client_name && (
                      <p className="text-[12px] text-muted-foreground">{cs.client_name}</p>
                    )}
                    <span className="text-[12px] font-medium text-emerald-600 dark:text-emerald-400">
                      {t("related.readCaseStudy")}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
                      BOTTOM CTA
      ═══════════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:pb-28">
        <div className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/20 p-8 sm:p-12 text-center">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgb(16_185_129/8%),transparent)]"
          />
          <h2 className="mb-3 text-2xl font-bold text-foreground sm:text-3xl">
            {t("cta.title")}
          </h2>
          <p className="mb-6 text-[14px] text-muted-foreground sm:text-base">
            {t("cta.description")}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/crm/quote">
                {t("cta.primary")}
                <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
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
