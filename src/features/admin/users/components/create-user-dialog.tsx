"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { qk } from "@/lib/api/query-keys";
import { USER_ROLES } from "@/lib/api/types";
import { createAdminUser } from "../api";
import { CreateUserSchema, ROLE_LABEL } from "../schemas";
import type { CreateUserInput } from "../schemas";

export function CreateUserButton() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const form = useForm<CreateUserInput>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: { name: "", email: "", password: "", role: "PARTICIPANT" },
  });

  const mutation = useMutation({
    mutationFn: async (values: CreateUserInput) => {
      const { data } = await createAdminUser(values);
      return data;
    },
    meta: { silentError: true },
    onSuccess: (created) => {
      void queryClient.invalidateQueries({ queryKey: qk.admin.users.all });
      toast.success(`Akun ${created.email} dibuat sebagai ${ROLE_LABEL[created.role]}.`);
      setOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Terjadi kesalahan — coba lagi.");
    },
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) form.reset();
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" aria-hidden />
          Buat Akun
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Buat Akun Pengguna</DialogTitle>
          <DialogDescription>
            Akun langsung aktif — share kredensial secara aman ke yang bersangkutan.
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
                <FieldLabel htmlFor="user-name">Nama</FieldLabel>
                <Input {...field} id="user-name" aria-invalid={fieldState.invalid} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="user-email">Email</FieldLabel>
                <Input
                  {...field}
                  id="user-email"
                  type="email"
                  autoComplete="off"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="user-password">Kata sandi awal</FieldLabel>
                <Input
                  {...field}
                  id="user-password"
                  type="password"
                  autoComplete="new-password"
                  aria-invalid={fieldState.invalid}
                />
                <FieldDescription>Minimal 8 karakter.</FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="role"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="user-role">Role</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="user-role" aria-invalid={fieldState.invalid}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {USER_ROLES.map((role) => (
                      <SelectItem key={role} value={role}>
                        {ROLE_LABEL[role]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <DialogFooter>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Menyimpan..." : "Buat Akun"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
