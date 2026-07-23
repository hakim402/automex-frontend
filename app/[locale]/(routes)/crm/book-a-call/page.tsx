// app/[locale]/(routes)/crm/book-a-call/page.tsx
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { fetchIndustries } from "@/lib/automex/content";
import type { SupportedLocale } from "@/lib/locale";
import { BookCallClientPage } from "./_components/BookCallClientPage";

type Props = {
  params: Promise<{ locale: SupportedLocale }>;
  searchParams: Promise<{ service?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "CrmPages.bookCall" });  // ← fixed
  return generatePageMetadata({
    pageType: "bookCall",          // ← fixed
    locale,
    pathSegment: "crm/book-a-call",
    customTitle: t("meta.title"),
    customDescription: t("meta.description"),
  });
}

export default async function BookACallPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { service } = await searchParams;
  const industries = await fetchIndustries(locale);

  return (
    <BookCallClientPage
      defaultServiceInterest={service}
      industryOptions={industries.map((i) => ({ id: i.id, name: i.name }))}
    />
  );
}