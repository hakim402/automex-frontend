// app/[locale]/(routes)/crm/quote/page.tsx
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { fetchServices, fetchIndustries } from "@/lib/automex/content";
import type { SupportedLocale } from "@/lib/locale";
import { QuoteClientPage } from "./_components/QuoteClientPage";

type Props = {
  params: Promise<{ locale: SupportedLocale }>;
  searchParams: Promise<{ service?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "CrmPages.quote" });
  return generatePageMetadata({
    pageType: "quote",
    locale,
    pathSegment: "crm/quote",
    customTitle: t("meta.title"),
    customDescription: t("meta.description"),
  });
}

export default async function QuotePage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { service } = await searchParams;
  const [{ results: services }, industries] = await Promise.all([
    fetchServices({}, locale),
    fetchIndustries(locale),
  ]);

  return (
    <QuoteClientPage
      serviceOptions={services.map((s) => ({ id: s.id, name: s.name }))}
      industryOptions={industries.map((i) => ({ id: i.id, name: i.name }))}
      defaultServiceId={service}
    />
  );
}