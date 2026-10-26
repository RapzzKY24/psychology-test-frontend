"use client";

import { useQuery } from "@tanstack/react-query";
import { qk } from "@/lib/api/query-keys";
import type { CheckoutStatusResult } from "@/lib/api/types";
import { fetchCheckoutStatus } from "../api";
import { CHECKOUT_POLL_MS } from "../constants";

/**
 * Checkout status. The database is the only source of truth, so an unpaid
 * invoice keeps polling until the webhook (or the recovery job) settles it.
 */
export function useCheckoutStatus(initial: CheckoutStatusResult) {
  return useQuery({
    queryKey: qk.checkout.detail(initial.id),
    queryFn: async () => (await fetchCheckoutStatus(initial.id)).data,
    initialData: initial,
    refetchInterval: (query) => (query.state.data?.status === "UNPAID" ? CHECKOUT_POLL_MS : false),
  });
}
