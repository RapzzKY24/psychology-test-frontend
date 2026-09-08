"use client";

import Link from "next/link";
import { Building2, KeyRound, UserRound } from "lucide-react";
import { Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { useInstansiSignUpForm } from "../hooks/use-instansi-sign-up-form";
import type { InstansiSignUpInput } from "../schemas";
import { AuthSection, AuthTextField } from "./form-section";
import type { AuthTextSpec } from "./form-section";

const SECTIONS: {
  icon: typeof Building2;
  title: string;
  hint: string;
  fields: AuthTextSpec<InstansiSignUpInput>[];
}[] = [
  {
    icon: Building2,
    title: "Data perusahaan",
    hint: "Identitas resmi instansi Anda.",
    fields: [
      { name: "companyName", label: "Nama perusahaan", placeholder: "PT Maju Jaya", autoComplete: "organization" },
      { name: "picName", label: "Nama PIC", placeholder: "Nama penanggung jawab", autoComplete: "name" },
    ],
  },
  {
    icon: UserRound,
    title: "Kontak",
    hint: "Email dipakai untuk masuk; HP untuk verifikasi.",
    fields: [
      { name: "email", label: "Email (akun)", placeholder: "hr@perusahaan.com", type: "email", autoComplete: "email" },
      { name: "phone", label: "Kontak PIC (HP)", placeholder: "08xxxxxxxxxx", type: "tel", autoComplete: "tel" },
    ],
  },
  {
    icon: KeyRound,
    title: "Keamanan akun",
    hint: "Minimal 8 karakter. Jangan bagikan ke siapa pun.",
    fields: [
      { name: "password", label: "Kata sandi", placeholder: "Min. 8 karakter", type: "password", autoComplete: "new-password" },
      { name: "confirmPassword", label: "Konfirmasi kata sandi", placeholder: "Ulangi kata sandi", type: "password", autoComplete: "new-password" },
    ],
  },
];

export function InstansiSignUpForm() {
  const { form, submit, formError, duplicateEmail, isSubmitting } =
    useInstansiSignUpForm();

  return (
    <form onSubmit={submit} noValidate className="grid gap-7">
      {formError && (
        <div
          role="alert"
          className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive"
        >
          {formError}
        </div>
      )}
      {duplicateEmail && (
        <div className="rounded-md border p-3 text-sm">
          Sudah punya akun?{" "}
          <Link href="/masuk" className="font-medium underline">
            Masuk di sini
          </Link>
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
      <Controller
        name="address"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="address">Alamat PT</FieldLabel>
            <Textarea
              {...field}
              id="address"
              rows={3}
              placeholder="Jalan, kota, kode pos"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Button type="submit" disabled={isSubmitting} className="h-11 w-full md:w-auto md:justify-self-end md:px-8">
        {isSubmitting ? "Memproses..." : "Daftarkan Instansi"}
      </Button>
    </form>
  );
}
