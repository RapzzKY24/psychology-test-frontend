"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
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
import { useUpdateSession } from "../hooks/use-session-mutations";
import {
  UpdateSessionFormSchema,
  buildSessionUpdatePayload,
  toDatetimeLocalValue,
} from "../schemas";
import type { UpdateSessionFormInput } from "../schemas";

interface EditSessionDialogProps {
  sessionId: string;
  /** Current title (from the server-rendered detail page). */
  title: string;
  /** Current expiry (ISO) — rendered in local time in the input. */
  expiresAt: string;
}

/** Admin edits a session's title and/or expiry; only changed fields are sent. */
export function EditSessionDialog({ sessionId, title, expiresAt }: EditSessionDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const initial = { title, expiresAt };
  const form = useForm<UpdateSessionFormInput>({
    resolver: zodResolver(UpdateSessionFormSchema),
    defaultValues: { title, expiresAt: toDatetimeLocalValue(expiresAt) },
  });
  const mutation = useUpdateSession(sessionId, () => {
    setOpen(false);
    router.refresh();
  });

  const submit = form.handleSubmit((values) => {
    const payload = buildSessionUpdatePayload(initial, values);
    if (!payload) {
      toast.error("Tidak ada perubahan untuk disimpan.");
      return;
    }
    mutation.mutate(payload);
  });

  const titleError = form.formState.errors.title;
  const expiresError = form.formState.errors.expiresAt;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) form.reset();
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">
          <Pencil className="size-4" aria-hidden />
          Edit Sesi
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Sesi</DialogTitle>
          <DialogDescription>
            Perbarui judul dan/atau waktu kedaluwarsa. Ubah minimal salah satu.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} noValidate className="grid gap-4">
          <Field data-invalid={titleError ? true : undefined}>
            <FieldLabel htmlFor="edit-session-title">Judul sesi</FieldLabel>
            <Input
              id="edit-session-title"
              disabled={mutation.isPending}
              aria-invalid={titleError ? true : undefined}
              {...form.register("title")}
            />
            {titleError && <FieldError errors={[titleError]} />}
          </Field>
          <Field data-invalid={expiresError ? true : undefined}>
            <FieldLabel htmlFor="edit-session-expiry">Kedaluwarsa</FieldLabel>
            <Input
              id="edit-session-expiry"
              type="datetime-local"
              disabled={mutation.isPending}
              aria-invalid={expiresError ? true : undefined}
              {...form.register("expiresAt")}
            />
            {expiresError && <FieldError errors={[expiresError]} />}
          </Field>
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
