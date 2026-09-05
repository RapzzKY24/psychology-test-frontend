"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { isApiError } from "@/lib/api/client";
import { GENERIC_ERROR_MESSAGE } from "@/lib/api/error";
import { qk } from "@/lib/api/query-keys";
import type { AdminPaymentListItem } from "@/lib/api/types";
import { verifyPayment } from "../api";

export function useVerifyPayment(payment: AdminPaymentListItem, onVerified: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await verifyPayment(payment.orderId);
      return data;
    },
    meta: { silentError: true },
    onSuccess: (result) => {
      void queryClient.invalidateQueries({ queryKey: qk.admin.payments.all });
      toast.success(
        result.wasLate
          ? "Terverifikasi (terlambat) — sesi & attempt dibuat."
          : "Terverifikasi — sesi & attempt dibuat.",
      );
      onVerified();
    },
    onError: (error) => {
      if (isApiError(error)) {
        toast.error(error.message);
        return;
      }
      toast.error(GENERIC_ERROR_MESSAGE);
    },
  });
}
