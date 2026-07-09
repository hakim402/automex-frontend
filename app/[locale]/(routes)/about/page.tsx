// app/[locale]/(routes)/about/page.tsx
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import AboutPageClient from "./_components/AboutPageClient";
import { generatePageMetadata } from "@/lib/seo/metadata";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import { SUPPORTED_LOCALES, isRtlLocale } from "@/lib/locale";

// ─── Metadata ─────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "About" });

  return generatePageMetadata({
    pageType: "about",
    locale: locale as any,
    customTitle: t("meta.title"),
    customDescription: t("meta.description"),
  });
}

// ─── Page ─────────────────────────────────────────────

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isRtl = isRtlLocale(locale);

  // Breadcrumb items
  const breadcrumbItems = [
    { name: "Home", url: `/${locale}` },
    { name: "About", url: `/${locale}/about` },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <AboutPageClient isRtl={isRtl} locale={locale} />
    </>
  );
}

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}