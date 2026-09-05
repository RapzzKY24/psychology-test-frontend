import { apiFetch } from "@/lib/api/client";
import { parseErrorResponse } from "@/lib/api/error";
import type { AdminPaymentListItem } from "@/lib/api/types";
import type { ApiSuccess } from "@/lib/api/types/pagination";

export interface PaymentFilters {
  page?: number;
  limit?: number;
  status?: "PENDING" | "PAID" | "EXPIRED" | "CANCELLED";
  /** Exact-amount matching (the reconciliation key for manual QRIS). */
  amount?: number;
}

function buildQuery(filters: PaymentFilters): string {
  const params = new URLSearchParams();
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  if (filters.status) params.set("status", filters.status);
  if (filters.amount) params.set("amount", String(filters.amount));
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export function fetchPayments(filters: PaymentFilters = {}): Promise<ApiSuccess<AdminPaymentListItem[]>> {
  return apiFetch<AdminPaymentListItem[]>(`/admin/payments${buildQuery(filters)}`);
}

export function verifyPayment(
  id: string,
): Promise<ApiSuccess<{ orderId: string; status: string; wasLate: boolean; sessionId: string; attemptId: string }>> {
  return apiFetch(`/admin/payments/${id}/verify`, { method: "POST" });
}

export function cancelPayment(
  id: string,
  reason: string,
): Promise<ApiSuccess<{ orderId: string; status: string }>> {
  return apiFetch(`/admin/payments/${id}/cancel`, { method: "POST", body: { reason } });
}

/**
 * QRIS upload (multipart png/jpg ≤2MB). Uses raw fetch with FormData —
 * the browser sets the multipart boundary, cookies ride along same-origin.
 */
export async function uploadQrisImage(file: File): Promise<{ qrisImageUrl: string }> {
  const body = new FormData();
  body.append("file", file);
  const response = await fetch("/api/v1/admin/payments/qris", {
    method: "POST",
    credentials: "include",
    body,
  });
  const text = await response.text();
  let payload: unknown = null;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = text;
  }
  if (!response.ok) {
    throw parseErrorResponse(response.status, payload);
  }
  const data = (payload as { data?: { qrisImageUrl?: string } })?.data;
  if (!data?.qrisImageUrl) throw parseErrorResponse(response.status, null);
  return { qrisImageUrl: data.qrisImageUrl };
}
