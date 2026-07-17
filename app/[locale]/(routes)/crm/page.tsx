// app/[locale]/(routes)/crm/page.tsx
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { fetchProcessSteps } from "@/lib/automex/content";
import type { SupportedLocale } from "@/lib/locale";
import { CrmClientPage } from "./_components/CrmClientPage";

type Props = { params: Promise<{ locale: SupportedLocale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "CrmPages.overview" });
  return generatePageMetadata({
    pageType: "crm",
    locale,
    pathSegment: "crm",
    customTitle: t("meta.title"),
    customDescription: t("meta.description"),
  });
}

export default async function CrmOverviewPage({ params }: Props) {
  const { locale } = await params;
  const processSteps = await fetchProcessSteps(locale);
  return <CrmClientPage processSteps={processSteps} />;
}