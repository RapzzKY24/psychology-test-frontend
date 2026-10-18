"use client";

import { useQuery } from "@tanstack/react-query";
import type { QueryKey } from "@tanstack/react-query";
import type { ApiSuccess } from "@/lib/api/types/pagination";
import type { InstansiResultItem } from "@/lib/api/types";
import { fetchInstansiResults } from "../api";
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
  const { data } = useQuery({
    queryKey: listKey,
    queryFn: () => fetchInstansiResults({ page }),
    initialData: initial,
  });

  const tableMeta = data.meta ?? {
    page,
    limit: 10,
    total: data.data.length,
    totalPages: 1,
  };

  return (
    <ResultsTable
      rows={data.data}
      meta={tableMeta}
      pageHref={(next) => `/instansi/hasil?page=${next}`}
    />
  );
}
