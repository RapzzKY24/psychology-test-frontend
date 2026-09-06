import { apiFetchServer } from "@/lib/api/server";
import type { AdminPaymentListItem } from "@/lib/api/types";
import type { ApiSuccess } from "@/lib/api/types/pagination";

/** Server-only fetcher for the payments feature (RSC pages). */

export function fetchPaymentsServer(
  filters: {
    page?: number;
    limit?: number;
    status?: "PENDING" | "PAID" | "EXPIRED" | "CANCELLED";
    amount?: number;
  } = {},
): Promise<ApiSuccess<AdminPaymentListItem[]>> {
  const params = new URLSearchParams();
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  if (filters.status) params.set("status", filters.status);
  if (filters.amount) params.set("amount", String(filters.amount));
  const qs = params.toString();
  return apiFetchServer<AdminPaymentListItem[]>(`/admin/payments${qs ? `?${qs}` : ""}`);
}
