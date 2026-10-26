"use client";

import { useQuery } from "@tanstack/react-query";
import { qk } from "@/lib/api/query-keys";
import { fetchInvoiceDetail } from "../api";

/**
 * Detail popup. Fetched lazily: the list already has the row, so the extra
 * request only runs once a row is opened.
 */
export function useInvoiceDetail(invoiceId: string | null) {
  return useQuery({
    queryKey: qk.admin.invoices.detail(invoiceId ?? "none"),
    queryFn: async () => (await fetchInvoiceDetail(invoiceId as string)).data,
    enabled: invoiceId !== null,
  });
}
