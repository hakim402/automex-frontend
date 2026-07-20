"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Clock,
  ArrowLeft,
  BookOpen,
  Tag,
  User,
  Copy,
  Check,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/routing";
import { SafeHTML } from "@/components/shared/SafeHTML";
import type { SupportedLocale } from "@/lib/locale";
import type { BlogPostDetail, BlogPostListItem } from "@/lib/automex/types";

// ─── Helpers ──────────────────────────────────────────────────────────

function formatDate(dateStr: string | null | undefined, locale: string): string {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
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

interface BlogDetailClientProps {
  blog: BlogPostDetail;
  relatedPosts: BlogPostListItem[];
  locale: SupportedLocale;
}

// ─── Component ────────────────────────────────────────────────────────

export function BlogDetailClient({
  blog,
  relatedPosts,
  locale,
}: BlogDetailClientProps) {
  const t = useTranslations("BlogDetail");
  const isRtl = ["ar", "fa", "ps"].includes(locale);

  const coverUrl = blog.cover_image?.url;
  const CatIcon = categoryIcon(blog.category.slug);

  // Share
  const [copied, setCopied] = useState(false);
  const shareUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `https://automex.tech/${locale}/blogs/${blog.slug}`;

  function handleCopyLink() {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(blog.title)}`;
  const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;

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
          <div className="relative aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-violet-400 to-indigo-600 opacity-20 sm:w-[72.1875rem]" />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgb(148_198_233/0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgb(148_198_233/0.04)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,black,transparent)]"
        />

        <div className="mx-auto max-w-4xl px-4">
          {/* Back link */}
          <Link
            href="/blogs"
            className="mb-8 inline-flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden="true" />
            {t("backToBlogs")}
          </Link>

          {/* Category badge */}
          <div className="mb-4 flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[12px] font-medium text-primary">
              <CatIcon className="size-3.5" aria-hidden="true" />
              {blog.category.name}
            </span>
            {blog.is_featured && (
              <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                {t("featuredBadge")}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {blog.title}
          </h1>

          {/* Meta line */}
          <div className="mt-6 flex flex-wrap items-center gap-4 text-[13px] text-muted-foreground">
            {blog.author && (
              <span className="flex items-center gap-1.5">
                <User className="size-3.5" aria-hidden="true" />
                {blog.author.full_name}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Clock className="size-3.5" aria-hidden="true" />
              {formatDate(blog.published_at, locale)}
            </span>
            {blog.reading_time_minutes != null && (
              <span>
                {t("readingTime", { minutes: blog.reading_time_minutes })}
              </span>
            )}
          </div>

          {/* Tag chips */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {blog.tags.map((tg) => (
                <span
                  key={tg.id}
                  className="inline-flex items-center gap-1 rounded-full bg-muted/50 px-3 py-1 text-[12px] text-muted-foreground"
                >
                  <Tag className="size-3" aria-hidden="true" />
                  {tg.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
                      COVER IMAGE
      ═══════════════════════════════════════════════════════════ */}
      {coverUrl && (
        <section className="mx-auto max-w-4xl px-4 pb-12">
          <div className="overflow-hidden rounded-2xl border border-border/40 shadow-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coverUrl}
              alt={blog.cover_image?.alt_text || blog.title}
              className="h-auto w-full object-cover"
            />
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
                      CONTENT BODY
      ═══════════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
        <SafeHTML html={blog.content} />
      </section>

      {/* ═══════════════════════════════════════════════════════════
                      SHARE BUTTONS
      ═══════════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-3xl px-4 pb-12">
        <div className="flex items-center gap-3 border-t border-border/40 pt-8">
          <span className="text-[13px] font-medium text-muted-foreground">
            {t("share.label")}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyLink}
            className="gap-1.5"
          >
            {copied ? (
              <Check className="size-4 text-emerald-500" aria-hidden="true" />
            ) : (
              <Copy className="size-4" aria-hidden="true" />
            )}
            {copied ? t("share.copied") : t("share.copyLink")}
          </Button>
          <Button asChild variant="outline" size="sm">
            <a
              href={twitterShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="gap-1.5"
            >
              {/* Twitter/X SVG */}
              <svg
                viewBox="0 0 24 24"
                className="size-4"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              {t("share.twitter")}
            </a>
          </Button>
          <Button asChild variant="outline" size="sm">
            <a
              href={linkedInShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="gap-1.5"
            >
              {/* LinkedIn SVG */}
              <svg
                viewBox="0 0 24 24"
                className="size-4"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              {t("share.linkedin")}
            </a>
          </Button>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
                      AUTHOR CARD
      ═══════════════════════════════════════════════════════════ */}
      {blog.author && (
        <section className="mx-auto max-w-3xl px-4 pb-16">
          <div className="flex items-center gap-4 rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm p-6">
            {/* Avatar fallback */}
            <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400">
              <User className="size-6" aria-hidden="true" />
            </div>
            <div>
              <p className="text-[13px] text-muted-foreground">{t("author.writtenBy")}</p>
              <p className="text-[15px] font-semibold text-foreground">
                {blog.author.full_name}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
                      RELATED POSTS
      ═══════════════════════════════════════════════════════════ */}
      {relatedPosts.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:pb-20">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              {t("related.title")}
            </h2>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedPosts.map((post) => {
              const postCover = post.cover_image?.url;
              const PostCatIcon = categoryIcon(post.category.slug);

              return (
                <Link
                  key={post.id}
                  href={{ pathname: "/blogs/[slug]", params: { slug: post.slug } }}
                  className="group flex flex-col rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm shadow-sm overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_8px_40px_-12px_rgb(139_92_246/15%)]"
                >
                  <div className="relative h-40 w-full overflow-hidden bg-gradient-to-br from-violet-500/10 via-indigo-500/5 to-transparent">
                    {postCover ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={postCover}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <BookOpen className="size-8 text-muted-foreground/30" aria-hidden="true" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col flex-1 gap-2 p-4">
                    <span className="inline-flex items-center gap-1 self-start rounded-full border border-primary/20 bg-primary/5 px-2 py-0.5 text-[10px] font-medium text-primary">
                      <PostCatIcon className="size-3" aria-hidden="true" />
                      {post.category.name}
                    </span>
                    <h3 className="text-[14px] font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-[12px] leading-relaxed text-muted-foreground flex-1 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground pt-1">
                      <Clock className="size-3" aria-hidden="true" />
                      {formatDate(post.published_at, locale)}
                    </div>
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
        <div className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-violet-500/10 via-indigo-500/5 to-transparent border border-violet-500/20 p-8 sm:p-12 text-center">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgb(139_92_246/8%),transparent)]"
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
