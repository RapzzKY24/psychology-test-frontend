"use client";

import { Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useSignInForm } from "../hooks/use-sign-in-form";

export function SignInForm({ next }: { next?: string | null }) {
  const { form, submit, formError, isSubmitting } = useSignInForm(next);

  return (
    <form onSubmit={submit} noValidate className="grid gap-4">
      {formError && (
        <div
          role="alert"
          className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive"
        >
          {formError}
        </div>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                {...field}
                id="email"
                type="email"
                autoComplete="email"
                placeholder="nama@email.com"
                aria-invalid={fieldState.invalid}
                className="h-11"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="password">Kata sandi</FieldLabel>
              <Input
                {...field}
                id="password"
                type="password"
                autoComplete="current-password"
                aria-invalid={fieldState.invalid}
                className="h-11"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>
      <Button type="submit" disabled={isSubmitting} className="h-11 w-full md:w-auto md:justify-self-end md:px-8">
        {isSubmitting ? "Memproses..." : "Masuk"}
      </Button>
    </form>
  );
}
