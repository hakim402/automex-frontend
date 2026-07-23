"use client";

/**
 * SafeHTML — Renders trusted HTML content from the Django CMS.
 *
 * The content originates from the Django admin where only trusted editors
 * can create/update it — this is the standard headless-CMS pattern
 * (Contentful, Strapi, WordPress all ship raw HTML to the frontend).
 *
 * Features:
 *   - Renders HTML via dangerouslySetInnerHTML
 *   - Falls back to plain-text rendering (newline → <br> splitting)
 *   - Applies consistent prose typography via Tailwind's `prose`-like classes
 */

import { useMemo } from "react";
import { cn } from "@/lib/utils";

// ─── Helpers ──────────────────────────────────────────────────────────────

/** Detect whether a string contains HTML tags. */
function isHTML(value: string): boolean {
  return /<[a-z][\s\S]*>/i.test(value);
}

/** Convert plain text (newline-separated) to safe HTML. */
function plainTextToHTML(value: string): string {
  return value
    .split(/\n{2,}/)
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";
      // Headings: lines that are short, don't end with punctuation, look like titles
      if (
        trimmed.length < 80 &&
        !/[.!?;:,]$/.test(trimmed) &&
        !trimmed.includes("<") &&
        trimmed.split(" ").length <= 12
      ) {
        return `<h3 class="safe-html-heading">${trimmed}</h3>`;
      }
      return `<p>${trimmed.replace(/\n/g, "<br />")}</p>`;
    })
    .filter(Boolean)
    .join("\n");
}

/** Basic HTML sanitizer — strips script/style/event-handler attributes.
 *  Since content comes from trusted Django admin editors, this is a
 *  defense-in-depth measure, not the primary security boundary. */
function sanitizeHTML(html: string): string {
  return (
    html
      // Strip <script> tags entirely
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      // Strip <style> tags entirely
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
      // Strip on* event handlers
      .replace(/\s+on\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
      // Strip javascript: URLs
      .replace(/href\s*=\s*["']javascript:[^"']*["']/gi, 'href="#"')
  );
}

// ─── Component ────────────────────────────────────────────────────────────

interface SafeHTMLProps {
  /** Raw HTML or plain text string from the CMS. */
  html?: string | null;
  /** Optional className applied to the wrapper <div>. */
  className?: string;
  /** Render as a <span> instead of a <div>. */
  as?: "div" | "span";
}

export function SafeHTML({ html, className, as = "div" }: SafeHTMLProps) {
  const content = useMemo(() => {
    if (!html) return null;
    if (isHTML(html)) return sanitizeHTML(html);
    return plainTextToHTML(html);
  }, [html]);

  if (!content) return null;

  const Tag = as;

  return (
    <Tag
      className={cn(
        // ── Typography (mimics Tailwind prose but lighter) ──
        "safe-html",
        // Headings
        "[&_.safe-html-heading]:text-lg [&_.safe-html-heading]:font-semibold [&_.safe-html-heading]:text-foreground [&_.safe-html-heading]:mt-8 [&_.safe-html-heading]:mb-3",
        "[&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-foreground [&_h1]:mt-10 [&_h1]:mb-4",
        "[&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:mt-8 [&_h2]:mb-3",
        "[&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:mt-6 [&_h3]:mb-2",
        "[&_h4]:text-base [&_h4]:font-semibold [&_h4]:text-foreground [&_h4]:mt-5 [&_h4]:mb-2",
        // Paragraphs
        "[&_p]:text-[14px] [&_p]:leading-relaxed [&_p]:text-muted-foreground [&_p]:mb-3",
        // Lists
        "[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3 [&_ul]:space-y-1",
        "[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-3 [&_ol]:space-y-1",
        "[&_li]:text-[14px] [&_li]:leading-relaxed [&_li]:text-muted-foreground",
        // Inline
        "[&_strong]:font-semibold [&_strong]:text-foreground",
        "[&_em]:italic",
        "[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_a]:hover:no-underline",
        "[&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[13px] [&_code]:font-mono",
        "[&_pre]:rounded-xl [&_pre]:bg-muted [&_pre]:p-4 [&_pre]:text-[13px] [&_pre]:overflow-x-auto [&_pre]:mb-4",
        "[&_blockquote]:border-l-2 [&_blockquote]:border-primary/30 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground [&_blockquote]:mb-3",
        "[&_hr]:border-border [&_hr]:my-6",
        // Images
        "[&_img]:rounded-xl [&_img]:my-4 [&_img]:max-w-full",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
