// app/[locale]/layout.tsx
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ReactNode } from "react";
import { Metadata } from "next";
import { SUPPORTED_LOCALES, isRtlLocale } from "@/lib/locale";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { LocaleSync } from "./_components/Language/LocaleSync";

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

// ─── Dynamic Metadata ────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata({
    pageType: "home",
    locale: locale as any,
  });
}

// ─── Layout ──────────────────────────────────────

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!SUPPORTED_LOCALES.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();
  const isRtl = isRtlLocale(locale);

  return (
    <>
      <LocaleSync locale={locale} />
      <NextIntlClientProvider messages={messages}>
        <div dir={isRtl ? "rtl" : "ltr"}>{children}</div>
      </NextIntlClientProvider>
    </>
  );
}

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}