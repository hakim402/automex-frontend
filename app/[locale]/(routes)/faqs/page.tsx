// app/[locale]/(routes)/faqs/page.tsx

import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { fetchFAQs } from "@/lib/automex/content";
import type { SupportedLocale } from "@/lib/locale";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import FAQSchema from "@/components/seo/FAQSchema";
import { FaqsClientPage } from "./_components/FaqsClientPage";

type Props = {
  params: Promise<{ locale: SupportedLocale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata({
    pageType: "services",
    locale,
    pathSegment: "faqs",
    customTitle: "Frequently Asked Questions – AUTOMEX",
    customDescription:
      "Find answers to common questions about AUTOMEX software development, AI services, pricing, and process. From project timelines to technology stacks — we've got you covered.",
  });
}

export default async function FaqsPage({ params }: Props) {
  const { locale } = await params;
  let faqs: Awaited<ReturnType<typeof fetchFAQs>>;
  try {
    faqs = await fetchFAQs({}, locale as SupportedLocale);
  } catch {
    faqs = [];
  }

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: `/${locale}` },
          { name: "FAQs", url: `/${locale}/faqs` },
        ]}
      />
      <FAQSchema
        faqs={faqs.map((f) => ({ q: f.question, a: f.answer }))}
      />
      <FaqsClientPage faqs={faqs} />
    </>
  );
}
