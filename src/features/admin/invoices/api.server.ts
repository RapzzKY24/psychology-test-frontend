import { apiFetchServer } from "@/lib/api/server";
import type { Invoice, InvoiceStatus } from "@/lib/api/types";
import type { ApiSuccess } from "@/lib/api/types/pagination";
import type { InvoiceFilters } from "./api";

/** Server-only fetchers for the invoices feature (RSC pages). */

function buildQuery(filters: InvoiceFilters): string {
  const params = new URLSearchParams();
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  if (filters.status) params.set("status", filters.status);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}



export function fetchInvoicesServer(
  filters: InvoiceFilters = {},
): Promise<ApiSuccess<Invoice[]>> {
  return apiFetchServer<Invoice[]>(`/admin/invoices${buildQuery(filters)}`);
}
