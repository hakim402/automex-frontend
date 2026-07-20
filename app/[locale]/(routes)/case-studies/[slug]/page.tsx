// app/[locale]/(routes)/case-studies/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { fetchCaseStudyBySlug, fetchCaseStudies } from "@/lib/automex/content";
import type { SupportedLocale } from "@/lib/locale";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import JsonLd from "@/components/seo/JsonLd";
import { CaseStudyDetailClient } from "./_components/CaseStudyDetailClient";

const BASE_URL = "https://automex.tech";

type Props = {
  params: Promise<{ locale: SupportedLocale; slug: string }>;
};

// ─── Metadata ──────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const caseStudy = await fetchCaseStudyBySlug(slug, locale);

  if (!caseStudy) return {};

  const seo = caseStudy.seo as Record<string, string | undefined>;

  return {
    title: (seo.meta_title as string) || caseStudy.title,
    description: (seo.meta_description as string) || caseStudy.overview?.slice(0, 160),
    keywords: (seo.meta_keywords as string) || undefined,
    alternates: seo.canonical_url
      ? { canonical: seo.canonical_url as string }
      : undefined,
    openGraph: {
      title: ((seo.og_title as string) || caseStudy.title) as string,
      description: ((seo.og_description as string) || caseStudy.overview?.slice(0, 160)) as string,
      images: caseStudy.thumbnail?.url
        ? [{ url: caseStudy.thumbnail.url, alt: caseStudy.thumbnail.alt_text || caseStudy.title }]
        : undefined,
      type: "article" as const,
    },
    twitter: {
      card: "summary_large_image" as const,
    },
  };
}

// ─── Page ───────────────────────────────────────────────────

export default async function CaseStudyDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "CaseStudyDetail" });

  const caseStudy = await fetchCaseStudyBySlug(slug, locale);
  if (!caseStudy) notFound();

  // Related case studies: same industry, exclude current, max 2
  const { results: relatedCaseStudies } = await fetchCaseStudies(
    { industry: caseStudy.client_industry.slug, page: 1 },
    locale
  );
  const filteredRelated = relatedCaseStudies
    .filter((cs) => cs.id !== caseStudy.id)
    .slice(0, 2);

  // Breadcrumb
  const breadcrumbItems = [
    { name: t("breadcrumbHome"), url: `/${locale}` },
    { name: t("breadcrumbCaseStudies"), url: `/${locale}/case-studies` },
    { name: caseStudy.title, url: `/${locale}/case-studies/${caseStudy.slug}` },
  ];

  // JSON-LD CaseStudy schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CaseStudy",
    name: caseStudy.title,
    headline: caseStudy.title,
    description: caseStudy.overview?.slice(0, 160),
    ...(caseStudy.thumbnail?.url && {
      image: caseStudy.thumbnail.url,
    }),
    url: `${BASE_URL}/${locale}/case-studies/${caseStudy.slug}`,
    ...(caseStudy.client_name && {
      author: {
        "@type": "Organization",
        name: caseStudy.client_name,
      },
    }),
    publisher: {
      "@type": "Organization",
      name: "AUTOMEX",
      url: BASE_URL,
    },
  };

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <JsonLd data={jsonLd} id={`case-study-${caseStudy.slug}-schema`} />
      <CaseStudyDetailClient
        caseStudy={caseStudy}
        relatedCaseStudies={filteredRelated}
        locale={locale}
      />
    </>
  );
}
