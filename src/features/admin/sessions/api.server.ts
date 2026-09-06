import { apiFetchServer } from "@/lib/api/server";
import type { SessionDetail, SessionSummary } from "@/lib/api/types";
import type { ApiSuccess } from "@/lib/api/types/pagination";

/** Server-only fetchers for the sessions feature (RSC pages). */

export function fetchSessionsServer(
  filters: { page?: number; limit?: number } = {},
): Promise<ApiSuccess<SessionSummary[]>> {
  const params = new URLSearchParams();
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  const qs = params.toString();
  return apiFetchServer<SessionSummary[]>(`/admin/sessions${qs ? `?${qs}` : ""}`);
}

/** `GET /admin/sessions/:id` — session + ordered tests + participants + attempts. */
export function fetchSessionDetailServer(id: string): Promise<ApiSuccess<SessionDetail>> {
  return apiFetchServer<SessionDetail>(`/admin/sessions/${id}`);
}
