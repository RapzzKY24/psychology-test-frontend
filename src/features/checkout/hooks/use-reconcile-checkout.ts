"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { qk } from "@/lib/api/query-keys";
import { reconcileCheckoutStatus } from "../api";

/**
 * Pulls the real status from the gateway and patches the cached checkout, so
 * the result page never has to wait for the recovery pass to notice a payment.
 * Silent: a failed check leaves the page on its current state instead of
 * interrupting the buyer with a toast.
 */
export function useReconcileCheckout(ref: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => (await reconcileCheckoutStatus(ref)).data,
    meta: { silentError: true },
    onSuccess: (data) => {
      queryClient.setQueryData(qk.checkout.detail(ref), data);
      if (data.status !== "PAID") return;
      // A settled invoice also activates its session, so both lists are stale.
      if (data.kind === "invoice") {
        void queryClient.invalidateQueries({ queryKey: qk.instansi.invoices.all });
        void queryClient.invalidateQueries({ queryKey: qk.instansi.sessions.all });
      }
    },
  });
}
