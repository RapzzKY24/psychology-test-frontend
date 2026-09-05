"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
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
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { INVOICE_STATUSES } from "@/lib/api/types";
import type { Invoice } from "@/lib/api/types";
import { useInvoiceStatus } from "../hooks/use-invoice-status";
import { INVOICE_STATUS_LABEL, UpdateStatusSchema } from "../schemas";
import type { UpdateStatusInput } from "../schemas";

export function InvoiceStatusDialog({ invoice }: { invoice: Invoice }) {
  const [open, setOpen] = useState(false);

  const form = useForm<UpdateStatusInput>({
    resolver: zodResolver(UpdateStatusSchema),
    defaultValues: { status: invoice.status, notes: "" },
  });

  const mutation = useInvoiceStatus(invoice, () => setOpen(false));

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) form.reset({ status: invoice.status, notes: "" });
      }}
    >
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" aria-label={`Ubah status invoice ${invoice.number}`}>
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
          onSubmit={form.handleSubmit((values) =>
            mutation.mutateAsync({ status: values.status, notes: values.notes || undefined }),
          )}
          noValidate
          className="grid gap-4"
        >
          <Controller
            name="status"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={`status-${invoice.id}`}>Status</FieldLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={mutation.isPending}
                >
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
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="notes"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={`notes-${invoice.id}`}>Catatan (opsional)</FieldLabel>
                <Textarea
                  {...field}
                  id={`notes-${invoice.id}`}
                  rows={2}
                  disabled={mutation.isPending}
                  aria-invalid={fieldState.invalid}
                />
                <FieldDescription>Contoh: Dibayar via transfer 12 Sep.</FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
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
