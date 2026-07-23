"use client";

import { useState, useTransition, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Loader2, ArrowRight, Sparkles, Globe, FolderCode, ExternalLink, Search, Star, X, SlidersHorizontal } from "lucide-react";
import * as LucideIcons from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/routing";
import type { SupportedLocale } from "@/lib/locale";
import type { PortfolioListParams } from "@/lib/automex/content";
import type { PortfolioProjectList, Industry, Technology } from "@/lib/automex/types";
import { getMediaUrl } from "@/lib/env";

import { loadMorePortfolioAction } from "../actions";

interface PortfolioClientPageProps {
  initialProjects: PortfolioProjectList[];
  hasMoreInitial: boolean;
  industries: Industry[];
  technologies: Technology[];
  activeIndustry?: string;
  activeTechnology?: string;
  activeService?: string;
  activeFeatured?: string;
  activeSearch?: string;
  activeOrdering?: string;
  totalCount: number;
}

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

const ORDERING_OPTIONS = [
  { value: "-completion_year", label: "Newest First" },
  { value: "completion_year", label: "Oldest First" },
  { value: "-order", label: "Featured First" },
  { value: "order", label: "By Order" },
] as const;

export function PortfolioClientPage({
  initialProjects,
  hasMoreInitial,
  industries,
  technologies,
  activeIndustry,
  activeTechnology,
  activeService,
  activeFeatured,
  activeSearch,
  activeOrdering,
  totalCount,
}: PortfolioClientPageProps) {
  const locale = useLocale() as SupportedLocale;
  const router = useRouter();
  const t = useTranslations("Portfolio");
  const [projects, setProjects] = useState(initialProjects);
  const [hasMore, setHasMore] = useState(hasMoreInitial);
  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [searchValue, setSearchValue] = useState(activeSearch || "");
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showAllIndustries, setShowAllIndustries] = useState(false);
  const [showAllTechnologies, setShowAllTechnologies] = useState(false);

  function getFilterParams(overrides: Partial<PortfolioListParams> = {}): PortfolioListParams {
    return {
      industry: overrides.industry !== undefined ? overrides.industry : activeIndustry,
      technology: overrides.technology !== undefined ? overrides.technology : activeTechnology,
      service: overrides.service !== undefined ? overrides.service : activeService,
      is_featured: overrides.is_featured !== undefined ? overrides.is_featured : activeFeatured === "true" ? true : undefined,
      search: overrides.search !== undefined ? overrides.search : activeSearch || undefined,
      ordering: overrides.ordering !== undefined ? overrides.ordering : activeOrdering,
    };
  }

  function buildQuery(params: PortfolioListParams): Record<string, string> {
    const q: Record<string, string> = {};
    if (params.industry) q.industry = params.industry;
    if (params.technology) q.technology = params.technology;
    if (params.service) q.service = params.service;
    if (params.is_featured) q.featured = "true";
    if (params.search) q.search = params.search;
    if (params.ordering) q.ordering = params.ordering;
    return q;
  }

  function navigateTo(params: PortfolioListParams) {
    router.push(`/${locale}/portfolio?${new URLSearchParams(buildQuery(params)).toString()}`);
  }

  function handleLoadMore() {
    startTransition(async () => {
      const nextPage = page + 1;
      const result = await loadMorePortfolioAction(nextPage, getFilterParams(), locale);
      if (result.success) {
        setProjects((prev) => [...prev, ...result.data.items]);
        setHasMore(result.data.hasMore);
        setPage(nextPage);
      }
    });
  }

  function handleSearchChange(value: string) {
    setSearchValue(value);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      navigateTo(getFilterParams({ search: value || undefined }));
    }, 400);
  }

  function clearSearch() {
    setSearchValue("");
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    navigateTo(getFilterParams({ search: undefined }));
  }

  const hasActiveFilters = activeIndustry || activeTechnology || activeService || activeFeatured || activeSearch || activeOrdering;

  const visibleIndustries = showAllIndustries ? industries : industries.slice(0, 8);
  const visibleTechnologies = showAllTechnologies ? technologies : technologies.slice(0, 8);

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
            {t("listing.hero.eyebrow")}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
            <span className="text-brand-gradient">{t("listing.hero.headline")}</span>
          </h1>
          <p className="text-[15px] sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t("listing.hero.description")}
          </p>
        </section>

        {/* Filters */}
        <div className="space-y-4 mb-10">
          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" aria-hidden="true" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder={t("listing.filters.searchPlaceholder")}
              className="w-full rounded-xl border border-border/40 bg-muted/30 ps-10 pe-10 py-2.5 text-[13px] text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
            />
            {searchValue && (
              <button
                onClick={clearSearch}
                className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={t("listing.filters.clearSearch")}
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {/* Industry filters */}
            {industries.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={{ pathname: "/portfolio", query: buildQuery(getFilterParams({ industry: undefined })) as any }}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-[13px] font-medium transition-all duration-200",
                    !activeIndustry ? "bg-brand-gradient text-white shadow-brand" : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted/80"
                  )}
                >
                  {t("listing.filters.allIndustries")}
                </Link>
                {visibleIndustries.map((ind) => {
                  const IndIcon = resolveLucideIcon(ind.icon);
                  return (
                    <Link
                      key={ind.id}
                      href={{ pathname: "/portfolio", query: buildQuery(getFilterParams({ industry: ind.slug })) as any }}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[13px] font-medium transition-all duration-200",
                        activeIndustry === ind.slug ? "bg-brand-gradient text-white shadow-brand" : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted/80"
                      )}
                    >
                      <IndIcon className="size-3 shrink-0" aria-hidden="true" />
                      {ind.name}
                    </Link>
                  );
                })}
                {industries.length > 8 && (
                  <button
                    onClick={() => setShowAllIndustries(!showAllIndustries)}
                    className="rounded-full px-3 py-1.5 text-[12px] text-primary hover:underline transition-all"
                  >
                    {showAllIndustries ? t("listing.filters.showLess") : `+${industries.length - 8} ${t("listing.filters.more")}`}
                  </button>
                )}
              </div>
            )}

            {/* Technology filters */}
            {technologies.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={{ pathname: "/portfolio", query: buildQuery(getFilterParams({ technology: undefined })) as any }}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-[13px] font-medium transition-all duration-200",
                    !activeTechnology ? "bg-brand-gradient text-white shadow-brand" : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted/80"
                  )}
                >
                  {t("listing.filters.allTechnologies")}
                </Link>
                {visibleTechnologies.map((tech) => {
                  const TechIcon = resolveLucideIcon(tech.icon);
                  return (
                    <Link
                      key={tech.id}
                      href={{ pathname: "/portfolio", query: buildQuery(getFilterParams({ technology: tech.slug })) as any }}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[13px] font-medium transition-all duration-200",
                        activeTechnology === tech.slug ? "bg-brand-gradient text-white shadow-brand" : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted/80"
                      )}
                    >
                      <TechIcon className="size-3 shrink-0" aria-hidden="true" />
                      {tech.name}
                    </Link>
                  );
                })}
                {technologies.length > 8 && (
                  <button
                    onClick={() => setShowAllTechnologies(!showAllTechnologies)}
                    className="rounded-full px-3 py-1.5 text-[12px] text-primary hover:underline transition-all"
                  >
                    {showAllTechnologies ? t("listing.filters.showLess") : `+${technologies.length - 8} ${t("listing.filters.more")}`}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Bottom filter bar: featured + ordering */}
          <div className="flex flex-wrap justify-center items-center gap-3">
            {/* Featured toggle */}
            <Link
              href={{ pathname: "/portfolio", query: buildQuery(getFilterParams({ is_featured: activeFeatured === "true" ? undefined : true })) as any }}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[13px] font-medium transition-all duration-200",
                activeFeatured === "true" ? "bg-brand-gradient text-white shadow-brand" : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted/80"
              )}
            >
              <Star className="size-3" aria-hidden="true" />
              {t("listing.filters.featured")}
            </Link>

            {/* Ordering dropdown */}
            <div className="relative">
              <select
                value={activeOrdering || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  navigateTo(getFilterParams({ ordering: val || undefined }));
                }}
                className="appearance-none rounded-full bg-muted/50 border border-border/40 px-4 py-1.5 pe-8 text-[13px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/80 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
              >
                <option value="">{t("listing.filters.sortLabel")}</option>
                {ORDERING_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <SlidersHorizontal className="absolute end-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" aria-hidden="true" />
            </div>

            {/* Clear all filters */}
            {hasActiveFilters && (
              <Link
                href="/portfolio"
                className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[12px] text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
              >
                <X className="size-3" aria-hidden="true" />
                {t("listing.filters.clearAll")}
              </Link>
            )}
          </div>
        </div>

        <p className="text-center text-[12px] text-muted-foreground mb-10">
          {totalCount === 1 ? t("listing.count.singular", { count: totalCount }) : t("listing.count.plural", { count: totalCount })}
        </p>

        {/* Grid */}
        {projects.length === 0 ? (
          <div className="text-center py-20">
            <div className="mb-4 opacity-30"><FolderCode className="size-10 mx-auto" aria-hidden="true" /></div>
            <p className="text-[14px] text-muted-foreground">{t("listing.empty")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((proj) => {
              const IndIcon = resolveLucideIcon(proj.industry?.icon);
              return (
                <article
                  key={proj.id}
                  className="group relative flex flex-col rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm shadow-sm overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand/5 hover:border-primary/40"
                >
                  <div className="relative h-44 w-full overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
                    {proj.cover_image?.url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={getMediaUrl(proj.cover_image.url)}
                        alt={proj.cover_image.alt_text || proj.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center">
                        <FolderCode className="size-10 text-primary/30" aria-hidden="true" />
                      </div>
                    )}
                    <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-card/90 via-card/40 to-transparent" />

                    {/* Industry icon badge (top-left) */}
                    {proj.industry && (
                      <span className="absolute top-3 start-3 inline-flex items-center justify-center size-7 rounded-lg bg-background/80 backdrop-blur-sm border border-border/30 shadow-sm">
                        <IndIcon className="size-3.5 text-primary" aria-hidden="true" />
                      </span>
                    )}

                    {/* Featured badge (top-right) */}
                    {proj.is_featured && (
                      <span className="absolute top-3 end-3 inline-flex items-center gap-1 rounded-full bg-brand-gradient text-white text-[11px] font-semibold px-2.5 py-1 shadow-brand">
                        <Star className="size-3" aria-hidden="true" />
                        {t("listing.card.featured")}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col flex-1 p-5 gap-2">
                    {proj.industry && (
                      <span className="text-[11px] font-medium uppercase tracking-wider text-primary">
                        {proj.industry.name}
                      </span>
                    )}
                    <h2 className="text-[16px] font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {proj.title}
                    </h2>
                    {proj.short_description && (
                      <p className="text-[13px] text-muted-foreground flex-1 leading-relaxed line-clamp-3">
                        {proj.short_description}
                      </p>
                    )}
                    <div className="flex items-center gap-3 text-[12px] text-muted-foreground mt-2">
                      {proj.client_name && <span className="font-medium text-foreground/80">{proj.client_name}</span>}
                      {proj.completion_year && (
                        <span className="inline-flex items-center gap-1">
                          <span className="text-[10px] opacity-50">●</span>
                          {proj.completion_year}
                        </span>
                      )}
                    </div>
                    <div className="mt-auto pt-3">
                      <Link
                        href={`/portfolio/${proj.slug}` as any}
                        className="inline-flex items-center gap-1 text-[13px] font-medium text-primary hover:underline"
                      >
                        {t("listing.card.explore")}
                        <ArrowRight className="size-3.5 rtl:rotate-180" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {hasMore && (
          <div className="flex justify-center mt-12">
            <Button variant="outline" size="lg" onClick={handleLoadMore} disabled={isPending} className="min-w-[160px] border-brand-gradient">
              {isPending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : t("listing.loadMore")}
            </Button>
          </div>
        )}

        {/* Bottom CTA */}
        <section className="mt-16 sm:mt-20 relative overflow-hidden rounded-2xl border border-border/50 bg-card/70 backdrop-blur-sm p-8 sm:p-10 text-center">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-[#0ab8fb]/5 via-transparent to-[#324b9d]/5" />
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#0ab8fb]/20 bg-[#0ab8fb]/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#0a9fdf] mb-4">
            <Sparkles className="size-3" aria-hidden="true" />
            {t("listing.cta.eyebrow")}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">{t("listing.cta.title")}</h2>
          <p className="text-[14px] text-muted-foreground mb-8 max-w-xl mx-auto leading-relaxed">
            {t("listing.cta.description")}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="bg-brand-gradient shadow-brand">
              <Link href="/crm/quote">
                {t("listing.cta.quote")}
                <ArrowRight className="size-4 ml-1.5 rtl:rotate-180" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-brand-gradient">
              <Link href="/crm/book-a-call">{t("listing.cta.booking")}</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
