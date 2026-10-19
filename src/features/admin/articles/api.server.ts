import { apiFetchServer } from "@/lib/api/server";
import type { AdminArticle, AdminArticleListItem } from "@/lib/api/types";
import type { ApiSuccess } from "@/lib/api/types/pagination";
import type { ArticleFilters } from "./api";

/**
 * Server-only fetchers for the admin articles feature (RSC pages).
 * Kept separate from api.ts so client components never pull next/headers
 * into the browser bundle.
 */

function buildQuery(filters: ArticleFilters): string {
  const params = new URLSearchParams();
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  if (filters.status) params.set("status", filters.status);
  if (filters.category) params.set("category", filters.category);
  if (filters.search) params.set("search", filters.search);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

/** RSC variant — Node-to-Node with cookie forwarding. */
export function fetchAdminArticlesServer(
  filters: ArticleFilters = {},
): Promise<ApiSuccess<AdminArticleListItem[]>> {
  return apiFetchServer<AdminArticleListItem[]>(`/admin/articles${buildQuery(filters)}`);
}

/** RSC variant — Node-to-Node with cookie forwarding. */
export function fetchAdminArticleDetailServer(id: string): Promise<ApiSuccess<AdminArticle>> {
  return apiFetchServer<AdminArticle>(`/admin/articles/${id}`);
}
