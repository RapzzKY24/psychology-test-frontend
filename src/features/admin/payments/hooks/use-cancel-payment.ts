"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { isApiError } from "@/lib/api/client";
import { GENERIC_ERROR_MESSAGE } from "@/lib/api/error";
import { qk } from "@/lib/api/query-keys";
import type { AdminPaymentListItem } from "@/lib/api/types";
import { cancelPayment } from "../api";
import type { CancelPaymentInput } from "../schemas";

export function useCancelPayment(
  payment: AdminPaymentListItem,
  handlers: { onSaved: () => void; onFailed: (message: string) => void },
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: CancelPaymentInput) => {
      const { data } = await cancelPayment(payment.orderId, values.reason);
      return data;
    },
    meta: { silentError: true },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: qk.admin.payments.all });
      toast.success("Pesanan dibatalkan.");
      handlers.onSaved();
    },
    onError: (error) => {
      handlers.onFailed(isApiError(error) ? error.message : GENERIC_ERROR_MESSAGE);
    },
  });
}
