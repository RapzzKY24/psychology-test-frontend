import { apiFetch } from "@/lib/api/client";
import type { InstansiInvoice } from "@/lib/api/types";
import type { ApiSuccess } from "@/lib/api/types/pagination";

/** `GET /instansi/invoices/:id` — the batch invoice for the checkout page. */
export function fetchInstansiInvoice(id: string): Promise<ApiSuccess<InstansiInvoice>> {
  return apiFetch<InstansiInvoice>(`/instansi/invoices/${id}`);
}
