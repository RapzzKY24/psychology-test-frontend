import { apiFetch } from "@/lib/api/client";
import type { AdminArticle, AdminArticleListItem, ArticleInput } from "@/lib/api/types";
import type { ApiSuccess } from "@/lib/api/types/pagination";

/**
 * Admin articles endpoints (features/admin/articles) — browser-safe.
 * Server variants live in api.server.ts (they need next/headers).
 * All routes are role-gated ADMIN by the backend.
 */

/** Public pages that render articles and must be purged after an edit. */
const PUBLIC_ARTICLE_PATHS = [
  { path: "/" },
  { path: "/artikel" },
  { path: "/artikel/[slug]", type: "page" as const },
];

/**
 * Public article pages are ISR (5 minutes). Purging them keeps "publish" and
 * "unpublish" immediate; if the call fails the ISR window still catches up.
 */
export async function revalidatePublicArticlePages(): Promise<void> {
  await fetch("/api/revalidate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ paths: PUBLIC_ARTICLE_PATHS }),
  }).catch(() => undefined);
}

export interface ArticleFilters {
  page?: number;
  limit?: number;
  status?: "DRAFT" | "PUBLISHED";
  category?: string;
  search?: string;
}

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

export function fetchAdminArticles(
  filters: ArticleFilters = {},
): Promise<ApiSuccess<AdminArticleListItem[]>> {
  return apiFetch<AdminArticleListItem[]>(`/admin/articles${buildQuery(filters)}`);
}

export function fetchAdminArticleDetail(id: string): Promise<ApiSuccess<AdminArticle>> {
  return apiFetch<AdminArticle>(`/admin/articles/${id}`);
}

export function createArticle(input: ArticleInput): Promise<ApiSuccess<AdminArticle>> {
  return apiFetch<AdminArticle>("/admin/articles", { method: "POST", body: input });
}

export function updateArticle(
  id: string,
  input: Partial<ArticleInput>,
): Promise<ApiSuccess<AdminArticle>> {
  return apiFetch<AdminArticle>(`/admin/articles/${id}`, { method: "PATCH", body: input });
}

export function deleteArticle(id: string): Promise<ApiSuccess<null>> {
  return apiFetch<null>(`/admin/articles/${id}`, { method: "DELETE" });
}

export function publishArticle(id: string): Promise<ApiSuccess<AdminArticle>> {
  return apiFetch<AdminArticle>(`/admin/articles/${id}/publish`, { method: "POST" });
}

export function unpublishArticle(id: string): Promise<ApiSuccess<AdminArticle>> {
  return apiFetch<AdminArticle>(`/admin/articles/${id}/unpublish`, { method: "POST" });
}

async function uploadFile(
  path: string,
  file: File,
): Promise<ApiSuccess<{ url?: string; coverUrl?: string }>> {
  const form = new FormData();
  form.append("file", file, file.name || "image.png");
  const response = await fetch(`/api/v1${path}`, {
    method: "POST",
    body: form,
    credentials: "include",
  });
  const text = await response.text();
  const payload: unknown = text ? JSON.parse(text) : null;
  if (!response.ok) {
    const { parseErrorResponse } = await import("@/lib/api/error");
    throw parseErrorResponse(response.status, payload);
  }
  const { unwrapEnvelope } = await import("@/lib/api/error");
  return unwrapEnvelope<{ url?: string; coverUrl?: string }>(payload);
}

/** Upload an inline content image; returns the served media URL. */
export async function uploadArticleImage(file: File): Promise<string> {
  const { data } = await uploadFile("/admin/articles/images", file);
  if (!data.url) throw new Error("missing_url");
  return data.url;
}

/** Upload/replace an article cover; older file is removed by the backend. */
export async function uploadArticleCover(
  articleId: string,
  file: File,
): Promise<ApiSuccess<{ coverUrl?: string }>> {
  return uploadFile(`/admin/articles/${articleId}/cover`, file);
}
