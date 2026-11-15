"use client";

import { useQuery } from "@tanstack/react-query";
import { qk } from "@/lib/api/query-keys";
import { fetchAdminArticleDetail } from "../api";

/**
 * The full article body for the edit dialog. List rows omit `content`, so the
 * form cannot be filled from them — but nothing is fetched until the dialog is
 * actually opened.
 */
export function useArticleDetail(articleId: string | undefined, enabled: boolean) {
  const { data, isLoading } = useQuery({
    queryKey: qk.admin.articles.detail(articleId ?? ""),
    queryFn: async () => (await fetchAdminArticleDetail(articleId ?? "")).data,
    enabled: enabled && Boolean(articleId),
  });

  return { data, isLoading };
}
