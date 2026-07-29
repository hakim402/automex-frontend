// app/[locale]/(routes)/terms/page.tsx
//
// Terms of Service — Automex LLC
// Governing law: Washington State (RCW Title 19) + federal US law
// Last updated: July 2025

import type { Metadata } from "next";
import Link from "next/link";
import { Fragment } from "react";
import { getTranslations } from "next-intl/server";
import { generatePageMetadata } from "@/lib/seo/metadata";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import LocalBusinessSchema from "@/components/seo/LocalBusinessSchema";
import { SUPPORTED_LOCALES, isRtlLocale } from "@/lib/locale";

// ─── Constants ────────────────────────────────────────

const COMPANY = "Automex LLC";
const SITE = "automex.tech";
const EMAIL = "legal@automex.tech";
const ADDRESS = "4911 Talbot Rd S, Renton, WA 98055, United States";

// ─── Metadata ─────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Terms" });

  return generatePageMetadata({
    pageType: "terms",
    locale: locale as any,
    customTitle: t("title"),
    customDescription: t("metaDescription"),
    pathSegment: "terms",
  });
}

// ─── Page ─────────────────────────────────────────────

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isRtl = isRtlLocale(locale);
  const t = await getTranslations({ locale, namespace: "Terms" });

  // Breadcrumb items
  const breadcrumbItems = [
    { name: t("breadcrumbHome"), url: `/${locale}` },
    { name: t("title"), url: `/${locale}/terms` },
  ];

  // Helper to render section
  const Section = ({
    id,
    title,
    children,
  }: {
    id: string;
    title: string;
    children: React.ReactNode;
  }) => (
    <section aria-labelledby={`section-${id}`} className="mb-10 scroll-mt-24">
      <h2
        id={`section-${id}`}
        className="mb-4 text-xl font-bold tracking-tight text-foreground"
      >
        {title}
      </h2>
      <div className="space-y-3 text-muted-foreground">{children}</div>
    </section>
  );

  // Helper to render list items
  const List = ({ items }: { items: string[] }) => (
    <ul className="list-disc pl-6 space-y-1.5">
      {items.map((item, i) => (
        <li
          key={i}
          className="text-[15px] leading-relaxed"
          dangerouslySetInnerHTML={{ __html: item }}
        />
      ))}
    </ul>
  );

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <LocalBusinessSchema />

      <main
        className="min-h-screen bg-background text-foreground"
        dir={isRtl ? "rtl" : "ltr"}
      >
        {/* ─── Hero ──────────────────────────────────────────────────── */}
        <div className="relative isolate overflow-hidden bg-background pt-20 md:pt-42">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,rgb(10_184_251/12%),transparent)]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgb(148_198_233/0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgb(148_198_233/0.04)_1px,transparent_1px)] bg-size-[48px_48px]"
          />

          <div className="mx-auto max-w-3xl px-4 pb-8 sm:px-6 lg:px-8">
            <Link
              href={`/${locale}`}
              className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <span aria-hidden="true" className="text-lg">
                ←
              </span>
              {t("backToHome")}
            </Link>

            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {t("title")}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span>
                  <strong>{t("effectiveDateLabel")}</strong>{" "}
                  {t("effectiveDateValue")}
                </span>
                <span className="hidden sm:inline">·</span>
                <span>
                  <strong>{t("companyLabel")}</strong> {COMPANY}
                </span>
                <span className="hidden sm:inline">·</span>
                <span>
                  <strong>{t("locationLabel")}</strong> {ADDRESS}
                </span>
              </div>
              <p
                className="mt-4 text-[15px] leading-relaxed text-muted-foreground"
                dangerouslySetInnerHTML={{
                  __html: t("intro", { company: COMPANY, site: SITE }),
                }}
              />
            </div>
          </div>
        </div>

        {/* ─── Content ────────────────────────────────────────────────── */}
        <div className="mx-auto max-w-3xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="prose prose-slate dark:prose-invert prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-foreground prose-li:text-muted-foreground max-w-none">
            {[
              {
                id: "1",
                title: t("section1.title"),
                content: t.raw("section1"),
              },
              {
                id: "2",
                title: t("section2.title"),
                content: t.raw("section2"),
              },
              {
                id: "3",
                title: t("section3.title"),
                content: t.raw("section3"),
              },
              {
                id: "4",
                title: t("section4.title"),
                content: t.raw("section4"),
              },
              {
                id: "5",
                title: t("section5.title"),
                content: t.raw("section5"),
              },
              {
                id: "6",
                title: t("section6.title"),
                content: t.raw("section6"),
              },
              {
                id: "7",
                title: t("section7.title"),
                content: t.raw("section7"),
              },
              {
                id: "8",
                title: t("section8.title"),
                content: t.raw("section8"),
              },
              {
                id: "9",
                title: t("section9.title"),
                content: t.raw("section9"),
              },
              {
                id: "10",
                title: t("section10.title"),
                content: t.raw("section10"),
              },
              {
                id: "11",
                title: t("section11.title"),
                content: t.raw("section11"),
              },
              {
                id: "12",
                title: t("section12.title"),
                content: t.raw("section12"),
              },
              {
                id: "13",
                title: t("section13.title"),
                content: t.raw("section13"),
              },
            ].map(({ id, title, content }) => (
              <Section key={id} id={id} title={title}>
                {content.intro && <p>{content.intro}</p>}
                {content.subsections &&
                  Object.entries(content.subsections).map(
                    ([key, sub]: [string, any]) => (
                      <Fragment key={key}>
                        {sub.title && (
                          <h3 className="text-base font-semibold text-foreground">
                            {sub.title}
                          </h3>
                        )}
                        {sub.content && <p>{sub.content}</p>}
                        {sub.items && <List items={sub.items} />}
                      </Fragment>
                    ),
                  )}
                {content.items && <List items={content.items} />}
                {content.legalBasis && (
                  <p className="mt-4 text-sm text-muted-foreground/80 italic">
                    {content.legalBasis}
                  </p>
                )}
                {content.disposal && <p className="mt-2">{content.disposal}</p>}
                {content.disclaimer && (
                  <p className="mt-2 text-sm">{content.disclaimer}</p>
                )}
                {content.control && (
                  <p className="mt-2 text-sm">{content.control}</p>
                )}
                {content.acceptance && (
                  <p className="mt-2 text-sm">{content.acceptance}</p>
                )}
                {content.commitment && (
                  <p className="mt-4 text-sm">{content.commitment}</p>
                )}
                {id === "13" && (
                  <>
                    <address className="not-italic mt-4 rounded-xl border border-border/50 bg-muted/30 p-5 text-sm leading-7 text-foreground">
                      <strong>{COMPANY}</strong>
                      <br />
                      {t("section13.address.department")}
                      <br />
                      {ADDRESS}
                      <br />
                      {t("section13.address.emailLabel")}{" "}
                      <a
                        href={`mailto:${EMAIL}`}
                        className="text-primary hover:underline"
                      >
                        {EMAIL}
                      </a>
                      <br />
                      {t("section13.address.websiteLabel")}{" "}
                      <a
                        href={`https://${SITE}`}
                        className="text-primary hover:underline"
                        target="_blank"
                        rel="noopener"
                      >
                        {SITE}
                      </a>
                    </address>
                  </>
                )}
              </Section>
            ))}

            {/* Legal notice */}
            <div
              className="mt-12 rounded-xl border border-border/40 bg-muted/20 p-5 text-xs leading-6 text-muted-foreground"
              dangerouslySetInnerHTML={{
                __html: t("legalNotice", { company: COMPANY }),
              }}
            />
          </div>

          {/* Bottom nav */}
          <div className="mt-12 flex flex-wrap gap-4 border-t border-border/40 pt-8 text-sm text-muted-foreground">
            <Link
              href={`/${locale}/privacy`}
              className="hover:text-foreground hover:underline"
            >
              {t("bottomNav.privacy")}
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="hover:text-foreground hover:underline"
            >
              {t("bottomNav.contact")}
            </Link>
            <Link
              href={`/${locale}`}
              className="hover:text-foreground hover:underline"
            >
              {t("bottomNav.home")}
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}

// ─── Static params ──────────────────────────────────

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}
