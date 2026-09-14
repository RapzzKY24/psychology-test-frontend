"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { QueryKey } from "@tanstack/react-query";
import type { ApiSuccess } from "@/lib/api/types/pagination";
import type { ReviewListItem } from "@/lib/api/types";
import { fetchReviewQueue } from "../api";
import { ReviewQueueTable } from "./review-queue-table";

/** Client island — filter changes refetch the queue. */
export function ReviewQueueIsland({
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

  const tableMeta = data.meta ?? { page, limit: 10, total: data.data.length, totalPages: 1 };

  return <ReviewQueueTable rows={data.data} meta={tableMeta} status={status} />;
}
