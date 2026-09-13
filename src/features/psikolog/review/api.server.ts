import { apiFetchServer } from "@/lib/api/server";
import type { ReviewDetail, ReviewListItem } from "@/lib/api/types";
import type { ApiSuccess } from "@/lib/api/types/pagination";
import type { ReviewFilterInput } from "./schemas";

/** Server-only fetchers for the psychologist review feature (RSC pages). */

export function fetchReviewQueueServer(
  filters: Partial<ReviewFilterInput> = {},
): Promise<ApiSuccess<ReviewListItem[]>> {
  const params = new URLSearchParams();
  if (filters.status) params.set("status", filters.status);
  params.set("page", String(filters.page ?? 1));
  params.set("limit", String(filters.limit ?? 10));
  return apiFetchServer<ReviewListItem[]>(`/psychologist/reviews?${params.toString()}`);
}

export function fetchReviewDetailServer(id: string): Promise<ApiSuccess<ReviewDetail>> {
  return apiFetchServer<ReviewDetail>(`/psychologist/reviews/${id}`);
}
