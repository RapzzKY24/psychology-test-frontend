"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { QueryKey } from "@tanstack/react-query";
import { asOptimistic, useOptimisticList } from "@/lib/hooks/use-optimistic-list";
import { isApiError } from "@/lib/api/client";
import { GENERIC_ERROR_MESSAGE } from "@/lib/api/error";
import type { AdminPaymentListItem } from "@/lib/api/types";
import { verifyPayment } from "../api";

export function useVerifyPayment(
  listKey: QueryKey,
  payment: AdminPaymentListItem,
  onVerified: () => void,
  onFailed: (message: string) => void,
) {
  const list = useOptimisticList<AdminPaymentListItem>(listKey);

  return useMutation({
    mutationFn: async () => {
      const { data } = await verifyPayment(payment.orderId);
      return data;
    },
    meta: { silentError: true },
    onMutate: async () => {
      const rollback = list.begin();
      list.patch((rows) =>
        rows.map((row) =>
          row.orderId === payment.orderId
            ? asOptimistic({ ...row, status: "PAID" })
            : row,
        ),
      );
      return { rollback };
    },
    onError: (error, _values, context) => {
      context?.rollback();
      onFailed(isApiError(error) ? error.message : GENERIC_ERROR_MESSAGE);
    },
    onSuccess: (result) => {
      toast.success(
        result.wasLate
          ? "Terverifikasi (terlambat) — sesi & attempt dibuat."
          : "Terverifikasi — sesi & attempt dibuat.",
      );
      onVerified();
    },
    onSettled: () => list.refetch(),
  });
}
