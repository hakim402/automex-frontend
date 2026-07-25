// app/[locale]/(routes)/solutions/ai-capabilities/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { fetchAICapabilityBySlug, fetchAICapabilities, fetchServices } from "@/lib/automex/content";
import type { SupportedLocale } from "@/lib/locale";
import type { ServiceListItem } from "@/lib/automex/types";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import JsonLd from "@/components/seo/JsonLd";
import { AICapabilityDetailClientPage } from "./_components/AICapabilityDetailClientPage";

const BASE_URL = "https://automex.tech";

type Props = {
  params: Promise<{ locale: SupportedLocale; slug: string }>;
};

export async function generateStaticParams() {
  try {
    const { results } = await fetchAICapabilities({ page: 1 });
    return results.map((cap) => ({ slug: cap.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  try {
    const cap = await fetchAICapabilityBySlug(slug, locale);
    if (!cap) return { title: "AI Capability Not Found" };

    return generatePageMetadata({
      pageType: "aiCapabilityDetail",
      locale,
      pathSegment: `solutions/ai-capabilities/${slug}`,
      customTitle: `${cap.name} – AUTOMEX AI Capabilities`,
      customDescription: cap.description?.slice(0, 160),
      ogImageUrl: cap.cover_image?.url || null,
      ogImageAlt: cap.cover_image?.alt_text || cap.name,
    });
  } catch {
    return { title: "AI Capability – AUTOMEX" };
  }
}

export default async function AICapabilityDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  let cap: Awaited<ReturnType<typeof fetchAICapabilityBySlug>>;
  try {
    cap = await fetchAICapabilityBySlug(slug, locale);
  } catch {
    notFound();
  }
  if (!cap) notFound();

  // Resolve related_services UUIDs to ServiceListItem objects
  let relatedServices: ServiceListItem[] = [];
  if (cap.related_services && cap.related_services.length > 0) {
    try {
      const servicesRes = await fetchServices({ page: 1 }, locale);
      const serviceIds = new Set(cap.related_services);
      relatedServices = servicesRes.results.filter((s) => serviceIds.has(s.id));
    } catch {
      // Non-critical — page still renders without related services
    }
  }

  const breadcrumbItems = [
    { name: "Home", url: `/${locale}` },
    { name: "Solutions", url: `/${locale}/solutions` },
    { name: "AI Capabilities", url: `/${locale}/solutions/ai-capabilities` },
    { name: cap.name, url: `/${locale}/solutions/ai-capabilities/${slug}` },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "TechArticle",
          headline: cap.name,
          description: cap.description,
          image: cap.cover_image?.url || undefined,
          publisher: { "@type": "Organization", name: "AUTOMEX", url: BASE_URL },
          url: `${BASE_URL}/${locale}/solutions/ai-capabilities/${slug}`,
        }}
        id="ai-capability-detail-techarticle-schema"
      />
      <AICapabilityDetailClientPage capability={cap} relatedServices={relatedServices} />
    </>
  );
}
