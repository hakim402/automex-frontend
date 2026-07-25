// app/[locale]/(routes)/services/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { fetchServiceBySlugFull, fetchServices } from "@/lib/automex/content";
import type { SupportedLocale } from "@/lib/locale";
import { getMediaUrl } from "@/lib/env";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import JsonLd from "@/components/seo/JsonLd";
import { ServiceDetailClientPage } from "./_components/ServiceDetailClientPage";

const BASE_URL = "https://automex.tech";

type Props = {
  params: Promise<{ locale: SupportedLocale; slug: string }>;
};

export async function generateStaticParams() {
  try {
    const { results } = await fetchServices({ page: 1 });
    return results.map((s) => ({ slug: s.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  try {
    const service = await fetchServiceBySlugFull(slug, locale);
    if (!service) return { title: "Service Not Found" };

    return generatePageMetadata({
      pageType: "serviceDetail",
      locale,
      pathSegment: `services/${slug}`,
      customTitle: service.seo.meta_title || `${service.name} – AUTOMEX`,
      customDescription: service.seo.meta_description || service.short_description,
      ogImageUrl: service.seo.og_image || getMediaUrl(service.hero_image?.url) || null,
      ogImageAlt: service.hero_image?.alt_text || service.name,
      canonicalUrl: service.seo.canonical_url || null,
    });
  } catch {
    return { title: "Service – AUTOMEX" };
  }
}

export default async function ServiceDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "ServicesPage" });

  const service = await fetchServiceBySlugFull(slug, locale);
  if (!service) notFound();

  // Related services: API's curated list first, then category-based fallback
  const relatedServices = service.related_services.length > 0
    ? service.related_services.slice(0, 3)
    : service.category?.slug
      ? (await fetchServices({ category: service.category.slug, page: 1 }, locale))
          .results
          .filter((s) => s.slug !== slug)
          .slice(0, 3)
      : [];

  // Breadcrumb schema
  const breadcrumbItems = [
    { name: t("breadcrumbHome"), url: `/${locale}` },
    { name: t("breadcrumbServices"), url: `/${locale}/services` },
    { name: service.name, url: `/${locale}/services/${slug}` },
  ];

  // Service schema.org
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.short_description,
    provider: {
      "@type": "Organization",
      name: "AUTOMEX",
      url: BASE_URL,
    },
    serviceType: service.category?.name || "",
    url: `${BASE_URL}/${locale}/services/${slug}`,
  };

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <JsonLd data={serviceSchema} id="service-detail-schema" />
      <ServiceDetailClientPage
        service={service}
        relatedServices={relatedServices}
      />
    </>
  );
}
