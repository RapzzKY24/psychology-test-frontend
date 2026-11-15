"use client";

import type { QueryKey } from "@tanstack/react-query";
import type { ApiSuccess } from "@/lib/api/types/pagination";
import type { AdminPaymentListItem } from "@/lib/api/types";
import { usePaymentsList } from "../hooks/use-payments-list";
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
  const { rows, meta } = usePaymentsList({ listKey, initial, page, status, amount });

  return (
    <PaymentsTable
      rows={rows}
      meta={meta}
      listKey={listKey}
      status={status}
      amount={amount}
    />
  );
}
