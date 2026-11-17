"use client";

import Link from "next/link";
import { Building2, KeyRound, UserRound } from "lucide-react";
import { Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { useInstansiSignUpForm } from "../hooks/use-instansi-sign-up-form";
import { AUTH_COPY } from "../copy";
import type { InstansiSignUpInput } from "../schemas";
import { AuthSection, AuthTextField, FormAlert } from "./form-section";
import type { AuthSectionSpec } from "./form-section";

const SECTIONS: AuthSectionSpec<InstansiSignUpInput>[] = [
  {
    icon: Building2,
    title: "Data perusahaan",
    hint: AUTH_COPY.instansi.sections.company,
    fields: [
      {
        name: "companyName",
        label: "Nama perusahaan",
        placeholder: "PT Maju Jaya",
        autoComplete: "organization",
      },
      {
        name: "picName",
        label: "Nama PIC",
        placeholder: "Nama penanggung jawab",
        autoComplete: "name",
      },
    ],
  },
  {
    icon: UserRound,
    title: "Kontak",
    hint: AUTH_COPY.instansi.sections.contact,
    fields: [
      {
        name: "email",
        label: "Email (akun)",
        placeholder: "hr@perusahaan.com",
        type: "email",
        autoComplete: "email",
      },
      {
        name: "phone",
        label: "Kontak PIC (HP)",
        placeholder: "08xxxxxxxxxx",
        type: "tel",
        autoComplete: "tel",
      },
    ],
  },
  {
    icon: KeyRound,
    title: "Keamanan akun",
    hint: AUTH_COPY.instansi.sections.security,
    fields: [
      {
        name: "password",
        label: "Kata sandi",
        placeholder: "Min. 8 karakter",
        type: "password",
        autoComplete: "new-password",
      },
      {
        name: "confirmPassword",
        label: "Konfirmasi kata sandi",
        placeholder: "Ulangi kata sandi",
        type: "password",
        autoComplete: "new-password",
      },
    ],
  },
];

export function InstansiSignUpForm() {
  const { form, submit, formError, duplicateEmail, isSubmitting } = useInstansiSignUpForm();

  return (
    <form onSubmit={submit} noValidate className="grid gap-7">
      {formError && <FormAlert message={formError} />}
      {duplicateEmail && (
        <div className="rounded-md border p-3 text-sm">
          {AUTH_COPY.instansi.duplicate}{" "}
          <Link href="/masuk?langsung=1" className="font-medium underline">
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
      <div className="grid gap-3">
        <p className="bg-muted/40 text-muted-foreground rounded-lg border px-3 py-2 text-xs">
          {AUTH_COPY.instansi.note}
        </p>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-11 w-full md:w-auto md:justify-self-end md:px-8"
        >
          {isSubmitting ? AUTH_COPY.common.processing : AUTH_COPY.instansi.submit}
        </Button>
      </div>
    </form>
  );
}
