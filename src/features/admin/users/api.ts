import { apiFetch } from "@/lib/api/client";
import type { AdminUser, UserRole } from "@/lib/api/types";
import type { ApiSuccess } from "@/lib/api/types/pagination";
import type { CreateUserInput } from "./schemas";

export interface AdminUserFilters {
  page?: number;
  limit?: number;
  role?: UserRole;
}

function buildQuery(filters: AdminUserFilters): string {
  const params = new URLSearchParams();
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  if (filters.role) params.set("role", filters.role);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export function fetchAdminUsers(filters: AdminUserFilters = {}): Promise<ApiSuccess<AdminUser[]>> {
  return apiFetch<AdminUser[]>(`/admin/users${buildQuery(filters)}`);
}

export function createAdminUser(input: CreateUserInput): Promise<ApiSuccess<AdminUser>> {
  return apiFetch<AdminUser>("/admin/users", { method: "POST", body: input });
}

export function updateUserRole(id: string, role: UserRole): Promise<ApiSuccess<AdminUser>> {
  return apiFetch<AdminUser>(`/admin/users/${id}/role`, { method: "PATCH", body: { role } });
}
