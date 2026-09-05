import { apiFetchServer } from "@/lib/api/server";
import type { AdminResultView, QueryResultsItem } from "@/lib/api/types";
import type { ApiSuccess } from "@/lib/api/types/pagination";
import type { ResultFilters } from "./api";

/** Server-only fetchers for the results-monitor feature (RSC pages). */

function buildQuery(filters: ResultFilters): string {
  const params = new URLSearchParams();
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  if (filters.status) params.set("status", filters.status);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export function fetchResultsServer(filters: ResultFilters = {}): Promise<ApiSuccess<QueryResultsItem[]>> {
  return apiFetchServer<QueryResultsItem[]>(`/admin/results${buildQuery(filters)}`);
}

/** Full admin view: system scores + corrections + interpretation. */
export function fetchAdminResultServer(id: string): Promise<ApiSuccess<AdminResultView>> {
  return apiFetchServer<AdminResultView>(`/admin/attempts/${id}/result`);
}
