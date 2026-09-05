import { apiFetch } from "@/lib/api/client";
import type { Invoice, InvoiceStatus } from "@/lib/api/types";
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
