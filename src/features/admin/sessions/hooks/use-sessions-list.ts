"use client";

import { useQuery } from "@tanstack/react-query";
import type { QueryKey } from "@tanstack/react-query";
import type { ApiSuccess } from "@/lib/api/types/pagination";
import type { SessionSummary } from "@/lib/api/types";
import { fetchSessions } from "../api";

/**
 * The admin session list, seeded with the RSC's first page. It stays in the
 * query cache so create and close can update the row without a refetch.
 */
export function useSessionsList({
  listKey,
  initial,
  page,
}: {
  listKey: QueryKey;
  initial: ApiSuccess<SessionSummary[]>;
  page: number;
}) {
  const { data } = useQuery({
    queryKey: listKey,
    queryFn: () => fetchSessions({ page }),
    initialData: initial,
  });

  return {
    rows: data.data,
    // An endpoint that answers without `meta` still needs a pagination shape.
    meta: data.meta ?? { page, limit: 10, total: data.data.length, totalPages: 1 },
  };
}
