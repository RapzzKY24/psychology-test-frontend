"use client";

import { useQuery } from "@tanstack/react-query";
import type { QueryKey } from "@tanstack/react-query";
import type { ApiSuccess } from "@/lib/api/types/pagination";
import type { AdminPaymentListItem } from "@/lib/api/types";
import { fetchPayments } from "../api";

/**
 * The admin payment list, seeded with the page the RSC already fetched so the
 * table paints without a spinner. It stays in the query cache because verify
 * and cancel update the rows optimistically.
 */
export function usePaymentsList({
  listKey,
  initial,
  page,
  status,
  amount,
}: {
  listKey: QueryKey;
  initial: ApiSuccess<AdminPaymentListItem[]>;
  page: number;
  status?: string;
  amount?: string;
}) {
  const { data } = useQuery({
    queryKey: listKey,
    queryFn: () =>
      fetchPayments({
        page,
        status: status as AdminPaymentListItem["status"] | undefined,
        amount: amount ? Number(amount) : undefined,
      }),
    initialData: initial,
  });

  return {
    rows: data.data,
    // An endpoint that answers without `meta` still needs a pagination shape.
    meta: data.meta ?? { page, limit: 10, total: data.data.length, totalPages: 1 },
  };
}
