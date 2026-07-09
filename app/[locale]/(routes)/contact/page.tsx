// app/[locale]/(routes)/contact/page.tsx
import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import { Header } from "../../_components/Header/Header";
import { FooterSection } from "../../_components/Footer/FooterSections";
import ContactPageClient from "./_components/ContactPageClient";
import OrbitalSystem from "../../_components/HomeHero/OrbitalSystem";
import { generatePageMetadata } from "@/lib/seo/metadata";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import LocalBusinessSchema from "@/components/seo/LocalBusinessSchema";
import FAQSchema from "@/components/seo/FAQSchema";
import { SUPPORTED_LOCALES, isRtlLocale } from "@/lib/locale";

// ─── Metadata ─────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Contact" });

  return generatePageMetadata({
    pageType: "contact",
    locale: locale as any,
    customTitle: t("meta.title"),
    customDescription: t("meta.description"),
  });
}

// ─── Page ─────────────────────────────────────────────

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isRtl = isRtlLocale(locale);

  // ✅ Safely check if FAQ translations exist
  const t = await getTranslations({ locale, namespace: "Contact" });
  const hasFaq = t.has("faq");
  const faqQuestions = hasFaq
    ? (t.raw("faq") as { q: string; a: string }[] | undefined)
    : undefined;

  // Breadcrumb items
  const breadcrumbItems = [
    { name: "Home", url: `/${locale}` },
    { name: "Contact", url: `/${locale}/contact` },
  ];

  return (
    <>
      {/* ─── Schemas ────────────────────────────────── */}
      <BreadcrumbSchema items={breadcrumbItems} />
      <LocalBusinessSchema />
      {faqQuestions && faqQuestions.length > 0 && (
        <FAQSchema faqs={faqQuestions} />
      )}

      <main
        dir={isRtl ? "rtl" : "ltr"}
        className="relative isolate min-h-screen overflow-x-hidden bg-background text-foreground"
      >
        {/* Page background */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(ellipse_70%_40%_at_50%_0%,rgb(10_184_251/10%),transparent)] dark:bg-[radial-gradient(ellipse_70%_40%_at_50%_0%,rgb(10_184_251/7%),transparent)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgb(148_198_233/0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgb(148_198_233/0.05)_1px,transparent_1px)] bg-size-[64px_64px] mask-[radial-gradient(ellipse_80%_50%_at_50%_0%,black,transparent)"
        />
        <Header />

        <ContactPageClient isRtl={isRtl} />

        {/* Decorative orbital */}
        <div className="relative mt-16 mb-20 w-full overflow-hidden py-10">
          <div className="flex justify-center opacity-60">
            <OrbitalSystem />
          </div>
        </div>

        <FooterSection />
      </main>
    </>
  );
}

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}
