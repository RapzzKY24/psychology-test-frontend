"use client";

import { useQuery } from "@tanstack/react-query";
import type { QueryKey } from "@tanstack/react-query";
import type { ApiSuccess } from "@/lib/api/types/pagination";
import type { Invoice, InvoiceStatus } from "@/lib/api/types";
import { fetchInvoices } from "../api";
import { InvoicesTable } from "./invoices-table";

/** Client island — the list cache enables optimistic create/status change. */
export function InvoicesIsland({
  listKey,
  initial,
  page,
  status,
  institutionMap,
}: {
  listKey: QueryKey;
  initial: ApiSuccess<Invoice[]>;
  page: number;
  status?: string;
  institutionMap: Record<string, string>;
}) {
  const { data } = useQuery({
    queryKey: listKey,
    queryFn: () =>
      fetchInvoices({ page, status: status as InvoiceStatus | undefined }),
    initialData: initial,
  });

  const tableMeta = data.meta ?? { page, limit: 10, total: data.data.length, totalPages: 1 };

  return (
    <InvoicesTable
      rows={data.data}
      meta={tableMeta}
      listKey={listKey}
      institutionMap={institutionMap}
      status={status}
    />
  );
}
