"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
import {
  Clock,
  ArrowLeft,
  Eye,
  BookOpen,
  Tag,
  Sparkles,
  Share2,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { getMediaUrl } from "@/lib/env";
import { cn } from "@/lib/utils";
import type { BlogPostDetail } from "@/lib/automex/types";
import { FooterSection } from "@/app/[locale]/_components/Footer/FooterSections";

// ─── Helpers ──────────────────────────────────────────────────────────

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function tagName(tag: BlogPostDetail["tags"][number]): string {
  return tag.name || tag.slug;
}

/**
 * Extract the inner body content from a full HTML document.
 * Django CMS often returns a complete HTML doc with DOCTYPE / html / head / body.
 */
function extractBodyHtml(html: string): string {
  // Try to extract <body>...</body>
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch) return bodyMatch[1].trim();

  // Fallback: strip wrapper tags manually
  return html
    .replace(/<!DOCTYPE[^>]*>/gi, "")
    .replace(/<html[^>]*>/gi, "")
    .replace(/<\/html>/gi, "")
    .replace(/<head[\s\S]*?<\/head>/gi, "")
    .replace(/<body[^>]*>/gi, "")
    .replace(/<\/body>/gi, "")
    .trim();
}

// ─── Reading Progress Bar ─────────────────────────────────────────────

function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function handleScroll() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) {
        setProgress(100);
        return;
      }
      setProgress(Math.min(100, Math.round((scrollTop / docHeight) * 100)));
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-[#0ab8fb] to-[#324b9d] transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Reading progress"
      />
    </div>
  );
}

// ─── Share Buttons ────────────────────────────────────────────────────

function ShareButtons({ url, title, t }: { url: string; title: string; t: ReturnType<typeof useTranslations> }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wider mr-1">
        {t("detail.share")}
      </span>
      <button
        onClick={handleCopy}
        className="inline-flex items-center gap-1.5 rounded-full bg-muted/50 px-3 py-1.5 text-[12px] text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        aria-label={t("detail.copyLink")}
      >
        {copied ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
        {copied ? t("detail.copied") : t("detail.copyLink")}
      </button>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────

export function BlogDetailClientPage({ post }: { post: BlogPostDetail }) {
  const t = useTranslations("Blog");
  const contentRef = useRef<HTMLDivElement>(null);

  const coverUrl = post.cover_image?.url ? getMediaUrl(post.cover_image.url) : null;
  const coverAlt = post.cover_image?.alt_text || post.title;

  // Current page URL for sharing
  const [shareUrl, setShareUrl] = useState("");
  useEffect(() => {
    setShareUrl(window.location.href);
  }, []);

  // Extract clean HTML from content
  const bodyHtml = useMemo(() => extractBodyHtml(post.content), [post.content]);

  return (
    <>
      <ReadingProgressBar />

      <div className="relative overflow-hidden">
        {/* Background decoration */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-24 right-0 size-[450px] rounded-full bg-[#0ab8fb]/3 blur-3xl" />
          <div className="absolute top-1/3 -left-32 size-[350px] rounded-full bg-[#324b9d]/3 blur-3xl" />
        </div>

        <article className="mx-auto max-w-4xl px-4 pt-16 sm:pt-24 pb-8">
          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="size-3.5 rtl:rotate-180" aria-hidden="true" />
            {t("detail.back")}
          </Link>

          {/* Category + featured badge */}
          <div className="flex items-center gap-3 mb-4">
            {post.category && (
              <span className="text-[11px] font-medium uppercase tracking-wider text-primary">
                {post.category.name}
              </span>
            )}
            {post.is_featured && (
              <span className="inline-flex items-center gap-1 rounded-full bg-brand-gradient text-white text-[11px] font-semibold px-2.5 py-1 shadow-brand">
                <Sparkles className="size-3" aria-hidden="true" />
                {t("detail.featured")}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tight leading-tight">
            {post.title}
          </h1>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-4 text-[13px] text-muted-foreground mb-6">
            {post.author && (
              <span className="font-medium text-foreground">
                {t("detail.by")} {post.author.full_name}
              </span>
            )}
            {post.published_at && (
              <span className="inline-flex items-center gap-1">
                <Clock className="size-3.5" aria-hidden="true" />
                {formatDate(post.published_at)}
              </span>
            )}
            {post.reading_time_minutes != null && (
              <span className="inline-flex items-center gap-1">
                <BookOpen className="size-3.5" aria-hidden="true" />
                {t("detail.minRead", { minutes: post.reading_time_minutes })}
              </span>
            )}
            {post.views_count != null && post.views_count > 0 && (
              <span className="inline-flex items-center gap-1">
                <Eye className="size-3.5" aria-hidden="true" />
                {t("detail.views", { count: post.views_count })}
              </span>
            )}
          </div>

          {/* Share buttons */}
          <div className="mb-8">
            <ShareButtons url={shareUrl} title={post.title} t={t} />
          </div>
        </article>

        {/* ═══ Hero Image Banner ═══════════════════════════════════ */}
        {coverUrl && (
          <div className="mx-auto max-w-5xl px-4 mb-10">
            <figure className="relative rounded-2xl overflow-hidden border border-border/30 shadow-brand">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={coverUrl}
                alt={coverAlt}
                className="w-full h-auto max-h-[500px] object-cover"
              />
              {/* Gradient overlay at bottom */}
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
            </figure>
          </div>
        )}

        <div className="mx-auto max-w-4xl px-4">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* ═══ Main Content Column ════════════════════════════ */}
            <div className="flex-1 min-w-0">
              {/* Table of Contents */}
              {(() => {
                // Extract headings from HTML content
                const headingRegex = /<h([23])[^>]*>(.*?)<\/h[23]>/gi;
                const headings: { level: number; text: string; id: string }[] = [];
                let match: RegExpExecArray | null;
                let idx = 0;
                while ((match = headingRegex.exec(post.content)) !== null && idx < 20) {
                  const level = parseInt(match[1]);
                  const text = match[2].replace(/<[^>]*>/g, "").trim();
                  const id = `heading-${idx++}`;
                  headings.push({ level, text, id });
                }

                if (headings.length === 0) return null;

                return (
                  <details className="mb-10 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm p-5 group lg:hidden">
                    <summary className="text-[13px] font-semibold text-foreground cursor-pointer select-none flex items-center gap-2">
                      <BookOpen className="size-4 text-primary" aria-hidden="true" />
                      {t("detail.tableOfContents")}
                    </summary>
                    <ul className="mt-3 space-y-1.5 border-t border-border/30 pt-3">
                      {headings.map((h) => (
                        <li key={h.id} style={{ paddingLeft: h.level === 3 ? "1rem" : "0" }}>
                          <a
                            href={`#${h.id}`}
                            className="text-[13px] text-muted-foreground hover:text-primary transition-colors"
                          >
                            {h.text}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </details>
                );
              })()}

              {/* Content — HTML rendering */}
              <div
                ref={contentRef}
                className="prose prose-lg max-w-none text-foreground/90 leading-relaxed mb-12"
                dangerouslySetInnerHTML={{ __html: bodyHtml }}
              />

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mb-10 pt-6 border-t border-border/30">
                  <Tag className="size-4 text-muted-foreground" aria-hidden="true" />
                  <span className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wider mr-1">
                    {t("detail.tagsLabel")}
                  </span>
                  {post.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="rounded-full bg-muted/50 px-3 py-1 text-[12px] text-muted-foreground"
                    >
                      {tagName(tag)}
                    </span>
                  ))}
                </div>
              )}

              {/* Author card (mobile: below content) */}
              <div className="lg:hidden mb-12">
                <AuthorCard post={post} t={t} />
              </div>
            </div>

            {/* ═══ Sidebar ═══════════════════════════════════════ */}
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-24 space-y-6">
                {/* Author card */}
                <AuthorCard post={post} t={t} />

                {/* Table of Contents sidebar */}
                {(() => {
                  const headingRegex = /<h([23])[^>]*>(.*?)<\/h[23]>/gi;
                  const headings: { level: number; text: string; id: string }[] = [];
                  let match: RegExpExecArray | null;
                  let idx = 0;
                  while ((match = headingRegex.exec(post.content)) !== null && idx < 20) {
                    headings.push({
                      level: parseInt(match[1]),
                      text: match[2].replace(/<[^>]*>/g, "").trim(),
                      id: `heading-${idx++}`,
                    });
                  }
                  if (headings.length === 0) return null;
                  return (
                    <div className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm p-4">
                      <h4 className="text-[12px] font-semibold text-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                        <BookOpen className="size-4 text-primary" aria-hidden="true" />
                        {t("detail.tableOfContents")}
                      </h4>
                      <nav>
                        <ul className="space-y-1.5">
                          {headings.map((h) => (
                            <li key={h.id} style={{ paddingLeft: h.level === 3 ? "0.75rem" : "0" }}>
                              <a
                                href={`#${h.id}`}
                                className="text-[12px] text-muted-foreground hover:text-primary transition-colors leading-snug block"
                              >
                                {h.text}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </nav>
                    </div>
                  );
                })()}
              </div>
            </aside>
          </div>

          {/* ═══ Bottom CTA ═══════════════════════════════════════ */}
          <section className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/70 backdrop-blur-sm p-8 sm:p-10 text-center mb-24">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-[#0ab8fb]/5 via-transparent to-[#324b9d]/5"
            />
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#0ab8fb]/20 bg-[#0ab8fb]/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#0a9fdf] mb-4">
              <Sparkles className="size-3" aria-hidden="true" />
              {t("detail.cta.eyebrow")}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
              {t("detail.cta.title")}
            </h2>
            <p className="text-[14px] text-muted-foreground mb-6 max-w-md mx-auto leading-relaxed">
              {t("detail.cta.description")}
            </p>
            <Link
              href="/crm/quote"
              className="inline-flex items-center gap-2 rounded-lg bg-brand-gradient text-white px-6 py-3 text-[14px] font-semibold shadow-brand hover:opacity-90 transition-opacity"
            >
              {t("detail.cta.quote")}
            </Link>
          </section>
        </div>
      </div>
      <FooterSection />
    </>
  );
}

// ─── Author Card ──────────────────────────────────────────────────────

function AuthorCard({ post, t }: { post: BlogPostDetail; t: ReturnType<typeof useTranslations> }) {
  if (!post.author) return null;
  const { author } = post;

  return (
    <div className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm p-5">
      <div className="flex items-center gap-3 mb-3">
        {author.avatar?.url ? (
          <img
            src={getMediaUrl(author.avatar.url)}
            alt={author.full_name}
            className="size-12 rounded-full object-cover ring-2 ring-border/30"
          />
        ) : (
          <div className="flex size-12 items-center justify-center rounded-full bg-brand-gradient text-white text-lg font-bold">
            {author.full_name?.charAt(0) || "?"}
          </div>
        )}
        <div>
          <p className="text-[14px] font-semibold text-foreground leading-tight">
            {author.full_name}
          </p>
          {author.role_title && (
            <p className="text-[12px] text-muted-foreground">{author.role_title}</p>
          )}
        </div>
      </div>

      {author.bio && (
        <p className="text-[13px] text-muted-foreground leading-relaxed mb-3 line-clamp-4">
          {author.bio}
        </p>
      )}

      {/* Social links */}
      {(author.linkedin_url || author.github_url) && (
        <div className="flex items-center gap-2">
          {author.linkedin_url && (
            <a
              href={author.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#0a66c2]/10 px-3 py-1.5 text-[12px] text-[#0a66c2] hover:bg-[#0a66c2]/20 transition-colors"
            >
              <ExternalLink className="size-3.5" aria-hidden="true" />
              LinkedIn
            </a>
          )}
          {author.github_url && (
            <a
              href={author.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-[12px] text-muted-foreground hover:text-foreground transition-colors"
            >
              <ExternalLink className="size-3.5" aria-hidden="true" />
              GitHub
            </a>
          )}
        </div>
      )}
    </div>
  );
}
