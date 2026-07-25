"use client";

import { useState, useTransition, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import {
  Loader2,
  ArrowRight,
  Sparkles,
  Globe,
  FolderCode,
  ExternalLink,
  Search,
  Star,
  X,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Briefcase,
} from "lucide-react";
import * as LucideIcons from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/routing";
import type { SupportedLocale } from "@/lib/locale";
import type { PortfolioListParams } from "@/lib/automex/content";
import type {
  PortfolioProjectList,
  Industry,
  Technology,
} from "@/lib/automex/types";
import { getMediaUrl } from "@/lib/env";

import { loadMorePortfolioAction } from "../actions";

// ─── Props ───────────────────────────────────────────────────────────

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

// ─── Icon resolver ──────────────────────────────────────────────────

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

// ─── Featured Projects Carousel ────────────────────────────────────

function FeaturedProjectsCarousel({
  projects,
  t,
}: {
  projects: PortfolioProjectList[];
  t: ReturnType<typeof useTranslations>;
}) {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const totalSlides = projects.length;

  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrent(index);
      setTimeout(() => setIsTransitioning(false), 600);
    },
    [isTransitioning],
  );

  const next = useCallback(() => {
    goToSlide((current + 1) % totalSlides);
  }, [current, totalSlides, goToSlide]);

  const prev = useCallback(() => {
    goToSlide((current - 1 + totalSlides) % totalSlides);
  }, [current, totalSlides, goToSlide]);

  // Auto-rotate every 5s
  useEffect(() => {
    if (isHovered || totalSlides <= 1) return;
    timerRef.current = setInterval(next, 5000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isHovered, next, totalSlides]);

  if (totalSlides === 0) return null;

  const project = projects[current];
  const imageUrl = project.cover_image?.url
    ? getMediaUrl(project.cover_image.url)
    : null;
  const IndIcon = resolveLucideIcon(project.industry?.icon);

  return (
    <section
      className="relative w-full overflow-hidden rounded-2xl border border-border/30 bg-card/60 backdrop-blur-sm shadow-lg mb-12"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[21/9] sm:aspect-[21/7] bg-muted/30">
        <div className="absolute inset-0 overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={project.cover_image?.alt_text || project.title}
              className={cn(
                "size-full object-cover transition-transform duration-700",
                isHovered ? "scale-105" : "scale-100",
              )}
            />
          ) : (
            <div className="flex size-full items-center justify-center bg-muted/30">
              <FolderCode className="size-16 text-muted-foreground/30" />
            </div>
          )}
        </div>

        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/60 to-transparent" />

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {project.industry && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white">
                  <IndIcon className="size-3" aria-hidden="true" />
                  {project.industry.name}
                </span>
              )}
              {project.is_featured && (
                <span className="inline-flex items-center gap-1 rounded-full bg-brand-gradient text-white text-[11px] font-semibold px-2.5 py-1 shadow-brand">
                  <Star className="size-3" aria-hidden="true" />
                  {t("listing.card.featured")}
                </span>
              )}
            </div>

            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 leading-tight"
              style={{ textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}
            >
              {project.title}
            </h2>

            <p className="text-[14px] sm:text-[15px] text-white/80 mb-4 line-clamp-2 leading-relaxed">
              {project.short_description}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-white/70 mb-4">
              {project.client_name && (
                <span className="flex items-center gap-1.5">
                  <Briefcase className="size-3.5" aria-hidden="true" />
                  {project.client_name}
                </span>
              )}
              {project.completion_year && (
                <span className="flex items-center gap-1.5">
                  <span className="text-[10px] opacity-50">●</span>
                  {project.completion_year}
                </span>
              )}
            </div>

            <Link
              href={`/portfolio/${project.slug}` as any}
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-gradient text-white px-5 py-2.5 text-[14px] font-semibold shadow-brand hover:opacity-90 transition-opacity"
            >
              {t("listing.card.explore")}
              <ArrowRight
                className="size-4 rtl:rotate-180"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>

        {totalSlides > 1 && (
          <>
            <div className="absolute top-3 right-3 z-10 rounded-full bg-black/30 px-2.5 py-1 text-xs text-white/70 backdrop-blur-sm">
              {current + 1} / {totalSlides}
            </div>

            <button
              onClick={prev}
              className="absolute left-3 top-1/2 z-10 flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-background/80 text-foreground shadow-lg backdrop-blur-sm transition-all hover:bg-background hover:shadow-xl"
              aria-label="Previous slide"
            >
              <ChevronLeft className="size-5 rtl:rotate-180" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 z-10 flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-background/80 text-foreground shadow-lg backdrop-blur-sm transition-all hover:bg-background hover:shadow-xl"
              aria-label="Next slide"
            >
              <ChevronRight className="size-5 rtl:rotate-180" />
            </button>

            <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5">
              {projects.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToSlide(i)}
                  className={cn(
                    "cursor-pointer rounded-full transition-all duration-300",
                    i === current
                      ? "w-6 bg-white h-1.5"
                      : "w-1.5 bg-white/50 hover:bg-white/80 h-1.5",
                  )}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

// ─── Main Component ──────────────────────────────────────────────────

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

  // Featured projects for carousel
  const featuredProjects = projects.filter((p) => p.is_featured);

  function getFilterParams(
    overrides: Partial<PortfolioListParams> = {},
  ): PortfolioListParams {
    return {
      industry:
        overrides.industry !== undefined ? overrides.industry : activeIndustry,
      technology:
        overrides.technology !== undefined
          ? overrides.technology
          : activeTechnology,
      service:
        overrides.service !== undefined ? overrides.service : activeService,
      is_featured:
        overrides.is_featured !== undefined
          ? overrides.is_featured
          : activeFeatured === "true"
            ? true
            : undefined,
      search:
        overrides.search !== undefined
          ? overrides.search
          : activeSearch || undefined,
      ordering:
        overrides.ordering !== undefined ? overrides.ordering : activeOrdering,
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
    router.push(
      `/${locale}/portfolio?${new URLSearchParams(buildQuery(params)).toString()}`,
    );
  }

  function handleLoadMore() {
    startTransition(async () => {
      const nextPage = page + 1;
      const result = await loadMorePortfolioAction(
        nextPage,
        getFilterParams(),
        locale,
      );
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

  const hasActiveFilters =
    activeIndustry ||
    activeTechnology ||
    activeService ||
    activeFeatured ||
    activeSearch ||
    activeOrdering;

  const visibleIndustries = showAllIndustries
    ? industries
    : industries.slice(0, 8);
  const visibleTechnologies = showAllTechnologies
    ? technologies
    : technologies.slice(0, 8);

  return (
    <div className="relative overflow-hidden mt-32">
      {/* ─── Background decoration ─────────────────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute -top-24 right-0 size-[450px] rounded-full bg-primary/4 blur-3xl" />
        <div className="absolute top-1/3 -left-32 size-[350px] rounded-full bg-accent/30 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 size-[300px] rounded-full bg-primary/3 blur-3xl -translate-x-1/2" />
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-16 sm:pb-24">
        {/* ═══ Featured Carousel ═══════════════════════════════════ */}
        {featuredProjects.length > 0 && (
          <FeaturedProjectsCarousel projects={featuredProjects} t={t} />
        )}

        {/* ═══ Filters ────────────────────────────────────────────── */}
        <div className="space-y-4 mb-10">
          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search
              className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder={t("listing.filters.searchPlaceholder")}
              className="w-full rounded-full border border-border/30 bg-card/60 px-9 py-2.5 text-sm text-foreground placeholder:text-muted-foreground backdrop-blur-sm transition-all focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            {searchValue && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={t("listing.filters.clearSearch")}
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {/* Industry filters */}
            {industries.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={{
                    pathname: "/portfolio",
                    query: buildQuery(
                      getFilterParams({ industry: undefined }),
                    ) as any,
                  }}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-[13px] font-medium transition-all duration-200",
                    !activeIndustry
                      ? "bg-brand-gradient text-brand-foreground shadow-brand"
                      : "bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted/60",
                  )}
                >
                  {t("listing.filters.allIndustries")}
                </Link>
                {visibleIndustries.map((ind) => {
                  const IndIcon = resolveLucideIcon(ind.icon);
                  return (
                    <Link
                      key={ind.id}
                      href={{
                        pathname: "/portfolio",
                        query: buildQuery(
                          getFilterParams({ industry: ind.slug }),
                        ) as any,
                      }}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[13px] font-medium transition-all duration-200",
                        activeIndustry === ind.slug
                          ? "bg-brand-gradient text-brand-foreground shadow-brand"
                          : "bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted/60",
                      )}
                    >
                      <IndIcon className="size-3.5" aria-hidden="true" />
                      {ind.name}
                    </Link>
                  );
                })}
                {industries.length > 8 && (
                  <button
                    onClick={() => setShowAllIndustries(!showAllIndustries)}
                    className="rounded-full px-3 py-1.5 text-xs text-primary hover:underline transition-all"
                  >
                    {showAllIndustries
                      ? t("listing.filters.showLess")
                      : `+${industries.length - 8} ${t("listing.filters.more")}`}
                  </button>
                )}
              </div>
            )}

            {/* Technology filters */}
            {technologies.length > 0 && (
              <>
                <span className="text-muted-foreground/30">•</span>
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={{
                      pathname: "/portfolio",
                      query: buildQuery(
                        getFilterParams({ technology: undefined }),
                      ) as any,
                    }}
                    className={cn(
                      "rounded-full px-4 py-1.5 text-[13px] font-medium transition-all duration-200",
                      !activeTechnology
                        ? "bg-brand-gradient text-brand-foreground shadow-brand"
                        : "bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted/60",
                    )}
                  >
                    {t("listing.filters.allTechnologies")}
                  </Link>
                  {visibleTechnologies.map((tech) => {
                    const TechIcon = resolveLucideIcon(tech.icon);
                    return (
                      <Link
                        key={tech.id}
                        href={{
                          pathname: "/portfolio",
                          query: buildQuery(
                            getFilterParams({ technology: tech.slug }),
                          ) as any,
                        }}
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[13px] font-medium transition-all duration-200",
                          activeTechnology === tech.slug
                            ? "bg-brand-gradient text-brand-foreground shadow-brand"
                            : "bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted/60",
                        )}
                      >
                        <TechIcon className="size-3.5" aria-hidden="true" />
                        {tech.name}
                      </Link>
                    );
                  })}
                  {technologies.length > 8 && (
                    <button
                      onClick={() =>
                        setShowAllTechnologies(!showAllTechnologies)
                      }
                      className="rounded-full px-3 py-1.5 text-xs text-primary hover:underline transition-all"
                    >
                      {showAllTechnologies
                        ? t("listing.filters.showLess")
                        : `+${technologies.length - 8} ${t("listing.filters.more")}`}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Bottom bar: featured toggle + ordering + clear all */}
          <div className="flex flex-wrap justify-center items-center gap-2 pt-1">
            <Link
              href={{
                pathname: "/portfolio",
                query: buildQuery(
                  getFilterParams({
                    is_featured: activeFeatured === "true" ? undefined : true,
                  }),
                ) as any,
              }}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[13px] font-medium transition-all duration-200",
                activeFeatured === "true"
                  ? "bg-brand-gradient text-brand-foreground shadow-brand"
                  : "bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted/60",
              )}
            >
              <Star className="size-3.5" aria-hidden="true" />
              {t("listing.filters.featured")}
            </Link>

            <div className="relative">
              <select
                value={activeOrdering || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  navigateTo(getFilterParams({ ordering: val || undefined }));
                }}
                className="appearance-none rounded-full bg-muted/40 border border-border/30 px-4 py-1.5 pe-8 text-[13px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
              >
                <option value="">{t("listing.filters.sortLabel")}</option>
                {ORDERING_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <SlidersHorizontal
                className="absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none"
                aria-hidden="true"
              />
            </div>

            {hasActiveFilters && (
              <Link
                href="/portfolio"
                className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all"
              >
                <X className="size-3" aria-hidden="true" />
                {t("listing.filters.clearAll")}
              </Link>
            )}
          </div>
        </div>

        {/* ═══ Results count ════════════════════════════════════════ */}
        <p className="text-center text-xs text-muted-foreground/70 mb-8">
          {totalCount === 1
            ? t("listing.count.singular", { count: totalCount })
            : t("listing.count.plural", { count: totalCount })}
        </p>

        {/* ═══ Projects Grid ════════════════════════════════════════ */}
        {projects.length === 0 ? (
          <div className="text-center py-20">
            <FolderCode
              className="mx-auto size-12 text-muted-foreground/30 mb-4"
              aria-hidden="true"
            />
            <p className="text-sm text-muted-foreground">
              {t("listing.empty")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((proj) => {
              const IndIcon = resolveLucideIcon(proj.industry?.icon);
              const imageUrl = proj.cover_image?.url
                ? getMediaUrl(proj.cover_image.url)
                : null;

              return (
                <article
                  key={proj.id}
                  className="group relative flex flex-col rounded-2xl border border-border/30 bg-card/60 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/30"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={proj.cover_image?.alt_text || proj.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center">
                        <FolderCode
                          className="size-12 text-primary/30"
                          aria-hidden="true"
                        />
                      </div>
                    )}
                    <div
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-card/90 via-card/40 to-transparent"
                    />

                    {/* Industry icon badge */}
                    {proj.industry && (
                      <span className="absolute top-3 left-3 inline-flex size-8 items-center justify-center rounded-lg bg-background/80 backdrop-blur-sm border border-border/30 shadow-sm">
                        <IndIcon
                          className="size-3.5 text-primary"
                          aria-hidden="true"
                        />
                      </span>
                    )}

                    {/* Featured badge */}
                    {proj.is_featured && (
                      <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-brand-gradient text-white text-[11px] font-semibold px-2.5 py-1 shadow-brand">
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
                    <h2 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {proj.title}
                    </h2>
                    {proj.short_description && (
                      <p className="text-sm text-muted-foreground flex-1 leading-relaxed line-clamp-3">
                        {proj.short_description}
                      </p>
                    )}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2 pt-2 border-t border-border/20">
                      {proj.client_name && (
                        <span className="font-medium text-foreground/80 truncate max-w-[120px]">
                          {proj.client_name}
                        </span>
                      )}
                      {proj.completion_year && (
                        <span className="inline-flex items-center gap-1">
                          <span className="text-[10px] opacity-50">●</span>
                          {proj.completion_year}
                        </span>
                      )}
                    </div>
                    <Link
                      href={`/portfolio/${proj.slug}` as any}
                      className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline transition-colors"
                    >
                      {t("listing.card.explore")}
                      <ArrowRight
                        className="size-3.5 rtl:rotate-180"
                        aria-hidden="true"
                      />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* ═══ Load More ═══════════════════════════════════════════ */}
        {hasMore && (
          <div className="flex justify-center mt-12">
            <button
              onClick={handleLoadMore}
              disabled={isPending}
              className="relative inline-flex min-w-[160px] cursor-pointer items-center justify-center gap-2 rounded-full border border-brand-gradient bg-background/80 px-8 py-3 text-sm font-semibold text-foreground backdrop-blur-sm transition-colors hover:bg-muted/30 disabled:opacity-60"
            >
              {isPending ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                t("listing.loadMore")
              )}
              <span className="absolute inset-0 rounded-full bg-brand-gradient opacity-0 blur-xl transition-opacity group-hover:opacity-20" />
            </button>
          </div>
        )}

        {/* ═══ Bottom CTA ══════════════════════════════════════════ */}
        <section className="mt-16 sm:mt-20 relative overflow-hidden rounded-2xl border border-border/20 bg-brand-soft/40 p-8 sm:p-10 text-center backdrop-blur-sm">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-background/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary/80 mb-4">
            <Sparkles className="size-3" aria-hidden="true" />
            {t("listing.cta.eyebrow")}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
            {t("listing.cta.title")}
          </h2>
          <p className="text-sm text-muted-foreground mb-8 max-w-xl mx-auto leading-relaxed">
            {t("listing.cta.description")}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/crm/quote"
              className="inline-flex items-center gap-2 rounded-lg bg-brand-gradient px-6 py-3 text-sm font-semibold text-white shadow-brand transition-opacity hover:opacity-90"
            >
              {t("listing.cta.quote")}
              <ArrowRight
                className="size-4 rtl:rotate-180"
                aria-hidden="true"
              />
            </Link>
            <Link
              href="/crm/book-a-call"
              className="inline-flex items-center gap-2 rounded-lg border border-brand-gradient bg-transparent px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted/30"
            >
              {t("listing.cta.booking")}
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
