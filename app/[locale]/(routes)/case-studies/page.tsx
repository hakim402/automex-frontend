// app/[locale]/(routes)/case-studies/page.tsx
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { fetchCaseStudies, fetchIndustries, fetchServices } from "@/lib/automex/content";
import type { SupportedLocale } from "@/lib/locale";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import JsonLd from "@/components/seo/JsonLd";
import { CaseStudiesClientPage } from "./_components/CaseStudiesClientPage";

const BASE_URL = "https://automex.tech";

type Props = {
  params: Promise<{ locale: SupportedLocale }>;
  searchParams: Promise<{ industry?: string; service?: string; technology?: string; featured?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "CaseStudiesPage" });
  return generatePageMetadata({
    pageType: "caseStudies",
    locale,
    pathSegment: "case-studies",
    customTitle: t("meta.title"),
    customDescription: t("meta.description"),
  });
}

export default async function CaseStudiesPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { industry, service, technology, featured } = await searchParams;
  const t = await getTranslations({ locale, namespace: "CaseStudiesPage" });

  const isFeatured = featured === "true" ? true : undefined;

  const [initialCaseStudies, industries, servicesData] = await Promise.all([
    fetchCaseStudies({ industry, service, technology, is_featured: isFeatured, page: 1 }, locale),
    fetchIndustries(locale),
    fetchServices({ page: 1 }, locale),
  ]);

  // Stats
  const totalCount = initialCaseStudies.count;
  const industriesServed = industries.length;
  // Tech count from backend — CaseStudyListItem doesn't carry technologies, so we use a static placeholder
  const technologiesCount = 20;

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: initialCaseStudies.results.map((cs, i) => ({
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
          { name: t("breadcrumbHome"), url: `/${locale}` },
          { name: t("breadcrumbCaseStudies"), url: `/${locale}/case-studies` },
        ]}
      />
      <JsonLd data={itemListSchema} id="case-studies-itemlist-schema" />
      <CaseStudiesClientPage
        initialCaseStudies={initialCaseStudies.results}
        hasMoreInitial={initialCaseStudies.next !== null}
        industries={industries}
        services={servicesData.results}
        activeIndustry={industry}
        activeService={service}
        activeTechnology={technology}
        activeFeatured={isFeatured}
        totalCount={totalCount}
        industriesServed={industriesServed}
        technologiesCount={technologiesCount}
      />
    </>
  );
}
