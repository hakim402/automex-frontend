// app/[locale]/(routes)/case-studies/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { fetchCaseStudyBySlug, fetchCaseStudies } from "@/lib/automex/content";
import type { SupportedLocale } from "@/lib/locale";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import JsonLd from "@/components/seo/JsonLd";
import { CaseStudyDetailClientPage } from "./_components/CaseStudyDetailClientPage";

const BASE_URL = "https://automex.tech";

type Props = {
  params: Promise<{ locale: SupportedLocale; slug: string }>;
};

export async function generateStaticParams() {
  try {
    const { results } = await fetchCaseStudies({ page: 1 });
    return results.map((cs) => ({ slug: cs.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  try {
    const cs = await fetchCaseStudyBySlug(slug, locale);
    if (!cs) return { title: "Case Study Not Found" };

    const seoTitle = (cs.seo as Record<string, string>)?.meta_title || cs.title;
    const seoDesc = (cs.seo as Record<string, string>)?.meta_description || cs.overview?.slice(0, 160);
    const seoOgImage = (cs.seo as Record<string, string>)?.og_image || null;
    const seoCanonical = (cs.seo as Record<string, string>)?.canonical_url || null;

    return generatePageMetadata({
      pageType: "services",
      locale,
      pathSegment: `case-studies/${slug}`,
      customTitle: `${seoTitle} – AUTOMEX Case Study`,
      customDescription: seoDesc,
      ogImageUrl: seoOgImage || cs.thumbnail?.url || null,
      ogImageAlt: cs.thumbnail?.alt_text || cs.title,
      canonicalUrl: seoCanonical,
    });
  } catch {
    return { title: "Case Study – AUTOMEX" };
  }
}

export default async function CaseStudyDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  let cs: Awaited<ReturnType<typeof fetchCaseStudyBySlug>>;
  try {
    cs = await fetchCaseStudyBySlug(slug, locale);
  } catch {
    notFound();
  }
  if (!cs) notFound();

  const breadcrumbItems = [
    { name: "Home", url: `/${locale}` },
    { name: "Case Studies", url: `/${locale}/case-studies` },
    { name: cs.title, url: `/${locale}/case-studies/${slug}` },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: cs.title,
          description: cs.overview,
          image: cs.thumbnail?.url || undefined,
          datePublished: cs.published_at,
          publisher: { "@type": "Organization", name: "AUTOMEX", url: BASE_URL },
          url: `${BASE_URL}/${locale}/case-studies/${slug}`,
        }}
        id="case-study-detail-schema"
      />
      <CaseStudyDetailClientPage caseStudy={cs} />
    </>
  );
}
