"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { qk } from "@/lib/api/query-keys";
import { retryInstansiInvoicePayment } from "../api";

/**
 * Re-issues the payment link after a provisioning failure (gateway down or a
 * rejected request). The response replaces the cached invoice directly, so the
 * pay button appears the moment the link exists.
 */
export function useRetryInvoicePayment(invoiceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => retryInstansiInvoicePayment(invoiceId),
    onSuccess: (result) => {
      queryClient.setQueryData(qk.instansi.invoices.detail(invoiceId), result.data);
    },
  });
}
