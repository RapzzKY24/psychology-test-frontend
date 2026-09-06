"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
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
import type { QueryKey } from "@tanstack/react-query";
import { CreateUserSchema } from "../schemas";
import type { CreateUserInput } from "../schemas";
import { useCreateUser } from "../hooks/use-create-user";
import { UserFormFields } from "./user-form-fields";

interface CreateUserButtonProps {
  /** List cache key — the mutation prepends the new account optimistically. */
  listKey: QueryKey;
}

export function CreateUserButton({ listKey }: CreateUserButtonProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<CreateUserInput>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: { name: "", email: "", password: "", role: "PARTICIPANT" },
  });

  const mutation = useCreateUser(listKey, () => {
    setOpen(false);
    form.reset();
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
            Akun langsung aktif — kredensial dikomunikasikan secara aman ke yang bersangkutan.
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
            <UserFormFields />
            <DialogFooter>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Menyimpan..." : "Buat Akun"}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
