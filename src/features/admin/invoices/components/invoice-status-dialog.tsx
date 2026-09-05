"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FilePenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { isApiError } from "@/lib/api/client";
import { qk } from "@/lib/api/query-keys";
import { INVOICE_STATUSES } from "@/lib/api/types";
import type { Invoice, InvoiceStatus } from "@/lib/api/types";
import { updateInvoiceStatus } from "../api";
import { INVOICE_STATUS_LABEL } from "../schemas";

export function InvoiceStatusDialog({ invoice }: { invoice: Invoice }) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<{ status: InvoiceStatus; notes: string }>({
    defaultValues: { status: invoice.status, notes: "" },
  });

  const mutation = useMutation({
    mutationFn: async (values: { status: InvoiceStatus; notes: string }) => {
      const { data } = await updateInvoiceStatus(
        invoice.id,
        values.status,
        values.notes || undefined,
      );
      return data;
    },
    meta: { silentError: true },
    onSuccess: (updated) => {
      void queryClient.invalidateQueries({ queryKey: qk.admin.invoices.all });
      toast.success(`Invoice ${updated.number} → ${INVOICE_STATUS_LABEL[updated.status]}.`);
      setOpen(false);
    },
    onError: (error) => {
      setFormError(
        isApiError(error)
          ? error.message
          : "Terjadi kesalahan — coba lagi.",
      );
    },
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        setFormError(null);
        if (next) form.reset({ status: invoice.status, notes: "" });
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          aria-label={`Ubah status invoice ${invoice.number}`}
        >
          <FilePenLine className="size-4" aria-hidden />
          Status
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Ubah Status Invoice</DialogTitle>
          <DialogDescription>
            {invoice.number} — perubahan tercatat dengan catatan opsional.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit((values) => {
            setFormError(null);
            return mutation.mutateAsync(values);
          })}
          noValidate
          className="grid gap-4"
        >
          <Controller
            name="status"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={`status-${invoice.id}`}>Status</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id={`status-${invoice.id}`} aria-invalid={fieldState.invalid}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {INVOICE_STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {INVOICE_STATUS_LABEL[status]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && <p className="text-sm text-destructive">{fieldState.error?.message}</p>}
              </Field>
            )}
          />
          <Controller
            name="notes"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={`notes-${invoice.id}`}>Catatan (opsional)</FieldLabel>
                <Textarea {...field} id={`notes-${invoice.id}`} rows={2} aria-invalid={fieldState.invalid} />
                <FieldDescription>Contoh: Dibayar via transfer 12 Sep.</FieldDescription>
                {fieldState.invalid && <p className="text-sm text-destructive">{fieldState.error?.message}</p>}
              </Field>
            )}
          />
          {formError && (
            <p role="alert" className="text-sm text-destructive">
              {formError}
            </p>
          )}
          <DialogFooter>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
