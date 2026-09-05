"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
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
import { USER_ROLES } from "@/lib/api/types";
import type { UserRole } from "@/lib/api/types";
import type { AdminUser } from "@/lib/api/types";
import type { QueryKey } from "@tanstack/react-query";
import { useChangeRole } from "../hooks/use-change-role";
import { ROLE_LABEL } from "../schemas";

interface ChangeRoleDialogProps {
  /** List cache key — the mutation updates the table optimistically. */
  listKey: QueryKey;
  user: AdminUser;
  /** Role changes on the account itself are rejected by the backend (409). */
  disabled?: boolean;
}

export function ChangeRoleDialog({ user, disabled, listKey }: ChangeRoleDialogProps) {
  const [open, setOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<{ role: UserRole }>({
    defaultValues: { role: user.role },
  });

  const mutation = useChangeRole(
    listKey,
    user,
    () => setOpen(false),
    (message: string) => setFormError(message),
  );

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
        if (next) form.reset({ role: user.role });
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
          onSubmit={form.handleSubmit((values) => mutation.mutateAsync(values))}
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
