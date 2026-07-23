// app/[locale]/(routes)/partners/page.tsx
import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { fetchPartners } from "@/lib/automex/content";
import type { SupportedLocale } from "@/lib/locale";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import JsonLd from "@/components/seo/JsonLd";
import { PartnersClientPage } from "./_components/PartnersClientPage";

type Props = {
  params: Promise<{ locale: SupportedLocale }>;
  searchParams: Promise<{ partner_type?: string; tier?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata({
    pageType: "services",
    locale,
    pathSegment: "partners",
    customTitle: "Partners – AUTOMEX Technology & Implementation Partners",
    customDescription: "Meet AUTOMEX partners — technology providers, cloud platforms, and implementation experts we collaborate with.",
  });
}

export default async function PartnersPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { partner_type, tier } = await searchParams;
  const partners = await fetchPartners({ partner_type, tier }, locale);

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: partners.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.name,
      url: p.website_url || undefined,
    })),
  };

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: `/${locale}` },
          { name: "Partners", url: `/${locale}/partners` },
        ]}
      />
      <JsonLd data={itemListSchema} id="partners-itemlist-schema" />
      <PartnersClientPage
        partners={partners}
        activePartnerType={partner_type}
        activeTier={tier}
      />
    </>
  );
}
