import { apiFetch } from "@/lib/api/client";
import type { AdminResultView, QueryResultsItem } from "@/lib/api/types";
import type { ApiSuccess } from "@/lib/api/types/pagination";

export interface ResultFilters {
  page?: number;
  limit?: number;
  status?: "PENDING_REVIEW" | "APPROVED" | "RETURNED";
}

function buildQuery(filters: ResultFilters): string {
  const params = new URLSearchParams();
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  if (filters.status) params.set("status", filters.status);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export function fetchResults(filters: ResultFilters = {}): Promise<ApiSuccess<QueryResultsItem[]>> {
  return apiFetch<QueryResultsItem[]>(`/admin/results${buildQuery(filters)}`);
}

export function resubmitResult(resultId: string): Promise<ApiSuccess<unknown>> {
  return apiFetch(`/admin/results/${resultId}/resubmit`, { method: "POST" });
}
