"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { GENERIC_ERROR_MESSAGE } from "@/lib/api/error";
import { qk } from "@/lib/api/query-keys";
import type { Invoice } from "@/lib/api/types";
import { createInvoice } from "../api";
import type { CreateInvoiceInput } from "../schemas";

export function useCreateInvoice(onSaved: (created: Invoice) => void) {
  const queryClient = useQueryClient();

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
    onSuccess: (created) => {
      void queryClient.invalidateQueries({ queryKey: qk.admin.invoices.all });
      toast.success(`Invoice ${created.number} dibuat.`);
      onSaved(created);
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : GENERIC_ERROR_MESSAGE),
  });
}
