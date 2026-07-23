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
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/routing";
import type { SupportedLocale } from "@/lib/locale";
import type { BlogPostListItem, BlogCategory, BlogTag } from "@/lib/automex/types";
import { getMediaUrl } from "@/lib/env";

import { loadMoreBlogPostsAction } from "../actions";

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

// ─── Featured Carousel ────────────────────────────────────────────────

function FeaturedCarousel({ posts, t }: { posts: BlogPostListItem[]; t: ReturnType<typeof useTranslations> }) {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % posts.length);
  }, [posts.length]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + posts.length) % posts.length);
  }, [posts.length]);

  // Auto-rotate every 5s
  useEffect(() => {
    if (isHovered || posts.length <= 1) return;
    timerRef.current = setInterval(next, 5000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isHovered, next, posts.length]);

  if (posts.length === 0) return null;

  const post = posts[current];

  return (
    <section
      className="relative w-full overflow-hidden rounded-2xl mb-12"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Carousel track */}
      <div className="relative aspect-[21/9] sm:aspect-[21/7] bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={post.cover_image?.url ? getMediaUrl(post.cover_image.url) : ""}
          alt={post.cover_image?.alt_text || post.title}
          className={cn(
            "absolute inset-0 size-full object-cover transition-opacity duration-700",
            post.cover_image?.url ? "opacity-100" : "opacity-0"
          )}
        />

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/60 to-transparent" />

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-gradient text-white text-[11px] font-semibold px-2.5 py-1 shadow-brand mb-3">
              <Sparkles className="size-3" aria-hidden="true" />
              {t("listing.post.featured")}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2 leading-tight">
              {post.title}
            </h2>
            <p className="text-[14px] sm:text-[15px] text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
              {post.excerpt}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-[13px] text-muted-foreground mb-4">
              {post.author && (
                <span className="flex items-center gap-2">
                  {post.author.avatar?.url && (
                    <img
                      src={getMediaUrl(post.author.avatar.url)}
                      alt={post.author.full_name}
                      className="size-6 rounded-full object-cover"
                    />
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
                  {t("listing.post.minRead", { minutes: post.reading_time_minutes })}
                </span>
              )}
            </div>
            <Link
              href={`/blog/${post.slug}` as any}
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-gradient text-white px-5 py-2.5 text-[14px] font-semibold shadow-brand hover:opacity-90 transition-opacity"
            >
              {t("listing.post.readMore")}
              <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      {posts.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 flex size-10 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm border border-border/50 text-foreground hover:bg-background transition-colors shadow-lg"
            aria-label="Previous slide"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 flex size-10 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm border border-border/50 text-foreground hover:bg-background transition-colors shadow-lg"
            aria-label="Next slide"
          >
            <ChevronRight className="size-5" />
          </button>
        </>
      )}

      {/* Dot navigation */}
      {posts.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {posts.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={cn(
                "size-2 rounded-full transition-all duration-300",
                i === current
                  ? "bg-white w-6"
                  : "bg-white/50 hover:bg-white/70"
              )}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
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
}: BlogClientPageProps) {
  const locale = useLocale() as SupportedLocale;
  const t = useTranslations("Blog");

  const [posts, setPosts] = useState(initialPosts);
  const [hasMore, setHasMore] = useState(hasMoreInitial);
  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();

  // Featured posts for carousel
  const featuredPosts = posts.filter((p) => p.is_featured);

  function handleLoadMore() {
    startTransition(async () => {
      const nextPage = page + 1;
      const result = await loadMoreBlogPostsAction(
        activeCategory,
        activeTag,
        searchQuery,
        nextPage,
        locale
      );
      if (result.success) {
        setPosts((prev) => [...prev, ...result.data.items]);
        setHasMore(result.data.hasMore);
        setPage(nextPage);
      }
    });
  }

  return (
    <div className="relative overflow-hidden">
      {/* Background decoration */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 right-0 size-[450px] rounded-full bg-[#0ab8fb]/3 blur-3xl" />
        <div className="absolute top-1/3 -left-32 size-[350px] rounded-full bg-[#324b9d]/3 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:py-24">
        {/* ═══ Featured Carousel ═══════════════════════════════════ */}
        <FeaturedCarousel posts={featuredPosts} t={t} />

        {/* ═══ Hero ════════════════════════════════════════════════ */}
        <section className="text-center mb-8 sm:mb-12">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#0ab8fb]/20 bg-[#0ab8fb]/5 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#0a9fdf] mb-4">
            <Sparkles className="size-3" aria-hidden="true" />
            {t("listing.hero.eyebrow")}
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
            <span className="text-brand-gradient">{t("listing.hero.headlineLead")}</span>{" "}
            <span className="text-foreground">{t("listing.hero.headlineAccent")}</span>
          </h1>

          <p className="text-[15px] sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t("listing.hero.description")}
          </p>
        </section>

        {/* ═══ Filters ═════════════════════════════════════════════ */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          {categories.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={{ pathname: "/blog", query: { tag: activeTag, search: searchQuery } as any }}
                className={cn(
                  "rounded-full px-4 py-1.5 text-[13px] font-medium transition-all duration-200",
                  !activeCategory
                    ? "bg-brand-gradient text-white shadow-brand"
                    : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted/80"
                )}
              >
                {t("listing.filters.all")}
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={{ pathname: "/blog", query: { category: cat.slug, tag: activeTag, search: searchQuery } as any }}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-[13px] font-medium transition-all duration-200",
                    activeCategory === cat.slug
                      ? "bg-brand-gradient text-white shadow-brand"
                      : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted/80"
                  )}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          )}

          {tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">
                {t("listing.filters.tagsLabel")}
              </span>
              {tags.slice(0, 12).map((tg) => (
                <Link
                  key={tg.id}
                  href={{ pathname: "/blog", query: { tag: tg.slug, category: activeCategory, search: searchQuery } as any }}
                  className={cn(
                    "rounded-full px-3 py-1 text-[12px] font-medium transition-all duration-200",
                    activeTag === tg.slug
                      ? "bg-brand-gradient text-white shadow-brand"
                      : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted/80"
                  )}
                >
                  {tagName(tg)}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* ═══ Results count ════════════════════════════════════════ */}
        <p className="text-center text-[12px] text-muted-foreground mb-10">
          {totalCount}{" "}
          {activeCategory
            ? t("listing.filters.articlesCount", { count: totalCount, plural: totalCount !== 1 ? "s" : "" }).replace(
                "{count}",
                String(totalCount)
              )
            : "article" + (totalCount !== 1 ? "s" : "")}
          {activeCategory && ` in "${categories.find((c) => c.slug === activeCategory)?.name || activeCategory}"`}
          {activeTag && ` tagged "${tagName(tags.find((tg) => tg.slug === activeTag)!)}"`}
        </p>

        {/* ═══ Posts grid ══════════════════════════════════════════ */}
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="size-10 text-muted-foreground/30 mx-auto mb-4" aria-hidden="true" />
            <p className="text-[14px] text-muted-foreground">{t("listing.post.noPosts")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.map((post) => (
              <article
                key={post.id}
                className="group relative flex flex-col rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm shadow-sm overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand/5 hover:border-primary/40"
              >
                {/* Cover image */}
                <div className="relative h-44 w-full overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
                  {post.cover_image?.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={getMediaUrl(post.cover_image.url)}
                      alt={post.cover_image.alt_text || post.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center">
                      <BookOpen className="size-10 text-primary/30" aria-hidden="true" />
                    </div>
                  )}

                  {/* Overlay gradient */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-card/90 via-card/40 to-transparent"
                  />

                  {/* Featured badge */}
                  {post.is_featured && (
                    <span className="absolute top-3 start-3 inline-flex items-center gap-1 rounded-full bg-brand-gradient text-white text-[11px] font-semibold px-2.5 py-1 shadow-brand">
                      <Sparkles className="size-3" aria-hidden="true" />
                      {t("listing.post.featured")}
                    </span>
                  )}
                </div>

                {/* Card body */}
                <div className="flex flex-col flex-1 p-5 gap-2">
                  {/* Category */}
                  {post.category && (
                    <span className="text-[11px] font-medium uppercase tracking-wider text-primary">
                      {post.category.name}
                    </span>
                  )}

                  <Link
                    href={`/blog/${post.slug}` as any}
                    className="text-[16px] font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2"
                  >
                    {post.title}
                  </Link>

                  <p className="text-[13px] text-muted-foreground flex-1 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Meta row */}
                  <div className="flex items-center justify-between gap-3 text-[12px] text-muted-foreground mt-2 pt-3 border-t border-border/30">
                    <div className="flex items-center gap-3">
                      {post.author && (
                        <span className="flex items-center gap-1.5">
                          {post.author.avatar?.url ? (
                            <img
                              src={getMediaUrl(post.author.avatar.url)}
                              alt={post.author.full_name}
                              className="size-5 rounded-full object-cover"
                            />
                          ) : (
                            <span className="size-5 rounded-full bg-muted flex items-center justify-center text-[10px]">
                              {post.author.full_name?.charAt(0) || "?"}
                            </span>
                          )}
                          <span className="font-medium text-foreground/80">{post.author.full_name}</span>
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      {post.reading_time_minutes != null && (
                        <span className="inline-flex items-center gap-1">
                          <BookOpen className="size-3" aria-hidden="true" />
                          {t("listing.post.minRead", { minutes: post.reading_time_minutes })}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1">
                        <Eye className="size-3" aria-hidden="true" />
                        {formatDate(post.published_at)}
                      </span>
                    </div>
                  </div>

                  {/* Read more */}
                  <div className="mt-1">
                    <Link
                      href={`/blog/${post.slug}` as any}
                      className="inline-flex items-center gap-1 text-[13px] font-medium text-primary hover:text-[#0ab8fb] transition-colors"
                    >
                      {t("listing.post.readMore")}
                      <ArrowRight className="size-3.5 rtl:rotate-180 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* ═══ Load more ═══════════════════════════════════════════ */}
        {hasMore && (
          <div className="flex justify-center mt-12">
            <Button
              variant="outline"
              size="lg"
              onClick={handleLoadMore}
              disabled={isPending}
              className="min-w-[160px] border-brand-gradient"
            >
              {isPending ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                t("listing.loadMore")
              )}
            </Button>
          </div>
        )}

        {/* ═══ Bottom CTA ══════════════════════════════════════════ */}
        <section className="mt-16 sm:mt-20 relative overflow-hidden rounded-2xl border border-border/50 bg-card/70 backdrop-blur-sm p-8 sm:p-10 text-center">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-[#0ab8fb]/5 via-transparent to-[#324b9d]/5"
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
