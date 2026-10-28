"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { QueryKey } from "@tanstack/react-query";
import { asOptimistic, useOptimisticList } from "@/lib/hooks/use-optimistic-list";
import { isApiError } from "@/lib/api/client";
import { GENERIC_ERROR_MESSAGE } from "@/lib/api/error";
import type { AdminPaymentListItem } from "@/lib/api/types";
import { cancelPayment } from "../api";
import type { CancelPaymentInput } from "../schemas";

export function useCancelPayment(
  listKey: QueryKey,
  payment: AdminPaymentListItem,
  handlers: { onSaved: () => void; onFailed: (message: string) => void },
) {
  const list = useOptimisticList<AdminPaymentListItem>(listKey);

  return useMutation({
    mutationFn: async (values: CancelPaymentInput) => {
      const { data } = await cancelPayment(payment.orderId, values.reason);
      return data;
    },
    meta: { silentError: true },
    onMutate: async () => {
      const rollback = list.begin();
      list.patch((rows) =>
        rows.map((row) =>
          row.orderId === payment.orderId
            ? asOptimistic({ ...row, status: "CANCELLED" })
            : row,
        ),
      );
      return { rollback };
    },
    onError: (error, _values, context) => {
      context?.rollback();
      handlers.onFailed(isApiError(error) ? error.message : GENERIC_ERROR_MESSAGE);
    },
    onSuccess: () => {
      toast.success("Pesanan dibatalkan.");
      handlers.onSaved();
    },
    onSettled: () => list.refetch(),
  });
}
