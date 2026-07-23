// app/[locale]/(routes)/tech-expertise/page.tsx
import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { fetchTechExpertiseAreas } from "@/lib/automex/content";
import type { TechExpertiseArea } from "@/lib/automex/types";
import type { SupportedLocale } from "@/lib/locale";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import JsonLd from "@/components/seo/JsonLd";
import { TechExpertiseClientPage } from "./_components/TechExpertiseClientPage";

const BASE_URL = "https://automex.tech";

type Props = {
  params: Promise<{ locale: SupportedLocale }>;
  searchParams: Promise<{ category?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata({
    pageType: "services",
    locale,
    pathSegment: "tech-expertise",
    customTitle: "Tech Expertise – AUTOMEX Technology Capabilities",
    customDescription: "Explore AUTOMEX technology expertise areas across architecture, cloud, AI, data engineering, DevOps, mobile, security, and QA.",
  });
}

export default async function TechExpertisePage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { category } = await searchParams;

  // Graceful fallback when backend is unreachable during static build
  let areas: TechExpertiseArea[];
  try {
    areas = await fetchTechExpertiseAreas({ category }, locale);
  } catch {
    areas = [];
  }

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: areas.map((a, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: a.name,
      url: `${BASE_URL}/${locale}/tech-expertise/${a.slug}`,
    })),
  };

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: `/${locale}` },
          { name: "Tech Expertise", url: `/${locale}/tech-expertise` },
        ]}
      />
      <JsonLd data={itemListSchema} id="tech-expertise-itemlist-schema" />
      <TechExpertiseClientPage areas={areas} activeCategory={category} />
    </>
  );
}
