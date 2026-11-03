import { apiFetchServer } from "@/lib/api/server";
import type { SessionSummary } from "@/lib/api/types";
import type { InstansiSessionDetail } from "@/lib/api/types";
import type { ApiSuccess } from "@/lib/api/types/pagination";
import type { InstansiSessionFilters, InstansiTestOption } from "./api";

/** Server-only fetchers for the instansi sessions feature (RSC pages). */

function buildQuery(filters: InstansiSessionFilters): string {
  const params = new URLSearchParams();
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export function fetchInstansiSessionsServer(
  filters: InstansiSessionFilters = {},
): Promise<ApiSuccess<SessionSummary[]>> {
  return apiFetchServer<SessionSummary[]>(`/instansi/sessions${buildQuery(filters)}`);
}

export function fetchInstansiSessionDetailServer(
  id: string,
): Promise<ApiSuccess<InstansiSessionDetail>> {
  return apiFetchServer<InstansiSessionDetail>(`/instansi/sessions/${id}`);
}

export function fetchPublishedTestsServer(): Promise<ApiSuccess<InstansiTestOption[]>> {
  // Every published test is sellable — GET /instansi/tests returns the same set
  // as the public catalog, price included.
  return apiFetchServer<InstansiTestOption[]>("/instansi/tests");
}
