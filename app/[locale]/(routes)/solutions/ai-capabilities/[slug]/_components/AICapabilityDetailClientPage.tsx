"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import {
  ExternalLink,
  Sparkles,
  Layers,
  Cpu,
  ArrowUpRight,
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import { Link } from "@/i18n/routing";
import { getMediaUrl } from "@/lib/env";
import { cn } from "@/lib/utils";
import type { AICapability, ServiceListItem } from "@/lib/automex/types";

const MATURITY_COLORS: Record<string, string> = {
  research: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  production: "bg-green-500/10 text-green-500 border-green-500/20",
  experimental: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
};

/** Resolve a lucide:icon-name string to a lucide-react component. */
function resolveLucideIcon(iconName: string | undefined): React.ElementType {
  if (!iconName) return Cpu;
  const name = iconName.startsWith("lucide:") ? iconName.slice(7) : iconName;
  const pascal = name
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join("");
  const map = LucideIcons as unknown as Record<string, React.ElementType>;
  return map[pascal] || Cpu;
}

/**
 * Improved sanitizer – removes <style>, classes, ids, inline styles,
 * and keeps only safe basic HTML tags.
 */
function sanitizeHtml(html: string | undefined | null): string {
  if (!html) return "";

  let cleaned = html;

  // 1. Remove <style> tags and their contents (CSS)
  cleaned = cleaned.replace(
    /<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi,
    "",
  );

  // 2. Remove <script> tags and their contents
  cleaned = cleaned.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    "",
  );

  // 3. Remove event handler attributes
  cleaned = cleaned.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, "");
  cleaned = cleaned.replace(/\s*on\w+\s*=\s*[^\s>]+/gi, "");

  // 4. Remove javascript: URIs
  cleaned = cleaned.replace(/href\s*=\s*["']\s*javascript:[^"']*["']/gi, "");
  cleaned = cleaned.replace(/src\s*=\s*["']\s*javascript:[^"']*["']/gi, "");

  // 5. Remove class, id, style attributes entirely
  cleaned = cleaned.replace(/\s+class\s*=\s*["'][^"']*["']/gi, "");
  cleaned = cleaned.replace(/\s+id\s*=\s*["'][^"']*["']/gi, "");
  cleaned = cleaned.replace(/\s+style\s*=\s*["'][^"']*["']/gi, "");

  // 6. Allowed tags – keep only these, strip everything else
  const allowedTags = new Set([
    "p",
    "br",
    "strong",
    "b",
    "em",
    "i",
    "u",
    "s",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "ul",
    "ol",
    "li",
    "a",
    "blockquote",
    "pre",
    "code",
    "hr",
    "sub",
    "sup",
  ]);

  // Remove disallowed tags (keep their inner content)
  cleaned = cleaned.replace(
    /<(\/?)([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/g,
    (match, slash, tagName) => {
      const lowerTag = tagName.toLowerCase();
      if (allowedTags.has(lowerTag)) {
        return match; // Keep allowed tags
      }
      return ""; // Remove disallowed tags, keep inner content
    },
  );

  // 7. Remove empty divs and spans that might have been stripped
  cleaned = cleaned.replace(/<div\b[^>]*>/gi, "");
  cleaned = cleaned.replace(/<\/div>/gi, "");
  cleaned = cleaned.replace(/<span\b[^>]*>/gi, "");
  cleaned = cleaned.replace(/<\/span>/gi, "");

  // 8. Clean up extra whitespace and line breaks
  cleaned = cleaned.replace(/\s+/g, " ").trim();

  return cleaned;
}

export function AICapabilityDetailClientPage({
  capability: cap,
  relatedServices,
}: {
  capability: AICapability;
  relatedServices: ServiceListItem[];
}) {
  const t = useTranslations("AICapabilities");
  const CapIcon = resolveLucideIcon(cap.icon);

  const maturityLabel = cap.maturity_level
    ? (() => {
        try {
          return t(`detail.maturity.${cap.maturity_level}` as any);
        } catch {
          return cap.maturity_level_display || cap.maturity_level;
        }
      })()
    : null;

  const sanitizedDescription = sanitizeHtml(cap.description);

  return (
    <>
      <div className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
        >
          <div className="absolute -top-24 right-0 size-112.5 rounded-full bg-[#0ab8fb]/3 blur-3xl" />
          <div className="absolute top-1/3 -left-32 size-87.5 rounded-full bg-[#324b9d]/3 blur-3xl" />
        </div>

        <article className="mx-auto max-w-4xl px-4 py-16 sm:py-24">
          {/* ─── Cover Image (top) ─────────────────────────────── */}
          {cap.cover_image?.url && (
            <figure className="relative mb-8 rounded-2xl overflow-hidden border border-border/30 shadow-brand">
              <Image
                src={getMediaUrl(cap.cover_image.url)}
                alt={cap.cover_image.alt_text || cap.name}
                width={1200}
                height={600}
                className="w-full h-auto max-h-125 object-cover"
                priority
                unoptimized
              />
              <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-background/20 to-transparent pointer-events-none" />
            </figure>
          )}

          {/* ─── Title with Icon (below image) ─────────────────── */}
          <div className="flex items-center gap-4 mb-4">
            <span
              className="inline-flex items-center justify-center size-12 sm:size-14 rounded-2xl bg-brand-gradient text-white shrink-0 shadow-brand"
              aria-hidden="true"
            >
              <CapIcon className="size-6 sm:size-7" />
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground tracking-tight leading-tight">
              {cap.name}
            </h1>
          </div>

          {/* ─── Category + maturity badges ────────────────────── */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-[11px] font-medium uppercase tracking-wider text-primary">
              {cap.category_display}
            </span>
            {maturityLabel && (
              <span
                className={cn(
                  "inline-flex items-center rounded-full border text-[10px] font-semibold px-2 py-0.5",
                  MATURITY_COLORS[cap.maturity_level || ""] ||
                    "bg-muted/50 text-muted-foreground border-border/20",
                )}
              >
                {maturityLabel}
              </span>
            )}
            {cap.is_active && (
              <span className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 text-[10px] font-semibold px-2 py-0.5">
                Active
              </span>
            )}
          </div>

          {/* ─── Description (sanitized HTML) ───────────────────── */}
          {sanitizedDescription && (
            <section className="mb-10">
              <h2 className="text-xl font-bold text-foreground mb-4">
                {t("detail.about")}
              </h2>
              <div
                className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-foreground prose-ul:text-muted-foreground prose-li:text-muted-foreground prose-blockquote:border-primary prose-blockquote:bg-muted/30 prose-blockquote:p-4 prose-blockquote:rounded-xl prose-pre:bg-muted/50 prose-code:text-primary prose-code:bg-muted/30 prose-code:px-1 prose-code:py-0.5 prose-code:rounded"
                dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
              />
            </section>
          )}

          {/* ─── Technologies ────────────────────────────────────── */}
          {cap.technologies.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xl font-bold text-foreground mb-4">
                {t("detail.technologies")}
              </h2>
              <div className="flex flex-wrap gap-2">
                {cap.technologies.map((tech) => {
                  const TechIcon = resolveLucideIcon(tech.icon);
                  const chip = (
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-border/40 bg-muted/30 px-2.5 py-1.5 text-[12px] text-foreground/80 hover:border-primary/30 hover:bg-muted/50 transition-colors">
                      <TechIcon
                        className="size-3.5 shrink-0"
                        aria-hidden="true"
                      />
                      {tech.name}
                    </span>
                  );
                  return tech.website_url ? (
                    <a
                      key={tech.id}
                      href={tech.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {chip}
                    </a>
                  ) : (
                    <span key={tech.id}>{chip}</span>
                  );
                })}
              </div>
            </section>
          )}

          {/* ─── Related Services ────────────────────────────────── */}
          {relatedServices.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Layers className="size-5 text-primary" aria-hidden="true" />
                {t("detail.relatedServices")}
                <span className="text-[13px] font-normal text-muted-foreground">
                  ({relatedServices.length})
                </span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {relatedServices.map((service) => (
                  <Link
                    key={service.id}
                    href={`/services/${service.slug}` as any}
                    className="group flex items-start gap-3 rounded-xl border border-border/40 bg-card/50 backdrop-blur-sm p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:shadow-brand/5 hover:border-primary/40"
                  >
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-gradient/5 text-primary/60 mt-0.5">
                      <Cpu className="size-4" aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                        {service.name}
                      </h3>
                      {service.short_description && (
                        <p className="text-[12px] text-muted-foreground leading-relaxed line-clamp-2">
                          {service.short_description}
                        </p>
                      )}
                    </div>
                    <ArrowUpRight
                      className="size-3.5 shrink-0 text-muted-foreground/40 group-hover:text-primary transition-colors mt-1"
                      aria-hidden="true"
                    />
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* ─── Demo URL ────────────────────────────────────────── */}
          {cap.demo_url && (
            <section className="mb-10">
              <a
                href={cap.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-5 py-3 text-[14px] font-medium text-primary hover:bg-primary/10 transition-colors"
              >
                <ExternalLink className="size-4" aria-hidden="true" />
                {t("detail.demo")}
              </a>
            </section>
          )}

          {/* ─── Bottom CTA ──────────────────────────────────────── */}
          <section className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/70 backdrop-blur-sm p-8 sm:p-10 text-center">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-br from-[#0ab8fb]/5 via-transparent to-[#324b9d]/5"
            />
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#0ab8fb]/20 bg-[#0ab8fb]/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#0a9fdf] mb-4">
              <Sparkles className="size-3" aria-hidden="true" />
              {t("detail.cta.eyebrow")}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
              {t("detail.cta.title", { name: cap.name })}
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
        </article>
      </div>
    </>
  );
}
