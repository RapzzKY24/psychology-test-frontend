"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Institution } from "@/lib/api/types";

interface InvoiceFormFieldsProps {
  institutions: Institution[];
  disabled: boolean;
}

/** The four create-invoice fields — split from the dialog shell (atomic rule). */
export function InvoiceFormFields({ institutions, disabled }: InvoiceFormFieldsProps) {
  const { control } = useFormContext();

  return (
    <>
      <Controller
        name="institutionId"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="invoice-institution">Institusi</FieldLabel>
            <Select value={field.value} onValueChange={field.onChange} disabled={disabled}>
              <SelectTrigger id="invoice-institution" aria-invalid={fieldState.invalid}>
                <SelectValue placeholder="Pilih institusi" />
              </SelectTrigger>
              <SelectContent>
                {institutions.map((institution) => (
                  <SelectItem key={institution.id} value={institution.id}>
                    {institution.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="amount"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="invoice-amount">Nominal (Rp)</FieldLabel>
            <Input
              {...field}
              id="invoice-amount"
              type="number"
              min={1}
              disabled={disabled}
              onChange={(e) => field.onChange(Number(e.target.value))}
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="dueDate"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="invoice-due">Jatuh tempo (opsional)</FieldLabel>
            <Input
              {...field}
              id="invoice-due"
              type="date"
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
            <FieldLabel htmlFor="invoice-notes">Catatan (opsional)</FieldLabel>
            <Textarea
              {...field}
              id="invoice-notes"
              rows={2}
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
