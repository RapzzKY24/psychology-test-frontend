import { apiFetchServer } from "@/lib/api/server";
import type { InstansiInvoice } from "@/lib/api/types";
import type { ApiSuccess } from "@/lib/api/types/pagination";

export function fetchInstansiInvoiceServer(id: string): Promise<ApiSuccess<InstansiInvoice>> {
  return apiFetchServer<InstansiInvoice>(`/instansi/invoices/${id}`);
}
