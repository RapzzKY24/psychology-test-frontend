import { apiFetchServer } from "@/lib/api/server";
import type { InstansiInvoice, InstansiInvoiceListItem } from "@/lib/api/types";
import type { ApiSuccess } from "@/lib/api/types/pagination";
import type { InstansiInvoiceFilters } from "./api";

export function fetchInstansiInvoiceServer(id: string): Promise<ApiSuccess<InstansiInvoice>> {
  return apiFetchServer<InstansiInvoice>(`/instansi/invoices/${id}`);
}

export function fetchInstansiInvoicesServer(
  filters: InstansiInvoiceFilters = {},
): Promise<ApiSuccess<InstansiInvoiceListItem[]>> {
  const params = new URLSearchParams();
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  const qs = params.toString();

  return apiFetchServer<InstansiInvoiceListItem[]>(`/instansi/invoices${qs ? `?${qs}` : ""}`);
}
