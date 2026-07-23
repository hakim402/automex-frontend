"use client";

import { ArrowLeft, Clock, Building2, Globe, Calendar, Sparkles, CheckCircle2 } from "lucide-react";
import { Link } from "@/i18n/routing";
import { getMediaUrl } from "@/lib/env";
import type { CaseStudyDetail } from "@/lib/automex/types";
import { FooterSection } from "@/app/[locale]/_components/Footer/FooterSections";

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function CaseStudyDetailClientPage({ caseStudy: cs }: { caseStudy: CaseStudyDetail }) {
  return (
    <>
      <div className="relative overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-24 right-0 size-[450px] rounded-full bg-[#0ab8fb]/3 blur-3xl" />
          <div className="absolute top-1/3 -left-32 size-[350px] rounded-full bg-[#324b9d]/3 blur-3xl" />
        </div>

        <article className="mx-auto max-w-4xl px-4 py-16 sm:py-24">
          {/* Back link */}
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            Back to Case Studies
          </Link>

          {/* Client industry + featured badge */}
          <div className="flex items-center gap-3 mb-4">
            {cs.client_industry && (
              <span className="text-[11px] font-medium uppercase tracking-wider text-primary">
                {cs.client_industry.name}
              </span>
            )}
            {cs.is_featured && (
              <span className="inline-flex items-center gap-1 rounded-full bg-brand-gradient text-white text-[11px] font-semibold px-2.5 py-1 shadow-brand">
                <Sparkles className="size-3" aria-hidden="true" />
                Featured
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tight leading-tight">
            {cs.title}
          </h1>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-4 text-[13px] text-muted-foreground mb-8 pb-6 border-b border-border/30">
            {cs.client_name && (
              <span className="font-medium text-foreground">{cs.client_name}</span>
            )}
            {cs.published_at && (
              <span className="inline-flex items-center gap-1">
                <Calendar className="size-3.5" aria-hidden="true" />
                {formatDate(cs.published_at)}
              </span>
            )}
            {cs.project_duration_weeks != null && (
              <span className="inline-flex items-center gap-1">
                <Clock className="size-3.5" aria-hidden="true" />
                {cs.project_duration_weeks} weeks
              </span>
            )}
            {cs.project_url && (
              <a
                href={cs.project_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline"
              >
                <Globe className="size-3.5" aria-hidden="true" />
                Live project
              </a>
            )}
          </div>

          {/* Client logo */}
          {cs.client_logo?.url && (
            <div className="mb-10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getMediaUrl(cs.client_logo.url)}
                alt={cs.client_logo.alt_text || cs.client_name || "Client logo"}
                className="max-h-16 object-contain"
              />
            </div>
          )}

          {/* Overview */}
          {cs.overview && (
            <section className="mb-10">
              <h2 className="text-xl font-bold text-foreground mb-4">Overview</h2>
              <div className="prose text-[14px] sm:text-[15px] text-muted-foreground leading-relaxed space-y-3">
                {cs.overview.split("\n").map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </section>
          )}

          {/* Challenge */}
          {cs.challenge && (
            <section className="mb-10">
              <h2 className="text-xl font-bold text-foreground mb-4">Challenge</h2>
              <div className="prose text-[14px] sm:text-[15px] text-muted-foreground leading-relaxed space-y-3">
                {cs.challenge.split("\n").map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </section>
          )}

          {/* Solution */}
          {cs.solution && (
            <section className="mb-10">
              <h2 className="text-xl font-bold text-foreground mb-4">Solution</h2>
              <div className="prose text-[14px] sm:text-[15px] text-muted-foreground leading-relaxed space-y-3">
                {cs.solution.split("\n").map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </section>
          )}

          {/* Technologies */}
          {cs.technologies.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xl font-bold text-foreground mb-4">Technologies Used</h2>
              <div className="flex flex-wrap gap-2">
                {cs.technologies.map((t) => (
                  <span
                    key={t.id}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border/40 bg-muted/30 px-2.5 py-1.5 text-[12px] text-foreground/80"
                  >
                    {t.name}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Results */}
          {cs.results && (
            <section className="mb-10">
              <h2 className="text-xl font-bold text-foreground mb-4">Results</h2>
              <div className="prose text-[14px] sm:text-[15px] text-muted-foreground leading-relaxed space-y-3">
                {cs.results.split("\n").map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </section>
          )}

          {/* Gallery */}
          {cs.gallery.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xl font-bold text-foreground mb-4">Gallery</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {cs.gallery.map((img) => (
                  <figure key={img.id} className="rounded-xl overflow-hidden border border-border/30">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getMediaUrl(img.media.url)}
                      alt={img.caption || "Gallery image"}
                      className="w-full h-auto object-cover"
                    />
                    {img.caption && (
                      <figcaption className="text-[12px] text-muted-foreground p-3 text-center">
                        {img.caption}
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
            </section>
          )}

          {/* Bottom CTA */}
          <section className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/70 backdrop-blur-sm p-8 sm:p-10 text-center">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-[#0ab8fb]/5 via-transparent to-[#324b9d]/5" />
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#0ab8fb]/20 bg-[#0ab8fb]/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#0a9fdf] mb-4">
              <Sparkles className="size-3" aria-hidden="true" />
              Let&apos;s Build
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
              Want similar results?
            </h2>
            <p className="text-[14px] text-muted-foreground mb-6 max-w-md mx-auto leading-relaxed">
              Let&apos;s discuss how we can help your business achieve transformative outcomes.
            </p>
            <Link
              href="/crm/quote"
              className="inline-flex items-center gap-2 rounded-lg bg-brand-gradient text-white px-6 py-3 text-[14px] font-semibold shadow-brand hover:opacity-90 transition-opacity"
            >
              Request a Quote
            </Link>
          </section>
        </article>
      </div>
      <FooterSection />
    </>
  );
}
