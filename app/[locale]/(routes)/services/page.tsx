// app/[locale]/(routes)/services/page.tsx
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { generatePageMetadata } from "@/lib/seo/metadata";
import {
  fetchServices,
  fetchServiceCategories,
} from "@/lib/automex/content";
import type { SupportedLocale } from "@/lib/locale";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import JsonLd from "@/components/seo/JsonLd";
import { ServicesClientPage } from "./_components/ServicesClientPage";

const BASE_URL = "https://automex.tech";

type Props = {
  params: Promise<{ locale: SupportedLocale }>;
  searchParams: Promise<{ category?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ServicesPage" });
  return generatePageMetadata({
    pageType: "services",
    locale,
    pathSegment: "services",
    customTitle: t("meta.title"),
    customDescription: t("meta.description"),
  });
}

export default async function ServicesPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { category } = await searchParams;
  const t = await getTranslations({ locale, namespace: "ServicesPage" });

  const [initialServices, categories] =
    await Promise.all([
      fetchServices({ category, page: 1 }, locale),
      fetchServiceCategories(locale),
    ]);

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: initialServices.results.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: s.name,
      url: `${BASE_URL}/${locale}/services/${s.slug}`,
    })),
  };

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: t("breadcrumbHome"), url: `/${locale}` },
          { name: t("breadcrumbServices"), url: `/${locale}/services` },
        ]}
      />
      <JsonLd data={itemListSchema} id="services-itemlist-schema" />
      <ServicesClientPage
        initialServices={initialServices.results}
        hasMoreInitial={initialServices.next !== null}
        categories={categories}
        activeCategory={category}
        totalCount={initialServices.count}
      />
    </>
  );
}
