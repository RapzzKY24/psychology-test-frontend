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
      {error && <FieldError>{error.message}</FieldError>}
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
  const { register, formState } = useFormContext<CreateInstansiSessionInput>();
  const titleError = formState.errors.title;

  return (
    <div className="grid gap-4">
      <Field data-invalid={Boolean(titleError)}>
        <FieldLabel htmlFor="session-title">Judul sesi</FieldLabel>
        <Input
          {...register("title")}
          id="session-title"
          placeholder="cth. Rekrutmen Batch September"
          disabled={disabled}
          className="h-11"
        />
        {titleError && <FieldError>{titleError.message}</FieldError>}
      </Field>
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
  const { register, formState } = useFormContext<CreateInstansiSessionInput>();
  const slotError = formState.errors.slotLimit;
  const expiresError = formState.errors.expiresAt;

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
        <Field data-invalid={Boolean(slotError)}>
          <FieldLabel htmlFor="session-slot">Slot</FieldLabel>
          <Input
            {...register("slotLimit", { valueAsNumber: true })}
            id="session-slot"
            type="number"
            min={1}
            max={1000}
            disabled={disabled}
            className="h-11"
          />
          {slotError && <FieldError>{slotError.message}</FieldError>}
        </Field>
        <Field data-invalid={Boolean(expiresError)}>
          <FieldLabel htmlFor="session-expires">Kedaluwarsa</FieldLabel>
          <Input
            {...register("expiresAt")}
            id="session-expires"
            type="datetime-local"
            disabled={disabled}
            className="h-11"
          />
          {expiresError && <FieldError>{expiresError.message}</FieldError>}
        </Field>
      </div>
      <Field>
        <FieldLabel htmlFor="session-pin">PIN (opsional)</FieldLabel>
        <Input
          {...register("pin")}
          id="session-pin"
          placeholder="4–8 karakter"
          disabled={disabled}
          className="h-11"
        />
      </Field>
    </div>
  );
}
