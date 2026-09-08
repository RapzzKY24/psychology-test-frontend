"use client";

import Link from "next/link";
import { Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useInstansiSignUpForm } from "../hooks/use-instansi-sign-up-form";

type TextFieldName =
  | "companyName"
  | "picName"
  | "email"
  | "phone"
  | "password"
  | "confirmPassword";

const FIELD_PAIRS: { name: TextFieldName; label: string; placeholder: string; type: string; autoComplete: string }[][] = [
  [
    { name: "companyName", label: "Nama perusahaan", placeholder: "PT Maju Jaya", type: "text", autoComplete: "organization" },
    { name: "picName", label: "Nama PIC", placeholder: "Nama penanggung jawab", type: "text", autoComplete: "name" },
  ],
  [
    { name: "email", label: "Email (akun)", placeholder: "hr@perusahaan.com", type: "email", autoComplete: "email" },
    { name: "phone", label: "Kontak PIC (HP)", placeholder: "08xxxxxxxxxx", type: "tel", autoComplete: "tel" },
  ],
  [
    { name: "password", label: "Kata sandi", placeholder: "Min. 8 karakter", type: "password", autoComplete: "new-password" },
    { name: "confirmPassword", label: "Konfirmasi kata sandi", placeholder: "Ulangi kata sandi", type: "password", autoComplete: "new-password" },
  ],
];

export function InstansiSignUpForm() {
  const { form, submit, formError, duplicateEmail, isSubmitting } =
    useInstansiSignUpForm();

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
      {duplicateEmail && (
        <div className="rounded-md border p-3 text-sm">
          Sudah punya akun?{" "}
          <Link href="/masuk" className="font-medium underline">
            Masuk di sini
          </Link>
        </div>
      )}
      {FIELD_PAIRS.map((pair, i) => (
        <div key={i} className="grid gap-4 md:grid-cols-2">
          {pair.map((f) => (
            <Controller
              key={f.name}
              name={f.name}
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={f.name}>{f.label}</FieldLabel>
                  <Input
                    {...field}
                    id={f.name}
                    type={f.type}
                    autoComplete={f.autoComplete}
                    placeholder={f.placeholder || undefined}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          ))}
        </div>
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
              placeholder="Jalan, kota"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Memproses..." : "Daftarkan Instansi"}
      </Button>
    </form>
  );
}
