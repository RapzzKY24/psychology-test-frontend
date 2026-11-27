import { apiFetchServer } from "@/lib/api/server";
import type { Institution } from "@/lib/api/types";
import type { ApiSuccess } from "@/lib/api/types/pagination";
import type { InstitutionFilters } from "./api";

/** Server-only fetchers for the institutions feature (RSC pages). */

function buildQuery(filters: InstitutionFilters): string {
  const params = new URLSearchParams();
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}



export function fetchInstitutionsServer(
  filters: InstitutionFilters = {},
): Promise<ApiSuccess<Institution[]>> {
  return apiFetchServer<Institution[]>(`/admin/institutions${buildQuery(filters)}`);
}

export function fetchInstitutionServer(
  id: string,
): Promise<ApiSuccess<Institution>> {
  return apiFetchServer<Institution>(`/admin/institutions/${id}`);
}
