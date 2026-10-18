import { apiFetchServer } from "@/lib/api/server";
import type { InstansiResultItem } from "@/lib/api/types";
import type { ApiSuccess } from "@/lib/api/types/pagination";
import type { InstansiResultFilters } from "./api";

/** Server-only fetchers for the instansi results feature (RSC pages). */

function buildQuery(filters: InstansiResultFilters): string {
  const params = new URLSearchParams();
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export function fetchInstansiResultsServer(
  filters: InstansiResultFilters = {},
): Promise<ApiSuccess<InstansiResultItem[]>> {
  return apiFetchServer<InstansiResultItem[]>(`/instansi/results${buildQuery(filters)}`);
}
