"use client";

import { useQuery } from "@tanstack/react-query";
import type { QueryKey } from "@tanstack/react-query";
import type { ApiSuccess } from "@/lib/api/types/pagination";
import type { AdminArticleListItem } from "@/lib/api/types";
import { fetchAdminArticles } from "../api";
import { ArticlesTable } from "./articles-table";

/** Client island — the list cache enables optimistic create/publish/delete. */
export function ArticlesIsland({
  listKey,
  initial,
  page,
}: {
  listKey: QueryKey;
  initial: ApiSuccess<AdminArticleListItem[]>;
  page: number;
}) {
  const { data } = useQuery({
    queryKey: listKey,
    queryFn: () => fetchAdminArticles({ page }),
    initialData: initial,
  });

  const tableMeta = data.meta ?? { page, limit: 10, total: data.data.length, totalPages: 1 };

  return <ArticlesTable rows={data.data} meta={tableMeta} listKey={listKey} />;
}
