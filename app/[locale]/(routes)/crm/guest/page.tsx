// app/[locale]/(routes)/crm/guest/page.tsx
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { generatePageMetadata } from "@/lib/seo/metadata";
import type { SupportedLocale } from "@/lib/locale";
import { GuestClientPage } from "./_components/GuestClientPage";

type Props = { params: Promise<{ locale: SupportedLocale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "CrmPages.guest" });
  return generatePageMetadata({
    pageType: "crm",
    locale,
    pathSegment: "crm/guest",
    customTitle: t("meta.title"),
    customDescription: t("meta.description"),
  });
}

export default async function GuestPortalPage({ params }: Props) {
  const { locale } = await params;
  return <GuestClientPage locale={locale} />;
}
