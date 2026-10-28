"use client";

import { Controller } from "react-hook-form";
import type { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { JoinFormInput } from "../schemas";

interface JoinFormProps {
  form: UseFormReturn<JoinFormInput>;
  requiresPin: boolean;
  isPending: boolean;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
}

/** Name/email/candidate number (+ PIN when the session needs one). */
export function JoinForm({ form, requiresPin, isPending, onSubmit }: JoinFormProps) {
  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4">
      <Controller
        name="name"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="join-name">Nama lengkap</FieldLabel>
            <Input
              {...field}
              id="join-name"
              placeholder="Nama Anda"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="email"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="join-email">Email (opsional)</FieldLabel>
            <Input
              {...field}
              id="join-email"
              type="email"
              placeholder="nama@email.com"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="candidateNumber"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="join-number">Nomor peserta (opsional)</FieldLabel>
            <Input
              {...field}
              id="join-number"
              placeholder="Contoh: 07"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      {requiresPin && (
        <Controller
          name="pin"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="join-pin">PIN sesi</FieldLabel>
              <Input
                {...field}
                id="join-pin"
                inputMode="numeric"
                placeholder="4–8 angka"
                aria-invalid={fieldState.invalid}
              />
              <FieldDescription>Minta PIN ke penyelenggara sesi.</FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      )}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Memproses..." : "Gabung Sesi"}
      </Button>
    </form>
  );
}
