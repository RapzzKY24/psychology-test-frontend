"use client";

import { useMutation } from "@tanstack/react-query";
import type { QueryKey } from "@tanstack/react-query";
import { asOptimistic, useOptimisticList } from "@/lib/hooks/use-optimistic-list";
import { toast } from "sonner";
import { isApiError } from "@/lib/api/client";
import { GENERIC_ERROR_MESSAGE } from "@/lib/api/error";
import type { Invoice, InvoiceStatus } from "@/lib/api/types";
import { updateInvoiceStatus } from "../api";
import { INVOICE_STATUS_LABEL } from "../schemas";

export function useInvoiceStatus(
  listKey: QueryKey,
  invoice: Invoice,
  onSaved: () => void,
  onFailed: (message: string) => void,
) {
  const list = useOptimisticList<Invoice>(listKey);

  return useMutation({
    mutationFn: async (values: { status: InvoiceStatus; notes?: string }) => {
      const { data } = await updateInvoiceStatus(invoice.id, values.status, values.notes);
      return data;
    },
    meta: { silentError: true },
    onMutate: async (values) => {
      const rollback = list.begin();
      list.patch((rows) =>
        rows.map((row) =>
          row.id === invoice.id
            ? asOptimistic({ ...row, status: values.status, notes: values.notes || row.notes })
            : row,
        ),
      );
      return { rollback };
    },
    onError: (error, _values, context) => {
      context?.rollback();
      onFailed(isApiError(error) ? error.message : GENERIC_ERROR_MESSAGE);
    },
    onSuccess: (updated) => {
      toast.success(`Invoice ${updated.number} → ${INVOICE_STATUS_LABEL[updated.status]}.`);
    },
    onSettled: () => list.refetch(),
  });
}
