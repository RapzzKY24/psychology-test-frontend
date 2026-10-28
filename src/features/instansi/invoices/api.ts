import { apiFetch } from "@/lib/api/client";
import { downloadFile } from "@/lib/api/download";
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

/** `GET /instansi/invoices/:id/pdf` — unduh ulang invoice milik sendiri. */
export function downloadInstansiInvoicePdf(
  id: string,
  number: string,
): Promise<void> {
  const fallback = `Invoice-${number.replace(/[^A-Za-z0-9._-]+/g, "-")}.pdf`;
  return downloadFile(`/instansi/invoices/${encodeURIComponent(id)}/pdf`, fallback);
}
