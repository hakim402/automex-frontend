// app/[locale]/(routes)/services/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { fetchServiceBySlug, fetchServices } from "@/lib/automex/content";
import type { SupportedLocale } from "@/lib/locale";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import JsonLd from "@/components/seo/JsonLd";
import { ServiceDetailClient } from "./_components/ServiceDetailClient";

const BASE_URL = "https://automex.tech";

type Props = {
  params: Promise<{ locale: SupportedLocale; slug: string }>;
};

// ─── Metadata ──────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const service = await fetchServiceBySlug(slug, locale);

  if (!service) return {};

  const seo = service.seo as Record<string, string | undefined>;

  return {
    title: seo.meta_title || service.name,
    description: seo.meta_description || service.short_description,
    keywords: seo.meta_keywords || undefined,
    alternates: seo.canonical_url ? { canonical: seo.canonical_url } : undefined,
    robots: (seo.robots_meta_content as string) || undefined,
    openGraph: {
      title: (seo.og_title as string) || service.name,
      description: (seo.og_description as string) || service.short_description,
      images: seo.og_image ? [seo.og_image as string] : undefined,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      type: ((seo.og_type as string) || "website") as any,
    },
    twitter: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      card: ((seo.twitter_card as string) || "summary_large_image") as any,
    },
  };
}

// ─── Page ───────────────────────────────────────────────────

export default async function ServiceDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "ServiceDetail" });

  const service = await fetchServiceBySlug(slug, locale);
  if (!service) notFound();

  // Related services: same category, exclude current
  const { results: relatedServices } = await fetchServices(
    { category: service.category.slug, page: 1 },
    locale
  );

  const filteredRelated = relatedServices.filter((s) => s.id !== service.id).slice(0, 3);

  // Breadcrumb
  const breadcrumbItems = [
    { name: t("breadcrumbHome"), url: `/${locale}` },
    { name: t("breadcrumbServices"), url: `/${locale}/services` },
    { name: service.name, url: `/${locale}/services/${service.slug}` },
  ];

  // JSON-LD
  const seo = service.seo as Record<string, string | undefined>;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": seo.structured_data_type || "Service",
    name: service.name,
    description: service.short_description,
    provider: {
      "@type": "Organization",
      name: "AUTOMEX",
      url: BASE_URL,
    },
    category: service.category.name,
    url: `${BASE_URL}/${locale}/services/${service.slug}`,
    ...(service.hero_image?.url && {
      image: service.hero_image.url,
    }),
  };

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <JsonLd data={jsonLd} id={`service-${service.slug}-schema`} />
      <ServiceDetailClient
        service={service}
        relatedServices={filteredRelated}
        locale={locale}
      />
    </>
  );
}
