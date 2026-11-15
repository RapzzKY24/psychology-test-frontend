"use client";

import type { QueryKey } from "@tanstack/react-query";
import type { ApiSuccess } from "@/lib/api/types/pagination";
import type { Invoice } from "@/lib/api/types";
import { useInvoicesList } from "../hooks/use-invoices-list";
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
  const { rows, meta } = useInvoicesList({ listKey, initial, page, status });

  return (
    <InvoicesTable
      rows={rows}
      meta={meta}
      listKey={listKey}
      institutionMap={institutionMap}
      status={status}
    />
  );
}
