"use client";

import type { QueryKey } from "@tanstack/react-query";
import type { ApiSuccess } from "@/lib/api/types/pagination";
import type { AdminArticleListItem } from "@/lib/api/types";
import { useArticlesList } from "../hooks/use-articles-list";
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
  const { rows, meta } = useArticlesList({ listKey, initial, page });

  return <ArticlesTable rows={rows} meta={meta} listKey={listKey} />;
}
