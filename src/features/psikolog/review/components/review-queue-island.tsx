"use client";

import type { QueryKey } from "@tanstack/react-query";
import type { ApiSuccess } from "@/lib/api/types/pagination";
import type { ReviewListItem } from "@/lib/api/types";
import { useReviewQueue } from "../hooks/use-review-queue";
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
  const { rows, meta } = useReviewQueue({ listKey, initial, status, page });

  return <ReviewQueueTable rows={rows} meta={meta} status={status} />;
}
