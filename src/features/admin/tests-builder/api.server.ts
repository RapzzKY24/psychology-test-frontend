import { apiFetchServer } from "@/lib/api/server";
import type { AdminTest, AdminTestDetail } from "@/lib/api/types";
import type { ApiSuccess } from "@/lib/api/types/pagination";
import type { AdminTestFilters } from "./api";

/**
 * Server-only fetchers for the tests-builder feature (RSC pages).
 * Kept separate from api.ts so client components never pull next/headers
 * into the browser bundle.
 */

function buildQuery(filters: AdminTestFilters): string {
  const params = new URLSearchParams();
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  if (filters.status) params.set("status", filters.status);
  if (filters.category) params.set("category", filters.category);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

/** RSC variant — Node-to-Node with cookie forwarding. */
export function fetchAdminTestsServer(
  filters: AdminTestFilters = {},
): Promise<ApiSuccess<AdminTest[]>> {
  return apiFetchServer<AdminTest[]>(`/admin/tests${buildQuery(filters)}`);
}

/** RSC variant — Node-to-Node with cookie forwarding. */
export function fetchAdminTestDetailServer(id: string): Promise<ApiSuccess<AdminTestDetail>> {
  return apiFetchServer<AdminTestDetail>(`/admin/tests/${id}`);
}
