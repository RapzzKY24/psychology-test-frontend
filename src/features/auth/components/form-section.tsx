"use client";

import type { LucideIcon } from "lucide-react";
import { Controller } from "react-hook-form";
import type { Control, FieldValues, Path } from "react-hook-form";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export interface AuthTextSpec<T extends FieldValues> {
  name: Path<T>;
  label: string;
  placeholder?: string;
  type?: string;
  autoComplete?: string;
  /** Helper copy under the input, e.g. why the full name matters. */
  hint?: string;
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
          {spec.hint ? <FieldDescription>{spec.hint}</FieldDescription> : null}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}

export interface AuthSectionSpec<T extends FieldValues> {
  icon: LucideIcon;
  title: string;
  hint: string;
  fields: AuthTextSpec<T>[];
}

export function FormAlert({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive"
    >
      {message}
    </div>
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
      <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(13rem,1fr))]">
        {children}
      </div>
    </section>
  );
}
