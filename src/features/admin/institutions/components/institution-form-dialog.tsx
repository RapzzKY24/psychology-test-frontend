"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Pencil, Plus } from "lucide-react";
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
import { FORM_INVALID_TOAST } from "@/lib/copy";
import type { QueryKey } from "@tanstack/react-query";
import type { Institution } from "@/lib/api/types";
import { useInstitutionForm } from "../hooks/use-institution-form";
import { InstitutionSchema } from "../schemas";
import type { InstitutionInput } from "../schemas";
import { InstitutionFormFields } from "./institution-form-fields";

interface InstitutionFormDialogProps {
  listKey: QueryKey;
  mode: "create" | "edit";
  institution?: Institution;
}

export function InstitutionFormDialog({ listKey, mode, institution }: InstitutionFormDialogProps) {
  const isEdit = mode === "edit";
  const [open, setOpen] = useState(false);

  const form = useForm<InstitutionInput>({
    resolver: zodResolver(InstitutionSchema),
    defaultValues: {
      name: institution?.name ?? "",
      contactName: institution?.contactName ?? "",
      contactEmail: institution?.contactEmail ?? "",
      phone: institution?.phone ?? "",
      notes: institution?.notes ?? "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: institution?.name ?? "",
        contactName: institution?.contactName ?? "",
        contactEmail: institution?.contactEmail ?? "",
        phone: institution?.phone ?? "",
        notes: institution?.notes ?? "",
      });
    }
  }, [open, institution, form]);

  const mutation = useInstitutionForm({
    listKey,
    mode,
    institution,
    onSaved: () => setOpen(false),
    onFailed: (message) => {
      toast.error(message);
      setOpen(false);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEdit ? (
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-muted-foreground hover:text-foreground"
            aria-label={`Edit institusi ${institution?.name}`}
          >
            <Pencil className="size-4" aria-hidden />
          </Button>
        ) : (
          <Button>
            <Plus className="size-4" aria-hidden />
            Buat Institusi
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Institusi" : "Buat Institusi"}</DialogTitle>
          <DialogDescription>
            Institusi adalah klien B2B — pemilik sesi group dan invoice.
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
            <InstitutionFormFields disabled={mutation.isPending} />
            <DialogFooter>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending
                  ? "Menyimpan..."
                  : isEdit
                    ? "Simpan Perubahan"
                    : "Buat Institusi"}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
