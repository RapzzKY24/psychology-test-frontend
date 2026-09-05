import { apiFetch } from "@/lib/api/client";
import type { Institution } from "@/lib/api/types";
import type { ApiSuccess } from "@/lib/api/types/pagination";
import type { InstitutionInput } from "./schemas";

export interface InstitutionFilters {
  page?: number;
  limit?: number;
}

function buildQuery(filters: InstitutionFilters): string {
  const params = new URLSearchParams();
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export function fetchInstitutions(
  filters: InstitutionFilters = {},
): Promise<ApiSuccess<Institution[]>> {
  return apiFetch<Institution[]>(`/admin/institutions${buildQuery(filters)}`);
}

export function createInstitution(input: InstitutionInput): Promise<ApiSuccess<Institution>> {
  return apiFetch<Institution>("/admin/institutions", { method: "POST", body: input });
}

export function updateInstitution(
  id: string,
  input: Partial<InstitutionInput>,
): Promise<ApiSuccess<Institution>> {
  return apiFetch<Institution>(`/admin/institutions/${id}`, { method: "PATCH", body: input });
}
