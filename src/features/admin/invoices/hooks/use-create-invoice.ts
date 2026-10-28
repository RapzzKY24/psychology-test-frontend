"use client";

import { useMutation } from "@tanstack/react-query";
import type { QueryKey } from "@tanstack/react-query";
import { asOptimistic, useOptimisticList } from "@/lib/hooks/use-optimistic-list";
import { toast } from "sonner";
import { isApiError } from "@/lib/api/client";
import { GENERIC_ERROR_MESSAGE } from "@/lib/api/error";
import type { Invoice } from "@/lib/api/types";
import { createInvoice } from "../api";
import type { CreateInvoiceInput } from "../schemas";

export function useCreateInvoice(listKey: QueryKey, onSaved: (created: Invoice) => void) {
  const list = useOptimisticList<Invoice>(listKey);

  return useMutation({
    mutationFn: async (values: CreateInvoiceInput) => {
      const payload = {
        institutionId: values.institutionId,
        amount: values.amount,
        ...(values.dueDate ? { dueDate: values.dueDate } : {}),
        ...(values.notes ? { notes: values.notes } : {}),
      };
      const { data } = await createInvoice(payload);
      return data;
    },
    meta: { silentError: true },
    onMutate: async (values) => {
      const rollback = list.begin();
      // The server assigns the INV-YYYY-NNNN number — the optimistic row shows
      // an empty number until the refetch lands.
      list.patch((rows) => [
        asOptimistic({
          id: `optimistic-${Date.now()}`,
          number: "",
          institutionId: values.institutionId,
          amount: values.amount,
          status: "UNPAID",
          issuedAt: new Date().toISOString(),
          dueDate: values.dueDate || null,
          notes: values.notes || null,
        }),
        ...rows,
      ]);
      return { rollback };
    },
    onError: (error, _values, context) => {
      context?.rollback();
      toast.error(isApiError(error) ? error.message : GENERIC_ERROR_MESSAGE);
    },
    onSettled: () => list.refetch(),
  });
}
