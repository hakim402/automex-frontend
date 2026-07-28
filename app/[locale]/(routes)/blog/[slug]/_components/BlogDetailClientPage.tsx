"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import {
  Clock,
  ArrowLeft,
  ArrowRight,
  Eye,
  BookOpen,
  Tag,
  Sparkles,
  Copy,
  Check,
  ExternalLink,
  Play,
  Crown,
  RefreshCcw,
  Briefcase,
  FileText,
  X,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Send,
  MessageCircle,
  type LucideIcon,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { resolveMediaUrl } from "@/lib/automex/media";
import { sanitizeRichHtml } from "@/lib/automex/rich-content";
import { cn } from "@/lib/utils";
import type {
  BlogPostDetailFull,
  BlogHeroImage,
  BlogRelatedService,
  BlogRelatedCaseStudy,
} from "@/lib/automex/types";
import { FooterSection } from "@/app/[locale]/_components/Footer/FooterSections";

// ─── Custom social SVG icons ──────────────────────────────────────────

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
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

function tagName(tag: BlogPostDetailFull["tags"][number]): string {
  return tag.name || tag.slug;
}

// ─── Category icon resolver ───────────────────────────────────────────

const BLOG_ICON_MAP: Record<string, LucideIcon> = {
  "lucide:code-2": BookOpen,
  "lucide:cpu": BookOpen,
  "lucide:globe": BookOpen,
  "lucide:shield-check": BookOpen,
  "lucide:cloud": BookOpen,
  "lucide:smartphone": BookOpen,
  "lucide:palette": BookOpen,
  "lucide:bar-chart-3": BookOpen,
  "lucide:book-open": BookOpen,
  "lucide:sparkles": BookOpen,
};

function categoryIcon(iconName: string | undefined): LucideIcon | null {
  if (!iconName) return null;
  return BLOG_ICON_MAP[iconName] ?? null;
}

/**
 * Extract the inner body content from a full HTML document.
 */
function extractBodyHtml(html: string): string {
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch) return bodyMatch[1].trim();

  return html
    .replace(/<!DOCTYPE[^>]*>/gi, "")
    .replace(/<html[^>]*>/gi, "")
    .replace(/<\/html>/gi, "")
    .replace(/<head[\s\S]*?<\/head>/gi, "")
    .replace(/<meta[^>]*>/gi, "")
    .replace(/<title>[\s\S]*?<\/title>/gi, "")
    .replace(/<body[^>]*>/gi, "")
    .replace(/<\/body>/gi, "")
    .trim();
}

interface Heading {
  level: number;
  text: string;
  id: string;
}

/**
 * Injects ids into h2/h3 tags and returns both patched HTML and headings list.
 */
function injectHeadingIds(html: string): { html: string; headings: Heading[] } {
  const headings: Heading[] = [];
  let idx = 0;
  const patched = html.replace(
    /<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi,
    (match, level: string, attrs: string, inner: string) => {
      if (idx >= 20) return match;
      const text = inner.replace(/<[^>]*>/g, "").trim();
      if (!text) return match;
      const id = `heading-${idx++}`;
      headings.push({ level: Number(level), text, id });
      const cleanAttrs = attrs.replace(/\s+id=["'][^"']*["']/i, "");
      return `<h${level}${cleanAttrs} id="${id}">${inner}</h${level}>`;
    },
  );
  return { html: patched, headings };
}

// ─── Reading Progress ─────────────────────────────────────────────────

function useReadingProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    function handleScroll() {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      setProgress(
        docHeight <= 0
          ? 100
          : Math.min(100, Math.round((scrollTop / docHeight) * 100)),
      );
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return progress;
}

// ─── Sticky Mini Header ──────────────────────────────────────────────

function StickyMiniHeader({
  title,
  visible,
  progress,
  onShare,
  copied,
}: {
  title: string;
  visible: boolean;
  progress: number;
  onShare: () => void;
  copied: boolean;
}) {
  return (
    <div
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b border-border/30 bg-background/95 backdrop-blur-xl transition-all duration-300",
        visible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0",
      )}
      aria-hidden={!visible}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-6">
        <Link
          href="/blog"
          className="flex shrink-0 cursor-pointer items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4 rtl:rotate-180" />
          <span className="hidden sm:inline">Back</span>
        </Link>
        <p className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
          {title}
        </p>
        <button
          onClick={onShare}
          className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full bg-muted/40 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          {copied ? (
            <Check className="size-3.5 text-emerald-500" />
          ) : (
            <Copy className="size-3.5" />
          )}
          <span className="hidden sm:inline">
            {copied ? "Copied" : "Copy link"}
          </span>
        </button>
      </div>
      <div className="h-0.5 w-full bg-transparent">
        <div
          className="h-full bg-brand-gradient transition-[width] duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

// ─── Share Buttons ─────────────────────────────────────────────────────

function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
  };

  const copyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium text-muted-foreground/60">
        Share
      </span>

      <button
        onClick={() => window.open(shareLinks.twitter, "_blank")}
        className="group inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-border/30 bg-card/40 text-muted-foreground transition-all hover:border-[#1DA1F2] hover:bg-[#1DA1F2]/10 hover:text-[#1DA1F2]"
        aria-label="Share on Twitter"
      >
        <X className="h-4 w-4 transition-colors group-hover:text-[#1DA1F2]" />
      </button>

      <button
        onClick={() => window.open(shareLinks.facebook, "_blank")}
        className="group inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-border/30 bg-card/40 text-muted-foreground transition-all hover:border-[#1877F2] hover:bg-[#1877F2]/10 hover:text-[#1877F2]"
        aria-label="Share on Facebook"
      >
        <FacebookIcon className="h-4 w-4 transition-colors group-hover:text-[#1877F2]" />
      </button>

      <button
        onClick={() => window.open(shareLinks.linkedin, "_blank")}
        className="group inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-border/30 bg-card/40 text-muted-foreground transition-all hover:border-[#0A66C2] hover:bg-[#0A66C2]/10 hover:text-[#0A66C2]"
        aria-label="Share on LinkedIn"
      >
        <LinkedinIcon className="h-4 w-4 transition-colors group-hover:text-[#0A66C2]" />
      </button>

      <button
        onClick={() => window.open(shareLinks.whatsapp, "_blank")}
        className="group inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-border/30 bg-card/40 text-muted-foreground transition-all hover:border-[#25D366] hover:bg-[#25D366]/10 hover:text-[#25D366]"
        aria-label="Share on WhatsApp"
      >
        <MessageCircle className="h-4 w-4 transition-colors group-hover:text-[#25D366]" />
      </button>

      <button
        onClick={() => window.open(shareLinks.telegram, "_blank")}
        className="group inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-border/30 bg-card/40 text-muted-foreground transition-all hover:border-[#26A5E4] hover:bg-[#26A5E4]/10 hover:text-[#26A5E4]"
        aria-label="Share on Telegram"
      >
        <Send className="h-4 w-4 transition-colors group-hover:text-[#26A5E4]" />
      </button>

      <button
        onClick={copyLink}
        className="group inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-border/30 bg-card/40 text-muted-foreground transition-all hover:border-primary hover:bg-primary/10 hover:text-primary"
        aria-label="Copy link"
      >
        {copied ? (
          <Check className="h-4 w-4 text-emerald-500" />
        ) : (
          <Copy className="h-4 w-4 transition-colors group-hover:text-primary" />
        )}
      </button>
    </div>
  );
}

// ─── Gallery Lightbox ─────────────────────────────────────────────────

function GalleryLightbox({
  images,
  index,
  onClose,
  onNavigate,
}: {
  images: { url: string; alt_text?: string; caption?: string }[];
  index: number;
  onClose: () => void;
  onNavigate: (nextIndex: number) => void;
}) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNavigate((index + 1) % images.length);
      if (e.key === "ArrowLeft")
        onNavigate((index - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [index, images.length, onClose, onNavigate]);

  const current = images[index];

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-10">
      <div
        className="fixed inset-0 bg-background/90 backdrop-blur-md"
        onClick={onClose}
        aria-hidden="true"
      />

      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-10 flex size-10 cursor-pointer items-center justify-center rounded-full bg-muted/60 text-foreground transition-colors hover:bg-muted"
        aria-label="Close"
      >
        <X className="size-5" />
      </button>

      {images.length > 1 && (
        <>
          <button
            onClick={() =>
              onNavigate((index - 1 + images.length) % images.length)
            }
            className="absolute left-3 top-1/2 z-10 flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-muted/60 text-foreground transition-colors hover:bg-muted sm:left-6"
            aria-label="Previous image"
          >
            <ChevronLeft className="size-5 rtl:rotate-180" />
          </button>
          <button
            onClick={() => onNavigate((index + 1) % images.length)}
            className="absolute right-3 top-1/2 z-10 flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-muted/60 text-foreground transition-colors hover:bg-muted sm:right-6"
            aria-label="Next image"
          >
            <ChevronRight className="size-5 rtl:rotate-180" />
          </button>
        </>
      )}

      <figure className="relative z-1 max-h-[85vh] max-w-4xl">
        <Image
          src={resolveMediaUrl(current.url) ?? ""}
          alt={current.alt_text || current.caption || ""}
          width={1200}
          height={800}
          className="max-h-[85vh] w-auto rounded-xl object-contain shadow-2xl"
          unoptimized
        />
        {current.caption && (
          <figcaption className="mt-3 text-center text-sm text-muted-foreground">
            {current.caption}
          </figcaption>
        )}
        {images.length > 1 && (
          <p className="mt-1 text-center text-xs text-muted-foreground/70">
            {index + 1} / {images.length}
          </p>
        )}
      </figure>
    </div>
  );
}

// ─── Table of Contents ────────────────────────────────────────────────

function TableOfContents({
  headings,
  activeHeadingId,
}: {
  headings: Heading[];
  activeHeadingId: string | null;
}) {
  if (headings.length === 0) return null;

  return (
    <nav className="space-y-0.5">
      {headings.map((h) => {
        const active = h.id === activeHeadingId;
        return (
          <a
            key={h.id}
            href={`#${h.id}`}
            style={{
              paddingLeft: h.level === 3 ? "1.5rem" : "0.625rem",
            }}
            className={cn(
              "group relative block cursor-pointer py-1.5 pe-1 text-sm leading-snug transition-all duration-200",
              active
                ? "text-primary font-medium"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <span
              className={cn(
                "absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full transition-all duration-200",
                active
                  ? "bg-brand-gradient h-6 w-1"
                  : "bg-transparent group-hover:bg-border/50 group-hover:w-0.5",
              )}
            />
            <span
              className={cn(
                "block transition-all duration-200",
                active && "translate-x-1",
              )}
            >
              {h.text}
            </span>
          </a>
        );
      })}
    </nav>
  );
}

// ─── Gallery Carousel (with auto‑play) ───────────────────────────────

function GalleryCarousel({
  images,
  onImageClick,
}: {
  images: { url: string; alt_text?: string; caption?: string }[];
  onImageClick: (index: number) => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalSlides = images.length;

  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrentIndex(index);
      setTimeout(() => setIsTransitioning(false), 400);
    },
    [isTransitioning],
  );

  const goToPrev = useCallback(() => {
    if (isTransitioning) return;
    goToSlide((currentIndex - 1 + totalSlides) % totalSlides);
  }, [currentIndex, totalSlides, isTransitioning, goToSlide]);

  const goToNext = useCallback(() => {
    if (isTransitioning) return;
    goToSlide((currentIndex + 1) % totalSlides);
  }, [currentIndex, totalSlides, isTransitioning, goToSlide]);

  // Auto‑play: change slide every 5 seconds
  useEffect(() => {
    if (totalSlides <= 1) return;

    const startAutoPlay = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        if (!isPaused) {
          goToNext();
        }
      }, 5000);
    };

    startAutoPlay();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [totalSlides, isPaused, goToNext]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const endX = e.changedTouches[0].clientX;
    const diff = touchStartX - endX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goToNext();
      else goToPrev();
    }
    setTouchStartX(null);
  };

  if (images.length === 0) return null;

  return (
    <div
      className="mb-8 overflow-hidden rounded-xl bg-muted/30"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className="relative aspect-video w-full overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Slides */}
        <div
          className="flex h-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((img, idx) => (
            <div
              key={idx}
              className="relative h-full w-full shrink-0 cursor-zoom-in"
              onClick={() => onImageClick(idx)}
            >
              <Image
                src={resolveMediaUrl(img.url) ?? ""}
                alt={img.alt_text || img.caption || ""}
                fill
                className="object-cover transition-transform duration-300 hover:scale-[1.02]"
                sizes="(max-width: 1200px) 100vw, 1200px"
                unoptimized
              />
              {img.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-background/80 to-transparent p-4">
                  <p className="text-sm text-white/90">{img.caption}</p>
                </div>
              )}
              {totalSlides > 1 && (
                <div className="absolute top-3 right-3 z-10 flex items-center gap-1 rounded-full bg-black/30 px-2 py-0.5 text-xs text-white/70 backdrop-blur-sm">
                  <span>{idx + 1}</span>
                  <span className="text-white/40">/</span>
                  <span>{totalSlides}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        {totalSlides > 1 && (
          <>
            <button
              onClick={goToPrev}
              className="absolute left-2 top-1/2 z-10 flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-background/80 text-foreground shadow-lg backdrop-blur-sm transition-all hover:bg-background hover:shadow-xl disabled:opacity-50"
              aria-label="Previous image"
            >
              <ChevronLeft className="size-5 rtl:rotate-180" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 z-10 flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-background/80 text-foreground shadow-lg backdrop-blur-sm transition-all hover:bg-background hover:shadow-xl disabled:opacity-50"
              aria-label="Next image"
            >
              <ChevronRight className="size-5 rtl:rotate-180" />
            </button>
          </>
        )}

        {/* Dot Indicators */}
        {totalSlides > 1 && (
          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                className={cn(
                  "h-1.5 cursor-pointer rounded-full transition-all duration-200",
                  idx === currentIndex
                    ? "w-6 bg-white"
                    : "w-1.5 bg-white/50 hover:bg-white/80",
                )}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Author Bio ──────────────────────────────────────────────────────

function AuthorBioFull({ author }: { author: BlogPostDetailFull["author"] }) {
  if (!author) return null;

  const avatarUrl = author.avatar?.url ? resolveMediaUrl(author.avatar.url) : null;

  return (
    <div className="border-t border-border/20 pt-6">
      <div className="flex items-start gap-4">
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={author.full_name}
            width={48}
            height={48}
            className="rounded-full object-cover ring-2 ring-border/20"
            unoptimized
          />
        ) : (
          <div className="flex size-12 items-center justify-center rounded-full bg-brand-gradient text-lg font-bold text-white shadow-brand">
            {author.full_name?.charAt(0) || "?"}
          </div>
        )}
        <div className="flex-1">
          <p className="text-base font-semibold text-foreground">
            {author.full_name}
          </p>
          {author.role_title && (
            <p className="text-sm text-muted-foreground">{author.role_title}</p>
          )}
          {author.bio && (
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {author.bio}
            </p>
          )}
          {(author.linkedin_url || author.github_url) && (
            <div className="mt-3 flex gap-2">
              {author.linkedin_url && (
                <a
                  href={author.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-[#0A66C2]/10 px-3 py-1.5 text-xs font-medium text-[#0A66C2] transition-all hover:bg-[#0A66C2]/20"
                >
                  <LinkedinIcon className="size-3.5 transition-transform group-hover:scale-110" />
                  LinkedIn
                </a>
              )}
              {author.github_url && (
                <a
                  href={author.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-muted/50 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
                >
                  <svg
                    className="size-3.5 transition-transform group-hover:scale-110"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.468-2.38 1.235-3.22-.123-.3-.535-1.52.117-3.16 0 0 1.008-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.29-1.552 3.297-1.23 3.297-1.23.653 1.64.24 2.86.118 3.16.768.84 1.233 1.91 1.233 3.22 0 4.61-2.804 5.62-5.476 5.92.43.37.824 1.102.824 2.22 0 1.602-.015 2.894-.015 3.287 0 .322.216.694.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12z" />
                  </svg>
                  GitHub
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────

export function BlogDetailClientPage({ post }: { post: BlogPostDetailFull }) {
  const t = useTranslations("Blog");
  const progress = useReadingProgress();

  const [shareUrl, setShareUrl] = useState("");
  useEffect(() => {
    setShareUrl(window.location.href);
  }, []);

  // Cover image
  const coverUrl =
    post.cover_image?.url && post.cover_image.file_type !== "video"
      ? resolveMediaUrl(post.cover_image.url)
      : null;
  const coverAlt = post.cover_image?.alt_text || post.title;

  // Hero images gallery
  const heroImages =
    post.hero_images?.map((img) => ({
      url: img.image?.url || "",
      alt_text: img.image?.alt_text || "",
      caption: img.caption || "",
    })) || [];

  // Sanitize content – use sanitizeRichHtml on the body content
  const contentBody = useMemo(() => {
    const raw = extractBodyHtml(post.content);
    return sanitizeRichHtml(raw);
  }, [post.content]);

  // Inject heading ids for TOC (after sanitization)
  const { html: contentWithIds, headings } = useMemo(
    () => injectHeadingIds(contentBody),
    [contentBody],
  );

  // Scroll-spy for active heading
  const [activeHeadingId, setActiveHeadingId] = useState<string | null>(null);
  useEffect(() => {
    if (headings.length === 0) return;
    const elements = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) setActiveHeadingId(visible[0].target.id);
      },
      { rootMargin: "-100px 0px -70% 0px" },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings, contentWithIds]);

  // Hero title visibility for sticky header
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const [heroTitleVisible, setHeroTitleVisible] = useState(true);
  useEffect(() => {
    const el = heroTitleRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setHeroTitleVisible(entry.isIntersecting),
      { rootMargin: "-56px 0px 0px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Lightbox
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Reading time fallback
  const readingTime =
    post.reading_time_minutes ??
    Math.ceil((post.content?.length || 500) / 1500);

  // Category icon
  const CatIcon = post.category?.icon ? categoryIcon(post.category.icon) : null;

  // All gallery images (hero cover + hero_images)
  const allGalleryImages = useMemo(() => {
    const images = [];
    if (coverUrl) {
      images.push({ url: coverUrl, alt_text: coverAlt, caption: "" });
    }
    heroImages.forEach((img) => {
      images.push(img);
    });
    return images;
  }, [coverUrl, coverAlt, heroImages]);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  return (
    <>
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-transparent">
        <div
          className="h-full bg-brand-gradient transition-[width] duration-150 ease-out"
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Reading progress"
        />
      </div>

      {/* Sticky Mini Header */}
      <StickyMiniHeader
        title={post.title}
        visible={!heroTitleVisible}
        progress={progress}
        onShare={() =>
          navigator.clipboard.writeText(window.location.href).then(() => {})
        }
        copied={false}
      />

      <div className="relative overflow-hidden">
        {/* Background decorations */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
        >
          <div className="absolute -top-24 right-0 size-96 rounded-full bg-primary/4 blur-3xl" />
          <div className="absolute top-1/3 -left-32 size-80 rounded-full bg-accent/30 blur-3xl" />
        </div>

        <article className="mx-auto max-w-5xl px-4 py-12 sm:py-16 lg:py-20 mt-12 md:mt-24">
          {/* ─── Header: Centered, editorial ──────────────────── */}
          <header className="mb-8 text-center">
            {/* Category + badges */}
            <div className="mb-3 flex flex-wrap items-center justify-center gap-2">
              {post.category && (
                <span className="inline-flex cursor-default items-center gap-1.5 rounded-full border border-color/20 bg-color/5 px-3 py-1 text-sm font-medium text-color">
                  {CatIcon && <CatIcon className="size-4" />}
                  {post.category.name}
                </span>
              )}
              {post.is_featured && (
                <span className="inline-flex cursor-default items-center gap-1 rounded-full bg-brand-gradient px-3 py-1 text-xs font-semibold text-white shadow-brand">
                  <Sparkles className="size-3" />
                  {t("detail.featured")}
                </span>
              )}
              {post.is_premium && (
                <span className="inline-flex cursor-default items-center gap-1 rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                  <Crown className="size-3" />
                  {t("detail.premium")}
                </span>
              )}
            </div>

            {/* Title */}
            <h1
              ref={heroTitleRef}
              className="text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-5xl"
            >
              {post.title}
            </h1>

            {/* Meta row */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
              {post.published_at && (
                <span className="flex cursor-default items-center gap-1">
                  <CalendarDays className="size-4" />
                  {formatDate(post.published_at)}
                </span>
              )}
              <span className="flex cursor-default items-center gap-1">
                <Clock className="size-4" />
                {readingTime} min read
              </span>
              {post.views_count != null && post.views_count > 0 && (
                <span className="flex cursor-default items-center gap-1">
                  <Eye className="size-4" />
                  {post.views_count}
                </span>
              )}
              {post.tags.length > 0 && (
                <div className="flex items-center gap-2">
                  <Tag className="size-4" />
                  <div className="flex gap-1">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag.id}
                        className="cursor-default rounded-full bg-muted/50 px-2 py-0.5 text-xs"
                      >
                        {tagName(tag)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </header>

          {/* ─── Gallery Carousel (with auto‑play) ────────────── */}
          {allGalleryImages.length > 0 && (
            <GalleryCarousel
              images={allGalleryImages}
              onImageClick={openLightbox}
            />
          )}

          {/* ─── Lightbox ──────────────────────────────────────── */}
          {lightboxIndex !== null && (
            <GalleryLightbox
              images={allGalleryImages}
              index={lightboxIndex}
              onClose={() => setLightboxIndex(null)}
              onNavigate={setLightboxIndex}
            />
          )}

          {/* ─── Video Embed ──────────────────────────────────── */}
          {post.video_embed_url && (
            <div className="mb-8">
              <div className="relative aspect-video overflow-hidden rounded-xl border border-border/20 bg-black shadow-lg">
                <iframe
                  src={post.video_embed_url}
                  title={post.title}
                  className="absolute inset-0 size-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="mt-2 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Play className="size-4 text-primary" />
                <span>{t("detail.watchVideo")}</span>
              </div>
            </div>
          )}

          {/* ─── External URL ──────────────────────────────────── */}
          {post.external_url && (
            <div className="mb-8">
              <a
                href={post.external_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
              >
                <ExternalLink className="size-4" />
                {t("detail.readOriginal")}
              </a>
            </div>
          )}

          {/* ─── Main Content + Sidebar (TOC) ─────────────────── */}
          <div className="flex flex-col gap-10 lg:flex-row">
            {/* Content column */}
            <div className="min-w-0 flex-1">
              {/* TOC mobile collapsible */}
              {headings.length > 0 && (
                <details className="group mb-8 rounded-2xl border border-border/20 bg-card/40 p-4 backdrop-blur-sm lg:hidden">
                  <summary className="flex cursor-pointer select-none items-center gap-2 text-sm font-semibold text-foreground">
                    <BookOpen className="size-4 text-primary" />
                    {t("detail.tableOfContents")}
                  </summary>
                  <div className="mt-3 border-t border-border/20 pt-3">
                    <TableOfContents
                      headings={headings}
                      activeHeadingId={activeHeadingId}
                    />
                  </div>
                </details>
              )}

              {/* Main content – now uses sanitizeRichHtml + content-blocks CSS */}
              <div
                className="prose-content prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-foreground prose-ul:text-muted-foreground prose-li:text-muted-foreground prose-blockquote:border-primary prose-blockquote:bg-muted/30 prose-blockquote:p-4 prose-blockquote:rounded-xl prose-pre:bg-muted/50 prose-code:text-primary prose-code:bg-muted/30 prose-code:px-1 prose-code:py-0.5 prose-code:rounded scroll-mt-24"
                dangerouslySetInnerHTML={{ __html: contentWithIds }}
              />

              {/* Tags (full list) */}
              {post.tags.length > 0 && (
                <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-border/20 pt-6">
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground/60">
                    Tags:
                  </span>
                  {post.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="cursor-default rounded-full bg-muted/30 px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted"
                    >
                      {tagName(tag)}
                    </span>
                  ))}
                </div>
              )}

              {/* Last updated */}
              {post.updated_at && post.updated_at !== post.published_at && (
                <div className="mt-4 text-sm text-muted-foreground/70">
                  <RefreshCcw className="mr-1 inline size-3.5" />
                  Last updated {formatDate(post.updated_at)}
                </div>
              )}

              {/* Author bio (full) */}
              <div className="mt-8">
                <AuthorBioFull author={post.author} />
              </div>

              {/* Share buttons */}
              <div className="mt-6 flex justify-center border-t border-border/20 pt-6">
                <ShareButtons url={shareUrl} title={post.title} />
              </div>
            </div>

            {/* Sidebar - TOC desktop */}
            {headings.length > 0 && (
              <aside className="hidden w-64 shrink-0 lg:block">
                <div className="sticky top-24 rounded-2xl border border-border/20 bg-card/40 p-4 backdrop-blur-sm">
                  <h4 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
                    <BookOpen className="size-4 text-primary" />
                    {t("detail.tableOfContents")}
                  </h4>
                  <TableOfContents
                    headings={headings}
                    activeHeadingId={activeHeadingId}
                  />
                </div>
              </aside>
            )}
          </div>

          {/* ─── Related Services ────────────────────────────── */}
          {post.related_services.length > 0 && (
            <section className="mt-12">
              <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-foreground">
                <Briefcase className="size-5 text-primary" />
                {t("detail.relatedServices")}
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {post.related_services.map((service: BlogRelatedService) => (
                  <Link
                    key={service.id}
                    href={`/services/${service.slug}` as any}
                    className="group flex cursor-pointer items-start gap-4 rounded-xl border border-border/20 bg-card/40 p-4 backdrop-blur-sm transition-all hover:border-primary/30 hover:shadow-md"
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-soft/70 text-primary transition-transform duration-150 group-hover:scale-105">
                      <Briefcase className="size-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-1 text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                        {service.name}
                      </p>
                      {service.short_description && (
                        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                          {service.short_description}
                        </p>
                      )}
                    </div>
                    <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-primary rtl:rotate-180" />
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* ─── Related Case Studies ────────────────────────── */}
          {post.related_case_studies.length > 0 && (
            <section className="mt-12">
              <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-foreground">
                <FileText className="size-5 text-primary" />
                {t("detail.relatedCaseStudies")}
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {post.related_case_studies.map(
                  (caseStudy: BlogRelatedCaseStudy) => (
                    <Link
                      key={caseStudy.id}
                      href={`/case-studies/${caseStudy.slug}` as any}
                      className="group flex cursor-pointer items-start gap-4 rounded-xl border border-border/20 bg-card/40 p-4 backdrop-blur-sm transition-all hover:border-primary/30 hover:shadow-md"
                    >
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-soft/70 text-primary transition-transform duration-150 group-hover:scale-105">
                        <FileText className="size-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-1 text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                          {caseStudy.title}
                        </p>
                        {caseStudy.overview && (
                          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                            {caseStudy.overview}
                          </p>
                        )}
                      </div>
                      <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-primary rtl:rotate-180" />
                    </Link>
                  ),
                )}
              </div>
            </section>
          )}

          {/* ─── Bottom CTA ───────────────────────────────────── */}
          <section className="relative mt-12 overflow-hidden rounded-2xl border border-border/20 bg-brand-soft/40 p-8 text-center backdrop-blur-sm sm:p-10">
            <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-background/60 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              <Sparkles className="size-3" />
              {t("detail.cta.eyebrow")}
            </span>
            <h2 className="mb-2 text-xl font-bold text-foreground sm:text-2xl">
              {t("detail.cta.title")}
            </h2>
            <p className="mx-auto mb-6 max-w-md text-sm text-muted-foreground">
              {t("detail.cta.description")}
            </p>
            <Link
              href="/crm/quote"
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-brand-gradient px-7 py-3 text-sm font-semibold text-white shadow-brand transition-opacity hover:opacity-90"
            >
              {t("detail.cta.quote")}
              <ArrowRight className="size-4 rtl:rotate-180" />
            </Link>
          </section>
        </article>
      </div>

      {/* Footer */}
      <FooterSection />
    </>
  );
}