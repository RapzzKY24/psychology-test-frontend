"use client";

import type { LucideIcon } from "lucide-react";
import { Controller } from "react-hook-form";
import type { Control, FieldValues, Path } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export interface AuthTextSpec<T extends FieldValues> {
  name: Path<T>;
  label: string;
  placeholder?: string;
  type?: string;
  autoComplete?: string;
}

export function AuthTextField<T extends FieldValues>({
  spec,
  control,
}: {
  spec: AuthTextSpec<T>;
  control: Control<T>;
}) {
  return (
    <Controller
      name={spec.name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={spec.name}>{spec.label}</FieldLabel>
          <Input
            {...field}
            id={spec.name}
            type={spec.type ?? "text"}
            autoComplete={spec.autoComplete}
            placeholder={spec.placeholder}
            aria-invalid={fieldState.invalid}
            className="h-11"
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}

export function AuthSection({
  icon: Icon,
  title,
  hint,
  children,
}: {
  icon: LucideIcon;
  title: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-label={title} className="grid gap-3">
      <div className="flex items-center gap-2">
        <Icon className="size-4 text-muted-foreground" aria-hidden />
        <h2 className="text-sm font-semibold">{title}</h2>
      </div>
      <p className="-mt-2 text-xs text-muted-foreground">{hint}</p>
      <div className="grid gap-4 md:grid-cols-2">{children}</div>
    </section>
  );
}
