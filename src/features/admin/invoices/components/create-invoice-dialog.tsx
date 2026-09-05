"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Plus } from "lucide-react";
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
import { FORM_INVALID_TOAST } from "@/features/admin/copy";
import type { Institution } from "@/lib/api/types";
import { useCreateInvoice } from "../hooks/use-create-invoice";
import { CreateInvoiceSchema } from "../schemas";
import type { CreateInvoiceInput } from "../schemas";
import { InvoiceFormFields } from "./invoice-form-fields";

interface CreateInvoiceButtonProps {
  /** RSC passes the institutions list (mapped to a Select) — no cross-feature import. */
  institutions: Institution[];
}

export function CreateInvoiceButton({ institutions }: CreateInvoiceButtonProps) {
  const [open, setOpen] = useState(false);
  const form = useForm<CreateInvoiceInput>({
    resolver: zodResolver(CreateInvoiceSchema),
    defaultValues: { institutionId: "", amount: 0, dueDate: "", notes: "" },
  });

  const mutation = useCreateInvoice(() => {
    setOpen(false);
    form.reset();
  });

  return (
    <Dialog open={open} onOpenChange={(next) => {
        setOpen(next);
        if (!next) form.reset();
      }}>
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
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(
              (values) => mutation.mutateAsync(values),
              () => toast.error(FORM_INVALID_TOAST),
            )}
            noValidate
            className="grid gap-4"
          >
            <InvoiceFormFields institutions={institutions} disabled={mutation.isPending} />
            <DialogFooter>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Menyimpan..." : "Buat Invoice"}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
