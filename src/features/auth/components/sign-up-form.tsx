"use client";

import { KeyRound, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AUTH_COPY } from "../copy";
import { useSignUpForm } from "../hooks/use-sign-up-form";
import type { SignUpInput } from "../schemas";
import { AuthSection, AuthTextField, FormAlert } from "./form-section";
import type { AuthSectionSpec } from "./form-section";

const SECTIONS: AuthSectionSpec<SignUpInput>[] = [
  {
    icon: UserRound,
    title: "Data diri",
    hint: AUTH_COPY.pribadi.sections.identity,
    fields: [
      {
        name: "name",
        label: AUTH_COPY.fields.name.label,
        placeholder: AUTH_COPY.fields.name.placeholder,
        autoComplete: "name",
        hint: AUTH_COPY.fields.name.hint,
      },
      {
        name: "email",
        label: AUTH_COPY.fields.email.label,
        placeholder: AUTH_COPY.fields.email.placeholder,
        type: "email",
        autoComplete: "email",
        hint: AUTH_COPY.fields.email.hint,
      },
    ],
  },
  {
    icon: KeyRound,
    title: "Keamanan akun",
    hint: AUTH_COPY.pribadi.sections.security,
    fields: [
      {
        name: "password",
        label: AUTH_COPY.fields.password.label,
        type: "password",
        autoComplete: "new-password",
        hint: AUTH_COPY.fields.password.hint,
      },
      {
        name: "confirmPassword",
        label: AUTH_COPY.fields.confirmPassword.label,
        type: "password",
        autoComplete: "new-password",
        hint: AUTH_COPY.fields.confirmPassword.hint,
      },
    ],
  },
];

export function SignUpForm({ next }: { next?: string | null }) {
  const { form, submit, formError, isSubmitting } = useSignUpForm(next);

  return (
    <form onSubmit={submit} noValidate className="grid gap-6">
      {formError && <FormAlert message={formError} />}
      {SECTIONS.map((section) => (
        <AuthSection
          key={section.title}
          icon={section.icon}
          title={section.title}
          hint={section.hint}
        >
          {section.fields.map((f) => (
            <AuthTextField key={f.name} spec={f} control={form.control} />
          ))}
        </AuthSection>
      ))}
      <div className="grid gap-3">
        <Button type="submit" disabled={isSubmitting} className="h-11 w-full">
          {isSubmitting ? AUTH_COPY.common.processing : AUTH_COPY.daftar.submit}
        </Button>
        <p className="text-muted-foreground text-center text-xs">{AUTH_COPY.daftar.privacy}</p>
      </div>
    </form>
  );
}
