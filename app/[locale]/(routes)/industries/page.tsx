// app/[locale]/(routes)/industries/page.tsx
import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { fetchIndustries } from "@/lib/automex/content";
import type { SupportedLocale } from "@/lib/locale";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import JsonLd from "@/components/seo/JsonLd";
import { IndustriesClientPage } from "./_components/IndustriesClientPage";

type Props = {
  params: Promise<{ locale: SupportedLocale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata({
    pageType: "services",
    locale,
    pathSegment: "industries",
    customTitle: "Industries – AUTOMEX Industry Solutions",
    customDescription: "Explore AUTOMEX industry expertise across healthcare, finance, education, and more. Tailored technology solutions for your sector.",
  });
}

export default async function IndustriesPage({ params }: Props) {
  const { locale } = await params;
  const industries = await fetchIndustries(locale);

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: industries.map((ind, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: ind.name,
      url: `https://automex.tech/${locale}/industries/${ind.slug}`,
    })),
  };

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: `/${locale}` },
          { name: "Industries", url: `/${locale}/industries` },
        ]}
      />
      <JsonLd data={itemListSchema} id="industries-itemlist-schema" />
      <IndustriesClientPage industries={industries} />
    </>
  );
}
