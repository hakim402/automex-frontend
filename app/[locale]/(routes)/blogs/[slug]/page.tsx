// app/[locale]/(routes)/blogs/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { fetchBlogPostBySlug, fetchBlogPosts } from "@/lib/automex/content";
import type { SupportedLocale } from "@/lib/locale";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import JsonLd from "@/components/seo/JsonLd";
import { BlogDetailClient } from "./_components/BlogDetailClient";

const BASE_URL = "https://automex.tech";

type Props = {
  params: Promise<{ locale: SupportedLocale; slug: string }>;
};

// ─── Metadata ──────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const blog = await fetchBlogPostBySlug(slug, locale);

  if (!blog) return {};

  const seo = blog.seo as Record<string, string | undefined>;

  return {
    title: (seo.meta_title as string) || blog.title,
    description: (seo.meta_description as string) || blog.excerpt,
    keywords: (seo.meta_keywords as string) || undefined,
    alternates: seo.canonical_url
      ? { canonical: seo.canonical_url as string }
      : undefined,
    openGraph: {
      title: ((seo.og_title as string) || blog.title) as string,
      description: ((seo.og_description as string) || blog.excerpt) as string,
      images: blog.cover_image?.url
        ? [{ url: blog.cover_image.url, alt: blog.cover_image.alt_text || blog.title }]
        : undefined,
      type: "article" as const,
    },
    twitter: {
      card: "summary_large_image" as const,
    },
  };
}

// ─── Page ───────────────────────────────────────────────────

export default async function BlogDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "BlogDetail" });

  const blog = await fetchBlogPostBySlug(slug, locale);
  if (!blog) notFound();

  // Related posts: same category, exclude current, max 3
  const { results: relatedPosts } = await fetchBlogPosts(
    { category: blog.category.slug, page: 1 },
    locale
  );
  const filteredRelated = relatedPosts
    .filter((p) => p.id !== blog.id)
    .slice(0, 3);

  // Breadcrumb
  const breadcrumbItems = [
    { name: t("breadcrumbHome"), url: `/${locale}` },
    { name: t("breadcrumbBlogs"), url: `/${locale}/blogs` },
    { name: blog.title, url: `/${locale}/blogs/${blog.slug}` },
  ];

  // JSON-LD BlogPosting schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.excerpt,
    ...(blog.author && {
      author: {
        "@type": "Person" as const,
        name: blog.author.full_name,
      },
    }),
    ...(blog.published_at && {
      datePublished: blog.published_at,
    }),
    ...(blog.cover_image?.url && {
      image: blog.cover_image.url,
    }),
    url: `${BASE_URL}/${locale}/blogs/${blog.slug}`,
    publisher: {
      "@type": "Organization",
      name: "AUTOMEX",
      url: BASE_URL,
    },
  };

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <JsonLd data={jsonLd} id={`blog-${blog.slug}-schema`} />
      <BlogDetailClient
        blog={blog}
        relatedPosts={filteredRelated}
        locale={locale}
      />
    </>
  );
}
