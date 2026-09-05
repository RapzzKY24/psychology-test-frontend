"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { qk } from "@/lib/api/query-keys";
import type { Institution } from "@/lib/api/types";
import { createInstitution, updateInstitution } from "../api";
import { InstitutionSchema } from "../schemas";
import type { InstitutionInput } from "../schemas";

interface InstitutionFormDialogProps {
  mode: "create" | "edit";
  institution?: Institution;
}

export function InstitutionFormDialog({ mode, institution }: InstitutionFormDialogProps) {
  const queryClient = useQueryClient();
  const isEdit = mode === "edit";

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
    if (isEdit && institution) {
      form.reset({
        name: institution.name,
        contactName: institution.contactName,
        contactEmail: institution.contactEmail,
        phone: institution.phone ?? "",
        notes: institution.notes ?? "",
      });
    }
  }, [institution, isEdit, form]);

  const mutation = useMutation({
    mutationFn: async (values: InstitutionInput) => {
      const payload = {
        ...values,
        phone: values.phone || undefined,
        notes: values.notes || undefined,
      };
      const { data } = isEdit && institution
        ? await updateInstitution(institution.id, payload)
        : await createInstitution(payload);
      return data;
    },
    meta: { silentError: true },
    onSuccess: (saved) => {
      void queryClient.invalidateQueries({ queryKey: qk.admin.institutions.all });
      toast.success(isEdit ? `Institusi ${saved.name} diperbarui.` : `Institusi ${saved.name} dibuat.`);
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Terjadi kesalahan — coba lagi.");
    },
  });

  return (
    <Dialog>
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
        <form
          onSubmit={form.handleSubmit(
            (values) => mutation.mutateAsync(values),
            () => toast.error("Periksa kembali field yang bertanda merah."),
          )}
          noValidate
          className="grid gap-4"
        >
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="inst-name">Nama institusi</FieldLabel>
                <Input {...field} id="inst-name" placeholder="PT Maju Jaya" aria-invalid={fieldState.invalid} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="contactName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="inst-contact">Nama kontak</FieldLabel>
                <Input {...field} id="inst-contact" placeholder="Budi HRD" aria-invalid={fieldState.invalid} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="contactEmail"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="inst-email">Email kontak</FieldLabel>
                <Input
                  {...field}
                  id="inst-email"
                  type="email"
                  placeholder="hr@ptmajujaya.co.id"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="phone"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="inst-phone">Telepon (opsional)</FieldLabel>
                <Input {...field} id="inst-phone" placeholder="0812…" aria-invalid={fieldState.invalid} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="notes"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="inst-notes">Catatan (opsional)</FieldLabel>
                <Textarea {...field} id="inst-notes" rows={3} aria-invalid={fieldState.invalid} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <DialogFooter>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Buat Institusi"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
