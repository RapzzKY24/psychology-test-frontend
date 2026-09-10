"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ID_TYPES } from "@/lib/api/types";
import type { EmployeeInput } from "../schemas";

export function EmployeeFormFields() {
  const { control } = useFormContext<EmployeeInput>();

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="employee-name">Nama pegawai</FieldLabel>
              <Input
                {...field}
                id="employee-name"
                placeholder="Nama lengkap (min. 2 kata)"
                aria-invalid={fieldState.invalid}
                className="h-11"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="destinationCountry"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="employee-country">Negara tujuan</FieldLabel>
              <Input
                {...field}
                id="employee-country"
                placeholder="cth. Jepang"
                aria-invalid={fieldState.invalid}
                className="h-11"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Controller
          name="idType"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="employee-idtype">Jenis identitas</FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="employee-idtype" aria-invalid={fieldState.invalid} className="h-11 w-full">
                  <SelectValue placeholder="Pilih jenis" />
                </SelectTrigger>
                <SelectContent>
                  {ID_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t === "NIK" ? "NIK (KTP)" : "Paspor"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="idNumber"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="employee-idnumber">Nomor identitas</FieldLabel>
              <Input
                {...field}
                id="employee-idnumber"
                placeholder="NIK / nomor paspor"
                aria-invalid={fieldState.invalid}
                className="h-11"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Controller
          name="birthDate"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="employee-birthdate">Tanggal lahir (opsional)</FieldLabel>
              <Input
                {...field}
                value={field.value ?? ""}
                id="employee-birthdate"
                type="date"
                aria-invalid={fieldState.invalid}
                className="h-11"
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
              <FieldLabel htmlFor="employee-phone">HP (opsional)</FieldLabel>
              <Input
                {...field}
                value={field.value ?? ""}
                id="employee-phone"
                type="tel"
                autoComplete="tel"
                placeholder="08xxxxxxxxxx"
                aria-invalid={fieldState.invalid}
                className="h-11"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>
      <Controller
        name="notes"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="employee-notes">Catatan (opsional)</FieldLabel>
            <Textarea
              {...field}
              value={field.value ?? ""}
              id="employee-notes"
              rows={2}
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </div>
  );
}
