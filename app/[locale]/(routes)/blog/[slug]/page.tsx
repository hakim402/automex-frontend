// app/[locale]/(routes)/blog/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { fetchBlogPostBySlugFull, fetchBlogPosts } from "@/lib/automex/content";
import type { BlogPostDetailFull, BlogPostSEO } from "@/lib/automex/types";
import type { SupportedLocale } from "@/lib/locale";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import JsonLd from "@/components/seo/JsonLd";
import { BlogDetailClientPage } from "./_components/BlogDetailClientPage";

const BASE_URL = "https://automex.tech";

type Props = {
  params: Promise<{ locale: SupportedLocale; slug: string }>;
};

export async function generateStaticParams() {
  try {
    const { results } = await fetchBlogPosts({ page: 1 });
    return results.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  try {
    const post = await fetchBlogPostBySlugFull(slug, locale);
    if (!post) return { title: "Blog Post Not Found" };

    const seo = post.seo as BlogPostSEO;
    const coverImageUrl = post.cover_image?.url ?? null;

    return generatePageMetadata({
      pageType: "blog",
      locale,
      pathSegment: `blog/${slug}`,
      customTitle: seo.meta_title || `${post.title} – AUTOMEX Blog`,
      customDescription: seo.meta_description || post.excerpt,
      ogImageUrl: seo.og_image || coverImageUrl || null,
      ogImageAlt: post.cover_image?.alt_text || post.title,
      canonicalUrl: seo.canonical_url || null,
    });
  } catch {
    return { title: "Blog Post – AUTOMEX" };
  }
}

export default async function BlogDetailPage({ params }: Props) {
  const { locale, slug } = await params;

  let post: BlogPostDetailFull;
  try {
    const data = await fetchBlogPostBySlugFull(slug, locale);
    if (!data) notFound();
    post = data;
  } catch {
    notFound();
  }

  const seo = post.seo as BlogPostSEO;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": seo.structured_data_type || "Article",
    headline: post.title,
    description: seo.meta_description || post.excerpt,
    image: seo.og_image || post.cover_image?.url || undefined,
    author: {
      "@type": "Person",
      name: post.author?.full_name || "AUTOMEX Team",
    },
    datePublished: post.published_at,
    dateModified: post.updated_at || post.published_at,
    publisher: {
      "@type": "Organization",
      name: "AUTOMEX",
      url: BASE_URL,
    },
    url: `${BASE_URL}/${locale}/blog/${slug}`,
  };

  const breadcrumbItems = [
    { name: "Home", url: `/${locale}` },
    { name: "Blog", url: `/${locale}/blog` },
    { name: post.title, url: `/${locale}/blog/${slug}` },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <JsonLd data={articleSchema} id="blog-post-article-schema" />
      <BlogDetailClientPage post={post} />
    </>
  );
}
