"use client";

import { useQuery } from "@tanstack/react-query";
import { qk } from "@/lib/api/query-keys";
import { fetchOrderDetail } from "../api";
import { CHECKOUT_POLL_MS } from "../constants";

/**
 * One order behind the payment dialog. `orderId` is null while the dialog is
 * closed, so the query stays idle; a PENDING order keeps polling until the
 * webhook settles it or the window closes.
 */
export function useOrderDetail(orderId: string | null) {
  return useQuery({
    queryKey: qk.orders.detail(orderId ?? "none"),
    queryFn: async () => (await fetchOrderDetail(orderId as string)).data,
    enabled: Boolean(orderId),
    refetchInterval: (query) =>
      query.state.data?.status === "PENDING" ? CHECKOUT_POLL_MS : false,
  });
}
