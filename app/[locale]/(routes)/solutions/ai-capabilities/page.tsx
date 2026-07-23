// app/[locale]/(routes)/solutions/ai-capabilities/page.tsx
import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { fetchAICapabilities, fetchTechnologies } from "@/lib/automex/content";
import type { SupportedLocale } from "@/lib/locale";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import JsonLd from "@/components/seo/JsonLd";
import { AICapabilitiesClientPage } from "./_components/AICapabilitiesClientPage";

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
    pathSegment: "solutions/ai-capabilities",
    customTitle: "AI Capabilities – AUTOMEX Artificial Intelligence Solutions",
    customDescription: "Explore AUTOMEX AI capabilities — NLP, Computer Vision, Generative AI, Predictive Analytics, MLOps, and intelligent automation.",
  });
}

export default async function AICapabilitiesPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { category } = await searchParams;

  const [initialCapabilities, technologies] = await Promise.all([
    fetchAICapabilities({ category, page: 1 }, locale),
    fetchTechnologies(undefined, locale),
  ]);

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: initialCapabilities.results.map((cap, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: cap.name,
      url: `${BASE_URL}/${locale}/solutions/ai-capabilities/${cap.slug}`,
    })),
  };

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: `/${locale}` },
          { name: "Solutions", url: `/${locale}/solutions` },
          { name: "AI Capabilities", url: `/${locale}/solutions/ai-capabilities` },
        ]}
      />
      <JsonLd data={itemListSchema} id="ai-capabilities-itemlist-schema" />
      <AICapabilitiesClientPage
        initialCapabilities={initialCapabilities.results}
        hasMoreInitial={initialCapabilities.next !== null}
        technologies={technologies}
        activeCategory={category}
        totalCount={initialCapabilities.count}
      />
    </>
  );
}
