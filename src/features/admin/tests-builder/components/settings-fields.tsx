"use client";

import { Controller, type Control } from "react-hook-form";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { TestSettingsInput } from "../schemas";

/** Identity fields of the settings form: name, slug, description. */
export function SettingsFields({
  control,
  locked,
}: {
  control: Control<TestSettingsInput>;
  locked: boolean;
}) {
  return (
    <>
      <Controller
        name="name"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="settings-name">Nama tes</FieldLabel>
            <Input
              {...field}
              id="settings-name"
              disabled={locked}
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="slug"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="settings-slug">Slug</FieldLabel>
            <Input
              {...field}
              id="settings-slug"
              disabled={locked}
              onChange={(e) => field.onChange(e.target.value.toLowerCase())}
              aria-invalid={fieldState.invalid}
            />
            <FieldDescription>Dipakai di URL katalog publik.</FieldDescription>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="description"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="settings-description">Deskripsi</FieldLabel>
            <Textarea
              {...field}
              id="settings-description"
              rows={3}
              disabled={locked}
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </>
  );
}
