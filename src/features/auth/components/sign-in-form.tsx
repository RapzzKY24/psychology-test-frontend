"use client";

import { Button } from "@/components/ui/button";
import { useSignInForm } from "../hooks/use-sign-in-form";
import type { SignInInput } from "../schemas";
import { AuthTextField, FormAlert } from "./form-section";
import type { AuthTextSpec } from "./form-section";

const FIELDS: AuthTextSpec<SignInInput>[] = [
  { name: "email", label: "Email", placeholder: "nama@email.com", type: "email", autoComplete: "email" },
  { name: "password", label: "Kata sandi", type: "password", autoComplete: "current-password" },
];

export function SignInForm({ next }: { next?: string | null }) {
  const { form, submit, formError, isSubmitting } = useSignInForm(next);

  return (
    <form onSubmit={submit} noValidate className="grid gap-4">
      {formError && <FormAlert message={formError} />}
      <div className="grid gap-4">
        {FIELDS.map((f) => (
          <AuthTextField key={f.name} spec={f} control={form.control} />
        ))}
      </div>
      <Button type="submit" disabled={isSubmitting} className="h-11 w-full">
        {isSubmitting ? "Memproses..." : "Masuk"}
      </Button>
    </form>
  );
}
