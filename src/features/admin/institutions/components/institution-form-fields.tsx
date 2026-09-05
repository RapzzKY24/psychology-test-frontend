"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

/** The five institution fields — split from the dialog shell (atomic rule). */
export function InstitutionFormFields({ disabled }: { disabled: boolean }) {
  const { control } = useFormContext();

  return (
    <>
      <Controller
        name="name"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="inst-name">Nama institusi</FieldLabel>
            <Input
              {...field}
              id="inst-name"
              placeholder="PT Maju Jaya"
              disabled={disabled}
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="contactName"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="inst-contact">Nama kontak</FieldLabel>
            <Input
              {...field}
              id="inst-contact"
              placeholder="Budi HRD"
              disabled={disabled}
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="contactEmail"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="inst-email">Email kontak</FieldLabel>
            <Input
              {...field}
              id="inst-email"
              type="email"
              placeholder="hr@ptmajujaya.co.id"
              disabled={disabled}
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="phone"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="inst-phone">Telepon (opsional)</FieldLabel>
            <Input
              {...field}
              id="inst-phone"
              placeholder="0812…"
              disabled={disabled}
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="notes"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="inst-notes">Catatan (opsional)</FieldLabel>
            <Textarea
              {...field}
              id="inst-notes"
              rows={3}
              disabled={disabled}
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </>
  );
}
