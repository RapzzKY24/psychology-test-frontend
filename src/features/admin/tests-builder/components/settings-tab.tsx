"use client";

import { Controller } from "react-hook-form";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
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
import type { BuilderController } from "../hooks/use-builder-form";

const CATEGORY_LABEL: Record<(typeof TEST_CATEGORIES)[number], string> = {
  PERSONALITY: "Kepribadian",
  COGNITIVE: "Kognitif",
  WORK_STYLE: "Gaya Kerja",
  INTEREST: "Minat",
  PROJECTIVE: "Projektif",
};

export function SettingsTab({ builder, locked }: { builder: BuilderController; locked: boolean }) {
  const { control } = builder.form;

  return (
    <div className="mx-auto w-full max-w-2xl space-y-5 p-6">
      <Controller
        name="settings.name"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="settings-name">Nama tes</FieldLabel>
            <Input {...field} id="settings-name" disabled={locked} aria-invalid={fieldState.invalid} />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="settings.slug"
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
            <FieldDescription>Dipakai di URL katalog publik. Hanya a-z, 0-9, tanda hubung.</FieldDescription>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="settings.description"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="settings-description">Deskripsi</FieldLabel>
            <Textarea
              {...field}
              id="settings-description"
              rows={4}
              disabled={locked}
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <div className="grid gap-5 sm:grid-cols-3">
        <Controller
          name="settings.category"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="settings-category">Kategori</FieldLabel>
              <Select value={field.value} onValueChange={field.onChange} disabled={locked}>
                <SelectTrigger id="settings-category" aria-invalid={fieldState.invalid}>
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
          name="settings.price"
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
          name="settings.estimatedDurationMin"
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
      {locked && (
        <p className="rounded-md border bg-muted/50 p-3 text-sm text-muted-foreground">
          Mode baca — tes sedang dikunci karena ada peserta yang mengerjakan.
        </p>
      )}
    </div>
  );
}
