import { apiFetch } from "@/lib/api/client";
import type { ApproveResult, ReviewDetail, ReviewListItem } from "@/lib/api/types";
import type { ApiSuccess } from "@/lib/api/types/pagination";
import type { CorrectionInput, ReturnReviewInput, ReviewFilterInput, ReviewNotesInput } from "./schemas";

export function fetchReviewQueue(
  filters: Partial<ReviewFilterInput> = {},
): Promise<ApiSuccess<ReviewListItem[]>> {
  const params = new URLSearchParams();
  if (filters.status) params.set("status", filters.status);
  params.set("page", String(filters.page ?? 1));
  params.set("limit", String(filters.limit ?? 10));
  return apiFetch<ReviewListItem[]>(`/psychologist/reviews?${params.toString()}`);
}

export function approveReview(id: string): Promise<ApiSuccess<ApproveResult>> {
  return apiFetch<ApproveResult>(`/psychologist/reviews/${id}/approve`, { method: "POST" });
}

export function returnReview(id: string, input: ReturnReviewInput) {
  return apiFetch(`/psychologist/reviews/${id}/return`, { method: "POST", body: input });
}

export function saveReviewNotes(id: string, input: ReviewNotesInput) {
  return apiFetch(`/psychologist/reviews/${id}/notes`, { method: "PATCH", body: input });
}

export function applyCorrection(
  id: string,
  input: CorrectionInput & { scores: Record<string, unknown> },
) {
  return apiFetch(`/psychologist/reviews/${id}/scores`, { method: "PATCH", body: input });
}

export type { ReviewDetail };
