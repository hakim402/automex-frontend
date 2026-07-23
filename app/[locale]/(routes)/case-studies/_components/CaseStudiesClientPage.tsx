"use client";

import { useState, useTransition } from "react";
import { useLocale } from "next-intl";
import { Loader2, ArrowRight, Sparkles, Building2, ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/routing";
import type { SupportedLocale } from "@/lib/locale";
import type { CaseStudyListItem, Industry, Technology } from "@/lib/automex/types";
import { getMediaUrl } from "@/lib/env";

import { loadMoreCaseStudiesAction } from "../actions";

interface CaseStudiesClientPageProps {
  initialStudies: CaseStudyListItem[];
  hasMoreInitial: boolean;
  industries: Industry[];
  technologies: Technology[];
  activeIndustry?: string;
  activeTechnology?: string;
  totalCount: number;
}

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
        locale
      );
      if (result.success) {
        setStudies((prev) => [...prev, ...result.data.items]);
        setHasMore(result.data.hasMore);
        setPage(nextPage);
      }
    });
  }

  const filterQuery = (overrides: Record<string, string | undefined>) => {
    const q: Record<string, string> = {};
    const industry = overrides.industry !== undefined ? overrides.industry : activeIndustry;
    const technology = overrides.technology !== undefined ? overrides.technology : activeTechnology;
    if (industry) q.industry = industry;
    if (technology) q.technology = technology;
    return q;
  };

  return (
    <div className="relative overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 right-0 size-[450px] rounded-full bg-[#0ab8fb]/3 blur-3xl" />
        <div className="absolute top-1/3 -left-32 size-[350px] rounded-full bg-[#324b9d]/3 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:py-24">
        {/* Hero */}
        <section className="text-center mb-8 sm:mb-12">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#0ab8fb]/20 bg-[#0ab8fb]/5 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#0a9fdf] mb-4">
            <Sparkles className="size-3" aria-hidden="true" />
            Success Stories
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
            <span className="text-brand-gradient">Case Studies</span>
          </h1>
          <p className="text-[15px] sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Real projects, real results. Explore how we&apos;ve helped businesses transform with AI and custom software.
          </p>
        </section>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {industries.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={{ pathname: "/case-studies", query: filterQuery({ industry: undefined }) as any }}
                className={cn(
                  "rounded-full px-4 py-1.5 text-[13px] font-medium transition-all duration-200",
                  !activeIndustry ? "bg-brand-gradient text-white shadow-brand" : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted/80"
                )}
              >
                All Industries
              </Link>
              {industries.slice(0, 8).map((ind) => (
                <Link
                  key={ind.id}
                  href={{ pathname: "/case-studies", query: filterQuery({ industry: ind.slug }) as any }}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-[13px] font-medium transition-all duration-200",
                    activeIndustry === ind.slug ? "bg-brand-gradient text-white shadow-brand" : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted/80"
                  )}
                >
                  {ind.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        <p className="text-center text-[12px] text-muted-foreground mb-10">
          {totalCount} case stud{totalCount !== 1 ? "ies" : "y"}
        </p>

        {/* Grid */}
        {studies.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-4 opacity-30">📂</div>
            <p className="text-[14px] text-muted-foreground">No case studies found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {studies.map((cs) => (
              <article
                key={cs.id}
                className="group relative flex flex-col rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm shadow-sm overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand/5 hover:border-primary/40"
              >
                <div className="relative h-44 w-full overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
                  {cs.thumbnail?.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={getMediaUrl(cs.thumbnail.url)}
                      alt={cs.thumbnail.alt_text || cs.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center">
                      <Building2 className="size-10 text-primary/30" aria-hidden="true" />
                    </div>
                  )}
                  <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-card/90 via-card/40 to-transparent" />
                  {cs.is_featured && (
                    <span className="absolute top-3 start-3 inline-flex items-center gap-1 rounded-full bg-brand-gradient text-white text-[11px] font-semibold px-2.5 py-1 shadow-brand">
                      <Sparkles className="size-3" aria-hidden="true" />
                      Featured
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
                    <p className="text-[13px] text-muted-foreground">Client: {cs.client_name}</p>
                  )}
                  <div className="mt-auto pt-3">
                    <Link
                      href={`/case-studies/${cs.slug}` as any}
                      className="inline-flex items-center gap-1 text-[13px] font-medium text-primary hover:underline"
                    >
                      Read case study
                      <ArrowRight className="size-3.5 rtl:rotate-180" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {hasMore && (
          <div className="flex justify-center mt-12">
            <Button variant="outline" size="lg" onClick={handleLoadMore} disabled={isPending} className="min-w-[160px] border-brand-gradient">
              {isPending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : "Load More"}
            </Button>
          </div>
        )}

        {/* Bottom CTA */}
        <section className="mt-16 sm:mt-20 relative overflow-hidden rounded-2xl border border-border/50 bg-card/70 backdrop-blur-sm p-8 sm:p-10 text-center">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-[#0ab8fb]/5 via-transparent to-[#324b9d]/5" />
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#0ab8fb]/20 bg-[#0ab8fb]/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#0a9fdf] mb-4">
            <Sparkles className="size-3" aria-hidden="true" />
            Your Success Story
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">Want to be our next case study?</h2>
          <p className="text-[14px] text-muted-foreground mb-8 max-w-xl mx-auto leading-relaxed">
            Let&apos;s build something great together. Share your project and get a free consultation.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="bg-brand-gradient shadow-brand">
              <Link href="/crm/quote">
                Request a Quote
                <ArrowRight className="size-4 ml-1.5 rtl:rotate-180" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-brand-gradient">
              <Link href="/crm/book-a-call">Book a Free Call</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
