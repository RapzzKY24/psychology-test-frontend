"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { qk } from "@/lib/api/query-keys";
import type { Institution } from "@/lib/api/types";
import { createInvoice } from "../api";
import { CreateInvoiceSchema } from "../schemas";
import type { CreateInvoiceInput } from "../schemas";

interface CreateInvoiceButtonProps {
  /** RSC passes the institutions list (mapped to a Select) — no cross-feature import. */
  institutions: Institution[];
}

export function CreateInvoiceButton({ institutions }: CreateInvoiceButtonProps) {
  const queryClient = useQueryClient();

  const form = useForm<CreateInvoiceInput>({
    resolver: zodResolver(CreateInvoiceSchema),
    defaultValues: { institutionId: "", amount: 0, dueDate: "", notes: "" },
  });

  const mutation = useMutation({
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
      form.reset();
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Terjadi kesalahan — coba lagi.");
    },
  });

  return (
    <Dialog onOpenChange={(next) => !next && form.reset()}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" aria-hidden />
          Buat Invoice
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Buat Invoice</DialogTitle>
          <DialogDescription>
            Nomor invoice dibuat otomatis (format INV-YYYY-NNNN).
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(
            (values) => mutation.mutateAsync(values),
            () => toast.error("Periksa kembali field yang bertanda merah."),
          )}
          noValidate
          className="grid gap-4"
        >
          <Controller
            name="institutionId"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="invoice-institution">Institusi</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="invoice-institution" aria-invalid={fieldState.invalid}>
                    <SelectValue placeholder="Pilih institusi" />
                  </SelectTrigger>
                  <SelectContent>
                    {institutions.map((institution) => (
                      <SelectItem key={institution.id} value={institution.id}>
                        {institution.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="amount"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="invoice-amount">Nominal (Rp)</FieldLabel>
                <Input
                  {...field}
                  id="invoice-amount"
                  type="number"
                  min={1}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="dueDate"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="invoice-due">Jatuh tempo (opsional)</FieldLabel>
                <Input {...field} id="invoice-due" type="date" aria-invalid={fieldState.invalid} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="notes"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="invoice-notes">Catatan (opsional)</FieldLabel>
                <Textarea {...field} id="invoice-notes" rows={2} aria-invalid={fieldState.invalid} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <DialogFooter>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Menyimpan..." : "Buat Invoice"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
