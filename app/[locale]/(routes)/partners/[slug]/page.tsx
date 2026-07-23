// app/[locale]/(routes)/partners/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { fetchPartnerBySlug, fetchPartners } from "@/lib/automex/content";
import type { SupportedLocale } from "@/lib/locale";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import JsonLd from "@/components/seo/JsonLd";
import { PartnerDetailClientPage } from "./_components/PartnerDetailClientPage";

const BASE_URL = "https://automex.tech";

type Props = {
  params: Promise<{ locale: SupportedLocale; slug: string }>;
};

export async function generateStaticParams() {
  try {
    const partners = await fetchPartners();
    return partners.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  try {
    const partner = await fetchPartnerBySlug(slug, locale);
    if (!partner) return { title: "Partner Not Found" };

    const ogImageUrl = partner.logo?.url || null;
    const ogImageAlt = partner.logo?.alt_text || partner.name;

    return generatePageMetadata({
      pageType: "services",
      locale,
      pathSegment: `partners/${slug}`,
      customTitle: `${partner.name} – AUTOMEX Partner`,
      customDescription: partner.description?.slice(0, 160),
      ogImageUrl,
      ogImageAlt,
    });
  } catch {
    return { title: "Partner – AUTOMEX" };
  }
}

export default async function PartnerDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  let partner: Awaited<ReturnType<typeof fetchPartnerBySlug>>;
  try {
    partner = await fetchPartnerBySlug(slug, locale);
  } catch {
    notFound();
  }
  if (!partner) notFound();

  const breadcrumbItems = [
    { name: "Home", url: `/${locale}` },
    { name: "Partners", url: `/${locale}/partners` },
    { name: partner.name, url: `/${locale}/partners/${slug}` },
  ];

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: partner.name,
    description: partner.description,
    url: partner.website_url || `${BASE_URL}/${locale}/partners/${slug}`,
    logo: partner.logo?.url || undefined,
  };

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <JsonLd data={orgSchema} id="partner-detail-schema" />
      <PartnerDetailClientPage partner={partner} />
    </>
  );
}
