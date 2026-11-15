"use client";

import { useQuery } from "@tanstack/react-query";
import type { QueryKey } from "@tanstack/react-query";
import type { ApiSuccess } from "@/lib/api/types/pagination";
import type { InstansiResultItem } from "@/lib/api/types";
import { fetchInstansiResults } from "../api";

/** The institution's results list, seeded with the RSC's first page. */
export function useResultsList({
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

  return {
    rows: data.data,
    // An endpoint that answers without `meta` still needs a pagination shape.
    meta: data.meta ?? { page, limit: 10, total: data.data.length, totalPages: 1 },
  };
}
