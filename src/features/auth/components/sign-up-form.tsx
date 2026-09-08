"use client";

import { KeyRound, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSignUpForm } from "../hooks/use-sign-up-form";
import type { SignUpInput } from "../schemas";
import { AuthSection, AuthTextField } from "./form-section";
import type { AuthTextSpec } from "./form-section";

const SECTIONS: {
  icon: typeof UserRound;
  title: string;
  hint: string;
  fields: AuthTextSpec<SignUpInput>[];
}[] = [
  {
    icon: UserRound,
    title: "Data diri",
    hint: "Nama dan email aktif Anda.",
    fields: [
      { name: "name", label: "Nama lengkap", placeholder: "Nama Anda", autoComplete: "name" },
      { name: "email", label: "Email", placeholder: "nama@email.com", type: "email", autoComplete: "email" },
    ],
  },
  {
    icon: KeyRound,
    title: "Keamanan akun",
    hint: "Minimal 8 karakter.",
    fields: [
      { name: "password", label: "Kata sandi", type: "password", autoComplete: "new-password" },
      { name: "confirmPassword", label: "Konfirmasi kata sandi", type: "password", autoComplete: "new-password" },
    ],
  },
];

export function SignUpForm({ next }: { next?: string | null }) {
  const { form, submit, formError, isSubmitting } = useSignUpForm(next);

  return (
    <form onSubmit={submit} noValidate className="grid gap-6">
      {formError && (
        <div
          role="alert"
          className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive"
        >
          {formError}
        </div>
      )}
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
      <Button type="submit" disabled={isSubmitting} className="h-11 w-full">
        {isSubmitting ? "Memproses..." : "Daftar"}
      </Button>
    </form>
  );
}
