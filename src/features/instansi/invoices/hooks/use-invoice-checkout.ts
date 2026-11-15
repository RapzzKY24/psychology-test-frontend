"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchInstansiSessionDetail } from "@/features/instansi/sessions/api";
import { qk } from "@/lib/api/query-keys";
import type { InstansiInvoice } from "@/lib/api/types";
import { fetchInstansiInvoice } from "../api";
import { INVOICE_POLL_MS } from "../constants";

/**
 * The checkout screen's two reads: the invoice, polled until it is PAID, and —
 * only once it is — the session behind it, whose invite token the operator
 * shares with participants.
 */
export function useInvoiceCheckout(initial: InstansiInvoice) {
  const invoice = useQuery({
    queryKey: qk.instansi.invoices.detail(initial.id),
    queryFn: async () => (await fetchInstansiInvoice(initial.id)).data,
    initialData: initial,
    refetchInterval: (query) =>
      query.state.data?.status === "UNPAID" ? INVOICE_POLL_MS : false,
  });

  const session = useQuery({
    queryKey: qk.instansi.sessions.detail(invoice.data.sessionId ?? "none"),
    queryFn: async () =>
      (await fetchInstansiSessionDetail(invoice.data.sessionId as string)).data,
    enabled: invoice.data.status === "PAID" && invoice.data.sessionId !== null,
    staleTime: 5 * 60 * 1000,
  });

  return {
    invoice: invoice.data,
    token: session.data?.session.token,
  };
}
