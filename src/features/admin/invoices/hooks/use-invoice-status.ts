"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { GENERIC_ERROR_MESSAGE } from "@/lib/api/error";
import { qk } from "@/lib/api/query-keys";
import type { Invoice } from "@/lib/api/types";
import { updateInvoiceStatus } from "../api";
import { INVOICE_STATUS_LABEL } from "../schemas";

export function useInvoiceStatus(invoice: Invoice, onSaved: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: { status: Invoice["status"]; notes?: string }) => {
      const { data } = await updateInvoiceStatus(invoice.id, values.status, values.notes);
      return data;
    },
    meta: { silentError: true },
    onSuccess: (updated) => {
      void queryClient.invalidateQueries({ queryKey: qk.admin.invoices.all });
      toast.success(`Invoice ${updated.number} → ${INVOICE_STATUS_LABEL[updated.status]}.`);
      onSaved();
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : GENERIC_ERROR_MESSAGE),
  });
}
