"use client";

import { useQuery } from "@tanstack/react-query";
import type { QueryKey } from "@tanstack/react-query";
import type { ApiSuccess } from "@/lib/api/types/pagination";
import type { Invoice, InvoiceStatus } from "@/lib/api/types";
import { fetchInvoices } from "../api";

/**
 * The admin invoice list, seeded with the RSC's first page. It stays in the
 * query cache so a status change can update the row without a refetch.
 */
export function useInvoicesList({
  listKey,
  initial,
  page,
  status,
}: {
  listKey: QueryKey;
  initial: ApiSuccess<Invoice[]>;
  page: number;
  status?: string;
}) {
  const { data } = useQuery({
    queryKey: listKey,
    queryFn: () => fetchInvoices({ page, status: status as InvoiceStatus | undefined }),
    initialData: initial,
  });

  return {
    rows: data.data,
    // An endpoint that answers without `meta` still needs a pagination shape.
    meta: data.meta ?? { page, limit: 10, total: data.data.length, totalPages: 1 },
  };
}
