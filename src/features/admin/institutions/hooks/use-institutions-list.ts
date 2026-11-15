"use client";

import { useQuery } from "@tanstack/react-query";
import type { QueryKey } from "@tanstack/react-query";
import type { ApiSuccess } from "@/lib/api/types/pagination";
import type { Institution } from "@/lib/api/types";
import { fetchInstitutions } from "../api";

/**
 * The admin institution list, seeded with the RSC's first page. It stays in the
 * query cache so a create or edit can update the row without a refetch.
 */
export function useInstitutionsList({
  listKey,
  initial,
  page,
}: {
  listKey: QueryKey;
  initial: ApiSuccess<Institution[]>;
  page: number;
}) {
  const { data } = useQuery({
    queryKey: listKey,
    queryFn: () => fetchInstitutions({ page }),
    initialData: initial,
  });

  return {
    rows: data.data,
    // An endpoint that answers without `meta` still needs a pagination shape.
    meta: data.meta ?? { page, limit: 10, total: data.data.length, totalPages: 1 },
  };
}
