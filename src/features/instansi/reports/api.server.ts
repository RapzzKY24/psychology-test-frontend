import { apiFetchServer } from "@/lib/api/server";
import type { InstansiReportItem } from "@/lib/api/types";
import type { ApiSuccess } from "@/lib/api/types/pagination";
import type { InstansiReportFilters } from "./api";

/** Server-only fetcher for the instansi report page (RSC). */
export function fetchInstansiReportsServer(
  filters: InstansiReportFilters = {},
): Promise<ApiSuccess<InstansiReportItem[]>> {
  const params = new URLSearchParams();
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  if (filters.sessionId) params.set("sessionId", filters.sessionId);
  const qs = params.toString();
  return apiFetchServer<InstansiReportItem[]>(`/instansi/reports${qs ? `?${qs}` : ""}`);
}
