// app/[locale]/(routes)/blogs/page.tsx
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { fetchBlogPosts, fetchBlogCategories, fetchBlogTags } from "@/lib/automex/content";
import type { SupportedLocale } from "@/lib/locale";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import JsonLd from "@/components/seo/JsonLd";
import { BlogsClientPage } from "./_components/BlogsClientPage";

const BASE_URL = "https://automex.tech";

type Props = {
  params: Promise<{ locale: SupportedLocale }>;
  searchParams: Promise<{ category?: string; tag?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "BlogsPage" });
  return generatePageMetadata({
    pageType: "blogs",
    locale,
    pathSegment: "blogs",
    customTitle: t("meta.title"),
    customDescription: t("meta.description"),
  });
}

export default async function BlogsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { category, tag } = await searchParams;
  const t = await getTranslations({ locale, namespace: "BlogsPage" });

  const [initialPosts, categories, tags] = await Promise.all([
    fetchBlogPosts({ category, tag, page: 1 }, locale),
    fetchBlogCategories(locale),
    fetchBlogTags(locale),
  ]);

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: initialPosts.results.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.title,
      url: `${BASE_URL}/${locale}/blogs/${p.slug}`,
    })),
  };

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: t("breadcrumbHome"), url: `/${locale}` },
          { name: t("breadcrumbBlogs"), url: `/${locale}/blogs` },
        ]}
      />
      <JsonLd data={itemListSchema} id="blogs-itemlist-schema" />
      <BlogsClientPage
        initialPosts={initialPosts.results}
        hasMoreInitial={initialPosts.next !== null}
        categories={categories}
        tags={tags}
        activeCategory={category}
        activeTag={tag}
        totalCount={initialPosts.count}
      />
    </>
  );
}
