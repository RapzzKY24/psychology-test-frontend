"use client";

import { Button } from "@/components/ui/button";
import { AUTH_COPY } from "../copy";
import { useSignInForm } from "../hooks/use-sign-in-form";
import type { SignInInput } from "../schemas";
import { AuthTextField, FormAlert } from "./form-section";
import type { AuthTextSpec } from "./form-section";

const FIELDS: AuthTextSpec<SignInInput>[] = [
  {
    name: "email",
    label: AUTH_COPY.fields.email.label,
    placeholder: AUTH_COPY.fields.email.placeholder,
    type: "email",
    autoComplete: "email",
    hint: AUTH_COPY.fields.email.hint,
  },
  {
    name: "password",
    label: AUTH_COPY.fields.password.label,
    type: "password",
    autoComplete: "current-password",
  },
];

export function SignInForm({
  next,
  instansi = false,
}: {
  next?: string | null;
  /** Tailors the hint for an institution PIC; the auth flow is the same. */
  instansi?: boolean;
}) {
  const { form, submit, formError, isSubmitting } = useSignInForm(next);

  return (
    <form onSubmit={submit} noValidate className="grid gap-4">
      {instansi ? (
        <p className="bg-muted/40 text-muted-foreground rounded-lg border px-3 py-2 text-xs">
          {AUTH_COPY.masuk.instansiNote}
        </p>
      ) : null}
      {formError && <FormAlert message={formError} />}
      <div className="grid gap-4">
        {FIELDS.map((f) => (
          <AuthTextField key={f.name} spec={f} control={form.control} />
        ))}
      </div>
      <Button type="submit" disabled={isSubmitting} className="h-11 w-full">
        {isSubmitting ? AUTH_COPY.common.processing : AUTH_COPY.masuk.submit}
      </Button>
      <p className="text-muted-foreground text-center text-xs">{AUTH_COPY.masuk.forgot}</p>
    </form>
  );
}
