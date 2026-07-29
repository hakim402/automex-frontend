"use client";

import { useState, useTransition, useCallback, useRef, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  Loader2,
  ArrowRight,
  Sparkles,
  Building2,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/routing";
import type { SupportedLocale } from "@/lib/locale";
import type {
  CaseStudyListItem,
  Industry,
  Technology,
} from "@/lib/automex/types";
import { getMediaUrl } from "@/lib/env";

import { loadMoreCaseStudiesAction } from "../actions";
import { FooterSection } from "@/app/[locale]/_components/Footer/FooterSections";

interface CaseStudiesClientPageProps {
  initialStudies: CaseStudyListItem[];
  hasMoreInitial: boolean;
  industries: Industry[];
  technologies: Technology[];
  activeIndustry?: string;
  activeTechnology?: string;
  totalCount: number;
}

// ─── Main Component ──────────────────────────────────────────────────

export function CaseStudiesClientPage({
  initialStudies,
  hasMoreInitial,
  industries,
  technologies,
  activeIndustry,
  activeTechnology,
  totalCount,
}: CaseStudiesClientPageProps) {
  const locale = useLocale() as SupportedLocale;
  const t = useTranslations("CaseStudies");
  const [studies, setStudies] = useState(initialStudies);
  const [hasMore, setHasMore] = useState(hasMoreInitial);
  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();

  function handleLoadMore() {
    startTransition(async () => {
      const nextPage = page + 1;
      const result = await loadMoreCaseStudiesAction(
        activeIndustry,
        undefined,
        activeTechnology,
        nextPage,
        locale,
      );
      if (result.success) {
        setStudies((prev) => [...prev, ...result.data.items]);
        setHasMore(result.data.hasMore);
        setPage(nextPage);
      }
    });
  }

  const hasActiveFilters = activeIndustry || activeTechnology;

  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute -top-24 right-0 size-112.5 rounded-full bg-[#0ab8fb]/3 blur-3xl" />
        <div className="absolute top-1/3 -left-32 size-87.5 rounded-full bg-[#324b9d]/3 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:py-24 mt-10 md:mt-20">
        {/* Hero */}
        <section className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
            <span className="text-brand-gradient">
              {t("listing.hero.headline")}
            </span>
          </h1>
          <p className="text-[15px] sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t("listing.hero.description")}
          </p>
        </section>

        <p className="text-center text-[12px] text-muted-foreground mb-10">
          {totalCount === 1
            ? t("listing.count.singular", { count: totalCount })
            : t("listing.count.plural", { count: totalCount })}
        </p>

        {/* Grid */}
        {studies.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-4 opacity-30">📂</div>
            <p className="text-[14px] text-muted-foreground">
              {t("listing.empty")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {studies.map((cs) => (
              <article
                key={cs.id}
                className="group relative flex flex-col rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm shadow-sm overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand/5 hover:border-primary/40"
              >
                <div className="relative h-44 w-full overflow-hidden bg-linear-to-br from-primary/10 via-primary/5 to-transparent">
                  {cs.thumbnail?.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={getMediaUrl(cs.thumbnail.url)}
                      alt={cs.thumbnail.alt_text || cs.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center">
                      <Building2
                        className="size-10 text-primary/30"
                        aria-hidden="true"
                      />
                    </div>
                  )}
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-card/90 via-card/40 to-transparent"
                  />
                  {cs.is_featured && (
                    <span className="absolute top-3 inset-s-3 inline-flex items-center gap-1 rounded-full bg-brand-gradient text-white text-[11px] font-semibold px-2.5 py-1 shadow-brand">
                      <Sparkles className="size-3" aria-hidden="true" />
                      {t("listing.card.featured")}
                    </span>
                  )}
                </div>

                <div className="flex flex-col flex-1 p-5 gap-2">
                  {cs.client_industry && (
                    <span className="text-[11px] font-medium uppercase tracking-wider text-primary">
                      {cs.client_industry.name}
                    </span>
                  )}
                  <h2 className="text-[16px] font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {cs.title}
                  </h2>
                  {cs.client_name && (
                    <p className="text-[13px] text-muted-foreground">
                      Client: {cs.client_name}
                    </p>
                  )}
                  <div className="mt-auto pt-3">
                    <Link
                      href={`/case-studies/${cs.slug}` as any}
                      className="inline-flex items-center gap-1 text-[13px] font-medium text-primary hover:underline"
                    >
                      {t("listing.card.readMore")}
                      <ArrowRight
                        className="size-3.5 rtl:rotate-180"
                        aria-hidden="true"
                      />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {hasMore && (
          <div className="flex justify-center mt-12">
            <Button
              variant="outline"
              size="lg"
              onClick={handleLoadMore}
              disabled={isPending}
              className="min-w-40 border-brand-gradient"
            >
              {isPending ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                t("listing.loadMore")
              )}
            </Button>
          </div>
        )}

        {/* Bottom CTA */}
        <section className="mt-16 sm:mt-20 relative overflow-hidden rounded-2xl border border-border/50 bg-card/70 backdrop-blur-sm p-8 sm:p-10 text-center">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-br from-[#0ab8fb]/5 via-transparent to-[#324b9d]/5"
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
              className="bg-brand-gradient shadow-brand"
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
              className="border-brand-gradient"
            >
              <Link href="/crm/book-a-call">{t("listing.cta.booking")}</Link>
            </Button>
          </div>
        </section>
      </div>
      <FooterSection />
    </div>
  );
}
