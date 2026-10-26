"use client";

import type { InstansiInvoiceListItem } from "@/lib/api/types";
import type { ApiSuccess } from "@/lib/api/types/pagination";
import { useInstansiInvoices } from "../hooks/use-instansi-invoices";
import { InvoicesTable } from "./invoices-table";

/** Client island — the table re-renders when the cache is invalidated. */
export function InvoicesIsland({
  initial,
  page,
}: {
  initial: ApiSuccess<InstansiInvoiceListItem[]>;
  page: number;
}) {
  const { data } = useInstansiInvoices(page, initial);
  const meta = data.meta ?? {
    page,
    limit: 10,
    total: data.data.length,
    totalPages: 1,
  };

  return (
    <InvoicesTable
      rows={data.data}
      meta={meta}
      pageHref={(next) => `/instansi/pembayaran?page=${next}`}
    />
  );
}
