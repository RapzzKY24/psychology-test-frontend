"use client";

import { Controller, type Control } from "react-hook-form";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TestCategory } from "@/lib/api/types";
import type { TestSettingsInput } from "../schemas";
import { SCORER_OPTIONS, scorerOption } from "../scorers";

const CATEGORY_LABEL: Record<TestCategory, string> = {
  PERSONALITY: "Kepribadian",
  COGNITIVE: "Kognitif",
  WORK_STYLE: "Gaya Kerja",
  INTEREST: "Minat",
  PROJECTIVE: "Projektif",
};

/** Scorer type, category, price and duration — the catalog metadata row. */
export function SettingsMetaFields({
  control,
  locked,
  scorerEditable,
}: {
  control: Control<TestSettingsInput>;
  locked: boolean;
  /** False once the test has items or is published — the backend refuses then. */
  scorerEditable: boolean;
}) {
  return (
    <div className="space-y-4">
      <Controller
        name="scorerType"
        control={control}
        render={({ field, fieldState }) => {
          const selected = scorerOption(field.value);
          return (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="settings-scorer">Tipe soal</FieldLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={locked || !scorerEditable}
              >
                <SelectTrigger id="settings-scorer" aria-invalid={fieldState.invalid}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SCORER_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldDescription>
                {scorerEditable
                  ? selected.description
                  : "Terkunci — tes sudah punya soal atau sudah dipublish."}
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          );
        }}
      />

      <div className="grid grid-cols-3 gap-4">
        <Controller
          name="category"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="settings-category">Kategori</FieldLabel>
              <Select value={field.value} onValueChange={field.onChange} disabled={locked}>
                <SelectTrigger id="settings-category" aria-invalid={fieldState.invalid}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CATEGORY_LABEL).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="price"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="settings-price">Harga (Rp)</FieldLabel>
              <Input
                {...field}
                id="settings-price"
                type="number"
                min={0}
                disabled={locked}
                onChange={(e) => field.onChange(Number(e.target.value))}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="estimatedDurationMin"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="settings-duration">Durasi (menit)</FieldLabel>
              <Input
                {...field}
                id="settings-duration"
                type="number"
                min={1}
                disabled={locked}
                onChange={(e) => field.onChange(Number(e.target.value))}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>
    </div>
  );
}
