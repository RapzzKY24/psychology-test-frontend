"use client";

import { useQuery } from "@tanstack/react-query";
import type { QueryKey } from "@tanstack/react-query";
import type { ApiSuccess } from "@/lib/api/types/pagination";
import type { AdminPaymentListItem } from "@/lib/api/types";
import { fetchPayments } from "../api";
import { PaymentsTable } from "./payments-table";

/** Client island — the list cache enables optimistic verify/cancel. */
export function PaymentsIsland({
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

  const tableMeta = data.meta ?? { page, limit: 10, total: data.data.length, totalPages: 1 };

  return (
    <PaymentsTable
      rows={data.data}
      meta={tableMeta}
      listKey={listKey}
      status={status}
      amount={amount}
    />
  );
}
