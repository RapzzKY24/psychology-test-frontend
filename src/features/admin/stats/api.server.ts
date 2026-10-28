import { apiFetchServer } from "@/lib/api/server";
import type { ApiSuccess } from "@/lib/api/types/pagination";
import type { AdminRevenueStats } from "./types";

/** Server-only fetcher for the admin dashboard (RSC page). */
export function fetchAdminRevenueServer(
  months: number,
): Promise<ApiSuccess<AdminRevenueStats>> {
  return apiFetchServer<AdminRevenueStats>(`/admin/stats/revenue?months=${months}`, {
    revalidate: 60,
  });
}
