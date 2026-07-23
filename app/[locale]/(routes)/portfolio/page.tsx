// app/[locale]/(routes)/portfolio/page.tsx
import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { fetchPortfolioProjects, fetchTechnologies, fetchIndustries } from "@/lib/automex/content";
import type { SupportedLocale } from "@/lib/locale";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import JsonLd from "@/components/seo/JsonLd";
import { PortfolioClientPage } from "./_components/PortfolioClientPage";

const BASE_URL = "https://automex.tech";

type Props = {
  params: Promise<{ locale: SupportedLocale }>;
  searchParams: Promise<{
    industry?: string;
    technology?: string;
    service?: string;
    featured?: string;
    search?: string;
    ordering?: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata({
    pageType: "services",
    locale,
    pathSegment: "portfolio",
    customTitle: "Portfolio – AUTOMEX Projects & Work",
    customDescription: "Browse AUTOMEX portfolio of custom software, AI solutions, and digital transformation projects across industries.",
  });
}

export default async function PortfolioPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { industry, technology, service, featured, search, ordering } = await searchParams;

  const [initialProjects, technologies, industries] = await Promise.all([
    fetchPortfolioProjects({
      industry,
      technology,
      service,
      is_featured: featured === "true" ? true : undefined,
      search,
      ordering,
      page: 1,
    }, locale),
    fetchTechnologies(undefined, locale),
    fetchIndustries(locale),
  ]);

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: initialProjects.results.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.title,
      url: `${BASE_URL}/${locale}/portfolio/${p.slug}`,
    })),
  };

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: `/${locale}` },
          { name: "Portfolio", url: `/${locale}/portfolio` },
        ]}
      />
      <JsonLd data={itemListSchema} id="portfolio-itemlist-schema" />
      <PortfolioClientPage
        initialProjects={initialProjects.results}
        hasMoreInitial={initialProjects.next !== null}
        industries={industries}
        technologies={technologies}
        activeIndustry={industry}
        activeTechnology={technology}
        activeService={service}
        activeFeatured={featured}
        activeSearch={search}
        activeOrdering={ordering}
        totalCount={initialProjects.count}
      />
    </>
  );
}
