// app/[locale]/(routes)/blog/page.tsx
import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { fetchBlogPosts, fetchBlogCategories, fetchBlogTags } from "@/lib/automex/content";
import type { SupportedLocale } from "@/lib/locale";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import JsonLd from "@/components/seo/JsonLd";
import { BlogClientPage } from "./_components/BlogClientPage";

const BASE_URL = "https://automex.tech";

type Props = {
  params: Promise<{ locale: SupportedLocale }>;
  searchParams: Promise<{ category?: string; tag?: string; search?: string; ordering?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata({
    pageType: "services",
    locale,
    pathSegment: "blog",
    customTitle: "Blog – AUTOMEX Insights on AI, Software & Technology",
    customDescription: "Read the latest articles, tutorials, and insights on AI, software development, cloud computing, and digital transformation from the AUTOMEX engineering team.",
  });
}

export default async function BlogPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { category, tag, search, ordering } = await searchParams;

  let initialPosts: Awaited<ReturnType<typeof fetchBlogPosts>>;
  try {
    initialPosts = await fetchBlogPosts({ category, tag, search, ordering, page: 1 }, locale);
  } catch {
    initialPosts = { count: 0, next: null, previous: null, results: [] };
  }

  let categories: Awaited<ReturnType<typeof fetchBlogCategories>>;
  try {
    categories = await fetchBlogCategories(locale);
  } catch {
    categories = [];
  }

  let tags: Awaited<ReturnType<typeof fetchBlogTags>>;
  try {
    tags = await fetchBlogTags(locale);
  } catch {
    tags = [];
  }

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: initialPosts.results.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.title,
      url: `${BASE_URL}/${locale}/blog/${p.slug}`,
    })),
  };

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: `/${locale}` },
          { name: "Blog", url: `/${locale}/blog` },
        ]}
      />
      <JsonLd data={itemListSchema} id="blog-itemlist-schema" />
      <BlogClientPage
        initialPosts={initialPosts.results}
        hasMoreInitial={initialPosts.next !== null}
        categories={categories}
        tags={tags}
        activeCategory={category}
        activeTag={tag}
        searchQuery={search}
        totalCount={initialPosts.count}
        currentOrdering={ordering}
      />
    </>
  );
}
