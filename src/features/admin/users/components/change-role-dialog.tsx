"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { UserCog } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { isApiError } from "@/lib/api/client";
import { qk } from "@/lib/api/query-keys";
import { USER_ROLES } from "@/lib/api/types";
import type { AdminUser, UserRole } from "@/lib/api/types";
import { updateUserRole } from "../api";
import { ROLE_LABEL } from "../schemas";

interface ChangeRoleDialogProps {
  user: AdminUser;
  /** Role changes on the account itself are rejected by the backend (409). */
  disabled?: boolean;
}

export function ChangeRoleDialog({ user, disabled }: ChangeRoleDialogProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<{ role: UserRole }>({
    defaultValues: { role: user.role as UserRole },
  });

  const mutation = useMutation({
    mutationFn: async (values: { role: UserRole }) => {
      const { data } = await updateUserRole(user.id, values.role);
      return data;
    },
    meta: { silentError: true },
    onSuccess: (updated) => {
      void queryClient.invalidateQueries({ queryKey: qk.admin.users.all });
      toast.success(`Role ${user.email} → ${ROLE_LABEL[updated.role]}.`);
      setOpen(false);
    },
    onError: (error) => {
      if (isApiError(error) && error.code === "cannot_change_own_role") {
        setFormError("Anda tidak bisa mengubah role akun sendiri.");
        return;
      }
      toast.error(error instanceof Error ? error.message : "Terjadi kesalahan — coba lagi.");
    },
  });

  if (disabled) {
    return (
      <Button variant="ghost" size="sm" disabled title="Tidak bisa mengubah role akun sendiri">
        <UserCog className="size-4" aria-hidden />
        Role
      </Button>
    );
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        setFormError(null);
        if (next) form.reset({ role: user.role as UserRole });
      }}
    >
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <UserCog className="size-4" aria-hidden />
          Role
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Ubah Role</DialogTitle>
          <DialogDescription>
            {user.name} ({user.email})
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
            name="role"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={`role-${user.id}`}>Role baru</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id={`role-${user.id}`} aria-invalid={fieldState.invalid}>
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
                {formError && (
                  <p role="alert" className="text-sm text-destructive">
                    {formError}
                  </p>
                )}
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
