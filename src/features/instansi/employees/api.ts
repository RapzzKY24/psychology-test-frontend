import { apiFetch } from "@/lib/api/client";
import type { Employee } from "@/lib/api/types";
import type { ApiSuccess } from "@/lib/api/types/pagination";
import type { EmployeeCreatePayload, EmployeeUpdatePayload } from "./payload";

export interface EmployeeFilters {
  page?: number;
  limit?: number;
}

function buildQuery(filters: EmployeeFilters): string {
  const params = new URLSearchParams();
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export function fetchEmployees(
  filters: EmployeeFilters = {},
): Promise<ApiSuccess<Employee[]>> {
  return apiFetch<Employee[]>(`/instansi/participants${buildQuery(filters)}`);
}

export function createEmployee(input: EmployeeCreatePayload): Promise<ApiSuccess<Employee>> {
  return apiFetch<Employee>("/instansi/participants", { method: "POST", body: input });
}

export function updateEmployee(
  id: string,
  input: EmployeeUpdatePayload,
): Promise<ApiSuccess<Employee>> {
  return apiFetch<Employee>(`/instansi/participants/${id}`, { method: "PATCH", body: input });
}

export function deleteEmployee(id: string): Promise<ApiSuccess<{ id: string }>> {
  return apiFetch<{ id: string }>(`/instansi/participants/${id}`, { method: "DELETE" });
}
