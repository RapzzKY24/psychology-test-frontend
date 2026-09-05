"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Institution } from "@/lib/api/types";
import type { CreateSessionInput } from "../schemas";
import { SessionTestsField } from "./session-tests-field";

interface CreateSessionFieldsProps {
  tests: Array<{ id: string; name: string }>;
  institutions: Institution[];
  disabled: boolean;
}

/** The create-session form fields — split from the dialog shell (atomic rule). */
export function CreateSessionFields({
  tests,
  institutions,
  disabled,
}: CreateSessionFieldsProps) {
  const { control, formState } = useFormContext<CreateSessionInput>();

  return (
    <>
      <Controller
        name="title"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="session-title">Judul sesi</FieldLabel>
            <Input
              {...field}
              id="session-title"
              placeholder="Rekrutmen Batch Sep"
              disabled={disabled}
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="institutionId"
        control={control}
        render={({ field }) => (
          <Field>
            <FieldLabel htmlFor="session-institution">Institusi (opsional)</FieldLabel>
            <Select
              value={field.value || "NONE"}
              onValueChange={(v) => field.onChange(v === "NONE" ? "" : v)}
              disabled={disabled}
            >
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
      <SessionTestsField tests={tests} disabled={disabled} />
      <div className="grid grid-cols-2 gap-4">
        <Controller
          name="slotLimit"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="session-slots">Slot peserta</FieldLabel>
              <Input
                {...field}
                id="session-slots"
                type="number"
                min={1}
                max={1000}
                disabled={disabled}
                onChange={(e) => field.onChange(Number(e.target.value))}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="pin"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="session-pin">PIN (opsional)</FieldLabel>
              <Input
                {...field}
                id="session-pin"
                inputMode="numeric"
                placeholder="4–8 angka"
                disabled={disabled}
                aria-invalid={fieldState.invalid}
              />
              <FieldDescription>Ditanyakan saat peserta join.</FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>
      <Controller
        name="expiresAt"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="session-expiry">Kedaluwarsa</FieldLabel>
            <Input
              {...field}
              id="session-expiry"
              type="datetime-local"
              disabled={disabled}
              aria-invalid={fieldState.invalid}
            />
            <FieldDescription>Setelah waktu ini peserta baru tidak bisa join.</FieldDescription>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      {formState.isSubmitted && formState.errors.root && (
        <p role="alert" className="text-sm text-destructive">
          {formState.errors.root.message}
        </p>
      )}
    </>
  );
}
