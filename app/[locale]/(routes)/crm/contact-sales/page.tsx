// app/[locale]/(routes)/crm/contact-sales/page.tsx
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { fetchServices } from "@/lib/automex/content";
import type { SupportedLocale } from "@/lib/locale";
import { ContactClientPage } from "./_components/ContactClientPage"; // adjust path as needed

type Props = {
  params: Promise<{ locale: SupportedLocale }>;
  searchParams: Promise<{ service?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "CrmPages.contactSales" });
  return generatePageMetadata({
    pageType: "contactSales",          
    locale,
    pathSegment: "crm/contact-sales",
    customTitle: t("meta.title"),
    customDescription: t("meta.description"),
  });
}

export default async function ContactSalesPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { service } = await searchParams;
  const { results: services } = await fetchServices({}, locale);

  return (
    <ContactClientPage
      serviceOptions={services.map((s) => ({ id: s.id, name: s.name }))}
      defaultServiceInterest={service}
    />
  );
}