// app/[locale]/(routes)/case-studies/page.tsx
import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { fetchCaseStudies, fetchIndustries, fetchTechnologies } from "@/lib/automex/content";
import type { SupportedLocale } from "@/lib/locale";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import JsonLd from "@/components/seo/JsonLd";
import { CaseStudiesClientPage } from "./_components/CaseStudiesClientPage";

const BASE_URL = "https://automex.tech";

type Props = {
  params: Promise<{ locale: SupportedLocale }>;
  searchParams: Promise<{ industry?: string; service?: string; technology?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata({
    pageType: "services",
    locale,
    pathSegment: "case-studies",
    customTitle: "Case Studies – AUTOMEX Success Stories",
    customDescription: "Explore AUTOMEX case studies showcasing AI solutions, custom software, and digital transformation across industries.",
  });
}

export default async function CaseStudiesPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { industry, service, technology } = await searchParams;

  const [initialStudies, industries, technologies] = await Promise.all([
    fetchCaseStudies({ industry, service, technology, page: 1 }, locale),
    fetchIndustries(locale),
    fetchTechnologies(undefined, locale),
  ]);

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: initialStudies.results.map((cs, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: cs.title,
      url: `${BASE_URL}/${locale}/case-studies/${cs.slug}`,
    })),
  };

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: `/${locale}` },
          { name: "Case Studies", url: `/${locale}/case-studies` },
        ]}
      />
      <JsonLd data={itemListSchema} id="case-studies-itemlist-schema" />
      <CaseStudiesClientPage
        initialStudies={initialStudies.results}
        hasMoreInitial={initialStudies.next !== null}
        industries={industries}
        technologies={technologies}
        activeIndustry={industry}
        activeTechnology={technology}
        totalCount={initialStudies.count}
      />
    </>
  );
}
