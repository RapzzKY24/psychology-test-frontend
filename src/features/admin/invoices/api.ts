import { apiFetch } from "@/lib/api/client";
import { downloadFile } from "@/lib/download";
import { formatInvoiceFilename } from "@/lib/format/format-invoice-filename";
import type { AdminInvoiceDetail, Invoice, InvoiceStatus } from "@/lib/api/types";
import type { ApiSuccess } from "@/lib/api/types/pagination";
import type { CreateInvoiceInput } from "./schemas";

export interface InvoiceFilters {
  page?: number;
  limit?: number;
  status?: InvoiceStatus;
}

function buildQuery(filters: InvoiceFilters): string {
  const params = new URLSearchParams();
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  if (filters.status) params.set("status", filters.status);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export function fetchInvoices(filters: InvoiceFilters = {}): Promise<ApiSuccess<Invoice[]>> {
  return apiFetch<Invoice[]>(`/admin/invoices${buildQuery(filters)}`);
}

/** `GET /admin/invoices/:id` — institution, tests, and payment trail. */
export function fetchInvoiceDetail(id: string): Promise<ApiSuccess<AdminInvoiceDetail>> {
  return apiFetch<AdminInvoiceDetail>(`/admin/invoices/${encodeURIComponent(id)}`);
}

export function createInvoice(input: CreateInvoiceInput): Promise<ApiSuccess<Invoice>> {
  return apiFetch<Invoice>("/admin/invoices", { method: "POST", body: input });
}

export function updateInvoiceStatus(
  id: string,
  status: InvoiceStatus,
  notes?: string,
): Promise<ApiSuccess<Invoice>> {
  return apiFetch<Invoice>(`/admin/invoices/${id}/status`, {
    method: "PATCH",
    body: { status, ...(notes ? { notes } : {}) },
  });
}

/** `GET /admin/invoices/:id/pdf` — the file the admin forwards to the institution. */
export function downloadInvoicePdf(id: string, number: string): Promise<void> {
  return downloadFile(
    `/admin/invoices/${encodeURIComponent(id)}/pdf`,
    formatInvoiceFilename(number),
  );
}
