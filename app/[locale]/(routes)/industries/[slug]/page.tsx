// app/[locale]/(routes)/industries/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { generatePageMetadata } from "@/lib/seo/metadata";
import {
  fetchIndustryBySlug,
  fetchServices,
  fetchCaseStudies,
} from "@/lib/automex/content";
import type { SupportedLocale } from "@/lib/locale";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import JsonLd from "@/components/seo/JsonLd";
import { IndustryDetailClientPage } from "./_components/IndustryDetailClientPage";

const BASE_URL = "https://automex.tech";

type Props = {
  params: Promise<{ locale: SupportedLocale; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  try {
    const industry = await fetchIndustryBySlug(slug, locale);
    if (!industry) return { title: "Industry Not Found" };

    return generatePageMetadata({
      pageType: "services",
      locale,
      pathSegment: `industries/${slug}`,
      customTitle: `${industry.name} Industry Solutions – AUTOMEX`,
      customDescription: industry.description?.slice(0, 160),
    });
  } catch {
    return { title: "Industry – AUTOMEX" };
  }
}

export default async function IndustryDetailPage({ params }: Props) {
  const { locale, slug } = await params;

  let industry: Awaited<ReturnType<typeof fetchIndustryBySlug>>;
  try {
    industry = await fetchIndustryBySlug(slug, locale);
  } catch {
    notFound();
  }
  if (!industry) notFound();

  const [servicesRes, caseStudiesRes] = await Promise.all([
    fetchServices({ industry: slug, page: 1 }, locale),
    fetchCaseStudies({ industry: slug, page: 1 }, locale),
  ]);

  const relatedServices = servicesRes.results.slice(0, 3);
  const relatedCaseStudies = caseStudiesRes.results.slice(0, 3);

  const breadcrumbItems = [
    { name: "Home", url: `/${locale}` },
    { name: "Industries", url: `/${locale}/industries` },
    { name: industry.name, url: `/${locale}/industries/${slug}` },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: `AUTOMEX ${industry.name} Solutions`,
          description: industry.description,
          itemListElement: [
            ...relatedServices.map((s, i) => ({
              "@type": "ListItem" as const,
              position: i + 1,
              item: {
                "@type": "Service" as const,
                name: s.name,
                url: `${BASE_URL}/${locale}/services/${s.slug}`,
              },
            })),
            ...relatedCaseStudies.map((cs, i) => ({
              "@type": "ListItem" as const,
              position: relatedServices.length + i + 1,
              item: {
                "@type": "Article" as const,
                name: cs.title,
                url: `${BASE_URL}/${locale}/case-studies/${cs.slug}`,
              },
            })),
          ],
        }}
        id="industry-detail-schema"
      />
      <IndustryDetailClientPage
        industry={industry}
        relatedServices={relatedServices}
        relatedCaseStudies={relatedCaseStudies}
      />
    </>
  );
}
