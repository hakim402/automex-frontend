// app/[locale]/_components/Header/HeaderWrapper.tsx
//
// Server component that fetches navigation data (categories, etc.) from the
// Django API and passes it to the client <Header />.  Split this way because
// automexFetch is server-only but the Header needs interactivity ("use client").

import { Header } from "./Header";
import {
  fetchServiceCategories,
  fetchBlogCategories,
  fetchIndustries,
  fetchAICapabilities,
  fetchPortfolioProjects,
  fetchBlogPosts,
  fetchCaseStudies,
} from "@/lib/automex/content";
import type { SupportedLocale } from "@/lib/locale";

interface HeaderWrapperProps {
  locale: string;
}

/** Swallows errors so the header still renders even when the backend is down. */
async function safeFetch<T>(promise: Promise<T>): Promise<T | undefined> {
  try {
    return await promise;
  } catch {
    return undefined;
  }
}

export async function HeaderWrapper({ locale }: HeaderWrapperProps) {
  const lang = locale as SupportedLocale;

  const [
    serviceCategories,
    blogCategories,
    industries,
    aiCapPaginated,
    portfolioPaginated,
    blogPostsPaginated,
    caseStudiesPaginated,
  ] = await Promise.all([
    safeFetch(fetchServiceCategories(lang)),
    safeFetch(fetchBlogCategories(lang)),
    safeFetch(fetchIndustries(lang)),
    safeFetch(fetchAICapabilities({}, lang)),
    safeFetch(fetchPortfolioProjects({}, lang)),
    safeFetch(fetchBlogPosts({ ordering: "-published_at", page: 1 }, lang)),
    safeFetch(fetchCaseStudies({ ordering: "-published_at", page: 1 }, lang)),
  ]);

  return (
    <Header
      serviceCategories={serviceCategories}
      blogCategories={blogCategories}
      industries={industries}
      aiCapabilities={aiCapPaginated?.results}
      portfolioProjects={portfolioPaginated?.results}
      latestBlogs={blogPostsPaginated?.results?.slice(0, 5)}
      latestCaseStudies={caseStudiesPaginated?.results?.slice(0, 5)}
    />
  );
}
