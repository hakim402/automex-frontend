"use client";

import { useState, useTransition } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  Clock,
  ArrowRight,
  BookOpen,
  Tag,
  Loader2,
  Eye,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/routing";
import type { SupportedLocale } from "@/lib/locale";
import type { BlogPostListItem, BlogCategory, BlogTag } from "@/lib/automex/types";

import { loadMoreBlogPostsAction } from "../actions";

// ─── Helpers ──────────────────────────────────────────────────────────

function formatDate(dateStr: string | null | undefined, locale: string): string {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  ai: BookOpen,
  engineering: BookOpen,
  business: BookOpen,
};

function categoryIcon(_slug: string): LucideIcon {
  return CATEGORY_ICONS[_slug] ?? BookOpen;
}

// ─── Props ────────────────────────────────────────────────────────────

interface BlogsClientPageProps {
  initialPosts: BlogPostListItem[];
  hasMoreInitial: boolean;
  categories: BlogCategory[];
  tags: BlogTag[];
  activeCategory?: string;
  activeTag?: string;
  totalCount: number;
}

// ─── Component ────────────────────────────────────────────────────────

export function BlogsClientPage({
  initialPosts,
  hasMoreInitial,
  categories,
  tags,
  activeCategory,
  activeTag,
  totalCount,
}: BlogsClientPageProps) {
  const t = useTranslations("BlogsPage");
  const locale = useLocale() as SupportedLocale;

  const [posts, setPosts] = useState(initialPosts);
  const [hasMore, setHasMore] = useState(hasMoreInitial);
  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();

  function handleLoadMore() {
    startTransition(async () => {
      const nextPage = page + 1;
      const result = await loadMoreBlogPostsAction(activeCategory, activeTag, nextPage, locale);
      if (result.success) {
        setPosts((prev) => [...prev, ...result.data.items]);
        setHasMore(result.data.hasMore);
        setPage(nextPage);
      }
    });
  }

  const isFiltered = !!activeCategory || !!activeTag;

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
          <div className="relative aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-violet-400 to-indigo-600 opacity-20 sm:w-[72.1875rem]" />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgb(148_198_233/0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgb(148_198_233/0.04)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,black,transparent)]"
        />

        <div className="mx-auto max-w-7xl px-4 text-center">
          <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.2em] text-primary">
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
                      FILTERS — Sticky
      ═══════════════════════════════════════════════════════════ */}
      {(categories.length > 0 || tags.length > 0) && (
        <div className="sticky top-[72px] z-30 border-b border-border/40 bg-background/80 backdrop-blur-md">
          <div className="mx-auto max-w-7xl overflow-x-auto px-4 py-3 space-y-2">
            {/* Category pills */}
            {categories.length > 0 && (
              <div className="flex justify-center gap-2 min-w-max">
                <Link
                  href={{ pathname: "/blogs" }}
                  className={cn(
                    "shrink-0 rounded-full px-4 py-2 text-[13px] font-medium transition-all",
                    !isFiltered
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {t("filters.all")}
                </Link>
                {categories.map((cat) => {
                  const isActive = activeCategory === cat.slug && !activeTag;
                  return (
                    <Link
                      key={cat.id}
                      href={{ pathname: "/blogs", query: { category: cat.slug } }}
                      className={cn(
                        "shrink-0 rounded-full px-4 py-2 text-[13px] font-medium transition-all",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      {cat.name}
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Tag pills (smaller, secondary) */}
            {tags.length > 0 && (
              <div className="flex justify-center gap-1.5 min-w-max">
                {tags.slice(0, 12).map((t) => {
                  const isActive = activeTag === t.slug;
                  return (
                    <Link
                      key={t.id}
                      href={{ pathname: "/blogs", query: { tag: t.slug } }}
                      className={cn(
                        "shrink-0 rounded-full px-3 py-1.5 text-[11px] font-medium transition-all",
                        isActive
                          ? "bg-secondary text-secondary-foreground shadow-sm"
                          : "bg-muted/30 text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <Tag className="mr-1 inline size-3" aria-hidden="true" />
                      {t.name}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
                      POSTS GRID
      ═══════════════════════════════════════════════════════════ */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:py-16">
        <p className="mb-8 text-center text-[12px] text-muted-foreground">
          {t("resultsCount", { count: totalCount })}
        </p>

        {posts.length === 0 ? (
          <p className="py-16 text-center text-[14px] text-muted-foreground">{t("empty")}</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => {
              const coverUrl = post.cover_image?.url;
              const CatIcon = categoryIcon(post.category.slug);

              return (
                <Link
                  key={post.id}
                  href={{ pathname: "/blogs/[slug]", params: { slug: post.slug } }}
                  className="group flex flex-col rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm shadow-sm overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_8px_40px_-12px_rgb(139_92_246/15%)]"
                >
                  {/* Cover image */}
                  <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-violet-500/10 via-indigo-500/5 to-transparent">
                    {coverUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={coverUrl}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <BookOpen className="size-10 text-muted-foreground/30" aria-hidden="true" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  {/* Card body */}
                  <div className="flex flex-col flex-1 gap-3 p-5">
                    {/* Category + meta */}
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/5 px-2.5 py-0.5 text-[11px] font-medium text-primary">
                        <CatIcon className="size-3" aria-hidden="true" />
                        {post.category.name}
                      </span>
                      {post.is_featured && (
                        <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                          {t("featuredBadge")}
                        </span>
                      )}
                    </div>

                    <h2 className="text-[16px] font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h2>

                    <p className="text-[13px] leading-relaxed text-muted-foreground flex-1 line-clamp-2">
                      {post.excerpt}
                    </p>

                    {/* Meta line */}
                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" aria-hidden="true" />
                        {formatDate(post.published_at, locale)}
                      </span>
                      {post.reading_time_minutes != null && (
                        <span>
                          {t("readingTime", { minutes: post.reading_time_minutes })}
                        </span>
                      )}
                    </div>

                    {/* Tag chips */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {post.tags.slice(0, 3).map((tg) => (
                          <span
                            key={tg.id}
                            className="rounded-md bg-muted/50 px-2 py-0.5 text-[10px] text-muted-foreground"
                          >
                            {tg.name}
                          </span>
                        ))}
                      </div>
                    )}

                    <span className="inline-flex items-center gap-1 text-[13px] font-medium text-primary mt-auto">
                      {t("cardCta")}
                      <ArrowRight className="size-3.5 rtl:rotate-180 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" aria-hidden="true" />
                    </span>
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
        <div className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-violet-500/10 via-indigo-500/5 to-transparent border border-violet-500/20 p-8 sm:p-12 text-center">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgb(139_92_246/8%),transparent)]"
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
            <Button asChild size="lg" variant="outline">
              <Link href="/case-studies">{t("bottomCta.ctaCaseStudies")}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
