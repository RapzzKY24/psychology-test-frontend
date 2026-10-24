import { cache } from "react";
import { apiFetchServer } from "@/lib/api/server";
import type { PublicTest, PublicArticleListItem, PublicArticle } from "@/lib/api/types";
import type { ApiSuccess } from "@/lib/api/types/pagination";

/**
 * Public read fetchers (catalog tests + published articles). RSC-only — the
 * browser talks to these through the same-origin `/api/v1` proxy elsewhere.
 * `cache()` dedupes per-request; `revalidate` gives light ISR for public pages.
 */

const PUBLIC_REVALIDATE = 300;

export const fetchPublicTestsServer = cache(
  (filters: { limit?: number; page?: number; category?: string } = {}): Promise<
    ApiSuccess<PublicTest[]>
  > => {
    const params = new URLSearchParams();
    params.set("limit", String(filters.limit ?? 12));
    if (filters.page && filters.page > 1) params.set("page", String(filters.page));
    if (filters.category) params.set("category", filters.category);
    return apiFetchServer<PublicTest[]>(`/tests?${params.toString()}`, {
      revalidate: PUBLIC_REVALIDATE,
    });
  },
);

export const fetchPublicTestServer = cache(
  (slug: string): Promise<ApiSuccess<PublicTest>> =>
    apiFetchServer<PublicTest>(`/tests/${slug}`, { revalidate: PUBLIC_REVALIDATE }),
);

export const fetchPublicArticlesServer = cache(
  (filters: { limit?: number; page?: number; category?: string; search?: string } = {}): Promise<
    ApiSuccess<PublicArticleListItem[]>
  > => {
    const params = new URLSearchParams();
    params.set("limit", String(filters.limit ?? 12));
    if (filters.page && filters.page > 1) params.set("page", String(filters.page));
    if (filters.category) params.set("category", filters.category);
    if (filters.search) params.set("search", filters.search);
    return apiFetchServer<PublicArticleListItem[]>(`/articles?${params.toString()}`, {
      revalidate: PUBLIC_REVALIDATE,
    });
  },
);

/** Distinct published categories present in the public catalog (derived, not hardcoded). */
export const fetchPublicArticleCategories = cache(async (): Promise<string[]> => {
  const res = await fetchPublicArticlesServer({ limit: 100 });
  const cats = new Set(
    res.data.map((a) => a.category).filter((c): c is string => typeof c === "string" && c.length > 0),
  );
  return Array.from(cats).sort();
});

export const fetchPublicArticleServer = cache(
  (slug: string) =>
    apiFetchServer<PublicArticle>(`/articles/${slug}`, { revalidate: PUBLIC_REVALIDATE }),
);
