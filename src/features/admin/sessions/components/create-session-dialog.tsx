"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

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
import { Checkbox } from "@/components/ui/checkbox";
import { FieldGroup } from "@/components/ui/field";
import type { Institution, SessionSummary } from "@/lib/api/types";
import { useCreateSession } from "../hooks/use-session-mutations";
import { CreateSessionSchema } from "../schemas";
import type { CreateSessionInput } from "../schemas";

interface CreateSessionDialogProps {
  /** PUBLISHED tests for the multiselect (fetched server-side). */
  tests: Array<{ id: string; name: string }>;
  /** Institutions for the optional Select (fetched server-side, RSC props). */
  institutions: Institution[];
}

export function CreateSessionDialog({ tests, institutions }: CreateSessionDialogProps) {
  const [open, setOpen] = useState(false);
  const [created, setCreated] = useState<SessionSummary | null>(null);

  const form = useForm<CreateSessionInput>({
    resolver: zodResolver(CreateSessionSchema),
    defaultValues: {
      title: "",
      institutionId: "",
      testIds: [],
      slotLimit: 20,
      expiresAt: "",
      pin: "",
    },
  });

  const mutation = useCreateSession((createdSession) => {
    setCreated(createdSession);
  });

  const selected = form.watch("testIds");

  const toggleTest = (id: string, checked: boolean) => {
    const next = checked
      ? [...(form.getValues("testIds") ?? []), id]
      : (form.getValues("testIds") ?? []).filter((v) => v !== id);
    form.setValue("testIds", next, { shouldDirty: true });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) setCreated(null);
        if (!next) form.reset();
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" aria-hidden />
          Buat Sesi
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Buat Sesi</DialogTitle>
          <DialogDescription>
            Sesi group: bagikan tautan undangan, peserta masuk tanpa akun.
          </DialogDescription>
        </DialogHeader>

        {created ? (
          <div className="space-y-4">
            <p className="rounded-md border bg-muted/50 p-3 text-sm">
              Sesi <span className="font-medium">{created.title}</span> dibuat. Salin tautan
              undangan dan bagikan ke peserta — peserta masuk lewat{" "}
              <code>/join/{created.token.slice(0, 6)}…</code>
            </p>
            <Button
              className="w-full"
              onClick={() => {
                setOpen(false);
                form.reset();
              }}
            >
              Selesai
            </Button>
          </div>
        ) : (
          <form
            onSubmit={form.handleSubmit(
              (values) => mutation.mutateAsync(values),
              () => toast.error("Periksa kembali field yang bertanda merah."),
            )}
            noValidate
            className="grid gap-4"
          >
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="session-title">Judul sesi</FieldLabel>
                  <Input {...field} id="session-title" placeholder="Rekrutmen Batch Sep" aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="institutionId"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor="session-institution">Institusi (opsional)</FieldLabel>
                  <Select value={field.value || "NONE"} onValueChange={(v) => field.onChange(v === "NONE" ? "" : v)}>
                    <SelectTrigger id="session-institution">
                      <SelectValue placeholder="Tanpa institusi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NONE">Tanpa institusi</SelectItem>
                      {institutions.map((institution) => (
                        <SelectItem key={institution.id} value={institution.id}>
                          {institution.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />
            <Field>
              <FieldLabel>Tes yang dikerjakan (berurutan)</FieldLabel>
              {tests.length === 0 ? (
                <p className="rounded-md border border-dashed p-3 text-sm text-muted-foreground">
                  Belum ada tes PUBLISHED — publish tes dulu di Manajemen Tes.
                </p>
              ) : (
                <FieldGroup className="max-h-40 overflow-y-auto rounded-lg border p-2">
                  {tests.map((test) => (
                    <label key={test.id} className="flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm hover:bg-muted">
                      <Checkbox
                        checked={selected.includes(test.id)}
                        onCheckedChange={(checked) => toggleTest(test.id, checked === true)}
                        aria-label={test.name}
                      />
                      {test.name}
                    </label>
                  ))}
                </FieldGroup>
              )}
              {form.formState.errors.testIds && (
                <p className="text-sm text-destructive">{form.formState.errors.testIds.message}</p>
              )}
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="slotLimit"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="session-slots">Slot peserta</FieldLabel>
                    <Input
                      {...field}
                      id="session-slots"
                      type="number"
                      min={1}
                      max={1000}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="pin"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="session-pin">PIN (opsional)</FieldLabel>
                    <Input {...field} id="session-pin" inputMode="numeric" placeholder="4–8 angka" aria-invalid={fieldState.invalid} />
                    <FieldDescription>Ditanyakan saat peserta join.</FieldDescription>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>
            <Controller
              name="expiresAt"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="session-expiry">Kedaluwarsa</FieldLabel>
                  <Input {...field} id="session-expiry" type="datetime-local" aria-invalid={fieldState.invalid} />
                  <FieldDescription>Setelah waktu ini peserta baru tidak bisa join.</FieldDescription>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Menyimpan..." : "Buat Sesi"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
