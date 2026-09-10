"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { CreateInstansiSessionInput } from "../schemas";

interface Option {
  id: string;
  name: string;
}

function MultiPicker({
  fieldName,
  options,
  emptyText,
  disabled,
}: {
  fieldName: "testIds" | "employeeIds";
  options: Option[];
  emptyText: string;
  disabled: boolean;
}) {
  const { watch, setValue, formState } = useFormContext<CreateInstansiSessionInput>();
  const selected = watch(fieldName) ?? [];
  const error = formState.errors[fieldName];

  const toggle = (id: string, checked: boolean) => {
    const next = checked ? [...selected, id] : selected.filter((v) => v !== id);
    setValue(fieldName, next, { shouldDirty: true, shouldValidate: true });
  };

  return (
    <Field data-invalid={Boolean(error)}>
      {options.length === 0 ? (
        <p className="rounded-md border border-dashed p-3 text-sm text-muted-foreground">
          {emptyText}
        </p>
      ) : (
        <FieldGroup className="max-h-44 overflow-y-auto rounded-lg border p-2">
          {options.map((opt) => (
            <label
              key={opt.id}
              className="flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm hover:bg-muted"
            >
              <Checkbox
                checked={selected.includes(opt.id)}
                disabled={disabled}
                onCheckedChange={(checked) => toggle(opt.id, checked === true)}
                aria-label={opt.name}
              />
              {opt.name}
            </label>
          ))}
        </FieldGroup>
      )}
      {error && <FieldError errors={[{ message: error.message }]} />}
    </Field>
  );
}

export function InstansiSessionStepOne({
  tests,
  disabled,
}: {
  tests: Option[];
  disabled: boolean;
}) {
  const { control } = useFormContext<CreateInstansiSessionInput>();

  return (
    <div className="grid gap-4">
      <Controller
        name="title"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="session-title">Judul sesi</FieldLabel>
            <Input
              {...field}
              id="session-title"
              placeholder="cth. Rekrutmen Batch September"
              disabled={disabled}
              aria-invalid={fieldState.invalid}
              className="h-11"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <FieldLabel>Tes yang dikerjakan</FieldLabel>
      <MultiPicker
        fieldName="testIds"
        options={tests}
        emptyText="Belum ada tes PUBLISHED."
        disabled={disabled}
      />
    </div>
  );
}

export function InstansiSessionStepTwo({
  employees,
  disabled,
}: {
  employees: Option[];
  disabled: boolean;
}) {
  const { control } = useFormContext<CreateInstansiSessionInput>();

  return (
    <div className="grid gap-4">
      <FieldLabel>Peserta (dari data pegawai)</FieldLabel>
      <MultiPicker
        fieldName="employeeIds"
        options={employees}
        emptyText="Belum ada pegawai — tambah dulu di halaman Pegawai."
        disabled={disabled}
      />
      <div className="grid gap-4 md:grid-cols-2">
        <Controller
          name="slotLimit"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="session-slot">Slot</FieldLabel>
              <Input
                {...field}
                value={field.value ?? ""}
                onChange={(e) =>
                  field.onChange(e.target.value === "" ? "" : Number(e.target.value))
                }
                id="session-slot"
                type="number"
                min={1}
                max={1000}
                disabled={disabled}
                aria-invalid={fieldState.invalid}
                className="h-11"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="expiresAt"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="session-expires">Kedaluwarsa</FieldLabel>
              <Input
                {...field}
                id="session-expires"
                type="datetime-local"
                disabled={disabled}
                aria-invalid={fieldState.invalid}
                className="h-11"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>
      <Controller
        name="pin"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="session-pin">PIN (opsional, 4–8 karakter)</FieldLabel>
            <Input
              {...field}
              value={field.value ?? ""}
              id="session-pin"
              placeholder="Kosongkan bila tanpa PIN"
              disabled={disabled}
              aria-invalid={fieldState.invalid}
              className="h-11"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </div>
  );
}
