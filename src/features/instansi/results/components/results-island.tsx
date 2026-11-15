"use client";

import type { QueryKey } from "@tanstack/react-query";
import type { ApiSuccess } from "@/lib/api/types/pagination";
import type { InstansiResultItem } from "@/lib/api/types";
import { useResultsList } from "../hooks/use-results-list";
import { ResultsTable } from "./results-table";

/** Client island — keeps the results list in the query cache per page. */
export function ResultsIsland({
  listKey,
  initial,
  page,
}: {
  listKey: QueryKey;
  initial: ApiSuccess<InstansiResultItem[]>;
  page: number;
}) {
  const { rows, meta } = useResultsList({ listKey, initial, page });

  return (
    <ResultsTable
      rows={rows}
      meta={meta}
      pageHref={(next) => `/instansi/hasil?page=${next}`}
    />
  );
}
