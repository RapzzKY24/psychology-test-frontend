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
import type { Employee } from "@/lib/api/types";
import { useEmployeeForm } from "../hooks/use-employee-form";
import { EmployeeSchema } from "../schemas";
import type { EmployeeInput } from "../schemas";
import { EmployeeFormFields } from "./employee-form-fields";

interface EmployeeFormDialogProps {
  listKey: QueryKey;
  mode: "create" | "edit";
  employee?: Employee;
}

const EMPTY: EmployeeInput = {
  name: "",
  destinationCountry: "",
  idType: "NIK",
  idNumber: "",
  birthDate: "",
  phone: "",
  notes: "",
};

export function EmployeeFormDialog({ listKey, mode, employee }: EmployeeFormDialogProps) {
  const isEdit = mode === "edit";
  const [open, setOpen] = useState(false);

  const form = useForm<EmployeeInput>({
    resolver: zodResolver(EmployeeSchema),
    defaultValues: {
      name: employee?.name ?? "",
      destinationCountry: employee?.destinationCountry ?? "",
      idType: employee?.idType ?? "NIK",
      idNumber: employee?.idNumber ?? "",
      birthDate: employee?.birthDate ? employee.birthDate.slice(0, 10) : "",
      phone: employee?.phone ?? "",
      notes: employee?.notes ?? "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: employee?.name ?? "",
        destinationCountry: employee?.destinationCountry ?? "",
        idType: employee?.idType ?? "NIK",
        idNumber: employee?.idNumber ?? "",
        birthDate: employee?.birthDate ? employee.birthDate.slice(0, 10) : "",
        phone: employee?.phone ?? "",
        notes: employee?.notes ?? "",
      });
    }
  }, [open, employee, form]);

  const mutation = useEmployeeForm({
    listKey,
    mode,
    employee,
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
            aria-label={`Edit pegawai ${employee?.name}`}
          >
            <Pencil className="size-4" aria-hidden />
          </Button>
        ) : (
          <Button>
            <Plus className="size-4" aria-hidden />
            Tambah Pegawai
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Pegawai" : "Tambah Pegawai"}</DialogTitle>
          <DialogDescription>
            Data pegawai untuk roster sesi tes. NIK hanya terlihat di dashboard ini.
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
            <EmployeeFormFields />
            <DialogFooter>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending
                  ? "Menyimpan..."
                  : isEdit
                    ? "Simpan Perubahan"
                    : "Tambah Pegawai"}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
