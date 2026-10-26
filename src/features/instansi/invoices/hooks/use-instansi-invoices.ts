"use client";

import { useQuery } from "@tanstack/react-query";
import { qk } from "@/lib/api/query-keys";
import type { InstansiInvoiceListItem } from "@/lib/api/types";
import type { ApiSuccess } from "@/lib/api/types/pagination";
import { fetchInstansiInvoices } from "../api";

/** Payment list page — server-rendered first page, refreshed on the client. */
export function useInstansiInvoices(page: number, initial: ApiSuccess<InstansiInvoiceListItem[]>) {
  return useQuery({
    queryKey: qk.instansi.invoices.list({ page }),
    queryFn: () => fetchInstansiInvoices({ page }),
    initialData: initial,
  });
}
