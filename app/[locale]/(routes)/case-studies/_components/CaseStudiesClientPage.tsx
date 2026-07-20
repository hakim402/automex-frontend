"use client";

import { useState, useTransition } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  ArrowRight,
  Building2,
  Clock,
  Eye,
  Filter,
  Loader2,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/routing";
import type { SupportedLocale } from "@/lib/locale";
import type { CaseStudyListItem, Industry, ServiceListItem } from "@/lib/automex/types";

import { loadMoreCaseStudiesAction } from "../actions";

// ─── Props ────────────────────────────────────────────────────────────

interface CaseStudiesClientPageProps {
  initialCaseStudies: CaseStudyListItem[];
  hasMoreInitial: boolean;
  industries: Industry[];
  services: ServiceListItem[];
  activeIndustry?: string;
  activeService?: string;
  activeTechnology?: string;
  activeFeatured?: boolean;
  totalCount: number;
  industriesServed: number;
  technologiesCount: number;
}

// ─── Component ────────────────────────────────────────────────────────

export function CaseStudiesClientPage({
  initialCaseStudies,
  hasMoreInitial,
  industries,
  services,
  activeIndustry,
  activeService,
  activeTechnology,
  activeFeatured,
  totalCount,
  industriesServed,
  technologiesCount,
}: CaseStudiesClientPageProps) {
  const t = useTranslations("CaseStudiesPage");
  const locale = useLocale() as SupportedLocale;

  const [caseStudies, setCaseStudies] = useState(initialCaseStudies);
  const [hasMore, setHasMore] = useState(hasMoreInitial);
  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [showFilters, setShowFilters] = useState(false);

  function handleLoadMore() {
    startTransition(async () => {
      const nextPage = page + 1;
      const result = await loadMoreCaseStudiesAction(
        activeIndustry,
        activeService,
        activeTechnology,
        activeFeatured,
        nextPage,
        locale
      );
      if (result.success) {
        setCaseStudies((prev) => [...prev, ...result.data.items]);
        setHasMore(result.data.hasMore);
        setPage(nextPage);
      }
    });
  }

  const isFiltered = !!activeIndustry || !!activeService || !!activeTechnology || activeFeatured;

  return (
    <div className="min-h-screen">
      {/* ═══════════════════════════════════════════════════════════
                          HERO
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative isolate overflow-hidden pb-16 pt-20 sm:pb-20 sm:pt-28">
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

        <div className="mx-auto max-w-7xl px-4 text-center">
          <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
            {t("hero.eyebrow")}
          </p>
          <h1 className="mx-auto max-w-4xl text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {t("hero.title")}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-muted-foreground sm:text-base">
            {t("hero.description")}
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
                      STATS STRIP
      ═══════════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-4xl px-4 pb-12">
        <div className="grid grid-cols-3 gap-4 rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm p-6 text-center">
          <div>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {totalCount}
            </p>
            <p className="text-[12px] text-muted-foreground mt-1">{t("stats.caseStudies")}</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {industriesServed}
            </p>
            <p className="text-[12px] text-muted-foreground mt-1">{t("stats.industries")}</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {technologiesCount}+
            </p>
            <p className="text-[12px] text-muted-foreground mt-1">{t("stats.technologies")}</p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
                      FILTERS
      ═══════════════════════════════════════════════════════════ */}
      <div className="sticky top-[72px] z-30 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 py-3 space-y-2">
          {/* Top row: Industry pills + toggle */}
          <div className="flex items-center gap-2 overflow-x-auto min-w-max">
            <Link
              href={{ pathname: "/case-studies" }}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-[13px] font-medium transition-all",
                !isFiltered
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {t("filters.all")}
            </Link>
            {industries.slice(0, 6).map((ind) => {
              const isActive = activeIndustry === ind.slug && !activeService && !activeTechnology;
              return (
                <Link
                  key={ind.id}
                  href={{
                    pathname: "/case-studies",
                    query: { industry: ind.slug },
                  }}
                  className={cn(
                    "shrink-0 rounded-full px-4 py-2 text-[13px] font-medium transition-all",
                    isActive
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {ind.name}
                </Link>
              );
            })}

            {/* Featured toggle */}
            <Link
              href={{
                pathname: "/case-studies",
                query: activeFeatured ? {} : { featured: "true" },
              }}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-[13px] font-medium transition-all",
                activeFeatured
                  ? "bg-amber-500 text-white shadow-sm"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Eye className="mr-1 inline size-3.5" aria-hidden="true" />
              {t("filters.featured")}
            </Link>

            {/* Expand filters button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="shrink-0 gap-1.5 text-[12px]"
            >
              <Filter className="size-3.5" aria-hidden="true" />
              {t("filters.moreFilters")}
            </Button>
          </div>

          {/* Expandable filters: service dropdown */}
          {showFilters && services.length > 0 && (
            <div className="flex justify-center gap-2 pt-1 pb-1 overflow-x-auto min-w-max">
              {services.slice(0, 8).map((svc) => {
                const isActive = activeService === svc.slug;
                return (
                  <Link
                    key={svc.id}
                    href={{
                      pathname: "/case-studies",
                      query: { service: svc.slug, ...(activeIndustry ? { industry: activeIndustry } : {}) },
                    }}
                    className={cn(
                      "shrink-0 rounded-full px-3 py-1.5 text-[12px] font-medium transition-all",
                      isActive
                        ? "bg-secondary text-secondary-foreground shadow-sm"
                        : "bg-muted/30 text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {svc.name}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
                      CASE STUDY CARDS
      ═══════════════════════════════════════════════════════════ */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:py-16">
        <p className="mb-8 text-center text-[12px] text-muted-foreground">
          {t("resultsCount", { count: totalCount })}
        </p>

        {caseStudies.length === 0 ? (
          <p className="py-16 text-center text-[14px] text-muted-foreground">{t("empty")}</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {caseStudies.map((cs) => {
              const thumbUrl = cs.thumbnail?.url;

              return (
                <Link
                  key={cs.id}
                  href={{ pathname: "/case-studies/[slug]", params: { slug: cs.slug } }}
                  className="group flex flex-col rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm shadow-sm overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-[0_8px_40px_-12px_rgb(16_185_129/15%)]"
                >
                  {/* Thumbnail */}
                  <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent">
                    {thumbUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={thumbUrl}
                        alt={cs.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Building2 className="size-10 text-muted-foreground/30" aria-hidden="true" />
                      </div>
                    )}
                    {/* Hover overlay with CTA */}
                    <div className="absolute inset-0 flex items-center justify-center bg-emerald-950/60 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-4 py-2 text-[13px] font-medium text-emerald-800">
                        {t("card.readCaseStudy")}
                        <ArrowRight className="size-3.5" aria-hidden="true" />
                      </span>
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="flex flex-col flex-1 gap-2.5 p-5">
                    {/* Industry badge */}
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                        <Building2 className="size-3" aria-hidden="true" />
                        {cs.client_industry.name}
                      </span>
                      {cs.is_featured && (
                        <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                          {t("featuredBadge")}
                        </span>
                      )}
                    </div>

                    <h2 className="text-[16px] font-semibold text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                      {cs.title}
                    </h2>

                    {cs.client_name && (
                      <p className="text-[13px] text-muted-foreground">{cs.client_name}</p>
                    )}

                    {/* Meta */}
                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground pt-1 mt-auto">
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" aria-hidden="true" />
                        {cs.published_at
                          ? new Date(cs.published_at).toLocaleDateString(locale, {
                              year: "numeric",
                              month: "short",
                            })
                          : ""}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Load more */}
        {hasMore && (
          <div className="mt-12 text-center">
            <Button variant="outline" size="lg" onClick={handleLoadMore} disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  {t("loading")}
                </>
              ) : (
                t("loadMore")
              )}
            </Button>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════
                      BOTTOM CTA
      ═══════════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:pb-28">
        <div className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/20 p-8 sm:p-12 text-center">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgb(16_185_129/8%),transparent)]"
          />
          <h2 className="mb-3 text-2xl font-bold text-foreground sm:text-3xl">{t("bottomCta.title")}</h2>
          <p className="mb-6 text-[14px] text-muted-foreground sm:text-base">{t("bottomCta.description")}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/crm/quote">
                {t("bottomCta.ctaQuote")}
                <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
