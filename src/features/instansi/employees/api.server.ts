import { apiFetchServer } from "@/lib/api/server";
import type { Employee } from "@/lib/api/types";
import type { ApiSuccess } from "@/lib/api/types/pagination";
import type { EmployeeFilters } from "./api";

/** Server-only fetchers for the instansi employees feature (RSC pages). */

function buildQuery(filters: EmployeeFilters): string {
  const params = new URLSearchParams();
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export function fetchEmployeesServer(
  filters: EmployeeFilters = {},
): Promise<ApiSuccess<Employee[]>> {
  return apiFetchServer<Employee[]>(`/instansi/participants${buildQuery(filters)}`);
}
