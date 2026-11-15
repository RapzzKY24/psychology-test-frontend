"use client";

import { useQuery } from "@tanstack/react-query";
import type { QueryKey } from "@tanstack/react-query";
import type { ApiSuccess } from "@/lib/api/types/pagination";
import type { Employee } from "@/lib/api/types";
import { fetchEmployees } from "../api";

/**
 * The institution's employee list, seeded with the RSC's first page. It stays
 * in the query cache so create, edit and delete can update the row in place.
 */
export function useEmployeesList({
  listKey,
  initial,
  page,
}: {
  listKey: QueryKey;
  initial: ApiSuccess<Employee[]>;
  page: number;
}) {
  const { data } = useQuery({
    queryKey: listKey,
    queryFn: () => fetchEmployees({ page }),
    initialData: initial,
  });

  return {
    rows: data.data,
    // An endpoint that answers without `meta` still needs a pagination shape.
    meta: data.meta ?? { page, limit: 10, total: data.data.length, totalPages: 1 },
  };
}
