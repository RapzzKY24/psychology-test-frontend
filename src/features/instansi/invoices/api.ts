import { apiFetch } from "@/lib/api/client";
import type { InstansiInvoice, InstansiInvoiceListItem } from "@/lib/api/types";
import type { ApiSuccess } from "@/lib/api/types/pagination";

export interface InstansiInvoiceFilters {
  page?: number;
  limit?: number;
}

/** `GET /instansi/invoices/:id` — the batch invoice for the checkout page. */
export function fetchInstansiInvoice(id: string): Promise<ApiSuccess<InstansiInvoice>> {
  return apiFetch<InstansiInvoice>(`/instansi/invoices/${id}`);
}

function buildQuery(filters: InstansiInvoiceFilters): string {
  const params = new URLSearchParams();
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

/** `GET /instansi/invoices` — every batch invoice, unpaid first. */
export function fetchInstansiInvoices(
  filters: InstansiInvoiceFilters = {},
): Promise<ApiSuccess<InstansiInvoiceListItem[]>> {
  return apiFetch<InstansiInvoiceListItem[]>(`/instansi/invoices${buildQuery(filters)}`);
}
