"use client";

import { Controller } from "react-hook-form";
import type { UseFormReturn } from "react-hook-form";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TEST_CATEGORIES } from "@/lib/api/types";
import type { CreateTestInput } from "../schemas";
import { SCORER_OPTIONS, scorerOption } from "../scorers";

const CATEGORY_LABEL: Record<(typeof TEST_CATEGORIES)[number], string> = {
  PERSONALITY: "Kepribadian",
  COGNITIVE: "Kognitif",
  WORK_STYLE: "Gaya Kerja",
  INTEREST: "Minat",
  PROJECTIVE: "Projektif",
};

interface CreateTestFieldsProps {
  form: UseFormReturn<CreateTestInput>;
  onSlugTyped: () => void;
  /** Stops the category from overwriting a scorer type the admin picked. */
  onScorerTyped: () => void;
}

/** Fields of the "Buat Tes" dialog — validation comes from the parent form. */
export function CreateTestFields({ form, onSlugTyped, onScorerTyped }: CreateTestFieldsProps) {
  return (
    <>
      <Controller
        name="name"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="name">Nama tes</FieldLabel>
            <Input {...field} id="name" placeholder="DISC Form A" aria-invalid={fieldState.invalid} />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="slug"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="slug">Slug</FieldLabel>
            <Input
              {...field}
              id="slug"
              placeholder="disc-form-a"
              aria-invalid={fieldState.invalid}
              onChange={(e) => {
                onSlugTyped();
                field.onChange(e.target.value.toLowerCase());
              }}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="description"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="description">Deskripsi</FieldLabel>
            <Textarea
              {...field}
              id="description"
              rows={3}
              placeholder="Deskripsi tes untuk katalog."
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="category"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="category">Kategori</FieldLabel>
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="category" aria-invalid={fieldState.invalid}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TEST_CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {CATEGORY_LABEL[c]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="scorerType"
        control={form.control}
        render={({ field, fieldState }) => {
          const selected = scorerOption(field.value);
          return (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="scorerType">Tipe soal</FieldLabel>
              <Select
                value={field.value}
                onValueChange={(value) => {
                  onScorerTyped();
                  field.onChange(value);
                }}
              >
                <SelectTrigger id="scorerType" aria-invalid={fieldState.invalid}>
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
              <FieldDescription>{selected.description}</FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          );
        }}
      />

      <div className="grid grid-cols-2 gap-4">
        <Controller
          name="price"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="price">Harga (Rp)</FieldLabel>
              <Input
                {...field}
                id="price"
                type="number"
                min={0}
                onChange={(e) => field.onChange(Number(e.target.value))}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="estimatedDurationMin"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="duration">Durasi (menit)</FieldLabel>
              <Input
                {...field}
                id="duration"
                type="number"
                min={1}
                onChange={(e) => field.onChange(Number(e.target.value))}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>
    </>
  );
}
