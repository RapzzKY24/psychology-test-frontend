import { apiFetchServer } from "@/lib/api/server";
import type { AdminUser } from "@/lib/api/types";
import type { ApiSuccess } from "@/lib/api/types/pagination";
import type { AdminUserFilters } from "./api";

/** Server-only fetchers for the users feature (RSC pages). */

function buildQuery(filters: AdminUserFilters): string {
  const params = new URLSearchParams();
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  if (filters.role) params.set("role", filters.role);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}



export function fetchAdminUsersServer(
  filters: AdminUserFilters = {},
): Promise<ApiSuccess<AdminUser[]>> {
  return apiFetchServer<AdminUser[]>(`/admin/users${buildQuery(filters)}`);
}
