"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { QueryKey } from "@tanstack/react-query";
import type { ApiSuccess } from "@/lib/api/types/pagination";
import type { ReviewListItem } from "@/lib/api/types";
import { fetchReviewQueue } from "../api";

/**
 * The psychologist's review queue, seeded with the RSC's first page. Filter
 * changes refetch, and `keepPreviousData` holds the old rows on screen so the
 * table does not blink between pages.
 */
export function useReviewQueue({
  listKey,
  initial,
  status,
  page,
}: {
  listKey: QueryKey;
  initial: ApiSuccess<ReviewListItem[]>;
  status?: string;
  page: number;
}) {
  const { data } = useQuery({
    queryKey: listKey,
    queryFn: () =>
      fetchReviewQueue({
        status: status as "PENDING_REVIEW" | "RETURNED" | "APPROVED" | undefined,
        page,
      }),
    initialData: initial,
    placeholderData: keepPreviousData,
  });

  return {
    rows: data.data,
    // An endpoint that answers without `meta` still needs a pagination shape.
    meta: data.meta ?? { page, limit: 10, total: data.data.length, totalPages: 1 },
  };
}
