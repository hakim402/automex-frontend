"use client";

import { useState, useTransition, useEffect, useCallback, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  Loader2,
  ArrowRight,
  Sparkles,
  Clock,
  Eye,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Search,
  SlidersHorizontal,
  Crown,
  ExternalLink,
  Play,
  Code2,
  Cpu,
  Globe,
  ShieldCheck,
  Cloud,
  Smartphone,
  Palette,
  BarChart3,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/routing";
import type { SupportedLocale } from "@/lib/locale";
import type {
  BlogPostListItem,
  BlogCategory,
  BlogTag,
} from "@/lib/automex/types";
import { getMediaUrl } from "@/lib/env";

import { loadMoreBlogPostsAction } from "../actions";
import { FooterSection } from "@/app/[locale]/_components/Footer/FooterSections";

// ─── Props ───────────────────────────────────────────────────────────

interface BlogClientPageProps {
  initialPosts: BlogPostListItem[];
  hasMoreInitial: boolean;
  categories: BlogCategory[];
  tags: BlogTag[];
  activeCategory?: string;
  activeTag?: string;
  searchQuery?: string;
  totalCount: number;
  currentOrdering?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function tagName(tag: BlogTag): string {
  return tag.name || tag.slug;
}

// ─── Category icon resolver ───────────────────────────────────────────

const BLOG_ICON_MAP: Record<string, LucideIcon> = {
  "lucide:code-2": Code2,
  "lucide:cpu": Cpu,
  "lucide:globe": Globe,
  "lucide:shield-check": ShieldCheck,
  "lucide:cloud": Cloud,
  "lucide:smartphone": Smartphone,
  "lucide:palette": Palette,
  "lucide:bar-chart-3": BarChart3,
  "lucide:book-open": BookOpen,
  "lucide:sparkles": Sparkles,
};

function categoryIcon(iconName: string | undefined): LucideIcon | null {
  if (!iconName) return null;
  return BLOG_ICON_MAP[iconName] ?? null;
}

// ─── Featured Carousel (with auto-play) ──────────────────────────────

function FeaturedCarousel({
  posts,
  t,
}: {
  posts: BlogPostListItem[];
  t: ReturnType<typeof useTranslations>;
}) {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalSlides = posts.length;

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

  useEffect(() => {
    if (isHovered || totalSlides <= 1) return;
    timerRef.current = setInterval(next, 5000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isHovered, next, totalSlides]);

  if (totalSlides === 0) return null;

  const post = posts[current];

  return (
    <section
      className="relative w-full overflow-hidden rounded-2xl border border-border/30 bg-card/60 backdrop-blur-sm shadow-lg mb-12"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[21/9] sm:aspect-[21/7] bg-muted/30">
        {/* Image with zoom effect */}
        <div className="absolute inset-0 overflow-hidden">
          {post.cover_image?.url && post.cover_image.file_type !== "video" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={getMediaUrl(post.cover_image.url)}
              alt={post.cover_image.alt_text || post.title}
              className={cn(
                "size-full object-cover transition-transform duration-700",
                isHovered ? "scale-105" : "scale-100",
              )}
            />
          ) : (
            <div className="flex size-full items-center justify-center bg-muted/30">
              <BookOpen className="size-16 text-muted-foreground/30" />
            </div>
          )}
        </div>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-linear-to-t from-background/95 via-background/40 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-r from-background/60 to-transparent" />

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1 rounded-full bg-brand-gradient text-white text-[11px] font-semibold px-2.5 py-1 shadow-brand">
                <Sparkles className="size-3" aria-hidden="true" />
                {t("listing.post.featured")}
              </span>
              {post.is_premium && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500 text-white text-[11px] font-semibold px-2.5 py-1 shadow-sm">
                  <Crown className="size-3" aria-hidden="true" />
                  {t("listing.post.premium")}
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 leading-tight text-shadow-lg">
              {post.title}
            </h2>
            <p className="text-[14px] sm:text-[15px] text-white/80 mb-4 line-clamp-2 leading-relaxed">
              {post.excerpt}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-[13px] text-white/70 mb-4">
              {post.author && (
                <span className="flex items-center gap-2">
                  {post.author.avatar?.url &&
                  post.author.avatar.file_type !== "video" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={getMediaUrl(post.author.avatar.url)}
                      alt={post.author.full_name}
                      className="size-6 rounded-full object-cover ring-2 ring-white/20"
                    />
                  ) : (
                    <span className="flex size-6 items-center justify-center rounded-full bg-brand-gradient text-[10px] font-semibold text-white">
                      {post.author.full_name?.charAt(0).toUpperCase() || "?"}
                    </span>
                  )}
                  {post.author.full_name}
                </span>
              )}
              {post.published_at && (
                <span className="flex items-center gap-1">
                  <Clock className="size-3.5" aria-hidden="true" />
                  {formatDate(post.published_at)}
                </span>
              )}
              {post.reading_time_minutes != null && (
                <span className="flex items-center gap-1">
                  <BookOpen className="size-3.5" aria-hidden="true" />
                  {t("listing.post.minRead", {
                    minutes: post.reading_time_minutes,
                  })}
                </span>
              )}
            </div>
            <Link
              href={`/blog/${post.slug}` as any}
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-gradient text-white px-5 py-2.5 text-[14px] font-semibold shadow-brand hover:opacity-90 transition-opacity"
            >
              {t("listing.post.readMore")}
              <ArrowRight
                className="size-4 rtl:rotate-180"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>

        {/* Auto-play indicator */}
        {totalSlides > 1 && (
          <div className="absolute top-3 right-3 z-10 rounded-full bg-black/30 px-2.5 py-1 text-xs text-white/70 backdrop-blur-sm">
            {current + 1} / {totalSlides}
          </div>
        )}

        {/* Navigation arrows */}
        {totalSlides > 1 && (
          <>
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
          </>
        )}

        {/* Dot navigation */}
        {totalSlides > 1 && (
          <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5">
            {posts.map((_, i) => (
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
        )}

        {/* Progress bar */}
        {totalSlides > 1 && (
          <div className="absolute bottom-0 left-0 right-0 z-10 h-0.5 bg-white/20">
            <div
              className="h-full bg-white/60 transition-all duration-5000 ease-linear"
              style={{
                width: `${((current + 1) / totalSlides) * 100}%`,
                transitionDuration: isHovered ? "0s" : "5000ms",
              }}
            />
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Component ────────────────────────────────────────────────────────

export function BlogClientPage({
  initialPosts,
  hasMoreInitial,
  categories,
  tags,
  activeCategory,
  activeTag,
  searchQuery,
  totalCount,
  currentOrdering,
}: BlogClientPageProps) {
  const locale = useLocale() as SupportedLocale;
  const t = useTranslations("Blog");

  const [posts, setPosts] = useState(initialPosts);
  const [hasMore, setHasMore] = useState(hasMoreInitial);
  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [searchInput, setSearchInput] = useState(searchQuery || "");
  const [ordering, setOrdering] = useState(currentOrdering || "-published_at");

  // Featured posts for carousel
  const featuredPosts = posts.filter((p) => p.is_featured);

  function handleLoadMore() {
    startTransition(async () => {
      const nextPage = page + 1;
      const result = await loadMoreBlogPostsAction(
        activeCategory,
        activeTag,
        searchQuery,
        ordering,
        nextPage,
        locale,
      );
      if (result.success) {
        setPosts((prev) => [...prev, ...result.data.items]);
        setHasMore(result.data.hasMore);
        setPage(nextPage);
      }
    });
  }

  // Build query for filter links
  const buildQuery = (overrides: Record<string, string | undefined>) => {
    const q: Record<string, string> = {};
    const cat =
      overrides.category !== undefined ? overrides.category : activeCategory;
    const tag = overrides.tag !== undefined ? overrides.tag : activeTag;
    const search =
      overrides.search !== undefined ? overrides.search : searchQuery;
    const order =
      overrides.ordering !== undefined ? overrides.ordering : ordering;
    if (cat) q.category = cat;
    if (tag) q.tag = tag;
    if (search) q.search = search;
    if (order && order !== "-published_at") q.ordering = order;
    return q;
  };

  return (
    <div className="relative overflow-hidden">
      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute -top-24 right-0 size-112.5 rounded-full bg-primary/4 blur-3xl" />
        <div className="absolute top-1/3 -left-32 size-87.5 rounded-full bg-accent/30 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 size-75 rounded-full bg-primary/3 blur-3xl -translate-x-1/2" />
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-16 sm:pb-24 mt-24 md:mt-48">
        {/* ═══ Hero ════════════════════════════════════════════════ */}
        <section className="text-center mb-8 sm:mb-12">
          <div className="mx-auto max-w-3xl">
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
              <span className="text-brand-gradient block mb-2">
                {t("listing.hero.headlineLead")}
              </span>
              <span className="text-foreground block">
                {t("listing.hero.headlineAccent")}
              </span>
            </h1>
            <p className="text-[15px] sm:text-base text-muted-foreground leading-relaxed">
              {t("listing.hero.description")}
            </p>
          </div>
        </section>

        {/* ═══ Featured Carousel ═══════════════════════════════════ */}
        {featuredPosts.length > 0 && (
          <FeaturedCarousel posts={featuredPosts} t={t} />
        )}

        {/* ═══ Filters ─── Search + Sort + Categories + Tags ───── */}
        <div className="flex flex-col gap-4 mb-10">
          {/* Search + Sort controls */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-3xl mx-auto w-full">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const params = new URLSearchParams(window.location.search);
                    if (searchInput) params.set("search", searchInput);
                    else params.delete("search");
                    window.location.href = `/blog?${params.toString()}`;
                  }
                }}
                placeholder={t("listing.filters.searchPlaceholder")}
                className="w-full rounded-full border border-border/30 bg-card/60 px-9 py-2.5 text-sm text-foreground placeholder:text-muted-foreground backdrop-blur-sm transition-all focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <SlidersHorizontal className="size-4 text-muted-foreground" />
              <select
                value={ordering}
                onChange={(e) => {
                  setOrdering(e.target.value);
                  const params = new URLSearchParams(window.location.search);
                  if (e.target.value !== "-published_at")
                    params.set("ordering", e.target.value);
                  else params.delete("ordering");
                  window.location.href = `/blog?${params.toString()}`;
                }}
                className="rounded-full border border-border/30 bg-card/60 px-4 py-2.5 text-sm text-foreground backdrop-blur-sm transition-all focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
              >
                <option value="-published_at">
                  {t("listing.filters.sortNewest")}
                </option>
                <option value="published_at">
                  {t("listing.filters.sortOldest")}
                </option>
                <option value="-views_count">
                  {t("listing.filters.sortPopular")}
                </option>
              </select>
            </div>
          </div>

          {/* Category + Tag filters */}
          <div className="hidden md:flex flex-wrap items-center justify-center gap-2">
            {categories.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={{
                    pathname: "/blog",
                    query: buildQuery({ category: undefined }),
                  }}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-[13px] font-medium transition-all duration-200",
                    !activeCategory
                      ? "bg-brand-gradient text-brand-foreground shadow-brand"
                      : "bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted/60",
                  )}
                >
                  {t("listing.filters.all")}
                </Link>
                {categories.map((cat) => {
                  const IconComp = categoryIcon(cat.icon);
                  return (
                    <Link
                      key={cat.id}
                      href={{
                        pathname: "/blog",
                        query: buildQuery({ category: cat.slug }),
                      }}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[13px] font-medium transition-all duration-200",
                        activeCategory === cat.slug
                          ? "bg-brand-gradient text-brand-foreground shadow-brand"
                          : "bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted/60",
                      )}
                    >
                      {IconComp && (
                        <IconComp className="size-3.5" aria-hidden="true" />
                      )}
                      {cat.name || cat.slug}
                    </Link>
                  );
                })}
              </div>
            )}

            {tags.length > 0 && (
              <>
                <span className="text-[11px] text-muted-foreground/50 mx-1">
                  •
                </span>
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/50">
                    {t("listing.filters.tagsLabel")}
                  </span>
                  {tags.slice(0, 12).map((tg) => (
                    <Link
                      key={tg.id}
                      href={{
                        pathname: "/blog",
                        query: buildQuery({ tag: tg.slug }),
                      }}
                      className={cn(
                        "rounded-full px-3 py-1 text-[12px] font-medium transition-all duration-200",
                        activeTag === tg.slug
                          ? "bg-brand-gradient text-brand-foreground shadow-brand"
                          : "bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted/60",
                      )}
                    >
                      {tagName(tg)}
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Clear all filters (optional) */}
          {(activeCategory || activeTag || searchQuery) && (
            <div className="flex justify-center">
              <Link
                href="/blog"
                className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all"
              >
                <span className="sr-only">Clear all filters</span>
                Clear filters
              </Link>
            </div>
          )}
        </div>

        {/* ═══ Results count ════════════════════════════════════════ */}
        <p className="text-center text-[12px] text-muted-foreground/70 mb-8">
          {totalCount === 1
            ? t("listing.filters.articlesCount", { count: 1, plural: "" })
            : t("listing.filters.articlesCount", {
                count: totalCount,
                plural: "s",
              })}
          {activeCategory &&
            ` in "${categories.find((c) => c.slug === activeCategory)?.name || activeCategory}"`}
          {activeTag &&
            ` tagged "${tagName(tags.find((tg) => tg.slug === activeTag)!)}"`}
        </p>

        {/* ═══ Posts grid ══════════════════════════════════════════ */}
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen
              className="mx-auto size-12 text-muted-foreground/30 mb-4"
              aria-hidden="true"
            />
            <p className="text-sm text-muted-foreground">
              {t("listing.post.noPosts")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <article
                key={post.id}
                className="group relative flex flex-col rounded-2xl border border-border/30 bg-card/60 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/30"
              >
                {/* Cover image */}
                <div className="relative h-48 w-full overflow-hidden bg-linear-to-br from-primary/10 via-primary/5 to-transparent">
                  {post.cover_image?.url &&
                  post.cover_image.file_type !== "video" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={getMediaUrl(
                        post.thumbnail_image?.url || post.cover_image.url,
                      )}
                      alt={post.cover_image.alt_text || post.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center">
                      <BookOpen
                        className="size-12 text-primary/30"
                        aria-hidden="true"
                      />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-linear-to-t from-card/90 via-card/40 to-transparent" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    {post.is_featured && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-brand-gradient text-white text-[11px] font-semibold px-2.5 py-1 shadow-brand">
                        <Sparkles className="size-3" aria-hidden="true" />
                        {t("listing.post.featured")}
                      </span>
                    )}
                    {post.is_premium && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500 text-white text-[11px] font-semibold px-2.5 py-1 shadow-sm">
                        <Crown className="size-3" aria-hidden="true" />
                        {t("listing.post.premium")}
                      </span>
                    )}
                  </div>

                  {post.content_type_display &&
                    post.content_type_display !== "Article" && (
                      <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-background/90 px-2.5 py-1 text-[10px] font-medium text-foreground/80 backdrop-blur-sm border border-border/30">
                        {post.content_type_display === "Video" && (
                          <Play className="size-3" />
                        )}
                        {post.content_type_display === "External" && (
                          <ExternalLink className="size-3" />
                        )}
                        {post.content_type_display}
                      </span>
                    )}
                </div>

                {/* Card body */}
                <div className="flex flex-1 flex-col p-5 gap-2">
                  {post.category && (
                    <span className="text-[11px] font-medium uppercase tracking-wider text-primary">
                      {post.category.name || post.category.slug}
                    </span>
                  )}

                  <Link
                    href={`/blog/${post.slug}` as any}
                    className="text-base font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2"
                  >
                    {post.title}
                  </Link>

                  <p className="text-sm text-muted-foreground flex-1 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Meta row */}
                  <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground mt-2 pt-3 border-t border-border/20">
                    <div className="flex items-center gap-3">
                      {post.author && (
                        <span className="flex items-center gap-1.5">
                          {post.author.avatar?.url &&
                          post.author.avatar.file_type !== "video" ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={getMediaUrl(post.author.avatar.url)}
                              alt={post.author.full_name}
                              className="size-5 rounded-full object-cover ring-1 ring-border"
                            />
                          ) : (
                            <span className="flex size-5 items-center justify-center rounded-full bg-muted text-[10px]">
                              {post.author.full_name?.charAt(0).toUpperCase() ||
                                "?"}
                            </span>
                          )}
                          <span className="font-medium text-foreground/80 truncate max-w-20">
                            {post.author.full_name}
                          </span>
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {post.reading_time_minutes != null && (
                        <span className="inline-flex items-center gap-1">
                          <BookOpen className="size-3" aria-hidden="true" />
                          {t("listing.post.minRead", {
                            minutes: post.reading_time_minutes,
                          })}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1">
                        <Clock className="size-3" aria-hidden="true" />
                        {formatDate(post.published_at)}
                      </span>
                    </div>
                  </div>

                  {/* Read more */}
                  <Link
                    href={`/blog/${post.slug}` as any}
                    className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-brand-start transition-colors"
                  >
                    {t("listing.post.readMore")}
                    <ArrowRight
                      className="size-3.5 rtl:rotate-180 transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* ═══ Load more ═══════════════════════════════════════════ */}
        {hasMore && (
          <div className="flex justify-center mt-12">
            <button
              onClick={handleLoadMore}
              disabled={isPending}
              className="relative inline-flex min-w-40 cursor-pointer items-center justify-center gap-2 rounded-full border border-brand-gradient bg-background/80 px-8 py-3 text-sm font-semibold text-foreground backdrop-blur-sm transition-colors hover:bg-muted/30 disabled:opacity-60"
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
          <span className="inline-flex items-center gap-1.5 rounded-full bg-background/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary mb-4">
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
      <FooterSection />
    </div>
  );
}
