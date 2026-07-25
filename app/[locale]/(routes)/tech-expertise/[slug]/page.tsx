// app/[locale]/(routes)/tech-expertise/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { fetchTechExpertiseBySlug, fetchTechExpertiseAreas, fetchCaseStudies } from "@/lib/automex/content";
import type { TechExpertiseArea, CaseStudyListItem } from "@/lib/automex/types";
import type { SupportedLocale } from "@/lib/locale";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import JsonLd from "@/components/seo/JsonLd";
import { TechExpertiseDetailClientPage } from "./_components/TechExpertiseDetailClientPage";

const BASE_URL = "https://automex.tech";

type Props = {
  params: Promise<{ locale: SupportedLocale; slug: string }>;
};

export async function generateStaticParams() {
  try {
    const areas = await fetchTechExpertiseAreas({});
    return areas.map((a) => ({ slug: a.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  try {
    const area = await fetchTechExpertiseBySlug(slug, locale);
    if (!area) return { title: "Expertise Not Found" };

    return generatePageMetadata({
      pageType: "techExpertiseDetail",
      locale,
      pathSegment: `tech-expertise/${slug}`,
      customTitle: `${area.name} – AUTOMEX Tech Expertise`,
      customDescription: area.description?.slice(0, 160),
    });
  } catch {
    return { title: "Tech Expertise – AUTOMEX" };
  }
}

export default async function TechExpertiseDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  let area: TechExpertiseArea | null;
  try {
    area = await fetchTechExpertiseBySlug(slug, locale);
  } catch {
    notFound();
  }
  if (!area) notFound();

  // Resolve case study UUIDs to displayable names/slugs
  let resolvedCaseStudies: Pick<CaseStudyListItem, "id" | "slug" | "title">[] = [];
  if (area.case_studies?.length) {
    try {
      const all = await fetchCaseStudies({}, locale);
      const uuidSet = new Set(area.case_studies);
      resolvedCaseStudies = all.results
        .filter((cs) => uuidSet.has(cs.id))
        .map((cs) => ({ id: cs.id, slug: cs.slug, title: cs.title }));
    } catch {
      // Non-critical — fall through to empty array
    }
  }

  const displayName = area.name || area.slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const breadcrumbItems = [
    { name: "Home", url: `/${locale}` },
    { name: "Tech Expertise", url: `/${locale}/tech-expertise` },
    { name: displayName, url: `/${locale}/tech-expertise/${slug}` },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "TechArticle",
          headline: area.name,
          description: area.description,
          publisher: { "@type": "Organization", name: "AUTOMEX", url: BASE_URL },
          url: `${BASE_URL}/${locale}/tech-expertise/${slug}`,
        }}
        id="tech-expertise-detail-techarticle-schema"
      />
      <TechExpertiseDetailClientPage area={area} resolvedCaseStudies={resolvedCaseStudies} />
    </>
  );
}
