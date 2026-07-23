// app/[locale]/(routes)/portfolio/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { fetchPortfolioBySlug, fetchPortfolioProjects } from "@/lib/automex/content";
import type { SupportedLocale } from "@/lib/locale";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import JsonLd from "@/components/seo/JsonLd";
import { PortfolioDetailClientPage } from "./_components/PortfolioDetailClientPage";

const BASE_URL = "https://automex.tech";

type Props = {
  params: Promise<{ locale: SupportedLocale; slug: string }>;
};

export async function generateStaticParams() {
  try {
    const { results } = await fetchPortfolioProjects({ page: 1 });
    return results.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  try {
    const proj = await fetchPortfolioBySlug(slug, locale);
    if (!proj) return { title: "Project Not Found" };

    return generatePageMetadata({
      pageType: "services",
      locale,
      pathSegment: `portfolio/${slug}`,
      customTitle: `${proj.title} – AUTOMEX Portfolio`,
      customDescription: proj.short_description?.slice(0, 160),
      ogImageUrl: proj.cover_image?.url || null,
      ogImageAlt: proj.cover_image?.alt_text || proj.title,
    });
  } catch {
    return { title: "Portfolio Project – AUTOMEX" };
  }
}

export default async function PortfolioDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  let proj: Awaited<ReturnType<typeof fetchPortfolioBySlug>>;
  try {
    proj = await fetchPortfolioBySlug(slug, locale);
  } catch {
    notFound();
  }
  if (!proj) notFound();

  const breadcrumbItems = [
    { name: "Home", url: `/${locale}` },
    { name: "Portfolio", url: `/${locale}/portfolio` },
    { name: proj.title, url: `/${locale}/portfolio/${slug}` },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: proj.title,
          description: proj.short_description,
          image: proj.cover_image?.url || undefined,
          dateCreated: proj.created_at,
          publisher: { "@type": "Organization", name: "AUTOMEX", url: BASE_URL },
          url: `${BASE_URL}/${locale}/portfolio/${slug}`,
        }}
        id="portfolio-detail-schema"
      />
      <PortfolioDetailClientPage project={proj} />
    </>
  );
}
